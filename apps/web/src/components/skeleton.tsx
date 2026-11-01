import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-700/50",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-8 w-full rounded-lg" />
      <div className="pt-2 flex gap-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
}

export function BudgetGridSkeleton() {
  return (
    <div className="space-y-6">
      {/* Banner Skeleton */}
      <div className="rounded-xl bg-slate-200 p-6 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-48 bg-slate-300" />
          <Skeleton className="h-6 w-32 bg-slate-300" />
        </div>
        <Skeleton className="h-3 w-full rounded-full bg-slate-300" />
      </div>

      {/* Input box Skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 flex gap-3">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-28 rounded-lg" />
      </div>

      {/* Grid of category cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export function TimelineGanttSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-64 rounded-lg" />
      </div>
      <div className="relative border-l-2 border-slate-200 ml-4 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative pl-6">
            <div className="absolute -left-3 top-2 h-5 w-5 rounded-full bg-slate-300 animate-pulse" />
            <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function EventsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-44" />
        <Skeleton className="h-10 w-36 rounded-xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full rounded-xl" />
            <div className="flex justify-between pt-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
