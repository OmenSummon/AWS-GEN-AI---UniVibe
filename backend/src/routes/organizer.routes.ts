import { Router, Request, Response } from "express";
import { getSql, isDbConfigured } from "../config/db.js";

export const organizerRouter = Router();

// GET organizer events
organizerRouter.get("/events", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  const organizerId = (req.query.organizerId as string) || "demo-organizer-001";
  try {
    const sql = getSql();
    const rows = await sql`
      SELECT * FROM organizer_events 
      WHERE organizer_id = ${organizerId} 
      ORDER BY updated_at DESC;
    `;
    res.json({ events: rows, count: rows.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch organizer events" });
  }
});

// GET metrics
organizerRouter.get("/metrics", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  const organizerId = (req.query.organizerId as string) || "demo-organizer-001";
  try {
    const sql = getSql();
    const events = await sql`SELECT * FROM organizer_events WHERE organizer_id = ${organizerId};`;

    const totalEvents = events.length;
    const published = events.filter((e: any) => e.status === "Published").length;
    const drafts = events.filter((e: any) => e.status === "Draft" || e.status === "In Planning").length;

    res.json({
      metrics: {
        totalEvents,
        published,
        drafts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch metrics" });
  }
});

