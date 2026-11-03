"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Calendar,
  FileText,
  Settings,
  ChevronRight,
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
  { name: "Event Intelligence", href: "/organizer/event-reports", icon: BarChart3 },
  { name: "Event Reports", href: "/organizer/event-reports", icon: FileText },
  { name: "Settings", href: "/organizer/settings", icon: Settings },
];

export function OrganizerSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#170d30] border-b border-purple-500/20 sticky top-0 z-40">
        <Link href="/organizer/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6c35de] to-[#a855f7] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white">
            UniVibe
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/10 text-white"
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
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#170d30] text-white border-r border-purple-950 flex flex-col transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="p-6 pb-4">
          <Link href="/organizer/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6c35de] via-[#8a4bfa] to-[#b182ff] flex items-center justify-center shadow-lg shadow-purple-950/50">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-white leading-none">
                UniVibe
              </div>
              <div className="text-[11px] font-semibold text-purple-300 mt-1">
                Organizer
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
          {organizerNavItems.map((item, idx) => {
            const isActive = pathname === item.href && (idx !== 5 || pathname === "/organizer/event-reports");
            const Icon = item.icon;

            return (
              <Link
                key={`${item.name}-${idx}`}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#6c35de] text-white shadow-md shadow-purple-950/40"
                    : "text-purple-200/70 hover:text-white hover:bg-white/5"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-white" : "text-purple-300/60"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Plan Better Organize Smarter Footer Card */}
        <div className="p-4">
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#26154d] to-[#1d0e3b] border border-purple-500/20 shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="text-xs font-bold text-white mb-1">
                Plan Better Organize Smarter
              </div>
              <div className="text-[11px] text-purple-200/70 leading-relaxed mb-3">
                Turn your event ideas into impact with AI.
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-purple-300 font-medium">JIS University</span>
                <Link
                  href="/roles"
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-300 hover:text-white"
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
