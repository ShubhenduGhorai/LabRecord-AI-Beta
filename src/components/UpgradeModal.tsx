"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import { Check, Sparkles, X, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSubscription } from "@/context/SubscriptionContext";

// ---------------------------------------------------------------------------
// PayPal inline button — renders inside the modal, no page redirect
// ---------------------------------------------------------------------------
const PAYPAL_CLIENT_ID =
  "AWAhvks8m67O_uy4XGScMaqDiWkha5RnP9VvCTlFsPPZuHSfOpQ5mPy10hSrjENyeR4KZC4yvUZOhuPV";
const PAYPAL_PLAN_ID = "P-34W2022987790400UNG2DXJY"; // Pro Yearly

type PaymentStep = "idle" | "processing" | "success" | "error";

function PayPalSubscribeButton({
  containerId,
  onSuccess,
  onError,
}: {
  containerId: string;
  onSuccess: (subscriptionID: string) => void;
  onError: (msg: string) => void;
}) {
  useEffect(() => {
    const render = () => {
      if (typeof window === "undefined" || !(window as any).paypal) return;
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = ""; // clear duplicates

      (window as any).paypal
        .Buttons({
          style: {
            shape: "rect",
            color: "gold",
            layout: "vertical",
            label: "subscribe",
            height: 48,
          },
          createSubscription(_data: any, actions: any) {
            return actions.subscription.create({ plan_id: PAYPAL_PLAN_ID });
          },
          onApprove(data: any) {
            onSuccess(data.subscriptionID);
          },
          onError(err: any) {
            console.error("PayPal error:", err);
            onError("Payment failed. Please try again.");
          },
        })
        .render(`#${containerId}`);
    };

    if ((window as any).paypal) {
      render();
    } else {
      const timer = setInterval(() => {
        if ((window as any).paypal) {
          render();
          clearInterval(timer);
        }
      }, 400);
      return () => clearInterval(timer);
    }
  }, [containerId, onSuccess, onError]);

  return <div id={containerId} className="w-full min-h-[55px]" />;
}

// ---------------------------------------------------------------------------
// Plans config
// ---------------------------------------------------------------------------
const MODAL_PLANS = [
  {
    id: "free",
    name: "Free",
    price: "₹0",
    per: "/month",
    description: "Get started at no cost",
    features: ["3 reports per month", "AI Lab Report Writer", "Data Analysis", "Graph Generator"],
    cta: "Current Plan",
    isFree: true,
    popular: false,
  },
  {
    id: "pro_yearly",
    name: "Pro",
    price: "$7",
    per: "/month",
    sub: "Billed $84/year",
    description: "Unlimited access to everything",
    features: [
      "Unlimited reports",
      "AI Lab Report Writer",
      "Priority AI processing",
      "PDF & DOCX Export",
      "Viva Preparation",
      "Research Formatting",
    ],
    cta: "Upgrade to Pro",
    isFree: false,
    popular: true,
  },
  {
    id: "pro_yearly_alt",
    name: "Yearly",
    price: "$59",
    per: "/year",
    sub: "Best value — save 30%",
    description: "One payment, full year access",
    features: [
      "Everything in Pro",
      "One-time annual billing",
      "Priority support",
      "Early feature access",
    ],
    cta: "Get Yearly",
    isFree: false,
    popular: false,
  },
];

