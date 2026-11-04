import {
  StudentProfile,
  UniVibeProfileResult,
  MatchAIResult,
  GapAnalysisResult,
  StudentJourneyResult,
  OutreachGenerationResult,
  EventMarketingResult,
  GeneratedPoster,
  ConciergeMessage,
  OpportunityRecommendation,
  OpportunityCategory
} from "@/types";

export class SimulatedAiProvider {
  // Module A: UniVibe Profile
  static generateProfile(profile: StudentProfile): UniVibeProfileResult {
    const skillsLower = profile.skills.map((s) => s.toLowerCase());
    const interestsLower = profile.interests.map((i) => i.toLowerCase());

    const hasTech = skillsLower.some((s) => s.includes("code") || s.includes("python") || s.includes("java") || s.includes("web") || s.includes("ai") || s.includes("data"));
    const hasDesign = skillsLower.some((s) => s.includes("design") || s.includes("figma") || s.includes("photoshop") || s.includes("ui"));
    const hasLeadership = skillsLower.some((s) => s.includes("lead") || s.includes("speak") || s.includes("manage") || s.includes("organize"));

    let archetype = "The Interdisciplinary Campus Innovator";
    let archetypeTagline = "Bridging technical execution with creative campus impact.";
    let archetypeDescription = `As a ${profile.year || "driven"} student in ${profile.department || "University"}, you exhibit a potent mix of ${profile.skills.slice(0, 2).join(" and ") || "foundational problem solving"} with an intrinsic ambition toward "${profile.goal}". Your profile indicates high adaptability across multidisciplinary team environments.`;

    if (hasTech && hasDesign) {
      archetype = "The Full-Spectrum Creative Technologist";
      archetypeTagline = "Transforming complex code into intuitive, human-centered experiences.";
    } else if (hasTech && hasLeadership) {
      archetype = "The Algorithmic Team Catalyst";
      archetypeTagline = "Spearheading engineering sprints while rallying peers toward ambitious milestones.";
    } else if (hasLeadership) {
      archetype = "The Campus Community Architect";
      archetypeTagline = "Connecting minds, mobilizing student talent, and amplifying collective voice.";
    } else if (hasTech) {
      archetype = "The Deep-Tech Systems Builder";
      archetypeTagline = "Relentlessly architecting robust solutions for high-stakes problem spaces.";
    }

    // Scores calculation heuristic
    const techScore = Math.min(95, Math.max(62, (hasTech ? 88 : 68) + Math.floor(profile.skills.length * 2.5)));
    const creativeScore = Math.min(96, Math.max(65, (hasDesign ? 91 : 72) + Math.floor(profile.interests.length * 3)));
    const leadershipScore = Math.min(94, Math.max(60, (hasLeadership ? 89 : 68) + (profile.tone === "Confident" ? 8 : 4)));
    const networkingScore = Math.min(95, Math.max(58, (profile.tone === "Friendly" || profile.tone === "Enthusiastic" ? 86 : 70) + (profile.free_time.includes("hour") ? 4 : 2)));
    const innovationScore = Math.min(98, Math.max(70, Math.floor((techScore + creativeScore) / 2) + 6));
    const campusScore = Math.min(92, Math.max(60, Math.floor((leadershipScore + networkingScore) / 2) + 5));

    const rankedInterests = profile.interests.map((interest, idx) => ({
      name: interest,
      rank: idx + 1,
      relevance_reason: `Directly complements your current trajectory toward ${profile.goal} and provides practical campus collaboration leverage.`,
    }));

    const hiddenStrengths = [
      {
        strength: `Cross-Domain Synthesis (${profile.skills[0] || "Core Competency"} + ${profile.interests[0] || "Creative Interest"})`,
        evidence: `Your ability to balance rigorous ${profile.department} coursework while exploring ${profile.interests.slice(0, 2).join(", ")}.`,
        how_to_leverage: "Position yourself as the bridge person in hackathons or multidisciplinary project teams who understands both theory and execution.",
      },
      {
        strength: `${profile.tone} Communication Momentum`,
        evidence: `Your preferred ${profile.tone.toLowerCase()} conversational stance accelerates peer buy-in without creating unnecessary resistance.`,
        how_to_leverage: "Lead initial outreach to faculty lab leads, alumni mentors, and student club coordinators.",
      },
      {
        strength: "Structured Bandwidth Utilization",
        evidence: `Allocating ${profile.free_time} strategically shields your GPA while guaranteeing steady weekly campus project progress.`,
        how_to_leverage: "Commit to high-leverage asynchronous sprints rather than shallow multi-club presence.",
      },
    ];

    const growthOpportunities = [
      {
        area: "Public Domain Building & Visibility",
        rationale: "High internal competence needs outward campus documentation to unlock inbound faculty and peer opportunities.",
        high_impact_step: "Publish a concise project retrospective or GitHub showcase at least once every 45 days.",
      },
      {
        area: "Strategic Senior Mentorship",
        rationale: "Tapping 3rd/4th year students or alumni who achieved your target goal will save months of trial-and-error.",
        high_impact_step: "Conduct two 15-minute coffee chats using Outreach Copilot templates this semester.",
      },
    ];

    return {
      id: "ai-profile-" + Date.now(),
      user_id: profile.id,
      archetype,
      archetype_tagline: archetypeTagline,
      archetype_description: archetypeDescription,
      ranked_interests: rankedInterests,
      hidden_strengths: hiddenStrengths,
      growth_opportunities: growthOpportunities,
      engagement_style: `${profile.tone} Builder with High Collaborative Intent`,
      scores: {
        technical_potential: techScore,
        creativity: creativeScore,
        leadership: leadershipScore,
        networking: networkingScore,
        innovation: innovationScore,
        campus_engagement: campusScore,
      },
      score_explanations: [
        {
          factor: "Technical Potential",
          score: techScore,
          rationale: `Grounded in your declared technical skills (${profile.skills.slice(0, 3).join(", ")}) and ${profile.department} curriculum alignment.`,
        },
        {
          factor: "Creativity",
          score: creativeScore,
          rationale: `Reflects divergent interests in ${profile.interests.slice(0, 3).join(", ")} and ability to connect disparate campus concepts.`,
        },
        {
          factor: "Leadership",
          score: leadershipScore,
          rationale: `Derived from your ${profile.tone.toLowerCase()} delivery orientation and stated goal to drive tangible milestones.`,
        },
        {
          factor: "Networking",
          score: networkingScore,
          rationale: `Estimated velocity of connection based on ${profile.tone} tone and current commitment schedule (${profile.free_time}).`,
        },
        {
          factor: "Innovation",
          score: innovationScore,
          rationale: `Synthesis score highlighting intersection of technical proficiency and creative risk tolerance.`,
        },
        {
          factor: "Campus Engagement Potential",
          score: campusScore,
          rationale: `Projected institutional impact based on your available bandwidth and proactive interest mix.`,
        },
      ],
      level_up_mission: {
        title: "The Campus Signature Project Sprint",
        objective: `Deliver one publicly demonstrable artifact that combines ${profile.skills[0] || "your top skill"} with ${profile.interests[0] || "a campus need"} within 21 days.`,
        estimated_time: profile.free_time || "4-5 hours/week",
        first_action: "Outline the 1-page spec and invite 1 peer collaborator using Outreach Copilot.",
        difficulty: "Intermediate",
      },
      ai_tendencies_disclaimer:
        "These scores and archetypes are heuristic AI inferences derived directly from your self-reported inputs. They reflect directional growth opportunities and current tendencies rather than immutable psychological metrics.",
      status: "completed",
      generated_at: new Date().toISOString(),
    };
  }

