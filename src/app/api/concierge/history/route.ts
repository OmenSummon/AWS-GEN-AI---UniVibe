import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_STUDENT_ID;

    const messages = await db.getConciergeMessages(userId);
    return NextResponse.json({ messages });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to load chat history" }, { status: 500 });
  }
}

