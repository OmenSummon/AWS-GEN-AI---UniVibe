import { neon, Pool } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
  console.warn("⚠️  DATABASE_URL is not set in backend/.env. Neon DB queries will fail until provided.");
}

export const isDbConfigured = (): boolean => {
  return Boolean(process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("postgres"));
};

export function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("postgres")) {
    throw new Error("Neon DATABASE_URL is not configured. Please add it to backend/.env");
  }
  return neon(url);
}

export function getPool() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.startsWith("postgres")) {
    throw new Error("Neon DATABASE_URL is not configured. Please add it to backend/.env");
  }
  return new Pool({ connectionString: url });
}

export async function testDbConnection() {
  if (!isDbConfigured()) {
    return {
      connected: false,
      message: "DATABASE_URL is missing or invalid in backend/.env",
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const sql = getSql();
    const result = await sql`SELECT NOW() as current_time, current_database() as db_name, version() as pg_version;`;
    return {
      connected: true,
      message: "Successfully connected to Neon Serverless PostgreSQL",
      data: result[0],
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    return {
      connected: false,
      message: error?.message || "Failed to connect to Neon DB",
      error,
      timestamp: new Date().toISOString(),
    };
  }
}

