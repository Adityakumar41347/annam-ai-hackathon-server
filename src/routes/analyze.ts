import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { Mandi, MarketPrice, Vehicle, Crop } from "../models";
import type { IMandi, IMarketPrice, IVehicle, ICrop } from "../types";

const router = Router();

// ── Helper: accept ObjectId string OR value slug ──────────────
// e.g. both "65f1a2b3..." and "truck_lcv" resolve correctly

async function resolveVehicle(id: string): Promise<IVehicle | null> {
  if (mongoose.isValidObjectId(id)) {
    return Vehicle.findById(id).lean() as Promise<IVehicle | null>;
  }
  // Fall back to looking up by value slug e.g. "truck_lcv"
  return Vehicle.findOne({ value: id }).lean() as Promise<IVehicle | null>;
}

async function resolveCrop(id: string): Promise<ICrop | null> {
  if (mongoose.isValidObjectId(id)) {
    return Crop.findById(id).lean() as Promise<ICrop | null>;
  }
  // Fall back to looking up by value slug e.g. "onion"
  return Crop.findOne({ value: id }).lean() as Promise<ICrop | null>;
}

// ── Haversine straight-line distance (km) ────────────────────

function haversineKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R  = 6371;
  const dL = ((lat2 - lat1) * Math.PI) / 180;
  const dG = ((lng2 - lng1) * Math.PI) / 180;
  const a  =
    Math.sin(dL / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dG / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ── Profit calculation ────────────────────────────────────────

function calcProfit(params: {
  modalPrice:       number;
  quantityQuintals: number;
  distanceKm:       number;
  ratePerKm:        number;
  handlingCost:     number;
  commissionPct?:   number;
}) {
  const {
    modalPrice, quantityQuintals, distanceKm,
    ratePerKm, handlingCost, commissionPct = 2,
  } = params;

  const revenue        = modalPrice * quantityQuintals;
  const transportCost  = Math.round(distanceKm * ratePerKm);
  const commissionCost = Math.round(revenue * (commissionPct / 100));
  const totalCost      = transportCost + handlingCost + commissionCost;
  const netProfit      = revenue - totalCost;
  const profitMargin   = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  return { revenue, transportCost, commissionCost, totalCost, netProfit, profitMargin };
}

// ── POST /api/analyze ─────────────────────────────────────────
//
// Accepts:
//   cropId    — MongoDB ObjectId  OR  value slug (e.g. "onion")
//   vehicleId — MongoDB ObjectId  OR  value slug (e.g. "truck_lcv")
//   lat, lng, radiusKm, quantityQuintals, handlingCost

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      cropId,
      vehicleId,
      lat,
      lng,
      radiusKm       = 100,
      quantityQuintals,
      handlingCost   = 200,
    } = req.body as {
      cropId:           string;
      vehicleId:        string;
      lat:              number;
      lng:              number;
      radiusKm?:        number;
      quantityQuintals: number;
      handlingCost?:    number;
    };

    // ── Validate required fields ──────────────────────────────
    if (!cropId || !vehicleId || lat == null || lng == null || !quantityQuintals) {
      res.status(400).json({
        success: false,
        error:   "cropId, vehicleId, lat, lng, quantityQuintals are required",
      });
      return;
    }

    // ── Resolve vehicle (ObjectId OR slug) ────────────────────
    const vehicle = await resolveVehicle(String(vehicleId));
    if (!vehicle) {
      res.status(404).json({
        success: false,
        error:   `Vehicle not found: "${vehicleId}". Check the vehicleId or value slug.`,
      });
      return;
    }

    // ── Resolve crop (ObjectId OR slug) ───────────────────────
    const crop = await resolveCrop(String(cropId));
    if (!crop) {
      res.status(404).json({
        success: false,
        error:   `Crop not found: "${cropId}". Check the cropId or value slug.`,
      });
      return;
    }

    // ── Find mandis within radius ─────────────────────────────
    const mandis = await Mandi.find({
      isActive: true,
      location: {
        $nearSphere: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radiusKm) * 1000,
        },
      },
    })
      .limit(8)
      .lean() as unknown as IMandi[];

    if (mandis.length === 0) {
      res.status(404).json({
        success: false,
        error:   `No active mandis found within ${radiusKm} km of (${lat}, ${lng})`,
      });
      return;
    }

    // ── Fetch latest price for each mandi and calculate profit ─
    const results = await Promise.all(
      mandis.map(async (mandi) => {
        const price = await MarketPrice.findOne({
          mandi: mandi._id,
          crop:  crop._id,
        })
          .sort({ date: -1 })
          .lean() as IMarketPrice | null;

        // Skip this mandi if no price data exists for the crop
        if (!price) return null;

        const [mLng, mLat] = mandi.location.coordinates;
        const distanceKm   = Math.round(haversineKm(
          Number(lat), Number(lng), mLat, mLng
        ));

        const calc = calcProfit({
          modalPrice:       price.modalPrice,
          quantityQuintals: Number(quantityQuintals),
          distanceKm,
          ratePerKm:        vehicle.ratePerKm,
          handlingCost:     Number(handlingCost),
        });

        return {
          // IDs the frontend needs
          id:      String(mandi._id),
          _id:     String(mandi._id),

          // Mandi info
          name:     mandi.name,
          district: mandi.district,
          state:    mandi.state,
          peakDay:  Array.isArray(mandi.peakDays) ? mandi.peakDays[0] ?? "Monday" : "Monday",
          lat:      mLat,
          lng:      mLng,
          km:       distanceKm,

          // Price info
          pricePerQuintal: price.modalPrice,
          minPrice:        price.minPrice,
          maxPrice:        price.maxPrice,
          trend:           price.trend,
          arrivals:        price.arrivals,
          priceDate:       price.date,

          // Profit breakdown
          ...calc,
          quantityQuintals: Number(quantityQuintals),
          distanceKm,
        };
      })
    );

    // ── Filter nulls and sort best profit first ───────────────
    const valid = results
      .filter((r): r is NonNullable<typeof r> => r !== null)
      .sort((a, b) => b.netProfit - a.netProfit);

    if (valid.length === 0) {
      res.status(404).json({
        success: false,
        error:   `No price data found for crop "${crop.value}" at any nearby mandi. Run the seed script: npm run seed`,
      });
      return;
    }

    const winner  = valid[0];
    const nearest = [...valid].sort((a, b) => a.distanceKm - b.distanceKm)[0];

    res.json({
      success: true,
      data: {
        results:         valid,
        winner,
        nearest,
        extraVsNearest:  Math.round(winner.netProfit - nearest.netProfit),
        mandisCompared:  valid.length,
        bestMargin:      Math.round(winner.profitMargin * 10) / 10,
      },
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

export default router;