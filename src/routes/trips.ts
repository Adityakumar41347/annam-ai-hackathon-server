import { Router, Request, Response } from "express";
import { Trip } from "../models";

const router = Router();

// POST /api/trips — save a completed or planned trip
router.post("/", async (req: Request, res: Response) => {
  try {
    const trip = await Trip.create(req.body);
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/trips/farmer/:farmerId — trip history for a farmer
router.get("/farmer/:farmerId", async (req: Request, res: Response) => {
  try {
    const page  = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip  = (page - 1) * limit;

    const [trips, total] = await Promise.all([
      Trip.find({ farmer: req.params.farmerId })
        .sort({ tripDate: -1 })
        .skip(skip)
        .limit(limit)
        .populate("crop",    "label value emoji")
        .populate("mandi",   "name district")
        .populate("vehicle", "label ratePerKm")
        .lean(),
      Trip.countDocuments({ farmer: req.params.farmerId }),
    ]);

    res.json({
      success: true,
      data:    trips,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// GET /api/trips/farmer/:farmerId/summary — profit totals & averages
router.get("/farmer/:farmerId/summary", async (req: Request, res: Response) => {
  try {
    const summary = await Trip.aggregate([
      { $match: { farmer: req.params.farmerId, status: "completed" } },
      {
        $group: {
          _id:              null,
          totalTrips:       { $sum: 1 },
          totalRevenue:     { $sum: "$revenue" },
          totalProfit:      { $sum: "$netProfit" },
          totalTransport:   { $sum: "$transportCost" },
          avgProfitMargin:  { $avg: "$profitMargin" },
          avgDistanceKm:    { $avg: "$distanceKm" },
          totalSavings:     { $sum: "$rideshareSavings" },
        },
      },
    ]);

    res.json({ success: true, data: summary[0] ?? {} });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

// PATCH /api/trips/:id/status — mark trip completed or cancelled
router.patch("/:id/status", async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!["planned", "completed", "cancelled"].includes(status)) {
      res.status(400).json({ success: false, error: "Invalid status" });
      return;
    }
    const trip = await Trip.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).lean();
    if (!trip) { res.status(404).json({ success: false, error: "Trip not found" }); return; }
    res.json({ success: true, data: trip });
  } catch (err) {
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;
