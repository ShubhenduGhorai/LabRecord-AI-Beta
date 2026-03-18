"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  FlaskConical, 
  FileText, 
  X,
  Database,
  Calculator,
  Settings,
  LogOut,
  Beaker,
  Menu,
  Zap
} from "lucide-react";
import { useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { useSubscription } from "@/context/SubscriptionContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createSupabaseClient();
  const { currentPlan, isActive, openUpgradeModal } = useSubscription();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Experiments", href: "/experiments", icon: FlaskConical },
    { name: "Analysis Studio", href: "/tools/data-analysis", icon: Calculator },
    { name: "My Reports", href: "/reports", icon: FileText },
    { name: "Experiment Vault", href: "/storage", icon: Database },
    { name: "Account Settings", href: "/settings", icon: Settings },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-slate-50 border-r py-6">
      <Link href="/" className="flex items-center gap-2 px-6 mb-10 hover:opacity-80 transition-opacity">
        <Beaker className="h-6 w-6 text-indigo-600" />
        <span className="text-xl font-bold tracking-tight text-slate-900">
          LabRecord AI
        </span>
      </Link>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={() => setIsOpen(false)}>
              <span
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all group",
                  isActive
                    ? "bg-indigo-100 text-indigo-900"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                  )}
                />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto space-y-2">
        {/* Upgrade button — only shown for free users */}
        {!isActive && (
          <Button
            onClick={() => { openUpgradeModal(); setIsOpen(false); }}
            className="w-full justify-start gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-6 shadow-md shadow-indigo-200"
          >
            <Zap className="h-5 w-5" />
            Upgrade to Pro
          </Button>
        )}
        {isActive && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Pro Active ✅</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          onClick={handleLogout}
          className="w-full justify-start text-slate-600 hover:text-red-600 hover:bg-red-50 py-6"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="md:hidden flex items-center justify-between border-b p-4 bg-white sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Beaker className="h-6 w-6 text-indigo-600" />
          <span className="text-xl font-bold tracking-tight text-slate-900">LabRecord</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>
    </>
  );
}
