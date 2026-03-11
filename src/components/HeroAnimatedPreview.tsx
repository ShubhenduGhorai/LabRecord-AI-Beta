"use client";

import { motion } from "framer-motion";
import { Calculator, BarChart3, FileText, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";

export function HeroAnimatedPreview() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev >= 6 ? 0 : prev + 1));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="mt-20 relative mx-auto max-w-5xl">
       {/* Floating Labels */}
      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute -left-12 top-20 z-20 bg-background/90 backdrop-blur-sm border shadow-lg rounded-xl p-3 items-center gap-2 hidden md:flex"
      >
        <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><BarChart3 className="w-4 h-4" /></div>
        <span className="text-sm font-semibold text-foreground">Auto Graph Generation</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
        className="absolute -right-8 top-32 z-20 bg-background/90 backdrop-blur-sm border shadow-lg rounded-xl p-3 items-center gap-2 hidden md:flex"
      >
        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Calculator className="w-4 h-4" /></div>
        <span className="text-sm font-semibold text-foreground">Error Calculation</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 2 }}
        className="absolute -left-6 bottom-32 z-20 bg-background/90 backdrop-blur-sm border shadow-lg rounded-xl p-3 items-center gap-2 hidden md:flex"
      >
        <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FileText className="w-4 h-4" /></div>
        <span className="text-sm font-semibold text-foreground">AI Lab Report</span>
      </motion.div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1.5 }}
        className="absolute -right-12 bottom-20 z-20 bg-background/90 backdrop-blur-sm border shadow-lg rounded-xl p-3 items-center gap-2 hidden md:flex"
      >
        <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><GraduationCap className="w-4 h-4" /></div>
        <span className="text-sm font-semibold text-foreground">Viva Questions</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden p-2"
      >
        <div className="rounded-xl overflow-hidden border bg-background flex flex-col md:flex-row h-[400px] md:h-[600px] shadow-sm">
          <div className="w-full md:w-1/3 border-r bg-muted/30 p-4 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded-md w-1/2"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex gap-2">
                    <div className="h-8 bg-background border rounded flex-1 flex items-center px-2">
                       {step >= 1 && (
                         <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-muted-foreground">
                           {i * 1.5}
                         </motion.span>
                       )}
                    </div>
                    <div className="h-8 bg-background border rounded flex-1 flex items-center px-2">
                       {step >= 1 && (
                         <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-muted-foreground">
                           {(i * 2.1 + 0.05).toFixed(2)}
                         </motion.span>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <motion.div 
               animate={{
                 backgroundColor: step === 2 ? '#4f46e5' : 'transparent',
                 color: step === 2 ? '#ffffff' : '#4338ca',
                 borderColor: step === 2 ? '#4f46e5' : '#c7d2fe',
               }}
               className="h-10 border rounded-md flex items-center justify-center text-sm font-medium transition-colors duration-300 bg-indigo-50"
            >
              <Calculator className="h-4 w-4 mr-2" /> 
              {step === 2 ? (
                <span className="flex items-center">
                  Calculating Errors<span className="animate-pulse">...</span>
                </span>
              ) : "Analyze Data"}
            </motion.div>
          </div>
          <div className="w-full md:w-2/3 p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <motion.div 
                animate={{
                  scale: step >= 5 ? 1.05 : 1,
                  boxShadow: step >= 5 ? '0 10px 15px -3px rgba(79, 70, 229, 0.4)' : 'none'
                }}
                className="h-8 px-4 bg-gradient-to-r from-indigo-500 to-blue-500 rounded text-xs text-white flex items-center justify-center font-medium shadow-sm transition-all"
              >
                Export PDF
              </motion.div>
            </div>
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex-1 border rounded-lg bg-indigo-50/30 flex items-center justify-center relative overflow-hidden p-6">
                <svg className="w-full h-full text-indigo-200" preserveAspectRatio="none" viewBox="0 0 100 100">
                  {/* Grid Lines */}
                  <g stroke="currentColor" strokeWidth="0.5" opacity="0.3">
                    {[20,40,60,80].map(l => (
                      <line key={`h${l}`} x1="0" y1={l} x2="100" y2={l} />
                    ))}
                    {[20,40,60,80].map(l => (
                      <line key={`v${l}`} x1={l} y1="0" x2={l} y2="100" />
                    ))}
                  </g>
                  
                  {/* Axis */}
                  <line x1="0" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                  <line x1="0" y1="0" x2="0" y2="100" stroke="currentColor" strokeWidth="1" opacity="0.5" />

                  {/* Line Animation step >=3 */}
                  <motion.path 
                    d="M10,90 L90,10" 
                    fill="none" 
                    stroke="#4f46e5" 
                    strokeWidth="2" 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: step >= 3 ? 1 : 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />

                  {/* Points step >=4 */}
                  {[
                    {cx: 10, cy: 90}, 
                    {cx: 30, cy: 75}, 
                    {cx: 50, cy: 45}, 
                    {cx: 70, cy: 30}, 
                    {cx: 90, cy: 10}
                  ].map((p, i) => (
                    <motion.circle 
                      key={i}
                      cx={p.cx} cy={p.cy} r="2.5" 
                      fill="#4f46e5" 
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: step >= 4 ? 1 : 0, scale: step >= 4 ? 1 : 0 }}
                      transition={{ duration: 0.3, delay: step >= 4 ? i * 0.15 : 0 }}
                    />
                  ))}
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none"></div>
              </div>
              
              <div className="h-32 border rounded-lg p-4 bg-muted/20 flex flex-col justify-center">
                <div className="h-4 w-1/4 bg-muted rounded mb-3"></div>
                <div className="space-y-3">
                  <motion.div 
                    initial={{ width: "0%" }} 
                    animate={{ width: step >= 5 ? "100%" : "0%" }} 
                    transition={{ duration: 0.5 }}
                    className="h-3 bg-muted/60 rounded overflow-hidden"
                  >
                     <div className="h-full bg-muted w-full" />
                  </motion.div>
                  <motion.div 
                    initial={{ width: "0%" }} 
                    animate={{ width: step >= 5 ? "80%" : "0%" }} 
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="h-3 bg-muted/60 rounded overflow-hidden"
                  >
                     <div className="h-full bg-muted w-full" />
                  </motion.div>
                  <motion.div 
                    initial={{ width: "0%" }} 
                    animate={{ width: step >= 5 ? "60%" : "0%" }} 
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="h-3 bg-muted/60 rounded overflow-hidden"
                  >
                     <div className="h-full bg-muted w-full" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
