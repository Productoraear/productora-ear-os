/**
 * ════════════════════════════════════════════════════════════════════════════
 * NÚCLEO LOGÍSTICO Y TARIFARIO CANÓNICO (ISOMORFO, SIN `node:crypto`)
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente única de la logística S-Class (Hub Méntrida) y de los suplementos
 * artísticos. Es seguro importarlo desde componentes cliente: no arrastra
 * dependencias de servidor. La firma SHA-256 vive en `sovereign-pricing.ts`.
 *
 * Reglas canónicas (SSOT verificado en runtime):
 *  - Franquicia: los primeros `LOGISTICA_KM_EXENTOS` (50 km) son 0,00 € — SOLO
 *    para el Hub Méntrida (Edwin Agudelo y empresas con base en Méntrida).
 *    La Red Nacional factura desde el km 0 de su propia base física: ver
 *    `logistics-origin.ts` (`NETWORK_FRANCHISE_KM = 0`).
 *  - Tarifa: `LOGISTICA_EUR_PER_KM` por km facturable (a partir del km 51 del Hub).
 *  - Hotel: +`SUPLEMENTO_HOTEL_EUR` si distancia > 200 km o fin >= 03:00 AM.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO as SSOT_SPLIT_RATIOS,
} from '@/lib/constants/ear-os-ssot';

export const BASE_SOLISTA = TARIFA_BASE_SOLISTA_EUR;

/** €/km FACTURABLE (aplica solo al tramo posterior a la franquicia de 50 km). */
export const COSTE_KM = LOGISTICA_EUR_PER_KM;

/** Kilómetros exentos desde el Hub Méntrida (franquicia logística). */
export const KM_EXENTOS = LOGISTICA_KM_EXENTOS;

/** Distancia que activa el suplemento hotelero (> 200 km). */
export const KM_HOTEL = LOGISTICA_KM_HOTEL;

/** Suplemento hotelero canónico (120 €). */
export const SUPLEMENTO_HOTEL = SUPLEMENTO_HOTEL_EUR;

/** Hora de fin que activa el suplemento hotelero (03:00 AM). */
export const HORA_FIN_HOTEL_CANONICA = HORA_FIN_HOTEL;

export const SUPLEMENTO_TRIO = 250;
export const SUPLEMENTO_QUINTETO = 400;
export const SUPLEMENTO_RIDER_ELITE = 150;

/**
 * Mínimo de músicos exigible en cualquier formato de grupo (doctrina S-Class:
 * «Mínimo 5 músicos obligatorio»). Por debajo de este umbral no se cotiza grupo.
 */
export const GRUPO_MIN_MUSICOS = 5;

/**
 * Suplemento por cada músico adicional sobre el quinteto canónico.
 * Vive en el núcleo tarifario (junto a TRIO/QUINTETO/RIDER) para que ningún
 * motor de dinero duplique la cifra. No está canonizado en el SSOT sellado
 * (`ear-os-ssot.ts`): modificarlo exige sanción del CEO y re-sellado.
 */
export const SUPLEMENTO_MUSICO_ADICIONAL_EUR = 100;

/** Techo de cordura: ninguna distancia terrestre nacional supera este valor. */
export const MAX_DISTANCE_KM = 5000;

export const DEPOSITO_STRIPE = DEPOSITO_STRIPE_EUR;

/** Split Soberano Inmutable: 80% Artista / 10% EAR OS / 10% VIMUME. */
export const SPLIT_SOBERANO = {
  artist: SSOT_SPLIT_RATIOS.artista,
  earOs: SSOT_SPLIT_RATIOS.earOs,
  vimume: SSOT_SPLIT_RATIOS.vimume,
} as const;

export type FormatType = 'solista' | 'trio' | 'quinteto';
export type SoundRiderType = 'standard' | 'bose_f1_elite';

/** Desglose logístico canónico (fuente única para TODAS las terminales). */
export interface SovereignLogistics {
  distanceKm: number;
  billableKm: number;
  travelCost: number;
  requiresHotel: boolean;
  hotelSupplement: number;
  totalLogistics: number;
  franchiseKm: number;
  ratePerKm: number;
}

