"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
// GET /api/prices?mandiId=xxx&cropId=yyy&days=7
// Returns price history for a mandi+crop combo
router.get("/", async (req, res) => {
    try {
        const { mandiId, cropId } = req.query;
        const days = parseInt(req.query.days) || 7;
        if (!mandiId || !cropId) {
            res.status(400).json({ success: false, error: "mandiId and cropId are required" });
            return;
        }
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);
        fromDate.setHours(0, 0, 0, 0);
        const prices = await models_1.MarketPrice.find({
            mandi: mandiId,
            crop: cropId,
            date: { $gte: fromDate },
        })
            .sort({ date: 1 })
            .populate("mandi", "name mandiCode")
            .populate("crop", "label value")
            .lean();
        res.json({ success: true, data: prices, count: prices.length });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
// GET /api/prices/latest?mandiId=xxx&cropId=yyy
// Returns only today's or most recent price
router.get("/latest", async (req, res) => {
    try {
        const { mandiId, cropId } = req.query;
        if (!mandiId || !cropId) {
            res.status(400).json({ success: false, error: "mandiId and cropId are required" });
            return;
        }
        const price = await models_1.MarketPrice.findOne({ mandi: mandiId, crop: cropId })
            .sort({ date: -1 })
            .populate("mandi", "name mandiCode")
            .populate("crop", "label value")
            .lean();
        if (!price) {
            res.status(404).json({ success: false, error: "No price data found" });
            return;
        }
        res.json({ success: true, data: price });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
// POST /api/prices — insert a new daily price record (admin/cron use)
router.post("/", async (req, res) => {
    try {
        const { mandi, crop, date, minPrice, maxPrice, modalPrice, arrivals, source } = req.body;
        // Upsert: update if record for this mandi+crop+date already exists
        const record = await models_1.MarketPrice.findOneAndUpdate({ mandi, crop, date: new Date(date) }, { minPrice, maxPrice, modalPrice, arrivals, source: source ?? "manual" }, { upsert: true, new: true, runValidators: true });
        res.status(201).json({ success: true, data: record });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=prices.js.map