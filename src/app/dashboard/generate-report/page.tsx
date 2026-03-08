"use client";

import { useState } from "react";
import { UploadCloud, FileSpreadsheet, Play, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Papa from "papaparse";
import * as XLSX from "xlsx";

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
  const handleAnalyzeData = () => {
    if (!parsedData) return;
    
    // Here is where it sends to the backend in the future
    console.log("SENDING TO BACKEND API:", parsedData);
    alert("Data sent for analysis! Check browser console for the JSON payload.");
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Upload Experiment Data</h1>
        <p className="text-muted-foreground mt-2 text-slate-500">
          Upload your raw lab dataset or paste it manually to begin AI analysis.
        </p>
      </div>

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
                <div className="overflow-x-auto">
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
                disabled={!parsedData}
                className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 disabled:shadow-none disabled:bg-slate-200 disabled:text-slate-400 transition-all"
              >
                <Play className="mr-2 h-4 w-4 fill-current" />
                Analyze Data
              </Button>
            </CardFooter>
          </Card>
        </div>

      </div>
    </div>
  );
}
