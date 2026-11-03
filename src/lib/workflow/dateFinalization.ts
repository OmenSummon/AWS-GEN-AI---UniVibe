// ============================================================
// MODULE 3: Date Finalization Processor
// Dependencies: Proposed Event Date, Event Duration,
//               Preparation Start Date, Registration Deadline,
//               Date Flexibility
// ============================================================

import { OrganizerAiService } from "@/lib/ai/organizer-ai";

// ── Input Interface ──────────────────────────────────────────
export interface DateFinalizationInput {
    proposed_event_date: string;       // ISO date string e.g. "2026-11-20"
    event_duration: string;            // e.g. "24 Hours (Overnight)"
    preparation_start_date: string;    // ISO date string
    registration_deadline: string;     // ISO date string
    date_flexibility: "Fixed" | "Flexible" | "Yet to Be Decided";
}

// ── Output Interface ─────────────────────────────────────────
export interface DateFinalizationOutput {
    analysis: string;
    flags: string[];
    recommendations: string;
    is_valid: boolean;
    days_to_event: number;
    days_for_registration: number;
    generated_at: string;
    error?: string;
}

// ── Validation ───────────────────────────────────────────────
export function validateDateFinalization(
    input: Partial<DateFinalizationInput>
): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!input.proposed_event_date) missing.push("Proposed Event Date");
    if (!input.event_duration?.trim()) missing.push("Event Duration");
    if (!input.preparation_start_date) missing.push("Preparation Start Date");
    if (!input.registration_deadline) missing.push("Registration Deadline");
    if (!input.date_flexibility) missing.push("Date Flexibility");
    return { valid: missing.length === 0, missing };
}

// ── Processor ────────────────────────────────────────────────
export async function processDateFinalization(
    input: DateFinalizationInput
): Promise<DateFinalizationOutput> {
    try {
        const result = await OrganizerAiService.analyzeTimeline({
            proposed_event_date: input.proposed_event_date,
            event_duration: input.event_duration,
            preparation_start_date: input.preparation_start_date,
            registration_deadline: input.registration_deadline,
            date_flexibility: input.date_flexibility,
        });

        const now = new Date();
        const eventDate = new Date(input.proposed_event_date);
        const regDeadline = new Date(input.registration_deadline);

        const daysToEvent = Math.round(
            (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );
        const daysForReg = Math.round(
            (regDeadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        return {
            analysis: result.analysis,
            flags: result.flags,
            recommendations: result.recommendations,
            is_valid: result.flags.length === 0,
            days_to_event: daysToEvent,
            days_for_registration: daysForReg,
            generated_at: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            analysis: "",
            flags: [],
            recommendations: "",
            is_valid: false,
            days_to_event: 0,
            days_for_registration: 0,
            generated_at: new Date().toISOString(),
            error: error?.message || "Failed to process timeline data",
        };
    }
}
