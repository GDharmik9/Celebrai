# Celebrai 🥂✨

> **Autonomous, Serverless-Native Generative AI Event Orchestration Platform**  
> Built with Next.js 15 App Router, Turborepo, pnpm workspaces, Google GenAI SDK (Gemini), and the Vercel AI SDK.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7+-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.x-EF4444.svg?logo=turborepo)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1-black.svg?logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20GenAI-Gemini%20Interactions%20API-4285F4.svg?logo=google)](https://ai.google.dev/)
[![React-PDF](https://img.shields.io/badge/@react--pdf/renderer-Serverless-green.svg)](https://react-pdf.org/)
[![License](https://img.shields.io/badge/license-MIT-purple.svg)](LICENSE)

---

## 🌟 Executive Summary

**Celebrai** revolutionizes celebration and corporate event management by deploying a multi-tier Generative AI architecture. Rather than relying on static checklists and rigid spreadsheet formulas, Celebrai combines **Gemini 1.5 Pro / 4 Argon** (1M+ token context for dependency graphs & legal extraction) and **Gemini 1.5 / 3.8 Flash** (<500ms latency for slider rebalancing) with serverless PDF document compilation and optimistic frontend hydration.

### Key Capabilities

- 💰 **Engine 1: Dynamic Budget Engine** — Real-time budget variance rebalancing enforcing total budget conservation ($\sum B_i = B_{\text{total}}$) through prompt-conditioned sensitivity matrices.
- ⏱️ **Engine 2: Interactive Timeline DAG** — Dependency-aware Directed Acyclic Graph milestone scheduling backward-calculated from $T_{\text{event}}$ across Strategic, Operational, and Day-of horizons.
- 📋 **Engine 3: Smart Vendor RFP & Checklists** — 3-stage prompt chain executing Specification Parsing $\rightarrow$ Quote Anomaly Detection $\rightarrow$ Contract Obligation Extraction.
- 🎨 **Engine 4: Personalized Concept Studio** — Multimodal vector extraction across Spatial Aesthetics, Signature Mixology, Audio Atmospherics (BPM curves), and Interactive Staging.
- 📄 **Puppeteer-Free PDF Generation** — Serverless-native document export powered by `@react-pdf/renderer` (<2MB bundle, ~50ms execution vs ~4,000ms Chromium boots).
- ⚡ **Gemini Context Caching** — Reusable statutory SOPs, venue rulebooks, and Zod schemas cached with 1-hour TTLs, slashing input token overhead by up to 90%.

---

## 🏗️ Monorepo Architecture

Celebrai is organized as an enterprise-grade Turborepo and pnpm workspace monorepo:

```text
celebrai-monorepo/
├── apps/
│   └── web/                        # Next.js 15 App Router Client & API Routes
│       ├── src/
│       │   ├── app/                # Pages & Serverless Handlers (/api/chat, /api/budget, /api/timeline, /api/export-pdf)
│       │   ├── components/         # Interactive UI (BudgetGrid, TimelineGantt, VendorCard)
│       │   ├── hooks/              # Custom dispatchers (useBudget, useTimeline)
│       │   └── lib/
│       │       ├── store/          # Zustand State Stores (event-store.ts)
│       │       └── stream-parser.ts # Progressive JSON Stream Parsers & formatters
│       ├── tailwind.config.ts
│       └── next.config.mjs
├── packages/
│   ├── api-genai/                  # Gemini Interactions API & Prompt Orchestration
│   │   ├── src/
│   │   │   ├── clients/            # GoogleGenAI singleton & model registries
│   │   │   ├── cache/              # Gemini Context Caching manager (TTL=3600s)
│   │   │   ├── prompts/            # System instructions & contract prompt chains
│   │   │   ├── timeline-generator.ts # High-context DAG scheduler
│   │   │   └── budget-advisor.ts   # Low-latency variance rebalancer
│   │   └── package.json
│   ├── schemas/                    # Centralized Zod Schemas & TypeScript Types
│   │   ├── src/
│   │   │   ├── budget.ts           # Line items, budget vectors, variance schemas
│   │   │   ├── timeline.ts         # DAG milestone, horizon, critical path schemas
│   │   │   ├── vendor.ts           # RFP items, checklist items, vetting schemas
│   │   │   └── concept.ts          # Palettes, styles, floral/lighting schemas
│   │   └── package.json
│   ├── pdf-export/                 # Serverless PDF Document Generator (@react-pdf/renderer)
│   │   ├── src/
│   │   │   ├── components/         # Design tokens, typography & primitives
│   │   │   └── templates/          # Run-of-show & budget PDF templates
│   │   └── package.json
│   ├── ui/                         # Shared Design System (Tailwind CSS + CVA)
│   │   ├── src/                    # Card, Slider, Progress, Tabs, Badge, Button
│   │   └── package.json
│   ├── tsconfig/                   # Shared TypeScript configurations (base, nextjs, react-library)
│   └── eslint-config/              # Shared ESLint configuration rules
├── docs/                           # Living Technical Context
│   ├── architecture/               # Blueprint, budget engine, timeline DAG docs
│   ├── schemas/                    # Canonical JSON Schemas for tool calling & caching
│   └── ai-prompts/                 # SOPs and multi-stage prompt chains
├── CLAUDE.md                       # Comprehensive Anthropic Claude & AI agent rules
├── .cursorrules                    # Cursor IDE architectural invariants
├── AGENTS.md                       # Autonomous Multi-Agent orchestration guide
├── turbo.json                      # Turborepo cached pipeline definition
├── pnpm-workspace.yaml             # pnpm workspace definition
└── package.json                    # Monorepo root scripts & devDependencies
```

---

## 🧠 AI Model Tiering & Strategy

| Role | Model Target | Primary Use Case | Execution SLA |
|---|---|---|---|
| **High-Context Reasoning** | `Gemini 1.5 Pro` / `gemini-4-argon` | 1M+ token master event blueprinting, complex DAG dependency resolution, multi-vendor contract obligation extraction | `< 5000ms` |
| **Low-Latency Interactivity** | `Gemini 1.5 Flash` / `gemini-3.8-flash` | Real-time budget slider variance updates, vendor checklist toggle calculations, conversational assistant streaming | `< 500ms` |
| **Context Caching** | Gemini Caching API (`ttl="3600s"`) | Statutory event SOPs, venue rulebooks, Zod JSON schemas referenced via `cachedContent: cache.name` | **90% token reduction** |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `>= 20.0.0`
- **pnpm**: `>= 9.0.0` (`corepack enable && corepack prepare pnpm@9.15.0 --activate`)
- **Google Generative AI API Key**: Obtain from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/celebrai.git
cd celebrai
pnpm install
```

### 2. Environment Configuration

Copy the example environment template into `apps/web/.env.local`:

```bash
cp .env.example apps/web/.env.local
```

Populate the required credentials in `apps/web/.env.local`:

```env
# Google Generative AI
GOOGLE_GENERATIVE_AI_API_KEY=your_actual_gemini_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Build Monorepo Packages

Build all shared packages (`@celebrai/schemas`, `@celebrai/ui`, `@celebrai/pdf-export`, `@celebrai/api-genai`):

```bash
pnpm run build
```

### 4. Start Development Server

```bash
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start planning celebrations.

---

## 🛠️ Monorepo Scripts

| Command | Action |
|---|---|
| `pnpm run dev` | Starts Next.js development server and watch tasks across packages |
| `pnpm run build` | Builds all packages and compiles the Next.js production bundle |
| `pnpm run type-check` | Type-checks all 7 workspace packages with strict TypeScript |
| `pnpm run lint` | Runs ESLint across all apps and packages |
| `pnpm run clean` | Cleans `.next`, `dist`, and build caches across the monorepo |
| `pnpm run format` | Formats all code with Prettier and Tailwind CSS plugin |

---

## 🔒 Architectural Invariants

Celebrai enforces 5 non-negotiable architectural invariants (detailed in [`CLAUDE.md`](file:///d:/projects-bhim/Celebrai/CLAUDE.md) and [`.cursorrules`](file:///d:/projects-bhim/Celebrai/.cursorrules)):

1. **Budget Invariant:** Total budget is conserved across all variance rebalancing:
   $$\sum_{i=1}^{n} B_i = B_{\text{total}}$$
2. **Timeline DAG Invariant:** Milestones are scheduled backwards from $T_{\text{event}}$ across 3 horizons (Strategic, Operational, Day-of) with automated topological sorting upon operational slips ($T_{\text{actual}} > T_{\text{planned}}$).
3. **Structured Output Boundary:** Strict JSON enforcement (`response_mime_type="application/json"`) validated against `@celebrai/schemas` with zero unconstrained markdown accepted at model boundaries.
4. **Context Caching Standard:** Static SOPs and rulebooks are cached via `client.caches.create()` with 1-hour TTLs to minimize input latency.
5. **PDF Engine Rule:** Zero Puppeteer/Playwright/Chromium dependencies in serverless environments. Only `@react-pdf/renderer` is permitted.

---

## 📚 Living Technical Documentation

- 📐 [Platform Blueprint & Architecture](file:///d:/projects-bhim/Celebrai/docs/architecture/blueprint.md)
- 📊 [Dynamic Budget Engine Formulations](file:///d:/projects-bhim/Celebrai/docs/architecture/budget-engine.md)
- ⏳ [Interactive Timeline DAG Horizons](file:///d:/projects-bhim/Celebrai/docs/architecture/timeline-dag.md)
- 📜 [Canonical JSON Schemas](file:///d:/projects-bhim/Celebrai/docs/schemas/)
- 🤖 [Autonomous AI Agents Protocol](file:///d:/projects-bhim/Celebrai/AGENTS.md)
- 💡 [Context Caching SOPs](file:///d:/projects-bhim/Celebrai/docs/ai-prompts/context-cache-sops.md)
- 🔗 [3-Stage Vendor Prompt Chains](file:///d:/projects-bhim/Celebrai/docs/ai-prompts/prompt-chains.md)

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

