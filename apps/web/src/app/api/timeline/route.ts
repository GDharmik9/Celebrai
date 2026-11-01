import { NextRequest, NextResponse } from "next/server";
import { generateEventTimeline } from "@celebrai/api-genai";
import { EventSchema } from "@celebrai/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as unknown;
    const { event: rawEvent, horizonWeeks } = body as {
      event: unknown;
      horizonWeeks?: number;
    };

    const event = EventSchema.parse(rawEvent);
    const timeline = await generateEventTimeline(
      event,
      horizonWeeks !== undefined ? { horizonWeeks } : {}
    );

    return NextResponse.json({ timeline }, { status: 200 });
  } catch (error) {
    console.error("[/api/timeline] Error:", error);
    return NextResponse.json(
      { error: "Failed to generate timeline" },
      { status: 500 }
    );
  }
}
