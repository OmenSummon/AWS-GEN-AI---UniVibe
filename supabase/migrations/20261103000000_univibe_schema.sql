-- UniVibe PostgreSQL Schema & Row Level Security (RLS) Policies
-- Migration: 20261103000000_univibe_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Student Profile)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    department TEXT NOT NULL,
    year TEXT NOT NULL,
    interests TEXT[] NOT NULL DEFAULT '{}',
    skills TEXT[] NOT NULL DEFAULT '{}',
    free_time TEXT NOT NULL,
    goal TEXT NOT NULL,
    tone TEXT NOT NULL DEFAULT 'Friendly',
    university_name TEXT DEFAULT 'University Campus',
    avatar_url TEXT,
    onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. AI Generated Profiles (Module A)
CREATE TABLE IF NOT EXISTS public.ai_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    archetype TEXT NOT NULL,
    archetype_description TEXT NOT NULL,
    ranked_interests JSONB NOT NULL DEFAULT '[]',
    hidden_strengths JSONB NOT NULL DEFAULT '[]',
    growth_opportunities JSONB NOT NULL DEFAULT '[]',
    engagement_style TEXT NOT NULL,
    technical_potential INT NOT NULL CHECK (technical_potential BETWEEN 0 AND 100),
    creativity INT NOT NULL CHECK (creativity BETWEEN 0 AND 100),
    leadership INT NOT NULL CHECK (leadership BETWEEN 0 AND 100),
    networking INT NOT NULL CHECK (networking BETWEEN 0 AND 100),
    innovation INT NOT NULL CHECK (innovation BETWEEN 0 AND 100),
    campus_engagement INT NOT NULL CHECK (campus_engagement BETWEEN 0 AND 100),
    level_up_mission JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Opportunity Recommendations (Module B)
CREATE TABLE IF NOT EXISTS public.opportunity_recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_name TEXT NOT NULL,
    category TEXT NOT NULL,
    match_score INT NOT NULL CHECK (match_score BETWEEN 0 AND 100),
    why_it_matches TEXT NOT NULL,
    skills_gained JSONB NOT NULL DEFAULT '[]',
    time_commitment TEXT NOT NULL,
    career_impact TEXT NOT NULL,
    first_action TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('VERIFIED', 'SUGGESTED')),
    is_best_match BOOLEAN NOT NULL DEFAULT FALSE,
    is_saved BOOLEAN NOT NULL DEFAULT FALSE,
    is_interested BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Saved Opportunities
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    recommendation_id UUID REFERENCES public.opportunity_recommendations(id) ON DELETE SET NULL,
    opportunity_name TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'applied', 'accepted', 'completed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Opportunity Gap Analyses (Module C)
CREATE TABLE IF NOT EXISTS public.opportunity_gap_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    blind_spots JSONB NOT NULL DEFAULT '[]',
    missing_skills JSONB NOT NULL DEFAULT '[]',
    cross_field_connections JSONB NOT NULL DEFAULT '[]',
    campus_fomo_risk TEXT NOT NULL,
    bold_ambitious_move JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Student Journeys & Milestones (Module D)