/**
 * Normaliza una distancia cruda a un valor seguro y determinista.
 * Fail-closed: NaN, Infinity, negativos o basura => 0 km (nunca NaN en Stripe).
 */
export function normalizeDistanceKm(value: unknown): number {
  const numeric: number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return 0;
  return Math.min(MAX_DISTANCE_KM, Math.round(numeric * 10) / 10);
}

/**
 * Normaliza la franquicia logística aplicable al sujeto facturable.
 * Fail-closed: valores no finitos o negativos => `fallback` acotado.
 * El Hub Méntrida usa `KM_EXENTOS` (50); la Red Nacional usa 0
 * (`NETWORK_FRANCHISE_KM` en `logistics-origin.ts`).
 */
export function normalizeFranchiseKm(value: unknown, fallback: number = KM_EXENTOS): number {
  const numeric: number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numeric) || numeric < 0) {
    return Math.min(MAX_DISTANCE_KM, Math.max(0, fallback));
  }
  return Math.min(MAX_DISTANCE_KM, Math.round(numeric * 10) / 10);
}

/**
 * Convierte una hora de fin textual ("03:30", "3", "02:15") en número decimal.
 * Devuelve `undefined` si el dato no es interpretable (nunca inventa datos).
 */
export function parseEndHour(raw: unknown): number | undefined {
  if (typeof raw === 'number' && Number.isFinite(raw) && raw >= 0 && raw < 24) return raw;
  if (typeof raw !== 'string') return undefined;
  const match: RegExpMatchArray | null = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (match === null) return undefined;
  const hours: number = Number(match[1]);
  const minutes: number = match[2] === undefined ? 0 : Number(match[2]);
  if (hours > 23 || minutes > 59) return undefined;
  return hours + minutes / 60;
}

/**
 * Motor logístico canónico (base física del proveedor -> destino del cliente).
 * ÚNICA implementación autorizada de la franquicia logística y del hotel.
 *
 * `options.franchiseKm` es OBLIGATORIO para cualquier sujeto que no sea el Hub
 * Méntrida: la Red Nacional factura desde el km 0 de su propia base
 * (`logistics-origin.ts`). Si se omite (API histórica) se mantiene la
 * franquicia del SSOT para no alterar a los consumidores ya sellados.
 */
export function computeSovereignLogistics(
  distanceKm: unknown,
  endHour?: unknown,
  options?: { readonly franchiseKm?: unknown },
): SovereignLogistics {
  const normalizedDistance: number = normalizeDistanceKm(distanceKm);
  // Basura en la franquicia => 0 (nunca regalar kilómetros por un dato corrupto).
  const franchiseKm: number =
    options === undefined || options.franchiseKm === undefined
      ? KM_EXENTOS
      : normalizeFranchiseKm(options.franchiseKm, 0);
  const billableKm: number = Math.max(0, normalizedDistance - franchiseKm);
  const travelCost: number = Math.round(billableKm * COSTE_KM);

  const normalizedEndHour: number | undefined = parseEndHour(endHour);
  const requiresHotel: boolean =
    normalizedDistance > KM_HOTEL ||
    (normalizedEndHour !== undefined && normalizedEndHour >= HORA_FIN_HOTEL_CANONICA);
  const hotelSupplement: number = requiresHotel ? SUPLEMENTO_HOTEL : 0;

  return {
    distanceKm: normalizedDistance,
    billableKm,
    travelCost,
    requiresHotel,
    hotelSupplement,
    totalLogistics: travelCost + hotelSupplement,
    franchiseKm,
    ratePerKm: COSTE_KM,
  };
}

/** Precio base por formato, derivado del SSOT (sin duplicar cifras). */
export function basePriceForFormat(format: FormatType): number {
  if (format === 'trio') return BASE_SOLISTA + SUPLEMENTO_TRIO;
  if (format === 'quinteto') return BASE_SOLISTA + SUPLEMENTO_QUINTETO;
  return BASE_SOLISTA;
}
