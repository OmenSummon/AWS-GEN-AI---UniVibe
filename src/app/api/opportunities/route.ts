import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { AiService } from "@/lib/ai/ai-service";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_STUDENT_ID;

    let opportunities = await db.getMatches(userId);
    if (!opportunities || opportunities.length === 0) {
      const profile = await db.getProfile(userId);
      if (profile) {
        let aiProfile = await db.getAiProfile(userId);
        if (!aiProfile) aiProfile = await AiService.generateProfile(profile);
        const matchesResult = await AiService.generateMatches(profile, aiProfile);
        opportunities = matchesResult.recommendations;
      }
    }
    return NextResponse.json({ opportunities: opportunities || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch opportunities" }, { status: 500 });
  }
}
