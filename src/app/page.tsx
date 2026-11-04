"use client";

import React, { useState, useEffect } from "react";
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
  Building,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EntryGatePage() {
  const router = useRouter();

  // Active Role for Auth Modal ("student" | "organizer" | null)
  const [authModalRole, setAuthModalRole] = useState<"student" | "organizer" | null>(null);

  // Form Inputs & Loading
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Check if redirected back with error from OAuth
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setLoginError(urlError);
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Open modal with pre-configured demo defaults for respective role
  const openAuthModal = (role: "student" | "organizer") => {
    setAuthModalRole(role);
    setLoginError(null);
    setShowPassword(false);
    setEmailInput("");
    setPasswordInput("");
  };

  // Method 1 & 2: Social OAuth Login (Google & GitHub)
  const handleSocialLogin = async (provider: "google" | "github") => {
    if (!authModalRole) return;
    setSocialLoading(provider);
    setLoginError(null);

    // Direct Google OAuth flow to server endpoint
    if (provider === "google") {
      window.location.href = `/api/auth/signin/google?role=${authModalRole}`;
      return;
    }

    try {
      const res = await fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: authModalRole,
          provider,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || `Failed to sign in with ${provider}.`);
        setSocialLoading(null);
        return;
      }

      router.push(data.redirectUrl || (authModalRole === "organizer" ? "/organizer/dashboard" : "/dashboard"));
    } catch {
      setLoginError(`Failed to connect to ${provider}. Please try again.`);
      setSocialLoading(null);
    }
  };

  // Method 3: Credentials Login (Username / Email & Password)
  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authModalRole) return;
    setAuthLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/auth/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: authModalRole,
          username: emailInput,
          password: passwordInput,
          provider: "credentials",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Invalid credentials.");
        setAuthLoading(false);
        return;
      }

      router.push(data.redirectUrl || (authModalRole === "organizer" ? "/organizer/dashboard" : "/dashboard"));
    } catch {
      setLoginError("Failed to authenticate. Please try again.");
      setAuthLoading(false);
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

              <p className="text-lavender-300/90 text-sm leading-relaxed mb-6 min-h-[44px] flex items-center">
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
                type="button"
                onClick={() => openAuthModal("student")}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#6c35de] hover:bg-[#7b41ee] active:bg-[#5f2ccd] text-white font-bold text-sm shadow-lg shadow-purple-900/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Student</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("student")}
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

              <p className="text-lavender-300/90 text-sm leading-relaxed mb-6 min-h-[44px] flex items-center">
                Plan campus events, organize resources, and build comprehensive event proposals using AI.
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

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => openAuthModal("organizer")}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#6c35de] hover:bg-[#7b41ee] active:bg-[#5f2ccd] text-white font-bold text-sm shadow-lg shadow-purple-900/50 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Continue as Organizer</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => openAuthModal("organizer")}
                className="w-full py-1.5 text-xs text-lavender-400 hover:text-white transition-colors text-center cursor-pointer"
              >
                Already have a profile? Enter Dashboard &rarr;
              </button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-lavender-400/70 border-t border-white/5">
        UniVibe &bull; JIS University (Kolkata, India) &bull; Student Intelligence Engine
      </footer>

      {/* Unified 3-Method Sign-In Dialogue Box for Student & Organizer */}
      <AnimatePresence>
        {authModalRole && (
          <motion.div
            key="auth-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={(e) => {
              if (e.target === e.currentTarget) setAuthModalRole(null);
            }}
          >
            <motion.div
              key={`auth-modal-${authModalRole}`}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-md rounded-3xl p-7 bg-[#211244] border border-white/15 shadow-2xl shadow-purple-950/90 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6c35de] flex items-center justify-center text-white shadow-md shadow-purple-700/30">
                    {authModalRole === "student" ? (
                      <GraduationCap className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      {authModalRole === "student" ? "Student Sign-In" : "Student Organizer Sign-In"}
                    </h4>
                    <p className="text-xs text-lavender-300">
                      {authModalRole === "student" ? "JIS University Student Portal" : "JIS Tech Club & Student Council"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAuthModalRole(null)}
                  className="text-lavender-400 hover:text-white text-lg p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Error Banner */}
              {loginError && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Methods 1 & 2: Google & GitHub OAuth Sign-In */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Google Sign-In */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={socialLoading !== null || authLoading}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  title="Sign in with your Google account"
                >
                  {socialLoading === "google" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"/>
                    </svg>
                  )}
                  <span>Google</span>
                </button>

                {/* GitHub Sign-In */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("github")}
                  disabled={socialLoading !== null || authLoading}
                  className="py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-400/30 text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                  title="Sign in with your GitHub account"
                >
                  {socialLoading === "github" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                  ) : (
                    <svg className="w-4 h-4 shrink-0 fill-white" viewBox="0 0 24 24">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                  )}
                  <span>GitHub</span>
                </button>
              </div>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#211244] px-3 text-[10px] font-semibold text-lavender-400/80 uppercase tracking-wider shrink-0">
                  or continue with credentials
                </span>
              </div>

              {/* Method 3: Credentials Form */}
              <form onSubmit={handleCredentialsLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-lavender-300 mb-1">
                    {authModalRole === "student" ? "Student Email / Username" : "Student Organizer Email / Username"}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-lavender-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder={
                        authModalRole === "student"
                          ? "Enter student email or ID (e.g. name@jisuniversity.ac.in)"
                          : "Enter organizer email or username (e.g. organizer@jisuniversity.ac.in)"
                      }
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#150a2b] border border-white/10 text-white text-xs placeholder:text-lavender-400/50 focus:outline-none focus:border-[#8a4bfa]"
                      required
                      autoComplete="username"
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
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      placeholder={
                        authModalRole === "student"
                          ? "Enter your student password"
                          : "Enter your organizer password"
                      }
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#150a2b] border border-white/10 text-white text-xs placeholder:text-lavender-400/50 focus:outline-none focus:border-[#8a4bfa]"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lavender-400 hover:text-white p-1"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAuthModalRole(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-lavender-300 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={authLoading}
                    className="px-5 py-2.5 rounded-xl bg-[#6c35de] hover:bg-[#7b41ee] text-white font-bold text-xs shadow-lg shadow-purple-900/50 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  >
                    {authLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>{authModalRole === "student" ? "Sign In & Enter Dashboard" : "Sign In & Open Suite"}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
