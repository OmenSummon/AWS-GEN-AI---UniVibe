import { NextResponse } from "next/server";
import { AiService } from "@/lib/ai/ai-service";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const userId = body.userId || DEFAULT_STUDENT_ID;

    let profile = await db.getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found. Please complete onboarding first." }, { status: 404 });
    }

    if (body.profileUpdates) {
      profile = await db.saveProfile({ ...profile, ...body.profileUpdates });
    }

    const aiProfile = await AiService.generateProfile(profile);

    return NextResponse.json({
      success: true,
      aiProfile,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate AI profile" }, { status: 500 });
  }
}

