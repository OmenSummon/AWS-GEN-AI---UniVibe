import { Router, Request, Response } from "express";
import { testDbConnection, isDbConfigured } from "../config/db.js";

export const healthRouter = Router();

healthRouter.get("/", async (req: Request, res: Response) => {
  const configured = isDbConfigured();
  const dbHealth = await testDbConnection();

  res.json({
    status: "ok",
    service: "UniVibe Backend API",
    configured,
    database: dbHealth.connected ? "Neon Serverless PostgreSQL (Connected)" : "Disconnected",
    details: dbHealth,
    timestamp: new Date().toISOString(),
  });
});

