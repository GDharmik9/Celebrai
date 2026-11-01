"use client";

import React from "react";
import { Card } from "@celebrai/ui";
import { formatINR } from "@/lib/stream-parser";

interface EventsKpiSummaryProps {
  eventsCount: number;
  totalBudget: number;
  totalGuests: number;
}

export function EventsKpiSummary({
  eventsCount,
  totalBudget,
  totalGuests,
}: EventsKpiSummaryProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card variant="bordered">
        <p className="text-xs font-semibold uppercase text-slate-500">Active Celebrations</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">{eventsCount}</p>
        <p className="mt-1 text-xs text-slate-400">Across major destinations</p>
      </Card>

      <Card variant="bordered">
        <p className="text-xs font-semibold uppercase text-slate-500">Total Portfolio Value</p>
        <p className="mt-1 text-2xl font-bold text-violet-700">
          {formatINR(totalBudget)}
        </p>
        <p className="mt-1 text-xs text-emerald-600">Active budget ceiling</p>
      </Card>

      <Card variant="bordered">
        <p className="text-xs font-semibold uppercase text-slate-500">Planned Headcount</p>
        <p className="mt-1 text-2xl font-bold text-slate-900">
          {totalGuests.toLocaleString()}
        </p>
        <p className="mt-1 text-xs text-slate-400">Total confirmed & invitees</p>
      </Card>

      <Card variant="bordered">
        <p className="text-xs font-semibold uppercase text-slate-500">AI Engines Status</p>
        <div className="mt-2 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-sm font-semibold text-slate-800">4 Engines Active</span>
        </div>
        <p className="mt-1 text-xs text-slate-400">Gemini Argon & Flash synchronized</p>
      </Card>
    </div>
  );
}

