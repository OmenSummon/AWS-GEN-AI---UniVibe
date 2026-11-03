import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { registrationId } = body;

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID is required" }, { status: 400 });
    }

    const cancelledReg = await db.cancelRegistration(userId, registrationId);

    return NextResponse.json({
      success: true,
      registration: cancelledReg,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to cancel registration" },
      { status: 400 }
    );
  }
}

