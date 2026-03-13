"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PLANS } from "@/lib/plans";

export function Pricing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const supabase = createSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetchUserPlan(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      if (session) {
        fetchUserPlan(session.user.id);
      } else {
        setCurrentPlan(null);
      }
    });

    // Load PayPal SDK
    const script = document.createElement("script");
    script.src = "https://www.paypal.com/sdk/js?client-id=AWAhvks8m67O_uy4XGScMaqDiWkha5RnP9VvCTlFsPPZuHSfOpQ5mPy10hSrjENyeR4KZC4yvUZOhuPV&vault=true&intent=subscription";
    script.setAttribute("data-sdk-integration-source", "button-factory");
    script.async = true;

    script.onload = () => {
      if ((window as any).paypal) {
        (window as any).paypal.Buttons({
          style: {
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "subscribe"
          },
          createSubscription: function(data: any, actions: any) {
            return actions.subscription.create({
              plan_id: "P-34W2022987790400UNG2DXJY"
            });
          },
          onApprove: function(data: any) {
             console.log("Subscription ID:", data.subscriptionID);
            
            fetch("/api/save-subscription", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ subscription_id: data.subscriptionID })
            }).then(() => {
                window.location.href = "/dashboard";
            });
          }
        }).render("#paypal-button-container");
      }
    };

    document.body.appendChild(script);

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchUserPlan(userId: string) {
    const { data } = await supabase.from("users").select("plan").eq("id", userId).single();
    if (data) setCurrentPlan(data.plan);
  }

  const handleHobbyClick = () => {
    if (isLoggedIn) router.push("/dashboard");
    else router.push("/auth/signup");
  };

  return (
    <section id="pricing" className="py-24 bg-[#fcfcfc]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto items-stretch py-10">
          
          {/* Hobby Plan */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full flex flex-col rounded-[3rem] border-slate-200 shadow-xl bg-white overflow-hidden p-4">
              <CardHeader className="pt-12 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">HOBBY</CardTitle>
                <CardDescription className="pt-2 text-slate-500 font-medium">Perfect for testing the waters.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-8 pt-8">
                <div className="mb-12 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-7xl font-bold text-slate-900">$0</span>
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">/MONTH</span>
                  </div>
                </div>
                <ul className="space-y-6 mb-12">
                   {PLANS[0].features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <Check className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span className="text-slate-600 font-bold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-12 px-8">
                <Button 
                  onClick={handleHobbyClick}
                  className="w-full h-20 rounded-3xl bg-[#111] hover:bg-black text-white font-bold uppercase tracking-widest text-sm"
                >
                  {isLoggedIn ? "GO TO DASHBOARD" : "START FREE"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-full"
          >
            <Card className="h-full flex flex-col relative rounded-[3rem] border-[#818cf8] border-[3px] shadow-2xl bg-white overflow-hidden p-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 z-20">
                <div className="bg-[#4338ca] text-white font-black px-10 py-2.5 text-[10px] uppercase tracking-[0.2em] rounded-b-2xl shadow-lg">
                  MOST POPULAR
                </div>
              </div>
              <CardHeader className="pt-14 text-center">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">PRO</CardTitle>
                <CardDescription className="pt-2 text-slate-500 font-medium">Everything you need for your entire degree.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-8 pt-6">
                <div className="mb-10 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-7xl font-bold text-slate-900">$8</span>
                    <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">/MONTH</span>
                  </div>
                  <p className="text-sm text-[#6366f1] font-black mt-2 uppercase tracking-widest">
                    BILLED YEARLY ($96)
                  </p>
                </div>
                <ul className="space-y-6 mb-10">
                   {PLANS[1].features.slice(0, 4).map((feature, i) => (
                    <li key={i} className="flex items-center gap-4">
                      <Check className="h-5 w-5 text-indigo-600 shrink-0" />
                      <span className="text-slate-600 font-bold">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pb-8 px-8">
                <div id="paypal-button-container" className="w-full min-h-[50px]"></div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
