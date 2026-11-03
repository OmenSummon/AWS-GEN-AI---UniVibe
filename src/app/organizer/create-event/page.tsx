"use client";

import React, { useState, useCallback, Suspense } from "react";
import Link from "next/link";
import {
  Sparkles, ArrowRight, ArrowLeft, Save, Loader2,
  CheckCircle2, AlertTriangle, FileText, Users, Calendar,
  Boxes, Target, ShieldCheck, ChevronRight, ChevronLeft,
  ZapIcon, BarChart3
} from "lucide-react";

// ── Modular Workflow Imports ──────────────────────────────────
import {
  WorkflowInputState,
  WorkflowOutputState,
  WORKFLOW_SECTIONS,
  validateSection,
  aggregateFinalPlan,
  SummarizedEventInput,
  AudienceSummarizationInput,
  DateFinalizationInput,
  OtherInformationInput,
  EventObjectiveInput,
  RegistrationParticipationInput,
} from "@/lib/workflow/masterEventWorkflow";

import { processSummarizedEvent } from "@/lib/workflow/summarizedEvent";
import { processAudienceSummarization } from "@/lib/workflow/audienceSummarization";
import { processDateFinalization } from "@/lib/workflow/dateFinalization";
import { processOtherInformation } from "@/lib/workflow/otherInformation";
import { processEventObjective } from "@/lib/workflow/eventObjective";
import { processRegistrationParticipation } from "@/lib/workflow/registrationParticipation";

import { EventWizardCategory, FinalEventIntelligenceReport } from "@/types";

// ── Constants ─────────────────────────────────────────────────
const CATEGORIES: EventWizardCategory[] = [
  "Hackathon", "Technical Fest", "Workshop", "Seminar", "Conference",
  "Cultural Fest", "Sports", "Gaming", "Photography", "Music", "Entrepreneurship", "Other",
];

const SECTION_ICONS = [FileText, Users, Calendar, Boxes, Target, ShieldCheck];

// ── Default Input State ───────────────────────────────────────
const DEFAULT_INPUTS: WorkflowInputState = {
  summarizedEvent: {
    event_name: "",
    event_description: "",
    event_category: "Hackathon",
    event_organizer: "",
    event_format: "Offline",
  },
  audienceSummarization: {
    expected_participants: 100,
    target_audience: "",
    participation_type: "Individual",
    geographical_reach: "College-Level",
  },
  dateFinalization: {
    proposed_event_date: "",
    event_duration: "",
    preparation_start_date: "",
    registration_deadline: "",
    date_flexibility: "Flexible",
  },
  otherInformation: {
    budget_financial_availability: "",
    financial_constraints_expectations: "",
    venue_location_details: "",
    infrastructure_equipment_availability: "",
    team_composition_manpower: "",
    external_support_assistance: "",
  },
  eventObjective: {
    primary_event_objective: "",
    secondary_objectives: "",
    event_theme: "",
    expected_outcomes: "",
    key_deliverables: "",
    success_criteria: "",
    institutional_alignment: "",
    social_educational_impact: "",
  },
  registrationParticipation: {
    registration_method: "UniVibe Registration",
    registration_window: "",
    participant_eligibility: "",
    eligibility_restrictions: "",
    participation_mode: "Individual",
    team_size_range: "",
    registration_fee: 0,
    selection_process: "First Come, First Served",
    max_registration_capacity: 150,
    waitlist_availability: "Yes",
    certificate_document_requirements: "",
    expected_participants: 100,
    proposed_event_date: "",
  },
};

// ── Shared Field Styles ───────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] transition-colors";
const selectCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] cursor-pointer";
const labelCls = "block text-xs font-semibold text-[#150a33] mb-1";
const textareaCls =
  "w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] resize-none transition-colors";

// ─────────────────────────────────────────────────────────────
// SECTION FORM COMPONENTS (pure presentational — no nav logic)
// ─────────────────────────────────────────────────────────────

