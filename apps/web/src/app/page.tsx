"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEventStore } from "@/lib/store/event-store";
import { formatINR } from "@/lib/stream-parser";
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Slider,
  Progress,
} from "@celebrai/ui";
import {
  Sparkles,
  ArrowRight,
  GitBranch,
  ShieldCheck,
  Zap,
  Clock,
  FileDown,
  Sliders,
  Music,
  GlassWater,
  Users,
  Check,
  Lock,
  Unlock,
  Palette,
  ChevronRight,
  Play,
  Layers,
  Flame,
  FileText,
  DollarSign,
  Compass,
} from "lucide-react";

// Preset Prompt Suggestions
const PROMPT_PRESETS = [
  {
    label: "👑 Royal Destination Wedding",
    prompt: "3-day royal heritage palace wedding in Udaipur for 350 guests with ₹85 Lakhs budget",
    tab: "budget",
  },
  {
    label: "🚀 Tech Conference & Hackathon",
    prompt: "2-day AI summit with 1,200 attendees, developer track, and VIP banquet in Bengaluru",
    tab: "timeline",
  },
  {
    label: "⛵ Milestone 30th Birthday",
    prompt: "New Year's Eve catamaran yacht celebration in Goa for 60 guests with sunset DJ set",
    tab: "concept",
  },
  {
    label: "🌟 Community Cultural Festival",
    prompt: "Traditional street Diwali food and music carnival in Mumbai for 2,000 attendees",
    tab: "vendors",
  },
];

// Interactive Demo Categories for Engine 1 Live Preview
interface DemoLineItem {
  id: string;
  name: string;
  amount: number;
  locked: boolean;
  color: string;
}

