"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crop = void 0;
const mongoose_1 = require("mongoose");
// ============================================================
//  Crop Schema
//  Stores all crop types that can be sold at mandis
// ============================================================
const CropSchema = new mongoose_1.Schema({
    value: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        // e.g. "onion", "tomato", "wheat"
    },
    label: {
        type: String,
        required: true,
        trim: true,
        // e.g. "Onion (प्याज)"
    },
    labelHindi: {
        type: String,
        required: true,
        trim: true,
        // e.g. "प्याज"
    },
    perishable: {
        type: Boolean,
        required: true,
        default: false,
        // If true → show spoilage warnings on long routes
    },
    season: {
        type: String,
        enum: ["kharif", "rabi", "zaid", "all"],
        default: "all",
        // kharif = June-Nov, rabi = Nov-Apr, zaid = Apr-Jun
    },
    mspPrice: {
        type: Number,
        default: 0,
        min: 0,
        // Minimum Support Price ₹/quintal set by govt
    },
    emoji: {
        type: String,
        default: "🌾",
    },
}, {
    timestamps: true, // adds createdAt & updatedAt automatically
    collection: "crops",
});
// Index for fast lookup by value slug
CropSchema.index({ value: 1 });
CropSchema.index({ season: 1 });
exports.Crop = (0, mongoose_1.model)("Crop", CropSchema);
exports.default = exports.Crop;
//# sourceMappingURL=Crop.js.map