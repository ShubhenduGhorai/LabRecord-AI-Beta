"use client";

import { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Copy, 
  Check, 
  AlertCircle, 
  Settings2, 
  Eye, 
  Edit3,
  Loader2,
  Sparkles,
  RefreshCw,
  FileDown,
  Layout as LayoutIcon,
  ChevronRight,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

const ACADEMIC_STYLES = ["APA", "IEEE", "MLA", "Chicago"];

export default function ResearchFormattingPage() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("APA");
  const [result, setResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [copySuccess, setCopySuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAIFormat = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      const res = await fetch("/api/ai/format", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, style })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Formatting failed");
      setResult(data.result);
      setViewMode("preview");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(22).setFont("helvetica", "bold").text(`${style} Research Format`, 20, y);
    y += 15;
    
    const sections = ["abstract", "introduction", "methodology", "results", "conclusion"];
    sections.forEach(s => {
      if (result[s]) {
        doc.setFontSize(12).setFont("helvetica", "bold").text(s.toUpperCase(), 20, y);
        y += 7;
        doc.setFontSize(10).setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(result[s], 170);
        doc.text(lines, 20, y);
        y += (lines.length * 5) + 10;
        if (y > 270) { doc.addPage(); y = 20; }
      }
    });
    doc.save("FormattedResearch.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Section */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="p-3 bg-purple-600 rounded-2xl shadow-lg shadow-purple-100">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Research Formatting Studio</h1>
            <p className="text-slate-500 font-medium">Automatic academic standard alignment & sectioning</p>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Panel */}
          <div className="space-y-6 order-2 lg:order-1">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Edit3 className="h-5 w-5 text-purple-500" /> Manuscript Editor
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Upload className="h-4 w-4" /></Button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => setText(evt.target?.result as string);
                    reader.readAsText(file);
                  }
                }} />
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Academic Style</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {ACADEMIC_STYLES.map(s => (
                        <Button key={s} variant={style === s ? "secondary" : "outline"} onClick={() => setStyle(s)} className={cn("h-10 rounded-xl font-bold text-xs", style === s ? "bg-purple-50 text-purple-600 border-purple-200" : "text-slate-400")}>
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Raw Content</Label>
                    <Textarea 
                      placeholder="Paste your unstructured research text here..." 
                      value={text} 
                      onChange={(e) => setText(e.target.value)} 
                      className="min-h-[400px] rounded-2xl border-slate-200 focus:ring-purple-500/10 text-slate-700 leading-relaxed resize-none p-6" 
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Button onClick={runAIFormat} disabled={isProcessing || !text} className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-purple-100">
                    {isProcessing ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
                    Align to {style} Standard
                  </Button>
                </div>
              </CardContent>
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

            <Card className="rounded-[2.5rem] bg-white border-slate-200 shadow-xl overflow-hidden min-h-[800px] flex flex-col">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5 text-purple-500" /> Structure Preview</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportPDF} disabled={!result} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase"><FileDown className="h-3.5 w-3.5 mr-2" /> PDF</Button>
                  <Button variant="outline" size="sm" disabled={!result} onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(false), 2000);
                  }} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase">
                    {copySuccess ? <Check className="h-3.5 w-3.5 mr-2 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                    Copy
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-12 bg-[#fafafa] font-serif text-slate-800">
                {result ? (
                  <div className="max-w-2xl mx-auto space-y-10">
                    <div className="text-center space-y-2 mb-12">
                      <h2 className="text-2xl font-black uppercase tracking-[0.2em]">{style} FORMATTED OUTPUT</h2>
                      <div className="h-1 w-12 bg-purple-500 mx-auto" />
                    </div>

                    {["abstract", "introduction", "methodology", "results", "conclusion"].map(s => result[s] && (
                      <div key={s} className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-purple-600 border-l-4 border-purple-600 pl-4">{s}</h4>
                        <p className="text-sm md:text-base leading-[2] whitespace-pre-wrap">{result[s]}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-48">
                    <LayoutIcon className="h-20 w-20 text-slate-200 mb-6" />
                    <p className="font-black uppercase tracking-widest text-xs">Awaiting Analysis</p>
                    <p className="text-[10px] mt-2 max-w-[200px]">AI will automatically detect sections and align them with your selected academic style.</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-6 bg-white border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-purple-500" /> Logic Engine: Active</div>
                 <span>Academic Integrity Cleared</span>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
