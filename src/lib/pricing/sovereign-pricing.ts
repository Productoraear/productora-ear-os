import { createHash } from 'crypto';

export const BASE_SOLISTA = 350;
export const COSTE_KM = 0.35;
export const SUPLEMENTO_TRIO = 250;
export const SUPLEMENTO_QUINTETO = 400;
export const DEPOSITO_STRIPE = 100;

/** Split Soberano Inmutable: 80% Artista / 10% EAR OS / 10% VIMUME. */
export const SPLIT_SOBERANO = { artist: 0.8, earOs: 0.1, vimume: 0.1 } as const;

export type FormatType = 'solista' | 'trio' | 'quinteto';
export type SoundRiderType = 'standard' | 'bose_f1_elite';

export interface SovereignQuoteInput {
  format: FormatType;
  distanceKm: number;
  soundRider: SoundRiderType;
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
}

export function calculateSovereignQuote(input: SovereignQuoteInput): SovereignQuoteResult {
  let baseFormatPrice = BASE_SOLISTA;
  if (input.format === 'trio') baseFormatPrice += SUPLEMENTO_TRIO;
  if (input.format === 'quinteto') baseFormatPrice += SUPLEMENTO_QUINTETO;

  const travelCost = Math.round(input.distanceKm * COSTE_KM);
  const soundSupplement = input.soundRider === 'bose_f1_elite' ? 150 : 0;

  const totalBudget = baseFormatPrice + travelCost + soundSupplement;
  const depositRequired = DEPOSITO_STRIPE;
  const remainingBalance = totalBudget - depositRequired;

  const artist80 = Math.round(totalBudget * SPLIT_SOBERANO.artist);
  const earOs10 = Math.round(totalBudget * SPLIT_SOBERANO.earOs);
  const vimume10 = totalBudget - artist80 - earOs10;

  const payloadToHash = `${input.format}|${input.distanceKm}|${totalBudget}|${DEPOSITO_STRIPE}`;
  const priceLockHash = createHash('sha256').update(payloadToHash).digest('hex');

  return {
    totalBudget,
    depositRequired,
    remainingBalance,
    split: { artist80, earOs10, vimume10 },
    priceLockHash,
  };
}