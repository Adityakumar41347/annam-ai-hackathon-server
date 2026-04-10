"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farmer = void 0;
const mongoose_1 = require("mongoose");
// ============================================================
//  Farmer Schema
//  Registered farmer profile
// ============================================================
const FarmerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
        // Used as primary login identifier — no password for MVP
    },
    village: {
        type: String,
        trim: true,
    },
    district: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    // GeoJSON Point — farmer's home/farm location
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point",
        },
        coordinates: {
            type: [Number],
            required: true,
            // [longitude, latitude]
        },
    },
    preferredCrops: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Crop",
        },
    ],
    preferredVehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Vehicle",
    },
    landHolding: {
        type: Number,
        default: 0,
        min: 0,
        // in acres
    },
}, {
    timestamps: true,
    collection: "farmers",
});
// ── Indexes ───────────────────────────────────────────────────
FarmerSchema.index({ location: "2dsphere" }); // for nearby farmer queries (rideshare)
FarmerSchema.index({ phone: 1 });
FarmerSchema.index({ state: 1, district: 1 });
exports.Farmer = (0, mongoose_1.model)("Farmer", FarmerSchema);
exports.default = exports.Farmer;
//# sourceMappingURL=Farmer.js.map