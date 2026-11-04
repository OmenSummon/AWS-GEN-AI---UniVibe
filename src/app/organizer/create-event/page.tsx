"use client";

import React, { useState, useCallback, Suspense, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Sparkles, ArrowRight, ArrowLeft, Save, Loader2,
  CheckCircle2, AlertTriangle, FileText, Users, Calendar,
  Boxes, Target, ShieldCheck, ChevronRight, ChevronLeft,
  ZapIcon, BarChart3, Database, RotateCcw, Edit3
} from "lucide-react";

// ── Modular Workflow Imports ──────────────────────────────────
import {
  WorkflowInputState,
  WorkflowOutputState,
  WORKFLOW_SECTIONS,
  validateSection,
  aggregateFinalPlan,
  calculateEventProgress,
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

// ── Default Input State (Cleared & Fresh for New Events) ───────
const DEFAULT_INPUTS: WorkflowInputState = {
  summarizedEvent: {
    event_name: "",
    event_description: "",
    event_category: "" as any,
    event_organizer: "",
    event_format: "" as any,
  },
  audienceSummarization: {
    expected_participants: 0,
    target_audience: "",
    participation_type: "" as any,
    geographical_reach: "" as any,
  },
  dateFinalization: {
    proposed_event_date: "",
    event_duration: "",
    preparation_start_date: "",
    registration_deadline: "",
    date_flexibility: "" as any,
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
    registration_method: "" as any,
    registration_window: "",
    participant_eligibility: "",
    eligibility_restrictions: "",
    participation_mode: "" as any,
    team_size_range: "",
    registration_fee: "",
    selection_process: "" as any,
    max_registration_capacity: 0,
    waitlist_availability: "" as any,
    certificate_document_requirements: "",
    expected_participants: 0,
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
          placeholder="e.g. CodeStorm Hackathon 2026, AI Summit, National Tech Symposium" />
      </Field>

      <Field label="Event Category *">
        <select className={selectCls} value={data.event_category || ""}
          onChange={e => onChange({ ...data, event_category: e.target.value as EventWizardCategory })}>
          <option value="" disabled>Select event category...</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>

      <Field label="Event Description *">
        <textarea rows={4} className={textareaCls} value={data.event_description}
          onChange={e => onChange({ ...data, event_description: e.target.value })}
          placeholder="Describe what this event is about, the agenda, workshops, competitions, and attendee benefits..." />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Event Organizer">
          <input className={inputCls} value={data.event_organizer}
            onChange={e => onChange({ ...data, event_organizer: e.target.value })}
            placeholder="e.g. JIS Tech Club, CSE Student Council, Robotics Society" />
        </Field>
        <Field label="Event Format *">
          <select className={selectCls} value={data.event_format || ""}
            onChange={e => onChange({ ...data, event_format: e.target.value as any })}>
            <option value="" disabled>Select format (Offline / Online / Hybrid)...</option>
            <option value="Offline">Offline (In-Person on Campus)</option>
            <option value="Online">Online (Virtual Stream / Meeting)</option>
            <option value="Hybrid">Hybrid (In-Person + Live Stream)</option>
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
          <input type="number" className={inputCls} value={data.expected_participants ? data.expected_participants : ""}
            onChange={e => onChange({ ...data, expected_participants: Number(e.target.value) || 0 })}
            placeholder="e.g. 150"
            min={1} />
        </Field>
        <Field label="Participation Type *">
          <select className={selectCls} value={data.participation_type || ""}
            onChange={e => onChange({ ...data, participation_type: e.target.value as any })}>
            <option value="" disabled>Select participation type...</option>
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
          placeholder="e.g. B.Tech Computer Science, IT, Data Science, AI-ML & BCA Students" />
      </Field>

      <Field label="Geographical Reach *">
        <select className={selectCls} value={data.geographical_reach || ""}
          onChange={e => onChange({ ...data, geographical_reach: e.target.value as any })}>
          <option value="" disabled>Select geographical reach...</option>
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
          <select className={selectCls} value={data.date_flexibility || ""}
            onChange={e => onChange({ ...data, date_flexibility: e.target.value as any })}>
            <option value="" disabled>Select date flexibility...</option>
            <option value="Fixed">Fixed</option>
            <option value="Flexible">Flexible</option>
            <option value="Yet to Be Decided">Yet to Be Decided</option>
          </select>
        </Field>
      </div>

      <Field label="Event Duration *">
        <input className={inputCls} value={data.event_duration}
          onChange={e => onChange({ ...data, event_duration: e.target.value })}
          placeholder="e.g. 24 Hours (Overnight), 2 Days, 9:00 AM - 5:00 PM IST" />
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
            placeholder="e.g. ₹50,000 from Student Council & Alumni Sponsorship" />
        </Field>
        <Field label="Financial Constraints">
          <input className={inputCls} value={data.financial_constraints_expectations}
            onChange={e => onChange({ ...data, financial_constraints_expectations: e.target.value })}
            placeholder="e.g. Max budget ₹65,000; catering capped at ₹25,000" />
        </Field>
      </div>

      <Field label="Venue & Location Details *">
        <input className={inputCls} value={data.venue_location_details}
          onChange={e => onChange({ ...data, venue_location_details: e.target.value })}
          placeholder="e.g. Main Campus Auditorium & Computer Labs 401–404" />
      </Field>

      <Field label="Infrastructure & Equipment Availability">
        <input className={inputCls} value={data.infrastructure_equipment_availability}
          onChange={e => onChange({ ...data, infrastructure_equipment_availability: e.target.value })}
          placeholder="e.g. High-speed Wi-Fi (1Gbps), 4 wireless mics, 2 projectors, backup power" />
      </Field>

      <Field label="Team Composition & Manpower *">
        <input className={inputCls} value={data.team_composition_manpower}
          onChange={e => onChange({ ...data, team_composition_manpower: e.target.value })}
          placeholder="e.g. 15 student volunteers, 4 event leads, 2 faculty advisors" />
      </Field>

      <Field label="External Support & Resources">
        <input className={inputCls} value={data.external_support_assistance}
          onChange={e => onChange({ ...data, external_support_assistance: e.target.value })}
          placeholder="e.g. Media Club for photography, Industry Mentors for project evaluation" />
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
          placeholder="e.g. Provide students with practical, industry-aligned exposure to generative AI and cloud computing" />
      </Field>

      <Field label="Secondary Objectives">
        <textarea rows={2} className={textareaCls} value={data.secondary_objectives || ""}
          onChange={e => onChange({ ...data, secondary_objectives: e.target.value })}
          placeholder="e.g. Foster cross-disciplinary peer networking, expand student tech club membership" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Event Theme">
          <input className={inputCls} value={data.event_theme || ""}
            onChange={e => onChange({ ...data, event_theme: e.target.value })}
            placeholder="e.g. Cloud Innovation, AI-Driven Future, Creative Engineering" />
        </Field>
        <Field label="Expected Outcomes *">
          <input className={inputCls} value={data.expected_outcomes || ""}
            onChange={e => onChange({ ...data, expected_outcomes: e.target.value })}
            placeholder="e.g. 20 working student prototypes, 100+ trained participants" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Key Deliverables">
          <input className={inputCls} value={data.key_deliverables || ""}
            onChange={e => onChange({ ...data, key_deliverables: e.target.value })}
            placeholder="e.g. Public GitHub repositories, pitch decks, verified digital certificates" />
        </Field>
        <Field label="Success Criteria">
          <input className={inputCls} value={data.success_criteria || ""}
            onChange={e => onChange({ ...data, success_criteria: e.target.value })}
            placeholder="e.g. >90% event completion rate, >80% positive feedback score" />
        </Field>
      </div>

      <Field label="Institutional Alignment">
        <input className={inputCls} value={data.institutional_alignment || ""}
          onChange={e => onChange({ ...data, institutional_alignment: e.target.value })}
          placeholder="e.g. Aligns with university NAAC/NBA criteria and campus innovation cell roadmap" />
      </Field>

      <Field label="Social / Educational Impact">
        <input className={inputCls} value={data.social_educational_impact || ""}
          onChange={e => onChange({ ...data, social_educational_impact: e.target.value })}
          placeholder="e.g. Equips attendees with production-grade skills and collaborative team-building experience" />
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
          <select className={selectCls} value={data.registration_method || ""}
            onChange={e => onChange({ ...data, registration_method: e.target.value as any })}>
            <option value="" disabled>Select registration method...</option>
            {["Online Form", "UniVibe Registration", "Email", "Offline Registration", "External Registration Link", "Other"]
              .map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Registration Window *">
          <input className={inputCls} value={data.registration_window}
            onChange={e => onChange({ ...data, registration_window: e.target.value })}
            placeholder="e.g. 2026-11-10 to 2026-11-24" />
        </Field>
      </div>

      <Field label="Participant Eligibility *">
        <textarea rows={2} className={textareaCls} value={data.participant_eligibility}
          onChange={e => onChange({ ...data, participant_eligibility: e.target.value })}
          placeholder="e.g. Open to all undergraduate and postgraduate students with a valid University ID" />
      </Field>

      <Field label="Eligibility Restrictions">
        <input className={inputCls} value={data.eligibility_restrictions || ""}
          onChange={e => onChange({ ...data, eligibility_restrictions: e.target.value })}
          placeholder="e.g. Teams must have at least one 1st/2nd year member; no active backlogs required" />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Participation Mode *">
          <select className={selectCls} value={data.participation_mode || ""}
            onChange={e => onChange({ ...data, participation_mode: e.target.value as any })}>
            <option value="" disabled>Select participation mode...</option>
            <option value="Individual">Individual</option>
            <option value="Team">Team</option>
            <option value="Both">Both</option>
          </select>
        </Field>
        <Field label="Team Size Range">
          <input className={inputCls} value={data.team_size_range || ""}
            onChange={e => onChange({ ...data, team_size_range: e.target.value })}
            placeholder="e.g. 2 to 4 members per team" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Registration Fee *">
          <input className={inputCls} value={data.registration_fee}
            onChange={e => onChange({ ...data, registration_fee: e.target.value })}
            placeholder="e.g. 0 for Free, or ₹200 per team" />
        </Field>
        <Field label="Selection Process *">
          <select className={selectCls} value={data.selection_process || ""}
            onChange={e => onChange({ ...data, selection_process: e.target.value as any })}>
            <option value="" disabled>Select selection process...</option>
            {["First Come, First Served", "Screening", "Interview", "Audition", "Merit-Based", "Random Selection", "Invitation", "No Selection Process"]
              .map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Maximum Registration Capacity *">
          <input type="number" className={inputCls} value={data.max_registration_capacity ? data.max_registration_capacity : ""}
            onChange={e => onChange({ ...data, max_registration_capacity: Number(e.target.value) || 0 })}
            placeholder="e.g. 150"
            min={1} />
        </Field>
        <Field label="Waitlist Availability *">
          <select className={selectCls} value={data.waitlist_availability || ""}
            onChange={e => onChange({ ...data, waitlist_availability: e.target.value as any })}>
            <option value="" disabled>Select waitlist option...</option>
            <option value="Yes">Yes (Auto-waitlist when full)</option>
            <option value="No">No (Close when full)</option>
            <option value="To Be Decided">To Be Decided</option>
          </select>
        </Field>
      </div>

      <Field label="Certificate & Documentation Requirements">
        <input className={inputCls} value={data.certificate_document_requirements || ""}
          onChange={e => onChange({ ...data, certificate_document_requirements: e.target.value })}
          placeholder="e.g. Verified digital participation certificate for all attendees; merit certificates for top 3" />
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
  const searchParams = useSearchParams();
  const requestedId = searchParams.get("id");
  const mode = searchParams.get("mode");

  // ── Workflow state ────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [inputs, setInputs] = useState<WorkflowInputState>(DEFAULT_INPUTS);
  const [outputs, setOutputs] = useState<WorkflowOutputState>({});
  const [finalReport, setFinalReport] = useState<FinalEventIntelligenceReport | null>(null);

  // ── Persistence & DB state ────────────────────────────────
  const [eventId, setEventId] = useState<string | null>(null);
  const [eventStatus, setEventStatus] = useState<"Draft" | "In Planning" | "Pending Review" | "Published">("In Planning");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // ── Processing state ──────────────────────────────────────
  const [analyzingStep, setAnalyzingStep] = useState<number | null>(null);
  const [generatingFinal, setGeneratingFinal] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [creatingEvent, setCreatingEvent] = useState(false);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // ── Auto-save refs ────────────────────────────────────────
  const isInitialMount = useRef(true);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Load event when explicit id is passed OR when mode=continue ──
  useEffect(() => {
    async function loadInitialData() {
      setIsInitialLoading(true);
      try {
        const isContinue = mode === "continue" || requestedId === "latest";
        
        let target: any = null;

        if (requestedId && requestedId !== "latest") {
          const res = await fetch(`/api/organizer/events/${requestedId}`);
          if (res.ok) {
            const data = await res.json();
            target = data?.event;
          } else {
            // Fallback: search events list in case direct id needed fallback
            const listRes = await fetch("/api/organizer/events");
            if (listRes.ok) {
              const listData = await listRes.json();
              target = (listData?.events || []).find((e: any) => e.id === requestedId);
            }
          }
        } else if (isContinue) {
          // 1. Try to fetch the latest saved draft from dedicated endpoint
          const res = await fetch("/api/organizer/events/latest");
          if (res.ok) {
            const data = await res.json();
            target = data?.event;
          } else {
            // Fallback: fetch events list and pick the most recent one
            const listRes = await fetch("/api/organizer/events");
            if (listRes.ok) {
              const listData = await listRes.json();
              const events: any[] = listData?.events || [];
              if (events.length > 0) {
                target = events.find(e => e.status === "In Planning" || e.status === "Draft") || events[0];
              }
            }
          }
        }

        if (target) {
          setEventId(target.id);
          if (target.status) {
            setEventStatus(target.status as any);
          }
          const safeObj = (v: any) => (typeof v === "string" ? JSON.parse(v) : v);
          const basics = safeObj(target.basics);
          const audience = safeObj(target.audience);
          const timeline = safeObj(target.timeline);
          const logistics = safeObj(target.logistics);
          const objectives = safeObj(target.objectives);
          const registration = safeObj(target.registration);
          const outputsData = safeObj(target.section_ai_outputs);
          const report = safeObj(target.final_report);

          // Populate cleanly from DEFAULT_INPUTS overlaid with previous details
          setInputs({
            summarizedEvent: {
              ...DEFAULT_INPUTS.summarizedEvent,
              ...(basics || {}),
            },
            audienceSummarization: {
              ...DEFAULT_INPUTS.audienceSummarization,
              ...(audience || {}),
              expected_participants: Number(audience?.expected_participants) || 0,
            },
            dateFinalization: {
              ...DEFAULT_INPUTS.dateFinalization,
              ...(timeline || {}),
            },
            otherInformation: {
              ...DEFAULT_INPUTS.otherInformation,
              ...(logistics || {}),
            },
            eventObjective: {
              ...DEFAULT_INPUTS.eventObjective,
              ...(objectives || {}),
            },
            registrationParticipation: {
              ...DEFAULT_INPUTS.registrationParticipation,
              ...(registration || {}),
              max_registration_capacity: Number(registration?.max_registration_capacity) || 0,
              expected_participants: Number(audience?.expected_participants) || 0,
              proposed_event_date: timeline?.proposed_event_date || "",
            },
          });

          if (outputsData && Object.keys(outputsData).length > 0) {
            setOutputs(outputsData);
          } else {
            setOutputs({});
          }
          if (report) {
            setFinalReport(report);
          } else {
            setFinalReport(null);
          }
          if (target.current_wizard_section && target.current_wizard_section >= 1 && target.current_wizard_section <= 6) {
            setCurrentStep(target.current_wizard_section);
          } else {
            setCurrentStep(1);
          }
          if (target.updated_at) {
            setLastSaved(new Date(target.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
          }
        } else if (!requestedId && !isContinue) {
          // Fresh new event request
          handleResetForm();
        }
      } catch (err) {
        console.warn("Failed to load requested event:", err);
      } finally {
        setIsInitialLoading(false);
      }
    }
    loadInitialData();
  }, [requestedId, mode]);

  // ── Clear / Reset to Clean Form ───────────────────────────
  const handleResetForm = () => {
    setInputs(DEFAULT_INPUTS);
    setOutputs({});
    setFinalReport(null);
    setEventId(null);
    setEventStatus("In Planning");
    setLastSaved(null);
    setCurrentStep(1);
    setCreatedSuccess(false);
  };

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

  // ── Draft save (Supports manual or background auto-save) ──
  const handleSaveDraft = useCallback(async (customStep?: number, silent = false, overrideStatus?: "Draft" | "In Planning" | "Pending Review" | "Published") => {
    if (!silent) setSavingDraft(true);
    else setIsAutoSaving(true);

    try {
      const stepToPersist = typeof customStep === "number" ? customStep : currentStep;

      // Check if all details across 6 sections are completely filled
      const progress = calculateEventProgress({
        basics: inputs.summarizedEvent,
        audience: inputs.audienceSummarization,
        timeline: inputs.dateFinalization,
        logistics: inputs.otherInformation,
        objectives: inputs.eventObjective,
        registration: inputs.registrationParticipation,
      });
      const isComplete = progress.overallPercentage === 100;

      let statusToPersist: "Draft" | "In Planning" | "Pending Review" | "Published" = "In Planning";
      if (overrideStatus) {
        statusToPersist = overrideStatus;
      } else if (eventStatus === "Published") {
        statusToPersist = "Published";
      } else if (isComplete) {
        statusToPersist = "Pending Review";
      } else {
        statusToPersist = "In Planning";
      }

      const res = await fetch("/api/organizer/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: eventId || undefined,
          basics: inputs.summarizedEvent,
          audience: inputs.audienceSummarization,
          timeline: inputs.dateFinalization,
          logistics: inputs.otherInformation,
          objectives: inputs.eventObjective,
          registration: inputs.registrationParticipation,
          section_ai_outputs: outputs,
          final_report: finalReport,
          current_wizard_section: stepToPersist,
          status: statusToPersist,
        }),
      });

      const data = await res.json();
      if (data?.event?.id) {
        setEventId(data.event.id);
      }
      setEventStatus(statusToPersist);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      return data?.event || null;
    } catch (err) {
      console.error("Draft save failed:", err);
    } finally {
      if (!silent) setSavingDraft(false);
      else setIsAutoSaving(false);
    }
  }, [eventId, currentStep, inputs, outputs, finalReport, eventStatus]);

  // ── Background Auto-Save Effect (persists as user enters details) ──
  useEffect(() => {
    if (isInitialLoading) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const hasAnyContent = Boolean(
      inputs.summarizedEvent.event_name?.trim() ||
      inputs.summarizedEvent.event_description?.trim() ||
      inputs.audienceSummarization.target_audience?.trim() ||
      (inputs.audienceSummarization.expected_participants && inputs.audienceSummarization.expected_participants > 0) ||
      inputs.dateFinalization.proposed_event_date ||
      inputs.otherInformation.venue_location_details?.trim() ||
      inputs.eventObjective.primary_event_objective?.trim() ||
      inputs.registrationParticipation.participant_eligibility?.trim()
    );

    if (!hasAnyContent) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      handleSaveDraft(currentStep, true);
    }, 1200);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputs, currentStep, isInitialLoading, handleSaveDraft]);

  // ── Create or Modify Event Action (Publishes to available_events table) ──
  const handleCreateEvent = useCallback(async () => {
    setCreatingEvent(true);
    try {
      // 1. Persist master wizard state with Published status
      const savedEvt = await handleSaveDraft(currentStep, false, "Published");
      setEventStatus("Published");
      const activeMasterId = savedEvt?.id || eventId || undefined;

      // 2. Persist basic necessities to the dedicated available_events table in Neon DB
      const res = await fetch("/api/available-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          master_event_id: activeMasterId,
          name: inputs.summarizedEvent.event_name || "Campus Innovation Event",
          category: inputs.summarizedEvent.event_category || "Technical",
          description: inputs.summarizedEvent.event_description || "Campus event organized on UniVibe.",
          organizer: inputs.summarizedEvent.event_organizer || "Student Organization",
          format: inputs.summarizedEvent.event_format || "Offline",
          event_date: inputs.dateFinalization.proposed_event_date || new Date().toISOString().split("T")[0],
          registration_deadline: inputs.dateFinalization.registration_deadline || new Date().toISOString().split("T")[0],
          venue: inputs.otherInformation.venue_location_details || "Campus Auditorium",
          capacity: Number(inputs.registrationParticipation.max_registration_capacity) || Number(inputs.audienceSummarization.expected_participants) || 100,
          participation_fee: String(inputs.registrationParticipation.registration_fee || "0"),
          eligibility: inputs.registrationParticipation.participant_eligibility || "Open to all students",
          status: "Registration Open",
        }),
      });

      if (res.ok) {
        setCreatedSuccess(true);
        setTimeout(() => setCreatedSuccess(false), 8000);
      }
    } catch (err) {
      console.error("Create / modify event failed:", err);
    } finally {
      setCreatingEvent(false);
    }
  }, [eventId, currentStep, handleSaveDraft, inputs]);

  // ── Navigation ────────────────────────────────────────────
  const goNext = () => {
    if (!canProceed) return;
    const nextStep = currentStep < 6 ? currentStep + 1 : currentStep;
    setCurrentStep(nextStep);
    // Auto-save to Neon DB on navigation
    handleSaveDraft(nextStep);
  };
  const goPrev = () => {
    if (currentStep > 1) setCurrentStep(s => s - 1);
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Created Event Banner */}
      {createdSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-700 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm text-emerald-950">
                {eventStatus === "Published" ? "Event Published & Added to Campus Catalog!" : "Event Modifications Saved Successfully!"}
              </p>
              <p className="text-emerald-700 text-xs">
                Event records and necessities have been synchronized to Neon DB.
              </p>
            </div>
          </div>
          <Link href="/dashboard/events" target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors whitespace-nowrap self-start sm:self-auto">
            <span>View in Events Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/organizer/dashboard"
              className="p-1 rounded-lg text-gray-500 hover:text-[#150a33] transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold text-[#150a33] tracking-tight">
              {eventStatus === "Published" ? "Modify Event" : "Create Event"}
            </h1>
            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ml-1 ${
              eventStatus === "Published"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : eventStatus === "Pending Review"
                ? "bg-amber-50 text-amber-700 border-amber-200 font-bold"
                : "bg-purple-50 text-[#6c35de] border-purple-200"
            }`}>
              {eventStatus}
            </span>
          </div>
          <p className="text-xs text-[#645c84] ml-7">
            Build a complete, AI-assisted event proposal in 6 structured sections connected directly to Neon DB.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isAutoSaving ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-[#6c35de] font-semibold bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl shadow-xs animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#6c35de]" />
              Saving to Neon DB...
            </span>
          ) : lastSaved ? (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Synced to Neon DB ({lastSaved})
            </span>
          ) : null}

          <button onClick={handleResetForm}
            className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-500 hover:text-red-600 shadow-sm transition-colors flex items-center gap-1.5"
            title="Reset all fields to blank for a fresh event">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset</span>
          </button>

          <button onClick={() => handleSaveDraft()} disabled={savingDraft}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs font-semibold text-[#150a33] shadow-sm transition-colors flex items-center gap-1.5">
            {savingDraft ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            {savingDraft ? "Saving..." : "Save Draft"}
          </button>

          <button onClick={handleCreateEvent} disabled={creatingEvent}
            className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 ${
              eventStatus === "Published"
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/20"
                : "bg-gradient-to-r from-[#6c35de] to-indigo-600 hover:from-[#7b41ee] hover:to-indigo-500 shadow-purple-900/20"
            }`}>
            {creatingEvent ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : eventStatus === "Published" ? (
              <Edit3 className="w-3.5 h-3.5" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {creatingEvent
              ? eventStatus === "Published"
                ? "Saving..."
                : "Creating..."
              : eventStatus === "Published"
              ? "Modify Event"
              : "Create Event"}
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
                onClick={() => { handleSaveDraft(sec.num, true); setCurrentStep(sec.num); }}
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
                  <button onClick={handleCreateEvent} disabled={creatingEvent}
                    className={`px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-all ${
                      eventStatus === "Published"
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/30"
                        : "bg-gradient-to-r from-[#6c35de] to-indigo-600 hover:from-[#7b41ee] hover:to-indigo-500 shadow-purple-900/30"
                    }`}>
                    {creatingEvent ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : eventStatus === "Published" ? (
                      <Edit3 className="w-3.5 h-3.5" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {creatingEvent
                      ? eventStatus === "Published"
                        ? "Saving Modifications..."
                        : "Creating Event..."
                      : eventStatus === "Published"
                      ? "Modify Event"
                      : "Create Event"}
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
