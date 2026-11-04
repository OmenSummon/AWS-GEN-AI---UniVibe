import dotenv from "dotenv";
import { getSql } from "../config/db.js";

dotenv.config();

export async function migrateAndSeedAvailableEvents() {
  const sql = getSql();
  console.log("Creating 'available_events' table in Neon DB...");

  await sql`
    CREATE TABLE IF NOT EXISTS available_events (
      id TEXT PRIMARY KEY,
      master_event_id TEXT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      organizer TEXT NOT NULL,
      format TEXT NOT NULL DEFAULT 'Offline',
      event_date TEXT NOT NULL,
      registration_deadline TEXT NOT NULL,
      venue TEXT NOT NULL,
      capacity INT NOT NULL DEFAULT 100,
      registered_count INT NOT NULL DEFAULT 0,
      participation_fee TEXT NOT NULL DEFAULT '0',
      eligibility TEXT NOT NULL DEFAULT 'Open to all students',
      status TEXT NOT NULL DEFAULT 'Active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  console.log("✔ 'available_events' table verified.");

  // Seed default existing events if table is empty
  const countRes = await sql`SELECT COUNT(*) FROM available_events;`;
  const currentCount = Number(countRes[0].count);

  if (currentCount === 0) {
    console.log("Seeding existing campus events into 'available_events'...");
    const existingEvents = [
      {
        id: "avail-evt-01",
        master_event_id: "org-evt-101",
        name: "CodeStorm Hackathon 2026",
        category: "Hackathons",
        description: "The flagship 36-hour inter-college software sprint where campus builders code, prototype, and pitch real-world software solutions to tech industry judges.",
        organizer: "JIS Tech Club & Coding Society",
        format: "Offline",
        event_date: "2026-11-20",
        registration_deadline: "2026-11-18",
        venue: "Main Campus Tech Wing, Labs 401-404",
        capacity: 150,
        registered_count: 112,
        participation_fee: "Free",
        eligibility: "Open to all enrolled undergraduate and postgraduate students. Teams of 2 to 4.",
        status: "Filling Fast",
      },
      {
        id: "avail-evt-02",
        master_event_id: "org-evt-102",
        name: "AI & Cloud Innovation Summit",
        category: "Workshops",
        description: "Hands-on masterclass on building generative AI architectures with Amazon Bedrock, vector databases, and real-time inference.",
        organizer: "AWS Student Chapter & CS Department",
        format: "Hybrid",
        event_date: "2026-11-25",
        registration_deadline: "2026-11-23",
        venue: "Auditorium Hall B & Online Zoom Stream",
        capacity: 250,
        registered_count: 184,
        participation_fee: "Free",
        eligibility: "All departments welcome. Basic programming familiarity recommended.",
        status: "Registration Open",
      },
      {
        id: "avail-evt-03",
        master_event_id: "org-evt-103",
        name: "Pulse 2026 Inter-University Cultural Fest",
        category: "Cultural",
        description: "Annual multi-genre music, dance, theatricals, and creative art extravaganza featuring battle of bands and live performances.",
        organizer: "Campus Student Cultural Council",
        format: "Offline",
        event_date: "2026-12-05",
        registration_deadline: "2026-12-01",
        venue: "University Open Air Amphitheatre & Central Lawns",
        capacity: 1200,
        registered_count: 890,
        participation_fee: "Free",
        eligibility: "Open to all students from accredited colleges and universities.",
        status: "Registration Open",
      },
      {
        id: "avail-evt-04",
        master_event_id: "org-evt-104",
        name: "RoboSprint Autonomous Robotics Derby",
        category: "Technical",
        description: "Competitive autonomous line follower and maze solver robot race. Test microcontrollers, PID algorithms, and sensor arrays.",
        organizer: "Robotics & Automation Society",
        format: "Offline",
        event_date: "2026-12-12",
        registration_deadline: "2026-12-08",
        venue: "Indoor Sports Complex, Arena 1",
        capacity: 80,
        registered_count: 65,
        participation_fee: "Free",
        eligibility: "Engineering and technology students. Teams of up to 4.",
        status: "Registration Open",
      },
    ];

    for (const evt of existingEvents) {
      await sql`
        INSERT INTO available_events (
          id, master_event_id, name, category, description, organizer, format,
          event_date, registration_deadline, venue, capacity, registered_count,
          participation_fee, eligibility, status, created_at, updated_at
        ) VALUES (
          ${evt.id}, ${evt.master_event_id}, ${evt.name}, ${evt.category}, ${evt.description},
          ${evt.organizer}, ${evt.format}, ${evt.event_date}, ${evt.registration_deadline},
          ${evt.venue}, ${evt.capacity}, ${evt.registered_count}, ${evt.participation_fee},
          ${evt.eligibility}, ${evt.status}, NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING;
      `;
    }
    console.log(`✔ Seeded ${existingEvents.length} existing events into 'available_events'!`);
  } else {
    console.log(`ℹ 'available_events' already contains ${currentCount} records.`);
  }
}

if (process.argv[1]?.endsWith("migrate-available-events.ts")) {
  migrateAndSeedAvailableEvents()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
