// ============================================================
//  Krishi-Route — Complete Mock Data Seed
//  Run with:
//  mongosh "mongodb://localhost:27017/krishi_route" --file seedAll.js
//
//  OR paste section by section into mongosh shell
// ============================================================

db = db.getSiblingDB("krishi_route");

// ============================================================
//  STEP 1 — CLEAR ALL COLLECTIONS (fresh start)
// ============================================================

print("\n🗑️  Clearing existing data...");
db.crops.deleteMany({});
db.vehicles.deleteMany({});
db.mandis.deleteMany({});
db.market_prices.deleteMany({});
db.farmers.deleteMany({});
db.trips.deleteMany({});
db.price_alerts.deleteMany({});
db.rideshare_requests.deleteMany({});
print("✅ All collections cleared");

// ============================================================
//  STEP 2 — CROPS
// ============================================================

print("\n🌾 Inserting crops...");
db.crops.insertMany([
  { value: "onion",   label: "Onion (प्याज)",   labelHindi: "प्याज",  perishable: true,  season: "rabi",   mspPrice: 0,    emoji: "🧅", createdAt: new Date(), updatedAt: new Date() },
  { value: "tomato",  label: "Tomato (टमाटर)",  labelHindi: "टमाटर",  perishable: true,  season: "kharif", mspPrice: 0,    emoji: "🍅", createdAt: new Date(), updatedAt: new Date() },
  { value: "wheat",   label: "Wheat (गेहूं)",   labelHindi: "गेहूं",  perishable: false, season: "rabi",   mspPrice: 2275, emoji: "🌾", createdAt: new Date(), updatedAt: new Date() },
  { value: "potato",  label: "Potato (आलू)",    labelHindi: "आलू",    perishable: true,  season: "rabi",   mspPrice: 0,    emoji: "🥔", createdAt: new Date(), updatedAt: new Date() },
  { value: "garlic",  label: "Garlic (लहसुन)",  labelHindi: "लहसुन",  perishable: false, season: "rabi",   mspPrice: 0,    emoji: "🧄", createdAt: new Date(), updatedAt: new Date() },
  { value: "rice",    label: "Rice (चावल)",     labelHindi: "चावल",   perishable: false, season: "kharif", mspPrice: 2300, emoji: "🌾", createdAt: new Date(), updatedAt: new Date() },
  { value: "mustard", label: "Mustard (सरसों)", labelHindi: "सरसों",  perishable: false, season: "rabi",   mspPrice: 5650, emoji: "🌿", createdAt: new Date(), updatedAt: new Date() },
  { value: "maize",   label: "Maize (मक्का)",   labelHindi: "मक्का",  perishable: false, season: "kharif", mspPrice: 2090, emoji: "🌽", createdAt: new Date(), updatedAt: new Date() }
]);
print("✅ Inserted " + db.crops.countDocuments() + " crops");

// ============================================================
//  STEP 3 — VEHICLES
// ============================================================

print("\n🚛 Inserting vehicles...");
db.vehicles.insertMany([
  { value: "tata_ace",  label: "Tata Ace",        capacity: "1 Ton",    capacityTons: 1.0, ratePerKm: 18, loadingCost: 150, fuelType: "diesel", createdAt: new Date(), updatedAt: new Date() },
  { value: "tractor",   label: "Tractor-Trolley", capacity: "2 Tons",   capacityTons: 2.0, ratePerKm: 14, loadingCost: 100, fuelType: "diesel", createdAt: new Date(), updatedAt: new Date() },
  { value: "truck_lcv", label: "Truck (LCV)",      capacity: "5 Tons",   capacityTons: 5.0, ratePerKm: 22, loadingCost: 250, fuelType: "diesel", createdAt: new Date(), updatedAt: new Date() },
  { value: "mahindra",  label: "Mahindra Pickup",  capacity: "1.5 Tons", capacityTons: 1.5, ratePerKm: 16, loadingCost: 120, fuelType: "diesel", createdAt: new Date(), updatedAt: new Date() },
  { value: "bolero",    label: "Bolero Pickup",    capacity: "1 Ton",    capacityTons: 1.0, ratePerKm: 17, loadingCost: 130, fuelType: "diesel", createdAt: new Date(), updatedAt: new Date() }
]);
print("✅ Inserted " + db.vehicles.countDocuments() + " vehicles");

