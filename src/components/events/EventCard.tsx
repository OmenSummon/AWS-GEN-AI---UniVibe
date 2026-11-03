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
        return <Badge variant="outline" className="text-rose-400 border-rose-500/30">Event Full</Badge>;
      case "Registration Closed":
        return <Badge variant="outline" className="text-gray-400">Registration Closed</Badge>;
      case "Completed":
        return <Badge variant="outline" className="text-gray-400">Completed</Badge>;
      case "Cancelled":
        return <Badge variant="outline" className="text-red-400 border-red-500/30">Cancelled</Badge>;
      default:
        return <Badge variant="default">{event.event_status}</Badge>;
    }
  };

  const isClosed =
    event.event_status === "Registration Closed" ||
    event.event_status === "Completed" ||
    event.event_status === "Cancelled";

  return (
    <div className="rounded-2xl bg-midnight-850/80 border border-violet/20 hover:border-violet/40 transition-all duration-300 flex flex-col justify-between overflow-hidden glass-card-hover group shadow-lg">
      {/* Event Poster / Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-midnight-950">
        <img
          src={event.poster_url}
          alt={event.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight-900 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold tracking-wide px-2.5 py-1 rounded-lg bg-midnight-950/80 backdrop-blur-md text-violet-light border border-violet/30">
            {event.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(event.id);
            }}
            className="p-1.5 rounded-lg bg-midnight-950/80 backdrop-blur-md text-lavender-300 hover:text-white border border-white/10 transition-colors"
            title="Save event"
          >
            <Bookmark className={`w-3.5 h-3.5 ${event.is_saved ? "fill-violet text-violet" : ""}`} />
          </button>
        </div>

        {/* Bottom Mode & Fee info */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-medium text-white">
          <span className="flex items-center gap-1 bg-midnight-950/70 backdrop-blur-sm px-2 py-0.5 rounded text-[11px]">
            {event.event_mode === "Online" ? <Video className="w-3 h-3 text-cyan-400" /> : <MapPin className="w-3 h-3 text-violet-light" />}
            {event.event_mode}
          </span>
          <span className="font-bold bg-violet/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] text-white">
            {event.participation_fee === 0 ? "FREE" : `₹${event.participation_fee}`}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            {getStatusBadge()}
            {event.is_registered && (
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Registered
              </span>
            )}
          </div>

          <h3 className="text-base font-bold text-white group-hover:text-violet-light transition-colors line-clamp-1">
            {event.name}
          </h3>

          <p className="text-xs text-lavender-300 line-clamp-2 mt-1 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="space-y-1.5 text-xs text-lavender-400 border-t border-white/5 pt-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-violet-light shrink-0" />
            <span className="truncate">{formattedDate} • {formattedTime}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-lavender-400 shrink-0" />
            <span className="truncate text-lavender-300">{event.venue}</span>
          </div>

          <div className="flex items-center justify-between pt-1 text-[11px]">
            <span className="flex items-center gap-1 text-lavender-400">
              <Users className="w-3 h-3" />
              {event.registered_count} / {event.capacity} seats
            </span>
            <span className="text-amber-400/90 font-mono">
              Closes {new Date(event.registration_deadline).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
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
              className="flex-1 text-xs text-emerald-300 border-emerald-500/30"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Pass Active
            </Button>
          ) : (
            <Button
              size="sm"
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

