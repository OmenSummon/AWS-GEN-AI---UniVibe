"use client";

import React, { useState, useEffect } from "react";
import {
  Zap,
  EyeOff,
  Flame,
  Lightbulb,
  Rocket,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { GapAnalysisResult } from "@/types";

export default function GapAnalyzerPage() {
  const [analysis, setAnalysis] = useState<GapAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const loadData = async () => {
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
    loadData();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    await loadData();
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Opportunity Gap Analyzer"
        subtitle="Uncover blind spots, missing career skills, cross-field synergies, and campus FOMO risks."
        actionButton={
          <Button
            size="sm"
            variant="outline"
            onClick={handleRegenerate}
            isLoading={regenerating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-[#E4B74A]" />
            Recalculate Gaps
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* FOMO Risk Alert Banner */}
        {analysis?.campus_fomo_risk && (
          <div className="rounded-3xl p-6 bg-[#353434] border border-[#E4B74A]/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
            <div className="flex items-start gap-3.5">
              <Flame className="w-6 h-6 text-[#E4B74A] shrink-0 mt-0.5" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-black text-[#E4B74A] tracking-wider">
                    Campus FOMO Risk Index:
                  </span>
                  <Badge variant="warning">{analysis.campus_fomo_risk.level} Risk</Badge>
                </div>
                <p className="text-xs text-[#D4D4D4] mt-1 leading-relaxed max-w-3xl font-medium">
                  {analysis.campus_fomo_risk.explanation}
                </p>
                <div className="text-xs text-emerald-300 font-semibold mt-2 flex items-center gap-1.5">
                  <span className="text-[#FEFEFE] font-bold">Strategic Antidote: </span>
                  {analysis.campus_fomo_risk.antidote}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blind Spots Section */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#353434] border border-[#444343] space-y-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242323] border border-[#444343] text-xs font-bold text-[#E4B74A] mb-2">
              <EyeOff className="w-3.5 h-3.5 text-[#E4B74A]" />
              <span>Unseen Friction Points</span>
            </div>
            <h3 className="text-xl font-black text-[#FEFEFE]">Student Blind Spots</h3>
            <p className="text-xs text-[#D4D4D4] mt-1 font-medium">
              Habits or positioning blind spots that silently cap your campus opportunity conversion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis?.blind_spots?.map((bs, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#242323] border border-[#444343] space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#FEFEFE] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B71C1C]" />
                    {bs.area}
                  </h4>
                </div>
                <p className="text-xs text-[#D4D4D4] leading-relaxed">
                  <span className="text-[#E4B74A] font-bold">What is missing: </span>
                  {bs.what_is_missing}
                </p>
                <p className="text-xs text-[#D4D4D4] leading-relaxed">
                  <span className="text-[#E4B74A] font-bold">Why it matters: </span>
                  {bs.why_it_matters}
                </p>
                <div className="pt-2 border-t border-[#444343] text-xs text-emerald-300 font-semibold">
                  <span className="text-[#FEFEFE] font-bold">Action to address: </span>
                  {bs.action_to_address}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* High-Leverage Missing Skills */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#353434] border border-[#444343] space-y-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242323] border border-[#444343] text-xs font-bold text-[#E4B74A] mb-2">
              <Zap className="w-3.5 h-3.5 text-[#E4B74A]" />
              <span>High-Value Skill Additions</span>
            </div>
            <h3 className="text-xl font-black text-[#FEFEFE]">Missing High-Impact Skills</h3>
            <p className="text-xs text-[#D4D4D4] mt-1 font-medium">
              Skills that immediately elevate your project outcomes and recruiter attractiveness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysis?.missing_skills?.map((sk, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#242323] border border-[#444343] flex flex-col justify-between shadow-xs">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="default" className="text-[10px]">
                      {sk.category}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-[#FEFEFE] mb-2">{sk.skill}</h4>
                  <p className="text-xs text-[#D4D4D4] leading-relaxed mb-4">
                    {sk.industry_context}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#444343] text-xs text-[#D4D4D4] font-medium">
                  <span className="text-[#E4B74A] font-bold block text-[10px] uppercase tracking-wider mb-0.5">Fastest Way to Acquire:</span>
                  {sk.fastest_way_to_acquire}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Unexpected Cross-Field Connections */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#353434] border border-[#444343] space-y-6 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242323] border border-[#444343] text-xs font-bold text-[#E4B74A] mb-2">
              <Lightbulb className="w-3.5 h-3.5 text-[#E4B74A]" />
              <span>Hybrid Synergies</span>
            </div>
            <h3 className="text-xl font-black text-[#FEFEFE]">Unexpected Cross-Field Connections</h3>
            <p className="text-xs text-[#D4D4D4] mt-1 font-medium">
              Where your unique mix of disciplines creates asymmetric advantage over single-major peers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis?.cross_field_connections?.map((conn, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-[#242323] border border-[#444343] space-y-3 shadow-xs">
                <h4 className="text-sm font-bold text-[#FEFEFE]">{conn.connection_title}</h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-[#446B8D]/25 text-[#FEFEFE] border border-[#446B8D]/40 font-bold">{conn.field_a}</span>
                  <span className="text-[#FEFEFE] font-bold">+</span>
                  <span className="px-2.5 py-1 rounded-lg bg-[#446B8D]/25 text-[#FEFEFE] border border-[#446B8D]/40 font-bold">{conn.field_b}</span>
                </div>
                <p className="text-xs text-[#D4D4D4] leading-relaxed">
                  <span className="text-[#FEFEFE] font-bold">Hybrid Advantage: </span>
                  {conn.hybrid_advantage}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* One Bold Ambitious Move */}
        {analysis?.bold_ambitious_move && (
          <div className="rounded-3xl p-6 sm:p-8 bg-[#353434] border border-[#446B8D]/40 shadow-2xl space-y-5 text-[#FEFEFE]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-[#E4B74A] uppercase tracking-wider flex items-center gap-1.5">
                <Rocket className="w-4 h-4 text-[#E4B74A]" /> One Bold Ambitious Move
              </span>
              <Badge variant="default">High Impact Inflection</Badge>
            </div>

            <h3 className="text-2xl font-black text-[#FEFEFE] tracking-tight">
              {analysis.bold_ambitious_move.title}
            </h3>
            <p className="text-sm text-[#D4D4D4] leading-relaxed max-w-3xl">
              {analysis.bold_ambitious_move.vision}
            </p>

            <div className="p-4 rounded-2xl bg-[#242323] border border-[#444343] text-xs text-[#D4D4D4] leading-relaxed">
              <span className="font-bold text-[#FEFEFE]">Potential Breakthrough: </span>
              {analysis.bold_ambitious_move.potential_breakthrough}
            </div>

            <div className="pt-2">
              <span className="text-xs font-bold text-[#E4B74A] block mb-2">Execution Protocol:</span>
              <ul className="space-y-2 text-xs text-[#D4D4D4] font-medium">
                {analysis.bold_ambitious_move.execution_steps?.map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-xs text-[#E4B74A] pt-3 border-t border-[#444343] font-medium">
              <span className="font-bold text-[#E4B74A]">Calculated Risk Factor: </span>
              {analysis.bold_ambitious_move.calculated_risk}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
