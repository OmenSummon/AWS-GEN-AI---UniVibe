import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;

    const events = await db.getAvailableEvents({ category, search });
    return NextResponse.json({
      success: true,
      events,
      count: events.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to fetch available events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.category) {
      return NextResponse.json(
        { error: "Event name and category are required" },
        { status: 400 }
      );
    }

    const saved = await db.saveAvailableEvent(body);
    return NextResponse.json({
      success: true,
      event: saved,
      message: "Event successfully added to available_events table!",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create available event" },
      { status: 500 }
    );
  }
}

