import { NextResponse } from "next/server";
import { AiService } from "@/lib/ai/ai-service";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { eventName, category, audience, description } = body;

    if (!eventName || !category || !audience || !description) {
      return NextResponse.json({ error: "All event details are required" }, { status: 400 });
    }

    const marketing = await AiService.generateEventMarketing(userId, eventName, category, audience, description);

    return NextResponse.json({
      success: true,
      marketing,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate event marketing" }, { status: 500 });
  }
}

