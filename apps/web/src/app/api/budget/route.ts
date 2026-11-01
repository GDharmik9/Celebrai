import { NextRequest, NextResponse } from "next/server";
import { rebalanceBudget } from "@celebrai/api-genai";
import { BudgetVectorSchema } from "@celebrai/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
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

    const variance = await rebalanceBudget(budget, adjustmentRequest);

    return NextResponse.json({ variance }, { status: 200 });
  } catch (error) {
    console.error("[/api/budget] Error:", error);
    return NextResponse.json(
      { error: "Failed to rebalance budget" },
      { status: 500 }
    );
  }
}
