"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
// GET /api/mandis?lat=29.94&lng=78.16&radius=100
// Returns mandis within `radius` km of the given coordinates
router.get("/", async (req, res) => {
    try {
        const lat = parseFloat(req.query.lat);
        const lng = parseFloat(req.query.lng);
        const radius = parseFloat(req.query.radius) || 100; // km
        if (isNaN(lat) || isNaN(lng)) {
            res.status(400).json({ success: false, error: "lat and lng are required" });
            return;
        }
        // $nearSphere requires the 2dsphere index on location
        const mandis = await models_1.Mandi.find({
            isActive: true,
            location: {
                $nearSphere: {
                    $geometry: { type: "Point", coordinates: [lng, lat] },
                    $maxDistance: radius * 1000, // metres
                },
            },
        })
            .limit(10)
            .lean();
        res.json({ success: true, data: mandis, count: mandis.length });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
// GET /api/mandis/:id
router.get("/:id", async (req, res) => {
    try {
        const mandi = await models_1.Mandi.findById(req.params.id).lean();
        if (!mandi) {
            res.status(404).json({ success: false, error: "Mandi not found" });
            return;
        }
        res.json({ success: true, data: mandi });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=mandis.js.map