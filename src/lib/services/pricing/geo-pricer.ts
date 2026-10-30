import { geocodeAddress, geocodeAddressSync, normalizeCoords, GeoCoordinates } from "../geo/geocoder";
import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SPLIT_SOBERANO,
  TARIFA_BASE_SOLISTA_EUR,
} from "../../constants/ear-os-ssot";
import {
  GRUPO_MIN_MUSICOS,
  SUPLEMENTO_MUSICO_ADICIONAL_EUR,
  SUPLEMENTO_QUINTETO,
  normalizeFranchiseKm,
} from "../../pricing/logistics";

export interface GeoPricingResult {
  originCoords: { latitude: number; longitude: number };
  destinationCoords: { latitude: number; longitude: number };
  distanceKm: number;
  /** Kilómetros efectivamente facturables (distancia − franquicia aplicada). */
  billableKm: number;
  /** Franquicia realmente aplicada: 50 = Hub Méntrida · 0 = Red Nacional. */
  franchiseKm: number;
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
 * Redondeo monetario a 2 decimales (céntimos exactos, sin deriva flotante).
 */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * 🏛️ S-CLASS SERVER GEO-PRICING CORE
 * Toma origen, destino, tarifa base y costo por kilómetro, calcula la distancia física real y retorna
 * el desglose financiero exacto, incluyendo el cálculo del depósito de garantía.
 *
 * `franchiseKm` NO se decide aquí: lo dicta el resolutor de origen
 * (`src/lib/pricing/logistics-origin.ts`) según el sujeto que despacha.
 *  - Hub Méntrida (Edwin Agudelo / base Méntrida) -> 50 km de franquicia.
 *  - Red Nacional -> 0 km: factura desde el km 0 de su propia base fiscal.
 *
 * `strictGeocoding` (fail-closed) hace que una dirección no reconocida lance
 * `GEOCODE_UNRESOLVED` en lugar de facturarse sobre el fallback de Madrid
 * (AF-5: prohibido el verde por defecto en la ruta de dinero).
 */
export async function calculateGeoPricing(params: {
  artistId?: string;
  origin: GeoCoordinates | string;
  destination: GeoCoordinates | string;
  baseFee: number;
  costPerKm: number;
  franchiseKm?: number;
  depositMode?: "fixed" | "percentage" | string;
  depositValue?: number;
  strictGeocoding?: boolean;
}): Promise<GeoPricingResult> {
  const {
    origin,
    destination,
    baseFee,
    costPerKm,
    franchiseKm = 0,
    depositMode = "fixed",
    depositValue = DEPOSITO_STRIPE_EUR,
    strictGeocoding = false,
  } = params;

  // Resolve coordinates
  const resolveCoords = async (
    value: GeoCoordinates | string,
    role: "origin" | "destination"
  ): Promise<{ latitude: number; longitude: number }> => {
    if (typeof value !== "string") return normalizeCoords(value);
    if (!strictGeocoding) return geocodeAddress(value);
    const strict = geocodeAddressSync(value);
    if (!strict) {
      throw new Error(
        `GEOCODE_UNRESOLVED: ${role} "${value}" no es geocodificable en la matriz canónica. Añadir municipio + provincia.`
      );
    }
    return strict;
  };

  const originCoords = await resolveCoords(origin, "origin");
  const destinationCoords = await resolveCoords(destination, "destination");

  // Calculate Haversine distance
  const rawDistance = calculateHaversineDistance(originCoords, destinationCoords);
  const distanceKm = Math.round(rawDistance * 100) / 100; // Redondear a 2 decimales

  // Financial compilation (franquicia canónica antes de facturar kilómetros)
  const appliedFranchiseKm = normalizeFranchiseKm(franchiseKm, 0);
  const billableKm = Math.max(0, Math.round((distanceKm - appliedFranchiseKm) * 100) / 100);
  const travelCost = Math.round(billableKm * costPerKm * 100) / 100;
  const totalAmount = Math.round((baseFee + travelCost) * 100) / 100;

  // Deposit calculation
  let depositAmount: number = DEPOSITO_STRIPE_EUR;
  if (depositMode === "fixed") {
    depositAmount = depositValue;
  } else if (depositMode === "percentage") {
    depositAmount = Math.round((totalAmount * depositValue) / 100);
  }

  return {
    originCoords,
    destinationCoords,
    distanceKm,
    billableKm,
    franchiseKm: appliedFranchiseKm,
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
  /** Override explícito; por defecto la tarifa del SSOT (1,50 €/km). */
  costPerKm?: number;
  /** Override explícito; por defecto la franquicia del SSOT (50 km). */
  franchiseKm?: number;
  /** Modo de depósito; por defecto `fixed` (Price-Lock 100 €). */
  depositMode?: "fixed" | "percentage";
  /** Importe/porcentaje del depósito; por defecto `DEPOSITO_STRIPE_EUR`. */
  depositValue?: number;
}

export interface EdwinFormatPricingResult extends GeoPricingResult {
  readonly baseFee: number;
  readonly effectiveMusicians: number;
  readonly formatLabel: string;
  readonly occasion: string;
  readonly split: {
    readonly providerAmount: number;
    readonly platformEarAmount: number;
    readonly affiliateVimumeAmount: number;
  };
}

/**
 * 👑 MOTOR DE PRICING OFICIAL EDWIN AGUDELO S-CLASS
 * Regla Inmutable (derivada 1:1 del SSOT sellado, cero cifras duplicadas):
 * - Solista Premium: `TARIFA_BASE_SOLISTA_EUR` (350 €) para Cumpleaños, Fiestas
 *   Privadas, Día de la Madre/Padre y San Valentín.
 * - Formato Grupo: mínimo `GRUPO_MIN_MUSICOS` (5) músicos obligatorio
 *   (350 € + suplemento de quinteto = 750 €, +100 € por músico adicional).
 * - Distancia: `LOGISTICA_EUR_PER_KM` (1,50 €/km) con franquicia de
 *   `LOGISTICA_KM_EXENTOS` (50 km) desde el Hub Méntrida.
 * - Depósito: Price-Lock inmutable de `DEPOSITO_STRIPE_EUR` (100 €), deducible.
 */
export async function calculateEdwinAgudeloFormatPricing(
  params: EdwinPricingInput,
): Promise<EdwinFormatPricingResult> {
  const {
    origin = "Madrid, España",
    destination,
    isSolistaPremium = true,
    musiciansCount = 1,
    occasion = 'GENERAL',
    costPerKm = LOGISTICA_EUR_PER_KM,
    franchiseKm = LOGISTICA_KM_EXENTOS,
    depositMode = "fixed",
    depositValue = DEPOSITO_STRIPE_EUR,
  } = params;

  const isGroupFormat: boolean = !isSolistaPremium || musiciansCount > 1;
  const effectiveMusicians: number = isGroupFormat
    ? Math.max(GRUPO_MIN_MUSICOS, Math.trunc(musiciansCount))
    : 1;

  const baseFee: number = isGroupFormat
    ? TARIFA_BASE_SOLISTA_EUR +
      SUPLEMENTO_QUINTETO +
      (effectiveMusicians - GRUPO_MIN_MUSICOS) * SUPLEMENTO_MUSICO_ADICIONAL_EUR
    : TARIFA_BASE_SOLISTA_EUR;

  const formatLabel: string = isGroupFormat
    ? `Quinteto de Gala S-Class (${effectiveMusicians} Músicos Mínimo)`
    : `Solista Premium S-Class · Ocasión: ${occasion}`;

  const geoRes = await calculateGeoPricing({
    artistId: 'edwin-agudelo',
    origin,
    destination,
    baseFee,
    costPerKm,
    franchiseKm,
    depositMode,
    depositValue,
  });

  return {
    ...geoRes,
    baseFee,
    effectiveMusicians,
    formatLabel,
    occasion,
    split: {
      providerAmount: round2(geoRes.totalAmount * SPLIT_SOBERANO.artista), // 80% Artista
      platformEarAmount: round2(geoRes.totalAmount * SPLIT_SOBERANO.earOs), // 10% EAR OS
      affiliateVimumeAmount: round2(geoRes.totalAmount * SPLIT_SOBERANO.vimume), // 10% VIMUME
    },
  };
}

