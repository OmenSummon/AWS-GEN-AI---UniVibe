import { Router, Request, Response } from "express";
import { MasterEventModel } from "../sections/masterEvent.js";

export const masterEventRouter = Router();

// 1. Initialize all 7 tables in Neon DB
masterEventRouter.post("/init-tables", async (req: Request, res: Response) => {
  try {
    const result = await MasterEventModel.initAllTables();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to initialize tables" });
  }
});

// 2. List master events for organizer
masterEventRouter.get("/", async (req: Request, res: Response) => {
  try {
    const organizerId = (req.query.organizerId as string) || "demo-organizer-001";
    const events = await MasterEventModel.listByOrganizer(organizerId);
    res.json({ events, count: events.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to list master events" });
  }
});

// 3. Create a new master event
masterEventRouter.post("/", async (req: Request, res: Response) => {
  try {
    const { organizer_id, title } = req.body;
    const event = await MasterEventModel.create(organizer_id || "demo-organizer-001", title);
    res.status(201).json({ success: true, event });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to create master event" });
  }
});

// 4. Get full event aggregate (all 6 sections joined)
masterEventRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const event = await MasterEventModel.getFullEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Master event not found" });
    }
    res.json({ event });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch event aggregate" });
  }
});

// 5. Update or save an individual section into its dedicated table
masterEventRouter.put("/:id/sections/:section", async (req: Request, res: Response) => {
  try {
    const { id, section } = req.params;
    const savedData = await MasterEventModel.saveSection(id, section as any, req.body);
    // Fetch refreshed complete aggregate
    const aggregate = await MasterEventModel.getFullEvent(id);
    res.json({ success: true, section, data: savedData, aggregate });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save section" });
  }
});

// 6. Update master event status / readiness
masterEventRouter.put("/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, readiness_score } = req.body;
    await MasterEventModel.updateStatus(id, status, readiness_score);
    res.json({ success: true, status, readiness_score });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to update status" });
  }
});

// 7. Delete master event (cascades to all 6 tables)
masterEventRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await MasterEventModel.delete(id);
    res.json({ success: true, deleted_id: id });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to delete master event" });
  }
});

