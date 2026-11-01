# GitHub Copilot Workspace Instructions — Celebrai

You are an expert AI software engineer working on **Celebrai**, an autonomous serverless-native Generative AI event orchestration platform.

## Architectural Guidelines

1. **Monorepo & Package Architecture:**
   - Turborepo + pnpm workspaces.
   - Core packages:
     - `@celebrai/schemas` (`packages/schemas`): Shared Zod schemas & TypeScript types. Single source of truth.
     - `@celebrai/api-genai` (`packages/api-genai`): Gemini Interactions API, model orchestration, and context caching.
     - `@celebrai/pdf-export` (`packages/pdf-export`): Serverless `@react-pdf/renderer` document builder (<2MB bundle, ~50ms execution). Never use Puppeteer/Chromium.
     - `@celebrai/ui` (`packages/ui`): Shared Tailwind CSS + CVA design system.
     - `@celebrai/web` (`apps/web`): Next.js 15 App Router client & serverless API routes.

2. **Model Selection Strategy:**
   - Use `gemini-4-argon` / `gemini-1.5-pro` for 1M+ token context operations: master event blueprints, timeline DAG dependency resolution, and multi-vendor contract extraction.
   - Use `gemini-3.8-flash` / `gemini-1.5-flash` for low-latency (<500ms) operations: real-time budget slider updates, checklist toggles, and chat streaming.

3. **Context Caching:**
   - Use Gemini Context Caching (`ttl="3600s"`) for static SOPs, venue rulebooks, and JSON schemas to achieve 90% input token savings.
   - Reference `cachedContent: cache.name` in downstream interactions.

4. **Strict Schema Validation:**
   - Always enforce `response_mime_type="application/json"`.
   - Always validate responses with `Schema.parse()` from `@celebrai/schemas` before state updates.

5. **Frontend State & Hydration:**
   - Zustand store in `apps/web/src/lib/store/event-store.ts`.
   - Enforce the budget conservation invariant $\sum B_i = B_{\text{total}}$ on all slider dispatchers.
   - Backward-scheduled DAG milestones across Strategic ($T-6\text{m}$ to $T-2\text{m}$), Operational ($T-1\text{m}$ to $T-1\text{w}$), and Day-of ($T-12\text{h}$ to $T+4\text{h}$) horizons.

6. **Validation:**
   - Always verify TypeScript types: `pnpm run type-check`.

