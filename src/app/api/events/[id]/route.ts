import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_STUDENT_ID;
    const eventId = params.id;

    const event = await db.getEventById(eventId, userId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch event details" },
      { status: 500 }
    );
  }
}

