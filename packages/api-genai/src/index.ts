// Client & model config
export { geminiClient, MODELS } from "./clients/gemini.js";
export type { ModelId } from "./clients/gemini.js";

// Context caching
export {
  createContextCache,
  listContextCaches,
  deleteContextCache,
} from "./cache/context-cache.js";

// Prompt builders
export {
  SYSTEM_INSTRUCTIONS,
  buildTimelinePrompt,
  buildBudgetPrompt,
  buildVendorChecklistPrompt,
  buildConceptPrompt,
} from "./prompts/index.js";

// Feature generators
export { generateEventTimeline, streamEventTimeline } from "./timeline-generator.js";
export { rebalanceBudget, streamBudgetAdvice } from "./budget-advisor.js";
