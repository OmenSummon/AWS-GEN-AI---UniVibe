// ============================================================
// MODULE 6: Registration & Participation Processor
// Dependencies: Registration Method, Registration Window,
//               Participant Eligibility, Eligibility Restrictions,
//               Participation Mode, Team Size Range, Registration Fee,
//               Selection Process, Max Capacity, Waitlist Availability,
//               Certificate Requirements, Expected Participants (shared),
//               Proposed Event Date (shared)
// ============================================================

import { OrganizerAiService } from "@/lib/ai/organizer-ai";

// ── Input Interface ──────────────────────────────────────────
export interface RegistrationParticipationInput {
    registration_method:
    | "Online Form"
    | "UniVibe Registration"
    | "Email"
    | "Offline Registration"
    | "External Registration Link"
    | "Other";
    registration_window: string;
    participant_eligibility: string;
    eligibility_restrictions?: string;
    participation_mode: "Individual" | "Team" | "Both";
    team_size_range?: string;
    registration_fee: string | number;
    selection_process:
    | "First Come, First Served"
    | "Screening"
    | "Interview"
    | "Audition"
    | "Merit-Based"
    | "Random Selection"
    | "Invitation"
    | "No Selection Process";
    max_registration_capacity: number;
    waitlist_availability: "Yes" | "No" | "To Be Decided";
    certificate_document_requirements?: string;
    // Shared dependencies passed from master
    expected_participants: number;
    proposed_event_date: string;
}

// ── Output Interface ─────────────────────────────────────────
export interface RegistrationParticipationOutput {
    date_validations: string[];
    capacity_vs_expected_analysis: string;
    eligibility_policy: string;
    missing_information: string[];
    student_onboarding_steps: string[];
    contradictions_flagged: string[];
    generated_at: string;
    error?: string;
}

// ── Validation ───────────────────────────────────────────────
export function validateRegistrationParticipation(
    input: Partial<RegistrationParticipationInput>
): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!input.registration_method) missing.push("Registration Method");
    if (!input.registration_window?.trim()) missing.push("Registration Window");
    if (!input.participant_eligibility?.trim())
        missing.push("Participant Eligibility");
    if (!input.participation_mode) missing.push("Participation Mode");
    if (
        input.registration_fee === undefined ||
        input.registration_fee === null ||
        input.registration_fee === ""
    )
        missing.push("Registration Fee");
    if (!input.selection_process) missing.push("Selection Process");
    if (!input.max_registration_capacity || input.max_registration_capacity <= 0)
        missing.push("Maximum Registration Capacity");
    if (!input.waitlist_availability) missing.push("Waitlist Availability");
    return { valid: missing.length === 0, missing };
}

// ── Processor ────────────────────────────────────────────────
export async function processRegistrationParticipation(
    input: RegistrationParticipationInput
): Promise<RegistrationParticipationOutput> {
    try {
        const result = await OrganizerAiService.analyzeRegistration(
            {
                registration_method: input.registration_method,
                registration_window: input.registration_window,
                participant_eligibility: input.participant_eligibility,
                eligibility_restrictions: input.eligibility_restrictions,
                participation_mode: input.participation_mode,
                team_size_range: input.team_size_range,
                registration_fee: input.registration_fee,
                selection_process: input.selection_process,
                max_registration_capacity: input.max_registration_capacity,
                waitlist_availability: input.waitlist_availability,
                certificate_document_requirements: input.certificate_document_requirements,
            },
            input.expected_participants
        );

        return {
            ...result,
            generated_at: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            date_validations: [],
            capacity_vs_expected_analysis: `Capacity: ${input.max_registration_capacity} | Expected: ${input.expected_participants}`,
            eligibility_policy: input.participant_eligibility,
            missing_information: [],
            student_onboarding_steps: [],
            contradictions_flagged: [],
            generated_at: new Date().toISOString(),
            error: error?.message || "Failed to process registration data",
        };
    }
}
