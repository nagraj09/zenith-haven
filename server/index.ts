import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleDownload, handleGetLink } from "./routes/download";
import { handleShortenUrl } from "./routes/shrinkme";

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

  // Video downloader routes
  app.post("/api/download", handleDownload);
  app.get("/api/link/:linkId", handleGetLink);

  // ShrinkMe API routes
  app.post("/api/shorten", handleShortenUrl);

  return app;
}
