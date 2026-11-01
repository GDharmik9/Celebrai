import { describe, it, expect } from "vitest";
import {
  EventSchema,
  BudgetVectorSchema,
  TimelineDAGSchema,
  VendorRFPSchema,
  ConceptStudioSchema,
} from "./packages/schemas/src/index";

describe("Celebrai Core Schemas Validation", () => {
  it("should validate a complete Event schema", () => {
    const validEvent = {
      id: "e87f2e1a-826d-4b95-a4b8-f32a514d0001",
      name: "Royal Udaipur Palace Wedding: Priya & Rohan",
      type: "wedding",
      date: "2026-12-18",
      location: {
        city: "Udaipur",
        state: "Rajasthan",
        country: "IN",
        venue: "The Oberoi Udaivilas",
      },
      guestCount: 350,
      description: "A 3-day royal heritage destination wedding.",
      createdAt: "2026-01-15T09:00:00Z",
      updatedAt: "2026-10-30T10:00:00Z",
    };

    const parsed = EventSchema.safeParse(validEvent);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe(validEvent.name);
      expect(parsed.data.guestCount).toBe(350);
    }
  });

  it("should reject an Event with an invalid UUID or missing city", () => {
    const invalidEvent = {
      id: "invalid-uuid",
      name: "Test Party",
      type: "birthday",
      date: "2026-12-18",
      location: {
        city: "", // invalid: min(1)
      },
      guestCount: -5, // invalid: positive
      createdAt: "not-a-date",
      updatedAt: "not-a-date",
    };

    const parsed = EventSchema.safeParse(invalidEvent);
    expect(parsed.success).toBe(false);
  });

  it("should validate a complete BudgetVector schema", () => {
    const validBudget = {
      eventId: "e87f2e1a-826d-4b95-a4b8-f32a514d0001",
      totalBudget: 8500000,
      currency: "INR",
      contingencyPercent: 10,
      version: 1,
      lastUpdatedAt: "2026-10-30T10:30:00Z",
      lineItems: [
        {
          id: "a1111111-1111-4111-8111-111111111111",
          category: "venue",
          label: "Palace Courtyard Lease",
          estimatedAmount: 2200000,
          currency: "INR",
          locked: true,
        },
        {
          id: "a2222222-2222-4222-8222-222222222222",
          category: "catering",
          label: "Royal Banquet",
          estimatedAmount: 6300000,
          currency: "INR",
          locked: false,
        },
      ],
    };

    const parsed = BudgetVectorSchema.safeParse(validBudget);
    expect(parsed.success).toBe(true);
  });

  it("should validate TimelineDAG milestones with dependencies", () => {
    const validTimeline = {
      eventId: "e87f2e1a-826d-4b95-a4b8-f32a514d0001",
      eventDate: "2026-12-18",
      planningStartDate: "2026-06-01",
      horizonWeeks: 28,
      version: 1,
      generatedAt: "2026-10-30T11:00:00Z",
      criticalPath: ["b1111111-1111-4111-8111-111111111111"],
      milestones: [
        {
          id: "b1111111-1111-4111-8111-111111111111",
          title: "Lock Palace Venue Lease Contract",
          description: "Sign Oberoi Udaivilas contract",
          dueDate: "2026-06-15",
          priority: "critical",
          category: "booking",
          dependsOn: [],
          completed: true,
          tags: ["venue", "critical-path"],
        },
      ],
    };

    const parsed = TimelineDAGSchema.safeParse(validTimeline);
    expect(parsed.success).toBe(true);
  });

  it("should validate Concept Studio creative vectors with hex palettes", () => {
    const validConcept = {
      id: "f1111111-1111-4111-8111-111111111111",
      eventId: "e87f2e1a-826d-4b95-a4b8-f32a514d0001",
      title: "Gilded Mewar: Royal Sunset Opulence",
      description: "An ethereal fusion of traditional royal grandeur.",
      primaryStyle: "royal",
      colorPalette: [
        { name: "Mewar Royal Violet", hex: "#6C3FC5", role: "primary" },
        { name: "Palace Gold Foil", hex: "#E8B86D", role: "accent" },
      ],
      moodKeywords: ["Regal", "Lakeside", "Gilded"],
      venue: {
        indoorOutdoor: "both",
        setting: "Heritage Lakeside Palace Courtyard",
        capacity: 400,
      },
      generatedAt: "2026-10-30T12:00:00Z",
    };

    const parsed = ConceptStudioSchema.safeParse(validConcept);
    expect(parsed.success).toBe(true);
  });
});