function Section1_EventBasics({
  data, onChange,
}: {
  data: SummarizedEventInput;
  onChange: (d: SummarizedEventInput) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader num={1} title="Event Basics" subtitle="Capture the fundamental details of your event." />

      <Field label="Event Name *">
        <input className={inputCls} value={data.event_name}
          onChange={e => onChange({ ...data, event_name: e.target.value })}
          placeholder="e.g. CodeStorm Hackathon 2026" />
      </Field>

      <Field label="Event Category *">
        <select className={selectCls} value={data.event_category}
          onChange={e => onChange({ ...data, event_category: e.target.value as EventWizardCategory })}>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Event Description *">
        <textarea rows={4} className={textareaCls} value={data.event_description}
          onChange={e => onChange({ ...data, event_description: e.target.value })}
          placeholder="Describe what this event is about, its format, and expected activities." />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Event Organizer">
          <input className={inputCls} value={data.event_organizer}
            onChange={e => onChange({ ...data, event_organizer: e.target.value })}
            placeholder="e.g. JIS Tech Club" />
        </Field>
        <Field label="Event Format *">
          <select className={selectCls} value={data.event_format}
            onChange={e => onChange({ ...data, event_format: e.target.value as any })}>
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function Section2_Audience({
  data, onChange,
}: {
  data: AudienceSummarizationInput;
  onChange: (d: AudienceSummarizationInput) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader num={2} title="Audience & Reach" subtitle="Define participation scope and expected attendance." />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Expected Participants *">
          <input type="number" className={inputCls} value={data.expected_participants}
            onChange={e => onChange({ ...data, expected_participants: Number(e.target.value) })}
            min={1} />
        </Field>
        <Field label="Participation Type *">
          <select className={selectCls} value={data.participation_type}
            onChange={e => onChange({ ...data, participation_type: e.target.value as any })}>
            <option value="Individual">Individual</option>
            <option value="Team-Based">Team-Based</option>
            <option value="Open Registration">Open Registration</option>
            <option value="Invitation-Based">Invitation-Based</option>
            <option value="Mixed">Mixed</option>
          </select>
        </Field>
      </div>

      <Field label="Target Audience *">
        <input className={inputCls} value={data.target_audience}
          onChange={e => onChange({ ...data, target_audience: e.target.value })}
          placeholder="e.g. B.Tech CSE, IT, AI-ML & BCA Students" />
      </Field>

      <Field label="Geographical Reach *">
        <select className={selectCls} value={data.geographical_reach}
          onChange={e => onChange({ ...data, geographical_reach: e.target.value as any })}>
          {["College-Level", "University-Level", "Inter-College", "District-Level", "State-Level", "National-Level", "International-Level"]
            .map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>
    </div>
  );
}

function Section3_Timeline({
  data, onChange,
}: {
  data: DateFinalizationInput;
  onChange: (d: DateFinalizationInput) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader num={3} title="Timeline" subtitle="Key dates, duration, and scheduling flexibility." />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Proposed Event Date *">
          <input type="date" className={inputCls} value={data.proposed_event_date}
            onChange={e => onChange({ ...data, proposed_event_date: e.target.value })} />
        </Field>
        <Field label="Registration Deadline *">
          <input type="date" className={inputCls} value={data.registration_deadline}
            onChange={e => onChange({ ...data, registration_deadline: e.target.value })} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Preparation Start Date *">
          <input type="date" className={inputCls} value={data.preparation_start_date}
            onChange={e => onChange({ ...data, preparation_start_date: e.target.value })} />
        </Field>
        <Field label="Date Flexibility *">
          <select className={selectCls} value={data.date_flexibility}
            onChange={e => onChange({ ...data, date_flexibility: e.target.value as any })}>
            <option value="Fixed">Fixed</option>
            <option value="Flexible">Flexible</option>
            <option value="Yet to Be Decided">Yet to Be Decided</option>
          </select>
        </Field>
      </div>

      <Field label="Event Duration *">
        <input className={inputCls} value={data.event_duration}
          onChange={e => onChange({ ...data, event_duration: e.target.value })}
          placeholder="e.g. 24 Hours (Overnight Hackathon)" />
      </Field>
    </div>
  );
}

function Section4_Logistics({
  data, onChange,
}: {
  data: OtherInformationInput;
  onChange: (d: OtherInformationInput) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader num={4} title="Resources & Logistics" subtitle="Budget, venue, infrastructure, and support details." />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Budget & Financial Availability *">
          <input className={inputCls} value={data.budget_financial_availability}
            onChange={e => onChange({ ...data, budget_financial_availability: e.target.value })}
            placeholder="e.g. ₹45,000 from Student Council" />
        </Field>
        <Field label="Financial Constraints">
          <input className={inputCls} value={data.financial_constraints_expectations}
            onChange={e => onChange({ ...data, financial_constraints_expectations: e.target.value })}
            placeholder="e.g. Max budget ₹60,000" />
        </Field>
      </div>

      <Field label="Venue & Location Details *">
        <input className={inputCls} value={data.venue_location_details}
          onChange={e => onChange({ ...data, venue_location_details: e.target.value })}
          placeholder="e.g. JIS University Main Campus, Labs 301–304" />
      </Field>

      <Field label="Infrastructure & Equipment Availability">
        <input className={inputCls} value={data.infrastructure_equipment_availability}
          onChange={e => onChange({ ...data, infrastructure_equipment_availability: e.target.value })}
          placeholder="e.g. High-speed Wi-Fi, 4 wireless mics, backup generators" />
      </Field>

      <Field label="Team Composition & Manpower *">
        <input className={inputCls} value={data.team_composition_manpower}
          onChange={e => onChange({ ...data, team_composition_manpower: e.target.value })}
          placeholder="e.g. 15 volunteers, 4 event leads, 2 tech coordinators" />
      </Field>

      <Field label="External Support & Resources">
        <input className={inputCls} value={data.external_support_assistance}
          onChange={e => onChange({ ...data, external_support_assistance: e.target.value })}
          placeholder="e.g. Media Club for photography; Hospitality Team" />
      </Field>
    </div>
  );
}

function Section5_Objectives({
  data, onChange,
}: {
  data: EventObjectiveInput;
  onChange: (d: EventObjectiveInput) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader num={5} title="Strategic Objectives" subtitle="Goals, outcomes, and institutional alignment." />

      <Field label="Primary Event Objective *">
        <textarea rows={2} className={textareaCls} value={data.primary_event_objective}
          onChange={e => onChange({ ...data, primary_event_objective: e.target.value })}
          placeholder="e.g. Provide hands-on exposure to applied generative AI tools." />
      </Field>

      <Field label="Secondary Objectives">
        <textarea rows={2} className={textareaCls} value={data.secondary_objectives || ""}
          onChange={e => onChange({ ...data, secondary_objectives: e.target.value })}
          placeholder="e.g. Promote cross-disciplinary teams and grow tech club membership." />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Event Theme">
          <input className={inputCls} value={data.event_theme || ""}
            onChange={e => onChange({ ...data, event_theme: e.target.value })}
            placeholder="e.g. Applied Intelligence & Future Campus Tech" />
        </Field>
        <Field label="Expected Outcomes *">
          <input className={inputCls} value={data.expected_outcomes || ""}
            onChange={e => onChange({ ...data, expected_outcomes: e.target.value })}
            placeholder="e.g. 15 completed student prototypes" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Key Deliverables">
          <input className={inputCls} value={data.key_deliverables || ""}
            onChange={e => onChange({ ...data, key_deliverables: e.target.value })}
            placeholder="e.g. Published project repos, certificates" />
        </Field>
        <Field label="Success Criteria">
          <input className={inputCls} value={data.success_criteria || ""}
            onChange={e => onChange({ ...data, success_criteria: e.target.value })}
            placeholder="e.g. > 85% participant retention rate" />
        </Field>
      </div>

      <Field label="Institutional Alignment">
        <input className={inputCls} value={data.institutional_alignment || ""}
          onChange={e => onChange({ ...data, institutional_alignment: e.target.value })}
          placeholder="e.g. Contributes to University's technical leadership goal" />
      </Field>

      <Field label="Social / Educational Impact">
        <input className={inputCls} value={data.social_educational_impact || ""}
          onChange={e => onChange({ ...data, social_educational_impact: e.target.value })}
          placeholder="e.g. Equips students with industry-deployable cloud skills" />
      </Field>
    </div>
  );
}

function Section6_Registration({
  data, onChange,
}: {
  data: RegistrationParticipationInput;
  onChange: (d: RegistrationParticipationInput) => void;
}) {
  return (
    <div className="space-y-4">
      <SectionHeader num={6} title="Registration & Eligibility" subtitle="Entry process, constraints, and capacity management." />

      <div className="grid grid-cols-2 gap-3">
        <Field label="Registration Method *">
          <select className={selectCls} value={data.registration_method}
            onChange={e => onChange({ ...data, registration_method: e.target.value as any })}>
            {["Online Form", "UniVibe Registration", "Email", "Offline Registration", "External Registration Link", "Other"]
              .map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Registration Window *">
          <input className={inputCls} value={data.registration_window}
            onChange={e => onChange({ ...data, registration_window: e.target.value })}
            placeholder="e.g. 2026-11-06 to 2026-11-18" />
        </Field>
      </div>

      <Field label="Participant Eligibility *">
        <textarea rows={2} className={textareaCls} value={data.participant_eligibility}
          onChange={e => onChange({ ...data, participant_eligibility: e.target.value })}
          placeholder="e.g. Open to all enrolled undergraduate students with valid University ID." />
      </Field>

      <Field label="Eligibility Restrictions">
        <input className={inputCls} value={data.eligibility_restrictions || ""}
          onChange={e => onChange({ ...data, eligibility_restrictions: e.target.value })}
          placeholder="e.g. Final-year students not eligible; year 1–3 only" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Participation Mode *">
          <select className={selectCls} value={data.participation_mode}
            onChange={e => onChange({ ...data, participation_mode: e.target.value as any })}>
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
            <option value="Both">Both</option>
          </select>
        </Field>
        <Field label="Team Size Range">
          <input className={inputCls} value={data.team_size_range || ""}
            onChange={e => onChange({ ...data, team_size_range: e.target.value })}
            placeholder="e.g. 2 to 4 members" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Registration Fee *">
          <input className={inputCls} value={data.registration_fee}
            onChange={e => onChange({ ...data, registration_fee: e.target.value })}
            placeholder="0 for Free, or e.g. ₹200" />
        </Field>
        <Field label="Selection Process *">
          <select className={selectCls} value={data.selection_process}
            onChange={e => onChange({ ...data, selection_process: e.target.value as any })}>
            {["First Come, First Served", "Screening", "Interview", "Audition", "Merit-Based", "Random Selection", "Invitation", "No Selection Process"]
              .map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Maximum Registration Capacity *">
          <input type="number" className={inputCls} value={data.max_registration_capacity}
            onChange={e => onChange({ ...data, max_registration_capacity: Number(e.target.value) })}
            min={1} />
        </Field>
        <Field label="Waitlist Availability *">
          <select className={selectCls} value={data.waitlist_availability}
            onChange={e => onChange({ ...data, waitlist_availability: e.target.value as any })}>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            <option value="To Be Decided">To Be Decided</option>
          </select>
        </Field>
      </div>

      <Field label="Certificate & Documentation Requirements">
        <input className={inputCls} value={data.certificate_document_requirements || ""}
          onChange={e => onChange({ ...data, certificate_document_requirements: e.target.value })}
          placeholder="e.g. Participation certificate for all; winner certificates for top 3 teams" />
      </Field>
    </div>
  );
}

// ── Reusable micro-components ─────────────────────────────────

function SectionHeader({ num, title, subtitle }: { num: number; title: string; subtitle: string }) {
  return (
    <div className="pb-1">
      <h2 className="text-base font-extrabold text-[#150a33]">
        {num}. {title}
      </h2>
      <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

// ── AI Summary Panel Content per section ─────────────────────
function AiSummaryContent({
  step, inputs, outputs,
}: {
  step: number;
  inputs: WorkflowInputState;
  outputs: WorkflowOutputState;
}) {
  if (step === 1) {
    const out = outputs.summarizedEvent;
    return out ? (
      <div className="space-y-2 text-xs text-[#334155] leading-relaxed">
        {[
          ["Event", out.bullets.event],
          ["Category", out.bullets.category],
          ["Format", out.bullets.format],
          ["Organizer", out.bullets.organizer],
          ["Overview", out.bullets.overview],
        ].map(([k, v]) => (
          <div key={k} className="flex items-start gap-1.5">
            <span className="font-bold text-[#6c35de] shrink-0">+</span>
            <div><strong>{k}:</strong> {v}</div>
          </div>
        ))}
        {out.error && <p className="text-amber-600 text-[10px] mt-1">⚠ {out.error}</p>}
      </div>
    ) : <AiSummaryDefault inputs={inputs} step={step} />;
  }

  if (step === 2) {
    const out = outputs.audienceSummarization;
    return out ? (
      <div className="space-y-2 text-xs text-[#334155] leading-relaxed">
        {[
          ["Scale", out.highlights.scale],
          ["Model", out.highlights.participation_model],
          ["Reach", out.highlights.reach],
        ].map(([k, v]) => (
          <div key={k} className="flex items-start gap-1.5">
            <span className="font-bold text-[#6c35de] shrink-0">+</span>
            <div><strong>{k}:</strong> {v}</div>
          </div>
        ))}
        {out.summary && (
          <p className="text-[#334155] leading-relaxed mt-2 border-t border-purple-100 pt-2">
            {out.summary.slice(0, 200)}{out.summary.length > 200 ? "…" : ""}
          </p>
        )}
      </div>
    ) : <AiSummaryDefault inputs={inputs} step={step} />;
  }

  if (step === 3) {
    const out = outputs.dateFinalization;
    return out ? (
      <div className="space-y-2 text-xs text-[#334155]">
        <div className="flex items-start gap-1.5">
          <span className="font-bold text-[#6c35de]">+</span>
          <div><strong>Days to Event:</strong> {out.days_to_event} days</div>
        </div>
        <div className="flex items-start gap-1.5">
          <span className="font-bold text-[#6c35de]">+</span>
          <div><strong>Reg. Window:</strong> {out.days_for_registration} days remaining</div>
        </div>
        {out.flags.length > 0 && (
          <div className="mt-2 p-2 rounded-lg bg-red-50 border border-red-200 space-y-1">
            {out.flags.map((f, i) => (
              <div key={i} className="flex items-start gap-1 text-red-700 text-[10px]">
                <AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        )}
        {out.flags.length === 0 && (
          <div className="flex items-center gap-1.5 text-emerald-600 text-[10px]">
            <CheckCircle2 className="w-3 h-3" /> Timeline validated — no conflicts detected.
          </div>
        )}
        <p className="text-[10px] text-gray-500 border-t border-purple-100 pt-2">{out.recommendations}</p>
      </div>
    ) : <AiSummaryDefault inputs={inputs} step={step} />;
  }

  if (step === 4) {
    const out = outputs.otherInformation;
    return out ? (
      <div className="space-y-2 text-xs text-[#334155]">
        {[
          ["Budget", out.budget_summary],
          ["Venue", out.venue_logistics],
          ["Team", out.manpower],
          ["External", out.external_support],
        ].map(([k, v]) => (
          <div key={k} className="flex items-start gap-1.5">
            <span className="font-bold text-[#6c35de] shrink-0">+</span>
            <div><strong>{k}:</strong> {String(v).slice(0, 80)}{String(v).length > 80 ? "…" : ""}</div>
          </div>
        ))}
      </div>
    ) : <AiSummaryDefault inputs={inputs} step={step} />;
  }

  if (step === 5) {
    const out = outputs.eventObjective;
    return out ? (
      <div className="space-y-2 text-xs text-[#334155]">
        <div className="flex items-start gap-1.5">
          <span className="font-bold text-[#6c35de]">+</span>
          <div><strong>Objective:</strong> {out.primary_objectives.slice(0, 80)}…</div>
        </div>
        {out.proposed_kpis.slice(0, 2).map((kpi, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className="font-bold text-[#6c35de]">+</span>
            <div><strong>KPI {i + 1}:</strong> {kpi.slice(0, 70)}…</div>
          </div>
        ))}
        {out.vague_objectives_identified.length > 0 && (
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-700">
            ⚠ {out.vague_objectives_identified[0]}
          </div>
        )}
      </div>
    ) : <AiSummaryDefault inputs={inputs} step={step} />;
  }

  if (step === 6) {
    const out = outputs.registrationParticipation;
    return out ? (
      <div className="space-y-2 text-xs text-[#334155]">
        <div className="flex items-start gap-1.5">
          <span className="font-bold text-[#6c35de]">+</span>
          <div><strong>Capacity:</strong> {out.capacity_vs_expected_analysis.slice(0, 80)}</div>
        </div>
        {out.student_onboarding_steps.slice(0, 2).map((s, i) => (
          <div key={i} className="flex items-start gap-1.5">
            <span className="text-[#6c35de]">{i + 1}.</span>
            <div>{s}</div>
          </div>
        ))}
        {out.contradictions_flagged.length > 0 && (
          <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-[10px] text-red-700">
            ⚠ {out.contradictions_flagged[0]}
          </div>
        )}
        {out.missing_information.length > 0 && (
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-[10px] text-amber-700">
            Missing: {out.missing_information[0]}
          </div>
        )}
      </div>
    ) : <AiSummaryDefault inputs={inputs} step={step} />;
  }

  return null;
}

function AiSummaryDefault({ inputs, step }: { inputs: WorkflowInputState; step: number }) {
  const hints: Record<number, string> = {
    1: `Event: ${inputs.summarizedEvent.event_name || "(not yet entered)"}\nCategory: ${inputs.summarizedEvent.event_category}\nFormat: ${inputs.summarizedEvent.event_format}`,
    2: `Participants: ${inputs.audienceSummarization.expected_participants}\nAudience: ${inputs.audienceSummarization.target_audience || "(not yet entered)"}\nReach: ${inputs.audienceSummarization.geographical_reach}`,
    3: `Event Date: ${inputs.dateFinalization.proposed_event_date || "—"}\nDuration: ${inputs.dateFinalization.event_duration || "—"}\nRegistration Closes: ${inputs.dateFinalization.registration_deadline || "—"}`,
    4: `Budget: ${inputs.otherInformation.budget_financial_availability || "—"}\nVenue: ${inputs.otherInformation.venue_location_details || "—"}`,
    5: `Objective: ${inputs.eventObjective.primary_event_objective || "—"}\nTheme: ${inputs.eventObjective.event_theme || "—"}`,
    6: `Method: ${inputs.registrationParticipation.registration_method}\nCapacity: ${inputs.registrationParticipation.max_registration_capacity}\nFee: ${inputs.registrationParticipation.registration_fee}`,
  };
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] text-[#6c35de] font-semibold">Current inputs</p>
      {hints[step]?.split("\n").map((line, i) => (
        <div key={i} className="flex items-start gap-1.5 text-xs text-[#334155]">
          <span className="font-bold text-[#6c35de] shrink-0">·</span>
          <span>{line}</span>
        </div>
      ))}
      <p className="text-[10px] text-gray-400 mt-2 italic">Click Refresh to generate AI analysis.</p>
    </div>
  );
}

// ── Final Report Display ──────────────────────────────────────
function FinalReportView({ report }: { report: FinalEventIntelligenceReport }) {
  const score = report.event_readiness_assessment?.readiness_score ?? 0;
  const scoreColor = score >= 80 ? "text-emerald-600" : score >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-extrabold text-[#150a33]">Final Event Intelligence Report</h2>
        <p className="text-xs text-gray-500 mt-0.5">Comprehensive AI-generated event plan ready for institutional review.</p>
      </div>

      {/* Readiness Score */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-bold text-[#6c35de] flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5" /> Readiness Score
          </span>
          <span className={`text-2xl font-black ${scoreColor}`}>{score}<span className="text-sm font-medium text-gray-400">/100</span></span>
        </div>
        <p className="text-xs text-[#334155] font-medium">{report.event_readiness_assessment?.verdict}</p>
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
          <div className="h-1.5 rounded-full bg-gradient-to-r from-[#6c35de] to-indigo-500 transition-all"
            style={{ width: `${score}%` }} />
        </div>
      </div>

      {/* Event Overview */}
      <ReportSection title="Event Overview" icon="📋">
        <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">{report.event_overview}</p>
      </ReportSection>

      <ReportSection title="Audience & Reach" icon="👥">
        <p className="text-xs text-[#334155] leading-relaxed">{report.audience_and_reach?.slice(0, 300)}…</p>
      </ReportSection>

      <ReportSection title="Timeline" icon="📅">
        <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">{report.timeline}</p>
      </ReportSection>

      <ReportSection title="Resources & Logistics" icon="📦">
        <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">{report.resources_and_logistics}</p>
      </ReportSection>

      <ReportSection title="Strategic Objectives" icon="🎯">
        <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">{report.strategic_objectives}</p>
      </ReportSection>

      <ReportSection title="KPIs & Expected Outcomes" icon="📊">
        <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">{report.kpis_and_expected_outcomes}</p>
      </ReportSection>

      <ReportSection title="Registration Policy" icon="🛡️">
        <p className="text-xs text-[#334155] leading-relaxed">{report.registration_policy}</p>
      </ReportSection>

      {/* Critical Actions */}
      {(report.event_readiness_assessment?.critical_action_items?.length ?? 0) > 0 && (
        <ReportSection title="Critical Action Items" icon="⚡">
          <ul className="space-y-1">
            {report.event_readiness_assessment.critical_action_items.map((item, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[#334155]">
                <span className="text-[#6c35de] font-bold shrink-0">{i + 1}.</span> {item}
              </li>
            ))}
          </ul>
        </ReportSection>
      )}

      {/* AI Recommendations */}
      {(report.ai_recommendations?.length ?? 0) > 0 && (
        <ReportSection title="AI Recommendations" icon="✨">
          <ul className="space-y-1">
            {report.ai_recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-[#334155]">
                <Sparkles className="w-3 h-3 text-[#6c35de] shrink-0 mt-0.5" /> {r}
              </li>
            ))}
          </ul>
        </ReportSection>
      )}
    </div>
  );
}

function ReportSection({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="p-3.5 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-2">
      <h4 className="text-xs font-bold text-[#150a33] flex items-center gap-1.5">
        <span>{icon}</span> {title}
      </h4>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MASTER WIZARD COMPONENT
// All navigation, state management, and orchestration live here.
// ─────────────────────────────────────────────────────────────

function CreateEventWorkflow() {
  // ── Workflow state ────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<WorkflowInputState>(DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<WorkflowOutputState>({});
  const [finalReport, setFinalReport] = useState<FinalEventIntelligenceReport | null>(null);

  // ── Processing state ──────────────────────────────────────
  const [analyzingStep, setAnalyzingStep] = useState<number | null>(null);
  const [generatingFinal, setGeneratingFinal] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // ── Validation ────────────────────────────────────────────
  const validation = validateSection(currentStep, inputs);
  const canProceed = validation.valid;

  // ── Input updaters (one per section — keeps master orchestration clean) ──
  const updateSummarizedEvent = useCallback(
    (d: SummarizedEventInput) => setInputs(p => ({ ...p, summarizedEvent: d })), []
  );
  const updateAudience = useCallback(
    (d: AudienceSummarizationInput) => setInputs(p => ({ ...p, audienceSummarization: d })), []
  );
  const updateTimeline = useCallback(
    (d: DateFinalizationInput) => setInputs(p => ({ ...p, dateFinalization: d })), []
  );
  const updateLogistics = useCallback(
    (d: OtherInformationInput) => setInputs(p => ({ ...p, otherInformation: d })), []
  );
  const updateObjectives = useCallback(
    (d: EventObjectiveInput) => setInputs(p => ({ ...p, eventObjective: d })), []
  );
  const updateRegistration = useCallback(
    (d: RegistrationParticipationInput) => {
      // Pass shared dependencies: expected_participants and proposed_event_date
      setInputs(p => ({
        ...p,
        registrationParticipation: {
          ...d,
          expected_participants: p.audienceSummarization.expected_participants,
          proposed_event_date: p.dateFinalization.proposed_event_date,
        },
      }));
    }, []
  );

  // ── Per-section AI analysis (independent processing branches) ──
  const runSectionAnalysis = useCallback(async (step: number) => {
    setAnalyzingStep(step);
    try {
      // Sync shared dependencies before processing Section 6
      const syncedInputs: WorkflowInputState = {
        ...inputs,
        registrationParticipation: {
          ...inputs.registrationParticipation,
          expected_participants: inputs.audienceSummarization.expected_participants,
          proposed_event_date: inputs.dateFinalization.proposed_event_date,
        },
      };

      switch (step) {
        case 1: {
          const out = await processSummarizedEvent(syncedInputs.summarizedEvent);
          setOutputs(p => ({ ...p, summarizedEvent: out }));
          break;
        }
        case 2: {
          const out = await processAudienceSummarization(syncedInputs.audienceSummarization);
          setOutputs(p => ({ ...p, audienceSummarization: out }));
          break;
        }
        case 3: {
          const out = await processDateFinalization(syncedInputs.dateFinalization);
          setOutputs(p => ({ ...p, dateFinalization: out }));
          break;
        }
        case 4: {
          const out = await processOtherInformation(syncedInputs.otherInformation);
          setOutputs(p => ({ ...p, otherInformation: out }));
          break;
        }
        case 5: {
          const out = await processEventObjective(syncedInputs.eventObjective);
          setOutputs(p => ({ ...p, eventObjective: out }));
          break;
        }
        case 6: {
          const out = await processRegistrationParticipation(syncedInputs.registrationParticipation);
          setOutputs(p => ({ ...p, registrationParticipation: out }));
          break;
        }
      }
    } catch (err) {
      console.error(`Section ${step} analysis error:`, err);
    } finally {
      setAnalyzingStep(null);
    }
  }, [inputs]);

  // ── Final aggregation (master combines all 6 outputs) ────────
  const handleGenerateFinalPlan = useCallback(async () => {
    setGeneratingFinal(true);
    try {
      // Sync shared dependencies
      const finalInputs: WorkflowInputState = {
        ...inputs,
        registrationParticipation: {
          ...inputs.registrationParticipation,
          expected_participants: inputs.audienceSummarization.expected_participants,
          proposed_event_date: inputs.dateFinalization.proposed_event_date,
        },
      };

      // Run any missing processing branches that haven't been refreshed
      const [e1, e2, e3, e4, e5, e6] = await Promise.all([
        outputs.summarizedEvent ?? processSummarizedEvent(finalInputs.summarizedEvent),
        outputs.audienceSummarization ?? processAudienceSummarization(finalInputs.audienceSummarization),
        outputs.dateFinalization ?? processDateFinalization(finalInputs.dateFinalization),
        outputs.otherInformation ?? processOtherInformation(finalInputs.otherInformation),
        outputs.eventObjective ?? processEventObjective(finalInputs.eventObjective),
        outputs.registrationParticipation ?? processRegistrationParticipation(finalInputs.registrationParticipation),
      ]);

      setOutputs({
        summarizedEvent: e1, audienceSummarization: e2, dateFinalization: e3,
        otherInformation: e4, eventObjective: e5, registrationParticipation: e6
      });

      // Aggregate all 6 outputs into the final plan
      const report = await aggregateFinalPlan(finalInputs);
      setFinalReport(report);
    } catch (err) {
      console.error("Final plan generation failed:", err);
    } finally {
      setGeneratingFinal(false);
    }
  }, [inputs, outputs]);

  // ── Draft save ────────────────────────────────────────────
  const handleSaveDraft = useCallback(async () => {
    setSavingDraft(true);
    try {
      await fetch("/api/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          basics: inputs.summarizedEvent,
          audience: inputs.audienceSummarization,
          timeline: inputs.dateFinalization,
          logistics: inputs.otherInformation,
          objectives: inputs.eventObjective,
          registration: inputs.registrationParticipation,
          section_ai_outputs: outputs,
          final_report: finalReport,
          status: "In Planning",
        }),
      });
    } catch (err) {
      console.error("Draft save failed:", err);
    } finally {
      setSavingDraft(false);
    }
  }, [inputs, outputs, finalReport]);

  // ── Navigation ────────────────────────────────────────────
  const goNext = () => {
    if (!canProceed) return;
    if (currentStep < 6) setCurrentStep(s => s + 1);
  };
  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/organizer/dashboard"
              className="p-1 rounded-lg text-gray-500 hover:text-[#150a33] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold text-[#150a33] tracking-tight">Create Event</h1>
          </div>
          <p className="text-xs text-[#645c84] ml-7">
            Build a complete, AI-assisted event proposal in 6 structured sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} disabled={savingDraft}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs font-semibold text-[#150a33] shadow-sm transition-colors flex items-center gap-1.5">
            {savingDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Draft
          </button>

          {finalReport && (
            <button onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-semibold text-[#150a33] shadow-sm flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Export Report
            </button>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Left Sidebar — Step Navigator */}
        <div className="lg:col-span-1 space-y-1.5 p-3 rounded-3xl bg-white border border-gray-150 shadow-sm h-fit">
          {WORKFLOW_SECTIONS.map((sec) => {
            const Icon = SECTION_ICONS[sec.num - 1];
            const isActive = currentStep === sec.num;
            // isComplete = section fields are fully valid (independent of currentStep)
            const isComplete = validateSection(sec.num, inputs).valid;

            return (
              <button key={sec.num}
                onClick={() => setCurrentStep(sec.num)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all ${isActive
                    ? "bg-purple-50/80 border border-purple-200"
                    : "hover:bg-gray-50 border border-transparent"
                  }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${isComplete ? "bg-emerald-500 text-white"
                  : isActive ? "bg-[#6c35de] text-white shadow-sm"
                    : "bg-gray-100 text-gray-500"
                  }`}>
                  {isComplete ? <CheckCircle2 className="w-4 h-4" /> : sec.num}
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-bold truncate ${isActive ? "text-[#6c35de]" : "text-[#150a33]"}`}>
                    {sec.title}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">{sec.subtitle}</div>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#6c35de] ml-auto shrink-0" />}
              </button>
            );
          })}

          {/* Workflow architecture info */}
          <div className="mt-3 p-3 rounded-2xl bg-[#f5f3ff] border border-purple-100">
            <div className="flex items-center gap-1.5 mb-1.5">
              <ZapIcon className="w-3 h-3 text-[#6c35de]" />
              <span className="text-[10px] font-bold text-[#6c35de]">Modular AI Workflow</span>
            </div>
            <p className="text-[10px] text-[#645c84] leading-relaxed">
              6 independent processing branches → 1 master aggregation node → Complete event plan
            </p>
          </div>
        </div>

        {/* Center + Right: Form + AI Summary */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-6">

          {/* Form Panel */}
          <div className="md:col-span-3 p-6 sm:p-7 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-5">
            {!finalReport ? (
              <>
                {/* Render active section form */}
                {currentStep === 1 && <Section1_EventBasics data={inputs.summarizedEvent} onChange={updateSummarizedEvent} />}
                {currentStep === 2 && <Section2_Audience data={inputs.audienceSummarization} onChange={updateAudience} />}
                {currentStep === 3 && <Section3_Timeline data={inputs.dateFinalization} onChange={updateTimeline} />}
                {currentStep === 4 && <Section4_Logistics data={inputs.otherInformation} onChange={updateLogistics} />}
                {currentStep === 5 && <Section5_Objectives data={inputs.eventObjective} onChange={updateObjectives} />}
                {currentStep === 6 && (
                  <Section6_Registration
                    data={inputs.registrationParticipation}
                    onChange={updateRegistration}
                  />
                )}

                {/* Validation hint */}
                {!canProceed && validation.missing.length > 0 && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-amber-700">
                      Required: {validation.missing.join(", ")}
                    </span>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <button onClick={goPrev} disabled={currentStep === 1}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#150a33] disabled:opacity-40 flex items-center gap-1.5 transition-colors">
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  {currentStep < 6 ? (
                    <button onClick={goNext} disabled={!canProceed}
                      className="px-5 py-2 rounded-xl bg-[#6c35de] hover:bg-[#7b41ee] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-purple-900/20 flex items-center gap-1.5 transition-all">
                      Save & Continue <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button onClick={handleGenerateFinalPlan} disabled={!canProceed || generatingFinal}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#6c35de] to-indigo-600 hover:from-[#7b41ee] hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs shadow-md shadow-purple-900/30 flex items-center gap-1.5 transition-all">
                      {generatingFinal
                        ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating Plan…</>
                        : <><Sparkles className="w-3.5 h-3.5" /> Generate Final Event Plan <ArrowRight className="w-3.5 h-3.5" /></>}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                <FinalReportView report={finalReport} />
                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button onClick={() => setFinalReport(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-[#150a33] flex items-center gap-1.5">
                    <ChevronLeft className="w-3.5 h-3.5" /> Edit Sections
                  </button>
                  <button onClick={handleSaveDraft} disabled={savingDraft}
                    className="px-5 py-2 rounded-xl bg-[#6c35de] text-white font-bold text-xs flex items-center gap-1.5">
                    {savingDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    Save to Draft
                  </button>
                </div>
              </>
            )}
          </div>

          {/* AI Summary Panel */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-[#f5f3ff] border border-[#e9d5ff] shadow-sm space-y-4 h-fit">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6c35de]">
                <Sparkles className="w-4 h-4" />
                <span>AI Summary</span>
              </div>
              <button
                onClick={() => runSectionAnalysis(currentStep)}
                disabled={analyzingStep === currentStep}
                className="text-[11px] font-semibold text-[#6c35de] hover:underline disabled:opacity-50">
                {analyzingStep === currentStep ? (
                  <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Analyzing…</span>
                ) : "Refresh"}
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#150a33] mb-2.5">
                {WORKFLOW_SECTIONS[currentStep - 1]?.title} Analysis
              </h4>
              <AiSummaryContent step={currentStep} inputs={inputs} outputs={outputs} />
            </div>

            {/* Processing branch status */}
            <div className="border-t border-purple-100 pt-3 space-y-1">
              <p className="text-[10px] font-bold text-[#6c35de] mb-2">Processing Branches</p>
              {WORKFLOW_SECTIONS.map(sec => {
                const hasOutput = (() => {
                  const keyMap: Record<number, keyof WorkflowOutputState> = {
                    1: "summarizedEvent", 2: "audienceSummarization", 3: "dateFinalization",
                    4: "otherInformation", 5: "eventObjective", 6: "registrationParticipation",
                  };
                  return !!outputs[keyMap[sec.num]];
                })();
                return (
                  <div key={sec.num} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${hasOutput ? "bg-emerald-500" : sec.num === currentStep ? "bg-[#6c35de]" : "bg-gray-300"
                      }`} />
                    <span className={`text-[10px] truncate ${hasOutput ? "text-emerald-700" : sec.num === currentStep ? "text-[#6c35de] font-semibold" : "text-gray-400"
                      }`}>{sec.title}</span>
                    {hasOutput && <span className="text-[9px] text-emerald-600 ml-auto shrink-0">✓ processed</span>}
                    {!hasOutput && sec.num === currentStep && <span className="text-[9px] text-[#6c35de] ml-auto shrink-0">active</span>}
                  </div>
                );
              })}
              {finalReport && (
                <div className="flex items-center gap-2 mt-1 pt-1 border-t border-purple-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-[10px] text-indigo-700 font-semibold">Master Aggregation</span>
                  <span className="text-[9px] text-indigo-600 ml-auto shrink-0">✓ complete</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page Export ───────────────────────────────────────────────
export default function CreateEventPage() {
  return (
    <Suspense fallback={<div className="text-sm text-gray-500 p-8">Loading workflow…</div>}>
      <CreateEventWorkflow />
    </Suspense>
  );
}
