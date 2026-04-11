import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/database";


// ── Routes ────────────────────────────────────────────────────
import cropRoutes      from "./routes/crops";
import vehicleRoutes   from "./routes/vehicles";
import mandiRoutes     from "./routes/mandis";
import priceRoutes     from "./routes/prices";
import analyzeRoutes   from "./routes/analyze";
import farmerRoutes    from "./routes/farmers";
import tripRoutes      from "./routes/trips";
import rideshareRoutes from "./routes/rideshare";

const app  = express();
const PORT = parseInt(process.env.PORT ?? "5000", 10);

// ── Allowed origins (no trailing slashes) ─────────────────────
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://annam-ai-hackathon.vercel.app",
  "https://annam-ai-hackathon-server4.onrender.com",
  "https://annam-ai-hackathon-dlcvoph4n-aditya-kumars-projects-a84cc173.vercel.app/"
];

// Also allow CLIENT_URL from .env (strip trailing slash)
if (process.env.CLIENT_URL) {
  const clean = process.env.CLIENT_URL.replace(/\/$/, "");
  if (!ALLOWED_ORIGINS.includes(clean)) {
    ALLOWED_ORIGINS.push(clean);
  }
}

// ── CORS ──────────────────────────────────────────────────────
app.use(
  cors({
    origin: (incomingOrigin, callback) => {
      // Allow Postman / curl / mobile (no origin header)
      if (!incomingOrigin) return callback(null, true);

      // Strip trailing slash before comparing
      const clean = incomingOrigin.replace(/\/$/, "");

      if (ALLOWED_ORIGINS.includes(clean)) {
        return callback(null, true);
      }

      console.warn(`[CORS] Blocked: ${incomingOrigin}`);
      return callback(new Error(`CORS policy blocked origin: ${incomingOrigin}`));
    },
    credentials:    true,
    methods:        ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Respond to all preflight OPTIONS requests
app.options("*", cors());

// ── Other middleware ──────────────────────────────────────────
app.use(express.json());
app.use(morgan("dev"));

// ── Routes ────────────────────────────────────────────────────
app.use("/api/crops",     cropRoutes);
app.use("/api/vehicles",  vehicleRoutes);
app.use("/api/mandis",    mandiRoutes);
app.use("/api/prices",    priceRoutes);
app.use("/api/analyze",   analyzeRoutes);
app.use("/api/farmers",   farmerRoutes);
app.use("/api/trips",     tripRoutes);
app.use("/api/rideshare", rideshareRoutes);

// ── Health ────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({
    status:    "ok",
    timestamp: new Date().toISOString(),
    env:       process.env.NODE_ENV ?? "development",
  });
});

// ── 404 ───────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ── Start ─────────────────────────────────────────────────────
connectDB().then(async () => {
  
 

  app.listen(PORT, () => {
    console.log(`\n🚀 Krishi-Route API → http://localhost:${PORT}`);
    console.log(`🌍 Allowed origins:\n  ${ALLOWED_ORIGINS.join("\n  ")}`);
  });
});

export default app;