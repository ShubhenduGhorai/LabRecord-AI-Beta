"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-indigo-600">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-indigo-500 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto py-12 md:py-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white leading-tight">
            Stop Spending Hours on Lab Reports
          </h2>
          <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
            Let AI analyze your experiment data and generate a perfect lab report in seconds. Focus on learning, not formatting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/signup" className="w-full sm:w-auto">
              <Button size="lg" className="h-14 px-8 text-base font-semibold bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-90 w-full shadow-lg shadow-indigo-500/25">
                Start Free
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="h-14 px-8 text-base font-bold w-full border-indigo-300 text-blue hover:bg-white/10 hover:text-white transition-all">
                View Demo
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
