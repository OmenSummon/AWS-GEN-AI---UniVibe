import { NextResponse } from "next/server";
import { AiService } from "@/lib/ai/ai-service";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await AiService.askConcierge(userId, message);

    return NextResponse.json({
      success: true,
      message: response,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process message" }, { status: 500 });
  }
}

