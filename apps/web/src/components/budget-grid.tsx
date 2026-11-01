"use client";

import { useState } from "react";
import { Slider, Progress, Badge, Button, Card } from "@celebrai/ui";
import type { BudgetVector } from "@celebrai/schemas";
import { formatINR } from "@/lib/stream-parser";
import { useBudget } from "@/hooks/use-budget";
import { useEventStore } from "@/lib/store/event-store";
import { Sparkles, RefreshCw, Lock, Unlock, TrendingDown, TrendingUp, Info } from "lucide-react";

interface BudgetGridProps {
  initialBudget: BudgetVector;
}

const QUICK_SUGGESTIONS = [
  "Cut catering by 10% for local counters",
  "Add ₹1.5L to florals & stage lighting",
  "Shift ₹2L into contingency reserve",
  "Optimize entertainment for 10 PM curfew",
];

export function BudgetGrid({ initialBudget }: BudgetGridProps) {
  const { budget: hookBudget, variance, isLoading, error, rebalance } = useBudget(initialBudget);
  const storeBudget = useEventStore((s) => s.budget);
  const toggleLockLineItem = useEventStore((s) => s.toggleLockLineItem);
  const updateBudgetLineItem = useEventStore((s) => s.updateBudgetLineItemOptimistic);

  const [aiRequest, setAiRequest] = useState("");

  const budget = storeBudget || hookBudget;
  if (!budget) return null;

  const total = budget.lineItems.reduce((s, i) => s + i.estimatedAmount, 0);
  const isBalanced = total === budget.totalBudget;

  const handleSliderChange = (itemId: string, newAmount: number) => {
    updateBudgetLineItem(itemId, newAmount);
  };

  return (
    <div className="space-y-6">
      {/* Total Summary Card */}
      <Card variant="elevated" className="bg-gradient-to-r from-violet-600 via-indigo-600 to-violet-800 text-white shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-violet-200 font-semibold">
                Dynamic Budget Allocation (Engine 1)
              </span>
              <span className="rounded bg-white/20 px-2 py-0.5 text-[10px] font-mono font-bold text-white">
                {isBalanced ? "100% Conserved" : "Rebalancing..."}
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold mt-1 tracking-tight">
              {formatINR(budget.totalBudget, budget.currency)}
            </p>
          </div>

          <div className="flex items-baseline sm:flex-col sm:items-end justify-between border-t border-white/10 sm:border-t-0 pt-2 sm:pt-0">
            <span className="text-xs text-violet-200">Total Allocated Sum</span>
            <span className="text-xl sm:text-2xl font-bold font-mono">
              {formatINR(total, budget.currency)}
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-xs text-violet-200">
            <span>Mathematical Invariant: &sum; B_i = B_total</span>
            <span>{Math.round((total / budget.totalBudget) * 100)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full bg-emerald-400 transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((total / budget.totalBudget) * 100))}%` }}
            />
          </div>
        </div>
      </Card>

      {/* AI Rebalancing Input Card */}
      <Card variant="bordered" className="bg-white p-4 space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <span>Natural Language Budget Advisor</span>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={aiRequest}
            onChange={(e) => setAiRequest(e.target.value)}
            placeholder="e.g. Cut catering by 10% and allocate to florals..."
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
            onKeyDown={(e) => {
              if (e.key === "Enter" && aiRequest.trim()) {
                void rebalance(aiRequest.trim());
              }
            }}
          />
          <Button
            onClick={() => void rebalance(aiRequest.trim())}
            isLoading={isLoading}
            disabled={!aiRequest.trim()}
            className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5 shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            Rebalance
          </Button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-slate-400 mr-1">Try:</span>
          {QUICK_SUGGESTIONS.map((chip, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setAiRequest(chip);
                void rebalance(chip);
              }}
              className="rounded-full bg-slate-50 border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-all"
            >
              {chip}
            </button>
          ))}
        </div>

        {error && <p className="text-xs text-rose-600">{error}</p>}
      </Card>

      {/* Line Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {budget.lineItems.map((item) => {
          const varianceItem = variance?.adjustedLineItems.find((v) => v.id === item.id);
          const hasDelta = varianceItem && varianceItem.delta !== 0;
          const percentage = Math.round((item.estimatedAmount / budget.totalBudget) * 100);

          return (
            <Card key={item.id} variant="bordered" className="bg-white p-4 space-y-3 relative group hover:border-slate-300 transition-all">
              {/* Category Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold capitalize text-slate-800 text-sm">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLockLineItem(item.id)}
                      className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
                        item.locked
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                      title={item.locked ? "Locked: $S_i = 0$ (Cannot be modified)" : "Click to lock this category"}
                    >
                      {item.locked ? (
                        <>
                          <Lock className="h-3 w-3 text-amber-600" />
                          <span>Locked</span>
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3 w-3 text-slate-400" />
                          <span>Unlocked</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{item.label}</p>
                </div>

                <div className="text-right shrink-0">
                  <p className="font-mono font-bold text-slate-900 text-base">
                    {formatINR(item.estimatedAmount, item.currency)}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {percentage}% of total
                  </p>
                </div>
              </div>

              {/* Interactive Rebalance Slider */}
              {!item.locked && (
                <div className="space-y-1 pt-1">
                  <input
                    type="range"
                    min={0}
                    max={Math.round(budget.totalBudget * 0.7)}
                    step={10000}
                    value={item.estimatedAmount}
                    onChange={(e) => handleSliderChange(item.id, Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Progress Bar Visual */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full transition-all duration-200 ${
                    item.category === "venue"
                      ? "bg-violet-600"
                      : item.category === "catering"
                      ? "bg-emerald-600"
                      : item.category === "decor"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(100, percentage)}%` }}
                />
              </div>

              {/* Notes or Variance Information */}
              {hasDelta && varianceItem && (
                <div
                  className={`flex items-start gap-1.5 rounded-lg p-2 text-xs ${
                    varianceItem.delta < 0
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-rose-50 text-rose-800"
                  }`}
                >
                  {varianceItem.delta < 0 ? (
                    <TrendingDown className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <TrendingUp className="h-3.5 w-3.5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5 flex-1">
                    <p className="font-semibold">
                      {varianceItem.delta > 0 ? "+" : ""}
                      {formatINR(varianceItem.delta, item.currency)} ({varianceItem.deltaPercent}%)
                    </p>
                    {varianceItem.rationale && (
                      <p className="text-[11px] opacity-90">{varianceItem.rationale}</p>
                    )}
                  </div>
                </div>
              )}

              {item.notes && !hasDelta && (
                <p className="text-[11px] text-slate-500 italic truncate">{item.notes}</p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Savings Opportunities Box */}
      {variance?.savingsOpportunities && variance.savingsOpportunities.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw className="h-4 w-4 text-emerald-600" />
            <p className="font-semibold text-emerald-900 text-sm">
              AI Identified Savings Opportunities
            </p>
          </div>
          <ul className="space-y-1.5 text-xs text-emerald-800">
            {variance.savingsOpportunities.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">&bull;</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
