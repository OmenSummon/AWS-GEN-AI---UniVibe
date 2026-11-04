"use client";

import React, { useState } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  FileText,
  Tag,
  Eye,
  XCircle,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EventRegistration, CampusEvent } from "@/types";

interface MyRegistrationsTabProps {
  registrations: EventRegistration[];
  onCancelRegistration: (registrationId: string) => void;
  onViewEventDetails: (event: CampusEvent) => void;
}

const statusTabs = [
  "All",
  "Upcoming",
  "Confirmed",
  "Pending",
  "Waitlisted",
  "Completed",
  "Cancelled",
];

export function MyRegistrationsTab({
  registrations,
  onCancelRegistration,
  onViewEventDetails,
}: MyRegistrationsTabProps) {
  const [activeTab, setActiveTab] = useState("All");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const filteredRegistrations = registrations.filter((reg) => {
    if (activeTab === "All") return true;
    if (activeTab === "Upcoming") {
      const isCancelled = reg.registration_status === "Cancelled";
      const isUpcoming = reg.event ? new Date(reg.event.start_datetime) >= new Date() : true;
      return !isCancelled && isUpcoming;
    }
    return reg.registration_status.toLowerCase() === activeTab.toLowerCase();
  });

  const handleDownload = (reg: EventRegistration) => {
    const event = reg.event;
    const content = `
=============================================================
UNIVIBE DIGITAL EVENT REGISTRATION PASS
=============================================================
Registration ID: ${reg.registration_number}
Status: ${reg.registration_status}
Submitted At: ${new Date(reg.submitted_at).toLocaleString()}

EVENT DETAILS:
- Event: ${event?.name || "Campus Event"}
- Category: ${event?.category || "General"}
- Date & Time: ${event ? new Date(event.start_datetime).toLocaleString() : "TBD"}
- Venue: ${event?.venue || "Campus Grounds"}
- Mode: ${event?.event_mode || "Offline"}

PARTICIPANT DETAILS:
- Name: ${reg.registration_data?.full_name || "Student"}
- Department: ${reg.registration_data?.department || "Department"}
- University: ${reg.registration_data?.university || "State Innovation University"}
- Student ID: ${reg.registration_data?.student_id_num || "N/A"}

PARTICIPATION DATA:
${Object.entries(reg.registration_data || {})
  .filter(([k]) => !["full_name", "department", "university", "student_id_num"].includes(k))
  .map(([k, v]) => `• ${k.replace(/_/g, " ").toUpperCase()}: ${v}`)
  .join("\n")}

=============================================================
Present this digital pass at the venue entrance.
Powered by UniVibe Student Intelligence Engine
=============================================================
    `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pass-${reg.registration_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCancelClick = async (reg: EventRegistration) => {
    const isPastDeadline =
      reg.cancellation_deadline && new Date() > new Date(reg.cancellation_deadline);

    if (isPastDeadline) {
      alert("Cancellation is not allowed after the registration deadline.");
      return;
    }

    if (
      confirm(
        `Are you sure you want to cancel your registration for "${reg.event?.name}"? Your seat will be released to other students.`
      )
    ) {
      setCancellingId(reg.id);
      await onCancelRegistration(reg.id);
      setCancellingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Filter Tabs (Rendered on Light Canvas) */}
      <div className="flex border-b border-gray-200 overflow-x-auto pb-3 gap-2">
        {statusTabs.map((tab) => {
          const count =
            tab === "All"
              ? registrations.length
              : tab === "Upcoming"
              ? registrations.filter(
                  (r) =>
                    r.registration_status !== "Cancelled" &&
                    r.event &&
                    new Date(r.event.start_datetime) >= new Date()
                ).length
              : registrations.filter(
                  (r) => r.registration_status.toLowerCase() === tab.toLowerCase()
                ).length;

          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-[#6c35de] text-white shadow-md shadow-purple-600/25"
                  : "bg-white text-[#4a4268] hover:text-[#150a33] border border-gray-200 hover:border-gray-300 shadow-xs"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-[#4a4268]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Registrations List */}
      {filteredRegistrations.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-200/90 shadow-sm space-y-3">
          <Calendar className="w-10 h-10 text-[#6c35de] mx-auto opacity-70" />
          <h4 className="text-base font-bold text-[#150a33]">No registrations found</h4>
          <p className="text-xs text-[#645c84] max-w-sm mx-auto leading-relaxed">
            You don't have any registered events under the "{activeTab}" filter. Explore available opportunities in the catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRegistrations.map((reg) => {
            const event = reg.event;
            const isCancelled = reg.registration_status === "Cancelled";

            return (
              <div
                key={reg.id}
                className={`rounded-3xl border transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-xl ${
                  isCancelled
                    ? "bg-[#100b21] border-red-500/30 opacity-75"
                    : "bg-[#130d28] border-purple-500/25 hover:border-purple-400/40"
                }`}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-md">
                      {reg.registration_number}
                    </span>
                    <Badge
                      variant={
                        reg.registration_status === "Confirmed"
                          ? "verified"
                          : reg.registration_status === "Waitlisted"
                          ? "warning"
                          : reg.registration_status === "Cancelled"
                          ? "outline"
                          : "default"
                      }
                      className="text-[11px]"
                    >
                      {reg.registration_status}
                    </Badge>
                  </div>

                  <div className="flex gap-4 items-start">
                    {event?.poster_url && (
                      <img
                        src={event.poster_url}
                        alt={event.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-purple-400/20"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-base font-bold text-white line-clamp-1">
                        {event?.name || "Campus Event"}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-lavender-200 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                        <span className="truncate">
                          {event ? new Date(event.start_datetime).toLocaleDateString() : "Date TBD"}
                        </span>
                        <span>•</span>
                        <span className="text-purple-200">{event?.event_mode || "Offline"}</span>
                      </div>
                      <div className="text-[11px] text-lavender-300 mt-1 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-purple-300 shrink-0" />
                        <span className="truncate">{event?.venue || "Campus Venue"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Meta & Functional Actions */}
                <div className="pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[10px] text-lavender-300 font-mono">
                    Submitted: {new Date(reg.submitted_at).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownload(reg)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white border border-purple-500/30 text-xs font-semibold transition-all cursor-pointer"
                      title="Download Confirmation Pass"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Pass</span>
                    </button>

                    {event && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewEventDetails(event)}
                        className="text-xs h-8 px-2.5"
                      >
                        Details
                      </Button>
                    )}

                    {!isCancelled && (
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={cancellingId === reg.id}
                        onClick={() => handleCancelClick(reg)}
                        className="text-xs h-8 px-2.5"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
