import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get("organizerId") || DEFAULT_ORGANIZER_ID;
    const event = await db.getOrganizerEventById(params.id, organizerId);

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ event });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const organizerId = body.organizer_id || DEFAULT_ORGANIZER_ID;

    const existing = await db.getOrganizerEventById(params.id, organizerId);
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const updated = await db.saveOrganizerEvent({
      ...existing,
      ...body,
      id: params.id,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, event: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update event" },
      { status: 500 }
    );
  }
}

