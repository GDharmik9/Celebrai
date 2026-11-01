import type { BudgetVector } from "@celebrai/schemas";

export function buildBudgetPrompt(
  budget: BudgetVector,
  adjustmentRequest: string
): string {
  const lineItemsSummary = budget.lineItems
    .map(
      (item) =>
        `- ${item.category} (${item.label}): ${budget.currency} ${item.estimatedAmount.toLocaleString("en-IN")}${item.locked ? " [LOCKED]" : ""}`
    )
    .join("\n");

  return `Analyze and rebalance the following event budget based on the user's request.

Total Budget: ${budget.currency} ${budget.totalBudget.toLocaleString("en-IN")}
Contingency: ${budget.contingencyPercent}%

Current Allocations:
${lineItemsSummary}

User Request: ${adjustmentRequest}

Important constraints:
- Locked line items cannot be modified
- Total must not exceed the original total budget
- Maintain the contingency reserve
- Provide specific rationale for each adjustment
- Suggest at least 2 savings opportunities

Respond ONLY with valid JSON matching the BudgetVariance schema.`;
}
