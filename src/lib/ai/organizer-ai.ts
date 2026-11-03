import {
  OrganizerEvent,
  EventBasicsData,
  AudienceReachData,
  TimelineData,
  ResourcesLogisticsData,
  StrategicObjectivesData,
  RegistrationEligibilityData,
  SectionAiOutputs,
  FinalEventIntelligenceReport
} from "@/types";
import { invokeBedrockText, getBedrockClient } from "./bedrock-client";

export class OrganizerAiService {
  // Check if live Bedrock is active
  static isBedrockActive(): boolean {
    const isBedrock = process.env.AI_PROVIDER === "bedrock";
    const { isConfigured } = getBedrockClient();
    return isBedrock && isConfigured;
  }

  // 1. SECTION 1: EVENT DETAILS SUMMARIZER
  static async summarizeEventBasics(basics: EventBasicsData): Promise<string> {
    const prompt = `
You are the UniVibe Event Intelligence Engine for campus organizers.
Analyze and summarize the following university event basics professionally:
- Event Name: ${basics.event_name}
- Category: ${basics.event_category}
- Format: ${basics.event_format}
- Organizer: ${basics.event_organizer || "Campus Student Organization"}
- Description: ${basics.event_description}

Rules:
- Provide a concise, rigorous 3-paragraph executive summary.
- NO emojis.
- DO NOT invent facts, sponsors, or venues not stated in the input.
- Maintain formal university academic tone.
`;

    if (this.isBedrockActive()) {
      try {
        const { text } = await invokeBedrockText(prompt);
        return text.trim();
      } catch (e) {
        console.warn("Bedrock basics summarization fallback:", e);
      }
    }

    return `The proposed initiative "${basics.event_name}" is structured as a ${basics.event_format.toLowerCase()} ${basics.event_category.toLowerCase()} organized by ${basics.event_organizer || "the student coordinating committee"}. The core mandate focuses on delivering structured engagement aligned with academic and co-curricular enrichment.\n\nEvent Description Synthesis: ${basics.event_description.trim()}\n\nExecution Scope: As an official ${basics.event_format} program, the format necessitates verified participant check-ins, standardized moderation protocols, and formal post-event documentation suitable for institutional records.`;
  }

  // 2. SECTION 2: AUDIENCE SUMMARIZATION
  static async summarizeAudience(audience: AudienceReachData): Promise<string> {
    const prompt = `
Analyze audience specifications for a university event:
- Expected Participants: ${audience.expected_participants}
- Target Audience: ${audience.target_audience}
- Participation Type: ${audience.participation_type}
- Geographical Reach: ${audience.geographical_reach}

Produce a structured professional audience breakdown (Targeting, Scale Feasibility, and Participation Governance). No emojis. No fabricated claims.
`;

    if (this.isBedrockActive()) {
      try {
        const { text } = await invokeBedrockText(prompt);
        return text.trim();
      } catch (e) {
        console.warn("Bedrock audience summarization fallback:", e);
      }
    }

    return `Target Demographic Analysis: The event targets ${audience.target_audience.trim()}, operating across a ${audience.geographical_reach} footprint with a projected cohort of ${audience.expected_participants} participants.\n\nParticipation Architecture: Adopting a ${audience.participation_type} operational model. For a cohort of ${audience.expected_participants}, registration thresholds require structured team check-in queues and credential verifications to prevent venue congestion.\n\nOutreach Strategy: Achieving ${audience.geographical_reach} participation necessitates coordinated promotional syndication across verified departmental communication channels at least 14 days prior to registration closure.`;
  }

  // 3. SECTION 3: TIMELINE ANALYZER
  static async analyzeTimeline(timeline: TimelineData): Promise<{
    analysis: string;
    flags: string[];
    recommendations: string;
  }> {
    const flags: string[] = [];
    const eventDate = new Date(timeline.proposed_event_date);
    const prepStart = new Date(timeline.preparation_start_date);
    const deadline = new Date(timeline.registration_deadline);
    const now = new Date();

    if (deadline > eventDate) {
      flags.push("CRITICAL CONFLICT: Registration deadline occurs AFTER the proposed event date.");
    }
    if (prepStart > eventDate) {
      flags.push("CHRONOLOGY ERROR: Preparation start date is scheduled after the proposed event date.");
    }
    const daysBetween = Math.round((eventDate.getTime() - deadline.getTime()) / (1000 * 60 * 60 * 24));
    if (daysBetween < 2 && daysBetween >= 0) {
      flags.push("CAPACITY BUFFER RISK: Registration closes less than 48 hours before the event, leaving insufficient buffer for team verification.");
    }

    const analysis = `The event is scheduled for ${timeline.proposed_event_date} with a total duration of ${timeline.event_duration}. Preparation is planned to begin on ${timeline.preparation_start_date}, and registration closes on ${timeline.registration_deadline} (Flexibility: ${timeline.date_flexibility}).`;
    const recommendations = flags.length > 0
      ? "Resolve flagged deadline inconsistencies immediately to prevent unverified on-site attendee arrivals."
      : "The chronological trajectory provides adequate lead time between registration closure and execution day for credential validation.";

    return { analysis, flags, recommendations };
  }

