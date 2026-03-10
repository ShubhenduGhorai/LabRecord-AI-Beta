import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabaseServer';

export async function checkSubscription(redirectToPricing: boolean = true) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (redirectToPricing) redirect('/login');
    return false;
  }

  // Admin override for development
  if (user.email === "YOUR_GMAIL@gmail.com") {
    return true;
  }

  // 1. Check the new subscriptions table
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, plan')
    .eq('user_id', user.id)
    .single();

  if (subscription?.status === 'active' && subscription?.plan === 'premium') {
    return true;
  }

  // 2. Fallback check for legacy users who might have their status directly on users table
  const { data: legacyUser } = await supabase
    .from('users')
    .select('subscription_status, plan')
    .eq('id', user.id)
    .single();

  if (legacyUser?.subscription_status === 'active' && legacyUser?.plan === 'premium') {
    return true;
  }

  // Note: if you still want to allow 'free' accounts an initial allowance,
  // you might add logic here to check `legacyUser?.plan === 'free'` and usage count.
  // But per strict gating requirements, we require an 'active' subscription explicitly.

  if (redirectToPricing) {
    redirect('/pricing');
  }

  return false;
}
