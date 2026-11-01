import React from "react";
import { cn } from "../lib/utils.js";

interface ProgressProps {
  value: number;
  max?: number;
  label?: string;
  showPercent?: boolean;
  color?: "violet" | "emerald" | "amber" | "rose";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const COLOR_MAP = {
  violet: "bg-violet-600",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
  rose: "bg-rose-500",
} as const;

const SIZE_MAP = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
} as const;

export function Progress({
  value,
  max = 100,
  label,
  showPercent = false,
  color = "violet",
  size = "md",
  className,
}: ProgressProps) {
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between text-sm">
          {label && <span className="text-slate-600">{label}</span>}
          {showPercent && (
            <span className="font-mono text-xs text-slate-500">
              {percent.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn("w-full overflow-hidden rounded-full bg-slate-200", SIZE_MAP[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            COLOR_MAP[color]
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
