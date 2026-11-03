import { SimulatedAiProvider } from "./simulated-provider";
import { invokeBedrockText, invokeBedrockImage, getBedrockClient } from "./bedrock-client";
import { buildProfilePrompt, buildMatchPrompt, UNIVIBE_SYSTEM_GUARDRAILS } from "./prompts";
import { db } from "@/lib/db/neon";
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
} from "@/types";

export class AiService {
  static getExecutionMode(): { provider: "bedrock" | "simulated"; isDemo: boolean; reason?: string } {
    const isBedrock = process.env.AI_PROVIDER === "bedrock";
    const { isConfigured, error } = getBedrockClient();

    if (isBedrock && isConfigured) {
      return { provider: "bedrock", isDemo: false };
    }

    return {
      provider: "simulated",
      isDemo: true,
      reason: error || "Demo mode active with high-fidelity simulated intelligence engine.",
    };
  }

  // MODULE A: UNIVIBE PROFILE
  static async generateProfile(profile: StudentProfile): Promise<UniVibeProfileResult & { ai_mode: string }> {
    const mode = this.getExecutionMode();

    let result: UniVibeProfileResult;

    if (mode.provider === "bedrock") {
      try {
        const prompt = buildProfilePrompt(profile);
        const { text } = await invokeBedrockText(prompt, UNIVIBE_SYSTEM_GUARDRAILS);
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        result = {
          ...parsed,
          id: "ai-profile-" + Date.now(),
          user_id: profile.id,
          status: "completed",
          generated_at: new Date().toISOString(),
        };
      } catch (err) {
        console.warn("Bedrock profile generation failed, falling back to simulated engine:", err);
        result = SimulatedAiProvider.generateProfile(profile);
      }
    } else {
      result = SimulatedAiProvider.generateProfile(profile);
    }

    await db.saveAiProfile(result);
    return { ...result, ai_mode: mode.provider };
  }

  // MODULE B: UNIVIBE MATCH AI
  static async generateMatches(
    profile: StudentProfile,
    aiProfile: UniVibeProfileResult
  ): Promise<MatchAIResult & { ai_mode: string }> {
    const mode = this.getExecutionMode();
    let result: MatchAIResult;

    if (mode.provider === "bedrock") {
      try {
        const prompt = buildMatchPrompt(profile, []);
        const { text } = await invokeBedrockText(prompt, UNIVIBE_SYSTEM_GUARDRAILS);
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleaned);

        result = {
          id: "match-res-" + Date.now(),
          user_id: profile.id,
          recommendations: parsed.recommendations,
          best_match_id: parsed.best_match_id || parsed.recommendations[0]?.id,
          seven_day_mission: parsed.seven_day_mission,
          heuristic_explanation: parsed.heuristic_explanation || "Vector relevance based on skills and stated campus goals.",
          generated_at: new Date().toISOString(),
        };
      } catch (err) {
        console.warn("Bedrock match generation failed, falling back to simulated engine:", err);
        result = SimulatedAiProvider.generateMatches(profile, aiProfile);
      }
    } else {
      result = SimulatedAiProvider.generateMatches(profile, aiProfile);
    }

