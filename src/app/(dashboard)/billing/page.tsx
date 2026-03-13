"use client";

import { useState, useEffect } from "react";
import { PLANS } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import Script from "next/script";
import { cn } from "@/lib/utils";

function PayPalButton({ planId, onSuccess }: { planId: string, onSuccess: (data: any) => void }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderButtons = () => {
      if (typeof window !== "undefined" && (window as any).paypal) {
        (window as any).paypal.Buttons({
          style: {
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "subscribe"
          },
          createSubscription: function(data: any, actions: any) {
            const plan = PLANS.find(p => p.id === planId);
            return actions.subscription.create({
              plan_id: plan?.paypalPlanId || 'P-34W2022987790400UNG2DXJY'
            });
          },
          onApprove: function(data: any) {
            fetch("/api/save-subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscription_id: data.subscriptionID })
            }).then(() => {
                onSuccess(data);
            });
          }
        }).render(`#paypal-button-container-${planId}`);
      }
    };

    const timer = setTimeout(renderButtons, 1000);
    return () => clearTimeout(timer);
  }, [planId, onSuccess]);

  return (
    <div className="w-full">
      <div id={`paypal-button-container-${planId}`} className="w-full min-h-[50px]"></div>
      {error && <p className="text-rose-500 text-[10px] font-bold mt-2 text-center">{error}</p>}
    </div>
  );
}

export default function BillingPage() {
  const [currentPlan, setCurrentPlan] = useState<string>("Free");
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchUserPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: userData } = await supabase
        .from("users")
        .select("plan")
        .eq("id", user.id)
        .single();
      
      if (userData?.plan) {
        setCurrentPlan(userData.plan === 'pro' ? 'Pro Yearly' : 'Hobby');
      }
    }
    fetchUserPlan();
  }, []);

  const paypalClientId = "AWAhvks8m67O_uy4XGScMaqDiWkha5RnP9VvCTlFsPPZuHSfOpQ5mPy10hSrjENyeR4KZC4yvUZOhuPV";

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-12 bg-[#fcfcfc] min-h-screen">
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&vault=true&intent=subscription`}
        strategy="afterInteractive"
      />
      <div>
        <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Billing</h1>
        <p className="text-slate-500 mt-2 font-medium italic">
          Manage your subscription and usage limits.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl">
        {PLANS.map((plan) => (
          <Card 
            key={plan.id} 
            className={cn(
              "flex flex-col relative transition-all duration-300 rounded-[3rem] border-slate-200 shadow-xl overflow-hidden p-2",
              plan.popular && "border-[#818cf8] border-[3px] shadow-2xl scale-105"
            )}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-[#4338ca] text-white font-black px-8 py-2 text-[10px] uppercase tracking-[0.2em] rounded-b-2xl shadow-lg">
                  MOST POPULAR
                </div>
              </div>
            )}
            <CardHeader className="text-center pt-12">
              <CardTitle className="text-2xl font-black uppercase text-slate-900">{plan.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 px-8 pt-4">
               <div className="mb-8 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{plan.period}</span>}
                  </div>
                  {plan.billedYearly && (
                    <p className="text-xs text-[#6366f1] font-black mt-2 uppercase tracking-widest">{plan.billedYearly}</p>
                  )}
                </div>

              <ul className="space-y-4 mb-8">
                {plan.features.slice(0, 4).map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-slate-600 font-bold">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pb-10 px-8">
               {currentPlan.toLowerCase().includes(plan.name.toLowerCase().replace(' yearly', '')) ? (
                  <Button disabled className="w-full h-16 rounded-2xl bg-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs">
                    ACTIVE
                  </Button>
               ) : plan.id === 'free' ? (
                  <Button disabled className="w-full h-16 rounded-2xl bg-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs">
                    DEFAULT
                  </Button>
               ) : (
                  <PayPalButton 
                    planId={plan.id} 
                    onSuccess={() => {
                        window.location.reload();
                    }}
                  />
               )}
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="rounded-[2.5rem] border-slate-200 shadow-xl bg-white overflow-hidden">
        <CardHeader className="bg-slate-900 p-8 text-white">
          <CardTitle className="text-lg flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-indigo-400" />
            <span className="uppercase tracking-widest font-black italic">Plan Benefits</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-10">
          <div className="space-y-2">
             <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">Priority Processing</h4>
             <p className="text-sm text-slate-600 font-medium">Your reports are generated 3x faster with our priority AI queue.</p>
          </div>
          <div className="space-y-2">
             <h4 className="font-black text-slate-900 uppercase text-sm tracking-tight">Advanced AI Analytics</h4>
             <p className="text-sm text-slate-600 font-medium">Unlock detailed technical theories and automated regression analysis.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
