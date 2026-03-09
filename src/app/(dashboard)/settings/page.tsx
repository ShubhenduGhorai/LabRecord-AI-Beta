"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Account Settings</h1>
        <p className="text-muted-foreground mt-2 text-slate-500">
          Manage your profile and account preferences.
        </p>
      </div>

      <div className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Profile Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="John Doe" className="max-w-md" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="user@example.com" disabled className="max-w-md bg-slate-50" />
            <p className="text-xs text-slate-500">Email is tied to your authentication provider.</p>
          </div>
          
          <Button className="bg-indigo-600 hover:bg-indigo-700 mt-4">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
