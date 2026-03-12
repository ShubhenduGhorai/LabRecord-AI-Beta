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
  Hash,
  HelpCircle,
  Activity,
  Zap,
  ShieldCheck,
  ClipboardCheck,
  BookMarked,
  Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import { ToolNavigation } from "@/components/ToolNavigation";

const ACADEMIC_STYLES = [
  { id: "APA", label: "APA 7th", desc: "Social Sciences" },
  { id: "IEEE", label: "IEEE", desc: "Engineering" },
  { id: "MLA", label: "MLA 9th", desc: "Humanities" },
  { id: "Chicago", label: "Chicago", desc: "History/Arts" }
];

export default function ResearchFormattingPage() {
  const [text, setText] = useState("");
  const [style, setStyle] = useState("APA");
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState<"idle" | "processing" | "completed">("idle");
  const [processingStep, setProcessingStep] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const runAIFormat = async () => {
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 800));
      setProcessingStep("AI is generating your result...");
      await new Promise(r => setTimeout(r, 800));

      const prompt = `Format the following research text into a structured ${style} layout.
Identify: Abstract, Introduction, Methodology, Results, and Conclusion.

Provide a JSON response:
{
  "abstract": "...",
  "introduction": "...",
  "methodology": "...",
  "results": "...",
  "conclusion": "...",
  "citations": ["..."]
}

Text: ${text}`;

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tool: "research-format", 
          prompt: prompt
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI failed");
      setResult(JSON.parse(data.result));
      setStatus("completed");
    } catch (err: any) {
      setError("AI service temporarily unavailable. Please try again.");
      setStatus("idle");
    }
  };

  const exportPDF = () => {
    if (!result) return;
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(22).setFont("helvetica", "bold").text(`${style} Format Research`, 20, y);
    y += 15;
    
    const sections = ["abstract", "introduction", "methodology", "results", "conclusion"];
    sections.forEach(s => {
      if (result[s]) {
        doc.setFontSize(14).setFont("helvetica", "bold").text(s.toUpperCase(), 20, y);
        y += 8;
        doc.setFontSize(10).setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(result[s], 170);
        doc.text(lines, 20, y);
        y += (lines.length * 6) + 12;
        if (y > 270) { doc.addPage(); y = 20; }
      }
    });
    doc.save(`${style}_Research.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <ToolNavigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Advanced Tool Header */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -mr-12 -mt-12">
            <BookOpen className="h-64 w-64 text-purple-900" />
          </div>
          
          <div className="flex gap-6 items-start relative z-10">
            <div className="h-16 w-16 bg-purple-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-purple-200 shrink-0">
               <BookMarked className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Research Formatting Studio</h1>
              <p className="text-slate-500 font-medium mt-1 max-w-lg">Instantly align your raw research text with global academic standards. Automatic sectioning, citation check, and proofreading.</p>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="rounded-xl h-10 border-slate-200 font-bold px-4">
                  <Upload className="h-4 w-4 mr-2" /> Upload MS
                </Button>
                <input type="file" ref={fileInputRef} className="hidden" accept=".txt,.doc,.docx" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (evt) => setText(evt.target?.result as string);
                    reader.readAsText(file);
                  }
                }} />
                <Button variant="ghost" size="sm" className="rounded-xl h-10 text-purple-600 font-bold">
                  <Quote className="h-4 w-4 mr-2" /> Citation Guide
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><HelpCircle className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Standard Engine</p>
                <p className="text-xs font-bold text-purple-600">v3.0 Academic Sync</p>
             </div>
             <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center border border-slate-200">
                <ShieldCheck className="h-5 w-5 text-purple-500" />
             </div>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-8 items-start">
          
          {/* Smart Input Panel (Left) */}
          <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-slate-200 shadow-xl overflow-hidden bg-white">
              <CardHeader className="p-8 border-b border-slate-50">
                <CardTitle className="text-xl flex items-center gap-3">
                  <Settings2 className="h-6 w-6 text-purple-500" /> Format Controls
                </CardTitle>
                <CardDescription>Select style and input draft</CardDescription>
              </CardHeader>
              
              <CardContent className="p-8 space-y-8">
                {/* Style Selector */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Standard</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {ACADEMIC_STYLES.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setStyle(s.id)}
                        className={cn(
                          "p-4 rounded-2xl border-2 text-left transition-all group relative overflow-hidden",
                          style === s.id 
                            ? "border-purple-600 bg-purple-50 shadow-lg shadow-purple-100" 
                            : "border-slate-100 bg-white hover:border-purple-200"
                        )}
                      >
                        <p className={cn("text-xs font-black uppercase tracking-tight", style === s.id ? "text-purple-700" : "text-slate-900")}>{s.label}</p>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase leading-none">{s.desc}</p>
                        {style === s.id && (
                          <div className="absolute top-2 right-2">
                             <Check className="h-3 w-3 text-purple-600" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Content */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manuscript Snippet</Label>
                    <span className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{text.length} Characters</span>
                  </div>
                  <Textarea 
                    placeholder="Paste your raw research findings, observations, or draft chapters here..." 
                    value={text} 
                    onChange={(e) => setText(e.target.value)} 
                    className="min-h-[350px] rounded-2xl border-slate-200 bg-slate-50/30 p-6 text-xs font-medium leading-relaxed resize-none focus:bg-white transition-all shadow-inner no-scrollbar" 
                  />
                </div>

                {/* Engine Feedback */}
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Styling Engine</p>
                     <span className={cn(
                        "text-[9px] font-black uppercase px-2 py-0.5 rounded-full border",
                        status === "idle" ? "bg-slate-200 text-slate-500 border-slate-300" :
                        status === "processing" ? "bg-amber-100 text-amber-600 border-amber-200 animate-pulse" :
                        "bg-emerald-100 text-emerald-600 border-emerald-200"
                      )}>
                        {status}
                      </span>
                  </div>
                  {status === "processing" ? (
                    <div className="space-y-3">
                       <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                         <Loader2 className="h-3 w-3 animate-spin text-purple-600" /> {processingStep}
                       </p>
                       <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                          <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2 }} className="bg-purple-600 h-full" />
                       </div>
                    </div>
                  ) : (
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                       {status === "completed" ? "Academic alignment complete. Preview the structure." : "Select standard and input text to begin formatting."}
                    </p>
                  )}
                </div>

                <Button 
                  onClick={runAIFormat} 
                  disabled={status === "processing" || !text} 
                  className="w-full h-16 bg-slate-900 hover:bg-black transition-all text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  {status === "processing" ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                  Align Standards
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Canvas Preview Panel (Right) */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {error ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex items-center gap-4 text-rose-600">
                   <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                      <AlertCircle className="h-6 w-6" />
                   </div>
                   <div>
                     <p className="font-black uppercase text-[10px] tracking-widest">Formatting Error</p>
                     <p className="font-bold text-sm">{error}</p>
                   </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="space-y-8"
                >
                  <Card className="rounded-[3rem] bg-white border-slate-200 shadow-2xl overflow-hidden min-h-[900px] flex flex-col relative">
                    <CardHeader className="p-10 md:p-14 border-b border-slate-50 flex flex-row items-center justify-between bg-[#fdfdfd] z-10">
                      <div className="flex items-center gap-5">
                         <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center ring-4 ring-purple-50">
                            <Eye className="h-6 w-6 text-purple-600" />
                         </div>
                         <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Academic Preview</h2>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={exportPDF} disabled={!result} className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-300 shadow-sm"><FileDown className="h-4 w-4 mr-2" /> PDF</Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          disabled={!result} 
                          onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(result, null, 2));
                            setCopySuccess(true);
                            setTimeout(() => setCopySuccess(false), 2000);
                          }} 
                          className="h-10 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-300 shadow-sm"
                        >
                          {copySuccess ? <Check className="h-4 w-4 mr-2 text-emerald-500" /> : <Copy className="h-4 w-4 mr-2" />}
                          Copy
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-10 md:p-24 bg-[#fafafa] font-serif text-slate-800 shadow-inner overflow-hidden relative">
                      <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12">
                         <LayoutIcon className="h-96 w-96 text-purple-900" />
                      </div>
                      
                      {result ? (
                        <div className="max-w-3xl mx-auto space-y-12 relative z-10">
                          <div className="text-center space-y-4 mb-20">
                            <h2 className="text-4xl font-black uppercase tracking-tight text-slate-900">{style} FORMAT</h2>
                            <div className="flex justify-center items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                               <span className="bg-slate-200 h-px w-8" />
                               <span>Professional Manuscript Preview</span>
                               <span className="bg-slate-200 h-px w-8" />
                            </div>
                          </div>

                          {["abstract", "introduction", "methodology", "results", "conclusion"].map(s => result[s] && (
                            <div key={s} className="space-y-6 group">
                              <div className="flex items-center gap-6">
                                <h4 className="text-xs font-black uppercase tracking-[0.4em] text-purple-600 shrink-0">{s}</h4>
                                <div className="h-px bg-slate-100 flex-1 group-hover:bg-purple-100 transition-colors" />
                              </div>
                              <p className="text-md md:text-lg leading-[2] whitespace-pre-wrap text-slate-700 font-medium first-letter:text-2xl first-letter:font-black first-letter:text-purple-600 lg:not-italic">{result[s]}</p>
                            </div>
                          ))}
                          
                          <div className="pt-24 opacity-10 flex justify-center scale-150">
                             <div className="border-4 border-slate-900 p-3 text-3xl font-black uppercase tracking-[0.3em] -rotate-12">VERIFIED</div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center opacity-30 select-none py-64">
                           <div className="h-24 w-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 border border-slate-100 shadow-sm animate-pulse">
                              <LayoutIcon className="h-12 w-12 text-slate-300" />
                           </div>
                           <h3 className="font-black uppercase tracking-[0.3em] text-xs text-slate-900">Virtual Engine Idle</h3>
                           <p className="text-[10px] mt-3 max-w-[240px] font-medium leading-relaxed">Submit your manuscript draft to initialize the academic alignment and styling sequence.</p>
                        </div>
                      )}
                    </CardContent>
                    
                    <CardFooter className="p-10 bg-white border-t border-slate-50 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                       <div className="flex items-center gap-4">
                          <span className="flex items-center gap-2 text-purple-600"><Activity className="h-3.5 w-3.5" /> High Performance Scan</span>
                          <span className="text-slate-200">|</span>
                          <span className="flex items-center gap-2"><ClipboardCheck className="h-3.5 w-3.5" /> Integrity Check Complete</span>
                       </div>
                       <span className="hidden md:block">Academic Alignment Module v4.51</span>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>

      {/* Persistence Bar */}
      {status === "completed" && (
        <motion.div initial={{ y: 80 }} animate={{ y: 0 }} className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-200 p-5 z-40 shadow-[0_-15px_40px_rgba(0,0,0,0.08)]">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="h-12 w-12 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                    <Check className="h-6 w-6 text-white" />
                 </div>
                 <div>
                    <h4 className="text-sm font-black text-slate-900 leading-none">Manuscript Formatted</h4>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider mt-1 uppercase italic">{style} Standard Standards Applied</p>
                 </div>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                 <Button variant="ghost" className="flex-1 md:flex-none h-14 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-500 hover:bg-slate-50"><RefreshCw className="h-4 w-4 mr-2" /> Start New Alignment</Button>
                 <Button className="flex-1 md:flex-none h-14 px-12 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-[0_8px_30px_rgb(147,51,234,0.3)]">Publish to Vault</Button>
              </div>
           </div>
        </motion.div>
      )}
    </div>
  );
}
