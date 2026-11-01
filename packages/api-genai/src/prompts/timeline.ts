import type { Event } from "@celebrai/schemas";

export function buildTimelinePrompt(event: Event, horizonWeeks = 12): string {
  return `Generate a comprehensive event planning timeline for the following event:

Event Name: ${event.name}
Event Type: ${event.type}
Event Date: ${event.date}
Location: ${event.location.city}, ${event.location.state ?? ""}, ${event.location.country}
Guest Count: ${event.guestCount}
Planning Horizon: ${horizonWeeks} weeks
${event.description ? `Additional Context: ${event.description}` : ""}

Create a DAG milestone plan with:
1. All critical booking deadlines (venue, catering, photography, etc.)
2. Payment milestones and financial checkpoints
3. Guest management tasks (invites, RSVPs, seating)
4. Design and decor decision points
5. Day-of logistics and run-of-show checkpoints
6. Post-event wrap-up tasks

Identify dependency relationships between milestones and highlight the critical path.
Flag any milestones that could become bottlenecks based on typical Indian vendor lead times.

Respond ONLY with valid JSON matching the GeneratedTimeline schema.`;
}
