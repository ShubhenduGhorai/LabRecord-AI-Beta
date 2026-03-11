"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, FileText, Calculator } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { createSupabaseClient } from "@/lib/supabaseClient";

export function Hero() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createSupabaseClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  const ctaLink = isLoggedIn ? "/dashboard" : "/auth/signup";
  const ctaText = isLoggedIn ? "Go to Dashboard" : "Start Free";

  return (
    <section className="relative overflow-hidden pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 max-w-full overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-multiply" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] mix-blend-multiply" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50/50 px-3 py-1 text-sm text-indigo-800 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
            Built for engineering and science students
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6">
            Turn Raw Lab Data into <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
              Perfect Lab Reports
            </span>{" "}
            with AI
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Upload your experiment data and instantly generate graphs, calculations, conclusions, and a complete lab report ready for submission.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href={ctaLink} className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 w-full transition-all shadow-lg shadow-indigo-500/25">
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-semibold w-full border-indigo-200 hover:bg-indigo-50/50 text-indigo-900">
                Try Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto text-sm font-medium text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <BarChart3 className="h-4 w-4 text-indigo-500" />
              <span>Automatic Graphs</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Calculator className="h-4 w-4 text-blue-500" />
              <span>Error Analysis</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4 text-purple-500" />
              <span>AI Conclusions</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FileText className="h-4 w-4 text-indigo-500" />
              <span>PDF Export</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative mx-auto max-w-5xl"
        >
          <div className="rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden p-2">
            <div className="rounded-xl overflow-hidden border bg-background flex flex-col md:flex-row h-[400px] md:h-[600px] shadow-sm">
              <div className="w-full md:w-1/3 border-r bg-muted/30 p-4 space-y-4">
                <div className="h-8 bg-muted rounded-md w-1/2"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-2">
                      <div className="h-8 bg-background border rounded flex-1"></div>
                      <div className="h-8 bg-background border rounded flex-1"></div>
                    </div>
                  ))}
                </div>
                <div className="h-10 bg-indigo-100 border border-indigo-200 rounded-md flex items-center justify-center text-sm font-medium text-indigo-700 mt-4">
                  <Calculator className="h-4 w-4 mr-2" /> Calculating Errors...
                </div>
              </div>
              <div className="w-full md:w-2/3 p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-8 w-24 bg-gradient-to-r from-indigo-500 to-blue-500 rounded text-xs text-white flex items-center justify-center">Export PDF</div>
                </div>
                <div className="flex-1 flex flex-col gap-6">
                  <div className="flex-1 border rounded-lg bg-indigo-50/30 flex items-center justify-center relative overflow-hidden">
                    <svg className="w-full h-full text-indigo-200" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M0,100 Q25,80 50,50 T100,0" fill="none" stroke="currentColor" strokeWidth="2" />
                      <circle cx="25" cy="70" r="2" fill="#4f46e5" />
                      <circle cx="50" cy="50" r="2" fill="#4f46e5" />
                      <circle cx="75" cy="30" r="2" fill="#4f46e5" />
                      <circle cx="100" cy="0" r="2" fill="#4f46e5" />
                    </svg>
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
                  </div>
                  <div className="h-32 border rounded-lg p-4 bg-muted/20">
                    <div className="h-4 w-1/4 bg-muted rounded mb-3"></div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-muted/60 rounded"></div>
                      <div className="h-3 w-5/6 bg-muted/60 rounded"></div>
                      <div className="h-3 w-4/6 bg-muted/60 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
