"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  User,
  Bot,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConciergeMessage } from "@/types";

const suggestedPrompts = [
  "What hackathons should I prepare for this semester?",
  "How can I find a faculty research mentor in my department?",
  "What are my biggest skill gaps and how do I address them?",
  "How can I balance a campus build with 5-6 hours per week?",
];

export default function ConciergePage() {
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadHistory = async () => {
    try {
      const res = await fetch("/api/concierge/history");
      const data = await res.json();
      if (data.messages && data.messages.length > 0) {
        setMessages(data.messages);
      } else {
        // Initial welcoming concierge message
        setMessages([
          {
            id: "msg-welcome",
            conversation_id: "conv-default",
            sender: "assistant",
            content:
              "Welcome to your Campus Concierge! I have full contextual access to your UniVibe profile, match recommendations, gap analysis, and roadmap. How can I assist your campus growth today?",
            structured_response: {
              quick_answer: "I'm your dedicated campus intelligence assistant, calibrated to your specific profile and career goals.",
              personalized_insight: "I combine your documented skills, available weekly hours, and target ambitions to provide realistic campus strategies.",
              what_to_do_next: "Ask any question about hackathons, faculty research, club leadership, or skill acquisition.",
              univibe_tip: "Try asking about how to bridge your top technical skill with a faculty research fellowship.",
            },
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMessage: ConciergeMessage = {
      id: "usr-" + Date.now(),
      conversation_id: "conv-default",
      sender: "user",
      content: textToSend,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!messageText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Campus Concierge"
        subtitle="Context-aware student advisor grounded in your live profile, gap analysis, and roadmap."
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full flex-1 flex flex-col">
        {/* Anti-Hallucination & Verification Notice */}
        <div className="p-3.5 rounded-xl bg-midnight-900 border border-violet/20 flex items-center justify-between text-xs text-lavender-300">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <span className="font-semibold text-white">Non-Fabrication Policy: </span>
              All guidance references your active profile data and verified campus knowledge.
            </span>
          </div>
          <Badge variant="default" className="text-[10px] hidden sm:inline-flex">
            4-Part Structured Analysis
          </Badge>
        </div>

        {/* Suggested Quick Prompt Pills */}
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-xl bg-midnight-850/80 border border-violet/15 hover:border-violet/40 text-lavender-300 hover:text-white transition-all text-left flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3 text-violet-light shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 min-h-[420px] rounded-2xl bg-midnight-850/60 border border-violet/20 p-4 sm:p-6 overflow-y-auto space-y-6 shadow-xl">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-violet to-violet-light flex items-center justify-center shrink-0 shadow-md shadow-violet/20 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm ${
                    isUser
                      ? "bg-violet text-white shadow-md shadow-violet/20"
                      : "bg-midnight-900 border border-white/5 text-lavender-200"
                  }`}
                >
                  {isUser ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.structured_response ? (
                    <div className="space-y-4">
                      {/* 1. Quick Answer */}
                      <div className="pb-3 border-b border-white/10">
                        <span className="text-[11px] font-bold text-violet-light uppercase tracking-wider block mb-1">
                          1. Quick Answer
                        </span>
                        <p className="text-white font-medium leading-relaxed">
                          {msg.structured_response.quick_answer}
                        </p>
                      </div>

                      {/* 2. Personalized Insight */}
                      <div>
                        <span className="text-[11px] font-bold text-lavender-400 uppercase tracking-wider block mb-1">
                          2. Personalized Profile Insight
                        </span>
                        <p className="text-xs text-lavender-300 leading-relaxed">
                          {msg.structured_response.personalized_insight}
                        </p>
                      </div>

                      {/* 3. What To Do Next */}
                      <div className="p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                        <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 3. What To Do Next
                        </span>
                        <p className="text-xs text-lavender-200 leading-relaxed">
                          {msg.structured_response.what_to_do_next}
                        </p>
                      </div>

                      {/* 4. UniVibe Tip */}
                      <div className="text-xs text-amber-300/90 pt-1 flex items-start gap-1.5">
                        <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-white">UniVibe Tip: </strong>
                          {msg.structured_response.univibe_tip}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-line text-xs">{msg.content}</p>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-midnight-800 border border-violet/30 flex items-center justify-center shrink-0 mt-1 text-xs font-bold text-lavender-200">
                    AR
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 justify-start items-center text-xs text-lavender-400">
              <div className="w-8 h-8 rounded-xl bg-violet/20 border border-violet/30 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4 text-violet-light" />
              </div>
              <span className="animate-pulse">Concierge is synthesizing your profile &amp; campus data...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 p-2 rounded-2xl bg-midnight-850 border border-violet/25 shadow-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your Campus Concierge anything about your opportunities, skills, or next steps..."
            className="flex-1 px-4 py-3 bg-transparent text-sm text-white focus:outline-none placeholder:text-lavender-400/50"
          />
          <Button type="submit" disabled={!input.trim() || loading} size="md">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

