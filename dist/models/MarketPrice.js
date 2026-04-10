"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketPrice = void 0;
const mongoose_1 = require("mongoose");
// ============================================================
//  MarketPrice Schema
//  Daily price records per mandi per crop
//  This is the most queried collection — heavily indexed
// ============================================================
const MarketPriceSchema = new mongoose_1.Schema({
    mandi: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Mandi",
        required: true,
        // ref to the APMC market
    },
    crop: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Crop",
        required: true,
    },
    date: {
        type: Date,
        required: true,
        // Store as midnight UTC: new Date("2026-03-22")
    },
    minPrice: {
        type: Number,
        required: true,
        min: 0,
        // ₹ per quintal — lowest price of the day
    },
    maxPrice: {
        type: Number,
        required: true,
        min: 0,
        // ₹ per quintal — highest price of the day
    },
    modalPrice: {
        type: Number,
        required: true,
        min: 0,
        // ₹ per quintal — most common / weighted average
        // THIS is what the profit engine uses
    },
    arrivals: {
        type: Number,
        default: 0,
        min: 0,
        // total arrivals in tonnes — high arrivals often = lower price
    },
    trend: {
        type: String,
        enum: ["rising", "falling", "stable"],
        default: "stable",
        // computed by comparing last 3 days' modal prices
    },
    source: {
        type: String,
        enum: ["agmarknet", "manual", "estimated"],
        default: "agmarknet",
        // "estimated" = interpolated when API data is missing
    },
}, {
    // No updatedAt needed — prices are write-once from Agmarknet
    timestamps: { createdAt: true, updatedAt: false },
    collection: "market_prices",
});
// ── Indexes ───────────────────────────────────────────────────
// Primary query: "give me prices for mandi X, crop Y, last 30 days"
MarketPriceSchema.index({ mandi: 1, crop: 1, date: -1 });
// Uniqueness: one record per mandi+crop+day
MarketPriceSchema.index({ mandi: 1, crop: 1, date: 1 }, { unique: true });
// Bulk fetch by date range
MarketPriceSchema.index({ date: -1 });
// Filter by trend
MarketPriceSchema.index({ trend: 1 });
// ── Static method: compute trend from last 3 days ─────────────
MarketPriceSchema.statics.computeTrend = async function (mandiId, cropId, currentDate) {
    const threeDaysAgo = new Date(currentDate);
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const recent = await this.find({
        mandi: mandiId,
        crop: cropId,
        date: { $gte: threeDaysAgo, $lte: currentDate },
    })
        .sort({ date: 1 })
        .select("modalPrice")
        .lean();
    if (recent.length < 2)
        return "stable";
    const first = recent[0].modalPrice;
    const last = recent[recent.length - 1].modalPrice;
    const changePct = ((last - first) / first) * 100;
    if (changePct > 3)
        return "rising";
    if (changePct < -3)
        return "falling";
    return "stable";
};
exports.MarketPrice = (0, mongoose_1.model)("MarketPrice", MarketPriceSchema);
exports.default = exports.MarketPrice;
//# sourceMappingURL=MarketPrice.js.map