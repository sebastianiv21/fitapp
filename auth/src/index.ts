import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Better Auth handles all /api/auth/* routes
app.all("/api/auth/*", toNodeHandler(auth));

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
