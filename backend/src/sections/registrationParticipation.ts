import { getSql, isDbConfigured } from "../config/db.js";

// ============================================================
// SECTION 6: Registration & Participation
// Dependencies:
// - Registration Method
// - Registration Window
// - Participant Eligibility
// - Eligibility Restrictions
// - Participation Mode
// - Team Size Range
// - Registration Fee
// - Selection Process
// - Maximum Registration Capacity
// - Waitlist Availability
// - Certificate and Documentation Requirements
// - Expected Participants
// - Proposed Event Date
// ============================================================

export interface RegistrationParticipationData {
  id?: string;
  master_event_id: string;
  registration_method:
    | "Online Form"
    | "UniVibe Registration"
    | "Email"
    | "Offline Registration"
    | "External Registration Link"
    | string;
  registration_window: string;
  participant_eligibility: string;
  eligibility_restrictions?: string;
  participation_mode: "Individual" | "Team" | "Both" | string;
  team_size_range?: string;
  registration_fee: string | number;
  selection_process:
    | "First Come, First Served"
    | "Screening"
    | "Interview"
    | "Audition"
    | "Merit-Based"
    | "Random Selection"
    | "Invitation"
    | "No Selection Process"
    | string;
  max_registration_capacity: number;
  waitlist_availability: "Yes" | "No" | "To Be Decided" | string;
  certificate_document_requirements?: string;
  expected_participants: number;
  proposed_event_date: string;
  created_at?: string;
  updated_at?: string;
}

export const createRegistrationParticipationTableQuery = `
  CREATE TABLE IF NOT EXISTS event_registration_participation (
    id TEXT PRIMARY KEY,
    master_event_id TEXT NOT NULL,
    registration_method TEXT NOT NULL,
    registration_window TEXT NOT NULL,
    participant_eligibility TEXT NOT NULL,
    eligibility_restrictions TEXT DEFAULT '',
    participation_mode TEXT NOT NULL,
    team_size_range TEXT DEFAULT '',
    registration_fee TEXT NOT NULL DEFAULT '0',
    selection_process TEXT NOT NULL,
    max_registration_capacity INT NOT NULL,
    waitlist_availability TEXT NOT NULL DEFAULT 'No',
    certificate_document_requirements TEXT DEFAULT '',
    expected_participants INT NOT NULL,
    proposed_event_date TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_master_event FOREIGN KEY (master_event_id) REFERENCES master_events(id) ON DELETE CASCADE
  );
`;

export const RegistrationParticipationModel = {
  async save(data: RegistrationParticipationData): Promise<RegistrationParticipationData> {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }

    const sql = getSql();
    const id = data.id || `reg-${Date.now()}`;

    await sql`
      INSERT INTO event_registration_participation (
        id, master_event_id, registration_method, registration_window, participant_eligibility, 
        eligibility_restrictions, participation_mode, team_size_range, registration_fee, 
        selection_process, max_registration_capacity, waitlist_availability, 
        certificate_document_requirements, expected_participants, proposed_event_date, updated_at
      ) VALUES (
        ${id}, ${data.master_event_id}, ${data.registration_method}, ${data.registration_window}, 
        ${data.participant_eligibility}, ${data.eligibility_restrictions || ""}, ${data.participation_mode}, 
        ${data.team_size_range || ""}, ${String(data.registration_fee || "0")}, ${data.selection_process}, 
        ${Number(data.max_registration_capacity)}, ${data.waitlist_availability}, 
        ${data.certificate_document_requirements || ""}, ${Number(data.expected_participants)}, 
        ${data.proposed_event_date}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        registration_method = EXCLUDED.registration_method,
        registration_window = EXCLUDED.registration_window,
        participant_eligibility = EXCLUDED.participant_eligibility,
        eligibility_restrictions = EXCLUDED.eligibility_restrictions,
        participation_mode = EXCLUDED.participation_mode,
        team_size_range = EXCLUDED.team_size_range,
        registration_fee = EXCLUDED.registration_fee,
        selection_process = EXCLUDED.selection_process,
        max_registration_capacity = EXCLUDED.max_registration_capacity,
        waitlist_availability = EXCLUDED.waitlist_availability,
        certificate_document_requirements = EXCLUDED.certificate_document_requirements,
        expected_participants = EXCLUDED.expected_participants,
        proposed_event_date = EXCLUDED.proposed_event_date,
        updated_at = NOW();
    `;

    return { ...data, id };
  },

  async getByMasterEventId(masterEventId: string): Promise<RegistrationParticipationData | null> {
    if (!isDbConfigured()) return null;
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM event_registration_participation WHERE master_event_id = ${masterEventId} LIMIT 1;
    `;
    return (rows[0] as RegistrationParticipationData) || null;
  },

  validate(data: Partial<RegistrationParticipationData>): { valid: boolean; missing: string[]; warnings?: string[] } {
    const missing: string[] = [];
    const warnings: string[] = [];

    if (!data.registration_method?.trim()) missing.push("Registration Method");
    if (!data.registration_window?.trim()) missing.push("Registration Window");
    if (!data.participant_eligibility?.trim()) missing.push("Participant Eligibility");
    if (!data.participation_mode?.trim()) missing.push("Participation Mode");
    if (data.registration_fee === undefined || data.registration_fee === null) missing.push("Registration Fee");
    if (!data.selection_process?.trim()) missing.push("Selection Process");
    if (data.max_registration_capacity === undefined || Number(data.max_registration_capacity) <= 0) {
      missing.push("Maximum Registration Capacity (must be > 0)");
    }
    if (!data.waitlist_availability?.trim()) missing.push("Waitlist Availability");
    if (data.expected_participants === undefined || Number(data.expected_participants) <= 0) {
      missing.push("Expected Participants");
    }
    if (!data.proposed_event_date?.trim()) missing.push("Proposed Event Date");

    // Cross-check capacity vs expected participants
    if (data.max_registration_capacity && data.expected_participants) {
      if (Number(data.max_registration_capacity) < Number(data.expected_participants)) {
        warnings.push(
          `Max registration capacity (${data.max_registration_capacity}) is lower than expected participants (${data.expected_participants}). Consider enabling waitlist.`
        );
      }
    }

    return { valid: missing.length === 0, missing, warnings };
  },
};

