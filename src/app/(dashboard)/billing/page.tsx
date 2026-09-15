"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Zap } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { useSubscription } from "@/context/SubscriptionContext";

export default function BillingPage() {
  const { currentPlan, isActive, openUpgrade } = useSubscription();
  const [planLabel, setPlanLabel] = useState("—");
  const [expiryDate, setExpiryDate] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchDetails() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan_name, status, expiry_date")
        .eq("user_id", user.id)
        .single();

      if (sub?.status === "active") {
        setPlanLabel(sub.plan_name === "pro_yearly" ? "Pro Yearly" : "Pro");
        if (sub.expiry_date) {
          setExpiryDate(new Date(sub.expiry_date).toLocaleDateString("en-IN", {
            day: "numeric", month: "long", year: "numeric"
          }));
        }
      } else {
        setPlanLabel("Free (Hobby)");
      }
    }
    fetchDetails();
  }, []);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription?")) return;
    setCancelling(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from("subscriptions")
      .update({ status: "cancelled" })
      .eq("user_id", user.id);

    await supabase
      .from("users")
      .update({ plan: "free", subscription_status: "cancelled" })
      .eq("id", user.id);

    setCancelling(false);
    window.location.reload();
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Billing</h1>
        <p className="text-slate-500 mt-2 font-medium italic">
          View your current plan and manage your subscription.
        </p>
      </div>

      <Card className="rounded-3xl border-slate-200 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-br from-indigo-900 to-violet-900 p-8 text-white">
          <CardTitle className="flex items-center gap-3 text-lg font-black uppercase tracking-widest">
            <Zap className="h-6 w-6 text-indigo-300" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-black text-slate-900">{planLabel}</p>
              {expiryDate && (
                <p className="text-sm text-slate-500 mt-1 font-medium">
                  Active until {expiryDate}
                </p>
              )}
            </div>
            {isActive && (
              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-bold text-emerald-700">Active</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row gap-3">
            {!isActive && (
              <Button
                onClick={openUpgrade}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl h-12 px-6"
              >
                <Zap className="h-4 w-4 mr-2" />
                Upgrade to Pro
              </Button>
            )}
            {isActive && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={cancelling}
                className="text-red-600 border-red-200 hover:bg-red-50 font-bold rounded-xl h-12 px-6"
              >
                {cancelling ? "Cancelling…" : "Cancel Subscription"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