// ============================================================
//  STEP 4 — MANDIS  (with 2dsphere location)
// ============================================================

print("\n🏪 Inserting mandis...");
db.mandis.insertMany([
  {
    mandiCode: "UK_HDW_001", name: "Haridwar APMC", nameHindi: "हरिद्वार APMC",
    state: "Uttarakhand", district: "Haridwar",
    location: { type: "Point", coordinates: [78.1700, 29.9500] },
    isActive: true, apmc: true,
    peakDays: ["Tuesday", "Friday"],
    operatingHours: { open: "06:00", close: "18:00" },
    contactPhone: "01334-220101",
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    mandiCode: "UK_RKE_001", name: "Roorkee Mandi", nameHindi: "रुड़की मंडी",
    state: "Uttarakhand", district: "Haridwar",
    location: { type: "Point", coordinates: [77.8880, 29.8543] },
    isActive: true, apmc: true,
    peakDays: ["Wednesday", "Saturday"],
    operatingHours: { open: "06:00", close: "18:00" },
    contactPhone: "01332-272201",
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    mandiCode: "UP_SRN_001", name: "Saharanpur APMC", nameHindi: "सहारनपुर APMC",
    state: "Uttar Pradesh", district: "Saharanpur",
    location: { type: "Point", coordinates: [77.5456, 29.9680] },
    isActive: true, apmc: true,
    peakDays: ["Monday", "Thursday"],
    operatingHours: { open: "06:00", close: "18:00" },
    contactPhone: "0132-2720301",
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    mandiCode: "UP_MZN_001", name: "Muzaffarnagar Mandi", nameHindi: "मुजफ्फरनगर मंडी",
    state: "Uttar Pradesh", district: "Muzaffarnagar",
    location: { type: "Point", coordinates: [77.7085, 29.4727] },
    isActive: true, apmc: true,
    peakDays: ["Thursday", "Sunday"],
    operatingHours: { open: "05:30", close: "17:00" },
    contactPhone: "0131-2443201",
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    mandiCode: "UK_DDN_001", name: "Dehradun APMC", nameHindi: "देहरादून APMC",
    state: "Uttarakhand", district: "Dehradun",
    location: { type: "Point", coordinates: [78.0322, 30.3165] },
    isActive: true, apmc: true,
    peakDays: ["Monday", "Friday"],
    operatingHours: { open: "06:00", close: "18:00" },
    contactPhone: "0135-2710101",
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    mandiCode: "UP_MRT_001", name: "Meerut Mandi", nameHindi: "मेरठ मंडी",
    state: "Uttar Pradesh", district: "Meerut",
    location: { type: "Point", coordinates: [77.7064, 28.9845] },
    isActive: true, apmc: true,
    peakDays: ["Monday", "Thursday"],
    operatingHours: { open: "06:00", close: "18:00" },
    contactPhone: "0121-2641801",
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    mandiCode: "UP_GZB_001", name: "Ghaziabad Mandi", nameHindi: "गाजियाबाद मंडी",
    state: "Uttar Pradesh", district: "Ghaziabad",
    location: { type: "Point", coordinates: [77.4538, 28.6692] },
    isActive: true, apmc: true,
    peakDays: ["Wednesday", "Saturday"],
    operatingHours: { open: "06:00", close: "18:00" },
    contactPhone: "0120-2820401",
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    mandiCode: "UP_DBO_001", name: "Deoband Mandi", nameHindi: "देवबंद मंडी",
    state: "Uttar Pradesh", district: "Saharanpur",
    location: { type: "Point", coordinates: [77.6856, 29.6965] },
    isActive: true, apmc: false,
    peakDays: ["Monday", "Thursday"],
    operatingHours: { open: "07:00", close: "17:00" },
    contactPhone: "",
    createdAt: new Date(), updatedAt: new Date()
  }
]);

// Create 2dsphere index so $nearSphere queries work
db.mandis.createIndex({ location: "2dsphere" });
print("✅ Inserted " + db.mandis.countDocuments() + " mandis + created 2dsphere index");

// ============================================================
//  STEP 5 — MARKET PRICES  (30 days × 8 mandis × 8 crops)
// ============================================================

print("\n💰 Generating market prices (this takes a few seconds)...");

const allCrops  = db.crops.find().toArray();
const allMandis = db.mandis.find().toArray();

