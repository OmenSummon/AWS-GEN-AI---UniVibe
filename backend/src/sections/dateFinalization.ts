import { getSql, isDbConfigured } from "../config/db.js";

// ============================================================
// SECTION 3: Date Finalization
// Dependencies:
// - Proposed Event Date
// - Event Duration
// - Preparation Start Date
// - Registration Deadline
// - Date Flexibility
// ============================================================

export interface DateFinalizationData {
  id?: string;
  master_event_id: string;
  proposed_event_date: string;
  event_duration: string;
  preparation_start_date: string;
  registration_deadline: string;
  date_flexibility: "Fixed" | "Flexible" | "Yet to Be Decided" | string;
  created_at?: string;
  updated_at?: string;
}

export const createDateFinalizationTableQuery = `
  CREATE TABLE IF NOT EXISTS event_dates (
    id TEXT PRIMARY KEY,
    master_event_id TEXT NOT NULL,
    proposed_event_date TEXT NOT NULL,
    event_duration TEXT NOT NULL,
    preparation_start_date TEXT NOT NULL,
    registration_deadline TEXT NOT NULL,
    date_flexibility TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_master_event FOREIGN KEY (master_event_id) REFERENCES master_events(id) ON DELETE CASCADE
  );
`;

export const DateFinalizationModel = {
  async save(data: DateFinalizationData): Promise<DateFinalizationData> {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }

    const sql = getSql();
    const id = data.id || `date-${Date.now()}`;

    await sql`
      INSERT INTO event_dates (
        id, master_event_id, proposed_event_date, event_duration, preparation_start_date, registration_deadline, date_flexibility, updated_at
      ) VALUES (
        ${id}, ${data.master_event_id}, ${data.proposed_event_date}, ${data.event_duration}, 
        ${data.preparation_start_date}, ${data.registration_deadline}, ${data.date_flexibility}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        proposed_event_date = EXCLUDED.proposed_event_date,
        event_duration = EXCLUDED.event_duration,
        preparation_start_date = EXCLUDED.preparation_start_date,
        registration_deadline = EXCLUDED.registration_deadline,
        date_flexibility = EXCLUDED.date_flexibility,
        updated_at = NOW();
    `;

    return { ...data, id };
  },

  async getByMasterEventId(masterEventId: string): Promise<DateFinalizationData | null> {
    if (!isDbConfigured()) return null;
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM event_dates WHERE master_event_id = ${masterEventId} LIMIT 1;
    `;
    return (rows[0] as DateFinalizationData) || null;
  },

  validate(data: Partial<DateFinalizationData>): { valid: boolean; missing: string[]; errors?: string[] } {
    const missing: string[] = [];
    const errors: string[] = [];

    if (!data.proposed_event_date?.trim()) missing.push("Proposed Event Date");
    if (!data.event_duration?.trim()) missing.push("Event Duration");
    if (!data.preparation_start_date?.trim()) missing.push("Preparation Start Date");
    if (!data.registration_deadline?.trim()) missing.push("Registration Deadline");
    if (!data.date_flexibility?.trim()) missing.push("Date Flexibility");

    // Semantic date validations if all dates are present
    if (data.proposed_event_date && data.registration_deadline) {
      const eventDate = new Date(data.proposed_event_date);
      const deadline = new Date(data.registration_deadline);
      if (!isNaN(eventDate.getTime()) && !isNaN(deadline.getTime())) {
        if (deadline > eventDate) {
          errors.push("Registration deadline cannot be after the proposed event date.");
        }
      }
    }

    return { valid: missing.length === 0 && errors.length === 0, missing, errors };
  },
};

