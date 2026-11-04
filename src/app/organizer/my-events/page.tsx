"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
  Edit3,
  ExternalLink,
  Loader2,
  Search,
  Calendar,
  Trash2,
  CheckCircle2
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteNotice, setDeleteNotice] = useState<string | null>(null);

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

  const handleDeleteEvent = async (id: string, name?: string) => {
    const eventTitle = name || "this event";
    const confirmed = window.confirm(
      `Are you sure you want to delete "${eventTitle}"? This will delete the event from the database entirely.`
    );
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/organizer/events/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        setDeleteNotice(`"${eventTitle}" has been deleted from the database.`);
        setTimeout(() => setDeleteNotice(null), 5000);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "Failed to delete event.");
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      alert("Failed to delete event. Please check your connection.");
    } finally {
      setDeletingId(null);
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
          <h1 className="text-2xl md:text-3xl font-black text-[#FEFEFE] tracking-tight">
            My Campus Initiatives
          </h1>
          <p className="text-xs md:text-sm text-[#D4D4D4] mt-1 font-medium">
            Manage your lifecycle stages from drafting to university publishing.
          </p>
        </div>

        <Link
          href="/organizer/create-event"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#446B8D] hover:bg-[#557FA5] text-[#FEFEFE] text-xs font-bold shadow-md cursor-pointer w-fit transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Delete feedback banner */}
      {deleteNotice && (
        <div className="p-4 rounded-2xl bg-[#B71C1C]/15 border border-[#B71C1C]/40 text-[#FEFEFE] text-xs flex items-center justify-between font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#B71C1C] shrink-0" />
            <span>{deleteNotice}</span>
          </div>
          <button
            onClick={() => setDeleteNotice(null)}
            className="text-[#E4B74A] hover:text-[#FEFEFE] text-xs font-bold px-2 py-0.5 rounded cursor-pointer transition-colors"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shadow-2xs ${
                activeFilter === filter
                  ? "bg-[#446B8D] text-[#FEFEFE] shadow-md"
                  : "bg-[#242323] border border-[#444343] text-[#D4D4D4] hover:text-[#FEFEFE] hover:border-[#446B8D]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#888888] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#242323] border border-[#444343] text-xs text-[#FEFEFE] placeholder-[#888888] focus:outline-none focus:border-[#446B8D] font-medium"
          />
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-[#D4D4D4] gap-2 font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-[#E4B74A]" />
          <span className="text-sm">Loading initiatives...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#353434] border border-[#444343] space-y-3 shadow-xs">
          <Calendar className="w-10 h-10 text-[#888888] mx-auto" />
          <p className="text-sm font-bold text-[#FEFEFE]">No initiatives found.</p>
          <Link
            href="/organizer/create-event"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E4B74A] hover:text-[#FEFEFE] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create your first event</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((evt) => {
            const isPublished = evt.status === "Published";
            const eventName = evt.basics?.event_name || "Untitled Initiative";

            return (
              <div
                key={evt.id}
                className="p-6 rounded-3xl bg-[#353434] border border-[#444343] hover:border-[#446B8D] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm"
              >
                {/* Event Details */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-[#E4B74A] uppercase tracking-wider bg-[#242323] px-2.5 py-0.5 rounded-full border border-[#444343]">
                      {evt.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-xs text-[#888888] font-mono">
                      ID: {evt.id}
                    </span>
                    <span className="text-xs text-[#888888]">&bull;</span>
                    <span className="text-xs text-[#D4D4D4] font-semibold">
                      {evt.timeline?.proposed_event_date || "Date TBD"}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#FEFEFE]">
                    {eventName}
                  </h3>

                  <p className="text-xs text-[#D4D4D4] line-clamp-2 max-w-3xl leading-relaxed font-medium">
                    {evt.basics?.event_description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#888888] pt-1 font-medium">
                    <span>Capacity: {evt.registration?.max_registration_capacity || 0}</span>
                    <span>&bull;</span>
                    <span>Target: {evt.audience?.expected_participants || 0} attendees</span>
                    {evt.final_report && (
                      <>
                        <span>&bull;</span>
                        <span className="text-[#E4B74A] font-bold">
                          Readiness: {evt.final_report.event_readiness_assessment?.readiness_score}/100
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status & Actions Column */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#D4D4D4] font-semibold">Status:</span>
                    <select
                      value={evt.status}
                      onChange={(e) => handleStatusChange(evt.id, e.target.value as EventLifecycleStatus)}
                      className="px-3 py-1.5 rounded-xl bg-[#242323] border border-[#444343] text-xs font-bold text-[#FEFEFE] focus:outline-none focus:border-[#446B8D] cursor-pointer"
                    >
                      <option value="Draft" className="bg-[#2C2B2B]">Draft</option>
                      <option value="In Planning" className="bg-[#2C2B2B]">In Planning</option>
                      <option value="Pending Review" className="bg-[#2C2B2B]">Pending Review</option>
                      <option value="Approved" className="bg-[#2C2B2B]">Approved</option>
                      <option value="Published" className="bg-[#2C2B2B]">Published</option>
                      <option value="Completed" className="bg-[#2C2B2B]">Completed</option>
                    </select>
                  </div>

                  {/* Buttons per Event */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isPublished ? (
                      <Link
                        href={`/organizer/create-event?id=${evt.id}`}
                        className="px-4 py-2 rounded-xl bg-[#446B8D]/20 hover:bg-[#446B8D]/30 border border-[#446B8D]/40 text-xs font-bold text-[#FEFEFE] flex items-center gap-1.5 transition-all shadow-xs"
                        title={`Modify published details for "${eventName}"`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#E4B74A]" />
                        <span>Modify event</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/organizer/create-event?id=${evt.id}`}
                        className="px-4 py-2 rounded-xl bg-[#242323] hover:bg-[#446B8D] border border-[#444343] text-xs font-bold text-[#E4B74A] hover:text-[#FEFEFE] flex items-center gap-1.5 transition-all shadow-xs"
                        title={`Edit "${eventName}" and load pre-existing details`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#E4B74A]" />
                        <span>Edit event</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(evt.id, evt.basics?.event_name)}
                      disabled={deletingId === evt.id}
                      className="px-4 py-2 rounded-xl bg-[#B71C1C]/15 hover:bg-[#B71C1C]/25 border border-[#B71C1C]/40 text-xs font-bold text-[#B71C1C] hover:text-[#FEFEFE] flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title={`Permanently delete "${eventName}" from the database`}
                    >
                      {deletingId === evt.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#B71C1C]" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-[#B71C1C]" />
                      )}
                      <span>{deletingId === evt.id ? "Deleting..." : "Delete Event"}</span>
                    </button>

                    {isPublished && (
                      <Link
                        href="/dashboard/events"
                        target="_blank"
                        className="p-2 rounded-xl bg-[#242323] hover:bg-[#2c2b2b] border border-[#444343] text-xs text-[#D4D4D4] flex items-center gap-1 transition-colors"
                        title="Preview in Student Hub"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-[#888888]" />
                      </Link>
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