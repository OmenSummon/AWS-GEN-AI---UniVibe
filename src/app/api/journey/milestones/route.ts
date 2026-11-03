import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_STUDENT_ID } from "@/lib/auth/session";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const userId = body.userId || DEFAULT_STUDENT_ID;
    const { milestoneId, completed } = body;

    const journey = await db.getJourney(userId);
    if (!journey) {
      return NextResponse.json({ error: "Journey not found" }, { status: 404 });
    }

    let completedCount = 0;
    let totalCount = 0;

    const updatedPhases = journey.phases.map((phase: any) => {
      const updatedMilestones = phase.milestones.map((m: any) => {
        totalCount++;
        if (m.id === milestoneId) {
          const isDone = completed !== undefined ? completed : !m.completed;
          if (isDone) completedCount++;
          return {
            ...m,
            completed: isDone,
            completed_at: isDone ? new Date().toISOString() : null,
          };
        }
        if (m.completed) completedCount++;
        return m;
      });

      return {
        ...phase,
        milestones: updatedMilestones,
      };
    });

    const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    const updatedJourney = {
      ...journey,
      phases: updatedPhases,
      total_milestones: totalCount,
      completed_milestones: completedCount,
      progress_pct: progressPct,
      updated_at: new Date().toISOString(),
    };

    await db.saveJourney(updatedJourney);

    return NextResponse.json({
      success: true,
      journey: updatedJourney,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update milestone" }, { status: 500 });
  }
}

