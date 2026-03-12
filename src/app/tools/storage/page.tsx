"use client";

import { useState, useRef, useMemo, useEffect } from "react";
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
import { 
  HardDrive, 
  UploadCloud, 
  File, 
  FileText, 
  Database, 
  Search, 
  Layout, 
  Grid2X2, 
  List, 
  Folder, 
  ChevronRight, 
  Zap, 
  MoreHorizontal, 
  LineChart, 
  PieChart, 
  FileSearch,
  Cloud,
  History,
  Star,
  Trash2,
  Download,
  Share2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FlaskConical,
  Beaker,
  ScrollText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Data for Initial Vault State
const INITIAL_EXPERIMENTS = [
  {
    id: "exp_1",
    name: "Thermodynamic Synergy Test",
    date: "2026-03-11",
    type: "Physics / Heat",
    fileCount: 3,
    status: "Analyzing",
    previewType: "dataset",
    suggestedAction: "Run OLS Regression",
    size: "12.4 MB"
  },
  {
    id: "exp_2",
    name: "Neural Focus Analysis",
    date: "2026-03-10",
    type: "Bio-Science",
    fileCount: 5,
    status: "Completed",
    previewType: "report",
    suggestedAction: "Generate Abstract",
    size: "4.8 MB"
  },
  {
    id: "exp_3",
    name: "Chemical Vapor Deposition",
    date: "2026-03-09",
    type: "Engineering",
    fileCount: 2,
    status: "Archived",
    previewType: "graph",
    suggestedAction: "Export SVG",
    size: "22.1 MB"
  }
];

export default function AIExperimentVaultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [experiments, setExperiments] = useState(INITIAL_EXPERIMENTS);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Filtered Experiments
  const filteredExperiments = useMemo(() => {
    return experiments.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [experiments, searchQuery]);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate smart detection and grouping
    setTimeout(() => {
      const newExp = {
        id: `exp_${Date.now()}`,
        name: "Imported Experiment Data",
        date: new Date().toISOString().split('T')[0],
        type: "Unclassified System",
        fileCount: 1,
        status: "Processing",
        previewType: "dataset",
        suggestedAction: "Detect Correlation",
        size: "1.2 MB"
      };
      setExperiments([newExp, ...experiments]);
      setIsUploading(false);
      setShowUploadModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-[1600px] mx-auto space-y-6">
        
        {/* Workspace Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900 p-8 rounded-3xl shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
             <Cloud className="h-48 w-48 text-white" />
          </div>
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 ring-4 ring-white/5">
               <HardDrive className="h-8 w-8 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                AI Experiment Vault
                <span className="text-xs bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/30 uppercase tracking-widest font-black">Pro</span>
              </h1>
              <p className="text-slate-400 text-sm font-medium mt-1">Autonomous laboratory data indexing & intelligent workspace</p>
            </div>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-3">
             <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                <Input 
                  placeholder="Ask AI to find experiments..." 
                  className="pl-10 h-11 w-full sm:w-[320px] bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 rounded-xl transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button 
               onClick={() => setShowUploadModal(true)}
               className="h-11 px-6 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl shadow-lg shadow-white/5"
             >
               <UploadCloud className="h-4 w-4 mr-2" /> New Experiment
             </Button>
          </div>
        </div>

        {/* Vault Controls & Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full md:w-auto">
              {["All Vaults", "Physics", "Chemistry", "Bio-Science", "Engineering"].map((tab, i) => (
                <button key={tab} className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap", i === 0 ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800")}>
                  {tab}
                </button>
              ))}
           </div>
           <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl shrink-0">
              <button onClick={() => setViewMode("grid")} className={cn("p-2 rounded-lg transition-all", viewMode === "grid" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>
                <Grid2X2 className="h-4 w-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={cn("p-2 rounded-lg transition-all", viewMode === "list" ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600")}>
                <List className="h-4 w-4" />
              </button>
           </div>
        </div>

        {/* Experiment Workspace Grid */}
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
        )}>
           <AnimatePresence mode="popLayout">
              {filteredExperiments.map((exp, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={exp.id}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className="group border-slate-200 hover:border-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-500/5 overflow-hidden bg-white/80 backdrop-blur-xl">
                    <CardHeader className="p-0">
                       <div className="h-40 w-full relative bg-slate-100 overflow-hidden">
                          {/* Rich Previews */}
                          {exp.previewType === 'dataset' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-emerald-50/50">
                               <Database className="h-12 w-12 text-emerald-200 animate-pulse" />
                            </div>
                          )}
                          {exp.previewType === 'report' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-indigo-50/50">
                               <ScrollText className="h-12 w-12 text-indigo-200" />
                            </div>
                          )}
                          {exp.previewType === 'graph' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-amber-50/50">
                               <TrendingUp className="h-12 w-12 text-amber-200" />
                            </div>
                          )}
                          <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                             <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-white/90 shadow-sm"><Star className="h-3.5 w-3.5" /></Button>
                             <Button variant="secondary" size="icon" className="h-8 w-8 rounded-lg bg-white/90 shadow-sm"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                          </div>
                          <div className="absolute bottom-3 left-4">
                             <span className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-1 bg-slate-900/40 backdrop-blur-md rounded border border-white/10">
                               Pre-Detected Sectioning
                             </span>
                          </div>
                       </div>
                    </CardHeader>
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold group-hover:text-indigo-600 transition-colors">{exp.name}</h3>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                  <History className="h-3 w-3" /> {exp.date}
                               </span>
                               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                                  <File className="h-3 w-3" /> {exp.fileCount} Objects
                               </span>
                            </div>
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                            exp.status === 'Analyzing' ? "bg-amber-50 text-amber-600 border-amber-100" :
                            exp.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                            "bg-slate-50 text-slate-500 border-slate-100"
                          )}>
                             {exp.status}
                          </span>
                       </div>

                       <div className="p-3 bg-indigo-50/30 rounded-xl border border-indigo-100/50 space-y-2">
                          <label className="text-[9px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                             <Sparkles className="h-3 w-3" /> AI Suggested Action
                          </label>
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-slate-700">{exp.suggestedAction}</span>
                             <Button className="h-7 px-3 bg-indigo-600 hover:bg-indigo-700 text-[10px] rounded-lg">Apply</Button>
                          </div>
                       </div>
                    </CardContent>
                    <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 flex gap-2">
                       <Link href="/tools/data-analysis" className="flex-1">
                          <Button variant="outline" className="w-full h-9 bg-white text-[10px] font-black uppercase tracking-wider border-slate-200 group-hover:border-indigo-100">
                             <Zap className="h-3 w-3 mr-2 text-amber-500" /> Analysis
                          </Button>
                       </Link>
                       <Link href="/tools/graph-generator" className="flex-1">
                          <Button variant="outline" className="w-full h-9 bg-white text-[10px] font-black uppercase tracking-wider border-slate-200 group-hover:border-indigo-100">
                             <LineChart className="h-3 w-3 mr-2 text-indigo-500" /> Graph
                          </Button>
                       </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredExperiments.length === 0 && (
          <div className="py-32 flex flex-col items-center text-center">
             <div className="h-24 w-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <FileSearch className="h-10 w-10 text-slate-300" />
             </div>
             <h2 className="text-xl font-bold">No Experiments Identified</h2>
             <p className="text-slate-500 text-sm mt-2 max-w-sm">Ask AI to re-scan the vault or upload new laboratory artifacts to populate your workspace.</p>
          </div>
        )}

        {/* Upload Overlay */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                 onClick={() => !isUploading && setShowUploadModal(false)}
               />
               <motion.div
                 initial={{ opacity: 0, scale: 0.9, y: 20 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 20 }}
                 className="relative z-10 w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
               >
                  <div className="p-8 border-b border-slate-100">
                     <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                           <UploadCloud className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                           <h2 className="text-xl font-bold">Smart Import</h2>
                           <p className="text-sm text-slate-500">Datasets will be segmented into experiment folders</p>
                        </div>
                     </div>

                     <div 
                       className="h-48 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-indigo-400 hover:bg-indigo-50/30 cursor-pointer transition-all group"
                       onClick={() => fileInputRef.current?.click()}
                     >
                        <Beaker className="h-10 w-10 text-slate-300 group-hover:text-indigo-400 group-hover:scale-110 transition-all" />
                        <div className="text-center">
                           <p className="text-sm font-bold">Drop laboratory artifacts here</p>
                           <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">CSV, XLSX, PDF, DOCX (Up to 50MB)</p>
                        </div>
                     </div>
                     <input type="file" ref={fileInputRef} className="hidden" onChange={handleUpload} />
                  </div>

                  <div className="p-6 bg-slate-50 flex justify-end gap-3">
                     <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest rounded-xl" onClick={() => setShowUploadModal(false)}>Cancel</Button>
                     <Button 
                       disabled={isUploading}
                       className="bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-xl px-8"
                       onClick={handleUpload}
                     >
                        {isUploading ? <Sparkles className="h-4 w-4 mr-2 animate-spin" /> : null}
                        {isUploading ? "Identifying..." : "Manual Upload"}
                     </Button>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