  // Module B: UniVibe Match AI (Grounded in Live Campus Database Events)
  static generateMatches(
    profile: StudentProfile,
    aiProfile: UniVibeProfileResult,
    campusEvents: any[] = []
  ): MatchAIResult {
    const recommendations: OpportunityRecommendation[] = [];

    // Filter valid active/published events
    const activeEvents = (campusEvents || []).filter((e: any) => {
      const status = (e.event_status || e.status || "").toLowerCase();
      return !status.includes("draft") && !status.includes("planning");
    });

    activeEvents.forEach((evt: any, idx: number) => {
      const cat = evt.category || "Hackathons";
      let oppCategory: OpportunityCategory = "Hackathons";
      const catLower = cat.toLowerCase();
      if (catLower.includes("hack")) oppCategory = "Hackathons";
      else if (catLower.includes("workshop")) oppCategory = "Workshops";
      else if (catLower.includes("cultur")) oppCategory = "Cultural events";
      else if (catLower.includes("tech")) oppCategory = "Technical clubs";
      else if (catLower.includes("compet") || catLower.includes("sport") || catLower.includes("gaming")) oppCategory = "Competitions";
      else if (catLower.includes("entrepreneur") || catLower.includes("startup")) oppCategory = "Entrepreneurship";
      else if (catLower.includes("research")) oppCategory = "Research opportunities";
      else if (catLower.includes("intern")) oppCategory = "Internships";
      else oppCategory = "Networking";

      // Dynamic match score calculation
      let score = 88;
      const textToMatch = `${evt.name} ${evt.description || ""} ${cat}`.toLowerCase();

      if (profile.skills && profile.skills.some((s: string) => textToMatch.includes(s.toLowerCase()))) {
        score += 4;
      }
      if (profile.interests && profile.interests.some((i: string) => textToMatch.includes(i.toLowerCase()))) {
        score += 3;
      }
      if (catLower.includes("hack") || catLower.includes("ai")) {
        score += 2;
      }
      if (idx === 0) score = Math.max(score, 96);
      if (score > 98) score = 98;

      const topSkills = (profile.skills && profile.skills.length > 0)
        ? profile.skills.slice(0, 2).join(" & ")
        : "technical capabilities";
      const studentGoal = profile.goal || "expand your campus tech footprint";
      const whyItMatches = `Directly tests and expands your ${topSkills} in a fast-paced environment tailored for your goal to ${studentGoal}.`;

      let skillsGained = ["Generative AI", "AWS Bedrock", "Rapid Prototyping", "Full-Stack System Design"];
      if (catLower.includes("workshop")) {
        skillsGained = ["Cloud Architecture", "Applied AI Inference", "Technical Integration"];
      } else if (catLower.includes("cultur")) {
        skillsGained = ["Campus Leadership", "Creative Direction", "Public Communication"];
      } else if (catLower.includes("tech")) {
        skillsGained = ["Systems Engineering", "Rapid Problem Solving", "Code Collaboration"];
      } else if (catLower.includes("entrepreneur")) {
        skillsGained = ["Product Strategy", "Venture Economics", "User Research"];
      }

      const eventDateStr = evt.start_datetime || evt.event_date || "Upcoming Schedule";
      const formattedDate = eventDateStr.includes("T") ? eventDateStr.split("T")[0] : eventDateStr;
      const timeCommitment = `Scheduled for ${formattedDate} • ${evt.event_mode || evt.format || "Offline"} at ${evt.venue || "Campus Auditorium"}`;

      const careerImpact = `Direct resume-building showcase with peer collaboration, faculty evaluation, and networking with ${evt.contact_information || evt.organizer || "campus organizers"}.`;

      const deadline = evt.registration_deadline ? (evt.registration_deadline.includes("T") ? evt.registration_deadline.split("T")[0] : evt.registration_deadline) : "the event start date";
      const firstAction = `Register via the UniVibe Events Hub before ${deadline} to confirm your spot.`;

      recommendations.push({
        id: `opp-${evt.id}`,
        opportunity_name: evt.name,
        category: oppCategory,
        match_score: score,
        why_it_matches: whyItMatches,
        skills_gained: skillsGained,
        time_commitment: timeCommitment,
        career_impact: careerImpact,
        first_action: firstAction,
        eligibility: evt.eligibility || "Open to all enrolled students",
        verification_status: "VERIFIED",
        verification_details: `Verified Campus Event organized by ${evt.contact_information || evt.organizer || "JIS University"}. Venue: ${evt.venue || "Campus Main Hall"}.`,
        is_best_match: false,
        is_saved: evt.is_saved || false,
      });
    });

    recommendations.sort((a, b) => b.match_score - a.match_score);
    if (recommendations.length > 0) {
      recommendations[0].is_best_match = true;
    }

    const topOpp = recommendations[0];
    const bestMatchId = topOpp ? topOpp.id : "";
    const topEventName = topOpp ? topOpp.opportunity_name : "Active Campus Programs";

    const sevenDayMission = {
      mission_title: `The 7-Day Campus Traction Ignition: ${topEventName}`,
      daily_actions: [
        { day: 1, action: `Review ${topEventName} details, rules, and problem tracks.`, outcome: "Target track and objectives selected." },
        { day: 2, action: "Audit your GitHub or portfolio to showcase your relevant skills.", outcome: "Profile polished and ready for teammates." },
        { day: 3, action: "Use Outreach Copilot to invite prospective team members or study partners.", outcome: "First collaborator connection initiated." },
        { day: 4, action: "Formulate your project thesis or solution architecture.", outcome: "Clear strategy aligned with event guidelines." },
        { day: 5, action: "Check required materials and tools needed for the event.", outcome: "Development environment configured." },
        { day: 6, action: "Lock your official UniVibe registration pass and review venue details.", outcome: "Official spot secured in the campus catalog." },
        { day: 7, action: "Finalize your preparation and celebrate taking action on campus.", outcome: "Momentum established." },
      ],
    };

    return {
      id: "match-result-" + Date.now(),
      user_id: profile.id,
      recommendations,
      best_match_id: bestMatchId,
      seven_day_mission: sevenDayMission,
      heuristic_explanation:
        "Rankings are dynamically grounded in verified university events in the database and vector-matched to your skillset and career goals.",
      generated_at: new Date().toISOString(),
    };
  }

