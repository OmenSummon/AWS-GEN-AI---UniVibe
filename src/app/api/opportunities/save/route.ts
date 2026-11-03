import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { opportunityId, isSaved, isInterested } = body;

    const currentMatches = (await db.getMatches(userId)) || [];
    const updated = currentMatches.map((opp: any) => {
      if (opp.id === opportunityId) {
        return {
          ...opp,
          is_saved: isSaved !== undefined ? isSaved : opp.is_saved,
          is_interested: isInterested !== undefined ? isInterested : opp.is_interested,
        };
      }
      return opp;
    });

    await db.saveMatches(userId, updated);

    return NextResponse.json({ success: true, updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update opportunity" }, { status: 500 });
  }
}

