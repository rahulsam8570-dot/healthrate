import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleFileUpload, uploadMiddleware } from "./routes/upload";
import { searchClinics } from "./routes/clinics";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // HealthRate API routes
  app.post("/api/upload", uploadMiddleware, handleFileUpload);
  app.get("/api/clinics/search", searchClinics);

  return app;
}
