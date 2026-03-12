"use client";

import { useState, useRef, useEffect } from "react";
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
  Beaker, 
  Download, 
  Copy, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  ClipboardCheck, 
  Settings2, 
  Eye, 
  Edit3,
  History,
  FlaskConical,
  Microscope,
  RotateCcw,
  ArrowRight,
  Printer,
  FileDown,
  Layout,
  Table as TableIcon,
  ScrollText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import Link from "next/link";

// Section Template
const REPORT_SECTIONS = [
  { id: "aim", label: "Aim", placeholder: "What is the primary objective of this experiment?" },
  { id: "theory", label: "Theory", placeholder: "Scientific principles and background laws..." },
  { id: "apparatus", label: "Apparatus", placeholder: "List of equipment and materials used..." },
  { id: "procedure", label: "Procedure", placeholder: "Step-by-step methodology followed..." },
  { id: "observations", label: "Observations", placeholder: "Raw data points and sensory findings..." },
  { id: "calculations", label: "Calculations", placeholder: "Formulas, derivations, and error analysis..." },
  { id: "result", label: "Result", placeholder: "Final interpreted findings..." },
  { id: "conclusion", label: "Conclusion", placeholder: "Summary and scientific significance..." },
  { id: "precautions", label: "Precautions", placeholder: "Safety measures and error mitigation..." }
];

