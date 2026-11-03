import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { eventId, registrationData, consentAccepted } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    if (!consentAccepted) {
      return NextResponse.json(
        { error: "You must accept the participation guidelines to register." },
        { status: 400 }
      );
    }

    if (!registrationData?.full_name || !registrationData?.email) {
      return NextResponse.json(
        { error: "Full Name and Student Email are required." },
        { status: 400 }
      );
    }

    const registration = await db.registerForEvent(userId, eventId, registrationData);

    return NextResponse.json({
      success: true,
      registration,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to complete registration" },
      { status: 400 }
    );
  }
}

