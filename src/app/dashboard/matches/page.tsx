"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Calendar,
  Clock,
  Briefcase,
  ArrowRight,
  Send,
  RefreshCw,
  Star,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MatchAIResult, OpportunityRecommendation } from "@/types";

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchAIResult | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<OpportunityRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const loadMatches = async () => {
    try {
      const res = await fetch("/api/ai/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setMatches(data.matches);
      if (data.matches?.recommendations?.[0]) {
        setSelectedOpp(data.matches.recommendations[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleToggleSave = async (opp: OpportunityRecommendation) => {
    const newSaved = !opp.is_saved;
    // optimistic update
    if (matches) {
      const updated = matches.recommendations.map((item) =>
        item.id === opp.id ? { ...item, is_saved: newSaved } : item
      );
      setMatches({ ...matches, recommendations: updated });
      if (selectedOpp?.id === opp.id) {
        setSelectedOpp({ ...selectedOpp, is_saved: newSaved });
      }
    }

    await fetch("/api/opportunities/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: opp.id, isSaved: newSaved }),
    });
  };

  const handleToggleInterest = async (opp: OpportunityRecommendation) => {
    const newInterest = !opp.is_interested;
    if (matches) {
      const updated = matches.recommendations.map((item) =>
        item.id === opp.id ? { ...item, is_interested: newInterest } : item
      );
      setMatches({ ...matches, recommendations: updated });
      if (selectedOpp?.id === opp.id) {
        setSelectedOpp({ ...selectedOpp, is_interested: newInterest });
      }
    }

    await fetch("/api/opportunities/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: opp.id, isInterested: newInterest }),
    });
  };

  const bestMatch = matches?.recommendations?.find((m) => m.is_best_match) || matches?.recommendations?.[0];

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Opportunity Match AI"
        subtitle="Ranked campus opportunities grounded in verified university catalogs &amp; AI vector heuristics."
        actionButton={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRegenerating(true);
              loadMatches();
            }}
            isLoading={regenerating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-violet-light" />
            Regenerate Matches
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Verification Status Banner (Requirement 8 & 13) */}
        <div className="p-4 rounded-xl bg-midnight-900 border border-violet/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-lavender-300">
              <span className="font-semibold text-white">Campus Knowledge Grounding: </span>
              Verified items reflect active campus programs. Suggested items are marked as{" "}
              <span className="text-indigo-300 font-medium">"Suggested Opportunity Type — Verification Required"</span>.
            </div>
          </div>
          <span className="text-[11px] font-mono text-lavender-400 bg-white/5 px-3 py-1 rounded-full shrink-0">
            5 Ranked Recommendations
          </span>
        </div>

        {/* Highlight: Single Best Match */}
        {bestMatch && (
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet/30 via-midnight-800 to-midnight-850 border border-violet/40 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-violet/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-violet text-white text-xs font-bold tracking-wide flex items-center gap-1 shadow-md shadow-violet/30">
                  <Star className="w-3.5 h-3.5 fill-white" /> Top AI Recommendation
                </span>
                <Badge variant={bestMatch.verification_status === "VERIFIED" ? "verified" : "suggested"}>
                  {bestMatch.verification_status === "VERIFIED" ? "Official Verified Campus Record" : "Suggested Type"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant={bestMatch.is_saved ? "secondary" : "outline"}
                  onClick={() => handleToggleSave(bestMatch)}
                  className="text-xs"
                >
                  <Bookmark className={`w-3.5 h-3.5 mr-1 ${bestMatch.is_saved ? "fill-violet text-violet" : ""}`} />
                  {bestMatch.is_saved ? "Saved" : "Save Opportunity"}
                </Button>
                <Link href={`/dashboard/outreach?opportunity=${encodeURIComponent(bestMatch.opportunity_name)}`}>
                  <Button size="sm" className="text-xs">
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Launch Outreach Copilot
                  </Button>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {bestMatch.opportunity_name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-lavender-300 mt-2">
              <span className="font-semibold text-violet-light">{bestMatch.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-lavender-400" /> {bestMatch.time_commitment}
              </span>
              <span>•</span>
              <span className="font-mono text-emerald-400 font-bold">{bestMatch.match_score}% Fit Score</span>
            </div>

            <p className="text-sm text-lavender-200 mt-4 leading-relaxed max-w-3xl">
              {bestMatch.why_it_matches}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
              <div className="p-3.5 rounded-xl bg-midnight-950/70 border border-white/5">
                <div className="text-[10px] uppercase font-semibold text-lavender-400">Career Impact</div>
                <div className="text-xs text-lavender-200 mt-1">{bestMatch.career_impact}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-midnight-950/70 border border-white/5">
                <div className="text-[10px] uppercase font-semibold text-lavender-400">Skills Gained</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {bestMatch.skills_gained?.map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-violet/20 text-lavender-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-midnight-950/70 border border-white/5">
                <div className="text-[10px] uppercase font-semibold text-lavender-400">First Action</div>
                <div className="text-xs font-semibold text-violet-light mt-1">{bestMatch.first_action}</div>
              </div>
            </div>
          </div>
        )}

        {/* 5 Ranked Opportunity Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-violet-light" />
              All 5 Ranked Opportunities
            </h3>
            <span className="text-xs text-lavender-400">Click any card to inspect details</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {matches?.recommendations?.map((opp, idx) => {
              const isSelected = selectedOpp?.id === opp.id;
              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className={`p-5 rounded-2xl bg-midnight-850/80 border transition-all cursor-pointer flex flex-col justify-between glass-card-hover ${
                    isSelected ? "border-violet ring-1 ring-violet shadow-lg shadow-violet/20" : "border-violet/20 hover:border-violet/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-lavender-400 font-mono">#{idx + 1}</span>
                        <span className="text-xs font-semibold text-violet-light uppercase tracking-wider">
                          {opp.category}
                        </span>
                      </div>
                      <Badge variant={opp.verification_status === "VERIFIED" ? "verified" : "suggested"}>
                        {opp.verification_status === "VERIFIED" ? "Verified" : "Suggested"}
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2">{opp.opportunity_name}</h4>
                    <p className="text-xs text-lavender-300 leading-relaxed line-clamp-3 mb-4">
                      {opp.why_it_matches}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {opp.skills_gained?.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-violet/15 text-lavender-300">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-400 font-bold">{opp.match_score}% Match</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(opp);
                        }}
                        className="p-1.5 rounded-lg bg-midnight-900 hover:bg-violet/20 text-lavender-300"
                        title="Save Opportunity"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${opp.is_saved ? "fill-violet text-violet" : ""}`} />
                      </button>
                      <Link
                        href={`/dashboard/outreach?opportunity=${encodeURIComponent(opp.opportunity_name)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" variant="secondary" className="text-xs px-2.5 py-1">
                          <Send className="w-3 h-3 text-violet-light mr-1" />
                          Outreach
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Opportunity Detailed View */}
        {selectedOpp && (
          <div className="rounded-2xl p-6 bg-midnight-900 border border-violet/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-xs uppercase font-semibold text-violet-light tracking-wider">
                  Inspecting Opportunity
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedOpp.opportunity_name}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant={selectedOpp.is_interested ? "secondary" : "outline"}
                  onClick={() => handleToggleInterest(selectedOpp)}
                  className="text-xs"
                >
                  <Star className={`w-3.5 h-3.5 mr-1 ${selectedOpp.is_interested ? "fill-amber-400 text-amber-400" : ""}`} />
                  {selectedOpp.is_interested ? "Marked Interested" : "Mark as Interested"}
                </Button>
                <Link href={`/dashboard/outreach?opportunity=${encodeURIComponent(selectedOpp.opportunity_name)}`}>
                  <Button size="sm" className="text-xs">
                    Draft Outreach Message
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-lavender-300">
              <div className="p-3.5 rounded-xl bg-midnight-950 border border-white/5">
                <span className="font-semibold text-white block mb-1">Eligibility:</span>
                {selectedOpp.eligibility}
              </div>
              <div className="p-3.5 rounded-xl bg-midnight-950 border border-white/5">
                <span className="font-semibold text-white block mb-1">Verification Details:</span>
                {selectedOpp.verification_details || "Verified via Student Affairs"}
              </div>
            </div>
          </div>
        )}

        {/* Personalized 7-Day Mission */}
        {matches?.seven_day_mission && (
          <div className="rounded-2xl p-6 sm:p-8 bg-midnight-850/80 border border-violet/20 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/15 text-xs text-lavender-200 mb-2">
                <Calendar className="w-3.5 h-3.5 text-violet-light" />
                <span>Onboarding Action Plan</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {matches.seven_day_mission.mission_title}
              </h3>
              <p className="text-xs text-lavender-400 mt-1">
                A daily progressive breakdown to build verifiable campus momentum.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {matches.seven_day_mission.daily_actions.map((day) => (
                <div key={day.day} className="p-3.5 rounded-xl bg-midnight-900 border border-white/5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-violet-light uppercase">
                      Day 0{day.day}
                    </span>
                    <p className="text-xs text-white font-medium mt-1 leading-snug">{day.action}</p>
                  </div>
                  <div className="text-[10px] text-emerald-400 mt-3 pt-2 border-t border-white/5">
                    ✓ {day.outcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

