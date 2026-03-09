"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Play, CheckCircle2, AlertCircle, FileText, Sparkles, Beaker, ShieldAlert, BadgeHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

type ParsedData = {
  x: any[];
  y: any[];
};

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [pasteData, setPasteData] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [previewRows, setPreviewRows] = useState<any[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // AI Demo State Tracker
  const [experimentTitle, setExperimentTitle] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);
  const chartRef = useRef<any>(null);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

  // --- Core Processing Mirrors Dashboard Lab Tool ---
  const processRawData = (rows: any[][]) => {
    try {
      if (!rows || rows.length < 2) throw new Error("Dataset is too small or empty.");
      const firstDataRowIndex = rows.findIndex(row => row.length >= 2 && row[0] !== undefined && row[1] !== undefined);
      if (firstDataRowIndex === -1) throw new Error("Could not find at least two columns of data.");

      const xData: number[] = [];
      const yData: number[] = [];
      const topRows: any[][] = [];
      let startIndex = 0;

      if (isNaN(Number(rows[firstDataRowIndex][0])) || isNaN(Number(rows[firstDataRowIndex][1]))) {
        startIndex = firstDataRowIndex + 1;
        topRows.push([String(rows[firstDataRowIndex][0]), String(rows[firstDataRowIndex][1])]);
      }

      for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 2) {
          const xVal = Number(row[0]);
          const yVal = Number(row[1]);
          if (!isNaN(xVal) && !isNaN(yVal)) {
             xData.push(xVal);
             yData.push(yVal);
             if (topRows.length < 6) topRows.push([xVal, yVal]);
          }
        }
      }

      if (xData.length === 0) throw new Error("No valid numeric data found.");
      setPreviewRows(topRows);
      setParsedData({ x: xData, y: yData });
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to process data. Ensure it has two numeric columns.");
      setParsedData(null);
      setPreviewRows([]);
    }
  };

  const handlePasteSubmit = () => {
    setError(null);
    if (!pasteData.trim()) return setError("Please paste some data first.");
    Papa.parse(pasteData.trim(), {
      complete: (results) => processRawData(results.data as any[][]),
      error: (err: any) => setError(err.message)
    });
  };

  const handleFileUpload = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (fileType === 'csv') {
      Papa.parse(file, {
        complete: (results) => processRawData(results.data as any[][]),
        error: (err) => setError(`CSV parsing failed: ${err.message}`)
      });
    } else if (fileType === 'xlsx' || fileType === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          processRawData(json as any[][]);
        } catch (err) {
          setError("Failed to read Excel file.");
        }
      };
      reader.readAsBinaryString(file);
    } else setError("Unsupported file format.");
  };

  const handleAnalyzeData = async () => {
    if (!parsedData) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch('/api/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...parsedData, isDemo: true })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze data server-side.");
      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    if (hasGeneratedOnce) {
      setError("Demo limit reached. You can only generate one report in Demo mode.");
      return;
    }
    if (!analysisResult) return;
    setIsGeneratingReport(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experiment_title: experimentTitle || "Lab Experiment",
          statistics: {
            mean: analysisResult.mean,
            std_dev: analysisResult.std_dev,
            error_percent: analysisResult.error_percent,
            slope: analysisResult.slope
          },
          data_summary: "Generated from raw sensor data",
          graph_url: chartRef.current?.toBase64Image() || "",
          isDemo: true
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI report.");
      setReportResult(data);
      setHasGeneratedOnce(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-20">
      <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
        
        {/* Registration Wrapper Header */}
        <div className="bg-indigo-600 rounded-2xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <span className="bg-white/20 text-indigo-50 text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 inline-block">
              Demo Environment
            </span>
            <h2 className="text-2xl font-bold mb-2">Try the AI Workflow</h2>
            <p className="text-indigo-100 max-w-lg">
              Generate a sample report to see how the system seamlessly converts structured raw datasets into perfectly engineered lab documents!
            </p>
          </div>
          <Link href="/auth/signup" className="w-full md:w-auto shrink-0">
             <Button className="w-full bg-white text-indigo-700 hover:bg-slate-100 font-bold h-12 px-6">
                Create Free Account
             </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload Validation Samples</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Data Source Tab logic mirrored strictly */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Paste Demo Dataset</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                placeholder="Time, Voltage&#10;0, 1.2&#10;1, 1.4&#10;2, 1.8" 
                className="min-h-[200px] font-mono text-sm bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-lg mb-4"
                value={pasteData}
                onChange={(e) => setPasteData(e.target.value)}
              />
              <Button onClick={handlePasteSubmit} variant="default" className="w-full">
                Parse Data
              </Button>
              {error && (
                <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" /> <p>{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 h-full flex flex-col">
              <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-indigo-500" /> Data Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex-1 relative min-h-[250px]">
                {previewRows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableBody>
                        {previewRows.map((row, idx) => (
                          <TableRow key={idx}>
                            <TableCell className="font-mono text-xs">{row[0]}</TableCell>
                            <TableCell className="font-mono text-xs">{row[1]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <Table className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm">No data to preview</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl mt-auto">
                <Button 
                  onClick={handleAnalyzeData}
                  disabled={!parsedData || isAnalyzing}
                  className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isAnalyzing ? "Processing Demo Run..." : "Analyze Demo Set"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {analysisResult && (
          <div className="mt-12 space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b pb-2">Analysis Results</h2>
            <Card className="shadow-sm border-slate-200 p-6 flex flex-col justify-center h-[400px] w-full">
               <Scatter 
                 ref={chartRef}
                 data={{
                   datasets: [
                     {
                       type: 'scatter' as const,
                       label: 'Regression Line',
                       data: parsedData ? parsedData.x.map((xVal) => ({ x: xVal, y: analysisResult.slope * xVal + analysisResult.intercept })) : [],
                       borderColor: 'rgb(255, 99, 132)',
                       borderWidth: 2,
                       pointRadius: 0,
                       showLine: true
                     },
                     {
                       type: 'scatter' as const,
                       label: 'Data Points',
                       data: parsedData ? parsedData.x.map((xVal, i) => ({ x: xVal, y: parsedData.y[i] })) : [],
                       backgroundColor: 'rgb(54, 162, 235)'
                     }
                   ]
                 }}
               />
            </Card>

            <Card className="shadow-sm border-slate-200 mt-8 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-500" /> Evaluate AI Generations
                </CardTitle>
              </CardHeader>
              <CardFooter>
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={isGeneratingReport || hasGeneratedOnce}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  {isGeneratingReport ? "Drafting Report..." : hasGeneratedOnce ? "Demo Limits Reached" : "Generate Core Sample"}
                </Button>
              </CardFooter>
            </Card>
            
            {reportResult && (
              <div className="mt-8 space-y-6 pb-20">
                <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex flex-col md:flex-row items-center gap-6 justify-between animate-in zoom-in slide-in-from-bottom-2">
                   <div>
                     <h3 className="font-bold text-amber-900 text-lg mb-1">Create a free account to save and download your lab report!</h3>
                     <p className="text-amber-800 text-sm">Demo environments cannot write to PDFs or connect to cloud storage.</p>
                   </div>
                   <Link href="/auth/signup">
                     <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                       Create Free Account
                     </Button>
                   </Link>
                </div>
                
                <Card className="p-6">
                  <CardTitle className="mb-4 bg-indigo-50 w-fit p-2 rounded text-indigo-700">Observation Results Output Snippet</CardTitle>
                  <CardContent className="space-y-4 whitespace-pre-line text-sm text-slate-700">
                    <p><strong className="text-slate-900">Aim: </strong>{reportResult.aim}</p>
                    <p><strong className="text-slate-900">Procedure: </strong>{reportResult.procedure}</p>
                    <div className="text-center italic mt-4 text-slate-400">
                      [Full PDF features exclusively unlockable via Free Signups and Subscriptions]
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
