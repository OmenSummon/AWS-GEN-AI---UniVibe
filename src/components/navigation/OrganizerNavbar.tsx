"use client";

import React from "react";
import Link from "next/link";
import { Plus, Shield, ArrowLeftRight, Users, Sparkles } from "lucide-react";

export function OrganizerNavbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-midnight-950/80 backdrop-blur-xl border-b border-fuchsia-500/10">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-fuchsia-500/15 border border-fuchsia-500/25 text-fuchsia-300">
          <Shield className="w-3.5 h-3.5" />
          JIS University &bull; Student Organizer Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/organizer/registrations"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-midnight-800/80 hover:bg-midnight-750 border border-fuchsia-500/20 text-xs text-lavender-200 hover:text-white transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>View Registered Teams</span>
        </Link>

        <Link
          href="/roles"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-midnight-800/80 hover:bg-midnight-750 border border-violet/20 text-xs text-lavender-300 hover:text-white transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-violet-light" />
          <span>Switch to Student</span>
        </Link>

        <Link
          href="/organizer/create-event"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-fuchsia-600 to-violet hover:from-fuchsia-500 hover:to-violet text-white text-xs font-semibold shadow-md shadow-fuchsia-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Event</span>
        </Link>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-600 to-violet-light flex items-center justify-center text-xs font-bold text-white shadow-md shadow-fuchsia-500/30">
          AR
        </div>
      </div>
    </header>
  );
}
