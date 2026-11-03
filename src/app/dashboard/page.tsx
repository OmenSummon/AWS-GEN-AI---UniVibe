"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Zap,
  Map,
  Send,
  Calendar,
  MessageSquare,
  Bookmark,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  ChevronRight,
  ExternalLink,
  RefreshCw
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ScoresChart } from "@/components/charts/ScoresChart";
import {
  StudentProfile,
  UniVibeProfileResult,
  MatchAIResult,
  StudentJourneyResult,
} from "@/types";

export default function DashboardPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [aiProfile, setAiProfile] = useState<UniVibeProfileResult | null>(null);
  const [matches, setMatches] = useState<MatchAIResult | null>(null);
  const [journey, setJourney] = useState<StudentJourneyResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Profile
      const pRes = await fetch("/api/profile");
      const pData = await pRes.json();
      const loadedProfile = pData.profile;
      setProfile(loadedProfile);

      if (loadedProfile) {
        // 2. Fetch AI Profile or trigger if needed
        const aiRes = await fetch("/api/ai/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loadedProfile.id }),
        });
        const aiData = await aiRes.json();
        setAiProfile(aiData.aiProfile);

        // 3. Fetch Matches
        const mRes = await fetch("/api/ai/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loadedProfile.id }),
        });
        const mData = await mRes.json();
        setMatches(mData.matches);

        // 4. Fetch Journey
        const jRes = await fetch("/api/ai/journey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: loadedProfile.id }),
        });
        const jData = await jRes.json();
        setJourney(jData.journey);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRegenerate = async () => {
    setRegenerating(true);
    await fetchDashboardData();
  };

  const bestMatch = matches?.recommendations?.find((m) => m.is_best_match) || matches?.recommendations?.[0];
  const savedOpportunities = matches?.recommendations?.filter((m) => m.is_saved) || [];

  // Find next incomplete milestone
  let nextMove = null;
  if (journey?.phases) {
    for (const phase of journey.phases) {
      const pending = phase.milestones.find((m) => !m.completed);
      if (pending) {
        nextMove = { ...pending, phaseName: phase.phase_name };
        break;
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Student Intelligence Hub"
        subtitle="Unified campus recommendations, skill trajectories, and growth roadmaps."
        actionButton={
          <Button
            size="sm"
            variant="outline"
            onClick={handleRegenerate}
            isLoading={regenerating}
            className="text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-violet-light" />
            Refresh Intelligence
          </Button>
        }
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Banner */}
        <div className="rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-violet/25 via-midnight-800 to-midnight-850 border border-violet/25 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 border border-violet/30 text-xs text-lavender-200 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-violet-light" />
                <span>{aiProfile?.archetype || "The Interdisciplinary Campus Innovator"}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome back, {profile?.student_name || "Alex Rivera"}!
              </h2>
              <p className="text-sm text-lavender-300 mt-1 max-w-2xl">
                {profile?.department || "Computer Science & Engineering"} • {profile?.year || "3rd Year"} •{" "}
                <span className="text-violet-light font-medium">{aiProfile?.archetype_tagline || "Discovering high-leverage campus opportunities."}</span>
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <div className="text-xs text-lavender-400 font-medium">Profile Sync</div>
                <div className="text-lg font-bold text-white">100% Complete</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-violet/20 border border-violet/40 flex items-center justify-center font-bold text-violet-light text-base">
                100%
              </div>
            </div>
          </div>
        </div>

        {/* 6 Key Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Intelligence Score */}
          <div className="p-5 rounded-2xl bg-midnight-850/70 border border-violet/20 hover:border-violet/40 transition-all glass-card-hover">
            <div className="flex items-center justify-between text-lavender-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Top Intelligence Score</span>
              <TrendingUp className="w-4 h-4 text-violet-light" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white">
                {aiProfile?.scores?.innovation || 96}
              </span>
              <span className="text-xs text-lavender-400">/ 100</span>
              <Badge variant="success" className="ml-auto text-[10px]">
                Innovation Potential
              </Badge>
            </div>
            <p className="text-xs text-lavender-300 mt-2 line-clamp-2">
              Exceptional ability to synthesize technical systems with creative campus solutions.
            </p>
          </div>

          {/* Card 2: Best Opportunity Match */}
          <div className="p-5 rounded-2xl bg-midnight-850/70 border border-violet/20 hover:border-violet/40 transition-all glass-card-hover">
            <div className="flex items-center justify-between text-lavender-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Best Opportunity Match</span>
              <Compass className="w-4 h-4 text-violet-light" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-white truncate max-w-[200px]">
                {bestMatch?.opportunity_name || "Apex 36-Hour Hackathon"}
              </span>
              <Badge variant="verified">
                {bestMatch?.match_score || 95}% Match
              </Badge>
            </div>
            <p className="text-xs text-lavender-300 mt-2 line-clamp-2">
              {bestMatch?.why_it_matches || "Directly tests your skills in a fast-paced environment tailored for your career goals."}
            </p>
          </div>

          {/* Card 3: Journey Progress */}
          <div className="p-5 rounded-2xl bg-midnight-850/70 border border-violet/20 hover:border-violet/40 transition-all glass-card-hover">
            <div className="flex items-center justify-between text-lavender-400 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider">Journey Roadmap</span>
              <Map className="w-4 h-4 text-violet-light" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-white">
                {journey?.progress_pct || 0}%
              </span>
              <span className="text-xs text-lavender-400">
                {journey?.completed_milestones || 0} of {journey?.total_milestones || 11} Completed
              </span>
            </div>
            <div className="w-full bg-midnight-950 h-2 rounded-full mt-3 overflow-hidden border border-white/5">
              <div
                className="bg-gradient-to-r from-violet to-violet-light h-full transition-all"
                style={{ width: `${journey?.progress_pct || 8}%` }}
              />
            </div>
          </div>
        </div>

        {/* Section: Your Campus Potential & Current Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Chart: Your Campus Potential (6 Intelligence Scores) */}
          <div className="lg:col-span-7 rounded-2xl p-6 bg-midnight-850/70 border border-violet/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-violet-light" />
                  Your Campus Potential
                </h3>
                <p className="text-xs text-lavender-400 mt-0.5">
                  AI-evaluated intelligence radar across six core university engagement dimensions.
                </p>
              </div>
              <Link href="/dashboard/profile">
                <Button size="sm" variant="ghost" className="text-xs text-violet-light">
                  View Breakdown
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>

            {aiProfile?.scores ? (
              <ScoresChart scores={aiProfile.scores} />
            ) : (
              <div className="h-64 flex items-center justify-center text-sm text-lavender-400">
                Loading intelligence scores...
              </div>
            )}

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 pt-4 border-t border-white/10 text-center">
              {[
                { name: "Technical", val: aiProfile?.scores?.technical_potential || 90 },
                { name: "Creativity", val: aiProfile?.scores?.creativity || 84 },
                { name: "Leadership", val: aiProfile?.scores?.leadership || 78 },
                { name: "Networking", val: aiProfile?.scores?.networking || 72 },
                { name: "Innovation", val: aiProfile?.scores?.innovation || 95 },
                { name: "Engagement", val: aiProfile?.scores?.campus_engagement || 80 },
              ].map((s) => (
                <div key={s.name} className="p-2 rounded-lg bg-midnight-900/60 border border-violet/10">
                  <div className="text-[10px] text-lavender-400 uppercase font-semibold">{s.name}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{s.val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Next Move & Level-Up Mission */}
          <div className="lg:col-span-5 space-y-6">
            {/* Your Next Move */}
            <div className="rounded-2xl p-6 bg-midnight-850/70 border border-violet/20 relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-violet-light uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Your Next Move
                </span>
                <span className="text-[10px] font-mono text-lavender-400 bg-white/5 px-2 py-0.5 rounded">
                  {nextMove?.phaseName || "PHASE 1 — START"}
                </span>
              </div>
              <h4 className="text-base font-bold text-white">
                {nextMove?.title || "Audit Profile & GitHub/Portfolio Showcase"}
              </h4>
              <p className="text-xs text-lavender-300 mt-2 leading-relaxed">
                {nextMove?.description || "Align your public student resume and GitHub pinned repos with your top skills and target goal."}
              </p>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-lavender-400">Target: Next 7 Days</span>
                <Link href="/dashboard/journey">
                  <Button size="sm" variant="secondary" className="text-xs">
                    Mark In Journey
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Current Level-Up Mission */}
            <div className="rounded-2xl p-6 bg-gradient-to-br from-violet/20 via-midnight-850 to-midnight-900 border border-violet/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-lavender-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-violet-light" /> Level-Up Mission
                </span>
                <Badge variant="default" className="text-[10px]">
                  {aiProfile?.level_up_mission?.difficulty || "Intermediate"}
                </Badge>
              </div>
              <h4 className="text-base font-bold text-white">
                {aiProfile?.level_up_mission?.title || "The Campus Signature Project Sprint"}
              </h4>
              <p className="text-xs text-lavender-300 mt-2 leading-relaxed">
                {aiProfile?.level_up_mission?.objective || "Deliver one publicly demonstrable artifact that combines your top skill with a campus need."}
              </p>
              <div className="mt-4 p-3 rounded-xl bg-midnight-950/60 border border-white/5 text-xs text-lavender-200">
                <span className="text-violet-light font-semibold">Immediate Step: </span>
                {aiProfile?.level_up_mission?.first_action || "Outline the 1-page spec and invite 1 peer collaborator using Outreach Copilot."}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Recommended For You (Top 3 Matches) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-violet-light" />
                Recommended For You
              </h3>
              <p className="text-xs text-lavender-400 mt-0.5">
                Top personalized campus opportunities matched against your verified skills.
              </p>
            </div>
            <Link href="/dashboard/matches">
              <Button size="sm" variant="outline" className="text-xs">
                Explore All 5 Recommendations
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {matches?.recommendations?.slice(0, 3).map((opp) => (
              <div
                key={opp.id}
                className="p-5 rounded-2xl bg-midnight-850/80 border border-violet/20 hover:border-violet/40 transition-all flex flex-col justify-between glass-card-hover"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-violet-light uppercase tracking-wider">
                      {opp.category}
                    </span>
                    <Badge variant={opp.verification_status === "VERIFIED" ? "verified" : "suggested"}>
                      {opp.verification_status === "VERIFIED" ? "Verified" : "Suggested"}
                    </Badge>
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5">{opp.opportunity_name}</h4>
                  <p className="text-xs text-lavender-300 leading-relaxed line-clamp-3 mb-4">
                    {opp.why_it_matches}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xs text-lavender-400">
                    <span className="font-bold text-white">{opp.match_score}%</span> match fit
                  </div>
                  <Link href={`/dashboard/outreach?opportunity=${encodeURIComponent(opp.opportunity_name)}`}>
                    <Button size="sm" variant="secondary" className="text-xs">
                      <Send className="w-3 h-3 text-violet-light mr-1" />
                      Outreach
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: Quick Actions Grid */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-light" />
            Quick Access Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/outreach" className="p-4 rounded-xl bg-midnight-850/60 border border-violet/15 hover:border-violet/40 transition-all glass-card-hover group">
              <Send className="w-5 h-5 text-violet-light mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Generate Outreach</h4>
              <p className="text-xs text-lavender-400 mt-1">Grounded emails, WhatsApp texts &amp; DMs.</p>
            </Link>

            <Link href="/dashboard/gap-analyzer" className="p-4 rounded-xl bg-midnight-850/60 border border-violet/15 hover:border-violet/40 transition-all glass-card-hover group">
              <Zap className="w-5 h-5 text-violet-light mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Analyze My Gaps</h4>
              <p className="text-xs text-lavender-400 mt-1">Uncover blind spots and cross-field moves.</p>
            </Link>

            <Link href="/dashboard/events" className="p-4 rounded-xl bg-midnight-850/60 border border-violet/15 hover:border-violet/40 transition-all glass-card-hover group">
              <Calendar className="w-5 h-5 text-violet-light mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Event Hub</h4>
              <p className="text-xs text-lavender-400 mt-1">Discover &amp; register for campus events.</p>
            </Link>

            <Link href="/dashboard/concierge" className="p-4 rounded-xl bg-midnight-850/60 border border-violet/15 hover:border-violet/40 transition-all glass-card-hover group">
              <MessageSquare className="w-5 h-5 text-violet-light mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold text-white">Ask Campus Concierge</h4>
              <p className="text-xs text-lavender-400 mt-1">Contextual student advice and guidance.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

