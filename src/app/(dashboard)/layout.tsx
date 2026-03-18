import { Sidebar } from "@/components/DashboardSidebar";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import { UpgradeModal } from "@/components/UpgradeModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <div className="flex flex-col md:flex-row h-screen bg-white">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50/50">
            {children}
          </main>
        </div>
      </div>
      {/* Global upgrade modal — accessible from anywhere in the dashboard */}
      <UpgradeModal />
    </SubscriptionProvider>
  );
}
