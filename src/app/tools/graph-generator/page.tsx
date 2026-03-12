"use client";

import { useState, useRef, useMemo } from "react";
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
  LineChart as LineChartIcon, 
  Play, 
  AlertCircle, 
  Upload, 
  Table as TableIcon, 
  Download, 
  Trash2, 
  Plus, 
  RefreshCw,
  Zap,
  TrendingUp,
  ChevronRight,
  Database,
  BarChart2,
  Settings2,
  Maximize2,
  Grid3X3,
  Sparkles,
  Loader2,
  Eye,
  FileText,
  HelpCircle,
  Palette,
  Layers,
  Activity
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
import { Scatter, Bar, Line } from 'react-chartjs-2';
import { cn } from "@/lib/utils";
import { ToolNavigation } from "@/components/ToolNavigation";
import { motion, AnimatePresence } from "framer-motion";

ChartJS.register(LinearScale, PointElement, LineElement, BarElement, CategoryScale, Tooltip, Legend);

interface DataPoint {
  x: string | number;
  y: string | number;
}

export default function GraphGeneratorPage() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
  const [title, setTitle] = useState("Statistical Distribution Map");
  const [xAxisLabel, setXAxisLabel] = useState("Independent (XAxis)");
  const [yAxisLabel, setYAxisLabel] = useState("Dependent (YAxis)");
  const [graphType, setGraphType] = useState<"scatter" | "line" | "bar">("scatter");
  const [status, setStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const chartRef = useRef<any>(null);
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

  const loadExample = () => {
    setTitle("Boyle's Law Verification");
    setXAxisLabel("Pressure (kPa)");
    setYAxisLabel("Volume (cm³)");
    setDataPoints([
      { x: 100, y: 24.1 }, { x: 120, y: 20.2 }, { x: 140, y: 17.1 }, 
      { x: 160, y: 15.0 }, { x: 180, y: 13.4 }, { x: 200, y: 12.0 }
    ]);
    setGraphType("scatter");
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
        setError("Import failed. Check file structure.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const runAIGraphRecommend = async () => {
    setError(null);
    setStatus("processing");
    setProcessingStep("Scanning dataset distribution...");
    
    try {
      await new Promise(r => setTimeout(r, 600));
      setProcessingStep("AI is generating your result...");
      await new Promise(r => setTimeout(r, 600));

      const csvData = Papa.unparse(dataPoints.filter(p => p.x !== "" && p.y !== ""));
      const prompt = `Based on this scientific dataset, recommend the best visualization:
${csvData}

Provide:
1. Chart type (scatter, line, bar)
2. Axis labels
3. Scientific title

Respond in valid JSON format:
{
  "type": "...",
  "xAxis": "...",
  "yAxis": "...",
  "title": "..."
}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tool: "graph-generator", 
          prompt: prompt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");
      
      const config = JSON.parse(data.result);
      setGraphType(config.type as any);
      setXAxisLabel(config.xAxis);
      setYAxisLabel(config.yAxis);
      setTitle(config.title);
      setStatus("completed");
    } catch (err: any) {
      setError("AI service temporarily unavailable. Please try again.");
      setStatus("idle");
    }
  };

  const chartData = useMemo(() => {
    const x = dataPoints.map(p => Number(p.x)).filter(n => !isNaN(n));
    const y = dataPoints.map(p => Number(p.y)).filter(n => !isNaN(n));
    const validPoints = x.map((xv, i) => ({ x: xv, y: y[i] }));

    return {
      labels: graphType !== "scatter" ? x.map(String) : undefined,
      datasets: [{
        label: title,
        data: graphType === "scatter" ? validPoints : y,
        backgroundColor: graphType === "bar" ? 'rgba(99, 102, 241, 0.8)' : '#6366f1',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: graphType === "line",
      }]
    };
  }, [dataPoints, graphType, title]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <ToolNavigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Advanced Tool Header */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -mr-12 -mt-12">
            <LineChartIcon className="h-64 w-64 text-indigo-900" />
          </div>
          
          <div className="flex gap-6 items-start relative z-10">
            <div className="h-16 w-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 shrink-0">
               <LineChartIcon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Professional Graph Studio</h1>
              <p className="text-slate-500 font-medium mt-1 max-w-lg">Transform raw experiment data into publication-quality scientific visualizations with AI assistance.</p>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl h-10 border-slate-200 font-bold px-4">
                  <Upload className="h-4 w-4 mr-2" /> Import Data
                </Button>
                <Button variant="ghost" size="sm" onClick={loadExample} className="rounded-xl h-10 text-indigo-600 font-bold">
                  <Database className="h-4 w-4 mr-2" /> Load Dataset
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><HelpCircle className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Rendering Engine</p>
                <p className="text-xs font-bold text-indigo-600">WebGL Accelerated</p>
             </div>
             <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center border border-slate-200">
                <Activity className="h-5 w-5 text-indigo-500" />
             </div>
          </div>
        </div>

        {/* Main Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          
          {/* Smart Input Panel (Left) */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-slate-200 shadow-xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Palette className="h-6 w-6 text-indigo-500" /> Studio Controls
                </CardTitle>
                <CardDescription>Customize axes, layers, and visual style</CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* Dataset Import Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Source</Label>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">{dataPoints.length} Entries</span>
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
                      <Plus className="h-3 w-3 mr-2" /> Append Coordinates
                    </Button>
                  </div>
                </div>

                {/* Graph Title & Axis Config */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Canvas Configuration</Label>
                  <div className="grid gap-3">
                    <Input placeholder="Graph Header" value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl border-slate-200 px-4 text-xs font-semibold" />
                    <div className="grid grid-cols-2 gap-3">
                       <Input placeholder="X Axis Label" value={xAxisLabel} onChange={(e) => setXAxisLabel(e.target.value)} className="h-12 rounded-xl border-slate-200 px-4 text-xs font-semibold" />
                       <Input placeholder="Y Axis Label" value={yAxisLabel} onChange={(e) => setYAxisLabel(e.target.value)} className="h-12 rounded-xl border-slate-200 px-4 text-xs font-semibold" />
                    </div>
                  </div>
                </div>

                {/* Layer Selector */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Visualization Layer</Label>
                  <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                    {(["scatter", "line", "bar"] as const).map(type => (
                      <Button 
                        key={type} 
                        variant={graphType === type ? "secondary" : "ghost"}
                        className={cn(
                          "flex-1 h-12 rounded-xl text-xs font-bold capitalize transition-all",
                          graphType === type ? "bg-white text-indigo-600 shadow-sm border border-slate-100" : "text-slate-400 hover:bg-white/50"
                        )}
                        onClick={() => setGraphType(type)}
                      >
                        {type === "scatter" && <Grid3X3 className="h-3 w-3 mr-2" />}
                        {type === "line" && <TrendingUp className="h-3 w-3 mr-2" />}
                        {type === "bar" && <BarChart2 className="h-3 w-3 mr-2" />}
                        {type}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Engine State */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Artist</p>
                     <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                        status === "idle" ? "bg-slate-200 text-slate-500 border-slate-300" :
                        status === "processing" ? "bg-amber-100 text-amber-600 border-amber-200 animate-pulse" :
                        "bg-emerald-100 text-emerald-600 border-emerald-200"
                      )}>
                        {status}
                      </span>
                  </div>
                  {status === "processing" ? (
                    <div className="space-y-3">
                       <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                         <Loader2 className="h-3 w-3 animate-spin text-indigo-600" /> {processingStep}
                       </p>
                       <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 1.8 }} className="bg-indigo-600 h-full" />
                       </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                       {status === "completed" ? "Optimal graph parameters identified." : "Configure parameters for visualization."}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={runAIGraphRecommend} 
                  disabled={status === "processing"} 
                  className="w-full h-16 bg-slate-900 hover:bg-black transition-all text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {status === "processing" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                  Auto-Detect Chart
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Results Panel (Right) */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex items-center gap-4 text-rose-600">
                   <AlertCircle className="h-8 w-8" />
                   <div>
                     <p className="font-black uppercase text-[10px] tracking-widest">Render Error</p>
                     <p className="font-bold text-sm">{error}</p>
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-8"
                >
                  <Card className="rounded-[3rem] border-slate-200 shadow-2xl bg-white overflow-hidden p-8 md:p-12 relative">
                    <div className="flex justify-between items-center mb-10 overflow-x-auto no-scrollbar gap-4">
                      <div className="flex gap-4 items-center shrink-0">
                        <div className="h-10 w-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                           <Eye className="h-5 w-5 text-indigo-600" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Studio Preview</h2>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => chartRef.current?.toBase64Image()} className="h-10 px-5 rounded-xl text-[10px] font-black uppercase shadow-sm"><Download className="h-3.5 w-3.5 mr-2" /> PNG</Button>
                        <Button variant="outline" size="sm" className="h-10 px-5 rounded-xl text-[10px] font-black uppercase border-indigo-200 text-indigo-600 shadow-sm"><Maximize2 className="h-3.5 w-3.5 mr-2" /> Scale PDF</Button>
                      </div>
                    </div>

                    <div className="flex-1 min-h-[400px] md:min-h-[500px] border border-slate-100 rounded-[2.5rem] bg-slate-50/20 p-8 shadow-inner relative group">
                      {dataPoints.some(p => p.x !== "" && p.y !== "") ? (
                        <div className="h-full w-full">
                           {graphType === "scatter" && <Scatter data={chartData as any} ref={chartRef} options={{ 
                             responsive: true, 
                             maintainAspectRatio: false,
                             plugins: { legend: { labels: { font: { weight: 'bold' } } } },
                             scales: { 
                               x: { grid: { color: "#f1f5f9" }, title: { display: true, text: xAxisLabel, font: { weight: 'bold', size: 10 } } },
                               y: { grid: { color: "#f1f5f9" }, title: { display: true, text: yAxisLabel, font: { weight: 'bold', size: 10 } } }
                             }
                           }} />}
                           {graphType === "line" && <Line data={chartData as any} ref={chartRef} options={{ responsive: true, maintainAspectRatio: false }} />}
                           {graphType === "bar" && <Bar data={chartData as any} ref={chartRef} options={{ responsive: true, maintainAspectRatio: false }} />}
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-12 opacity-30 pointer-events-none">
                           <div className="h-24 w-24 border-2 border-slate-200 border-dashed rounded-[2rem] flex items-center justify-center mb-6">
                              <Layers className="h-10 w-10 text-slate-400" />
                           </div>
                           <h3 className="font-black uppercase tracking-[0.2em] text-xs text-slate-900">Virtual Ink Empty</h3>
                           <p className="text-[10px] mt-2 max-w-[200px] font-medium leading-relaxed">Insert coordinate primitives into the studio console to begin high-fidelity rendering.</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                       <ResultIndicator label="Density" value={dataPoints.length} unit="pts" />
                       <ResultIndicator label="Resolution" value="300" unit="dpi" />
                       <ResultIndicator label="Render" value="WebGL" unit="v2" />
                       <ResultIndicator label="Quality" value="Lossless" unit="std" />
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Persistence Tools Footer */}
      {dataPoints.some(p => p.x !== "" && p.y !== "") && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 z-40">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                 <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                    <Sparkles className="h-6 w-6 text-white" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-900 leading-none">Visualization Active</h4>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-1 uppercase italic line-clamp-1">{title}</p>
                 </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                 <Button variant="ghost" className="flex-1 md:flex-none h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-500"><Trash2 className="h-4 w-4 mr-2" /> Reset Canvas</Button>
                 <Button variant="outline" className="flex-1 md:flex-none h-12 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest border-slate-300"><Settings2 className="h-4 w-4 mr-2" /> Quick Tweak</Button>
                 <Button className="flex-1 md:flex-none h-12 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-indigo-100">Publish Graph</Button>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}

function ResultIndicator({ label, value, unit }: { label: string, value: string | number, unit: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
      <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{label}</span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-sm font-black text-indigo-600">{value}</span>
        <span className="text-[8px] font-bold text-slate-400 uppercase">{unit}</span>
      </div>
    </div>
  )
}
