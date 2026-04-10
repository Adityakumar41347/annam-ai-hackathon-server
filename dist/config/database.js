"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = connectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/krishi_route";
async function connectDB() {
    try {
        await mongoose_1.default.connect(MONGODB_URI, {
            // Recommended connection options
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log(`✅ MongoDB connected: ${mongoose_1.default.connection.host}`);
    }
    catch (err) {
        console.error("❌ MongoDB connection error:", err);
        process.exit(1);
    }
}
// Log connection events
mongoose_1.default.connection.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
mongoose_1.default.connection.on("reconnected", () => console.log("🔄 MongoDB reconnected"));
exports.default = connectDB;
//# sourceMappingURL=database.js.map