// Base prices per crop (₹/quintal)
const basePrices = {
  onion: 1800, tomato: 2200, wheat: 2100, potato: 1200,
  garlic: 6000, rice: 2800, mustard: 5400, maize: 1700
};

// Price boosts per mandi (farther mandis have higher demand = higher price)
const mandiBoosts = {
  "UK_HDW_001": 0,   "UK_RKE_001": 180, "UP_SRN_001": 340,
  "UP_MZN_001": 520, "UK_DDN_001": 490, "UP_MRT_001": 380,
  "UP_GZB_001": 610, "UP_DBO_001": 140
};

let priceRecords = [];
const today = new Date();
today.setHours(0, 0, 0, 0);

for (let m = 0; m < allMandis.length; m++) {
  const mandi = allMandis[m];
  const boost = mandiBoosts[mandi.mandiCode] || 0;

  for (let c = 0; c < allCrops.length; c++) {
    const crop    = allCrops[c];
    const base    = (basePrices[crop.value] || 1500) + boost;
    let prevModal = base;

    for (let d = 29; d >= 0; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);

      // Simulate natural daily price fluctuation ±4%
      const fluctuation = (Math.random() - 0.5) * base * 0.08;
      const modal       = Math.max(100, Math.round(prevModal + fluctuation));
      const minPrice    = Math.round(modal * (0.88 + Math.random() * 0.07));
      const maxPrice    = Math.round(modal * (1.05 + Math.random() * 0.10));
      const arrivals    = Math.round(10 + Math.random() * 190);

      // Compute trend based on movement from previous day
      let trend = "stable";
      const changePct = ((modal - prevModal) / prevModal) * 100;
      if (changePct > 3)  trend = "rising";
      if (changePct < -3) trend = "falling";

      priceRecords.push({
        mandi:      mandi._id,
        crop:       crop._id,
        date:       new Date(date),
        minPrice,
        maxPrice,
        modalPrice: modal,
        arrivals,
        trend,
        source:     "estimated",
        createdAt:  new Date()
      });

      prevModal = modal;
    }

    // Insert in batches of 200 to avoid memory issues
    if (priceRecords.length >= 200) {
      db.market_prices.insertMany(priceRecords);
      priceRecords = [];
    }
  }
}

// Insert any remaining records
if (priceRecords.length > 0) {
  db.market_prices.insertMany(priceRecords);
}

// Indexes for fast price queries
db.market_prices.createIndex({ mandi: 1, crop: 1, date: -1 });
db.market_prices.createIndex({ mandi: 1, crop: 1, date: 1 }, { unique: true });

print("✅ Inserted " + db.market_prices.countDocuments() + " price records");
print("✅ Created indexes on market_prices");

// ============================================================
//  STEP 6 — FARMERS  (5 sample farmers)
// ============================================================

print("\n👨‍🌾 Inserting farmers...");
db.farmers.insertMany([
  {
    name: "Ramesh Kumar",
    phone: "9876543210",
    village: "Bhimpur",
    district: "Haridwar",
    state: "Uttarakhand",
    location: { type: "Point", coordinates: [78.1500, 29.9300] },
    preferredCrops: [],
    landHolding: 3.5,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    name: "Suresh Singh",
    phone: "9812345678",
    village: "Manglaur",
    district: "Haridwar",
    state: "Uttarakhand",
    location: { type: "Point", coordinates: [77.8700, 29.8400] },
    preferredCrops: [],
    landHolding: 5.0,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    name: "Mukesh Yadav",
    phone: "9801234567",
    village: "Kairana",
    district: "Saharanpur",
    state: "Uttar Pradesh",
    location: { type: "Point", coordinates: [77.5300, 29.9500] },
    preferredCrops: [],
    landHolding: 8.0,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    name: "Dinesh Chauhan",
    phone: "9988776655",
    village: "Roorkee Rural",
    district: "Haridwar",
    state: "Uttarakhand",
    location: { type: "Point", coordinates: [77.8900, 29.8600] },
    preferredCrops: [],
    landHolding: 2.0,
    createdAt: new Date(), updatedAt: new Date()
  },
  {
    name: "Pradeep Verma",
    phone: "9871234560",
    village: "Muzaffarnagar Rural",
    district: "Muzaffarnagar",
    state: "Uttar Pradesh",
    location: { type: "Point", coordinates: [77.7000, 29.4600] },
    preferredCrops: [],
    landHolding: 10.0,
    createdAt: new Date(), updatedAt: new Date()
  }
]);

