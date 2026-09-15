"use client";

import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { UpgradeModal } from "@/components/UpgradeModal";

/**
 * ClientProviders — thin "use client" wrapper so the root Server Component
 * layout.tsx can stay a server component while still providing client context
 * and rendering the global UpgradeModal once at app root.
 */
export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SubscriptionProvider>
      {children}
      {/* Single global instance — accessible from every page in the app */}
      <UpgradeModal />
    </SubscriptionProvider>
  );
}
