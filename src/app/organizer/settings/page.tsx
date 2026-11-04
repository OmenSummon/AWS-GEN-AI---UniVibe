"use client";

import React, { useState, useEffect } from "react";
import {
  Save,
  CheckCircle2,
  Loader2,
  GraduationCap,
  Building
} from "lucide-react";
import { OrganizerProfile } from "@/types";

export default function OrganizerSettingsPage() {
  const [profile, setProfile] = useState<OrganizerProfile>({
    id: "demo-organizer-001",
    name: "Aarav Roy",
    email: "student.organizer@jisuniversity.ac.in",
    department: "Department of Computer Science & Engineering, JIS University",
    organization_name: "JIS Tech Club & Student Council",
    role_title: "Lead Student Organizer & Tech Convener",
    phone: "+91 98301 23456",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/organizer/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) setProfile(data.profile);
        }
      } catch (err) {
        console.error("Error loading organizer profile", err);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/organizer/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#242323] border border-[#444343] text-[#E4B74A] text-xs font-bold mb-2">
          <Building className="w-3.5 h-3.5 text-[#E4B74A]" />
          JIS University &bull; Student Organizer Settings
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#FEFEFE] tracking-tight">
          Student Organizer Profile
        </h1>
        <p className="text-xs md:text-sm text-[#D4D4D4] mt-1 font-medium">
          Manage your JIS University student organization credentials, council roles, and contact records.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-[#353434] border border-[#444343] shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-[#444343]">
          <div className="w-16 h-16 rounded-2xl bg-[#446B8D] flex items-center justify-center text-xl font-black text-[#FEFEFE] shadow-md">
            AR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#FEFEFE]">{profile.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#242323] text-[#E4B74A] border border-[#444343]">
                <GraduationCap className="w-3 h-3 text-[#E4B74A]" /> Verified Student Organizer
              </span>
            </div>
            <p className="text-xs text-[#D4D4D4] mt-0.5 font-medium">
              {profile.role_title} &bull; JIS University
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#E4B74A] mb-1.5">
              Full Name (Student Organizer)
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#242323] border border-[#444343] text-[#FEFEFE] text-sm focus:outline-none focus:border-[#446B8D] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E4B74A] mb-1.5">
              Official University Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#242323] border border-[#444343] text-[#FEFEFE] text-sm focus:outline-none focus:border-[#446B8D] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E4B74A] mb-1.5">
              Department &amp; University
            </label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#242323] border border-[#444343] text-[#FEFEFE] text-sm focus:outline-none focus:border-[#446B8D] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E4B74A] mb-1.5">
              Student Club / Council Body
            </label>
            <input
              type="text"
              value={profile.organization_name}
              onChange={(e) => setProfile({ ...profile, organization_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#242323] border border-[#444343] text-[#FEFEFE] text-sm focus:outline-none focus:border-[#446B8D] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E4B74A] mb-1.5">
              Council Role Title
            </label>
            <input
              type="text"
              value={profile.role_title}
              onChange={(e) => setProfile({ ...profile, role_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#242323] border border-[#444343] text-[#FEFEFE] text-sm focus:outline-none focus:border-[#446B8D] font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#E4B74A] mb-1.5">
              Contact Phone (WhatsApp)
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#242323] border border-[#444343] text-[#FEFEFE] text-sm focus:outline-none focus:border-[#446B8D] font-medium"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-[#444343]">
          <div>
            {savedSuccess && (
              <span className="text-xs text-[#E4B74A] font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#E4B74A]" />
                Organizer profile updated successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#446B8D] hover:bg-[#557FA5] text-[#FEFEFE] font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}