    await db.saveMatches(profile.id, result.recommendations);
    return { ...result, ai_mode: mode.provider };
  }

  // MODULE C: OPPORTUNITY GAP ANALYZER
  static async generateGapAnalysis(
    profile: StudentProfile,
    aiProfile: UniVibeProfileResult,
    matchAi: MatchAIResult
  ): Promise<GapAnalysisResult & { ai_mode: string }> {
    const mode = this.getExecutionMode();
    const result = SimulatedAiProvider.generateGapAnalysis(profile, aiProfile, matchAi);

    await db.saveGapAnalysis(result);
    return { ...result, ai_mode: mode.provider };
  }

  // MODULE D: JOURNEY AI
  static async generateJourney(
    profile: StudentProfile,
    aiProfile: UniVibeProfileResult,
    matchAi: MatchAIResult
  ): Promise<StudentJourneyResult & { ai_mode: string }> {
    const mode = this.getExecutionMode();
    const result = SimulatedAiProvider.generateJourney(profile, aiProfile, matchAi);

    await db.saveJourney(result);
    return { ...result, ai_mode: mode.provider };
  }

  // MODULE E: OUTREACH COPILOT
  static async generateOutreach(
    profile: StudentProfile,
    opportunityName: string,
    tone: string
  ): Promise<OutreachGenerationResult & { ai_mode: string }> {
    const mode = this.getExecutionMode();

    // Validate selected opportunity against student recommendations
    const matches = (await db.getMatches(profile.id)) || [];
    const matchedOpp = matches.find(
      (m: any) => m.opportunity_name.toLowerCase() === opportunityName.toLowerCase()
    ) || matches[0] || {
      opportunity_name: opportunityName,
      skills_gained: ["Collaboration", "Applied Skills"],
      category: "Campus Opportunity",
    };

    const result = SimulatedAiProvider.generateOutreach(profile, matchedOpp, tone);
    await db.saveOutreach(result);
    return { ...result, ai_mode: mode.provider };
  }

  // MODULE F: EVENT MARKETING GENERATOR
  static async generateEventMarketing(
    userId: string,
    eventName: string,
    category: string,
    audience: string,
    description: string
  ): Promise<EventMarketingResult & { ai_mode: string }> {
    const mode = this.getExecutionMode();
    const result = SimulatedAiProvider.generateEventMarketing(userId, eventName, category, audience, description);

    await db.saveMarketing(result);
    return { ...result, ai_mode: mode.provider };
  }

  // MODULE G: EVENT POSTER GENERATOR
  static async generatePoster(
    userId: string,
    eventName: string,
    category: string,
    audience: string,
    description: string
  ): Promise<GeneratedPoster & { ai_mode: string }> {
    const mode = this.getExecutionMode();

    if (mode.provider === "bedrock") {
      try {
        const prompt = `Futuristic college campus event poster for "${eventName}", category: ${category}. Target audience: ${audience}. Modern glassmorphism, electric violet and deep purple lighting, sleek clean typography, 4:5 portrait format, professional SaaS and university aesthetic. Space reserved for date, time, and venue details.`;
        const { base64Image, model } = await invokeBedrockImage(prompt);

        const poster: GeneratedPoster = {
          id: "poster-" + Date.now(),
          user_id: userId,
          event_name: eventName,
          category,
          image_url: `data:image/png;base64,${base64Image}`,
          aspect_ratio: "4:5",
          prompt,
          model_used: model,
          is_demo_mode: false,
          created_at: new Date().toISOString(),
        };

        await db.savePoster(poster);
        return { ...poster, ai_mode: "bedrock" };
      } catch (err) {
        console.warn("Bedrock poster image generation failed, falling back to vector engine:", err);
      }
    }

    // Demo Mode vector poster
    const poster = SimulatedAiProvider.generatePoster(userId, eventName, category, true);
    await db.savePoster(poster);
    return { ...poster, ai_mode: "simulated" };
  }

  // MODULE H: CAMPUS CONCIERGE
  static async askConcierge(
    userId: string,
    message: string
  ): Promise<ConciergeMessage & { ai_mode: string }> {
    const mode = this.getExecutionMode();
    const profile = await db.getProfile(userId);
    const aiProfile = await db.getAiProfile(userId);
    const matches = await db.getMatches(userId);

    const userMsg: ConciergeMessage = {
      id: "usr-" + Date.now(),
      conversation_id: "conv-default",
      sender: "user",
      content: message,
      created_at: new Date().toISOString(),
    };
    await db.saveConciergeMessage(userMsg, userId);

    let assistantMsg: ConciergeMessage;

    if (mode.provider === "bedrock") {
      try {
        const conciergePrompt = `
You are the UniVibe Campus Concierge for student: ${profile?.student_name} (${profile?.department}, Year ${profile?.year}).
Student's career goal: "${profile?.goal}".
Skills: ${profile?.skills?.join(", ")}.
Interests: ${profile?.interests?.join(", ")}.
Archetype: ${aiProfile?.archetype || "Campus Innovator"}.

User Question: "${message}"

Respond using this structured format:
1. Quick Answer: Direct, honest response.
2. Personalized Insight: Relate directly to their skills/goal.
3. What To Do Next: Actionable next step on campus.
4. UniVibe Tip: High-leverage advice.
Do not invent fake clubs or fake contacts.
`;
        const { text } = await invokeBedrockText(conciergePrompt, UNIVIBE_SYSTEM_GUARDRAILS);
        assistantMsg = {
          id: "asst-" + Date.now(),
          conversation_id: "conv-default",
          sender: "assistant",
          content: text,
          created_at: new Date().toISOString(),
        };
      } catch (err) {
        assistantMsg = SimulatedAiProvider.generateConciergeResponse(
          message,
          profile || ({} as any),
          aiProfile,
          { recommendations: matches || [] } as any
        );
      }
    } else {
      assistantMsg = SimulatedAiProvider.generateConciergeResponse(
        message,
        profile || ({} as any),
        aiProfile,
        { recommendations: matches || [] } as any
      );
    }

    await db.saveConciergeMessage(assistantMsg, userId);
    return { ...assistantMsg, ai_mode: mode.provider };
  }
}

