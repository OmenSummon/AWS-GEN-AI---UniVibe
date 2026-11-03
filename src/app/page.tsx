"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  GraduationCap,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Lock,
  User,
  KeyRound,
  ShieldAlert,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  Building
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EntryGatePage() {
  const router = useRouter();

  // State
  const [showOrganizerModal, setShowOrganizerModal] = useState(false);
  const [studentLoading, setStudentLoading] = useState(false);
  const [organizerLoading, setOrganizerLoading] = useState(false);

  // Organizer Credentials (JIS University Student Organizer)
  const [orgUsername, setOrgUsername] = useState("student.organizer@jisuniversity.ac.in");
  const [orgPassword, setOrgPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Handle Student Selection -> Register & Open Student Relative Page
  const handleStudentContinue = async () => {
    setStudentLoading(true);
    try {
      await fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "student" }),
      });
      router.push("/onboarding");
    } catch {
      router.push("/onboarding");
    }
  };

  // Direct Student Dashboard shortcut
  const handleStudentDirectDashboard = async () => {
    setStudentLoading(true);
    try {
      await fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "student" }),
      });
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  // Handle Organizer Login -> Verify Credentials & Open Organizer Suite
  const handleOrganizerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrganizerLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "organizer",
          username: orgUsername,
          password: orgPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Invalid organizer credentials.");
        setOrganizerLoading(false);
        return;
      }

      router.push(data.redirectUrl || "/organizer/dashboard");
    } catch (err: any) {
      setLoginError("Failed to authenticate student organizer. Please try again.");
      setOrganizerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#110726] text-white flex flex-col justify-between relative overflow-hidden selection:bg-[#6c35de] selection:text-white">
      {/* Background Graphic Illustration - Campus Sunset & Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 bg-cover bg-center"
        style={{
          backgroundImage: "radial-gradient(circle at 50% 20%, rgba(138, 75, 255, 0.35) 0%, rgba(55, 18, 110, 0.4) 40%, rgba(17, 7, 38, 0.95) 85%)",
        }}
      />
      <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-gradient-to-bl from-fuchsia-600/20 via-purple-700/15 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-indigo-600/15 blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6c35de] via-[#8a4bfa] to-[#b182ff] flex items-center justify-center shadow-lg shadow-purple-900/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">
            UniVibe
          </span>
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-lavender-200">
          <Building className="w-3.5 h-3.5 text-purple-300" />
          <span>JIS University &bull; Kolkata</span>
        </div>
      </header>

      {/* Main Hero & Dual Role Selection */}
      <main className="relative z-20 max-w-6xl mx-auto w-full px-6 py-6 flex-1 flex flex-col justify-center">
        {/* Center Pill & Headlines */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3d1d73]/70 backdrop-blur-md border border-[#8a4bfa]/40 text-[#c8a6ff] text-xs font-semibold mb-4 shadow-sm"
          >
            <span>AI-Powered Campus Engagement</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-3"
          >
            Welcome to UniVibe
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg sm:text-xl font-bold text-white/90 mb-2"
          >
            One Campus. Endless Possibilities.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lavender-300/80 text-sm md:text-base max-w-xl mx-auto"
          >
            Choose your experience and unlock your campus potential.
          </motion.p>
        </div>

        {/* Dual Cards Matching Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          {/* CARD 1: STUDENT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="relative rounded-3xl p-7 bg-[#211244]/80 border border-white/10 hover:border-purple-400/40 backdrop-blur-xl transition-all duration-300 shadow-2xl shadow-purple-950/60 flex flex-col justify-between overflow-hidden group"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/15 to-transparent rounded-tr-3xl pointer-events-none" />

            <div>
              {/* Icon badge */}
              <div className="w-12 h-12 rounded-2xl bg-[#6c35de] flex items-center justify-center mb-5 shadow-lg shadow-purple-700/30">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2.5">
                Student
              </h3>

              <p className="text-lavender-300/90 text-sm leading-relaxed mb-6">
                Discover opportunities, explore campus events, build your skills, and create your personalized growth journey.
              </p>

              {/* Character Illustration Banner */}
              <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-[#2e185c]/60 to-[#1b0d38]/80 border border-white/5 flex items-center justify-center overflow-hidden mb-6 group-hover:border-purple-400/20 transition-colors">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
                  alt="Student with laptop"
                  className="w-28 h-28 object-cover rounded-full border-4 border-[#6c35de]/50 shadow-xl shadow-purple-950/80"
                />
                <div className="absolute bottom-2.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-white font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#b182ff]" />
                  <span>JIS University Student Portal</span>
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={handleStudentContinue}
                disabled={studentLoading}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#6c35de] hover:bg-[#7b41ee] active:bg-[#5f2ccd] text-white font-bold text-sm shadow-lg shadow-purple-900/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {studentLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Continue as Student</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={handleStudentDirectDashboard}
                disabled={studentLoading}
                className="w-full py-1.5 text-xs text-lavender-400 hover:text-white transition-colors text-center cursor-pointer"
              >
                Already have a profile? Enter Dashboard &rarr;
              </button>
            </div>
          </motion.div>

          {/* CARD 2: EVENT ORGANIZER */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-3xl p-7 bg-[#211244]/80 border border-white/10 hover:border-purple-400/40 backdrop-blur-xl transition-all duration-300 shadow-2xl shadow-purple-950/60 flex flex-col justify-between overflow-hidden group"
          >
            {/* Top decorative gradient glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-purple-500/15 to-transparent rounded-tr-3xl pointer-events-none" />

            <div>
              {/* Icon badge */}
              <div className="w-12 h-12 rounded-2xl bg-[#6c35de] flex items-center justify-center mb-5 shadow-lg shadow-purple-700/30">
                <Calendar className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-2xl font-bold text-white mb-2.5">
                Event Organizer
              </h3>

              <p className="text-lavender-300/90 text-sm leading-relaxed mb-6">
                Plan campus events, analyze event objectives, organize resources, and build comprehensive event proposals using AI.
              </p>

              {/* Character Illustration Banner */}
              <div className="relative w-full h-44 rounded-2xl bg-gradient-to-b from-[#2e185c]/60 to-[#1b0d38]/80 border border-white/5 flex items-center justify-center overflow-hidden mb-6 group-hover:border-purple-400/20 transition-colors">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80"
                  alt="Student Organizer Lead"
                  className="w-28 h-28 object-cover rounded-full border-4 border-[#6c35de]/50 shadow-xl shadow-purple-950/80"
                />
                <div className="absolute bottom-2.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-white font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#b182ff]" />
                  <span>Student Council &bull; JIS Tech Club</span>
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={() => setShowOrganizerModal(true)}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#6c35de] hover:bg-[#7b41ee] active:bg-[#5f2ccd] text-white font-bold text-sm shadow-lg shadow-purple-900/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Organizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-lavender-400/70 border-t border-white/5">
        UniVibe &bull; JIS University (Kolkata, India) &bull; Student Intelligence Engine
      </footer>

      {/* Organizer Login Modal */}
      <AnimatePresence>
        {showOrganizerModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl p-7 bg-[#211244] border border-white/15 shadow-2xl shadow-purple-950/90 text-white"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6c35de] flex items-center justify-center text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">Student Organizer Sign-In</h4>
                    <p className="text-xs text-lavender-300">JIS Tech Club &amp; Student Council</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrganizerModal(false)}
                  className="text-lavender-400 hover:text-white text-lg p-1"
                >
                  &times;
                </button>
              </div>

              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleOrganizerLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-lavender-300 mb-1">
                    Student Organizer Email / Username
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-lavender-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={orgUsername}
                      onChange={(e) => setOrgUsername(e.target.value)}
                      placeholder="student.organizer@jisuniversity.ac.in"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#150a2b] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8a4bfa]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-lavender-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-lavender-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={orgPassword}
                      onChange={(e) => setOrgPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#150a2b] border border-white/10 text-white text-xs focus:outline-none focus:border-[#8a4bfa]"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lavender-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="text-[11px] text-lavender-400 mt-1">
                    Demo password: <span className="text-purple-300 font-mono">admin123</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowOrganizerModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-lavender-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={organizerLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#6c35de] hover:bg-[#7b41ee] text-white font-bold text-xs shadow-lg shadow-purple-900/50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {organizerLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Sign In &amp; Open Suite</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
