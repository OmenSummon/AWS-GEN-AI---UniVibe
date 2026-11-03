import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_STUDENT_ID;
    const profile = await db.getProfile(userId);

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.student_name || !body.department || !body.year) {
      return NextResponse.json({ error: "Missing required profile fields" }, { status: 400 });
    }

    const userId = body.id || DEFAULT_STUDENT_ID;
    const updated = await db.saveProfile({
      ...body,
      id: userId,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, profile: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return POST(request);
}

