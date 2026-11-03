import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const eventId = url.searchParams.get("eventId") || undefined;
    const typeFilter = url.searchParams.get("type"); // "Team" | "Individual" | null

    const organizerId = DEFAULT_ORGANIZER_ID;
    let registrations = await db.getOrganizerRegistrations(organizerId, eventId);

    if (typeFilter && typeFilter !== "all") {
      registrations = registrations.filter((r: any) => {
        const rType = r.registration_data?.registration_type || (r.registration_data?.team_name ? "Team" : "Individual");
        return rType.toLowerCase() === typeFilter.toLowerCase();
      });
    }

    // Also get list of published events for the filter dropdown
    const events = await db.getEvents(organizerId);

    return NextResponse.json({
      success: true,
      registrations,
      events: events.map((e: any) => ({ id: e.id, name: e.name, category: e.category })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch registrations." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { registrationId, checkInStatus } = body;

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
    }

    const updated = await db.updateRegistrationCheckIn(
      registrationId,
      checkInStatus || "Checked In"
    );

    if (!updated) {
      return NextResponse.json({ error: "Registration not found." }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      registration: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to update check-in status." },
      { status: 500 }
    );
  }
}
