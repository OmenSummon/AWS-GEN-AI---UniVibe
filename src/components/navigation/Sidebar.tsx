"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  User,
  Compass,
  Zap,
  Map,
  Send,
  Calendar,
  MessageSquare,
  Settings,
  ChevronRight,
  Database,
  Menu,
  X,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Profile", href: "/dashboard/profile", icon: User },
  { name: "Discover Opportunities", href: "/dashboard/matches", icon: Compass },
  { name: "Gap Analyzer", href: "/dashboard/gap-analyzer", icon: Zap },
  { name: "My Journey", href: "/dashboard/journey", icon: Map },
  { name: "Outreach Copilot", href: "/dashboard/outreach", icon: Send },
  { name: "Event Hub", href: "/dashboard/events", icon: Calendar },
  { name: "Campus Concierge", href: "/dashboard/concierge", icon: MessageSquare },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-midnight-900 border-b border-violet/15 sticky top-0 z-40">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet to-violet-light flex items-center justify-center shadow-md shadow-violet/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-lavender-200 to-violet-light bg-clip-text text-transparent">
            UniVibe
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-midnight-800 text-lavender-200 hover:text-white"
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
          "fixed top-0 bottom-0 left-0 z-50 w-64 bg-midnight-950/90 backdrop-blur-xl border-r border-violet/15 flex flex-col transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-violet/10">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet via-violet-light to-lavender-300 flex items-center justify-center shadow-lg shadow-violet/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-lavender-200 to-violet-light bg-clip-text text-transparent">
                UniVibe
              </div>
              <div className="text-[10px] uppercase font-semibold text-lavender-400 tracking-wider">
                Student Intelligence
              </div>
            </div>
          </Link>
        </div>

        {/* Student Badge Callout */}
        <div className="px-4 pt-4 pb-2">
          <div className="px-3 py-2 rounded-xl bg-violet/10 border border-violet/20 flex items-center gap-2.5">
            <GraduationCap className="w-4 h-4 text-violet-light shrink-0" />
            <div className="text-xs">
              <div className="font-medium text-white">Student Portal</div>
              <div className="text-[10px] text-lavender-400">Exclusive AI Companion</div>
            </div>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                  isActive
                    ? "bg-gradient-to-r from-violet/25 to-violet/10 text-white border border-violet/30 shadow-sm shadow-violet/10"
                    : "text-lavender-300/80 hover:text-white hover:bg-midnight-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive ? "text-violet-light" : "text-lavender-400 group-hover:text-violet-light"
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 text-violet-light" />}
              </Link>
            );
          })}
        </nav>

        {/* Neon DB / Demo Mode Badge Footer */}
        <div className="p-4 border-t border-violet/10 bg-midnight-900/40">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-midnight-850/80 border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-[11px] font-medium text-lavender-200">
                Neon DB &amp; AI Engine
              </div>
            </div>
            <Database className="w-3.5 h-3.5 text-lavender-400" />
          </div>

          <div className="mt-3 flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-full bg-violet/20 border border-violet/30 flex items-center justify-center text-xs font-semibold text-lavender-200">
              AR
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-white truncate">Alex Rivera</div>
              <div className="text-[10px] text-lavender-400 truncate">CS &amp; Engineering</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

