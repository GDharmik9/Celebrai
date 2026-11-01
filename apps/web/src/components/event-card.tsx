"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import type { Event } from "@celebrai/schemas";
import { formatDate, formatINR } from "@/lib/stream-parser";
import { useEventStore } from "@/lib/store/event-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Button,
  Progress,
} from "@celebrai/ui";
import {
  MapPin,
  Users,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
  GitBranch,
  CheckCircle2,
  Wallet,
} from "lucide-react";

interface EventCardProps {
  event: Event;
}

const TYPE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  wedding: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  corporate: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  conference: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  birthday: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  anniversary: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  gala: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  engagement: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  "product-launch": { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  festival: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
};

function getDaysRemaining(dateString: string): { label: string; isPast: boolean; isToday: boolean } {
  try {
    const target = new Date(dateString);
    const now = new Date();
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { label: `${Math.abs(diffDays)}d ago`, isPast: true, isToday: false };
    } else if (diffDays === 0) {
      return { label: "Today", isPast: false, isToday: true };
    } else {
      return { label: `${diffDays} days left`, isPast: false, isToday: false };
    }
  } catch {
    return { label: "Upcoming", isPast: false, isToday: false };
  }
}

export function EventCard({ event }: EventCardProps) {
  const { event: activeEvent, setEvent, budget, timeline } = useEventStore();
  const isActive = activeEvent?.id === event.id;

  const countdown = useMemo(() => getDaysRemaining(event.date), [event.date]);

  const typeStyle = TYPE_STYLES[event.type] ?? {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  };

  // Milestone completion metric
  const milestoneProgress = useMemo(() => {
    if (isActive && timeline && timeline.milestones.length > 0) {
      const completed = timeline.milestones.filter((m) => m.completed).length;
      const total = timeline.milestones.length;
      const pct = Math.round((completed / total) * 100);
      return { completed, total, pct };
    }
    return null;
  }, [isActive, timeline]);

  const handleSelectEvent = () => {
    setEvent(event);
  };

  return (
    <Card
      variant="bordered"
      className={`group relative flex flex-col justify-between overflow-hidden bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${
        isActive
          ? "border-violet-400 ring-2 ring-violet-500/10 shadow-md"
          : "hover:border-violet-300"
      }`}
    >
      {/* Top Banner Accent */}
      <div
        className={`h-1.5 w-full ${
          isActive
            ? "bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500"
            : "bg-slate-100 group-hover:bg-violet-200 transition-colors"
        }`}
      />

      <CardHeader className="flex flex-col gap-3 space-y-0 pb-3">
        {/* Badges Row */}
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold capitalize transition-colors ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
            >
              {event.type.replace("-", " ")}
            </span>

            {isActive && (
              <Badge variant="success" className="gap-1 text-[10px] font-medium tracking-wide">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                ACTIVE
              </Badge>
            )}
          </div>

          {/* Countdown Pill */}
          <div
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${
              countdown.isPast
                ? "bg-slate-100 text-slate-500"
                : countdown.isToday
                ? "bg-rose-100 text-rose-700 animate-pulse"
                : "bg-violet-50 text-violet-700"
            }`}
          >
            <Clock className="h-3 w-3" />
            <span>{countdown.label}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-1">
          <Link
            href={`/events/${event.id}`}
            onClick={handleSelectEvent}
            className="block"
          >
            <CardTitle className="line-clamp-1 text-lg font-bold text-slate-900 transition-colors group-hover:text-violet-700">
              {event.name}
            </CardTitle>
          </Link>
          {event.description && (
            <CardDescription className="line-clamp-2 text-xs leading-relaxed text-slate-500">
              {event.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Event Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50/80 p-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate font-medium text-slate-700">
              {formatDate(event.date)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate">
              <span className="font-semibold text-slate-800">
                {event.guestCount.toLocaleString()}
              </span>{" "}
              guests
            </span>
          </div>

          <div className="col-span-2 flex items-center gap-2 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="truncate" title={`${event.location.venue ? event.location.venue + ", " : ""}${event.location.city}`}>
              {event.location.venue ? `${event.location.venue}, ` : ""}
              <span className="font-medium text-slate-700">{event.location.city}</span>
            </span>
          </div>
        </div>

        {/* Active Workspace State Progress (Budget & DAG Milestones) */}
        {isActive && milestoneProgress ? (
          <div className="space-y-1.5 rounded-lg border border-violet-100 bg-violet-50/40 p-2.5 text-xs">
            <div className="flex items-center justify-between font-medium text-violet-900">
              <span className="flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-violet-600" />
                DAG Milestones
              </span>
              <span className="font-mono text-[11px] text-violet-700">
                {milestoneProgress.completed}/{milestoneProgress.total} ({milestoneProgress.pct}%)
              </span>
            </div>
            <Progress value={milestoneProgress.pct} className="h-1.5 bg-violet-100" />
            {budget && (
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span className="flex items-center gap-1">
                  <Wallet className="h-3 w-3 text-slate-400" />
                  Budget Allocated
                </span>
                <span className="font-mono font-semibold text-slate-700">
                  {formatINR(budget.totalBudget)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/50 px-2.5 py-2 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-slate-600">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              AI Planning Horizon
            </span>
            <span className="font-medium text-slate-700">3 Horizons Ready</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-2 border-t border-slate-100 bg-slate-50/30 p-3 pt-3">
        <Link
          href={`/events/${event.id}?tab=timeline`}
          onClick={handleSelectEvent}
          className="flex-1"
        >
          <Button
            variant="secondary"
            size="sm"
            className="w-full gap-1 text-xs font-medium text-slate-700 hover:border-violet-300 hover:text-violet-800"
          >
            <GitBranch className="h-3.5 w-3.5" />
            DAG
          </Button>
        </Link>
        <Link
          href={`/events/${event.id}?tab=budget`}
          onClick={handleSelectEvent}
          className="flex-1"
        >
          <Button
            size="sm"
            className="w-full gap-1 bg-violet-600 text-xs font-medium text-white shadow-sm hover:bg-violet-700"
          >
            Manage <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
