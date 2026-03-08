"use client";

import { motion } from "framer-motion";
import { UploadCloud, Sparkles, Download } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Upload Experiment Data",
      description: "Upload CSV or Excel files from your lab experiment.",
      icon: UploadCloud,
    },
    {
      num: "02",
      title: "AI Analysis",
      description: "Our AI performs statistical analysis and generates graphs.",
      icon: Sparkles,
    },
    {
      num: "03",
      title: "Download Report",
      description: "Export a fully formatted lab report PDF instantly.",
      icon: Download,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/30 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            From Raw Data to Complete Report in <span className="text-indigo-600">3 Steps</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-[50px] left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>

          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-background border-4 border-indigo-50 shadow-xl flex items-center justify-center mb-8 relative">
                <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold border-2 border-background">
                  {step.num}
                </span>
                <step.icon className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
