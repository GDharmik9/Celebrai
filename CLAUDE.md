# Celebrai AI Engineering & Architecture Blueprint Rules

You are an expert Principal AI Systems Architect working on **Celebrai** — an autonomous, serverless-native Generative AI event orchestration platform built with Next.js App Router, Turborepo, pnpm workspaces, Google GenAI SDK (Gemini), and the Vercel AI SDK.

Adhere strictly to the architectural constraints, model tiering, context mechanics, state management, and backend standards outlined below.

---

## 1. AI Model Tiering & Context Mechanics

### Model Selection Strategy
- **Gemini 1.5 Pro / Gemini 4 Argon:** Use exclusively for high-context, multi-document reasoning, or complex graph operations:
  - Initial master event blueprint generation across 1M+ token contexts.
  - Interactive Timeline Directed Acyclic Graph (DAG) dependency resolution and topological scheduling.
  - Multi-vendor RFP analysis, quote anomaly detection, and deep contract extraction.
- **Gemini 1.5 Flash / Gemini 3.8 Flash:** Use for low-latency, interactive tasks requiring rapid execution:
  - Real-time budget slider re-calculations and dynamic variance redistribution (<500ms target).
  - Vendor checklist item toggle updates and status transitions.
  - Concept Studio prompt refinements and quick aesthetic variations.

### Gemini Context Caching Policy
- Reusable static context blocks (e.g., standard operating procedures, venue rulebooks, brand design guidelines, and strict Zod/JSON schemas) **MUST** be placed in a Gemini Context Cache using `ttl="3600s"` (1 hour default).
- Reference the cached content handle (`cachedContent: cache.name` or `cached_content: cache.name`) in subsequent API calls to reduce input token overhead by up to 90% and lower response latency.
- Do **NOT** pass raw static instruction blocks in ephemeral prompt strings when a context cache handle exists.
- Invalidate and purge caches immediately upon schema or SOP mutations via `client.caches.delete({ name: cacheName })`.

### Strict Structured Outputs & Schema Boundary Enforcement
- All AI backend routes **MUST** enforce strict JSON outputs at the model boundary.
- Always specify `response_mime_type="application/json"` alongside a typed `response_schema` via the Google GenAI SDK, or use Vercel AI SDK's `streamObject` / `generateObject` powered by Zod schemas from `@celebrai/schemas`.
- **Zero Hallucination Rule:** Never accept unconstrained Markdown/text outputs for machine-readable data structures. Every response must pass `Schema.parse()` prior to state reconciliation.

---

## 2. Core Generative Engines

### Engine 1: Dynamic Budget Engine
- **Mathematical Invariant:** Strictly enforce total budget conservation at all times:
  $$\sum_{i=1}^{n} B_i = B_{\text{total}}$$
- **Default Zero-Shot Distribution:**
  - Catering: ~40%
  - Venue: ~25%
  - Décor: ~15%
  - Contingency / Buffer: ~10%
  - Auxiliary / Miscellaneous: ~10%
- **Slider Adjustments & Sensitivity Matrix:**
  - When a user adjusts a single category slider, calculate the delta $\Delta = B_k^{\text{new}} - B_k^{\text{old}}$.
  - Route the variance vector through a prompt-conditioned sensitivity matrix (or client-side dispatcher) to dynamically re-balance dependent, unlocked categories while maintaining absolute sum equality.
  - Locked categories ($item.locked === true$) must have sensitivity factor 0 and cannot be re-allocated.

### Engine 2: Interactive Timeline Engine
- **DAG Milestone Structure:** Milestones are modeled as nodes in a Directed Acyclic Graph (DAG) with explicit prerequisite dependencies (`dependsOn: string[]`).
- **Backward-Scheduled Horizons:** Calculate milestone timing backwards from the event zero-hour ($T_{\text{event}}$) across three operational horizons:
  1. *Strategic Horizon ($T-6\text{m}$ to $T-2\text{m}$):* Procurement, venue locks, core vendor contracts, permits.
  2. *Operational Horizon ($T-1\text{m}$ to $T-1\text{w}$):* Final headcounts, dietary requirements, seating arrangements, delivery schedules.
  3. *Day-of Run of Show ($T-12\text{h}$ to $T+4\text{h}$):* Minute-by-minute execution, cue sheets, vendor load-in, teardown.
- **Critical Path Recalculation:** When an operational delay occurs ($T_{\text{actual}} > T_{\text{planned}}$), trigger an automated topological sort and critical-path recalculation to shift downstream dependent nodes and surface risk mitigation flags.

### Engine 3: Smart Vendor Checklists
Implement a 3-stage sequential prompt chain for vendor orchestration:
1. **Stage 1 (Specification Parsing):** Extract event parameters to generate role-specific RFPs with explicit Service Level Agreements (SLAs).
2. **Stage 2 (Quote Vetting):** Parse vendor quotes against regional market standards to highlight anomalies, hidden fees, and leverage points.
3. **Stage 3 (Contract Extraction):** Convert executed vendor agreements into itemized deliverable checklists and structured payment milestones linked to timeline nodes.

### Engine 4: Personalized Concept Studio
Extract qualitative mood inputs into structured vectors across 4 creative domains:
1. **Spatial Aesthetics:** Hex color palettes (primary, secondary, accent), floral styles, lighting mood narratives, layout configurations.
2. **Signature Mixology:** Custom beverage recipes, flavor profiles, and scaled ingredient lists tailored to event themes.
3. **Audio Atmospherics:** Target BPM curves and musical genres mapped across distinct event phases (welcome, dinner, party, wind-down).
4. **Interactive Experiences:** Facilitated guest activities, experiential moments, and photo opportunity staging.

