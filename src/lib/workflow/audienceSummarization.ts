// ============================================================
// MODULE 2: Audience Summarization Processor
// Dependencies: Expected Participants, Target Audience,
//               Participation Type, Geographical Reach
// ============================================================

import { OrganizerAiService } from "@/lib/ai/organizer-ai";

// ── Input Interface ──────────────────────────────────────────
export interface AudienceSummarizationInput {
    expected_participants: number;
    target_audience: string;
    participation_type:
    | "Individual"
    | "Team-Based"
    | "Open Registration"
    | "Invitation-Based"
    | "Mixed";
    geographical_reach:
    | "College-Level"
    | "University-Level"
    | "Inter-College"
    | "District-Level"
    | "State-Level"
    | "National-Level"
    | "International-Level";
}

// ── Output Interface ─────────────────────────────────────────
export interface AudienceSummarizationOutput {
    summary: string;
    highlights: {
        scale: string;
        participation_model: string;
        reach: string;
    };
    generated_at: string;
    error?: string;
}

// ── Validation ───────────────────────────────────────────────
export function validateAudienceSummarization(
    input: Partial<AudienceSummarizationInput>
): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!input.expected_participants || input.expected_participants <= 0)
        missing.push("Expected Participants");
    if (!input.target_audience?.trim()) missing.push("Target Audience");
    if (!input.participation_type) missing.push("Participation Type");
    if (!input.geographical_reach) missing.push("Geographical Reach");
    return { valid: missing.length === 0, missing };
}

// ── Processor ────────────────────────────────────────────────
export async function processAudienceSummarization(
    input: AudienceSummarizationInput
): Promise<AudienceSummarizationOutput> {
    try {
        const summary = await OrganizerAiService.summarizeAudience({
            expected_participants: input.expected_participants,
            target_audience: input.target_audience,
            participation_type: input.participation_type,
            geographical_reach: input.geographical_reach,
        });

        return {
            summary,
            highlights: {
                scale: `${input.expected_participants} participants`,
                participation_model: input.participation_type,
                reach: input.geographical_reach,
            },
            generated_at: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            summary: "",
            highlights: {
                scale: `${input.expected_participants} participants`,
                participation_model: input.participation_type,
                reach: input.geographical_reach,
            },
            generated_at: new Date().toISOString(),
            error: error?.message || "Failed to process audience data",
        };
    }
}
