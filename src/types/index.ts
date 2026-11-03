// UniVibe Core Type Definitions

export type ToneType = 'Professional' | 'Friendly' | 'Enthusiastic' | 'Curious' | 'Confident';

export interface StudentProfile {
  id: string;
  student_name: string;
  department: string;
  year: string;
  interests: string[];
  skills: string[];
  free_time: string;
  goal: string;
  tone: ToneType;
  university_name?: string;
  avatar_url?: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface IntelligenceScores {
  technical_potential: number; // 0 - 100
  creativity: number;          // 0 - 100
  leadership: number;          // 0 - 100
  networking: number;          // 0 - 100
  innovation: number;          // 0 - 100
  campus_engagement: number;   // 0 - 100
}

export interface ScoreExplanation {
  factor: string;
  score: number;
  rationale: string;
}

export interface LevelUpMission {
  title: string;
  objective: string;
  estimated_time: string;
  first_action: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Ambitious';
}

export interface UniVibeProfileResult {
  id: string;
  user_id: string;
  archetype: string;
  archetype_tagline: string;
  archetype_description: string;
  ranked_interests: { name: string; relevance_reason: string; rank: number }[];
  hidden_strengths: { strength: string; evidence: string; how_to_leverage: string }[];
  growth_opportunities: { area: string; rationale: string; high_impact_step: string }[];
  engagement_style: string;
  scores: IntelligenceScores;
  score_explanations: ScoreExplanation[];
  level_up_mission: LevelUpMission;
  ai_tendencies_disclaimer: string;
  status: 'not_started' | 'processing' | 'completed' | 'failed' | 'needs_refresh';
  generated_at: string;
}

export type OpportunityCategory = 
  | 'Hackathons'
  | 'Technical clubs'
  | 'Cultural events'
  | 'Volunteering'
  | 'Research opportunities'
  | 'Entrepreneurship'
  | 'Internships'
  | 'Workshops'
  | 'Competitions'
  | 'Networking';

export type VerificationStatus = 'VERIFIED' | 'SUGGESTED';

export interface OpportunityRecommendation {
  id: string;
  opportunity_name: string;
  category: OpportunityCategory;
  match_score: number; // 0 - 100
  why_it_matches: string;
  skills_gained: string[];
  time_commitment: string;
  career_impact: string;
  first_action: string;
  eligibility: string;
  verification_status: VerificationStatus;
  verification_details?: string;
  is_best_match: boolean;
  is_saved?: boolean;
  is_interested?: boolean;
  notes?: string;
}

export interface SevenDayMission {
  mission_title: string;
  daily_actions: { day: number; action: string; outcome: string }[];
}

export interface MatchAIResult {
  id: string;
  user_id: string;
  recommendations: OpportunityRecommendation[];
  best_match_id: string;
  seven_day_mission: SevenDayMission;
  heuristic_explanation: string;
  generated_at: string;
}

export interface BlindSpot {
  area: string;
  what_is_missing: string;
  why_it_matters: string;
  action_to_address: string;
}

export interface MissingSkill {
  skill: string;
  category: 'Technical' | 'Soft' | 'Strategic';
  industry_context: string;
  fastest_way_to_acquire: string;
}

export interface CrossFieldConnection {
  connection_title: string;
  field_a: string;
  field_b: string;
  hybrid_advantage: string;
}

export interface BoldAmbitiousMove {
  title: string;
  vision: string;
  potential_breakthrough: string;
  execution_steps: string[];
  calculated_risk: string;
}

export interface GapAnalysisResult {
  id: string;
  user_id: string;
  blind_spots: BlindSpot[];
  missing_skills: MissingSkill[];
  cross_field_connections: CrossFieldConnection[];
  campus_fomo_risk: {
    level: 'Low' | 'Moderate' | 'High';
    explanation: string;
    antidote: string;
  };
  bold_ambitious_move: BoldAmbitiousMove;
  generated_at: string;
}

export interface JourneyMilestone {
  id: string;
  journey_id: string;
  phase: 'PHASE 1 — START' | 'PHASE 2 — CONNECT' | 'PHASE 3 — BUILD' | 'PHASE 4 — LEVEL UP';
  phase_number: 1 | 2 | 3 | 4;
  time_horizon: 'Next 7 days' | 'Next 30 days' | 'Next 3 months' | 'End of academic year';
  title: string;
  description: string;
  deadline?: string;
  completed: boolean;
  completed_at?: string;
  sequence_order: number;
}

export interface FinalMissionChallenge {
  title: string;
  vision: string;
  measurable_outcomes: string[];
  end_of_year_target: string;
}

export interface StudentJourneyResult {
  id: string;
  user_id: string;
  title: string;
  phases: {
    phase_number: 1 | 2 | 3 | 4;
    phase_name: string;
    time_horizon: string;
    focus: string;
    milestones: JourneyMilestone[];
  }[];
  final_mission_challenge: FinalMissionChallenge;
  total_milestones: number;
  completed_milestones: number;
  progress_pct: number;
  generated_at: string;
}

export interface OutreachEmail {
  subject: string;
  salutation: string;
  body: string;
  sign_off: string;
}

export interface OutreachGenerationResult {
  id: string;
  user_id: string;
  opportunity_name: string;
  tone: ToneType;
  professional_email: OutreachEmail;
  whatsapp_message: string;
  social_dm: string;
  followup_message: string;
  success_tips: string[];
  grounding_note: string;
  generated_at: string;
}

export interface EventMarketingResult {
  id: string;
  user_id: string;
  event_name: string;
  category: string;
  audience: string;
  description: string;
  identity: {
    tagline: string;
    headline: string;
    one_liner: string;
    three_reasons_to_attend: string[];
  };
  social_media: {
    instagram_caption: string;
    whatsapp_announcement: string;
    hashtags: string[];
  };
  formal_communication: {
    professional_email: {
      subject: string;
      body: string;
    };
    campus_notice: string;
  };
  engagement_strategy: {
    promotion_ideas: string[];
    participation_boosters: string[];
    campaign_idea: string;
    event_slogan: string;
  };
  generated_at: string;
}

export interface GeneratedPoster {
  id: string;
  user_id: string;
  event_name: string;
  category: string;
  image_url: string;
  aspect_ratio: '4:5';
  prompt: string;
  model_used: string;
  is_demo_mode: boolean;
  created_at: string;
}

export interface ConciergeMessage {
  id: string;
  conversation_id: string;
  sender: 'user' | 'assistant';
  content: string;
  structured_response?: {
    quick_answer: string;
    personalized_insight: string;
    what_to_do_next: string;
    univibe_tip: string;
  };
  flagged_unverified?: string[];
  created_at: string;
}

export interface CampusKnowledgeItem {
  id: string;
  university: string;
  department?: string;
  title: string;
  category: OpportunityCategory;
  description: string;
  eligibility: string;
  contact_info?: string;
  verification_status: VerificationStatus;
  last_verified_date: string;
  source: string;
}

// ========================
// EVENT HUB TYPES
// ========================

export type EventHubCategory =
  | 'Technical'
  | 'Hackathons'
  | 'Workshops'
  | 'Cultural'
  | 'Sports'
  | 'Entrepreneurship'
  | 'Gaming'
  | 'Photography'
  | 'Music'
  | 'Literary'
  | 'Social & Networking'
  | 'Career & Placement';

export type EventStatus =
  | 'Registration Open'
  | 'Filling Fast'
  | 'Registration Closed'
  | 'Event Full'
  | 'Completed'
  | 'Cancelled';

export type RegistrationStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Waitlisted'
  | 'Rejected'
  | 'Cancelled'
  | 'Completed';

export interface CampusEvent {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: EventHubCategory;
  poster_url: string;
  start_datetime: string;
  end_datetime: string;
  registration_deadline: string;
  venue: string;
  event_mode: 'Offline' | 'Online' | 'Hybrid';
  participation_fee: number; // 0 for Free
  capacity: number;
  registered_count: number;
  eligibility: string;
  event_rules: string[];
  required_materials: string[];
  contact_information?: string;
  event_status: EventStatus;
  verification_status: 'VERIFIED' | 'DEMO' | 'SUGGESTED';
  is_featured?: boolean;
  is_saved?: boolean;
  is_registered?: boolean;
  registration_id?: string;
  registration_number?: string;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: string;
  registration_number: string;
  student_id: string;
  event_id: string;
  event?: CampusEvent;
  registration_data: Record<string, any>;
  registration_status: RegistrationStatus;
  consent_accepted: boolean;
  submitted_at: string;
  updated_at: string;
  cancellation_allowed?: boolean;
  cancellation_deadline?: string;
  cancelled_at?: string;
}

export interface EventCategoryInfo {
  id: string;
  name: EventHubCategory;
  description: string;
  icon: string;
}

// ========================
// ROLE & ORGANIZER ARCHITECTURE TYPES
// ========================

export type UserRole = 'student' | 'organizer';

export interface OrganizerProfile {
  id: string;
  name: string;
  organization_name: string;
  department: string;
  email: string;
  phone: string;
  role_title: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export type EventLifecycleStatus =
  | 'Draft'
  | 'In Planning'
  | 'Pending Review'
  | 'Approved'
  | 'Published'
  | 'Completed'
  | 'Rejected'
  | 'Cancelled';

export type EventWizardCategory =
  | 'Hackathon'
  | 'Technical Fest'
  | 'Workshop'
  | 'Seminar'
  | 'Conference'
  | 'Cultural Fest'
  | 'Sports'
  | 'Gaming'
  | 'Photography'
  | 'Music'
  | 'Entrepreneurship'
  | 'Other';

export interface EventBasicsData {
  event_name: string;
  event_description: string;
  event_category: EventWizardCategory;
  event_organizer?: string;
  event_format: 'Online' | 'Offline' | 'Hybrid';
}

export interface AudienceReachData {
  expected_participants: number;
  target_audience: string;
  participation_type: 'Individual' | 'Team-Based' | 'Open Registration' | 'Invitation-Based' | 'Mixed';
  geographical_reach:
    | 'College-Level'
    | 'University-Level'
    | 'Inter-College'
    | 'District-Level'
    | 'State-Level'
    | 'National-Level'
    | 'International-Level';
}

export interface TimelineData {
  proposed_event_date: string;
  event_duration: string;
  preparation_start_date: string;
  registration_deadline: string;
  date_flexibility: 'Fixed' | 'Flexible' | 'Yet to Be Decided';
}

export interface ResourcesLogisticsData {
  budget_financial_availability: string;
  financial_constraints_expectations: string;
  venue_location_details: string;
  infrastructure_equipment_availability: string;
  team_composition_manpower: string;
  external_support_assistance: string;
}

export interface StrategicObjectivesData {
  primary_event_objective: string;
  secondary_objectives?: string;
  event_theme?: string;
  expected_outcomes?: string;
  key_deliverables?: string;
  success_criteria?: string;
  institutional_alignment?: string;
  social_educational_impact?: string;
}

export interface RegistrationEligibilityData {
  registration_method:
    | 'Online Form'
    | 'UniVibe Registration'
    | 'Email'
    | 'Offline Registration'
    | 'External Registration Link'
    | 'Other';
  registration_window: string;
  participant_eligibility: string;
  eligibility_restrictions?: string;
  participation_mode: 'Individual' | 'Team' | 'Both';
  team_size_range?: string;
  registration_fee: string | number;
  selection_process:
    | 'First Come, First Served'
    | 'Screening'
    | 'Interview'
    | 'Audition'
    | 'Merit-Based'
    | 'Random Selection'
    | 'Invitation'
    | 'No Selection Process';
  max_registration_capacity: number;
  waitlist_availability: 'Yes' | 'No' | 'To Be Decided';
  certificate_document_requirements?: string;
}

export interface SectionAiOutputs {
  summarized_event_details?: string;
  audience_summarization?: string;
  date_finalization?: {
    analysis: string;
    flags: string[];
    recommendations: string;
  };
  other_information_summarization?: {
    budget_summary: string;
    financial_constraints: string;
    venue_logistics: string;
    infrastructure: string;
    manpower: string;
    external_support: string;
  };
  objective_intelligence_report?: {
    primary_objectives: string;
    secondary_objectives: string;
    vague_objectives_identified: string[];
    measurable_improvements: string[];
    proposed_kpis: string[];
    ai_proposed_targets: string[];
    committee_approved_targets: string[];
    theme_mismatches_flagged: string[];
    improvement_recommendations: string[];
  };
  registration_intelligence_report?: {
    date_validations: string[];
    capacity_vs_expected_analysis: string;
    eligibility_policy: string;
    missing_information: string[];
    student_onboarding_steps: string[];
    contradictions_flagged: string[];
  };
}

export interface FinalEventIntelligenceReport {
  id: string;
  event_id: string;
  event_overview: string;
  audience_and_reach: string;
  timeline: string;
  resources_and_logistics: string;
  strategic_objectives: string;
  kpis_and_expected_outcomes: string;
  registration_policy: string;
  missing_information: string[];
  potential_risks: string[];
  ai_recommendations: string[];
  event_readiness_assessment: {
    readiness_score: number; // 0 to 100
    verdict: string;
    critical_action_items: string[];
  };
  section_summaries: SectionAiOutputs;
  generated_at: string;
}

export interface OrganizerEvent {
  id: string;
  organizer_id: string;
  basics: EventBasicsData;
  audience: AudienceReachData;
  timeline: TimelineData;
  logistics: ResourcesLogisticsData;
  objectives: StrategicObjectivesData;
  registration: RegistrationEligibilityData;
  section_ai_outputs: SectionAiOutputs;
  final_report?: FinalEventIntelligenceReport;
  status: EventLifecycleStatus;
  current_wizard_section?: number;
  public_event_id?: string;
  created_at: string;
  updated_at: string;
}



