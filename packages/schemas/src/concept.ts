import { z } from "zod";

export const ColorPaletteSchema = z.object({
  name: z.string().max(60),
  hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  role: z.enum(["primary", "secondary", "accent", "neutral", "background"]),
});

export type ColorPalette = z.infer<typeof ColorPaletteSchema>;

export const AestheticStyleSchema = z.enum([
  "rustic",
  "modern",
  "vintage",
  "bohemian",
  "glamorous",
  "minimalist",
  "garden",
  "beachside",
  "royal",
  "industrial",
  "art-deco",
  "tropical",
]);

export type AestheticStyle = z.infer<typeof AestheticStyleSchema>;

/**
 * Concept Studio aesthetic vision for an event
 */
export const ConceptStudioSchema = z.object({
  id: z.string().uuid(),
  eventId: z.string().uuid(),
  title: z.string().min(1).max(120),
  description: z.string().max(1000),
  primaryStyle: AestheticStyleSchema,
  secondaryStyle: AestheticStyleSchema.optional(),
  colorPalette: z.array(ColorPaletteSchema).min(2).max(6),
  moodKeywords: z.array(z.string().max(30)).min(3).max(12),
  inspirationUrls: z.array(z.string().url()).max(10).default([]),
  venue: z.object({
    indoorOutdoor: z.enum(["indoor", "outdoor", "both"]),
    setting: z.string().max(100),
    capacity: z.number().int().positive().optional(),
  }),
  florals: z.object({
    style: z.string().max(100),
    flowers: z.array(z.string().max(50)).max(10),
    colors: z.array(z.string().max(30)).max(5),
  }).optional(),
  lighting: z.object({
    mood: z.enum(["romantic", "vibrant", "dramatic", "natural", "festive"]),
    types: z.array(z.string().max(50)).max(8),
  }).optional(),
  generatedAt: z.string().datetime(),
});

export type ConceptStudio = z.infer<typeof ConceptStudioSchema>;

/**
 * Event metadata schema — the root event object
 */
export const EventSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  type: z.enum([
    "wedding",
    "corporate",
    "birthday",
    "anniversary",
    "graduation",
    "baby-shower",
    "engagement",
    "conference",
    "product-launch",
    "gala",
    "festival",
    "other",
  ]),
  date: z.string().date(),
  location: z.object({
    city: z.string().min(1).max(100),
    state: z.string().max(100).optional(),
    country: z.string().length(2).default("IN"),
    venue: z.string().max(200).optional(),
  }),
  guestCount: z.number().int().positive(),
  description: z.string().max(2000).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Event = z.infer<typeof EventSchema>;
