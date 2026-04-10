"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RideshareRequest = void 0;
const mongoose_1 = require("mongoose");
// ============================================================
//  RideshareRequest Schema
//  Farmer posts a trip with spare capacity → others can join
//  Saves 40-45% on transport costs for all participants
// ============================================================
const RideshareRequestSchema = new mongoose_1.Schema({
    requester: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Farmer",
        required: true,
        // The farmer who owns the vehicle / posted the request
    },
    mandi: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Mandi",
        required: true,
    },
    crop: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Crop",
        required: true,
        // Primary crop — other participants may have same or similar crop
    },
    vehicle: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Vehicle",
        required: true,
    },
    tripDate: {
        type: Date,
        required: true,
    },
    seatsAvailable: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        // Additional passengers the vehicle can carry
    },
    quantityCapacityLeft: {
        type: Number,
        required: true,
        min: 0,
        // Remaining quintals the vehicle can carry after owner's load
    },
    pickupPoints: {
        type: [String],
        default: [],
        // Village/landmark names where requester can pick up others
    },
    status: {
        type: String,
        enum: ["open", "filled", "cancelled"],
        default: "open",
    },
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Farmer",
            // Farmers who have joined this rideshare
        },
    ],
}, {
    timestamps: true,
    collection: "rideshare_requests",
});
// ── Indexes ───────────────────────────────────────────────────
// Find open rides going to a specific mandi on a date
RideshareRequestSchema.index({ mandi: 1, tripDate: 1, status: 1 });
// Farmer's posted requests
RideshareRequestSchema.index({ requester: 1, status: 1 });
// Trips a farmer joined
RideshareRequestSchema.index({ participants: 1 });
// TTL index — auto-delete cancelled/filled requests after 7 days
RideshareRequestSchema.index({ updatedAt: 1 }, {
    expireAfterSeconds: 7 * 24 * 60 * 60, // 7 days
    partialFilterExpression: { status: { $in: ["filled", "cancelled"] } },
});
exports.RideshareRequest = (0, mongoose_1.model)("RideshareRequest", RideshareRequestSchema);
exports.default = exports.RideshareRequest;
//# sourceMappingURL=RideshareRequest.js.map