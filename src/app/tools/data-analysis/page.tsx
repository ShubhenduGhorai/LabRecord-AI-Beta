"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LineChart, Play, AlertCircle, TrendingUp, Target, DivideSquare, Activity, Crosshair } from "lucide-react";
import Papa from "papaparse";
import { ErrorFallback } from "@/components/ErrorFallback";

export default function DataAnalysisPage() {
  const [rawData, setRawData] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const handleAnalyze = async () => {
    setError(null);
    if (!rawData.trim()) {
      setError("Please paste raw data arrays first.");
      return;
    }

    setIsAnalyzing(true);
    setStats(null);

    try {
      const parsed = Papa.parse(rawData.trim(), { header: false });

      const x: string[] = [];
      const y: string[] = [];

      parsed.data.forEach((row: any) => {
        if (row.length >= 2 && !isNaN(Number(row[0])) && !isNaN(Number(row[1]))) {
          x.push(row[0]);
          y.push(row[1]);
        }
      });

      if (x.length < 2) {
        throw new Error("Analysis requires at least two valid numeric points (X, Y).");
      }

      const res = await fetch('/api/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y, isDemo: false })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Server failed to analyze dataset.");
      }

      setStats(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (error && !stats && !isAnalyzing) {
    return <ErrorFallback error={error} reset={() => setError(null)} />;
  }

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 w-full">
      <Card className="border-indigo-100 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
        <CardHeader className="pb-4 border-b border-indigo-50/50">
          <div className="flex justify-between items-start">
            <div>
              <div className="p-2 bg-indigo-100 rounded-lg w-fit mb-4">
                <LineChart className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-3xl font-bold">AI Data Analysis</CardTitle>
              <CardDescription className="text-lg mt-2">
                Paste raw experimental pairs (X, Y) to automatically extract regression slopes, standard deviations, and mapping errors.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Left Col: Input */}
            <div className="space-y-4">
              <label className="text-sm font-semibold text-slate-700 block">Raw Data Entry</label>
              <Textarea
                placeholder="X, Y&#10;0.5, 2.1&#10;1.0, 4.3&#10;1.5, 6.2"
                value={rawData}
                onChange={(e) => setRawData(e.target.value)}
                className="font-mono text-sm min-h-[300px] bg-white border-indigo-100 focus-visible:ring-indigo-500"
              />
              {error && (
                <div className="flex items-start gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {isAnalyzing ? "Processing..." : (
                  <>
                    <Play className="h-4 w-4 mr-2 fill-current" /> Run Statistical Analysis
                  </>
                )}
              </Button>
            </div>

            {/* Right Col: Output */}
            <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-indigo-500" /> Statistical Results
              </h3>

              {stats ? (
                <div className="space-y-4 fade-in animate-in">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 flex flex-col justify-center items-center text-center space-y-1">
                        <Target className="h-5 w-5 text-slate-400 mb-1" />
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Mean (μ)</p>
                        <p className="text-2xl font-bold text-indigo-900">{stats.mean}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col justify-center items-center text-center space-y-1">
                        <DivideSquare className="h-5 w-5 text-slate-400 mb-1" />
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Std Deviation (σ)</p>
                        <p className="text-2xl font-bold text-indigo-900">{stats.std_dev}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col justify-center items-center text-center space-y-1">
                        <TrendingUp className="h-5 w-5 text-slate-400 mb-1" />
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">M-Slope</p>
                        <p className="text-2xl font-bold text-emerald-600">{stats.slope}</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex flex-col justify-center items-center text-center space-y-1">
                        <Crosshair className="h-5 w-5 text-slate-400 mb-1" />
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Y-Intercept</p>
                        <p className="text-2xl font-bold text-indigo-900">{stats.intercept}</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-amber-50/50 border-amber-200">
                    <CardContent className="p-5 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-amber-900">Mean Absolute % Error</p>
                        <p className="text-sm text-amber-700 mt-1">Avgerage deviation from regression fit</p>
                      </div>
                      <div className="text-3xl font-bold text-amber-600">
                        {stats.error_percent}%
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <LineChart className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="text-center max-w-[200px]">Results will automatically display here.</p>
                </div>
              )}
            </div>

          </div>
        </CardContent>
      </Card>
    </div>
  );
}
