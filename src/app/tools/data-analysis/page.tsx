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
  Target
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
import { cn } from "@/lib/utils";

ChartJS.register(LinearScale, PointElement, LineElement, BarElement, CategoryScale, Tooltip, Legend);

interface DataPoint {
  x: string | number;
  y: string | number;
}

export default function DataAnalysisPage() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateCell = (index: number, field: 'x' | 'y', value: string) => {
    const newData = [...dataPoints];
    newData[index][field] = value;
    setDataPoints(newData);
    setResults(null);
  };

  const addRow = () => setDataPoints([...dataPoints, { x: "", y: "" }]);
  
  const removeRow = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
      setResults(null);
    }
  };

  const clearData = () => {
    setDataPoints([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
    setResults(null);
    setError(null);
  };

  const loadExample = () => {
    setDataPoints([
      { x: 1, y: 2.1 }, { x: 2, y: 3.9 }, { x: 3, y: 6.2 }, 
      { x: 4, y: 8.1 }, { x: 5, y: 9.8 }, { x: 6, y: 12.3 }
    ]);
    setResults(null);
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

  const runAIAnalysis = async () => {
    setError(null);
    setIsAnalyzing(true);
    try {
      const csvData = Papa.unparse(dataPoints.filter(p => p.x !== "" && p.y !== ""));
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: csvData })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI Analysis failed");
      setResults(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const chartData = useMemo(() => {
    if (!results) return null;
    const x = dataPoints.map(p => Number(p.x)).filter(n => !isNaN(n));
    const y = dataPoints.map(p => Number(p.y)).filter(n => !isNaN(n));
    return {
      datasets: [
        {
          label: 'Data Points',
          data: x.map((xv, i) => ({ x: xv, y: y[i] })),
          backgroundColor: '#6366f1',
        },
        {
          label: 'Regression Line',
          data: [
            { x: Math.min(...x), y: results.regression.slope * Math.min(...x) + results.regression.intercept },
            { x: Math.max(...x), y: results.regression.slope * Math.max(...x) + results.regression.intercept }
          ],
          borderColor: '#f43f5e',
          showLine: true,
          pointRadius: 0,
        }
      ]
    };
  }, [results, dataPoints]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Section */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Data Analysis</h1>
            <p className="text-slate-500 font-medium">Professional statistical modeling & regression</p>
          </div>
        </div>

        {/* Main Workspace (Responsive Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Panel: Input / Settings */}
          <div className="space-y-6 order-2 lg:order-1">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TableIcon className="h-5 w-5 text-indigo-500" /> Data Spreadsheet
                  </CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={loadExample} title="Load Example"><Database className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} title="Upload"><Upload className="h-4 w-4" /></Button>
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv,.xlsx" />
                  <Button variant="ghost" size="icon" onClick={clearData} className="text-rose-500"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 overflow-auto max-h-[500px]">
                <table className="w-full text-sm border-collapse">
                  <thead className="sticky top-0 bg-slate-100 border-b border-slate-200 z-10">
                    <tr>
                      <th className="py-3 px-4 text-left font-bold text-slate-500">X Variable</th>
                      <th className="py-3 px-4 text-left font-bold text-slate-500">Y Variable</th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {dataPoints.map((p, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="p-2">
                          <Input value={p.x} onChange={(e) => updateCell(idx, 'x', e.target.value)} className="h-10 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-indigo-100" placeholder="0.0" />
                        </td>
                        <td className="p-2">
                          <Input value={p.y} onChange={(e) => updateCell(idx, 'y', e.target.value)} className="h-10 border-none bg-transparent shadow-none focus-visible:ring-1 focus-visible:ring-indigo-100" placeholder="0.0" />
                        </td>
                        <td className="p-2">
                          <Button variant="ghost" size="icon" onClick={() => removeRow(idx)} className="h-8 w-8 text-slate-300 hover:text-rose-500"><Trash2 className="h-3 w-3" /></Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
              <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4">
                <Button variant="ghost" onClick={addRow} className="w-full h-12 text-indigo-600 hover:bg-indigo-50 font-bold border-2 border-dashed border-indigo-100 rounded-xl">
                  <Plus className="h-5 w-5 mr-2" /> Insert Data Point
                </Button>
                <Button onClick={runAIAnalysis} disabled={isAnalyzing} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100">
                  {isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 mr-2 fill-current" />}
                  Perform AI Analysis
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Panel: Results / Preview */}
          <div className="space-y-6 order-1 lg:order-2">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            {results ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="grid grid-cols-2 gap-4">
                  <ScientificMetric label="Mean" value={results.mean} icon={<Activity className="h-4 w-4" />} />
                  <ScientificMetric label="Std Dev" value={results.stdDev} icon={<RefreshCw className="h-4 w-4" />} />
                  <ScientificMetric label="Correlation" value={results.correlation} icon={<Zap className="h-4 w-4" />} />
                  <ScientificMetric label="R-Squared" value={results.regression.r2} icon={<Target className="h-4 w-4" />} />
                </div>
                
                <Card className="rounded-[2.5rem] p-8 border-slate-200 shadow-xl bg-white">
                  <CardTitle className="text-lg mb-6 flex items-center gap-2 italic">
                     <TrendingUp className="h-5 w-5 text-indigo-500" /> Statistical Curve Fit
                  </CardTitle>
                  <div className="h-[300px]">
                    <Scatter 
                      data={chartData as any} 
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { grid: { color: "#f1f5f9" } }, y: { grid: { color: "#f1f5f9" } } }
                      }}
                    />
                  </div>
                  <div className="mt-8 p-6 bg-slate-900 rounded-3xl text-center">
                    <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-[0.2em] mb-2">AI Linear Model</p>
                    <h3 className="text-2xl font-black text-white font-mono">
                      y = {results.regression.slope.toFixed(3)}x + {results.regression.intercept.toFixed(3)}
                    </h3>
                    <p className="text-xs text-slate-400 mt-4 leading-relaxed px-4">{results.summary}</p>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-slate-200 rounded-[3rem] opacity-40">
                <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                   <Activity className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Awaiting Data Entry</h3>
                <p className="text-sm mt-2 max-w-xs">Upload a CSV or manually insert points to generate AI-powered statistical models.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
