import { getSql, isDbConfigured } from "../config/db.js";

// ============================================================
// SECTION 5: Event Objective
// Dependencies:
// - Primary Event Objective
// - Secondary Objectives
// - Event Theme
// - Expected Outcomes
// - Key Deliverables
// - Success Criteria
// - Institutional Alignment
// - Social or Educational Impact
// ============================================================

export interface EventObjectiveData {
  id?: string;
  master_event_id: string;
  primary_event_objective: string;
  secondary_objectives?: string;
  event_theme?: string;
  expected_outcomes?: string;
  key_deliverables?: string;
  success_criteria?: string;
  institutional_alignment?: string;
  social_educational_impact?: string;
  created_at?: string;
  updated_at?: string;
}

export const createEventObjectiveTableQuery = `
  CREATE TABLE IF NOT EXISTS event_objectives (
    id TEXT PRIMARY KEY,
    master_event_id TEXT NOT NULL,
    primary_event_objective TEXT NOT NULL,
    secondary_objectives TEXT DEFAULT '',
    event_theme TEXT DEFAULT '',
    expected_outcomes TEXT DEFAULT '',
    key_deliverables TEXT DEFAULT '',
    success_criteria TEXT DEFAULT '',
    institutional_alignment TEXT DEFAULT '',
    social_educational_impact TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_master_event FOREIGN KEY (master_event_id) REFERENCES master_events(id) ON DELETE CASCADE
  );
`;

export const EventObjectiveModel = {
  async save(data: EventObjectiveData): Promise<EventObjectiveData> {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }

    const sql = getSql();
    const id = data.id || `obj-${Date.now()}`;

    await sql`
      INSERT INTO event_objectives (
        id, master_event_id, primary_event_objective, secondary_objectives, event_theme, 
        expected_outcomes, key_deliverables, success_criteria, institutional_alignment, 
        social_educational_impact, updated_at
      ) VALUES (
        ${id}, ${data.master_event_id}, ${data.primary_event_objective}, ${data.secondary_objectives || ""}, 
        ${data.event_theme || ""}, ${data.expected_outcomes || ""}, ${data.key_deliverables || ""}, 
        ${data.success_criteria || ""}, ${data.institutional_alignment || ""}, 
        ${data.social_educational_impact || ""}, NOW()
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

    return { ...data, id };
  },

  async getByMasterEventId(masterEventId: string): Promise<EventObjectiveData | null> {
    if (!isDbConfigured()) return null;
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM event_objectives WHERE master_event_id = ${masterEventId} LIMIT 1;
    `;
    return (rows[0] as EventObjectiveData) || null;
  },

  validate(data: Partial<EventObjectiveData>): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!data.primary_event_objective?.trim()) missing.push("Primary Event Objective");
    return { valid: missing.length === 0, missing };
  },
};

