import type { Document, Types } from "mongoose";
export type PriceTrend = "rising" | "falling" | "stable";
export type RiskLevel = "high" | "medium" | "low";
export type QuantityUnit = "quintal" | "ton" | "kg";
export type VehicleType = "tata_ace" | "tractor" | "truck_lcv" | "mahindra" | "bolero" | "custom";
export type SeasonType = "kharif" | "rabi" | "zaid" | "all";
export interface ICrop extends Document {
    _id: Types.ObjectId;
    value: string;
    label: string;
    labelHindi: string;
    perishable: boolean;
    season: SeasonType;
    mspPrice: number;
    emoji: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IVehicle extends Document {
    _id: Types.ObjectId;
    value: string;
    label: string;
    capacityTons: number;
    ratePerKm: number;
    loadingCost: number;
    fuelType: "diesel" | "petrol" | "cng";
    createdAt: Date;
    updatedAt: Date;
}
export interface IMandi extends Document {
    _id: Types.ObjectId;
    mandiCode: string;
    name: string;
    nameHindi: string;
    state: string;
    district: string;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    isActive: boolean;
    apmc: boolean;
    peakDays: string[];
    operatingHours: {
        open: string;
        close: string;
    };
    contactPhone: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface IMarketPrice extends Document {
    _id: Types.ObjectId;
    mandi: Types.ObjectId;
    crop: Types.ObjectId;
    date: Date;
    minPrice: number;
    maxPrice: number;
    modalPrice: number;
    arrivals: number;
    trend: PriceTrend;
    source: "agmarknet" | "manual" | "estimated";
    createdAt: Date;
}
export interface IFarmer extends Document {
    _id: Types.ObjectId;
    name: string;
    phone: string;
    village: string;
    district: string;
    state: string;
    location: {
        type: "Point";
        coordinates: [number, number];
    };
    preferredCrops: Types.ObjectId[];
    preferredVehicle: Types.ObjectId;
    landHolding: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface ITrip extends Document {
    _id: Types.ObjectId;
    farmer: Types.ObjectId;
    crop: Types.ObjectId;
    mandi: Types.ObjectId;
    vehicle: Types.ObjectId;
    quantityQuintals: number;
    pricePerQuintal: number;
    revenue: number;
    transportCost: number;
    handlingCost: number;
    commissionCost: number;
    totalCost: number;
    netProfit: number;
    profitMargin: number;
    distanceKm: number;
    tripDate: Date;
    status: "planned" | "completed" | "cancelled";
    notes: string;
    rideshareWith: Types.ObjectId[];
    rideshareSavings: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface IPriceAlert extends Document {
    _id: Types.ObjectId;
    farmer: Types.ObjectId;
    mandi: Types.ObjectId;
    crop: Types.ObjectId;
    alertType: "price_drop" | "price_spike" | "peak_day" | "volatility";
    threshold: number;
    isActive: boolean;
    lastTriggered: Date | null;
    createdAt: Date;
}
export interface IRideshareRequest extends Document {
    _id: Types.ObjectId;
    requester: Types.ObjectId;
    mandi: Types.ObjectId;
    crop: Types.ObjectId;
    vehicle: Types.ObjectId;
    tripDate: Date;
    seatsAvailable: number;
    quantityCapacityLeft: number;
    pickupPoints: string[];
    status: "open" | "filled" | "cancelled";
    participants: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ApiSuccess<T> {
    success: true;
    data: T;
    message?: string;
}
export interface ApiError {
    success: false;
    error: string;
    details?: unknown;
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
export interface PriceQueryParams {
    mandiId: string;
    cropId: string;
    fromDate: string;
    toDate: string;
}
export interface AnalyzeQueryParams {
    cropId: string;
    locationLat: number;
    locationLng: number;
    radiusKm: number;
    quantityQuintals: number;
    vehicleId: string;
    handlingCost: number;
}
//# sourceMappingURL=index.d.ts.map