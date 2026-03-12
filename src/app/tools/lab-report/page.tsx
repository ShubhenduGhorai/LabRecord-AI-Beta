"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileSpreadsheet, Play, CheckCircle2, AlertCircle, FileText, Sparkles, Beaker, ShieldAlert, BadgeHelp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ErrorFallback } from "@/components/ErrorFallback";
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

export default function GenerateReportPage() {
  const [activeTab, setActiveTab] = useState("upload");
  const [pasteData, setPasteData] = useState("");
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [previewRows, setPreviewRows] = useState<any[][]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // AI Report Generation State
  const [experimentTitle, setExperimentTitle] = useState("");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportResult, setReportResult] = useState<any>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const chartRef = useRef<any>(null);

  // Helper to extract first two numeric columns from a 2D array
  const processRawData = (rows: any[][]) => {
    try {
      if (!rows || rows.length < 2) {
        throw new Error("Dataset is too small or empty.");
      }

      // Find the first row that actually has data to determine columns
      const firstDataRowIndex = rows.findIndex(row => row.length >= 2 && row[0] !== undefined && row[1] !== undefined);
      
      if (firstDataRowIndex === -1) {
         throw new Error("Could not find at least two columns of data.");
      }

      const xData: number[] = [];
      const yData: number[] = [];
      const topRows: any[][] = [];

      // Assume first row might be headers
      let startIndex = 0;
      if (isNaN(Number(rows[firstDataRowIndex][0])) || isNaN(Number(rows[firstDataRowIndex][1]))) {
        startIndex = firstDataRowIndex + 1;
        topRows.push([String(rows[firstDataRowIndex][0]), String(rows[firstDataRowIndex][1])]); // Keep headers for preview
      }

      for (let i = startIndex; i < rows.length; i++) {
        const row = rows[i];
        if (row.length >= 2) {
          const xVal = Number(row[0]);
          const yVal = Number(row[1]);
          
          if (!isNaN(xVal) && !isNaN(yVal)) {
             xData.push(xVal);
             yData.push(yVal);
             if (topRows.length < 6) {
                topRows.push([xVal, yVal]);
             }
          }
        }
      }

      if (xData.length === 0) {
        throw new Error("No valid numeric data found in the first two columns.");
      }

      setPreviewRows(topRows);
      setParsedData({ x: xData, y: yData });
      setError(null);

    } catch (err: any) {
      setError(err.message || "Failed to process data. Ensure it has two numeric columns.");
      setParsedData(null);
      setPreviewRows([]);
    }
  };

  // --- Handlers for Textarea Paste ---
  const handlePasteSubmit = () => {
    setError(null);
    if (!pasteData.trim()) {
      setError("Please paste some data first.");
      return;
    }
    
    Papa.parse(pasteData.trim(), {
      complete: (results) => {
        processRawData(results.data as any[][]);
      },
      error: (err: any) => {
        setError(err.message);
      }
    });
  };

  // --- Handlers for File Drag & Drop ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();

    if (fileType === 'csv') {
      Papa.parse(file, {
        complete: (results) => {
          processRawData(results.data as any[][]);
        },
        error: (err) => {
          setError(`CSV parsing failed: ${err.message}`);
        }
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
          setError("Failed to read Excel file. Please ensure it is a valid .xlsx or .xls file.");
        }
      };
      reader.readAsBinaryString(file);
    } else {
      setError("Unsupported file format. Please upload a CSV or Excel file.");
    }
  };

  // --- Action ---
  const handleAnalyzeData = async () => {
    if (!parsedData) return;
    
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch('/api/analyze-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parsedData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze data server-side.");
      }

      setAnalysisResult(data);
    } catch (err: any) {
      setError(err.message);
      setIsAnalyzing(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysisResult) return;

    setIsGeneratingReport(true);
    setError(null);

    try {
      const res = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          experiment_title: experimentTitle || "Lab Experiment",
          statistics: {
            mean: analysisResult.mean,
            std_dev: analysisResult.std_dev,
            error_percent: analysisResult.error_percent,
            slope: analysisResult.slope
          },
          data_summary: "Generated from raw sensor data",
          graph_url: chartRef.current?.toBase64Image() || ""
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 403 && data.limit_reached) {
          setShowUpgradeModal(true);
        }
        throw new Error(data.error || "Failed to generate report.");
      }

      setReportResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!analysisResult || !reportResult) return;

    setIsDownloadingPdf(true);
    setError(null);

    try {
      // Format data for PDF
      const observationTable = parsedData?.x.map((xVal, i) => ({
        "Reading #": i + 1,
        "X Value": xVal,
        "Y Value": parsedData.y[i]
      })) || [];

      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: experimentTitle || "Lab Experiment",
          aim: reportResult.aim,
          apparatus: reportResult.apparatus,
          theory: reportResult.theory,
          procedure: reportResult.procedure,
          observation_table: observationTable,
          graph_url: chartRef.current?.toBase64Image() || "",
          calculations: `Mean of Y: ${analysisResult.mean}\nStandard Deviation: ${analysisResult.std_dev}\nSlope (m): ${analysisResult.slope}\nIntercept (b): ${analysisResult.intercept}\nAverage Error: ${analysisResult.error_percent}%`,
          result: reportResult.result,
          conclusion: reportResult.conclusion,
          precautions: reportResult.precautions
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate PDF.");
      }

      // Trigger download
      const link = document.createElement('a');
      link.href = data.pdf_url;
      link.download = `LabReport-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (error && !analysisResult && !isAnalyzing && !isGeneratingReport) {
    return (
      <div className="p-10">
        <ErrorFallback error={error} reset={() => setError(null)} />
      </div>
    );
  }

  return (
    <div className="px-4 py-8 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload Experiment Data</h1>
        <p className="text-muted-foreground mt-2 text-slate-500">
          Upload your raw lab dataset or paste it manually to begin AI analysis.
        </p>
      </div>

      {showUpgradeModal && (
        <Card className="border-indigo-200 bg-indigo-50 shadow-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-900 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5" />
              Upgrade Required cost
            </CardTitle>
            <CardDescription className="text-indigo-700 font-medium">
              You've reached your monthly limit of 3 reports on the Free plan.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/billing">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold">
                Upgrade to Pro
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Input Methods */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Data Source</CardTitle>
            <CardDescription>Select how you want to provide your data.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="upload">File Upload</TabsTrigger>
                <TabsTrigger value="paste">Paste Data</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upload" className="space-y-4">
                <div 
                  className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
                    isDragging ? "border-indigo-500 bg-indigo-50" : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <div className="p-4 bg-white rounded-full shadow-sm border border-slate-100 mb-4">
                    <UploadCloud className="h-8 w-8 text-indigo-500" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">Click to upload or drag and drop</h3>
                  <p className="text-xs text-slate-500">CSV or Excel files (.xlsx) supported</p>
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept=".csv, .xlsx, .xls" 
                    className="hidden" 
                    onChange={handleFileInput}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="paste" className="space-y-4">
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Time, Voltage&#10;0, 1.2&#10;1, 1.4&#10;2, 1.8" 
                    className="min-h-[220px] font-mono text-sm bg-slate-50 border-slate-200 focus-visible:ring-indigo-500 rounded-lg"
                    value={pasteData}
                    onChange={(e) => setPasteData(e.target.value)}
                  />
                  <Button 
                    onClick={handlePasteSubmit} 
                    variant="secondary" 
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium"
                  >
                    Parse Pasted Data
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-6 flex items-start gap-3 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Preview & Action */}
        <div className="space-y-6">
          <Card className="shadow-sm border-slate-200 h-full flex flex-col">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileSpreadsheet className="h-5 w-5 text-indigo-500" />
                    Data Preview
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {parsedData 
                      ? `${parsedData.x.length} data points extracted successfully.` 
                      : "Upload or paste data to see a preview."}
                  </CardDescription>
                </div>
                {parsedData && <CheckCircle2 className="h-6 w-6 text-green-500" />}
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 relative min-h-[250px]">
              {previewRows.length > 0 ? (
                <div className="w-full overflow-x-auto pb-2">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow>
                        <TableHead className="w-1/2 font-semibold text-slate-700">Column 1 (X)</TableHead>
                        <TableHead className="w-1/2 font-semibold text-slate-700">Column 2 (Y)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewRows.map((row, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-mono text-xs">{row[0]}</TableCell>
                          <TableCell className="font-mono text-xs">{row[1]}</TableCell>
                        </TableRow>
                      ))}
                      {parsedData && parsedData.x.length > previewRows.length && (
                         <TableRow>
                           <TableCell colSpan={2} className="text-center text-xs text-slate-400 italic py-3 bg-slate-50/30">
                             ... and {parsedData.x.length - previewRows.length + (isNaN(Number(previewRows[0]?.[0])) ? 1 : 0)} more rows
                           </TableCell>
                         </TableRow>
                      )}
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
                className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 disabled:shadow-none disabled:bg-slate-200 disabled:text-slate-400 transition-all"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                {isAnalyzing ? "Analyzing..." : "Analyze Data"}
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>

      {/* Analysis Results Section */}
      {analysisResult && (
        <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b pb-2">Analysis Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Mean (Y)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">{analysisResult.mean}</div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Standard Deviation (Y)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-800">{analysisResult.std_dev}</div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Linear Regression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1.5 text-slate-600">
                  <p><span className="font-semibold text-slate-800">Slope (m):</span> {analysisResult.slope}</p>
                  <p><span className="font-semibold text-slate-800">Intercept (b):</span> {analysisResult.intercept}</p>
                  <p><span className="font-semibold text-red-600">Avg % Error:</span> {analysisResult.error_percent}%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="overflow-hidden shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle>Generated Plot</CardTitle>
              <CardDescription>Experimental Data vs. Calculated Linear Regression</CardDescription>
            </CardHeader>
            <CardContent className="p-4 bg-white flex justify-center py-8 h-[400px] w-full">
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
                 options={{
                   maintainAspectRatio: false,
                   responsive: true,
                   animation: false,
                   scales: {
                     x: { title: { display: true, text: 'X Values' } },
                     y: { title: { display: true, text: 'Y Values' } }
                   }
                 }}
               />
            </CardContent>
          </Card>

          {/* AI Report Generation Section */}
          <Card className="shadow-sm border-slate-200 mt-8 bg-gradient-to-br from-slate-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-500" />
                AI Lab Report Generator
              </CardTitle>
              <CardDescription>
                Let our AI draft a comprehensive, academic report based on these results.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="experiment-title" className="text-sm font-medium text-slate-700">
                  Experiment Title <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <Input 
                  id="experiment-title"
                  placeholder="e.g. Voltage vs Time Constants" 
                  value={experimentTitle}
                  onChange={(e) => setExperimentTitle(e.target.value)}
                  className="max-w-md bg-white"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-4 flex-wrap">
              <Button 
                onClick={handleGenerateReport} 
                disabled={isGeneratingReport}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
              >
                {isGeneratingReport ? (
                   <>
                     <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                     Drafting Report...
                   </>
                ) : (
                  <>
                     <FileText className="mr-2 h-4 w-4" />
                     Generate AI Report
                  </>
                )}
              </Button>

              {reportResult && (
                <Button 
                  onClick={handleDownloadPdf}
                  disabled={isDownloadingPdf}
                  variant="outline"
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                >
                  {isDownloadingPdf ? (
                     <>
                        <Download className="mr-2 h-4 w-4 animate-bounce" />
                        Generating PDF...
                     </>
                  ) : (
                    <>
                       <Download className="mr-2 h-4 w-4" />
                       Download Lab Report PDF
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Generated Report Output */}
          {reportResult && (
            <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 border-b pb-2 flex items-center gap-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                Generated Report
              </h2>
              
              <div className="space-y-6">
                
                {/* Aim & Apparatus */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                        <Sparkles className="h-5 w-5 text-indigo-500" />
                        Aim
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.aim}
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                        <Beaker className="h-5 w-5 text-indigo-500" />
                        Apparatus
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.apparatus}
                    </CardContent>
                  </Card>
                </div>

                {/* Theory & Procedure */}
                <div className="grid grid-cols-1 gap-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                        <FileText className="h-5 w-5 text-indigo-500" />
                        Theory
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.theory}
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                        <FileText className="h-5 w-5 text-indigo-500" />
                        Procedure
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.procedure}
                    </CardContent>
                  </Card>
                </div>
                
                {/* Result & Conclusion */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                        <Beaker className="h-5 w-5 text-indigo-500" />
                        Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.result}
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                      <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                        <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                        Conclusion
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.conclusion}
                    </CardContent>
                  </Card>
                </div>

                {/* Error Analysis & Precautions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-red-50/30">
                      <CardTitle className="text-lg flex items-center gap-2 text-red-900">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                        Error Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.error_analysis}
                    </CardContent>
                  </Card>
                  
                  <Card className="shadow-sm border-slate-200">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-amber-50/30">
                      <CardTitle className="text-lg flex items-center gap-2 text-amber-900">
                        <ShieldAlert className="h-5 w-5 text-amber-500" />
                        Precautions
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                      {reportResult.precautions}
                    </CardContent>
                  </Card>
                </div>

                {/* Viva Questions */}
                <Card className="shadow-sm border-slate-200 mb-10">
                  <CardHeader className="pb-3 border-b border-slate-100 bg-emerald-50/30">
                    <CardTitle className="text-lg flex items-center gap-2 text-emerald-900">
                      <BadgeHelp className="h-5 w-5 text-emerald-500" />
                      Viva Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <ul className="space-y-3">
                      {reportResult.viva_questions?.map((question: string, index: number) => (
                        <li key={index} className="flex gap-3 text-sm text-slate-700">
                           <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-medium text-xs">
                             {index + 1}
                           </span>
                           <span className="pt-0.5 leading-relaxed">{question}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
