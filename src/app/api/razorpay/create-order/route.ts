import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { planId, amount, currency = "INR" } = await req.json();

    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!planId || !amount) {
      return NextResponse.json({ error: "Missing plan or amount" }, { status: 400 });
    }

    // Razorpay amount is in paise (e.g., ₹499 = 49900)
    const options = {
      amount: Math.round(amount * 100), 
      currency: currency,
      receipt: `receipt_${user.id.slice(0, 10)}_${Date.now()}`,
      notes: {
        userId: user.id,
        planId: planId,
        email: user.email
      }
    };

    const order = await (razorpay.orders.create(options as any) as any);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    });

  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return NextResponse.json({ error: "Failed to create payment order. Please try again." }, { status: 500 });
  }
}