  // 4. SECTION 4: LOGISTICS SUMMARIZER
  static async summarizeLogistics(logistics: ResourcesLogisticsData): Promise<{
    budget_summary: string;
    financial_constraints: string;
    venue_logistics: string;
    infrastructure: string;
    manpower: string;
    external_support: string;
  }> {
    return {
      budget_summary: logistics.budget_financial_availability
        ? `Allocated Capital: ${logistics.budget_financial_availability.trim()}`
        : "Budget line items not fully itemized; preliminary sanction pending.",
      financial_constraints: logistics.financial_constraints_expectations
        ? `Fiscal Boundary Conditions: ${logistics.financial_constraints_expectations.trim()}`
        : "Standard non-profit student society operational guidelines apply.",
      venue_logistics: logistics.venue_location_details
        ? `Venue Specifications: ${logistics.venue_location_details.trim()}`
        : "Venue reservation request pending departmental clearance.",
      infrastructure: logistics.infrastructure_equipment_availability
        ? `Equipment & Power: ${logistics.infrastructure_equipment_availability.trim()}`
        : "Standard audio/visual projection and Wi-Fi access assumed.",
      manpower: logistics.team_composition_manpower
        ? `Staffing Plan: ${logistics.team_composition_manpower.trim()}`
        : "Volunteer marshals to be appointed from student council.",
      external_support: logistics.external_support_assistance
        ? `Partner Assistance: ${logistics.external_support_assistance.trim()}`
        : "Internal university resources exclusively utilized.",
    };
  }

  // 5. SECTION 5: STRATEGIC OBJECTIVE INTELLIGENCE
  static async analyzeObjectives(objectives: StrategicObjectivesData): Promise<{
    primary_objectives: string;
    secondary_objectives: string;
    vague_objectives_identified: string[];
    measurable_improvements: string[];
    proposed_kpis: string[];
    ai_proposed_targets: string[];
    committee_approved_targets: string[];
    theme_mismatches_flagged: string[];
    improvement_recommendations: string[];
  }> {
    const vagueObjectives: string[] = [];
    const measurableImprovements: string[] = [];

    if (objectives.primary_event_objective.length < 35 || objectives.primary_event_objective.toLowerCase().includes("good") || objectives.primary_event_objective.toLowerCase().includes("fun")) {
      vagueObjectives.push(`Primary objective lacks quantifiable boundary: "${objectives.primary_event_objective}"`);
      measurableImprovements.push("Anchor primary objective to a concrete benchmark (e.g. 'Equip 80+ undergraduates with deployable cloud architectures within 48 hours').");
    }

    const proposedKpis = [
      "Participant Retention Rate (target >85% across full duration)",
      "Project Completion / Submission Velocity",
      "Net Post-Event Educational Utility Score (>4.2 / 5.0)",
      "Cross-Departmental Collaboration Ratio",
    ];

    const aiProposedTargets = [
      "AI-Proposed Target: Minimum 75% verified project completion rate.",
      "AI-Proposed Target: Zero unaddressed participant safety or hardware bottlenecks.",
      "AI-Proposed Target: Publication of top 3 outputs on university showcase portal.",
    ];

    const committeeApprovedTargets = objectives.expected_outcomes
      ? [objectives.expected_outcomes.trim()]
      : ["Pending formal student affairs committee ratification."];

    const themeMismatches: string[] = [];
    if (objectives.event_theme && !objectives.primary_event_objective.toLowerCase().includes(objectives.event_theme.toLowerCase().slice(0, 4))) {
      themeMismatches.push(`Declared theme "${objectives.event_theme}" has low semantic overlap with stated objective.`);
    }

    return {
      primary_objectives: objectives.primary_event_objective,
      secondary_objectives: objectives.secondary_objectives || "None specified.",
      vague_objectives_identified: vagueObjectives,
      measurable_improvements: measurableImprovements,
      proposed_kpis: proposedKpis,
      ai_proposed_targets: aiProposedTargets,
      committee_approved_targets: committeeApprovedTargets,
      theme_mismatches_flagged: themeMismatches,
      improvement_recommendations: [
        "Formalize pre-event rubrics so participants know exact judging criteria beforehand.",
        "Secure signed sponsor or faculty mentor agreements 7 business days before event day.",
      ],
    };
  }

