"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Calendar,
  Settings,
  Menu,
  X,
  Users,
  BarChart3,
  ArrowLeftRight
} from "lucide-react";
import { cn } from "@/lib/utils";

const organizerNavItems = [
  { name: "Overview", href: "/organizer/dashboard", icon: LayoutDashboard },
  { name: "Create Event", href: "/organizer/create-event", icon: PlusCircle },
  { name: "My Events", href: "/organizer/my-events", icon: Calendar },
  { name: "Registrations & Teams", href: "/organizer/registrations", icon: Users },
  { name: "Event Intelligence and Report", href: "/organizer/event-reports", icon: BarChart3 },
  { name: "Settings", href: "/organizer/settings", icon: Settings },
];

export function OrganizerSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#222121] border-b border-[#444343] sticky top-0 z-40">
        <Link href="/organizer/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#446B8D] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-[#E4B74A]" />
          </div>
          <span className="font-extrabold text-lg text-[#FEFEFE]">
            UniVibe
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-[#353434] text-[#FEFEFE]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#222121] text-[#FEFEFE] border-r border-[#444343] flex flex-col transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="p-6 pb-4">
          <Link href="/organizer/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#446B8D] border border-[#E4B74A]/40 flex items-center justify-center shadow-lg shadow-[#2C2B2B]/60">
              <Sparkles className="w-5 h-5 text-[#E4B74A]" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-[#FEFEFE] leading-none">
                UniVibe
              </div>
              <div className="text-[11px] font-semibold text-[#E4B74A] mt-1">
                Organizer
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          {organizerNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#446B8D] text-[#FEFEFE] shadow-md shadow-[#2C2B2B]/60 font-semibold"
                    : "text-[#D4D4D4] hover:text-[#FEFEFE] hover:bg-[#353434]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-[#E4B74A]" : "text-[#A8A8A8]"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Organizer Notice Card */}
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-[#353434] border border-[#444343] shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs font-bold text-[#FEFEFE] mb-1">
                Organizing Hub
              </div>
              <div className="text-[11px] text-[#D4D4D4] leading-relaxed mb-3">
                Plan, analyze and publish verified events for JIS University.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#A8A8A8] font-medium">JIS Tech Club</span>
                <Link
                  href="/roles"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E4B74A] hover:text-[#FEFEFE]"
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  <span>Switch Role</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
