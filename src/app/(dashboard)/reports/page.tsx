"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { FileText, Download, Loader2, Calendar, BookOpen } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

export default function ReportsPage() {
  const [experiments, setExperiments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createSupabaseClient();

  useEffect(() => {
    async function loadExperiments() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('experiments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setExperiments(data);
      }
      setIsLoading(false);
    }

    loadExperiments();
  }, []);

  const handleDownload = (path: string) => {
    // Note: If buckets are private, you'd need a signed URL. 
    // Assuming public or using getPublicUrl as instructed in backend:
    const { data } = supabase.storage.from('labreports').getPublicUrl(path);
    if (data?.publicUrl) {
      window.open(data.publicUrl, '_blank');
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Reports</h1>
          <p className="text-muted-foreground mt-2 text-slate-500">
            View, edit, and download your generated lab reports.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      ) : experiments.length === 0 ? (
        <div className="grid gap-6 bg-white p-12 rounded-xl border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <FileText className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700">No reports generated yet</h3>
          <p className="text-slate-500 mt-2">Head over to the Lab Report Generator to create your first experiment report.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiments.map((exp) => (
            <Card key={exp.id} className="shadow-sm border-slate-200 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                <CardTitle className="text-lg text-slate-800 line-clamp-1">{exp.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1 line-clamp-1">
                  <BookOpen className="h-3.5 w-3.5" />
                  {exp.subject || 'General Science'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 pb-2">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(exp.created_at).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </div>
                <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                  {exp.aim || exp.description || 'No description provided.'}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-50">
                {exp.report_path ? (
                  <Button
                    variant="outline"
                    className="w-full text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                    onClick={() => handleDownload(exp.report_path)}
                  >
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                ) : (
                  <Button variant="secondary" className="w-full cursor-not-allowed" disabled>
                    PDF not generated
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
