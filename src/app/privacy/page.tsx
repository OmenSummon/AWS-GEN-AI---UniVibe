"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, ShieldCheck, Lock, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#2C2B2B] text-[#FEFEFE] px-6 py-12 selection:bg-[#446B8D] selection:text-[#FEFEFE]">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-[#444343] pb-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#446B8D] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#E4B74A]" />
            </div>
            <span className="font-extrabold text-[#FEFEFE] text-lg">UniVibe</span>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" variant="outline" className="text-xs">
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Dashboard
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-3xl font-extrabold text-[#FEFEFE] tracking-tight">Student Data & Privacy Policy</h1>
          <p className="text-xs text-[#D4D4D4] mt-1">Effective Date: Academic Year 2026–2027</p>
        </div>

        <div className="space-y-6 text-sm text-[#D4D4D4] leading-relaxed">
          <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] space-y-2">
            <h2 className="text-base font-bold text-[#FEFEFE] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#E4B74A]" />
              1. Student-Only Isolation
            </h2>
            <p>
              UniVibe is strictly built for students. There are no organizer accounts, administrative surveillance backdoors, or third-party recruiters reading your private notes, draft outreach, or self-assessed blind spots.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] space-y-2">
            <h2 className="text-base font-bold text-[#FEFEFE] flex items-center gap-2">
              <Lock className="w-5 h-5 text-[#446B8D]" />
              2. Row Level Security & Database Architecture
            </h2>
            <p>
              When connected to Neon Serverless PostgreSQL, your profile, intelligence scores, generated roadmaps, and chat transcripts are protected via PostgreSQL Row Level Security (RLS) policies. Only the authenticated student owning the record can read or update it.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] space-y-2">
            <h2 className="text-base font-bold text-[#FEFEFE] flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#446B8D]" />
              3. AI Usage & Anti-Hallucination Disclosures
            </h2>
            <p>
              AI outputs (archetypes, intelligence scores, and recommendations) are generated server-side using Amazon Bedrock or calibrated simulated providers. The AI system is explicitly instructed never to invent fake student qualifications, fake professor contacts, or fabricate campus clubs.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#353434] border border-[#444343] space-y-2">
            <h2 className="text-base font-bold text-[#FEFEFE] flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-[#B71C1C]" />
              4. Complete Student Data Deletion
            </h2>
            <p>
              Students retain unconditional rights to delete their profile, generated roadmaps, event materials, and concierge message logs directly through the Settings panel at any time.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-[#444343] text-center text-xs text-[#D4D4D4]">
          UniVibe Student Intelligence Engine • Built for University Students
        </div>
      </div>
    </div>
  );
}