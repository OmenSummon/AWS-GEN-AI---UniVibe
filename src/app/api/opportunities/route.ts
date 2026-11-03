import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_STUDENT_ID;

    const opportunities = (await db.getMatches(userId)) || [];
    return NextResponse.json({ opportunities });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch opportunities" }, { status: 500 });
  }
}