  // 6. SECTION 6: REGISTRATION & ELIGIBILITY INTELLIGENCE
  static async analyzeRegistration(
    registration: RegistrationEligibilityData,
    expectedParticipants: number
  ): Promise<{
    date_validations: string[];
    capacity_vs_expected_analysis: string;
    eligibility_policy: string;
    missing_information: string[];
    student_onboarding_steps: string[];
    contradictions_flagged: string[];
  }> {
    const missing: string[] = [];
    const contradictions: string[] = [];

    if (!registration.participant_eligibility || registration.participant_eligibility.length < 10) {
      missing.push("Participant eligibility criteria is underdeveloped. Specify exact GPA, department, or student status requirements.");
    }
    if (!registration.certificate_document_requirements) {
      missing.push("Certificate & documentation policy is unspecified. Clarify criteria for verified participation certificates.");
    }

    let capacityAnalysis = `Configured Maximum Capacity: ${registration.max_registration_capacity} seats | Expected Attendance: ${expectedParticipants}.`;
    if (registration.max_registration_capacity < expectedParticipants) {
      contradictions.push(`CAPACITY DEFICIT: Configured capacity (${registration.max_registration_capacity}) is lower than expected attendance (${expectedParticipants}). ${expectedParticipants - registration.max_registration_capacity} participants will be blocked.`);
    } else if (registration.max_registration_capacity > expectedParticipants * 2) {
      capacityAnalysis += " Note: Capacity ceiling is over 200% of expected cohort; verify venue seating.";
    }

    return {
      date_validations: [
        `Registration Window: ${registration.registration_window || "Standard 14-day window"}`,
        `Waitlist Protocol: ${registration.waitlist_availability === "Yes" ? "Automatic queue enabled upon capacity breach" : "Hard cutoff at capacity"}`,
      ],
      capacity_vs_expected_analysis: capacityAnalysis,
      eligibility_policy: `Eligibility Guidelines: ${registration.participant_eligibility.trim()}. Restrictions: ${registration.eligibility_restrictions || "None specified"}. Selection via ${registration.selection_process}.`,
      missing_information: missing,
      student_onboarding_steps: [
        "Student authenticates with verified university credentials.",
        "Student completes dynamic registration form with prerequisite validations.",
        "System generates unique UniVibe Registration ID with printable digital pass.",
      ],
      contradictions_flagged: contradictions,
    };
  }

  // 7. FINAL AGGREGATE EVENT INTELLIGENCE REPORT
  static async generateFinalReport(event: OrganizerEvent): Promise<FinalEventIntelligenceReport> {
    const basicsSummary = await this.summarizeEventBasics(event.basics);
    const audienceSummary = await this.summarizeAudience(event.audience);
    const timelineAnalysis = await this.analyzeTimeline(event.timeline);
    const logisticsSummary = await this.summarizeLogistics(event.logistics);
    const objectivesReport = await this.analyzeObjectives(event.objectives);
    const registrationReport = await this.analyzeRegistration(event.registration, event.audience.expected_participants);

    const sectionSummaries: SectionAiOutputs = {
      summarized_event_details: basicsSummary,
      audience_summarization: audienceSummary,
      date_finalization: timelineAnalysis,
      other_information_summarization: logisticsSummary,
      objective_intelligence_report: objectivesReport,
      registration_intelligence_report: registrationReport,
    };

    // Calculate Event Readiness Score (0-100)
    let score = 75;
    if (timelineAnalysis.flags.length === 0) score += 10;
    else score -= 15;
    if (objectivesReport.vague_objectives_identified.length === 0) score += 8;
    else score -= 5;
    if (registrationReport.contradictions_flagged.length === 0) score += 7;
    else score -= 10;
    score = Math.max(30, Math.min(98, score));

    const criticalItems: string[] = [];
    if (timelineAnalysis.flags.length > 0) criticalItems.push(...timelineAnalysis.flags);
    if (registrationReport.contradictions_flagged.length > 0) criticalItems.push(...registrationReport.contradictions_flagged);
    if (criticalItems.length === 0) criticalItems.push("Verify finalized room booking with campus facilities coordinator.");

    return {
      id: "report-" + Date.now(),
      event_id: event.id,
      event_overview: basicsSummary,
      audience_and_reach: audienceSummary,
      timeline: `${timelineAnalysis.analysis}\n\n${timelineAnalysis.recommendations}`,
      resources_and_logistics: `Budget: ${logisticsSummary.budget_summary}\nVenue: ${logisticsSummary.venue_logistics}\nStaffing: ${logisticsSummary.manpower}`,
      strategic_objectives: `Primary Objective: ${objectivesReport.primary_objectives}\nTheme Alignment: ${objectivesReport.theme_mismatches_flagged.join("; ") || "Fully aligned"}`,
      kpis_and_expected_outcomes: objectivesReport.proposed_kpis.join("\n• "),
      registration_policy: registrationReport.eligibility_policy,
      missing_information: [...registrationReport.missing_information],
      potential_risks: [
        "Potential attendee overflow if on-site walk-ins exceed registered quota.",
        "Network latency or bandwidth bottlenecks during live demonstration tracks.",
      ],
      ai_recommendations: [
        "Publish official competition rubric 5 days before the event date.",
        "Conduct an AV dry-run in the assigned venue 24 hours prior to launch.",
      ],
      event_readiness_assessment: {
        readiness_score: score,
        verdict: score >= 80 ? "Conditionally Approved for Institutional Review" : "Requires Minor Revisions Before Review",
        critical_action_items: criticalItems,
      },
      section_summaries: sectionSummaries,
      generated_at: new Date().toISOString(),
    };
  }
}

