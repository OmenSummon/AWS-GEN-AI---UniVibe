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
          <h1 className="text-2xl md:text-3xl font-black text-[#150a33] tracking-tight">
            My Campus Initiatives
          </h1>
          <p className="text-xs md:text-sm text-[#645c84] mt-1 font-medium">
            Manage your lifecycle stages from drafting to university publishing.
          </p>
        </div>

        <Link
          href="/organizer/create-event"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-[#6c35de] hover:brightness-110 text-white text-xs font-bold shadow-md shadow-fuchsia-500/20 cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Proposal</span>
        </Link>
      </div>

      {/* Delete feedback banner */}
      {deleteNotice && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center justify-between font-medium shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-red-600 shrink-0" />
            <span>{deleteNotice}</span>
          </div>
          <button
            onClick={() => setDeleteNotice(null)}
            className="text-red-700 hover:text-red-900 text-xs font-bold px-2 py-0.5 rounded cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shadow-2xs ${
                activeFilter === filter
                  ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/25"
                  : "bg-gray-50 border border-gray-200 text-gray-700 hover:text-fuchsia-700 hover:border-fuchsia-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-[#150a33] placeholder-gray-400 focus:outline-none focus:border-fuchsia-500 font-medium"
          />
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <div className="flex items-center justify-center p-12 text-[#645c84] gap-2 font-medium">
          <Loader2 className="w-5 h-5 animate-spin text-fuchsia-600" />
          <span className="text-sm">Loading initiatives...</span>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 space-y-3 shadow-xs">
          <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
          <p className="text-sm font-bold text-[#150a33]">No initiatives found.</p>
          <Link
            href="/organizer/create-event"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-fuchsia-600 hover:text-fuchsia-700"
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
                className="p-6 rounded-3xl bg-white border border-gray-200 hover:border-fuchsia-300 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm"
              >
                {/* Event Details */}
                <div className="space-y-2.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-fuchsia-700 uppercase tracking-wider bg-fuchsia-50 px-2.5 py-0.5 rounded-full border border-fuchsia-200">
                      {evt.basics?.event_category || "Technical"}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      ID: {evt.id}
                    </span>
                    <span className="text-xs text-gray-300">&bull;</span>
                    <span className="text-xs text-gray-600 font-semibold">
                      {evt.timeline?.proposed_event_date || "Date TBD"}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-[#150a33]">
                    {eventName}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 max-w-3xl leading-relaxed font-medium">
                    {evt.basics?.event_description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1 font-medium">
                    <span>Capacity: {evt.registration?.max_registration_capacity || 0}</span>
                    <span>&bull;</span>
                    <span>Target: {evt.audience?.expected_participants || 0} attendees</span>
                    {evt.final_report && (
                      <>
                        <span>&bull;</span>
                        <span className="text-emerald-700 font-bold">
                          Readiness: {evt.final_report.event_readiness_assessment?.readiness_score}/100
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Status & Actions Column */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 font-semibold">Status:</span>
                    <select
                      value={evt.status}
                      onChange={(e) => handleStatusChange(evt.id, e.target.value as EventLifecycleStatus)}
                      className="px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-[#150a33] focus:outline-none focus:border-fuchsia-500 cursor-pointer"
                    >
                      <option value="Draft">Draft</option>
                      <option value="In Planning">In Planning</option>
                      <option value="Pending Review">Pending Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Published">Published</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Two Buttons per Event */}
                  <div className="flex flex-wrap items-center gap-2">
                    {isPublished ? (
                      <Link
                        href={`/organizer/create-event?id=${evt.id}`}
                        className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-xs font-bold text-emerald-800 flex items-center gap-1.5 transition-all shadow-xs"
                        title={`Modify published details for "${eventName}"`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Modify event</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/organizer/create-event?id=${evt.id}`}
                        className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-xs font-bold text-[#6c35de] flex items-center gap-1.5 transition-all shadow-xs"
                        title={`Edit "${eventName}" and load pre-existing details`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#6c35de]" />
                        <span>Edit event</span>
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDeleteEvent(evt.id, evt.basics?.event_name)}
                      disabled={deletingId === evt.id}
                      className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-xs font-bold text-red-700 flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                      title={`Permanently delete "${eventName}" from the database`}
                    >
                      {deletingId === evt.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-red-600" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-red-600" />
                      )}
                      <span>{deletingId === evt.id ? "Deleting..." : "Delete Event"}</span>
                    </button>

                    {isPublished && (
                      <Link
                        href="/dashboard/events"
                        target="_blank"
                        className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-gray-700 flex items-center gap-1 transition-colors"
                        title="Preview in Student Hub"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
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
