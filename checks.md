Create a GenAI-powered planning assistant that helps users organize weddings, birthdays, and community events with budgets, timelines, vendor checklists, and personalized ideas.


Here is the complete, production-grade master plan for **Celebrai**. It synthesizes all architectural decisions, feature specs, and technical choices established so far into detailed operational paragraphs and an actionable implementation checklist designed for a scalable, enterprise-ready platform.

---

### Executive Overview & Going Beyond Basic Requirements

While a basic event assistant only provides static text lists or generic suggestions, **Celebrai** goes beyond basic requirements by operating as an autonomous, serverless-native event orchestration platform. It converts raw, unstructured host inputs into deterministic, interactively editable, and mathematically consistent planning assets. 

To scale seamlessly without infrastructure bottlenecks or high token costs, Celebrai decouples frontend rendering from backend AI orchestration. It leverages **dual-model tiering** (Gemini 1.5 Pro for high-context reasoning and Gemini 1.5 Flash for low-latency updates), **Gemini Context Caching** to reduce prompt token costs by up to 90%, and **`@react-pdf/renderer`** for lightweight, serverless PDF document exports.

---

### Detailed Engine & System Specifications

#### 1. Dynamic Budget Engine
The Dynamic Budget Engine establishes zero-shot category allocations across baseline event tiers: Catering (~40%), Venue & Permits (~25%), Décor (~15%), Contingency Buffer (~10%), and Auxiliary Services (~10%). It strictly enforces the mathematical invariant \\(\sum B_i = B_{\text{total}}\\). When an organizer manually adjusts a category slider, the variance vector is passed through a prompt-conditioned sensitivity matrix (or client-side Zustand dispatcher) to dynamically re-balance dependent categories without violating the total budget limit.

#### 2. Interactive Timeline Engine (DAG)
Event schedules are structured as a **Directed Acyclic Graph (DAG)** backward-calculated relative to the target event date (\\(T_{\text{event}}\\)). The engine manages milestones across three distinct operational horizons:
* **Strategic Horizon (\\(T-6\text{m}\\) to \\(T-2\text{m}\\)):** Long-term procurement, venue contracts, and regulatory permits.
* **Operational Execution Horizon (\\(T-1\text{m}\\) to \\(T-1\text{w}\\)):** Final guest headcount locks, dietary specifications, and vendor schedule confirmations.
* **Day-of Run of Show Horizon (\\(T-12\text{h}\\) to \\(T+4\text{h}\\)):** Minute-by-minute execution steps for stage managers, caterers, and site leads.

If an operational delay occurs (\\(T_{\text{actual}} > T_{\text{planned}}\\)), the underlying graph automatically executes a critical-path recalculation and streams updated schedules to connected clients.

#### 3. Smart Vendor Checklists & Contract Prompt Chains
Rather than generating static task lists, Celebrai uses a **three-stage sequential prompt chain**:
1. **Specification Parsing:** Extracts event parameters to generate role-specific Requests for Proposals (RFPs) with strict Service Level Agreements (SLAs).
2. **Quote Vetting & Anomaly Detection:** Compares incoming vendor quotes against regional market benchmarks to highlight cost anomalies.
3. **Contract Extraction:** Converts executed vendor contracts into actionable deliverable checklists and payment milestone trackers.

#### 4. Personalized Concept Studio
The Concept Studio processes qualitative user prompts and mood descriptions into structured vectors across four creative sub-domains:
* **Spatial Aesthetics:** Hex swatches, lighting configurations, and floral arrangements.
* **Signature Mixology:** Custom cocktail/mocktail formulas and ingredient logistics.
* **Audio Atmospherics:** Target BPM curves mapped across arrival, main event, and wrap-up phases.
* **Interactive Experiences:** Facilitated guest games, icebreakers, and activities.

#### 5. Scalable Tech Stack & Serverless Infrastructure
* **Monorepo Structure:** Turborepo with `pnpm` workspaces (`apps/web`, `packages/schemas`, `packages/api-genai`, `packages/pdf-export`).
* **Model Boundary Safety:** Strict Zod schema enforcement using Gemini's `response_mime_type="application/json"` and `response_schema` alongside Vercel AI SDK (`streamObject`/`generateObject`).
* **Serverless PDF Export:** Eliminates heavy Puppeteer/Chromium binaries (>50MB bundle, 2–4s cold starts) in favor of `@react-pdf/renderer` (~2MB bundle, ~50ms execution time) to generate downloadable run-sheets and budgets on serverless edge functions.

---

### Master Production Implementation Checklist

#### Phase 1: Repository & Shared Schema Foundation
- [ ] Initialize Turborepo + `pnpm` workspace structure (`celebrai-monorepo`)
- [ ] Configure `pnpm-workspace.yaml` and root `turbo.json` build pipelines
- [ ] Create `packages/schemas` and define Zod models for:
  - [ ] Budget allocation vectors & variance constraints
  - [ ] Timeline DAG nodes, dependencies, and operational horizons
  - [ ] Vendor RFPs, quote verification, and checklist items
  - [ ] Concept Studio creative vectors (hex swatches, BPM curves, cocktail formulas)
- [ ] Set up root `.cursorrules` / `CLAUDE.md` engineering rules file

#### Phase 2: AI Backend & Context Caching Layer
- [ ] Create `packages/api-genai` package integrating Google GenAI SDK (`@google/genai`) and Vercel AI SDK
- [ ] Implement Gemini Context Caching utility for static SOPs, venue rulebooks, and schemas (`ttl="3600s"`)
- [ ] Build model router mapping Gemini 1.5 Pro (timeline DAGs, contract parsing) vs Gemini 1.5 Flash (budget updates, UI toggles)
- [ ] Implement 3-stage vendor prompt chain service
- [ ] Add unit tests verifying structured JSON output compliance against Zod schemas

#### Phase 3: Frontend Web Application & State Management
- [ ] Initialize Next.js App Router project in `apps/web` with Tailwind CSS and Lucide icons
- [ ] Set up Zustand store in `apps/web/src/lib/store/` for optimistic UI dispatchers
- [ ] Build interactive frontend UI components:
  - [ ] Progress-bar budget grid with real-time slider re-balancing
  - [ ] Dynamic Gantt chart component for horizon timeline views
  - [ ] Role-specific checkable vendor task cards
  - [ ] Concept Studio mood board & mixology recipe cards
- [ ] Connect Next.js API route handlers (`/api/budget`, `/api/timeline`) using Vercel AI SDK streaming hooks (`useObject`, `useChat`)

#### Phase 4: Serverless Document Export Service
- [ ] Create `packages/pdf-export` package using `@react-pdf/renderer`
- [ ] Design printable React component templates for:
  - [ ] Master Event Blueprint & Executive Summary
  - [ ] Day-of Vendor Run-of-Show sheets
  - [ ] Itemized Budget & Payment Milestone reports
- [ ] Implement API endpoint in Next.js (`/api/export/pdf`) returning PDF byte streams

#### Phase 5: Production Maintenance & Documentation (`docs/`)
- [ ] Create `docs/architecture/blueprint.md` detailing system topology
- [ ] Create `docs/architecture/budget-engine.md` detailing variance matrix math
- [ ] Create `docs/architecture/timeline-dag.md` detailing DAG horizon calculations
- [ ] Export JSON schema definitions into `docs/schemas/`
- [ ] Document context caching SOPs in `docs/ai-prompts/context-cache-sops.md`
- [ ] Deploy `apps/web` to Vercel with serverless function configuration

---

