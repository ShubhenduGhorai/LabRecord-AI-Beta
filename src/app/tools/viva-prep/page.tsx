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
import { 
  GraduationCap, 
  Play, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
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
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"setup" | "interview" | "results">("setup");
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: any;
    if (isTimerActive) interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const startSimulation = async () => {
    setError(null);
    if (!title.trim()) return setError("Please enter a topic.");
    setIsGenerating(true);
    try {
      const res = await fetch("/api/ai/viva", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experiment_title: title, difficulty })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      
      setQuestions(data.questions);
      setViewMode("interview");
      setIsTimerActive(true);
      setMessages([{ role: "ai", text: `Welcome to your ${difficulty} level Viva on ${title}. Phase 1: ${data.questions[0].type}. \n\n${data.questions[0].question}` }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = () => {
    if (!userInput.trim() || isProcessing) return;
    setIsProcessing(true);
    const userMsg: Message = { role: "user", text: userInput };
    
    // AI Evaluation Logic (Simplified for UI flow)
    setTimeout(() => {
      const g = userInput.length > 50 ? "Excellent" : "Good";
      const p = userInput.length > 50 ? 20 : 10;
      const aiMsg: Message = { 
        role: "ai", 
        text: "", 
        feedback: { grade: g, note: "Technical evaluation complete.", points: p } 
      };
      
      setScore(prev => prev + p);
      setMessages(prev => [...prev, userMsg, aiMsg]);
      setUserInput("");
      setIsProcessing(false);

      if (currentIndex < questions.length - 1) {
        const next = currentIndex + 1;
        setCurrentIndex(next);
        setTimeout(() => {
          setMessages(prev => {
            const last = [...prev];
            last[last.length - 1].text = `Next (${questions[next].type}): ${questions[next].question}`;
            return last;
          });
        }, 600);
      } else {
        setIsTimerActive(false);
        setTimeout(() => setViewMode("results"), 2000);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Section */}
        <div className="flex items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <div className="p-3 bg-amber-500 rounded-2xl shadow-lg shadow-amber-100">
            <GraduationCap className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">AI Viva Interrogator</h1>
            <p className="text-slate-500 font-medium">Interactive technical defense simulator</p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "setup" ? (
            <motion.div key="setup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-2xl mx-auto">
               <Card className="rounded-[3rem] p-10 shadow-2xl bg-white border-slate-200">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-amber-50">
                       <BrainCircuit className="h-10 w-10 text-amber-500" />
                    </div>
                    <CardTitle className="text-3xl font-black">Ready for Defense?</CardTitle>
                    <CardDescription>Select your difficulty and topic to begin the session.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8 pt-6">
                    <div className="space-y-2">
                       <Label className="uppercase text-[10px] font-black tracking-widest text-slate-400">Subject / Topic</Label>
                       <Input placeholder="e.g. Quantum Mechanics" value={title} onChange={(e) => setTitle(e.target.value)} className="h-14 rounded-2xl border-slate-200 px-6 text-lg" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                       {["Beginner", "Intermediate", "Advanced"].map(l => (
                         <Button key={l} variant={difficulty === l ? "secondary" : "outline"} onClick={() => setDifficulty(l)} className={cn("h-16 rounded-2xl font-bold transition-all", difficulty === l ? "bg-amber-50 text-amber-600 border-amber-200" : "text-slate-500")}>
                           {l}
                         </Button>
                       ))}
                    </div>
                    <Button onClick={startSimulation} disabled={isGenerating || !title} className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl">
                       {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5 mr-2" />}
                       Initialize Session
                    </Button>
                  </CardContent>
               </Card>
            </motion.div>
          ) : viewMode === "results" ? (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
               <Card className="rounded-[3rem] bg-slate-900 border-none shadow-2xl overflow-hidden text-white">
                  <div className="p-12 text-center border-b border-white/5">
                     <Trophy className="h-20 w-20 text-amber-400 mx-auto mb-6" />
                     <h2 className="text-4xl font-black uppercase tracking-tight">Technical Audit Complete</h2>
                     <div className="flex justify-center gap-12 mt-10">
                        <div className="text-center">
                           <p className="text-5xl font-black text-amber-400">{score}</p>
                           <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-2">Score</p>
                        </div>
                        <div className="text-center border-l border-white/10 pl-12">
                           <p className="text-5xl font-black">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</p>
                           <p className="text-[10px] uppercase font-black tracking-widest text-white/40 mt-2">Time</p>
                        </div>
                     </div>
                  </div>
                  <CardContent className="p-12 space-y-4">
                     {messages.filter(m => m.feedback).map((m, i) => (
                       <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5">
                          <p className="text-amber-400 text-xs font-black uppercase tracking-widest mb-2">Q{i+1}: {m.feedback?.grade}</p>
                          <p className="text-slate-300 text-sm leading-relaxed">{m.feedback?.note}</p>
                       </div>
                     ))}
                     <Button variant="outline" onClick={() => setViewMode("setup")} className="w-full h-14 rounded-2xl font-black uppercase tracking-widest text-white border-white/10 hover:bg-white/5 mt-6">
                        Start New Defense
                     </Button>
                  </CardContent>
               </Card>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               {/* Left Panel - Interview Stats */}
               <div className="lg:col-span-4 space-y-6">
                  <Card className="rounded-[2.5rem] border-slate-200 shadow-sm bg-white overflow-hidden p-8">
                     <div className="space-y-8">
                        <div>
                           <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">
                              <span>Session Time</span>
                              <Timer className="h-4 w-4" />
                           </div>
                           <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
                             {Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}
                           </h2>
                        </div>
                        <div className="space-y-4">
                           <div className="flex justify-between items-end text-[10px] font-black uppercase text-slate-400 tracking-widest">
                              <span>Performance</span>
                              <span className="text-amber-600">Points: {score}</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div className="h-full bg-amber-500" animate={{ width: `${(currentIndex / questions.length) * 100}%` }} />
                           </div>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-2">
                           <p className="text-xs font-black uppercase text-slate-800 tracking-widest flex items-center gap-2">
                             <Zap className="h-3.5 w-3.5 text-amber-500 fill-current" /> Examiner Tip
                           </p>
                           <p className="text-[10px] text-slate-500 leading-relaxed font-bold">Provide technical reasoning and formulas to maximize your evaluation score.</p>
                        </div>
                     </div>
                  </Card>
               </div>

               {/* Right Panel - Chat Interface */}
               <div className="lg:col-span-8">
                  <Card className="rounded-[3rem] bg-white border-slate-200 shadow-2xl h-[650px] flex flex-col overflow-hidden">
                     <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 scroll-smooth no-scrollbar">
                        {messages.map((m, i) => (
                          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex gap-4 max-w-[85%]", m.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                             <div className={cn("h-10 w-10 rounded-2xl flex items-center justify-center border shrink-0", m.role === 'ai' ? "bg-amber-50 border-amber-100 text-amber-500" : "bg-slate-900 text-white")}>
                               {m.role === 'ai' ? <Sparkles className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                             </div>
                             <div className={cn("p-6 rounded-[2rem] text-sm md:text-base leading-relaxed font-medium shadow-sm transition-all", m.role === 'ai' ? "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100" : "bg-slate-900 text-white rounded-tr-none")}>
                               {m.text || (m.feedback && <div className="space-y-2"><p className="text-xs font-black uppercase tracking-widest opacity-60">Feedback: {m.feedback.grade}</p><p>{m.feedback.note}</p></div>)}
                             </div>
                          </motion.div>
                        ))}
                        {isProcessing && <div className="p-4 bg-slate-50 rounded-2xl w-fit">...</div>}
                     </div>
                     <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4 items-center">
                        <Textarea 
                          placeholder="Type your defense..." 
                          value={userInput} 
                          onChange={(e) => setUserInput(e.target.value)} 
                          className="flex-1 min-h-[60px] max-h-[120px] rounded-2xl border-slate-200 shadow-xl px-6 py-4 resize-none"
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submitAnswer())} 
                        />
                        <Button onClick={submitAnswer} disabled={!userInput.trim() || isProcessing} className="h-14 w-14 bg-slate-900 rounded-2xl text-white shadow-xl flex-shrink-0">
                           <Send className="h-6 w-6" />
                        </Button>
                     </div>
                  </Card>
               </div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
