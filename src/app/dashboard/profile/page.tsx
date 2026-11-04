"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Award,
  Target,
  RefreshCw,
  Info,
  ShieldCheck,
  ChevronRight,
  Clock,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoresChart } from "@/components/charts/ScoresChart";
import { StudentProfileAIResponse } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [aiProfile, setAiProfile] = useState<StudentProfileAIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const loadData = async () => {
    try {
      const res = await fetch("/api/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setAiProfile(data.aiProfile);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    await loadData();
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="My UniVibe Profile"
        subtitle="AI-derived archetype, capability radars, and personalized campus leveling mission."
        actionButton={
          <Button
            size="sm"
            variant="outline"
            onClick={handleRegenerate}
            isLoading={regenerating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#6c35de]" />
            Regenerate Profile
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Archetype Hero Card (Opaque high-contrast dark gradient) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1c0f38] via-[#150b2b] to-[#0d071b] border border-purple-500/30 relative overflow-hidden shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-purple-200 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Campus Personality Archetype</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {aiProfile?.archetype || "The Full-Spectrum Creative Technologist"}
          </h2>
          <p className="text-sm font-semibold text-purple-200 mt-2">
            "{aiProfile?.archetype_tagline || "Transforming complex code into intuitive, human-centered experiences."}"
          </p>
          <p className="text-sm text-lavender-100 mt-4 leading-relaxed max-w-3xl">
            {aiProfile?.archetype_description ||
              "Your inputs indicate high technical curiosity balanced with visual design taste. You thrive when solving authentic campus frictions in collaborative sprint environments."}
          </p>

          <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold text-purple-300">Engagement Style:</span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-900/60 border border-purple-400/40 text-purple-100 shadow-xs">
              {aiProfile?.engagement_style || "Focused Builder with Collaborative Intent"}
            </span>
          </div>
        </div>

        {/* AI Disclaimer Notice (Opaque dark container with high-contrast text) */}
        <div className="p-4 rounded-2xl bg-[#130d28] border border-purple-500/30 flex items-start gap-3 shadow-sm">
          <Info className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
          <div className="text-xs text-lavender-200 leading-relaxed">
            <span className="font-bold text-white">AI Tendencies Notice: </span>
            {aiProfile?.ai_tendencies_disclaimer ||
              "These scores and archetypes are heuristic AI inferences derived directly from your self-reported skills and interests. They indicate current tendencies and developmental avenues rather than fixed psychometric measures."}
          </div>
        </div>

        {/* Six Intelligence Scores Radar & Explanations */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#130d28] border border-purple-500/25 shadow-xl">
          <div className="mb-6">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-300" />
              Six UniVibe Intelligence Scores
            </h3>
            <p className="text-xs text-lavender-300 mt-1 font-medium">
              Quantified potential scores out of 100 with explicit grounding in your declared skills and coursework.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Chart */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {aiProfile?.scores ? (
                <ScoresChart scores={aiProfile.scores} />
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-purple-300">
                  Loading scores...
                </div>
              )}
            </div>

            {/* Progress Bars & Score Explanations */}
            <div className="lg:col-span-7 space-y-4">
              {aiProfile?.score_explanations?.map((item) => (
                <div key={item.factor} className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-white">{item.factor}</span>
                    <span className="text-xs font-mono font-black text-purple-300">{item.score} / 100</span>
                  </div>
                  <div className="w-full bg-[#1b1238] h-2.5 rounded-full overflow-hidden border border-white/5 mb-2.5">
                    <div
                      className="bg-gradient-to-r from-[#6c35de] to-[#a855f7] h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-lavender-200 leading-relaxed">
                    <span className="text-purple-300 font-bold">Rationale: </span>
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level-Up Mission (Opaque dark gradient & high-contrast labels/actions) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#1d1038] via-[#140c28] to-[#0c071a] border border-purple-500/30 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-purple-200 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-purple-300" /> Personalized Level-Up Mission
            </span>
            <Badge variant="default">
              {aiProfile?.level_up_mission?.difficulty || "Intermediate"} Difficulty
            </Badge>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
            {aiProfile?.level_up_mission?.title || "The Campus Signature Project Sprint"}
          </h3>
          <p className="text-sm text-lavender-100 leading-relaxed max-w-3xl mb-6">
            {aiProfile?.level_up_mission?.objective ||
              "Deliver one publicly demonstrable artifact that combines your top technical competency with a campus user need within 21 days."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/15">
            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20">
              <div className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Allocated Bandwidth</div>
              <div className="text-sm font-bold text-white mt-1">
                {aiProfile?.level_up_mission?.estimated_time || "4–5 hours per week"}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20">
              <div className="text-[10px] uppercase font-bold text-purple-300 tracking-wider">Immediate First Step</div>
              <div className="text-sm font-bold text-purple-200 mt-1">
                {aiProfile?.level_up_mission?.first_action || "Draft 1-page design spec and invite 1 peer collaborator."}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Strengths & Growth Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hidden Strengths */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#130d28] border border-purple-500/25 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-300" />
              Hidden Strengths
            </h3>
            <p className="text-xs text-lavender-300 font-medium">
              Unapparent competitive advantages synthesized from your background and tone.
            </p>

            <div className="space-y-4 mt-2">
              {aiProfile?.hidden_strengths?.map((hs, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 space-y-2 shadow-xs">
                  <h4 className="text-sm font-bold text-white">{hs.strength}</h4>
                  <p className="text-xs text-lavender-200 leading-relaxed">
                    <span className="text-purple-300 font-bold">Evidence: </span>
                    {hs.evidence}
                  </p>
                  <p className="text-xs text-purple-200 leading-relaxed font-medium">
                    <span className="text-purple-300 font-bold">How to leverage: </span>
                    {hs.how_to_leverage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className="rounded-3xl p-6 sm:p-8 bg-[#130d28] border border-purple-500/25 space-y-4 shadow-xl">
            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-300" />
              Growth Opportunities
            </h3>
            <p className="text-xs text-lavender-300 font-medium">
              High-impact inflection points where slight focus shifts create outsized returns.
            </p>

            <div className="space-y-4 mt-2">
              {aiProfile?.growth_opportunities?.map((go, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 space-y-2 shadow-xs">
                  <h4 className="text-sm font-bold text-white">{go.area}</h4>
                  <p className="text-xs text-lavender-200 leading-relaxed">
                    <span className="text-purple-300 font-bold">Why it matters: </span>
                    {go.rationale}
                  </p>
                  <p className="text-xs text-emerald-300 leading-relaxed font-semibold">
                    <span className="text-emerald-400 font-bold">Action: </span>
                    {go.high_impact_step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