  // Module C: Opportunity Gap Analyzer
  static generateGapAnalysis(profile: StudentProfile, aiProfile: UniVibeProfileResult, matchAi: MatchAIResult): GapAnalysisResult {
    return {
      id: "gap-analysis-" + Date.now(),
      user_id: profile.id,
      blind_spots: [
        {
          area: "Over-Indexing on Solo Technical Execution",
          what_is_missing: "Your profile shows strong individual builder drive but minimal public documentation of team leadership or cross-disciplinary coordination.",
          why_it_matters: "Campus recruiters and incubator judges prioritize candidates who can communicate system architecture to non-technical stakeholders and manage team dynamics.",
          action_to_address: `In your upcoming project for ${matchAi.recommendations[0]?.opportunity_name || "the hackathon"}, volunteer to own cross-functional integration and the final live demo.`,
        },
        {
          area: "Underestimating Faculty Network Clout",
          what_is_missing: "Rarely engaging professors outside standard office hours or syllabus inquiries.",
          why_it_matters: "Over 65% of top campus research stipends, lab fellowships, and off-campus corporate recommendations originate directly through faculty relationships.",
          action_to_address: "Book one 10-minute slot during faculty office hours to ask about their latest published paper in relation to your interests.",
        },
      ],
      missing_skills: [
        {
          skill: "System Design & Cloud Architecture Pitching",
          category: "Technical",
          industry_context: "Moving beyond writing isolated scripts to designing scalable, deployable distributed components.",
          fastest_way_to_acquire: "Deploy one full-stack app with database persistence and AWS serverless primitives within the next 3 weeks.",
        },
        {
          skill: "Asynchronous Stakeholder Negotiation",
          category: "Soft",
          industry_context: "Aligning team priorities across disparate student schedules without endless, unproductive in-person meetings.",
          fastest_way_to_acquire: "Standardize your project updates using 3-bullet async memos (What got done, What's blocked, What's next).",
        },
        {
          skill: "Personal Narrative Positioning",
          category: "Strategic",
          industry_context: "Explaining 'why this project matters' in 30 seconds rather than getting bogged down in low-level syntax details.",
          fastest_way_to_acquire: "Practice the STAR framework elevator pitch with the Outreach Copilot tips.",
        },
      ],
      cross_field_connections: [
        {
          connection_title: `${profile.department} + Creative Storytelling & Product UI`,
          field_a: `${profile.department} Technical Rigor`,
          field_b: "Cognitive Ergonomics & Interface Aesthetics",
          hybrid_advantage: "Engineers who possess polished visual taste command immediate authority in hackathons and startup investor pitches.",
        },
        {
          connection_title: "Campus Community Data + Predictive Intelligence",
          field_a: "Student Behavioral Data",
          field_b: "Generative AI Systems",
          hybrid_advantage: "Building tools that solve authentic campus frictions (course swapping, study group matching, event discovery) turns you into a recognized campus builder.",
        },
      ],
      campus_fomo_risk: {
        level: "Moderate",
        explanation: `With your commitment of "${profile.free_time}", attempting to attend every general club mixer will dilute your energy without producing meaningful artifacts.`,
        antidote: "Practice Ruthless Prioritization: Dedicate 80% of extra-curricular time to your 1 flagship commitment and 20% to exploratory serendipity.",
      },
      bold_ambitious_move: {
        title: "Found or Co-Lead a High-Impact Campus Technical Initiative",
        vision: `Instead of joining 4 different general interest groups, launch a dedicated specialized working group (e.g. Campus GenAI Lab or Open Source Guild sprint) centered on your goal to ${profile.goal}.`,
        potential_breakthrough: "Instantly positions you as a focal campus leader, attracting high-caliber peers and direct faculty advisory sponsorship.",
        execution_steps: [
          "Identify 3 students with complementary skills (design, marketing, backend).",
          "Draft a 2-page charter outlining a tangible semester deliverable.",
          "Secure faculty endorsement using the Outreach Copilot academic proposal email.",
        ],
        calculated_risk: "Requires taking early ownership before outcomes are guaranteed; mitigated by keeping initial scope tightly scoped to 6 weeks.",
      },
      generated_at: new Date().toISOString(),
    };
  }

