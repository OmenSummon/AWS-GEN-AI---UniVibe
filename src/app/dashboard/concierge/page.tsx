"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Compass,
  Zap
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConciergeStructuredResponse, ChatMessage } from "@/types";

export default function ConciergePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-welcome",
      sender: "bot",
      content: "Hello! I am your UniVibe Campus Concierge.",
      structured_response: {
        quick_answer:
          "Welcome to your context-aware campus advisor. I analyze your confirmed profile, gap analysis, and upcoming events to give you tailored guidance.",
        personalized_insight:
          "Based on your profile, you have strong technical aptitude in AI and systems, with immediate opportunities to level up your team collaboration and public hackathon visibility.",
        what_to_do_next:
          "Ask me anything about which campus clubs to join, how to prepare for inter-college hackathons, or how to reach out to professors for research opportunities.",
        univibe_tip:
          "You can click any of the prompt pills below to test realistic student scenarios.",
      },
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "What is the best hackathon for me to enter this semester?",
    "How can I close my leadership skill gap before junior year?",
    "Draft a formal request to join the JIS Robotics Lab",
    "What should be my #1 focus this weekend to stay ahead?",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4),
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: data.reply || "Analysis complete.",
        structured_response: data.structured_response,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, botMsg]);
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
        <div className="p-4 rounded-2xl bg-[#130d28] border border-purple-500/30 flex items-center justify-between text-xs text-lavender-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <span className="font-bold text-white">Non-Fabrication Policy: </span>
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
              className="text-xs px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-300 text-[#150a33] hover:text-[#6c35de] transition-all text-left flex items-center gap-1.5 font-semibold shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#6c35de] shrink-0" />
              <span>{prompt}</span>
            </button>
          ))}
        </div>

        {/* Messages Stream Container */}
        <div className="flex-1 min-h-[420px] rounded-3xl bg-[#130d28] border border-purple-500/25 p-5 sm:p-7 overflow-y-auto space-y-6 shadow-2xl">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6c35de] to-[#a855f7] flex items-center justify-center shrink-0 shadow-md shadow-purple-900/30 mt-1">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-5 text-sm ${
                    isUser
                      ? "bg-[#6c35de] text-white shadow-md shadow-purple-900/30 font-medium"
                      : "bg-[#0e081f] border border-purple-400/20 text-lavender-100 shadow-sm"
                  }`}
                >
                  {isUser ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : msg.structured_response ? (
                    <div className="space-y-4">
                      {/* 1. Quick Answer */}
                      <div className="pb-3 border-b border-white/10">
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1">
                          1. Quick Answer
                        </span>
                        <p className="text-white font-bold leading-relaxed">
                          {msg.structured_response.quick_answer}
                        </p>
                      </div>

                      {/* 2. Personalized Insight */}
                      <div>
                        <span className="text-[10px] font-bold text-purple-300 uppercase tracking-wider block mb-1">
                          2. Personalized Profile Insight
                        </span>
                        <p className="text-xs text-lavender-200 leading-relaxed font-medium">
                          {msg.structured_response.personalized_insight}
                        </p>
                      </div>

                      {/* 3. What To Do Next */}
                      <div className="p-4 rounded-xl bg-[#140e2b] border border-emerald-500/30">
                        <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block mb-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 3. What To Do Next
                        </span>
                        <p className="text-xs text-emerald-100 leading-relaxed font-medium">
                          {msg.structured_response.what_to_do_next}
                        </p>
                      </div>

                      {/* 4. UniVibe Tip */}
                      <div className="text-xs text-amber-200/90 pt-1 flex items-start gap-1.5 font-medium">
                        <Lightbulb className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-amber-300">UniVibe Tip: </strong>
                          {msg.structured_response.univibe_tip}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="leading-relaxed whitespace-pre-line text-xs font-medium">{msg.content}</p>
                  )}
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-[#0e081f] border border-purple-400/30 flex items-center justify-center shrink-0 mt-1 text-xs font-bold text-purple-200 shadow-sm">
                    AR
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3.5 justify-start items-center text-xs text-purple-300 font-medium">
              <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-400/40 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4 text-purple-200" />
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
          className="flex items-center gap-2 p-2 rounded-2xl bg-[#0e081f] border border-purple-400/30 shadow-xl"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your Campus Concierge anything about your opportunities, skills, or next steps..."
            className="flex-1 px-4 py-3 bg-transparent text-sm text-white focus:outline-none placeholder:text-purple-300/60 font-medium"
          />
          <Button type="submit" disabled={!input.trim() || loading} size="md" variant="primary">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
