"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck, Lock, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-midnight-950 text-lavender-100 px-6 py-12 selection:bg-violet selection:text-white">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet to-violet-light flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white text-lg">UniVibe</span>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" variant="outline" className="text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Student Data &amp; Privacy Policy</h1>
          <p className="text-xs text-lavender-400 mt-1">Effective Date: Academic Year 2026–2027</p>
        </div>

        <div className="space-y-6 text-sm text-lavender-300 leading-relaxed">
          <div className="p-5 rounded-2xl bg-midnight-850 border border-violet/20 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              1. Student-Only Isolation
            </h2>
            <p>
              UniVibe is strictly built for students. There are no organizer accounts, administrative surveillance backdoors, or third-party recruiters reading your private notes, draft outreach, or self-assessed blind spots.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-midnight-850 border border-violet/20 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-violet-light" />
              2. Row Level Security &amp; Database Architecture
            </h2>
            <p>
              When connected to Neon Serverless PostgreSQL, your profile, intelligence scores, generated roadmaps, and chat transcripts are protected via PostgreSQL Row Level Security (RLS) policies. Only the authenticated student owning the record can read or update it.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-midnight-850 border border-violet/20 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-violet-light" />
              3. AI Usage &amp; Anti-Hallucination Disclosures
            </h2>
            <p>
              AI outputs (archetypes, intelligence scores, and recommendations) are generated server-side using Amazon Bedrock or calibrated simulated providers. The AI system is explicitly instructed never to invent fake student qualifications, fake professor contacts, or fabricate campus clubs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-midnight-850 border border-violet/20 space-y-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-400" />
              4. Complete Student Data Deletion
            </h2>
            <p>
              Students retain unconditional rights to delete their profile, generated roadmaps, event materials, and concierge message logs directly through the Settings panel at any time.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 text-center text-xs text-lavender-400">
          UniVibe Student Intelligence Engine • Built for University Students
        </div>
      </div>
    </div>
  );
}

