import { NextRequest, NextResponse } from "next/server";
import { captureOrder } from "@/lib/paypal";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { orderID, planId } = await req.json();

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orderID || !planId) {
      return NextResponse.json({ error: "Missing orderID or planId" }, { status: 400 });
    }

    // Capture the PayPal order
    const captureData = await captureOrder(orderID);

    if (captureData.status === "COMPLETED") {
      // Calculate expiry date
      // Monthly plan: 30 days, Yearly plan: 365 days
      const days = planId === 'pro_yearly' ? 365 : 30;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + days);

      // Update users table
      await supabase
        .from('users')
        .update({
          plan: planId === 'pro_yearly' ? 'pro' : 'pro', // Map to general pro plan for legacy
          subscription_status: 'active',
        })
        .eq('id', user.id);

      // Update subscriptions table (modern)
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: user.id,
          plan_name: planId, // Use the specific plan ID (pro_monthly or pro_yearly)
          status: 'active',
          expiry_date: expiryDate.toISOString(),
          // Store paypal order ID for reference
          metadata: { paypal_order_id: orderID }
        }, { onConflict: 'user_id' });

      return NextResponse.json({ status: "success", data: captureData });
    } else {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

  } catch (error: any) {
    console.error("PayPal Capture Error:", error);
    return NextResponse.json({ error: "Failed to capture PayPal order" }, { status: 500 });
  }
}
