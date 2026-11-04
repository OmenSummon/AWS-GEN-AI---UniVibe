"use client";

import React from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Bookmark,
  Users,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  ShieldCheck,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CampusEvent } from "@/types";

interface EventCardProps {
  event: CampusEvent;
  onViewDetails: (event: CampusEvent) => void;
  onRegister: (event: CampusEvent) => void;
  onToggleSave: (eventId: string) => void;
}

export function EventCard({
  event,
  onViewDetails,
  onRegister,
  onToggleSave,
}: EventCardProps) {
  // Format readable date
  const startDate = new Date(event.start_datetime);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Status color styles
  const getStatusBadge = () => {
    switch (event.event_status) {
      case "Registration Open":
        return <Badge variant="success">Registration Open</Badge>;
      case "Filling Fast":
        return <Badge variant="warning">Filling Fast</Badge>;
      case "Event Full":
        return <Badge variant="danger">Event Full</Badge>;
      case "Registration Closed":
        return <Badge variant="outline">Registration Closed</Badge>;
      case "Completed":
        return <Badge variant="outline">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="danger">Cancelled</Badge>;
      default:
        return <Badge variant="default">{event.event_status}</Badge>;
    }
  };

  const isClosed =
    event.event_status === "Registration Closed" ||
    event.event_status === "Completed" ||
    event.event_status === "Cancelled";

  return (
    <div className="rounded-3xl bg-[#130d28] border border-purple-500/25 hover:border-purple-400/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group shadow-xl">
      {/* Event Poster / Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#07050d]">
        <img
          src={event.poster_url}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#130d28] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-bold tracking-wide px-3 py-1 rounded-xl bg-[#07050d]/85 backdrop-blur-md text-purple-200 border border-purple-400/30 shadow-xs">
            {event.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(event.id);
            }}
            className="p-1.5 rounded-xl bg-[#07050d]/85 backdrop-blur-md text-purple-200 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Save event"
          >
            <Bookmark className={`w-3.5 h-3.5 ${event.is_saved ? "fill-purple-400 text-purple-400" : ""}`} />
          </button>
        </div>

        {/* Bottom Mode & Fee info */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-bold text-white">
          <span className="flex items-center gap-1.5 bg-[#07050d]/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[11px] border border-white/10">
            {event.event_mode === "Online" ? <Video className="w-3.5 h-3.5 text-cyan-400" /> : <MapPin className="w-3.5 h-3.5 text-purple-300" />}
            {event.event_mode}
          </span>
          <span className="font-black bg-[#6c35de] px-2.5 py-1 rounded-lg text-[11px] text-white shadow-xs">
            {event.participation_fee === 0 ? "FREE" : `₹${event.participation_fee}`}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            {getStatusBadge()}
            {event.is_registered && (
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Registered
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors line-clamp-1">
            {event.name}
          </h3>

          <p className="text-xs text-lavender-200 line-clamp-2 mt-1 leading-relaxed font-medium">
            {event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-2 text-xs text-purple-300 border-t border-white/10 pt-3 font-medium">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            <span className="truncate text-purple-100">{formattedDate} • {formattedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-purple-300 shrink-0" />
            <span className="truncate text-purple-100">{event.venue}</span>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="flex items-center gap-1.5 text-purple-300 font-bold">
              <Users className="w-3 h-3" />
              {event.registered_count} / {event.capacity} seats
            </span>
            <span className="text-amber-300 font-bold font-mono">
              Closes {new Date(event.registration_deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onViewDetails(event)}
            className="flex-1 text-xs"
          >
            Details
          </Button>

          {event.is_registered ? (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onViewDetails(event)}
              className="flex-1 text-xs text-emerald-300 border-emerald-500/40 bg-emerald-950/40"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              Pass Active
            </Button>
          ) : (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onRegister(event)}
              disabled={isClosed}
              className="flex-1 text-xs"
            >
              {event.event_status === "Event Full" ? "Join Waitlist" : "Register Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
