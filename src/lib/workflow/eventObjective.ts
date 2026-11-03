// ============================================================
// MODULE 5: Event Objective Processor
// Dependencies: Primary Objective, Secondary Objectives, Theme,
//               Expected Outcomes, Key Deliverables,
//               Success Criteria, Institutional Alignment,
//               Social/Educational Impact
// ============================================================

import { OrganizerAiService } from "@/lib/ai/organizer-ai";

// ── Input Interface ──────────────────────────────────────────
export interface EventObjectiveInput {
    primary_event_objective: string;
    secondary_objectives?: string;
    event_theme?: string;
    expected_outcomes?: string;
    key_deliverables?: string;
    success_criteria?: string;
    institutional_alignment?: string;
    social_educational_impact?: string;
}

// ── Output Interface ─────────────────────────────────────────
export interface EventObjectiveOutput {
    primary_objectives: string;
    secondary_objectives: string;
    vague_objectives_identified: string[];
    measurable_improvements: string[];
    proposed_kpis: string[];
    ai_proposed_targets: string[];
    committee_approved_targets: string[];
    theme_mismatches_flagged: string[];
    improvement_recommendations: string[];
    generated_at: string;
    error?: string;
}

// ── Validation ───────────────────────────────────────────────
export function validateEventObjective(
    input: Partial<EventObjectiveInput>
): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!input.primary_event_objective?.trim())
        missing.push("Primary Event Objective");
    if (!input.expected_outcomes?.trim()) missing.push("Expected Outcomes");
    return { valid: missing.length === 0, missing };
}

// ── Processor ────────────────────────────────────────────────
export async function processEventObjective(
    input: EventObjectiveInput
): Promise<EventObjectiveOutput> {
    try {
        const result = await OrganizerAiService.analyzeObjectives({
            primary_event_objective: input.primary_event_objective,
            secondary_objectives: input.secondary_objectives,
            event_theme: input.event_theme,
            expected_outcomes: input.expected_outcomes,
            key_deliverables: input.key_deliverables,
            success_criteria: input.success_criteria,
            institutional_alignment: input.institutional_alignment,
            social_educational_impact: input.social_educational_impact,
        });

        return {
            ...result,
            generated_at: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            primary_objectives: input.primary_event_objective,
            secondary_objectives: input.secondary_objectives || "None specified.",
            vague_objectives_identified: [],
            measurable_improvements: [],
            proposed_kpis: [],
            ai_proposed_targets: [],
            committee_approved_targets: [],
            theme_mismatches_flagged: [],
            improvement_recommendations: [],
            generated_at: new Date().toISOString(),
            error: error?.message || "Failed to process event objectives",
        };
    }
}
