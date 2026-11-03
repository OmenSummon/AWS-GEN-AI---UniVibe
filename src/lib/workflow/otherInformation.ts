// ============================================================
// MODULE 4: Other Information Processor (Resources & Logistics)
// Dependencies: Budget, Financial Constraints, Venue & Location,
//               Infrastructure & Equipment, Team Composition,
//               External Support & Resources
// ============================================================

import { OrganizerAiService } from "@/lib/ai/organizer-ai";

// ── Input Interface ──────────────────────────────────────────
export interface OtherInformationInput {
    budget_financial_availability: string;
    financial_constraints_expectations: string;
    venue_location_details: string;
    infrastructure_equipment_availability: string;
    team_composition_manpower: string;
    external_support_assistance: string;
}

// ── Output Interface ─────────────────────────────────────────
export interface OtherInformationOutput {
    budget_summary: string;
    financial_constraints: string;
    venue_logistics: string;
    infrastructure: string;
    manpower: string;
    external_support: string;
    generated_at: string;
    error?: string;
}

// ── Validation ───────────────────────────────────────────────
export function validateOtherInformation(
    input: Partial<OtherInformationInput>
): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!input.budget_financial_availability?.trim())
        missing.push("Budget & Financial Availability");
    if (!input.venue_location_details?.trim())
        missing.push("Venue & Location Details");
    if (!input.team_composition_manpower?.trim())
        missing.push("Team Composition & Manpower");
    return { valid: missing.length === 0, missing };
}

// ── Processor ────────────────────────────────────────────────
export async function processOtherInformation(
    input: OtherInformationInput
): Promise<OtherInformationOutput> {
    try {
        const result = await OrganizerAiService.summarizeLogistics({
            budget_financial_availability: input.budget_financial_availability,
            financial_constraints_expectations: input.financial_constraints_expectations,
            venue_location_details: input.venue_location_details,
            infrastructure_equipment_availability: input.infrastructure_equipment_availability,
            team_composition_manpower: input.team_composition_manpower,
            external_support_assistance: input.external_support_assistance,
        });

        return {
            ...result,
            generated_at: new Date().toISOString(),
        };
    } catch (error: any) {
        return {
            budget_summary: input.budget_financial_availability || "Not specified",
            financial_constraints: input.financial_constraints_expectations || "Not specified",
            venue_logistics: input.venue_location_details || "Not specified",
            infrastructure: input.infrastructure_equipment_availability || "Not specified",
            manpower: input.team_composition_manpower || "Not specified",
            external_support: input.external_support_assistance || "Not specified",
            generated_at: new Date().toISOString(),
            error: error?.message || "Failed to process logistics data",
        };
    }
}
