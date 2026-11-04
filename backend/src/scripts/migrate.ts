import dotenv from "dotenv";
import { getSql, isDbConfigured } from "../config/db.js";

dotenv.config();

export async function runMigrations() {
  if (!isDbConfigured()) {
    console.error("❌ Cannot run migrations: DATABASE_URL is not configured in backend/.env");
    process.exit(1);
  }

  const sql = getSql();
  console.log("🚀 Starting Neon DB table migrations...");

  try {
    // 1. Profiles (Students)
    await sql`
      CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY,
        student_name TEXT NOT NULL,
        department TEXT NOT NULL,
        year TEXT NOT NULL,
        interests TEXT[] NOT NULL DEFAULT '{}',
        skills TEXT[] NOT NULL DEFAULT '{}',
        free_time TEXT NOT NULL,
        goal TEXT NOT NULL,
        tone TEXT NOT NULL DEFAULT 'Friendly',
        university_name TEXT DEFAULT 'State Innovation University',
        avatar_url TEXT,
        onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'profiles' verified.");

    // 2. AI Generated Profiles
    await sql`
      CREATE TABLE IF NOT EXISTS ai_profiles (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        archetype TEXT NOT NULL,
        archetype_tagline TEXT,
        archetype_description TEXT NOT NULL,
        ranked_interests JSONB NOT NULL DEFAULT '[]',
        hidden_strengths JSONB NOT NULL DEFAULT '[]',
        growth_opportunities JSONB NOT NULL DEFAULT '[]',
        engagement_style TEXT NOT NULL,
        technical_potential INT NOT NULL,
        creativity INT NOT NULL,
        leadership INT NOT NULL,
        networking INT NOT NULL,
        innovation INT NOT NULL,
        campus_engagement INT NOT NULL,
        score_explanations JSONB NOT NULL DEFAULT '[]',
        level_up_mission JSONB NOT NULL DEFAULT '{}',
        ai_tendencies_disclaimer TEXT,
        status TEXT NOT NULL DEFAULT 'completed',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'ai_profiles' verified.");

    // 3. Opportunity Recommendations
    await sql`
      CREATE TABLE IF NOT EXISTS opportunity_recommendations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        opportunity_name TEXT NOT NULL,
        category TEXT NOT NULL,
        match_score INT NOT NULL,
        why_it_matches TEXT NOT NULL,
        skills_gained JSONB NOT NULL DEFAULT '[]',
        time_commitment TEXT NOT NULL,
        career_impact TEXT NOT NULL,
        first_action TEXT NOT NULL,
        eligibility TEXT NOT NULL,
        verification_status TEXT NOT NULL,
        verification_details TEXT,
        is_best_match BOOLEAN NOT NULL DEFAULT FALSE,
        is_saved BOOLEAN NOT NULL DEFAULT FALSE,
        is_interested BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'opportunity_recommendations' verified.");

    // 4. Opportunity Gap Analyses
    await sql`
      CREATE TABLE IF NOT EXISTS opportunity_gap_analyses (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        blind_spots JSONB NOT NULL DEFAULT '[]',
        missing_skills JSONB NOT NULL DEFAULT '[]',
        cross_field_connections JSONB NOT NULL DEFAULT '[]',
        campus_fomo_risk JSONB NOT NULL DEFAULT '{}',
        bold_ambitious_move JSONB NOT NULL DEFAULT '{}',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'opportunity_gap_analyses' verified.");

    // 5. Student Journeys
    await sql`
      CREATE TABLE IF NOT EXISTS student_journeys (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        phases JSONB NOT NULL DEFAULT '[]',
        final_mission_challenge JSONB NOT NULL DEFAULT '{}',
        total_milestones INT NOT NULL DEFAULT 0,
        completed_milestones INT NOT NULL DEFAULT 0,
        progress_pct INT NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'student_journeys' verified.");

    // 6. Outreach Generations
    await sql`
      CREATE TABLE IF NOT EXISTS outreach_generations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        opportunity_name TEXT NOT NULL,
        tone TEXT NOT NULL,
        professional_email JSONB NOT NULL,
        whatsapp_message TEXT NOT NULL,
        social_dm TEXT NOT NULL,
        followup_message TEXT NOT NULL,
        success_tips JSONB NOT NULL DEFAULT '[]',
        grounding_note TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'outreach_generations' verified.");

    // 7. Event Marketing Generations
    await sql`
      CREATE TABLE IF NOT EXISTS event_marketing_generations (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        event_name TEXT NOT NULL,
        category TEXT NOT NULL,
        audience TEXT NOT NULL,
        description TEXT NOT NULL,
        identity JSONB NOT NULL,
        social_media JSONB NOT NULL,
        formal_communication JSONB NOT NULL,
        engagement_strategy JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'event_marketing_generations' verified.");

    // 8. Generated Posters
    await sql`
      CREATE TABLE IF NOT EXISTS generated_posters (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        event_name TEXT NOT NULL,
        category TEXT NOT NULL,
        image_url TEXT NOT NULL,
        aspect_ratio TEXT NOT NULL DEFAULT '4:5',
        prompt TEXT NOT NULL,
        model_used TEXT NOT NULL,
        is_demo_mode BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'generated_posters' verified.");

    // 9. Concierge Messages
    await sql`
      CREATE TABLE IF NOT EXISTS concierge_messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        sender TEXT NOT NULL,
        content TEXT NOT NULL,
        structured_response JSONB,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'concierge_messages' verified.");

    // 10. Events
    await sql`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
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
    `;
    console.log("  ✔ Table 'events' verified.");

    // 11. Event Registrations
    await sql`
      CREATE TABLE IF NOT EXISTS event_registrations (
        id TEXT PRIMARY KEY,
        registration_number TEXT NOT NULL UNIQUE,
        student_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
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
    `;
    console.log("  ✔ Table 'event_registrations' verified.");

    // 12. Saved Events
    await sql`
      CREATE TABLE IF NOT EXISTS saved_events (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(student_id, event_id)
      );
    `;
    console.log("  ✔ Table 'saved_events' verified.");

    // 13. Organizer Profiles
    await sql`
      CREATE TABLE IF NOT EXISTS organizer_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        organization_name TEXT NOT NULL,
        department TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        role_title TEXT NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'organizer_profiles' verified.");

    // 14. Organizer Events
    await sql`
      CREATE TABLE IF NOT EXISTS organizer_events (
        id TEXT PRIMARY KEY,
        organizer_id TEXT NOT NULL,
        basics JSONB NOT NULL DEFAULT '{}',
        audience JSONB NOT NULL DEFAULT '{}',
        timeline JSONB NOT NULL DEFAULT '{}',
        logistics JSONB NOT NULL DEFAULT '{}',
        objectives JSONB NOT NULL DEFAULT '{}',
        registration JSONB NOT NULL DEFAULT '{}',
        section_ai_outputs JSONB NOT NULL DEFAULT '{}',
        final_report JSONB,
        status TEXT NOT NULL DEFAULT 'Draft',
        current_wizard_section INT NOT NULL DEFAULT 1,
        public_event_id TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `;
    console.log("  ✔ Table 'organizer_events' verified.");

    console.log("\n🎉 All 14 tables successfully created/verified in Neon DB!");
  } catch (error: any) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

if (process.argv[1]?.endsWith("migrate.ts")) {
  runMigrations();
}

