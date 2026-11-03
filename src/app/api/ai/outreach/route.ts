import { NextResponse } from "next/server";
import { AiService } from "@/lib/ai/ai-service";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { opportunityName, tone } = body;

    if (!opportunityName) {
      return NextResponse.json({ error: "Opportunity name is required" }, { status: 400 });
    }

    const profile = await db.getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const outreach = await AiService.generateOutreach(profile, opportunityName, tone || profile.tone);

    return NextResponse.json({
      success: true,
      outreach,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to generate outreach" }, { status: 500 });
  }
}