export default function AIReportWriterPage() {
  const [metadata, setMetadata] = useState({
    name: "",
    subject: "",
    date: new Date().toISOString().split('T')[0],
    instructor: ""
  });

  const [sections, setSections] = useState<Record<string, string>>(
    REPORT_SECTIONS.reduce((acc, s) => ({ ...acc, [s.id]: "" }), {})
  );

  const [activeSection, setActiveSection] = useState("aim");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [copySuccess, setCopySuccess] = useState(false);

  // AI Generation Simulation
  const generateSection = (sectionId: string) => {
    setIsGenerating(sectionId);
    
    // In a real app, this would call an AI API with metadata and other section context
    setTimeout(() => {
      const mockContent: Record<string, string> = {
        aim: `To determine the ${metadata.subject || "specified property"} of the given sample through standardized laboratory protocols.`,
        theory: `Based on the principles of ${metadata.subject || "Modern Physics"}, this experiment utilizes the relationship between applied force and resulting displacement, adhering to the foundational laws established in the curriculum.`,
        apparatus: `1. Digital Micrometer\n2. Standard Calibration Weights\n3. Interface Module\n4. Laboratory Workstation`,
        procedure: `1. Calibrate the measuring instruments.\n2. Apply incremental loads and record deviations.\n3. Repeat measurements three times for statistical accuracy.`,
        observations: `Initial readings showed a linear trend with minor fluctuations at higher magnitudes. Ambient temperature remained constant at 25°C.`,
        calculations: `Error % = (|Experimental - Theoretical| / Theoretical) * 100\nResulting Deviation: 0.045 units.`,
        result: `The ${metadata.subject || "analysis"} yielded a value of 4.2 ± 0.1, matching theoretical predictions within a 2% margin of error.`,
        conclusion: `The results validate the hypothesis regarding ${metadata.subject || "system behavior"}. Environmental factors were successfully mitigated.`,
        precautions: `Ensure instruments are zeroed before use. Avoid parallax error during visual readings.`
      };

      setSections(prev => ({ ...prev, [sectionId]: mockContent[sectionId] }));
      setIsGenerating(null);
    }, 1500);
  };

  const generateFullReport = () => {
    Object.keys(sections).forEach((id, idx) => {
      setTimeout(() => generateSection(id), idx * 200);
    });
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let cursorY = 40;

    // Header
    doc.setFontSize(22).setFont("times", "bold").text("Laboratory Report", margin, 25);
    doc.setFontSize(10).setFont("times", "normal").text(`${metadata.name || "Untitled Report"} | ${metadata.subject || "General Science"}`, margin, 32);
    doc.line(margin, 35, 190, 35);

    // Metadata
    doc.setFontSize(10);
    doc.text(`Date: ${metadata.date}`, 150, 25);
    doc.text(`Instructor: ${metadata.instructor}`, 150, 30);

    // Sections
    REPORT_SECTIONS.forEach(s => {
      if (sections[s.id]) {
        if (cursorY > 260) {
          doc.addPage();
          cursorY = 20;
        }
        doc.setFontSize(12).setFont("times", "bold").text(s.label.toUpperCase(), margin, cursorY);
        cursorY += 7;
        doc.setFontSize(11).setFont("times", "normal");
        const splitText = doc.splitTextToSize(sections[s.id], 170);
        doc.text(splitText, margin, cursorY);
        cursorY += (splitText.length * 6) + 10;
      }
    });

    doc.save(`${metadata.name.toLowerCase().replace(/\s+/g, '-') || 'lab-report'}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Workspace Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 shrink-0">
               <FileText className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">AI Lab Report Writer</h1>
              <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" /> Professional-grade experiment documentation & sectioning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="outline" onClick={generateFullReport} className="text-indigo-600 border-indigo-100 hover:bg-indigo-50 font-bold text-xs uppercase tracking-widest px-6 h-11 rounded-xl">
                <Zap className="h-4 w-4 mr-2" /> Auto-Generate All
             </Button>
             <Link href="/tools/research-format">
               <Button variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-widest px-6 h-11 rounded-xl shadow-lg shadow-slate-200">
                  <Layout className="h-4 w-4 mr-2" /> Advanced Formatter
               </Button>
             </Link>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Panel: Configuration & Sections */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
             <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                   <CardTitle className="text-lg flex items-center gap-2">
                      <Settings2 className="h-5 w-5 text-slate-400" /> Experiment Metadata
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Experiment Name</Label>
                      <Input 
                        placeholder="e.g. Young's Modulus" 
                        value={metadata.name}
                        onChange={(e) => setMetadata({...metadata, name: e.target.value})}
                        className="rounded-xl border-slate-200 focus:ring-indigo-500/10"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subject Area</Label>
                      <Input 
                        placeholder="e.g. Applied Physics" 
                        value={metadata.subject}
                        onChange={(e) => setMetadata({...metadata, subject: e.target.value})}
                        className="rounded-xl border-slate-200"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Submission Date</Label>
                      <Input 
                        type="date"
                        value={metadata.date}
                        onChange={(e) => setMetadata({...metadata, date: e.target.value})}
                        className="rounded-xl border-slate-200"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Instructor Name</Label>
                      <Input 
                        placeholder="e.g. Dr. Richards" 
                        value={metadata.instructor}
                        onChange={(e) => setMetadata({...metadata, instructor: e.target.value})}
                        className="rounded-xl border-slate-200"
                      />
                   </div>
                </CardContent>
             </Card>

             <Card className="rounded-3xl border-slate-200 shadow-sm overflow-hidden bg-white">
                <div className="flex bg-slate-50/50 border-b border-slate-100 overflow-x-auto no-scrollbar">
                   {REPORT_SECTIONS.map(s => (
                     <button
                       key={s.id}
                       onClick={() => setActiveSection(s.id)}
                       className={cn(
                         "px-4 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap",
                         activeSection === s.id ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-400 hover:text-slate-600"
                       )}
                     >
                       {s.label}
                     </button>
                   ))}
                </div>
                <CardContent className="p-6 space-y-4">
                   <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tighter">Drafting: {REPORT_SECTIONS.find(s => s.id === activeSection)?.label}</h3>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="text-indigo-600 font-bold text-[10px] uppercase h-7 hover:bg-indigo-50"
                        onClick={() => generateSection(activeSection)}
                        disabled={isGenerating !== null}
                      >
                         {isGenerating === activeSection ? <RotateCcw className="h-3 w-3 mr-2 animate-spin" /> : <Sparkles className="h-3 w-3 mr-2" />}
                         AI Assist
                      </Button>
                   </div>
                   <Textarea 
                     className="min-h-[300px] rounded-2xl border-slate-200 focus:ring-indigo-500/10 text-slate-700 leading-relaxed resize-none p-6"
                     placeholder={REPORT_SECTIONS.find(s => s.id === activeSection)?.placeholder}
                     value={sections[activeSection]}
                     onChange={(e) => setSections(prev => ({...prev, [activeSection]: e.target.value}))}
                   />
                </CardContent>
                <CardFooter className="p-4 bg-slate-50/50 flex justify-between">
                    <Button variant="ghost" size="sm" className="text-[10px] font-bold text-slate-400" onClick={() => setSections(prev => ({...prev, [activeSection]: ""}))}>
                       Clear Section
                    </Button>
                    <div className="flex gap-2">
                       <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase rounded-lg">
                          Load Obs. Data
                       </Button>
                       <Button size="sm" className="h-8 text-[10px] font-bold uppercase rounded-lg bg-indigo-600" onClick={() => {
                          const idx = REPORT_SECTIONS.findIndex(s => s.id === activeSection);
                          if (idx < REPORT_SECTIONS.length - 1) setActiveSection(REPORT_SECTIONS[idx+1].id);
                       }}>
                          Next Section <ArrowRight className="h-3 w-3 ml-2" />
                       </Button>
                    </div>
                </CardFooter>
             </Card>
          </div>

          {/* Right Panel: Live Preview */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
             <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
                   <Button 
                     size="sm" 
                     variant={viewMode === "edit" ? "secondary" : "ghost"}
                     className={cn("h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider", viewMode === "edit" ? "bg-slate-100" : "")}
                     onClick={() => setViewMode("edit")}
                   >
                      <Edit3 className="h-3.5 w-3.5 mr-2" /> Editor
                   </Button>
                   <Button 
                     size="sm" 
                     variant={viewMode === "preview" ? "secondary" : "ghost"}
                     className={cn("h-8 px-4 rounded-lg text-[10px] font-black uppercase tracking-wider", viewMode === "preview" ? "bg-slate-100" : "")}
                     onClick={() => setViewMode("preview")}
                   >
                      <Eye className="h-3.5 w-3.5 mr-2" /> Publication Preview
                   </Button>
                </div>

                <div className="flex gap-2">
                   <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(Object.values(sections).join('\n\n'));
                      setCopySuccess(true);
                      setTimeout(() => setCopySuccess(false), 2000);
                   }} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase">
                      {copySuccess ? <CheckCircle2 className="h-3.5 w-3.5 mr-2 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                      Copy Text
                   </Button>
                   <Button size="sm" onClick={exportPDF} className="h-9 px-4 rounded-xl text-[10px] font-black uppercase bg-slate-900 shadow-lg shadow-slate-200">
                      <FileDown className="h-3.5 w-3.5 mr-2" /> Export PDF
                   </Button>
                </div>
             </div>

             <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden min-h-[850px] flex flex-col">
                <div className="h-px w-full bg-slate-100 mt-20 md:mt-32" />
                <div className="p-8 md:p-16 flex-1 space-y-10 font-serif">
                   
                   {/* Report Header */}
                   <div className="text-center space-y-4">
                      <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-slate-900 leading-none">
                         {metadata.name || "UNNAMED LABORATORY REPORT"}
                      </h2>
                      <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                         <span className="flex items-center gap-2"><FlaskConical className="h-3 w-3" /> {metadata.subject || "GENERAL SCIENCE"}</span>
                         <span className="flex items-center gap-2 border-l border-slate-200 pl-8"><History className="h-3 w-3" /> {metadata.date}</span>
                         <span className="flex items-center gap-2 border-l border-slate-200 pl-8"><Microscope className="h-3 w-3" /> {metadata.instructor || "UNASSIGNED"}</span>
                      </div>
                   </div>

                   <div className="h-px w-24 bg-slate-900 mx-auto opacity-20" />

                   {/* Report Content Sections */}
                   <div className="space-y-12">
                      {REPORT_SECTIONS.map(s => (
                        sections[s.id] && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={s.id} 
                            className="group relative"
                          >
                             <div className="absolute -left-8 md:-left-12 top-1 text-[9px] font-black text-slate-300 transform -rotate-90 origin-right transition-colors group-hover:text-indigo-400">
                                SECTION.{s.id.toUpperCase()}
                             </div>
                             <h4 className="text-sm md:text-base font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-3">
                                {s.label}
                                <span className="h-px bg-slate-900 flex-1 opacity-10" />
                             </h4>
                             <p className="text-slate-700 leading-relaxed text-sm md:text-base whitespace-pre-wrap pl-2 md:pl-4 border-l-2 border-transparent group-hover:border-indigo-100 transition-all">
                                {sections[s.id]}
                             </p>
                          </motion.div>
                        )
                      ))}

                      {Object.values(sections).every(v => v === "") && (
                        <div className="py-32 flex flex-col items-center justify-center text-center opacity-30">
                           <BookOpen className="h-16 w-16 mb-4 text-slate-300" />
                           <p className="text-sm font-black uppercase tracking-[0.2em]">Awaiting Technical Input</p>
                           <p className="text-xs mt-2 font-serif italic max-w-xs">Data populated via AI Assist or Manual Entry will be rendered in high-fidelity academic typography here.</p>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="p-8 border-t border-slate-50 bg-slate-50/50 mt-auto">
                   <div className="flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      <span>LabRecord AI Security Protocol 4.2</span>
                      <div className="flex gap-4">
                         <span>Page 01 / 01</span>
                         <span className="flex items-center gap-1 text-emerald-500"><ClipboardCheck className="h-3 w-3" /> Verification: Pass</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
}
