import { Router, Request, Response } from "express";
import { Mandi } from "../models";

const router = Router();

// GET /api/mandis?lat=29.94&lng=78.16&radius=100
// Returns mandis within `radius` km of the given coordinates
router.get("/", async (req: Request, res: Response) => {
  try {
    const lat    = parseFloat(req.query.lat as string);
    const lng    = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string) || 100; // km

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ success: false, error: "lat and lng are required" });
      return;
    }

    // $nearSphere requires the 2dsphere index on location
    const mandis = await Mandi.find({
      isActive: true,
      location: {
        $nearSphere: {
          $geometry:    { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius * 1000, // metres
        },
      },
    })
      .limit(10)
      .lean();

    res.json({ success: true, data: mandis, count: mandis.length });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/mandis/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const mandi = await Mandi.findById(req.params.id).lean();
    if (!mandi) { res.status(404).json({ success: false, error: "Mandi not found" }); return; }
    res.json({ success: true, data: mandi });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
