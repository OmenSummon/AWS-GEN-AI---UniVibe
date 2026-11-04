import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { healthRouter } from "./routes/health.routes.js";
import { eventsRouter } from "./routes/events.routes.js";
import { profileRouter } from "./routes/profile.routes.js";
import { organizerRouter } from "./routes/organizer.routes.js";
import { masterEventRouter } from "./routes/master-event.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Middlewares
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api/health", healthRouter);
app.use("/api/events", eventsRouter);
app.use("/api/profile", profileRouter);
app.use("/api/organizer", organizerRouter);
app.use("/api/master-events", masterEventRouter);

// Root
app.get("/", (req, res) => {
  res.json({
    message: "UniVibe Standalone API Server is running.",
    routes: {
      health: "/api/health",
      masterEvents: "/api/master-events",
      events: "/api/events",
      profile: "/api/profile",
      organizer: "/api/organizer",
    },
  });
});

app.listen(PORT, () => {
  console.log(`\n🚀 UniVibe Backend API Server running on port ${PORT}`);
  console.log(`   Health & DB check: http://localhost:${PORT}/api/health`);
  console.log(`   Organizer Master Events: http://localhost:${PORT}/api/master-events\n`);
});
