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
        {/* Welcome & Stat Banner (Opaque rich dark gradient) */}
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#1c0f38] via-[#150b2b] to-[#0d071b] border border-purple-500/30 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-purple-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Campus Event Registration Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Discover. Register. Experience.
              </h1>
              <p className="text-sm text-lavender-100 mt-1 max-w-2xl font-medium">
                Explore exciting campus opportunities, participate in hackathons &amp; workshops, meet new people, and make your university journey unforgettable.
              </p>
            </div>

            {/* Quick Counts */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-4 rounded-2xl bg-[#0e081f] border border-purple-400/20 text-center min-w-[120px] shadow-sm">
                <div className="text-3xl font-black text-white">{totalCount}</div>
                <div className="text-[11px] text-purple-300 font-bold mt-0.5">Available Events</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#0e081f] border border-emerald-500/30 text-center min-w-[120px] shadow-sm">
                <div className="text-3xl font-black text-emerald-300">{registeredCount}</div>
                <div className="text-[11px] text-purple-300 font-bold mt-0.5">My Passes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Event Spotlight (Only on general browse view) */}
        {!isMyRegistrationsView && featuredEvent && (
          <div className="rounded-3xl bg-[#130d28] border border-purple-500/30 overflow-hidden shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#6c35de] text-white text-xs font-bold tracking-wide flex items-center gap-1 shadow-md shadow-purple-900/30">
                    <Sparkles className="w-3.5 h-3.5 fill-white" /> Featured Event
                  </span>
                  <Badge variant="verified">{featuredEvent.category}</Badge>
                  <span className="text-xs text-emerald-300 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
                    {featuredEvent.participation_fee === 0 ? "FREE ENTRY" : `₹${featuredEvent.participation_fee}`}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {featuredEvent.name}
                </h2>
                <p className="text-xs sm:text-sm text-lavender-100 leading-relaxed max-w-xl font-medium">
                  {featuredEvent.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs pt-2">
                  <div className="flex items-center gap-1.5 text-purple-200 font-semibold">
                    <Calendar className="w-4 h-4 text-purple-300" />
                    <span>{new Date(featuredEvent.start_datetime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-purple-200 font-semibold">
                    <MapPin className="w-4 h-4 text-purple-300" />
                    <span className="truncate max-w-[180px]">{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-amber-300 font-bold">
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

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-[#07050d]">
                <img
                  src={featuredEvent.poster_url}
                  alt={featuredEvent.name}
                  className="w-full h-full object-cover min-h-[260px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#130d28] lg:from-[#130d28]/90 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Search & Sub-Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input (Crisp high-contrast light field) */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, location, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-gray-300 focus:border-[#6c35de] text-sm text-[#150a33] focus:outline-none placeholder:text-gray-400 font-medium shadow-2xs transition-colors"
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
                        ? "bg-[#6c35de] text-white shadow-md shadow-purple-900/20"
                        : "bg-white border border-gray-200 text-[#150a33] hover:border-purple-300 hover:text-[#6c35de]"
                    }`}
                  >
                    {tab}
                    {tab === "My Registrations" && registeredCount > 0 && (
                      <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-black">
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
                        ? "bg-[#6c35de] text-white shadow-md shadow-purple-900/20"
                        : "bg-white border border-gray-200 text-gray-700 hover:text-[#6c35de] hover:border-purple-300"
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-white" : "text-[#6c35de]"}`} />
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
                <h3 className="text-xl font-black text-[#150a33] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  My Registered Events
                </h3>
                <p className="text-xs text-[#645c84] mt-0.5 font-medium">
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
              <h3 className="text-xl font-black text-[#150a33] flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#6c35de]" />
                {selectedCategory === "All" ? "Campus Event Catalog" : `${selectedCategory} Events`}
              </h3>
              <span className="text-xs font-bold text-[#645c84]">
                Showing {events.length} event{events.length === 1 ? "" : "s"}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="p-12 text-center rounded-3xl bg-white border border-gray-200 space-y-3 shadow-xs">
                <Calendar className="w-10 h-10 text-gray-400 mx-auto" />
                <h4 className="text-base font-bold text-[#150a33]">No events match your criteria</h4>
                <p className="text-xs text-[#645c84] max-w-sm mx-auto font-medium">
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
