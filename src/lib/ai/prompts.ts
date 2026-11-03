// UniVibe System Prompts & Guardrails (PartyRock Workflow Specifications)

export const UNIVIBE_SYSTEM_GUARDRAILS = `
You are the UniVibe Student Intelligence Engine.
You operate under strict safety, transparency, and accuracy rules:
1. NEVER invent facts or past accomplishments about the student.
2. Clearly label all inferences regarding personality or potential as AI-derived tendencies, not scientific psychological facts.
3. NEVER fabricate university clubs, faculty contacts, application deadlines, URLs, or real phone numbers.
4. Ground all recommendations in verified campus options or explicitly mark them as "Suggested Opportunity Type — Verification Required".
5. Ground all outreach emails in the student's actual skills and stated interests.
6. Provide clear, honest rationales for any scores or suggestions.
`;

export function buildProfilePrompt(data: {
  student_name: string;
  department: string;
  year: string;
  interests: string[];
  skills: string[];
  free_time: string;
  goal: string;
  tone: string;
}): string {
  return `
Analyze this university student's profile and generate their UniVibe Intelligence Profile:
- Student Name: ${data.student_name}
- Department: ${data.department}
- Academic Year: ${data.year}
- Personal Interests: ${data.interests.join(", ")}
- Documented Skills: ${data.skills.join(", ")}
- Available Free Time: ${data.free_time}
- Career & Campus Goal: ${data.goal}
- Communication Tone: ${data.tone}

Output format must be valid JSON with the following structure:
{
  "archetype": "string (e.g. 'The Systems Architect & Builder')",
  "archetype_tagline": "string (one impactful sentence)",
  "archetype_description": "string (honest, empowering analysis of how their skills and interests align)",
  "ranked_interests": [
    { "name": "string", "relevance_reason": "string", "rank": 1 }
  ],
  "hidden_strengths": [
    { "strength": "string", "evidence": "string based on their inputs", "how_to_leverage": "string" }
  ],
  "growth_opportunities": [
    { "area": "string", "rationale": "string", "high_impact_step": "string" }
  ],
  "engagement_style": "string (e.g. 'Focused Builder with Collaborative Tendency')",
  "scores": {
    "technical_potential": 85,
    "creativity": 78,
    "leadership": 70,
    "networking": 65,
    "innovation": 88,
    "campus_engagement": 72
  },
  "score_explanations": [
    { "factor": "Technical Potential", "score": 85, "rationale": "Directly grounded in..." }
  ],
  "level_up_mission": {
    "title": "string",
    "objective": "string",
    "estimated_time": "string",
    "first_action": "string",
    "difficulty": "Intermediate"
  },
  "ai_tendencies_disclaimer": "These scores and archetypes are heuristic AI inferences derived solely from your provided inputs. They indicate current tendencies and growth avenues rather than fixed psychometric measures."
}
`;
}

export function buildMatchPrompt(
  profile: any,
  verifiedCampusData: any[]
): string {
  return `
Generate 5 ranked campus opportunity recommendations for:
Student: ${profile.student_name} (${profile.department}, Year ${profile.year})
Interests: ${Array.isArray(profile.interests) ? profile.interests.join(", ") : profile.interests}
Skills: ${Array.isArray(profile.skills) ? profile.skills.join(", ") : profile.skills}
Goal: ${profile.goal}
Available Time: ${profile.free_time}

Available Campus Catalog:
${JSON.stringify(verifiedCampusData, null, 2)}

Requirements:
- Pick or synthesize 5 distinct recommendations across categories (Hackathons, Technical clubs, Cultural events, Volunteering, Research, Entrepreneurship, Internships, Workshops, Competitions, Networking).
- If matched with a verified catalog item, set "verification_status": "VERIFIED" and preserve real contact details.
- If suggesting a general opportunity type, set "verification_status": "SUGGESTED" and label it "Suggested Opportunity Type — Verification Required". NEVER invent specific clubs or fake websites.
- Highlight 1 single best match with "is_best_match": true.
- Output a 7-day personalized onboarding mission.

Return valid JSON:
{
  "recommendations": [
    {
      "id": "match-1",
      "opportunity_name": "string",
      "category": "Hackathons",
      "match_score": 94,
      "why_it_matches": "string",
      "skills_gained": ["skill1", "skill2"],
      "time_commitment": "string",
      "career_impact": "string",
      "first_action": "string",
      "eligibility": "string",
      "verification_status": "VERIFIED" or "SUGGESTED",
      "verification_details": "string",
      "is_best_match": true
    }
  ],
  "best_match_id": "match-1",
  "seven_day_mission": {
    "mission_title": "string",
    "daily_actions": [
      { "day": 1, "action": "string", "outcome": "string" }
    ]
  },
  "heuristic_explanation": "Match scores are calculated based on interest relevance, skill synergies, and time availability fit."
}
`;
}