  // Module D: UniVibe Journey AI
  static generateJourney(profile: StudentProfile, aiProfile: UniVibeProfileResult, matchAi: MatchAIResult): StudentJourneyResult {
    const journeyId = "journey-" + Date.now();

    const phase1Milestones = [
      {
        id: "m-101",
        journey_id: journeyId,
        phase: "PHASE 1 — START" as const,
        phase_number: 1 as const,
        time_horizon: "Next 7 days" as const,
        title: "Audit Profile & GitHub/Portfolio Showcase",
        description: "Align your public student resume and GitHub pinned repos with your top skills and target goal.",
        deadline: "Day 3",
        completed: false,
        sequence_order: 1,
      },
      {
        id: "m-102",
        journey_id: journeyId,
        phase: "PHASE 1 — START" as const,
        phase_number: 1 as const,
        time_horizon: "Next 7 days" as const,
        title: `Register for ${matchAi.recommendations[0]?.opportunity_name || "Apex Hackathon"}`,
        description: "Review competition rules, deadlines, and initiate team roster creation.",
        deadline: "Day 5",
        completed: false,
        sequence_order: 2,
      },
      {
        id: "m-103",
        journey_id: journeyId,
        phase: "PHASE 1 — START" as const,
        phase_number: 1 as const,
        time_horizon: "Next 7 days" as const,
        title: "Execute First Peer Outreach via Copilot",
        description: "Send 2 connection requests to potential project collaborators using the generated WhatsApp or LinkedIn DM.",
        deadline: "Day 7",
        completed: false,
        sequence_order: 3,
      },
    ];

    const phase2Milestones = [
      {
        id: "m-201",
        journey_id: journeyId,
        phase: "PHASE 2 — CONNECT" as const,
        phase_number: 2 as const,
        time_horizon: "Next 30 days" as const,
        title: "Attend Open Source Guild Lab & Lock Sprint Role",
        description: "Contribute to at least one active repository or sprint backlog discussion.",
        deadline: "Week 2",
        completed: false,
        sequence_order: 4,
      },
      {
        id: "m-202",
        journey_id: journeyId,
        phase: "PHASE 2 — CONNECT" as const,
        phase_number: 2 as const,
        time_horizon: "Next 30 days" as const,
        title: "Engage One Faculty Research Lead in Office Hours",
        description: "Conduct an exploratory 15-minute conversation regarding ongoing lab initiatives.",
        deadline: "Week 3",
        completed: false,
        sequence_order: 5,
      },
      {
        id: "m-203",
        journey_id: journeyId,
        phase: "PHASE 2 — CONNECT" as const,
        phase_number: 2 as const,
        time_horizon: "Next 30 days" as const,
        title: "Host or Co-Host a 45-Minute Micro Study Jam",
        description: `Organize a peer session covering ${profile.skills[0] || "core technical concept"} for junior peers.`,
        deadline: "Week 4",
        completed: false,
        sequence_order: 6,
      },
    ];

    const phase3Milestones = [
      {
        id: "m-301",
        journey_id: journeyId,
        phase: "PHASE 3 — BUILD" as const,
        phase_number: 3 as const,
        time_horizon: "Next 3 months" as const,
        title: "Ship Functional MVP of Signature Campus Project",
        description: "Deploy a live production build with active authentication, database persistence, and clean UI.",
        deadline: "Month 2",
        completed: false,
        sequence_order: 7,
      },
      {
        id: "m-302",
        journey_id: journeyId,
        phase: "PHASE 3 — BUILD" as const,
        phase_number: 3 as const,
        time_horizon: "Next 3 months" as const,
        title: "Compete in Major Regional or National Hackathon",
        description: "Complete full project submission and live pitch presentation to industry judges.",
        deadline: "Month 3",
        completed: false,
        sequence_order: 8,
      },
      {
        id: "m-303",
        journey_id: journeyId,
        phase: "PHASE 3 — BUILD" as const,
        phase_number: 3 as const,
        time_horizon: "Next 3 months" as const,
        title: "Publish In-Depth Engineering Retrospective",
        description: "Write an architecture case study breaking down technical hurdles, trade-offs, and lessons.",
        deadline: "Month 3",
        completed: false,
        sequence_order: 9,
      },
    ];

    const phase4Milestones = [
      {
        id: "m-401",
        journey_id: journeyId,
        phase: "PHASE 4 — LEVEL UP" as const,
        phase_number: 4 as const,
        time_horizon: "End of academic year" as const,
        title: "Secure Flagship Summer Tech Fellowship or Internship",
        description: `Convert your documented portfolio and campus track record toward your primary goal: ${profile.goal}.`,
        deadline: "End of Spring",
        completed: false,
        sequence_order: 10,
      },
      {
        id: "m-402",
        journey_id: journeyId,
        phase: "PHASE 4 — LEVEL UP" as const,
        phase_number: 4 as const,
        time_horizon: "End of academic year" as const,
        title: "Step into Recognized Campus Mentor / Lead Position",
        description: "Take on a club executive, tech guild lead, or lab mentorship role to guide the incoming cohort.",
        deadline: "Final Semester Review",
        completed: false,
        sequence_order: 11,
      },
    ];

    const totalMilestones = 11;
    const completedMilestones = 0;

    return {
      id: journeyId,
      user_id: profile.id,
      title: `${profile.student_name}'s Strategic Campus Impact Roadmap`,
      phases: [
        {
          phase_number: 1,
          phase_name: "PHASE 1 — START",
          time_horizon: "Next 7 days",
          focus: "Rapid alignment, initial registration, and peer outreach.",
          milestones: phase1Milestones,
        },
        {
          phase_number: 2,
          phase_name: "PHASE 2 — CONNECT",
          time_horizon: "Next 30 days",
          focus: "Community integration, faculty dialogue, and peer network building.",
          milestones: phase2Milestones,
        },
        {
          phase_number: 3,
          phase_name: "PHASE 3 — BUILD",
          time_horizon: "Next 3 months",
          focus: "Intensive project execution, live deployments, and case studies.",
          milestones: phase3Milestones,
        },
        {
          phase_number: 4,
          phase_name: "PHASE 4 — LEVEL UP",
          time_horizon: "End of academic year",
          focus: "Career conversion, institutional leadership, and sustainable mentorship.",
          milestones: phase4Milestones,
        },
      ],
      final_mission_challenge: {
        title: "The UniVibe Campus Vanguard Challenge",
        vision: `Architect, deploy, and publicly present an original software solution that actively solves a tangible workflow pain point for at least 50 fellow students on campus before the academic year concludes.`,
        measurable_outcomes: [
          "50+ active campus user validations",
          "Public GitHub repository with clean documentation & CI/CD",
          "Live demo showcased at the Annual Campus Innovation Expo",
        ],
        end_of_year_target: "Top 5% Campus Student Portfolio Recognition",
      },
      total_milestones: totalMilestones,
      completed_milestones: completedMilestones,
      progress_pct: 0,
      generated_at: new Date().toISOString(),
    };
  }

