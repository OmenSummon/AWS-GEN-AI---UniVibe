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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl bg-[#130d28] border border-purple-500/30 shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        {/* Banner with Close button */}
        <div className="relative aspect-[21/9] sm:aspect-[2.6/1] w-full overflow-hidden bg-[#07050d] shrink-0">
          <img
            src={event.poster_url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130d28] via-[#130d28]/40 to-transparent" />

          {/* Close & Save Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={() => onToggleSave(event.id)}
              className="p-2 rounded-full bg-[#07050d]/85 backdrop-blur-md border border-white/10 hover:border-purple-400 text-purple-200 transition-colors cursor-pointer"
              title="Save Event"
            >
              <Bookmark className={`w-4 h-4 ${event.is_saved ? "fill-purple-400 text-purple-400" : ""}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-[#07050d]/85 backdrop-blur-md border border-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#6c35de] text-white backdrop-blur-md shadow-xs">
                {event.category}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#07050d]/85 text-purple-200 border border-white/15">
                {event.event_mode}
              </span>
            </div>
            <div className="text-sm font-black text-white bg-[#07050d]/90 px-3.5 py-1 rounded-full border border-purple-400/30 shadow-xs">
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
              <span className="text-xs font-black text-purple-300 font-mono">
                {event.registered_count} / {event.capacity} seats filled
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {event.name}
            </h2>
            <p className="text-sm text-lavender-100 mt-2 leading-relaxed font-medium">
              {event.description}
            </p>
          </div>

          {/* Quick Schedule & Location Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-300 flex items-center gap-1 tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-purple-300" /> Date &amp; Time
              </span>
              <div className="text-xs font-bold text-white">
                {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
              <div className="text-[11px] text-purple-200 font-medium">
                {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} – {endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-300 flex items-center gap-1 tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-purple-300" /> Venue &amp; Mode
              </span>
              <div className="text-xs font-bold text-white truncate">
                {event.venue}
              </div>
              <div className="text-[11px] text-purple-200 font-medium">
                Format: {event.event_mode}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-300 flex items-center gap-1 tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Registration Deadline
              </span>
              <div className="text-xs font-bold text-amber-300">
                {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </div>
              <div className="text-[11px] text-amber-200 font-medium">
                Closes at {deadlineDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>

          {/* Eligibility */}
          <div className="p-5 rounded-2xl bg-[#0e081f] border border-purple-400/20 space-y-1.5">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-purple-300" /> Eligibility Requirements
            </span>
            <p className="text-xs text-lavender-200 leading-relaxed font-medium">
              {event.eligibility}
            </p>
          </div>

          {/* Event Rules */}
          {event.event_rules && event.event_rules.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-purple-300" /> Event Participation Guidelines &amp; Rules
              </span>
              <ul className="space-y-2 text-xs text-lavender-200 font-medium">
                {event.event_rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#0e081f] border border-purple-400/20 shadow-xs">
                    <span className="text-purple-300 font-bold">0{idx + 1}.</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Materials */}
          {event.required_materials && event.required_materials.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Package className="w-4 h-4 text-purple-300" /> Required Materials &amp; Gear
              </span>
              <div className="flex flex-wrap gap-2">
                {event.required_materials.map((mat, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#0e081f] border border-purple-400/25 text-purple-200 flex items-center gap-1.5 font-semibold"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {mat}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Information (Only when verified) */}
          {event.contact_information && (
            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 flex items-start gap-3">
              <Mail className="w-4 h-4 text-purple-300 shrink-0 mt-0.5" />
              <div className="text-xs text-lavender-200">
                <span className="font-bold text-white block">Official Organizer Contact:</span>
                <span>{event.contact_information}</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer with Register Action */}
        <div className="p-6 border-t border-purple-400/20 bg-[#0a0616] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-purple-200 font-medium">
            {event.is_registered ? (
              <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> You are already registered for this event.
              </span>
            ) : (
              <span>Registration takes less than 2 minutes. Confirmation ID is issued instantly.</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="secondary" size="sm" onClick={onClose} className="text-xs">
              Close
            </Button>

            {!event.is_registered && (
              <Button
                size="md"
                variant="primary"
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
