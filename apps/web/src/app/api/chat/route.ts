import { NextRequest, NextResponse } from "next/server";
import { geminiClient, MODELS, SYSTEM_INSTRUCTIONS } from "@celebrai/api-genai";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages, eventContext } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      eventContext?: string;
    };

    const client = geminiClient();
    const systemInstruction = eventContext
      ? `${SYSTEM_INSTRUCTIONS.CHAT_ASSISTANT}\n\nEvent Context:\n${eventContext}`
      : SYSTEM_INSTRUCTIONS.CHAT_ASSISTANT;

    const lastMessage = messages[messages.length - 1]?.content ?? "";

    const stream = await client.interactions.create({
      model: MODELS.FLASH,
      system_instruction: systemInstruction,
      input: lastMessage,
      stream: true,
      store: false,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.event_type === "step.delta" &&
              chunk.delta?.type === "text" &&
              chunk.delta.text
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text));
            }
          }
        } catch (streamError) {
          controller.error(streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("[/api/chat] Error:", error);
    return NextResponse.json({ error: "Failed to stream chat" }, { status: 500 });
  }
}
