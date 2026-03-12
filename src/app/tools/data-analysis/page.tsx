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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Play, 
  AlertCircle, 
  FileText, 
  Upload, 
  Table as TableIcon, 
  Download, 
  Trash2, 
  Plus, 
  RefreshCw,
  TrendingUp,
  Target,
  Activity,
  Zap,
  ChevronRight,
  Database
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
import Link from "next/link";
import { ScientificMetric } from "@/components/ScientificMetric";
import { ErrorFallback } from "@/components/ErrorFallback";
import { cn } from "@/lib/utils";

ChartJS.register(LinearScale, PointElement, LineElement, BarElement, CategoryScale, Tooltip, Legend);

// Types
interface DataPoint {
  x: string | number;
  y: string | number;
}

interface AnalysisResults {
  mean: number;
  std_dev: number;
  slope: number;
  intercept: number;
  correlation: number;
  r_squared: number;
  error_percent: number;
  se_slope: number;
  equation: string;
}

const EXAMPLE_DATASET = [
  { x: 0, y: 0.1 },
  { x: 1, y: 1.8 },
  { x: 2, y: 4.2 },
  { x: 3, y: 6.5 },
  { x: 4, y: 7.9 },
  { x: 5, y: 10.3 },
  { x: 6, y: 11.8 },
  { x: 7, y: 14.2 },
  { x: 8, y: 16.5 },
  { x: 9, y: 18.1 }
];

