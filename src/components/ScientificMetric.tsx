"use client";

import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScientificMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  description?: string;
  className?: string;
  trend?: {
    value: string | number;
    isPositive?: boolean;
  };
}

export function ScientificMetric({
  label,
  value,
  unit,
  icon,
  description,
  className,
  trend,
}: ScientificMetricProps) {
  return (
    <Card className={cn("overflow-hidden border-indigo-50 shadow-sm hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          {icon && <div className="text-indigo-400">{icon}</div>}
        </div>
        <div className="flex flex-baseline items-baseline gap-1">
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900">{value}</h3>
          {unit && <span className="text-sm font-medium text-slate-500">{unit}</span>}
        </div>
        {description && <p className="text-xs text-slate-400 mt-1">{description}</p>}
        {trend && (
          <div className={cn("inline-flex items-center text-xs font-medium mt-2", trend.isPositive ? "text-emerald-600" : "text-amber-600")}>
             {trend.value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
