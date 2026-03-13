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

export function Pricing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
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
            
            // call backend to save subscription
            fetch("/api/save-subscription", {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                subscription_id: data.subscriptionID
              })
            }).then(() => {
                // redirect user
                window.location.href = "/dashboard";
            });
          }
        }).render("#paypal-button-container");
      }
    };

    document.body.appendChild(script);

    return () => {
      subscription.unsubscribe();
      // Only remove if it's the exact script we added, though usually we keep it for SPA
    };
  }, []);

  const handleFreeClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signup");
    }
  };

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-4 py-1 rounded-full uppercase text-[10px] font-black tracking-widest">
            Simple Pricing
          </Badge>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Focus on Research, <br/>Not Costs.
          </h2>
          <p className="text-lg text-muted-foreground font-medium">
            Affordable plans designed for students working on weekly lab reports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Hobby Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col relative transition-all duration-500 rounded-[3rem] overflow-visible border-border shadow-lg bg-background">
              <CardHeader className="pt-10 pb-6 text-center">
                <CardTitle className="text-2xl font-bold uppercase tracking-tight">Hobby</CardTitle>
                <CardDescription className="pt-2 font-medium">Perfect for testing the waters.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-8">
                <div className="mb-8 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-extrabold text-foreground">$0</span>
                    <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">/month</span>
                  </div>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-semibold">Use each tool 1 time</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-semibold">AI Data Analysis</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-semibold">Graph Generator</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pb-10 px-8">
                <Button onClick={handleFreeClick} className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs">
                  {isLoggedIn ? "Go to Dashboard" : "Start Free"}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Pro Plan */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-full"
          >
            <Card className="h-full flex flex-col relative transition-all duration-500 rounded-[3rem] overflow-visible border-indigo-500 border-2 shadow-2xl scale-105 z-10 bg-gradient-to-b from-indigo-50/50 to-white">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <Badge className="bg-indigo-600 text-white border-0 font-bold px-6 py-2 text-[10px] uppercase tracking-[0.2em] shadow-xl rounded-full">
                  MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="pt-10 pb-6 text-center">
                <CardTitle className="text-2xl font-bold uppercase tracking-tight">Pro</CardTitle>
                <CardDescription className="pt-2 font-medium">Everything you need for your entire degree.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 px-8">
                <div className="mb-8 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-6xl font-extrabold text-foreground">$8</span>
                    <span className="text-muted-foreground font-bold uppercase text-xs tracking-widest">/month</span>
                  </div>
                  <p className="text-sm text-indigo-600 font-bold mt-1 uppercase tracking-wider">
                    Billed yearly ($96)
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-semibold">Unlimited uses per tool</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-semibold">AI Lab Report Writer</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-semibold">Priority AI processing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground text-sm font-semibold">PDF & DOCX Export</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter className="pb-10 px-8 flex flex-col gap-4">
                <div id="paypal-button-container" className="w-full"></div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
