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
          <h1 className="text-2xl md:text-3xl font-black text-[#150a33] tracking-tight">
            Event Intelligence &amp; Report
          </h1>
          <p className="text-xs md:text-sm text-[#645c84] mt-1 font-medium">
            Aggregated multi-section AI feasibility reports ready for university approval.
          </p>
        </div>

        {selectedEvent && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-fuchsia-300 text-xs font-bold text-[#150a33] shadow-xs transition-colors cursor-pointer w-fit"
          >
            <Download className="w-3.5 h-3.5 text-fuchsia-600" />
            <span>Export Dossier (TXT)</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 shadow-xs">
          <Loader2 className="w-6 h-6 animate-spin text-fuchsia-600 mx-auto mb-2" />
          <p className="text-xs text-[#645c84] font-medium">Loading intelligence dossiers...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 shadow-xs">
          <p className="text-sm font-bold text-[#150a33]">No events created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Event List */}
          <div className="space-y-2">
            <div className="text-xs font-black text-[#645c84] uppercase tracking-wider px-1 mb-2">
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
                      ? "bg-fuchsia-50 border-fuchsia-300 text-[#150a33] shadow-sm"
                      : "bg-white border-gray-200 hover:border-gray-300 text-gray-700 shadow-2xs"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-fuchsia-700 uppercase bg-fuchsia-100/70 px-2 py-0.5 rounded-md">
                      {evt.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">{evt.status}</span>
                  </div>
                  <div className="text-sm font-black text-[#150a33] truncate">{evt.basics?.event_name}</div>
                  <div className="text-xs text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-fuchsia-600" />
                    <span>{evt.timeline?.proposed_event_date || "Date TBD"}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 2 Columns: Selected Event Dossier View */}
          {selectedEvent && (
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-bold text-fuchsia-700 uppercase tracking-wider">
                      {selectedEvent.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-xs text-gray-300">&bull;</span>
                    <span className="text-xs text-emerald-700 font-bold">
                      Readiness Score: {selectedEvent.final_report?.event_readiness_assessment?.readiness_score ?? 88}/100
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-[#150a33] tracking-tight">{selectedEvent.basics?.event_name}</h2>
                  <p className="text-xs text-gray-600 mt-1 font-medium leading-relaxed">{selectedEvent.basics?.event_description}</p>
                </div>

                {/* Score & Verdict banner */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-5 rounded-2xl bg-gray-50 border border-gray-200">
                  <div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Committee Status</div>
                    <div className="text-sm font-black text-emerald-700 mt-0.5">
                      {selectedEvent.final_report?.event_readiness_assessment?.verdict || "Approved for Registration"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Expected / Capacity</div>
                    <div className="text-sm font-black text-[#150a33] mt-0.5">
                      {selectedEvent.audience?.expected_participants || 0} / {selectedEvent.registration?.max_registration_capacity || 0} seats
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">Budget Status</div>
                    <div className="text-sm font-black text-[#150a33] mt-0.5 truncate">
                      {selectedEvent.logistics?.budget_financial_availability || "Approved"}
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#645c84] uppercase tracking-wider">
                    Executive Proposal Summary
                  </h3>
                  <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 text-xs text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                    {selectedEvent.final_report?.event_overview ||
                      selectedEvent.basics?.event_description ||
                      "Proposal pending full audit generation in Create Event wizard."}
                  </div>
                </div>

                {/* Logistics & Resources Highlight */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-[#645c84] uppercase tracking-wider">
                    Logistical &amp; Operational Blueprint
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                      <div className="font-bold text-[#150a33]">Venue Allocation</div>
                      <div className="text-gray-600 font-medium">{selectedEvent.logistics?.venue_location_details || "Main Campus Hall"}</div>
                    </div>

                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                      <div className="font-bold text-[#150a33]">Team &amp; Manpower</div>
                      <div className="text-gray-600 font-medium">{selectedEvent.logistics?.team_composition_manpower || "Student Tech Committee"}</div>
                    </div>
                  </div>
                </div>

                {/* Edit Link */}
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/organizer/create-event?id=${selectedEvent.id}`}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-[#6c35de] text-white text-xs font-bold shadow-md shadow-fuchsia-500/20 hover:brightness-110 transition-all"
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