  // Module E: UniVibe Outreach Copilot
  static generateOutreach(
    profile: StudentProfile,
    opportunity: OpportunityRecommendation,
    tone: string = "Friendly"
  ): OutreachGenerationResult {
    const toneAdj = tone.toLowerCase();
    const skillsList = profile.skills.slice(0, 3).join(", ") || "software development and problem-solving";

    let emailSubject = `Inquiry regarding ${opportunity.opportunity_name} collaboration — ${profile.student_name} (${profile.department})`;
    let emailSalutation = "Dear Team / Coordinator,";
    let emailSignOff = `Warm regards,\n${profile.student_name}\n${profile.department}, Year ${profile.year}`;

    if (tone === "Professional") {
      emailSalutation = "Dear Admissions & Selection Committee / Event Leads,";
      emailSignOff = `Sincerely,\n${profile.student_name}\n${profile.department} | Student ID/Portfolio`;
    } else if (tone === "Enthusiastic") {
      emailSubject = `Excited to connect regarding ${opportunity.opportunity_name}! (${profile.student_name})`;
      emailSalutation = "Hi there!";
      emailSignOff = `Best wishes and look forward to building,\n${profile.student_name}`;
    }

    const emailBody = `I hope this message finds you well.

My name is ${profile.student_name}, a ${profile.year} student in ${profile.department}. I am writing to express my strong enthusiasm for ${opportunity.opportunity_name}.

My background centers on ${skillsList}, and my current focus is to ${profile.goal}. After reviewing the vision and requirements for ${opportunity.opportunity_name}, I am particularly energized by the prospect of contributing to high-impact problem spaces while expanding my hands-on abilities in ${opportunity.skills_gained.slice(0, 2).join(" and ")}.

I have scheduled bandwidth of ${profile.free_time} specifically allocated for this engagement, ensuring consistent and accountable participation.

Could you please advise on the recommended next steps for onboarding or team coordination? I would welcome the opportunity to discuss how I can contribute meaningfully.

Thank you very much for your time and guidance.`;

    const whatsappMessage = `Hey! 👋 This is ${profile.student_name} from ${profile.department} (Year ${profile.year}). I came across ${opportunity.opportunity_name} and was really impressed by the initiative. I work mostly with ${skillsList} and am super keen to get involved or team up. Let me know if you have a couple minutes to chat or connect on campus! 🚀`;

    const socialDm = `Hi! Reaching out from ${profile.department}. Love what you're doing with ${opportunity.opportunity_name}. I'm building projects around ${skillsList} and would love to connect and follow your updates!`;

    const followupMessage = `Hi again! Just following up on my earlier note regarding ${opportunity.opportunity_name}. I know schedules get packed on campus, so no worries at all if you're swamped. Whenever you have a quick moment, I'd still be thrilled to connect. Thanks! — ${profile.student_name}`;

    return {
      id: "outreach-" + Date.now(),
      user_id: profile.id,
      opportunity_name: opportunity.opportunity_name,
      tone: tone as any,
      professional_email: {
        subject: emailSubject,
        salutation: emailSalutation,
        body: emailBody,
        sign_off: emailSignOff,
      },
      whatsapp_message: whatsappMessage,
      social_dm: socialDm,
      followup_message: followupMessage,
      success_tips: [
        "Personalize the opening hook by referencing a specific recent project or announcement from the organizer.",
        "Keep your WhatsApp/DM under 60 words so it can be read in a single phone glance.",
        "Send your outreach between 10:30 AM and 2:00 PM on Tuesday through Thursday for peak campus response rates.",
      ],
      grounding_note:
        "All outreach templates strictly reference your confirmed skills and department. No email addresses or contact credentials have been fabricated. Replace bracketed placeholders before hitting send.",
      generated_at: new Date().toISOString(),
    };
  }

