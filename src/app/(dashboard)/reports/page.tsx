"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ReportsPage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Reports</h1>
          <p className="text-muted-foreground mt-2 text-slate-500">
            View, edit, and download your generated lab reports.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 bg-white p-8 rounded-xl border border-slate-200 text-center">
        <p className="text-slate-500">No reports generated yet.</p>
      </div>
    </div>
  );
}
