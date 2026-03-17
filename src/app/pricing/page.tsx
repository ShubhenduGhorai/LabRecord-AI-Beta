"use client";

import { useState, useEffect } from "react";
import { PLANS as plans } from "@/lib/plans";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { Check, Award, Clock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LabRecord AI Pricing | Affordable Plans for Students",
    description: "Choose the right plan for your lab reporting needs. Start for free or unlock unlimited reports.",
    alternates: {
        canonical: "/pricing",
    },
};

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
             const plan = plans.find(p => p.id === planId);
             return actions.subscription.create({
               plan_id: plan?.paypalPlanId || 'P-34W2022987790400UNG2DXJY'
             });
          },
          onApprove: function(data: any) {
            console.log("Subscription ID:", data.subscriptionID);
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

    // Poll for paypal availability if the script is still loading
    const interval = setInterval(() => {
        if ((window as any).paypal) {
            renderButtons();
            clearInterval(interval);
        }
    }, 500);

    return () => clearInterval(interval);
  }, [planId, onSuccess]);

  return (
    <div className="w-full">
      <div id={`paypal-button-container-${planId}`} className="w-full min-h-[50px]"></div>
      {error && <p className="text-rose-500 text-[10px] font-bold mt-2 text-center">{error}</p>}
    </div>
  );
}

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchUserPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("users").select("plan").eq("id", user.id).single();
      if (data) setCurrentPlan(data.plan);
    }
    fetchUserPlan();
  }, []);

  const paypalClientId = "AWAhvks8m67O_uy4XGScMaqDiWkha5RnP9VvCTlFsPPZuHSfOpQ5mPy10hSrjENyeR4KZC4yvUZOhuPV";

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-20 px-4 flex flex-col items-center">
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&vault=true&intent=subscription`}
        strategy="afterInteractive"
      />
      
      <div className="text-center space-y-6 max-w-4xl mx-auto mb-16">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-black uppercase text-[10px] tracking-widest shadow-sm">
          <Award className="w-3.5 h-3.5" /> Unlock Scientific Excellence
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 italic">
          Simple, Transparent <br className="hidden md:block"/> Pricing for Students.
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl items-stretch px-4">
        {plans.map((plan) => (
          <motion.div key={plan.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative h-full">
            <Card className={cn(
              "relative h-full flex flex-col rounded-[3.5rem] p-4 border-slate-200 shadow-xl bg-white overflow-hidden transition-all duration-500",
              plan.popular && "border-[#818cf8] border-[3px] shadow-2xl scale-105"
            )}>
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-[#4338ca] text-white font-black px-10 py-2 text-[10px] uppercase tracking-[0.2em] rounded-b-2xl shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <CardHeader className="text-center px-8 pt-16 pb-10">
                <CardTitle className="text-3xl font-bold uppercase tracking-tight mb-4 text-slate-900">{plan.name}</CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500 max-w-[220px] mx-auto leading-relaxed">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1 px-10 pb-10">
                <div className="mb-10 text-center">
                   <div className="flex items-baseline justify-center gap-1">
                      <span className="text-7xl font-bold text-slate-900">{plan.price}</span>
                      {plan.period && <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{plan.period}</span>}
                   </div>
                   {plan.billedYearly && (
                      <p className="text-sm text-[#6366f1] font-black mt-2 uppercase tracking-widest">{plan.billedYearly}</p>
                   )}
                </div>
                <ul className="space-y-6">
                  {plan.features.slice(0, 5).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-4 text-sm">
                      <Check className="h-5 w-5 shrink-0 text-indigo-600" />
                      <span className="text-slate-600 font-bold leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="px-8 pb-12">
                 {plan.id === 'free' ? (
                  <Button 
                    onClick={() => window.location.href='/dashboard'}
                    className="w-full h-16 rounded-2xl bg-[#111] hover:bg-black text-white font-black uppercase tracking-widest text-xs"
                  >
                    START FREE
                  </Button>
                 ) : (
                    <PayPalButton planId={plan.id} onSuccess={() => window.location.href = "/dashboard"} />
                 )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
