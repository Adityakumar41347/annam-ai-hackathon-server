// ============================================================
//  Seed Script — run with: npm run seed
//  Populates crops, vehicles, mandis + 30 days of price history
// ============================================================

import "dotenv/config";
import mongoose from "mongoose";
import { Crop, Vehicle, Mandi, MarketPrice } from "../models";

const MONGODB_URI = process.env.MONGODB_URI ?? "mongodb://localhost:27017/krishi_route";

// ── Seed data ─────────────────────────────────────────────────

const CROPS_DATA = [
  { value:"onion",   label:"Onion (प्याज)",   labelHindi:"प्याज",  perishable:true,  season:"rabi",   mspPrice:0,    emoji:"🧅" },
  { value:"tomato",  label:"Tomato (टमाटर)",  labelHindi:"टमाटर",  perishable:true,  season:"kharif", mspPrice:0,    emoji:"🍅" },
  { value:"wheat",   label:"Wheat (गेहूं)",   labelHindi:"गेहूं",  perishable:false, season:"rabi",   mspPrice:2275, emoji:"🌾" },
  { value:"potato",  label:"Potato (आलू)",    labelHindi:"आलू",    perishable:true,  season:"rabi",   mspPrice:0,    emoji:"🥔" },
  { value:"garlic",  label:"Garlic (लहसुन)",  labelHindi:"लहसुन",  perishable:false, season:"rabi",   mspPrice:0,    emoji:"🧄" },
  { value:"rice",    label:"Rice (चावल)",     labelHindi:"चावल",   perishable:false, season:"kharif", mspPrice:2300, emoji:"🌾" },
  { value:"mustard", label:"Mustard (सरसों)", labelHindi:"सरसों",  perishable:false, season:"rabi",   mspPrice:5650, emoji:"🌿" },
  { value:"maize",   label:"Maize (मक्का)",   labelHindi:"मक्का",  perishable:false, season:"kharif", mspPrice:2090, emoji:"🌽" },
];

const VEHICLES_DATA = [
  { value:"tata_ace",  label:"Tata Ace",        capacityTons:1.0, ratePerKm:18, loadingCost:150, fuelType:"diesel" },
  { value:"tractor",   label:"Tractor-Trolley", capacityTons:2.0, ratePerKm:14, loadingCost:100, fuelType:"diesel" },
  { value:"truck_lcv", label:"Truck (LCV)",      capacityTons:5.0, ratePerKm:22, loadingCost:250, fuelType:"diesel" },
  { value:"mahindra",  label:"Mahindra Pickup",  capacityTons:1.5, ratePerKm:16, loadingCost:120, fuelType:"diesel" },
  { value:"bolero",    label:"Bolero Pickup",    capacityTons:1.0, ratePerKm:17, loadingCost:130, fuelType:"diesel" },
];

