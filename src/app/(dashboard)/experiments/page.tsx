"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { UploadReportButton } from "@/components/UploadReportButton";

export default function ExperimentsPage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Experiments</h1>
          <p className="text-muted-foreground mt-2 text-slate-500">
            Create and manage your lab experiments here.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="mr-2 h-4 w-4" />
          New Experiment
        </Button>
      </div>
      
      <div className="grid gap-6 bg-white p-8 rounded-xl border border-slate-200">
        <div className="border border-slate-100 rounded-lg p-6 bg-slate-50">
           <h3 className="font-semibold text-lg text-slate-800 mb-2">Demo Setup: Simple Pendulum</h3>
           <p className="text-sm text-slate-500 mb-6">Attach your generated PDF report to this theoretical experiment record. Note: Ensure `labreports` bucket and policies are explicitly created in Supabase first.</p>
           
           <UploadReportButton experimentId="demo-exp-12345" />
        </div>
      </div>
    </div>
  );
}
