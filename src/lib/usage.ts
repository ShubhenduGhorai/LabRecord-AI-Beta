import { createSupabaseServerClient } from './supabaseServer';

// ---------------------------------------------------------------------------
// Plan token limits (per month)
// ---------------------------------------------------------------------------
export const TOKEN_LIMITS: Record<string, number> = {
  free: 10,
  premium: 500,
};

/** Returns the current month string in YYYY-MM format (e.g. "2026-03") */
export function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UsageRecord {
  user_id: string;
  plan: string;
  tokens_used: number;
  month: string;
  updated_at: string;
}

export interface TokenCheckResult {
  allowed: boolean;
  tokens_used: number;
  tokens_remaining: number;
  limit: number;
  month: string;
  plan: string;
}

// ---------------------------------------------------------------------------
// Core function: get-or-create, auto-reset, check
// ---------------------------------------------------------------------------

/**
 * Fetches the user_usage record for the given user using their own auth credentials.
 * - Auto-creates the record if it doesn't exist (free plan, 0 tokens).
 * - Auto-resets tokens_used to 0 if the stored month differs from the current month.
 */
export async function getUserUsage(userId: string): Promise<UsageRecord> {
  const supabase = await createSupabaseServerClient();
  const currentMonth = getCurrentMonth();

  // Attempt to read existing record
  const { data: existing, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Row doesn't exist yet — create a fresh one (allowed by RLS 'WITH CHECK (auth.uid() = user_id)')
  if (error?.code === 'PGRST116' || !existing) {
    const fresh: Omit<UsageRecord, 'updated_at'> = {
      user_id: userId,
      plan: 'free',
      tokens_used: 0,
      month: currentMonth,
    };

    const { data: created, error: insertError } = await supabase
      .from('user_usage')
      .insert({ ...fresh, updated_at: new Date().toISOString() })
      .select()
      .single();

    if (insertError) {
      throw new Error(`Failed to create usage record: ${insertError.message}`);
    }

    return created as UsageRecord;
  }

  if (error) {
    throw new Error(`Failed to fetch usage record: ${error.message}`);
  }

  // Monthly reset: stored month is different from current month → reset counter
  if (existing.month !== currentMonth) {
    const { data: reset, error: resetError } = await supabase
      .from('user_usage')
      .update({
        tokens_used: 0,
        month: currentMonth,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (resetError) {
      throw new Error(`Failed to reset monthly usage: ${resetError.message}`);
    }

    return reset as UsageRecord;
  }

  return existing as UsageRecord;
}

/**
 * Checks whether the user has tokens remaining for this month.
 * Returns a TokenCheckResult with allowed=true/false and current counts.
 */
export async function checkTokenUsage(userId: string): Promise<TokenCheckResult> {
  const record = await getUserUsage(userId);
  const limit = record.plan === 'premium' ? TOKEN_LIMITS.premium : TOKEN_LIMITS.free;
  const tokens_remaining = Math.max(0, limit - record.tokens_used);
  const allowed = record.tokens_used < limit;

  return {
    allowed,
    tokens_used: record.tokens_used,
    tokens_remaining,
    limit,
    month: record.month,
    plan: record.plan,
  };
}

/**
 * Increments tokens_used by 1 after a successful AI generation.
 * Should only be called AFTER the AI call succeeds.
 */
export async function incrementTokenUsage(userId: string): Promise<{ tokens_used: number }> {
  const supabase = await createSupabaseServerClient();

  // Read current value first
  const { data: current, error: readErr } = await supabase
    .from('user_usage')
    .select('tokens_used')
    .eq('user_id', userId)
    .single();

  if (readErr) throw new Error(`Failed to read usage for increment: ${readErr.message}`);

  const newCount = (current?.tokens_used ?? 0) + 1;

  // Update record (allowed by RLS 'USING (auth.uid() = user_id)')
  const { error: updateError } = await supabase
    .from('user_usage')
    .update({ tokens_used: newCount, updated_at: new Date().toISOString() })
    .eq('user_id', userId);

  if (updateError) throw new Error(`Failed to increment token usage: ${updateError.message}`);

  return { tokens_used: newCount };
}
