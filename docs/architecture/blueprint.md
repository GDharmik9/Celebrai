# Celebrai Architecture Blueprint & Serverless Setup

Celebrai is an autonomous, serverless-native Generative AI event orchestration platform engineered for end-to-end planning of large-scale celebrations, weddings, and corporate summits.

## 1. System Architecture Overview

```
                                    ┌────────────────────────┐
                                    │   Next.js App Router   │
                                    │       (apps/web)       │
                                    └───────────┬────────────┘
                                                │
                 ┌──────────────────────────────┴─────────────────────────────┐
                 │                                                            │
                 ▼                                                            ▼
     ┌───────────────────────┐                                    ┌───────────────────────┐
     │  Streaming Routes     │                                    │  Object API Routes    │
     │  (runtime = "edge")   │                                    │  (runtime = "nodejs") │
     │  /api/chat            │                                    │  /api/budget          │
     │  (Vercel AI SDK)      │                                    │  /api/timeline        │
     └───────────┬───────────┘                                    │  /api/export-pdf      │
                 │                                                └───────────┬───────────┘
                 │                                                            │
                 ▼                                                            ▼
    ┌─────────────────────────┐                                  ┌─────────────────────────┐
    │   Gemini 1.5 Flash      │                                  │   Gemini 1.5 Pro        │
    │   (gemini-3.8-flash)    │                                  │   (gemini-4-argon)      │
    │   Low-latency slider &  │                                  │   1M+ token context DAG │
    │   conversational chat   │                                  │   & multi-doc contracts │
    └─────────────────────────┘                                  └─────────────────────────┘
                 ▲                                                            ▲
                 └──────────────────────────────┬─────────────────────────────┘
                                                │
                                  ┌─────────────┴─────────────┐
                                  │   Gemini Context Cache    │
                                  │      (TTL = 3600s)        │
                                  │   SOPs, Schemas, Venues   │
                                  └───────────────────────────┘
```

## 2. Monorepo Package Isolation

1. **`@celebrai/schemas` (`packages/schemas`):**
   - Single source of truth for runtime validation and static TypeScript definitions.
   - Built with Zod to enforce strict boundary validation.
   - Pure ESM/CJS build with zero framework dependencies.

2. **`@celebrai/api-genai` (`packages/api-genai`):**
   - Encapsulates Gemini SDK model instantiation, prompt engineering, context caching, and structured output parsing.
   - Employs the modern Interactions API (`client.interactions.create()`).

3. **`@celebrai/pdf-export` (`packages/pdf-export`):**
   - Dedicated `@react-pdf/renderer` service generating run-of-show and budget documents directly to byte buffers.
   - Operates strictly without headless Chromium binaries.

4. **`@celebrai/ui` (`packages/ui`):**
   - Headless and styled primitive UI components (Cards, Sliders, Progress bars, Tabs, Badges, Buttons) built on Tailwind CSS and class-variance-authority.

## 3. Deployment & Execution Guarantees

- **Edge Streaming:** `/api/chat` delivers first-token response in under 250ms via Edge runtime.
- **Node.js Serverless Execution:** Memory limit 1024MB, 30s timeout on standard budget & timeline operations.
- **PDF Cold-Start Defense:** Bundle footprint <2MB; cold start <50ms without sandbox browser boots.

