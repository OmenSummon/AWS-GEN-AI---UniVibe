"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Mail,
  MessageCircle,
  Share2,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Clock,
  ShieldCheck,
  HelpCircle,
  Lightbulb
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { OutreachCopilotResult, ToneType, OpportunityRecommendation } from "@/types";

function OutreachContent() {
  const searchParams = useSearchParams();
  const initialOppName = searchParams.get("opportunity") || "AI Ethics Symposium";

  const [availableOpps, setAvailableOpps] = useState<OpportunityRecommendation[]>([]);
  const [selectedOppName, setSelectedOppName] = useState(initialOppName);
  const [tone, setTone] = useState<ToneType>("Confident");
  const [outreach, setOutreach] = useState<OutreachCopilotResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp" | "social" | "followup">("email");

  // Load campus matches
  useEffect(() => {
    async function loadMatches() {
      try {
        const res = await fetch("/api/ai/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.matches?.recommendations) {
          setAvailableOpps(data.matches.recommendations);
          if (!searchParams.get("opportunity") && data.matches.recommendations[0]) {
            setSelectedOppName(data.matches.recommendations[0].opportunity_name);
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadMatches();
  }, []);

  const handleGenerateOutreach = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/outreach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityName: selectedOppName,
          tone,
        }),
      });

      const data = await res.json();
      setOutreach(data.outreach);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedOppName) {
      handleGenerateOutreach();
    }
  }, [selectedOppName, tone]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Grounding & Anti-Fabrication Notice */}
      <div className="p-4 rounded-2xl bg-[#353434] border border-[#444343] flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-[#D4D4D4] leading-relaxed">
          <span className="font-bold text-[#FEFEFE]">Authentic Grounding Guarantee: </span>
          UniVibe never fabricates student experience or invents fake email addresses. All communications reflect your confirmed profile credentials. Replace bracketed placeholders before sending.
        </div>
      </div>

      {/* Controls Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-[#353434] border border-[#444343] space-y-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E4B74A] mb-2">
              Target Campus Opportunity
            </label>
            <select
              value={selectedOppName}
              onChange={(e) => setSelectedOppName(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none font-semibold cursor-pointer"
            >
              {availableOpps.map((o) => (
                <option key={o.id} value={o.opportunity_name} className="bg-[#2C2B2B] text-[#FEFEFE]">
                  {o.opportunity_name} ({o.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E4B74A] mb-2">
              Communication Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneType)}
              className="w-full px-4 py-3 rounded-2xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-[#FEFEFE] text-sm focus:outline-none font-semibold cursor-pointer"
            >
              <option value="Confident" className="bg-[#2C2B2B] text-[#FEFEFE]">Confident — Forward-looking, assertive</option>
              <option value="Friendly" className="bg-[#2C2B2B] text-[#FEFEFE]">Friendly — Warm, accessible, collaborative</option>
              <option value="Professional" className="bg-[#2C2B2B] text-[#FEFEFE]">Professional — Structured, respectful, formal</option>
              <option value="Enthusiastic" className="bg-[#2C2B2B] text-[#FEFEFE]">Enthusiastic — Highly engaged, eager</option>
              <option value="Curious" className="bg-[#2C2B2B] text-[#FEFEFE]">Curious — Inquisitive, exploratory</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Outreach Tabs */}
      {outreach && (
        <div className="rounded-3xl bg-[#353434] border border-[#444343] overflow-hidden shadow-2xl">
          {/* Tabs Header */}
          <div className="flex border-b border-[#444343] bg-[#242323] overflow-x-auto">
            {[
              { id: "email", name: "Formal Email", icon: Mail },
              { id: "whatsapp", name: "WhatsApp Message", icon: MessageCircle },
              { id: "social", name: "Social / LinkedIn DM", icon: Share2 },
              { id: "followup", name: "Follow-Up Ping", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                    active
                      ? "border-[#446B8D] text-[#FEFEFE] bg-[#446B8D]/25"
                      : "border-transparent text-[#D4D4D4] hover:text-[#FEFEFE] hover:bg-[#353434]"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#E4B74A]" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* TAB 1: Email */}
            {activeTab === "email" && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#444343] gap-3">
                  <div>
                    <span className="text-xs text-[#E4B74A] font-bold block">Subject:</span>
                    <span className="text-sm font-black text-[#FEFEFE]">{outreach.professional_email.subject}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() =>
                      copyToClipboard(
                        `Subject: ${outreach.professional_email.subject}\n\n${outreach.professional_email.salutation}\n\n${outreach.professional_email.body}\n\n${outreach.professional_email.sign_off}`,
                        "email"
                      )
                    }
                    className="text-xs shadow-sm w-fit"
                  >
                    {copiedKey === "email" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Entire Email
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-6 rounded-2xl bg-[#242323] border border-[#444343] font-mono text-xs text-[#FEFEFE] whitespace-pre-line leading-relaxed shadow-inner">
                  {outreach.professional_email.salutation}
                  {"\n\n"}
                  {outreach.professional_email.body}
                  {"\n\n"}
                  {outreach.professional_email.sign_off}
                </div>
              </div>
            )}

            {/* TAB 2: WhatsApp */}
            {activeTab === "whatsapp" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#444343]">
                  <span className="text-xs text-[#E4B74A] font-bold">Fast Mobile Outreach</span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => copyToClipboard(outreach.whatsapp_message, "whatsapp")}
                    className="text-xs shadow-sm"
                  >
                    {copiedKey === "whatsapp" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy WhatsApp Text
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-6 rounded-2xl bg-[#242323] border border-[#444343] font-mono text-xs text-[#FEFEFE] whitespace-pre-line leading-relaxed shadow-inner">
                  {outreach.whatsapp_message}
                </div>
              </div>
            )}

            {/* TAB 3: Social / LinkedIn DM */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#444343]">
                  <span className="text-xs text-[#E4B74A] font-bold">Short Direct Message (DM)</span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => copyToClipboard(outreach.short_dm, "dm")}
                    className="text-xs shadow-sm"
                  >
                    {copiedKey === "dm" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Short DM
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-6 rounded-2xl bg-[#242323] border border-[#444343] font-mono text-xs text-[#FEFEFE] whitespace-pre-line leading-relaxed shadow-inner">
                  {outreach.short_dm}
                </div>
              </div>
            )}

            {/* TAB 4: Follow-up */}
            {activeTab === "followup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-[#444343]">
                  <span className="text-xs text-[#E4B74A] font-bold">Polite 5-Day Re-Engagement</span>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => copyToClipboard(outreach.follow_up_ping, "followup")}
                    className="text-xs shadow-sm"
                  >
                    {copiedKey === "followup" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-300" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Follow-Up Ping
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-6 rounded-2xl bg-[#242323] border border-[#444343] font-mono text-xs text-[#FEFEFE] whitespace-pre-line leading-relaxed shadow-inner">
                  {outreach.follow_up_ping}
                </div>
              </div>
            )}

            {/* AI Strategy Tactics */}
            <div className="pt-6 border-t border-[#444343] space-y-3">
              <span className="text-xs font-bold text-[#E4B74A] flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-[#E4B74A]" />
                3 Tactical AI Advice Points for this Opportunity
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {outreach.success_tips?.map((tip, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#242323] border border-[#444343] text-xs text-[#D4D4D4] leading-relaxed shadow-xs">
                    <span className="text-[#E4B74A] font-black">0{idx + 1}. </span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OutreachPage() {
  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Outreach Copilot"
        subtitle="High-conversion student messages grounded in your verified skills and calibrated communication tone."
      />
      <Suspense fallback={<div className="p-8 text-center text-xs text-[#E4B74A]">Loading Outreach Copilot...</div>}>
        <OutreachContent />
      </Suspense>
    </div>
  );
}
