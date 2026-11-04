"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calendar,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Tag,
  ArrowRight,
  TrendingUp,
  Bookmark,
  RefreshCw,
  Cpu,
  Palette,
  Trophy,
  Gamepad2,
  Camera,
  Music,
  Briefcase,
  Layers,
  HelpCircle,
  X
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { EventCard } from "@/components/events/EventCard";
import { EventDetailsModal } from "@/components/events/EventDetailsModal";
import { DynamicRegistrationModal } from "@/components/events/DynamicRegistrationModal";
import { MyRegistrationsTab } from "@/components/events/MyRegistrationsTab";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CampusEvent, EventRegistration, StudentProfile } from "@/types";

export default function EventsHubPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [featuredEvent, setFeaturedEvent] = useState<CampusEvent | null>(null);

  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [inspectEvent, setInspectEvent] = useState<CampusEvent | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<CampusEvent | null>(null);

  // Categories list
  const categories = [
    { name: "All", label: "All Categories", icon: Layers },
    { name: "Hackathon", label: "Hackathons", icon: Cpu },
    { name: "Technical Fest", label: "Tech Fests", icon: TrendingUp },
    { name: "Workshop", label: "Workshops", icon: Sparkles },
    { name: "Seminar", label: "Seminars", icon: Users },
    { name: "Conference", label: "Conferences", icon: Briefcase },
    { name: "Cultural Fest", label: "Cultural Fests", icon: Palette },
    { name: "Sports", label: "Sports", icon: Trophy },
    { name: "Gaming", label: "Gaming", icon: Gamepad2 },
    { name: "Photography", label: "Photography", icon: Camera },
    { name: "Music", label: "Music", icon: Music },
    { name: "Entrepreneurship", label: "Startup & E-Cell", icon: TrendingUp },
  ];

  const subFilterTabs = [
    "All Events",
    "Open for Registration",
    "Online Events",
    "Offline Campus Events",
    "My Registrations",
  ];

  const fetchHubData = async () => {
    try {
      // 1. Fetch Profile
      const pRes = await fetch("/api/profile");
      const pData = await pRes.json();
      setProfile(pData.profile);

      // 2. Fetch Events
      const params = new URLSearchParams();
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (selectedSubFilter !== "All Events" && selectedSubFilter !== "My Registrations") {
        params.set("type", selectedSubFilter);
      }

      const eRes = await fetch(`/api/events?${params.toString()}`);
      const eData = await eRes.json();
      setEvents(eData.events || []);
      setTotalCount(eData.totalCount || 0);
      setRegisteredCount(eData.registeredCount || 0);
      setFeaturedEvent(eData.featuredEvent || null);

      // 3. Fetch Student Registrations
      const rRes = await fetch("/api/events/registrations");
      const rData = await rRes.json();
      setRegistrations(rData.registrations || []);
    } catch (err) {
      console.error("Error loading Event Hub data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHubData();
  }, [selectedCategory, selectedSubFilter, searchQuery]);

  const handleToggleSave = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}/save`, { method: "POST" });
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === eventId ? { ...e, is_saved: !e.is_saved } : e))
        );
        if (featuredEvent && featuredEvent.id === eventId) {
          setFeaturedEvent({ ...featuredEvent, is_saved: !featuredEvent.is_saved });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegistrationSuccess = (newReg: EventRegistration) => {
    setRegistrations((prev) => [newReg, ...prev]);
    setRegisteredCount((c) => c + 1);
    setEvents((prev) =>
      prev.map((e) => (e.id === newReg.event_id ? { ...e, is_registered: true } : e))
    );
    if (featuredEvent && featuredEvent.id === newReg.event_id) {
      setFeaturedEvent({ ...featuredEvent, is_registered: true });
    }
    setRegisteringEvent(null);
  };

  const handleCancelRegistration = async (registrationId: string) => {
    if (!confirm("Are you sure you want to cancel this event registration?")) return;
    try {
      const res = await fetch(`/api/events/registrations?id=${registrationId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
        setRegisteredCount((c) => Math.max(0, c - 1));
        fetchHubData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isMyRegistrationsView = selectedSubFilter === "My Registrations";

  return (
    <div className="flex-1 flex flex-col pb-16">
      <Navbar
        title="Event Hub"
        subtitle="Discover. Register. Experience. Explore campus opportunities and track your registrations."
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome & Stat Banner */}
        <div className="rounded-3xl p-6 sm:p-8 bg-[#353434] border border-[#446B8D]/40 relative overflow-hidden shadow-2xl text-[#FEFEFE]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#242323] border border-[#444343] text-xs font-bold text-[#E4B74A] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E4B74A]" />
                <span>Campus Event Registration Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#FEFEFE] tracking-tight">
                Discover. Register. Experience.
              </h1>
              <p className="text-sm text-[#D4D4D4] mt-1 max-w-2xl font-medium">
                Explore exciting campus opportunities, participate in hackathons &amp; workshops, meet new people, and make your university journey unforgettable.
              </p>
            </div>

            {/* Quick Counts */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-[#242323] border border-[#444343] text-center min-w-[120px] shadow-sm">
                <div className="text-3xl font-black text-[#FEFEFE]">{totalCount}</div>
                <div className="text-[11px] text-[#E4B74A] font-bold mt-0.5">Available Events</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#242323] border border-emerald-500/30 text-center min-w-[120px] shadow-sm">
                <div className="text-3xl font-black text-emerald-300">{registeredCount}</div>
                <div className="text-[11px] text-[#E4B74A] font-bold mt-0.5">My Passes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Event Spotlight */}
        {!isMyRegistrationsView && featuredEvent && (
          <div className="rounded-3xl bg-[#353434] border border-[#444343] overflow-hidden shadow-2xl relative text-[#FEFEFE]">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#E4B74A] text-[#2C2B2B] text-xs font-black tracking-wide flex items-center gap-1 shadow-md">
                    <Sparkles className="w-3.5 h-3.5 fill-[#2C2B2B]" /> Featured Event
                  </span>
                  <Badge variant="verified">{featuredEvent.category}</Badge>
                  <span className="text-xs text-[#2C2B2B] font-extrabold bg-[#E4B74A] px-3 py-1 rounded-full">
                    {featuredEvent.participation_fee === 0 ? "FREE ENTRY" : `₹${featuredEvent.participation_fee}`}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-[#FEFEFE] tracking-tight">
                  {featuredEvent.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#D4D4D4] leading-relaxed max-w-xl font-medium">
                  {featuredEvent.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                  <div className="flex items-center gap-1.5 text-[#D4D4D4] font-semibold">
                    <Calendar className="w-4 h-4 text-[#446B8D]" />
                    <span>{new Date(featuredEvent.start_datetime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#D4D4D4] font-semibold">
                    <MapPin className="w-4 h-4 text-[#446B8D]" />
                    <span className="truncate max-w-[180px]">{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[#E4B74A] font-bold">
                    <Clock className="w-4 h-4" />
                    <span>Closes {new Date(featuredEvent.registration_deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Button
                    size="md"
                    variant="primary"
                    onClick={() => {
                      if (featuredEvent.is_registered) {
                        setInspectEvent(featuredEvent);
                      } else {
                        setRegisteringEvent(featuredEvent);
                      }
                    }}
                    className="text-xs px-6"
                  >
                    {featuredEvent.is_registered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-300" />
                        Pass Active — View Details
                      </>
                    ) : (
                      <>
                        Register Now
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </>
                    )}
                  </Button>

                  <Button
                    size="md"
                    variant="secondary"
                    onClick={() => setInspectEvent(featuredEvent)}
                    className="text-xs"
                  >
                    View Guidelines
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-[#242323]">
                <img
                  src={featuredEvent.poster_url}
                  alt={featuredEvent.name}
                  className="w-full h-full object-cover min-h-[260px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#353434] lg:from-[#353434]/90 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Search & Sub-Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-[#A8A8A8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, location, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#242323] border border-[#444343] focus:border-[#446B8D] text-sm text-[#FEFEFE] focus:outline-none placeholder:text-[#A8A8A8] font-medium shadow-2xs transition-colors"
              />
            </div>

            {/* Sub-Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {subFilterTabs.map((tab) => {
                const isActive = selectedSubFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedSubFilter(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-2xs ${
                      isActive
                        ? "bg-[#446B8D] text-[#FEFEFE] shadow-md shadow-[#2C2B2B]"
                        : "bg-[#353434] border border-[#444343] text-[#D4D4D4] hover:border-[#446B8D]/50 hover:text-[#FEFEFE]"
                    }`}
                  >
                    {tab}
                    {tab === "My Registrations" && registeredCount > 0 && (
                      <span className="ml-1.5 text-[10px] bg-[#E4B74A] text-[#2C2B2B] px-2 py-0.5 rounded-full font-black">
                        {registeredCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 12 Category Filters Bar */}
          {!isMyRegistrationsView && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isActive
                        ? "bg-[#446B8D] text-[#FEFEFE] shadow-md shadow-[#2C2B2B]"
                        : "bg-[#353434] border border-[#444343] text-[#D4D4D4] hover:text-[#FEFEFE] hover:border-[#446B8D]/50"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-[#FEFEFE]" : "text-[#E4B74A]"}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* MAIN VIEW CONTENT: Events Grid or My Registrations */}
        {isMyRegistrationsView ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-[#FEFEFE] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  My Registered Events
                </h3>
                <p className="text-xs text-[#D4D4D4] mt-0.5 font-medium">
                  Manage your event passes, check status, download vouchers, or cancel registrations.
                </p>
              </div>
            </div>

            <MyRegistrationsTab
              registrations={registrations}
              onCancelRegistration={handleCancelRegistration}
              onViewEventDetails={(e) => setInspectEvent(e)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-[#FEFEFE] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#446B8D]" />
                {selectedCategory === "All" ? "Campus Event Catalog" : `${selectedCategory} Events`}
              </h3>
              <span className="text-xs font-bold text-[#D4D4D4]">
                Showing {events.length} event{events.length === 1 ? "" : "s"}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-[#353434] border border-[#444343] space-y-3 shadow-xs">
                <Calendar className="w-10 h-10 text-[#A8A8A8] mx-auto" />
                <h4 className="text-base font-bold text-[#FEFEFE]">No events match your criteria</h4>
                <p className="text-xs text-[#D4D4D4] max-w-sm mx-auto font-medium">
                  Try clearing your search query or selecting a different category.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedSubFilter("All Events");
                    setSearchQuery("");
                  }}
                  className="text-xs"
                >
                  Reset Search Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((evt) => (
                  <EventCard
                    key={evt.id}
                    event={evt}
                    onViewDetails={(e) => setInspectEvent(e)}
                    onRegister={(e) => setRegisteringEvent(e)}
                    onToggleSave={(id) => handleToggleSave(id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL: Event Full Details & Rules */}
      {inspectEvent && (
        <EventDetailsModal
          event={inspectEvent}
          onClose={() => setInspectEvent(null)}
          onRegister={(e) => {
            setInspectEvent(null);
            setRegisteringEvent(e);
          }}
        />
      )}

      {/* MODAL: Dynamic Registration Form */}
      {registeringEvent && (
        <DynamicRegistrationModal
          event={registeringEvent}
          profile={profile}
          onClose={() => setRegisteringEvent(null)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}
