// ============================================================
// MODULE 1: Summarized Event Processor
// Dependency: Event Name, Description, Category, Organizer, Format
// ============================================================

import { OrganizerAiService } from "@/lib/ai/organizer-ai";
import { EventWizardCategory } from "@/types";

// ── Input Interface ──────────────────────────────────────────
export interface SummarizedEventInput {
  event_name: string;
  event_description: string;
  event_category: EventWizardCategory;
  event_organizer: string;
  event_format: "Online" | "Offline" | "Hybrid";
}

// ── Output Interface ─────────────────────────────────────────
export interface SummarizedEventOutput {
  summary: string;
  bullets: {
    event: string;
    category: string;
    format: string;
    organizer: string;
    overview: string;
  };
  generated_at: string;
  error?: string;
}

// ── Validation ───────────────────────────────────────────────
export function validateSummarizedEvent(input: Partial<SummarizedEventInput>): {
  valid: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!input.event_name?.trim()) missing.push("Event Name");
  if (!input.event_description?.trim()) missing.push("Event Description");
  if (!input.event_category) missing.push("Event Category");
  if (!input.event_format) missing.push("Event Format");
  return { valid: missing.length === 0, missing };
}

// ── Processor ────────────────────────────────────────────────
export async function processSummarizedEvent(
  input: SummarizedEventInput
): Promise<SummarizedEventOutput> {
  try {
    const summary = await OrganizerAiService.summarizeEventBasics({
      event_name: input.event_name,
      event_description: input.event_description,
      event_category: input.event_category,
      event_organizer: input.event_organizer || "Student Organization",
      event_format: input.event_format,
    });

    return {
      summary,
      bullets: {
        event: input.event_name,
        category: input.event_category,
        format: input.event_format,
        organizer: input.event_organizer || "Student Organization",
        overview: input.event_description.slice(0, 140) + (input.event_description.length > 140 ? "…" : ""),
      },
      generated_at: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      summary: "",
      bullets: {
        event: input.event_name,
        category: input.event_category,
        format: input.event_format,
        organizer: input.event_organizer || "Student Organization",
        overview: input.event_description.slice(0, 140),
      },
      generated_at: new Date().toISOString(),
      error: error?.message || "Failed to process event basics",
    };
  }
}