CREATE TABLE IF NOT EXISTS public.student_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    final_mission_challenge JSONB NOT NULL DEFAULT '{}',
    total_milestones INT NOT NULL DEFAULT 0,
    completed_milestones INT NOT NULL DEFAULT 0,
    progress_pct INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.journey_milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID NOT NULL REFERENCES public.student_journeys(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    phase TEXT NOT NULL,
    time_horizon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    deadline TEXT,
    sequence_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Outreach Generations (Module E)
CREATE TABLE IF NOT EXISTS public.outreach_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    opportunity_name TEXT NOT NULL,
    tone TEXT NOT NULL,
    professional_email JSONB NOT NULL,
    whatsapp_message TEXT NOT NULL,
    social_dm TEXT NOT NULL,
    followup_message TEXT NOT NULL,
    success_tips JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Event Marketing Generations (Module F)
CREATE TABLE IF NOT EXISTS public.event_marketing_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    category TEXT NOT NULL,
    audience TEXT NOT NULL,
    description TEXT NOT NULL,
    tagline TEXT NOT NULL,
    headline TEXT NOT NULL,
    one_liner TEXT NOT NULL,
    reasons_to_attend JSONB NOT NULL DEFAULT '[]',
    instagram_caption TEXT NOT NULL,
    whatsapp_announcement TEXT NOT NULL,
    hashtags JSONB NOT NULL DEFAULT '[]',
    professional_email JSONB NOT NULL,
    campus_notice TEXT NOT NULL,
    promotion_ideas JSONB NOT NULL DEFAULT '[]',
    participation_boosters JSONB NOT NULL DEFAULT '[]',
    campaign_idea TEXT NOT NULL,
    event_slogan TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Generated Posters (Module G)
CREATE TABLE IF NOT EXISTS public.generated_posters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_name TEXT NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT NOT NULL,
    prompt TEXT NOT NULL,
    model_used TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Campus Concierge Conversations & Messages (Module H)
CREATE TABLE IF NOT EXISTS public.concierge_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Campus Guidance',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.concierge_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.concierge_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    content TEXT NOT NULL,
    structured_response JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Campus Knowledge Base (Verified Campus Data)
CREATE TABLE IF NOT EXISTS public.campus_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university TEXT NOT NULL,
    department TEXT,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    eligibility TEXT NOT NULL,
    contact_info TEXT,
    verification_status TEXT NOT NULL CHECK (verification_status IN ('VERIFIED', 'SUGGESTED')),
    last_verified_date DATE NOT NULL DEFAULT CURRENT_DATE,
    source TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Events Table (Event Hub)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    poster_url TEXT NOT NULL,
    start_datetime TIMESTAMPTZ NOT NULL,
    end_datetime TIMESTAMPTZ NOT NULL,
    registration_deadline TIMESTAMPTZ NOT NULL,
    venue TEXT NOT NULL,
    event_mode TEXT NOT NULL DEFAULT 'Offline',
    participation_fee INT NOT NULL DEFAULT 0,
    capacity INT NOT NULL DEFAULT 100,
    registered_count INT NOT NULL DEFAULT 0,
    eligibility TEXT NOT NULL,
    event_rules JSONB NOT NULL DEFAULT '[]',
    required_materials JSONB NOT NULL DEFAULT '[]',
    contact_information TEXT,
    event_status TEXT NOT NULL DEFAULT 'Registration Open',
    verification_status TEXT NOT NULL DEFAULT 'DEMO',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Event Registrations Table
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registration_number TEXT NOT NULL UNIQUE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    registration_data JSONB NOT NULL DEFAULT '{}',
    registration_status TEXT NOT NULL DEFAULT 'Confirmed',
    consent_accepted BOOLEAN NOT NULL DEFAULT TRUE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    cancellation_allowed BOOLEAN NOT NULL DEFAULT TRUE,
    cancellation_deadline TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    UNIQUE(student_id, event_id)
);

-- 14. Saved Events Table
CREATE TABLE IF NOT EXISTS public.saved_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, event_id)
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_gap_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated students can view events" 
    ON public.events FOR SELECT 
    TO authenticated 
    USING (true);

CREATE POLICY "Students can manage their own event registrations" 
    ON public.event_registrations FOR ALL 
    USING (auth.uid() = student_id);

CREATE POLICY "Students can manage their saved events" 
    ON public.saved_events FOR ALL 
    USING (auth.uid() = student_id);
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_marketing_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_posters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campus_knowledge ENABLE ROW LEVEL SECURITY;

-- POLICIES: Students can ONLY access their own records
CREATE POLICY "Users can view and update their own profile" 
    ON public.profiles FOR ALL 
    USING (auth.uid() = id);

CREATE POLICY "Users can manage their AI profile" 
    ON public.ai_profiles FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their opportunity recommendations" 
    ON public.opportunity_recommendations FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their saved opportunities" 
    ON public.saved_opportunities FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their gap analyses" 
    ON public.opportunity_gap_analyses FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their journeys" 
    ON public.student_journeys FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their milestones" 
    ON public.journey_milestones FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their outreach generations" 
    ON public.outreach_generations FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their marketing generations" 
    ON public.event_marketing_generations FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their posters" 
    ON public.generated_posters FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their concierge conversations" 
    ON public.concierge_conversations FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their concierge messages" 
    ON public.concierge_messages FOR ALL 
    USING (auth.uid() = user_id);

CREATE POLICY "All authenticated users can read campus knowledge" 
    ON public.campus_knowledge FOR SELECT 
    TO authenticated 
    USING (true);

