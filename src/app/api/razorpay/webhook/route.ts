import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!webhookSecret || !signature) {
      console.error("Razorpay Webhook: Missing secret or signature");
      return NextResponse.json({ error: "Configuration Error" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Razorpay Webhook: Invalid signature");
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = await createSupabaseServerClient();

    // Handle order completion or payment capture
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload.payment?.entity || event.payload.order?.entity;
      const notes = payment.notes || {};
      const userId = notes.userId;
      const planId = notes.planId;

      if (userId && planId) {
        // Calculate expiry date (30 days for pro, 365 for research)
        const days = planId === 'research' ? 365 : 30;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + days);

        // Update users table (legacy)
        await supabase
          .from('users')
          .update({
            plan: planId,
            subscription_status: 'active',
          })
          .eq('id', userId);

        // Update subscriptions table (modern)
        await supabase
          .from('subscriptions')
          .upsert({
            user_id: userId,
            plan_name: planId,
            status: 'active',
            expiry_date: expiryDate.toISOString()
          }, { onConflict: 'user_id' });

        console.log(`Razorpay Webhook: Updated subscription for user ${userId} to ${planId}`);
      }
    }

    return NextResponse.json({ status: "ok" });

  } catch (error: any) {
    console.error("Razorpay Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
