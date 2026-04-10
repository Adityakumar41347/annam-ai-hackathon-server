"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const database_1 = require("./config/database");
// ── Routes ────────────────────────────────────────────────────
const crops_1 = __importDefault(require("./routes/crops"));
const vehicles_1 = __importDefault(require("./routes/vehicles"));
const mandis_1 = __importDefault(require("./routes/mandis"));
const prices_1 = __importDefault(require("./routes/prices"));
const analyze_1 = __importDefault(require("./routes/analyze"));
const farmers_1 = __importDefault(require("./routes/farmers"));
const trips_1 = __importDefault(require("./routes/trips"));
const rideshare_1 = __importDefault(require("./routes/rideshare"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT ?? "5000", 10);
// ── Middleware ────────────────────────────────────────────────
app.use((0, cors_1.default)({ origin: process.env.CLIENT_URL ?? "http://localhost:3000" }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// ── API Routes ────────────────────────────────────────────────
app.use("/api/crops", crops_1.default);
app.use("/api/vehicles", vehicles_1.default);
app.use("/api/mandis", mandis_1.default);
app.use("/api/prices", prices_1.default);
app.use("/api/analyze", analyze_1.default);
app.use("/api/farmers", farmers_1.default);
app.use("/api/trips", trips_1.default);
app.use("/api/rideshare", rideshare_1.default);
// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
// ── 404 handler ───────────────────────────────────────────────
app.use((_req, res) => {
    res.status(404).json({ success: false, error: "Route not found" });
});
// ── Start ─────────────────────────────────────────────────────
(0, database_1.connectDB)().then(() => {
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
exports.default = app;
//# sourceMappingURL=server.js.map