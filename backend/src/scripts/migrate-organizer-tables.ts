import dotenv from "dotenv";
import { MasterEventModel } from "../sections/masterEvent.js";

dotenv.config();

async function run() {
  console.log("----------------------------------------------------------------");
  console.log(" Migrating 6 Organizer Section Tables + Master Table to Neon DB ");
  console.log("----------------------------------------------------------------");

  try {
    const res = await MasterEventModel.initAllTables();
    console.log("✅ Success:", res.message);
    console.log("Tables Created/Verified:");
    console.log(" 1. master_events");
    console.log(" 2. event_summarized (Section 1)");
    console.log(" 3. event_audience (Section 2)");
    console.log(" 4. event_dates (Section 3)");
    console.log(" 5. event_other_info (Section 4)");
    console.log(" 6. event_objectives (Section 5)");
    console.log(" 7. event_registration_participation (Section 6)");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Migration failed:", error?.message || error);
    process.exit(1);
  }
}

run();

