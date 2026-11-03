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
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-violet-light" />
            Regenerate Roadmap
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Journey Progress Header */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet/25 via-midnight-800 to-midnight-850 border border-violet/25 relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 border border-violet/30 text-xs text-lavender-200 mb-2">
                <Map className="w-3.5 h-3.5 text-violet-light" />
                <span>Student Growth Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {journey?.title || "Strategic Campus Impact Roadmap"}
              </h2>
              <p className="text-sm text-lavender-300 mt-1 max-w-2xl">
                Check off milestones as you achieve them. Progress is stored in your private database.
              </p>
            </div>

            <div className="bg-midnight-950/80 p-5 rounded-2xl border border-white/10 shrink-0 text-center min-w-[180px]">
              <div className="text-3xl font-extrabold text-white">
                {journey?.progress_pct || 0}%
              </div>
              <div className="text-xs text-lavender-400 mt-1">
                {journey?.completed_milestones || 0} of {journey?.total_milestones || 11} Milestones
              </div>
              <div className="w-full bg-midnight-900 h-2 rounded-full mt-3 overflow-hidden border border-white/5">
                <div
                  className="bg-gradient-to-r from-violet to-emerald-400 h-full transition-all duration-300"
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
              className="rounded-2xl p-6 sm:p-8 bg-midnight-850/80 border border-violet/20 space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-violet-light bg-violet/15 px-2.5 py-0.5 rounded">
                      Phase 0{phase.phase_number}
                    </span>
                    <span className="text-xs text-lavender-400 font-medium">{phase.time_horizon}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1.5">{phase.phase_name}</h3>
                </div>
                <p className="text-xs text-lavender-400 max-w-md sm:text-right">
                  <span className="font-semibold text-lavender-200">Core Focus: </span>
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
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                        m.completed
                          ? "bg-emerald-500/10 border-emerald-500/30"
                          : "bg-midnight-900/80 border-white/5 hover:border-violet/40"
                      }`}
                    >
                      <button
                        type="button"
                        disabled={isBusy}
                        className="mt-0.5 shrink-0 focus:outline-none"
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 text-lavender-400 hover:text-violet-light" />
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
                            <span className="text-[10px] font-mono text-lavender-400 shrink-0">
                              Target: {m.deadline}
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-1 leading-relaxed ${
                            m.completed ? "text-lavender-400/80" : "text-lavender-300"
                          }`}
                        >
                          {m.description}
                        </p>
                        {m.completed_at && (
                          <div className="text-[10px] text-emerald-400/90 mt-2 font-mono">
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
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet/30 via-midnight-800 to-midnight-900 border border-violet/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-light uppercase tracking-wider flex items-center gap-1.5">
                <Flag className="w-4 h-4" /> Capstone UniVibe Challenge
              </span>
              <Badge variant="default">Academic Year Milestone</Badge>
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              {journey.final_mission_challenge.title}
            </h3>
            <p className="text-sm text-lavender-200 leading-relaxed max-w-3xl">
              {journey.final_mission_challenge.vision}
            </p>

            <div className="pt-2">
              <span className="text-xs font-semibold text-lavender-300 block mb-2">Measurable Outcomes:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {journey.final_mission_challenge.measurable_outcomes?.map((out, idx) => (
                  <li key={idx} className="p-3 rounded-xl bg-midnight-950/70 border border-white/5 text-xs text-lavender-300 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{out}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-emerald-400 font-semibold pt-3 border-t border-white/10">
              End-of-Year Target: {journey.final_mission_challenge.end_of_year_target}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

