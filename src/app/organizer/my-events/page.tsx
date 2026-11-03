"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  ExternalLink,
  Loader2,
  Search,
  Calendar
} from "lucide-react";
import { OrganizerEvent, EventLifecycleStatus } from "@/types";

const STATUS_FILTERS: (EventLifecycleStatus | "All")[] = [
  "All",
  "Draft",
  "In Planning",
  "Pending Review",
  "Approved",
  "Published",
  "Completed",
];

export default function MyEventsPage() {
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<EventLifecycleStatus | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEvents = async () => {
    try {
      const res = await fetch("/api/organizer/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.error("Error loading organizer events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleStatusChange = async (id: string, newStatus: EventLifecycleStatus) => {
    try {
      const res = await fetch(`/api/organizer/events/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        await loadEvents();
      }
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const filteredEvents = events.filter((evt) => {
    const matchesFilter = activeFilter === "All" || evt.status === activeFilter;
    const name = evt.basics?.event_name || "";
    const category = evt.basics?.event_category || "";
    const matchesSearch =
      !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            My Campus Initiatives
          </h1>
          <p className="text-xs md:text-sm text-lavender-300 mt-1">
            Manage your lifecycle stages from drafting to university publishing.
          </p>
        </div>

        <Link
          href="/organizer/create-event"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet hover:from-fuchsia-500 hover:to-violet text-white text-xs font-bold shadow-md shadow-fuchsia-500/20 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-midnight-900/80 border border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeFilter === filter
                  ? "bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30"
                  : "text-lavender-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-lavender-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-midnight-800 border border-white/10 text-xs text-white placeholder-lavender-400 focus:outline-none focus:border-fuchsia-500"
          />
        </div>
      </div>

      {/* Event Cards List */}
      {loading ? (
        <div className="p-12 text-center rounded-2xl bg-midnight-900/60 border border-white/5">
          <Loader2 className="w-6 h-6 animate-spin text-fuchsia-400 mx-auto mb-2" />
          <p className="text-xs text-lavender-400">Loading your events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-midnight-900/60 border border-white/5 space-y-3">
          <p className="text-sm text-lavender-300">No events found matching this filter.</p>
          <Link
            href="/organizer/create-event"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" /> Create New Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-6 rounded-2xl bg-midnight-900/80 border border-white/10 hover:border-fuchsia-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-fuchsia-300 uppercase tracking-wider bg-fuchsia-500/15 px-2.5 py-0.5 rounded-full border border-fuchsia-500/25">
                    {evt.basics?.event_category || "Technical"}
                  </span>
                  <span className="text-xs text-lavender-400">
                    ID: {evt.id}
                  </span>
                  <span className="text-xs text-lavender-400">&bull;</span>
                  <span className="text-xs text-lavender-300">
                    {evt.timeline?.proposed_event_date || "Date TBD"}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">
                  {evt.basics?.event_name || "Untitled Initiative"}
                </h3>

                <p className="text-xs text-lavender-300 line-clamp-2 max-w-3xl">
                  {evt.basics?.event_description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-lavender-400 pt-1">
                  <span>Capacity: {evt.registration?.max_registration_capacity || 0}</span>
                  <span>&bull;</span>
                  <span>Target: {evt.audience?.expected_participants || 0} attendees</span>
                  {evt.final_report && (
                    <>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-semibold">
                        Readiness: {evt.final_report.event_readiness_assessment?.readiness_score}/100
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status & Actions Column */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-lavender-400">Status:</span>
                  <select
                    value={evt.status}
                    onChange={(e) => handleStatusChange(evt.id, e.target.value as EventLifecycleStatus)}
                    className="px-2.5 py-1 rounded-lg bg-midnight-800 border border-white/10 text-xs font-semibold text-white focus:outline-none focus:border-fuchsia-500 cursor-pointer"
                  >
                    <option value="Draft">Draft</option>
                    <option value="In Planning">In Planning</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Published">Published</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/organizer/registrations"
                    className="px-3 py-1.5 rounded-lg bg-fuchsia-500/15 hover:bg-fuchsia-500/25 border border-fuchsia-500/30 text-xs text-fuchsia-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Search className="w-3.5 h-3.5 text-fuchsia-400" />
                    <span>View Teams &amp; Attendees</span>
                  </Link>

                  <Link
                    href={`/organizer/create-event?id=${evt.id}`}
                    className="px-3 py-1.5 rounded-lg bg-midnight-800 hover:bg-midnight-750 border border-white/10 text-xs text-lavender-200 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-lavender-400" />
                    <span>Edit Proposal</span>
                  </Link>

                  {evt.status === "Published" && (
                    <Link
                      href="/dashboard/events"
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-1.5 transition-colors"
                    >
                      <span>View in Student Hub</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
