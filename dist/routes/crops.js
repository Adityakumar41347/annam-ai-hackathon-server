"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ============================================================
//  routes/crops.ts
// ============================================================
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
// GET /api/crops
router.get("/", async (_req, res) => {
    try {
        const crops = await models_1.Crop.find().sort({ label: 1 }).lean();
        res.json({ success: true, data: crops });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=crops.js.map