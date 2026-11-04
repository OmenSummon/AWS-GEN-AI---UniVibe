import { Router, Request, Response } from "express";
import { getSql, isDbConfigured } from "../config/db.js";

export const profileRouter = Router();

// GET profile
profileRouter.get("/:id", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  try {
    const sql = getSql();
    const rows = await sql`SELECT * FROM profiles WHERE id = ${req.params.id} LIMIT 1;`;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({ profile: rows[0] });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to fetch profile" });
  }
});

// POST/PUT save profile
profileRouter.post("/", async (req: Request, res: Response) => {
  if (!isDbConfigured()) {
    return res.status(503).json({ error: "Neon DB is not configured in backend/.env" });
  }

  const p = req.body;
  if (!p || !p.id || !p.student_name) {
    return res.status(400).json({ error: "Missing required fields (id, student_name)" });
  }

  try {
    const sql = getSql();
    await sql`
      INSERT INTO profiles (
        id, student_name, department, year, interests, skills, free_time, goal, tone, university_name, avatar_url, onboarding_completed, updated_at
      ) VALUES (
        ${p.id}, ${p.student_name}, ${p.department || ""}, ${p.year || ""}, 
        ${p.interests || []}, ${p.skills || []}, ${p.free_time || ""}, ${p.goal || ""}, 
        ${p.tone || "Friendly"}, ${p.university_name || "State Innovation University"}, 
        ${p.avatar_url || null}, ${Boolean(p.onboarding_completed)}, NOW()
      )
      ON CONFLICT (id) DO UPDATE SET
        student_name = EXCLUDED.student_name,
        department = EXCLUDED.department,
        year = EXCLUDED.year,
        interests = EXCLUDED.interests,
        skills = EXCLUDED.skills,
        free_time = EXCLUDED.free_time,
        goal = EXCLUDED.goal,
        tone = EXCLUDED.tone,
        university_name = EXCLUDED.university_name,
        avatar_url = EXCLUDED.avatar_url,
        onboarding_completed = EXCLUDED.onboarding_completed,
        updated_at = NOW();
    `;
    res.json({ success: true, profile: p });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to save profile" });
  }
});

