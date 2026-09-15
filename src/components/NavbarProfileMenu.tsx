"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { User } from "@supabase/supabase-js";
import { Settings, LayoutDashboard, LogOut, ChevronDown, CreditCard, Zap } from "lucide-react";
import { useSubscription } from "@/context/SubscriptionContext";

export function NavbarProfileMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseClient();
  const { isActive, openUpgrade } = useSubscription();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!user) {
    return (
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <Link href="/auth/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors text-center py-3 md:py-0">
          Log in
        </Link>
        <Link href="/auth/signup" className="w-full md:w-auto">
          <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md shadow-indigo-500/20 transition-all rounded-md px-4 py-2 min-h-[44px] md:min-h-0">
            Get Started
          </button>
        </Link>
      </div>
    );
  }

  const getInitials = (email: string) => {
    return email ? email.charAt(0).toUpperCase() : "?";
  };

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <div className="relative pt-4 md:pt-0 border-t md:border-0">
      {/* Mobile view */}
      <div className="md:hidden flex flex-col space-y-2">
        <div className="flex items-center gap-3 px-2 py-3 mb-2 border-b border-slate-100">
          <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold overflow-hidden border border-slate-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(user.email || "")
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold truncate max-w-[200px]">{user.user_metadata?.full_name || user.email}</span>
            <span className="text-xs text-slate-500 truncate max-w-[200px]">
              {isActive ? "Pro Member ✅" : "Free Plan"}
            </span>
          </div>
        </div>
        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors">
          <LayoutDashboard className="w-4 h-4" /> My Reports
        </Link>
        {/* Billing — opens modal, no page navigation */}
        <button
          onClick={openUpgrade}
          className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors w-full text-left"
        >
          <CreditCard className="w-4 h-4" /> Billing & Subscription
        </button>
        <Link href="/settings" className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 rounded-lg transition-colors">
          <Settings className="w-4 h-4" /> Account Settings
        </Link>
        {!isActive && (
          <button
            onClick={openUpgrade}
            className="flex items-center gap-3 px-3 py-3 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg transition-colors w-full"
          >
            <Zap className="w-4 h-4" /> Upgrade to Pro
          </button>
        )}
        <button onClick={handleLogout} className="flex flex-row w-full items-center gap-3 px-3 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-2">
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>

      {/* Desktop view — dropdown */}
      <div className="hidden md:block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold overflow-hidden border border-slate-200">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              getInitials(user.email || "")
            )}
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="px-4 py-3 border-b border-slate-100 mb-1">
              <p className="text-sm font-medium text-slate-900 truncate">{user.user_metadata?.full_name || "Account"}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
              {isActive && (
                <span className="inline-block mt-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest">Pro Active ✅</span>
              )}
            </div>

            <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
              <LayoutDashboard className="w-4 h-4" /> My Reports
            </Link>

            {/* Billing — opens modal, no page navigation */}
            <button
              onClick={() => { setIsOpen(false); openUpgrade(); }}
              className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors w-full text-left"
            >
              <CreditCard className="w-4 h-4" /> Billing & Subscription
            </button>

            <Link href="/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors">
              <Settings className="w-4 h-4" /> Account Settings
            </Link>

            {!isActive && (
              <>
                <div className="border-t border-slate-100 my-1" />
                <button
                  onClick={() => { setIsOpen(false); openUpgrade(); }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-600 hover:bg-indigo-50 transition-colors w-full text-left"
                >
                  <Zap className="w-4 h-4" /> Upgrade to Pro
                </button>
              </>
            )}

            <div className="border-t border-slate-100 my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
