import { getSql, isDbConfigured } from "../config/db.js";

// ============================================================
// SECTION 4: Other Information (Logistics & Resources)
// Dependencies:
// - Budget and Financial Requirements
// - Financial Constraints
// - Venue and Location
// - Infrastructure and Equipment
// - Team Composition
// - External Support and Resources
// ============================================================

export interface OtherInformationData {
  id?: string;
  master_event_id: string;
  budget_financial_requirements: string;
  financial_constraints: string;
  venue_location: string;
  infrastructure_equipment: string;
  team_composition: string;
  external_support_resources: string;
  created_at?: string;
  updated_at?: string;
}

export const createOtherInformationTableQuery = `
  CREATE TABLE IF NOT EXISTS event_other_info (
    id TEXT PRIMARY KEY,
    master_event_id TEXT NOT NULL,
    budget_financial_requirements TEXT NOT NULL,
    financial_constraints TEXT NOT NULL,
    venue_location TEXT NOT NULL,
    infrastructure_equipment TEXT NOT NULL,
    team_composition TEXT NOT NULL,
    external_support_resources TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_master_event FOREIGN KEY (master_event_id) REFERENCES master_events(id) ON DELETE CASCADE
  );
`;

export const OtherInformationModel = {
  async save(data: OtherInformationData): Promise<OtherInformationData> {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }

    const sql = getSql();
    const id = data.id || `other-${Date.now()}`;

    await sql`
      INSERT INTO event_other_info (
        id, master_event_id, budget_financial_requirements, financial_constraints, 
        venue_location, infrastructure_equipment, team_composition, external_support_resources, updated_at
      ) VALUES (
        ${id}, ${data.master_event_id}, ${data.budget_financial_requirements}, ${data.financial_constraints}, 
        ${data.venue_location}, ${data.infrastructure_equipment}, ${data.team_composition}, ${data.external_support_resources}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        budget_financial_requirements = EXCLUDED.budget_financial_requirements,
        financial_constraints = EXCLUDED.financial_constraints,
        venue_location = EXCLUDED.venue_location,
        infrastructure_equipment = EXCLUDED.infrastructure_equipment,
        team_composition = EXCLUDED.team_composition,
        external_support_resources = EXCLUDED.external_support_resources,
        updated_at = NOW();
    `;

    return { ...data, id };
  },

  async getByMasterEventId(masterEventId: string): Promise<OtherInformationData | null> {
    if (!isDbConfigured()) return null;
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM event_other_info WHERE master_event_id = ${masterEventId} LIMIT 1;
    `;
    return (rows[0] as OtherInformationData) || null;
  },

  validate(data: Partial<OtherInformationData>): { valid: boolean; missing: string[] } {
    const missing: string[] = [];
    if (!data.budget_financial_requirements?.trim()) missing.push("Budget and Financial Requirements");
    if (!data.financial_constraints?.trim()) missing.push("Financial Constraints");
    if (!data.venue_location?.trim()) missing.push("Venue and Location");
    if (!data.infrastructure_equipment?.trim()) missing.push("Infrastructure and Equipment");
    if (!data.team_composition?.trim()) missing.push("Team Composition");
    if (!data.external_support_resources?.trim()) missing.push("External Support and Resources");
    return { valid: missing.length === 0, missing };
  },
};

