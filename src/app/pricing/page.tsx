"use client";

import { motion } from "framer-motion";
import { Check, Award, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSubscription } from "@/context/SubscriptionContext";
import { PLANS } from "@/lib/plans";

/**
 * /pricing page — Pure marketing/SEO page.
 * Payment is handled entirely via the global UpgradeModal.
 * No inline PayPal buttons, no page redirects.
 */
export default function PricingPage() {
  const { openUpgrade } = useSubscription();

  return (
    <div className="min-h-screen bg-[#fcfcfc] py-20 px-4 flex flex-col items-center">
      {/* Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-black uppercase text-[10px] tracking-widest shadow-sm"
        >
          <Award className="w-3.5 h-3.5" /> Unlock Scientific Excellence
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 italic">
          Simple, Transparent <br className="hidden md:block" /> Pricing for Students.
        </h1>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">
          Start free or go Pro for unlimited access to every AI tool. No hidden fees.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl items-stretch px-4">
        {PLANS.map((plan) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative h-full"
          >
            <Card
              className={`relative h-full flex flex-col rounded-[3.5rem] p-4 border-slate-200 shadow-xl bg-white overflow-hidden transition-all duration-500 ${
                plan.popular ? "border-[#818cf8] border-[3px] shadow-2xl scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
                  <div className="bg-[#4338ca] text-white font-black px-10 py-2 text-[10px] uppercase tracking-[0.2em] rounded-b-2xl shadow-lg">
                    MOST POPULAR
                  </div>
                </div>
              )}

              <CardHeader className="text-center px-8 pt-16 pb-10">
                <CardTitle className="text-3xl font-bold uppercase tracking-tight mb-4 text-slate-900">
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-sm font-medium text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 px-10 pb-10">
                <div className="mb-10 text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-7xl font-bold text-slate-900">{plan.price}</span>
                    {plan.period && (
                      <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  {plan.billedYearly && (
                    <p className="text-sm text-[#6366f1] font-black mt-2 uppercase tracking-widest">
                      {plan.billedYearly}
                    </p>
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
                {plan.id === "free" ? (
                  <Button
                    onClick={() => (window.location.href = "/auth/signup")}
                    className="w-full h-16 rounded-2xl bg-[#111] hover:bg-black text-white font-black uppercase tracking-widest text-xs"
                  >
                    START FREE
                  </Button>
                ) : (
                  <Button
                    onClick={openUpgrade}
                    className="w-full h-16 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-200"
                  >
                    <Zap className="h-4 w-4" />
                    Upgrade to Pro →
                  </Button>
                )}
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="mt-12 text-center text-sm text-slate-400 font-medium">
        Secure payment via PayPal · Cancel anytime · No hidden fees
      </p>
    </div>
  );
}
