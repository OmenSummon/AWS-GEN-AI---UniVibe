import { Router, Request, Response } from "express";
import { getSql, isDbConfigured } from "../config/db.js";

export const eventsRouter = Router();

// GET all available events from the available_events table
eventsRouter.get("/available", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  try {
    const sql = getSql();
    const category = req.query.category as string | undefined;
    const search = req.query.search as string | undefined;

    let rows = await sql`SELECT * FROM available_events ORDER BY event_date ASC;`;

    if (category && category !== "All") {
      rows = rows.filter((e: any) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      rows = rows.filter((e: any) =>
        e.name.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, events: rows, count: rows.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch available events" });
  }
});

// POST to available_events table
eventsRouter.post("/available", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  const {
    id,
    master_event_id,
    name,
    category,
    description,
    organizer,
    format,
    event_date,
    registration_deadline,
    venue,
    capacity,
    participation_fee,
    eligibility,
    status,
  } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: "Event name and category are required" });
  }

  const eventId = id || `avail-evt-${Date.now()}`;

  try {
    const sql = getSql();
    await sql`
      INSERT INTO available_events (
        id, master_event_id, name, category, description, organizer, format,
        event_date, registration_deadline, venue, capacity, registered_count,
        participation_fee, eligibility, status, updated_at
      ) VALUES (
        ${eventId}, ${master_event_id || null}, ${name}, ${category}, ${description || ""},
        ${organizer || "Student Organization"}, ${format || "Offline"},
        ${event_date || new Date().toISOString().split("T")[0]},
        ${registration_deadline || new Date().toISOString().split("T")[0]},
        ${venue || "Campus Auditorium"},
        ${Number(capacity) || 100}, 0,
        ${String(participation_fee || "0")},
        ${eligibility || "Open to all students"},
        ${status || "Registration Open"}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        category = EXCLUDED.category,
        description = EXCLUDED.description,
        organizer = EXCLUDED.organizer,
        format = EXCLUDED.format,
        event_date = EXCLUDED.event_date,
        registration_deadline = EXCLUDED.registration_deadline,
        venue = EXCLUDED.venue,
        capacity = EXCLUDED.capacity,
        participation_fee = EXCLUDED.participation_fee,
        eligibility = EXCLUDED.eligibility,
        status = EXCLUDED.status,
        updated_at = NOW();
    `;

    res.json({ success: true, id: eventId, message: "Saved to available_events table!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save available event" });
  }
});

// GET all events from legacy events table
eventsRouter.get("/", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  try {
    const sql = getSql();
    const category = req.query.category as string | undefined;

    let events;
    if (category && category !== "All") {
      events = await sql`SELECT * FROM events WHERE category = ${category} ORDER BY start_datetime ASC;`;
    } else {
      events = await sql`SELECT * FROM events ORDER BY start_datetime ASC;`;
    }

    res.json({ events, count: events.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch events" });
  }
});

// GET single event by id
eventsRouter.get("/:id", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM events WHERE id = ${req.params.id} LIMIT 1;`;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json({ event: rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch event" });
  }
});
