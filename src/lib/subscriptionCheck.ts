import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from './supabaseServer';

export async function checkSubscription(redirectToPricing: boolean = false) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    if (redirectToPricing) redirect('/auth/login');
    return false;
  }

  // Admin override for development
  if (user.email === "YOUR_GMAIL@gmail.com") {
    return true;
  }

  // 1. Check the subscriptions table
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('status, plan_name')
    .eq('user_id', user.id)
    .single();

  if (subscription?.status === 'active') {
    return true;
  }

  // 2. Fallback check for legacy users
  const { data: legacyUser } = await supabase
    .from('users')
    .select('subscription_status, plan')
    .eq('id', user.id)
    .single();

  if (legacyUser?.subscription_status === 'active' || legacyUser?.plan === 'pro') {
    return true;
  }

  // NOTE: Do NOT redirect to /pricing — let the calling component open the UpgradeModal
  return false;
}