// ---------------------------------------------------------------------------
// Main UpgradeModal
// ---------------------------------------------------------------------------
export function UpgradeModal() {
  const { isUpgradeOpen, closeUpgradeModal, currentPlan, refreshSubscription } =
    useSubscription();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Reset state when modal closes
  useEffect(() => {
    if (!isUpgradeOpen) {
      setSelectedPlan(null);
      setPaymentStep("idle");
      setErrorMsg("");
    }
  }, [isUpgradeOpen]);

  const handlePayPalSuccess = useCallback(
    async (subscriptionID: string) => {
      setPaymentStep("processing");
      try {
        // 1. Verify subscription
        const verifyRes = await fetch("/api/paypal/verify-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscriptionID, planId: "pro_yearly" }),
        });

        if (!verifyRes.ok) throw new Error("Verification failed");

        // 2. Save subscription
        const saveRes = await fetch("/api/save-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription_id: subscriptionID }),
        });

        if (!saveRes.ok) throw new Error("Save failed");

        // 3. Refresh context + show success
        await refreshSubscription();
        setPaymentStep("success");

        // Auto-close after 2.5 s
        setTimeout(closeUpgradeModal, 2500);
      } catch (err: any) {
        setErrorMsg("Something went wrong. Please contact support.");
        setPaymentStep("error");
      }
    },
    [refreshSubscription, closeUpgradeModal]
  );

  const handlePayPalError = useCallback((msg: string) => {
    setErrorMsg(msg);
    setPaymentStep("error");
  }, []);

  if (!isUpgradeOpen) return null;

  const isPro = currentPlan === "pro";

  return (
    <>
      {/* Preload PayPal SDK once modal is open */}
      <Script
        src={`https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&vault=true&intent=subscription`}
        strategy="afterInteractive"
      />

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
        onClick={closeUpgradeModal}
        aria-hidden="true"
      />

      {/* Modal panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Upgrade your plan"
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white shadow-[0_32px_80px_rgba(0,0,0,0.18)] overflow-hidden"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 px-8 py-10 text-center text-white">
          <button
            onClick={closeUpgradeModal}
            className="absolute right-5 top-5 rounded-full p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <Sparkles className="mx-auto mb-3 h-8 w-8 text-indigo-300" />
          <h2 className="text-2xl font-black tracking-tight">
            {isPro ? "You're on Pro ✅" : "Upgrade Your Plan"}
          </h2>
          <p className="mt-2 text-indigo-200 text-sm">
            {isPro
              ? "You have full access to all LabRecord AI tools."
              : "Unlock unlimited reports, priority AI, and full export capabilities."}
          </p>
        </div>

        {/* Success state */}
        {paymentStep === "success" && (
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <h3 className="text-2xl font-black text-slate-900">Pro Active ✅</h3>
            <p className="text-slate-500 font-medium">
              Your subscription is now live. Enjoy unlimited access!
            </p>
          </div>
        )}

        {/* Processing state */}
        {paymentStep === "processing" && (
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-16 text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="text-slate-700 font-semibold">Activating your subscription…</p>
          </div>
        )}

        {/* Plans grid */}
        {(paymentStep === "idle" || paymentStep === "error") && (
          <div className="p-6">
            {paymentStep === "error" && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium text-center">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MODAL_PLANS.map((plan) => {
                const isCurrentPlan = isPro && !plan.isFree && plan.id !== "pro_yearly_alt";
                const isSelected = selectedPlan === plan.id;

                return (
                  <div
                    key={plan.id}
                    className={cn(
                      "relative flex flex-col rounded-2xl border-2 p-5 transition-all duration-200",
                      plan.popular
                        ? "border-indigo-500 shadow-lg shadow-indigo-100"
                        : "border-slate-200",
                      isSelected && !plan.isFree ? "ring-2 ring-indigo-500 ring-offset-1" : "",
                      plan.isFree ? "opacity-70" : "cursor-pointer hover:border-indigo-400"
                    )}
                    onClick={() => {
                      if (!plan.isFree && !isPro) setSelectedPlan(plan.id);
                    }}
                  >
                    {/* Popular badge */}
                    {plan.popular && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2">
                        <span className="inline-block rounded-b-xl bg-indigo-600 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-white shadow">
                          Most Popular
                        </span>
                      </div>
                    )}

                    <div className="mt-3 text-center">
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">
                        {plan.name}
                      </p>
                      <div className="mt-2 flex items-baseline justify-center gap-0.5">
                        <span className="text-4xl font-black text-slate-900">{plan.price}</span>
                        <span className="text-xs font-bold text-slate-400">{plan.per}</span>
                      </div>
                      {plan.sub && (
                        <p className="mt-1 text-[11px] font-bold text-indigo-500 uppercase tracking-wider">
                          {plan.sub}
                        </p>
                      )}
                    </div>

                    <ul className="mt-5 flex-1 space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="h-4 w-4 shrink-0 text-indigo-500 mt-0.5" />
                          <span className="text-xs font-semibold text-slate-600">{f}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA area */}
                    <div className="mt-5">
                      {plan.isFree ? (
                        <Button
                          disabled
                          className="w-full h-11 rounded-xl bg-slate-100 text-slate-400 font-black uppercase tracking-widest text-xs"
                        >
                          {isPro ? "Free Tier" : "Current Plan"}
                        </Button>
                      ) : isCurrentPlan ? (
                        <Button
                          disabled
                          className="w-full h-11 rounded-xl bg-emerald-50 text-emerald-600 font-black uppercase tracking-widest text-xs border border-emerald-200"
                        >
                          Active ✅
                        </Button>
                      ) : (
                        <>
                          {/* Show PayPal button when this plan card is selected */}
                          {isSelected ? (
                            <div className="space-y-2">
                              <PayPalSubscribeButton
                                containerId={`paypal-modal-${plan.id}`}
                                onSuccess={handlePayPalSuccess}
                                onError={handlePayPalError}
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPlan(null);
                                }}
                                className="text-xs text-slate-400 hover:text-slate-600 w-full text-center"
                              >
                                ← Choose different plan
                              </button>
                            </div>
                          ) : (
                            <Button
                              className={cn(
                                "w-full h-11 rounded-xl font-black uppercase tracking-widest text-xs",
                                plan.popular
                                  ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                                  : "bg-slate-900 hover:bg-black text-white"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlan(plan.id);
                              }}
                            >
                              {plan.cta}
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="mt-5 text-center text-[11px] text-slate-400 font-medium">
              Secure payment via PayPal · Cancel anytime · No hidden fees
            </p>
          </div>
        )}
      </div>
    </>
  );
}
