"use client";

import React, { useEffect, useState } from "react";
import {
  Zap,
  EyeOff,
  AlertTriangle,
  Lightbulb,
  Rocket,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  TrendingUp,
  Flame,
  Shield
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GapAnalysisResult } from "@/types";

export default function GapAnalyzerPage() {
  const [analysis, setAnalysis] = useState<GapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const loadGapAnalysis = async () => {
    try {
      const res = await fetch("/api/ai/gap-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setAnalysis(data.gapAnalysis);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    loadGapAnalysis();
  }, []);

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Opportunity Gap Analyzer"
        subtitle="Identifies competitive blind spots, high-leverage missing skills, and cross-disciplinary moves."
        actionButton={
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setRegenerating(true);
              loadGapAnalysis();
            }}
            isLoading={regenerating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-violet-light" />
            Recalculate Gaps
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* FOMO Risk Alert Banner */}
        {analysis?.campus_fomo_risk && (
          <div className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/15 via-midnight-850 to-midnight-900 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <Flame className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                    Campus FOMO Risk Index:
                  </span>
                  <Badge variant="warning">{analysis.campus_fomo_risk.level} Risk</Badge>
                </div>
                <p className="text-xs text-lavender-200 mt-1 leading-relaxed max-w-3xl">
                  {analysis.campus_fomo_risk.explanation}
                </p>
                <div className="text-xs text-emerald-400 font-medium mt-2 flex items-center gap-1.5">
                  <span className="text-white font-semibold">Strategic Antidote: </span>
                  {analysis.campus_fomo_risk.antidote}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blind Spots Section */}
        <div className="rounded-2xl p-6 sm:p-8 bg-midnight-850/80 border border-violet/20 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/15 text-xs text-lavender-200 mb-2">
              <EyeOff className="w-3.5 h-3.5 text-violet-light" />
              <span>Unseen Friction Points</span>
            </div>
            <h3 className="text-xl font-bold text-white">Student Blind Spots</h3>
            <p className="text-xs text-lavender-400 mt-1">
              Habits or positioning blind spots that silently cap your campus opportunity conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis?.blind_spots?.map((bs, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-midnight-900/80 border border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    {bs.area}
                  </h4>
                </div>
                <p className="text-xs text-lavender-300 leading-relaxed">
                  <span className="text-lavender-400 font-semibold">What is missing: </span>
                  {bs.what_is_missing}
                </p>
                <p className="text-xs text-lavender-300 leading-relaxed">
                  <span className="text-lavender-400 font-semibold">Why it matters: </span>
                  {bs.why_it_matters}
                </p>
                <div className="pt-2 border-t border-white/5 text-xs text-emerald-400">
                  <span className="text-white font-semibold">Action to address: </span>
                  {bs.action_to_address}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Leverage Missing Skills */}
        <div className="rounded-2xl p-6 sm:p-8 bg-midnight-850/80 border border-violet/20 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/15 text-xs text-lavender-200 mb-2">
              <Zap className="w-3.5 h-3.5 text-violet-light" />
              <span>High-Value Skill Additions</span>
            </div>
            <h3 className="text-xl font-bold text-white">Missing High-Impact Skills</h3>
            <p className="text-xs text-lavender-400 mt-1">
              Skills that immediately elevate your project outcomes and recruiter attractiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {analysis?.missing_skills?.map((sk, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-midnight-900/80 border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default" className="text-[10px]">
                      {sk.category}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">{sk.skill}</h4>
                  <p className="text-xs text-lavender-400 leading-relaxed mb-4">
                    {sk.industry_context}
                  </p>
                </div>
                <div className="pt-3 border-t border-white/5 text-xs text-violet-light">
                  <span className="text-lavender-400 font-semibold block text-[10px] uppercase">Fastest Way to Acquire:</span>
                  {sk.fastest_way_to_acquire}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unexpected Cross-Field Connections */}
        <div className="rounded-2xl p-6 sm:p-8 bg-midnight-850/80 border border-violet/20 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/15 text-xs text-lavender-200 mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-violet-light" />
              <span>Hybrid Synergies</span>
            </div>
            <h3 className="text-xl font-bold text-white">Unexpected Cross-Field Connections</h3>
            <p className="text-xs text-lavender-400 mt-1">
              Where your unique mix of disciplines creates asymmetric advantage over single-major peers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis?.cross_field_connections?.map((conn, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-midnight-900/80 border border-white/5 space-y-3">
                <h4 className="text-sm font-bold text-white">{conn.connection_title}</h4>
                <div className="flex items-center gap-2 text-xs text-lavender-300">
                  <span className="px-2 py-0.5 rounded bg-violet/20 text-violet-light font-medium">{conn.field_a}</span>
                  <span>+</span>
                  <span className="px-2 py-0.5 rounded bg-violet/20 text-lavender-200 font-medium">{conn.field_b}</span>
                </div>
                <p className="text-xs text-lavender-300 leading-relaxed">
                  <span className="text-white font-semibold">Hybrid Advantage: </span>
                  {conn.hybrid_advantage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* One Bold Ambitious Move */}
        {analysis?.bold_ambitious_move && (
          <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet/30 via-midnight-800 to-midnight-900 border border-violet/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-violet-light uppercase tracking-wider flex items-center gap-1.5">
                <Rocket className="w-4 h-4" /> One Bold Ambitious Move
              </span>
              <Badge variant="default">High Impact Inflection</Badge>
            </div>

            <h3 className="text-2xl font-extrabold text-white">
              {analysis.bold_ambitious_move.title}
            </h3>
            <p className="text-sm text-lavender-200 leading-relaxed max-w-3xl">
              {analysis.bold_ambitious_move.vision}
            </p>

            <div className="p-4 rounded-xl bg-midnight-950/70 border border-white/5 text-xs text-lavender-300">
              <span className="font-semibold text-white">Potential Breakthrough: </span>
              {analysis.bold_ambitious_move.potential_breakthrough}
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-lavender-300 block mb-2">Execution Protocol:</span>
              <ul className="space-y-1.5 text-xs text-lavender-300">
                {analysis.bold_ambitious_move.execution_steps?.map((step, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-[11px] text-amber-300/90 pt-3 border-t border-white/10">
              <span className="font-bold">Calculated Risk Factor: </span>
              {analysis.bold_ambitious_move.calculated_risk}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

