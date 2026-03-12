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
  BadgeHelp, 
  Play, 
  AlertCircle, 
  Sparkles, 
  MessageSquare, 
  Timer, 
  RotateCcw, 
  Trophy, 
  GraduationCap, 
  Eye, 
  EyeOff,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  FlaskConical,
  Zap,
  ArrowRight,
  ClipboardCheck,
  BrainCircuit,
  ShieldCheck,
  Send,
  Loader2,
  CheckCircle2,
  BarChart3,
  Search,
  ExternalLink,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import jsPDF from "jspdf";
import Link from "next/link";

type QuestionType = "Conceptual" | "Calculation" | "Graph Analysis";
type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type VivaQuestion = {
  question: string;
  answer: string;
  type: QuestionType;
  points: number;
  explanation: string;
};

type SessionMessage = {
  role: "ai" | "user";
  text: string;
  feedback?: {
    grade: "Excellent" | "Good" | "Poor";
    note: string;
    pointsEarned: number;
  };
};

export default function AdvancedVivaSimulatorPage() {
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Intermediate");
  const [questions, setQuestions] = useState<VivaQuestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<"setup" | "interview" | "results">("setup");
  
  // Interview State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<SessionMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  // Scoring
  const [score, setScore] = useState(0);
  const [totalPossible, setTotalPossible] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Timer logic
  useEffect(() => {
    let interval: any;
    if (isTimerActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive]);

  const handleStartSimulation = async () => {
    setError(null);
    if (!title.trim()) {
      setError("Please enter an experiment or topic title.");
      return;
    }

    setIsGenerating(true);
    try {
      // In a real app, we'd pass difficulty and question type preferences here
      const res = await fetch('/api/viva-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experiment_title: title, difficulty })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate viva questions.");

      // Enhanced mock logic for advanced features if API is basic
      const enhancedQuestions = data.questions.map((q: any, i: number) => ({
        ...q,
        type: i % 3 === 0 ? "Conceptual" : i % 3 === 1 ? "Calculation" : "Graph Analysis",
        points: difficulty === "Beginner" ? 10 : difficulty === "Intermediate" ? 20 : 30,
        explanation: `This question tests your understanding of ${q.question.split(' ').slice(0, 3).join(' ')}. The key is to mention the relationship between variables.`
      }));

      setQuestions(enhancedQuestions);
      setTotalPossible(enhancedQuestions.reduce((acc: number, q: any) => acc + q.points, 0));
      setViewMode("interview");
      setCurrentIndex(0);
      setTimer(0);
      setIsTimerActive(true);
      setScore(0);
      
      // Start with first AI message
      setMessages([{
        role: "ai",
        text: `Welcome to your ${difficulty} level Viva on ${title}. I'll assess your understanding through several phases. Let's begin.\n\n${enhancedQuestions[0].question}`
      }]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = () => {
    if (!userInput.trim() || isProcessing) return;

    setIsProcessing(true);
    const userMsg: SessionMessage = { role: "user", text: userInput };
    const currentQ = questions[currentIndex];
    
    // Simulate AI Feedback / Grading
    setTimeout(() => {
      const inputLen = userInput.length;
      let grade: "Excellent" | "Good" | "Poor" = "Good";
      let points = Math.floor(currentQ.points * 0.7);
      let note = "A solid attempt. You covered the core concept, but try to be more specific with technical terminology.";

      if (inputLen > 100) {
        grade = "Excellent";
        points = currentQ.points;
        note = "Excellent depth of explanation. You've clearly mastered the relationship between the variables in this experiment.";
      } else if (inputLen < 30) {
        grade = "Poor";
        points = Math.floor(currentQ.points * 0.3);
        note = "This answer is a bit brief. In a real viva, the examiner would expect you to elaborate on the 'how' and 'why'.";
      }

      const aiResponse: SessionMessage = {
        role: "ai",
        text: "", // placeholder
        feedback: { grade, note, pointsEarned: points }
      };

      setScore(prev => prev + points);
      setMessages(prev => [...prev, userMsg, aiResponse]);
      setUserInput("");
      setIsProcessing(false);

      // Move to next question or end
      if (currentIndex < questions.length - 1) {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setTimeout(() => {
          setMessages(prev => {
             const last = prev[prev.length - 1];
             last.text = `Thank you. Next question (${questions[nextIdx].type}):\n\n${questions[nextIdx].question}`;
             return [...prev];
          });
        }, 500);
      } else {
        setIsTimerActive(false);
        setTimeout(() => setViewMode("results"), 2000);
      }
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* Modern Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100 shrink-0">
               <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">AI Viva Interrogator</h1>
              <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                <BrainCircuit className="h-4 w-4 text-amber-500" /> Interactive interview-style defense simulation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             {viewMode !== "setup" && (
               <Button variant="outline" onClick={() => setViewMode("setup")} className="text-slate-600 border-slate-200 hover:bg-slate-50 font-bold text-xs uppercase tracking-widest px-6 h-11 rounded-xl">
                  <RotateCcw className="h-4 w-4 mr-2" /> New Session
               </Button>
             )}
             <Link href="/tools/lab-report">
               <Button variant="secondary" className="bg-slate-900 text-white hover:bg-slate-800 font-bold text-xs uppercase tracking-widest px-6 h-11 rounded-xl shadow-lg shadow-slate-200">
                  <ExternalLink className="h-4 w-4 mr-2" /> From Report
               </Button>
             </Link>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {viewMode === "setup" ? (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl mx-auto pt-10"
            >
               <Card className="rounded-[2.5rem] border-slate-200 shadow-2xl bg-white overflow-hidden">
                  <div className="hidden md:block absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                     <Target className="h-64 w-64" />
                  </div>
                  <CardHeader className="text-center pt-12 pb-8">
                     <div className="mx-auto w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 ring-[12px] ring-amber-500/5">
                        <MessageSquare className="h-12 w-12 text-amber-500" />
                     </div>
                     <CardTitle className="text-3xl font-black text-slate-900 leading-tight">Mock Defense Setup</CardTitle>
                     <p className="text-slate-500 font-medium max-w-md mx-auto mt-2">The AI Interrogator will evaluate your technical depth through a series of structured conceptual and mathematical stages.</p>
                  </CardHeader>

                  <CardContent className="p-8 md:p-12 space-y-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                           <FlaskConical className="h-4 w-4 text-amber-500" /> Experiment or Academic Topic
                        </label>
                        <Input 
                          placeholder="e.g. Young's Modulus, Hooke's Law, or Cellular Mitosis..." 
                          className="h-16 rounded-2xl border-slate-200 text-lg px-8 focus:ring-amber-500/10 focus:border-amber-500 transition-all shadow-sm"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                        {error && <p className="text-xs font-bold text-red-500 ml-2">⚠️ {error}</p>}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(["Beginner", "Intermediate", "Advanced"] as Difficulty[]).map(lvl => (
                          <button
                            key={lvl}
                            onClick={() => setDifficulty(lvl)}
                            className={cn(
                              "p-6 rounded-3xl border-2 transition-all text-center group",
                              difficulty === lvl ? "border-amber-500 bg-amber-50/30 ring-4 ring-amber-500/5" : "border-slate-100 bg-slate-50 hover:border-slate-200"
                            )}
                          >
                             <p className={cn("text-[9px] font-black uppercase tracking-widest mb-1", difficulty === lvl ? "text-amber-500" : "text-slate-400 group-hover:text-slate-600")}>{lvl}</p>
                             <p className="font-bold text-slate-900">{lvl === 'Beginner' ? 'Concepts' : lvl === 'Intermediate' ? 'Detailed' : 'Calculative'}</p>
                          </button>
                        ))}
                     </div>
                  </CardContent>

                  <CardFooter className="p-10 bg-slate-50/50 border-t border-slate-100">
                     <Button 
                       disabled={isGenerating}
                       onClick={handleStartSimulation}
                       className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-xl shadow-slate-200 font-black uppercase tracking-[0.2em] text-sm group"
                     >
                        {isGenerating ? <Loader2 className="h-5 w-5 mr-3 animate-spin" /> : <Play className="h-5 w-5 mr-3 fill-current" />}
                        {isGenerating ? "Synthesizing Defense Phase..." : "Begin Mock Session"}
                     </Button>
                  </CardFooter>
               </Card>
            </motion.div>
          ) : viewMode === "results" ? (
            <motion.div 
               key="results"
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="max-w-4xl mx-auto pt-6"
            >
               <Card className="rounded-[3rem] border-slate-200 shadow-2xl bg-white overflow-hidden p-1">
                  <div className="bg-slate-900 p-12 text-center text-white relative">
                     <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                     <Trophy className="h-20 w-20 text-amber-400 mx-auto mb-6" />
                     <h2 className="text-4xl font-black uppercase tracking-tight">Performance Summary</h2>
                     <div className="flex justify-center gap-12 mt-10">
                        <div className="text-center">
                           <p className="text-5xl font-black text-amber-500">{score}</p>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Points Earned</p>
                        </div>
                        <div className="text-center border-l border-white/10 pl-12">
                           <p className="text-5xl font-black text-white">{Math.round((score/totalPossible)*100)}%</p>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Accuracy Rate</p>
                        </div>
                        <div className="text-center border-l border-white/10 pl-12">
                           <p className="text-5xl font-black text-indigo-400">{formatTime(timer)}</p>
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-2">Time Duration</p>
                        </div>
                     </div>
                  </div>

                  <CardContent className="p-12 space-y-10">
                     <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 shrink-0">Session Log</h3>
                           <div className="h-px bg-slate-100 flex-1"></div>
                        </div>

                        <div className="space-y-4">
                           {messages.filter(m => m.feedback).map((m, i) => (
                             <div key={i} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex gap-6 items-start">
                                <div className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm shrink-0">0{i+1}</div>
                                <div className="space-y-1">
                                   <div className="flex items-center gap-3 mb-2">
                                      <span className={cn(
                                        "px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border",
                                        m.feedback?.grade === 'Excellent' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                        m.feedback?.grade === 'Good' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                        "bg-rose-50 text-rose-600 border-rose-100"
                                      )}>
                                         {m.feedback?.grade}
                                      </span>
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.feedback?.pointsEarned} Points</span>
                                   </div>
                                   <p className="text-sm font-bold text-slate-700 leading-relaxed italic border-l-2 border-slate-200 pl-4 mb-3">"{messages[messages.findIndex(msg => msg === m) - 1].text}"</p>
                                   <p className="text-sm font-medium text-slate-500 leading-relaxed">{m.feedback?.note}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>

                     <div className="flex gap-4 pt-6">
                        <Button className="flex-1 h-14 bg-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest">
                           <Download className="h-4 w-4 mr-2" /> Download Feedback PDF
                        </Button>
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-slate-200" onClick={() => setViewMode("setup")}>
                           <RotateCcw className="h-4 w-4 mr-2" /> Start New Session
                        </Button>
                     </div>
                  </CardContent>
               </Card>
            </motion.div>
          ) : (
            <motion.div 
               key="interview"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6"
            >
               {/* Interview Sidebar */}
               <div className="lg:col-span-4 space-y-6">
                  <Card className="rounded-[2rem] border-slate-200 shadow-sm overflow-hidden bg-white">
                     <CardHeader className="bg-slate-50/50 p-8 border-b border-slate-100">
                         <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                            <span>Defense Session</span>
                            <Timer className="h-4 w-4" />
                         </div>
                         <div className="text-4xl font-black text-slate-900 tracking-tight">{formatTime(timer)}</div>
                         <div className="flex items-center gap-2 mt-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Active Link Established</span>
                         </div>
                     </CardHeader>
                     <CardContent className="p-8 space-y-8">
                        <div className="space-y-4">
                           <div className="flex justify-between items-end">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Response Accuracy</label>
                              <span className="text-xs font-black text-slate-900">{score} Points</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-amber-500" 
                                initial={{ width: 0 }}
                                animate={{ width: `${(score/totalPossible) * 100}%` }}
                              />
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                           <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Success</p>
                              <p className="text-2xl font-black text-emerald-600">{Math.round((score/totalPossible)*100 || 0)}%</p>
                           </div>
                           <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue</p>
                              <p className="text-2xl font-black text-slate-900">{questions.length - currentIndex}</p>
                           </div>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-3xl text-white space-y-4 shadow-xl shadow-slate-200">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                 <Zap className="h-5 w-5 text-amber-400" />
                              </div>
                              <h3 className="font-bold text-sm">AI Feedback Tips</h3>
                           </div>
                           <p className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-wider">
                              Longer, structured answers with technical keywords earn <span className="text-white">Full points</span>. Avoid one-word responses.
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Interview Chat Interior */}
               <div className="lg:col-span-8 space-y-6">
                  <div className="h-[650px] bg-white rounded-[3rem] border border-slate-200 shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-slate-100">
                     <div className="absolute top-0 left-0 w-full h-2 bg-amber-500"></div>
                     
                     <div className="flex-1 p-8 md:p-12 overflow-y-auto space-y-8 no-scrollbar scroll-smooth">
                        <AnimatePresence>
                           {messages.map((msg, i) => (
                             <motion.div
                               key={i}
                               initial={{ opacity: 0, y: 10 }}
                               animate={{ opacity: 1, y: 0 }}
                               className={cn(
                                 "flex gap-4 max-w-[85%]",
                                 msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                               )}
                             >
                                <div className={cn(
                                  "h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border",
                                  msg.role === 'ai' ? "bg-amber-50 border-amber-100 text-amber-600" : "bg-slate-900 border-slate-800 text-white"
                                )}>
                                   {msg.role === 'ai' ? <Sparkles className="h-5 w-5" /> : <GraduationCap className="h-5 w-5" />}
                                </div>
                                <div className="space-y-4">
                                   <div className={cn(
                                     "p-6 rounded-[2rem] text-sm md:text-base leading-relaxed font-medium shadow-sm transition-all animate-in fade-in slide-in-from-bottom-2",
                                     msg.role === 'ai' ? "bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100" : "bg-slate-900 text-white rounded-tr-none"
                                   )}>
                                      {msg.text || (msg.feedback && (
                                        <div className="space-y-4">
                                           <div className="flex items-center gap-3">
                                              <span className={cn(
                                                "h-2 w-2 rounded-full",
                                                msg.feedback.grade === 'Excellent' ? "bg-emerald-500" : msg.feedback.grade === 'Good' ? "bg-amber-500" : "bg-rose-500"
                                              )} />
                                              <span className="text-xs font-black uppercase tracking-widest opacity-60">Result: {msg.feedback.grade}</span>
                                           </div>
                                           <p className="border-l-2 border-white/10 pl-4">{msg.feedback.note}</p>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                             </motion.div>
                           ))}
                           {isProcessing && (
                             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                                <div className="h-10 w-10 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center">
                                   <Loader2 className="h-5 w-5 animate-spin" />
                                </div>
                                <div className="p-4 bg-slate-50 rounded-2xl rounded-tl-none border border-slate-100">
                                   <div className="flex gap-1.5">
                                      <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce" />
                                      <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                      <div className="h-1.5 w-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                   </div>
                                </div>
                             </motion.div>
                           )}
                        </AnimatePresence>
                        <div className="h-4" />
                     </div>

                     <div className="p-8 md:p-10 border-t border-slate-100 bg-slate-50/50">
                        <div className="relative group">
                           <Textarea 
                             placeholder="Type your technical defense here..."
                             disabled={isProcessing}
                             className="min-h-[100px] w-full rounded-[2.5rem] border-slate-200 focus:ring-amber-500/10 focus:border-amber-500 pl-8 pr-20 py-6 text-sm md:text-base leading-relaxed resize-none bg-white shadow-xl transition-all"
                             value={userInput}
                             onChange={(e) => setUserInput(e.target.value)}
                             onKeyDown={(e) => {
                               if (e.key === 'Enter' && !e.shiftKey) {
                                 e.preventDefault();
                                 submitAnswer();
                               }
                             }}
                           />
                           <Button 
                             onClick={submitAnswer}
                             disabled={!userInput.trim() || isProcessing}
                             className="absolute bottom-4 right-4 h-12 w-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/20 transition-all active:scale-95"
                           >
                              <Send className="h-5 w-5" />
                           </Button>
                        </div>
                        <div className="mt-4 flex justify-between items-center px-4">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Secure Adaptive Session Alpha v2.1
                           </p>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shift + Enter for New Line</p>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
