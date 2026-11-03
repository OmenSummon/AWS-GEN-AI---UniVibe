import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const organizerId = body.organizer_id || DEFAULT_ORGANIZER_ID;
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 });
    }

    const updated = await db.updateOrganizerEventStatus(params.id, organizerId, status);

    return NextResponse.json({
      success: true,
      event: updated,
      message: `Event lifecycle status updated to ${status}.`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update event status" },
      { status: 500 }
    );
  }
}

