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
  LineChart as LineChartIcon, 
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
  Database,
  BarChart2,
  Settings2,
  Maximize2,
  Grid3X3,
  Palette,
  Eye
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { cn } from "@/lib/utils";
import { ErrorFallback } from "@/components/ErrorFallback";

ChartJS.register(LinearScale, PointElement, LineElement, BarElement, CategoryScale, Tooltip, Legend);

// Types
interface DataPoint {
  x: string | number;
  y: string | number;
}

const EXAMPLE_DATASET = [
  { x: 0, y: 1.2 },
  { x: 1, y: 3.4 },
  { x: 2, y: 4.8 },
  { x: 3, y: 7.2 },
  { x: 4, y: 8.9 },
  { x: 5, y: 11.3 },
  { x: 6, y: 13.5 },
  { x: 7, y: 15.8 },
  { x: 8, y: 18.2 },
  { x: 9, y: 20.1 }
];

export default function GraphGeneratorPage() {
  // Data State
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([{ x: "", y: "" }, { x: "", y: "" }, { x: "", y: "" }]);
  const [title, setTitle] = useState("Scientific Observation Map");
  const [xAxisLabel, setXAxisLabel] = useState("Time (s)");
  const [yAxisLabel, setYAxisLabel] = useState("Velocity (m/s)");
  
  // UI State
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("preview");
  
  // Customization State
  const [graphType, setGraphType] = useState<"scatter" | "line" | "bar" | "histogram" | "box">("scatter");
  const [showGrid, setShowGrid] = useState(true);
  const [showRegression, setShowRegression] = useState(false);
  const [isLogScale, setIsLogScale] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#4f46e5"); // indigo-600
  const [pointSize, setPointSize] = useState(5);
  const [lineWidth, setLineWidth] = useState(2);

  const chartRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloud Sync
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const saveToCloud = async () => {
    const validData = dataPoints
      .map(p => ({ x: p.x, y: Number(p.y) }))
      .filter(p => p.x !== "" && !isNaN(p.y));

    if (validData.length === 0) {
      setError("Cannot save empty dataset.");
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch('/api/create-graph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          xAxis: xAxisLabel,
          yAxis: yAxisLabel,
          dataPoints: validData
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save graph.");
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Computed Regression
  const regressionResults = useMemo(() => {
    const validData = dataPoints
      .map(p => ({ x: Number(p.x), y: Number(p.y) }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));

    if (validData.length < 2) return null;

    const n = validData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

    validData.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumX2 += p.x * p.x;
      sumY2 += p.y * p.y;
    });

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // R Squared
    const num = (n * sumXY - sumX * sumY) ** 2;
    const den = (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY);
    const r2 = den === 0 ? 0 : num / den;

    const xValues = validData.map(p => p.x);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);

    return {
      slope,
      intercept,
      r2,
      equation: `y = ${slope.toFixed(3)}x + ${intercept.toFixed(3)}`,
      lineData: [
        { x: minX, y: slope * minX + intercept },
        { x: maxX, y: slope * maxX + intercept }
      ]
    };
  }, [dataPoints]);

  // Computed Box Plot Stats
  const boxPlotStats = useMemo(() => {
    const validData = dataPoints
      .map(p => Number(p.y))
      .filter(p => !isNaN(p));

    if (validData.length < 4) return null;

    const sorted = [...validData].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    const getQuartile = (q: number) => {
      const pos = (sorted.length - 1) * q;
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      } else {
        return sorted[base];
      }
    };

    const q1 = getQuartile(0.25);
    const median = getQuartile(0.5);
    const q3 = getQuartile(0.75);

    return { min, q1, median, q3, max };
  }, [dataPoints]);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const validData = dataPoints
      .map(p => ({ x: Number(p.x), y: Number(p.y) }))
      .filter(p => !isNaN(p.x) && !isNaN(p.y));

    if (graphType === "histogram") {
      const yValues = validData.map(p => p.y);
      const min = Math.min(...yValues);
      const max = Math.max(...yValues);
      const binCount = 10;
      const binWidth = (max - min) / binCount;
      const bins = new Array(binCount).fill(0);
      const binLabels = new Array(binCount).fill(0).map((_, i) => 
        `${(min + i * binWidth).toFixed(1)}-${(min + (i + 1) * binWidth).toFixed(1)}`
      );

      yValues.forEach(y => {
        let binIdx = Math.floor((y - min) / binWidth);
        if (binIdx >= binCount) binIdx = binCount - 1;
        bins[binIdx]++;
      });

      return {
        labels: binLabels,
        datasets: [{
          label: "Frequency Distribution",
          data: bins,
          backgroundColor: primaryColor,
          borderColor: primaryColor,
          borderWidth: 1,
        }]
      };
    }

    if (graphType === "box" && boxPlotStats) {
      return {
        labels: ["Dataset Distribution"],
        datasets: [
          {
            label: "Interquartile Range (Q1-Q3)",
            data: [[boxPlotStats.q1, boxPlotStats.q3]],
            backgroundColor: primaryColor + "44",
            borderColor: primaryColor,
            borderWidth: 2,
          }
        ]
      };
    }

    const datasets: any[] = [
      {
        label: "Primary Observation",
        data: graphType === "scatter" ? validData : validData.map(p => p.y),
        backgroundColor: primaryColor,
        borderColor: primaryColor,
        borderWidth: lineWidth,
        pointRadius: pointSize,
        pointHoverRadius: pointSize + 2,
        tension: 0.3,
        fill: false,
      }
    ];

    if (showRegression && regressionResults && graphType === "scatter") {
      datasets.push({
        label: "Regression Fit",
        data: regressionResults.lineData,
        borderColor: "#ef4444", // red-500
        borderWidth: 2,
        pointRadius: 0,
        type: 'line',
        fill: false,
        borderDash: [5, 5],
      });
    }

    return {
      labels: (graphType === "line" || graphType === "bar") ? validData.map(p => String(p.x)) : undefined,
      datasets
    };
  }, [dataPoints, graphType, primaryColor, showRegression, regressionResults, lineWidth, pointSize, boxPlotStats]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { boxWidth: 10, font: { size: 11, weight: 'bold' } } },
      tooltip: { 
        backgroundColor: 'rgba(15, 23, 42, 0.9)', 
        padding: 12, 
        cornerRadius: 8,
        titleFont: { size: 13 },
        bodyFont: { size: 12 },
        callbacks: {
           label: (context: any) => {
              if (graphType === 'box' && boxPlotStats) {
                 return [`Min: ${boxPlotStats.min}`, `Q1: ${boxPlotStats.q1}`, `Median: ${boxPlotStats.median}`, `Q3: ${boxPlotStats.q3}`, `Max: ${boxPlotStats.max}`];
              }
              return `${context.dataset.label}: ${context.parsed.y}`;
           }
        }
      }
    },
    scales: {
      x: { 
        type: isLogScale && (graphType === 'scatter' || graphType === 'line') ? 'logarithmic' : 'linear' as any,
        grid: { display: showGrid, color: '#f1f5f9' }, 
        title: { display: true, text: graphType === 'histogram' ? 'Value Ranges' : xAxisLabel, font: { size: 11, weight: 'bold' } },
        ticks: { font: { size: 10 } }
      },
      y: { 
        type: isLogScale ? 'logarithmic' : 'linear' as any,
        grid: { display: showGrid, color: '#f1f5f9' }, 
        title: { display: true, text: graphType === 'histogram' ? 'Frequency' : yAxisLabel, font: { size: 11, weight: 'bold' } },
        ticks: { font: { size: 10 } }
      }
    }
  };

  // Logic Handlers
  const addRow = () => setDataPoints([...dataPoints, { x: "", y: "" }]);
  
  const removeRow = (index: number) => {
    if (dataPoints.length > 2) {
      const newData = [...dataPoints];
      newData.splice(index, 1);
      setDataPoints(newData);
    }
  };

  const updateCell = (index: number, field: 'x' | 'y', value: string) => {
    const newData = [...dataPoints];
    newData[index][field] = value;
    setDataPoints(newData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (extension === 'csv' || extension === 'txt') {
      Papa.parse(file, {
        complete: (results) => {
          const rows = results.data as string[][];
          processRawRows(rows);
        },
        skipEmptyLines: true
      });
    } else if (extension === 'xlsx' || extension === 'xls') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as string[][];
        processRawRows(data);
      };
      reader.readAsBinaryString(file);
    }
  };

  const processRawRows = (rows: string[][]) => {
    const formatted = rows
      .map(row => ({ x: String(row[0] || ""), y: String(row[1] || "") }))
      .filter(row => row.x !== "" || row.y !== "");
    
    if (formatted.length > 0) {
      setDataPoints(formatted);
    }
  };

  const loadExample = () => {
    setDataPoints(EXAMPLE_DATASET.map(p => ({ x: String(p.x), y: String(p.y) })));
    setTitle("Example: Velocity Observation");
    setXAxisLabel("Time (s)");
    setYAxisLabel("Velocity (m/s)");
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split(/\r?\n/).map(line => line.split(/\t|,/));
      processRawRows(rows);
    } catch (err) {
      setError("Failed to read from clipboard. Please ensure you have copied tabular data.");
    }
  };

  const exportPNG = () => {
    if (!chartRef.current) return;
    const link = document.createElement('a');
    link.download = `${title.toLowerCase().replace(/\s+/g, '-')}-graph.png`;
    link.href = chartRef.current.toBase64Image();
    link.click();
  };

  const exportSVG = () => {
      if (!chartRef.current) return;
      // Note: Full SVG export usually requires a plugin like 'chartjs-to-svg'.
      // We'll providing a prompt-friendly partial solution or just explain PNG/PDF are preferred for exact rendering.
      // But we can generate a simple SVG wrap if needed. For now, we'll notify that PNG/PDF are primary.
      exportPNG();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // Title
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Indigo
    doc.text("Graph Observation Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on ${timestamp} via LabRecord AI`, 14, 30);

    // Meta Info
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text(`Title: ${title}`, 14, 45);

    // Regression Results
    if (regressionResults && showRegression) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, 52, 182, 30, 'F');
        doc.setFontSize(11);
        doc.setTextColor(51, 65, 85);
        doc.text("Regression Analysis Model (OLS)", 20, 60);
        doc.setFontSize(10);
        doc.text(`Equation: ${regressionResults.equation}`, 20, 68);
        doc.text(`R-Squared (r²): ${regressionResults.r2.toFixed(4)}`, 20, 74);
    }

    // Graph Image
    if (chartRef.current) {
      const chartBase64 = chartRef.current.toBase64Image();
      doc.addImage(chartBase64, 'PNG', 14, 90, 182, 100);
    }

    // Data Table
    const tableData = dataPoints
      .map(p => [p.x, p.y])
      .filter(p => p[0] !== "" && p[1] !== "");

    autoTable(doc, {
      startY: 200,
      head: [[xAxisLabel, yAxisLabel]],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      margin: { top: 20 },
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-report.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
               <LineChartIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Professional Graph Studio</h1>
              <p className="text-sm text-slate-500 font-medium">Generate publication-quality charts with OLS regression</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadExample} className="text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-bold text-xs uppercase tracking-wider">
               <Zap className="h-3 w-3 mr-2" /> Example Case
            </Button>
            <div className="h-8 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 shadow-md font-bold text-xs uppercase tracking-wider px-6" onClick={() => setActiveTab("preview")}>
               <Eye className="h-3 w-3 mr-2" /> Live Preview
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main Sidebar: Workspace & Configuration */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Input Workspace */}
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="py-4 px-6 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Data Workspace</CardTitle>
                </div>
                <div className="flex gap-2">
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={handlePaste} title="Paste from Clipboard">
                      <TableIcon className="h-4 w-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600" onClick={() => fileInputRef.current?.click()} title="Upload CSV/Excel">
                      <Upload className="h-4 w-4" />
                   </Button>
                   <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[400px] overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                      <tr>
                        <th className="px-4 py-2 text-left w-12">#</th>
                        <th className="px-4 py-2 text-left">Independent (X)</th>
                        <th className="px-4 py-2 text-left">Dependent (Y)</th>
                        <th className="px-4 py-2 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {dataPoints.map((row, idx) => (
                        <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-1.5 text-slate-400 font-mono text-[10px]">{idx + 1}</td>
                          <td className="px-2 py-1.5">
                            <input 
                              type="text" 
                              value={row.x} 
                              onChange={(e) => updateCell(idx, 'x', e.target.value)}
                              placeholder="X Value"
                              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-300 font-medium"
                            />
                          </td>
                          <td className="px-2 py-1.5 border-l border-slate-50">
                            <input 
                              type="text" 
                              value={row.y} 
                              onChange={(e) => updateCell(idx, 'y', e.target.value)}
                              placeholder="Y Value"
                              className="w-full bg-transparent border-none focus:ring-0 focus:outline-none placeholder:text-slate-300 font-medium"
                            />
                          </td>
                          <td className="px-2 py-1.5 text-right">
                             <button onClick={() => removeRow(idx)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all">
                               <Trash2 className="h-3.5 w-3.5" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button variant="ghost" className="w-full py-3 h-auto text-indigo-600 hover:bg-indigo-50 border-t border-slate-100 rounded-none font-bold text-[10px] uppercase tracking-wider" onClick={addRow}>
                  <Plus className="h-3 w-3 mr-2" /> Append Observation Array
                </Button>
              </CardContent>
            </Card>

            {/* Display Settings */}
            <Card className="border-slate-200 shadow-sm">
               <CardHeader className="py-4 px-6 border-b border-slate-50">
                  <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Visualization Controls</CardTitle>
               </CardHeader>
               <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Chart Architecture</label>
                     <div className="grid grid-cols-2 gap-2">
                        {(["scatter", "line", "bar", "histogram", "box"] as const).map(type => (
                           <Button 
                             key={type} 
                             variant={graphType === type ? "default" : "outline"} 
                             size="sm" 
                             className={cn("text-[10px] flex gap-2 capitalize font-bold", graphType === type ? "bg-indigo-600" : "text-slate-600 border-slate-200")} 
                             onClick={() => setGraphType(type)}
                           >
                              {type === 'scatter' && <Target className="h-3 w-3" />}
                              {type === 'line' && <Activity className="h-3 w-3" />}
                              {type === 'bar' && <BarChart2 className="h-3 w-3" />}
                              {type === 'histogram' && <Maximize2 className="h-3 w-3" />}
                              {type === 'box' && <Grid3X3 className="h-3 w-3" />}
                              {type}
                           </Button>
                        ))}
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Color Theme</label>
                        <div className="flex gap-2">
                           {["#4f46e5", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444"].map(c => (
                              <button 
                                key={c} 
                                onClick={() => setPrimaryColor(c)} 
                                className={cn("h-6 w-6 rounded-full border-2 transition-all", primaryColor === c ? "border-slate-900 scale-110" : "border-white shadow-sm")} 
                                style={{ backgroundColor: c }} 
                              />
                           ))}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Rendering Options</label>
                        <div className="flex gap-2 flex-wrap">
                           <Button 
                             variant={showGrid ? "secondary" : "ghost"} 
                             size="icon" 
                             className="h-8 w-8 hover:bg-slate-100" 
                             onClick={() => setShowGrid(!showGrid)} 
                             title="Toggle Grid"
                           >
                              <Grid3X3 className={cn("h-4 w-4", showGrid ? "text-indigo-600" : "text-slate-400")} />
                           </Button>
                           <Button 
                             variant={showRegression ? "secondary" : "ghost"} 
                             size="icon" 
                             className="h-8 w-8 hover:bg-slate-100" 
                             onClick={() => setShowRegression(!showRegression)} 
                             title="Linear Regression Line"
                           >
                              <TrendingUp className={cn("h-4 w-4", showRegression ? "text-indigo-600" : "text-slate-400")} />
                           </Button>
                           <Button 
                             variant={isLogScale ? "secondary" : "ghost"} 
                             size="icon" 
                             className="h-8 w-8 hover:bg-slate-100" 
                             onClick={() => setIsLogScale(!isLogScale)} 
                             title="Logarithmic Scale"
                           >
                              <Database className={cn("h-4 w-4", isLogScale ? "text-indigo-600" : "text-slate-400")} />
                           </Button>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-100">
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter flex justify-between">
                           <span>Base Point Size</span>
                           <span>{pointSize}px</span>
                        </label>
                        <input type="range" min="0" max="15" value={pointSize} onChange={(e) => setPointSize(Number(e.target.value))} className="w-full accent-indigo-600 h-1" />
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter flex justify-between">
                           <span>Stroke Integrity</span>
                           <span>{lineWidth}px</span>
                        </label>
                        <input type="range" min="1" max="5" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-full accent-indigo-600 h-1" />
                     </div>
                  </div>
               </CardContent>
            </Card>

          </aside>

          {/* Visualization Preview Section */}
          <main className="lg:col-span-8 space-y-6">
            
            <Card className="border-slate-200 shadow-sm h-full flex flex-col overflow-hidden bg-white">
              <CardHeader className="py-4 px-6 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Render Engine</CardTitle>
                </div>
                <div className="flex gap-2">
                   <Button 
                     variant="outline" 
                     size="xs" 
                     onClick={saveToCloud} 
                     disabled={isSaving || dataPoints.length < 2} 
                     className={cn("h-8 text-[10px] font-bold uppercase tracking-tight shadow-sm", saveSuccess ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-white border-slate-200")}
                   >
                      {isSaving ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <Database className="h-3 w-3 mr-1.5" />}
                      {saveSuccess ? "Synced" : "Save Cloud"}
                   </Button>
                   <Button variant="outline" size="xs" onClick={exportPNG} disabled={dataPoints.length < 2} className="h-8 text-[10px] font-bold uppercase tracking-tight border-slate-200 bg-white shadow-sm">
                      <Download className="h-3 w-3 mr-1.5" /> Snapshot (PNG)
                   </Button>
                   <Button variant="outline" size="xs" onClick={exportPDF} disabled={dataPoints.length < 2} className="h-8 text-[10px] font-bold uppercase tracking-tight border-indigo-200 text-indigo-600 hover:bg-indigo-50 shadow-sm">
                      <FileText className="h-3 w-3 mr-1.5" /> Full Document (PDF)
                   </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Observation Title</label>
                      <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 text-sm font-semibold border-slate-200 shadow-none focus:border-indigo-500 bg-slate-50/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Abscissa (X) Metric</label>
                      <Input value={xAxisLabel} onChange={(e) => setXAxisLabel(e.target.value)} className="h-10 text-sm font-semibold border-slate-200 shadow-none focus:border-indigo-500 bg-slate-50/50" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Ordinate (Y) Metric</label>
                      <Input value={yAxisLabel} onChange={(e) => setYAxisLabel(e.target.value)} className="h-10 text-sm font-semibold border-slate-200 shadow-none focus:border-indigo-500 bg-slate-50/50" />
                   </div>
                </div>

                <div className="w-full h-[500px] border border-slate-100 rounded-2xl bg-slate-50/30 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 p-8">
                     {dataPoints.some(p => p.x !== "" && p.y !== "") ? (
                        <>
                          {graphType === "scatter" && <Scatter data={chartData} options={chartOptions as any} ref={chartRef} />}
                          {graphType === "line" && <Line data={chartData} options={chartOptions as any} ref={chartRef} />}
                          {graphType === "bar" && <Bar data={chartData} options={chartOptions as any} ref={chartRef} />}
                          {graphType === "histogram" && <Bar data={chartData} options={chartOptions as any} ref={chartRef} />}
                        </>
                     ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                           <div className="h-20 w-20 bg-white rounded-3xl shadow-xl shadow-slate-100 flex items-center justify-center border border-slate-50 animate-bounce">
                              <LineChartIcon className="h-10 w-10 text-slate-200" />
                           </div>
                           <div className="text-center">
                              <h3 className="font-bold text-slate-800">Observation Data Missing</h3>
                              <p className="text-xs text-slate-400 mt-1 max-w-[240px] leading-relaxed mx-auto">
                                Populate the observation table on the left or load an example dataset to begin visualization.
                              </p>
                           </div>
                        </div>
                     )}
                  </div>
                </div>

                {regressionResults && showRegression && (
                   <div className="mt-6 flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                      <div className="flex-1 space-y-1 z-10">
                         <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-indigo-400" />
                            <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">OLS Regression Model Active</span>
                         </div>
                         <h4 className="text-2xl font-mono font-bold text-white tracking-tight">{regressionResults.equation}</h4>
                      </div>
                      <div className="flex gap-4 md:border-l md:border-slate-800 md:pl-8 z-10 w-full md:w-auto">
                         <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Correlation (r²)</p>
                            <p className="text-xl font-mono font-bold text-indigo-300">{regressionResults.r2.toFixed(4)}</p>
                         </div>
                         <div className="space-y-0.5">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Slope (m)</p>
                            <p className="text-xl font-mono font-bold text-slate-200">{regressionResults.slope.toFixed(4)}</p>
                         </div>
                      </div>
                   </div>
                )}
              </CardContent>
            </Card>

          </main>
        </div>
      </div>
    </div>
  );
}
