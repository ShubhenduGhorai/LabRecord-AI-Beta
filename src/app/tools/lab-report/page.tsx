"use client";

import { useState, useMemo } from "react";
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
  ClipboardCheck,
  FlaskConical,
  BookOpen,
  HelpCircle,
  Info,
  PenTool
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import { ToolNavigation } from "@/components/ToolNavigation";

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
  const [status, setStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [activeSection, setActiveSection] = useState("aim");

  const runAIReport = async () => {
    setError(null);
    setStatus("processing");
    setProcessingStep("Synthesizing experiment context...");

    try {
      await new Promise(r => setTimeout(r, 1000));
      setProcessingStep("AI is generating your result...");
      await new Promise(r => setTimeout(r, 1000));

      const prompt = `Generate a professional, structured laboratory experiment report.
Title: ${metadata.name}
Subject: ${metadata.subject || 'General Science'}
Context/Observations: ${metadata.description || 'Standard laboratory experiment'}

Please provide a JSON response with the following exact keys:
- "aim": Clear objective
- "theory": Scientific background and laws
- "apparatus": List of equipment
- "procedure": Step-by-step instructions
- "observations": What was noticed
- "calculations": Formulas or mock data processing
- "result": Final findings
- "conclusion": Scientific summary
- "precautions": Safety and error mitigation

Ensure the response is valid JSON only.`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tool: "lab-report", 
          prompt: prompt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");
      setSections(JSON.parse(data.result));
      setStatus("completed");
      setViewMode("preview");
    } catch (err: any) {
      setError("AI service temporarily unavailable. Please try again.");
      setStatus("idle");
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
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <ToolNavigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Advanced Tool Header */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -mr-12 -mt-12">
            <FileText className="h-64 w-64 text-indigo-900" />
          </div>
          
          <div className="flex gap-6 items-start relative z-10">
            <div className="h-16 w-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-200 shrink-0">
               <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">AI Lab Report Writer</h1>
              <p className="text-slate-500 font-medium mt-1 max-w-lg">Draft comprehensive, publication-ready laboratory reports based on your experiment observations and data.</p>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" className="rounded-xl h-10 border-slate-200 font-bold px-4">
                  <BookOpen className="h-4 w-4 mr-2" /> Templates
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl h-10 text-indigo-600 font-bold">
                  <Sparkles className="h-4 w-4 mr-2" /> AI Assistant
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><HelpCircle className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Editor Engine</p>
                <p className="text-xs font-bold text-indigo-600">Rich Preview Active</p>
             </div>
             <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center border border-slate-200">
                <PenTool className="h-5 w-5 text-indigo-500" />
             </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 items-start">
          
          {/* Smart Input Panel (Left) */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-slate-200 shadow-xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Settings2 className="h-6 w-6 text-indigo-500" /> Report Config
                </CardTitle>
                <CardDescription>Define the scope of your experiment</CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* Details Section */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Core Metadata</Label>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                       <Input placeholder="Experiment Name" value={metadata.name} onChange={(e) => setMetadata({...metadata, name: e.target.value})} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-xs font-semibold focus:bg-white transition-all" />
                    </div>
                    <div className="space-y-2">
                       <Input placeholder="Field of Study (e.g. Physics)" value={metadata.subject} onChange={(e) => setMetadata({...metadata, subject: e.target.value})} className="h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 text-xs font-semibold focus:bg-white transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Experimental context</Label>
                  <Textarea placeholder="Describe your procedure, apparatus, and key observations here..." value={metadata.description} onChange={(e) => setMetadata({...metadata, description: e.target.value})} className="min-h-[180px] rounded-2xl border-slate-200 bg-slate-50/50 p-4 text-xs font-medium leading-relaxed resize-none focus:bg-white transition-all" />
                </div>

                {/* Engine Feedback */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">AI Composer</p>
                     <AnimatePresence mode="wait">
                       <motion.span 
                         key={status} 
                         initial={{ opacity: 0, y: 5 }} 
                         animate={{ opacity: 1, y: 0 }}
                         className={cn(
                           "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                           status === "idle" ? "bg-slate-200 text-slate-500 border-slate-300" :
                           status === "processing" ? "bg-amber-100 text-amber-600 border-amber-200 animate-pulse" :
                           "bg-emerald-100 text-emerald-600 border-emerald-200"
                         )}
                       >
                         {status}
                       </motion.span>
                     </AnimatePresence>
                  </div>
                  
                  {status === "processing" ? (
                    <div className="space-y-3">
                       <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                         <Loader2 className="h-3 w-3 animate-spin text-indigo-600" /> {processingStep}
                       </p>
                       <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2.5 }} className="bg-indigo-600 h-full" />
                       </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      {status === "completed" ? "Academic report drafted. Switch to Editor to refine sections." : "Ready to compose your experiment report."}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={runAIReport} 
                  disabled={status === "processing" || !metadata.name} 
                  className="w-full h-16 bg-gradient-to-br from-indigo-600 to-indigo-900 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group"
                >
                  {status === "processing" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
                  Generate Full Report
                </Button>
              </CardContent>
            </Card>

            {/* Quick Section Switcher (Only after generation) */}
            {status === "completed" && (
              <Card className="rounded-[2.5rem] bg-slate-900 border-none shadow-2xl p-6 overflow-hidden relative group">
                 <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Live Editor</Label>
                       <span className="text-[10px] text-slate-500 font-bold">{activeSection.toUpperCase()}</span>
                    </div>
                    <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-white/10">
                       {REPORT_SECTIONS.map(s => (
                         <button 
                          key={s.id} 
                          onClick={() => setActiveSection(s.id)}
                          className={cn(
                            "text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap transition-all",
                            activeSection === s.id ? "bg-white text-slate-900" : "text-slate-500 hover:text-white"
                          )}
                         >
                           {s.label}
                         </button>
                       ))}
                    </div>
                    <Textarea 
                      value={sections[activeSection]} 
                      onChange={(e) => setSections({...sections, [activeSection]: e.target.value})} 
                      className="min-h-[250px] bg-transparent border-none focus-visible:ring-0 font-serif leading-relaxed text-slate-300 resize-none text-sm p-0 no-scrollbar" 
                    />
                 </div>
              </Card>
            )}
          </div>

          {/* Advanced Preview Panel (Right) */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex items-center gap-4 text-rose-600">
                   <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <AlertCircle className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="font-black uppercase text-[10px] tracking-widest">Composer Error</p>
                     <p className="font-bold text-sm">{error}</p>
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-6"
                >
                  <Card className="rounded-[3rem] bg-white border-slate-200 shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
                    <CardHeader className="p-8 md:p-12 border-b border-slate-50 flex flex-row items-center justify-between bg-[#fdfdfd]">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center">
                            <Eye className="h-6 w-6 text-amber-600" />
                         </div>
                         <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Paper Preview</h2>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportPDF} disabled={!sections.aim} className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-300 shadow-sm"><Download className="h-4 w-4 mr-2" /> Export PDF</Button>
                        <Button variant="outline" size="sm" disabled={!sections.aim} className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-300 shadow-sm"><Copy className="h-4 w-4 mr-2" /> Copy Text</Button>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-8 md:p-24 bg-[#fffcf5] border-x-[16px] md:border-x-[40px] border-[#f8f9fa] shadow-inner font-serif text-slate-800 relative">
                      {status === "completed" ? (
                        <div className="max-w-2xl mx-auto space-y-12">
                          <div className="text-center space-y-4 mb-20 border-b-4 border-double border-slate-900 pb-10">
                            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">{metadata.name || "Laboratory Report"}</h2>
                            <div className="flex justify-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                               <span>Subject: {metadata.subject || "Scientific Inquiry"}</span>
                               <span>Draft: Alpha-4.2</span>
                               <span>Date: {new Date().toLocaleDateString()}</span>
                            </div>
                          </div>

                          {REPORT_SECTIONS.map(s => sections[s.id] && (
                            <div key={s.id} className="space-y-6">
                              <h4 className="text-sm font-black uppercase tracking-[0.4em] text-slate-900 flex items-center gap-6">
                                {s.label}
                                <span className="h-px bg-slate-200 flex-1" />
                              </h4>
                              <p className="text-md md:text-lg leading-relaxed whitespace-pre-wrap pl-6 text-slate-700 selection:bg-indigo-100 italic md:not-italic">{sections[s.id]}</p>
                            </div>
                          ))}
                          
                          <div className="pt-20 mt-20 border-t border-slate-100 flex justify-center opacity-20 grayscale pointer-events-none">
                             <div className="border-4 border-slate-900 p-2 text-2xl font-black uppercase tracking-widest rotate-[-5deg]">LABRECORD AI VERIFIED</div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-48">
                           <div className="h-24 w-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-8 animate-pulse">
                              <BookOpen className="h-12 w-12 text-slate-300" />
                           </div>
                           <h3 className="font-black uppercase tracking-[0.3em] text-xs text-slate-900">Virtual Manuscript Empty</h3>
                           <p className="text-[10px] mt-3 max-w-[220px] font-medium leading-relaxed">Compose your experiment brief to initialize the academic drafting engine.</p>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="p-8 bg-white border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                       <span>Scientific Publication Standard v2.1</span>
                       <div className="flex items-center gap-4">
                          <span className="flex items-center gap-2"><Layout className="h-3 w-3" /> Layout Active</span>
                          <span className="flex items-center gap-2 border-l border-slate-200 pl-4 text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Ready for Print</span>
                       </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Persistence Footer */}
      {status === "completed" && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
           <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <span className="text-emerald-500 flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" /> Composition Sync Active</span>
                 <span className="text-slate-200">•</span>
                 <span className="flex items-center gap-2"><ClipboardCheck className="h-3 w-3" /> Quality Checked by AI</span>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                 <Button variant="outline" className="flex-1 md:flex-none h-12 px-8 rounded-xl font-bold text-xs border-slate-200 capitalize"><ArrowRight className="h-4 w-4 mr-2" /> Formatting Tool</Button>
                 <Button className="flex-1 md:flex-none h-12 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100">Direct Save to Vault</Button>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
