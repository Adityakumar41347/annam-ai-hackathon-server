import { Router, Request, Response } from "express";
import { RideshareRequest } from "../models";

const router = Router();

// POST /api/rideshare — post a new rideshare request
router.post("/", async (req: Request, res: Response) => {
  try {
    const ride = await RideshareRequest.create(req.body);
    res.status(201).json({ success: true, data: ride });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/rideshare?mandiId=xxx&date=2026-03-25
// Find open rides going to a mandi on a specific date
router.get("/", async (req: Request, res: Response) => {
  try {
    const { mandiId, date } = req.query;

    if (!mandiId || !date) {
      res.status(400).json({ success: false, error: "mandiId and date are required" });
      return;
    }

    // Match any trip on the same calendar day
    const dayStart = new Date(date as string);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date as string);
    dayEnd.setHours(23, 59, 59, 999);

    const rides = await RideshareRequest.find({
      mandi:    mandiId,
      status:   "open",
      tripDate: { $gte: dayStart, $lte: dayEnd },
    })
      .populate("requester", "name phone village district")
      .populate("vehicle",   "label capacityTons ratePerKm")
      .populate("crop",      "label value emoji")
      .lean();

    res.json({ success: true, data: rides, count: rides.length });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// POST /api/rideshare/:id/join — farmer joins an existing ride
router.post("/:id/join", async (req: Request, res: Response) => {
  try {
    const { farmerId } = req.body;
    if (!farmerId) {
      res.status(400).json({ success: false, error: "farmerId is required" });
      return;
    }

    const ride = await RideshareRequest.findById(req.params.id);
    if (!ride) {
      res.status(404).json({ success: false, error: "Ride not found" });
      return;
    }
    if (ride.status !== "open") {
      res.status(400).json({ success: false, error: "Ride is no longer open" });
      return;
    }

    // Add farmer to participants (prevent duplicates)
    if (!ride.participants.some(p => p.toString() === farmerId)) {
      ride.participants.push(farmerId);
    }

    // Mark as filled when seats are taken
    if (ride.participants.length >= ride.seatsAvailable) {
      ride.status = "filled";
    }

    await ride.save();
    res.json({ success: true, data: ride });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PATCH /api/rideshare/:id/cancel
router.patch("/:id/cancel", async (req: Request, res: Response) => {
  try {
    const ride = await RideshareRequest.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    ).lean();
    if (!ride) { res.status(404).json({ success: false, error: "Ride not found" }); return; }
    res.json({ success: true, data: ride });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
