import { describe, it, expect } from "vitest";
import { VendorRFPSchema, ConceptStudioSchema } from "./packages/schemas/src/index";

describe("Engine 3 & 4: Vendor RFPs and Concept Studio", () => {
  it("should validate vendor RFP with verified SLAs and checkable deliverables", () => {
    const mockRFP = {
      id: "c1111111-1111-4111-8111-111111111111",
      eventId: "e87f2e1a-826d-4b95-a4b8-f32a514d0001",
      proposalDeadline: "2026-07-15",
      status: "shortlisted" as const,
      generatedAt: "2026-06-20T10:00:00Z",
      contractNotes: "Proposal includes 4 live cooking stations.",
      vendor: {
        id: "d1111111-1111-4111-8111-111111111111",
        name: "Marwar Royal Gourmet Catering",
        category: "catering" as const,
        contactName: "Chef Vikram Rathore",
        email: "vikram@marwargourmet.com",
        city: "Udaipur",
        rating: 4.9,
        priceRange: "luxury" as const,
      },
      checklistItems: [
        {
          id: "e1111111-1111-4111-8111-111111111111",
          question: "FSSAI food safety supervisor certification verified?",
          category: "logistics" as const,
          required: true,
          answered: true,
          answer: "Yes, certified supervisor on-site.",
        },
      ],
    };

    const parsed = VendorRFPSchema.safeParse(mockRFP);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.vendor.name).toBe("Marwar Royal Gourmet Catering");
      expect(parsed.data.checklistItems[0]?.answered).toBe(true);
    }
  });

  it("should enforce valid 6-character hex codes for Concept Studio palettes", () => {
    const invalidHexConcept = {
      id: "f1111111-1111-4111-8111-111111111111",
      eventId: "e87f2e1a-826d-4b95-a4b8-f32a514d0001",
      title: "Neon Cyber Sangeet",
      description: "Futuristic sangeet decor.",
      primaryStyle: "modern" as const,
      colorPalette: [
        { name: "Broken Hex", hex: "not-a-hex", role: "primary" as const }, // Invalid hex
        { name: "Gold", hex: "#E8B86D", role: "accent" as const },
      ],
      moodKeywords: ["Cyber", "Neon", "Electric"],
      venue: {
        indoorOutdoor: "indoor" as const,
        setting: "Ballroom",
      },
      generatedAt: "2026-10-30T12:00:00Z",
    };

    const parsed = ConceptStudioSchema.safeParse(invalidHexConcept);
    expect(parsed.success).toBe(false);
  });
});

