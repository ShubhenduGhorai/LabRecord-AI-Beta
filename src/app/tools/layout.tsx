import { checkSubscription } from "@/lib/subscriptionCheck";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Lock } from "lucide-react";

export default async function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Pass false to prevent the hard-redirect intercept
  const hasAccess = await checkSubscription(false);

  return (
    <div className="flex-1 w-full flex flex-col min-h-[calc(100vh-4rem)] relative">
      {!hasAccess && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-slate-100 animate-in zoom-in-95 duration-200 m-4">
            <div className="mx-auto w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Subscription Required</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              This feature requires an active subscription. Upgrade your plan to instantly unlock all premium tools, cloud storage, and automated generation suites.
            </p>
            <Link href="/pricing" className="block w-full">
              <Button className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
                Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      )}
      <div className={!hasAccess ? "pointer-events-none opacity-40 blur-sm h-full overflow-hidden flex-1" : "h-full flex-1"}>
        {children}
      </div>
    </div>
  );
}