db.farmers.createIndex({ location: "2dsphere" });
db.farmers.createIndex({ phone: 1 }, { unique: true });
print("✅ Inserted " + db.farmers.countDocuments() + " farmers");

// ============================================================
//  STEP 7 — TRIPS  (sample completed trips)
// ============================================================

print("\n🗺️  Inserting sample trips...");

const farmer1  = db.farmers.findOne({ phone: "9876543210" });
const farmer2  = db.farmers.findOne({ phone: "9812345678" });
const onion    = db.crops.findOne({ value: "onion" });
const wheat    = db.crops.findOne({ value: "wheat" });
const tataAce  = db.vehicles.findOne({ value: "tata_ace" });
const tractor  = db.vehicles.findOne({ value: "tractor" });
const hw_mandi = db.mandis.findOne({ mandiCode: "UK_HDW_001" });
const rk_mandi = db.mandis.findOne({ mandiCode: "UK_RKE_001" });
const mzn_mandi= db.mandis.findOne({ mandiCode: "UP_MZN_001" });

db.trips.insertMany([
  {
    farmer:           farmer1._id,
    crop:             onion._id,
    mandi:            mzn_mandi._id,
    vehicle:          tataAce._id,
    quantityQuintals: 8,
    pricePerQuintal:  2320,
    revenue:          18560,
    transportCost:    1710,
    handlingCost:     200,
    commissionCost:   371,
    totalCost:        2281,
    netProfit:        16279,
    profitMargin:     87.7,
    distanceKm:       95,
    tripDate:         new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    status:           "completed",
    notes:            "Good price at Muzaffarnagar. Left at 5 AM.",
    rideshareWith:    [],
    rideshareSavings: 0,
    createdAt:        new Date(), updatedAt: new Date()
  },
  {
    farmer:           farmer1._id,
    crop:             onion._id,
    mandi:            hw_mandi._id,
    vehicle:          tataAce._id,
    quantityQuintals: 8,
    pricePerQuintal:  1810,
    revenue:          14480,
    transportCost:    144,
    handlingCost:     200,
    commissionCost:   290,
    totalCost:        634,
    netProfit:        13846,
    profitMargin:     95.6,
    distanceKm:       8,
    tripDate:         new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status:           "completed",
    notes:            "Nearest mandi. Quick trip.",
    rideshareWith:    [],
    rideshareSavings: 0,
    createdAt:        new Date(), updatedAt: new Date()
  },
  {
    farmer:           farmer2._id,
    crop:             wheat._id,
    mandi:            rk_mandi._id,
    vehicle:          tractor._id,
    quantityQuintals: 20,
    pricePerQuintal:  2280,
    revenue:          45600,
    transportCost:    490,
    handlingCost:     300,
    commissionCost:   912,
    totalCost:        1702,
    netProfit:        43898,
    profitMargin:     96.3,
    distanceKm:       35,
    tripDate:         new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    status:           "completed",
    notes:            "Wheat at good rate. Sold full trolley.",
    rideshareWith:    [farmer1._id],
    rideshareSavings: 220,
    createdAt:        new Date(), updatedAt: new Date()
  },
  {
    farmer:           farmer2._id,
    crop:             onion._id,
    mandi:            mzn_mandi._id,
    vehicle:          tataAce._id,
    quantityQuintals: 5,
    pricePerQuintal:  2350,
    revenue:          11750,
    transportCost:    1710,
    handlingCost:     200,
    commissionCost:   235,
    totalCost:        2145,
    netProfit:        9605,
    profitMargin:     81.7,
    distanceKm:       95,
    tripDate:         new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status:           "planned",
    notes:            "Planning to go Thursday — peak day.",
    rideshareWith:    [],
    rideshareSavings: 0,
    createdAt:        new Date(), updatedAt: new Date()
  }
]);
print("✅ Inserted " + db.trips.countDocuments() + " trips");

// ============================================================
//  STEP 8 — PRICE ALERTS
// ============================================================

