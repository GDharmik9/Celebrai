"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useEventStore } from "@/lib/store/event-store";
import { Card, Button } from "@celebrai/ui";
import { CalendarDays, PlusCircle } from "lucide-react";
import { EventCard } from "@/components/event-card";
import { EventsKpiSummary } from "@/components/events-kpi-summary";
import { EventsFilterBar } from "@/components/events-filter-bar";

export default function EventsDashboardPage() {
  const { events, budget } = useEventStore();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchesSearch =
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.location.city.toLowerCase().includes(search.toLowerCase());
      const matchesType = filterType === "all" || e.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [events, search, filterType]);

  const totalGuests = useMemo(
    () => events.reduce((sum, e) => sum + e.guestCount, 0),
    [events]
  );

  return (
    <div className="animate-fade-in mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            My Events Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your AI-orchestrated celebrations, budgets, and DAG timelines.
          </p>
        </div>

        <Link href="/events/new">
          <Button className="gap-2 bg-violet-600 text-white shadow-sm hover:bg-violet-700">
            <PlusCircle className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <EventsKpiSummary
        eventsCount={events.length}
        totalBudget={budget?.totalBudget ?? 8500000}
        totalGuests={totalGuests}
      />

      {/* Search and Filters Bar */}
      <EventsFilterBar
        search={search}
        onSearchChange={setSearch}
        filterType={filterType}
        onFilterChange={setFilterType}
      />

      {/* Events Grid or Empty State */}
      {filteredEvents.length === 0 ? (
        <Card className="space-y-4 py-16 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <CalendarDays className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or create a new celebration.
            </p>
          </div>
          <Link href="/events/new">
            <Button size="sm" className="gap-1.5">
              <PlusCircle className="h-4 w-4" />
              Create First Event
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((evt) => (
            <EventCard key={evt.id} event={evt} />
          ))}
        </div>
      )}
    </div>
  );
}
