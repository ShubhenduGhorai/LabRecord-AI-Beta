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
      
      const { data: sub } = await supabase.from('subscriptions').select('status').eq('user_id', user.id).single();
      if (sub?.status === 'active') {
        setHasSubscription(true);
        return;
      }
      const { data: legacy } = await supabase.from('users').select('subscription_status').eq('id', user.id).single();
      if (legacy?.subscription_status === 'active') {
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
      icon: <LineChart className="h-6 w-6 text-indigo-500" />,
      href: "/tools/data-analysis",
      color: "border-indigo-200 bg-indigo-50",
      isPremium: false,
    },
    {
      title: "Graph Generator",
      description: "Visualize data with interactive charts and auto-calculated regressions.",
      icon: <BarChart2 className="h-6 w-6 text-blue-500" />,
      href: "/tools/graph-generator",
      color: "border-blue-200 bg-blue-50",
      isPremium: false,
    },
    {
      title: "AI Lab Report Writer",
      description: "Draft comprehensive academic reports including theories and procedures.",
      icon: <FileText className="h-6 w-6 text-emerald-500" />,
      href: "/tools/lab-report",
      color: "border-emerald-200 bg-emerald-50",
      isPremium: false,
    },
    {
      title: "Viva Preparation",
      description: "Generate potential viva questions and answers based on your findings.",
      icon: <BadgeHelp className="h-6 w-6 text-amber-500" />,
      href: "/tools/viva-prep",
      color: "border-amber-200 bg-amber-50",
      isPremium: true,
    },
    {
      title: "Research Formatting",
      description: "Auto-format documents to comply with strict academic publishing layouts.",
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      href: "/tools/research-format",
      color: "border-purple-200 bg-purple-50",
      isPremium: true,
    },
    {
      title: "Cloud Storage",
      description: "Securely save, organize, and access all your generated PDF reports.",
      icon: <HardDrive className="h-6 w-6 text-slate-500" />,
      href: "/tools/storage",
      color: "border-slate-200 bg-slate-50",
      isPremium: false,
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
          <Card key={idx} className="relative flex flex-col hover:shadow-lg transition-shadow border-slate-200">
            <CardHeader className={`pb-4 border-b ${tool.color}`}>
              <div className="p-2 bg-white rounded-lg w-fit mb-3 shadow-sm border border-slate-100">
                {tool.icon}
              </div>
              <CardTitle className="text-xl">{tool.title}</CardTitle>
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
                    className={`w-full font-semibold flex items-center justify-between ${
                      hasSubscription === false && tool.isPremium
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