  // Module F: Event Marketing Generator
  static generateEventMarketing(
    userId: string,
    eventName: string,
    category: string,
    audience: string,
    description: string
  ): EventMarketingResult {
    return {
      id: "marketing-" + Date.now(),
      user_id: userId,
      event_name: eventName,
      category,
      audience,
      description,
      identity: {
        tagline: "Ignite Curiosity. Forge Connections. Build What's Next.",
        headline: `${eventName}: Where Campus Innovators Collide`,
        one_liner: `An immersive ${category.toLowerCase()} experience curated specifically for ${audience} eager to accelerate their craft.`,
        three_reasons_to_attend: [
          "Hands-On Breakthroughs: Transition from passive theory to shipping tangible artifacts alongside like-minded peers.",
          "High-Signal Mentorship: Direct access to experienced student seniors and industry leaders ready to review your work.",
          "Curated Networking: Connect with potential co-founders, collaborators, and friends who share your ambition.",
        ],
      },
      social_media: {
        instagram_caption: `Ready to level up your campus journey? 🚀✨

${eventName} is officially landing. If you're into ${category.toLowerCase()} and want to solve real challenges with the best creative minds on campus, this is where you belong.

📍 Venue: [Campus Innovation Hall / Room Placeholder]
🗓️ Date & Time: [Add Date & Time Placeholder]
🎟️ Registration: Link in bio / [Insert Portal URL]

Spots are limited to keep sessions intimate and impactful. Tag your project partner below! 👇`,
        whatsapp_announcement: `📢 *ATTENTION CAMPUS BUILDERS & STUDENTS!* 📢\n\nExcited to announce *${eventName}* — an exclusive ${category.toLowerCase()} event designed for ${audience}.\n\n🔥 *Why join?*\n• Practical hands-on collaboration\n• Connect with ambitious peers\n• Win certificates & project perks\n\n🗓 *Date:* [Insert Date]\n📍 *Venue:* [Insert Venue]\n🔗 *RSVP here:* [Insert Link]\n\nSeats fill fast — secure yours today! 🚀`,
        hashtags: [
          `#${eventName.replace(/\s+/g, "")}`,
          `#Campus${category.replace(/\s+/g, "")}`,
          "#UniVibe",
          "#CampusInnovation",
          "#StudentBuilders",
          "#UniversityTech",
          "#StudentHackers",
          "#FutureFounders",
          "#CollegeGrowth",
        ],
      },
      formal_communication: {
        professional_email: {
          subject: `Official Invitation: ${eventName} — [Date Placeholder]`,
          body: `Dear Campus Community & Faculty Leaders,

We are thrilled to announce the upcoming edition of ${eventName}, scheduled for [Insert Date] at [Insert Venue].

Designed with a mission to empower ${audience}, this ${category.toLowerCase()} initiative brings together motivated students to explore practical challenges, collaborate on interdisciplinary solutions, and engage with key campus resources.

Key Highlights:
- Curated keynote and hands-on sprint sessions
- Peer project showcase and collaborative feedback
- Networking reception with campus organizers

Registration details, agenda, and guidelines are available via [Insert Registration Link].

We warmly invite you to circulate this announcement among your student cohorts.

Sincerely,
The ${eventName} Organizing Team`,
        },
        campus_notice: `CAMPUS BULLETIN: ${eventName.toUpperCase()} ANNOUNCEMENT\n\nAll students interested in ${category} are invited to participate in ${eventName}. The event will feature collaborative workshops, project showcases, and student mentorship.\n\nDate: [Date Placeholder]\nLocation: [Venue Placeholder]\nEligibility: ${audience}\nNotice Board Reference: UNIVIBE-EVT-${Math.floor(1000 + Math.random() * 9000)}`,
      },
      engagement_strategy: {
        promotion_ideas: [
          "Campus Micro-Drop: Post short 15-second teaser reels highlighting the interactive challenge tracks.",
          "Peer Referral Perks: Offer priority workshop seating for attendees who RSVP with a teammate.",
          "Faculty Endorsement: Request professors to share the 1-slide announcement in the first 2 minutes of major lectures.",
        ],
        participation_boosters: [
          "Interactive Live Polling during opening remarks to customize breakout tracks on the fly.",
          "Digital Badges & Verified LinkedIn Certificates powered by student guilds.",
          "Post-Event Showcase: Feature top 3 student team outputs on the university campus blog.",
        ],
        campaign_idea: `The '#WhyIBuild' Story Sprint: Spotlight 3 student participants in the week leading up to ${eventName} sharing their personal campus projects.`,
        event_slogan: `Code. Create. Connect. Your campus, your vibe.`,
      },
      generated_at: new Date().toISOString(),
    };
  }