print("\n🔔 Inserting price alerts...");
db.price_alerts.insertMany([
  {
    farmer:        farmer1._id,
    mandi:         mzn_mandi._id,
    crop:          onion._id,
    alertType:     "price_spike",
    threshold:     2500,
    isActive:      true,
    lastTriggered: null,
    createdAt:     new Date(), updatedAt: new Date()
  },
  {
    farmer:        farmer1._id,
    mandi:         hw_mandi._id,
    crop:          onion._id,
    alertType:     "price_drop",
    threshold:     1500,
    isActive:      true,
    lastTriggered: null,
    createdAt:     new Date(), updatedAt: new Date()
  },
  {
    farmer:        farmer2._id,
    mandi:         rk_mandi._id,
    crop:          wheat._id,
    alertType:     "peak_day",
    threshold:     0,
    isActive:      true,
    lastTriggered: null,
    createdAt:     new Date(), updatedAt: new Date()
  },
  {
    farmer:        farmer2._id,
    mandi:         mzn_mandi._id,
    crop:          onion._id,
    alertType:     "volatility",
    threshold:     10,
    isActive:      true,
    lastTriggered: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt:     new Date(), updatedAt: new Date()
  }
]);
db.price_alerts.createIndex({ farmer: 1, isActive: 1 });
db.price_alerts.createIndex(
  { farmer: 1, mandi: 1, crop: 1, alertType: 1 },
  { unique: true }
);
print("✅ Inserted " + db.price_alerts.countDocuments() + " price alerts");

// ============================================================
//  STEP 9 — RIDESHARE REQUESTS
// ============================================================

print("\n🤝 Inserting rideshare requests...");

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(5, 0, 0, 0);

const nextThursday = new Date();
nextThursday.setDate(nextThursday.getDate() + ((4 - nextThursday.getDay() + 7) % 7 || 7));
nextThursday.setHours(5, 30, 0, 0);

db.rideshare_requests.insertMany([
  {
    requester:             farmer1._id,
    mandi:                 mzn_mandi._id,
    crop:                  onion._id,
    vehicle:               tataAce._id,
    tripDate:              tomorrow,
    seatsAvailable:        2,
    quantityCapacityLeft:  4,
    pickupPoints:          ["Bhimpur Chowk", "Haridwar Bus Stand"],
    status:                "open",
    participants:          [],
    createdAt:             new Date(), updatedAt: new Date()
  },
  {
    requester:             farmer2._id,
    mandi:                 rk_mandi._id,
    crop:                  wheat._id,
    vehicle:               tractor._id,
    tripDate:              nextThursday,
    seatsAvailable:        1,
    quantityCapacityLeft:  8,
    pickupPoints:          ["Manglaur Main Road"],
    status:                "open",
    participants:          [],
    createdAt:             new Date(), updatedAt: new Date()
  }
]);
db.rideshare_requests.createIndex({ mandi: 1, tripDate: 1, status: 1 });
print("✅ Inserted " + db.rideshare_requests.countDocuments() + " rideshare requests");

// ============================================================
//  SUMMARY
// ============================================================

print("\n========================================");
print("✅ SEED COMPLETE — Collection counts:");
print("========================================");
print("  crops:              " + db.crops.countDocuments());
print("  vehicles:           " + db.vehicles.countDocuments());
print("  mandis:             " + db.mandis.countDocuments());
print("  market_prices:      " + db.market_prices.countDocuments());
print("  farmers:            " + db.farmers.countDocuments());
print("  trips:              " + db.trips.countDocuments());
print("  price_alerts:       " + db.price_alerts.countDocuments());
print("  rideshare_requests: " + db.rideshare_requests.countDocuments());
print("========================================\n");

// ============================================================
//  QUICK VERIFY — Test the core analyze query manually
// ============================================================

print("🔍 Quick verify — mandis near Haridwar (100km radius):");
db.mandis.find({
  location: {
    $nearSphere: {
      $geometry:    { type: "Point", coordinates: [78.1642, 29.9457] },
      $maxDistance: 100000
    }
  }
}).forEach(function(m) {
  print("  " + m.name + " — " + m.district);
});

print("\n🔍 Latest onion price at Haridwar APMC:");
const hw  = db.mandis.findOne({ mandiCode: "UK_HDW_001" });
const oni = db.crops.findOne({ value: "onion" });
const p   = db.market_prices.findOne(
  { mandi: hw._id, crop: oni._id },
  { sort: { date: -1 } }
);
print("  ₹" + p.modalPrice + "/quintal  trend: " + p.trend);
