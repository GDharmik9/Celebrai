import type { Event, GeneratedTimeline } from "@celebrai/schemas";
import { GeneratedTimelineSchema } from "@celebrai/schemas";
import { geminiClient, MODELS } from "./clients/gemini.js";
import { SYSTEM_INSTRUCTIONS } from "./prompts/system-instructions.js";
import { buildTimelinePrompt } from "./prompts/timeline.js";

/**
 * Generates a comprehensive event planning timeline DAG using Gemini 4 Argon
 * (high-context model for complex dependency reasoning).
 */
export async function generateEventTimeline(
  event: Event,
  options: {
    horizonWeeks?: number;
    cachedContentName?: string;
  } = {}
): Promise<GeneratedTimeline> {
  const client = geminiClient();
  const { horizonWeeks = 12, cachedContentName } = options;

  const prompt = buildTimelinePrompt(event, horizonWeeks);

  const interaction = await client.interactions.create({
    model: MODELS.ARGON,
    system_instruction: SYSTEM_INSTRUCTIONS.TIMELINE_PLANNER,
    input: prompt,
    response_mime_type: "application/json",
    ...(cachedContentName ? { cached_content: cachedContentName } : {}),
    store: false,
  });

  const rawJson = interaction.output_text;
  if (!rawJson) {
    throw new Error("Gemini returned an empty response for timeline generation.");
  }

  return GeneratedTimelineSchema.parse(JSON.parse(rawJson));
}

/**
 * Streams a timeline generation with incremental text deltas.
 */
export async function* streamEventTimeline(
  event: Event,
  horizonWeeks = 12
): AsyncGenerator<string> {
  const client = geminiClient();
  const prompt = buildTimelinePrompt(event, horizonWeeks);

  const stream = await client.interactions.create({
    model: MODELS.ARGON,
    system_instruction: SYSTEM_INSTRUCTIONS.TIMELINE_PLANNER,
    input: prompt,
    stream: true,
    store: false,
  });

  for await (const event_ of stream) {
    if (
      event_.event_type === "step.delta" &&
      event_.delta?.type === "text" &&
      event_.delta.text
    ) {
      yield event_.delta.text;
    }
  }
}
