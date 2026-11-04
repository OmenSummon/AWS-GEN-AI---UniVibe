"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Database } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function Navbar({ title, subtitle, actionButton }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xs">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#150a33] flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#645c84] mt-0.5 font-medium">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Transparent AI & DB Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50/90 border border-purple-200 text-xs font-semibold text-[#6c35de]">
          <Sparkles className="w-3.5 h-3.5 text-[#6c35de] animate-pulse" />
          <span>PartyRock AI Workflow</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#6c35de]" />
          <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
            <Database className="w-3 h-3 text-emerald-600" /> Neon DB Ready
          </span>
        </div>

        {actionButton ? (
          actionButton
        ) : (
          <Link href="/dashboard/concierge">
            <Button size="sm" variant="primary" className="text-xs shadow-sm">
              <MessageSquare className="w-3.5 h-3.5 mr-1" />
              Ask Concierge
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}
