import { getSql, isDbConfigured } from "../config/db.js";
import { SummarizedEventModel, SummarizedEventData, createSummarizedEventTableQuery } from "./summarizedEvent.js";
import { AudienceSummarizationModel, AudienceSummarizationData, createAudienceSummarizationTableQuery } from "./audienceSummarization.js";
import { DateFinalizationModel, DateFinalizationData, createDateFinalizationTableQuery } from "./dateFinalization.js";
import { OtherInformationModel, OtherInformationData, createOtherInformationTableQuery } from "./otherInformation.js";
import { EventObjectiveModel, EventObjectiveData, createEventObjectiveTableQuery } from "./eventObjective.js";
import { RegistrationParticipationModel, RegistrationParticipationData, createRegistrationParticipationTableQuery } from "./registrationParticipation.js";

// ============================================================
// MASTER EVENT FILE — Orchestrator & Multi-Table Connector
// Connects and orchestrates all 6 section tables:
// 1. event_summarized
// 2. event_audience
// 3. event_dates
// 4. event_other_info
// 5. event_objectives
// 6. event_registration_participation
// ============================================================

export interface MasterEventRecord {
  id: string;
  organizer_id: string;
  title: string;
  status: "Draft" | "In Planning" | "Pending Review" | "Approved" | "Published" | "Completed" | "Cancelled" | string;
  readiness_score: number;
  ai_report?: any;
  created_at: string;
  updated_at: string;
}

export interface CompleteEventAggregate {
  master: MasterEventRecord;
  summarizedEvent: SummarizedEventData | null;
  audienceSummarization: AudienceSummarizationData | null;
  dateFinalization: DateFinalizationData | null;
  otherInformation: OtherInformationData | null;
  eventObjective: EventObjectiveData | null;
  registrationParticipation: RegistrationParticipationData | null;
  completionStatus: {
    summarizedEvent: boolean;
    audienceSummarization: boolean;
    dateFinalization: boolean;
    otherInformation: boolean;
    eventObjective: boolean;
    registrationParticipation: boolean;
    completedCount: number;
    totalCount: number;
    progressPercentage: number;
  };
}

export const createMasterEventTableQuery = `
  CREATE TABLE IF NOT EXISTS master_events (
    id TEXT PRIMARY KEY,
    organizer_id TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Draft',
    readiness_score INT NOT NULL DEFAULT 0,
    ai_report JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
`;

export const ALL_TABLE_CREATION_QUERIES = [
  createMasterEventTableQuery,
  createSummarizedEventTableQuery,
  createAudienceSummarizationTableQuery,
  createDateFinalizationTableQuery,
  createOtherInformationTableQuery,
  createEventObjectiveTableQuery,
  createRegistrationParticipationTableQuery,
];

