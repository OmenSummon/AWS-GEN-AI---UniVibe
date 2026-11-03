"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MessageSquare, Database, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function Navbar({ title, subtitle, actionButton }: NavbarProps) {
  return (
    <header className="sticky top-0 z-30 bg-midnight-950/80 backdrop-blur-xl border-b border-violet/15 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs sm:text-sm text-lavender-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {/* Transparent AI & DB Status Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 border border-violet/20 text-xs text-lavender-300">
          <Sparkles className="w-3.5 h-3.5 text-violet-light animate-pulse" />
          <span>PartyRock AI Workflow</span>
          <span className="w-1 h-1 rounded-full bg-violet-light" />
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <Database className="w-2.5 h-2.5" /> Neon DB Ready
          </span>
        </div>

        {actionButton ? (
          actionButton
        ) : (
          <Link href="/dashboard/concierge">
            <Button size="sm" variant="secondary" className="text-xs">
              <MessageSquare className="w-3.5 h-3.5 text-violet-light" />
              Ask Concierge
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
}

