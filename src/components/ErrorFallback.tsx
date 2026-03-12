"use client";

import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ErrorFallbackProps {
  error: string | null;
  reset?: () => void;
}

export function ErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="p-4 bg-red-50 rounded-full border border-red-100 shadow-sm shadow-red-200/50">
        <AlertCircle className="h-10 w-10 text-red-500" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Something went wrong</h2>
        <p className="text-slate-500 max-w-md mx-auto">
          {error || "We encountered an unexpected error while processing your request. Please try again or return to the dashboard."}
        </p>
      </div>

      <div className="flex items-center gap-4">
        {reset && (
          <Button 
            onClick={reset}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md shadow-indigo-100"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        )}
        <Link href="/dashboard">
          <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 font-medium">
            <Home className="mr-2 h-4 w-4" /> Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
