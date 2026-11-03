import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { OrganizerAiService } from "@/lib/ai/organizer-ai";
import { DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const organizerId = body.organizer_id || DEFAULT_ORGANIZER_ID;
    const { section, eventData } = body;

    const event = await db.getOrganizerEventById(params.id, organizerId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const currentEvent = eventData ? { ...event, ...eventData } : event;
    const sectionOutputs = currentEvent.section_ai_outputs || {};

    let resultOutput: any = null;

    if (section === 1 || section === "basics") {
      resultOutput = await OrganizerAiService.summarizeEventBasics(currentEvent.basics);
      sectionOutputs.summarized_event_details = resultOutput;
    } else if (section === 2 || section === "audience") {
      resultOutput = await OrganizerAiService.summarizeAudience(currentEvent.audience);
      sectionOutputs.audience_summarization = resultOutput;
    } else if (section === 3 || section === "timeline") {
      resultOutput = await OrganizerAiService.analyzeTimeline(currentEvent.timeline);
      sectionOutputs.date_finalization = resultOutput;
    } else if (section === 4 || section === "logistics") {
      resultOutput = await OrganizerAiService.summarizeLogistics(currentEvent.logistics);
      sectionOutputs.other_information_summarization = resultOutput;
    } else if (section === 5 || section === "objectives") {
      resultOutput = await OrganizerAiService.analyzeObjectives(currentEvent.objectives);
      sectionOutputs.objective_intelligence_report = resultOutput;
    } else if (section === 6 || section === "registration") {
      resultOutput = await OrganizerAiService.analyzeRegistration(
        currentEvent.registration,
        currentEvent.audience.expected_participants
      );
      sectionOutputs.registration_intelligence_report = resultOutput;
    } else if (section === "final" || section === 7) {
      const finalReport = await OrganizerAiService.generateFinalReport(currentEvent);
      currentEvent.final_report = finalReport;
      currentEvent.section_ai_outputs = finalReport.section_summaries;
      await db.saveOrganizerEvent(currentEvent);
      return NextResponse.json({
        success: true,
        final_report: finalReport,
        event: currentEvent,
      });
    }

    currentEvent.section_ai_outputs = sectionOutputs;
    await db.saveOrganizerEvent(currentEvent);

    return NextResponse.json({
      success: true,
      section,
      output: resultOutput,
      section_ai_outputs: sectionOutputs,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to analyze event section" },
      { status: 500 }
    );
  }
}

