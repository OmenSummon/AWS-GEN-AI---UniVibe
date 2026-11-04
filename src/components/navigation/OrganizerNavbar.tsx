"use client";

import React from "react";
import Link from "next/link";
import { Plus, Shield, ArrowLeftRight, Users } from "lucide-react";

export function OrganizerNavbar() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#2C2B2B]/95 backdrop-blur-md border-b border-[#444343] shadow-md">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#353434] border border-[#E4B74A]/40 text-[#E4B74A]">
          <Shield className="w-3.5 h-3.5 text-[#E4B74A]" />
          JIS University &bull; Student Organizer Portal
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/organizer/registrations"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#353434] hover:bg-[#3D3C3C] border border-[#444343] text-xs font-semibold text-[#FEFEFE] hover:text-[#E4B74A] transition-colors"
        >
          <Users className="w-3.5 h-3.5 text-[#446B8D]" />
          <span>View Registered Teams</span>
        </Link>

        <Link
          href="/roles"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#353434] hover:bg-[#3D3C3C] border border-[#444343] text-xs font-semibold text-[#FEFEFE] hover:text-[#E4B74A] transition-colors"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-[#E4B74A]" />
          <span>Switch to Student</span>
        </Link>

        <Link
          href="/organizer/create-event"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#446B8D] hover:bg-[#557FA5] text-[#FEFEFE] text-xs font-bold shadow-md shadow-[#2C2B2B]/50 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Event</span>
        </Link>

        <div className="w-9 h-9 rounded-full bg-[#446B8D] border border-[#E4B74A]/60 flex items-center justify-center text-xs font-black text-[#FEFEFE] shadow-md shadow-[#2C2B2B]/50">
          AR
        </div>
      </div>
    </header>
  );
}
