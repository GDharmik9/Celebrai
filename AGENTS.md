# Celebrai Autonomous AI Agents Protocol (AGENTS.md)

This document specifies the operational guidelines, multi-agent coordination protocols, permission boundaries, and tool specifications for autonomous AI coding agents and runtime AI agents operating within the **Celebrai** platform.

---

## 1. Multi-Agent System Architecture

Celebrai operates as an orchestrated multi-agent network where specialized sub-agents handle domain-specific event intelligence under a primary orchestrator:

```
                          ┌─────────────────────────────┐
                          │    Orchestrator Agent       │
                          │  (Event Lifecycle Director) │
                          └──────────────┬──────────────┘
                                         │
        ┌──────────────────┬─────────────┴────────────┬──────────────────┐
        ▼                  ▼                          ▼                  ▼
┌───────────────┐  ┌───────────────┐          ┌───────────────┐  ┌───────────────┐
│ Budget Agent  │  │ Timeline DAG  │          │ Vendor Agent  │  │ Concept Agent │
│  (Engine 1)   │  │   Agent (2)   │          │  (Engine 3)   │  │  (Engine 4)   │
└───────┬───────┘  └───────┬───────┘          └───────┬───────┘  └───────┬───────┘
        │                  │                          │                  │
        └──────────────────┴─────────────┬────────────┴──────────────────┘
                                         │
                                         ▼
                          ┌─────────────────────────────┐
                          │   Document Sync Agent       │
                          │   (Schema & Cache Auditor)  │
                          └─────────────────────────────┘
```

---

## 2. Agent Personas & Operational Roles

### 1. `OrchestratorAgent` (Primary Coordinator)
- **Role:** Central dispatcher for user intent parsing, multi-engine synchronization, and master event blueprint compilation.
- **Model:** `gemini-4-argon` / `gemini-1.5-pro` (high-context reasoning).
- **Execution Target:** `apps/web/src/app/api/chat/route.ts` & master planning flows.
- **Rules:**
  - Evaluates user natural language requests and delegates work to the domain agents.
  - Enforces cultural sensitivity (especially for traditional celebrations) and local statutory compliance.
  - Never mutates state without validating outputs against `@celebrai/schemas`.

### 2. `BudgetOptimizationAgent` (Engine 1)
- **Role:** Precision financial allocator, sensitivity matrix rebalancer, and savings opportunity auditor.
- **Model:** `gemini-3.8-flash` / `gemini-1.5-flash` (low-latency execution < 500ms).
- **Invariant:** Total budget conservation is absolute:
  $$\sum_{i=1}^{n} B_i = B_{\text{total}}$$
- **Rules:**
  - Locked categories (`locked: true`) have sensitivity factor $S_i = 0$ and cannot be altered.
  - Negative deltas are distributed proportionally across unlocked line-items.
  - Output must conform strictly to `BudgetVarianceSchema`.

### 3. `TimelineDAGAgent` (Engine 2)
- **Role:** Directed Acyclic Graph scheduler, backward-horizon milestone calculator, and critical-path recalculator.
- **Model:** `gemini-4-argon` / `gemini-1.5-pro`.
- **Invariants:**
  - Milestones scheduled backward from $T_{\text{event}}$ into 3 operational horizons:
    1. *Strategic ($T-6\text{m}$ to $T-2\text{m}$)*
    2. *Operational ($T-1\text{m}$ to $T-1\text{w}$)*
    3. *Day-of ($T-12\text{h}$ to $T+4\text{h}$)*
  - If $T_{\text{actual}} > T_{\text{planned}}$, execute topological sort to recalculate float slacks and identify the new critical path.
  - Output must conform strictly to `GeneratedTimelineSchema`.

### 4. `VendorProcurementAgent` (Engine 3)
- **Role:** 3-stage procurement pipeline manager:
  - *Stage 1 (Specification Parsing):* Generate category-specific RFPs with explicit SLAs.
  - *Stage 2 (Quote Vetting):* Audit vendor proposals against market standards to highlight anomalies.
  - *Stage 3 (Contract Extraction):* Extract binding deliverables and tie payment triggers to DAG milestones.
- **Model:** `gemini-4-argon` / `gemini-1.5-pro`.
- **Output:** Must conform strictly to `GeneratedVendorChecklistSchema` & `VendorRFPSchema`.

### 5. `ConceptDirectorAgent` (Engine 4)
- **Role:** Aesthetic stylist translating mood boards into structured sensory vectors across Spatial Aesthetics, Signature Mixology, Audio Atmospherics (BPM curves), and Interactive Experiences.
- **Model:** `gemini-3.8-flash` for iterations; `gemini-4-argon` for initial master concept boards.
- **Output:** Must conform strictly to `ConceptStudioSchema`.

### 6. `DocSyncAgent` (Continuous Compliance & Maintenance)
- **Role:** Workspace integrity guardian.
- **Trigger:** Any modification to Zod schemas in `packages/schemas/src/`.
- **Action:** Generates updated JSON Schema definitions in `docs/schemas/` and triggers cache invalidation in `packages/api-genai/src/cache/context-cache.ts`.
- **Verification:** Runs `pnpm run type-check` to guarantee 100% type safety.

---

## 3. Tool Calling & API Interfaces

Autonomous agents interacting with Celebrai must interface via typed tools:

### Tool 1: `rebalance_budget`
```typescript
interface RebalanceBudgetInput {
  budget: BudgetVector;
  adjustmentRequest: string;
}
// Returns: BudgetVariance (Zod validated)
```

### Tool 2: `generate_event_timeline`
```typescript
interface GenerateTimelineInput {
  event: Event;
  horizonWeeks?: number;
  cachedContentName?: string;
}
// Returns: GeneratedTimeline (Zod validated)
```

### Tool 3: `create_context_cache`
```typescript
interface CreateContextCacheInput {
  systemInstruction: string;
  displayName?: string;
  ttlSeconds?: number; // default: 3600
}
// Returns: string (cached content handle name)
```

### Tool 4: `export_pdf_document`
```typescript
interface ExportPDFInput {
  type: "budget" | "run-of-show";
  eventName: string;
  data: BudgetVector | TimelineDAG;
}
// Returns: Buffer (application/pdf byte stream, <2MB)
```

---

## 4. Context Caching Standards

1. **Cache Eligibility:**
   - Standard Operating Procedures (`docs/ai-prompts/context-cache-sops.md`).
   - Venue rulebooks & municipal curfew regulations.
   - Large Zod / JSON Schema validation definitions.
2. **Handle Re-use:**
   - Always verify if an active cache handle exists via `listContextCaches()` before generating a new cache.
   - Reference `cachedContent: cache.name` in downstream `interactions.create()` calls to conserve 90% input tokens.
3. **Cache Invalidation:**
   - When schemas or statutory SOPs are modified, call `deleteContextCache(name)` immediately.

---

## 5. Security & Boundary Rules for AI Agents

- **Zero Unconstrained Output:** Never bypass JSON schemas when outputting structured event data.
- **Zero Headless Browsers:** Never introduce Puppeteer, Playwright, or Chromium into the serverless backend. All PDF exports must utilize `@react-pdf/renderer`.
- **Environment Isolation:** API keys (`GOOGLE_GENERATIVE_AI_API_KEY`) must never be leaked into client bundles or logged to public streams.
- **State Reconciliation:** Optimistic client dispatchers must always reconcile against validated server responses upon stream termination.

