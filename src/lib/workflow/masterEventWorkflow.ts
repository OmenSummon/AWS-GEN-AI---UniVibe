// ============================================================
// MASTER EVENT WORKFLOW — Orchestrator
// Aggregates all 6 independent processing modules and
// produces the consolidated Final Event Intelligence Report.
// Navigation, validation, and state management live in the UI layer.
// ============================================================

import { OrganizerAiService } from "@/lib/ai/organizer-ai";
import { FinalEventIntelligenceReport } from "@/types";

import {
    SummarizedEventInput,
    SummarizedEventOutput,
    validateSummarizedEvent,
} from "./summarizedEvent";

import {
    AudienceSummarizationInput,
    AudienceSummarizationOutput,
    validateAudienceSummarization,
} from "./audienceSummarization";

import {
    DateFinalizationInput,
    DateFinalizationOutput,
    validateDateFinalization,
} from "./dateFinalization";

import {
    OtherInformationInput,
    OtherInformationOutput,
    validateOtherInformation,
} from "./otherInformation";

import {
    EventObjectiveInput,
    EventObjectiveOutput,
    validateEventObjective,
} from "./eventObjective";

import {
    RegistrationParticipationInput,
    RegistrationParticipationOutput,
    validateRegistrationParticipation,
} from "./registrationParticipation";

// ── Re-export all module interfaces for convenience ──────────
export type {
    SummarizedEventInput,
    SummarizedEventOutput,
    AudienceSummarizationInput,
    AudienceSummarizationOutput,
    DateFinalizationInput,
    DateFinalizationOutput,
    OtherInformationInput,
    OtherInformationOutput,
    EventObjectiveInput,
    EventObjectiveOutput,
    RegistrationParticipationInput,
    RegistrationParticipationOutput,
};

// ── Complete Workflow State ───────────────────────────────────
export interface WorkflowInputState {
    summarizedEvent: SummarizedEventInput;
    audienceSummarization: AudienceSummarizationInput;
    dateFinalization: DateFinalizationInput;
    otherInformation: OtherInformationInput;
    eventObjective: EventObjectiveInput;
    registrationParticipation: RegistrationParticipationInput;
}

export interface WorkflowOutputState {
    summarizedEvent?: SummarizedEventOutput;
    audienceSummarization?: AudienceSummarizationOutput;
    dateFinalization?: DateFinalizationOutput;
    otherInformation?: OtherInformationOutput;
    eventObjective?: EventObjectiveOutput;
    registrationParticipation?: RegistrationParticipationOutput;
    finalReport?: FinalEventIntelligenceReport;
}

export interface WorkflowState {
    inputs: WorkflowInputState;
    outputs: WorkflowOutputState;
    currentStep: number;          // 1 – 6
    completedSteps: Set<number>;  // tracks which steps have been processed
    isGeneratingFinal: boolean;
}

// ── Section Metadata ─────────────────────────────────────────
export const WORKFLOW_SECTIONS = [
    {
        num: 1,
        key: "summarizedEvent" as const,
        title: "Event Basics",
        subtitle: "Define the core details",
    },
    {
        num: 2,
        key: "audienceSummarization" as const,
        title: "Audience & Reach",
        subtitle: "Who are you targeting?",
    },
    {
        num: 3,
        key: "dateFinalization" as const,
        title: "Timeline",
        subtitle: "Key dates and schedule",
    },
    {
        num: 4,
        key: "otherInformation" as const,
        title: "Resources & Logistics",
        subtitle: "Budget, venue and support",
    },
    {
        num: 5,
        key: "eventObjective" as const,
        title: "Strategic Objectives",
        subtitle: "Goals and expected impact",
    },
    {
        num: 6,
        key: "registrationParticipation" as const,
        title: "Registration & Eligibility",
        subtitle: "Entry, process and constraints",
    },
];

// ── Section Validation Gate ───────────────────────────────────
export function validateSection(
    sectionNum: number,
    inputs: WorkflowInputState
): { valid: boolean; missing: string[] } {
    switch (sectionNum) {
        case 1:
            return validateSummarizedEvent(inputs.summarizedEvent);
        case 2:
            return validateAudienceSummarization(inputs.audienceSummarization);
        case 3:
            return validateDateFinalization(inputs.dateFinalization);
        case 4:
            return validateOtherInformation(inputs.otherInformation);
        case 5:
            return validateEventObjective(inputs.eventObjective);
        case 6:
            return validateRegistrationParticipation(inputs.registrationParticipation);
        default:
            return { valid: false, missing: ["Unknown section"] };
    }
}

