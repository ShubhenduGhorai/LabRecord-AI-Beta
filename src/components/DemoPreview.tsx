"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BarChart, Table, FileText, Play } from "lucide-react";

export function DemoPreview() {
  return (
    <section id="demo" className="py-24 bg-background">
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
            <Button size="lg" className="h-14 px-8 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
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
            <div className="bg-muted/30 border rounded-2xl p-4 shadow-xl">
              <div className="bg-background rounded-xl border overflow-hidden shadow-sm">
                
                {/* Demo Mockup Header */}
                <div className="flex items-center gap-2 border-b px-4 py-3 bg-muted/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                  <div className="ml-4 text-xs font-medium text-muted-foreground flex gap-4">
                    <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-1 rounded"><Table className="w-3 h-3"/> Data.csv</span>
                    <span className="flex items-center gap-1"><BarChart className="w-3 h-3"/> Graph Result</span>
                    <span className="flex items-center gap-1"><FileText className="w-3 h-3"/> final_report.pdf</span>
                  </div>
                </div>

                {/* Demo Content Base */}
                <div className="p-6 grid grid-cols-2 gap-6 h-[400px]">
                  {/* Left Column: Data Table Mock */}
                  <div className="border rounded-lg flex flex-col overflow-hidden">
                    <div className="bg-muted px-4 py-2 text-xs font-medium text-foreground border-b">Raw Velocity Data</div>
                    <div className="p-4 space-y-3 flex-1 overflow-hidden">
                      <div className="flex justify-between text-xs text-muted-foreground pb-2 border-b">
                        <span>Time (s)</span><span>Dist (m)</span><span>Err</span>
                      </div>
                      {[1.2, 2.4, 3.6, 4.8].map((val, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{val}</span><span>{(val*2.1).toFixed(2)}</span><span className="text-red-400">±0.05</span>
                        </div>
                      ))}
                      <div className="h-4 bg-muted/40 rounded w-full mt-4"></div>
                      <div className="h-4 bg-muted/40 rounded w-5/6"></div>
                    </div>
                  </div>

                  {/* Right Column: Graph and Report Mock */}
                  <div className="flex flex-col gap-4">
                    <div className="border rounded-lg bg-background p-4 flex-1 relative overflow-hidden flex items-center justify-center">
                       <svg className="w-full h-full text-indigo-500" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <line x1="10" y1="90" x2="90" y2="10" stroke="currentColor" strokeWidth="2" />
                        <circle cx="30" cy="70" r="3" fill="#4f46e5" />
                        <circle cx="50" cy="50" r="3" fill="#4f46e5" />
                        <circle cx="70" cy="30" r="3" fill="#4f46e5" />
                      </svg>
                      <div className="absolute top-2 right-2 text-[10px] bg-white border px-1 rounded text-muted-foreground">y = 2.1x + 0.02</div>
                    </div>
                    <div className="border rounded-lg bg-background p-4 flex-1">
                      <div className="h-3 w-1/3 bg-foreground/20 rounded mb-4"></div>
                      <div className="h-2 w-full bg-muted rounded mb-2"></div>
                      <div className="h-2 w-5/6 bg-muted rounded mb-2"></div>
                      <div className="h-2 w-full bg-muted rounded mb-2"></div>
                      <div className="h-2 w-4/6 bg-muted rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
