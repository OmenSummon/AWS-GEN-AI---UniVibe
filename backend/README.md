# UniVibe Standalone Backend & Neon DB Guide

This backend service manages the organizer major sections and student records with direct connection to **Neon Serverless PostgreSQL**.

---

## 🏗️ 6 Section Tables + Master Table Architecture

Each major organizer section has its own dedicated table, orchestrated by `masterEvent.ts`:

| # | Section File | Table Name in Neon DB | Key Fields |
|---|---|---|---|
| 1 | `src/sections/summarizedEvent.ts` | `event_summarized` | `event_name`, `event_description`, `event_category`, `event_organizer`, `event_format` |
| 2 | `src/sections/audienceSummarization.ts` | `event_audience` | `expected_participants`, `target_audience`, `participation_type`, `geographical_reach` |
| 3 | `src/sections/dateFinalization.ts` | `event_dates` | `proposed_event_date`, `event_duration`, `preparation_start_date`, `registration_deadline`, `date_flexibility` |
| 4 | `src/sections/otherInformation.ts` | `event_other_info` | `budget_financial_requirements`, `financial_constraints`, `venue_location`, `infrastructure_equipment`, `team_composition`, `external_support_resources` |
| 5 | `src/sections/eventObjective.ts` | `event_objectives` | `primary_event_objective`, `secondary_objectives`, `event_theme`, `expected_outcomes`, `key_deliverables`, `success_criteria`, `institutional_alignment`, `social_educational_impact` |
| 6 | `src/sections/registrationParticipation.ts` | `event_registration_participation` | `registration_method`, `registration_window`, `participant_eligibility`, `eligibility_restrictions`, `participation_mode`, `team_size_range`, `registration_fee`, `selection_process`, `max_registration_capacity`, `waitlist_availability`, `certificate_document_requirements`, `expected_participants`, `proposed_event_date` |
| ⭐ | `src/sections/masterEvent.ts` | `master_events` | **Master orchestrator** linking all 6 tables via `master_event_id` foreign keys, managing event life cycles, cross-table aggregation, and progress tracking. |

---

## 🚀 Quick Start Instructions

### 1. Configure Neon DB Connection String
Open `backend/.env` and paste your Neon Database connection string:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require"
```
*(You can also set the same `DATABASE_URL` in root `.env.local` for the Next.js full-stack features).*

### 2. Test Connection
```bash
cd backend
npm run db:test
```

### 3. Create/Migrate the 6 Section Tables + Master Table
```bash
npm run db:sections
```

### 4. Start the Backend API Server
```bash
npm run dev
```
The server will start on `http://localhost:5000`.
- Health & DB status: `GET http://localhost:5000/api/health`
- Master Events: `GET http://localhost:5000/api/master-events`
- Single Event Aggregate (all 6 sections joined): `GET http://localhost:5000/api/master-events/:id`
- Save Individual Section: `PUT http://localhost:5000/api/master-events/:id/sections/:sectionName`

