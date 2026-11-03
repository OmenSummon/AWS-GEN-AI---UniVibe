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
    name: "CodeStorm Hackathon",
    slug: "codestorm-hackathon",
    category: "Hackathons",
    description: "The flagship 36-hour inter-college software sprint where campus builders code, prototype, and pitch real-world software solutions to tech industry judges.",
    poster_url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-20T09:00:00Z",
    end_datetime: "2026-11-21T21:00:00Z",
    registration_deadline: "2026-11-18T23:59:59Z",
    venue: "Main Campus Tech Wing, Labs 401-404",
    event_mode: "Offline",
    participation_fee: 0,
    capacity: 150,
    registered_count: 112,
    eligibility: "Open to all enrolled undergraduate and postgraduate students. Teams of 2 to 4.",
    event_rules: [
      "All code and prototypes must be developed during the hackathon period.",
      "Open-source libraries and APIs are permitted; pre-built full applications are prohibited.",
      "Each team must submit a public GitHub repository and give a live 3-minute demo."
    ],
    required_materials: ["Personal laptop and charger", "Student ID card", "Hardware kit if IoT track"],
    contact_information: "codestorm@campus.edu • Room 402 CS Tech Wing",
    event_status: "Filling Fast",
    verification_status: "DEMO",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-02",
    name: "AI Innovation Workshop",
    slug: "ai-innovation-workshop",
    category: "Workshops",
    description: "Hands-on masterclass exploring Large Language Models, prompt engineering architectures, and deploying retrieval-augmented generative systems on AWS.",
    poster_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-15T14:00:00Z",
    end_datetime: "2026-11-15T17:30:00Z",
    registration_deadline: "2026-11-14T18:00:00Z",
    venue: "Innovation Center Room 204 & Online Zoom stream",
    event_mode: "Hybrid",
    participation_fee: 0,
    capacity: 80,
    registered_count: 46,
    eligibility: "Basic Python knowledge recommended. Open to all departments.",
    event_rules: [
      "Bring a working laptop with Python 3.10+ installed.",
      "AWS sandbox tokens will be issued at the start of the session.",
      "Certificate issued upon completion of hands-on mini-project."
    ],
    required_materials: ["Laptop with VS Code or Jupyter", "Active GitHub account"],
    contact_information: "ailab-workshops@campus.edu",
    event_status: "Registration Open",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-03",
    name: "Campus Cultural Night",
    slug: "campus-cultural-night",
    category: "Cultural",
    description: "An electric evening celebrating diverse student talent with theatrical performances, multicultural dance showcases, and live food pop-ups.",
    poster_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-28T18:00:00Z",
    end_datetime: "2026-11-28T22:30:00Z",
    registration_deadline: "2026-11-25T23:59:59Z",
    venue: "University Open-Air Amphitheatre",
    event_mode: "Offline",
    participation_fee: 0,
    capacity: 500,
    registered_count: 340,
    eligibility: "Open to all students, faculty, and verified university guests.",
    event_rules: [
      "Entry allowed only with confirmed UniVibe digital registration pass.",
      "Strict campus decorum and zero tolerance for unauthorized substances.",
      "Stage performers must check in with student coordinators by 4:30 PM."
    ],
    required_materials: ["Student Digital ID pass", "Festive cultural attire encouraged"],
    contact_information: "culturalaffairs@campus.edu",
    event_status: "Registration Open",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-04",
    name: "Inter-College Football Tournament",
    slug: "football-tournament",
    category: "Sports",
    description: "The premiere 7-a-side campus football cup. Compete across group stages and knockouts to claim the University Champions Trophy.",
    poster_url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-12-05T08:30:00Z",
    end_datetime: "2026-12-07T17:00:00Z",
    registration_deadline: "2026-11-30T20:00:00Z",
    venue: "University Sports Complex & Turf Ground 1",
    event_mode: "Offline",
    participation_fee: 250,
    capacity: 32,
    registered_count: 28,
    eligibility: "Teams of 7 playing + 3 rolling substitutes. All players must be currently matriculated.",
    event_rules: [
      "Standard FIFA rules with 20-minute halves.",
      "Cleats and shin guards are mandatory for match safety.",
      "Referee decisions are final."
    ],
    required_materials: ["Team matching kits", "Turf cleats", "Medical waiver form"],
    contact_information: "sportsboard@campus.edu",
    event_status: "Filling Fast",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-05",
    name: "Startup Pitch Arena",
    slug: "startup-pitch-arena",
    category: "Entrepreneurship",
    description: "Pitch your early-stage venture or product concept to venture capitalists, faculty angels, and alumni founders for $5,000 in non-dilutive pilot grants.",
    poster_url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-24T10:00:00Z",
    end_datetime: "2026-11-24T16:00:00Z",
    registration_deadline: "2026-11-21T23:59:59Z",
    venue: "Dean's Innovation Boardroom & Virtual Livestream",
    event_mode: "Hybrid",
    participation_fee: 0,
    capacity: 40,
    registered_count: 31,
    eligibility: "Student-founded projects with at least 1 working demo or structured customer validation.",
    event_rules: [
      "5-minute pitch followed by 4 minutes of investor Q&A.",
      "Slides must be submitted in PDF format 24 hours prior to the event.",
      "Confidential IP belongs 100% to student founders."
    ],
    required_materials: ["10-slide pitch deck (PDF)", "Product demo link or prototype"],
    contact_information: "incubator@campus.edu • Innovation Hub Floor 2",
    event_status: "Registration Open",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-06",
    name: "BGMI Campus Championship",
    slug: "bgmi-championship",
    category: "Gaming",
    description: "Squad battle royale esports tournament featuring custom rooms, casted live streams, and cash prize pool for the top 3 teams.",
    poster_url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-22T17:00:00Z",
    end_datetime: "2026-11-22T23:00:00Z",
    registration_deadline: "2026-11-20T23:59:59Z",
    venue: "Official Campus Esports Discord Server",
    event_mode: "Online",
    participation_fee: 100,
    capacity: 64,
    registered_count: 59,
    eligibility: "Undergraduate squads of 4 players. Minimum in-game level 30.",
    event_rules: [
      "Emulators and iPad tablets are strictly prohibited (Mobile phones only).",
      "All squad leaders must join discord voice lobby 20 mins before room start.",
      "Cheating or third-party plugins result in immediate campus disqualification."
    ],
    required_materials: ["Mobile phone with game installed", "Stable WiFi / 5G connection", "Discord app"],
    contact_information: "esports@campus.edu",
    event_status: "Filling Fast",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-07",
    name: "LensCraft Photography Challenge",
    slug: "lenscraft-photography",
    category: "Photography",
    description: "Theme-based photography competition across campus. Capture 'Architectural Geometry' and 'Hidden Campus Life' in raw digital composition.",
    poster_url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-19T10:00:00Z",
    end_datetime: "2026-11-19T18:00:00Z",
    registration_deadline: "2026-11-17T18:00:00Z",
    venue: "Campus Botanical Garden & Fine Arts Courtyard",
    event_mode: "Offline",
    participation_fee: 0,
    capacity: 60,
    registered_count: 38,
    eligibility: "Open to amateur and student photographers. DSLR, Mirrorless, and Mobile tracks.",
    event_rules: [
      "Photos must be taken on university grounds during the designated 6-hour sprint.",
      "Basic color correction is permitted; AI generative infills or photo manipulation is barred.",
      "Submit high-resolution JPEG/RAW with EXIF metadata intact."
    ],
    required_materials: ["DSLR / Mirrorless Camera or High-end Smartphone", "Memory Card"],
    contact_information: "photo-guild@campus.edu",
    event_status: "Registration Open",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-08",
    name: "Battle of Bands",
    slug: "battle-of-bands",
    category: "Music",
    description: "The loudest showdown of the semester. Student bands compete in rock, indie, jazz, and fusion genres before a live crowd and celebrity guest judges.",
    poster_url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-12-01T18:30:00Z",
    end_datetime: "2026-12-01T22:30:00Z",
    registration_deadline: "2026-11-26T23:59:59Z",
    venue: "Student Union Grand Auditorium",
    event_mode: "Offline",
    participation_fee: 0,
    capacity: 20,
    registered_count: 19,
    eligibility: "Student bands with 3 to 7 members. At least 1 original composition required.",
    event_rules: [
      "15 minutes stage time including 3 minutes sound-check.",
      "Standard drum kit, amps, and PA system will be provided on stage.",
      "Lyrics must comply with university student affairs guidelines."
    ],
    required_materials: ["Personal guitars, bass, keyboards, pedals, and drumsticks"],
    contact_information: "music-society@campus.edu",
    event_status: "Filling Fast",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-09",
    name: "Poetry and Debate Championship",
    slug: "poetry-debate-championship",
    category: "Literary",
    description: "A battle of eloquence, critical thought, and verse. Oxford-style parliamentary debates alongside slam poetry recitals.",
    poster_url: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-16T11:00:00Z",
    end_datetime: "2026-11-16T16:00:00Z",
    registration_deadline: "2026-11-14T23:59:59Z",
    venue: "Humanities Block, Seminar Hall 2",
    event_mode: "Offline",
    participation_fee: 0,
    capacity: 50,
    registered_count: 32,
    eligibility: "Open to all students. Debaters can register as two-person teams or individual speakers.",
    event_rules: [
      "Debate motions revealed 15 minutes before debate rounds.",
      "Poetry track allows original works in English, Spanish, or Hindi (max 4 minutes).",
      "Strict timekeeping enforced by parliamentary gavel."
    ],
    required_materials: ["Writing notebook and pen", "Copy of original poem if competing in Slam"],
    contact_information: "debatesociety@campus.edu",
    event_status: "Registration Open",
    verification_status: "DEMO",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "evt-10",
    name: "Career Connect Networking Session",
    slug: "career-connect-session",
    category: "Career & Placement",
    description: "Exclusive curated speed-networking and resume critique session with alumni working at top tech firms, investment banks, and research labs.",
    poster_url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    start_datetime: "2026-11-25T15:00:00Z",
    end_datetime: "2026-11-25T19:00:00Z",
    registration_deadline: "2026-11-23T23:59:59Z",
    venue: "University Alumni Hall & Virtual Breakout Rooms",
    event_mode: "Hybrid",
    participation_fee: 0,
    capacity: 120,
    registered_count: 120,
    eligibility: "2nd, 3rd, and final year students preparing for internships and full-time roles.",
    event_rules: [
      "Business casual or formal dress code strictly required.",
      "Bring 3 printed copies of your 1-page resume.",
      "Priority given to confirmed registrations; waitlist opens if seats drop."
    ],
    required_materials: ["Printed resumes", "LinkedIn profile QR code or digital portfolio"],
    contact_information: "careercenter@campus.edu",
    event_status: "Event Full",
    verification_status: "DEMO",
    is_featured: false,
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
  event: initialDemoEvents[1],
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
  event: initialDemoEvents[1],
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
  event: initialDemoEvents[2],
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
initialSaved.add("evt-02");
initialSaved.add("evt-05");
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
          return {
            ...rows[0],
            scores: {
              technical_potential: rows[0].technical_potential,
              creativity: rows[0].creativity,
              leadership: rows[0].leadership,
              networking: rows[0].networking,
              innovation: rows[0].innovation,
              campus_engagement: rows[0].campus_engagement,
            },
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

    // Apply category filter
    if (filter?.category && filter.category !== "All") {
      enriched = enriched.filter(
        (e) => e.category.toLowerCase() === filter.category?.toLowerCase()
      );
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
    return memoryStore.organizerProfiles.get(organizerId) || memoryStore.organizerProfiles.get(defaultOrganizerId) || null;
  },

  async saveOrganizerProfile(profile: any) {
    memoryStore.organizerProfiles.set(profile.id, {
      ...profile,
      updated_at: new Date().toISOString(),
    });
    return profile;
  },

  async getOrganizerEvents(organizerId: string, filter?: { status?: string; search?: string }) {
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
    const event = memoryStore.organizerEvents.get(eventId);
    if (!event) return null;
    return event;
  },

  async saveOrganizerEvent(event: any) {
    const existing = memoryStore.organizerEvents.get(event.id);
    const updated = {
      ...existing,
      ...event,
      updated_at: new Date().toISOString(),
    };
    memoryStore.organizerEvents.set(event.id, updated);
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

