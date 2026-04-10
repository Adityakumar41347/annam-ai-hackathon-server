import { Schema, model } from "mongoose";
import type { IFarmer } from "../types";

// ============================================================
//  Farmer Schema
//  Registered farmer profile
// ============================================================

const FarmerSchema = new Schema<IFarmer>(
  {
    name: {
      type:     String,
      required: true,
      trim:     true,
    },

    phone: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      match:    [/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"],
      // Used as primary login identifier — no password for MVP
    },

    village: {
      type:  String,
      trim:  true,
    },

    district: {
      type:  String,
      trim:  true,
    },

    state: {
      type:  String,
      trim:  true,
    },

    // GeoJSON Point — farmer's home/farm location
    location: {
      type: {
        type:    String,
        enum:    ["Point"],
        default: "Point",
      },
      coordinates: {
        type:     [Number],
        required: true,
        // [longitude, latitude]
      },
    },

    preferredCrops: [
      {
        type: Schema.Types.ObjectId,
        ref:  "Crop",
      },
    ],

    preferredVehicle: {
      type: Schema.Types.ObjectId,
      ref:  "Vehicle",
    },

    landHolding: {
      type:    Number,
      default: 0,
      min:     0,
      // in acres
    },
  },
  {
    timestamps: true,
    collection: "farmers",
  }
);

// ── Indexes ───────────────────────────────────────────────────

FarmerSchema.index({ location: "2dsphere" });  // for nearby farmer queries (rideshare)
FarmerSchema.index({ phone: 1 });
FarmerSchema.index({ state: 1, district: 1 });

export const Farmer = model<IFarmer>("Farmer", FarmerSchema);
export default Farmer;
