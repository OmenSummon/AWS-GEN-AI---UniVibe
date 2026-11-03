"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Send,
  Mail,
  MessageCircle,
  Share2,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Info
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ToneType, OutreachGenerationResult } from "@/types";

function OutreachContent() {
  const searchParams = useSearchParams();
  const initialOpp = searchParams.get("opportunity") || "";

  const [availableOpps, setAvailableOpps] = useState<any[]>([]);
  const [selectedOppName, setSelectedOppName] = useState<string>(initialOpp);
  const [tone, setTone] = useState<ToneType>("Confident");
  const [outreach, setOutreach] = useState<OutreachGenerationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"email" | "whatsapp" | "social" | "followup">("email");

  useEffect(() => {
    // Load recommendations so student can select from verified list
    fetch("/api/opportunities")
      .then((res) => res.json())
      .then((data) => {
        const opps = data.opportunities || [];
        setAvailableOpps(opps);
        if (!initialOpp && opps.length > 0) {
          setSelectedOppName(opps[0].opportunity_name);
        }
      });
  }, [initialOpp]);

  const handleGenerateOutreach = async () => {
    if (!selectedOppName) return;
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
      <div className="p-4 rounded-xl bg-midnight-900 border border-violet/20 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs text-lavender-300">
          <span className="font-semibold text-white">Authentic Grounding Guarantee: </span>
          UniVibe never fabricates student experience or invents fake email addresses. All communications reflect your confirmed profile credentials. Replace bracketed placeholders before sending.
        </div>
      </div>

      {/* Controls Card */}
      <div className="rounded-2xl p-6 bg-midnight-850/80 border border-violet/20 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-lavender-400 mb-2">
              Target Campus Opportunity
            </label>
            <select
              value={selectedOppName}
              onChange={(e) => setSelectedOppName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-violet/20 focus:border-violet text-white text-sm focus:outline-none"
            >
              {availableOpps.map((o) => (
                <option key={o.id} value={o.opportunity_name}>
                  {o.opportunity_name} ({o.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-lavender-400 mb-2">
              Communication Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneType)}
              className="w-full px-4 py-3 rounded-xl bg-midnight-900 border border-violet/20 focus:border-violet text-white text-sm focus:outline-none"
            >
              <option value="Confident">Confident — Forward-looking, assertive</option>
              <option value="Friendly">Friendly — Warm, accessible, collaborative</option>
              <option value="Professional">Professional — Structured, respectful, formal</option>
              <option value="Enthusiastic">Enthusiastic — Highly engaged, eager</option>
              <option value="Curious">Curious — Inquisitive, exploratory</option>
            </select>
          </div>
        </div>
      </div>

      {/* Generated Outreach Tabs */}
      {outreach && (
        <div className="rounded-2xl bg-midnight-850/80 border border-violet/20 overflow-hidden shadow-xl">
          {/* Tabs Header */}
          <div className="flex border-b border-white/10 bg-midnight-900/60 overflow-x-auto">
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
                  className={`flex items-center gap-2 px-6 py-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                    active
                      ? "border-violet text-white bg-violet/10"
                      : "border-transparent text-lavender-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4 text-violet-light" />
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
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div>
                    <span className="text-xs text-lavender-400 font-semibold block">Subject:</span>
                    <span className="text-sm font-bold text-white">{outreach.professional_email.subject}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      copyToClipboard(
                        `Subject: ${outreach.professional_email.subject}\n\n${outreach.professional_email.salutation}\n\n${outreach.professional_email.body}\n\n${outreach.professional_email.sign_off}`,
                        "email"
                      )
                    }
                    className="text-xs"
                  >
                    {copiedKey === "email" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Entire Email
                      </>
                    )}
                  </Button>
                </div>

                <div className="p-5 rounded-xl bg-midnight-900 border border-white/5 font-mono text-xs text-lavender-200 whitespace-pre-line leading-relaxed">
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
                <div className="flex items-center justify-between">
                  <span className="text-xs text-lavender-400 font-semibold">
                    WhatsApp Quick Outreach (Optimized for mobile glance):
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(outreach.whatsapp_message, "whatsapp")}
                    className="text-xs"
                  >
                    {copiedKey === "whatsapp" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Message
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-5 rounded-xl bg-midnight-900 border border-white/5 font-mono text-xs text-lavender-200 whitespace-pre-line leading-relaxed">
                  {outreach.whatsapp_message}
                </div>
              </div>
            )}

            {/* TAB 3: Social DM */}
            {activeTab === "social" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-lavender-400 font-semibold">
                    LinkedIn / Instagram DM (&lt; 280 characters):
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(outreach.social_dm, "social")}
                    className="text-xs"
                  >
                    {copiedKey === "social" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy DM
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-5 rounded-xl bg-midnight-900 border border-white/5 font-mono text-xs text-lavender-200 whitespace-pre-line leading-relaxed">
                  {outreach.social_dm}
                </div>
              </div>
            )}

            {/* TAB 4: Follow-up */}
            {activeTab === "followup" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-lavender-400 font-semibold">
                    Low-Pressure Follow-Up Ping (Send 4-5 days after initial outreach):
                  </span>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => copyToClipboard(outreach.followup_message, "followup")}
                    className="text-xs"
                  >
                    {copiedKey === "followup" ? (
                      <>
                        <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 mr-1" /> Copy Follow-Up
                      </>
                    )}
                  </Button>
                </div>
                <div className="p-5 rounded-xl bg-midnight-900 border border-white/5 font-mono text-xs text-lavender-200 whitespace-pre-line leading-relaxed">
                  {outreach.followup_message}
                </div>
              </div>
            )}

            {/* 3 Outreach Success Tips */}
            <div className="pt-6 border-t border-white/10 space-y-3">
              <span className="text-xs font-bold text-violet-light uppercase tracking-wider block">
                3 AI Outreach Tactics:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {outreach.success_tips?.map((tip, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-midnight-900/60 border border-white/5 text-xs text-lavender-300">
                    <span className="text-violet-light font-bold">0{idx + 1}. </span>
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
      <Suspense fallback={<div className="p-8 text-center text-xs text-lavender-400">Loading Outreach Copilot...</div>}>
        <OutreachContent />
      </Suspense>
    </div>
  );
}
