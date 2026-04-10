"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
// POST /api/farmers — register a new farmer
router.post("/", async (req, res) => {
    try {
        const { name, phone, village, district, state, lat, lng, landHolding } = req.body;
        if (!name || !phone || !lat || !lng) {
            res.status(400).json({ success: false, error: "name, phone, lat, lng are required" });
            return;
        }
        const farmer = await models_1.Farmer.create({
            name, phone, village, district, state,
            location: { type: "Point", coordinates: [lng, lat] },
            landHolding: landHolding ?? 0,
        });
        res.status(201).json({ success: true, data: farmer });
    }
    catch (err) {
        // Duplicate phone
        if (typeof err === "object" && err !== null && "code" in err && err.code === 11000) {
            res.status(409).json({ success: false, error: "Phone number already registered" });
            return;
        }
        res.status(500).json({ success: false, error: String(err) });
    }
});
// GET /api/farmers/:phone — lookup by phone
router.get("/:phone", async (req, res) => {
    try {
        const farmer = await models_1.Farmer.findOne({ phone: req.params.phone })
            .populate("preferredCrops", "label value emoji")
            .populate("preferredVehicle", "label ratePerKm")
            .lean();
        if (!farmer) {
            res.status(404).json({ success: false, error: "Farmer not found" });
            return;
        }
        res.json({ success: true, data: farmer });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
// PATCH /api/farmers/:id — update preferences
router.patch("/:id", async (req, res) => {
    try {
        const updated = await models_1.Farmer.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true }).lean();
        if (!updated) {
            res.status(404).json({ success: false, error: "Farmer not found" });
            return;
        }
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=farmers.js.map