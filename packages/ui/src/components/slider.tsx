import React from "react";
import { cn } from "../lib/utils.js";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  formatValue?: (value: number) => string;
  disabled?: boolean;
  className?: string;
}

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  label,
  formatValue,
  disabled = false,
  className,
}: SliderProps) {
  const percent = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : String(value);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-700">{label}</span>
          <span className="font-mono text-slate-600">{displayValue}</span>
        </div>
      )}
      <div className="relative h-6 flex items-center">
        {/* Track */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
        {/* Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className={cn(
            "absolute inset-x-0 h-2 w-full cursor-pointer appearance-none rounded-full bg-transparent",
            "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
            "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-violet-600 [&::-webkit-slider-thumb]:shadow-md",
            "[&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
        />
      </div>
    </div>
  );
}
