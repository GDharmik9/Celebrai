import { z } from "zod";

/**
 * Milestone priority levels
 */
export const MilestonePrioritySchema = z.enum(["critical", "high", "medium", "low"]);

export type MilestonePriority = z.infer<typeof MilestonePrioritySchema>;

/**
 * A single DAG milestone node in the event planning timeline
 */
export const MilestoneSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(150),
  description: z.string().max(500).optional(),
  dueDate: z.string().date(),
  priority: MilestonePrioritySchema,
  category: z.enum([
    "booking",
    "payment",
    "design",
    "logistics",
    "communication",
    "vendor",
    "guest",
    "rehearsal",
    "event-day",
    "post-event",
  ]),
  dependsOn: z.array(z.string().uuid()).default([]),
  assignee: z.string().max(100).optional(),
  completed: z.boolean().default(false),
  completedAt: z.string().datetime().optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
});

export type Milestone = z.infer<typeof MilestoneSchema>;

/**
 * Full DAG timeline for an event
 */
export const TimelineDAGSchema = z.object({
  eventId: z.string().uuid(),
  eventDate: z.string().date(),
  planningStartDate: z.string().date(),
  milestones: z.array(MilestoneSchema).min(1),
  horizonWeeks: z.number().int().positive().max(104).default(12),
  criticalPath: z.array(z.string().uuid()).default([]),
  version: z.number().int().positive().default(1),
  generatedAt: z.string().datetime(),
});

export type TimelineDAG = z.infer<typeof TimelineDAGSchema>;

/**
 * Gemini-generated timeline response schema
 */
export const GeneratedTimelineSchema = z.object({
  timeline: TimelineDAGSchema,
  summary: z.string().max(800),
  riskFlags: z.array(
    z.object({
      milestoneId: z.string().uuid(),
      risk: z.string().max(300),
      mitigation: z.string().max(300),
    })
  ).max(10),
});

export type GeneratedTimeline = z.infer<typeof GeneratedTimelineSchema>;