export default function HomePage() {
  const router = useRouter();
  const { loadDemoData } = useEventStore();
  const [customPrompt, setCustomPrompt] = useState("");
  const [activeEngineTab, setActiveEngineTab] = useState<
    "budget" | "timeline" | "vendors" | "concept"
  >("budget");

  // Live Interactive Mini Budget State
  const TOTAL_DEMO_BUDGET = 8500000; // ₹85 Lakhs
  const [demoItems, setDemoItems] = useState<DemoLineItem[]>([
    { id: "1", name: "Catering & Banquet", amount: 3400000, locked: false, color: "bg-emerald-500" },
    { id: "2", name: "Venue & Palace Lease", amount: 2125000, locked: true, color: "bg-violet-500" },
    { id: "3", name: "Décor & Mandap Styling", amount: 1275000, locked: false, color: "bg-amber-500" },
    { id: "4", name: "Contingency Buffer (10%)", amount: 850000, locked: false, color: "bg-sky-500" },
    { id: "5", name: "Entertainment & AV", amount: 850000, locked: false, color: "bg-pink-500" },
  ]);

  // Handle live budget slider rebalance
  const handleSliderChange = (id: string, newAmount: number) => {
    setDemoItems((prev) => {
      const targetIndex = prev.findIndex((item) => item.id === id);
      if (targetIndex === -1 || prev[targetIndex]?.locked) return prev;

      const current = prev[targetIndex]!;
      const delta = newAmount - current.amount;
      const unlockedOthers = prev.filter((i) => i.id !== id && !i.locked && i.amount > 0);

      if (unlockedOthers.length === 0) return prev;

      const totalUnlocked = unlockedOthers.reduce((sum, i) => sum + i.amount, 0);

      return prev.map((item) => {
        if (item.id === id) {
          return { ...item, amount: Math.max(0, newAmount) };
        }
        if (item.locked || item.amount === 0) {
          return item;
        }
        const proportion = item.amount / totalUnlocked;
        const adjusted = Math.max(0, Math.round(item.amount - delta * proportion));
        return { ...item, amount: adjusted };
      });
    });
  };

  const toggleLock = (id: string) => {
    setDemoItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, locked: !item.locked } : item))
    );
  };

  const handleLaunchWorkspace = (promptText?: string) => {
    loadDemoData();
    const finalPrompt = promptText || customPrompt;
    if (finalPrompt.trim()) {
      router.push(`/events/new?prompt=${encodeURIComponent(finalPrompt)}&tab=budget`);
    } else {
      router.push(`/events/new?tab=budget`);
    }
  };

  return (
    <main className="min-h-full bg-slate-50/50 pb-24 text-slate-900">
      {/* ── 1. Hero Section: Autonomous Orchestration ───────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-950 via-slate-900 to-slate-950 px-4 pt-20 pb-24 text-white sm:px-6 lg:px-8">
        {/* Decorative Grid Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-600/20 via-transparent to-transparent pointer-events-none" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-900/40 px-4 py-1.5 text-xs font-semibold tracking-wide text-violet-200 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-amber-300 animate-pulse" />
            <span>Autonomous GenAI Event Orchestration Platform</span>
            <span className="rounded-full bg-violet-400/20 px-2 py-0.5 text-[10px] text-violet-300">
              Gemini 1.5 Dual-Tier
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            Where Event Vision Meets{" "}
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              Mathematical Precision
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base text-slate-300 sm:text-lg leading-relaxed">
            Go beyond generic text lists. Celebrai converts raw celebration concepts into
            conserved financial budgets, 3-horizon DAG timelines with critical path recalculation,
            SLA-vetted vendor RFPs, and sensory Concept Studio aesthetics.
          </p>

          {/* Interactive AI Prompt Box */}
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-xl sm:p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLaunchWorkspace()}
                placeholder="Describe your event (e.g. 3-day royal palace wedding in Udaipur with ₹85L budget)..."
                className="w-full flex-1 rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-slate-400 focus:border-violet-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-violet-400/40"
              />
              <Button
                onClick={() => handleLaunchWorkspace()}
                className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-violet-600 hover:to-fuchsia-700 sm:shrink-0"
              >
                Orchestrate Event <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Prompt Presets */}
            <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-white/10 text-xs text-slate-400">
              <span className="font-medium text-slate-300">Try Presets:</span>
              {PROMPT_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => {
                    setCustomPrompt(preset.prompt);
                    handleLaunchWorkspace(preset.prompt);
                  }}
                  className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-slate-300 transition-colors hover:border-violet-400/40 hover:bg-white/15 hover:text-white"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Budget Conservation: ∑ Bᵢ = B_total</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Topological DAG Milestones</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-400" />
              <span>Zero-Chromium Serverless PDF</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. The 4 Core Generative Engines (Interactive Showcase) ── */}
      <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
          <div className="text-center">
            <h2 className="text-xs font-bold uppercase tracking-widest text-violet-600">
              Beyond Generic AI Text Wrappers
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              The 4 Deterministic Generative Engines
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-500">
              Celebrai couples high-context LLMs with mathematically grounded client dispatchers,
              dependency graphs, and statutory rulebooks.
            </p>
          </div>

          {/* Engine Navigation Tabs */}
          <div className="mt-8 flex justify-center border-b border-slate-200">
            <div className="flex flex-wrap gap-2 sm:gap-4">
              {[
                { id: "budget", label: "Engine 1: Dynamic Budget", icon: DollarSign },
                { id: "timeline", label: "Engine 2: 3-Horizon DAG", icon: GitBranch },
                { id: "vendors", label: "Engine 3: Procurement Chain", icon: ShieldCheck },
                { id: "concept", label: "Engine 4: Concept Studio", icon: Palette },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEngineTab(tab.id as typeof activeEngineTab)}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-all ${
                    activeEngineTab === tab.id
                      ? "border-violet-600 text-violet-700 bg-violet-50/50 rounded-t-xl"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Engine Content Views ───────────────────────────────── */}
          <div className="mt-8">
            {/* ENGINE 1: DYNAMIC BUDGET ENGINE */}
            {activeEngineTab === "budget" && (
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="space-y-4 lg:col-span-5">
                  <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                    Mathematical Invariant: ∑ Bᵢ = B_total
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Real-Time Zero-Sum Budget Conservation
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Unlike ordinary planners that hallucinate arbitrary numbers, Celebrai enforces strict
                    conservation. Drag any slider in the live preview to witness variance distribution
                    across unlocked categories in real-time.
                  </p>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <span>Zero-shot allocations calibrated to regional market averages.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-violet-500" />
                      <span>Lock committed contracts (Sᵢ = 0) to protect against accidental rebalances.</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      <span>Gemini 1.5 Flash updates with &lt;500ms low-latency execution.</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => handleLaunchWorkspace()}
                      className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Open Full Budget Matrix <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Live Interactive Budget Mini-Widget */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm lg:col-span-7">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-xs font-semibold uppercase text-slate-400">
                        Total Budget Limit
                      </span>
                      <p className="text-xl font-extrabold text-slate-900">
                        {formatINR(TOTAL_DEMO_BUDGET)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold uppercase text-slate-400">
                        Sum Conservation
                      </span>
                      <p className="font-mono text-sm font-bold text-emerald-600">
                        100.0% Conserved
                      </p>
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="mt-4 space-y-4">
                    {demoItems.map((item) => (
                      <div key={item.id} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700 flex items-center gap-1.5">
                            <span className={`inline-block h-2 w-2 rounded-full ${item.color}`} />
                            {item.name}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-semibold text-slate-800">
                              {formatINR(item.amount)}
                            </span>
                            <button
                              onClick={() => toggleLock(item.id)}
                              className={`rounded p-1 transition-colors ${
                                item.locked
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-slate-200/60 text-slate-500 hover:bg-slate-200"
                              }`}
                              title={item.locked ? "Locked" : "Click to lock line item"}
                            >
                              {item.locked ? (
                                <Lock className="h-3 w-3" />
                              ) : (
                                <Unlock className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={5000000}
                          step={50000}
                          value={item.amount}
                          disabled={item.locked}
                          onChange={(e) =>
                            handleSliderChange(item.id, Number(e.target.value))
                          }
                          className={`w-full accent-violet-600 h-2 bg-slate-200 rounded-lg cursor-pointer ${
                            item.locked ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <p className="mt-4 text-center text-[11px] text-slate-400">
                    💡 Try dragging the Catering slider — notice how unlocked items automatically adjust!
                  </p>
                </div>
              </div>
            )}

            {/* ENGINE 2: INTERACTIVE TIMELINE DAG */}
            {activeEngineTab === "timeline" && (
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="space-y-4 lg:col-span-5">
                  <Badge variant="default" className="bg-violet-100 text-violet-800">
                    Topological Sort & Critical Path
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Backward-Scheduled 3-Horizon DAG
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Organizing is scheduled backwards from Event Day (T_event). If a vendor delivers late
                    or permits are held up, Celebrai recalculates float slacks and reveals the new critical path.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-3">
                      <span className="text-xs font-bold text-violet-900">
                        1. Strategic Horizon (T-6m to T-2m)
                      </span>
                      <p className="text-xs text-violet-700">
                        Palace lease contracts, master decor procurement, statutory P-10 excise permits.
                      </p>
                    </div>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3">
                      <span className="text-xs font-bold text-blue-900">
                        2. Operational Horizon (T-1m to T-1w)
                      </span>
                      <p className="text-xs text-blue-700">
                        RSVP locks, dietary guarantee minimums, cue-to-cue technical AV run-throughs.
                      </p>
                    </div>
                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3">
                      <span className="text-xs font-bold text-amber-900">
                        3. Day-of Run-of-Show (T-12h to T+4h)
                      </span>
                      <p className="text-xs text-amber-700">
                        Minute-by-minute execution steps, floral load-in, Baraat arrival and stage cues.
                      </p>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => handleLaunchWorkspace()}
                      className="gap-2 bg-violet-600 text-white hover:bg-violet-700"
                    >
                      View Interactive Gantt DAG <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Timeline Visual Mockup */}
                <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 lg:col-span-7">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <GitBranch className="h-4 w-4 text-violet-600" />
                      Critical Path Milestone Sequence
                    </span>
                    <Badge variant="warning" className="text-[10px]">
                      4 Critical Nodes Active
                    </Badge>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3">
                      <div className="mt-0.5 rounded-full bg-emerald-500 p-1 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-emerald-950">Lock Palace Venue Contract & Advance</span>
                          <span className="font-mono text-emerald-700">T - 6 Months</span>
                        </div>
                        <p className="text-emerald-800/80">Completed: Oberoi Udaivilas signed with 50% deposit</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-violet-200 bg-white p-3 shadow-sm">
                      <div className="mt-0.5 rounded-full bg-violet-600 p-1 text-white animate-pulse">
                        <Flame className="h-3 w-3" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-violet-950">Lock RSVP Headcount & Dietary Minimums</span>
                          <span className="font-mono text-violet-700 font-semibold">T - 1 Month [CRITICAL PATH]</span>
                        </div>
                        <p className="text-slate-500">Dependent on: Decor RFP & Mandap Concept approval</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 opacity-80">
                      <div className="mt-0.5 rounded-full bg-slate-300 p-1 text-white">
                        <Clock className="h-3 w-3" />
                      </div>
                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">Mandap Floral Load-In & Audio Soundcheck</span>
                          <span className="font-mono text-slate-500">T - 12 Hours [Run-of-Show]</span>
                        </div>
                        <p className="text-slate-500">06:00 AM load-in of marigold structures and live acoustic checks</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ENGINE 3: VENDOR PROCUREMENT CHAIN */}
            {activeEngineTab === "vendors" && (
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="space-y-4 lg:col-span-5">
                  <Badge variant="default" className="bg-amber-100 text-amber-800">
                    3-Stage Contract Prompt Chain
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    From Unstructured Quotes to Binding SLAs
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Celebrai runs vendor proposals through an automated 3-stage chain to safeguard your event
                    from hidden surcharges, missing licenses, or timeline bottlenecks.
                  </p>

                  <div className="space-y-3 pt-2 text-xs">
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-md bg-amber-500 px-1.5 py-0.5 font-bold text-white">1</div>
                      <div>
                        <strong className="text-slate-800">Specification Parsing:</strong> Auto-generates RFPs with
                        explicit SLAs, backup equipment mandates, and overtime clauses.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-md bg-amber-500 px-1.5 py-0.5 font-bold text-white">2</div>
                      <div>
                        <strong className="text-slate-800">Quote Vetting & Anomaly Detection:</strong> Audits supplier
                        pricing against regional benchmark rates to highlight cost spikes.
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="rounded-md bg-amber-500 px-1.5 py-0.5 font-bold text-white">3</div>
                      <div>
                        <strong className="text-slate-800">Contract Extraction:</strong> Converts signed agreements into
                        checkable deliverables directly mapped to DAG milestone payment releases.
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => handleLaunchWorkspace()}
                      className="gap-2 bg-amber-600 text-white hover:bg-amber-700"
                    >
                      Audit Vendor RFPs <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Vendor RFP Mockup */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Marwar Royal Gourmet Catering RFP
                      </h4>
                      <p className="text-xs text-slate-400">Status: Shortlisted • Luxury Tier</p>
                    </div>
                    <Badge variant="success">FSSAI Certified</Badge>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-900 flex items-center justify-between">
                      <span>✓ 8 Master Chefs + 45 Silver-Service Stewards verified</span>
                      <span className="font-semibold text-emerald-700">SLA Passed</span>
                    </div>
                    <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-900 flex items-center justify-between">
                      <span>✓ Temperature-controlled reefer vans for dairy & seafood</span>
                      <span className="font-semibold text-emerald-700">Verified</span>
                    </div>
                    <div className="rounded-lg bg-rose-50 p-2.5 text-rose-900 flex items-center justify-between">
                      <span>⚠ Penalty SLA for +10% guest count variance unaddressed</span>
                      <span className="font-semibold text-rose-600">Action Required</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ENGINE 4: PERSONALIZED CONCEPT STUDIO */}
            {activeEngineTab === "concept" && (
              <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
                <div className="space-y-4 lg:col-span-5">
                  <Badge variant="default" className="bg-pink-100 text-pink-800">
                    Multimodal Sensory Vectors
                  </Badge>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Concept Studio: 4D Creative Direction
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    Transform qualitative mood descriptions into structured vectors across Spatial Aesthetics,
                    Signature Mixology, Audio Atmospherics (BPM progression), and Interactive Experiences.
                  </p>

                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <Palette className="h-4 w-4 text-violet-600 mb-1" />
                      <strong className="text-slate-800 block">Spatial Aesthetics</strong>
                      <span className="text-slate-500">Hex color schemes, floral structures, and lighting moods.</span>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <GlassWater className="h-4 w-4 text-emerald-600 mb-1" />
                      <strong className="text-slate-800 block">Signature Mixology</strong>
                      <span className="text-slate-500">Custom cocktail recipes and botanical bar logistics.</span>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <Music className="h-4 w-4 text-pink-600 mb-1" />
                      <strong className="text-slate-800 block">Audio Atmospherics</strong>
                      <span className="text-slate-500">Dynamic BPM curves tailored to each event phase.</span>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <Users className="h-4 w-4 text-amber-600 mb-1" />
                      <strong className="text-slate-800 block">Interactive Moments</strong>
                      <span className="text-slate-500">Facilitated guest icebreakers and cultural ceremonies.</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={() => handleLaunchWorkspace()}
                      className="gap-2 bg-pink-600 text-white hover:bg-pink-700"
                    >
                      Explore Creative Studio <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Concept Visual Swatch Mockup */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
                  <h4 className="text-sm font-bold text-slate-900">
                    Gilded Mewar: Royal Sunset Opulence Palette
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Traditional Mewari grandeur meets modern minimalist romanticism
                  </p>

                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {[
                      { name: "Royal Violet", hex: "#6C3FC5" },
                      { name: "Palace Gold", hex: "#E8B86D" },
                      { name: "Pichola Aqua", hex: "#1A5276" },
                      { name: "Sandstone", hex: "#FAF8F5" },
                      { name: "Marigold", hex: "#E67E22" },
                    ].map((swatch) => (
                      <div key={swatch.name} className="space-y-1 text-center">
                        <div
                          className="h-16 w-full rounded-xl border border-slate-200 shadow-inner"
                          style={{ backgroundColor: swatch.hex }}
                        />
                        <span className="block text-[11px] font-medium text-slate-700 truncate">
                          {swatch.name}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {swatch.hex}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Music className="h-3.5 w-3.5 text-pink-600" />
                      Target Audio BPM Curve:
                    </span>
                    <span className="font-mono text-slate-600">
                      Welcome (85 BPM) → Sangeet (128 BPM) → Pheras (65 BPM)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── 3. Architectural Superiority ("Beyond Basic Requirements") ── */}
      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Badge variant="outline" className="text-slate-600 border-slate-300">
            System Topology Comparison
          </Badge>
          <h2 className="mt-2 text-3xl font-extrabold text-slate-900">
            Why Generic AI Fails Event Organizers
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            A celebration has zero tolerance for budgetary drift or scheduling oversights.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Legacy / Basic AI Wrappers */}
          <div className="rounded-2xl border border-rose-200 bg-rose-50/30 p-6 sm:p-8">
            <div className="flex items-center gap-2 text-rose-700">
              <span className="text-xs font-bold uppercase tracking-wider">The Standard Way</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-rose-950">Generic AI Assistants</h3>
            <ul className="mt-6 space-y-3.5 text-xs text-rose-900/80">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Hallucinated Math:</strong> Outputs static bulleted budgets that do not sum to total budget limits.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Linear To-Do Lists:</strong> Cannot model milestone dependencies or recalculate critical paths upon vendor delay.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Expensive Input Costs:</strong> Re-sends thousands of tokens of static venue rulebooks on every turn.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-500 font-bold">✕</span>
                <span><strong>Heavy Puppeteer Dependencies:</strong> 50MB+ cold starts and 4,000ms latency crashing serverless edge runtimes.</span>
              </li>
            </ul>
          </div>

          {/* Celebrai Autonomous Engine */}
          <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50/50 via-white to-fuchsia-50/40 p-6 shadow-md sm:p-8">
            <div className="flex items-center gap-2 text-violet-700">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">The Celebrai Standard</span>
            </div>
            <h3 className="mt-2 text-xl font-bold text-violet-950">Autonomous Event Orchestrator</h3>
            <ul className="mt-6 space-y-3.5 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Strict Invariant Invariance:</strong> Guaranteed ∑ Bᵢ = B_total conservation with sensitivity matrix re-balancing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Topological DAG Scheduling:</strong> 3-Horizon backward milestone resolution with automatic critical path discovery.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Gemini Context Caching:</strong> Pre-caches static venue SOPs and municipal laws for 90% token reduction.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-500 font-bold">✓</span>
                <span><strong>Serverless @react-pdf/renderer:</strong> Under 2MB bundle with ~50ms instant PDF run-sheet generation.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── 4. Ready-to-Orchestrate Banner ──────────────────────────── */}
      <section className="mx-auto mt-20 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 p-8 text-center text-white shadow-2xl sm:p-12">
          <h2 className="text-2xl font-bold sm:text-4xl">
            Experience the Future of Celebration Planning
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-300">
            Pre-loaded with real-world enterprise scenarios: The Oberoi Udaivilas Palace Wedding,
            TechNova Global AI Summit, and Goa Catamaran Yacht Celebrations.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              onClick={() => handleLaunchWorkspace()}
              size="lg"
              className="gap-2 bg-white px-8 font-bold text-violet-900 hover:bg-violet-50 shadow-lg"
            >
              <Play className="h-4 w-4 fill-violet-900" />
              Launch Live Workspace
            </Button>
            <Link href="/events">
              <Button
                variant="outline"
                size="lg"
                className="gap-2 border-white/30 text-white hover:bg-white/10"
              >
                <Layers className="h-4 w-4" />
                Browse Events Directory
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
