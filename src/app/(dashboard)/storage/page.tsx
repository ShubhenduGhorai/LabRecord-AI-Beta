"use client";

import { useState, useRef, useMemo } from "react";
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
  Grid2X2, 
  List, 
  MoreHorizontal, 
  LineChart, 
  Sparkles, 
  TrendingUp,
  FlaskConical,
  ScrollText,
  History,
  Star,
  Zap,
  Loader2,
  FileSearch,
  Cloud
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

const INITIAL_EXPERIMENTS = [
  {
    id: "exp_1",
    name: "Thermodynamic Synergy Test",
    date: "2026-03-11",
    type: "Physics / Heat",
    fileCount: 3,
    status: "Analyzing",
    previewType: "dataset",
    suggestedAction: "Run Statistical Analysis",
    suggestedLink: "/tools/data-analysis",
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
    suggestedLink: "/tools/research-format",
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
    suggestedAction: "Generate Graph",
    suggestedLink: "/tools/graph-generator",
    size: "22.1 MB"
  }
];

export default function AIExperimentVaultPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [experiments, setExperiments] = useState(INITIAL_EXPERIMENTS);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredExperiments = useMemo(() => {
    return experiments.filter(e => 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [experiments, searchQuery]);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newExp = {
        id: `exp_${Date.now()}`,
        name: "Imported Dataset " + (experiments.length + 1),
        date: new Date().toISOString().split('T')[0],
        type: "Scientific Data",
        fileCount: 1,
        status: "Processing",
        previewType: "dataset",
        suggestedAction: "Create Lab Report",
        suggestedLink: "/tools/lab-report",
        size: "2.1 MB"
      };
      setExperiments([newExp, ...experiments]);
      setIsUploading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
              <HardDrive className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">AI Experiment Vault</h1>
              <p className="text-slate-500 font-medium">Intelligent laboratory data indexing & repository</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="relative group hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                   placeholder="AI Search..." 
                   className="pl-9 h-11 w-48 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-all"
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>
             <Button onClick={handleUpload} disabled={isUploading} className="h-11 px-6 bg-slate-900 text-white hover:bg-slate-800 font-bold rounded-xl shadow-lg">
                {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UploadCloud className="h-4 w-4 mr-2" />}
                Import Data
             </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4">
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {["All Vaults", "Physics", "Chemistry", "Bio-Science"].map((t, i) => (
                <Button key={t} variant={i === 0 ? "secondary" : "ghost"} size="sm" className={cn("rounded-xl text-[10px] font-black uppercase tracking-widest px-4 h-9", i === 0 ? "bg-indigo-50 text-indigo-600 border border-indigo-100" : "text-slate-400")}>
                  {t}
                </Button>
              ))}
           </div>
           <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm shrink-0">
             <Button variant="ghost" size="icon" onClick={() => setViewMode("grid")} className={cn("h-8 w-8", viewMode === "grid" ? "bg-slate-100" : "")}><Grid2X2 className="h-4 w-4" /></Button>
             <Button variant="ghost" size="icon" onClick={() => setViewMode("list")} className={cn("h-8 w-8", viewMode === "list" ? "bg-slate-100" : "")}><List className="h-4 w-4" /></Button>
           </div>
        </div>

        {/* Grid */}
        <div className={cn("grid gap-6", viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1")}>
          <AnimatePresence>
            {filteredExperiments.map((exp, idx) => (
              <motion.div key={exp.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}>
                 <Card className="group rounded-[2rem] border-slate-200 hover:border-indigo-200 transition-all shadow-sm hover:shadow-xl bg-white overflow-hidden">
                    <div className="h-32 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative">
                       {exp.previewType === 'dataset' && <Database className="h-12 w-12 text-indigo-100" />}
                       {exp.previewType === 'report' && <ScrollText className="h-12 w-12 text-purple-100" />}
                       {exp.previewType === 'graph' && <TrendingUp className="h-12 w-12 text-amber-100" />}
                       <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 rounded-lg"><Star className="h-3.5 w-3.5" /></Button>
                       </div>
                    </div>
                    <CardContent className="p-6">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.name}</h3>
                             <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 flex items-center gap-1">
                                <History className="h-3 w-3" /> {exp.date} • {exp.type}
                             </p>
                          </div>
                          <span className={cn("px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border", exp.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100")}>
                             {exp.status}
                          </span>
                       </div>
                       
                       <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/30 flex items-center justify-between">
                          <div className="space-y-0.5">
                             <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">AI Action</p>
                             <p className="text-xs font-bold text-slate-700">{exp.suggestedAction}</p>
                          </div>
                          <Link href={exp.suggestedLink}>
                             <Button size="sm" className="h-8 bg-indigo-600 hover:bg-indigo-700 text-[10px] font-black uppercase rounded-lg">Run</Button>
                          </Link>
                       </div>
                    </CardContent>
                    <CardFooter className="p-4 bg-slate-50/50 border-t border-slate-100 grid grid-cols-2 gap-2">
                       <Button variant="outline" className="h-9 text-[10px] font-black uppercase bg-white border-slate-200">
                          <Download className="h-3.5 w-3.5 mr-2" /> Export
                       </Button>
                       <Button variant="outline" className="h-9 text-[10px] font-black uppercase bg-white border-slate-200">
                          <Zap className="h-3.5 w-3.5 mr-2 text-amber-500" /> Details
                       </Button>
                    </CardFooter>
                 </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredExperiments.length === 0 && (
          <div className="py-32 flex flex-col items-center opacity-30 select-none">
             <FileSearch className="h-20 w-20 text-slate-300 mb-6" />
             <p className="font-black uppercase tracking-widest text-xs">Awaiting Discoveries</p>
             <p className="text-[10px] mt-2 max-w-[200px] text-center">Import laboratory data to begin intelligent experiment indexing.</p>
          </div>
        )}

      </div>
    </div>
  );
}
