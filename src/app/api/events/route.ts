import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || DEFAULT_STUDENT_ID;
    const category = searchParams.get("category") || undefined;
    const query = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;

    const events = await db.getEvents(userId, { category, query, type });
    const allStudentRegs = await db.getStudentRegistrations(userId);
    const activeStudentRegs = allStudentRegs.filter((r: any) => r.registration_status !== "Cancelled");

    const featuredEvent = events.find((e) => e.is_featured) || events[0] || null;

    return NextResponse.json({
      events,
      totalCount: events.length,
      registeredCount: activeStudentRegs.length,
      featuredEvent,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch events" },
      { status: 500 }
    );
  }
}

