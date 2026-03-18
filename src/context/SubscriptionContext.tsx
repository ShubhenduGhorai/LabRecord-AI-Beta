"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";

export type Plan = "free" | "pro";

interface SubscriptionState {
  currentPlan: Plan;
  isActive: boolean;
  isLoading: boolean;
  isUpgradeOpen: boolean;
  openUpgrade: () => void;
  closeUpgrade: () => void;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [currentPlan, setCurrentPlan] = useState<Plan>("free");
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const supabase = createSupabaseClient();

  const fetchSubscription = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setCurrentPlan("free");
        setIsActive(false);
        return;
      }

      // Check subscriptions table first
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("status, plan_name")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (sub) {
        setCurrentPlan("pro");
        setIsActive(true);
        return;
      }

      // Fallback: users table
      const { data: userData } = await supabase
        .from("users")
        .select("plan, subscription_status")
        .eq("id", user.id)
        .single();

      if (userData?.plan === "pro" || userData?.subscription_status === "active") {
        setCurrentPlan("pro");
        setIsActive(true);
      } else {
        setCurrentPlan("free");
        setIsActive(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const openUpgrade = useCallback(() => setIsUpgradeOpen(true), []);
  const closeUpgrade = useCallback(() => setIsUpgradeOpen(false), []);
  const refreshSubscription = useCallback(async () => {
    await fetchSubscription();
  }, [fetchSubscription]);

  return (
    <SubscriptionContext.Provider
      value={{
        currentPlan,
        isActive,
        isLoading,
        isUpgradeOpen,
        openUpgrade,
        closeUpgrade,
        refreshSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
  return ctx;
}
