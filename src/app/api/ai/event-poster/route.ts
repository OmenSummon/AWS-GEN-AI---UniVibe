import { NextResponse } from "next/server";
import { AiService } from "@/lib/ai/ai-service";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { eventName, category, audience, description } = body;

    if (!eventName || !category) {
      return NextResponse.json({ error: "Event name and category are required" }, { status: 400 });
    }

    const poster = await AiService.generatePoster(
      userId,
      eventName,
      category,
      audience || "Campus Students",
      description || "Campus event"
    );

    return NextResponse.json({
      success: true,
      poster,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate event poster" }, { status: 500 });
  }
}

