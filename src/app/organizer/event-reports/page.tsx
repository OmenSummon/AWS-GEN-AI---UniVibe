"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  Loader2,
  Users
} from "lucide-react";
import { OrganizerEvent } from "@/types";

export default function EventReportsPage() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<OrganizerEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/organizer/events");
        if (res.ok) {
          const data = await res.json();
          const list: OrganizerEvent[] = data.events || [];
          setEvents(list);
          if (list.length > 0) {
            setSelectedEvent(list[0]);
          }
        }
      } catch (err) {
        console.error("Error loading events for reports", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleDownload = () => {
    if (!selectedEvent) return;

    const reportText = `
UNIVIBE CAMPUS EVENT INTELLIGENCE DOSSIER
==========================================
Event Name: ${selectedEvent.basics?.event_name || "Untitled"}
Category: ${selectedEvent.basics?.event_category || "Technical"}
Lifecycle Status: ${selectedEvent.status}
Proposed Date: ${selectedEvent.timeline?.proposed_event_date || "TBD"}
Venue: ${selectedEvent.logistics?.venue_location_details || "TBD"}
Readiness Score: ${selectedEvent.final_report?.event_readiness_assessment?.readiness_score || "N/A"}/100
Verdict: ${selectedEvent.final_report?.event_readiness_assessment?.verdict || "Approved for Registration"}

EXECUTIVE SUMMARY
-----------------
${selectedEvent.final_report?.event_overview || selectedEvent.basics?.event_description || "N/A"}

AUDIENCE & PARTICIPATION TARGETS
--------------------------------
Expected Attendees: ${selectedEvent.audience?.expected_participants || 0}
Max Capacity: ${selectedEvent.registration?.max_registration_capacity || 0}
Audience Reach: ${selectedEvent.audience?.geographical_reach || "College-Level"}

STRATEGIC OBJECTIVES & IMPACT
-----------------------------
Primary Objective: ${selectedEvent.objectives?.primary_event_objective || "N/A"}
Theme: ${selectedEvent.objectives?.event_theme || "N/A"}
Success Criteria: ${selectedEvent.objectives?.success_criteria || "N/A"}

CRITICAL ACTION ITEMS
---------------------
${selectedEvent.final_report?.event_readiness_assessment?.critical_action_items?.map((a) => "- " + a).join("\n") || "None"}
    `.trim();

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(selectedEvent.basics?.event_name || "event").toLowerCase().replace(/\s+/g, "-")}-report.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#FEFEFE] tracking-tight">
            Event Intelligence & Report
          </h1>
          <p className="text-xs md:text-sm text-[#D4D4D4] mt-1 font-medium">
            Aggregated multi-section AI feasibility reports ready for university approval.
          </p>
        </div>

        {selectedEvent && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#353434] border border-[#444343] hover:border-[#446B8D] text-xs font-bold text-[#FEFEFE] shadow-xs transition-colors cursor-pointer w-fit"
          >
            <Download className="w-3.5 h-3.5 text-[#E4B74A]" />
            <span>Export Dossier (TXT)</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-[#353434] border border-[#444343] shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-[#E4B74A] mx-auto mb-2" />
          <p className="text-xs text-[#D4D4D4] font-medium">Loading intelligence dossiers...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#353434] border border-[#444343] shadow-xs">
          <p className="text-sm font-bold text-[#FEFEFE]">No events created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Event List */}
          <div className="space-y-2">
            <div className="text-xs font-black text-[#E4B74A] uppercase tracking-wider px-1 mb-2">
              Select Event Proposal
            </div>
            {events.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#242323] border-[#446B8D] text-[#FEFEFE] shadow-sm"
                      : "bg-[#353434] border-[#444343] hover:border-[#446B8D] text-[#D4D4D4] shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-[#E4B74A] uppercase bg-[#2C2B2B] px-2 py-0.5 rounded-md border border-[#444343]">
                      {evt.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-[10px] font-bold text-[#888888]">{evt.status}</span>
                  </div>
                  <div className="text-sm font-black text-[#FEFEFE] truncate">{evt.basics?.event_name}</div>
                  <div className="text-xs text-[#D4D4D4] mt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#446B8D]" />
                    <span>{evt.timeline?.proposed_event_date || "Date TBD"}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 2 Columns: Selected Event Dossier View */}
          {selectedEvent && (
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-[#E4B74A] uppercase tracking-wider">
                      {selectedEvent.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-xs text-[#888888]">&bull;</span>
                    <span className="text-xs text-[#E4B74A] font-bold">
                      Readiness Score: {selectedEvent.final_report?.event_readiness_assessment?.readiness_score ?? 88}/100
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-[#FEFEFE] tracking-tight">{selectedEvent.basics?.event_name}</h2>
                  <p className="text-xs text-[#D4D4D4] mt-1 font-medium leading-relaxed">{selectedEvent.basics?.event_description}</p>
                </div>

                {/* Score & Verdict banner */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 rounded-2xl bg-[#242323] border border-[#444343]">
                  <div>
                    <div className="text-[10px] uppercase text-[#888888] font-bold tracking-wider">Committee Status</div>
                    <div className="text-sm font-black text-[#E4B74A] mt-0.5">
                      {selectedEvent.final_report?.event_readiness_assessment?.verdict || "Approved for Registration"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-[#888888] font-bold tracking-wider">Expected / Capacity</div>
                    <div className="text-sm font-black text-[#FEFEFE] mt-0.5">
                      {selectedEvent.audience?.expected_participants || 0} / {selectedEvent.registration?.max_registration_capacity || 0} seats
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-[#888888] font-bold tracking-wider">Budget Status</div>
                    <div className="text-sm font-black text-[#FEFEFE] mt-0.5 truncate">
                      {selectedEvent.logistics?.budget_financial_availability || "Approved"}
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#E4B74A] uppercase tracking-wider">
                    Executive Proposal Summary
                  </h3>
                  <div className="p-5 rounded-2xl bg-[#242323] border border-[#444343] text-xs text-[#D4D4D4] leading-relaxed whitespace-pre-line font-medium">
                    {selectedEvent.final_report?.event_overview ||
                      selectedEvent.basics?.event_description ||
                      "Proposal pending full audit generation in Create Event wizard."}
                  </div>
                </div>

                {/* Logistics & Resources Highlight */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#E4B74A] uppercase tracking-wider">
                    Logistical & Operational Blueprint
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-[#242323] border border-[#444343] space-y-1">
                      <div className="font-bold text-[#FEFEFE]">Venue Allocation</div>
                      <div className="text-[#D4D4D4] font-medium">{selectedEvent.logistics?.venue_location_details || "Main Campus Hall"}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#242323] border border-[#444343] space-y-1">
                      <div className="font-bold text-[#FEFEFE]">Team & Manpower</div>
                      <div className="text-[#D4D4D4] font-medium">{selectedEvent.logistics?.team_composition_manpower || "Student Tech Committee"}</div>
                    </div>
                  </div>
                </div>

                {/* Edit Link */}
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/organizer/create-event?id=${selectedEvent.id}`}
                    className="px-5 py-2.5 rounded-xl bg-[#446B8D] text-[#FEFEFE] text-xs font-bold shadow-md hover:bg-[#557FA5] transition-all"
                  >
                    Open in Proposal Wizard
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}