"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Sparkles, MessageSquare, FileJson } from "lucide-react";

const scenes = [
  {
    id: "report",
    title: "AI Lab Report Writer",
    color: "bg-indigo-600",
    description: "Generating aim, theory, procedure...",
  },
  {
    id: "viva",
    title: "Viva Preparation",
    color: "bg-rose-500",
    description: "Question & Answer Interface",
  },
  {
    id: "format",
    title: "Research Formatting",
    color: "bg-emerald-500",
    description: "Auto-formatting for Publication",
  },
];

export function DemoPreview() {
  const [currentScene, setCurrentScene] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="demo" className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center gap-16">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:w-5/12"
          >
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              See LabRecord AI in Action
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Watch how our platform effortlessly transforms a disorganized, raw dataset into a beautifully formatted, comprehensive lab report tailored for academic submission.
            </p>
            <Button size="lg" className="h-14 px-8 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
              <Play className="mr-2 w-5 h-5" /> Try Interactive Demo
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:w-7/12 w-full"
          >
            <div className="bg-muted/30 border rounded-2xl p-4 shadow-2xl relative overflow-hidden group">
              <div className="bg-background rounded-xl border overflow-hidden shadow-sm aspect-video flex flex-col relative">
                
                {/* Mockup Header */}
                <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 flex gap-4">
                    {scenes.map((scene, idx) => (
                      <div 
                        key={scene.id}
                        className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${
                          currentScene === idx ? "text-indigo-600 opacity-100" : "text-muted-foreground opacity-40"
                        }`}
                      >
                        {scene.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Animated Scene Content */}
                <div className="flex-1 p-6 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    {currentScene === 0 && (
                      <motion.div 
                        key="report"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="w-5 h-5 text-indigo-600" />
                          <h3 className="font-bold text-indigo-600 text-sm">Generating Report...</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { tag: "Aim", text: "To determine the acceleration due to gravity." },
                            { tag: "Theory", text: "The motion is governed by s = ut + 0.5at²." },
                            { tag: "Procedure", text: "1. Calibrate sensors. 2. Drop the weight." },
                            { tag: "Result", text: "Calculated g = 9.81 m/s² (0.2% error)." }
                          ].map((line, i) => (
                            <motion.div 
                              key={i}
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.4 }}
                              className="border-l-2 border-indigo-200 pl-3 py-1"
                            >
                              <span className="text-[10px] font-bold block text-muted-foreground/60">{line.tag}:</span>
                              <span className="text-xs font-medium">{line.text}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {currentScene === 1 && (
                      <motion.div 
                        key="viva"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex flex-col h-full"
                      >
                        <div className="flex items-center gap-2 mb-6 border-b pb-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <MessageSquare className="w-4 h-4 text-rose-500" />
                          </div>
                          <div>
                            <h3 className="font-bold text-rose-500 text-sm">Viva Prep AI</h3>
                            <p className="text-[10px] text-muted-foreground">Expert Evaluator</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-muted p-3 rounded-2xl rounded-tl-none mr-12 text-xs font-medium"
                          >
                            What is the purpose of regression analysis in this experiment?
                          </motion.div>
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 2 }}
                            className="bg-rose-500 text-white p-3 rounded-2xl rounded-tr-none ml-12 text-xs"
                          >
                            It helps us find the line of best fit to determine the relationship between time and displacement.
                          </motion.div>
                        </div>
                      </motion.div>
                    )}

                    {currentScene === 2 && (
                      <motion.div 
                        key="format"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="max-w-md mx-auto"
                      >
                        <div className="border border-dashed p-6 rounded-lg bg-slate-50/50 flex flex-col gap-4 shadow-inner">
                          <motion.div 
                            layout
                            className="h-6 bg-white border rounded shadow-sm px-2 flex items-center justify-center"
                          >
                            <motion.span 
                              animate={{ fontWeight: [400, 700], scale: [1, 1.02, 1] }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="text-[10px] text-center"
                            >
                              Experimental Velocity Analysis in Free Fall
                            </motion.span>
                          </motion.div>
                          
                          <div className="space-y-2">
                            {[1, 2, 3].map((l) => (
                              <motion.div key={l} className="flex gap-2 items-start">
                                <span className="h-3 w-full bg-muted rounded-full"></span>
                                <motion.div 
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 1 + l * 0.5 }}
                                  className="shrink-0 w-3 h-3 rounded bg-emerald-100 border-emerald-300 border text-[8px] flex items-center justify-center font-bold text-emerald-700"
                                >
                                  {l}
                                </motion.div>
                              </motion.div>
                            ))}
                          </div>
                          
                          <motion.div 
                            animate={{ height: [40, 60], opacity: [0.6, 1] }}
                            transition={{ delay: 2.5 }}
                            className="bg-white border rounded p-2 flex flex-col gap-1.5"
                          >
                            <div className="h-1.5 w-1/4 bg-emerald-400 rounded-full"></div>
                            <div className="h-1.5 w-full bg-muted rounded-full"></div>
                            <div className="h-1.5 w-5/6 bg-muted rounded-full"></div>
                          </motion.div>
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center gap-1 text-emerald-600 font-bold italic text-[10px]">
                          <FileJson className="w-3 h-3" />
                          IEEE Formatted
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Progress Bar for the scene loop */}
                <div className="px-6 py-2 bg-muted/10 h-1">
                  <motion.div 
                    key={currentScene}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 4.5, ease: "linear" }}
                    className={`h-full ${scenes[currentScene].color} opacity-40`}
                  />
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-indigo-500/10 blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-rose-500/10 blur-3xl" />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