export default function DataAnalysisPage() {
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [activeTab, setActiveTab] = useState("workspace");
  const chartRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle cell edit
  const updateCell = (index: number, field: 'x' | 'y', value: string) => {
    const newData = [...dataPoints];
    newData[index][field] = value;
    setDataPoints(newData);
    setResults(null); // Clear results if data changes
  };

  // Add new row
  const addRow = () => {
    setDataPoints([...dataPoints, { x: "", y: "" }]);
  };

  // Remove row
  const removeRow = (index: number) => {
    if (dataPoints.length > 2) {
      const newData = dataPoints.filter((_, i) => i !== index);
      setDataPoints(newData);
      setResults(null);
    }
  };

  // Load Example
  const loadExample = () => {
    setDataPoints(EXAMPLE_DATASET.map(p => ({ x: String(p.x), y: String(p.y) })));
    setResults(null);
    setError(null);
  };

  // Clear all
  const clearData = () => {
    setDataPoints([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
    setResults(null);
    setError(null);
  };

  // File processing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (fileExt === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          const rows = results.data as any[][];
          processRawRows(rows);
        },
        header: false,
      });
    } else if (fileExt === 'xlsx' || fileExt === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];
        processRawRows(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (!text) return;

      // Try to parse as TSV first (common for Excel/Sheets paste), then CSV
      const isTSV = text.includes('\t');
      const results = Papa.parse(text, {
        delimiter: isTSV ? '\t' : (text.includes(',') ? ',' : ''),
        skipEmptyLines: true,
        header: false,
      });

      if (results.data && results.data.length > 0) {
        processRawRows(results.data as any[][]);
        setError(null);
      }
    } catch (err) {
      console.error("Paste failed:", err);
      setError("Failed to read clipboard. Please ensure you've copied data rows.");
    }
  };

  const processRawRows = (rows: any[][]) => {
    const validPoints: DataPoint[] = [];
    rows.forEach(row => {
      // Filter out empty cells and try to find two numeric columns
      const numericCells = row.map(c => String(c).trim()).filter(c => c !== "" && !isNaN(Number(c)));
      
      if (numericCells.length >= 2) {
        validPoints.push({ x: numericCells[0], y: numericCells[1] });
      }
    });

    if (validPoints.length > 0) {
      setDataPoints(prev => {
        // If the first row is empty, replace it, otherwise append or replace based on user preference
        // For simplicity, we'll replace the existing data if it was just the default empty rows
        const isDefault = prev.length <= 3 && prev.every(p => p.x === "" && p.y === "");
        return isDefault ? validPoints : [...prev, ...validPoints].filter(p => p.x !== "" || p.y !== "");
      });
      setResults(null);
      setError(null);
    } else {
      setError("No valid numeric data pairs found. Ensure you have two columns of numbers.");
    }
  };

  // Trigger Analysis
  const runAnalysis = async () => {
    setError(null);
    setIsAnalyzing(true);
    
    try {
      const x = dataPoints.map(p => Number(p.x)).filter(n => !isNaN(n));
      const y = dataPoints.map(p => Number(p.y)).filter(n => !isNaN(n));
      
      if (x.length !== y.length || x.length < 2) {
        throw new Error("Invalid data. Please ensure you have at least two valid numeric points (X, Y).");
      }

      const res = await fetch("/api/analyze-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, isDemo: false })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");

      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chart Data
  const chartData = useMemo(() => {
    if (!results) return null;
    
    const x = dataPoints.map(p => Number(p.x)).filter(n => !isNaN(n));
    const y = dataPoints.map(p => Number(p.y)).filter(n => !isNaN(n));
    
    const minX = Math.min(...x);
    const maxX = Math.max(...x);
    
    const regressionLinePoints = [
      { x: minX, y: results.slope * minX + results.intercept },
      { x: maxX, y: results.slope * maxX + results.intercept }
    ];

    // Calculate residuals: y_observed - y_predicted
    const residuals = x.map((xv, i) => ({
      x: xv,
      y: y[i] - (results.slope * xv + results.intercept)
    }));

    return {
      main: {
        datasets: [
          {
            label: 'Experimental Data',
            data: x.map((xv, i) => ({ x: xv, y: y[i] })),
            backgroundColor: 'rgb(79, 70, 229)',
            pointRadius: 6,
            pointHoverRadius: 8,
          },
          {
            label: 'Regression Line',
            data: regressionLinePoints,
            borderColor: 'rgba(244, 63, 94, 0.8)',
            borderWidth: 2,
            pointRadius: 0,
            showLine: true,
            fill: false,
          }
        ]
      },
      residual: {
        datasets: [
          {
            label: 'Residuals (Errors)',
            data: residuals,
            backgroundColor: 'rgba(244, 63, 94, 0.6)',
            borderColor: 'rgb(244, 63, 94)',
            borderWidth: 1,
            pointRadius: 5,
          },
          {
            label: 'Zero Line',
            data: [{ x: minX, y: 0 }, { x: maxX, y: 0 }],
            borderColor: 'rgba(148, 163, 184, 0.5)',
            borderDash: [5, 5],
            borderWidth: 1,
            pointRadius: 0,
            showLine: true,
          }
        ]
      }
    };
  }, [results, dataPoints]);

  const [plotMode, setPlotMode] = useState<"main" | "residual">("main");

  const exportCSV = () => {
     const csv = Papa.unparse(dataPoints);
     const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
     const link = document.createElement("a");
     const url = URL.createObjectURL(blob);
     link.setAttribute("href", url);
     link.setAttribute("download", `AnalysisData-${Date.now()}.csv`);
     link.style.visibility = 'hidden';
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
  };

  const exportPNG = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.download = `Scientific-Plot-${Date.now()}.png`;
      link.click();
    }
  };

  const exportPDF = async () => {
    if (!results) return;

    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.text("Scientific Data Analysis Report", 20, 25);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()} by LabRecord AI`, 20, 32);
    
    // Stats Summary
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text("Statistical Summary", 20, 45);
    
    const statsData = [
      ["Mean (Dependent)", results.mean.toString()],
      ["Standard Deviation", results.std_dev.toString()],
      ["Correlation Coeff (r)", results.correlation.toString()],
      ["R-Squared (R\u00B2)", results.r_squared.toString()],
      ["MAPE Error (%)", `${results.error_percent}%`],
      ["Regression Equation", results.equation]
    ];
    
    autoTable(doc, {
      startY: 50,
      head: [["Metric", "Calculated Value"]],
      body: statsData,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });
    
    // Data Table
    doc.text("Input Dataset", 20, (doc as any).lastAutoTable.finalY + 15);
    
    const tableData = dataPoints.map((p, i) => [i + 1, p.x, p.y]);
    
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 20,
      head: [["#", "Independent (X)", "Dependent (Y)"]],
      body: tableData,
      theme: 'grid',
      styles: { font: "courier", fontSize: 9 }
    });
    
    // Add Chart if available
    if (chartRef.current) {
      const chartImg = chartRef.current.toBase64Image();
      doc.addPage();
      doc.text("Visualization Plot", 20, 20);
      doc.addImage(chartImg, 'PNG', 15, 30, 180, 100);
    }
    
    doc.save(`LabRecord-Analysis-${Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50/50">
      {/* Header Controls */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">AI Data Analysis Workspace</h1>
            <p className="text-xs text-slate-500 font-medium">Professional Scientific Tools</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadExample} className="text-xs">
            <Database className="h-3.5 w-3.5 mr-1.5" /> Example Dataset
          </Button>
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          <Button 
            onClick={runAnalysis} 
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 px-4"
            size="sm"
          >
            {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2 fill-current" />}
            Analyze Workspace
          </Button>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="flex-1 overflow-hidden p-6 gap-6 grid grid-cols-12">
        
        {/* Left: Data Selection & Editor (Col 1-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6 overflow-hidden">
          <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-sm">
            <CardHeader className="py-4 px-5 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-md flex items-center gap-2">
                  <TableIcon className="h-4 w-4 text-indigo-500" />
                  Data Spreadsheet
                </CardTitle>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={handlePaste} className="h-8 w-8 text-slate-400 hover:text-indigo-600" title="Paste from Clipboard">
                  <TableIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} className="h-8 w-8 text-slate-400 hover:text-indigo-600" title="Upload File">
                  <Upload className="h-4 w-4" />
                </Button>
                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".csv,.xlsx,.xls" />
                <Button variant="ghost" size="icon" onClick={clearData} className="h-8 w-8 text-slate-400 hover:text-red-600" title="Clear All">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold z-10">
                  <tr>
                    <th className="w-12 py-2 px-3 text-center border-r">#</th>
                    <th className="py-2 px-3 text-left border-r">X (Indep)</th>
                    <th className="py-2 px-3 text-left border-r">Y (Dep)</th>
                    <th className="w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dataPoints.map((point, idx) => (
                    <tr key={idx} className="group hover:bg-indigo-50/30 transition-colors">
                      <td className="py-2 px-3 text-center bg-slate-50/50 text-slate-400 font-mono text-xs border-r group-hover:bg-indigo-50/50">{idx + 1}</td>
                      <td className="py-1 px-2 border-r focus-within:ring-1 focus-within:ring-indigo-500/50">
                        <Input 
                          value={point.x} 
                          onChange={(e) => updateCell(idx, 'x', e.target.value)}
                          className="h-8 border-none bg-transparent focus-visible:ring-0 px-2 rounded-none font-mono text-xs shadow-none shadow-transparent shadow-none"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-1 px-2 border-r focus-within:ring-1 focus-within:ring-indigo-500/50">
                        <Input 
                          value={point.y} 
                          onChange={(e) => updateCell(idx, 'y', e.target.value)}
                          className="h-8 border-none bg-transparent focus-visible:ring-0 px-2 rounded-none font-mono text-xs shadow-none shadow-transparent shadow-none"
                          placeholder="0.00"
                        />
                      </td>
                      <td className="py-1 px-1 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => removeRow(idx)} className="h-6 w-6 text-slate-300 hover:text-red-500">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Button 
                variant="ghost" 
                onClick={addRow} 
                className="w-full py-4 text-slate-400 hover:text-indigo-600 border-t border-slate-100 rounded-none h-auto text-xs font-medium"
              >
                <Plus className="h-3.5 w-3.5 mr-2" /> Insert New Row
              </Button>
            </CardContent>
            {error && (
              <div className="p-3 bg-red-50 text-red-600 border-t border-red-100 flex items-start gap-2 text-xs">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            <CardFooter className="py-3 px-5 border-t border-slate-100 bg-slate-50/80 rounded-b-xl flex justify-between">
               <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Total Points: {dataPoints.length}</span>
               <div className="flex gap-2">
                 <Button variant="ghost" size="xs" onClick={exportCSV} className="h-6 text-[10px] uppercase font-bold text-slate-500">
                   Export CSV
                 </Button>
               </div>
            </CardFooter>
          </Card>
        </div>

        {/* Right: Visualization & Results (Col 5-12) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6 overflow-hidden">
          
          {/* Analysis View */}
          <Tabs defaultValue="visualize" className="flex-1 flex flex-col">
            <TabsList className="bg-slate-100 p-1 w-fit mb-4">
              <TabsTrigger value="visualize" className="text-xs px-6">
                <Activity className="h-3.5 w-3.5 mr-2" /> Visualization
              </TabsTrigger>
              <TabsTrigger value="metrics" className="text-xs px-6">
                <Target className="h-3.5 w-3.5 mr-2" /> Statistical Depth
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="visualize" className="flex-1 mt-0">
              {error ? (
                <ErrorFallback error={error} reset={() => { setError(null); setResults(null); }} />
              ) : (
                <Card className="h-full border-slate-200 shadow-sm flex flex-col overflow-hidden">
                  <CardHeader className="py-4 px-6 border-b border-slate-50 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <CardTitle className="text-md font-bold text-slate-800">Dynamic Multi-Plot Analyzer</CardTitle>
                        <CardDescription className="text-xs">Interactive graph with regression fitment</CardDescription>
                      </div>
                      {results && (
                        <div className="flex bg-slate-100 p-0.5 rounded-lg ml-4">
                           <Button 
                             variant={plotMode === "main" ? "secondary" : "ghost"} 
                             size="xs" 
                             onClick={() => setPlotMode("main")} 
                             className={cn("text-[10px] px-3 h-6", plotMode === "main" ? "shadow-sm bg-white hover:bg-white" : "")}
                           >
                             Standard Plot
                           </Button>
                           <Button 
                             variant={plotMode === "residual" ? "secondary" : "ghost"} 
                             size="xs" 
                             onClick={() => setPlotMode("residual")} 
                             className={cn("text-[10px] px-3 h-6", plotMode === "residual" ? "shadow-sm bg-white hover:bg-white" : "")}
                           >
                             Residual Plot
                           </Button>
                        </div>
                      )}
                    </div>
                    {results && (
                       <div className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-100 animate-pulse">
                          SAMPLED & ANALYZED
                       </div>
                    )}
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-8 bg-white relative">
                    {results && chartData ? (
                      <div className="w-full h-full min-h-[400px]">
                        <Scatter 
                          ref={chartRef}
                          data={chartData[plotMode] as any} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: { position: 'top' as const, labels: { boxWidth: 10, font: { size: 11 } } },
                              tooltip: { backgroundColor: 'rgba(15, 23, 42, 0.9)', padding: 12, cornerRadius: 8 }
                            },
                            scales: {
                              x: { grid: { color: '#f1f5f9' }, title: { display: true, text: plotMode === 'main' ? 'Independent Variable (X)' : 'X Variable', font: { size: 11, weight: 'bold' } } },
                              y: { grid: { color: '#f1f5f9' }, title: { display: true, text: plotMode === 'main' ? 'Dependent Variable (Y)' : 'Residual (Error)', font: { size: 11, weight: 'bold' } } }
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="text-center space-y-4 max-w-sm">
                        <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto border border-slate-200 shadow-inner">
                          <LineChart className="h-10 w-10 text-slate-300" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-700">Workspace Pending</h4>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                            Populate the spreadsheet and click "Analyze Workspace" to generate visual benchmarks and regression models.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="py-3 px-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Raw Data</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">OLS Model</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="xs" onClick={exportPNG} disabled={!results} className="h-7 text-[10px] font-bold uppercase tracking-tight">
                        <Download className="h-3 w-3 mr-1.5" /> Snapshot PNG
                      </Button>
                      <Button variant="outline" size="xs" onClick={exportPDF} disabled={!results} className="h-7 text-[10px] font-bold uppercase tracking-tight border-indigo-200 text-indigo-600 hover:bg-indigo-50">
                        <FileText className="h-3 w-3 mr-1.5" /> Full PDF Report
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="metrics" className="flex-1 mt-0">
               {error ? (
                 <ErrorFallback error={error} reset={() => { setError(null); setResults(null); }} />
               ) : (
                 <>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-fit">
                     {results ? (
                       <>
                         <ScientificMetric 
                            label="Mean (μ)" 
                            value={results.mean} 
                            icon={<Activity className="h-4 w-4" />} 
                            description="Average value of dependent variable"
                         />
                         <ScientificMetric 
                            label="Std Deviation (σ)" 
                            value={results.std_dev} 
                            icon={<RefreshCw className="h-4 w-4" />} 
                            description="Measure of data dispersion"
                         />
                         <ScientificMetric 
                            label="Correlation (r)" 
                            value={results.correlation} 
                            icon={<Zap className="h-4 w-4" />} 
                            className={cn(Math.abs(results.correlation) > 0.9 ? "bg-emerald-50/30" : "")}
                            description="Pearson correlation coefficient"
                            trend={{ value: results.correlation > 0 ? "Positive Correlation" : "Negative Correlation", isPositive: results.correlation > 0 }}
                         />
                         <ScientificMetric 
                            label="Error Propagation" 
                            value={results.se_slope} 
                            icon={<RefreshCw className="h-4 w-4" />} 
                            description="Std Error of Regression Slope"
                         />
                         <ScientificMetric 
                            label="Mapping Error" 
                            value={results.error_percent} 
                            unit="%"
                            icon={<AlertCircle className="h-4 w-4" />} 
                            description="Mean Absolute Percentage Error"
                            className={cn(results.error_percent < 5 ? "bg-emerald-50/30 text-emerald-700" : "bg-amber-50/30 text-amber-700")}
                         />
                         <Card className="flex flex-col justify-center items-center text-center p-6 bg-slate-900 text-white shadow-xl shadow-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">OLS Linear Equation</p>
                            <h3 className="text-xl md:text-2xl font-mono font-bold tracking-tight text-indigo-400">{results.equation}</h3>
                            <p className="text-[10px] text-slate-500 mt-4 leading-relaxed">Generated via scientific linear regression calculation</p>
                         </Card>
                       </>
                     ) : (
                       <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center space-y-3">
                          <Target className="h-10 w-10 text-slate-200" />
                          <p className="text-slate-400 text-sm italic">Run analysis to view depth metrics</p>
                       </div>
                     )}
                   </div>

                   {results && (
                     <div className="mt-6 flex gap-4">
                        <Card className="flex-1 bg-white border-slate-200 shadow-sm p-5">
                           <h5 className="text-xs font-bold text-slate-900 uppercase mb-3 flex items-center gap-2">
                             <Play className="h-3 w-3 text-indigo-600 fill-current" /> Next Academic Steps
                           </h5>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Link href="/tools/lab-report" className="group flex items-center justify-between p-3 rounded-lg bg-indigo-50/50 hover:bg-indigo-600 hover:text-white transition-all cursor-pointer">
                                 <div className="flex items-center gap-3">
                                    <FileText className="h-4 w-4 text-indigo-500 group-hover:text-white" />
                                    <span className="text-xs font-semibold">Generate Full AI Lab Report</span>
                                 </div>
                                 <ChevronRight className="h-4 w-4 opacity-40" />
                              </Link>
                              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 opacity-50 cursor-not-allowed">
                                 <div className="flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-semibold">Generate Residual Analysis</span>
                                 </div>
                                 <span className="text-[8px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase">Pro</span>
                              </div>
                           </div>
                        </Card>
                     </div>
                   )}
                 </>
               )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
