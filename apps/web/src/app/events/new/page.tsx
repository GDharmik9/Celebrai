"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useSearchParams, useParams } from "next/navigation";
import { useEventStore, type HorizonFilter } from "@/lib/store/event-store";
import { formatINR, formatDate } from "@/lib/stream-parser";
import { BudgetGrid } from "@/components/budget-grid";
import { TimelineGantt } from "@/components/timeline-gantt";
import { VendorCard } from "@/components/vendor-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge, Button } from "@celebrai/ui";
import {
  CalendarDays,
  DollarSign,
  Store,
  Sparkles,
  FileDown,
  MessageSquare,
  Send,
  Download,
  AlertCircle,
  Palette,
  Check,
  RefreshCw,
} from "lucide-react";
import { BudgetGridSkeleton, TimelineGanttSkeleton } from "@/components/skeleton";

type TabKey = "timeline" | "budget" | "vendors" | "concept" | "chat";

function EventPlanningWorkspaceContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const eventId = (params?.["id"] as string | undefined);
  const initialTab = (searchParams.get("tab") as TabKey) || "budget";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);

  const {
    event,
    events,
    setEvent,
    budget,
    timeline,
    rfps,
    concept,
    toggleChecklistItemOptimistic,
    loadDemoData,
  } = useEventStore();

  const [pdfLoading, setPdfLoading] = useState<string | null>(null);

  // Chat Assistant State
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([
    {
      role: "assistant",
      content:
        "Namaste! I'm your CelebrAI orchestrator. I can help you rebalance vendor budgets, calculate DAG milestone critical paths, or design mood concepts for Priya & Rohan's wedding. What would you like to explore?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatStreaming, setIsChatStreaming] = useState(false);

  useEffect(() => {
    const tabParam = searchParams.get("tab") as TabKey;
    if (tabParam && ["timeline", "budget", "vendors", "concept", "chat"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (eventId && events && events.length > 0) {
      const targetEvent = events.find((e) => e.id === eventId);
      if (targetEvent && targetEvent.id !== event?.id) {
        setEvent(targetEvent);
      }
    }
  }, [eventId, events, event?.id, setEvent]);

  // Handle PDF Export
  const handleExportPDF = async (type: "budget" | "run-of-show") => {
    if (!event) return;
    setPdfLoading(type);

    try {
      const payload = {
        type,
        eventName: event.name,
        data: type === "budget" ? budget : timeline,
      };

      const res = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${event.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${type}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export PDF document.");
    } finally {
      setPdfLoading(null);
    }
  };

  // Handle Chat Streaming
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatStreaming) return;

    const userMsg = chatInput.trim();
    const updatedMessages = [...chatMessages, { role: "user" as const, content: userMsg }];
    setChatMessages(updatedMessages);
    setChatInput("");
    setIsChatStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          eventContext: event ? JSON.stringify(event) : undefined,
        }),
      });

      if (!res.ok) throw new Error("Failed to stream chat response");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantResponse = "";

      setChatMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantResponse += chunk;

          setChatMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: assistantResponse,
            };
            return next;
          });
        }
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an issue connecting to Gemini. Please check your API key.",
        },
      ]);
    } finally {
      setIsChatStreaming(false);
    }
  };

  if (!event || !budget || !timeline) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 text-center space-y-4">
        <BudgetGridSkeleton />
      </div>
    );
  }

  const TABS = [
    { key: "budget", label: "Dynamic Budget", icon: DollarSign, badge: formatINR(budget.totalBudget) },
    { key: "timeline", label: "Timeline DAG", icon: CalendarDays, badge: `${timeline.milestones.length} nodes` },
    { key: "vendors", label: "Vendor RFPs", icon: Store, badge: `${rfps.length} active` },
    { key: "concept", label: "Concept Studio", icon: Palette, badge: concept?.primaryStyle ?? "Royal" },
    { key: "chat", label: "AI Orchestrator", icon: MessageSquare, badge: "Gemini 3.8" },
  ] as const;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Event Header Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="capitalize">
              {event.type}
            </Badge>
            <span className="text-xs text-slate-500 font-mono">
              Event Date: {formatDate(event.date)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {event.name}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {event.location.venue}, {event.location.city} · {event.guestCount} Guests Planned
          </p>
        </div>

        {/* Actions: PDF Export & AI Copilot Window */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => {
              const trigger = document.querySelector(
                'button[aria-label="Open AI Copilot Window"]'
              ) as HTMLButtonElement | null;
              trigger?.click();
            }}
            className="gap-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-gold-300 animate-pulse" />
            AI Copilot Window
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportPDF("budget")}
            isLoading={pdfLoading === "budget"}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Budget PDF
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExportPDF("run-of-show")}
            isLoading={pdfLoading === "run-of-show"}
            className="gap-1.5"
          >
            <FileDown className="h-3.5 w-3.5" />
            Run-of-Show PDF
          </Button>
        </div>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabKey)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span
                className={`ml-1 rounded-full px-2 py-0.5 text-[11px] font-mono ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Dynamic Budget Grid */}
      {activeTab === "budget" && (
        <section className="space-y-6">
          <BudgetGrid initialBudget={budget} />
        </section>
      )}

      {/* Tab 2: Timeline DAG */}
      {activeTab === "timeline" && (
        <section className="space-y-6">
          <TimelineGantt timeline={timeline} />
        </section>
      )}

      {/* Tab 3: Vendor RFPs */}
      {activeTab === "vendors" && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Procurement & RFP Pipeline</h2>
              <p className="text-sm text-slate-500">
                3-stage vetting pipeline: Specification Parsing → Quote Audit → Contract Milestones
              </p>
            </div>
            <Badge variant="default">{rfps.length} Tracked RFPs</Badge>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {rfps.map((rfp) => (
              <div key={rfp.id} className="space-y-4">
                <VendorCard rfp={rfp} />
                {/* Interactive Checklist Questions */}
                <Card variant="bordered" className="bg-slate-50/50">
                  <p className="text-xs font-semibold uppercase text-slate-500 mb-3">
                    Deliverable & Contract Checklist ({rfp.checklistItems.length} items)
                  </p>
                  <div className="space-y-2">
                    {rfp.checklistItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleChecklistItemOptimistic(rfp.id, item.id)}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                          item.answered
                            ? "bg-white border-emerald-200 text-slate-700"
                            : "bg-white border-slate-200 text-slate-500 hover:border-violet-300"
                        }`}
                      >
                        <div
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            item.answered
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {item.answered && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <div className="space-y-1 text-xs">
                          <p className={item.answered ? "font-medium text-slate-800" : ""}>
                            {item.question}
                          </p>
                          {item.answer && (
                            <p className="text-emerald-700 font-medium">
                              Response: {item.answer}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 4: Concept Studio */}
      {activeTab === "concept" && concept && (
        <section className="space-y-6">
          <Card variant="bordered" className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="default" className="capitalize">
                  {concept.primaryStyle} Aesthetic
                </Badge>
                <span className="text-xs text-slate-400">
                  Generated {formatDate(concept.generatedAt)}
                </span>
              </div>
              <CardTitle className="text-2xl mt-1">{concept.title}</CardTitle>
              <CardDescription className="text-sm leading-relaxed mt-1">
                {concept.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Color Palette Swatches */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                  Signature Color Palette
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {concept.colorPalette.map((color) => (
                    <div
                      key={color.hex}
                      className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-sm"
                    >
                      <div
                        className="h-14 w-full rounded-lg shadow-inner"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <p className="text-xs font-semibold text-slate-800 truncate">{color.name}</p>
                        <p className="text-[11px] font-mono text-slate-500">{color.hex}</p>
                        <span className="text-[10px] capitalize text-violet-600 font-medium">
                          {color.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mood Keywords */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                  Aesthetic Mood Keywords
                </h4>
                <div className="flex flex-wrap gap-2">
                  {concept.moodKeywords.map((word) => (
                    <span
                      key={word}
                      className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 border border-violet-200"
                    >
                      #{word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floral & Lighting Specs */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-slate-100">
                {concept.florals && (
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-slate-800">Floral Arrangements</p>
                    <p className="text-slate-600">{concept.florals.style}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {concept.florals.flowers.map((fl) => (
                        <Badge key={fl} variant="neutral">
                          {fl}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {concept.lighting && (
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-slate-800">Lighting Architecture</p>
                    <p className="capitalize text-slate-600">
                      Atmosphere: {concept.lighting.mood}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {concept.lighting.types.map((lt) => (
                        <Badge key={lt} variant="neutral">
                          {lt}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      {/* Tab 5: AI Orchestrator Chat */}
      {activeTab === "chat" && (
        <section className="space-y-4">
          <Card variant="bordered" className="bg-white flex flex-col h-[550px]">
            <CardHeader className="border-b border-slate-100 pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">CelebrAI Event Orchestrator</CardTitle>
                    <CardDescription className="text-xs">
                      Powered by Gemini 3.8 Flash Streaming
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="success">Online</Badge>
              </div>
            </CardHeader>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 text-sm ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 leading-relaxed ${
                      msg.role === "user"
                        ? "bg-violet-600 text-white rounded-br-none"
                        : "bg-slate-100 text-slate-800 rounded-bl-none"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-xs sm:text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isChatStreaming && (
                <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                  <Sparkles className="h-3.5 w-3.5 animate-spin text-violet-600" />
                  <span>Gemini is thinking...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="border-t border-slate-100 p-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask CelebrAI to adjust timeline dependencies, audit catering quotes..."
                className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100"
              />
              <Button
                type="submit"
                disabled={!chatInput.trim() || isChatStreaming}
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1.5"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </form>
          </Card>
        </section>
      )}
    </div>
  );
}

export default function EventPlanningWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12">
          <BudgetGridSkeleton />
        </div>
      }
    >
      <EventPlanningWorkspaceContent />
    </Suspense>
  );
}

