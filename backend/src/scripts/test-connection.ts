import dotenv from "dotenv";
import { testDbConnection } from "../config/db.js";

dotenv.config();

async function run() {
  console.log("-------------------------------------------------");
  console.log(" Testing connection to Neon Serverless PostgreSQL");
  console.log("-------------------------------------------------");

  const res = await testDbConnection();

  if (res.connected) {
    console.log("✅ Neon DB Connection SUCCESSFUL!");
    console.log("Database:", (res.data as any)?.db_name);
    console.log("PostgreSQL Version:", (res.data as any)?.pg_version);
    console.log("Database Time:", (res.data as any)?.current_time);
    process.exit(0);
  } else {
    console.error("❌ Neon DB Connection FAILED:");
    console.error(res.message);
    if (res.error) {
      console.error(res.error);
    }
    console.log("\n💡 Check your DATABASE_URL in backend/.env");
    console.log("Example: postgresql://[user]:[password]@[endpoint].neon.tech/[dbname]?sslmode=require\n");
    process.exit(1);
  }
}

run();

