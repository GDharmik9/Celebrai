import { z } from "zod";

export const VendorCategorySchema = z.enum([
  "venue",
  "catering",
  "decor",
  "photography",
  "videography",
  "entertainment",
  "florals",
  "transportation",
  "beauty",
  "invitations",
  "cake",
  "security",
  "audio-visual",
]);

export type VendorCategory = z.infer<typeof VendorCategorySchema>;

/**
 * Vendor contact and profile schema
 */
export const VendorSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(150),
  category: VendorCategorySchema,
  contactName: z.string().max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url().optional(),
  city: z.string().max(100),
  rating: z.number().min(1).max(5).optional(),
  priceRange: z.enum(["budget", "mid-range", "premium", "luxury"]),
  notes: z.string().max(500).optional(),
});

export type Vendor = z.infer<typeof VendorSchema>;

/**
 * RFP (Request for Proposal) checklist item
 */
export const RFPChecklistItemSchema = z.object({
  id: z.string().uuid(),
  question: z.string().min(1).max(400),
  required: z.boolean().default(true),
  answered: z.boolean().default(false),
  answer: z.string().max(1000).optional(),
  category: z.enum([
    "pricing",
    "availability",
    "services",
    "logistics",
    "legal",
    "references",
    "deliverables",
    "payments",
  ]),
});

export type RFPChecklistItem = z.infer<typeof RFPChecklistItemSchema>;

/**
 * Full vendor RFP package
 */
export const VendorRFPSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  vendor: VendorSchema,
  checklistItems: z.array(RFPChecklistItemSchema).min(1),
  proposalDeadline: z.string().date(),
  status: z.enum(["draft", "sent", "responded", "shortlisted", "contracted", "rejected"]),
  generatedAt: z.string().datetime(),
  contractNotes: z.string().max(2000).optional(),
});

export type VendorRFP = z.infer<typeof VendorRFPSchema>;

/**
 * Gemini-generated vendor checklist response
 */
export const GeneratedVendorChecklistSchema = z.object({
  vendorCategory: VendorCategorySchema,
  checklistItems: z.array(RFPChecklistItemSchema),
  redFlags: z.array(z.string().max(300)).max(10),
  negotiationTips: z.array(z.string().max(300)).max(8),
});

export type GeneratedVendorChecklist = z.infer<typeof GeneratedVendorChecklistSchema>;
