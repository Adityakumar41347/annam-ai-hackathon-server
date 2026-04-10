import { Schema, model } from "mongoose";
import type { IVehicle } from "../types";

// ============================================================
//  Vehicle Schema
//  Transport options with cost-per-km rates
// ============================================================

const VehicleSchema = new Schema<IVehicle>(
  {
    value: {
      type:      String,
      required:  true,
      unique:    true,
      trim:      true,
      lowercase: true,
      // e.g. "tata_ace", "tractor", "truck_lcv"
    },

    label: {
      type:     String,
      required: true,
      trim:     true,
      // e.g. "Tata Ace", "Tractor-Trolley"
    },

    capacityTons: {
      type:     Number,
      required: true,
      min:      0.1,
      // max load in metric tons
    },

    ratePerKm: {
      type:     Number,
      required: true,
      min:      0,
      // ₹ per km — update when diesel prices change
    },

    loadingCost: {
      type:    Number,
      default: 150,
      min:     0,
      // ₹ fixed loading/unloading per trip
    },

    fuelType: {
      type:    String,
      enum:    ["diesel", "petrol", "cng"],
      default: "diesel",
    },
  },
  {
    timestamps: true,
    collection: "vehicles",
  }
);

VehicleSchema.index({ value: 1 });

export const Vehicle = model<IVehicle>("Vehicle", VehicleSchema);
export default Vehicle;
