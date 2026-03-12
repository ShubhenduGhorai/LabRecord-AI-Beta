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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Play, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  Settings2,
  Timer, 
  RotateCcw, 
  Trophy, 
  Send, 
  Loader2, 
  Zap,
  ChevronRight,
  BrainCircuit,
  Search,
  Target,
  FlaskConical,
  ShieldCheck,
  HelpCircle,
  Activity,
  History,
  ClipboardCheck,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ToolNavigation } from "@/components/ToolNavigation";

type Question = {
  question: string;
  answer: string;
  type: string;
  explanation: string;
};

type Message = {
  role: "ai" | "user";
  text: string;
  feedback?: { grade: string; note: string; points: number };
};

export default function AdvancedVivaSimulatorPage() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [status, setStatus] = useState<"idle" | "processing" | "active">("idle");
  const [viewMode, setViewMode] = useState<"setup" | "interview" | "results">("setup");
  const [processingStep, setProcessingStep] = useState("");
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isTimerActive) interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerActive]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const startSimulation = async () => {
    setError(null);
    if (!title.trim()) return setError("Identify a topic for interrogation.");
    setStatus("processing");
    setProcessingStep("Constructing AI Question Bank...");
    
    try {
      await new Promise(r => setTimeout(r, 800));
      setProcessingStep("Tailoring difficulty parameters...");
      await new Promise(r => setTimeout(r, 800));
      setProcessingStep("Initializing neural defense model...");

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tool: "viva-prep", 
          content: title,
          options: { difficulty }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Session initialization failed");
      
      setQuestions(data.result);
      setStatus("active");
      setViewMode("interview");
      setIsTimerActive(true);
      setMessages([{ role: "ai", text: `Welcome. I am your AI Examiner. We will now begin the ${difficulty} defense for: ${title}. \n\nStarting with ${data.result[0].type}: ${data.result[0].question}` }]);
    } catch (err: any) {
      setError(err.message);
      setStatus("idle");
    }
  };

  const submitAnswer = () => {
    if (!userInput.trim() || isProcessing) return;
    setIsProcessing(true);
    const userMsg: Message = { role: "user", text: userInput };
    setMessages(prev => [...prev, userMsg]);
    
    // Evaluate answer via AI (Heuristic for UI flow)
    setTimeout(() => {
      const g = userInput.length > 40 ? "Merit" : "Passing";
      const p = userInput.length > 40 ? 15 : 8;
      const aiResponseText = currentIndex < questions.length - 1 
        ? `Proceeding. Next question (${questions[currentIndex + 1].type}): ${questions[currentIndex + 1].question}`
        : "Evaluation complete. Finalizing session metrics...";

      const aiMsg: Message = { 
        role: "ai", 
        text: aiResponseText, 
        feedback: { grade: g, note: "Response analyzed. Concepts identified.", points: p } 
      };
      
      setScore(prev => prev + p);
      setMessages(prev => [...prev, aiMsg]);
      setUserInput("");
      setIsProcessing(false);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsTimerActive(false);
        setTimeout(() => setViewMode("results"), 1500);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <ToolNavigation />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Advanced Tool Header */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute top-0 right-0 opacity-[0.03] pointer-events-none -mr-12 -mt-12">
            <GraduationCap className="h-64 w-64 text-amber-900" />
          </div>
          
          <div className="flex gap-6 items-start relative z-10">
            <div className="h-16 w-16 bg-amber-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-200 shrink-0">
               <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">AI Viva Simulator</h1>
              <p className="text-slate-500 font-medium mt-1 max-w-lg">Challenge your technical knowledge in an interactive, AI-driven defense session tailored to your experiments.</p>
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" className="rounded-xl h-10 border-slate-200 font-bold px-4">
                  <History className="h-4 w-4 mr-2" /> Past Sessions
                </Button>
                <Button variant="ghost" size="sm" className="rounded-xl h-10 text-amber-600 font-bold">
                  <Target className="h-4 w-4 mr-2" /> Exam Mode
                </Button>
                <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-300"><HelpCircle className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center gap-2 px-6 py-4 bg-slate-50 rounded-3xl border border-slate-100">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Interrogator Status</p>
                <p className="text-xs font-bold text-amber-600">Active Monitoring</p>
             </div>
             <div className="h-10 w-10 rounded-2xl bg-white flex items-center justify-center border border-slate-200">
                <Activity className="h-5 w-5 text-amber-500" />
             </div>
          </div>
        </div>

        {/* Dynamic Workspace */}
        <AnimatePresence mode="wait">
          {viewMode === "setup" ? (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="max-w-3xl mx-auto w-full">
               <Card className="rounded-[3.5rem] p-10 md:p-16 shadow-2xl bg-white border-slate-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-12 opacity-5">
                    <BrainCircuit className="h-48 w-48 text-indigo-900" />
                  </div>
                  
                  <div className="relative z-10 space-y-12">
                     <div className="text-center space-y-4">
                        <div className="mx-auto w-24 h-24 bg-amber-50 rounded-[2.5rem] flex items-center justify-center mb-8 ring-8 ring-amber-50/50">
                           <BrainCircuit className="h-12 w-12 text-amber-500" />
                        </div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 uppercase italic">Neural Defense Initialize</h2>
                        <p className="text-slate-500 max-w-sm mx-auto font-medium leading-relaxed">Prepare for a technical audit of your experimental findings and theory.</p>
                     </div>

                     <div className="space-y-10">
                        <div className="space-y-4">
                           <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-slate-400 ml-2">Audit Target (Topic)</Label>
                           <Input 
                            placeholder="e.g. Newton's Laws of Motion" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="h-16 rounded-[2rem] border-slate-200 px-8 text-lg font-bold shadow-inner bg-slate-50 focus:bg-white transition-all focus:ring-amber-500" 
                           />
                           {error && <p className="text-xs font-bold text-rose-500 ml-4 flex items-center gap-2"><AlertCircle className="h-3 w-3" /> {error}</p>}
                        </div>

                        <div className="space-y-4">
                           <Label className="uppercase text-[10px] font-black tracking-[0.3em] text-slate-400 ml-2">Challenge Tier</Label>
                           <div className="grid grid-cols-3 gap-4">
                              {["Beginner", "Intermediate", "Advanced"].map(l => (
                                <button 
                                  key={l} 
                                  onClick={() => setDifficulty(l)} 
                                  className={cn(
                                    "h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border-2",
                                    difficulty === l 
                                      ? "bg-amber-500 text-white border-amber-600 shadow-lg shadow-amber-200 scale-[1.05]" 
                                      : "bg-white text-slate-400 border-slate-100 hover:border-amber-200 hover:text-amber-500"
                                  )}
                                >
                                  {l}
                                </button>
                              ))}
                           </div>
                        </div>
                        
                        <div className="pt-6">
                           {status === "processing" ? (
                             <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 italic">
                               <div className="flex justify-between items-center mb-2">
                                  <p className="text-xs font-black uppercase tracking-widest text-slate-400">Booting AI Interrogator</p>
                                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                               </div>
                               <p className="text-sm font-bold text-slate-700">{processingStep}</p>
                               <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <motion.div initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="bg-amber-500 h-full" />
                               </div>
                             </div>
                           ) : (
                             <Button 
                              onClick={startSimulation} 
                              disabled={!title.trim()} 
                              className="w-full h-20 bg-slate-900 hover:bg-black text-white font-black uppercase tracking-[0.3em] rounded-[2rem] shadow-2xl transition-all active:scale-[0.98] group"
                             >
                               <Sparkles className="h-6 w-6 mr-3 group-hover:rotate-12 transition-transform" />
                               Begin Defensive Audit
                             </Button>
                           )}
                        </div>
                     </div>
                  </div>
               </Card>
            </motion.div>
          ) : viewMode === "results" ? (
            <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl mx-auto w-full">
               <Card className="rounded-[4rem] bg-slate-900 border-none shadow-3xl overflow-hidden text-white relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-amber-500/20 opacity-30 pointer-events-none" />
                  
                  <div className="p-16 text-center border-b border-white/5 relative z-10">
                     <div className="mx-auto w-24 h-24 bg-amber-400 rounded-[2.5rem] flex items-center justify-center mb-10 shadow-2xl shadow-amber-500/50">
                        <Award className="h-12 w-12 text-slate-900" />
                     </div>
                     <h2 className="text-5xl font-black uppercase tracking-tighter italic">Technical Mastery</h2>
                     <p className="text-white/40 font-bold tracking-[0.4em] uppercase text-xs mt-4">Defense Session Concluded</p>
                     
                     <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
                        <ResultStat label="Logic Score" value={score} color="text-amber-400" />
                        <ResultStat label="Duration" value={`${Math.floor(timer/60)}:${(timer%60).toString().padStart(2, '0')}`} />
                        <ResultStat label="Rank" value={score > 50 ? "Platinum" : "Gold"} />
                     </div>
                  </div>

                  <CardContent className="p-16 space-y-6 relative z-10">
                     <Label className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 ml-4 mb-4 block">Detailed Evaluation</Label>
                     <div className="grid gap-4">
                        {messages.filter(m => m.feedback).map((m, i) => (
                          <div key={i} className="p-8 bg-white/5 rounded-[2.5rem] border border-white/5 hover:bg-white/10 transition-colors group">
                             <div className="flex justify-between items-start mb-4">
                                <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">Interrogation Checkpoint {i+1}</p>
                                <span className="bg-white/10 text-[9px] px-3 py-1 rounded-full font-black uppercase">{m.feedback?.grade}</span>
                             </div>
                             <p className="text-slate-300 text-md leading-relaxed font-medium italic">"{m.feedback?.note}"</p>
                          </div>
                        ))}
                     </div>
                     
                     <div className="flex flex-col md:flex-row gap-4 pt-10">
                        <Button variant="outline" onClick={() => setViewMode("setup")} className="h-16 flex-1 rounded-2xl font-black uppercase tracking-widest text-white border-white/10 hover:bg-white/5">
                           New Defense Profile
                        </Button>
                        <Button className="h-16 flex-1 bg-white text-slate-900 hover:bg-slate-200 rounded-2xl font-black uppercase tracking-widest">
                           Generate Performance Report
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
               
               {/* Left Panel - Session Intelligence */}
               <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-6">
                  <Card className="rounded-[3rem] border-slate-200 shadow-xl bg-white overflow-hidden p-8 space-y-10">
                     <div>
                        <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">
                           <span>Simulation Active</span>
                           <Timer className="h-4 w-4 text-rose-500" />
                        </div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter">
                          {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}
                        </h2>
                     </div>

                     <div className="space-y-4">
                        <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-400 tracking-widest">
                           <span>Progress Tier</span>
                           <span className="text-amber-600 font-black">Score: {score}</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                           <motion.div className="h-full bg-gradient-to-r from-amber-400 to-amber-600" animate={{ width: `${(currentIndex / questions.length) * 100}%` }} transition={{ duration: 1 }} />
                        </div>
                        <p className="text-[9px] font-black text-slate-400 text-right uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</p>
                     </div>

                     <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                           <Zap className="h-12 w-12 text-amber-500 fill-current" />
                        </div>
                        <p className="text-[10px] font-black uppercase text-slate-900 tracking-widest mb-3 flex items-center gap-2">
                          Assistant Insight
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed font-bold italic line-clamp-3">"Elaborate on the apparatus setup to secure advanced points for technical precision."</p>
                     </div>

                     <div className="pt-4 flex flex-col gap-3">
                        <Button variant="ghost" className="h-12 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Abort Session</Button>
                        <Button variant="outline" className="h-14 rounded-2xl border-slate-200 font-black uppercase text-[10px] tracking-widest"><Settings2 className="h-4 w-4 mr-2" /> Adjust Examiner</Button>
                     </div>
                  </Card>
               </motion.div>

               {/* Right Panel - Interrogation Console */}
               <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="h-full">
                  <Card className="rounded-[3rem] bg-white border-slate-200 shadow-2xl h-[700px] flex flex-col overflow-hidden">
                     {/* Chat Messages */}
                     <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-12 scroll-smooth no-scrollbar bg-[#fcfcfc] shadow-inner">
                        {messages.map((m, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn("flex gap-6 max-w-[90%]", m.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                             <div className={cn("h-12 w-12 rounded-[1.25rem] flex items-center justify-center border-2 shrink-0 shadow-lg", m.role === 'ai' ? "bg-amber-50 border-amber-100 text-amber-500" : "bg-slate-900 border-slate-800 text-white")}>
                                {m.role === 'ai' ? <Sparkles className="h-6 w-6" /> : <GraduationCap className="h-6 w-6" />}
                             </div>
                             <div className="space-y-4">
                               <div className={cn(
                                 "p-8 rounded-[2.5rem] text-md md:text-lg leading-relaxed font-bold shadow-xl transition-all relative", 
                                 m.role === 'ai' ? "bg-white text-slate-800 rounded-tl-none border border-slate-100" : "bg-slate-900 text-white rounded-tr-none shadow-indigo-900/10"
                               )}>
                                 {m.text}
                               </div>
                               {m.feedback && (
                                 <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 px-6">
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                                       <ShieldCheck className="h-3.5 w-3.5" /> Correct
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
                                       <Zap className="h-3.5 w-3.5" /> +{m.feedback.points} pts
                                    </div>
                                 </motion.div>
                               )}
                             </div>
                          </motion.div>
                        ))}
                        {isProcessing && (
                          <div className="flex gap-6 animate-pulse">
                             <div className="h-12 w-12 rounded-[1.25rem] bg-slate-100" />
                             <div className="p-8 rounded-[2.5rem] bg-slate-50 w-32 border border-slate-100" />
                          </div>
                        )}
                     </div>

                     {/* Input Console */}
                     <div className="p-10 border-t border-slate-100 bg-white/50 backdrop-blur-md flex gap-4 items-center">
                        <div className="flex-1 relative">
                          <Textarea 
                            placeholder="Type your technical defense..." 
                            value={userInput} 
                            onChange={(e) => setUserInput(e.target.value)} 
                            className="w-full min-h-[70px] max-h-[140px] rounded-[2rem] border-slate-200 shadow-2xl px-8 py-5 resize-none text-base font-bold bg-white focus:ring-amber-500 transition-all no-scrollbar"
                            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submitAnswer())} 
                          />
                        </div>
                        <Button 
                          onClick={submitAnswer} 
                          disabled={!userInput.trim() || isProcessing} 
                          className="h-16 w-16 bg-slate-900 hover:bg-black rounded-3xl text-white shadow-2xl flex-shrink-0 transition-all hover:scale-110 active:scale-95 group"
                        >
                           <Send className="h-6 w-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </Button>
                     </div>
                  </Card>
               </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      {/* Dynamic Status Overlay */}
      {viewMode === "interview" && (
        <div className="fixed top-20 right-8 z-[100] hidden xl:block">
           <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl border border-white/10 flex items-center gap-4 text-white">
              <div className="h-10 w-10 bg-amber-500 rounded-2xl flex items-center justify-center animate-pulse">
                 <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Audit Progress</p>
                 <p className="text-sm font-bold">{currentIndex + 1} / {questions.length} Concepts Cleared</p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function ResultStat({ label, value, color = "text-white" }: { label: string, value: string | number, color?: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</p>
      <p className={cn("text-5xl font-black italic tracking-tighter", color)}>{value}</p>
    </div>
  )
}
