"use client";

import React from "react";
import Link from "next/link";
import { Plus, Shield, ArrowLeftRight, Users } from "lucide-react";

export function OrganizerNavbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-gray-200/80 shadow-2xs">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700">
          <Shield className="w-3.5 h-3.5 text-fuchsia-600" />
          JIS University &bull; Student Organizer Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/organizer/registrations"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-fuchsia-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:text-fuchsia-700 transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-fuchsia-600" />
          <span>View Registered Teams</span>
        </Link>

        <Link
          href="/roles"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-purple-50 border border-gray-200 text-xs font-semibold text-gray-700 hover:text-[#6c35de] transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#6c35de]" />
          <span>Switch to Student</span>
        </Link>

        <Link
          href="/organizer/create-event"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-violet hover:from-fuchsia-500 hover:to-violet text-white text-xs font-bold shadow-md shadow-fuchsia-500/20 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Event</span>
        </Link>

        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-fuchsia-600 to-[#6c35de] flex items-center justify-center text-xs font-black text-white shadow-md shadow-purple-900/20">
          AR
        </div>
      </div>
    </header>
  );
}
