"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Sparkles, 
  Download, 
  Copy, 
  CheckCircle2, 
  Zap, 
  Settings2, 
  Eye, 
  Edit3,
  Loader2,
  ArrowRight,
  AlertCircle,
  FileDown,
  Layout,
  Table as TableIcon,
  RotateCcw,
  ChevronRight,
  ClipboardCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";

const REPORT_SECTIONS = [
  { id: "aim", label: "Aim" },
  { id: "theory", label: "Theory" },
  { id: "apparatus", label: "Apparatus" },
  { id: "procedure", label: "Procedure" },
  { id: "observations", label: "Observations" },
  { id: "calculations", label: "Calculations" },
  { id: "result", label: "Result" },
  { id: "conclusion", label: "Conclusion" },
  { id: "precautions", label: "Precautions" }
];

export default function AIReportWriterPage() {
  const [metadata, setMetadata] = useState({ name: "", subject: "", description: "" });
  const [sections, setSections] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [activeSection, setActiveSection] = useState("aim");

  const runAIReport = async () => {
    setError(null);
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: metadata.name, 
          subject: metadata.subject, 
          description: metadata.description 
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI Generation failed");
      setSections(data.result);
      setViewMode("preview");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(22).text("Laboratory Report", 20, y);
    y += 10;
    doc.setFontSize(10).text(`${metadata.name} | ${metadata.subject}`, 20, y);
    y += 10;
    doc.line(20, y, 190, y);
    y += 15;

    REPORT_SECTIONS.forEach(s => {
      if (sections[s.id]) {
        doc.setFontSize(12).setFont("helvetica", "bold").text(s.label.toUpperCase(), 20, y);
        y += 7;
        doc.setFontSize(10).setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(sections[s.id], 170);
        doc.text(lines, 20, y);
        y += (lines.length * 5) + 10;
        if (y > 270) { doc.addPage(); y = 20; }
      }
    });
    doc.save("LabReport.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Section */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
            <FileText className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Lab Report Writer</h1>
            <p className="text-slate-500 font-medium">Draft professional experiment documentation instantly</p>
          </div>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Left Panel */}
          <div className="space-y-6 order-2 lg:order-1">
            <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings2 className="h-5 w-5 text-indigo-500" /> Experiment Brief
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experiment Title</Label>
                    <Input placeholder="e.g. Newton's Second Law" value={metadata.name} onChange={(e) => setMetadata({...metadata, name: e.target.value})} className="h-12 rounded-xl border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subject / Category</Label>
                    <Input placeholder="e.g. Applied Physics" value={metadata.subject} onChange={(e) => setMetadata({...metadata, subject: e.target.value})} className="h-12 rounded-xl border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Context & Observations</Label>
                    <Textarea placeholder="Describe the experiment setup or paste raw observations..." value={metadata.description} onChange={(e) => setMetadata({...metadata, description: e.target.value})} className="min-h-[150px] rounded-xl border-slate-200 resize-none" />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                   <Button onClick={runAIReport} disabled={isGenerating || !metadata.name} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-indigo-100">
                    {isGenerating ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <Sparkles className="h-5 w-5 mr-2" />}
                    Compose AI Report
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {Object.keys(sections).length > 0 && (
              <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden p-6 bg-slate-900 text-white">
                 <div className="flex bg-slate-800/50 p-1 rounded-xl mb-4 overflow-x-auto">
                    {REPORT_SECTIONS.map(s => (
                      <Button key={s.id} variant="ghost" onClick={() => setActiveSection(s.id)} className={cn("text-[8px] font-black uppercase tracking-widest px-3 h-8", activeSection === s.id ? "bg-white text-slate-900" : "text-slate-400")}>
                        {s.label}
                      </Button>
                    ))}
                 </div>
                 <Textarea value={sections[activeSection]} onChange={(e) => setSections({...sections, [activeSection]: e.target.value})} className="min-h-[200px] bg-transparent border-none focus-visible:ring-0 font-serif leading-relaxed text-slate-300 resize-none" />
                 <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-medium text-slate-500">
                    <span>Editor Mode Active</span>
                    <Button variant="ghost" size="sm" onClick={() => setViewMode("preview")} className="text-indigo-400 text-[10px] font-black uppercase">Switch to Layout View</Button>
                 </div>
              </Card>
            )}
          </div>

          {/* Right Panel */}
          <div className="space-y-6 order-1 lg:order-2">
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-rose-600">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <p className="font-bold text-sm">{error}</p>
              </div>
            )}

            <Card className="rounded-[2.5rem] bg-white border-slate-200 shadow-xl overflow-hidden min-h-[700px] flex flex-col">
              <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
                <div>
                   <CardTitle className="text-lg flex items-center gap-2"><Eye className="h-5 w-5 text-indigo-500" /> Paper Preview</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportPDF} disabled={!sections.aim} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase"><FileDown className="h-3.5 w-3.5 mr-2" /> PDF</Button>
                  <Button variant="outline" size="sm" disabled={!sections.aim} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase"><Copy className="h-3.5 w-3.5 mr-2" /> Text</Button>
                </div>
              </CardHeader>

              <CardContent className="flex-1 p-12 bg-[#fffcf5] border-x-8 border-[#f8f9fa] shadow-inner font-serif text-slate-800">
                {sections.aim ? (
                  <div className="max-w-2xl mx-auto space-y-10">
                    <div className="text-center space-y-2 mb-16">
                      <h2 className="text-3xl font-black uppercase tracking-tighter border-b-2 border-slate-900 pb-4">{metadata.name || "Laboratory Report"}</h2>
                      <p className="text-xs font-black uppercase tracking-widest text-slate-400">{metadata.subject || "General Science"} | Draft-01</p>
                    </div>

                    {REPORT_SECTIONS.map(s => sections[s.id] && (
                      <div key={s.id} className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-900 flex items-center gap-4">
                          {s.label}
                          <span className="h-px bg-slate-200 flex-1" />
                        </h4>
                        <p className="text-sm md:text-md leading-relaxed whitespace-pre-wrap pl-4">{sections[s.id]}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-32">
                     <FileText className="h-20 w-20 text-slate-200 mb-6" />
                     <p className="font-black uppercase tracking-widest text-xs">Waiting for Content</p>
                     <p className="text-[10px] mt-2 max-w-[200px]">Define the experiment scope to generate a high-fidelity academic report.</p>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="p-6 bg-white border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                 <span>System Ver: 4.2.0</span>
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>Publication Ready</span>
                 </div>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
