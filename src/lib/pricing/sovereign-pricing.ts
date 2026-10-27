/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR SOBERANO DE PRECIOS — CERO DIVERGENCIA CON EL SSOT (FIRMA SHA-256)
 * ════════════════════════════════════════════════════════════════════════════
 * Este módulo SOLO compone el presupuesto y firma el Price-Lock. Toda la
 * logística (franquicia de 50 km, hotel, suplementos) vive en `logistics.ts`,
 * que es isomorfo y puede importarse desde componentes cliente sin arrastrar
 * `node:crypto`.
 *
 * Server-only por la firma criptográfica. Los re-exports mantienen la API
 * histórica (`COSTE_KM`, `BASE_SOLISTA`, `computeSovereignLogistics`, ...).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'crypto';
import {
  BASE_SOLISTA,
  DEPOSITO_STRIPE,
  SPLIT_SOBERANO,
  basePriceForFormat,
  computeSovereignLogistics,
  type FormatType,
  type SoundRiderType,
  type SovereignLogistics,
} from './logistics';

export * from './logistics';

export interface SovereignQuoteInput {
  format: FormatType;
  distanceKm: number;
  soundRider: SoundRiderType;
  /**
   * Hora de finalización del evento en formato 24 h (3 = 03:00 AM).
   * Activa el suplemento hotelero cuando >= `HORA_FIN_HOTEL_CANONICA`.
   */
  endHour?: number;
}

export interface SovereignSplit {
  artist80: number;
  earOs10: number;
  vimume10: number;
}

export interface SovereignQuoteResult {
  totalBudget: number;
  depositRequired: number;
  remainingBalance: number;
  split: SovereignSplit;
  priceLockHash: string;
  /** Desglose logístico con franquicia y hotel (auditoría transparente). */
  logistics: SovereignLogistics;
}

export function calculateSovereignQuote(input: SovereignQuoteInput): SovereignQuoteResult {
  const baseFormatPrice: number = basePriceForFormat(input.format);
  const logistics: SovereignLogistics = computeSovereignLogistics(input.distanceKm, input.endHour);
  const soundSupplement: number = input.soundRider === 'bose_f1_elite' ? 150 : 0;

  const totalBudget: number =
    baseFormatPrice + logistics.travelCost + logistics.hotelSupplement + soundSupplement;
  const depositRequired: number = DEPOSITO_STRIPE;
  const remainingBalance: number = totalBudget - depositRequired;

  const artist80 = Math.round(totalBudget * SPLIT_SOBERANO.artist);
  const earOs10 = Math.round(totalBudget * SPLIT_SOBERANO.earOs);
  const vimume10 = totalBudget - artist80 - earOs10;

  const payloadToHash = `${input.format}|${logistics.distanceKm}|${totalBudget}|${DEPOSITO_STRIPE}`;
  const priceLockHash = createHash('sha256').update(payloadToHash).digest('hex');

  return {
    totalBudget,
    depositRequired,
    remainingBalance,
    split: { artist80, earOs10, vimume10 },
    priceLockHash,
    logistics,
  };
}

/** Base canónica re-exportada para consumidores de la API histórica. */
export const SOVEREIGN_BASE_EUR: number = BASE_SOLISTA;
