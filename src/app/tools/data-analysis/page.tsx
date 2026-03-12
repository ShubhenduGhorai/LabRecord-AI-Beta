"use client";

import { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Settings2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TrendingUp,
  Play,
  AlertCircle,
  Upload,
  Table as TableIcon,
  Download,
  Trash2,
  Plus,
  RefreshCw,
  Activity,
  Database,
  FileText,
  ScatterChart,
  LineChart as LineChartIcon,
  BarChart3,
  Loader2,
  Zap,
  Target,
  FlaskConical,
  HelpCircle,
  Sparkles,
  ChevronRight,
  Info,
  Layout
} from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  CategoryScale,
  BarElement
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import { ScientificMetric } from "@/components/ScientificMetric";
import { ToolNavigation } from "@/components/ToolNavigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(LinearScale, PointElement, LineElement, BarElement, CategoryScale, Tooltip, Legend);

interface DataPoint {
  x: string | number;
  y: string | number;
}

export default function DataAnalysisPage() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
  const [status, setStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [expDetails, setExpDetails] = useState({ name: "", subject: "", units: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCell = (index: number, field: 'x' | 'y', value: string) => {
    const newData = [...dataPoints];
    newData[index][field] = value;
    setDataPoints(newData);
    if (status === "completed") setStatus("idle");
  };

  const addRow = () => setDataPoints([...dataPoints, { x: "", y: "" }]);
  const removeRow = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
      if (status === "completed") setStatus("idle");
    }
  };

  const clearData = () => {
    setDataPoints([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
    setResults(null);
    setStatus("idle");
    setError(null);
  };

  const loadExample = () => {
    setExpDetails({ name: "Ohm's Law Verification", subject: "Physics", units: "V, A" });
    setDataPoints([
      { x: 1, y: 0.12 }, { x: 2, y: 0.24 }, { x: 3, y: 0.35 },
      { x: 4, y: 0.48 }, { x: 5, y: 0.61 }, { x: 6, y: 0.72 }
    ]);
    setStatus("idle");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        const valid = data.map(r => ({ x: r[0], y: r[1] })).filter(p => !isNaN(Number(p.x)) && !isNaN(Number(p.y)));
        setDataPoints(valid);
        setStatus("idle");
      } catch (err) {
        setError("Failed to parse file. Ensure it has two columns of numbers.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const runAIAnalysis = async () => {
    setError(null);
    setStatus("processing");
    setProcessingStep("Normalizing dataset...");

    try {
      await new Promise(r => setTimeout(r, 800));
      setProcessingStep("AI is generating your result...");
      await new Promise(r => setTimeout(r, 800));

      const csvData = Papa.unparse(dataPoints.filter(p => p.x !== "" && p.y !== ""));
      const prompt = `Analyze this scientific dataset:
${csvData}

Provide:
1. Mean and Standard Deviation
2. Linear Regression (slope, intercept, R-squared)
3. Correlation Coefficient
4. A brief scientific interpretation.

Respond in valid JSON format:
{
  "mean": 0,
  "stdDev": 0,
  "regression": { "slope": 0, "intercept": 0, "r2": 0 },
  "correlation": 0,
  "summary": "..."
}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tool: "data-analysis", 
          prompt: prompt
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");

      setResults(JSON.parse(data.result));
      setStatus("completed");
    } catch (err: any) {
      setError("AI service temporarily unavailable. Please try again.");
      setStatus("idle");
    }
  };

  const chartData = useMemo(() => {
    if (!results) return null;
    const x = dataPoints.map(p => Number(p.x)).filter(n => !isNaN(n));
    const y = dataPoints.map(p => Number(p.y)).filter(n => !isNaN(n));
    return {
      datasets: [
        {
          label: 'Observed Data',
          data: x.map((xv, i) => ({ x: xv, y: y[i] })),
          backgroundColor: '#6366f1',
          pointRadius: 6,
          pointHoverRadius: 8,
        },
        {
          label: 'AI Regression Fit',
          data: [
            { x: Math.min(...x), y: results.regression.slope * Math.min(...x) + results.regression.intercept },
            { x: Math.max(...x), y: results.regression.slope * Math.max(...x) + results.regression.intercept }
          ],
          borderColor: '#f43f5e',
          borderWidth: 3,
          showLine: true,
          pointRadius: 0,
        }
      ]
    };
  }, [results, dataPoints]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <ToolNavigation />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Advanced Tool Header */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -mr-12 -mt-12">
            <TrendingUp className="h-64 w-64 text-indigo-900" />
          </div>

          <div className="flex gap-6 items-start relative z-10">
            <div className="h-16 w-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 shrink-0">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">AI Data Analysis</h1>
              <p className="text-slate-500 font-medium mt-1 max-w-lg">Upload experimental datasets, extract statistical insights, and generate regression models automatically.</p>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl h-10 border-slate-200 font-bold px-4">
                  <Upload className="h-4 w-4 mr-2" /> Upload Dataset
                </Button>
                <Button variant="ghost" size="sm" onClick={loadExample} className="rounded-xl h-10 text-indigo-600 font-bold">
                  <Database className="h-4 w-4 mr-2" /> Example Experiment
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><HelpCircle className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Status</p>
              <p className="text-xs font-bold text-emerald-600">AI Core Ready</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center border border-slate-200">
              <Activity className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">

          {/* Smart Input Panel (Left) */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-slate-200 shadow-xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Settings2 className="h-6 w-6 text-indigo-500" /> Experiment Config
                </CardTitle>
                <CardDescription>Structure your dataset for AI processing</CardDescription>
              </CardHeader>

              <CardContent className="p-8 space-y-8">
                {/* Dataset Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dataset Inventory</Label>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{dataPoints.length} Points</span>
                  </div>
                  <div className="bg-slate-50 rounded-2xl border border-slate-100 p-2 overflow-hidden">
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar">
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-slate-200">
                          {dataPoints.map((p, idx) => (
                            <tr key={idx} className="group">
                              <td className="p-1"><Input value={p.x} onChange={(e) => updateCell(idx, 'x', e.target.value)} className="h-9 border-none bg-white/50 rounded-lg text-center font-bold" placeholder="X" /></td>
                              <td className="p-1"><Input value={p.y} onChange={(e) => updateCell(idx, 'y', e.target.value)} className="h-9 border-none bg-white/50 rounded-lg text-center font-bold" placeholder="Y" /></td>
                              <td className="p-1 w-8">
                                <Button variant="ghost" size="icon" onClick={() => removeRow(idx)} className="h-8 w-8 text-slate-200 group-hover:text-rose-500"><Trash2 className="h-3 w-3" /></Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button variant="ghost" onClick={addRow} className="w-full h-10 text-indigo-600 hover:bg-white transition-all text-[10px] font-black uppercase tracking-widest mt-2">
                      <Plus className="h-3 w-3 mr-2" /> Insert Row
                    </Button>
                  </div>
                </div>

                {/* Experiment Details */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experiment Metadata</Label>
                  <div className="grid gap-3">
                    <Input placeholder="Experiment Name" value={expDetails.name} onChange={e => setExpDetails({ ...expDetails, name: e.target.value })} className="h-12 rounded-xl border-slate-200 px-4 text-xs font-semibold" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="Subject" value={expDetails.subject} onChange={e => setExpDetails({ ...expDetails, subject: e.target.value })} className="h-12 rounded-xl border-slate-200 px-4 text-xs font-semibold" />
                      <Input placeholder="Units (e.g. m/s)" value={expDetails.units} onChange={e => setExpDetails({ ...expDetails, units: e.target.value })} className="h-12 rounded-xl border-slate-200 px-4 text-xs font-semibold" />
                    </div>
                  </div>
                </div>

                {/* Engine Feedback */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Engine</p>
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={status}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                          status === "idle" ? "bg-slate-200 text-slate-500 border-slate-300" :
                            status === "processing" ? "bg-amber-100 text-amber-600 border-amber-200 animate-pulse" :
                              "bg-emerald-100 text-emerald-600 border-emerald-200"
                        )}
                      >
                        {status}
                      </motion.span>
                    </AnimatePresence>
                  </div>

                  {status === "processing" ? (
                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                        <Loader2 className="h-3 w-3 animate-spin text-indigo-600" /> {processingStep}
                      </p>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: 2.5 }}
                          className="bg-indigo-600 h-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      {status === "completed" ? "Analysis successful. Review insights in the results panel." : "Ready to analyze your dataset."}
                    </p>
                  )}
                </div>

                <Button
                  onClick={runAIAnalysis}
                  disabled={status === "processing"}
                  className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black uppercase tracking-[0.15em] rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group"
                >
                  {status === "processing" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
                  Generate Logic Model
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Advanced Results Panel (Right) */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex items-center gap-4 text-rose-600">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-black uppercase text-[10px] tracking-widest">Analysis Failure</p>
                    <p className="font-bold text-sm">{error}</p>
                  </div>
                </motion.div>
              ) : results ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Results Sub-Navigation */}
                  <div className="flex gap-4">
                    {["Statistical Summary", "Visualization", "AI Observations"].map(tab => (
                      <span key={tab} className="text-[10px] font-black uppercase tracking-widest text-slate-400">{tab}</span>
                    ))}
                  </div>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <ScientificMetric label="Model Slope" value={results.regression.slope.toFixed(4)} icon={<TrendingUp className="h-4 w-4" />} />
                    <ScientificMetric label="Intercept" value={results.regression.intercept.toFixed(4)} icon={<Target className="h-4 w-4" />} />
                    <ScientificMetric label="Correlation" value={results.correlation.toFixed(4)} icon={<Zap className="h-4 w-4" />} />
                    <ScientificMetric label="Variance" value={results.variance.toFixed(4)} icon={<Activity className="h-4 w-4" />} />
                  </div>

                  {/* Visualization Card */}
                  <Card className="rounded-[3rem] border-slate-200 shadow-2xl bg-white overflow-hidden p-8 md:p-12">
                    <div className="flex items-center justify-between mb-10">
                      <CardTitle className="text-xl flex items-center gap-3">
                        <ScatterChart className="h-6 w-6 text-indigo-500" /> Regression Workspace
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl"><Download className="h-4 w-4" /></Button>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl"><Layout className="h-4 w-4" /></Button>
                      </div>
                    </div>

                    <div className="h-[300px] md:h-[450px] relative">
                      <Scatter
                        data={chartData as any}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                              labels: { font: { weight: 'bold', size: 12 }, usePointStyle: true }
                            },
                            tooltip: {
                              backgroundColor: '#0f172a',
                              titleFont: { size: 14, weight: 'bold' },
                              bodyFont: { size: 12 },
                              padding: 12,
                              displayColors: false,
                            }
                          },
                          scales: {
                            x: { grid: { color: "#f1f5f9" }, title: { display: true, text: 'Independent Variable (X)', font: { size: 10, weight: 'bold' } } },
                            y: { grid: { color: "#f1f5f9" }, title: { display: true, text: 'Dependent Variable (Y)', font: { size: 10, weight: 'bold' } } }
                          }
                        }}
                      />
                    </div>

                    <div className="mt-12 p-10 bg-slate-900 rounded-[2.5rem] relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Sparkles className="h-24 w-24 text-white" />
                      </div>
                      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                        <div className="space-y-2">
                          <p className="text-[10px] text-indigo-300 font-black uppercase tracking-[0.3em]">AI Mathematical Model</p>
                          <h3 className="text-4xl font-black text-white font-mono tracking-tight underline decoration-indigo-500 underline-offset-8">
                            y = {results.regression.slope.toFixed(3)}x + {results.regression.intercept.toFixed(3)}
                          </h3>
                        </div>
                        <div className="max-w-xl mx-auto border-t border-white/10 pt-6">
                          <p className="text-sm text-slate-400 leading-relaxed italic">{results.summary}</p>
                        </div>
                        <div className="flex gap-4 pt-4">
                          <Link href="/tools/graph-generator">
                            <Button variant="secondary" className="h-10 px-6 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border-white/5 border capitalize">Optimize Visualization <ChevronRight className="h-4 w-4 ml-1" /></Button>
                          </Link>
                          <Link href="/tools/lab-report">
                            <Button variant="secondary" className="h-10 px-6 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-700 text-white border-none capitalize">Generate Report <ChevronRight className="h-4 w-4 ml-1" /></Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Insights Section */}
                  <div className="grid md:grid-cols-2 gap-6 pb-20">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-amber-50 rounded-xl flex items-center justify-center">
                          <Info className="h-5 w-5 text-amber-500" />
                        </div>
                        <h4 className="font-bold text-slate-800">Experimental Observations</h4>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">The AI identified a <strong>{(results.correlation * 100).toFixed(1)}%</strong> correspondence between variables, suggesting a {results.correlation > 0.8 ? "very strong" : "significant"} linear relationship.</p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                          <Zap className="h-5 w-5 text-indigo-500" />
                        </div>
                        <h4 className="font-bold text-slate-800">Next Logical Step</h4>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">Proceed to the <strong>Lab Report Writer</strong> to document these statistical findings into a formal academic manuscript.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40 bg-white">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="h-24 w-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"
                  >
                    <Activity className="h-12 w-12 text-slate-300" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-900">Workspace Inactive</h3>
                  <p className="text-sm mt-3 max-w-sm font-medium text-slate-500 italic">Insert your experimental data into the configuration panel and hit "Generate Logic Model" to initialize AI processing.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Footer Tools */}
      {results && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]"
        >
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /> Analysis Ready</span>
              <span className="flex items-center gap-2 text-slate-200">•</span>
              <span>{expDetails.name || "Untitled Experiment"}</span>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 rounded-xl font-bold text-xs capitalize"><Download className="h-4 w-4 mr-2" /> Export Dataset</Button>
              <Button variant="outline" className="flex-1 md:flex-none h-12 px-6 rounded-xl font-bold text-xs capitalize"><FileText className="h-4 w-4 mr-2" /> Save to Vault</Button>
              <Button className="flex-1 md:flex-none h-12 px-8 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-xs capitalize">Share Insights</Button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
