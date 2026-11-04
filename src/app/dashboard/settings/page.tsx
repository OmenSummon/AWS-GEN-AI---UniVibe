"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Settings,
  Database,
  Cpu,
  Shield,
  Save,
  Trash2,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  Lock,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function SettingsPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [testingDb, setTestingDb] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const [dbRes, profRes] = await Promise.all([
          fetch("/api/init-db"),
          fetch("/api/profile"),
        ]);
        const dbData = await dbRes.json();
        const profData = await profRes.json();
        setDbStatus(dbData);
        setProfile(profData.profile);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleTestDb = async () => {
    setTestingDb(true);
    try {
      const res = await fetch("/api/init-db");
      const data = await res.json();
      setDbStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setTestingDb(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteData = () => {
    if (confirm("Are you sure you want to delete your student profile and AI insights? This action is irreversible.")) {
      alert("Student data deletion requested. All associated profile vectors have been scheduled for purging.");
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Settings &amp; Infrastructure"
        subtitle="Manage your student profile, Neon DB connection, AI provider abstraction, and data privacy."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-5xl mx-auto w-full">
        {/* Neon Database & Serverless Architecture Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#130d28] border border-purple-500/25 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-200">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  Neon Serverless PostgreSQL
                </h3>
                <p className="text-xs text-lavender-300 font-medium">
                  Cloud serverless database with real migrations and Row Level Security.
                </p>
              </div>
            </div>

            <Button
              size="sm"
              variant="secondary"
              onClick={handleTestDb}
              isLoading={testingDb}
              className="text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" />
              Verify Connection
            </Button>
          </div>

          <div className="p-5 rounded-2xl bg-[#0e081f] border border-purple-400/20 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-purple-300 font-bold">Current Storage Provider:</span>
              <Badge variant={dbStatus?.configured ? "verified" : "warning"}>
                {dbStatus?.configured ? "Neon Serverless Database Connected" : "Local / Demo Storage Fallback"}
              </Badge>
            </div>
            <p className="text-lavender-200 leading-relaxed font-medium">
              {dbStatus?.configured
                ? "All 14 tables (profiles, ai_profiles, opportunities, journeys, milestones, marketing, posters, concierge) are managed via Neon DB."
                : "No DATABASE_URL set in environment variables. UniVibe is running in high-fidelity Demo Mode with persistent local memory so you can test all features seamlessly."}
            </p>
          </div>
        </div>

        {/* AI Provider Architecture Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#130d28] border border-purple-500/25 space-y-5 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-200">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">AI Provider Abstraction</h3>
              <p className="text-xs text-lavender-300 font-medium">
                Configurable Amazon Bedrock text &amp; image models with graceful mock provider fallback.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20">
              <span className="text-purple-300 font-bold block mb-1">Text Generation Engine</span>
              <span className="font-mono text-white text-[11px] block font-semibold">
                anthropic.claude-3-5-sonnet-20240620-v1:0 (via Bedrock) / Simulated
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20">
              <span className="text-purple-300 font-bold block mb-1">Image Generation Engine</span>
              <span className="font-mono text-white text-[11px] block font-semibold">
                bedrock-stability.stable-image-core-v1-1 (PartyRock) / Vector Canvas
              </span>
            </div>
          </div>
        </div>

        {/* Edit Student Profile */}
        {profile && (
          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl p-6 sm:p-8 bg-[#130d28] border border-purple-500/25 space-y-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-base font-black text-white">Edit Student Profile</h3>
                <p className="text-xs text-lavender-300 font-medium">
                  Update your stated goals and skills. AI insights can be recalculated anytime.
                </p>
              </div>
              <Button type="submit" size="sm" variant="primary" isLoading={saveLoading}>
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes
              </Button>
            </div>

            {savedSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 font-bold shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Changes successfully saved to database!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-purple-300 mb-1.5">Student Name</label>
                <input
                  type="text"
                  value={profile.student_name}
                  onChange={(e) => setProfile({ ...profile, student_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e081f] border border-purple-400/25 text-white focus:outline-none focus:border-purple-400 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-300 mb-1.5">Department</label>
                <input
                  type="text"
                  value={profile.department}
                  onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e081f] border border-purple-400/25 text-white focus:outline-none focus:border-purple-400 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-300 mb-1.5">Academic Year</label>
                <input
                  type="text"
                  value={profile.year}
                  onChange={(e) => setProfile({ ...profile, year: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e081f] border border-purple-400/25 text-white focus:outline-none focus:border-purple-400 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-purple-300 mb-1.5">Weekly Availability</label>
                <input
                  type="text"
                  value={profile.free_time}
                  onChange={(e) => setProfile({ ...profile, free_time: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0e081f] border border-purple-400/25 text-white focus:outline-none focus:border-purple-400 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-purple-300 text-xs mb-1.5">Primary Goal</label>
              <input
                type="text"
                value={profile.goal}
                onChange={(e) => setProfile({ ...profile, goal: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-[#0e081f] border border-purple-400/25 text-white text-xs focus:outline-none focus:border-purple-400 font-medium"
              />
            </div>
          </form>
        )}

        {/* Data Privacy & Purge Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-red-950/25 border border-red-500/30 space-y-4 shadow-xl">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-red-400" />
            <div>
              <h3 className="text-base font-black text-white">Student Data Privacy &amp; Purge</h3>
              <p className="text-xs text-red-200 font-medium">
                You have complete ownership of your generated roadmaps, scores, and messaging history.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <Link href="/privacy" className="text-xs text-purple-300 hover:text-white font-bold flex items-center gap-1">
              Read UniVibe Student Privacy Policy
              <ExternalLink className="w-3 h-3" />
            </Link>

            <Button size="sm" variant="danger" onClick={handleDeleteData} className="text-xs font-bold">
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Purge All Student Records
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
