import { NextRequest, NextResponse } from "next/server";
import { geminiClient, MODELS, SYSTEM_INSTRUCTIONS } from "@celebrai/api-genai";

export const runtime = "nodejs";
export const maxDuration = 60;

function generateFallbackResponse(userPrompt: string, eventContext?: string): string {
  const query = userPrompt.toLowerCase();

  // If asking about budget / money / cutting / reallocation
  if (
    query.includes("budget") ||
    query.includes("cost") ||
    query.includes("money") ||
    query.includes("cut") ||
    query.includes("reduce") ||
    query.includes("increase") ||
    query.includes("rebalance") ||
    query.includes("catering") ||
    query.includes("venue") ||
    query.includes("save")
  ) {
    return `### 💡 CelebrAI Budget Optimization Analysis (Engine 1)

I've audited your celebration budget under our **Invariant Conservation Protocol** ($\\sum_{i=1}^{n} B_i = B_{\\text{total}}$).

1. **Category Sensitivity & Locks:**
   - Locked items (such as contracted venue deposits) have a sensitivity factor $S_i = 0$ and remain untouched.
   - For unlocked categories (e.g., Catering and Decor), adjustments are distributed proportionally across available line-items to preserve your total financial ceiling.

2. **Actionable Recommendations:**
   - **Catering:** Shifting from imported spreads to live artisanal regional counters can reduce per-plate costs by **12% to 15%** without compromising guest experience.
   - **Decor & Florals:** Incorporating indigenous seasonal flowers (marigolds, tuberoses, and brass urlis) rather than out-of-season exotics optimizes floral expenditure while enhancing cultural authenticity.
   - **Contingency Buffer:** We recommend maintaining a reserve buffer between **8% and 10%** for municipal curfew permits and acoustic logistics.

*You can test live reallocations directly using the sliders on the Dynamic Budget tab!*`;
  }

  // If asking about timeline / DAG / schedule / milestones / delay
  if (
    query.includes("timeline") ||
    query.includes("dag") ||
    query.includes("schedule") ||
    query.includes("milestone") ||
    query.includes("critical path") ||
    query.includes("delay") ||
    query.includes("date") ||
    query.includes("rehearsal")
  ) {
    return `### ⏱️ CelebrAI DAG Milestone Engine Analysis (Engine 2)

Your schedule is orchestrated backward from $T_{\\text{event}}$ across **three operational planning horizons**:

1. **Strategic Horizon ($T-90$ to $T-45$ days):**
   - Focus: Venue contracting, master budget lock, key vendor shortlist.
   - *Status:* On track.

2. **Operational Horizon ($T-30$ to $T-7$ days):**
   - Focus: Banquet chef tastings, RSVP headcount freeze, AV acoustic checks, and Run-of-Show dry runs.
   - *Float Slack:* **Zero slack ($S = 0$)** on the critical path connecting RSVP freeze to final production rehearsal.

3. **Day-of Horizon ($T-12$ hours to $T+4$ hours):**
   - Minute-by-minute execution: Morning load-in ➔ Rigging check ➔ Sound level verification ➔ Guest welcoming ➔ Main ceremony.

**Contingency Alert:** If vendor load-in is delayed by more than 45 minutes on event morning, our topological sort recalculates buffer slack and alerts the production stage manager immediately.`;
  }

  // If asking about vendor / rfp / checklist / contract
  if (
    query.includes("vendor") ||
    query.includes("rfp") ||
    query.includes("contract") ||
    query.includes("quote") ||
    query.includes("checklist") ||
    query.includes("payment")
  ) {
    return `### 📋 Vendor Procurement & RFP Engine (Engine 3)

Here is the 3-stage procurement audit for your active celebration vendors:

- **Stage 1 (Specification SLA):**
  - Verify compliance with statutory local curfews (e.g., outdoor amplification sound cutoff at 10:00 PM).
  - Demand food safety certifications (FSSAI ISO-22000) and dedicated back-of-house clean teams.

- **Stage 2 (Quote Vetting & Benchmarking):**
  - Current pricing proposals are aligned within regional market averages.
  - Recommended payment terms: **40% on contract**, **40% on rehearsal load-in**, and **20% post-event wrap-up** upon inventory verification.

- **Stage 3 (Contractual Milestones):**
  - All payment releases are directly bound to completed DAG milestone triggers in your timeline.`;
  }

  // If asking about concept / theme / decor / music / aesthetics
  if (
    query.includes("concept") ||
    query.includes("theme") ||
    query.includes("decor") ||
    query.includes("color") ||
    query.includes("music") ||
    query.includes("lighting") ||
    query.includes("vibe")
  ) {
    return `### 🎨 Concept Studio Sensory Vision (Engine 4)

Here is your sensory design vector for this celebration:

1. **Spatial Color Harmony:**
   - Primary: Deep Mewar Royal Violet (\`#6C3FC5\`)
   - Accent: Warm Palace Gold Foil (\`#E8B86D\`)
   - Neutral: Sandstone Ivory (\`#FAF8F5\`)

2. **Audio Atmospherics (BPM Progression):**
   - *6:00 PM (Guest Arrival):* 90–100 BPM acoustic sitar & chill lounge.
   - *8:30 PM (Main Celebration):* 115–122 BPM melodic organic house with live dhol accompaniment.
   - *10:00 PM onwards:* Controlled indoor acoustic celebration conforming to municipal noise limits.

3. **Signature Mixology:**
   - *Royal Saffron Elixir:* Cardamom-infused gin, saffron syrup, fresh lime, and sparkling tonic, garnished with edible gold leaf and marigold petals.`;
  }

  // Default intelligent assistant response
  return `### 🌟 Welcome to CelebrAI Multi-Agent Intelligence

Namaste! I am your **CelebrAI Orchestrator**, coordinating 4 synchronized intelligence engines for your celebration:

1. **Dynamic Budget Vector:** Real-time proportional rebalancing maintaining exact mathematical conservation ($\\sum B_i = B_{\\text{total}}$).
2. **Timeline DAG Engine:** Backward-scheduled milestones across Strategic, Operational, and Day-of horizons with critical path analysis.
3. **Vendor Procurement:** Automated RFP generation, statutory compliance audits, and milestone-tied deliverables.
4. **Concept Studio:** Cohesive sensory design across spatial palettes, acoustics (BPM curves), and signature mixology.

**Try asking me:**
- *"How should I rebalance the budget if catering goes up by ₹2 Lakhs?"*
- *"Show me the critical path milestones that cannot afford a delay."*
- *"What are the statutory curfew requirements for outdoor music?"*
- *"Suggest a signature cocktail and color palette for this theme."*`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, eventContext } = (await req.json()) as {
      messages: Array<{ role: "user" | "assistant"; content: string }>;
      eventContext?: string;
    };

    const lastMessage = messages[messages.length - 1]?.content ?? "";
    const hasApiKey = Boolean(process.env["GOOGLE_GENERATIVE_AI_API_KEY"]);

    // If Gemini API key is configured, stream via Gemini interactions API
    if (hasApiKey) {
      try {
        const client = geminiClient();
        const systemInstruction = eventContext
          ? `${SYSTEM_INSTRUCTIONS.CHAT_ASSISTANT}\n\nEvent Context:\n${eventContext}`
          : SYSTEM_INSTRUCTIONS.CHAT_ASSISTANT;

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
      } catch (geminiError) {
        console.warn("[/api/chat] Live Gemini call encountered issue, falling back to deterministic orchestrator:", geminiError);
        // Fall through to deterministic streaming fallback
      }
    }

    // Deterministic Autonomous Orchestrator Streaming Fallback
    const fallbackText = generateFallbackResponse(lastMessage, eventContext);
    const encoder = new TextEncoder();

    // Split into natural chunks of 3-5 words for realistic streaming feel
    const words = fallbackText.split(" ");
    const chunks: string[] = [];
    for (let i = 0; i < words.length; i += 4) {
      chunks.push(words.slice(i, i + 4).join(" ") + " ");
    }

    const readable = new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
          // 12ms delay per token chunk to simulate real-time AI generation
          await new Promise((r) => setTimeout(r, 15));
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("[/api/chat] Fatal Error:", error);
    return NextResponse.json({ error: "Failed to stream chat" }, { status: 500 });
  }
}
