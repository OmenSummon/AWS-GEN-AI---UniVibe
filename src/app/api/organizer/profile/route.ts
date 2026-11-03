import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get("organizerId") || DEFAULT_ORGANIZER_ID;
    const profile = await db.getOrganizerProfile(organizerId);

    return NextResponse.json({ profile });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch organizer profile" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const organizerId = body.id || DEFAULT_ORGANIZER_ID;
    const saved = await db.saveOrganizerProfile({ ...body, id: organizerId });

    return NextResponse.json({ success: true, profile: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to save organizer profile" },
      { status: 500 }
    );
  }
}

