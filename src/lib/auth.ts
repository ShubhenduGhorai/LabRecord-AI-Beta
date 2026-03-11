import { createSupabaseServerClient } from '@/lib/supabaseServer';
import { NextRequest } from 'next/server';

export interface AuthUser {
  id: string;
  email: string | undefined;
  plan: 'free' | 'pro' | 'premium';
}

/**
 * Verifies the Supabase JWT and returns the authenticated user with their plan.
 * Throws a Response with HTTP 401 if the user is not authenticated.
 */
export async function getAuthenticatedUser(request?: NextRequest): Promise<AuthUser> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Fetch the user's active subscription plan
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan, status')
    .eq('user_id', user.id)
    .single();

  let plan: 'free' | 'pro' | 'premium' = 'free';

  if (subscription?.status === 'active') {
    const planName = subscription.plan?.toLowerCase() ?? 'free';
    if (planName === 'premium' || planName === 'researcher') {
      plan = 'premium';
    } else if (planName === 'pro') {
      plan = 'pro';
    }
  }

  return {
    id: user.id,
    email: user.email,
    plan,
  };
}
