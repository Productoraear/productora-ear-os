// src/lib/services/pricing/geo-pricer.ts
import { prisma } from "@/lib/prisma";

type GeoPoint = {
  lat: number;
  lng: number;
};

type GeoPricerInput = {
  artistId: string;
  origin: GeoPoint;
  destination: GeoPoint;
  baseFee?: number;
  costPerKm?: number;
  depositMode?: "fixed" | "percentage";
  depositValue?: number;
};

type GeoPricerOutput = {
  distanceKm: number;
  totalAmount: number;
  depositAmount: number;
};

function haversineKm(a: GeoPoint, b: GeoPoint) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(x));
}

export async function calculateGeoPricing(input: GeoPricerInput): Promise<GeoPricerOutput> {
  const artist = await prisma.artistProfile.findUnique({
    where: { id: input.artistId },
    select: { id: true },
  });

  if (!artist) throw new Error("Artist not found");

  const distanceKm = Math.ceil(haversineKm(input.origin, input.destination));
  const baseFee = input.baseFee ?? 0;
  const costPerKm = input.costPerKm ?? 0.75;
  const totalAmount = Math.max(0, Math.round(baseFee + distanceKm * costPerKm));

  const depositAmount =
    input.depositMode === "percentage"
      ? Math.max(100, Math.round(totalAmount * ((input.depositValue ?? 25) / 100)))
      : Math.round(input.depositValue ?? 100);

  return {
    distanceKm,
    totalAmount,
    depositAmount,
  };
}
