import { createClient } from '@supabase/supabase-js';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// ---------------------------------------------------------------------------
// Per-Plan AI Rate Limits (requests per day)
// ---------------------------------------------------------------------------
const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  pro: 200,
  premium: Infinity,
};

/**
 * Creates a Supabase admin client using the service role key.
 * This bypasses RLS so the server can read/write usage_limits.
 */
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error('Missing Supabase admin credentials (SUPABASE_SERVICE_ROLE_KEY)');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}

// ---------------------------------------------------------------------------
// DB-backed per-user AI rate limiter
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: string;
}

/**
 * Check and increment a user's daily AI request count.
 * Automatically resets the counter if more than 24 hours have passed.
 *
 * @param userId  - Supabase auth user ID
 * @param plan    - User's plan: 'free' | 'pro' | 'premium'
 */
export async function checkAIRateLimit(
  userId: string,
  plan: 'free' | 'pro' | 'premium'
): Promise<RateLimitResult> {
  const limit = PLAN_LIMITS[plan] ?? PLAN_LIMITS.free;

  // Premium users have no limit
  if (limit === Infinity) {
    return { allowed: true, remaining: Infinity, limit, resetAt: '' };
  }

  const supabase = getAdminClient();
  const now = new Date();

  // Fetch existing usage record
  const { data: existing, error } = await supabase
    .from('usage_limits')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = row not found — that's OK, we'll create it
    console.error('[rate-limit] DB read error:', error.message);
    // Fail open to avoid blocking users on transient DB issues
    return { allowed: true, remaining: limit, limit, resetAt: '' };
  }

  let requestsToday = 0;
  let lastReset = now;

  if (existing) {
    const lastResetDate = new Date(existing.last_reset);
    const hoursSinceReset = (now.getTime() - lastResetDate.getTime()) / 36e5;

    if (hoursSinceReset >= 24) {
      // Reset the counter
      requestsToday = 0;
      lastReset = now;
    } else {
      requestsToday = existing.requests_today ?? 0;
      lastReset = lastResetDate;
    }
  }

  const resetAt = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000).toISOString();

  if (requestsToday >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
      resetAt,
    };
  }

  // Increment counter (upsert)
  const { error: upsertError } = await supabase.from('usage_limits').upsert(
    {
      user_id: userId,
      requests_today: requestsToday + 1,
      last_reset: existing && (new Date(existing.last_reset).getTime() > now.getTime() - 24 * 3600 * 1000)
        ? existing.last_reset
        : now.toISOString(),
    },
    { onConflict: 'user_id' }
  );

  if (upsertError) {
    console.error('[rate-limit] DB upsert error:', upsertError.message);
  }

  return {
    allowed: true,
    remaining: limit - (requestsToday + 1),
    limit,
    resetAt,
  };
}

// ---------------------------------------------------------------------------
// Distributed per-IP rate limiter via Upstash Redis (60 req / 60s)
// Sliding window algorithm — shared across ALL Vercel serverless instances.
// ---------------------------------------------------------------------------

let _ratelimiter: Ratelimit | null = null;

/**
 * Returns a cached Upstash Ratelimit instance.
 * Falls back to null (allow-all) if env vars are absent (local dev without Redis).
 */
function getRateLimiter(): Ratelimit | null {
  if (_ratelimiter) return _ratelimiter;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Not configured — skip rate limiting (safe for local dev)
    return null;
  }

  const redis = new Redis({ url, token });

  _ratelimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '60 s'),
    analytics: false,
    prefix: 'rl:ip',
  });

  return _ratelimiter;
}

/**
 * Checks if an IP has exceeded 60 requests per 60-second sliding window.
 * Uses Upstash Redis so the limit is shared across all serverless instances.
 * Returns { allowed: boolean, remaining: number }.
 */
export async function checkGlobalRateLimit(
  ip: string
): Promise<{ allowed: boolean; remaining: number }> {
  const limiter = getRateLimiter();

  if (!limiter) {
    // No Redis configured — allow all requests (dev/test mode)
    return { allowed: true, remaining: 60 };
  }

  const { success, remaining } = await limiter.limit(ip);
  return { allowed: success, remaining: remaining ?? 0 };
}

/**
 * Logs an AI generation event for monitoring purposes.
 */
export function logAIRequest(userId: string, endpoint: string, tokens?: number) {
  console.log(
    JSON.stringify({
      event: 'ai_request',
      userId,
      endpoint,
      tokens: tokens ?? 'unknown',
      timestamp: new Date().toISOString(),
    })
  );
}

/**
 * Logs a rate limit violation.
 */
export function logRateLimitViolation(identifier: string, type: 'user' | 'ip', plan?: string) {
  console.warn(
    JSON.stringify({
      event: 'rate_limit_violation',
      identifier,
      type,
      plan: plan ?? 'unknown',
      timestamp: new Date().toISOString(),
    })
  );
}

/**
 * Logs an API error for monitoring.
 */
export function logAPIError(endpoint: string, error: unknown, userId?: string) {
  console.error(
    JSON.stringify({
      event: 'api_error',
      endpoint,
      userId: userId ?? 'anonymous',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    })
  );
}