export const MasterEventModel = {
  /**
   * Initializes all 6 section tables and the master table in Neon DB
   */
  async initAllTables() {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }
    const sql = getSql();
    for (const query of ALL_TABLE_CREATION_QUERIES) {
      if (typeof (sql as any).query === "function") {
        await (sql as any).query(query);
      } else if (typeof (sql as any).unsafe === "function") {
        await (sql as any).unsafe(query);
      } else {
        await (sql as any)([query]);
      }
    }
    return { success: true, message: "Master table and all 6 section tables initialized." };
  },

  /**
   * Creates a new Master Event
   */
  async create(organizerId: string, title: string): Promise<MasterEventRecord> {
    if (!isDbConfigured()) {
      throw new Error("Neon DB is not configured in backend/.env");
    }

    const sql = getSql();
    const id = `mevt-${Date.now()}`;
    const initialTitle = title || "Untitled Campus Event";

    await sql`
      INSERT INTO master_events (id, organizer_id, title, status, readiness_score, updated_at)
      VALUES (${id}, ${organizerId}, ${initialTitle}, 'Draft', 0, NOW());
    `;

    return {
      id,
      organizer_id: organizerId,
      title: initialTitle,
      status: "Draft",
      readiness_score: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  },

  /**
   * Fetches full aggregate event by joining across all 6 tables
   */
  async getFullEvent(masterEventId: string): Promise<CompleteEventAggregate | null> {
    if (!isDbConfigured()) return null;
    const sql = getSql();

    // 1. Fetch Master Record
    const masterRows = await sql`
      SELECT * FROM master_events WHERE id = ${masterEventId} LIMIT 1;
    `;
    if (!masterRows || masterRows.length === 0) return null;
    const master = masterRows[0] as MasterEventRecord;

    // 2. Fetch all 6 sections concurrently
    const [
      summarizedEvent,
      audienceSummarization,
      dateFinalization,
      otherInformation,
      eventObjective,
      registrationParticipation,
    ] = await Promise.all([
      SummarizedEventModel.getByMasterEventId(masterEventId),
      AudienceSummarizationModel.getByMasterEventId(masterEventId),
      DateFinalizationModel.getByMasterEventId(masterEventId),
      OtherInformationModel.getByMasterEventId(masterEventId),
      EventObjectiveModel.getByMasterEventId(masterEventId),
      RegistrationParticipationModel.getByMasterEventId(masterEventId),
    ]);

    // 3. Compute section validation completion status
    const section1Valid = summarizedEvent ? SummarizedEventModel.validate(summarizedEvent).valid : false;
    const section2Valid = audienceSummarization ? AudienceSummarizationModel.validate(audienceSummarization).valid : false;
    const section3Valid = dateFinalization ? DateFinalizationModel.validate(dateFinalization).valid : false;
    const section4Valid = otherInformation ? OtherInformationModel.validate(otherInformation).valid : false;
    const section5Valid = eventObjective ? EventObjectiveModel.validate(eventObjective).valid : false;
    const section6Valid = registrationParticipation ? RegistrationParticipationModel.validate(registrationParticipation).valid : false;

    const completedCount = [
      section1Valid,
      section2Valid,
      section3Valid,
      section4Valid,
      section5Valid,
      section6Valid,
    ].filter(Boolean).length;

    const progressPercentage = Math.round((completedCount / 6) * 100);

    return {
      master,
      summarizedEvent,
      audienceSummarization,
      dateFinalization,
      otherInformation,
      eventObjective,
      registrationParticipation,
      completionStatus: {
        summarizedEvent: section1Valid,
        audienceSummarization: section2Valid,
        dateFinalization: section3Valid,
        otherInformation: section4Valid,
        eventObjective: section5Valid,
        registrationParticipation: section6Valid,
        completedCount,
        totalCount: 6,
        progressPercentage,
      },
    };
  },

  /**
   * Saves data into any of the 6 individual tables and synchronizes master event updated_at
   */
  async saveSection(
    masterEventId: string,
    section:
      | "summarizedEvent"
      | "audienceSummarization"
      | "dateFinalization"
      | "otherInformation"
      | "eventObjective"
      | "registrationParticipation",
    data: any
  ) {
    data.master_event_id = masterEventId;
    let savedData: any = null;

    switch (section) {
      case "summarizedEvent":
        savedData = await SummarizedEventModel.save(data);
        // Also update the master event's title if event_name changed
        if (data.event_name) {
          const sql = getSql();
          await sql`
            UPDATE master_events 
            SET title = ${data.event_name}, updated_at = NOW() 
            WHERE id = ${masterEventId};
          `;
        }
        break;
      case "audienceSummarization":
        savedData = await AudienceSummarizationModel.save(data);
        break;
      case "dateFinalization":
        savedData = await DateFinalizationModel.save(data);
        break;
      case "otherInformation":
        savedData = await OtherInformationModel.save(data);
        break;
      case "eventObjective":
        savedData = await EventObjectiveModel.save(data);
        break;
      case "registrationParticipation":
        savedData = await RegistrationParticipationModel.save(data);
        break;
      default:
        throw new Error(`Unknown section: ${section}`);
    }

    // Touch master event updated_at
    const sql = getSql();
    await sql`UPDATE master_events SET updated_at = NOW() WHERE id = ${masterEventId};`;

    return savedData;
  },

  /**
   * Lists master events for an organizer
   */
  async listByOrganizer(organizerId: string): Promise<MasterEventRecord[]> {
    if (!isDbConfigured()) return [];
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM master_events 
      WHERE organizer_id = ${organizerId} 
      ORDER BY updated_at DESC;
    `;
    return rows as MasterEventRecord[];
  },

  /**
   * Updates master event lifecycle status or readiness
   */
  async updateStatus(masterEventId: string, status: string, readinessScore?: number) {
    if (!isDbConfigured()) return;
    const sql = getSql();
    if (readinessScore !== undefined) {
      await sql`
        UPDATE master_events 
        SET status = ${status}, readiness_score = ${readinessScore}, updated_at = NOW() 
        WHERE id = ${masterEventId};
      `;
    } else {
      await sql`
        UPDATE master_events 
        SET status = ${status}, updated_at = NOW() 
        WHERE id = ${masterEventId};
      `;
    }
  },

  /**
   * Deletes a master event (cascades to all 6 section tables via foreign key)
   */
  async delete(masterEventId: string) {
    if (!isDbConfigured()) return;
    const sql = getSql();
    await sql`DELETE FROM master_events WHERE id = ${masterEventId};`;
  },
};

