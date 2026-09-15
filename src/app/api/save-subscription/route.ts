import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { subscription_id } = await req.json();

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!subscription_id) {
      return NextResponse.json({ error: "Missing subscription_id" }, { status: 400 });
    }

    // Insert into subscriptions table as per user's specific request
    // We use upsert on user_id to ensure one sub per user, or just insert if user allows multiple
    const { error: subError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        paypal_subscription_id: subscription_id,
        plan_name: 'pro_yearly',
        status: 'active',
        created_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    if (subError) {
      console.error("Subscription Save Error:", subError);
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 });
    }

    // Also update the users table for legacy plan tracking if used elsewhere
    await supabase
      .from('users')
      .update({
        plan: 'pro',
        subscription_status: 'active'
      })
      .eq('id', user.id);

    return NextResponse.json({ status: "success", subscriptionID: subscription_id });

  } catch (error: any) {
    console.error("API Error in save-subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
