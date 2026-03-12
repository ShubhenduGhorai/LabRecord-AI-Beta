"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Calculator, 
  BarChart3, 
  FileText, 
  MessageSquare, 
  BookOpen,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";

const TOOLS = [
  { name: "Data Analysis", href: "/tools/data-analysis", icon: Calculator },
  { name: "Graph Studio", href: "/tools/graph-generator", icon: BarChart3 },
  { name: "Report Writer", href: "/tools/lab-report", icon: FileText },
  { name: "Viva Prep", href: "/tools/viva-prep", icon: MessageSquare },
  { name: "Academic Formatting", href: "/tools/research-format", icon: BookOpen },
];

export function ToolNavigation() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-30 overflow-x-auto no-scrollbar">
      <div className="max-w-6xl mx-auto px-4 flex items-center h-16 gap-8">
        <div className="flex items-center gap-2 shrink-0 pr-4 border-r border-slate-100">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          <span className="text-xs font-black uppercase tracking-widest text-slate-900">Lab Suite</span>
        </div>
        
        <nav className="flex items-center gap-1">
          {TOOLS.map((tool) => {
            const isActive = pathname === tool.href;
            return (
              <Link key={tool.href} href={tool.href} className="relative group px-4 h-16 flex items-center shrink-0">
                <div className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-all",
                  isActive ? "text-indigo-600" : "text-slate-500 group-hover:text-slate-900"
                )}>
                  <tool.icon className={cn("h-4 w-4", isActive ? "text-indigo-600" : "text-slate-400")} />
                  <span className="whitespace-nowrap">{tool.name}</span>
                </div>
                {isActive && (
                  <motion.div 
                    layoutId="tool-nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
