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
    
    return () => subscription.unsubscribe();
  }, []);

  const handlePlanClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signup");
    }
  };

  const plans = [
    {
      name: "Hobby",
      price: "$0",
      period: "/month",
      description: "Perfect for testing the waters.",
      features: [
        "Use each tool 1 time",
        "AI Data Analysis",
        "Graph Generator",
        "Scientific Observations",
        "Standard Export"
      ],
      buttonText: "Start Free",
      popular: false,
    },
    {
      name: "Pro",
      price: "$8",
      period: "/month",
      description: "Everything you need for your entire degree.",
      features: [
        "200 uses per tool per year",
        "Unlimited Data Analysis",
        "Professional Graph Studio",
        "AI Lab Report Writer",
        "Experiment Vault Storage",
        "Priority Support"
      ],
      buttonText: "Upgrade to Pro",
      popular: true,
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Simple Pricing for Students
          </h2>
          <p className="text-lg text-muted-foreground">
            Affordable plans designed for students working on weekly lab reports to full-scale research papers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={cn(
                "h-full flex flex-col relative transition-all duration-500 rounded-[2.5rem] overflow-visible",
                plan.popular 
                  ? "border-indigo-500 border-2 shadow-2xl scale-105 z-10 bg-gradient-to-b from-indigo-50/50 to-white" 
                  : "border-border shadow-lg bg-background"
              )}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <Badge className="bg-indigo-600 text-white border-0 font-black px-4 py-1 text-[10px] uppercase tracking-widest shadow-xl rounded-full">
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="pt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground font-medium">{plan.period}</span>
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-indigo-600" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handlePlanClick}
                    className={`w-full h-12 ${plan.popular ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-muted hover:bg-muted/80 text-foreground'}`}
                  >
                    {plan.name === "Free" && isLoggedIn ? "Go to Dashboard" : (isLoggedIn && plan.name !== "Free" ? "Upgrade Plan" : plan.buttonText)}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
