"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Bookmark,
  Users,
  Video,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  Code,
  Trophy,
  Camera,
  Music,
  Gamepad2,
  Briefcase,
  BookOpen,
  Compass,
  Zap,
  Globe
} from "lucide-react";
import { Navbar } from "@/components/navigation/Navbar";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EventCard } from "@/components/events/EventCard";
import { EventDetailsModal } from "@/components/events/EventDetailsModal";
import { DynamicRegistrationModal } from "@/components/events/DynamicRegistrationModal";
import { MyRegistrationsTab } from "@/components/events/MyRegistrationsTab";
import { CampusEvent, EventRegistration, StudentProfile, EventHubCategory } from "@/types";

const categories: { name: EventHubCategory | "All"; label: string; icon: any }[] = [
  { name: "All", label: "All Events", icon: Globe },
  { name: "Technical", label: "Technical", icon: Code },
  { name: "Hackathons", label: "Hackathons", icon: Zap },
  { name: "Workshops", label: "Workshops", icon: Sparkles },
  { name: "Cultural", label: "Cultural", icon: Users },
  { name: "Sports", label: "Sports", icon: Trophy },
  { name: "Entrepreneurship", label: "Entrepreneurship", icon: Briefcase },
  { name: "Gaming", label: "Gaming", icon: Gamepad2 },
  { name: "Photography", label: "Photography", icon: Camera },
  { name: "Music", label: "Music", icon: Music },
  { name: "Literary", label: "Literary", icon: BookOpen },
  { name: "Social & Networking", label: "Social", icon: Compass },
  { name: "Career & Placement", label: "Career", icon: Tag },
];

const subFilterTabs = [
  "All Events",
  "Upcoming",
  "Free Events",
  "Online Events",
  "Offline Events",
  "My Registrations",
];

