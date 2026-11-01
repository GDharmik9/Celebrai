import { NextRequest, NextResponse } from "next/server";
import { renderBudgetPDF, renderRunOfShowPDF } from "@celebrai/pdf-export";
import { BudgetVectorSchema, TimelineDAGSchema } from "@celebrai/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      type: "budget" | "run-of-show";
      eventName: string;
      data: unknown;
    };

    const { type, eventName, data } = body;

    if (!eventName || !type) {
      return NextResponse.json(
        { error: "type and eventName are required" },
        { status: 400 }
      );
    }

    let pdfBuffer: Buffer;

    if (type === "budget") {
      const budget = BudgetVectorSchema.parse(data);
      pdfBuffer = await renderBudgetPDF(budget, eventName);
    } else if (type === "run-of-show") {
      const timeline = TimelineDAGSchema.parse(data);
      pdfBuffer = await renderRunOfShowPDF(timeline, eventName);
    } else {
      return NextResponse.json(
        { error: `Unsupported PDF export type: ${String(type)}` },
        { status: 400 }
      );
    }

    const filename = `${eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${type}.pdf`;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("[/api/export-pdf] Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF document" },
      { status: 500 }
    );
  }
}

