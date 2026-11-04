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

function safeDecode(val: string): string {
  if (!val) return "";
  try {
    let curr = val;
    for (let i = 0; i < 3; i++) {
      if (curr.includes("%")) {
        curr = decodeURIComponent(curr);
      } else {
        break;
      }
    }
    return curr;
  } catch (e) {
    return val;
  }
}

export default function StudentDashboardOverview() {
  const [studentName, setStudentName] = useState("Student");
  const [studentAvatar, setStudentAvatar] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const nameMatch = document.cookie.match(/univibe_user_name=([^;]+)/);
      const avatarMatch = document.cookie.match(/univibe_user_avatar=([^;]+)/);
      if (nameMatch && nameMatch[1]) {
        try {
          const decoded = decodeURIComponent(nameMatch[1].trim());
          if (decoded) setStudentName(decoded);
        } catch (e) {}
      }
      if (avatarMatch && avatarMatch[1]) {
        try {
          const decoded = decodeURIComponent(avatarMatch[1].trim());
          if (decoded) setStudentAvatar(decoded);
        } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile?.student_name) {
            setStudentName(data.profile.student_name);
            if (data.profile?.avatar_url) {
              setStudentAvatar(data.profile.avatar_url);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile", err);
      }
    }
    loadProfile();
  }, []);

  return (
    <div className="w-full">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#FEFEFE] tracking-tight flex items-center gap-2">
            Welcome back, {studentName}! 👋
          </h1>
          <p className="text-sm text-[#D4D4D4] mt-1">
            Here's your personalized campus snapshot at JIS University.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-full bg-[#353434] border border-[#444343] shadow-sm flex items-center justify-center text-[#FEFEFE] hover:text-[#E4B74A] transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#E4B74A] shadow-sm bg-[#446B8D] flex items-center justify-center shrink-0">
            {studentAvatar && !avatarError ? (
              <img
                src={studentAvatar}
                alt={studentName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <span className="text-sm font-bold text-[#FEFEFE] select-none">
                {studentName ? studentName.charAt(0).toUpperCase() : "S"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Hero Banner: Your Campus Potential */}
      <div className="relative rounded-3xl p-8 bg-[#446B8D] border border-[#E4B74A]/40 text-[#FEFEFE] shadow-xl shadow-[#2C2B2B]/60 overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
        <div className="relative z-10 max-w-lg space-y-3">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#FEFEFE]">
            Your Campus Potential
          </h2>
          <p className="text-[#FEFEFE]/90 text-sm leading-relaxed">
            A quick view of your strengths and growth areas.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E4B74A] hover:bg-[#EDC460] text-xs font-bold text-[#2C2B2B] transition-all shadow-md"
            >
              <span>View Full Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#2C2B2B]" />
            </Link>
          </div>
        </div>

        {/* Character Visual */}
        <div className="relative z-10 shrink-0 self-center sm:self-auto">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-[#E4B74A] shadow-2xl bg-[#353434]">
            {studentAvatar && !avatarError ? (
              <img
                src={studentAvatar}
                alt={studentName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#FEFEFE] text-3xl font-extrabold bg-[#446B8D]">
                {studentName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-[#E4B74A]/10 to-transparent pointer-events-none" />
      </div>

      {/* Two Column Grid: Intelligence Scores & Archetype / Mission */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Card (2 cols): UniVibe Intelligence Scores with Hexagon Radar */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#FEFEFE]">
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
                  stroke="#444343"
                  strokeWidth="1.5"
                />
                <polygon
                  points="150,50 220,90 220,170 150,210 80,170 80,90"
                  fill="none"
                  stroke="#383737"
                  strokeWidth="1"
                />
                <polygon
                  points="150,80 190,105 190,155 150,180 110,155 110,105"
                  fill="none"
                  stroke="#383737"
                  strokeWidth="1"
                />

                {/* Score polygon fill */}
                <polygon
                  points="150,30 242,80 230,180 150,225 65,175 60,82"
                  fill="rgba(68, 107, 141, 0.45)"
                  stroke="#446B8D"
                  strokeWidth="2.5"
                />

                {/* Corner Dots */}
                <circle cx="150" cy="30" r="4.5" fill="#E4B74A" />
                <circle cx="242" cy="80" r="4.5" fill="#E4B74A" />
                <circle cx="230" cy="180" r="4.5" fill="#E4B74A" />
                <circle cx="150" cy="225" r="4.5" fill="#E4B74A" />
                <circle cx="65" cy="175" r="4.5" fill="#E4B74A" />
                <circle cx="60" cy="82" r="4.5" fill="#E4B74A" />

                {/* Corner Labels */}
                <text x="150" y="14" textAnchor="middle" fill="#FEFEFE" fontSize="10" fontWeight="600">Expertise</text>
                <text x="260" y="75" textAnchor="start" fill="#FEFEFE" fontSize="10" fontWeight="600">Creativity</text>
                <text x="255" y="190" textAnchor="start" fill="#FEFEFE" fontSize="10" fontWeight="600">Leadership</text>
                <text x="150" y="254" textAnchor="middle" fill="#FEFEFE" fontSize="10" fontWeight="600">Engagement</text>
                <text x="35" y="190" textAnchor="end" fill="#FEFEFE" fontSize="10" fontWeight="600">Innovation</text>
                <text x="40" y="75" textAnchor="end" fill="#FEFEFE" fontSize="10" fontWeight="600">Networking</text>
              </svg>
            </div>

            {/* Scores Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#D4D4D4]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#446B8D]" />
                  Technical Potential
                </span>
                <span className="font-bold text-[#FEFEFE]">92</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#D4D4D4]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E4B74A]" />
                  Creativity
                </span>
                <span className="font-bold text-[#FEFEFE]">86</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#D4D4D4]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#446B8D]" />
                  Leadership
                </span>
                <span className="font-bold text-[#FEFEFE]">78</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#D4D4D4]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E4B74A]" />
                  Networking
                </span>
                <span className="font-bold text-[#FEFEFE]">80</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#D4D4D4]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E4B74A]" />
                  Innovation
                </span>
                <span className="font-bold text-[#FEFEFE]">88</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-[#D4D4D4]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#446B8D]" />
                  Campus Engagement
                </span>
                <span className="font-bold text-[#FEFEFE]">91</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Stack (1 col): Archetype + Current Level-Up Mission */}
        <div className="space-y-6">
          {/* Your Archetype Card */}
          <div className="p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#E4B74A]">
              <Sparkles className="w-4 h-4 text-[#E4B74A]" />
              <span>Your Archetype</span>
            </div>

            <div className="text-xl font-extrabold text-[#FEFEFE]">
              The Campus Innovator
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#242323] text-[#FEFEFE] border border-[#444343]">
                Creative
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#242323] text-[#FEFEFE] border border-[#444343]">
                Proactive
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#242323] text-[#FEFEFE] border border-[#444343]">
                Collaborative
              </span>
            </div>
          </div>

          {/* Current Level-Up Mission */}
          <div className="p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E4B74A]">
                <Target className="w-4 h-4 text-[#E4B74A]" />
                <span>Current Level-Up Mission</span>
              </div>
              <span className="text-xs font-semibold text-[#A8A8A8]">2 / 3 tasks</span>
            </div>

            <p className="text-xs font-semibold text-[#FEFEFE] leading-relaxed">
              Participate in a tech or innovation challenge this month.
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-[#242323] rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-[#446B8D] h-2.5 rounded-full transition-all duration-500"
                style={{ width: "67%" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recommended For You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#FEFEFE]">
            Recommended For You
          </h3>
          <Link
            href="/dashboard/matches"
            className="text-xs font-semibold text-[#E4B74A] hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <Link
            href="/dashboard/events"
            className="p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm hover:shadow-md hover:border-[#446B8D] transition-all flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#242323] overflow-hidden shrink-0 border border-[#444343]">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=150&q=80"
                alt="CodeStorm Hackathon"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#FEFEFE] truncate group-hover:text-[#E4B74A] transition-colors">
                CodeStorm Hackathon
              </h4>
              <div className="text-[11px] font-medium text-[#446B8D] mt-0.5">
                Hackathon
              </div>
              <div className="text-[11px] font-bold text-[#E4B74A] flex items-center gap-0.5 mt-1">
                <span>↗ 96% Match</span>
              </div>
            </div>
          </Link>

          {/* Card 2 */}
          <Link
            href="/dashboard/events"
            className="p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm hover:shadow-md hover:border-[#446B8D] transition-all flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#242323] overflow-hidden shrink-0 border border-[#444343]">
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&q=80"
                alt="AI Innovation Workshop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#FEFEFE] truncate group-hover:text-[#E4B74A] transition-colors">
                AI Innovation Workshop
              </h4>
              <div className="text-[11px] font-medium text-[#446B8D] mt-0.5">
                Workshop
              </div>
              <div className="text-[11px] font-bold text-[#E4B74A] flex items-center gap-0.5 mt-1">
                <span>↗ 92% Match</span>
              </div>
            </div>
          </Link>

          {/* Card 3 */}
          <Link
            href="/dashboard/events"
            className="p-6 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm hover:shadow-md hover:border-[#446B8D] transition-all flex items-center gap-4 group"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#242323] overflow-hidden shrink-0 border border-[#444343]">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=150&q=80"
                alt="Startup Pitch Arena"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-sm text-[#FEFEFE] truncate group-hover:text-[#E4B74A] transition-colors">
                Startup Pitch Arena
              </h4>
              <div className="text-[11px] font-medium text-[#446B8D] mt-0.5">
                Entrepreneurship
              </div>
              <div className="text-[11px] font-bold text-[#E4B74A] flex items-center gap-0.5 mt-1">
                <span>↗ 89% Match</span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
