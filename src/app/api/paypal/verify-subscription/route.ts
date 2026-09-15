import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { subscriptionID, planId } = await req.json();

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!subscriptionID || !planId) {
      return NextResponse.json({ error: "Missing subscriptionID or planId" }, { status: 400 });
    }

    // In a production environment, you would call PayPal API to verify the subscription status
    // For now, based on the onApprove event from frontend, we trust the subscriptionID
    
    // Calculate expiry date
    // For subscriptions, we usually set status to active and rely on webhooks for cancellation
    // But here we keep the manual expiry logic for simplicity if needed
    const days = planId === 'pro_yearly' ? 365 : 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    // Update users table
    await supabase
      .from('users')
      .update({
        plan: 'pro', 
        subscription_status: 'active',
      })
      .eq('id', user.id);

    // Update subscriptions table (modern)
    await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan_name: planId,
        status: 'active',
        expiry_date: expiryDate.toISOString(),
        metadata: { paypal_subscription_id: subscriptionID }
      }, { onConflict: 'user_id' });

    console.log(`PayPal Subscription: Updated subscription for user ${user.id} to ${planId}`);

    return NextResponse.json({ status: "success", subscriptionID });

  } catch (error: any) {
    console.error("PayPal Subscription Verification Error:", error);
    return NextResponse.json({ error: "Failed to verify PayPal subscription" }, { status: 500 });
  }
}
