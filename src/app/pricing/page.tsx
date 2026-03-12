"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  Zap, 
  Sparkles, 
  Lock, 
  ArrowRight, 
  Users, 
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  BarChart3,
  FileText,
  FlaskConical,
  Award
} from "lucide-react";
import { PLANS as plans } from "@/lib/plans";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  
  // Scarcity counts (simulated for demo, in production these would come from DB)
  const claimedCount = 142;
  const totalSlots = 200;
  const progressPercentage = (claimedCount / totalSlots) * 100;

  const supabase = createSupabaseClient();

  useEffect(() => {
    async function fetchUserPlan() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoadingData(false);
        return;
      }

      const { data: sub } = await supabase.from("subscriptions").select("plan_name, status").eq("user_id", user.id).single();
      if (sub && sub.status === 'active') {
        setCurrentPlan(sub.plan_name);
      } else {
        const { data } = await supabase.from("users").select("plan").eq("id", user.id).single();
        if (data) setCurrentPlan(data.plan);
      }
      setLoadingData(false);
    }
    fetchUserPlan();
  }, []);

  const handleSubscribe = async (plan: any) => {
    try {
      setLoadingPriceId(plan.id);
      
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          planId: plan.id,
          amount: plan.amount,
          currency: "USD" 
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
          description: `Subscription: ${plan.name} Plan`,
          order_id: orderData.id,
          handler: function (response: any) {
             window.location.href = "/billing?payment_id=" + response.razorpay_payment_id;
          },
          prefill: { name: "", email: "", contact: "" },
          theme: { color: "#4f46e5" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else {
        throw new Error("Razorpay SDK not loaded");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setLoadingPriceId(null);
    }
  };

  if (loadingData) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-20 px-4 flex flex-col items-center">
      
      {/* Header Section */}
      <div className="text-center space-y-6 max-w-4xl mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 font-black uppercase text-[10px] tracking-widest shadow-sm"
        >
          <Award className="w-3.5 h-3.5" /> Unlock Scientific Excellence
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 italic"
        >
          Simple, Transparent <br className="hidden md:block"/> Pricing for Students.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed"
        >
          One platform replaces your fragmented workflow. Save hours of manual data entry and formatting.
        </motion.p>
      </div>

      {/* Scarcity Countdown */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-lg mb-16 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-indigo-100/20 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              <p className="font-black uppercase text-xs tracking-widest text-slate-900">Early Access Discount</p>
           </div>
           <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">Limited Offer</span>
        </div>
        <div className="flex justify-between items-end mb-2">
           <p className="text-sm font-bold text-slate-500">Only for first 200 students</p>
           <p className="text-sm font-black text-indigo-600">{claimedCount} / {totalSlots} claimed</p>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner flex">
           <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${progressPercentage}%` }} 
            transition={{ duration: 1.5, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 relative"
           >
              <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
           </motion.div>
        </div>
      </motion.div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl items-stretch">
        {plans.map((plan: any) => {
          const isPro = plan.id === 'pro';
          const isCurrent = currentPlan === plan.id || (!currentPlan && plan.id === 'free');

          return (
            <motion.div 
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: isPro ? 0.5 : 0.4 }}
              className="h-full"
            >
              <Card 
                className={cn(
                  "relative h-full flex flex-col rounded-[3rem] p-4 transition-all duration-500",
                  isPro 
                    ? "border-4 border-indigo-600 shadow-3xl shadow-indigo-200/50 scale-[1.02] bg-white" 
                    : "border-2 border-slate-100 shadow-xl shadow-slate-200/50 bg-white/50"
                )}
              >
                {isPro && (
                  <>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                      <Badge className="bg-indigo-600 text-white border-0 font-black px-6 py-2 text-[10px] uppercase tracking-[0.2em] shadow-2xl rounded-xl">
                        BEST DEAL
                      </Badge>
                    </div>
                    <div className="absolute top-6 right-6">
                       <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200">
                         {plan.discount}
                       </div>
                    </div>
                  </>
                )}

                <CardHeader className="text-center px-10 pt-16 pb-10">
                  <CardTitle className="text-3xl font-black uppercase italic tracking-tight mb-4 text-slate-900">
                    {plan.name} Plan
                  </CardTitle>
                  
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-6xl font-black tracking-tighter text-slate-900">{plan.price}</span>
                      {plan.period && <span className="text-slate-400 font-bold uppercase text-xs tracking-widest">{plan.period}</span>}
                    </div>
                    {plan.originalPrice && (
                       <p className="text-slate-400 font-bold line-through text-sm">{plan.originalPrice}</p>
                    )}
                    {plan.monthlyEquivalent && (
                       <p className="text-indigo-600 font-black text-xs uppercase tracking-widest mt-2">{plan.monthlyEquivalent} billed yearly</p>
                    )}
                  </div>
                  
                  <CardDescription className="pt-8 text-sm font-bold text-slate-500 max-w-[240px] mx-auto uppercase tracking-tighter">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 px-10 pb-10">
                  <div className="space-y-6">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Included Features</p>
                    <ul className="space-y-4">
                      {plan.features.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-4 text-sm">
                          <div className={cn(
                            "mt-0.5 rounded-full p-1 shrink-0", 
                            isPro ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'
                          )}>
                            <Check className="h-3 w-3 stroke-[4]" />
                          </div>
                          <span className="text-slate-700 font-bold leading-tight">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter className="px-10 pb-10">
                  <Button 
                    onClick={() => plan.id !== 'free' && handleSubscribe(plan)}
                    disabled={isCurrent || loadingPriceId === plan.id}
                    className={cn(
                      "w-full h-20 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs transition-all shadow-xl active:scale-95",
                      isPro 
                        ? "bg-slate-900 hover:bg-black text-white shadow-indigo-200" 
                        : "bg-white border-2 border-slate-100 text-slate-400 hover:bg-slate-50 hover:border-slate-200"
                    )}
                  >
                    {isCurrent ? "Active Plan" : 
                     loadingPriceId === plan.id ? (
                        <div className="flex items-center gap-2">
                           <div className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                           Initializing...
                        </div>
                     ) : (plan.id === 'free' ? "Get Started Free" : "Upgrade to Pro")}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Comparison Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-32 w-full max-w-4xl space-y-12"
      >
        <div className="text-center space-y-4">
           <h2 className="text-3xl font-black uppercase tracking-tight italic">Why Upgrade?</h2>
           <p className="text-slate-500 font-medium">LabRecord AI replaces your entire fragmented toolkit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <Card className="rounded-[2.5rem] bg-slate-900 p-8 border-none text-white shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-6">Traditional Workflow</p>
              <div className="space-y-4">
                 <OldTool name="Excel / Sheets" cost="$10/mo" icon={<TrendingUp className="w-4 h-4" />} />
                 <OldTool name="Graphing Tools" cost="$15/mo" icon={<BarChart3 className="w-4 h-4" />} />
                 <OldTool name="Generic AI Tools" cost="$20/mo" icon={<Sparkles className="w-4 h-4" />} />
                 <OldTool name="Academic Formatters" cost="$5/mo" icon={<FileText className="w-4 h-4" />} />
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center font-black">
                 <span className="uppercase text-xs tracking-widest text-white/50">Total Est. Cost</span>
                 <span className="text-2xl text-rose-500">$50 / month</span>
              </div>
           </Card>

           <div className="space-y-8">
              <ValuePoint 
                title="All-in-One Engine" 
                desc="Scientific analysis, graph generation, and academic report writing in one unified workspace." 
                icon={<Zap className="w-6 h-6 text-indigo-600" />}
              />
              <ValuePoint 
                title="Precision Engineered" 
                desc="Unlike generic AI, LabRecord is trained specifically for laboratory observations and technical theory." 
                icon={<CheckCircle2 className="w-6 h-6 text-indigo-600" />}
              />
              <ValuePoint 
                title="Massive Savings" 
                desc="At $8/month, you save 84% compared to subscribing to multiple fragmented tools." 
                icon={<FlaskConical className="w-6 h-6 text-indigo-600" />}
              />
           </div>
        </div>
      </motion.div>

      {/* Trust Footer */}
      <div className="mt-40 text-center space-y-8">
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Trusted by Science Students Globally</p>
         <div className="flex flex-wrap justify-center gap-12 grayscale opacity-30 pointer-events-none">
            <h4 className="text-xl font-black">Engineering</h4>
            <h4 className="text-xl font-black">Bioscience</h4>
            <h4 className="text-xl font-black">Medical</h4>
            <h4 className="text-xl font-black">Physics</h4>
         </div>
         <p className="text-[10px] text-slate-400 font-bold max-w-sm mx-auto">
            Secure payments via Razorpay. 14-day money-back guarantee. <br/>
            Cancel anytime within your dashboard.
         </p>
      </div>
    </div>
  );
}

function OldTool({ name, cost, icon }: { name: string, cost: string, icon: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center pb-2 border-b border-white/5 opacity-60">
       <div className="flex items-center gap-3">
          <div className="bg-white/5 p-2 rounded-lg">{icon}</div>
          <span className="text-sm font-bold">{name}</span>
       </div>
       <XCircle className="w-4 h-4 text-rose-500/50" />
    </div>
  );
}

function ValuePoint({ title, desc, icon }: { title: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="flex gap-5">
       <div className="h-12 w-12 rounded-2xl bg-white shadow-lg border border-slate-100 flex items-center justify-center shrink-0">
          {icon}
       </div>
       <div>
          <h4 className="font-black uppercase tracking-tight text-slate-900">{title}</h4>
          <p className="text-xs font-bold text-slate-500 leading-relaxed mt-1">{desc}</p>
       </div>
    </div>
  );
}
