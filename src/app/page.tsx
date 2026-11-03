"use client";

import React from "react";
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
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LandingPage() {
  const aiCapabilities = [
    {
      title: "UniVibe Profile",
      desc: "Archetype discovery, 6 campus intelligence scores, hidden strengths, and personalized level-up mission.",
      icon: Cpu,
      tag: "Module A",
    },
    {
      title: "Match AI",
      desc: "5 ranked opportunity recommendations cross-referenced with verified university databases and high-signal criteria.",
      icon: Compass,
      tag: "Module B",
    },
    {
      title: "Gap Analyzer",
      desc: "Uncovers student blind spots, missing industry skills, cross-field synergies, and bold ambitious moves.",
      icon: Zap,
      tag: "Module C",
    },
    {
      title: "Journey AI",
      desc: "Actionable 4-phase roadmap (7 days, 30 days, 3 months, academic year) with persistent milestone checkboxes.",
      icon: Map,
      tag: "Module D",
    },
    {
      title: "Outreach Copilot",
      desc: "Context-aware emails, WhatsApp texts, and DMs grounded in your confirmed skills and selected tone.",
      icon: Send,
      tag: "Module E",
    },
    {
      title: "Event Hub",
      desc: "Discover exciting campus events, register with adaptive forms, generate digital passes, and manage your registrations.",
      icon: Calendar,
      tag: "Event Hub",
    },
  ];

  return (
    <div className="min-h-screen bg-midnight-950 text-lavender-100 selection:bg-violet selection:text-white relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-violet/20 via-violet-glow/10 to-transparent rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-96 -left-32 w-96 h-96 bg-purple-900/15 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-midnight-950/70">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet via-violet-light to-lavender-300 flex items-center justify-center shadow-lg shadow-violet/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-lavender-100 to-violet-light bg-clip-text text-transparent">
              UniVibe
            </span>
            <Badge variant="default" className="text-[10px] hidden sm:inline-flex">
              Student Intelligence
            </Badge>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-lavender-300/80">
            <a href="#features" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#workflow" className="hover:text-white transition-colors">AI Workflow</a>
            <a href="#intelligence" className="hover:text-white transition-colors">Campus Intelligence</a>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
                Student Login
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button size="sm" className="text-xs shadow-md shadow-violet/20">
                Get Started
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 max-w-5xl mx-auto text-center relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 border border-violet/25 text-xs text-lavender-300 mb-8 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-violet-light" />
          <span>Powered by AWS Bedrock &amp; Neon Serverless DB</span>
          <span className="w-1 h-1 rounded-full bg-violet-light" />
          <span className="text-emerald-400 font-medium">Student-Only Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1] mb-6">
          Your Campus Life,{" "}
          <span className="bg-gradient-to-r from-violet-light via-lavender-200 to-white bg-clip-text text-transparent">
            Powered by Intelligence.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-lavender-300/90 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
          UniVibe transforms your skills, interests, and ambitions into personalized opportunities, meaningful connections, and a roadmap for your future.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/onboarding" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base px-8 py-3.5 shadow-xl shadow-violet/25">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto text-base px-8 py-3.5">
              Explore UniVibe
            </Button>
          </Link>
        </div>

        {/* Hero Preview Card */}
        <div className="mt-16 p-2 rounded-2xl bg-gradient-to-b from-violet/30 via-violet/5 to-transparent border border-violet/25 shadow-2xl shadow-violet/10">
          <div className="rounded-xl bg-midnight-900/90 backdrop-blur-xl p-6 sm:p-8 text-left border border-white/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold uppercase text-lavender-400 tracking-wider">
                    Student Archetype Discovered
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mt-1">
                  The Full-Spectrum Creative Technologist
                </h3>
                <p className="text-sm text-lavender-300">
                  Bridging deep technical algorithms with user-centric interface aesthetics.
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant="verified">Verified Campus Data</Badge>
                <Badge variant="default">6 Intelligence Scores</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-6">
              {[
                { factor: "Technical", val: "94/100" },
                { factor: "Creativity", val: "89/100" },
                { factor: "Leadership", val: "82/100" },
                { factor: "Networking", val: "78/100" },
                { factor: "Innovation", val: "96/100" },
                { factor: "Engagement", val: "85/100" },
              ].map((s) => (
                <div key={s.factor} className="p-3 rounded-xl bg-midnight-800/80 border border-violet/15 text-center">
                  <div className="text-[11px] text-lavender-400 font-medium">{s.factor}</div>
                  <div className="text-lg font-bold text-white mt-0.5">{s.val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="default" className="mb-3">
            PartyRock AI Modules
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Campus Intelligence
          </h2>
          <p className="text-lavender-300 mt-3 text-base">
            Every module works together through shared student profile data so you never have to re-enter your information.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCapabilities.map((cap) => {
            const Icon = cap.icon;
            return (
              <div
                key={cap.title}
                className="p-6 rounded-2xl bg-midnight-850/60 border border-violet/15 hover:border-violet/40 transition-all duration-300 glass-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-violet/15 border border-violet/30 flex items-center justify-center text-violet-light">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold text-lavender-400 bg-white/5 px-2.5 py-1 rounded-md">
                      {cap.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{cap.title}</h3>
                  <p className="text-sm text-lavender-300/80 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How UniVibe Works (Dependency Graph) */}
      <section id="workflow" className="py-24 px-6 max-w-5xl mx-auto border-t border-white/5 text-center">
        <Badge variant="default" className="mb-3">Linear &amp; Transparent Pipeline</Badge>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
          How UniVibe Works
        </h2>
        <p className="text-lavender-300 max-w-2xl mx-auto text-sm sm:text-base mb-12">
          Your profile flows through an integrated AI dependency chain, grounding every recommendation in verified opportunities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 relative">
          {[
            { step: "01", name: "Student Inputs", desc: "Skills, interests, free time, goal, and tone recorded once." },
            { step: "02", name: "Profile & Matches", desc: "AI computes archetype, 6 scores, and 5 ranked opportunities." },
            { step: "03", name: "Gaps & Journey", desc: "Reveals blind spots and maps a 4-phase milestone roadmap." },
            { step: "04", name: "Concierge & Outreach", desc: "Contextual assistant and copy-ready outreach messages." },
          ].map((item, idx) => (
            <div key={item.step} className="p-5 rounded-2xl bg-midnight-850/80 border border-violet/20 text-left">
              <span className="text-xs font-mono font-bold text-violet-light">{item.step}</span>
              <h4 className="text-base font-bold text-white mt-1 mb-2">{item.name}</h4>
              <p className="text-xs text-lavender-300 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-b from-violet/25 via-midnight-850 to-midnight-900 border border-violet/30 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet/20 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Discover Your Potential. Build Your Future.
          </h2>
          <p className="text-lavender-300 max-w-xl mx-auto text-sm sm:text-base mb-8">
            Complete your onboarding once and unlock your personalized student intelligence engine today.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="px-8 py-3.5 shadow-xl shadow-violet/30">
              Complete Student Onboarding
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 text-center text-xs text-lavender-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-light" />
            <span className="font-bold text-white">UniVibe</span>
            <span>— Student Intelligence Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/dashboard/settings" className="hover:text-white transition-colors">Database Config</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Student Portal</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

