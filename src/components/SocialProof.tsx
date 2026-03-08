"use client";

import { motion } from "framer-motion";
import { Atom, Beaker, Cpu, Microscope } from "lucide-react";

export function SocialProof() {
  const faculties = [
    { name: "Engineering", icon: Cpu },
    { name: "Physics", icon: Atom },
    { name: "Chemistry", icon: Beaker },
    { name: "Research Labs", icon: Microscope },
  ];

  return (
    <section className="py-16 md:py-24 bg-muted/30 border-y">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Built for Engineering and Science Students
          </h2>
          <p className="text-lg text-muted-foreground mb-12">
            Thousands of students waste hours formatting lab reports. LabRecord AI automates the entire process.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {faculties.map((faculty, index) => (
              <div key={index} className="flex flex-col items-center justify-center gap-3">
                <faculty.icon className="h-10 w-10 text-indigo-600" />
                <span className="font-semibold text-lg text-foreground/80">{faculty.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
