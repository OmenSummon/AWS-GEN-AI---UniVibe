import { neon, Pool } from "@neondatabase/serverless";

// Check if Neon DB URL is provided
export const isNeonConfigured = (): boolean => {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres"));
};

export function getNeonSql() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || !dbUrl.startsWith("postgres")) {
    return null;
  }
  try {
    return neon(dbUrl);
  } catch (error) {
    console.error("Neon DB connection error:", error);
    return null;
  }
}

// In-memory fallback repository when DATABASE_URL is not provided (Demo Mode)
const memoryStore = {
  profiles: new Map<string, any>(),
  aiProfiles: new Map<string, any>(),
  opportunities: new Map<string, any[]>(),
  savedOpportunities: new Map<string, any[]>(),
  gapAnalyses: new Map<string, any>(),
  journeys: new Map<string, any>(),
  milestones: new Map<string, any[]>(),
  outreach: new Map<string, any[]>(),
  marketing: new Map<string, any[]>(),
  posters: new Map<string, any[]>(),
  conciergeMessages: new Map<string, any[]>(),
  events: new Map<string, any>(),
  eventRegistrations: new Map<string, any[]>(),
  savedEvents: new Map<string, Set<string>>(),
  organizerProfiles: new Map<string, any>(),
  organizerEvents: new Map<string, any>(),
};

// Auto-seed default demo student & organizer
const defaultDemoId = "demo-student-001";
const defaultOrganizerId = "demo-organizer-001";

memoryStore.organizerProfiles.set(defaultOrganizerId, {
  id: defaultOrganizerId,
  name: "Aarav Roy",
  organization_name: "JIS Tech Club & Student Council",
  department: "Department of Computer Science & Engineering, JIS University",
  email: "student.organizer@jisuniversity.ac.in",
  phone: "+91 98301 23456",
  role_title: "Lead Student Organizer & Tech Convener",
  avatar_url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});
