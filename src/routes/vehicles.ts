import { Router } from "express";
import { Vehicle } from "../models";

const router = Router();

// GET /api/vehicles
router.get("/", async (_req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ label: 1 }).lean();
    res.json({ success: true, data: vehicles });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
