"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle2,
  FileText,
  Users,
  Calendar,
  Boxes,
  Target,
  ShieldCheck,
  Loader2,
  ChevronLeft
} from "lucide-react";
import {
  OrganizerEvent,
  EventBasicsData,
  AudienceReachData,
  TimelineData,
  ResourcesLogisticsData,
  StrategicObjectivesData,
  RegistrationEligibilityData,
  SectionAiOutputs,
  FinalEventIntelligenceReport,
  EventWizardCategory,
  EventLifecycleStatus
} from "@/types";

const CATEGORIES: EventWizardCategory[] = [
  "Hackathon",
  "Technical Fest",
  "Workshop",
  "Seminar",
  "Conference",
  "Cultural Fest",
  "Sports",
  "Gaming",
  "Photography",
  "Music",
  "Entrepreneurship",
  "Other"
];

function CreateEventWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [activeStep, setActiveStep] = useState<number>(1);
  const [saving, setSaving] = useState(false);
  const [analyzingSection, setAnalyzingSection] = useState<number | null>(null);
  const [generatingFinal, setGeneratingFinal] = useState(false);
  const [eventId, setEventId] = useState<string | null>(editId);

  // Form State
  const [basics, setBasics] = useState<EventBasicsData>({
    event_name: "CodeStorm Hackathon 2026",
    event_category: "Hackathon",
    event_format: "Offline",
    event_organizer: "JIS Tech Club",
    event_description: "A 24-hour hackathon where students build innovative AI solutions for real campus challenges."
  });

  const [audience, setAudience] = useState<AudienceReachData>({
    expected_participants: 150,
    target_audience: "B.Tech CSE, IT, AI-ML & BCA Students, JIS University",
    participation_type: "Team-Based",
    geographical_reach: "University-Level"
  });

  const [timeline, setTimeline] = useState<TimelineData>({
    proposed_event_date: "2026-11-20",
    event_duration: "24 Hours (Overnight Hackathon)",
    preparation_start_date: "2026-11-05",
    registration_deadline: "2026-11-18",
    date_flexibility: "Flexible"
  });

  const [logistics, setLogistics] = useState<ResourcesLogisticsData>({
    budget_financial_availability: "₹45,000 INR from JIS Student Council Fund",
    financial_constraints_expectations: "Maximum budget ₹60,000 INR; covers hackathon prizes and midnight energy snacks",
    venue_location_details: "JIS University Main Campus Tech Wing, Labs 301-304",
    infrastructure_equipment_availability: "High-speed campus Wi-Fi, 4 wireless mics, backup power generators",
    team_composition_manpower: "15 student volunteers, 4 student event leads, 2 student technical coordinators",
    external_support_assistance: "JIS University Media Club for photography; Student Hospitality Team"
  });

  const [objectives, setObjectives] = useState<StrategicObjectivesData>({
    primary_event_objective: "Provide hands-on exposure to applied generative AI tools and industry workflows.",
    secondary_objectives: "Promote cross-disciplinary student teams and register 50+ new tech club members.",
    event_theme: "Applied Intelligence & Future Campus Technologies",
    expected_outcomes: "15 completed student prototype demos and published project repos.",
    institutional_alignment: "Directly contributes to JIS University goal of practical technical leadership."
  });

  const [registration, setRegistration] = useState<RegistrationEligibilityData>({
    registration_method: "UniVibe Registration",
    registration_window: "2026-11-06 to 2026-11-18",
    participant_eligibility: "Open to all enrolled undergraduate and graduate students with valid JIS University ID.",
    participation_mode: "Team",
    team_size_range: "2 to 4 students per squad",
    registration_fee: 0,
    selection_process: "First Come, First Served",
    max_registration_capacity: 150,
    waitlist_availability: "Yes"
  });

  // AI Outputs
  const [sectionOutputs, setSectionOutputs] = useState<SectionAiOutputs>({
    summarized_event_details: "Event: CodeStorm Hackathon 2026\nCategory: Hackathon\nFormat: Offline\nOrganizer: JIS Tech Club\nOverview: A 24-hour innovation hackathon focused on building AI solutions for campus challenges, encouraging problem-solving, collaboration and practical learning."
  });
  const [finalReport, setFinalReport] = useState<FinalEventIntelligenceReport | null>(null);
  const [eventStatus, setEventStatus] = useState<EventLifecycleStatus>("In Planning");

  // Load existing event if editing
  useEffect(() => {
    if (!editId) return;
    async function loadEvent() {
      try {
        const res = await fetch(`/api/organizer/events/${editId}`);
        if (res.ok) {
          const data = await res.json();
          const evt: OrganizerEvent = data.event;
          if (evt) {
            if (evt.basics) setBasics(evt.basics);
            if (evt.audience) setAudience(evt.audience);
            if (evt.timeline) setTimeline(evt.timeline);
            if (evt.logistics) setLogistics(evt.logistics);
            if (evt.objectives) setObjectives(evt.objectives);
            if (evt.registration) setRegistration(evt.registration);
            if (evt.section_ai_outputs) setSectionOutputs(evt.section_ai_outputs);
            if (evt.final_report) setFinalReport(evt.final_report);
            if (evt.status) setEventStatus(evt.status);
          }
        }
      } catch (err) {
        console.error("Error loading event", err);
      }
    }
    loadEvent();
  }, [editId]);

  // Save Event Draft
  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const payload = {
        id: eventId || undefined,
        status: eventStatus,
        basics,
        audience,
        timeline,
        logistics,
        objectives,
        registration,
        section_ai_outputs: sectionOutputs,
        final_report: finalReport,
      };

      let res;
      if (eventId) {
        res = await fetch(`/api/organizer/events/${eventId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/organizer/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        const data = await res.json();
        if (data.event?.id) {
          setEventId(data.event.id);
        }
      }
    } catch (err) {
      console.error("Failed to save draft", err);
    } finally {
      setSaving(false);
    }
  };

  // Run Section AI Analysis
  const runSectionAnalysis = async (sectionNumber: number) => {
    setAnalyzingSection(sectionNumber);
    try {
      await handleSaveDraft();
      const currentEvtId = eventId || "temp-id";

      const res = await fetch(`/api/organizer/events/${currentEvtId}/ai-analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: sectionNumber,
          eventData: {
            basics,
            audience,
            timeline,
            logistics,
            objectives,
            registration,
            section_ai_outputs: sectionOutputs,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSectionOutputs((prev) => ({
          ...prev,
          ...data.section_ai_outputs,
        }));
      }
    } catch (err) {
      console.error("AI analysis error", err);
    } finally {
      setAnalyzingSection(null);
    }
  };

  // Run Final Aggregate Report
  const runFinalReport = async () => {
    setGeneratingFinal(true);
    try {
      await handleSaveDraft();
      const currentEvtId = eventId || "temp-id";

      const res = await fetch(`/api/organizer/events/${currentEvtId}/ai-analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section: 7,
          eventData: {
            basics,
            audience,
            timeline,
            logistics,
            objectives,
            registration,
            section_ai_outputs: sectionOutputs,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFinalReport(data.final_report);
        setActiveStep(7);
      }
    } catch (err) {
      console.error("Final report generation error", err);
    } finally {
      setGeneratingFinal(false);
    }
  };

  const steps = [
    { num: 1, title: "Event Basics", subtitle: "Define the core details" },
    { num: 2, title: "Audience & Reach", subtitle: "Who are you targeting?" },
    { num: 3, title: "Timeline", subtitle: "Key dates and schedule" },
    { num: 4, title: "Resources & Logistics", subtitle: "Budget, venue and support" },
    { num: 5, title: "Strategic Objectives", subtitle: "Goals and expected impact" },
    { num: 6, title: "Registration & Eligibility", subtitle: "Entry, process and constraints" },
    { num: 7, title: "Final Report", subtitle: "Complete event intelligence" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Row matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/organizer/dashboard"
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold text-[#150a33] tracking-tight">
              Create Event
            </h1>
          </div>
          <p className="text-xs text-[#645c84] ml-7">
            Build a complete, AI-assisted event proposal in 6 structured sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs font-semibold text-[#150a33] shadow-sm transition-colors flex items-center gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Draft</span>
          </button>

          <button
            onClick={runFinalReport}
            disabled={generatingFinal}
            className="px-5 py-2 rounded-xl bg-[#6c35de] hover:bg-[#7b41ee] text-xs font-bold text-white shadow-md shadow-purple-900/20 transition-all flex items-center gap-1.5"
          >
            {generatingFinal ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>Generate Full Report</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>
      </div>

      {/* Main 2-Panel Content Area: Left Stepper Navigation + Right Form Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Col (1 col): Vertical Stepper */}
        <div className="lg:col-span-1 space-y-1.5 p-3 rounded-3xl bg-white border border-gray-150 shadow-sm h-fit">
          {steps.map((st) => {
            const isActive = activeStep === st.num;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(st.num)}
                className={`w-full p-3 rounded-2xl flex items-center gap-3 text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-purple-50/80 border border-purple-200"
                    : "hover:bg-gray-50 border border-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? "bg-[#6c35de] text-white shadow-sm"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {st.num === 7 ? <Sparkles className="w-3.5 h-3.5" /> : st.num}
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-bold truncate ${
                      isActive ? "text-[#6c35de]" : "text-[#150a33]"
                    }`}
                  >
                    {st.title}
                  </div>
                  <div className="text-[10px] text-gray-500 truncate">
                    {st.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 2 Columns: Form Card & AI Summary Card */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Main Form Fields (3 cols) */}
          <div className="md:col-span-3 p-6 sm:p-7 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-5">
            {/* Step 1: Event Basics */}
            {activeStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#150a33]">
                    1. Event Basics
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Capture the fundamental details of your event.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Event Name *
                  </label>
                  <input
                    type="text"
                    value={basics.event_name}
                    onChange={(e) => setBasics({ ...basics, event_name: e.target.value })}
                    placeholder="CodeStorm Hackathon 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Event Category *
                  </label>
                  <select
                    value={basics.event_category}
                    onChange={(e) => setBasics({ ...basics, event_category: e.target.value as EventWizardCategory })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] cursor-pointer"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Event Description *
                  </label>
                  <textarea
                    rows={4}
                    value={basics.event_description}
                    onChange={(e) => setBasics({ ...basics, event_description: e.target.value })}
                    placeholder="A 24-hour hackathon where students build innovative AI solutions for real campus challenges."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Event Organizer (Optional)
                    </label>
                    <input
                      type="text"
                      value={basics.event_organizer}
                      onChange={(e) => setBasics({ ...basics, event_organizer: e.target.value })}
                      placeholder="JIS Tech Club"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Event Format *
                    </label>
                    <select
                      value={basics.event_format}
                      onChange={(e) => setBasics({ ...basics, event_format: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] cursor-pointer"
                    >
                      <option value="Offline">Offline</option>
                      <option value="Online">Online</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Audience & Reach */}
            {activeStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#150a33]">
                    2. Audience &amp; Reach
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Define participation scope and expected attendance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Expected Participants
                    </label>
                    <input
                      type="number"
                      value={audience.expected_participants}
                      onChange={(e) => setAudience({ ...audience, expected_participants: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Participation Mode
                    </label>
                    <select
                      value={audience.participation_type}
                      onChange={(e) => setAudience({ ...audience, participation_type: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                    >
                      <option value="Team-Based">Team-Based</option>
                      <option value="Individual">Individual Only</option>
                      <option value="Open Registration">Open Registration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Target Department / Students
                  </label>
                  <input
                    type="text"
                    value={audience.target_audience}
                    onChange={(e) => setAudience({ ...audience, target_audience: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>
              </div>
            )}

            {/* Step 3: Timeline */}
            {activeStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#150a33]">
                    3. Timeline &amp; Dates
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Academic schedule and registration window.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Proposed Event Date
                    </label>
                    <input
                      type="date"
                      value={timeline.proposed_event_date}
                      onChange={(e) => setTimeline({ ...timeline, proposed_event_date: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Registration Deadline
                    </label>
                    <input
                      type="date"
                      value={timeline.registration_deadline}
                      onChange={(e) => setTimeline({ ...timeline, registration_deadline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Event Duration &amp; Timings
                  </label>
                  <input
                    type="text"
                    value={timeline.event_duration}
                    onChange={(e) => setTimeline({ ...timeline, event_duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Resources & Logistics */}
            {activeStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#150a33]">
                    4. Resources &amp; Logistics
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Budget (₹ INR), Lab venue, and student volunteer support.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Venue Details
                  </label>
                  <input
                    type="text"
                    value={logistics.venue_location_details}
                    onChange={(e) => setLogistics({ ...logistics, venue_location_details: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Budget Availability (₹ INR)
                  </label>
                  <input
                    type="text"
                    value={logistics.budget_financial_availability}
                    onChange={(e) => setLogistics({ ...logistics, budget_financial_availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Team &amp; Volunteer Support
                  </label>
                  <input
                    type="text"
                    value={logistics.team_composition_manpower}
                    onChange={(e) => setLogistics({ ...logistics, team_composition_manpower: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Strategic Objectives */}
            {activeStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#150a33]">
                    5. Strategic Objectives
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Target goals and alignment with JIS University mission.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Primary Event Objective
                  </label>
                  <textarea
                    rows={2}
                    value={objectives.primary_event_objective}
                    onChange={(e) => setObjectives({ ...objectives, primary_event_objective: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Expected Outcomes
                  </label>
                  <input
                    type="text"
                    value={objectives.expected_outcomes || ""}
                    onChange={(e) => setObjectives({ ...objectives, expected_outcomes: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Registration & Eligibility */}
            {activeStep === 6 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#150a33]">
                    6. Registration &amp; Eligibility
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Participant rules, team limits, and eligibility criteria.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Max Participant Capacity
                    </label>
                    <input
                      type="number"
                      value={registration.max_registration_capacity}
                      onChange={(e) => setRegistration({ ...registration, max_registration_capacity: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#150a33] mb-1">
                      Team Size Range
                    </label>
                    <input
                      type="text"
                      value={registration.team_size_range || "2 to 4 members"}
                      onChange={(e) => setRegistration({ ...registration, team_size_range: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#150a33] mb-1">
                    Eligibility Criteria
                  </label>
                  <textarea
                    rows={2}
                    value={registration.participant_eligibility}
                    onChange={(e) => setRegistration({ ...registration, participant_eligibility: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33]"
                  />
                </div>
              </div>
            )}

            {/* Step 7: Final Report */}
            {activeStep === 7 && (
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-extrabold text-[#150a33]">
                    Final Event Intelligence Report
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Comprehensive proposal ready for JIS University Student Council verification.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#6c35de]">Readiness Score</span>
                    <span className="text-lg font-black text-emerald-600">
                      {finalReport?.event_readiness_assessment?.readiness_score ?? 94} / 100
                    </span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
                    {finalReport?.event_overview ||
                      "Proposal ready with high student demand, confirmed lab resources at JIS University, and complete safety/volunteer staffing coverage."}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons matching mockup */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setActiveStep(Math.max(1, activeStep - 1))}
                disabled={activeStep === 1}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-900 disabled:opacity-40 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (activeStep < 7) {
                    setActiveStep(activeStep + 1);
                  } else {
                    router.push("/organizer/my-events");
                  }
                }}
                className="px-5 py-2 rounded-xl bg-[#6c35de] hover:bg-[#7b41ee] text-white font-bold text-xs shadow-md shadow-purple-900/20 flex items-center gap-1.5"
              >
                <span>Save &amp; Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* AI Summary Card (Right 2 cols) matching mockup */}
          <div className="md:col-span-2 p-6 rounded-3xl bg-[#f5f3ff] border border-[#e9d5ff] shadow-sm space-y-4 h-fit">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6c35de]">
                <Sparkles className="w-4 h-4 text-[#6c35de]" />
                <span>AI Summary</span>
              </div>

              <button
                onClick={() => runSectionAnalysis(activeStep)}
                disabled={analyzingSection === activeStep}
                className="text-[11px] font-semibold text-[#6c35de] hover:underline"
              >
                {analyzingSection === activeStep ? "Analyzing..." : "Refresh"}
              </button>
            </div>

            <div>
              <h4 className="text-xs font-bold text-[#150a33] mb-2.5">
                Summarized Event Details
              </h4>

              <div className="space-y-2 text-xs text-[#334155] leading-relaxed">
                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-[#6c35de]">+</span>
                  <div><strong>Event:</strong> {basics.event_name || "CodeStorm Hackathon 2026"}</div>
                </div>

                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-[#6c35de]">+</span>
                  <div><strong>Category:</strong> {basics.event_category}</div>
                </div>

                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-[#6c35de]">+</span>
                  <div><strong>Format:</strong> {basics.event_format}</div>
                </div>

                <div className="flex items-start gap-1.5">
                  <span className="font-bold text-[#6c35de]">+</span>
                  <div><strong>Organizer:</strong> {basics.event_organizer || "JIS Tech Club"}</div>
                </div>

                <div className="flex items-start gap-1.5 pt-1">
                  <span className="font-bold text-[#6c35de]">+</span>
                  <div>
                    <strong>Overview:</strong> A 24-hour innovation hackathon focused on building AI solutions for JIS campus challenges, encouraging problem-solving, collaboration and practical learning.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading proposal wizard...</div>}>
      <CreateEventWizard />
    </Suspense>
  );
}
