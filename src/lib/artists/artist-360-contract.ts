/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST-360-CONTRACT.TS — CONTRATO DE AUTONOMÍA 360 PARA ARTISTAS EUROPA
 * ════════════════════════════════════════════════════════════════════════════
 * Misión: W49_T04_ARTIST_360_MULTINATIONAL_HUB
 * Erradica comisiones abusivas tradicionales (30%-50%) dando soberanía total:
 *  - Capa A: Caché individual por formato, km exentos desde sede fiscal y acústica.
 *  - Capa B: Distribución Digital 360 con validador y generador de ISRC.
 *  - Capa C: Liquidación automática Split Soberano 80/10/10 al céntimo.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';

export type ArtistFormat = 'SOLISTA' | 'DUO' | 'MARIACHI' | 'ORQUESTA' | 'DJ';

export interface ArtistProfile360 {
  id: string;
  artistName: string;
  format: ArtistFormat;
  fiscalCity: string;
  fiscalProvince: string;
  baseCacheEur: number;
  exemptKm: number;
  ratePerKmEur: number;
  splLimitDb: number;
  wattsPerPax: number;
  officialStreamingUrl?: string;
  officialSocialUrl?: string;
  isrcCatalog: string[];
}

export interface QuoteCalculationRequest {
  format: ArtistFormat;
  distanceKm: number;
  endHour24: number;
  customBaseCacheEur?: number;
}

export interface QuoteCalculationResult {
  baseCacheEur: number;
  exemptKm: number;
  chargeableKm: number;
  kmRateEur: number;
  logisticsTotalEur: number;
  hotelSupplementEur: number;
  totalEventEur: number;
  depositDeductibleEur: number;
  pendingFinalSettlementEur: number;
  isEdwinAgudeloSovereignFloor: boolean;
}

export interface SettlementSplitResult {
  totalGrossEur: number;
  artistAmountEur: number;
  earOsAmountEur: number;
  vimumeAmountEur: number;
  depositPaidEur: number;
  artistNetPendingEur: number;
}

export interface IsrcValidationResult {
  valid: boolean;
  code: string;
  country: string;
  registrant: string;
  year: string;
  designation: string;
  reason?: string;
}

/** Formato oficial ISRC para Productora EAR: ES-EAR-YY-NNNNN */
export const ISRC_REGEX = /^ES-EAR-\d{2}-\d{5}$/;

/** Mínimo legal por formato en el catálogo */
export const MIN_CACHE_BY_FORMAT: Record<ArtistFormat, number> = Object.freeze({
  SOLISTA: TARIFA_BASE_SOLISTA_EUR, // 350.0 €
  DUO: 500.0,
  MARIACHI: 650.0,
  ORQUESTA: 1800.0,
  DJ: 400.0,
});

/**
 * Valida un código ISRC contra la norma ISO 3901 y el prefijo de EAR OS.
 */
export function validateIsrc(code: string): IsrcValidationResult {
  const trimmed = (code || '').trim().toUpperCase();
  if (!ISRC_REGEX.test(trimmed)) {
    return {
      valid: false,
      code: trimmed,
      country: '',
      registrant: '',
      year: '',
      designation: '',
      reason: 'El código debe cumplir el formato internacional ES-EAR-YY-NNNNN',
    };
  }

  const parts = trimmed.split('-');
  return {
    valid: true,
    code: trimmed,
    country: parts[0],
    registrant: parts[1],
    year: parts[2],
    designation: parts[3],
  };
}

/**
 * Genera un código ISRC canónico determinista para distribución digital.
 */
export function generateCanonicalIsrc(yearTwoDigits: number, sequenceNumber: number): string {
  const yy = String(yearTwoDigits).padStart(2, '0').slice(-2);
  const nnnnn = String(sequenceNumber).padStart(5, '0').slice(-5);
  return `ES-EAR-${yy}-${nnnnn}`;
}

