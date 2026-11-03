"use client";

import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Package,
  Mail,
  ShieldCheck,
  Video,
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CampusEvent } from "@/types";

interface EventDetailsModalProps {
  event: CampusEvent | null;
  onClose: () => void;
  onRegister: (event: CampusEvent) => void;
  onToggleSave: (eventId: string) => void;
}

export function EventDetailsModal({
  event,
  onClose,
  onRegister,
  onToggleSave,
}: EventDetailsModalProps) {
  if (!event) return null;

  const startDate = new Date(event.start_datetime);
  const endDate = new Date(event.end_datetime);
  const deadlineDate = new Date(event.registration_deadline);

  const isClosed =
    event.event_status === "Registration Closed" ||
    event.event_status === "Completed" ||
    event.event_status === "Cancelled";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-midnight-900 border border-violet/30 shadow-2xl overflow-hidden text-lavender-100 flex flex-col max-h-[90vh]">
        {/* Banner with Close button */}
        <div className="relative aspect-[21/9] sm:aspect-[2.6/1] w-full overflow-hidden bg-midnight-950 shrink-0">
          <img
            src={event.poster_url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-midnight-900/40 to-transparent" />

          {/* Close & Save Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onToggleSave(event.id)}
              className="p-2 rounded-full bg-midnight-950/80 backdrop-blur-md border border-white/10 hover:border-violet/40 text-lavender-200 transition-colors"
              title="Save Event"
            >
              <Bookmark className={`w-4 h-4 ${event.is_saved ? "fill-violet text-violet" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-midnight-950/80 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet/80 text-white backdrop-blur-md">
                {event.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-midnight-950/80 text-lavender-200 border border-white/10">
                {event.event_mode}
              </span>
            </div>
            <div className="text-sm font-bold text-white bg-midnight-950/90 px-3 py-1 rounded-full border border-violet/30">
              {event.participation_fee === 0 ? "FREE ENTRY" : `₹${event.participation_fee} Registration Fee`}
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Header Title & Status */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <Badge variant="verified" className="text-xs">
                {event.verification_status === "VERIFIED" ? "Official Campus Event" : "Demo Campus Event"}
              </Badge>
              <span className="text-xs font-bold text-violet-light font-mono">
                {event.registered_count} / {event.capacity} seats filled
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {event.name}
            </h2>
            <p className="text-sm text-lavender-300 mt-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Quick Schedule & Location Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-midnight-850 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-lavender-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-violet-light" /> Date &amp; Time
              </span>
              <div className="text-xs font-bold text-white">
                {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div className="text-[11px] text-lavender-400">
                {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-midnight-850 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-lavender-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-violet-light" /> Venue &amp; Mode
              </span>
              <div className="text-xs font-bold text-white truncate">
                {event.venue}
              </div>
              <div className="text-[11px] text-lavender-400">
                Format: {event.event_mode}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-midnight-850 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-lavender-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-400" /> Registration Deadline
              </span>
              <div className="text-xs font-bold text-amber-300">
                {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div className="text-[11px] text-lavender-400">
                Closes at {deadlineDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="p-4 rounded-xl bg-midnight-850/80 border border-violet/15 space-y-1">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-violet-light" /> Eligibility Requirements
            </span>
            <p className="text-xs text-lavender-300 leading-relaxed">
              {event.eligibility}
            </p>
          </div>

          {/* Event Rules */}
          {event.event_rules && event.event_rules.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-violet-light" /> Event Participation Guidelines &amp; Rules
              </span>
              <ul className="space-y-1.5 text-xs text-lavender-300">
                {event.event_rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-midnight-850/60 border border-white/5">
                    <span className="text-violet-light font-bold">0{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Materials */}
          {event.required_materials && event.required_materials.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-violet-light" /> Required Materials &amp; Gear
              </span>
              <div className="flex flex-wrap gap-2">
                {event.required_materials.map((mat, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-lg bg-midnight-850 border border-white/10 text-lavender-200 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information (Only when verified) */}
          {event.contact_information && (
            <div className="p-4 rounded-xl bg-midnight-850 border border-white/5 flex items-start gap-3">
              <Mail className="w-4 h-4 text-violet-light shrink-0 mt-0.5" />
              <div className="text-xs text-lavender-300">
                <span className="font-semibold text-white block">Official Organizer Contact:</span>
                <span>{event.contact_information}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Register Action */}
        <div className="p-6 border-t border-white/10 bg-midnight-950 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-lavender-400">
            {event.is_registered ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> You are already registered for this event.
              </span>
            ) : (
              <span>Registration takes less than 2 minutes. Confirmation ID is issued instantly.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>

            {!event.is_registered && (
              <Button
                size="md"
                onClick={() => {
                  onClose();
                  onRegister(event);
                }}
                disabled={isClosed}
                className="text-xs px-6"
              >
                {event.event_status === "Event Full" ? "Join Waitlist" : "Register Now"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

