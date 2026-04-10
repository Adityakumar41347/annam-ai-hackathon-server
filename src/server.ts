import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectDB } from "./config/database";

// ── Routes ────────────────────────────────────────────────────
import cropRoutes       from "./routes/crops";
import vehicleRoutes    from "./routes/vehicles";
import mandiRoutes      from "./routes/mandis";
import priceRoutes      from "./routes/prices";
import analyzeRoutes    from "./routes/analyze";
import farmerRoutes     from "./routes/farmers";
import tripRoutes       from "./routes/trips";
import rideshareRoutes  from "./routes/rideshare";

const app  = express();
const PORT = parseInt(process.env.PORT ?? "5000", 10);

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL ?? "http://localhost:3000" }));
app.use(express.json());
app.use(morgan("dev"));

// ── API Routes ────────────────────────────────────────────────
app.use("/api/crops",      cropRoutes);
app.use("/api/vehicles",   vehicleRoutes);
app.use("/api/mandis",     mandiRoutes);
app.use("/api/prices",     priceRoutes);
app.use("/api/analyze",    analyzeRoutes);
app.use("/api/farmers",    farmerRoutes);
app.use("/api/trips",      tripRoutes);
app.use("/api/rideshare",  rideshareRoutes);

// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// ── Start ─────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Krishi-Route API running on http://localhost:${PORT}`);
    console.log(`📋 Routes:`);
    console.log(`   GET  /api/crops`);
    console.log(`   GET  /api/vehicles`);
    console.log(`   GET  /api/mandis?lat=29.94&lng=78.16&radius=100`);
    console.log(`   GET  /api/prices?mandiId=&cropId=&days=7`);
    console.log(`   POST /api/analyze`);
    console.log(`   POST /api/farmers`);
    console.log(`   GET  /api/trips/:farmerId`);
    console.log(`   GET  /api/rideshare?mandiId=&date=`);
  });
});

export default app;
