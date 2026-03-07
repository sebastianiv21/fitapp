import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for web frontend
app.use(cors({
  origin: process.env.WEB_URL || "http://localhost:3001",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Better Auth handles all /api/auth/* routes
app.all("/api/auth/*", toNodeHandler(auth));

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
