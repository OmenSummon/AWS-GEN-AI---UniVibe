import { getSql, isDbConfigured } from "../config/db.js";

// ============================================================
// SECTION 1: Summarized Event
// Dependencies:
// - Event Name
// - Event Description
// - Event Category
// - Event Organizer
// - Event Format
// ============================================================

export interface SummarizedEventData {
  id?: string;
  master_event_id: string;
  event_name: string;
  event_description: string;
  event_category: string;
  event_organizer: string;
  event_format: "Online" | "Offline" | "Hybrid" | string;
  created_at?: string;
  updated_at?: string;
}

export const createSummarizedEventTableQuery = `
  CREATE TABLE IF NOT EXISTS event_summarized (
    id TEXT PRIMARY KEY,
    master_event_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_description TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_organizer TEXT NOT NULL,
    event_format TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_master_event FOREIGN KEY (master_event_id) REFERENCES master_events(id) ON DELETE CASCADE
  );
`;

export const SummarizedEventModel = {
  async save(data: SummarizedEventData): Promise<SummarizedEventData> {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }

    const sql = getSql();
    const id = data.id || `sum-${Date.now()}`;

    await sql`
      INSERT INTO event_summarized (
        id, master_event_id, event_name, event_description, event_category, event_organizer, event_format, updated_at
      ) VALUES (
        ${id}, ${data.master_event_id}, ${data.event_name}, ${data.event_description}, 
        ${data.event_category}, ${data.event_organizer}, ${data.event_format}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        event_name = EXCLUDED.event_name,
        event_description = EXCLUDED.event_description,
        event_category = EXCLUDED.event_category,
        event_organizer = EXCLUDED.event_organizer,
        event_format = EXCLUDED.event_format,
        updated_at = NOW();
    `;

    return { ...data, id };
  },

  async getByMasterEventId(masterEventId: string): Promise<SummarizedEventData | null> {
    if (!isDbConfigured()) return null;
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM event_summarized WHERE master_event_id = ${masterEventId} LIMIT 1;
    `;
    return (rows[0] as SummarizedEventData) || null;
  },

  validate(data: Partial<SummarizedEventData>): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!data.event_name?.trim()) missing.push("Event Name");
    if (!data.event_description?.trim()) missing.push("Event Description");
    if (!data.event_category?.trim()) missing.push("Event Category");
    if (!data.event_organizer?.trim()) missing.push("Event Organizer");
    if (!data.event_format?.trim()) missing.push("Event Format");
    return { valid: missing.length === 0, missing };
  },
};