memoryStore.profiles.set(defaultDemoId, {
  id: defaultDemoId,
  student_name: "Alex Roy",
  department: "B.Tech Computer Science & Engineering",
  year: "3rd Year",
  interests: ["Artificial Intelligence", "Generative Systems", "Campus Tech", "Design Systems"],
  skills: ["Python", "TypeScript", "React", "AWS Bedrock", "UI/UX Design"],
  free_time: "6 hours per week, mostly weekday evenings",
  goal: "Build an AI-powered campus startup and secure a machine learning fellowship at JIS University",
  tone: "Confident",
  university_name: "JIS University",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  onboarding_completed: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

// Seed realistic demo campus events
const initialDemoEvents = [
  {
    id: "evt-01",
    name: "JIS Cloud AI Hackathon 2026",
    slug: "jis-cloud-ai-hackathon-2026",
    category: "Hackathons",
    description: "A flagship inter-college hackathon building generative AI applications using AWS Bedrock and Neon Serverless DB.",
    poster_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-28T09:00:00Z",
    end_datetime: "2026-11-29T21:00:00Z",
    registration_deadline: "2026-11-24T23:59:59Z",
    venue: "Auditorium Hall B, Tech Building, JIS University",
    event_mode: "Offline",
    participation_fee: 0,
    capacity: 150,
    registered_count: 84,
    eligibility: "Open to all enrolled undergraduate students. Teams of 2 to 4.",
    event_rules: [
      "All code and prototypes must be developed during the hackathon period.",
      "Open-source libraries and APIs are permitted; pre-built full applications are prohibited.",
      "Each team must submit a public GitHub repository and give a live 3-minute demo."
    ],
    required_materials: ["Personal laptop and charger", "Student ID card"],
    contact_information: "jis.hackathon@jisuniversity.ac.in • JIS Tech Club",
    event_status: "Registration Open",
    verification_status: "VERIFIED",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Seed to in-memory store
initialDemoEvents.forEach((evt) => {
  memoryStore.events.set(evt.id, evt);
});

// Pre-seed realistic JIS University student team and individual registrations
const initialDemoRegistration = {
  id: "reg-demo-001",
  registration_number: "JIS-2026-00101",
  student_id: defaultDemoId,
  event_id: "evt-01",
  event: initialDemoEvents[0],
  registration_data: {
    full_name: "Alex Roy",
    email: "alex.roy@jisuniversity.ac.in",
    university: "JIS University",
    department: "B.Tech Computer Science & Engineering",
    year: "3rd Year",
    phone: "+91 98311 55678",
    student_id_num: "JIS/2023/CSE/042",
    registration_type: "Team",
    team_name: "ByteCrafters JIS",
    team_size: "4",
    team_leader: "Alex Roy",
    teammates: "Sourav Das (CSE 3rd Yr), Riya Sen (AI-ML 3rd Yr), Ankit Ghosh (CSE 3rd Yr)",
    tech_skills: "Python, Next.js, AWS Bedrock, TypeScript, PostgreSQL",
    problem_statement: "AI-Powered JIS Campus Intelligence & Smart Lab Allocation",
    github_profile: "https://github.com/bytecrafters-jis",
    experience: "Winners of Bengal Smart Campus Hackathon 2025"
  },
  registration_status: "Confirmed",
  check_in_status: "Checked In",
  consent_accepted: true,
  submitted_at: "2026-11-01T14:20:00Z",
  updated_at: "2026-11-01T14:20:00Z",
  cancellation_allowed: true,
  cancellation_deadline: "2026-11-18T23:59:59Z"
};

const demoTeamRegistration2 = {
  id: "reg-demo-002",
  registration_number: "JIS-2026-00102",
  student_id: "demo-student-002",
  event_id: "evt-01",
  event: initialDemoEvents[0],
  registration_data: {
    full_name: "Sneha Mukherjee",
    email: "sneha.m@jisuniversity.ac.in",
    university: "JIS University",
    department: "B.Tech AI & Machine Learning",
    year: "2nd Year",
    phone: "+91 98322 44321",
    student_id_num: "JIS/2024/AIML/018",
    registration_type: "Team",
    team_name: "NeuralKnights",
    team_size: "3",
    team_leader: "Sneha Mukherjee",
    teammates: "Rohan Paul (BCA 2nd Yr), Debasish Kar (CSE 2nd Yr)",
    tech_skills: "PyTorch, FastAPI, React, Bedrock Agents",
    problem_statement: "Autonomous Campus Grievance & Hostel Helpdesk Bot",
    github_profile: "https://github.com/neuralknights-jis",
    experience: "Top 5 Finalist in Kolkata Youth Tech Summit"
  },
  registration_status: "Confirmed",
  check_in_status: "Confirmed",
  consent_accepted: true,
  submitted_at: "2026-11-02T10:15:00Z",
  updated_at: "2026-11-02T10:15:00Z"
};

const demoTeamRegistration3 = {
  id: "reg-demo-003",
  registration_number: "JIS-2026-00103",
  student_id: "demo-student-003",
  event_id: "evt-01",
  event: initialDemoEvents[0],
  registration_data: {
    full_name: "Subhajit Dutta",
    email: "subhajit.d@jisuniversity.ac.in",
    university: "JIS University",
    department: "B.Tech Information Technology",
    year: "3rd Year",
    phone: "+91 98333 99887",
    student_id_num: "JIS/2023/IT/029",
    registration_type: "Team",
    team_name: "CyberPulse JIS",
    team_size: "3",
    team_leader: "Subhajit Dutta",
    teammates: "Payel Chakraborty (IT 3rd Yr), Arindam Banik (ECE 3rd Yr)",
    tech_skills: "Node.js, Docker, Network Security, Python",
    problem_statement: "Zero-Trust Campus Wi-Fi Security & Anomaly Monitor",
    github_profile: "https://github.com/cyberpulse-jis",
    experience: "Certified in Ethical Hacking & Cloud Fundamentals"
  },
  registration_status: "Confirmed",
  check_in_status: "Confirmed",
  consent_accepted: true,
  submitted_at: "2026-11-02T16:45:00Z",
  updated_at: "2026-11-02T16:45:00Z"
};

const demoIndividualReg1 = {
  id: "reg-demo-004",
  registration_number: "JIS-2026-00201",
  student_id: "demo-student-004",
  event_id: "evt-02",
  event: initialDemoEvents[0],
  registration_data: {
    full_name: "Priya Sharma",
    email: "priya.sharma@jisuniversity.ac.in",
    university: "JIS University",
    department: "BCA (Bachelor of Computer Applications)",
    year: "2nd Year",
    phone: "+91 98745 12340",
    student_id_num: "JIS/2024/BCA/088",
    registration_type: "Individual",
    experience_level: "Intermediate Python, Web Fundamentals",
    topics_of_interest: "Generative AI, Large Language Models on Cloud"
  },
  registration_status: "Confirmed",
  check_in_status: "Checked In",
  consent_accepted: true,
  submitted_at: "2026-11-03T09:30:00Z",
  updated_at: "2026-11-03T09:30:00Z"
};

const demoIndividualReg2 = {
  id: "reg-demo-005",
  registration_number: "JIS-2026-00202",
  student_id: "demo-student-005",
  event_id: "evt-02",
  event: initialDemoEvents[0],
  registration_data: {
    full_name: "Debjit Mondal",
    email: "debjit.mondal@jisuniversity.ac.in",
    university: "JIS University",
    department: "B.Tech Computer Science & Engineering",
    year: "4th Year",
    phone: "+91 98765 67890",
    student_id_num: "JIS/2022/CSE/104",
    registration_type: "Individual",
    experience_level: "Advanced Full-Stack Developer",
    topics_of_interest: "Deploying Bedrock RAG on Production"
  },
  registration_status: "Confirmed",
  check_in_status: "Confirmed",
  consent_accepted: true,
  submitted_at: "2026-11-03T11:10:00Z",
  updated_at: "2026-11-03T11:10:00Z"
};

const demoIndividualReg3 = {
  id: "reg-demo-006",
  registration_number: "JIS-2026-00301",
  student_id: "demo-student-006",
  event_id: "evt-03",
  event: initialDemoEvents[0],
  registration_data: {
    full_name: "Ananya Banerjee",
    email: "ananya.banerjee@jisuniversity.ac.in",
    university: "JIS University",
    department: "B.Sc Data Science",
    year: "1st Year",
    phone: "+91 98711 22334",
    student_id_num: "JIS/2025/DS/012",
    registration_type: "Individual",
    activity_preference: "Stage Drama & Recitation Performer"
  },
  registration_status: "Confirmed",
  check_in_status: "Confirmed",
  consent_accepted: true,
  submitted_at: "2026-11-03T13:00:00Z",
  updated_at: "2026-11-03T13:00:00Z"
};

memoryStore.eventRegistrations.set(defaultDemoId, [initialDemoRegistration]);
memoryStore.eventRegistrations.set("demo-student-002", [demoTeamRegistration2]);
memoryStore.eventRegistrations.set("demo-student-003", [demoTeamRegistration3]);
memoryStore.eventRegistrations.set("demo-student-004", [demoIndividualReg1]);
memoryStore.eventRegistrations.set("demo-student-005", [demoIndividualReg2]);
memoryStore.eventRegistrations.set("demo-student-006", [demoIndividualReg3]);

const initialSaved = new Set<string>();
initialSaved.add("evt-01");
// initialSaved
memoryStore.savedEvents.set(defaultDemoId, initialSaved);

// Seed Organizer Events for Dr. Evelyn Vance
const initialOrganizerEvents = [
  {
    id: "org-evt-101",
    organizer_id: defaultOrganizerId,
    status: "In Planning",
    current_wizard_section: 4,
    basics: {
      event_name: "National AI Agent Hackathon 2026",
      event_description: "A flagship 48-hour inter-university competition where student teams architect and deploy autonomous AI agents with cloud databases.",
      event_category: "Hackathon",
      event_organizer: "University Innovation & Tech Council",
      event_format: "Hybrid",
    },
    audience: {
      expected_participants: 250,
      target_audience: "Undergraduate and postgraduate students in CS, Data Science, and Design",
      participation_type: "Team-Based",
      geographical_reach: "National-Level",
    },
    timeline: {
      proposed_event_date: "2026-12-10",
      event_duration: "48 Hours",
      preparation_start_date: "2026-11-10",
      registration_deadline: "2026-12-05",
      date_flexibility: "Fixed",
    },
    logistics: {
      budget_financial_availability: "$6,500 approved departmental budget + cloud computing credits",
      financial_constraints_expectations: "Catering, merchandise, and server infrastructure capped at $5,000",
      venue_location_details: "CS Tech Wing Grand Labs 1-4 + Online Discord Stage",
      infrastructure_equipment_availability: "Dedicated high-bandwidth fiber Wi-Fi, dual power redundancy, 4K projector",
      team_composition_manpower: "8 student council marshals, 4 technical mentors, 3 faculty judges",
      external_support_assistance: "AWS Developer Relations mentorship sponsorship confirmed",
    },
    objectives: {
      primary_event_objective: "Foster real-world autonomous AI systems development among 250+ student participants.",
      secondary_objectives: "Provide direct recruitment fast-tracks to partner tech incubators.",
      event_theme: "Autonomous Agents for Campus Life",
      expected_outcomes: "Over 50 shippable repositories with verifiable CI/CD workflows.",
      key_deliverables: "Working prototype demo, technical pitch deck, and architecture documentation.",
      success_criteria: ">85% team retention rate across the 48-hour sprint.",
      institutional_alignment: "Aligns with University 2026 AI Innovation Initiative.",
      social_educational_impact: "Open-sourcing all winning solutions for public campus benefit.",
    },
    registration: {
      registration_method: "UniVibe Registration",
      registration_window: "Nov 10 – Dec 05",
      participant_eligibility: "Active enrolled university students with valid student ID.",
      eligibility_restrictions: "Max 4 members per team.",
      participation_mode: "Team",
      team_size_range: "2–4 members",
      registration_fee: "0",
      selection_process: "Screening",
      max_registration_capacity: 300,
      waitlist_availability: "Yes",
      certificate_document_requirements: "Digital verified UniVibe completion certificates.",
    },
    section_ai_outputs: {
      summarized_event_details: "National AI Agent Hackathon 2026 is a 48-hour hybrid technical hackathon organized by the University Innovation & Tech Council. The initiative focuses on hands-on deployment of autonomous AI systems.",
      audience_summarization: "Targeting 250+ undergraduate and postgraduate technical builders across an Inter-College footprint utilizing a team-based registration model.",
      date_finalization: {
        analysis: "Timeline provides a healthy 25-day preparation sprint and 5-day verification buffer before event launch.",
        flags: [],
        recommendations: "Lock final server credentials 48 hours prior to start.",
      },
      other_information_summarization: {
        budget_summary: "Allocated Budget: $6,500 total capital including cloud subsidies.",
        financial_constraints: "Strict $5,000 ceiling on operational logistics.",
        venue_logistics: "CS Tech Wing Labs 1-4 reserved with departmental priority.",
        infrastructure: "High-bandwidth redundant connectivity confirmed.",
        manpower: "15 core staff and mentors committed.",
        external_support: "Cloud provider sponsorship confirmed.",
      },
    },
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "org-evt-102",
    organizer_id: defaultOrganizerId,
    status: "Pending Review",
    current_wizard_section: 6,
    basics: {
      event_name: "Quantum Computing & Cloud Symposium",
      event_description: "Academic conference presenting faculty and student research papers on quantum gate simulations and distributed systems.",
      event_category: "Conference",
      event_organizer: "Department of Computer Science & Engineering",
      event_format: "Hybrid",
    },
    audience: {
      expected_participants: 120,
      target_audience: "Researchers, graduate scholars, and industry professionals",
      participation_type: "Individual",
      geographical_reach: "State-Level",
    },
    timeline: {
      proposed_event_date: "2026-12-18",
      event_duration: "1 Day (9:00 AM - 5:00 PM)",
      preparation_start_date: "2026-11-01",
      registration_deadline: "2026-12-14",
      date_flexibility: "Fixed",
    },
    logistics: {
      budget_financial_availability: "$3,000 faculty grant",
      financial_constraints_expectations: "Auditorium booking fee waived by Dean's office",
      venue_location_details: "University Main Auditorium",
      infrastructure_equipment_availability: "Live streaming broadcast equipment and wireless mics",
      team_composition_manpower: "4 research scholars + 2 faculty chairs",
      external_support_assistance: "Regional IEEE chapter technical co-sponsorship",
    },
    objectives: {
      primary_event_objective: "Showcase breakthrough student papers in quantum algorithms.",
      expected_outcomes: "12 peer-reviewed presentations and keynote by visiting scientist.",
      key_deliverables: "Conference proceedings publication.",
      success_criteria: "100+ active attendees across sessions.",
    },
    registration: {
      registration_method: "UniVibe Registration",
      registration_window: "Nov 05 – Dec 14",
      participant_eligibility: "Open to students, researchers, and faculty.",
      participation_mode: "Individual",
      registration_fee: "0",
      selection_process: "First Come, First Served",
      max_registration_capacity: 150,
      waitlist_availability: "Yes",
    },
    section_ai_outputs: {},
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "org-evt-103",
    organizer_id: defaultOrganizerId,
    status: "Published",
    current_wizard_section: 6,
    basics: {
      event_name: "Autonomous Robotics Demo Day",
      event_description: "Live arena demonstrations of student-built autonomous rovers, quadcopters, and micro-robotics navigational algorithms.",
      event_category: "Technical Fest",
      event_organizer: "Robotics & Hardware Guild",
      event_format: "Offline",
    },
    audience: {
      expected_participants: 180,
      target_audience: "All campus students and tech enthusiasts",
      participation_type: "Open Registration",
      geographical_reach: "University-Level",
    },
    timeline: {
      proposed_event_date: "2026-11-29",
      event_duration: "6 Hours",
      preparation_start_date: "2026-10-15",
      registration_deadline: "2026-11-27",
      date_flexibility: "Fixed",
    },
    logistics: {
      budget_financial_availability: "$1,800 guild budget",
      financial_constraints_expectations: "Safety netting and floor arena barriers prioritized",
      venue_location_details: "Indoor Sports Gymnasium Floor",
      infrastructure_equipment_availability: "Arena safety netting, test tracks, battery charging stations",
      team_composition_manpower: "10 student marshals and safety officers",
      external_support_assistance: "Faculty advisor supervision confirmed",
    },
    objectives: {
      primary_event_objective: "Validate autonomous navigation algorithms in live physical environments.",
      expected_outcomes: "20 rover obstacle course completions.",
      key_deliverables: "Public speed and obstacle benchmarks.",
      success_criteria: "Zero safety incidents and high student engagement.",
    },
    registration: {
      registration_method: "UniVibe Registration",
      registration_window: "Oct 20 – Nov 27",
      participant_eligibility: "Open to all enrolled students.",
      participation_mode: "Both",
      registration_fee: "0",
      selection_process: "No Selection Process",
      max_registration_capacity: 200,
      waitlist_availability: "No",
    },
    section_ai_outputs: {},
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

initialOrganizerEvents.forEach((evt) => {
  memoryStore.organizerEvents.set(evt.id, evt);
});


export async function initNeonTables() {
  const sql = getNeonSql();
  if (!sql) return { success: false, mode: "in-memory-fallback" };

  try {
    // Create base tables if they do not exist
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

    // Event Hub Tables
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

    await sql`
      CREATE TABLE IF NOT EXISTS saved_events (
        id TEXT PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(student_id, event_id)
      );
    `;

    return { success: true, mode: "neon-serverless" };
  } catch (error) {
    console.error("Neon DB table initialization error:", error);
    return { success: false, mode: "in-memory-fallback", error };
  }
}

// Neon Database / Memory Store Unified Data Access Object (DAO)
export const db = {
  // Profiles
  async getProfile(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM profiles WHERE id = ${userId} LIMIT 1;`;
        return rows[0] || null;
      } catch (e) {
        console.error("Error fetching profile from Neon:", e);
      }
    }
    return memoryStore.profiles.get(userId) || memoryStore.profiles.get(defaultDemoId) || null;
  },

  async saveProfile(profile: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO profiles (
            id, student_name, department, year, interests, skills, free_time, goal, tone, university_name, avatar_url, onboarding_completed, updated_at
          ) VALUES (
            ${profile.id}, ${profile.student_name}, ${profile.department}, ${profile.year}, 
            ${profile.interests}, ${profile.skills}, ${profile.free_time}, ${profile.goal}, 
            ${profile.tone}, ${profile.university_name || 'State Innovation University'}, 
            ${profile.avatar_url || null}, ${profile.onboarding_completed}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            student_name = EXCLUDED.student_name,
            department = EXCLUDED.department,
            year = EXCLUDED.year,
            interests = EXCLUDED.interests,
            skills = EXCLUDED.skills,
            free_time = EXCLUDED.free_time,
            goal = EXCLUDED.goal,
            tone = EXCLUDED.tone,
            university_name = EXCLUDED.university_name,
            avatar_url = EXCLUDED.avatar_url,
            onboarding_completed = EXCLUDED.onboarding_completed,
            updated_at = NOW();
        `;
      } catch (e) {
        console.error("Error writing profile to Neon:", e);
      }
    }
    memoryStore.profiles.set(profile.id, { ...profile, updated_at: new Date().toISOString() });
    return profile;
  },

  // AI Profile
  async getAiProfile(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM ai_profiles WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1;`;
        if (rows[0]) {
          const r = rows[0];
          const safeParse = (v, def) => {
            if (!v) return def;
            if (typeof v === 'string') {
              try { return JSON.parse(v); } catch (e) { return def; }
            }
            return v;
          };
          return {
            ...r,
            scores: {
              technical_potential: r.technical_potential ?? 85,
              creativity: r.creativity ?? 80,
              leadership: r.leadership ?? 75,
              networking: r.networking ?? 70,
              innovation: r.innovation ?? 88,
              campus_engagement: r.campus_engagement ?? 72,
            },
            ranked_interests: safeParse(r.ranked_interests, []),
            hidden_strengths: safeParse(r.hidden_strengths, []),
            growth_opportunities: safeParse(r.growth_opportunities, []),
            score_explanations: safeParse(r.score_explanations, []),
            level_up_mission: safeParse(r.level_up_mission, {}),
          };
        }
      } catch (e) {
        console.error("Error fetching AI profile from Neon:", e);
      }
    }
    return memoryStore.aiProfiles.get(userId) || null;
  },

  async saveAiProfile(aiProfile: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO ai_profiles (
            id, user_id, archetype, archetype_tagline, archetype_description, 
            ranked_interests, hidden_strengths, growth_opportunities, engagement_style,
            technical_potential, creativity, leadership, networking, innovation, campus_engagement,
            score_explanations, level_up_mission, ai_tendencies_disclaimer, status, updated_at
          ) VALUES (
            ${aiProfile.id}, ${aiProfile.user_id}, ${aiProfile.archetype}, ${aiProfile.archetype_tagline}, 
            ${aiProfile.archetype_description}, ${JSON.stringify(aiProfile.ranked_interests)}, 
            ${JSON.stringify(aiProfile.hidden_strengths)}, ${JSON.stringify(aiProfile.growth_opportunities)}, 
            ${aiProfile.engagement_style}, ${aiProfile.scores.technical_potential}, 
            ${aiProfile.scores.creativity}, ${aiProfile.scores.leadership}, 
            ${aiProfile.scores.networking}, ${aiProfile.scores.innovation}, 
            ${aiProfile.scores.campus_engagement}, ${JSON.stringify(aiProfile.score_explanations)}, 
            ${JSON.stringify(aiProfile.level_up_mission)}, ${aiProfile.ai_tendencies_disclaimer}, 
            ${aiProfile.status}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            archetype = EXCLUDED.archetype,
            archetype_tagline = EXCLUDED.archetype_tagline,
            archetype_description = EXCLUDED.archetype_description,
            ranked_interests = EXCLUDED.ranked_interests,
            hidden_strengths = EXCLUDED.hidden_strengths,
            growth_opportunities = EXCLUDED.growth_opportunities,
            engagement_style = EXCLUDED.engagement_style,
            technical_potential = EXCLUDED.technical_potential,
            creativity = EXCLUDED.creativity,
            leadership = EXCLUDED.leadership,
            networking = EXCLUDED.networking,
            innovation = EXCLUDED.innovation,
            campus_engagement = EXCLUDED.campus_engagement,
            score_explanations = EXCLUDED.score_explanations,
            level_up_mission = EXCLUDED.level_up_mission,
            status = EXCLUDED.status,
            updated_at = NOW();
        `;
      } catch (e) {
        console.error("Error saving AI profile to Neon:", e);
      }
    }
    memoryStore.aiProfiles.set(aiProfile.user_id, aiProfile);
    return aiProfile;
  },

  // Match AI
  async getMatches(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM opportunity_recommendations WHERE user_id = ${userId} ORDER BY match_score DESC;`;
        if (rows.length > 0) return rows;
      } catch (e) {
        console.error("Error fetching matches from Neon:", e);
      }
    }
    return memoryStore.opportunities.get(userId) || null;
  },

  async saveMatches(userId: string, recommendations: any[]) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`DELETE FROM opportunity_recommendations WHERE user_id = ${userId};`;
        for (const r of recommendations) {
          await sql`
            INSERT INTO opportunity_recommendations (
              id, user_id, opportunity_name, category, match_score, why_it_matches, 
              skills_gained, time_commitment, career_impact, first_action, eligibility, 
              verification_status, verification_details, is_best_match, is_saved, is_interested
            ) VALUES (
              ${r.id}, ${userId}, ${r.opportunity_name}, ${r.category}, ${r.match_score}, 
              ${r.why_it_matches}, ${JSON.stringify(r.skills_gained)}, ${r.time_commitment}, 
              ${r.career_impact}, ${r.first_action}, ${r.eligibility}, ${r.verification_status}, 
              ${r.verification_details || null}, ${r.is_best_match || false}, ${r.is_saved || false}, ${r.is_interested || false}
            )
            ON CONFLICT (id) DO UPDATE SET
              is_saved = EXCLUDED.is_saved,
              is_interested = EXCLUDED.is_interested;
          `;
        }
      } catch (e) {
        console.error("Error saving matches to Neon:", e);
      }
    }
    memoryStore.opportunities.set(userId, recommendations);
    return recommendations;
  },

  // Gap Analysis
  async getGapAnalysis(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM opportunity_gap_analyses WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1;`;
        if (rows[0]) return rows[0];
      } catch (e) {
        console.error("Error fetching gap analysis from Neon:", e);
      }
    }
    return memoryStore.gapAnalyses.get(userId) || null;
  },

  async saveGapAnalysis(analysis: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO opportunity_gap_analyses (
            id, user_id, blind_spots, missing_skills, cross_field_connections, campus_fomo_risk, bold_ambitious_move
          ) VALUES (
            ${analysis.id}, ${analysis.user_id}, ${JSON.stringify(analysis.blind_spots)}, 
            ${JSON.stringify(analysis.missing_skills)}, ${JSON.stringify(analysis.cross_field_connections)}, 
            ${JSON.stringify(analysis.campus_fomo_risk)}, ${JSON.stringify(analysis.bold_ambitious_move)}
          );
        `;
      } catch (e) {
        console.error("Error saving gap analysis to Neon:", e);
      }
    }
    memoryStore.gapAnalyses.set(analysis.user_id, analysis);
    return analysis;
  },

  // Journey
  async getJourney(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM student_journeys WHERE user_id = ${userId} ORDER BY created_at DESC LIMIT 1;`;
        if (rows[0]) return rows[0];
      } catch (e) {
        console.error("Error fetching journey from Neon:", e);
      }
    }
    return memoryStore.journeys.get(userId) || null;
  },

  async saveJourney(journey: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO student_journeys (
            id, user_id, title, phases, final_mission_challenge, total_milestones, completed_milestones, progress_pct, updated_at
          ) VALUES (
            ${journey.id}, ${journey.user_id}, ${journey.title}, ${JSON.stringify(journey.phases)}, 
            ${JSON.stringify(journey.final_mission_challenge)}, ${journey.total_milestones}, 
            ${journey.completed_milestones}, ${journey.progress_pct}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            phases = EXCLUDED.phases,
            completed_milestones = EXCLUDED.completed_milestones,
            progress_pct = EXCLUDED.progress_pct,
            updated_at = NOW();
        `;
      } catch (e) {
        console.error("Error saving journey to Neon:", e);
      }
    }
    memoryStore.journeys.set(journey.user_id, journey);
    return journey;
  },

  // Outreach
  async getOutreachHistory(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM outreach_generations WHERE user_id = ${userId} ORDER BY created_at DESC;`;
        return rows;
      } catch (e) {
        console.error("Error fetching outreach from Neon:", e);
      }
    }
    return memoryStore.outreach.get(userId) || [];
  },

  async saveOutreach(outreach: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO outreach_generations (
            id, user_id, opportunity_name, tone, professional_email, whatsapp_message, social_dm, followup_message, success_tips, grounding_note
          ) VALUES (
            ${outreach.id}, ${outreach.user_id}, ${outreach.opportunity_name}, ${outreach.tone}, 
            ${JSON.stringify(outreach.professional_email)}, ${outreach.whatsapp_message}, 
            ${outreach.social_dm}, ${outreach.followup_message}, ${JSON.stringify(outreach.success_tips)}, 
            ${outreach.grounding_note}
          );
        `;
      } catch (e) {
        console.error("Error saving outreach to Neon:", e);
      }
    }
    const current = memoryStore.outreach.get(outreach.user_id) || [];
    memoryStore.outreach.set(outreach.user_id, [outreach, ...current]);
    return outreach;
  },

  // Marketing
  async getMarketingGenerations(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM event_marketing_generations WHERE user_id = ${userId} ORDER BY created_at DESC;`;
        return rows;
      } catch (e) {
        console.error("Error fetching marketing from Neon:", e);
      }
    }
    return memoryStore.marketing.get(userId) || [];
  },

  async saveMarketing(marketing: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO event_marketing_generations (
            id, user_id, event_name, category, audience, description, identity, social_media, formal_communication, engagement_strategy
          ) VALUES (
            ${marketing.id}, ${marketing.user_id}, ${marketing.event_name}, ${marketing.category}, 
            ${marketing.audience}, ${marketing.description}, ${JSON.stringify(marketing.identity)}, 
            ${JSON.stringify(marketing.social_media)}, ${JSON.stringify(marketing.formal_communication)}, 
            ${JSON.stringify(marketing.engagement_strategy)}
          );
        `;
      } catch (e) {
        console.error("Error saving marketing to Neon:", e);
      }
    }
    const list = memoryStore.marketing.get(marketing.user_id) || [];
    memoryStore.marketing.set(marketing.user_id, [marketing, ...list]);
    return marketing;
  },

  // Posters
  async getPosters(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM generated_posters WHERE user_id = ${userId} ORDER BY created_at DESC;`;
        return rows;
      } catch (e) {
        console.error("Error fetching posters from Neon:", e);
      }
    }
    return memoryStore.posters.get(userId) || [];
  },

  async savePoster(poster: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO generated_posters (
            id, user_id, event_name, category, image_url, aspect_ratio, prompt, model_used, is_demo_mode
          ) VALUES (
            ${poster.id}, ${poster.user_id}, ${poster.event_name}, ${poster.category}, 
            ${poster.image_url}, ${poster.aspect_ratio}, ${poster.prompt}, ${poster.model_used}, ${poster.is_demo_mode}
          );
        `;
      } catch (e) {
        console.error("Error saving poster to Neon:", e);
      }
    }
    const list = memoryStore.posters.get(poster.user_id) || [];
    memoryStore.posters.set(poster.user_id, [poster, ...list]);
    return poster;
  },

  // Concierge Messages
  async getConciergeMessages(userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM concierge_messages WHERE user_id = ${userId} ORDER BY created_at ASC;`;
        return rows;
      } catch (e) {
        console.error("Error fetching concierge messages from Neon:", e);
      }
    }
    return memoryStore.conciergeMessages.get(userId) || [];
  },

  async saveConciergeMessage(msg: any, userId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO concierge_messages (
            id, conversation_id, user_id, sender, content, structured_response
          ) VALUES (
            ${msg.id}, ${msg.conversation_id}, ${userId}, ${msg.sender}, ${msg.content}, ${JSON.stringify(msg.structured_response || null)}
          );
        `;
      } catch (e) {
        console.error("Error saving concierge message to Neon:", e);
      }
    }
    const list = memoryStore.conciergeMessages.get(userId) || [];
    memoryStore.conciergeMessages.set(userId, [...list, msg]);
    return msg;
  },

  // ========================
  // AVAILABLE EVENTS DAO METHODS
  // ========================

  async getAvailableEvents(filter?: { category?: string; search?: string }) {
    const sql = getNeonSql();
    if (sql) {
      try {
        let rows = await sql`SELECT * FROM available_events ORDER BY event_date ASC;`;
        if (filter?.category && filter.category !== "All") {
          rows = rows.filter((e: any) => e.category.toLowerCase() === filter.category?.toLowerCase());
        }
        if (filter?.search && filter.search.trim()) {
          const q = filter.search.toLowerCase().trim();
          rows = rows.filter((e: any) =>
            e.name.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q) ||
            e.description.toLowerCase().includes(q) ||
            e.venue.toLowerCase().includes(q)
          );
        }
        return rows;
      } catch (e) {
        console.error("Error fetching available_events from Neon:", e);
      }
    }
    return [];
  },

  async saveAvailableEvent(evt: {
    id?: string;
    master_event_id?: string;
    name: string;
    category: string;
    description: string;
    organizer: string;
    format: string;
    event_date: string;
    registration_deadline: string;
    venue: string;
    capacity: number;
    participation_fee?: string | number;
    eligibility?: string;
    status?: string;
  }) {
    const sql = getNeonSql();
    let id = evt.id;
    if (!id && sql && evt.master_event_id) {
      try {
        const existing = await sql`SELECT id FROM available_events WHERE master_event_id = ${evt.master_event_id} LIMIT 1;`;
        if (existing && existing.length > 0 && existing[0].id) {
          id = existing[0].id;
        }
      } catch (err) {
        console.error("Error looking up existing available event by master_event_id:", err);
      }
    }
    if (!id) {
      id = `avail-evt-${Date.now()}`;
    }
    const fee = String(evt.participation_fee || "0");
    const status = evt.status || "Registration Open";

    if (sql) {
      try {
        await sql`
          INSERT INTO available_events (
            id, master_event_id, name, category, description, organizer, format,
            event_date, registration_deadline, venue, capacity, registered_count,
            participation_fee, eligibility, status, updated_at
          ) VALUES (
            ${id}, ${evt.master_event_id || null}, ${evt.name}, ${evt.category}, ${evt.description},
            ${evt.organizer || 'Student Organization'}, ${evt.format || 'Offline'}, 
            ${evt.event_date}, ${evt.registration_deadline}, ${evt.venue || 'Campus Auditorium'}, 
            ${Number(evt.capacity) || 100}, 0, ${fee}, ${evt.eligibility || 'Open to all students'}, 
            ${status}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            organizer = EXCLUDED.organizer,
            format = EXCLUDED.format,
            event_date = EXCLUDED.event_date,
            registration_deadline = EXCLUDED.registration_deadline,
            venue = EXCLUDED.venue,
            capacity = EXCLUDED.capacity,
            participation_fee = EXCLUDED.participation_fee,
            eligibility = EXCLUDED.eligibility,
            status = EXCLUDED.status,
            updated_at = NOW();
        `;
      } catch (e) {
        console.error("Error saving to available_events in Neon:", e);
      }
    }

    return { ...evt, id, status, updated_at: new Date().toISOString() };
  },

  // EVENT HUB DAO METHODS
  // ========================

  async getEvents(userId: string, filter?: { category?: string; query?: string; type?: string }) {
    const allEvents: any[] = [];
    const sql = getNeonSql();

    if (sql) {
      try {
        const rows = await sql`SELECT * FROM events ORDER BY start_datetime ASC;`;
        if (rows.length > 0) {
          allEvents.push(...rows);
        }

        // Also fetch from available_events table
        const availRows = await sql`
          SELECT * FROM available_events 
          WHERE status NOT IN ('Draft', 'In Planning')
          ORDER BY event_date ASC;
        `;
        if (availRows && availRows.length > 0) {
          for (const r of availRows) {
            // Avoid duplicate if already in events
            if (!allEvents.some((e) => e.id === r.id || e.id === r.master_event_id)) {
              allEvents.push({
                id: r.id,
                name: r.name,
                slug: r.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                description: r.description,
                category: r.category,
                poster_url: (r.name && r.name.toLowerCase().includes("jis cloud ai hackathon 2026"))
                  ? "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
                  : ((r as any).poster_url || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80"),
                start_datetime: r.event_date.includes("T") ? r.event_date : `${r.event_date}T09:00:00Z`,
                end_datetime: r.event_date.includes("T") ? r.event_date : `${r.event_date}T18:00:00Z`,
                registration_deadline: r.registration_deadline.includes("T") ? r.registration_deadline : `${r.registration_deadline}T23:59:59Z`,
                venue: r.venue,
                event_mode: r.format || "Offline",
                participation_fee: typeof r.participation_fee === "number" ? r.participation_fee : (parseInt(r.participation_fee) || 0),
                capacity: Number(r.capacity) || 100,
                registered_count: Number(r.registered_count) || 0,
                eligibility: r.eligibility || "Open to all students",
                event_rules: ["Follow university student conduct code.", "Check in with verified UniVibe pass."],
                required_materials: ["Student ID Card"],
                contact_information: r.organizer || "Student Council",
                event_status: r.status === "Draft" ? "Registration Closed" : "Registration Open",
                verification_status: "VERIFIED",
                created_at: r.created_at,
                updated_at: r.updated_at,
              });
            }
          }
        }
      } catch (e) {
        console.error("Error loading events from Neon:", e);
      }
    }

    if (allEvents.length === 0) {
      allEvents.push(...Array.from(memoryStore.events.values()));
    }

    // Get user registrations and saved sets
    const userRegs = memoryStore.eventRegistrations.get(userId) || [];
    const registeredEventMap = new Map<string, string>(); // eventId -> registration_number
    userRegs.forEach((r) => {
      if (r.registration_status !== "Cancelled") {
        registeredEventMap.set(r.event_id, r.registration_number);
      }
    });

    const userSaved = memoryStore.savedEvents.get(userId) || new Set<string>();

    // Map computed fields
    let enriched = allEvents.map((evt) => {
      const regNumber = registeredEventMap.get(evt.id);
      return {
        ...evt,
        is_registered: Boolean(regNumber),
        registration_number: regNumber,
        is_saved: userSaved.has(evt.id),
      };
    });

// Dynamic filtering: all valid created events are returned

    // Apply category filter (normalizing singular vs plural like Hackathon vs Hackathons, and fest suffixes)
    if (filter?.category && filter.category !== "All") {
      const targetCat = filter.category.toLowerCase().replace(/s$/, "");
      enriched = enriched.filter((e) => {
        const cat = (e.category || "").toLowerCase().replace(/s$/, "");
        return cat === targetCat || cat.includes(targetCat) || targetCat.includes(cat);
      });
    }

    // Apply search query
    if (filter?.query && filter.query.trim()) {
      const q = filter.query.toLowerCase().trim();
      enriched = enriched.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      );
    }

    // Apply sub-filters
    if (filter?.type) {
      const now = new Date().toISOString();
      if (filter.type === "Upcoming") {
        enriched = enriched.filter((e) => e.start_datetime >= now);
      } else if (filter.type === "Free Events") {
        enriched = enriched.filter((e) => e.participation_fee === 0);
      } else if (filter.type === "Online Events") {
        enriched = enriched.filter((e) => e.event_mode === "Online");
      } else if (filter.type === "Offline Events") {
        enriched = enriched.filter((e) => e.event_mode === "Offline");
      } else if (filter.type === "My Registrations") {
        enriched = enriched.filter((e) => e.is_registered);
      }
    }

    return enriched;
  },

  async getEventById(eventId: string, userId: string) {
    let event = memoryStore.events.get(eventId);
    const sql = getNeonSql();

    if (sql) {
      try {
        const rows = await sql`SELECT * FROM events WHERE id = ${eventId} LIMIT 1;`;
        if (rows[0]) event = rows[0];
      } catch (e) {
        console.error("Error loading event by id from Neon:", e);
      }
    }

    if (!event) return null;

    const userRegs = memoryStore.eventRegistrations.get(userId) || [];
    const activeReg = userRegs.find((r) => r.event_id === eventId && r.registration_status !== "Cancelled");
    const userSaved = memoryStore.savedEvents.get(userId) || new Set<string>();

    return {
      ...event,
      is_registered: Boolean(activeReg),
      registration_number: activeReg?.registration_number,
      is_saved: userSaved.has(eventId),
    };
  },

  async registerForEvent(studentId: string, eventId: string, registrationData: any) {
    const event = memoryStore.events.get(eventId);
    if (!event) {
      throw new Error("Event not found.");
    }

    // 1. Check duplicate registration
    const userRegs = memoryStore.eventRegistrations.get(studentId) || [];
    const existingActive = userRegs.find(
      (r) => r.event_id === eventId && r.registration_status !== "Cancelled"
    );
    if (existingActive) {
      throw new Error(`You have already registered for ${event.name} (Registration ID: ${existingActive.registration_number}).`);
    }

    // 2. Check registration deadline
    const now = new Date();
    const deadline = new Date(event.registration_deadline);
    if (now > deadline) {
      throw new Error("Registration for this event has closed because the deadline has passed.");
    }

    // 3. Check capacity atomically
    let assignedStatus: "Confirmed" | "Waitlisted" = "Confirmed";
    if (event.registered_count >= event.capacity) {
      assignedStatus = "Waitlisted";
    }

    // 4. Generate unique Registration ID e.g. UNV-2026-XXXXX
    const regCountTotal = Array.from(memoryStore.eventRegistrations.values()).flat().length + 1;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const registrationNumber = `UNV-2026-${String(regCountTotal).padStart(3, "0")}${randomSuffix.toString().slice(-2)}`;

    // 5. Update event capacity
    event.registered_count = (event.registered_count || 0) + 1;
    if (event.registered_count >= event.capacity) {
      event.event_status = "Event Full";
    } else if (event.registered_count >= event.capacity * 0.8) {
      event.event_status = "Filling Fast";
    }
    memoryStore.events.set(eventId, event);

    const newRegistration = {
      id: "reg-" + Date.now(),
      registration_number: registrationNumber,
      student_id: studentId,
      event_id: eventId,
      event: { ...event },
      registration_data: registrationData,
      registration_status: assignedStatus,
      consent_accepted: true,
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      cancellation_allowed: true,
      cancellation_deadline: event.registration_deadline,
    };

    // Save to Neon if connected
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO event_registrations (
            id, registration_number, student_id, event_id, registration_data, 
            registration_status, consent_accepted, submitted_at, updated_at, 
            cancellation_allowed, cancellation_deadline
          ) VALUES (
            ${newRegistration.id}, ${newRegistration.registration_number}, ${studentId}, 
            ${eventId}, ${JSON.stringify(registrationData)}, ${assignedStatus}, 
            TRUE, NOW(), NOW(), TRUE, ${event.registration_deadline}
          );
        `;
        await sql`
          UPDATE events SET registered_count = registered_count + 1 WHERE id = ${eventId};
        `;
      } catch (e) {
        console.error("Error persisting registration to Neon:", e);
      }
    }

    // Save to memory store
    memoryStore.eventRegistrations.set(studentId, [newRegistration, ...userRegs]);

    return newRegistration;
  },

  async getStudentRegistrations(studentId: string, statusFilter?: string) {
    let list = memoryStore.eventRegistrations.get(studentId) || [];

    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT r.*, row_to_json(e.*) as event 
          FROM event_registrations r
          JOIN events e ON r.event_id = e.id
          WHERE r.student_id = ${studentId}
          ORDER BY r.submitted_at DESC;
        `;
        if (rows.length > 0) list = rows;
      } catch (e) {
        console.error("Error reading registrations from Neon:", e);
      }
    }

    if (statusFilter && statusFilter !== "All") {
      list = list.filter(
        (r) => r.registration_status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return list;
  },

  async cancelRegistration(studentId: string, registrationId: string) {
    const userRegs = memoryStore.eventRegistrations.get(studentId) || [];
    const reg = userRegs.find((r) => r.id === registrationId || r.registration_number === registrationId);

    if (!reg) {
      throw new Error("Registration not found.");
    }

    if (reg.registration_status === "Cancelled") {
      throw new Error("This registration is already cancelled.");
    }

    // Check cancellation deadline
    if (reg.cancellation_deadline) {
      const now = new Date();
      const deadline = new Date(reg.cancellation_deadline);
      if (now > deadline) {
        throw new Error("Cancellation deadline has passed. You cannot cancel this registration.");
      }
    }

    // Update status
    reg.registration_status = "Cancelled";
    reg.cancelled_at = new Date().toISOString();
    reg.updated_at = new Date().toISOString();

    // Decrement event registered count
    const event = memoryStore.events.get(reg.event_id);
    if (event && event.registered_count > 0) {
      event.registered_count -= 1;
      if (event.registered_count < event.capacity) {
        event.event_status = event.registered_count >= event.capacity * 0.8 ? "Filling Fast" : "Registration Open";
      }
      memoryStore.events.set(reg.event_id, event);
    }

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          UPDATE event_registrations 
          SET registration_status = 'Cancelled', cancelled_at = NOW(), updated_at = NOW() 
          WHERE id = ${reg.id} AND student_id = ${studentId};
        `;
        await sql`
          UPDATE events SET registered_count = GREATEST(0, registered_count - 1) WHERE id = ${reg.event_id};
        `;
      } catch (e) {
        console.error("Error updating cancellation in Neon:", e);
      }
    }

    memoryStore.eventRegistrations.set(studentId, [...userRegs]);
    return reg;
  },

  async toggleSaveEvent(studentId: string, eventId: string) {
    const userSaved = memoryStore.savedEvents.get(studentId) || new Set<string>();
    const isSaved = userSaved.has(eventId);

    if (isSaved) {
      userSaved.delete(eventId);
    } else {
      userSaved.add(eventId);
    }

    memoryStore.savedEvents.set(studentId, userSaved);

    const sql = getNeonSql();
    if (sql) {
      try {
        if (isSaved) {
          await sql`DELETE FROM saved_events WHERE student_id = ${studentId} AND event_id = ${eventId};`;
        } else {
          await sql`
            INSERT INTO saved_events (id, student_id, event_id, created_at)
            VALUES (${"save-" + Date.now()}, ${studentId}, ${eventId}, NOW())
            ON CONFLICT DO NOTHING;
          `;
        }
      } catch (e) {
        console.error("Error toggling saved event in Neon:", e);
      }
    }

    return { eventId, isSaved: !isSaved };
  },

  // ========================
  // ORGANIZER DAO METHODS
  // ========================

  async getOrganizerProfile(organizerId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`SELECT * FROM organizer_profiles WHERE id = ${organizerId} LIMIT 1;`;
        if (rows && rows.length > 0) return rows[0];
      } catch (e) {
        console.error("Error fetching organizer profile from Neon:", e);
      }
    }
    return memoryStore.organizerProfiles.get(organizerId) || memoryStore.organizerProfiles.get(defaultOrganizerId) || null;
  },

  async saveOrganizerProfile(profile: any) {
    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO organizer_profiles (
            id, name, organization_name, department, email, phone, role_title, avatar_url, updated_at
          ) VALUES (
            ${profile.id}, ${profile.name}, ${profile.organization_name}, ${profile.department}, 
            ${profile.email}, ${profile.phone || ''}, ${profile.role_title}, ${profile.avatar_url || null}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            organization_name = EXCLUDED.organization_name,
            department = EXCLUDED.department,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            role_title = EXCLUDED.role_title,
            avatar_url = EXCLUDED.avatar_url,
            updated_at = NOW();
        `;
      } catch (e) {
        console.error("Error saving organizer profile to Neon:", e);
      }
    }
    memoryStore.organizerProfiles.set(profile.id, {
      ...profile,
      updated_at: new Date().toISOString(),
    });
    return profile;
  },

  async getOrganizerEvents(organizerId: string, filter?: { status?: string; search?: string }) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM organizer_events 
          WHERE organizer_id = ${organizerId} 
          ORDER BY updated_at DESC;
        `;
        if (rows && rows.length > 0) {
          let list = rows.map((r: any) => ({
            ...r,
            basics: typeof r.basics === 'string' ? JSON.parse(r.basics) : r.basics,
            audience: typeof r.audience === 'string' ? JSON.parse(r.audience) : r.audience,
            timeline: typeof r.timeline === 'string' ? JSON.parse(r.timeline) : r.timeline,
            logistics: typeof r.logistics === 'string' ? JSON.parse(r.logistics) : r.logistics,
            objectives: typeof r.objectives === 'string' ? JSON.parse(r.objectives) : r.objectives,
            registration: typeof r.registration === 'string' ? JSON.parse(r.registration) : r.registration,
            section_ai_outputs: typeof r.section_ai_outputs === 'string' ? JSON.parse(r.section_ai_outputs) : (r.section_ai_outputs || {}),
            final_report: typeof r.final_report === 'string' ? JSON.parse(r.final_report) : r.final_report,
          }));

          if (filter?.status && filter.status !== "All") {
            list = list.filter((e: any) => e.status.toLowerCase() === filter.status?.toLowerCase());
          }

          if (filter?.search && filter.search.trim()) {
            const q = filter.search.toLowerCase().trim();
            list = list.filter(
              (e: any) =>
                e.basics?.event_name?.toLowerCase().includes(q) ||
                e.basics?.event_category?.toLowerCase().includes(q) ||
                e.basics?.event_description?.toLowerCase().includes(q)
            );
          }

          return list;
        }
      } catch (e) {
        console.error("Error fetching organizer events from Neon:", e);
      }
    }

    let list = Array.from(memoryStore.organizerEvents.values()).filter(
      (e) => e.organizer_id === organizerId
    );

    if (filter?.status && filter.status !== "All") {
      list = list.filter((e) => e.status.toLowerCase() === filter.status?.toLowerCase());
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.basics.event_name.toLowerCase().includes(q) ||
          e.basics.event_category.toLowerCase().includes(q) ||
          e.basics.event_description.toLowerCase().includes(q)
      );
    }

    return list.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  },

  async getOrganizerEventById(eventId: string, organizerId: string) {
    const sql = getNeonSql();
    if (sql) {
      try {
        const rows = await sql`
          SELECT * FROM organizer_events 
          WHERE id = ${eventId} LIMIT 1;
        `;
        if (rows && rows.length > 0) {
          const r = rows[0] as any;
          return {
            ...r,
            basics: typeof r.basics === 'string' ? JSON.parse(r.basics) : r.basics,
            audience: typeof r.audience === 'string' ? JSON.parse(r.audience) : r.audience,
            timeline: typeof r.timeline === 'string' ? JSON.parse(r.timeline) : r.timeline,
            logistics: typeof r.logistics === 'string' ? JSON.parse(r.logistics) : r.logistics,
            objectives: typeof r.objectives === 'string' ? JSON.parse(r.objectives) : r.objectives,
            registration: typeof r.registration === 'string' ? JSON.parse(r.registration) : r.registration,
            section_ai_outputs: typeof r.section_ai_outputs === 'string' ? JSON.parse(r.section_ai_outputs) : (r.section_ai_outputs || {}),
            final_report: typeof r.final_report === 'string' ? JSON.parse(r.final_report) : r.final_report,
          };
        }
      } catch (e) {
        console.error("Error fetching organizer event by id from Neon:", e);
      }
    }
    const event = memoryStore.organizerEvents.get(eventId);
    if (!event) return null;
    return event;
  },

  async deleteOrganizerEvent(eventId: string) {
    const sql = getNeonSql();
    memoryStore.organizerEvents.delete(eventId);
    if (sql) {
      try {
        await sql`DELETE FROM available_events WHERE master_event_id = ${eventId} OR id = ${eventId};`;
        await sql`DELETE FROM organizer_events WHERE id = ${eventId};`;
        await sql`DELETE FROM master_events WHERE id = ${eventId};`;
        try { await sql`DELETE FROM event_summarized WHERE master_event_id = ${eventId};`; } catch {}
        try { await sql`DELETE FROM event_audience WHERE master_event_id = ${eventId};`; } catch {}
        try { await sql`DELETE FROM event_dates WHERE master_event_id = ${eventId};`; } catch {}
        try { await sql`DELETE FROM event_other_info WHERE master_event_id = ${eventId};`; } catch {}
        try { await sql`DELETE FROM event_objectives WHERE master_event_id = ${eventId};`; } catch {}
        try { await sql`DELETE FROM event_registration_participation WHERE master_event_id = ${eventId};`; } catch {}
      } catch (e) {
        console.error("Error deleting event from Neon:", e);
      }
    }
    return { success: true, id: eventId };
  },

  async saveOrganizerEvent(event: any) {
    const existing = memoryStore.organizerEvents.get(event.id);
    const updated = {
      ...existing,
      ...event,
      updated_at: new Date().toISOString(),
    };
    memoryStore.organizerEvents.set(event.id, updated);

    const sql = getNeonSql();
    if (sql) {
      try {
        await sql`
          INSERT INTO organizer_events (
            id, organizer_id, basics, audience, timeline, logistics, objectives, registration, 
            section_ai_outputs, final_report, status, current_wizard_section, public_event_id, updated_at
          ) VALUES (
            ${updated.id}, ${updated.organizer_id}, ${JSON.stringify(updated.basics || {})}, 
            ${JSON.stringify(updated.audience || {})}, ${JSON.stringify(updated.timeline || {})}, 
            ${JSON.stringify(updated.logistics || {})}, ${JSON.stringify(updated.objectives || {})}, 
            ${JSON.stringify(updated.registration || {})}, ${JSON.stringify(updated.section_ai_outputs || {})}, 
            ${JSON.stringify(updated.final_report || null)}, ${updated.status || 'Draft'}, 
            ${Number(updated.current_wizard_section || 1)}, ${updated.public_event_id || null}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            basics = EXCLUDED.basics,
            audience = EXCLUDED.audience,
            timeline = EXCLUDED.timeline,
            logistics = EXCLUDED.logistics,
            objectives = EXCLUDED.objectives,
            registration = EXCLUDED.registration,
            section_ai_outputs = EXCLUDED.section_ai_outputs,
            final_report = EXCLUDED.final_report,
            status = EXCLUDED.status,
            current_wizard_section = EXCLUDED.current_wizard_section,
            public_event_id = EXCLUDED.public_event_id,
            updated_at = NOW();
        `;

        // Sync into master_events & 6 individual section tables in Neon DB
        const masterId = updated.id;
        const title = updated.basics?.event_name || "Untitled Event";
        await sql`
          INSERT INTO master_events (id, organizer_id, title, status, readiness_score, ai_report, updated_at)
          VALUES (
            ${masterId}, ${updated.organizer_id}, ${title}, ${updated.status || 'Draft'}, 
            ${updated.final_report?.event_readiness_assessment?.readiness_score || 0}, 
            ${JSON.stringify(updated.final_report || {})}, NOW()
          )
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            status = EXCLUDED.status,
            readiness_score = EXCLUDED.readiness_score,
            ai_report = EXCLUDED.ai_report,
            updated_at = NOW();
        `;

        // Section 1: event_summarized
        if (updated.basics && updated.basics.event_name) {
          const s1Id = `sum-${masterId}`;
          await sql`
            INSERT INTO event_summarized (
              id, master_event_id, event_name, event_description, event_category, event_organizer, event_format, updated_at
            ) VALUES (
              ${s1Id}, ${masterId}, ${updated.basics.event_name}, ${updated.basics.event_description || ''}, 
              ${updated.basics.event_category || ''}, ${updated.basics.event_organizer || ''}, 
              ${updated.basics.event_format || 'Offline'}, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              event_name = EXCLUDED.event_name,
              event_description = EXCLUDED.event_description,
              event_category = EXCLUDED.event_category,
              event_organizer = EXCLUDED.event_organizer,
              event_format = EXCLUDED.event_format,
              updated_at = NOW();
          `;
        }

        // Section 2: event_audience
        if (updated.audience && (updated.audience.target_audience || updated.audience.expected_participants)) {
          const s2Id = `aud-${masterId}`;
          await sql`
            INSERT INTO event_audience (
              id, master_event_id, expected_participants, target_audience, participation_type, geographical_reach, updated_at
            ) VALUES (
              ${s2Id}, ${masterId}, ${Number(updated.audience.expected_participants) || 100}, 
              ${updated.audience.target_audience || 'University Students'}, ${updated.audience.participation_type || 'Individual'}, 
              ${updated.audience.geographical_reach || 'College-Level'}, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              expected_participants = EXCLUDED.expected_participants,
              target_audience = EXCLUDED.target_audience,
              participation_type = EXCLUDED.participation_type,
              geographical_reach = EXCLUDED.geographical_reach,
              updated_at = NOW();
          `;
        }

        // Section 3: event_dates
        if (updated.timeline && (updated.timeline.proposed_event_date || updated.timeline.event_duration)) {
          const s3Id = `date-${masterId}`;
          await sql`
            INSERT INTO event_dates (
              id, master_event_id, proposed_event_date, event_duration, preparation_start_date, registration_deadline, date_flexibility, updated_at
            ) VALUES (
              ${s3Id}, ${masterId}, ${updated.timeline.proposed_event_date || ''}, ${updated.timeline.event_duration || ''}, 
              ${updated.timeline.preparation_start_date || ''}, ${updated.timeline.registration_deadline || ''}, 
              ${updated.timeline.date_flexibility || 'Flexible'}, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              proposed_event_date = EXCLUDED.proposed_event_date,
              event_duration = EXCLUDED.event_duration,
              preparation_start_date = EXCLUDED.preparation_start_date,
              registration_deadline = EXCLUDED.registration_deadline,
              date_flexibility = EXCLUDED.date_flexibility,
              updated_at = NOW();
          `;
        }

        // Section 4: event_other_info
        if (updated.logistics && (updated.logistics.venue_location_details || updated.logistics.budget_financial_availability || updated.logistics.financial_constraints_expectations)) {
          const s4Id = `other-${masterId}`;
          await sql`
            INSERT INTO event_other_info (
              id, master_event_id, budget_financial_requirements, financial_constraints, venue_location, 
              infrastructure_equipment, team_composition, external_support_resources, updated_at
            ) VALUES (
              ${s4Id}, ${masterId}, ${updated.logistics.budget_financial_availability || ''}, 
              ${updated.logistics.financial_constraints_expectations || ''}, 
              ${updated.logistics.venue_location_details || ''}, 
              ${updated.logistics.infrastructure_equipment_availability || ''}, 
              ${updated.logistics.team_composition_manpower || ''}, 
              ${updated.logistics.external_support_assistance || ''}, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              budget_financial_requirements = EXCLUDED.budget_financial_requirements,
              financial_constraints = EXCLUDED.financial_constraints,
              venue_location = EXCLUDED.venue_location,
              infrastructure_equipment = EXCLUDED.infrastructure_equipment,
              team_composition = EXCLUDED.team_composition,
              external_support_resources = EXCLUDED.external_support_resources,
              updated_at = NOW();
          `;
        }

        // Section 5: event_objectives
        if (updated.objectives && updated.objectives.primary_event_objective) {
          const s5Id = `obj-${masterId}`;
          await sql`
            INSERT INTO event_objectives (
              id, master_event_id, primary_event_objective, secondary_objectives, event_theme, 
              expected_outcomes, key_deliverables, success_criteria, institutional_alignment, 
              social_educational_impact, updated_at
            ) VALUES (
              ${s5Id}, ${masterId}, ${updated.objectives.primary_event_objective}, 
              ${updated.objectives.secondary_objectives || ''}, ${updated.objectives.event_theme || ''}, 
              ${updated.objectives.expected_outcomes || ''}, ${updated.objectives.key_deliverables || ''}, 
              ${updated.objectives.success_criteria || ''}, ${updated.objectives.institutional_alignment || ''}, 
              ${updated.objectives.social_educational_impact || ''}, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              primary_event_objective = EXCLUDED.primary_event_objective,
              secondary_objectives = EXCLUDED.secondary_objectives,
              event_theme = EXCLUDED.event_theme,
              expected_outcomes = EXCLUDED.expected_outcomes,
              key_deliverables = EXCLUDED.key_deliverables,
              success_criteria = EXCLUDED.success_criteria,
              institutional_alignment = EXCLUDED.institutional_alignment,
              social_educational_impact = EXCLUDED.social_educational_impact,
              updated_at = NOW();
          `;
        }

        // Section 6: event_registration_participation
        if (updated.registration && (updated.registration.registration_method || updated.registration.participant_eligibility)) {
          const s6Id = `reg-${masterId}`;
          await sql`
            INSERT INTO event_registration_participation (
              id, master_event_id, registration_method, registration_window, participant_eligibility, 
              eligibility_restrictions, participation_mode, team_size_range, registration_fee, 
              selection_process, max_registration_capacity, waitlist_availability, 
              certificate_document_requirements, expected_participants, proposed_event_date, updated_at
            ) VALUES (
              ${s6Id}, ${masterId}, ${updated.registration.registration_method || 'Online Form'}, 
              ${updated.registration.registration_window || ''}, 
              ${updated.registration.participant_eligibility || 'Open to all students'}, 
              ${updated.registration.eligibility_restrictions || ''}, 
              ${updated.registration.participation_mode || 'Individual'}, 
              ${updated.registration.team_size_range || ''}, 
              ${String(updated.registration.registration_fee || '0')}, 
              ${updated.registration.selection_process || 'First Come, First Served'}, 
              ${Number(updated.registration.max_registration_capacity) || 150}, 
              ${updated.registration.waitlist_availability || 'Yes'}, 
              ${updated.registration.certificate_document_requirements || ''}, 
              ${Number(updated.audience?.expected_participants || updated.registration?.expected_participants || 100)}, 
              ${updated.timeline?.proposed_event_date || ''}, NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              registration_method = EXCLUDED.registration_method,
              registration_window = EXCLUDED.registration_window,
              participant_eligibility = EXCLUDED.participant_eligibility,
              eligibility_restrictions = EXCLUDED.eligibility_restrictions,
              participation_mode = EXCLUDED.participation_mode,
              team_size_range = EXCLUDED.team_size_range,
              registration_fee = EXCLUDED.registration_fee,
              selection_process = EXCLUDED.selection_process,
              max_registration_capacity = EXCLUDED.max_registration_capacity,
              waitlist_availability = EXCLUDED.waitlist_availability,
              certificate_document_requirements = EXCLUDED.certificate_document_requirements,
              expected_participants = EXCLUDED.expected_participants,
              proposed_event_date = EXCLUDED.proposed_event_date,
              updated_at = NOW();
          `;
        }

        // Available Events: Sync basic necessities into available_events table in Neon DB when Published
        const availId = `avail-${masterId}`;
        const feeStr = String(updated.registration?.registration_fee || "0");
        if (updated.status === "Published") {
          const availStatus = "Registration Open";
          await sql`
            INSERT INTO available_events (
              id, master_event_id, name, category, description, organizer, format,
              event_date, registration_deadline, venue, capacity, registered_count,
              participation_fee, eligibility, status, updated_at
            ) VALUES (
              ${availId}, ${masterId}, 
              ${updated.basics?.event_name || 'Untitled Event'}, 
              ${updated.basics?.event_category || 'Other'}, 
              ${updated.basics?.event_description || 'Campus Event'}, 
              ${updated.basics?.event_organizer || 'Student Organization'}, 
              ${updated.basics?.event_format || 'Offline'}, 
              ${updated.timeline?.proposed_event_date || new Date().toISOString().split('T')[0]}, 
              ${updated.timeline?.registration_deadline || new Date().toISOString().split('T')[0]}, 
              ${updated.logistics?.venue_location_details || 'Campus Auditorium'}, 
              ${Number(updated.registration?.max_registration_capacity) || Number(updated.audience?.expected_participants) || 100}, 
              0, 
              ${feeStr}, 
              ${updated.registration?.participant_eligibility || 'Open to all students'}, 
              ${availStatus}, 
              NOW()
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              category = EXCLUDED.category,
              description = EXCLUDED.description,
              organizer = EXCLUDED.organizer,
              format = EXCLUDED.format,
              event_date = EXCLUDED.event_date,
              registration_deadline = EXCLUDED.registration_deadline,
              venue = EXCLUDED.venue,
              capacity = EXCLUDED.capacity,
              participation_fee = EXCLUDED.participation_fee,
              eligibility = EXCLUDED.eligibility,
              status = EXCLUDED.status,
              updated_at = NOW();
          `;
        }
      } catch (e) {
        console.error("Error writing organizer event to Neon DB:", e);
      }
    }

    return updated;
  },

  async updateOrganizerEventStatus(eventId: string, organizerId: string, newStatus: string) {
    const event = memoryStore.organizerEvents.get(eventId);
    if (!event) {
      throw new Error("Event not found.");
    }

    event.status = newStatus;
    event.updated_at = new Date().toISOString();
    memoryStore.organizerEvents.set(eventId, event);

    // If event is published, sync into the Student Event Hub catalog!
    if (newStatus === "Published") {
      const publicId = event.public_event_id || `pub-evt-${event.id}`;
      event.public_event_id = publicId;

      const publicEvent = {
        id: publicId,
        name: event.basics.event_name,
        slug: event.basics.event_name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: event.basics.event_description,
        category: event.basics.event_category === "Hackathon" ? "Hackathons" : event.basics.event_category,
        poster_url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
        start_datetime: `${event.timeline.proposed_event_date}T09:00:00Z`,
        end_datetime: `${event.timeline.proposed_event_date}T18:00:00Z`,
        registration_deadline: `${event.timeline.registration_deadline}T23:59:59Z`,
        venue: event.logistics.venue_location_details || "Campus Auditorium",
        event_mode: event.basics.event_format,
        participation_fee: Number(event.registration.registration_fee) || 0,
        capacity: Number(event.registration.max_registration_capacity) || 100,
        registered_count: 0,
        eligibility: event.registration.participant_eligibility || "Open to all enrolled students",
        event_rules: [
          "Follow university student conduct code.",
          "Check in at venue with verified UniVibe digital pass.",
        ],
        required_materials: ["Student ID Card", "Personal laptop if technical workshop"],
        contact_information: event.basics.event_organizer || "University Event Committee",
        event_status: "Registration Open",
        verification_status: "VERIFIED",
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      memoryStore.events.set(publicId, publicEvent);
    }

    return event;
  },

  async getOrganizerMetrics(organizerId: string) {
    const events = Array.from(memoryStore.organizerEvents.values()).filter(
      (e) => e.organizer_id === organizerId
    );

    const draftEvents = events.filter((e) => e.status === "Draft" || e.status === "In Planning").length;
    const pendingReview = events.filter((e) => e.status === "Pending Review").length;
    const publishedEvents = events.filter((e) => e.status === "Published").length;

    // Count registrations across all published events
    let totalRegistrations = 0;
    const allRegs = Array.from(memoryStore.eventRegistrations.values()).flat();
    events.forEach((orgEvt) => {
      if (orgEvt.public_event_id) {
        const count = allRegs.filter((r) => r.event_id === orgEvt.public_event_id && r.registration_status !== "Cancelled").length;
        totalRegistrations += count;
      }
    });

    return {
      total_events: events.length,
      draft_events: draftEvents,
      pending_review: pendingReview,
      published_events: publishedEvents,
      total_registrations: totalRegistrations,
    };
  },

  async getOrganizerRegistrations(organizerId: string, eventId?: string) {
    const allRegs = Array.from(memoryStore.eventRegistrations.values()).flat();
    if (!eventId || eventId === "all") {
      return allRegs.filter((r) => r.registration_status !== "Cancelled");
    }
    return allRegs.filter(
      (r) => (r.event_id === eventId || r.event?.id === eventId) && r.registration_status !== "Cancelled"
    );
  },

  async updateRegistrationCheckIn(regId: string, checkInStatus: string) {
    const allStudentKeys = Array.from(memoryStore.eventRegistrations.keys());
    for (const key of allStudentKeys) {
      const regs = memoryStore.eventRegistrations.get(key) || [];
      const target = regs.find((r) => r.id === regId || r.registration_number === regId);
      if (target) {
        target.check_in_status = checkInStatus;
        target.updated_at = new Date().toISOString();
        return target;
      }
    }
    return null;
  },
};

