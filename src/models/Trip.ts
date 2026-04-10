import { Schema, model } from "mongoose";
import type { ITrip } from "../types";

// ============================================================
//  Trip Schema
//  Records every trip a farmer makes (or plans) to a mandi
//  Powers: profit history, analytics, rideshare matching
// ============================================================

const TripSchema = new Schema<ITrip>(
  {
    farmer: {
      type:     Schema.Types.ObjectId,
      ref:      "Farmer",
      required: true,
    },

    crop: {
      type:     Schema.Types.ObjectId,
      ref:      "Crop",
      required: true,
    },

    mandi: {
      type:     Schema.Types.ObjectId,
      ref:      "Mandi",
      required: true,
    },

    vehicle: {
      type:     Schema.Types.ObjectId,
      ref:      "Vehicle",
      required: true,
    },

    // ── Quantity ───────────────────────────────────────────

    quantityQuintals: {
      type:     Number,
      required: true,
      min:      0.1,
    },

    // ── Financials (snapshot at trip time) ────────────────
    // Stored here so historical data isn't affected by price changes

    pricePerQuintal: {
      type:     Number,
      required: true,
      min:      0,
    },

    revenue: {
      type:     Number,
      required: true,
      min:      0,
      // pricePerQuintal × quantityQuintals
    },

    transportCost: {
      type:     Number,
      required: true,
      min:      0,
      // distanceKm × vehicle.ratePerKm
    },

    handlingCost: {
      type:     Number,
      required: true,
      min:      0,
      // loading + unloading ₹
    },

    commissionCost: {
      type:     Number,
      required: true,
      min:      0,
      // APMC commission (typically 2% of revenue)
    },

    totalCost: {
      type:     Number,
      required: true,
      min:      0,
      // transportCost + handlingCost + commissionCost
    },

    netProfit: {
      type:     Number,
      required: true,
      // revenue - totalCost (can be negative)
    },

    profitMargin: {
      type:     Number,
      required: true,
      // (netProfit / revenue) × 100
    },

    // ── Distance ──────────────────────────────────────────

    distanceKm: {
      type:     Number,
      required: true,
      min:      0,
    },

    // ── Trip Metadata ──────────────────────────────────────

    tripDate: {
      type:     Date,
      required: true,
      default:  Date.now,
    },

    status: {
      type:    String,
      enum:    ["planned", "completed", "cancelled"],
      default: "planned",
    },

    notes: {
      type:    String,
      default: "",
      maxlength: 500,
    },

    // ── Rideshare ──────────────────────────────────────────

    rideshareWith: [
      {
        type: Schema.Types.ObjectId,
        ref:  "Farmer",
      },
    ],

    rideshareSavings: {
      type:    Number,
      default: 0,
      min:     0,
      // ₹ saved because of pooling
    },
  },
  {
    timestamps: true,
    collection: "trips",
  }
);

// ── Indexes ───────────────────────────────────────────────────

// Farmer's trip history (most common query)
TripSchema.index({ farmer: 1, tripDate: -1 });

// Mandi analytics
TripSchema.index({ mandi: 1, tripDate: -1 });

// Crop analytics
TripSchema.index({ crop: 1, tripDate: -1 });

// Status filter
TripSchema.index({ status: 1 });

// Combined for dashboard queries
TripSchema.index({ farmer: 1, crop: 1, tripDate: -1 });

// ── Pre-save hook: auto-calculate derived fields ──────────────

TripSchema.pre("save", function (next) {
  if (this.isModified("revenue") || this.isModified("totalCost")) {
    this.netProfit    = this.revenue - this.totalCost;
    this.profitMargin = this.revenue > 0
      ? (this.netProfit / this.revenue) * 100
      : 0;
  }
  next();
});

// ── Virtual: profit per km ────────────────────────────────────

TripSchema.virtual("profitPerKm").get(function (this: ITrip) {
  return this.distanceKm > 0 ? this.netProfit / this.distanceKm : 0;
});

export const Trip = model<ITrip>("Trip", TripSchema);
export default Trip;
