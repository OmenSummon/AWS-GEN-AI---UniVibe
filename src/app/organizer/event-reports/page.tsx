"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Download,
  Loader2,
  Calendar
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
          const evts: OrganizerEvent[] = data.events || [];
          setEvents(evts);
          if (evts.length > 0) {
            setSelectedEvent(evts[0]);
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
===========================================
Event: ${selectedEvent.basics?.event_name}
Category: ${selectedEvent.basics?.event_category}
Status: ${selectedEvent.status}
Proposed Date: ${selectedEvent.timeline?.proposed_event_date} (${selectedEvent.timeline?.event_duration})
Target Attendees: ${selectedEvent.audience?.expected_participants} (Capacity: ${selectedEvent.registration?.max_registration_capacity})
Budget Notes: ${selectedEvent.logistics?.budget_financial_availability}

EXECUTIVE SUMMARY
-----------------
${selectedEvent.final_report?.event_overview || selectedEvent.basics?.event_description}

FEASIBILITY & READINESS
-----------------------
Readiness Score: ${selectedEvent.final_report?.event_readiness_assessment?.readiness_score ?? 85}/100
Verdict: ${selectedEvent.final_report?.event_readiness_assessment?.verdict || "Approved"}

CRITICAL ACTION ITEMS:
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            Event Intelligence &amp; Committee Dossiers
          </h1>
          <p className="text-xs md:text-sm text-lavender-300 mt-1">
            Aggregated multi-section AI feasibility reports ready for university approval.
          </p>
        </div>

        {selectedEvent && (
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-midnight-900 border border-fuchsia-500/30 hover:border-fuchsia-500 text-xs font-semibold text-white shadow-sm transition-colors cursor-pointer w-fit"
          >
            <Download className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>Export Dossier (TXT)</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-midnight-900/60 border border-white/5">
          <Loader2 className="w-6 h-6 animate-spin text-fuchsia-400 mx-auto mb-2" />
          <p className="text-xs text-lavender-400">Loading intelligence dossiers...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-midnight-900/60 border border-white/5">
          <p className="text-sm text-lavender-300">No events created yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Event List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-lavender-400 uppercase tracking-wider px-1 mb-2">
              Select Event Proposal
            </div>
            {events.map((evt) => {
              const isSelected = selectedEvent?.id === evt.id;
              return (
                <button
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-fuchsia-500/15 border-fuchsia-500/60 text-white shadow-md shadow-fuchsia-500/10"
                      : "bg-midnight-900/70 border-white/10 hover:border-white/20 text-lavender-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-fuchsia-300 uppercase">
                      {evt.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-[10px] text-lavender-400">{evt.status}</span>
                  </div>
                  <div className="text-sm font-bold text-white truncate">{evt.basics?.event_name}</div>
                  <div className="text-xs text-lavender-400 mt-1 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-lavender-400" />
                    <span>{evt.timeline?.proposed_event_date}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 2 Columns: Selected Event Dossier View */}
          {selectedEvent && (
            <div className="lg:col-span-2 space-y-6">
              <div className="p-6 rounded-2xl bg-midnight-900/80 border border-white/10 space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-wider">
                      {selectedEvent.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-xs text-lavender-400">&bull;</span>
                    <span className="text-xs text-emerald-400 font-semibold">
                      Readiness Score: {selectedEvent.final_report?.event_readiness_assessment?.readiness_score ?? 88}/100
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white">{selectedEvent.basics?.event_name}</h2>
                  <p className="text-xs text-lavender-300 mt-1">{selectedEvent.basics?.event_description}</p>
                </div>

                {/* Score & Verdict banner */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 rounded-xl bg-midnight-850 border border-white/5">
                  <div>
                    <div className="text-[10px] uppercase text-lavender-400 font-bold">Committee Status</div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">
                      {selectedEvent.final_report?.event_readiness_assessment?.verdict || "Approved for Registration"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-lavender-400 font-bold">Expected / Capacity</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {selectedEvent.audience?.expected_participants} / {selectedEvent.registration?.max_registration_capacity} seats
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase text-lavender-400 font-bold">Budget Status</div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      {selectedEvent.logistics?.budget_financial_availability || "Approved"}
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-lavender-400 uppercase tracking-wider">
                    Executive Proposal Summary
                  </h3>
                  <div className="p-4 rounded-xl bg-midnight-850 border border-white/5 text-xs text-lavender-200 leading-relaxed whitespace-pre-line">
                    {selectedEvent.final_report?.event_overview ||
                      selectedEvent.basics?.event_description ||
                      "Proposal pending full audit generation in Create Event wizard."}
                  </div>
                </div>

                {/* Logistics & Resources Highlight */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-lavender-400 uppercase tracking-wider">
                    Logistical &amp; Operational Blueprint
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-midnight-850 border border-white/5 space-y-1">
                      <div className="font-semibold text-white">Venue Allocation</div>
                      <div className="text-lavender-300">{selectedEvent.logistics?.venue_location_details}</div>
                    </div>

                    <div className="p-3 rounded-lg bg-midnight-850 border border-white/5 space-y-1">
                      <div className="font-semibold text-white">Team &amp; Manpower</div>
                      <div className="text-lavender-300">{selectedEvent.logistics?.team_composition_manpower}</div>
                    </div>
                  </div>
                </div>

                {/* Edit Link */}
                <div className="pt-2 flex justify-end">
                  <Link
                    href={`/organizer/create-event?id=${selectedEvent.id}`}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet text-white text-xs font-bold shadow-md shadow-fuchsia-500/20"
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
