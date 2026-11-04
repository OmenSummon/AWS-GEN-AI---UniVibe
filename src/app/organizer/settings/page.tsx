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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 text-xs font-bold mb-2">
          <Building className="w-3.5 h-3.5 text-fuchsia-600" />
          JIS University &bull; Student Organizer Settings
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-[#150a33] tracking-tight">
          Student Organizer Profile
        </h1>
        <p className="text-xs md:text-sm text-[#645c84] mt-1 font-medium">
          Manage your JIS University student organization credentials, council roles, and contact records.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-6 md:p-8 rounded-3xl bg-white border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-gray-150">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-[#6c35de] flex items-center justify-center text-xl font-black text-white shadow-md shadow-fuchsia-500/20">
            AR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-[#150a33]">{profile.name}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200">
                <GraduationCap className="w-3 h-3 text-fuchsia-600" /> Verified Student Organizer
              </span>
            </div>
            <p className="text-xs text-[#645c84] mt-0.5 font-medium">
              {profile.role_title} &bull; JIS University
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-[#150a33] mb-1.5">
              Full Name (Student Organizer)
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#150a33] text-sm focus:outline-none focus:border-fuchsia-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#150a33] mb-1.5">
              Official University Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#150a33] text-sm focus:outline-none focus:border-fuchsia-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#150a33] mb-1.5">
              Department &amp; University
            </label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) => setProfile({ ...profile, department: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#150a33] text-sm focus:outline-none focus:border-fuchsia-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#150a33] mb-1.5">
              Student Club / Council Body
            </label>
            <input
              type="text"
              value={profile.organization_name}
              onChange={(e) => setProfile({ ...profile, organization_name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#150a33] text-sm focus:outline-none focus:border-fuchsia-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#150a33] mb-1.5">
              Council Role Title
            </label>
            <input
              type="text"
              value={profile.role_title}
              onChange={(e) => setProfile({ ...profile, role_title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#150a33] text-sm focus:outline-none focus:border-fuchsia-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#150a33] mb-1.5">
              Contact Phone (WhatsApp)
            </label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-[#150a33] text-sm focus:outline-none focus:border-fuchsia-500 font-medium"
            />
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between border-t border-gray-150">
          <div>
            {savedSuccess && (
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Organizer profile updated successfully!
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-fuchsia-600 to-[#6c35de] hover:brightness-110 text-white font-bold text-xs shadow-md shadow-fuchsia-500/20 flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
