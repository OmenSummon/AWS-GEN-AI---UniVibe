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
    const rawId = params.id;
    const eventId = decodeURIComponent(rawId);

    let event: any = null;
    if (eventId === "latest") {
      const events = await db.getOrganizerEvents(organizerId);
      event = events.find((e: any) => e.status === "In Planning" || e.status === "Draft") || events[0] || null;
    } else {
      event = await db.getOrganizerEventById(eventId, organizerId);
      
      // Fallback: If direct query did not find it, search through organizer events list
      if (!event) {
        const events = await db.getOrganizerEvents(organizerId);
        event = events.find((e: any) => e.id === eventId || e.id === rawId) || null;
      }
    }

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
    const eventId = decodeURIComponent(params.id);

    const existing = await db.getOrganizerEventById(eventId, organizerId);
    if (!existing) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const updated = await db.saveOrganizerEvent({
      ...existing,
      ...body,
      id: eventId,
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rawId = params.id;
    const eventId = decodeURIComponent(rawId);

    await db.deleteOrganizerEvent(eventId);

    return NextResponse.json({
      success: true,
      message: "Event successfully deleted from database",
      id: eventId,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to delete event" },
      { status: 500 }
    );
  }
}
