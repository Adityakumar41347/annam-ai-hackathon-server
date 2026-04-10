// ============================================================
//  Krishi-Route Server — Shared TypeScript Types
// ============================================================

import type { Document, Types } from "mongoose";

// ── Enums ─────────────────────────────────────────────────────

export type PriceTrend   = "rising" | "falling" | "stable";
export type RiskLevel    = "high" | "medium" | "low";
export type QuantityUnit = "quintal" | "ton" | "kg";
export type VehicleType  = "tata_ace" | "tractor" | "truck_lcv" | "mahindra" | "bolero" | "custom";
export type SeasonType   = "kharif" | "rabi" | "zaid" | "all";

// ── Crop ─────────────────────────────────────────────────────

export interface ICrop extends Document {
  _id:        Types.ObjectId;
  value:      string;
  label:      string;
  labelHindi: string;
  perishable: boolean;
  season:     SeasonType;
  mspPrice:   number;          // Minimum Support Price ₹/quintal
  emoji:      string;
  createdAt:  Date;
  updatedAt:  Date;
}

// ── Vehicle ───────────────────────────────────────────────────

export interface IVehicle extends Document {
  _id:          Types.ObjectId;
  value:        string;
  label:        string;
  capacityTons: number;
  ratePerKm:    number;        // ₹ per km
  loadingCost:  number;        // ₹ fixed per trip
  fuelType:     "diesel" | "petrol" | "cng";
  createdAt:    Date;
  updatedAt:    Date;
}

// ── Mandi (APMC Market) ───────────────────────────────────────

export interface IMandi extends Document {
  _id:          Types.ObjectId;
  mandiCode:    string;        // Agmarknet code e.g. "UP_MZN_001"
  name:         string;
  nameHindi:    string;
  state:        string;
  district:     string;
  location: {
    type:        "Point";
    coordinates: [number, number];  // [lng, lat]
  };
  isActive:     boolean;
  apmc:         boolean;       // is it a registered APMC
  peakDays:     string[];      // ["Monday", "Thursday"]
  operatingHours: {
    open:  string;             // "06:00"
    close: string;             // "18:00"
  };
  contactPhone: string;
  createdAt:    Date;
  updatedAt:    Date;
}

// ── Market Price ─────────────────────────────────────────────

export interface IMarketPrice extends Document {
  _id:           Types.ObjectId;
  mandi:         Types.ObjectId;   // ref: Mandi
  crop:          Types.ObjectId;   // ref: Crop
  date:          Date;
  minPrice:      number;           // ₹ per quintal
  maxPrice:      number;
  modalPrice:    number;           // most common price (use for calc)
  arrivals:      number;           // tonnes arrived that day
  trend:         PriceTrend;
  source:        "agmarknet" | "manual" | "estimated";
  createdAt:     Date;
}

// ── Farmer ───────────────────────────────────────────────────

export interface IFarmer extends Document {
  _id:        Types.ObjectId;
  name:       string;
  phone:      string;             // primary identifier
  village:    string;
  district:   string;
  state:      string;
  location: {
    type:        "Point";
    coordinates: [number, number];
  };
  preferredCrops:  Types.ObjectId[];  // ref: Crop[]
  preferredVehicle: Types.ObjectId;   // ref: Vehicle
  landHolding:     number;            // acres
  createdAt:       Date;
  updatedAt:       Date;
}

// ── Trip (completed or planned) ───────────────────────────────

export interface ITrip extends Document {
  _id:             Types.ObjectId;
  farmer:          Types.ObjectId;    // ref: Farmer
  crop:            Types.ObjectId;    // ref: Crop
  mandi:           Types.ObjectId;    // ref: Mandi
  vehicle:         Types.ObjectId;    // ref: Vehicle

  // Quantities
  quantityQuintals: number;

  // Prices & costs at time of trip
  pricePerQuintal:  number;
  revenue:          number;
  transportCost:    number;
  handlingCost:     number;
  commissionCost:   number;
  totalCost:        number;
  netProfit:        number;
  profitMargin:     number;

  // Distance
  distanceKm:       number;

  // Trip metadata
  tripDate:         Date;
  status:           "planned" | "completed" | "cancelled";
  notes:            string;

  // Rideshare
  rideshareWith:    Types.ObjectId[];  // ref: Farmer[]
  rideshareSavings: number;

  createdAt:        Date;
  updatedAt:        Date;
}

// ── Price Alert ───────────────────────────────────────────────

export interface IPriceAlert extends Document {
  _id:        Types.ObjectId;
  farmer:     Types.ObjectId;   // ref: Farmer
  mandi:      Types.ObjectId;   // ref: Mandi
  crop:       Types.ObjectId;   // ref: Crop
  alertType:  "price_drop" | "price_spike" | "peak_day" | "volatility";
  threshold:  number;           // ₹ price or % change that triggers alert
  isActive:   boolean;
  lastTriggered: Date | null;
  createdAt:  Date;
}

// ── Rideshare Request ─────────────────────────────────────────

export interface IRideshareRequest extends Document {
  _id:           Types.ObjectId;
  requester:     Types.ObjectId;   // ref: Farmer
  mandi:         Types.ObjectId;   // ref: Mandi
  crop:          Types.ObjectId;   // ref: Crop
  vehicle:       Types.ObjectId;   // ref: Vehicle
  tripDate:      Date;
  seatsAvailable: number;
  quantityCapacityLeft: number;    // quintals still available in vehicle
  pickupPoints:  string[];
  status:        "open" | "filled" | "cancelled";
  participants:  Types.ObjectId[]; // ref: Farmer[]
  createdAt:     Date;
  updatedAt:     Date;
}

// ── API Response wrappers ─────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data:    T;
  message?: string;
}

export interface ApiError {
  success: false;
  error:   string;
  details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ── Query params ──────────────────────────────────────────────

export interface PriceQueryParams {
  mandiId:  string;
  cropId:   string;
  fromDate: string;
  toDate:   string;
}

export interface AnalyzeQueryParams {
  cropId:        string;
  locationLat:   number;
  locationLng:   number;
  radiusKm:      number;
  quantityQuintals: number;
  vehicleId:     string;
  handlingCost:  number;
}
