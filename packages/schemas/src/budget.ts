import { z } from "zod";

/**
 * A single line-item in an event budget
 */
export const BudgetLineItemSchema = z.object({
  id: z.string().uuid(),
  category: z.enum([
    "venue",
    "catering",
    "decor",
    "entertainment",
    "photography",
    "videography",
    "florals",
    "transportation",
    "staffing",
    "marketing",
    "technology",
    "miscellaneous",
  ]),
  label: z.string().min(1).max(120),
  estimatedAmount: z.number().nonnegative(),
  actualAmount: z.number().nonnegative().optional(),
  currency: z.string().length(3).default("INR"),
  notes: z.string().max(500).optional(),
  locked: z.boolean().default(false),
});

export type BudgetLineItem = z.infer<typeof BudgetLineItemSchema>;

/**
 * Dynamic budget vector — represents the full event budget as a normalized
 * multi-dimensional allocation across categories.
 */
export const BudgetVectorSchema = z.object({
  eventId: z.string().uuid(),
  totalBudget: z.number().positive(),
  currency: z.string().length(3).default("INR"),
  lineItems: z.array(BudgetLineItemSchema).min(1),
  contingencyPercent: z.number().min(0).max(30).default(10),
  version: z.number().int().positive().default(1),
  lastUpdatedAt: z.string().datetime(),
});

export type BudgetVector = z.infer<typeof BudgetVectorSchema>;

/**
 * Budget variance response from Gemini — rebalanced allocations with reasoning
 */
export const BudgetVarianceSchema = z.object({
  originalTotal: z.number().positive(),
  revisedTotal: z.number().positive(),
  adjustedLineItems: z.array(
    BudgetLineItemSchema.pick({ id: true, category: true, estimatedAmount: true }).extend({
      delta: z.number(),
      deltaPercent: z.number(),
      rationale: z.string().max(300),
    })
  ),
  overallRationale: z.string().max(600),
  savingsOpportunities: z.array(z.string().max(200)).max(5),
});

export type BudgetVariance = z.infer<typeof BudgetVarianceSchema>;
