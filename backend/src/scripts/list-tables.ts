import dotenv from "dotenv";
import { getSql } from "../config/db.js";

dotenv.config();

async function run() {
  const sql = getSql();
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name ASC;
  `;

  console.log("=========================================");
  console.log(` Neon PostgreSQL: ${tables.length} Public Tables Found`);
  console.log("=========================================");
  for (const t of tables) {
    console.log(` • ${t.table_name}`);
  }
}

run();

