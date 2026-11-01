"use client";

import { useState } from "react";
import { Slider, Progress, Badge, Button, Card } from "@celebrai/ui";
import type { BudgetVector } from "@celebrai/schemas";
import { formatINR } from "@/lib/stream-parser";
import { useBudget } from "@/hooks/use-budget";
import { Sparkles, RefreshCw } from "lucide-react";

interface BudgetGridProps {
  initialBudget: BudgetVector;
}

export function BudgetGrid({ initialBudget }: BudgetGridProps) {
  const { budget, variance, isLoading, error, rebalance } = useBudget(initialBudget);
  const [aiRequest, setAiRequest] = useState("");

  if (!budget) return null;

  const total = budget.lineItems.reduce((s, i) => s + i.estimatedAmount, 0);

  return (
    <div className="space-y-6">
      {/* Total Summary */}
      <Card variant="elevated" className="bg-gradient-to-r from-violet-600 to-violet-700 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-violet-200">Total Event Budget</p>
            <p className="text-3xl font-bold">{formatINR(budget.totalBudget, budget.currency)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-violet-200">Allocated</p>
            <p className="text-xl font-semibold">{formatINR(total, budget.currency)}</p>
          </div>
        </div>
        <Progress
          value={total}
          max={budget.totalBudget}
          color="violet"
          size="sm"
          className="mt-4 [&_.bg-violet-600]:bg-white/40 [&_.bg-slate-200]:bg-white/20"
        />
      </Card>

      {/* AI Rebalancing Input */}
      <Card>
        <div className="flex gap-3">
          <input
            type="text"
            value={aiRequest}
            onChange={(e) => setAiRequest(e.target.value)}
            placeholder="e.g. Reduce catering by 10% and add more to florals…"
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100"
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
            size="md"
          >
            <Sparkles className="h-4 w-4" />
            Rebalance
          </Button>
        </div>
        {error && (
          <p className="mt-2 text-sm text-rose-600">{error}</p>
        )}
      </Card>

      {/* Line Items Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {budget.lineItems.map((item) => {
          const varianceItem = variance?.adjustedLineItems.find(
            (v) => v.id === item.id
          );
          const hasDelta = varianceItem && varianceItem.delta !== 0;

          return (
            <Card key={item.id} variant="bordered" className="relative">
              {item.locked && (
                <Badge variant="neutral" className="absolute right-4 top-4">
                  Locked
                </Badge>
              )}
              <div className="mb-3 flex items-start gap-3">
                <div className="flex-1">
                  <p className="font-medium capitalize text-slate-800">
                    {item.category}
                  </p>
                  <p className="text-sm text-slate-500">{item.label}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-semibold text-slate-900">
                    {formatINR(item.estimatedAmount, item.currency)}
                  </p>
                  {hasDelta && varianceItem && (
                    <p
                      className={`text-xs font-medium ${
                        varianceItem.delta < 0 ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {varianceItem.delta > 0 ? "+" : ""}
                      {formatINR(varianceItem.delta, item.currency)}
                    </p>
                  )}
                </div>
              </div>
              <Progress
                value={item.estimatedAmount}
                max={budget.totalBudget}
                color={
                  item.category === "venue"
                    ? "violet"
                    : item.category === "catering"
                    ? "emerald"
                    : "amber"
                }
                size="sm"
                showPercent
              />
              {hasDelta && varianceItem?.rationale && (
                <p className="mt-2 text-xs text-slate-500 italic">
                  {varianceItem.rationale}
                </p>
              )}
            </Card>
          );
        })}
      </div>

      {/* Savings Opportunities */}
      {variance?.savingsOpportunities && variance.savingsOpportunities.length > 0 && (
        <Card className="border-emerald-200 bg-emerald-50">
          <div className="flex items-center gap-2 mb-3">
            <RefreshCw className="h-4 w-4 text-emerald-600" />
            <p className="font-semibold text-emerald-800">Savings Opportunities</p>
          </div>
          <ul className="space-y-1.5">
            {variance.savingsOpportunities.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-emerald-700">
                <span className="mt-0.5 text-emerald-500">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
