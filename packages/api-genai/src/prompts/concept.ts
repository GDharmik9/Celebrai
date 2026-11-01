export function buildConceptPrompt(params: {
  eventType: string;
  guestCount: number;
  budget: number;
  currency: string;
  stylePreferences?: string;
  colorPreferences?: string;
  venue?: string;
}): string {
  const {
    eventType,
    guestCount,
    budget,
    currency,
    stylePreferences,
    colorPreferences,
    venue,
  } = params;

  return `Design a comprehensive aesthetic concept vision for a ${eventType} event.

Guest Count: ${guestCount}
Budget: ${currency} ${budget.toLocaleString("en-IN")}
${venue ? `Venue/Setting: ${venue}` : ""}
${stylePreferences ? `Style Preferences: ${stylePreferences}` : ""}
${colorPreferences ? `Color Preferences: ${colorPreferences}` : ""}

Create a cohesive concept including:
1. Primary and secondary aesthetic styles with detailed description
2. A curated color palette (4-6 colors) with hex codes and their roles
3. 8-12 mood keywords that capture the event's essence
4. Floral recommendations (styles and flower varieties)
5. Lighting mood and recommended fixture types
6. Venue setup and layout suggestions
7. Overall narrative description (100-200 words)

The concept should be feasible within the budget and appropriate for Indian celebrations.

Respond ONLY with valid JSON matching the ConceptStudio schema.`;
}
