"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  ChevronRight,
  Database,
  BarChart2,
  Settings2,
  Maximize2,
  Grid3X3,
  Sparkles,
  Loader2,
  Eye,
  FileText
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

ChartJS.register(LinearScale, PointElement, LineElement, BarElement, CategoryScale, Tooltip, Legend);

interface DataPoint {
  x: string | number;
  y: string | number;
}

export default function GraphGeneratorPage() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
  const [title, setTitle] = useState("Scientific Observation Map");
  const [xAxisLabel, setXAxisLabel] = useState("Independent (X)");
  const [yAxisLabel, setYAxisLabel] = useState("Dependent (Y)");
  const [graphType, setGraphType] = useState<"scatter" | "line" | "bar">("scatter");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCell = (index: number, field: 'x' | 'y', value: string) => {
    const newData = [...dataPoints];
    newData[index][field] = value;
    setDataPoints(newData);
  };

  const addRow = () => setDataPoints([...dataPoints, { x: "", y: "" }]);
  const removeRow = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
    }
  };

  const loadExample = () => {
    setDataPoints([
      { x: 0, y: 1.2 }, { x: 1, y: 3.4 }, { x: 2, y: 4.8 }, { x: 3, y: 7.2 }, 
      { x: 4, y: 8.9 }, { x: 5, y: 11.3 }
    ]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
      const valid = data.map(r => ({ x: r[0], y: r[1] })).filter(p => !isNaN(Number(p.x)) && !isNaN(Number(p.y)));
      setDataPoints(valid);
    };
    reader.readAsBinaryString(file);
  };

  const runAIGraphRecommend = async () => {
    setError(null);
    setIsGenerating(true);
    try {
      const csvData = Papa.unparse(dataPoints.filter(p => p.x !== "" && p.y !== ""));
      const res = await fetch("/api/ai/graph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: csvData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI Analysis failed");
      
      const config = data.result;
      setGraphType(config.type as any);
      setXAxisLabel(config.xAxis);
      setYAxisLabel(config.yAxis);
      setTitle(config.title);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
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
        backgroundColor: '#4f46e5',
        borderColor: '#4f46e5',
        borderWidth: 2,
        pointRadius: 6,
        tension: 0.3,
      }]
    };
  }, [dataPoints, graphType, title]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Section */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <LineChartIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Professional Graph Studio</h1>
            <p className="text-slate-500 font-medium">Generate publication-quality scientific visualizations</p>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel */}
          <div className="space-y-6 order-2 lg:order-1">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TableIcon className="h-5 w-5 text-indigo-500" /> Observation Table
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={loadExample}><Database className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /></Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv,.xlsx" />
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-auto max-h-[400px]">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-slate-100 border-b border-slate-100 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold text-slate-500 italic">Independent (X)</th>
                      <th className="py-3 px-4 text-left font-bold text-slate-500 italic">Dependent (Y)</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 bg-white">
                    {dataPoints.map((p, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-all">
                        <td className="p-2"><Input value={p.x} onChange={(e) => updateCell(idx, 'x', e.target.value)} className="h-10 border-none bg-transparent shadow-none" placeholder="X" /></td>
                        <td className="p-2"><Input value={p.y} onChange={(e) => updateCell(idx, 'y', e.target.value)} className="h-10 border-none bg-transparent shadow-none" placeholder="Y" /></td>
                        <td className="p-2"><Button variant="ghost" size="icon" onClick={() => removeRow(idx)} className="h-8 w-8 text-slate-300 hover:text-rose-500"><Trash2 className="h-3.5 w-3.5" /></Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              <CardFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
                <Button variant="ghost" onClick={addRow} className="w-full h-12 text-indigo-600 hover:bg-white border-2 border-dashed border-indigo-100 rounded-xl font-bold">
                   <Plus className="h-5 w-5 mr-1" /> Append Row
                </Button>
                
                <div className="space-y-4 pt-4 border-t border-slate-200 w-full">
                  <div className="grid grid-cols-1 gap-3">
                    <Input placeholder="Graph Title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 border-slate-200 rounded-xl" />
                    <div className="grid grid-cols-2 gap-3">
                      <Input placeholder="X Axis Label" value={xAxisLabel} onChange={(e) => setXAxisLabel(e.target.value)} className="h-12 border-slate-200 rounded-xl" />
                      <Input placeholder="Y Axis Label" value={yAxisLabel} onChange={(e) => setYAxisLabel(e.target.value)} className="h-12 border-slate-200 rounded-xl" />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 p-1 bg-white rounded-xl border border-slate-100">
                    {(["scatter", "line", "bar"] as const).map(type => (
                      <Button 
                        key={type} 
                        variant={graphType === type ? "secondary" : "ghost"}
                        className={cn("flex-1 h-10 rounded-lg text-xs font-bold capitalize", graphType === type ? "bg-indigo-50 text-indigo-600" : "text-slate-400")}
                        onClick={() => setGraphType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </div>

                  <Button onClick={runAIGraphRecommend} disabled={isGenerating} className="w-full h-14 bg-slate-900 border-b-4 border-slate-950 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl transition-all active:translate-y-1 active:border-b-0 shadow-xl shadow-slate-200">
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5 mr-2" />}
                    AI Suggest Visualization
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Right Panel */}
          <div className="space-y-6 order-1 lg:order-2">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            <Card className="rounded-[2.5rem] p-8 border-slate-200 shadow-xl bg-white flex flex-col min-h-[500px]">
              <div className="flex justify-between items-center mb-6">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Eye className="h-5 w-5 text-indigo-500" /> Render Preview
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => chartRef.current?.toBase64Image()} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase"><Download className="h-3 w-3 mr-2" /> PNG</Button>
                  <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase border-indigo-200 text-indigo-600"><FileText className="h-3 w-3 mr-2" /> Extended PDF</Button>
                </div>
              </div>

              <div className="flex-1 min-h-[400px] border border-slate-100 rounded-3xl bg-slate-50/30 p-8 relative overflow-hidden">
                {dataPoints.some(p => p.x !== "" && p.y !== "") ? (
                  <div className="h-full w-full">
                     {graphType === "scatter" && <Scatter data={chartData as any} ref={chartRef} options={{ responsive: true, maintainAspectRatio: false }} />}
                     {graphType === "line" && <Line data={chartData as any} ref={chartRef} options={{ responsive: true, maintainAspectRatio: false }} />}
                     {graphType === "bar" && <Bar data={chartData as any} ref={chartRef} options={{ responsive: true, maintainAspectRatio: false }} />}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none">
                     <div className="h-20 w-20 border-4 border-slate-200 border-dashed rounded-3xl rotate-12 flex items-center justify-center mb-6">
                        <Grid3X3 className="h-10 w-10 text-slate-300" />
                     </div>
                     <p className="font-black uppercase tracking-widest text-xs">Waiting for Signal</p>
                     <p className="text-[10px] mt-2 max-w-[180px]">Input experimental data to initialize the rendering pipeline.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 pt-8 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>Grid Lock Status: Active</span>
                 <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500" /> High Performance Scan</span>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
