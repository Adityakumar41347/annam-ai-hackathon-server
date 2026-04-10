import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/krishi_route";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI, {
      // Recommended connection options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS:          45000,
    });
    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

// Log connection events
mongoose.connection.on("disconnected", () => console.warn("⚠️  MongoDB disconnected"));
mongoose.connection.on("reconnected",  () => console.log("🔄 MongoDB reconnected"));

export default connectDB;