export default function EventHubPage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [featuredEvent, setFeaturedEvent] = useState<CampusEvent | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<EventHubCategory | "All">("All");
  const [selectedSubFilter, setSelectedSubFilter] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [inspectEvent, setInspectEvent] = useState<CampusEvent | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<CampusEvent | null>(null);

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
    // Optimistic toggle
    setEvents((prev) =>
      prev.map((e) => (e.id === eventId ? { ...e, is_saved: !e.is_saved } : e))
    );
    if (featuredEvent && featuredEvent.id === eventId) {
      setFeaturedEvent({ ...featuredEvent, is_saved: !featuredEvent.is_saved });
    }
    if (inspectEvent && inspectEvent.id === eventId) {
      setInspectEvent({ ...inspectEvent, is_saved: !inspectEvent.is_saved });
    }

    await fetch("/api/events/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
  };

  const handleRegistrationSuccess = (newReg: any) => {
    setRegistrations((prev) => [newReg, ...prev]);
    setRegisteredCount((c) => c + 1);

    // Update event status locally
    setEvents((prev) =>
      prev.map((e) =>
        e.id === newReg.event_id
          ? {
              ...e,
              is_registered: true,
              registered_count: e.registered_count + 1,
              registration_number: newReg.registration_number,
            }
          : e
      )
    );

    if (featuredEvent && featuredEvent.id === newReg.event_id) {
      setFeaturedEvent({
        ...featuredEvent,
        is_registered: true,
        registered_count: featuredEvent.registered_count + 1,
      });
    }
  };

  const handleCancelRegistration = async (registrationId: string) => {
    try {
      const res = await fetch("/api/events/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh registrations
        setRegistrations((prev) =>
          prev.map((r) =>
            r.id === registrationId ? { ...r, registration_status: "Cancelled" } : r
          )
        );
        setRegisteredCount((c) => Math.max(0, c - 1));

        // Refresh event card status
        const cancelledReg = registrations.find((r) => r.id === registrationId);
        if (cancelledReg) {
          setEvents((prev) =>
            prev.map((e) =>
              e.id === cancelledReg.event_id
                ? { ...e, is_registered: false, registered_count: Math.max(0, e.registered_count - 1) }
                : e
            )
          );
        }
      }
    } catch (e) {
      console.error(e);
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
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-violet/25 via-midnight-800 to-midnight-850 border border-violet/25 relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-violet/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 border border-violet/30 text-xs text-lavender-200 mb-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-light" />
                <span>Campus Event Registration Hub</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Discover. Register. Experience.
              </h1>
              <p className="text-sm text-lavender-300 mt-1 max-w-2xl">
                Explore exciting campus opportunities, participate in hackathons &amp; workshops, meet new people, and make your university journey unforgettable.
              </p>
            </div>

            {/* Quick Counts */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-white/10 text-center min-w-[110px]">
                <div className="text-2xl font-extrabold text-white">{totalCount}</div>
                <div className="text-[11px] text-lavender-400 font-medium">Available Events</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-midnight-950/80 border border-violet/30 text-center min-w-[110px]">
                <div className="text-2xl font-extrabold text-emerald-400">{registeredCount}</div>
                <div className="text-[11px] text-lavender-300 font-medium">My Passes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Event Spotlight (Only on general browse view) */}
        {!isMyRegistrationsView && featuredEvent && (
          <div className="rounded-3xl bg-midnight-850/90 border border-violet/30 overflow-hidden shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 p-6 sm:p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-violet text-white text-xs font-bold tracking-wide flex items-center gap-1 shadow-md shadow-violet/30">
                    <Sparkles className="w-3.5 h-3.5 fill-white" /> Featured Event
                  </span>
                  <Badge variant="verified">{featuredEvent.category}</Badge>
                  <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {featuredEvent.participation_fee === 0 ? "FREE ENTRY" : `₹${featuredEvent.participation_fee}`}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {featuredEvent.name}
                </h2>
                <p className="text-xs sm:text-sm text-lavender-300 leading-relaxed max-w-xl">
                  {featuredEvent.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-lavender-400 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-violet-light" />
                    <span>{new Date(featuredEvent.start_datetime).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-violet-light" />
                    <span className="truncate max-w-[180px]">{featuredEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-amber-300">
                    <Clock className="w-4 h-4" />
                    <span>Closes {new Date(featuredEvent.registration_deadline).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <Button
                    size="md"
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
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-400" />
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
                    variant="outline"
                    onClick={() => setInspectEvent(featuredEvent)}
                    className="text-xs"
                  >
                    View Guidelines
                  </Button>
                </div>
              </div>

              <div className="lg:col-span-5 h-64 lg:h-full relative overflow-hidden bg-midnight-950">
                <img
                  src={featuredEvent.poster_url}
                  alt={featuredEvent.name}
                  className="w-full h-full object-cover min-h-[260px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-midnight-850 lg:from-midnight-850/90 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        )}

        {/* Search & Sub-Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-lavender-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by name, location, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-midnight-850 border border-violet/20 focus:border-violet text-sm text-white focus:outline-none placeholder:text-lavender-400/50"
              />
            </div>

            {/* Sub-Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {subFilterTabs.map((tab) => {
                const isActive = selectedSubFilter === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setSelectedSubFilter(tab)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? "bg-violet text-white shadow-md shadow-violet/25"
                        : "bg-midnight-850 text-lavender-400 hover:text-white border border-white/5"
                    }`}
                  >
                    {tab}
                    {tab === "My Registrations" && registeredCount > 0 && (
                      <span className="ml-1.5 text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded-full font-bold">
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
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                      isActive
                        ? "bg-violet/25 text-white border border-violet/50 shadow-sm shadow-violet/20"
                        : "bg-midnight-850/60 text-lavender-400 hover:text-white border border-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-violet-light shrink-0" />
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
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  My Registered Events
                </h3>
                <p className="text-xs text-lavender-400 mt-0.5">
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
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-violet-light" />
                {selectedCategory === "All" ? "Campus Event Catalog" : `${selectedCategory} Events`}
              </h3>
              <span className="text-xs text-lavender-400">
                Showing {events.length} event{events.length === 1 ? "" : "s"}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-midnight-850/60 border border-white/5 space-y-3">
                <Calendar className="w-10 h-10 text-violet-light/40 mx-auto" />
                <h4 className="text-base font-bold text-white">No events match your criteria</h4>
                <p className="text-xs text-lavender-400 max-w-sm mx-auto">
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
                  Reset Filters
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
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* MODAL 1: Full Event Details */}
      <EventDetailsModal
        event={inspectEvent}
        onClose={() => setInspectEvent(null)}
        onRegister={(e) => {
          setInspectEvent(null);
          setRegisteringEvent(e);
        }}
        onToggleSave={handleToggleSave}
      />

      {/* MODAL 2: Dynamic Category-Specific Registration Form */}
      <DynamicRegistrationModal
        event={registeringEvent}
        profile={profile}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={handleRegistrationSuccess}
      />
    </div>
  );
}
