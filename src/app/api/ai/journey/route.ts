import { NextResponse } from "next/server";
import { AiService } from "@/lib/ai/ai-service";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_STUDENT_ID;
    const journey = await db.getJourney(userId);

    return NextResponse.json({ journey });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch journey" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || DEFAULT_STUDENT_ID;

    const profile = await db.getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    let aiProfile = await db.getAiProfile(userId);
    if (!aiProfile) {
      aiProfile = await AiService.generateProfile(profile);
    }

    let matches = await db.getMatches(userId);
    if (!matches || matches.length === 0) {
      const matchRes = await AiService.generateMatches(profile, aiProfile);
      matches = matchRes.recommendations;
    }

    const journey = await AiService.generateJourney(profile, aiProfile, { recommendations: matches } as any);

    return NextResponse.json({
      success: true,
      journey,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate growth journey" }, { status: 500 });
  }
}

