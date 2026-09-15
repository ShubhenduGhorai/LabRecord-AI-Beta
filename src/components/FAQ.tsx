"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    {
      question: "Is this allowed by universities?",
      answer: "LabRecord AI is designed as a productivity tool, much like a calculator or spell-checker. It performs the tedious formatting, plotting, and statistical analysis for you based entirely on your provided data. However, you should always review your university's specific academic integrity policies regarding AI writing assistance."
    },
    {
      question: "Can I upload Excel files?",
      answer: "Yes! We support CSV, XLSX, and XLS formats. You can also paste tabular data directly from a spreadsheet into the dashboard."
    },
    {
      question: "Does it work for physics and chemistry experiments?",
      answer: "Absolutely. LabRecord AI is specifically tuned for engineering and hard sciences. It understands common formulas, units, and standard experiment procedures for physics, chemistry, and various engineering disciplines."
    },
    {
      question: "Can I edit the generated report?",
      answer: "Yes, every generated report comes with a built-in rich text editor. You can tweak the graphs, rewrite conclusions, or adjust formulas before exporting the final PDF or Word document."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-muted/30 border-y border-border/50">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about LabRecord AI.
            </p>
          </div>

          <div className="bg-background rounded-2xl border p-6 md:p-8 shadow-sm">
            <Accordion className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border-b-0 mb-4 last:mb-0">
                  <AccordionTrigger className="hover:no-underline hover:text-indigo-600 transition-colors text-left text-[17px] font-semibold bg-muted/40 px-4 rounded-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pt-4 pb-2 text-muted-foreground leading-relaxed text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
