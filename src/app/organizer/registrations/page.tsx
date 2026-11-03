"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Search,
  Download,
  CheckCircle2,
  Clock,
  Shield,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  Code2,
  Loader2,
  User,
  Building,
  ArrowLeft
} from "lucide-react";

interface RegistrationItem {
  id: string;
  registration_number: string;
  student_id: string;
  event_id: string;
  event?: {
    id: string;
    name: string;
    category: string;
  };
  registration_data: {
    full_name?: string;
    email?: string;
    university?: string;
    department?: string;
    year?: string;
    phone?: string;
    student_id_num?: string;
    registration_type?: "Team" | "Individual";
    team_name?: string;
    team_size?: string | number;
    team_leader?: string;
    teammates?: string;
    tech_skills?: string;
    problem_statement?: string;
    github_profile?: string;
    experience_level?: string;
    topics_of_interest?: string;
  };
  registration_status: string;
  check_in_status?: "Checked In" | "Confirmed";
  submitted_at: string;
}

export default function OrganizerRegistrationsPage() {
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [events, setEvents] = useState<{ id: string; name: string; category: string }[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "Team" | "Individual">("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const loadRegistrations = async () => {
    try {
      const url = new URL("/api/organizer/registrations", window.location.origin);
      if (selectedEventId !== "all") url.searchParams.set("eventId", selectedEventId);
      if (typeFilter !== "all") url.searchParams.set("type", typeFilter);

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setRegistrations(data.registrations || []);
        if (data.events) setEvents(data.events);
      }
    } catch (err) {
      console.error("Error loading registrations", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [selectedEventId, typeFilter]);

  const handleToggleCheckIn = async (regId: string, currentStatus?: string) => {
    setTogglingId(regId);
    const newStatus = currentStatus === "Checked In" ? "Confirmed" : "Checked In";
    try {
      const res = await fetch("/api/organizer/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: regId,
          checkInStatus: newStatus,
        }),
      });
      if (res.ok) {
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === regId || r.registration_number === regId
              ? { ...r, check_in_status: newStatus }
              : r
          )
        );
      }
    } catch (err) {
      console.error("Failed to toggle check-in", err);
    } finally {
      setTogglingId(null);
    }
  };

  // Filtered registrations
  const filteredList = registrations.filter((reg) => {
    const data = reg.registration_data || {};
    const isTeam = data.registration_type === "Team" || Boolean(data.team_name);
    const rType = isTeam ? "Team" : "Individual";

    if (typeFilter !== "all" && rType !== typeFilter) return false;
    if (statusFilter !== "all" && (reg.check_in_status || reg.registration_status) !== statusFilter) {
      return false;
    }

    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const nameMatch = (data.full_name || "").toLowerCase().includes(q);
    const teamMatch = (data.team_name || "").toLowerCase().includes(q);
    const idNumMatch = (data.student_id_num || "").toLowerCase().includes(q);
    const regNumMatch = (reg.registration_number || "").toLowerCase().includes(q);
    const deptMatch = (data.department || "").toLowerCase().includes(q);

    return nameMatch || teamMatch || idNumMatch || regNumMatch || deptMatch;
  });

  // Calculate Metrics
  const totalCount = registrations.length;
  const teamCount = registrations.filter(
    (r) => r.registration_data?.registration_type === "Team" || Boolean(r.registration_data?.team_name)
  ).length;
  const individualCount = totalCount - teamCount;
  const checkedInCount = registrations.filter((r) => r.check_in_status === "Checked In").length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      "Registration ID",
      "Type",
      "Participant / Team Name",
      "Event Name",
      "Student ID / Roll",
      "Department",
      "Contact Email",
      "Phone",
      "Check-In Status"
    ];

    const rows = filteredList.map((r) => {
      const d = r.registration_data || {};
      const isTeam = d.registration_type === "Team" || Boolean(d.team_name);
      return [
        r.registration_number,
        isTeam ? `Team (${d.team_size || 3} members)` : "Individual",
        isTeam ? d.team_name : d.full_name,
        r.event?.name || "Campus Event",
        d.student_id_num || "N/A",
        d.department || "JIS University",
        d.email || "N/A",
        d.phone || "N/A",
        r.check_in_status || r.registration_status
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jis-university-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/organizer/dashboard"
              className="p-1 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-extrabold text-[#150a33] tracking-tight">
              Registered Individuals &amp; Teams
            </h1>
          </div>
          <p className="text-xs text-[#645c84] ml-7">
            Live JIS University participant roster, hackathon team squads, and venue check-in verification.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredList.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:border-purple-300 text-xs font-bold text-[#150a33] shadow-sm transition-colors cursor-pointer w-fit disabled:opacity-50"
        >
          <Download className="w-4 h-4 text-[#6c35de]" />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="text-xs font-semibold text-gray-500">Total Registrations</div>
          <div className="text-2xl font-black text-[#150a33] mt-1">{totalCount}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <Users className="w-3 h-3 text-[#6c35de]" />
            Across JIS University Events
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="text-xs font-semibold text-purple-600">Hackathon Teams</div>
          <div className="text-2xl font-black text-[#6c35de] mt-1">{teamCount}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <Code2 className="w-3 h-3 text-[#6c35de]" />
            Multi-member squads
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="text-xs font-semibold text-indigo-600">Individual Attendees</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{individualCount}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <User className="w-3 h-3 text-indigo-600" />
            Workshops &amp; Talks
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600">Venue Checked-In</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{checkedInCount}</div>
          <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
            <UserCheck className="w-3 h-3 text-emerald-600" />
            Badges Verified
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-4 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Event Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Select Event
            </label>
            <select
              value={selectedEventId}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] cursor-pointer"
            >
              <option value="all">All JIS University Events</option>
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Participant Type
            </label>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTypeFilter("all")}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  typeFilter === "all"
                    ? "bg-purple-100 text-[#6c35de]"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setTypeFilter("Team")}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  typeFilter === "Team"
                    ? "bg-purple-100 text-[#6c35de]"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                Teams
              </button>
              <button
                onClick={() => setTypeFilter("Individual")}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  typeFilter === "Individual"
                    ? "bg-purple-100 text-[#6c35de]"
                    : "bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                Individuals
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Verification Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] focus:outline-none focus:border-[#6c35de] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="Checked In">Checked In Only</option>
              <option value="Confirmed">Confirmed (Pending Check-In)</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-500 mb-1">
              Search Roster
            </label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, Team, Roll (JIS/...)"
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-gray-200 text-xs text-[#150a33] placeholder-gray-400 focus:outline-none focus:border-[#6c35de]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-150 shadow-sm">
          <Loader2 className="w-6 h-6 animate-spin text-[#6c35de] mx-auto mb-2" />
          <p className="text-xs text-gray-500">Loading attendee rosters...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white border border-gray-150 shadow-sm space-y-2">
          <Users className="w-8 h-8 text-gray-400 mx-auto opacity-50" />
          <p className="text-sm font-semibold text-[#150a33]">No registrations found</p>
          <p className="text-xs text-gray-500">
            Try adjusting your search query or participant type filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredList.map((reg) => {
            const data = reg.registration_data || {};
            const isTeam = data.registration_type === "Team" || Boolean(data.team_name);
            const isCheckedIn = reg.check_in_status === "Checked In";

            return (
              <div
                key={reg.id}
                className={`p-6 rounded-3xl bg-white border transition-all shadow-sm ${
                  isCheckedIn
                    ? "border-emerald-300"
                    : "border-gray-150 hover:border-purple-300"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left Column: Team / Participant Info */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-md">
                        {reg.registration_number}
                      </span>

                      {isTeam ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#6c35de] border border-purple-200 uppercase tracking-wider">
                          <Code2 className="w-3 h-3" /> Team ({data.team_size || 3} Members)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-200 uppercase tracking-wider">
                          <User className="w-3 h-3" /> Individual Attendee
                        </span>
                      )}

                      <span className="text-xs text-gray-400">&bull;</span>
                      <span className="text-xs font-semibold text-[#150a33]">
                        {reg.event?.name || "Campus Event"}
                      </span>
                    </div>

                    {/* Primary Name Header */}
                    <div>
                      <h3 className="text-xl font-bold text-[#150a33] flex items-center gap-2">
                        {isTeam ? data.team_name : data.full_name}
                      </h3>
                      {isTeam && data.team_leader && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          Team Leader: <strong className="text-[#150a33]">{data.team_leader}</strong>{" "}
                          ({data.student_id_num || "JIS Univ"})
                        </p>
                      )}
                    </div>

                    {/* Team Members Roster or Individual Details */}
                    {isTeam && data.teammates && (
                      <div className="p-3 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                        <div className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                          Team Members Roster:
                        </div>
                        <div className="text-xs text-gray-700">
                          {data.teammates}
                        </div>
                      </div>
                    )}

                    {/* Project or Pitch details if present */}
                    {data.problem_statement && (
                      <div className="text-xs text-gray-600">
                        <strong className="text-gray-900">Project / Solution Focus:</strong>{" "}
                        {data.problem_statement}
                      </div>
                    )}

                    {/* Academic & Contact Details Row */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-gray-400" />
                        <span>{data.department || "JIS University"} &bull; {data.year || "Student"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span>{data.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{data.phone}</span>
                      </div>
                      {data.student_id_num && (
                        <div className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-gray-400" />
                          <span>Roll: {data.student_id_num}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Check-In Action & Status Badge */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      {isCheckedIn ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked In
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          <Clock className="w-3.5 h-3.5" /> Confirmed (Pending Check-In)
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleCheckIn(reg.id, reg.check_in_status)}
                      disabled={togglingId === reg.id}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isCheckedIn
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          : "bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-600/20"
                      }`}
                    >
                      {togglingId === reg.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isCheckedIn ? (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Revert to Confirmed</span>
                        </>
                      ) : (
                        <>
                          <UserCheck className="w-3.5 h-3.5 text-white" />
                          <span>Verify &amp; Check In</span>
                        </>
                      )}
                    </button>
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
