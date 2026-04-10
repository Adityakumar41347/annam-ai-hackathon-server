// ============================================================
//  routes/crops.ts
// ============================================================
import { Router } from "express";
import { Crop } from "../models";

const router = Router();

// GET /api/crops
router.get("/", async (_req, res) => {
  try {
    const crops = await Crop.find().sort({ label: 1 }).lean();
    res.json({ success: true, data: crops });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
