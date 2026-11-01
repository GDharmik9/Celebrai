import { NextRequest, NextResponse } from "next/server";
import { generateEventTimeline } from "@celebrai/api-genai";
import { EventSchema } from "@celebrai/schemas";
import { createEventPlan } from "@/lib/plan-generator";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as unknown;
    const { event: rawEvent, horizonWeeks } = body as {
      event: unknown;
      horizonWeeks?: number;
    };

    const event = EventSchema.parse(rawEvent);

    if (process.env["GOOGLE_GENERATIVE_AI_API_KEY"]) {
      try {
        const timeline = await generateEventTimeline(
          event,
          horizonWeeks !== undefined ? { horizonWeeks } : {}
        );
        return NextResponse.json({ timeline }, { status: 200 });
      } catch (geminiError) {
        console.warn("[/api/timeline] Gemini timeline generation failed, falling back to deterministic DAG:", geminiError);
      }
    }

    // Deterministic DAG generator
    const generated = createEventPlan({
      name: event.name,
      type: event.type as any,
      date: event.date,
      city: event.location.city,
      venue: event.location.venue,
      guestCount: event.guestCount,
      totalBudget: 8500000,
    });

    generated.timeline.eventId = event.id;

    return NextResponse.json({ timeline: generated.timeline }, { status: 200 });
  } catch (error) {
    console.error("[/api/timeline] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate timeline" },
      { status: 500 }
    );
  }
}
