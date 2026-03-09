import { stripe } from './stripe';
import { createSupabaseServerClient } from './supabaseServer';

export async function getOrCreateStripeCustomer(userId: string, email: string) {
  const supabase = await createSupabaseServerClient();

  const { data: userData } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .eq('id', userId)
    .single();

  if (userData?.stripe_customer_id) {
    return userData.stripe_customer_id;
  }

  // Create new customer in Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabaseUUID: userId,
    },
  });

  // Save to our DB
  await supabase
    .from('users')
    .update({ stripe_customer_id: customer.id })
    .eq('id', userId);

  return customer.id;
}
