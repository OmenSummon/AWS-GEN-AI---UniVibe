"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, User, BookOpen, Clock, Target, Volume2, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ToneType } from "@/types";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State - Clean initial state, loads authenticated student name
  const [formData, setFormData] = useState({
    student_name: "",
    department: "",
    year: "",
    interests: "",
    skills: "",
    free_time: "",
    goal: "",
    tone: "Friendly" as ToneType,
  });

  React.useEffect(() => {
    async function loadInitialProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFormData({
              student_name: data.profile.student_name || "",
              department: data.profile.department || "",
              year: data.profile.year || "",
              interests: Array.isArray(data.profile.interests) ? data.profile.interests.join(", ") : "",
              skills: Array.isArray(data.profile.skills) ? data.profile.skills.join(", ") : "",
              free_time: data.profile.free_time || "",
              goal: data.profile.goal || "",
              tone: (data.profile.tone as ToneType) || "Friendly",
            });
          }
        }
      } catch (e) {
        console.error("Failed to load initial student profile:", e);
      }
    }
    loadInitialProfile();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Convert comma-separated strings to clean arrays
      const interestsArray = formData.interests
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const skillsArray = formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const profilePayload = {
        ...formData,
        interests: interestsArray,
        skills: skillsArray,
        onboarding_completed: true,
      };

      // 2. Save profile to backend (Neon DB / Memory)
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profilePayload),
      });

      if (!res.ok) {
        throw new Error("Failed to save profile");
      }

      // 3. Initiate AI Profile and Match AI pipeline
      await fetch("/api/ai/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileUpdates: profilePayload }),
      });

      await fetch("/api/ai/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      // 4. Redirect to Dashboard
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Onboarding error:", err);
      setError(err?.message || "An error occurred while saving your profile.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2C2B2B] text-[#FEFEFE] flex flex-col justify-between selection:bg-[#446B8D] selection:text-[#FEFEFE] relative px-4 py-8 sm:p-12 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#446B8D]/20 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Header */}
      <div className="max-w-2xl mx-auto w-full flex items-center justify-between mb-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#446B8D] border border-[#E4B74A]/40 flex items-center justify-center shadow-lg shadow-[#2C2B2B]/60">
            <Sparkles className="w-4 h-4 text-[#E4B74A]" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-[#FEFEFE]">UniVibe</span>
        </Link>
        <Badge variant="outline" className="text-xs">
          Step {step} of 3
        </Badge>
      </div>

      {/* Main Form Container */}
      <div className="max-w-2xl mx-auto w-full bg-[#353434] rounded-2xl p-6 sm:p-10 border border-[#444343] shadow-2xl relative">
        {/* Progress Bar */}
        <div className="w-full bg-[#242323] h-1.5 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-[#446B8D] h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-[#B71C1C]/20 border border-[#B71C1C]/40 text-[#FF8E8E] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* STEP 1: Academic & Personal Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#FEFEFE] flex items-center gap-2">
                  <User className="w-6 h-6 text-[#E4B74A]" />
                  Academic Profile
                </h2>
                <p className="text-sm text-[#D4D4D4] mt-1">
                  Tell us who you are and where you are in your university journey.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                    1. Student Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.student_name}
                    onChange={(e) => handleChange("student_name", e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                      2. Department / Major
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.department}
                      onChange={(e) => handleChange("department", e.target.value)}
                      placeholder="e.g. Computer Science & Engineering"
                      className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                      3. Academic Year
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.year}
                      onChange={(e) => handleChange("year", e.target.value)}
                      placeholder="e.g. 2nd Year / Junior"
                      className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button type="button" onClick={() => setStep(2)}>
                  Next: Skills &amp; Interests
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Skills & Interests */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#FEFEFE] flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-[#E4B74A]" />
                  Skills &amp; Interests
                </h2>
                <p className="text-sm text-[#D4D4D4] mt-1">
                  Separate multiple entries with commas. UniVibe connects these to campus opportunities.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                    4. Personal Interests
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.interests}
                    onChange={(e) => handleChange("interests", e.target.value)}
                    placeholder="e.g. coding, design, public speaking, gaming, music"
                    className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#A8A8A8] mt-1 block">
                    What excites you outside of mandatory classes?
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                    5. Documented Skills
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.skills}
                    onChange={(e) => handleChange("skills", e.target.value)}
                    placeholder="e.g. Python, Photoshop, public speaking, leadership"
                    className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors"
                  />
                  <span className="text-[11px] text-[#A8A8A8] mt-1 block">
                    Tools, languages, frameworks, or soft skills you currently possess.
                  </span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button type="button" onClick={() => setStep(3)}>
                  Next: Goals &amp; Tone
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Availability, Goals & Tone */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#FEFEFE] flex items-center gap-2">
                  <Target className="w-6 h-6 text-[#E4B74A]" />
                  Availability &amp; Aspirations
                </h2>
                <p className="text-sm text-[#D4D4D4] mt-1">
                  We use your time allocation and goals to construct your realistic 4-phase roadmap.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                    6. Available Free Time
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.free_time}
                    onChange={(e) => handleChange("free_time", e.target.value)}
                    placeholder="e.g. 5–6 hours per week, mostly evenings"
                    className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                    7. Primary Campus / Career Goal
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.goal}
                    onChange={(e) => handleChange("goal", e.target.value)}
                    placeholder="e.g. get a tech internship, build a startup, improve networking"
                    className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#D4D4D4] uppercase tracking-wider mb-2">
                    8. Preferred Communication Tone
                  </label>
                  <select
                    value={formData.tone}
                    onChange={(e) => handleChange("tone", e.target.value as ToneType)}
                    className="w-full px-4 py-3 rounded-xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none transition-colors cursor-pointer"
                  >
                    <option value="Confident" className="bg-[#2C2B2B] text-[#FEFEFE]">Confident — Bold, forward-looking, high energy</option>
                    <option value="Friendly" className="bg-[#2C2B2B] text-[#FEFEFE]">Friendly — Warm, accessible, collaborative</option>
                    <option value="Professional" className="bg-[#2C2B2B] text-[#FEFEFE]">Professional — Direct, formal, polished</option>
                    <option value="Enthusiastic" className="bg-[#2C2B2B] text-[#FEFEFE]">Enthusiastic — Highly engaged, eager to learn</option>
                    <option value="Curious" className="bg-[#2C2B2B] text-[#FEFEFE]">Curious — Inquisitive, open-minded, analytical</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#242323] border border-[#446B8D]/30 flex items-start gap-3">
                <Shield className="w-5 h-5 text-[#E4B74A] shrink-0 mt-0.5" />
                <div className="text-xs text-[#D4D4D4]">
                  <span className="font-semibold text-[#FEFEFE]">Student Data Privacy:</span> Your information is private, isolated to your account, and never fabricated or shared with external third parties.
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="w-4 h-4 mr-1.5" />
                  Back
                </Button>
                <Button type="submit" isLoading={loading} size="lg">
                  Launch My UniVibe Engine
                  <Sparkles className="w-4 h-4 ml-2 text-[#E4B74A]" />
                </Button>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Footer Info */}
      <div className="max-w-2xl mx-auto w-full text-center mt-8 text-xs text-[#A8A8A8]">
        UniVibe Student Intelligence Engine • Neon DB &amp; AWS Bedrock Integrated
      </div>
    </div>
  );
}
