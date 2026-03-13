import { createSupabaseServerClient } from './supabaseServer';

// ---------------------------------------------------------------------------
// Plan Limits (Based on the new Pricing Model)
// ---------------------------------------------------------------------------
export const TOOL_LIMITS: Record<string, { hobby: number; pro: number }> = {
  'data-analysis': { hobby: 1, pro: 200 },
  'graph-generator': { hobby: 1, pro: 200 },
  'lab-report': { hobby: 1, pro: 200 },
  'viva-prep': { hobby: 1, pro: 200 },
  'research-format': { hobby: 1, pro: 200 },
};

/** Returns the current year string in YYYY format for Pro limits */
export function getCurrentYear(): string {
  return new Date().getFullYear().toString();
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface UsageRecord {
  user_id: string;
  plan: string;
  tokens_used: number; // For backward compatibility/legacy features
  user_metadata?: {
    tool_usage?: Record<string, number>;
  };
  updated_at: string;
}

export interface ToolCheckResult {
  allowed: boolean;
  used: number;
  remaining: number;
  limit: number;
  plan: string;
}

// ---------------------------------------------------------------------------
// Core function: get-or-create usage record
// ---------------------------------------------------------------------------

export async function getUserUsage(userId: string): Promise<any> {
  const supabase = await createSupabaseServerClient();

  // Attempt to read existing record
  const { data: existing, error } = await supabase
    .from('user_usage')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error?.code === 'PGRST116' || !existing) {
    const fresh = {
      user_id: userId,
      plan: 'free',
      tokens_used: 0,
      month: new Date().toISOString().slice(0, 7),
      updated_at: new Date().toISOString()
    };

    const { data: created, error: insertError } = await supabase
      .from('user_usage')
      .insert(fresh)
      .select()
      .single();

    if (insertError) throw new Error(`Failed to create usage record: ${insertError.message}`);
    return created;
  }

  if (error) throw new Error(`Failed to fetch usage record: ${error.message}`);
  return existing;
}

/**
 * Checks whether the user has uses remaining for a specific tool.
 * @param userId User ID
 * @param toolId Tool ID (e.g., 'data-analysis')
 */
export async function checkToolUsage(userId: string, toolId: string): Promise<ToolCheckResult> {
  const supabase = await createSupabaseServerClient();
  
  // 1. Get user plan from subscriptions table first (the source of truth for recurring subs)
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();
  
  let plan = 'hobby';
  if (subData) {
    plan = 'pro';
  } else {
    // Fallback: Check users table for legacy or manual plan overrides
    const { data: userData } = await supabase
      .from('users')
      .select('plan')
      .eq('id', userId)
      .single();
    plan = userData?.plan === 'pro' ? 'pro' : 'hobby';
  }
  const limits = TOOL_LIMITS[toolId];
  if (!limits) throw new Error(`Invalid tool ID: ${toolId}`);
  
  const limit = plan === 'pro' ? limits.pro : limits.hobby;

  // 2. Get tool-specific usage from a new 'tool_usage' table (we'll implement this)
  // Fallback: Check 'user_usage' for legacy compatibility if we haven't migrated yet
  const { data: usage } = await supabase
    .from('tool_usage')
    .select('count')
    .eq('user_id', userId)
    .eq('tool_id', toolId)
    .single();

  const used = usage?.count ?? 0;
  const remaining = Math.max(0, limit - used);
  const allowed = used < limit;

  return {
    allowed,
    used,
    remaining,
    limit,
    plan
  };
}

/**
 * Increments usage count for a specific tool.
 */
export async function incrementToolUsage(userId: string, toolId: string): Promise<{ used: number }> {
  const supabase = await createSupabaseServerClient();

  // Upsert into tool_usage table
  // Note: We use an RPC for atomic increments to avoid race conditions
  const { data: newCount, error } = await supabase
    .rpc('increment_tool_usage', { 
      p_user_id: userId, 
      p_tool_id: toolId 
    });

  if (error) {
    // If RPC fails (e.g. not created yet), fallback to manual upsert
    const { data: current } = await supabase
      .from('tool_usage')
      .select('count')
      .eq('user_id', userId)
      .eq('tool_id', toolId)
      .single();

    const nextCount = (current?.count ?? 0) + 1;
    
    const { error: upsertError } = await supabase
      .from('tool_usage')
      .upsert({ 
        user_id: userId, 
        tool_id: toolId, 
        count: nextCount,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, tool_id' });

    if (upsertError) throw new Error(`Failed to increment tool usage: ${upsertError.message}`);
    return { used: nextCount };
  }

  return { used: newCount };
}

// ---------------------------------------------------------------------------
// Legacy Token-based functions (kept for backward compatibility during transition)
// ---------------------------------------------------------------------------

export async function checkTokenUsage(userId: string) {
  // Map legacy token check to tool usage (defaulting to 'lab-report' as it was the primary user)
  return checkToolUsage(userId, 'lab-report').then(res => ({
    allowed: res.allowed,
    tokens_used: res.used,
    tokens_remaining: res.remaining,
    limit: res.limit,
    month: 'N/A',
    plan: res.plan
  }));
}

export async function incrementTokenUsage(userId: string) {
  return incrementToolUsage(userId, 'lab-report').then(res => ({
    tokens_used: res.used
  }));
}
