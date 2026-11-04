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
    }

    await fetch("/api/opportunities/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: opp.id, isSaved: newSaved }),
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
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#6c35de]" />
            Regenerate Matches
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Verification Status Banner */}
        <div className="p-4 rounded-2xl bg-[#130d28] border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div className="text-xs text-lavender-200">
              <span className="font-bold text-white">Campus Knowledge Grounding: </span>
              Verified items reflect active campus programs. Suggested items are marked as{" "}
              <span className="text-purple-300 font-semibold">"Suggested Opportunity Type — Verification Required"</span>.
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-purple-200 bg-white/10 px-3 py-1 rounded-full shrink-0 border border-white/10">
            {matches?.recommendations?.length || 0} Ranked Recommendations
          </span>
        </div>

        {/* Highlight: Single Best Match (Opaque rich dark gradient) */}
        {bestMatch && (
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1c0f38] via-[#150b2b] to-[#0d071b] border border-purple-500/30 shadow-2xl relative overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#6c35de] text-white text-xs font-bold tracking-wide flex items-center gap-1 shadow-md shadow-purple-900/30">
                  <Star className="w-3.5 h-3.5 fill-white" /> Top AI Recommendation
                </span>
                <Badge variant={bestMatch.verification_status === "VERIFIED" ? "verified" : "suggested"}>
                  {bestMatch.verification_status === "VERIFIED" ? "Official Verified Campus Record" : "Suggested Type"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleToggleSave(bestMatch)}
                  className="text-xs"
                >
                  <Bookmark className={`w-3.5 h-3.5 mr-1 ${bestMatch.is_saved ? "fill-purple-400 text-purple-400" : ""}`} />
                  {bestMatch.is_saved ? "Saved" : "Save Opportunity"}
                </Button>
                <Link href={`/dashboard/outreach?opportunity=${encodeURIComponent(bestMatch.opportunity_name)}`}>
                  <Button size="sm" variant="primary" className="text-xs">
                    <Send className="w-3.5 h-3.5 mr-1" />
                    Launch Outreach Copilot
                  </Button>
                </Link>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {bestMatch.opportunity_name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-lavender-200 mt-2 font-medium">
              <span className="font-bold text-purple-300">{bestMatch.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-lavender-300">
                <Clock className="w-3.5 h-3.5 text-purple-300" /> {bestMatch.time_commitment}
              </span>
              <span>•</span>
              <span className="font-mono text-emerald-300 font-extrabold">{bestMatch.match_score}% Fit Score</span>
            </div>

            <p className="text-sm text-lavender-100 mt-4 leading-relaxed max-w-3xl">
              {bestMatch.why_it_matches}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/15">
              <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20">
                <div className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Career Impact</div>
                <div className="text-xs text-lavender-100 mt-1 font-medium">{bestMatch.career_impact}</div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20">
                <div className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Skills Gained</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {bestMatch.skills_gained?.map((skill, idx) => (
                    <span key={idx} className="text-[10px] px-2.5 py-1 rounded-lg bg-purple-900/60 text-purple-100 border border-purple-400/40 font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20">
                <div className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">First Action</div>
                <div className="text-xs font-bold text-purple-200 mt-1">{bestMatch.first_action}</div>
              </div>
            </div>
          </div>
        )}

        {/* Ranked Opportunity Cards Section */}
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-[#150a33] flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#6c35de]" />
              All {matches?.recommendations?.length || 0} Ranked Opportunities
            </h3>
            <span className="text-xs font-semibold text-[#645c84]">Grounded in verified campus catalog</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches?.recommendations?.map((opp, idx) => {
              return (
                <div
                  key={opp.id}
                  className="p-6 rounded-3xl bg-[#130d28] border border-purple-500/25 hover:border-purple-400/50 transition-all flex flex-col justify-between shadow-xl group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-purple-300 font-mono">#{idx + 1}</span>
                        <span className="text-xs font-bold text-purple-200 uppercase tracking-wider">
                          {opp.category}
                        </span>
                      </div>
                      <Badge variant={opp.verification_status === "VERIFIED" ? "verified" : "suggested"}>
                        {opp.verification_status === "VERIFIED" ? "Verified" : "Suggested"}
                      </Badge>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                      {opp.opportunity_name}
                    </h4>
                    <p className="text-xs text-lavender-200 leading-relaxed line-clamp-3 mb-4">
                      {opp.why_it_matches}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {opp.skills_gained?.slice(0, 3).map((s, i) => (
                        <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-lg bg-white/10 text-purple-200 border border-white/10 font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="font-mono text-emerald-300 font-extrabold">{opp.match_score}% Match</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleSave(opp);
                        }}
                        className="p-2 rounded-xl bg-[#0e081f] hover:bg-purple-900/60 border border-purple-400/20 text-purple-200 transition-colors cursor-pointer"
                        title="Save Opportunity"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${opp.is_saved ? "fill-purple-400 text-purple-400" : ""}`} />
                      </button>
                      <Link
                        href={`/dashboard/outreach?opportunity=${encodeURIComponent(opp.opportunity_name)}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="sm" variant="primary" className="text-xs px-3 py-1 shadow-sm">
                          <Send className="w-3 h-3 mr-1" />
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
      </div>
    </div>
  );
}
