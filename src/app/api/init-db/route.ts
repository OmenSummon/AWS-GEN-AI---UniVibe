import { NextResponse } from "next/server";
import { initNeonTables, isNeonConfigured } from "@/lib/db/neon";

export async function POST() {
  try {
    const configured = isNeonConfigured();
    const result = await initNeonTables();
    return NextResponse.json({
      configured,
      result,
      database: configured ? "Neon Serverless PostgreSQL" : "Local In-Memory / Simulated Storage (Demo Mode)",
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to initialize database" },
      { status: 500 }
    );
  }
}

