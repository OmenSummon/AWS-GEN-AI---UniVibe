"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  Compass,
  Code2,
  Cpu,
  Rocket,
  Award,
  ChevronRight
} from "lucide-react";

export default function StudentDashboardOverview() {
  const [studentName, setStudentName] = useState("Aditi");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.student_name) {
            setStudentName(data.profile.student_name);
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
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
            Welcome back, {studentName}! 👋
          </h1>
          <p className="text-sm text-[#645c84] mt-0.5">
            Here's your personalized campus snapshot at JIS University.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-200 shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
              alt="Aditi"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Hero Banner: Your Campus Potential */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-[#6025d4] via-[#753be6] to-[#9955fa] text-white shadow-xl shadow-purple-900/15 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="relative z-10 max-w-lg space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Your Campus Potential
          </h2>
          <p className="text-purple-100 text-sm leading-relaxed">
            A quick view of your strengths and growth areas.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-xs font-bold text-white transition-all shadow-sm"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Character Visual */}
        <div className="relative z-10 shrink-0 self-center sm:self-auto">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-purple-900/40">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
              alt="Campus Student Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
      </div>

      {/* Two Column Grid: Intelligence Scores & Archetype / Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card (2 cols): UniVibe Intelligence Scores with Hexagon Radar */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#150a33]">
            UniVibe Intelligence Scores
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center pt-2">
            {/* SVG Hexagonal Radar Visualization */}
            <div className="flex items-center justify-center p-2">
              <svg viewBox="0 0 300 260" className="w-full max-w-[240px] drop-shadow-md">
                {/* Background hexagon grid */}
                <polygon
                  points="150,20 250,75 250,185 150,240 50,185 50,75"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1.5"
                />
                <polygon
                  points="150,50 220,90 220,170 150,210 80,170 80,90"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />
                <polygon
                  points="150,80 190,105 190,155 150,180 110,155 110,105"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="1"
                />

                {/* Score polygon fill */}
                <polygon
                  points="150,30 242,80 230,180 150,225 65,175 60,82"
                  fill="rgba(108, 53, 222, 0.2)"
                  stroke="#6c35de"
                  strokeWidth="2.5"
                />

                {/* Corner Dots */}
                <circle cx="150" cy="30" r="4.5" fill="#6c35de" />
                <circle cx="242" cy="80" r="4.5" fill="#ec4899" />
                <circle cx="230" cy="180" r="4.5" fill="#3b82f6" />
                <circle cx="150" cy="225" r="4.5" fill="#10b981" />
                <circle cx="65" cy="175" r="4.5" fill="#eab308" />
                <circle cx="60" cy="82" r="4.5" fill="#6366f1" />

                {/* Corner Labels */}
                <text x="150" y="14" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">Expertise</text>
                <text x="260" y="75" textAnchor="start" fill="#64748b" fontSize="10" fontWeight="600">Creativity</text>
                <text x="255" y="190" textAnchor="start" fill="#64748b" fontSize="10" fontWeight="600">Leadership</text>
                <text x="150" y="254" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">Engagement</text>
                <text x="35" y="190" textAnchor="end" fill="#64748b" fontSize="10" fontWeight="600">Innovation</text>
                <text x="40" y="75" textAnchor="end" fill="#64748b" fontSize="10" fontWeight="600">Networking</text>
              </svg>
            </div>

            {/* Scores Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6c35de]" />
                  Technical Potential
                </span>
                <span className="font-bold text-[#150a33]">92</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                  Creativity
                </span>
                <span className="font-bold text-[#150a33]">86</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                  Leadership
                </span>
                <span className="font-bold text-[#150a33]">78</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                  Networking
                </span>
                <span className="font-bold text-[#150a33]">80</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                  Innovation
                </span>
                <span className="font-bold text-[#150a33]">88</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#475569]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  Campus Engagement
                </span>
                <span className="font-bold text-[#150a33]">91</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stack (1 col): Archetype + Current Level-Up Mission */}
        <div className="space-y-6">
          {/* Your Archetype Card */}
          <div className="p-6 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#6c35de]">
              <Sparkles className="w-4 h-4 text-[#6c35de]" />
              <span>Your Archetype</span>
            </div>

            <div className="text-xl font-extrabold text-[#150a33]">
              The Campus Innovator
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-[#6c35de] border border-purple-200">
                Creative
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-[#6c35de] border border-purple-200">
                Proactive
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-purple-50 text-[#6c35de] border border-purple-200">
                Collaborative
              </span>
            </div>
          </div>

          {/* Current Level-Up Mission */}
          <div className="p-6 rounded-3xl bg-white border border-gray-150 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6c35de]">
                <Target className="w-4 h-4 text-[#6c35de]" />
                <span>Current Level-Up Mission</span>
              </div>
              <span className="text-xs font-semibold text-gray-500">2 / 3 tasks</span>
            </div>

            <p className="text-xs font-semibold text-[#150a33] leading-relaxed">
              Participate in a tech or innovation challenge this month.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#6c35de] h-2.5 rounded-full transition-all duration-500"
                style={{ width: "67%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recommended For You */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#150a33]">
            Recommended For You
          </h3>
          <Link
            href="/dashboard/matches"
            className="text-xs font-semibold text-[#6c35de] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <Link
            href="/dashboard/events"
            className="p-4 rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-14 h-14 rounded-xl bg-purple-900 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=150&q=80"
                alt="CodeStorm Hackathon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#150a33] truncate group-hover:text-[#6c35de] transition-colors">
                CodeStorm Hackathon
              </h4>
              <div className="text-[11px] font-medium text-purple-600">
                Hackathon
              </div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↗ 96% Match</span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/dashboard/events"
            className="p-4 rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-14 h-14 rounded-xl bg-indigo-900 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"
                alt="AI Innovation Workshop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#150a33] truncate group-hover:text-[#6c35de] transition-colors">
                AI Innovation Workshop
              </h4>
              <div className="text-[11px] font-medium text-purple-600">
                Workshop
              </div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↗ 92% Match</span>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/dashboard/events"
            className="p-4 rounded-2xl bg-white border border-gray-150 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex items-center gap-3.5 group"
          >
            <div className="w-14 h-14 rounded-xl bg-fuchsia-900 overflow-hidden shrink-0">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80"
                alt="Startup Pitch Arena"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#150a33] truncate group-hover:text-[#6c35de] transition-colors">
                Startup Pitch Arena
              </h4>
              <div className="text-[11px] font-medium text-purple-600">
                Entrepreneurship
              </div>
              <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
                <span>↗ 89% Match</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