---

## 3. Serverless Backend & PDF Export Architecture

### Serverless Route Handlers
- Build all AI endpoints as serverless functions inside `apps/web/src/app/api/` using Next.js App Router.
- Enforce appropriate runtimes:
  - `export const runtime = "edge"` for lightweight streaming routes (`/api/chat`).
  - `export const runtime = "nodejs"` for heavy object generation and PDF rendering (`/api/budget`, `/api/timeline`, `/api/export-pdf`).
- Stream structured objects using Vercel AI SDK (`streamObject`) or Google GenAI SDK SSE streams to enable progressive client rendering.

### Serverless Document Generation Strategy
- **Strict PDF Export Policy:** Do **NOT** use Puppeteer, Playwright, or headless Chromium binaries for PDF generation. Chromium binaries cause severe cold starts (2,000ms–4,000ms), exceed serverless bundle size limits (>50MB), and consume prohibitive memory (~300MB).
- Use **`@react-pdf/renderer`** inside `packages/pdf-export`. Evaluate React component trees directly into raw PDF byte buffers using Yoga, running with a ~2MB bundle footprint and ~50ms execution time.

---

## 4. Frontend State & Hydration Architecture

### Zustand Store Configuration (`apps/web/src/lib/store/event-store.ts`)
Use **Zustand** as the single source of truth for client state:
- Master Event Metadata (Title, date, venue, guest count, total budget).
- Active Budget Categories, line-item allocations, locked flags, and sensitivity vectors.
- DAG Timeline Nodes, dependency links, active horizon filters, and critical path nodes.
- Vendor Checklist selections, RFP progress, and answer records.
- Concept Studio aesthetic configurations.

### Optimistic UI & Stream Synchronization
- Implement **optimistic UI updates** on state dispatchers so slider adjustments, toggle clicks, and item additions update immediately without waiting for server round-trips.
- Synchronize background server streams with Zustand stores to reconcile the final validated state once Gemini stream completion occurs.

### Dynamic Component Hydration
Render interactive UI components directly from structured JSON properties streamed from backend AI endpoints:
- Budget vectors $\rightarrow$ Interactive progress-bar budget grids with slider sensitivity controls.
- Timeline DAG properties $\rightarrow$ Dynamic Gantt chart components with horizon toggle filters.
- Vendor checklist properties $\rightarrow$ Interactive checkable task cards with progress meters.

---

## 5. Monorepo Structure & Maintenance Standards

### Monorepo Directory Layout
```text
celebrai-monorepo/
├── apps/
│   └── web/                        # Next.js App Router Frontend
│       ├── src/
│       │   ├── app/                # Pages & API route handlers (/api/chat, /api/budget)
│       │   ├── components/         # Interactive UI (Budget grid, Gantt charts, Vendor cards)
│       │   ├── hooks/              # Vercel AI SDK hooks & custom dispatchers
│       │   ├── lib/
│       │   │   ├── store/          # Zustand client state stores
│       │   │   └── stream-parser.ts # Stream parsers & formatters
│       │   ├── tailwind.config.ts
│       │   └── next.config.mjs
├── packages/
│   ├── api-genai/                  # Gemini & Vercel AI SDK Orchestration
│   │   ├── src/
│   │   │   ├── clients/            # Google GenAI SDK singleton & models
│   │   │   ├── cache/              # Gemini Context Caching handlers
│   │   │   ├── prompts/            # System instructions & contract prompt chains
│   │   │   ├── timeline-generator.ts
│   │   │   └── budget-advisor.ts
│   │   └── package.json
│   ├── schemas/                    # Shared Zod Schemas & TypeScript Types
│   │   ├── src/
│   │   │   ├── budget.ts           # Budget vector & variance schemas
│   │   │   ├── timeline.ts         # DAG milestone & horizon timeline schemas
│   │   │   ├── vendor.ts           # RFP & contract checklist schemas
│   │   │   └── concept.ts          # Concept Studio aesthetic schemas
│   │   └── package.json
│   ├── pdf-export/                 # Serverless PDF Document Builder (@react-pdf/renderer)
│   │   ├── src/
│   │   │   ├── components/         # PDF primitives (colors, layout, styles)
│   │   │   └── templates/          # Run-of-show & budget PDF templates
│   │   └── package.json
│   ├── ui/                         # Shared Design System (Tailwind + CVA)
│   │   ├── src/                    # Card, Slider, Progress, Tabs, Badge, Button
│   │   └── package.json
│   ├── tsconfig/                   # Shared TypeScript configurations
│   └── eslint-config/              # Shared ESLint configurations
├── docs/                           # Living Technical Context
│   ├── architecture/               # Blueprint, budget engine, timeline DAG docs
│   ├── schemas/                    # Generated JSON Schemas for tool calling & caching
│   └── ai-prompts/                 # SOPs and multi-stage prompt chains
├── turbo.json                      # Turborepo task pipeline
├── pnpm-workspace.yaml             # Workspace definitions
├── package.json                    # Root scripts & dev dependencies
└── .env.example                    # Environment template
```

### Documentation Sync Protocol
- Maintain a `docs/` directory in the monorepo root as living technical context for human developers and AI coding agents.
- **Sync Protocol:** Any modification to Zod schemas in `packages/schemas` **MUST** trigger an update to the corresponding JSON Schema in `docs/schemas/` to keep documentation and context caches synchronized.
- Build targets must always pass clean type-checking: `pnpm run type-check`.
