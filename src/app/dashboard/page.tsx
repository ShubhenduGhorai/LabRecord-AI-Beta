"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plus, FileText, Download, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const recentReports = [
    { id: 1, title: "Physics Lab: Conservation of Momentum", date: "Oct 24, 2024" },
    { id: 2, title: "Chemistry Lab: Titration Analysis", date: "Oct 18, 2024" },
    { id: 3, title: "Engineering Lab: Material Stress Test", date: "Oct 12, 2024" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-muted-foreground mt-2">Here's an overview of your recent lab experiments.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Create Experiment Card */}
        <Card className="md:col-span-2 border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <CardHeader>
            <CardTitle>Create New Report</CardTitle>
            <CardDescription>
              Upload your raw lab dataset and let AI generate your complete report.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-8 pb-10">
            <Link href="/dashboard/generate" className="w-full max-w-sm">
              <Button className="w-full h-16 text-lg shadow-lg shadow-indigo-500/20 bg-indigo-600 hover:bg-indigo-700">
                <Plus className="mr-2 h-6 w-6" />
                New Experiment
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Usage Limit Card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Usage Plan</CardTitle>
            <CardDescription>Free Student Plan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Reports Generated</span>
                <span className="text-muted-foreground">3 / 3</span>
              </div>
              <Progress value={100} className="h-2 bg-slate-100" />
            </div>
            <p className="text-xs text-muted-foreground pt-2">
              You've hit your free limit. Upgrade to unlock unlimited reports and AI Viva Prep.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/dashboard/pricing" className="w-full">
              <Button variant="outline" className="w-full font-semibold text-indigo-700 border-indigo-200 bg-indigo-50 hover:bg-indigo-100">
                Upgrade to Pro
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Recent Reports</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentReports.map((report) => (
            <Card key={report.id} className="shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="p-2 bg-indigo-50 rounded-lg group-hover:bg-indigo-100 transition-colors">
                    <FileText className="h-5 w-5 text-indigo-600" />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <CardTitle className="text-base mt-2 line-clamp-2 leading-tight">
                  {report.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Clock className="mr-1 h-3 w-3" />
                  {report.date}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
