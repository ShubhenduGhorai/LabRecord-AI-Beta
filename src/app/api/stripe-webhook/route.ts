import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Stripe from 'stripe';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret!);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const customerId = session.customer as string;

      if (userId) {
        // Find which plan they subscribed to
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0].price.id;

        let plan = 'free';
        if (priceId === 'price_pro_id') plan = 'pro';
        if (priceId === 'price_research_id') plan = 'research';

        await supabase
          .from('users')
          .update({
            plan,
            stripe_customer_id: customerId,
            subscription_status: 'active',
          })
          .eq('id', userId);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      await supabase
        .from('users')
        .update({
          plan: 'free',
          subscription_status: 'canceled',
        })
        .eq('stripe_customer_id', customerId);
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      if (invoice.billing_reason === 'subscription_cycle') {
        await supabase
          .from('users')
          .update({
            subscription_status: 'active',
          })
          .eq('stripe_customer_id', customerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
