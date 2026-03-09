"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";

export default function StoragePage() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Cloud Storage</h1>
          <p className="text-muted-foreground mt-2 text-slate-500">
            Manage your saved files, reports, and experiment data.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <UploadCloud className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>
      
      <div className="grid gap-6 bg-white p-8 rounded-xl border border-slate-200 text-center">
        <p className="text-slate-500">Your storage is empty.</p>
      </div>
    </div>
  );
}
