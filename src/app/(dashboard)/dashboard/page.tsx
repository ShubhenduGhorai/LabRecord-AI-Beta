"use client";

import { useEffect, useState } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LineChart, BarChart2, FileText, BadgeHelp, BookOpen, HardDrive, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [hasSubscription, setHasSubscription] = useState<boolean | null>(null);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function checkSub() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Admin Override
      if (user.email === "YOUR_GMAIL@gmail.com") {
        setHasSubscription(true);
        return;
      }

      const { data: sub } = await supabase.from('subscriptions').select('status, plan').eq('user_id', user.id).single();
      if (sub?.status === 'active' && sub?.plan === 'premium') {
        setHasSubscription(true);
        return;
      }
      const { data: legacy } = await supabase.from('users').select('subscription_status, plan').eq('id', user.id).single();
      if (legacy?.subscription_status === 'active' && legacy?.plan === 'premium') {
        setHasSubscription(true);
        return;
      }
      setHasSubscription(false);
    }
    checkSub();
  }, []);

  const tools = [
    {
      title: "AI Data Analysis",
      description: "Process experiment arrays and extract accurate statistical properties.",
      href: "/tools/data-analysis",
      color: "from-blue-600 to-cyan-500",
      isPremium: false,
      illustration: (
        <svg viewBox="0 0 400 160" className="w-full h-full">
          <defs>
            <linearGradient id="db-grad-analysis" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <rect width="400" height="160" fill="url(#db-grad-analysis)" />
          {/* Nodes and Lines */}
          <g className="group-hover:opacity-100 transition-opacity duration-500">
            <circle cx="100" cy="80" r="4" fill="#3b82f6" />
            <circle cx="200" cy="50" r="4" fill="#0ea5e9" />
            <circle cx="300" cy="110" r="4" fill="#06b6d4" />
            <line x1="100" y1="80" x2="200" y2="50" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="200" y1="50" x2="300" y2="110" stroke="#0ea5e9" strokeWidth="2" strokeDasharray="4 4" />
          </g>
          {/* Statistical lines */}
          <path d="M 50 130 L 120 100 L 180 110 L 250 40 L 350 70" fill="none" stroke="url(#line-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform duration-500" />
          <rect x="50" y="30" width="40" height="60" rx="4" fill="#ffffff" fillOpacity="0.6" stroke="#3b82f6" strokeWidth="1" />
          <rect x="58" y="40" width="24" height="4" rx="2" fill="#3b82f6" />
          <rect x="58" y="52" width="24" height="4" rx="2" fill="#e2e8f0" />
          <rect x="58" y="64" width="24" height="4" rx="2" fill="#e2e8f0" />
        </svg>
      )
    },
    {
      title: "Graph Generator",
      description: "Visualize data with interactive charts and auto-calculated regressions.",
      href: "/tools/graph-generator",
      color: "from-indigo-600 to-purple-600",
      isPremium: false,
      illustration: (
        <svg viewBox="0 0 400 160" className="w-full h-full">
          <defs>
            <linearGradient id="db-grad-graph" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="400" height="160" fill="url(#db-grad-graph)" />
          {/* Grid */}
          <g stroke="#ffffff" strokeWidth="1" strokeOpacity="0.4">
            <line x1="40" y1="0" x2="40" y2="160" />
            <line x1="120" y1="0" x2="120" y2="160" />
            <line x1="200" y1="0" x2="200" y2="160" />
            <line x1="280" y1="0" x2="280" y2="160" />
            <line x1="360" y1="0" x2="360" y2="160" />
            <line x1="0" y1="40" x2="400" y2="40" />
            <line x1="0" y1="80" x2="400" y2="80" />
            <line x1="0" y1="120" x2="400" y2="120" />
          </g>
          <path d="M 40 140 L 120 80 L 200 100 L 280 40 L 360 20" fill="none" stroke="#6366f1" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-purple-600 transition-colors duration-500" />
          <circle cx="120" cy="80" r="6" fill="#ffffff" stroke="#6366f1" strokeWidth="3" />
          <circle cx="280" cy="40" r="6" fill="#ffffff" stroke="#a855f7" strokeWidth="3" />
        </svg>
      )
    },
    {
      title: "AI Lab Report Writer",
      description: "Draft comprehensive academic reports including theories and procedures.",
      href: "/tools/lab-report",
      color: "from-violet-600 to-fuchsia-600",
      isPremium: false,
      illustration: (
        <svg viewBox="0 0 400 160" className="w-full h-full">
          <defs>
            <linearGradient id="db-grad-report" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#d946ef" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="400" height="160" fill="url(#db-grad-report)" />
          <g transform="translate(130, 20)">
            <rect width="140" height="120" rx="4" fill="#ffffff" />
            <rect x="20" y="20" width="100" height="6" rx="3" fill="#8b5cf6" fillOpacity="0.2" />
            <rect x="20" y="35" width="80" height="4" rx="2" fill="#f1f5f9" />
            <rect x="20" y="45" width="90" height="4" rx="2" fill="#f1f5f9" />
            <rect x="20" y="65" width="100" height="6" rx="3" fill="#d946ef" fillOpacity="0.2" />
            <rect x="20" y="80" width="70" height="4" rx="2" fill="#f1f5f9" />
            <rect x="20" y="90" width="85" height="4" rx="2" fill="#f1f5f9" />
            {/* Sparkle AI icon */}
            <path d="M 120 100 Q 120 110 130 110 Q 120 110 120 120 Q 120 110 110 110 Q 120 110 120 100" fill="#d946ef" />
          </g>
        </svg>
      )
    },
    {
      title: "Viva Preparation",
      description: "Generate potential viva questions and answers based on your findings.",
      href: "/tools/viva-prep",
      color: "from-rose-500 to-red-600",
      isPremium: true,
      illustration: (
        <svg viewBox="0 0 400 160" className="w-full h-full">
          <defs>
            <linearGradient id="db-grad-viva" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb7185" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="400" height="160" fill="url(#db-grad-viva)" />
          <g transform="translate(100, 30)">
            {/* Student circle */}
            <circle cx="40" cy="50" r="30" fill="#ffffff" />
            <circle cx="40" cy="40" r="10" fill="#fb7185" fillOpacity="0.3" />
            {/* AI circle */}
            <circle cx="160" cy="50" r="35" fill="#ffffff" fillOpacity="0.8" />
            <path d="M 150 40 Q 160 30 170 40 Q 160 50 150 40" fill="#ef4444" fillOpacity="0.5" />
            {/* Connecting dialog dots */}
            <circle cx="90" cy="50" r="3" fill="#cbd5e1" />
            <circle cx="110" cy="50" r="3" fill="#cbd5e1" />
          </g>
        </svg>
      )
    },
    {
      title: "Research Formatting",
      description: "Auto-format documents to comply with strict academic publishing layouts.",
      href: "/tools/research-format",
      color: "from-orange-500 to-amber-600",
      isPremium: true,
      illustration: (
        <svg viewBox="0 0 400 160" className="w-full h-full">
          <defs>
            <linearGradient id="db-grad-format" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="400" height="160" fill="url(#db-grad-format)" />
          <g transform="translate(140, 20)">
            <rect width="120" height="120" rx="2" fill="#ffffff" />
            {/* Columns structure */}
            <rect x="10" y="10" width="45" height="100" rx="1" fill="#f1f5f9" />
            <rect x="65" y="10" width="45" height="100" rx="1" fill="#f1f5f9" />
            {/* Formatting markers */}
            <rect x="15" y="20" width="30" height="3" rx="1.5" fill="#fb923c" fillOpacity="0.4" />
            <rect x="70" y="40" width="35" height="3" rx="1.5" fill="#f59e0b" fillOpacity="0.4" />
          </g>
        </svg>
      )
    },
    {
      title: "Cloud Storage",
      description: "Securely save, organize, and access all your generated PDF reports.",
      href: "/storage",
      color: "from-emerald-600 to-teal-600",
      isPremium: false,
      illustration: (
        <svg viewBox="0 0 400 160" className="w-full h-full">
          <defs>
            <linearGradient id="db-grad-storage" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#14b8a6" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <rect width="400" height="160" fill="url(#db-grad-storage)" />
          <g transform="translate(140, 40)">
            <path d="M 20 60 Q 20 20 60 20 Q 80 10 100 20 Q 120 20 120 60 L 20 60 Z" fill="#ffffff" />
            {/* Icon inside cloud */}
            <rect x="55" y="50" width="30" height="30" rx="4" fill="#34d399" fillOpacity="0.2" />
            <path d="M 60 65 L 70 75 L 80 65" fill="none" stroke="#14b8a6" strokeWidth="2" />
          </g>
        </svg>
      )
    }
  ];

  return (
    <div className="px-4 py-8 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Lab Suite Workspace</h1>
        <p className="text-muted-foreground mt-2 text-slate-500">
          Select a tool below to begin. Access requires an active premium subscription.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, idx) => (
          <Card key={idx} className="group relative flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-slate-200 overflow-hidden">
            <div className="w-full relative overflow-hidden h-32 bg-slate-50">
              {tool.illustration}
            </div>
            <CardHeader className="pb-4">
              <CardTitle className={`text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${tool.color}`}>
                {tool.title}
              </CardTitle>
              <CardDescription className="text-slate-600 mt-2 line-clamp-2 min-h-[40px]">
                {tool.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pt-6 pb-2">
              {hasSubscription === false && tool.isPremium && (
                <div className="flex items-center gap-2 text-sm text-slate-700 font-medium bg-slate-100 p-2 rounded-md mb-2 border border-slate-200">
                  <Lock className="h-4 w-4 text-slate-500" />
                  Premium Feature
                </div>
              )}
            </CardContent>
            <CardFooter className="pt-2 pb-6">
              <Link href={hasSubscription === false && tool.isPremium ? "/pricing" : tool.href} className="w-full">
                <Button
                  variant={hasSubscription === false && tool.isPremium ? "outline" : "default"}
                  className={`w-full font-semibold flex items-center justify-between ${hasSubscription === false && tool.isPremium
                      ? "text-slate-700 hover:bg-slate-50"
                      : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200"
                    }`}
                >
                  {hasSubscription === false && tool.isPremium ? "Unlock Feature" : "Open Tool"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
