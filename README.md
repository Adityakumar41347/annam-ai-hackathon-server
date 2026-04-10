# 🌾 Krishi-Route — Backend Server (Express + MongoDB + TypeScript)

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in values
cp .env.example .env

# 3. Start MongoDB locally (or use Atlas URI in .env)
mongod --dbpath /data/db

# 4. Seed the database (crops, vehicles, mandis, 30 days of prices)
npm run seed

# 5. Start the dev server
npm run dev
# → http://localhost:5000
```

---

## 📁 Project Structure

```
krishi-server/
├── src/
│   ├── server.ts                  # Express app entry point
│   ├── config/
│   │   └── database.ts            # MongoDB connection
│   ├── types/
│   │   └── index.ts               # All shared TypeScript interfaces
│   ├── models/
│   │   ├── index.ts               # Barrel export
│   │   ├── Crop.ts                # 🌾 Crop schema
│   │   ├── Vehicle.ts             # 🚛 Vehicle schema
│   │   ├── Mandi.ts               # 🏪 Mandi schema (2dsphere index)
│   │   ├── MarketPrice.ts         # 💰 Daily price history schema
│   │   ├── Farmer.ts              # 👨‍🌾 Farmer profile schema
│   │   ├── Trip.ts                # 🗺️  Trip record schema
│   │   ├── PriceAlert.ts          # 🔔 Price alert subscription schema
│   │   └── RideshareRequest.ts    # 🤝 Rideshare pooling schema
│   ├── routes/
│   │   ├── crops.ts               # GET /api/crops
│   │   ├── vehicles.ts            # GET /api/vehicles
│   │   ├── mandis.ts              # GET /api/mandis?lat=&lng=&radius=
│   │   ├── prices.ts              # GET /api/prices?mandiId=&cropId=&days=
│   │   ├── analyze.ts             # POST /api/analyze  ← core profit engine
│   │   ├── farmers.ts             # POST/GET/PATCH /api/farmers
│   │   ├── trips.ts               # POST/GET /api/trips
│   │   └── rideshare.ts           # POST/GET /api/rideshare
│   └── scripts/
│       └── seed.ts                # One-time DB seed script
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 🗄️ MongoDB Collections

| Collection | Schema | Purpose |
|---|---|---|
| `crops` | `Crop.ts` | All crop types with MSP prices |
| `vehicles` | `Vehicle.ts` | Transport options and ₹/km rates |
| `mandis` | `Mandi.ts` | APMC markets with 2dsphere geo index |
| `market_prices` | `MarketPrice.ts` | Daily min/modal/max prices per mandi+crop |
| `farmers` | `Farmer.ts` | Registered farmer profiles |
| `trips` | `Trip.ts` | Trip history with full profit snapshot |
| `price_alerts` | `PriceAlert.ts` | Farmer alert subscriptions |
| `rideshare_requests` | `RideshareRequest.ts` | Vehicle pooling board |

---

## 📡 API Reference

### Core Endpoints

```
GET  /health                                → server status

GET  /api/crops                             → all crops
GET  /api/vehicles                          → all vehicles

GET  /api/mandis?lat=29.94&lng=78.16&radius=100
                                            → mandis within 100km

GET  /api/prices?mandiId=X&cropId=Y&days=7 → 7-day price history
GET  /api/prices/latest?mandiId=X&cropId=Y → most recent price

POST /api/analyze                           → profit comparison
     Body: { cropId, lat, lng, radiusKm, quantityQuintals, vehicleId, handlingCost }

POST /api/farmers                           → register farmer
GET  /api/farmers/:phone                    → lookup by phone
PATCH /api/farmers/:id                      → update preferences

POST /api/trips                             → save a trip
GET  /api/trips/farmer/:id                  → trip history (paginated)
GET  /api/trips/farmer/:id/summary          → profit totals + averages
PATCH /api/trips/:id/status                 → mark completed/cancelled

GET  /api/rideshare?mandiId=X&date=Y        → open rides for a mandi/day
POST /api/rideshare                         → post a new ride
POST /api/rideshare/:id/join                → join an existing ride
PATCH /api/rideshare/:id/cancel             → cancel a ride
```

### POST /api/analyze — Example

**Request:**
```json
{
  "cropId":            "65f1a2b3c4d5e6f7a8b9c0d1",
  "lat":               29.9457,
  "lng":               78.1642,
  "radiusKm":          100,
  "quantityQuintals":  5,
  "vehicleId":         "65f1a2b3c4d5e6f7a8b9c0d2",
  "handlingCost":      200
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "mandi":           { "name": "Muzaffarnagar Mandi", "district": "Muzaffarnagar" },
        "distanceKm":      95,
        "pricePerQuintal": 2320,
        "revenue":         11600,
        "transportCost":   1710,
        "commissionCost":  232,
        "totalCost":       2142,
        "netProfit":       9458,
        "profitMargin":    81.5,
        "trend":           "rising"
      }
    ],
    "winner":          { ... },
    "extraVsNearest":  3200,
    "mandisCompared":  4,
    "bestMargin":      81.5
  }
}
```

---

## 🔑 Key Index Strategy

| Collection | Index | Why |
|---|---|---|
| `mandis` | `location: 2dsphere` | `$nearSphere` queries for nearby mandis |
| `farmers` | `location: 2dsphere` | `$nearSphere` for rideshare matching |
| `market_prices` | `{ mandi, crop, date: -1 }` | Fast price history lookups |
| `market_prices` | `{ mandi, crop, date }` unique | Prevents duplicate daily records |
| `trips` | `{ farmer, tripDate: -1 }` | Farmer's trip history |
| `rideshare_requests` | TTL on `updatedAt` | Auto-deletes old filled/cancelled rides |

---

## 🔌 Connecting to the Vite Frontend

In your Vite frontend's `.env`:
```
VITE_API_URL=http://localhost:5000
```

Replace the mock `simulateMarketPrice()` in `profitEngine.ts` with a real API call:

```typescript
// src/utils/api.ts
const API = import.meta.env.VITE_API_URL;

export async function analyzeTrip(params: AnalyzeQueryParams) {
  const res = await fetch(`${API}/api/analyze`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(params),
  });
  return res.json();
}

export async function getCrops() {
  const res = await fetch(`${API}/api/crops`);
  return res.json();
}

export async function getNearbyMandis(lat: number, lng: number, radius = 100) {
  const res = await fetch(`${API}/api/mandis?lat=${lat}&lng=${lng}&radius=${radius}`);
  return res.json();
}
```
