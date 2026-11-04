"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Calendar,
  PlusCircle,
  FileText,
  Users,
  Clock,
  CheckCircle2,
  Bell,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  ChevronRight,
  MoreHorizontal,
  Plus,
  BarChart3,
  CalendarDays,
  Loader2
} from "lucide-react";
import { calculateEventProgress } from "@/lib/workflow/masterEventWorkflow";

function safeDecode(val: string | null | undefined): string {
  if (!val) return "";
  try {
    let prev = val;
    let decoded = decodeURIComponent(val);
    while (decoded !== prev && decoded.includes("%")) {
      prev = decoded;
      decoded = decodeURIComponent(decoded);
    }
    return decoded;
  } catch {
    return val || "";
  }
}

export default function OrganizerDashboardPage() {
  const router = useRouter();
  const [organizerName, setOrganizerName] = useState("Organizer");
  const [organizerAvatar, setOrganizerAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    total: 0,
    drafts: 0,
    pending: 0,
    published: 0,
    registrations: 1248,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Read cookies immediately on mount for zero-flash UI
  useEffect(() => {
    if (typeof document !== "undefined") {
      const nameMatch = document.cookie.match(/univibe_user_name=([^;]+)/);
      const avatarMatch = document.cookie.match(/univibe_user_avatar=([^;]+)/);
      if (nameMatch && nameMatch[1]) {
        const decoded = safeDecode(nameMatch[1].trim());
        if (decoded) setOrganizerName(decoded);
      }
      if (avatarMatch && avatarMatch[1]) {
        const decoded = safeDecode(avatarMatch[1].trim());
        if (decoded) {
          setOrganizerAvatar(decoded);
          setAvatarError(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profileRes, eventsRes, metricsRes] = await Promise.all([
          fetch("/api/organizer/profile").catch(() => null),
          fetch("/api/organizer/events").catch(() => null),
          fetch("/api/organizer/metrics").catch(() => null),
        ]);

        if (profileRes && profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.profile?.name) {
            setOrganizerName(safeDecode(profileData.profile.name));
          }
          if (profileData.profile?.avatar_url) {
            const rawAvatar = safeDecode(profileData.profile.avatar_url);
            setOrganizerAvatar(rawAvatar);
            setAvatarError(false);
          }
        }

        let events: any[] = [];
        if (eventsRes && eventsRes.ok) {
          const eventsData = await eventsRes.json();
          events = eventsData.events || [];
          setEventsList(events);

          if (events.length > 0) {
            // Find the most recent draft / in planning event, or the latest event
            const activeDraft = events.find(
              (e: any) => e.status === "In Planning" || e.status === "Draft"
            ) || events[0];
            setLatestEvent(activeDraft);

            const publishedCount = events.filter(
              (e: any) => e.status === "Published"
            ).length;
            const pendingCount = events.filter((e: any) => {
              if (e.status === "Published") return false;
              if (e.status === "Pending Review") return true;
              const prog = calculateEventProgress(e);
              return prog.overallPercentage === 100;
            }).length;
            const draftsCount = events.filter((e: any) => {
              if (e.status === "Published") return false;
              if (e.status === "Pending Review") return false;
              const prog = calculateEventProgress(e);
              return prog.overallPercentage < 100;
            }).length;

            setMetrics((prev) => ({
              ...prev,
              total: events.length,
              drafts: draftsCount,
              pending: pendingCount,
              published: publishedCount,
            }));
          }
        }

        if (metricsRes && metricsRes.ok) {
          const mData = await metricsRes.json();
          if (mData.metrics) {
            setMetrics((prev) => ({
              ...prev,
              registrations: mData.metrics.total_registrations ?? prev.registrations,
              total: events.length > 0 ? events.length : (mData.metrics.total_events ?? prev.total),
              drafts: events.length > 0 ? prev.drafts : (mData.metrics.draft_events ?? prev.drafts),
              pending: events.length > 0 ? prev.pending : (mData.metrics.pending_review ?? prev.pending),
              published: events.length > 0 ? prev.published : (mData.metrics.published_events ?? prev.published),
            }));
          }
        }
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  // Compute live progress based on the latest saved draft in DB
  const progress = calculateEventProgress(latestEvent);
  const overallPercentage = progress.overallPercentage;
  // Circumference of r=58 is 2 * PI * 58 ~ 364
  const strokeDashoffset = Math.round(364 - (364 * overallPercentage) / 100);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FEFEFE] tracking-tight flex items-center gap-2">
            Welcome back, {organizerName}! 👋
          </h1>
          <p className="text-sm text-[#D4D4D4] mt-0.5">
            Plan, analyze, and deliver impactful campus events at JIS University.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[#353434] border border-[#444343] shadow-sm flex items-center justify-center text-[#FEFEFE] hover:text-[#E4B74A] transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E4B74A]/40 shadow-sm bg-[#446B8D] flex items-center justify-center shrink-0">
            {organizerAvatar && !avatarError ? (
              <img
                src={organizerAvatar}
                alt={organizerName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="text-sm font-bold text-[#FEFEFE] select-none">
                {organizerName ? organizerName.charAt(0).toUpperCase() : "O"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metrics Row (5 cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Events */}
        <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#446B8D]/20 text-[#446B8D] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#FEFEFE]">{metrics.total}</div>
          <div className="text-xs font-semibold text-[#D4D4D4] mt-0.5">Total Events</div>
        </div>

        {/* Draft Events */}
        <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#446B8D]/20 text-[#FEFEFE] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#FEFEFE]">{metrics.drafts}</div>
          <div className="text-xs font-semibold text-[#D4D4D4] mt-0.5">Draft Events</div>
        </div>

        {/* Pending Review */}
        <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#E4B74A]/20 text-[#E4B74A] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#FEFEFE]">{metrics.pending}</div>
          <div className="text-xs font-semibold text-[#D4D4D4] mt-0.5">Pending Review</div>
        </div>

        {/* Published Events */}
        <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#446B8D]/30 text-[#E4B74A] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#FEFEFE]">{metrics.published}</div>
          <div className="text-xs font-semibold text-[#D4D4D4] mt-0.5">Published Events</div>
        </div>

        {/* Total Registrations */}
        <Link
          href="/organizer/registrations"
          className="p-5 rounded-2xl bg-[#353434] border border-[#444343] shadow-sm hover:border-[#E4B74A] transition-colors col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#E4B74A]/20 text-[#E4B74A] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#E4B74A]">
            {metrics.registrations.toLocaleString()}
          </div>
          <div className="text-xs font-semibold text-[#D4D4D4] mt-0.5">Total Registrations &rarr;</div>
        </Link>
      </div>

      {/* Middle Section: Event Planning Progress & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Event Planning Progress */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#FEFEFE]">
              Event Planning Progress
            </h3>
            {latestEvent?.basics?.event_name && (
              <span className="text-xs font-semibold text-[#E4B74A] bg-[#242323] px-2.5 py-1 rounded-full border border-[#444343] max-w-[240px] truncate">
                {latestEvent.basics.event_name}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-1">
            {/* Circular Progress Gauge */}
            <div className="flex flex-col items-center justify-center p-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#242323"
                    strokeWidth="11"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#446B8D"
                    strokeWidth="11"
                    strokeDasharray="364"
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-[#FEFEFE]">{overallPercentage}%</span>
                  <span className="text-[10px] text-[#D4D4D4] font-semibold">Overall Progress</span>
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5">
              {progress.sections.map((sec) => (
                <div
                  key={sec.num}
                  className={`flex items-center gap-2.5 text-xs ${sec.complete ? "text-[#FEFEFE]" : "text-[#888888]"}`}
                >
                  {sec.complete ? (
                    <CheckCircle2 className="w-4 h-4 text-[#E4B74A] shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-[#444343] shrink-0" />
                  )}
                  <span className={sec.complete ? "font-semibold" : ""}>{sec.title}</span>
                </div>
              ))}

              <div className="pt-2">
                <Link
                  href={latestEvent?.id ? `/organizer/create-event?id=${latestEvent.id}` : "/organizer/create-event?mode=continue"}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#446B8D] hover:bg-[#557FA5] text-xs font-bold text-[#FEFEFE] shadow-md transition-all"
                >
                  <span>Continue Planning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 col): Quick Actions (4 square button tiles) */}
        <div className="p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#FEFEFE]">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href="/organizer/create-event"
              className="p-4 rounded-2xl bg-[#242323] hover:bg-[#2c2b2b] border border-[#444343] flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#446B8D]/25 text-[#E4B74A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#FEFEFE]">Create New Event</span>
            </Link>

            <Link
              href={latestEvent?.id ? `/organizer/create-event?id=${latestEvent.id}` : "/organizer/create-event?mode=continue"}
              className="p-4 rounded-2xl bg-[#242323] hover:bg-[#2c2b2b] border border-[#444343] flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#446B8D]/25 text-[#E4B74A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#FEFEFE]">Continue Draft</span>
            </Link>

            <Link
              href="/organizer/event-reports"
              className="p-4 rounded-2xl bg-[#242323] hover:bg-[#2c2b2b] border border-[#444343] flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#446B8D]/25 text-[#E4B74A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#FEFEFE]">Event Intelligence & Report</span>
            </Link>

            <Link
              href="/organizer/my-events"
              className="p-4 rounded-2xl bg-[#242323] hover:bg-[#2c2b2b] border border-[#444343] flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-[#446B8D]/25 text-[#E4B74A] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#FEFEFE]">View My Events</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Events Table */}
      <div className="p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#FEFEFE]">
            Recent Events
          </h3>
          <Link
            href="/organizer/my-events"
            className="text-xs font-semibold text-[#E4B74A] hover:text-[#FEFEFE] flex items-center gap-1 transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#444343] text-[#D4D4D4] font-semibold">
                <th className="pb-3 pl-2">Event Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Registrations</th>
                <th className="pb-3">Last Updated</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#444343] text-[#FEFEFE]">
              {eventsList.length > 0 ? (
                eventsList.slice(0, 5).map((evt: any) => {
                  const name = evt.basics?.event_name || "Untitled Initiative";
                  const category = evt.basics?.event_category || "General";
                  const rawStatus = evt.status || "Draft";
                  const is100 = calculateEventProgress(evt).overallPercentage === 100;
                  const displayStatus =
                    rawStatus === "Published"
                      ? "Published"
                      : is100 || rawStatus === "Pending Review"
                      ? "Pending Review"
                      : "In Planning";
                  const capacity = evt.registration?.max_registration_capacity || evt.audience?.expected_participants || 0;
                  const dateStr = evt.updated_at
                    ? new Date(evt.updated_at).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                    : "Recently";

                  const statusBadge =
                    displayStatus === "Published"
                      ? "bg-[#446B8D]/25 text-[#FEFEFE] border-[#446B8D]/50"
                      : displayStatus === "Pending Review"
                      ? "bg-[#E4B74A]/20 text-[#E4B74A] border-[#E4B74A]/40 font-bold"
                      : "bg-[#242323] text-[#D4D4D4] border-[#444343]";

                  const eventUrl = `/organizer/create-event?id=${evt.id}`;

                  return (
                    <tr
                      key={evt.id}
                      onClick={() => router.push(eventUrl)}
                      className="hover:bg-[#242323]/60 transition-colors cursor-pointer group"
                      title={`Open "${name}" in Create Event editor`}
                    >
                      <td className="py-3.5 pl-2 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#446B8D]/25 text-[#E4B74A] font-bold flex items-center justify-center shrink-0 group-hover:bg-[#446B8D] group-hover:text-[#FEFEFE] transition-colors">
                          {name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={eventUrl}
                            className="font-bold text-sm text-[#FEFEFE] group-hover:text-[#E4B74A] transition-colors hover:underline block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {name}
                          </Link>
                          <div className="text-[10px] text-[#888888]">JIS University</div>
                        </div>
                      </td>
                      <td className="py-3.5 text-[#D4D4D4] font-medium">{category}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusBadge}`}>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-3.5 font-semibold text-[#FEFEFE]">{capacity > 0 ? capacity : "—"}</td>
                      <td className="py-3.5 text-[#D4D4D4]">{dateStr}</td>
                      <td className="py-3.5 pr-2 text-right">
                        <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <Link
                            href={eventUrl}
                            className="px-2.5 py-1 rounded-lg bg-[#242323] hover:bg-[#446B8D] text-[#E4B74A] hover:text-[#FEFEFE] border border-[#444343] text-[11px] font-bold transition-all inline-flex items-center gap-1 shadow-2xs"
                            title="Open in Create Event Editor"
                          >
                            <span>Edit</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#888888]">
                    No events found in Neon DB yet. Click "Create New Event" to start planning!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}