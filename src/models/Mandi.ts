import { Schema, model } from "mongoose";
import type { IMandi } from "../types";

// ============================================================
//  Mandi Schema
//  Agricultural Produce Market Committees (APMC) across India
//  Uses GeoJSON Point for geospatial queries (nearby mandis)
// ============================================================

const MandiSchema = new Schema<IMandi>(
  {
    mandiCode: {
      type:     String,
      required: true,
      unique:   true,
      trim:     true,
      uppercase: true,
      // Agmarknet code format: STATE_DISTRICT_SEQ e.g. "UP_MZN_001"
    },

    name: {
      type:     String,
      required: true,
      trim:     true,
      // e.g. "Muzaffarnagar APMC"
    },

    nameHindi: {
      type:  String,
      trim:  true,
      // e.g. "मुजफ्फरनगर APMC"
    },

    state: {
      type:     String,
      required: true,
      trim:     true,
      // e.g. "Uttar Pradesh"
    },

    district: {
      type:     String,
      required: true,
      trim:     true,
    },

    // GeoJSON Point — enables $nearSphere, $geoWithin queries
    location: {
      type: {
        type:    String,
        enum:    ["Point"],
        default: "Point",
      },
      coordinates: {
        type:     [Number],
        required: true,
        validate: {
          validator: (v: number[]) =>
            v.length === 2 &&
            v[0] >= -180 && v[0] <= 180 &&  // longitude
            v[1] >= -90  && v[1] <= 90,      // latitude
          message: "coordinates must be [longitude, latitude]",
        },
      },
    },

    isActive: {
      type:    Boolean,
      default: true,
    },

    apmc: {
      type:    Boolean,
      default: true,
      // true = registered APMC; false = informal market
    },

    peakDays: {
      type:    [String],
      default: [],
      // e.g. ["Monday", "Thursday"] — days with highest arrivals
    },

    operatingHours: {
      open: {
        type:    String,
        default: "06:00",
        match:   /^\d{2}:\d{2}$/,
      },
      close: {
        type:    String,
        default: "18:00",
        match:   /^\d{2}:\d{2}$/,
      },
    },

    contactPhone: {
      type:    String,
      default: "",
      trim:    true,
    },
  },
  {
    timestamps: true,
    collection: "mandis",
  }
);

// ── Indexes ───────────────────────────────────────────────────

// 2dsphere index REQUIRED for $nearSphere geospatial queries
MandiSchema.index({ location: "2dsphere" });

MandiSchema.index({ state: 1, district: 1 });
MandiSchema.index({ mandiCode: 1 });
MandiSchema.index({ isActive: 1 });

// ── Virtual: lat/lng convenience getters ─────────────────────

MandiSchema.virtual("lat").get(function (this: IMandi) {
  return this.location.coordinates[1];
});

MandiSchema.virtual("lng").get(function (this: IMandi) {
  return this.location.coordinates[0];
});

export const Mandi = model<IMandi>("Mandi", MandiSchema);
export default Mandi;
