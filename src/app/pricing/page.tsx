"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Sparkles, Building, Lock } from "lucide-react";
import { PLANS as plans } from "@/lib/plans";
import { createSupabaseClient } from "@/lib/supabaseClient";

export default function PricingPage() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchUserPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingData(false);
        return;
      }

      // Check subscriptions table first
      const { data: sub } = await supabase.from("subscriptions").select("plan_name, status").eq("user_id", user.id).single();
      if (sub && sub.status === 'active') {
        setCurrentPlan(sub.plan_name);
      } else {
        // Fallback to old schema format
        const { data } = await supabase.from("users").select("plan").eq("id", user.id).single();
        if (data) {
          setCurrentPlan(data.plan);
        }
      }
      setLoadingData(false);
    }
    fetchUserPlan();
  }, []);

  const handleSubscribe = async (priceId: string) => {
    try {
      setLoadingPriceId(priceId);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Failed to initiate checkout. Please try again.");
    } finally {
      setLoadingPriceId(null);
    }
  };

  if (loadingData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const isFree = !currentPlan || currentPlan === 'free';

  return (
    <div className="px-4 py-8 md:p-10 max-w-6xl mx-auto space-y-12">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50 px-3 py-1">
          <Lock className="w-3 h-3 mr-1 inline" />
          Subscription Required
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          Unlock the Tool Suite
        </h1>
        <p className="text-lg text-slate-600">
          You need an active subscription to access premium tools like AI Data Analysis, 
          Viva Prep, and full Lab Report Generation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan: any) => {
          const isCurrentPlan = currentPlan === plan.id;
          const isPopular = plan.id === 'pro';

          return (
            <Card 
              key={plan.id} 
              className={`relative flex flex-col ${
                isPopular 
                  ? 'border-indigo-500 shadow-xl shadow-indigo-100 scale-105 z-10' 
                  : 'border-slate-200 shadow-sm'
              }`}
            >
              {isPopular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0 font-semibold px-3 py-1 text-xs uppercase tracking-widest shadow-lg">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-8 pt-10">
                <CardTitle className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                  {plan.id === 'free' && <Zap className="h-5 w-5 text-slate-400" />}
                  {plan.id === 'pro' && <Sparkles className="h-5 w-5 text-indigo-500" />}
                  {plan.id === 'research' && <Building className="h-5 w-5 text-amber-500" />}
                  {plan.name}
                </CardTitle>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="text-muted-foreground font-medium">/{plan.interval}</span>
                </div>
                <CardDescription className="pt-4 text-sm font-medium">
                  {plan.id === 'free' ? "Basic access limits apply." : "Full access to all tools."}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-4">
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <div className={`mt-0.5 rounded-full p-1 ${isPopular ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                        <Check className="h-3 w-3 stroke-[3]" />
                      </div>
                      <span className="text-slate-700 font-medium leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="pt-8 pb-8">
                <Button 
                  onClick={() => plan.priceId && handleSubscribe(plan.priceId)}
                  disabled={isCurrentPlan || !plan.priceId || loadingPriceId === plan.priceId}
                  variant={isPopular ? "default" : "outline"}
                  className={`w-full h-12 text-base font-semibold ${
                    isPopular 
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200' 
                      : 'border-slate-200 text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {isCurrentPlan ? "Current Plan" : 
                   loadingPriceId === plan.priceId ? "Processing..." : 
                   !plan.priceId ? "Contact Sales" : "Upgrade Plan"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
