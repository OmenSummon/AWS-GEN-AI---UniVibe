"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  TrendingUp,
  Award,
  RefreshCw,
  Info,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Target,
  ShieldAlert,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoresChart } from "@/components/charts/ScoresChart";
import { UniVibeProfileResult, StudentProfile } from "@/types";

export default function ProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [aiProfile, setAiProfile] = useState<UniVibeProfileResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const loadData = async () => {
    try {
      const pRes = await fetch("/api/profile");
      const pData = await pRes.json();
      setProfile(pData.profile);

      if (pData.profile) {
        const aiRes = await fetch("/api/ai/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: pData.profile.id }),
        });
        const aiData = await aiRes.json();
        setAiProfile(aiData.aiProfile);
      }
    } catch (e) {
      console.error(e);
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
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-violet-light" />
            Regenerate Profile
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Archetype Hero Card */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet/25 via-midnight-800 to-midnight-850 border border-violet/25 relative overflow-hidden shadow-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 border border-violet/30 text-xs text-lavender-200 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-violet-light" />
            <span>Campus Personality Archetype</span>
          </div>

          <h2 className="text-3xl font-extrabold text-white">
            {aiProfile?.archetype || "The Full-Spectrum Creative Technologist"}
          </h2>
          <p className="text-sm font-medium text-violet-light mt-1">
            "{aiProfile?.archetype_tagline || "Transforming complex code into intuitive, human-centered experiences."}"
          </p>
          <p className="text-sm text-lavender-300 mt-4 leading-relaxed max-w-3xl">
            {aiProfile?.archetype_description ||
              "Your inputs indicate high technical curiosity balanced with visual design taste. You thrive when solving authentic campus frictions in collaborative sprint environments."}
          </p>

          <div className="mt-6 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-lavender-400">Engagement Style:</span>
            <Badge variant="default" className="text-xs">
              {aiProfile?.engagement_style || "Focused Builder with Collaborative Intent"}
            </Badge>
          </div>
        </div>

        {/* AI Disclaimer Notice (Requirement 8) */}
        <div className="p-4 rounded-xl bg-midnight-900 border border-violet/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-violet-light shrink-0 mt-0.5" />
          <div className="text-xs text-lavender-300 leading-relaxed">
            <span className="font-semibold text-white">AI Tendencies Notice: </span>
            {aiProfile?.ai_tendencies_disclaimer ||
              "These scores and archetypes are heuristic AI inferences derived directly from your self-reported skills and interests. They indicate current tendencies and developmental avenues rather than fixed psychometric measures."}
          </div>
        </div>

        {/* Six Intelligence Scores Radar & Explanations */}
        <div className="rounded-2xl p-6 bg-midnight-850/80 border border-violet/20">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-violet-light" />
              Six UniVibe Intelligence Scores
            </h3>
            <p className="text-xs text-lavender-400 mt-0.5">
              Quantified potential scores out of 100 with explicit grounding in your declared skills and coursework.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Chart */}
            <div className="lg:col-span-5 flex flex-col items-center">
              {aiProfile?.scores ? (
                <ScoresChart scores={aiProfile.scores} />
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-lavender-400">
                  Loading scores...
                </div>
              )}
            </div>

            {/* Progress Bars & Score Explanations */}
            <div className="lg:col-span-7 space-y-4">
              {aiProfile?.score_explanations?.map((item) => (
                <div key={item.factor} className="p-3.5 rounded-xl bg-midnight-900/60 border border-white/5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">{item.factor}</span>
                    <span className="text-xs font-mono font-bold text-violet-light">{item.score} / 100</span>
                  </div>
                  <div className="w-full bg-midnight-950 h-2 rounded-full overflow-hidden border border-white/5 mb-2">
                    <div
                      className="bg-gradient-to-r from-violet to-violet-light h-full rounded-full transition-all duration-500"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-lavender-400 leading-relaxed">
                    <span className="text-lavender-300 font-semibold">Rationale: </span>
                    {item.rationale}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Level-Up Mission */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-violet/20 via-midnight-850 to-midnight-900 border border-violet/30 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-lavender-300 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-violet-light" /> Personalized Level-Up Mission
            </span>
            <Badge variant="default">
              {aiProfile?.level_up_mission?.difficulty || "Intermediate"} Difficulty
            </Badge>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">
            {aiProfile?.level_up_mission?.title || "The Campus Signature Project Sprint"}
          </h3>
          <p className="text-sm text-lavender-300 leading-relaxed max-w-3xl mb-6">
            {aiProfile?.level_up_mission?.objective ||
              "Deliver one publicly demonstrable artifact that combines your top technical competency with a campus user need within 21 days."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div className="p-4 rounded-xl bg-midnight-950/60 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-lavender-400">Allocated Bandwidth</div>
              <div className="text-sm font-bold text-white mt-1">
                {aiProfile?.level_up_mission?.estimated_time || "4–5 hours per week"}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-midnight-950/60 border border-white/5">
              <div className="text-[10px] uppercase font-semibold text-lavender-400">Immediate First Step</div>
              <div className="text-sm font-semibold text-violet-light mt-1">
                {aiProfile?.level_up_mission?.first_action || "Draft 1-page design spec and invite 1 peer collaborator."}
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Strengths & Growth Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hidden Strengths */}
          <div className="rounded-2xl p-6 bg-midnight-850/80 border border-violet/20 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-light" />
              Hidden Strengths
            </h3>
            <p className="text-xs text-lavender-400">
              Unapparent competitive advantages synthesized from your background and tone.
            </p>

            <div className="space-y-4 mt-2">
              {aiProfile?.hidden_strengths?.map((hs, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-midnight-900/70 border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-white">{hs.strength}</h4>
                  <p className="text-xs text-lavender-300 leading-relaxed">
                    <span className="text-lavender-400 font-semibold">Evidence: </span>
                    {hs.evidence}
                  </p>
                  <p className="text-xs text-violet-light leading-relaxed">
                    <span className="text-lavender-300 font-semibold">How to leverage: </span>
                    {hs.how_to_leverage}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Growth Opportunities */}
          <div className="rounded-2xl p-6 bg-midnight-850/80 border border-violet/20 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-light" />
              Growth Opportunities
            </h3>
            <p className="text-xs text-lavender-400">
              High-impact inflection points where slight focus shifts create outsized returns.
            </p>

            <div className="space-y-4 mt-2">
              {aiProfile?.growth_opportunities?.map((go, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-midnight-900/70 border border-white/5 space-y-2">
                  <h4 className="text-sm font-bold text-white">{go.area}</h4>
                  <p className="text-xs text-lavender-300 leading-relaxed">
                    <span className="text-lavender-400 font-semibold">Why it matters: </span>
                    {go.rationale}
                  </p>
                  <p className="text-xs text-emerald-400 leading-relaxed">
                    <span className="text-lavender-300 font-semibold">Action: </span>
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

