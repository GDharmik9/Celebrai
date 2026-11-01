import { describe, it, expect } from "vitest";
import { createEventPlan, SHOWCASE_PRESETS } from "../apps/web/src/lib/plan-generator";
import {
  EventSchema,
  BudgetVectorSchema,
  TimelineDAGSchema,
  VendorRFPSchema,
  ConceptStudioSchema,
} from "../packages/schemas/src/index";

describe("Deterministic 4-Engine Plan Generator", () => {
  it("strictly conserves total budget: sum(B_i) === totalBudget across varied budget sizes", () => {
    const testCases = [
      { type: "wedding" as const, totalBudget: 8500000, guestCount: 350 },
      { type: "birthday" as const, totalBudget: 800000, guestCount: 80 },
      { type: "conference" as const, totalBudget: 2500000, guestCount: 300 },
      { type: "anniversary" as const, totalBudget: 1500000, guestCount: 150 },
      { type: "festival" as const, totalBudget: 12000000, guestCount: 1200 },
    ];

    for (const tc of testCases) {
      const plan = createEventPlan({
        name: `Test ${tc.type} Celebration`,
        type: tc.type,
        date: "2026-12-25",
        city: "Jaipur",
        guestCount: tc.guestCount,
        totalBudget: tc.totalBudget,
      });

      // Exact mathematical invariant: sum(B_i) === totalBudget
      const allocatedSum = plan.budget.lineItems.reduce(
        (sum, item) => sum + item.estimatedAmount,
        0
      );
      expect(allocatedSum).toBe(tc.totalBudget);

      // Validate against Zod schema
      expect(() => BudgetVectorSchema.parse(plan.budget)).not.toThrow();
    }
  });

  it("generates 3-horizon backward-scheduled DAG milestones with valid critical path", () => {
    const plan = createEventPlan({
      name: "Heritage Gala",
      type: "wedding",
      date: "2026-12-25",
      city: "Udaipur",
      guestCount: 400,
      totalBudget: 7500000,
    });

    expect(plan.timeline.milestones.length).toBeGreaterThanOrEqual(10);
    expect(plan.timeline.criticalPath.length).toBeGreaterThan(0);

    // Verify critical path IDs exist in milestones
    const milestoneIds = new Set(plan.timeline.milestones.map((m) => m.id));
    for (const cpId of plan.timeline.criticalPath) {
      expect(milestoneIds.has(cpId)).toBe(true);
    }

    // Validate against Zod schema
    expect(() => TimelineDAGSchema.parse(plan.timeline)).not.toThrow();
  });

  it("generates valid vendor RFPs and Concept Studio sensory vectors", () => {
    const plan = createEventPlan({
      name: "Cyberpunk Tech Demo Day",
      type: "conference",
      date: "2026-11-20",
      city: "Bengaluru",
      guestCount: 250,
      totalBudget: 2000000,
      aestheticStyle: "modern",
    });

    // Check RFPs
    expect(plan.rfps.length).toBeGreaterThanOrEqual(2);
    for (const rfp of plan.rfps) {
      expect(() => VendorRFPSchema.parse(rfp)).not.toThrow();
    }

    // Check Concept Studio
    expect(plan.concept.colorPalette.length).toBeGreaterThanOrEqual(3);
    expect(plan.concept.moodKeywords.length).toBeGreaterThanOrEqual(3);
    expect(() => ConceptStudioSchema.parse(plan.concept)).not.toThrow();
  });

  it("all 4 showcase presets produce valid 4-engine blueprints", () => {
    for (const preset of SHOWCASE_PRESETS) {
      const plan = createEventPlan({
        name: preset.name,
        type: preset.type,
        date: preset.date,
        city: preset.city,
        venue: preset.venue,
        guestCount: preset.guestCount,
        totalBudget: preset.totalBudget,
        aestheticStyle: preset.aestheticStyle,
        specialNotes: preset.description,
      });

      const allocatedSum = plan.budget.lineItems.reduce(
        (sum, item) => sum + item.estimatedAmount,
        0
      );
      expect(allocatedSum).toBe(preset.totalBudget);

      expect(() => EventSchema.parse(plan.event)).not.toThrow();
      expect(() => BudgetVectorSchema.parse(plan.budget)).not.toThrow();
      expect(() => TimelineDAGSchema.parse(plan.timeline)).not.toThrow();
    }
  });
});
