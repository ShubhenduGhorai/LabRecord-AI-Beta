"use client";

import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Script from "next/script";
import { PLANS } from "@/lib/plans";

function PayPalButton({ planId, onSuccess }: { planId: string, onSuccess: (data: any) => void }) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderButtons = () => {
      if (typeof window !== "undefined" && (window as any).paypal) {
        (window as any).paypal.Buttons({
          createSubscription: (data: any, actions: any) => {
            const plan = PLANS.find(p => p.id === planId);
            return actions.subscription.create({
              plan_id: plan?.paypalPlanId || 'P-34W2022987790400UNG2DXJY'
            });
          },
          onApprove: async (data: any, actions: any) => {
             try {
              const res = await fetch("/api/paypal/verify-subscription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                  subscriptionID: data.subscriptionID,
                  planId: planId
                }),
              });
              const result = await res.json();
              if (result.status === "success") {
                onSuccess(result);
              } else {
                setError(result.error || "Verification failed");
              }
            } catch (err) {
              console.error(err);
              setError("An error occurred during verification.");
            }
          },
          onError: (err: any) => {
            console.error("PayPal Error:", err);
            setError("Subscription failed.");
          },
          style: {
            layout: 'horizontal',
            color: 'gold',
            shape: 'pill',
            label: 'subscribe',
            height: 48
          }
        }).render(`#paypal-button-container-comp-${planId}`);
      }
    };

    const timer = setTimeout(renderButtons, 1000);
    return () => clearTimeout(timer);
  }, [planId, onSuccess]);

  return (
    <div className="w-full">
      <div id={`paypal-button-container-comp-${planId}`} className="w-full"></div>
      {error && <p className="text-rose-500 text-[10px] font-bold mt-2 text-center">{error}</p>}
    </div>
  );
}

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

    return () => subscription.unsubscribe();
  }, []);

  async function fetchUserPlan(userId: string) {
    const { data } = await supabase.from("users").select("plan").eq("id", userId).single();
    if (data) setCurrentPlan(data.plan);
  }

  const handlePlanClick = (planName: string) => {
    if (planName === "Hobby") {
      if (isLoggedIn) router.push("/dashboard");
      else router.push("/auth/signup");
    }
  };

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <Script 
        src={`https://www.paypal.com/sdk/js?client-id=${paypalClientId}&vault=true&intent=subscription`}
        strategy="afterInteractive"
      />
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1 rounded-full uppercase text-[10px] font-black tracking-widest">
            Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-6xl font-black tracking-tight mb-6 text-foreground italic">
            Focus on Research, <br/>Not Costs.
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Affordable plans designed for students working on weekly lab reports to full-scale research papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {PLANS.filter(p => p.id !== 'pro_monthly').map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className={cn(
                "h-full flex flex-col relative transition-all duration-500 rounded-[3rem] overflow-visible p-2",
                plan.popular
                  ? "border-indigo-500 border-2 shadow-2xl scale-105 z-10 bg-gradient-to-b from-indigo-50/50 to-white"
                  : "border-border shadow-lg bg-background"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <Badge className="bg-indigo-600 text-white border-0 font-black px-6 py-2 text-[10px] uppercase tracking-[0.2em] shadow-xl rounded-full">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader className="pt-10 pb-6 text-center">
                  <CardTitle className="text-2xl font-black uppercase tracking-tight">{plan.name}</CardTitle>
                  <CardDescription className="pt-2 font-medium">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-8">
                  <div className="mb-8 text-center">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-black text-foreground">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">{plan.period}</span>}
                    </div>
                    {plan.billedYearly && (
                      <p className="text-xs font-bold text-indigo-600 mt-2 uppercase tracking-wider">
                        {plan.billedYearly}
                      </p>
                    )}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.slice(0, 6).map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-muted-foreground text-sm font-semibold">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pb-10 px-8">
                  {plan.id === 'free' ? (
                     <Button
                        onClick={() => handlePlanClick("Hobby")}
                        variant={isLoggedIn ? "outline" : "default"}
                        className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                      >
                        {isLoggedIn ? "Go to Dashboard" : "Start Free"}
                      </Button>
                  ) : (
                    <div className="w-full">
                      {isLoggedIn ? (
                        currentPlan === 'pro' ? (
                          <Button disabled className="w-full h-14 rounded-2xl bg-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs">
                             Active Plan
                          </Button>
                        ) : (
                          <PayPalButton 
                            planId={plan.id} 
                            onSuccess={() => {
                              window.location.href = "/payment-success";
                            }}
                          />
                        )
                      ) : (
                        <Button
                          onClick={() => router.push("/auth/signup")}
                          className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs"
                        >
                          Get Started
                        </Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
