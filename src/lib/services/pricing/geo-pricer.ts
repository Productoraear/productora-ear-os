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

export type OccasionType = 
  | 'CUMPLEANOS' 
  | 'FIESTA_PRIVADA' 
  | 'DIA_DE_LA_MADRE' 
  | 'DIA_DEL_PADRE' 
  | 'SAN_VALENTIN' 
  | 'ANIVERSARIO' 
  | 'BODA' 
  | 'CORPORATIVO' 
  | 'GENERAL';

export interface EdwinPricingInput {
  origin: GeoCoordinates | string;
  destination: GeoCoordinates | string;
  isSolistaPremium?: boolean;
  musiciansCount?: number; // Mínimo 5 si es grupo
  occasion?: OccasionType | string;
  costPerKm?: number;
}

/**
 * 👑 MOTOR DE PRICING OFICIAL EDWIN AGUDELO S-CLASS
 * Regla Inmutable:
 * - Solista Premium: 350 € base (Cumpleaños, Fiestas Privadas, Día de la Madre/Padre, San Valentín).
 * - Formato Grupo: MÍNIMO 5 MÚSICOS OBLIGATORIO (750 € base, +100 € por músico adicional).
 * - Distancia: 0,75 €/km desde Madrid.
 */
export async function calculateEdwinAgudeloFormatPricing(params: EdwinPricingInput) {
  const {
    origin = "Madrid, España",
    destination,
    isSolistaPremium = true,
    musiciansCount = 1,
    occasion = 'GENERAL',
    costPerKm = 0.75
  } = params;

  let baseFee = 350; // Solista Premium
  let effectiveMusicians = 1;
  let formatLabel = "Solista Premium S-Class (Edwin Agudelo)";

  if (!isSolistaPremium || musiciansCount > 1) {
    // Regla de Negocio: Mínimo 5 músicos obligatorio para formatos de grupo
    effectiveMusicians = Math.max(5, musiciansCount);
    baseFee = 750 + (effectiveMusicians - 5) * 100;
    formatLabel = `Quinteto de Gala S-Class (${effectiveMusicians} Músicos Mínimo)`;
  } else {
    // Solista Premium con ajuste por ocasión especial si aplica
    formatLabel = `Solista Premium S-Class · Ocasión: ${occasion}`;
  }

  const geoRes = await calculateGeoPricing({
    artistId: 'edwin-agudelo',
    origin,
    destination,
    baseFee,
    costPerKm,
    depositMode: 'percentage',
    depositValue: 30 // 30% reserva o 10€ Smart-Lock
  });

  return {
    ...geoRes,
    baseFee,
    effectiveMusicians,
    formatLabel,
    occasion,
    split: {
      providerAmount: Math.round(geoRes.totalAmount * 0.80 * 100) / 100, // 80% Artista
      platformEarAmount: Math.round(geoRes.totalAmount * 0.10 * 100) / 100, // 10% EAR OS
      affiliateVimumeAmount: Math.round(geoRes.totalAmount * 0.10 * 100) / 100 // 10% VIMUME
    }
  };
}

