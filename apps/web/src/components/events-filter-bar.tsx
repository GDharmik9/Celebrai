"use client";

import React from "react";
import { Search } from "lucide-react";

interface EventsFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  filterType: string;
  onFilterChange: (type: string) => void;
}

const EVENT_TYPES = ["all", "wedding", "conference", "birthday"] as const;

export function EventsFilterBar({
  search,
  onSearchChange,
  filterType,
  onFilterChange,
}: EventsFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative max-w-md flex-1">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by event name or city..."
          className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-4 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {EVENT_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
              filterType === type
                ? "bg-violet-600 text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
            }`}
          >
            {type}
          </button>
        ))}
      </div>
    </div>
  );
}

