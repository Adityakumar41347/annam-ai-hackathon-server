"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const models_1 = require("../models");
const router = (0, express_1.Router)();
// GET /api/vehicles
router.get("/", async (_req, res) => {
    try {
        const vehicles = await models_1.Vehicle.find().sort({ label: 1 }).lean();
        res.json({ success: true, data: vehicles });
    }
    catch (err) {
        res.status(500).json({ success: false, error: String(err) });
    }
});
exports.default = router;
//# sourceMappingURL=vehicles.js.map