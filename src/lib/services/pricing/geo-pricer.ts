import { geocodeAddress, normalizeCoords, GeoCoordinates } from "../geo/geocoder";

export interface GeoPricingResult {
  originCoords: { latitude: number; longitude: number };
  destinationCoords: { latitude: number; longitude: number };
  distanceKm: number;
  travelCost: number;
  totalAmount: number;
  depositAmount: number;
}

/**
 * Calcula la distancia ortodrómica utilizando la fórmula de Haversine.
 * Devuelve la distancia exacta entre dos puntos de la Tierra en kilómetros.
 */
export function calculateHaversineDistance(
  coords1: { latitude: number; longitude: number },
  coords2: { latitude: number; longitude: number }
): number {
  const R = 6371; // Radio de la Tierra en kilómetros
  const dLat = ((coords2.latitude - coords1.latitude) * Math.PI) / 180;
  const dLon = ((coords2.longitude - coords1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coords1.latitude * Math.PI) / 180) *
      Math.cos((coords2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distancia en kilómetros
}

/**
 * 🏛️ S-CLASS SERVER GEO-PRICING CORE
 * Toma origen, destino, tarifa base y costo por kilómetro, calcula la distancia física real y retorna
 * el desglose financiero exacto, incluyendo el cálculo del depósito de garantía.
 */
export async function calculateGeoPricing(params: {
  artistId?: string;
  origin: GeoCoordinates | string;
  destination: GeoCoordinates | string;
  baseFee: number;
  costPerKm: number;
  depositMode?: "fixed" | "percentage" | string;
  depositValue?: number;
}): Promise<GeoPricingResult> {
  const { origin, destination, baseFee, costPerKm, depositMode = "fixed", depositValue = 100 } = params;

  // Resolve coordinates
  const originCoords = typeof origin === "string" ? await geocodeAddress(origin) : normalizeCoords(origin);
  const destinationCoords = typeof destination === "string" ? await geocodeAddress(destination) : normalizeCoords(destination);

  // Calculate Haversine distance
  const rawDistance = calculateHaversineDistance(originCoords, destinationCoords);
  const distanceKm = Math.round(rawDistance * 100) / 100; // Redondear a 2 decimales

  // Financial compilation
  const travelCost = Math.round(distanceKm * costPerKm * 100) / 100;
  const totalAmount = Math.round((baseFee + travelCost) * 100) / 100;

  // Deposit calculation
  let depositAmount = 100;
  if (depositMode === "fixed") {
    depositAmount = depositValue;
  } else if (depositMode === "percentage") {
    depositAmount = Math.round((totalAmount * depositValue) / 100);
  }

  return {
    originCoords,
    destinationCoords,
    distanceKm,
    travelCost,
    totalAmount,
    depositAmount
  };
}
