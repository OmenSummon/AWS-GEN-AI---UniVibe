import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get("organizerId") || DEFAULT_ORGANIZER_ID;

    const metrics = await db.getOrganizerMetrics(organizerId);

    return NextResponse.json({ metrics });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch organizer metrics" },
      { status: 500 }
    );
  }
}

