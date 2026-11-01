"use client";

import React, { useMemo } from "react";
import { Badge, Button, Card } from "@celebrai/ui";
import type { TimelineDAG, Milestone, MilestonePriority } from "@celebrai/schemas";
import { useEventStore, type HorizonFilter } from "@/lib/store/event-store";
import { formatDate } from "@/lib/stream-parser";
import { CheckCircle2, Circle, AlertTriangle, Calendar, Clock } from "lucide-react";

const PRIORITY_BADGES: Record<MilestonePriority, "danger" | "warning" | "default" | "neutral"> = {
  critical: "danger",
  high: "warning",
  medium: "default",
  low: "neutral",
};

interface TimelineGanttProps {
  timeline: TimelineDAG;
}

export function TimelineGantt({ timeline }: TimelineGanttProps) {
  const activeHorizon = useEventStore((s) => s.activeHorizon);
  const setActiveHorizon = useEventStore((s) => s.setActiveHorizon);
  const toggleMilestone = useEventStore((s) => s.toggleMilestoneOptimistic);

  // Group milestones by Operational Horizon relative to eventDate
  const categorizedMilestones = useMemo(() => {
    const eventTime = new Date(timeline.eventDate).getTime();
    const dayMs = 24 * 60 * 60 * 1000;

    return timeline.milestones.map((m) => {
      const dueTime = new Date(m.dueDate).getTime();
      const diffDays = Math.round((eventTime - dueTime) / dayMs);

      let horizon: HorizonFilter = "operational";
      if (diffDays >= 60) {
        horizon = "strategic"; // T-2 months or more
      } else if (diffDays <= 1) {
        horizon = "day-of"; // T-24h to T+4h
      } else {
        horizon = "operational"; // T-1m to T-1w
      }

      const isCritical = timeline.criticalPath?.includes(m.id) ?? false;

      return {
        ...m,
        horizon,
        diffDays,
        isCritical,
      };
    });
  }, [timeline]);

  const filteredMilestones = useMemo(() => {
    if (activeHorizon === "all") return categorizedMilestones;
    return categorizedMilestones.filter((m) => m.horizon === activeHorizon);
  }, [categorizedMilestones, activeHorizon]);

  const completedCount = timeline.milestones.filter((m) => m.completed).length;
  const totalCount = timeline.milestones.length;

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Event Execution DAG</h2>
          <p className="text-sm text-slate-500">
            {completedCount} of {totalCount} milestones completed · Event date:{" "}
            {formatDate(timeline.eventDate)}
          </p>
        </div>

        {/* Horizon Filter Tabs */}
        <div className="inline-flex rounded-lg bg-slate-100 p-1">
          {(["all", "strategic", "operational", "day-of"] as const).map((h) => (
            <button
              key={h}
              onClick={() => setActiveHorizon(h)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
                activeHorizon === h
                  ? "bg-white text-violet-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {h.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Gantt Timeline Feed */}
      <div className="relative border-l-2 border-slate-200 ml-4 space-y-4">
        {filteredMilestones.map((m) => (
          <div key={m.id} className="relative pl-6">
            {/* DAG Node Bullet */}
            <button
              onClick={() => toggleMilestone(m.id)}
              className="absolute -left-3 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-white transition-transform hover:scale-110"
              title={m.completed ? "Mark incomplete" : "Mark complete"}
            >
              {m.completed ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-50" />
              ) : (
                <Circle className="h-5 w-5 text-slate-400 hover:text-violet-600" />
              )}
            </button>

            {/* Milestone Card */}
            <Card
              variant="bordered"
              className={`transition-all ${
                m.completed
                  ? "opacity-60 bg-slate-50"
                  : m.isCritical
                  ? "border-rose-300 ring-1 ring-rose-300/40 bg-white"
                  : "hover:border-violet-300 bg-white"
              }`}
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${
                        m.completed ? "line-through text-slate-500" : "text-slate-900"
                      }`}
                    >
                      {m.title}
                    </span>
                    <Badge variant={PRIORITY_BADGES[m.priority]}>
                      {m.priority}
                    </Badge>
                    {m.isCritical && (
                      <Badge variant="danger" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Critical Path
                      </Badge>
                    )}
                  </div>
                  {m.description && (
                    <p className="text-xs text-slate-500">{m.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <div className="flex items-center gap-1 font-mono">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formatDate(m.dueDate)}</span>
                  </div>
                  <span className="capitalize rounded bg-slate-100 px-2 py-0.5 text-slate-600">
                    {m.horizon}
                  </span>
                </div>
              </div>

              {m.dependsOn.length > 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 border-t border-slate-100 pt-2">
                  <span className="font-medium text-slate-600">Prerequisites:</span>
                  <span className="font-mono text-slate-400">
                    {m.dependsOn.length} linked milestone(s)
                  </span>
                </div>
              )}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

