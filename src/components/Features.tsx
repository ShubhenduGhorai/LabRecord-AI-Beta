"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, LineChart, FileText, BrainCircuit, FileType2, Database } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "AI Data Analysis",
      description: "Automatically calculate mean, standard deviation, regression, and experimental error.",
      icon: Calculator,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Graph Generator",
      description: "Generate professional graphs from raw CSV or Excel data.",
      icon: LineChart,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "AI Lab Report Writer",
      description: "Instantly generate aim, theory, procedure, calculations, and conclusion.",
      icon: FileText,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Viva Preparation",
      description: "Get AI-generated viva questions based on your experiment results.",
      icon: BrainCircuit,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      title: "Research Paper Formatting",
      description: "Export reports in IEEE / academic formatting.",
      icon: FileType2,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Cloud Storage",
      description: "Save and organize all your lab records in one dashboard.",
      icon: Database,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            Everything You Need for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">Perfect Lab Reports</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our AI-powered platform gives you all the tools required to analyze your lab data and draft comprehensive reports in minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-border/50 hover:border-indigo-500/30 hover:shadow-lg transition-all duration-300 bg-background/50 backdrop-blur-sm">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bg}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