/**
 * Calcula el presupuesto individual del artista con blindaje del caché suelo.
 */
export function calculateArtistQuote(req: QuoteCalculationRequest): QuoteCalculationResult {
  const minBase = MIN_CACHE_BY_FORMAT[req.format];
  const requestedBase = req.customBaseCacheEur ?? minBase;
  const baseCacheEur = Math.max(requestedBase, minBase);

  const exemptKm = LOGISTICA_KM_EXENTOS;
  const chargeableKm = Math.max(0, req.distanceKm - exemptKm);
  const logisticsTotalEur = Math.round(chargeableKm * LOGISTICA_EUR_PER_KM * 100) / 100;

  const requiresHotel = req.endHour24 >= HORA_FIN_HOTEL || req.distanceKm > LOGISTICA_KM_HOTEL;
  const hotelSupplementEur = requiresHotel ? SUPLEMENTO_HOTEL_EUR : 0;

  const totalEventEur = Math.round((baseCacheEur + logisticsTotalEur + hotelSupplementEur) * 100) / 100;
  const depositDeductibleEur = DEPOSITO_STRIPE_EUR;
  const pendingFinalSettlementEur = Math.max(0, Math.round((totalEventEur - depositDeductibleEur) * 100) / 100);

  return {
    baseCacheEur,
    exemptKm,
    chargeableKm,
    kmRateEur: LOGISTICA_EUR_PER_KM,
    logisticsTotalEur,
    hotelSupplementEur,
    totalEventEur,
    depositDeductibleEur,
    pendingFinalSettlementEur,
    isEdwinAgudeloSovereignFloor: req.format === 'SOLISTA' && baseCacheEur === TARIFA_BASE_SOLISTA_EUR,
  };
}

/**
 * Liquida el Split Soberano 80/10/10 al céntimo exacto sin redondeos acumulativos.
 */
export function settleArtistSplit(totalGrossEur: number, depositPaidEur: number = DEPOSITO_STRIPE_EUR): SettlementSplitResult {
  const totalCents = Math.round(totalGrossEur * 100);
  const depositCents = Math.round(depositPaidEur * 100);

  const artistCents = Math.round(totalCents * SPLIT_SOBERANO.artista);
  const earOsCents = Math.round(totalCents * SPLIT_SOBERANO.earOs);
  const vimumeCents = totalCents - artistCents - earOsCents; // Ajuste residual de céntimo

  const artistNetPendingCents = Math.max(0, artistCents - depositCents);

  return {
    totalGrossEur: totalCents / 100,
    artistAmountEur: artistCents / 100,
    earOsAmountEur: earOsCents / 100,
    vimumeAmountEur: vimumeCents / 100,
    depositPaidEur: depositCents / 100,
    artistNetPendingEur: artistNetPendingCents / 100,
  };
}

/** Perfil base canónico de Edwin Agudelo como Solista #1 Soberano */
export const EDWIN_AGUDELO_PROFILE_360: Readonly<ArtistProfile360> = Object.freeze({
  id: 'edwin-agudelo-solista-360',
  artistName: 'Edwin Agudelo',
  format: 'SOLISTA' as const,
  fiscalCity: 'Méntrida',
  fiscalProvince: 'Toledo',
  baseCacheEur: TARIFA_BASE_SOLISTA_EUR,
  exemptKm: LOGISTICA_KM_EXENTOS,
  ratePerKmEur: LOGISTICA_EUR_PER_KM,
  splLimitDb: LIMITE_SPL_DB,
  wattsPerPax: WATTS_PER_PAX,
  officialStreamingUrl: 'https://open.spotify.com/artist/edwin-agudelo',
  officialSocialUrl: 'https://instagram.com/edwinagudelomusic',
  isrcCatalog: [
    generateCanonicalIsrc(26, 1),
    generateCanonicalIsrc(26, 2),
    generateCanonicalIsrc(26, 3),
  ],
});

