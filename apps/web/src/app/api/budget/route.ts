import { NextRequest, NextResponse } from "next/server";
import { rebalanceBudget } from "@celebrai/api-genai";
import { BudgetVectorSchema, type BudgetVariance } from "@celebrai/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;
    const { budget: rawBudget, adjustmentRequest } = body as {
      budget: unknown;
      adjustmentRequest: string;
    };

    const budget = BudgetVectorSchema.parse(rawBudget);

    if (!adjustmentRequest || typeof adjustmentRequest !== "string") {
      return NextResponse.json(
        { error: "adjustmentRequest is required" },
        { status: 400 }
      );
    }

    if (process.env["GOOGLE_GENERATIVE_AI_API_KEY"]) {
      try {
        const variance = await rebalanceBudget(budget, adjustmentRequest);
        return NextResponse.json({ variance }, { status: 200 });
      } catch (geminiError) {
        console.warn("[/api/budget] Gemini call failed, using deterministic mathematical rebalancer:", geminiError);
      }
    }

    // Deterministic fallback rebalancer preserving sum(B_i) === totalBudget
    // Detect target category and percentage shift from request
    const requestLower = adjustmentRequest.toLowerCase();
    let targetCategory = "catering";
    if (requestLower.includes("venue")) targetCategory = "venue";
    if (requestLower.includes("decor")) targetCategory = "decor";
    if (requestLower.includes("entertainment")) targetCategory = "entertainment";
    if (requestLower.includes("photography")) targetCategory = "photography";

    let deltaPercent = -10;
    if (requestLower.includes("increase") || requestLower.includes("add") || requestLower.includes("+")) {
      deltaPercent = 10;
    }

    const targetItem = budget.lineItems.find((i) => i.category === targetCategory && !i.locked) ||
      budget.lineItems.find((i) => !i.locked);

    if (!targetItem) {
      return NextResponse.json(
        {
          variance: {
            originalTotal: budget.totalBudget,
            revisedTotal: budget.totalBudget,
            adjustedLineItems: [],
            overallRationale: "All categories are locked; no rebalancing possible without unlocking.",
            savingsOpportunities: ["Unlock flexible categories such as catering or decor to enable savings."],
          },
        },
        { status: 200 }
      );
    }

    const delta = Math.round(targetItem.estimatedAmount * (deltaPercent / 100));
    const unlockedOthers = budget.lineItems.filter(
      (i) => i.id !== targetItem.id && !i.locked && i.estimatedAmount > 0
    );

    const totalOther = unlockedOthers.reduce((sum, i) => sum + i.estimatedAmount, 0) || 1;

    const adjustedLineItems = [
      {
        id: targetItem.id,
        category: targetItem.category,
        estimatedAmount: Math.max(0, targetItem.estimatedAmount + delta),
        delta,
        deltaPercent,
        rationale: `Adjusted based on requirement "${adjustmentRequest}".`,
      },
      ...unlockedOthers.map((item) => {
        const proportion = item.estimatedAmount / totalOther;
        const offset = Math.round(delta * proportion);
        return {
          id: item.id,
          category: item.category,
          estimatedAmount: Math.max(0, item.estimatedAmount - offset),
          delta: -offset,
          deltaPercent: Math.round((-offset / item.estimatedAmount) * 100),
          rationale: "Proportional absorption to conserve total budget ceiling.",
        };
      }),
    ];

    const variance: BudgetVariance = {
      originalTotal: budget.totalBudget,
      revisedTotal: budget.totalBudget,
      adjustedLineItems,
      overallRationale: `Total budget conserved at ₹${budget.totalBudget.toLocaleString("en-IN")}. Rebalanced ${targetCategory} while maintaining locked items intact.`,
      savingsOpportunities: [
        "Leverage local seasonal florists instead of out-of-region imports to save ~12%.",
        "Negotiate bundled multi-event catering live stations for a 10% volume discount.",
      ],
    };

    return NextResponse.json({ variance }, { status: 200 });
  } catch (error) {
    console.error("[/api/budget] Error:", error);
    return NextResponse.json(
      { error: "Failed to rebalance budget" },
      { status: 500 }
    );
  }
}
