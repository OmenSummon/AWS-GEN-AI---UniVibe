"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
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
  CalendarDays
} from "lucide-react";

export default function OrganizerDashboardPage() {
  const [organizerName, setOrganizerName] = useState("Rohan");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/organizer/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.name) {
            setOrganizerName(data.profile.name.split(" ")[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load organizer profile", err);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#150a33] tracking-tight flex items-center gap-2">
            Welcome back, {organizerName}! 👋
          </h1>
          <p className="text-sm text-[#645c84] mt-0.5">
            Plan, analyze, and deliver impactful campus events at JIS University.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80"
              alt="Rohan"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Metrics Row (5 white cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Events */}
        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6c35de] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#150a33]">12</div>
          <div className="text-xs font-semibold text-gray-500 mt-0.5">Total Events</div>
        </div>

        {/* Draft Events */}
        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#150a33]">4</div>
          <div className="text-xs font-semibold text-gray-500 mt-0.5">Draft Events</div>
        </div>

        {/* Pending Review */}
        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#150a33]">3</div>
          <div className="text-xs font-semibold text-gray-500 mt-0.5">Pending Review</div>
        </div>

        {/* Published Events */}
        <div className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#150a33]">4</div>
          <div className="text-xs font-semibold text-gray-500 mt-0.5">Published Events</div>
        </div>

        {/* Total Registrations */}
        <Link
          href="/organizer/registrations"
          className="p-5 rounded-2xl bg-white border border-gray-150 shadow-sm hover:border-purple-300 transition-colors col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6c35de] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#6c35de]">1,248</div>
          <div className="text-xs font-semibold text-gray-500 mt-0.5">Total Registrations &rarr;</div>
        </Link>
      </div>

      {/* Middle Section: Event Planning Progress & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Event Planning Progress */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#150a33]">
            Event Planning Progress
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-1">
            {/* Circular Progress Gauge */}
            <div className="flex flex-col items-center justify-center p-3">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#f1f5f9"
                    strokeWidth="11"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="58"
                    stroke="#6c35de"
                    strokeWidth="11"
                    strokeDasharray="364"
                    strokeDashoffset="120"
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-[#150a33]">67%</span>
                  <span className="text-[10px] text-gray-500 font-semibold">Overall Progress</span>
                </div>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-xs text-[#150a33]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">Event Basics</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#150a33]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">Audience &amp; Reach</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#150a33]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="font-semibold">Timeline</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-400">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                <span>Resources &amp; Logistics</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-400">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                <span>Strategic Objectives</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-400">
                <div className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                <span>Registration &amp; Eligibility</span>
              </div>

              <div className="pt-2">
                <Link
                  href="/organizer/create-event"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6c35de] hover:bg-[#7b41ee] text-xs font-bold text-white shadow-md shadow-purple-900/20 transition-all"
                >
                  <span>Continue Planning</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right (1 col): Quick Actions (4 square button tiles) */}
        <div className="p-6 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#150a33]">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <Link
              href="/organizer/create-event"
              className="p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-100 flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6c35de] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#150a33]">Create New Event</span>
            </Link>

            <Link
              href="/organizer/create-event"
              className="p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-100 flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6c35de] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#150a33]">Continue Draft</span>
            </Link>

            <Link
              href="/organizer/event-reports"
              className="p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-100 flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6c35de] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#150a33]">Generate Event Report</span>
            </Link>

            <Link
              href="/organizer/my-events"
              className="p-4 rounded-2xl bg-purple-50/60 hover:bg-purple-100/70 border border-purple-100 flex flex-col items-center justify-center text-center group transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#6c35de] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-[#150a33]">View My Events</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Events Table */}
      <div className="p-6 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#150a33]">
            Recent Events
          </h3>
          <Link
            href="/organizer/my-events"
            className="text-xs font-semibold text-[#6c35de] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                <th className="pb-3 pl-2">Event Name</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Registrations</th>
                <th className="pb-3">Last Updated</th>
                <th className="pb-3 pr-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[#150a33]">
              {/* Row 1 */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 pl-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-900 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=100&q=80"
                      alt="TechFest 2026"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm">TechFest 2026</div>
                    <div className="text-[10px] text-gray-400">JIS University</div>
                  </div>
                </td>
                <td className="py-3.5 text-gray-600">Technical Fest</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-600 border border-amber-200">
                    In Planning
                  </span>
                </td>
                <td className="py-3.5 text-gray-500">—</td>
                <td className="py-3.5 text-gray-500">2 hours ago</td>
                <td className="py-3.5 pr-2 text-right">
                  <Link
                    href="/organizer/create-event"
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 inline-block"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Link>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 pl-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-fuchsia-900 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=100&q=80"
                      alt="Campus Cultural Night"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm">Campus Cultural Night</div>
                    <div className="text-[10px] text-gray-400">JIS University</div>
                  </div>
                </td>
                <td className="py-3.5 text-gray-600">Cultural</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200">
                    Published
                  </span>
                </td>
                <td className="py-3.5 font-semibold text-[#150a33]">486</td>
                <td className="py-3.5 text-gray-500">1 day ago</td>
                <td className="py-3.5 pr-2 text-right">
                  <Link
                    href="/organizer/registrations"
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 inline-block"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Link>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-purple-50/30 transition-colors">
                <td className="py-3.5 pl-2 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-900 overflow-hidden shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80"
                      alt="AI Innovation Workshop"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold text-sm">AI Innovation Workshop</div>
                    <div className="text-[10px] text-gray-400">JIS University</div>
                  </div>
                </td>
                <td className="py-3.5 text-gray-600">Workshop</td>
                <td className="py-3.5">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-[#6c35de] border border-purple-200">
                    Pending Review
                  </span>
                </td>
                <td className="py-3.5 text-gray-500">—</td>
                <td className="py-3.5 text-gray-500">2 days ago</td>
                <td className="py-3.5 pr-2 text-right">
                  <Link
                    href="/organizer/create-event"
                    className="p-1 rounded-lg hover:bg-gray-100 text-gray-500 inline-block"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