  // Module G: Event Poster Generator
  static generatePoster(
    userId: string,
    eventName: string,
    category: string,
    isDemoMode: boolean = true
  ): GeneratedPoster {
    // Generate deterministic rich futuristic gradient preview poster with modern typography
    const encodedSvg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="800" height="1000">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0B0813"/>
            <stop offset="40%" stop-color="#1A1235"/>
            <stop offset="80%" stop-color="#2D124D"/>
            <stop offset="100%" stop-color="#0F091F"/>
          </linearGradient>
          <radialGradient id="glow" cx="50%" cy="30%" r="60%">
            <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.45"/>
            <stop offset="70%" stop-color="#7C3AED" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </radialGradient>
          <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="15" result="blur"/>
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"/>
          </filter>
        </defs>

        <!-- Background -->
        <rect width="800" height="1000" fill="url(#bg)"/>
        <rect width="800" height="1000" fill="url(#glow)"/>

        <!-- Grid lines decoration -->
        <g stroke="#8B5CF6" stroke-opacity="0.12" stroke-width="1">
          <line x1="80" y1="0" x2="80" y2="1000"/>
          <line x1="720" y1="0" x2="720" y2="1000"/>
          <line x1="0" y1="120" x2="800" y2="120"/>
          <line x1="0" y1="880" x2="800" y2="880"/>
        </g>

        <!-- Header Tag -->
        <rect x="80" y="60" width="180" height="34" rx="17" fill="#8B5CF6" fill-opacity="0.2" stroke="#8B5CF6" stroke-opacity="0.4"/>
        <text x="170" y="82" fill="#C4B5FD" font-family="system-ui, sans-serif" font-size="13" font-weight="700" letter-spacing="2" text-anchor="middle">UNIVIBE CAMPUS</text>
        <text x="720" y="82" fill="#A78BFA" font-family="system-ui, sans-serif" font-size="13" font-weight="600" text-anchor="end">${category.toUpperCase()}</text>

        <!-- Decorative Futuristic Orb -->
        <circle cx="400" cy="400" r="180" fill="none" stroke="#C4B5FD" stroke-opacity="0.15" stroke-width="2" stroke-dasharray="8 6"/>
        <circle cx="400" cy="400" r="140" fill="#7C3AED" fill-opacity="0.12" stroke="#A78BFA" stroke-opacity="0.3" stroke-width="1.5"/>
        <circle cx="400" cy="400" r="80" fill="#8B5CF6" fill-opacity="0.25"/>

        <!-- Event Title -->
        <text x="400" y="390" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="44" font-weight="900" text-anchor="middle" letter-spacing="-1">
          ${eventName.length > 22 ? eventName.substring(0, 20) + "..." : eventName}
        </text>
        <text x="400" y="435" fill="#DDD6FE" font-family="system-ui, sans-serif" font-size="18" font-weight="500" text-anchor="middle" letter-spacing="3">
          CAMPUS INNOVATION SUMMIT
        </text>

        <!-- Glassmorphism Detail Card -->
        <rect x="100" y="620" width="600" height="220" rx="20" fill="#130F26" fill-opacity="0.7" stroke="#8B5CF6" stroke-opacity="0.3" stroke-width="1.5"/>
        
        <!-- Info Columns -->
        <g fill="#A78BFA" font-family="system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="1.5">
          <text x="140" y="670">DATE &amp; TIME</text>
          <text x="350" y="670">LOCATION</text>
          <text x="560" y="670">REGISTRATION</text>
        </g>
        <g fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="700">
          <text x="140" y="705">[DATE TBD]</text>
          <text x="350" y="705">[CAMPUS HALL]</text>
          <text x="560" y="705">FREE RSVP</text>
        </g>
        <g fill="#9CA3AF" font-family="system-ui, sans-serif" font-size="13">
          <text x="140" y="730">10:00 AM – 5:00 PM</text>
          <text x="350" y="730">Main Innovation Hub</text>
          <text x="560" y="730">Limited Seating</text>
        </g>

        <!-- Bottom Callout -->
        <rect x="140" y="770" width="520" height="42" rx="10" fill="#8B5CF6" fill-opacity="0.25" stroke="#A78BFA" stroke-opacity="0.3"/>
        <text x="400" y="796" fill="#F3EFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="600" text-anchor="middle">
          Scan QR or visit univibe.campus/events to reserve your spot
        </text>

        <!-- Footer -->
        <text x="400" y="930" fill="#6B7280" font-family="system-ui, sans-serif" font-size="12" text-anchor="middle">
          POWERED BY UNIVIBE STUDENT INTELLIGENCE ENGINE • OFFICIAL CAMPUS INITIATIVE
        </text>
      </svg>
    `);

    const imageUrl = `data:image/svg+xml;utf8,${encodedSvg}`;

    return {
      id: "poster-" + Date.now(),
      user_id: userId,
      event_name: eventName,
      category,
      image_url: imageUrl,
      aspect_ratio: "4:5",
      prompt: `Futuristic university event poster for "${eventName}" (${category}). Modern glassmorphism, deep violet and midnight palette, glowing neon accents, clean typography, 4:5 portrait composition.`,
      model_used: isDemoMode ? "Simulated Canvas & SVG Vector Engine (Demo Mode)" : "bedrock-stability.stable-image-core-v1-1",
      is_demo_mode: isDemoMode,
      created_at: new Date().toISOString(),
    };
  }

  // Module H: Campus Concierge
  static generateConciergeResponse(
    userMessage: string,
    profile: StudentProfile,
    aiProfile?: UniVibeProfileResult,
    matchAi?: MatchAIResult
  ): ConciergeMessage {
    const qLower = userMessage.toLowerCase();

    let quickAnswer = `I'm analyzing your campus position as ${profile.student_name} (${profile.department}, Year ${profile.year}).`;
    let personalizedInsight = `With your core skills in ${profile.skills.slice(0, 2).join(" & ") || "engineering"} and your goal to "${profile.goal}", you are in a prime spot to expand your campus footprint.`;
    let whatToDoNext = "Review your Journey AI milestones and tackle the next pending action.";
    let univibeTip = "Focus on shipping 1 tangible public project rather than scattering your free time across disconnected clubs.";

    if (qLower.includes("hackathon") || qLower.includes("competition")) {
      quickAnswer = "The flagship campus event is the JIS Cloud AI Hackathon 2026, which is a verified event in your tech catalog.";
      personalizedInsight = `Given your interest in ${profile.interests[0] || "tech"} and your ${aiProfile?.scores.technical_potential || 85}/100 technical potential score, hackathons provide the fastest leverage to test your prototypes.`;
      whatToDoNext = "Use Outreach Copilot to draft a quick WhatsApp invitation to potential teammates and lock your registration.";
      univibeTip = "Form your team with complementary skillsets: 1 backend/system architect, 1 frontend/UI lead, and 1 presenter.";
    } else if (qLower.includes("internship") || qLower.includes("job") || qLower.includes("career")) {
      quickAnswer = "Campus research labs and student incubator projects convert into off-campus internship offers at twice the rate of cold LinkedIn applications.";
      personalizedInsight = `Your stated target is to "${profile.goal}". Building a live portfolio piece within your available ${profile.free_time} will set you apart from peers with identical course transcripts.`;
      whatToDoNext = "Complete Phase 1 and 2 of your Growth Journey roadmap to secure a verified faculty or guild recommendation.";
      univibeTip = "Always anchor your resume bullets around impact metrics rather than just listing course titles.";
    } else if (qLower.includes("club") || qLower.includes("society") || qLower.includes("network")) {
      quickAnswer = "For your profile, the Open Source & Creative Tech Guild offers the highest signal-to-time ratio on campus.";
      personalizedInsight = `Because your availability is ${profile.free_time}, avoid organizations that require 10+ hours of administrative overhead. The Guild runs weekly 2-hour sprints.`;
      whatToDoNext = "Check the Wednesday evening meetup in Room 402 Tech Wing or join their verified Discord channel.";
      univibeTip = "Introduce yourself by sharing one project idea or tool you are currently learning, not just your major.";
    } else if (qLower.includes("gap") || qLower.includes("weakness") || qLower.includes("improve")) {
      quickAnswer = "Your Gap Analysis highlights personal storytelling and asynchronous project leadership as your prime levers.";
      personalizedInsight = `While your technical potential (${aiProfile?.scores.technical_potential || 85}) is elevated, your public documentation score can be amplified.`;
      whatToDoNext = "Write a 3-bullet sprint recap for your next build and post it on your student portfolio or GitHub.";
      univibeTip = "Public documentation creates serendipity: people can't offer you opportunities for work they can't see.";
    }

    const content = `${quickAnswer}\n\n💡 Personalized Insight: ${personalizedInsight}\n\n👉 What To Do Next: ${whatToDoNext}\n\n✨ UniVibe Tip: ${univibeTip}`;

    return {
      id: "concierge-msg-" + Date.now(),
      conversation_id: "conv-default",
      sender: "assistant",
      content,
      structured_response: {
        quick_answer: quickAnswer,
        personalized_insight: personalizedInsight,
        what_to_do_next: whatToDoNext,
        univibe_tip: univibeTip,
      },
      created_at: new Date().toISOString(),
    };
  }
}

