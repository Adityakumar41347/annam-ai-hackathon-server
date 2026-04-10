import { Schema, model } from "mongoose";
import type { IPriceAlert } from "../types";

// ============================================================
//  PriceAlert Schema
//  Farmer subscribes to alerts when prices hit thresholds
// ============================================================

const PriceAlertSchema = new Schema<IPriceAlert>(
  {
    farmer: {
      type:     Schema.Types.ObjectId,
      ref:      "Farmer",
      required: true,
    },

    mandi: {
      type:     Schema.Types.ObjectId,
      ref:      "Mandi",
      required: true,
    },

    crop: {
      type:     Schema.Types.ObjectId,
      ref:      "Crop",
      required: true,
    },

    alertType: {
      type:    String,
      enum:    ["price_drop", "price_spike", "peak_day", "volatility"],
      required: true,
      // price_drop:  notify if price falls below threshold ₹
      // price_spike: notify if price rises above threshold ₹
      // peak_day:    remind farmer the day before the mandi's peak day
      // volatility:  notify if price swings > threshold % in 3 days
    },

    threshold: {
      type:     Number,
      required: true,
      min:      0,
      // For price_drop/spike: ₹/quintal
      // For volatility: percentage (e.g. 10 = 10%)
    },

    isActive: {
      type:    Boolean,
      default: true,
    },

    lastTriggered: {
      type:    Date,
      default: null,
      // Prevents re-notifying within 24 hours
    },
  },
  {
    timestamps: true,
    collection: "price_alerts",
  }
);

// ── Indexes ───────────────────────────────────────────────────

PriceAlertSchema.index({ farmer: 1, isActive: 1 });
PriceAlertSchema.index({ mandi: 1, crop: 1, isActive: 1 });

// Unique: one alert per farmer+mandi+crop+type combo
PriceAlertSchema.index(
  { farmer: 1, mandi: 1, crop: 1, alertType: 1 },
  { unique: true }
);

export const PriceAlert = model<IPriceAlert>("PriceAlert", PriceAlertSchema);
export default PriceAlert;