// ── Final Aggregation ─────────────────────────────────────────
// Combines all 6 outputs into one consolidated event plan by calling
// OrganizerAiService.generateFinalReport with the full event object.
export async function aggregateFinalPlan(
    inputs: WorkflowInputState
): Promise<FinalEventIntelligenceReport> {
    const eventPayload = {
        id: "workflow-" + Date.now(),
        organizer_id: "default",
        basics: {
            event_name: inputs.summarizedEvent.event_name,
            event_description: inputs.summarizedEvent.event_description,
            event_category: inputs.summarizedEvent.event_category,
            event_organizer: inputs.summarizedEvent.event_organizer,
            event_format: inputs.summarizedEvent.event_format,
        },
        audience: {
            expected_participants: inputs.audienceSummarization.expected_participants,
            target_audience: inputs.audienceSummarization.target_audience,
            participation_type: inputs.audienceSummarization.participation_type,
            geographical_reach: inputs.audienceSummarization.geographical_reach,
        },
        timeline: {
            proposed_event_date: inputs.dateFinalization.proposed_event_date,
            event_duration: inputs.dateFinalization.event_duration,
            preparation_start_date: inputs.dateFinalization.preparation_start_date,
            registration_deadline: inputs.dateFinalization.registration_deadline,
            date_flexibility: inputs.dateFinalization.date_flexibility,
        },
        logistics: {
            budget_financial_availability: inputs.otherInformation.budget_financial_availability,
            financial_constraints_expectations: inputs.otherInformation.financial_constraints_expectations,
            venue_location_details: inputs.otherInformation.venue_location_details,
            infrastructure_equipment_availability: inputs.otherInformation.infrastructure_equipment_availability,
            team_composition_manpower: inputs.otherInformation.team_composition_manpower,
            external_support_assistance: inputs.otherInformation.external_support_assistance,
        },
        objectives: {
            primary_event_objective: inputs.eventObjective.primary_event_objective,
            secondary_objectives: inputs.eventObjective.secondary_objectives,
            event_theme: inputs.eventObjective.event_theme,
            expected_outcomes: inputs.eventObjective.expected_outcomes,
            key_deliverables: inputs.eventObjective.key_deliverables,
            success_criteria: inputs.eventObjective.success_criteria,
            institutional_alignment: inputs.eventObjective.institutional_alignment,
            social_educational_impact: inputs.eventObjective.social_educational_impact,
        },
        registration: {
            registration_method: inputs.registrationParticipation.registration_method,
            registration_window: inputs.registrationParticipation.registration_window,
            participant_eligibility: inputs.registrationParticipation.participant_eligibility,
            eligibility_restrictions: inputs.registrationParticipation.eligibility_restrictions,
            participation_mode: inputs.registrationParticipation.participation_mode,
            team_size_range: inputs.registrationParticipation.team_size_range,
            registration_fee: inputs.registrationParticipation.registration_fee,
            selection_process: inputs.registrationParticipation.selection_process,
            max_registration_capacity: inputs.registrationParticipation.max_registration_capacity,
            waitlist_availability: inputs.registrationParticipation.waitlist_availability,
            certificate_document_requirements: inputs.registrationParticipation.certificate_document_requirements,
        },
        section_ai_outputs: {},
        status: "In Planning" as const,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    return OrganizerAiService.generateFinalReport(eventPayload as any);
}


// ── Progress & Completion Calculation ──────────────────────────
// Calculates overall percentage (0 - 100%) and per-section status
// for any event state (either live UI state or database row).
export function calculateEventProgress(data: any): {
  overallPercentage: number;
  completedCount: number;
  sections: Array<{
    num: number;
    title: string;
    complete: boolean;
    score: number;
  }>;
} {
  if (!data) {
    return {
      overallPercentage: 0,
      completedCount: 0,
      sections: WORKFLOW_SECTIONS.map(s => ({
        num: s.num,
        title: s.title,
        complete: false,
        score: 0,
      })),
    };
  }

  const safeParse = (v: any) => {
    if (!v) return {};
    if (typeof v === "string") {
      try { return JSON.parse(v); } catch { return {}; }
    }
    return v;
  };

  const basics = safeParse(data.summarizedEvent || data.basics);
  const audience = safeParse(data.audienceSummarization || data.audience);
  const timeline = safeParse(data.dateFinalization || data.timeline);
  const logistics = safeParse(data.otherInformation || data.logistics);
  const objectives = safeParse(data.eventObjective || data.objectives);
  const registration = safeParse(data.registrationParticipation || data.registration);

  // Section 1: Event Basics (5 required: name, description, category, organizer, format)
  const s1Fields = [
    Boolean(basics.event_name?.trim()),
    Boolean(basics.event_description?.trim()),
    Boolean(basics.event_category?.trim()),
    Boolean(basics.event_organizer?.trim()),
    Boolean(basics.event_format?.trim()),
  ];
  const s1Score = s1Fields.filter(Boolean).length / 5;

  // Section 2: Audience & Reach (4 required: expected_participants > 0, target_audience, participation_type, geographical_reach)
  const s2Fields = [
    Boolean(Number(audience.expected_participants) > 0),
    Boolean(audience.target_audience?.trim()),
    Boolean(audience.participation_type?.trim()),
    Boolean(audience.geographical_reach?.trim()),
  ];
  const s2Score = s2Fields.filter(Boolean).length / 4;

  // Section 3: Timeline (5 required: proposed_event_date, registration_deadline, preparation_start_date, date_flexibility, event_duration)
  const s3Fields = [
    Boolean(timeline.proposed_event_date?.trim()),
    Boolean(timeline.registration_deadline?.trim()),
    Boolean(timeline.preparation_start_date?.trim()),
    Boolean(timeline.date_flexibility?.trim()),
    Boolean(timeline.event_duration?.trim()),
  ];
  const s3Score = s3Fields.filter(Boolean).length / 5;

  // Section 4: Resources & Logistics (5 required: budget, constraints, venue, equipment, team)
  const s4Fields = [
    Boolean(logistics.budget_financial_availability?.trim()),
    Boolean(logistics.financial_constraints_expectations?.trim()),
    Boolean(logistics.venue_location_details?.trim()),
    Boolean(logistics.infrastructure_equipment_availability?.trim()),
    Boolean(logistics.team_composition_manpower?.trim()),
  ];
  const s4Score = s4Fields.filter(Boolean).length / 5;

  // Section 5: Strategic Objectives (8 fields)
  const s5Fields = [
    Boolean(objectives.primary_event_objective?.trim()),
    Boolean(objectives.secondary_objectives?.trim()),
    Boolean(objectives.event_theme?.trim()),
    Boolean(objectives.expected_outcomes?.trim()),
    Boolean(objectives.key_deliverables?.trim()),
    Boolean(objectives.success_criteria?.trim()),
    Boolean(objectives.institutional_alignment?.trim()),
    Boolean(objectives.social_educational_impact?.trim()),
  ];
  const s5Score = s5Fields.filter(Boolean).length / 8;

  // Section 6: Registration & Eligibility (8 fields)
  const s6Fields = [
    Boolean(registration.registration_method?.trim()),
    Boolean(registration.registration_window?.trim()),
    Boolean(registration.participant_eligibility?.trim()),
    Boolean(registration.participation_mode?.trim()),
    Boolean(registration.registration_fee !== undefined && String(registration.registration_fee).trim() !== ""),
    Boolean(registration.selection_process?.trim()),
    Boolean(Number(registration.max_registration_capacity) > 0),
    Boolean(registration.waitlist_availability?.trim()),
  ];
  const s6Score = s6Fields.filter(Boolean).length / 8;

  const sectionScores = [
    { num: 1, title: "Event Basics", score: s1Score, complete: s1Score >= 0.8 },
    { num: 2, title: "Audience & Reach", score: s2Score, complete: s2Score >= 0.75 },
    { num: 3, title: "Timeline", score: s3Score, complete: s3Score >= 0.8 },
    { num: 4, title: "Resources & Logistics", score: s4Score, complete: s4Score >= 0.8 },
    { num: 5, title: "Strategic Objectives", score: s5Score, complete: s5Score >= 0.75 },
    { num: 6, title: "Registration & Eligibility", score: s6Score, complete: s6Score >= 0.75 },
  ];

  const totalScore = sectionScores.reduce((acc, s) => acc + s.score, 0);
  const overallPercentage = Math.min(100, Math.round((totalScore / 6) * 100));
  const completedCount = sectionScores.filter(s => s.complete).length;

  return {
    overallPercentage,
    completedCount,
    sections: sectionScores,
  };
}
