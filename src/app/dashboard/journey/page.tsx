"use client";

import React, { useEffect, useState } from "react";
import {
  Map,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  RefreshCw,
  Calendar,
  Flag,
  ArrowRight,
  TrendingUp,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StudentJourneyResult, JourneyMilestone } from "@/types";

export default function JourneyPage() {
  const [journey, setJourney] = useState<StudentJourneyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadJourney = async () => {
    try {
      const res = await fetch("/api/ai/journey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setJourney(data.journey);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    loadJourney();
  }, []);

  const handleToggleMilestone = async (m: JourneyMilestone) => {
    setUpdatingId(m.id);
    const newCompleted = !m.completed;

    try {
      const res = await fetch("/api/journey/milestones", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId: m.id,
          completed: newCompleted,
        }),
      });

      const data = await res.json();
      if (data.journey) {
        setJourney(data.journey);
      }
    } catch (err) {
      console.error("Failed to toggle milestone:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="My Growth Journey"
        subtitle="4-Phase strategic campus execution roadmap with persistent milestone tracking."
        actionButton={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRegenerating(true);
              loadJourney();
            }}
            isLoading={regenerating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#6c35de]" />
            Regenerate Roadmap
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Journey Progress Header (Opaque rich dark gradient) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1c0f38] via-[#150b2b] to-[#0d071b] border border-purple-500/30 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-purple-200 mb-2">
                <Map className="w-3.5 h-3.5 text-purple-300" />
                <span>Student Growth Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {journey?.title || "Strategic Campus Impact Roadmap"}
              </h2>
              <p className="text-sm text-lavender-100 mt-1 max-w-2xl font-medium">
                Check off milestones as you achieve them. Progress is stored in your private database.
              </p>
            </div>

            <div className="bg-[#0e081f] p-5 rounded-2xl border border-purple-400/25 shrink-0 text-center min-w-[180px] shadow-sm">
              <div className="text-3xl font-black text-white">
                {journey?.progress_pct || 0}%
              </div>
              <div className="text-xs text-purple-300 font-bold mt-1">
                {journey?.completed_milestones || 0} of {journey?.total_milestones || 11} Milestones
              </div>
              <div className="w-full bg-[#1b1238] h-2.5 rounded-full mt-3 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-[#6c35de] to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${journey?.progress_pct || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Phases */}
        <div className="space-y-6">
          {journey?.phases?.map((phase) => (
            <div
              key={phase.phase_number}
              className="rounded-3xl p-6 sm:p-8 bg-[#130d28] border border-purple-500/25 space-y-6 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold text-purple-100 bg-purple-900/60 border border-purple-400/40 px-3 py-1 rounded-lg">
                      Phase 0{phase.phase_number}
                    </span>
                    <span className="text-xs text-purple-300 font-bold">{phase.time_horizon}</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-2">{phase.phase_name}</h3>
                </div>
                <p className="text-xs text-lavender-200 max-w-md sm:text-right leading-relaxed">
                  <span className="font-bold text-purple-300">Core Focus: </span>
                  {phase.focus}
                </p>
              </div>

              {/* Milestones in this phase */}
              <div className="space-y-3">
                {phase.milestones?.map((m) => {
                  const isBusy = updatingId === m.id;
                  return (
                    <div
                      key={m.id}
                      onClick={() => !isBusy && handleToggleMilestone(m)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        m.completed
                          ? "bg-emerald-950/40 border-emerald-500/40 shadow-xs"
                          : "bg-[#0e081f] border-purple-400/20 hover:border-purple-400/50 shadow-xs"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isBusy}
                        className="mt-0.5 shrink-0 focus:outline-none cursor-pointer"
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 text-purple-300 hover:text-white" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-sm font-bold transition-all ${
                              m.completed ? "text-lavender-300 line-through" : "text-white"
                            }`}
                          >
                            {m.title}
                          </h4>
                          {m.deadline && (
                            <span className="text-[10px] font-mono font-bold text-purple-300 shrink-0">
                              Target: {m.deadline}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            m.completed ? "text-lavender-300" : "text-lavender-200"
                          }`}
                        >
                          {m.description}
                        </p>
                        {m.completed_at && (
                          <div className="text-[10px] text-emerald-300 font-mono font-bold mt-2">
                            ✓ Completed on {new Date(m.completed_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Final Mission Challenge */}
        {journey?.final_mission_challenge && (
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1c0f38] via-[#150b2b] to-[#0d071b] border border-purple-500/35 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
                <Flag className="w-4 h-4 text-purple-300" /> Capstone UniVibe Challenge
              </span>
              <Badge variant="default">Academic Year Milestone</Badge>
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              {journey.final_mission_challenge.title}
            </h3>
            <p className="text-sm text-lavender-100 leading-relaxed max-w-3xl">
              {journey.final_mission_challenge.vision}
            </p>

            <div className="pt-2">
              <span className="text-xs font-bold text-purple-200 block mb-3">Measurable Outcomes:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {journey.final_mission_challenge.measurable_outcomes?.map((out, idx) => (
                  <li key={idx} className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 text-xs text-lavender-100 flex items-start gap-2.5 font-medium shadow-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-emerald-300 font-bold pt-3 border-t border-white/10">
              End-of-Year Target: {journey.final_mission_challenge.end_of_year_target}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
