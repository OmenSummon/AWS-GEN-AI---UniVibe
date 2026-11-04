import { getSql, isDbConfigured } from "../config/db.js";

// ============================================================
// SECTION 2: Audience Summarization
// Dependencies:
// - Expected Participants
// - Target Audience
// - Participation Type
// - Geographical Reach
// ============================================================

export interface AudienceSummarizationData {
  id?: string;
  master_event_id: string;
  expected_participants: number;
  target_audience: string;
  participation_type: "Individual" | "Team-Based" | "Open Registration" | "Invitation-Based" | "Mixed" | string;
  geographical_reach:
    | "College-Level"
    | "University-Level"
    | "Inter-College"
    | "District-Level"
    | "State-Level"
    | "National-Level"
    | "International-Level"
    | string;
  created_at?: string;
  updated_at?: string;
}

export const createAudienceSummarizationTableQuery = `
  CREATE TABLE IF NOT EXISTS event_audience (
    id TEXT PRIMARY KEY,
    master_event_id TEXT NOT NULL,
    expected_participants INT NOT NULL,
    target_audience TEXT NOT NULL,
    participation_type TEXT NOT NULL,
    geographical_reach TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_master_event FOREIGN KEY (master_event_id) REFERENCES master_events(id) ON DELETE CASCADE
  );
`;

export const AudienceSummarizationModel = {
  async save(data: AudienceSummarizationData): Promise<AudienceSummarizationData> {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }

    const sql = getSql();
    const id = data.id || `aud-${Date.now()}`;

    await sql`
      INSERT INTO event_audience (
        id, master_event_id, expected_participants, target_audience, participation_type, geographical_reach, updated_at
      ) VALUES (
        ${id}, ${data.master_event_id}, ${data.expected_participants}, ${data.target_audience}, 
        ${data.participation_type}, ${data.geographical_reach}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        expected_participants = EXCLUDED.expected_participants,
        target_audience = EXCLUDED.target_audience,
        participation_type = EXCLUDED.participation_type,
        geographical_reach = EXCLUDED.geographical_reach,
        updated_at = NOW();
    `;

    return { ...data, id };
  },

  async getByMasterEventId(masterEventId: string): Promise<AudienceSummarizationData | null> {
    if (!isDbConfigured()) return null;
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM event_audience WHERE master_event_id = ${masterEventId} LIMIT 1;
    `;
    return (rows[0] as AudienceSummarizationData) || null;
  },

  validate(data: Partial<AudienceSummarizationData>): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (data.expected_participants === undefined || data.expected_participants === null || Number(data.expected_participants) <= 0) {
      missing.push("Expected Participants (must be > 0)");
    }
    if (!data.target_audience?.trim()) missing.push("Target Audience");
    if (!data.participation_type?.trim()) missing.push("Participation Type");
    if (!data.geographical_reach?.trim()) missing.push("Geographical Reach");
    return { valid: missing.length === 0, missing };
  },
};

