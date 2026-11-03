"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Download,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  User,
  Users,
  Code,
  Laptop,
  Trophy,
  Camera,
  Music,
  Briefcase,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CampusEvent, StudentProfile } from "@/types";

interface DynamicRegistrationModalProps {
  event: CampusEvent | null;
  profile: StudentProfile | null;
  onClose: () => void;
  onSuccess: (newRegistration: any) => void;
}

export function DynamicRegistrationModal({
  event,
  profile,
  onClose,
  onSuccess,
}: DynamicRegistrationModalProps) {
  if (!event) return null;

  // Step 1: Form Inputs, Step 2: Review Summary, Step 3: Success Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState<any>(null);

  // Common Form Fields
  const [commonData, setCommonData] = useState({
    full_name: profile?.student_name || "Alex Rivera",
    email: "alex.rivera@campus.edu",
    university: profile?.university_name || "State Innovation University",
    department: profile?.department || "Computer Science & Engineering",
    year: profile?.year || "3rd Year",
    phone: "+1 (555) 019-2834",
    student_id_num: "SIU-2024-8842",
  });

  // Dynamic Category Specific Fields
  const [categoryData, setCategoryData] = useState<Record<string, any>>({
    // Technical & Hackathon
    tech_skills: profile?.skills?.slice(0, 3).join(", ") || "Python, React, TypeScript",
    programming_language: "Python & TypeScript",
    skill_level: "Intermediate",
    participation_type: "Team",
    team_name: "NeuralVibe",
    team_size: "3",
    teammates: "Jordan Lee, Samira Patel",
    github_profile: "https://github.com/alexrivera-builds",
    problem_statement: "AI-powered campus intelligence and student engagement",
    hackathon_experience: "Competed in 2 campus hackathons",

    // Workshop
    current_knowledge: "Foundational concepts and scripting",
    learning_expectations: "Hands-on cloud deployment and production architectural patterns",
    laptop_available: "Yes (MacOS / Linux)",

    // Cultural
    performance_category: "Theatrical Drama & Fusion Showcase",
    group_name: "Campus Thespians & Guild",

    // Sports
    sport_category: "7-a-Side Football",
    sport_experience: "Played at varsity and inter-departmental division level",

    // Gaming
    game_title: "BGMI Mobile Battle Royale",
    gaming_id: "VIBE_Hunter#990",

    // Photography
    camera_type: "DSLR / Mirrorless",
    portfolio_link: "https://instagram.com/alex.snapshots",

    // Music
    instrument_or_vocal: "Synthesizer & Rhythm Guitar",

    // Entrepreneurship
    startup_name: "UniVibe Technologies",
    idea_description: "Autonomous AI campus intelligence platform for university student bodies.",
    pitch_category: "EdTech & Generative AI",

    // Literary
    competition_category: "Parliamentary Debate",
    language_preference: "English",
  });

  const [consentAccepted, setConsentAccepted] = useState(false);

  const handleCommonChange = (field: string, val: string) => {
    setCommonData((prev) => ({ ...prev, [field]: val }));
  };

  const handleCategoryChange = (field: string, val: any) => {
    setCategoryData((prev) => ({ ...prev, [field]: val }));
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!commonData.full_name.trim() || !commonData.email.trim() || !commonData.phone.trim()) {
      setErrorMessage("Please complete all required student information fields.");
      return;
    }

    setStep(2);
  };

  const handleFinalSubmit = async () => {
    if (!consentAccepted) {
      setErrorMessage("Please accept the event participation guidelines to proceed.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        eventId: event.id,
        consentAccepted: true,
        userId: profile?.id || "demo-student-001",
        registrationData: {
          ...commonData,
          ...categoryData,
          event_category: event.category,
        },
      };

      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to submit event registration.");
      }

      setConfirmedRegistration(data.registration);
      setStep(3);
      onSuccess(data.registration);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadConfirmation = () => {
    const content = `
=============================================================
UNIVIBE CAMPUS EVENT REGISTRATION CONFIRMATION PASS
=============================================================
Registration ID: ${confirmedRegistration?.registration_number || "UNV-2026-00001"}
Status: ${confirmedRegistration?.registration_status || "Confirmed"}
Timestamp: ${new Date().toLocaleString()}

EVENT DETAILS:
- Event: ${event.name}
- Category: ${event.category}
- Format: ${event.event_mode}
- Date & Time: ${new Date(event.start_datetime).toLocaleString()}
- Venue: ${event.venue}
- Entry Fee: ${event.participation_fee === 0 ? "FREE" : "₹" + event.participation_fee}

STUDENT PARTICIPANT:
- Name: ${commonData.full_name}
- Email: ${commonData.email}
- University: ${commonData.university}
- Department: ${commonData.department} (Year: ${commonData.year})
- Student ID: ${commonData.student_id_num}
- Phone: ${commonData.phone}

PARTICIPATION SPECIFICS:
${Object.entries(categoryData)
  .map(([k, v]) => `• ${k.replace(/_/g, " ").toUpperCase()}: ${v}`)
  .join("\n")}

=============================================================
Present this digital pass at the venue entrance.
Powered by UniVibe Student Intelligence Engine
=============================================================
    `;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.slug}-registration-${confirmedRegistration?.registration_number || "pass"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-midnight-900 border border-violet/30 shadow-2xl overflow-hidden text-lavender-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="p-6 border-b border-white/10 bg-midnight-950 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase font-bold text-violet-light bg-violet/15 px-2 py-0.5 rounded">
                Step 0{step} of 03
              </span>
              <span className="text-xs text-lavender-400">• {event.category} Event</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-1">
              {step === 1 && `Register for ${event.name}`}
              {step === 2 && "Review Registration Summary"}
              {step === 3 && "Registration Confirmed!"}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-midnight-900 border border-white/10 hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: DYNAMIC CATEGORY-SPECIFIC FORM */}
        {step === 1 && (
          <form onSubmit={handleProceedToReview} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            {/* Pre-filled Common Student Fields */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-violet-light uppercase tracking-wider block flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> 1. Student Academic Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-lavender-300 font-medium mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={commonData.full_name}
                    onChange={(e) => handleCommonChange("full_name", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none focus:border-violet"
                  />
                </div>

                <div>
                  <label className="block text-lavender-300 font-medium mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    value={commonData.email}
                    onChange={(e) => handleCommonChange("email", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none focus:border-violet"
                  />
                </div>

                <div>
                  <label className="block text-lavender-300 font-medium mb-1">University / College *</label>
                  <input
                    type="text"
                    required
                    value={commonData.university}
                    onChange={(e) => handleCommonChange("university", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none focus:border-violet"
                  />
                </div>

                <div>
                  <label className="block text-lavender-300 font-medium mb-1">Department *</label>
                  <input
                    type="text"
                    required
                    value={commonData.department}
                    onChange={(e) => handleCommonChange("department", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none focus:border-violet"
                  />
                </div>

                <div>
                  <label className="block text-lavender-300 font-medium mb-1">Academic Year *</label>
                  <input
                    type="text"
                    required
                    value={commonData.year}
                    onChange={(e) => handleCommonChange("year", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none focus:border-violet"
                  />
                </div>

                <div>
                  <label className="block text-lavender-300 font-medium mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={commonData.phone}
                    onChange={(e) => handleCommonChange("phone", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none focus:border-violet"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lavender-300 font-medium text-xs mb-1">Student Roll / ID Number</label>
                <input
                  type="text"
                  value={commonData.student_id_num}
                  onChange={(e) => handleCommonChange("student_id_num", e.target.value)}
                  placeholder="e.g. SIU-2024-8842"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white text-xs focus:outline-none focus:border-violet"
                />
              </div>
            </div>

            {/* DYNAMIC CATEGORY-SPECIFIC FIELDS */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-light uppercase tracking-wider block flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> 2. {event.category} Event Participation Details
                </span>
                <span className="text-[10px] text-lavender-400">Adaptive category fields</span>
              </div>

              {/* TECHNICAL & HACKATHONS */}
              {(event.category === "Technical" || event.category === "Hackathons") && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">
                        Programming Language Preference *
                      </label>
                      <input
                        type="text"
                        required
                        value={categoryData.programming_language}
                        onChange={(e) => handleCategoryChange("programming_language", e.target.value)}
                        placeholder="e.g. Python, TypeScript, C++, Rust"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Technical Skill Level *</label>
                      <select
                        value={categoryData.skill_level}
                        onChange={(e) => handleCategoryChange("skill_level", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      >
                        <option value="Beginner">Beginner (1st / 2nd year)</option>
                        <option value="Intermediate">Intermediate (Hands-on experience)</option>
                        <option value="Advanced">Advanced (Shipped projects &amp; APIs)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Participation Type</label>
                      <select
                        value={categoryData.participation_type}
                        onChange={(e) => handleCategoryChange("participation_type", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      >
                        <option value="Individual">Individual Participant</option>
                        <option value="Team">Team Entry</option>
                      </select>
                    </div>

                    {categoryData.participation_type === "Team" && (
                      <div>
                        <label className="block text-lavender-300 font-medium mb-1">Team Name *</label>
                        <input
                          type="text"
                          required
                          value={categoryData.team_name}
                          onChange={(e) => handleCategoryChange("team_name", e.target.value)}
                          placeholder="e.g. NeuralVibe"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {categoryData.participation_type === "Team" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-lavender-300 font-medium mb-1">Team Size</label>
                        <input
                          type="number"
                          min={2}
                          max={4}
                          value={categoryData.team_size}
                          onChange={(e) => handleCategoryChange("team_size", e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-lavender-300 font-medium mb-1">Teammates (Comma separated)</label>
                        <input
                          type="text"
                          value={categoryData.teammates}
                          onChange={(e) => handleCategoryChange("teammates", e.target.value)}
                          placeholder="e.g. Jordan Lee, Samira Patel"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">Problem Statement / Theme Preference</label>
                    <input
                      type="text"
                      value={categoryData.problem_statement}
                      onChange={(e) => handleCategoryChange("problem_statement", e.target.value)}
                      placeholder="e.g. Generative AI & Cloud Innovation"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">GitHub / Portfolio URL (Optional)</label>
                    <input
                      type="url"
                      value={categoryData.github_profile}
                      onChange={(e) => handleCategoryChange("github_profile", e.target.value)}
                      placeholder="https://github.com/your-username"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* WORKSHOPS */}
              {event.category === "Workshops" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">Current Skill Level *</label>
                    <select
                      value={categoryData.skill_level}
                      onChange={(e) => handleCategoryChange("skill_level", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                    >
                      <option value="Beginner">Beginner (Curious to learn)</option>
                      <option value="Intermediate">Intermediate (Have built basic apps)</option>
                      <option value="Advanced">Advanced (Looking for deep dive)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">What are your key learning expectations? *</label>
                    <textarea
                      rows={2}
                      required
                      value={categoryData.learning_expectations}
                      onChange={(e) => handleCategoryChange("learning_expectations", e.target.value)}
                      placeholder="e.g. Deploying LLMs on cloud and understanding RAG pipelines"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">Laptop Availability *</label>
                    <select
                      value={categoryData.laptop_available}
                      onChange={(e) => handleCategoryChange("laptop_available", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                    >
                      <option value="Yes (Personal Laptop)">Yes, bringing my personal laptop</option>
                      <option value="Need Campus Lab PC">Need to use campus laboratory workstation</option>
                    </select>
                  </div>
                </div>
              )}

              {/* CULTURAL & MUSIC */}
              {(event.category === "Cultural" || event.category === "Music") && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">Performance Category *</label>
                    <input
                      type="text"
                      required
                      value={categoryData.performance_category}
                      onChange={(e) => handleCategoryChange("performance_category", e.target.value)}
                      placeholder="e.g. Classical Dance, Indie Acoustic, Live Band, Skit"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Instrument or Vocal Preference</label>
                      <input
                        type="text"
                        value={categoryData.instrument_or_vocal}
                        onChange={(e) => handleCategoryChange("instrument_or_vocal", e.target.value)}
                        placeholder="e.g. Lead Vocals, Electric Guitar, Drums"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Individual or Group</label>
                      <select
                        value={categoryData.participation_type}
                        onChange={(e) => handleCategoryChange("participation_type", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      >
                        <option value="Individual">Solo Performance</option>
                        <option value="Team">Group / Band Performance</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SPORTS */}
              {event.category === "Sports" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">Sport Category / Playing Position *</label>
                    <input
                      type="text"
                      required
                      value={categoryData.sport_category}
                      onChange={(e) => handleCategoryChange("sport_category", e.target.value)}
                      placeholder="e.g. Center Forward / Midfielder"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">Relevant Sports Experience (Optional)</label>
                    <input
                      type="text"
                      value={categoryData.sport_experience}
                      onChange={(e) => handleCategoryChange("sport_experience", e.target.value)}
                      placeholder="e.g. Played inter-school or departmental tournaments"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* GAMING */}
              {event.category === "Gaming" && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Game Title / Platform *</label>
                      <input
                        type="text"
                        required
                        value={categoryData.game_title}
                        onChange={(e) => handleCategoryChange("game_title", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">In-Game Nickname / Gaming ID *</label>
                      <input
                        type="text"
                        required
                        value={categoryData.gaming_id}
                        onChange={(e) => handleCategoryChange("gaming_id", e.target.value)}
                        placeholder="e.g. VIBE_Player#123"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PHOTOGRAPHY */}
              {event.category === "Photography" && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Camera or Smartphone Preference *</label>
                      <select
                        value={categoryData.camera_type}
                        onChange={(e) => handleCategoryChange("camera_type", e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      >
                        <option value="DSLR / Mirrorless Camera">DSLR / Mirrorless Camera</option>
                        <option value="Smartphone (Mobile Photography)">Smartphone (Mobile Photography)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Portfolio Link (Optional)</label>
                      <input
                        type="url"
                        value={categoryData.portfolio_link}
                        onChange={(e) => handleCategoryChange("portfolio_link", e.target.value)}
                        placeholder="https://instagram.com/myphotos"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ENTREPRENEURSHIP */}
              {event.category === "Entrepreneurship" && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Startup or Project Name *</label>
                      <input
                        type="text"
                        required
                        value={categoryData.startup_name}
                        onChange={(e) => handleCategoryChange("startup_name", e.target.value)}
                        placeholder="e.g. UniVibe"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Pitch Sector / Track *</label>
                      <input
                        type="text"
                        required
                        value={categoryData.pitch_category}
                        onChange={(e) => handleCategoryChange("pitch_category", e.target.value)}
                        placeholder="e.g. EdTech, SaaS, FinTech"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-lavender-300 font-medium mb-1">Executive 2-Sentence Idea Description *</label>
                    <textarea
                      rows={2}
                      required
                      value={categoryData.idea_description}
                      onChange={(e) => handleCategoryChange("idea_description", e.target.value)}
                      placeholder="What problem are you solving and how does your prototype address it?"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>
              )}

              {/* LITERARY */}
              {event.category === "Literary" && (
                <div className="space-y-3 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Competition Category *</label>
                      <input
                        type="text"
                        required
                        value={categoryData.competition_category}
                        onChange={(e) => handleCategoryChange("competition_category", e.target.value)}
                        placeholder="e.g. Parliamentary Debate, Slam Poetry"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-lavender-300 font-medium mb-1">Language Preference</label>
                      <input
                        type="text"
                        value={categoryData.language_preference}
                        onChange={(e) => handleCategoryChange("language_preference", e.target.value)}
                        placeholder="e.g. English / Regional"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-midnight-950 border border-violet/20 text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Review Registration Summary
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: SUMMARY REVIEW & CONSENT */}
        {step === 2 && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
            <div className="p-4 rounded-2xl bg-midnight-950 border border-violet/20 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs text-lavender-400 font-semibold uppercase">Event</span>
                <span className="text-sm font-bold text-white">{event.name}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-lavender-400">Date:</span>
                  <div className="text-white font-medium">
                    {new Date(event.start_datetime).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-lavender-400">Venue:</span>
                  <div className="text-white font-medium truncate">{event.venue}</div>
                </div>
                <div>
                  <span className="text-lavender-400">Registration Fee:</span>
                  <div className="text-emerald-400 font-bold">
                    {event.participation_fee === 0 ? "FREE" : `₹${event.participation_fee}`}
                  </div>
                </div>
                <div>
                  <span className="text-lavender-400">Category:</span>
                  <div className="text-violet-light font-medium">{event.category}</div>
                </div>
              </div>
            </div>

            {/* Student Participant Details Summary */}
            <div className="p-4 rounded-2xl bg-midnight-950 border border-white/5 space-y-2 text-xs">
              <span className="text-xs font-bold text-lavender-300 block mb-1">
                Participant Information
              </span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-lavender-400">Student:</span>
                  <div className="text-white font-medium">{commonData.full_name}</div>
                </div>
                <div>
                  <span className="text-lavender-400">Email:</span>
                  <div className="text-white font-medium truncate">{commonData.email}</div>
                </div>
                <div>
                  <span className="text-lavender-400">Department:</span>
                  <div className="text-white font-medium">{commonData.department} ({commonData.year})</div>
                </div>
                <div>
                  <span className="text-lavender-400">Phone:</span>
                  <div className="text-white font-medium">{commonData.phone}</div>
                </div>
              </div>
            </div>

            {/* Required Consent Checkbox (Requirement 5) */}
            <div className="p-4 rounded-xl bg-violet/10 border border-violet/30 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentAccepted}
                  onChange={(e) => setConsentAccepted(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-violet/40 text-violet focus:ring-violet bg-midnight-950 cursor-pointer"
                />
                <span className="text-xs text-lavender-200 leading-relaxed">
                  I confirm that the information provided is accurate and agree to the event participation guidelines, attendance policy, and university conduct code.
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <Button type="button" variant="outline" size="sm" onClick={() => setStep(1)} className="text-xs">
                <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                Back to Edit
              </Button>
              <Button
                type="button"
                size="md"
                onClick={handleFinalSubmit}
                isLoading={loading}
                disabled={!consentAccepted}
                className="text-xs px-6"
              >
                Confirm &amp; Complete Registration
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: SUCCESS CONFIRMATION PASS */}
        {step === 3 && confirmedRegistration && (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-2xl font-extrabold text-white">You're Registered!</h3>
              <p className="text-xs text-lavender-300 mt-1 max-w-md mx-auto">
                Your registration for <strong className="text-white">{event.name}</strong> has been successfully submitted and confirmed.
              </p>
            </div>

            {/* Digital Pass Card */}
            <div className="p-5 rounded-2xl bg-midnight-950 border border-emerald-500/30 text-left space-y-3 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] text-lavender-400 font-semibold uppercase">Official Registration ID</span>
                  <div className="text-base font-mono font-extrabold text-emerald-400 mt-0.5">
                    {confirmedRegistration.registration_number}
                  </div>
                </div>
                <Badge variant="verified">
                  {confirmedRegistration.registration_status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-lavender-400">Participant:</span>
                  <div className="text-white font-medium">{commonData.full_name}</div>
                </div>
                <div>
                  <span className="text-lavender-400">Date:</span>
                  <div className="text-white font-medium">
                    {new Date(event.start_datetime).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span className="text-lavender-400">Venue:</span>
                  <div className="text-white font-medium truncate">{event.venue}</div>
                </div>
                <div>
                  <span className="text-lavender-400">Confirmed At:</span>
                  <div className="text-white font-medium">
                    {new Date(confirmedRegistration.submitted_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleDownloadConfirmation}
                className="w-full sm:w-auto text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download Registration Pass
              </Button>
              <Button
                size="sm"
                onClick={onClose}
                className="w-full sm:w-auto text-xs"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

