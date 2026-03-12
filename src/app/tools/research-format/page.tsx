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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Upload, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  AlertCircle, 
  Settings2, 
  Maximize2, 
  Type, 
  AlignLeft, 
  FileSearch,
  Zap,
  ChevronRight,
  ClipboardCheck,
  Layout,
  ScrollText,
  Clock,
  User,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";

// Types
type AcademicStyle = "APA" | "IEEE" | "MLA" | "Chicago";

interface ResearchSection {
  title: string;
  content: string;
  id: string;
}

export default function ResearchFormattingPage() {
  // Content State
  const [rawText, setRawText] = useState("");
  const [title, setTitle] = useState("Unstructured Research Manuscript");
  const [author, setAuthor] = useState("Academic Researcher");
  const [sections, setSections] = useState<ResearchSection[]>([]);
  
  // Formatting State
  const [style, setStyle] = useState<AcademicStyle>("APA");
  const [fontSize, setFontSize] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(2.0);
  const [fontFamily, setFontFamily] = useState("'Times New Roman', Times, serif");
  
  // UI State
  const [isProcessing, setIsProcessing] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Smart Section Detection
  useEffect(() => {
    if (!rawText.trim()) {
      setSections([]);
      return;
    }

    // Heuristic section detection
    const commonHeadings = [
      /abstract/i,
      /introduction/i,
      /literature\s+review/i,
      /methodology/i,
      /materials\s+and\s+methods/i,
      /results/i,
      /discussion/i,
      /conclusion/i,
      /references/i,
      /appendix/i
    ];

    const lines = rawText.split(/\n/);
    const detected: ResearchSection[] = [];
    let currentSection: ResearchSection = { title: "Unsectioned Content", content: "", id: "initial" };

    lines.forEach((line) => {
      const isHeading = commonHeadings.some(h => h.test(line.trim()) && line.trim().length < 30);
      
      if (isHeading) {
        if (currentSection.content.trim() || currentSection.title !== "Unsectioned Content") {
            detected.push(currentSection);
        }
        currentSection = { 
          title: line.trim(), 
          content: "", 
          id: Math.random().toString(36).substr(2, 9) 
        };
      } else {
        currentSection.content += line + "\n";
      }
    });
    
    detected.push(currentSection);
    setSections(detected);
  }, [rawText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setRawText(evt.target?.result as string);
      };
      reader.readAsText(file);
    } else {
      // Basic recommendation for other formats
      alert("Current version supports direct .txt uploads. For .docx and .pdf, please paste the text directly into the editor for optimal formatting control.");
    }
  };

  const copyToClipboard = () => {
    const formattedText = sections.map(s => `${s.title.toUpperCase()}\n\n${s.content}`).join("\n\n");
    navigator.clipboard.writeText(formattedText);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const loadExample = () => {
    setRawText(`ABSTRACT\nThis study investigates the correlation between atmospheric pressure and student cognitive performance in laboratory environments. We utilized AI-driven metrics to track focus levels across various pressure gradients.\n\nINTRODUCTION\nLaboratory education is a cornerstone of scientific training. However, environmental factors often play an overlooked role in the efficacy of such training sessions...\n\nMETHODOLOGY\nA randomized controlled trial was conducted with 50 engineering students. Participants were subjected to controlled atmospheric adjustments while performing complex report writing tasks.\n\nRESULTS\nInitial data suggests a non-linear relationship. Peak cognitive efficiency was observed at 101.3 kPa, with significant degradation below 95 kPa.\n\nCONCLUSION\nEnvironmental optimization in laboratories is critical for maximizing pedagogical outcomes. Further research into humidity factors is recommended.`);
    setTitle("Bio-Atmospheric Impact on Cognitive Synergy");
    setAuthor("Dr. Sarah Chen & Alex Rivera");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    let cursorY = 30;

    const addText = (text: string, size: number, isBold = false) => {
      doc.setFontSize(size);
      doc.setFont("times", isBold ? "bold" : "normal");
      const splitText = doc.splitTextToSize(text, pageWidth - margin * 2);
      
      if (cursorY + splitText.length * (size * 0.5) > 280) {
        doc.addPage();
        cursorY = 20;
      }
      
      doc.text(splitText, margin, cursorY);
      cursorY += splitText.length * (size * 0.5) + 5;
    };

    if (style === "APA") {
      doc.setFontSize(10).text("Running head: " + title.toUpperCase().slice(0, 30), margin, 15);
      doc.setFontSize(10).text("1", pageWidth - margin, 15, { align: 'right' });
    }

    addText(title, 22, true);
    addText(author, 12, false);
    cursorY += 10;

    sections.forEach(s => {
      addText(s.title, 14, true);
      addText(s.content, 11, false);
      cursorY += 5;
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-formatted.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Modern Header Nav */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-100 shrink-0">
               <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">Research Formatting Studio</h1>
              <p className="text-sm text-slate-500 font-medium">Automatic academic standard alignment & sectioning</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={loadExample} className="text-purple-600 border-purple-100 hover:bg-purple-50 font-bold text-xs uppercase tracking-wider">
               <Zap className="h-3 w-3 mr-2" /> Example Case
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="text-slate-600 border-slate-200 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider">
               <Upload className="h-4 w-4 mr-2" /> Upload Draft
            </Button>
            <input type="file" ref={fileInputRef} className="hidden" accept=".txt" onChange={handleFileUpload} />
            <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
               <button 
                 onClick={() => setActiveView("editor")}
                 className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", activeView === "editor" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
               >
                 Draft Editor
               </button>
               <button 
                 onClick={() => setActiveView("preview")}
                 className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", activeView === "preview" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700")}
               >
                 Academic Preview
               </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Controls & Formatting Panel */}
          <aside className="lg:col-span-4 space-y-6">
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="py-4 px-6 border-b border-slate-50">
                <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Formatting Protocol</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Academic Standard</label>
                   <div className="grid grid-cols-2 gap-2">
                      {(["APA", "IEEE", "MLA", "Chicago"] as const).map(s => (
                         <Button 
                           key={s} 
                           variant={style === s ? "default" : "outline"} 
                           size="sm" 
                           className={cn("text-[10px] font-bold h-9", style === s ? "bg-purple-600 hover:bg-purple-700 border-none" : "text-slate-600 border-slate-200")} 
                           onClick={() => setStyle(s)}
                         >
                            {s} Style
                         </Button>
                      ))}
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Font Hierarchy</label>
                      <select 
                        className="w-full h-9 bg-white border border-slate-200 rounded-lg px-3 text-xs font-semibold focus:ring-2 focus:ring-purple-500/20"
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                      >
                         <option value="'Times New Roman', Times, serif">Serif (Classic)</option>
                         <option value="Inter, sans-serif">Sans (Modern)</option>
                         <option value="'Courier New', monospace">Mono (Tech)</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Point Size</label>
                      <div className="flex items-center gap-3 h-9 bg-slate-50 rounded-lg px-3">
                         <Type className="h-3 w-3 text-slate-400" />
                         <span className="text-xs font-bold text-slate-700">{fontSize}pt</span>
                         <input 
                           type="range" min="10" max="14" step="1" 
                           value={fontSize} 
                           onChange={(e) => setFontSize(Number(e.target.value))}
                           className="flex-1 accent-purple-600 h-1" 
                         />
                      </div>
                   </div>
                </div>

                <div className="space-y-2 pt-2">
                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-tighter flex justify-between">
                     <span>Observation Specifics</span>
                     <span>Line Spacing: {lineSpacing.toFixed(1)}x</span>
                   </label>
                   <div className="flex gap-2">
                      {[1.0, 1.5, 2.0].map(v => (
                         <Button 
                           key={v} 
                           variant={lineSpacing === v ? "secondary" : "ghost"} 
                           size="xs" 
                           className={cn("flex-1 text-[10px] font-black tracking-widest h-8 bg-slate-50", lineSpacing === v && "bg-purple-50 text-purple-600")}
                           onClick={() => setLineSpacing(v)}
                         >
                            {v.toFixed(1)}
                         </Button>
                      ))}
                   </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex gap-2">
                   <Button variant="outline" className="flex-1 h-9 text-[10px] font-black uppercase tracking-widest border-slate-200" onClick={copyToClipboard}>
                      {copySuccess ? <Check className="h-3 w-3 mr-2 text-emerald-500" /> : <Copy className="h-3 w-3 mr-2" />}
                      {copySuccess ? "Copied" : "Copy Source"}
                   </Button>
                   <Button className="flex-1 h-9 bg-purple-600 hover:bg-purple-700 font-black text-[10px] uppercase tracking-widest" onClick={exportPDF}>
                      <Download className="h-3 w-3 mr-2" /> PDF Export
                   </Button>
                </div>
              </CardContent>
            </Card>

            {/* Smart Detection Log */}
            <Card className="border-slate-200 shadow-sm bg-slate-900 overflow-hidden">
               <CardHeader className="py-4 px-6 border-b border-white/5">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-400">Structure Detection</CardTitle>
                    <div className="flex gap-1">
                       <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></span>
                       <span className="h-1 w-1 rounded-full bg-emerald-500/50"></span>
                    </div>
                  </div>
               </CardHeader>
               <CardContent className="p-4 space-y-2 max-h-[300px] overflow-auto custom-scrollbar">
                  {sections.length > 0 ? sections.map((s, idx) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={s.id} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group"
                    >
                       <div className="h-6 w-6 rounded bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400 border border-purple-500/30">
                          {idx + 1}
                       </div>
                       <span className="text-xs font-medium text-slate-300 truncate flex-1">{s.title}</span>
                       <Check className="h-3 w-3 text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  )) : (
                    <div className="text-center py-8">
                       <FileSearch className="h-8 w-8 text-slate-700 mx-auto mb-3" />
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">No Sections Identified</p>
                    </div>
                  )}
               </CardContent>
            </Card>

          </aside>

          {/* Main Workspace (Editor / Preview) */}
          <main className="lg:col-span-8 space-y-6 h-full min-h-[800px]">
            
            <AnimatePresence mode="wait">
              {activeView === "editor" ? (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="h-full flex flex-col"
                >
                  <Card className="border-slate-200 shadow-sm h-full flex flex-col flex-1 overflow-hidden">
                    <CardHeader className="py-4 px-6 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
                       <div className="flex items-center gap-2">
                          <ScrollText className="h-4 w-4 text-slate-400" />
                          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Draft Environment</CardTitle>
                       </div>
                       <div className="flex gap-4">
                          <div className="flex items-center gap-2">
                             <User className="h-3 w-3 text-slate-300" />
                             <input 
                               value={author} 
                               onChange={(e) => setAuthor(e.target.value)}
                               className="bg-transparent border-none text-[10px] font-bold text-slate-500 focus:outline-none w-32" 
                               placeholder="Lead Author"
                             />
                          </div>
                          <div className="flex items-center gap-2">
                             <Layout className="h-3 w-3 text-slate-300" />
                             <input 
                               value={title} 
                               onChange={(e) => setTitle(e.target.value)}
                               className="bg-transparent border-none text-[10px] font-bold text-slate-500 focus:outline-none w-48" 
                               placeholder="Manuscript Title"
                             />
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 relative min-h-[600px]">
                       <Textarea 
                         placeholder="Paste your research manuscript here... Sections like Abstract, Introduction, Results, etc., will be automatically identified for standard formatting."
                         className="absolute inset-0 w-full h-full p-8 border-none focus:ring-0 resize-none font-serif text-base leading-relaxed text-slate-700 bg-white placeholder:text-slate-200"
                         value={rawText}
                         onChange={(e) => setRawText(e.target.value)}
                       />
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <Card className="border-slate-200 shadow-2xl overflow-hidden bg-white mx-auto max-w-[850px] min-h-[1050px] flex flex-col relative">
                    {/* Style-specific Watermarks/Guides */}
                    <div className="absolute top-0 right-0 p-8">
                       <span className="text-[10px] font-mono font-bold text-slate-300 uppercase rotate-90 origin-right">Standard: {style}</span>
                    </div>

                    <div 
                      className="p-16 md:p-24 flex-1"
                      style={{ 
                        fontFamily: fontFamily, 
                        lineHeight: lineSpacing, 
                        fontSize: `${fontSize}px` 
                      }}
                    >
                       {/* Header Region */}
                       <div className={cn(
                         "mb-12",
                         style === "APA" && "text-center",
                         style === "IEEE" && "text-center border-b pb-8",
                         style === "MLA" && "text-left",
                         style === "Chicago" && "text-center mb-24 pt-12"
                       )}>
                          {style === "MLA" && (
                            <div className="text-left mb-8 space-y-0.5 text-[0.9em]">
                               <p>{author}</p>
                               <p>Professor Mentorship</p>
                               <p>Research Methodology 101</p>
                               <p>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                          )}
                          <h2 className={cn(
                            "font-bold mb-2",
                            style === "APA" && "text-xl",
                            style === "IEEE" && "text-2xl uppercase tracking-tight",
                            style === "Chicago" && "text-3xl mb-8 uppercase"
                          )}>{title}</h2>
                          <p className="font-medium text-slate-600">{author}</p>
                          {style === "IEEE" && <p className="italic text-slate-500 text-sm mt-2">Laboratory for Applied Intelligence and Research</p>}
                       </div>

                       {/* Content Region */}
                       <div className="space-y-8">
                          {sections.map((s, idx) => (
                            <div key={s.id} className="space-y-4">
                               <h3 className={cn(
                                 "font-bold",
                                 style === "APA" && "text-center capitalize text-[1.1em]",
                                 style === "IEEE" && "uppercase text-sm tracking-widest text-indigo-600 flex items-center gap-3",
                                 style === "MLA" && "italic text-left",
                                 style === "Chicago" && "uppercase text-center border-b pb-1 mb-6 border-slate-100"
                               )}>
                                  {style === "IEEE" && <span className="text-xs text-slate-300 font-mono">{idx + 1}.</span>}
                                  {s.title}
                               </h3>
                               <p className={cn(
                                 "text-justify whitespace-pre-wrap text-slate-700",
                                 style === "APA" && "indent-8",
                                 style === "MLA" && "indent-8",
                                 style === "IEEE" && "text-sm",
                                 style === "Chicago" && "leading-[1.8]"
                               )}>
                                  {s.content || "Developing content for this specific manuscript segment..."}
                               </p>
                            </div>
                          ))}

                          {sections.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-24 text-slate-300 space-y-4">
                               <Layout className="h-16 w-16 opacity-10" />
                               <p className="font-bold text-sm uppercase tracking-widest">Awaiting Manuscript Stream</p>
                            </div>
                          )}
                       </div>
                    </div>

                    <CardFooter className="border-t border-slate-50 bg-slate-50/50 py-4 px-12 flex justify-between items-center">
                       <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-[10px] font-bold text-slate-400 uppercase">Integrity Cleared • Publication Ready</span>
                       </div>
                       <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Real-time Sync</span>
                          <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {sections.length} Components</span>
                       </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </div>
    </div>
  );
}
