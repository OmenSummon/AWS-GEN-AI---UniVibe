import { NextResponse } from "next/server";
import { db } from "@/lib/db/neon";
import { DEFAULT_ORGANIZER_ID } from "@/lib/auth/session";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const organizerId = searchParams.get("organizerId") || DEFAULT_ORGANIZER_ID;
    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    const events = await db.getOrganizerEvents(organizerId, { status, search });

    return NextResponse.json({ events, total: events.length });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch organizer events" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const organizerId = body.organizer_id || DEFAULT_ORGANIZER_ID;

    const newEvent = {
      id: "org-evt-" + Date.now(),
      organizer_id: organizerId,
      status: body.status || "Draft",
      current_wizard_section: body.current_wizard_section || 1,
      basics: body.basics || {
        event_name: "Untitled Event",
        event_description: "",
        event_category: "Hackathon",
        event_organizer: "Student Organization",
        event_format: "Offline",
      },
      audience: body.audience || {
        expected_participants: 100,
        target_audience: "University Students",
        participation_type: "Individual",
        geographical_reach: "College-Level",
      },
      timeline: body.timeline || {
        proposed_event_date: new Date(Date.now() + 86400000 * 30).toISOString().split("T")[0],
        event_duration: "1 Day",
        preparation_start_date: new Date().toISOString().split("T")[0],
        registration_deadline: new Date(Date.now() + 86400000 * 25).toISOString().split("T")[0],
        date_flexibility: "Flexible",
      },
      logistics: body.logistics || {
        budget_financial_availability: "",
        financial_constraints_expectations: "",
        venue_location_details: "",
        infrastructure_equipment_availability: "",
        team_composition_manpower: "",
        external_support_assistance: "",
      },
      objectives: body.objectives || {
        primary_event_objective: "",
        secondary_objectives: "",
        event_theme: "",
        expected_outcomes: "",
        key_deliverables: "",
        success_criteria: "",
        institutional_alignment: "",
        social_educational_impact: "",
      },
      registration: body.registration || {
        registration_method: "UniVibe Registration",
        registration_window: "14 Days",
        participant_eligibility: "Open to all students",
        participation_mode: "Individual",
        registration_fee: "0",
        selection_process: "First Come, First Served",
        max_registration_capacity: 150,
        waitlist_availability: "Yes",
      },
      section_ai_outputs: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const saved = await db.saveOrganizerEvent(newEvent);

    return NextResponse.json({ success: true, event: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to create organizer event" },
      { status: 500 }
    );
  }
}

