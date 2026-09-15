"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      quote: "This saved me hours of lab report formatting every week. I just upload my physics data and it builds the entire report.",
      name: "Alex R.",
      role: "Physics Student",
      initial: "A"
    },
    {
      quote: "The graph generator alone is worth it. Getting those error bars right used to take me forever in Excel.",
      name: "Sarah M.",
      role: "Engineering Major",
      initial: "S"
    },
    {
      quote: "Perfect for engineering students preparing lab submissions. The generated conclusions actually make sense based on the data.",
      name: "David K.",
      role: "Mechanical Engineering",
      initial: "D"
    }
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
            What Students Are Saying
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full bg-muted/20 border-border/50 hover:bg-muted/40 transition-colors">
                <CardContent className="p-8">
                  <div className="flex gap-1 mb-6 text-yellow-500">
                    {[1, 2, 3, 4, 5].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-lg text-foreground mb-8 relative italic">
                    <span className="text-4xl text-indigo-200 absolute -top-4 -left-2">"</span>
                    {testimonial.quote}
                  </p>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.initial}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
