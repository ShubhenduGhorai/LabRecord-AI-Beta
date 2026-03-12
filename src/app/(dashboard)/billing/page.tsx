"use client";

import { useState, useEffect } from "react";
import { PLANS } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, CreditCard, Loader2, Sparkles } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabaseClient";

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string>("Free");
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchUserPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("plan")
          .eq("id", user.id)
          .single();
        
        if (userData?.plan) {
          setCurrentPlan(userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1));
        }
      }
    }
    fetchUserPlan();
  }, []);

  const handleUpgrade = async (plan: any) => {
    if (plan.id === 'free') return;
    
    setLoading(plan.id);
    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          planId: plan.id,
          amount: plan.amount 
        }),
      });
      
      const orderData = await res.json();
      if (orderData.error) throw new Error(orderData.error);
      
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        const options = {
          key: orderData.key_id,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "LabRecord AI",
          description: `Upgrade to ${plan.name}`,
          order_id: orderData.id,
          handler: function (response: any) {
             window.location.href = "/billing?payment_id=" + response.razorpay_payment_id;
          },
          theme: { color: "#4f46e5" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2 text-slate-500">
          Manage your plan and usage limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PLANS.map((plan) => (
          <Card 
            key={plan.name} 
            className={`flex flex-col relative transition-all duration-200 ${
              plan.popular ? "border-indigo-500 shadow-lg scale-105 z-10" : "border-slate-200 shadow-sm"
            }`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.name}</span>
                {currentPlan === plan.name && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Current Plan
                  </span>
                )}
              </CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                {plan.period && <span className="text-slate-500 text-sm font-medium">{plan.period}</span>}
              </div>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleUpgrade(plan)}
                disabled={currentPlan.toLowerCase() === plan.id.toLowerCase() || (loading !== null) || plan.id === 'free'}
                variant={plan.popular ? "default" : "outline"}
                className={`w-full py-6 font-semibold ${
                  plan.popular ? "bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200" : ""
                }`}
              >
                {loading === plan.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : currentPlan.toLowerCase() === plan.id.toLowerCase() ? (
                  "Active"
                ) : (
                  `Upgrade to ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Usage Overview */}
      <Card className="border-slate-200 shadow-sm bg-slate-50/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            Plan Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1">
             <h4 className="font-semibold text-slate-800">Priority Processing</h4>
             <p className="text-sm text-slate-600">Your reports are generated 3x faster with our priority AI queue.</p>
          </div>
          <div className="space-y-1">
             <h4 className="font-semibold text-slate-800">Advanced AI</h4>
             <p className="text-sm text-slate-600">Unlock more detailed Viva preparation and source of error analysis.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