const MANDIS_DATA = [
  { mandiCode:"UK_HDW_001", name:"Haridwar APMC",        nameHindi:"हरिद्वार APMC",       state:"Uttarakhand", district:"Haridwar",      coordinates:[78.1700, 29.9500], peakDays:["Tuesday","Friday"]      },
  { mandiCode:"UK_RKE_001", name:"Roorkee Mandi",         nameHindi:"रुड़की मंडी",          state:"Uttarakhand", district:"Haridwar",      coordinates:[77.8880, 29.8543], peakDays:["Wednesday","Saturday"]  },
  { mandiCode:"UP_SRN_001", name:"Saharanpur APMC",        nameHindi:"सहारनपुर APMC",       state:"Uttar Pradesh",district:"Saharanpur",   coordinates:[77.5456, 29.9680], peakDays:["Monday","Thursday"]     },
  { mandiCode:"UP_MZN_001", name:"Muzaffarnagar Mandi",    nameHindi:"मुजफ्फरनगर मंडी",    state:"Uttar Pradesh",district:"Muzaffarnagar",coordinates:[77.7085, 29.4727], peakDays:["Thursday","Sunday"]     },
  { mandiCode:"UK_DDN_001", name:"Dehradun APMC",          nameHindi:"देहरादून APMC",       state:"Uttarakhand", district:"Dehradun",      coordinates:[78.0322, 30.3165], peakDays:["Monday","Friday"]       },
  { mandiCode:"UP_MRT_001", name:"Meerut Mandi",           nameHindi:"मेरठ मंडी",           state:"Uttar Pradesh",district:"Meerut",       coordinates:[77.7064, 28.9845], peakDays:["Monday","Thursday"]     },
  { mandiCode:"UP_GZB_001", name:"Ghaziabad Mandi",        nameHindi:"गाजियाबाद मंडी",     state:"Uttar Pradesh",district:"Ghaziabad",    coordinates:[77.4538, 28.6692], peakDays:["Wednesday","Saturday"]  },
  { mandiCode:"UP_DBO_001", name:"Deoband Mandi",           nameHindi:"देवबंद मंडी",        state:"Uttar Pradesh",district:"Saharanpur",   coordinates:[77.6856, 29.6965], peakDays:["Monday","Thursday"]     },
];

// Base prices per crop (₹/quintal) — used for generating mock history
const BASE_PRICES: Record<string, number> = {
  onion:1800, tomato:2200, wheat:2100, potato:1200,
  garlic:6000, rice:2800, mustard:5400, maize:1700,
};

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

async function seed(): Promise<void> {
  await mongoose.connect(MONGODB_URI);
  console.log("🔗 Connected to MongoDB");

  // Clear existing
  await Promise.all([
    Crop.deleteMany({}),
    Vehicle.deleteMany({}),
    Mandi.deleteMany({}),
    MarketPrice.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing data");

  // Insert crops
  const crops = await Crop.insertMany(CROPS_DATA);
  console.log(`✅ Inserted ${crops.length} crops`);

  // Insert vehicles
  const vehicles = await Vehicle.insertMany(VEHICLES_DATA);
  console.log(`✅ Inserted ${vehicles.length} vehicles`);

  // Insert mandis
  const mandisToInsert = MANDIS_DATA.map(m => ({
    ...m,
    location: { type: "Point" as const, coordinates: m.coordinates },
    isActive: true, apmc: true,
    operatingHours: { open:"06:00", close:"18:00" },
  }));
  const mandis = await Mandi.insertMany(mandisToInsert);
  console.log(`✅ Inserted ${mandis.length} mandis`);

  // Generate 30 days of price history for each mandi × crop
  const priceRecords = [];
  const today = new Date();
  today.setHours(0,0,0,0);

  for (const mandi of mandis) {
    for (const crop of crops) {
      const base    = BASE_PRICES[crop.value] ?? 1500;
      let prevModal = base;

      for (let d = 29; d >= 0; d--) {
        const date = new Date(today);
        date.setDate(date.getDate() - d);

        // Simulate natural price movement
        const swing    = randomBetween(-1, 1) * base * 0.04;
        const modal    = Math.max(100, Math.round(prevModal + swing));
        const minPrice = Math.round(modal * randomBetween(88, 95) / 100);
        const maxPrice = Math.round(modal * randomBetween(105, 115) / 100);
        const arrivals = randomBetween(10, 200);

        priceRecords.push({
          mandi:      mandi._id,
          crop:       crop._id,
          date,
          minPrice,
          maxPrice,
          modalPrice: modal,
          arrivals,
          trend:      "stable",   // will be recomputed by API
          source:     "estimated",
        });

        prevModal = modal;
      }
    }
  }

  await MarketPrice.insertMany(priceRecords);
  console.log(`✅ Inserted ${priceRecords.length} price records (${mandis.length} mandis × ${crops.length} crops × 30 days)`);

  console.log("\n🌾 Seed complete!");
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
