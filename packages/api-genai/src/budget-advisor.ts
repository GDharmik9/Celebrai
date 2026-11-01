import type { BudgetVariance, BudgetVector } from "@celebrai/schemas";
import { BudgetVarianceSchema } from "@celebrai/schemas";
import { geminiClient, MODELS } from "./clients/gemini.js";
import { SYSTEM_INSTRUCTIONS } from "./prompts/system-instructions.js";
import { buildBudgetPrompt } from "./prompts/budget.js";

/**
 * Rebalances an event budget using Gemini 3.8 Flash for low-latency response,
 * suitable for real-time budget slider updates.
 */
export async function rebalanceBudget(
  budget: BudgetVector,
  adjustmentRequest: string
): Promise<BudgetVariance> {
  const client = geminiClient();
  const prompt = buildBudgetPrompt(budget, adjustmentRequest);

  const interaction = await client.interactions.create({
    model: MODELS.FLASH, // Flash for low-latency budget updates
    system_instruction: SYSTEM_INSTRUCTIONS.BUDGET_ADVISOR,
    input: prompt,
    response_mime_type: "application/json",
    store: false,
  });

  const rawJson = interaction.output_text;
  if (!rawJson) {
    throw new Error("Gemini returned an empty response for budget rebalancing.");
  }

  return BudgetVarianceSchema.parse(JSON.parse(rawJson));
}

/**
 * Streams budget advice for progressive UI rendering.
 */
export async function* streamBudgetAdvice(
  budget: BudgetVector,
  adjustmentRequest: string
): AsyncGenerator<string> {
  const client = geminiClient();
  const prompt = buildBudgetPrompt(budget, adjustmentRequest);

  const stream = await client.interactions.create({
    model: MODELS.FLASH,
    system_instruction: SYSTEM_INSTRUCTIONS.BUDGET_ADVISOR,
    input: prompt,
    stream: true,
    store: false,
  });

  for await (const event of stream) {
    if (
      event.event_type === "step.delta" &&
      event.delta?.type === "text" &&
      event.delta.text
    ) {
      yield event.delta.text;
    }
  }
}
