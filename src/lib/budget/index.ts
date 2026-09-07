/**
 * 💰 Budget Engine Utilities
 * Shared budget calculation logic used by:
 * - /api/budget (Budget API)
 * - /api/budget/expenses (Expense tracking)
 * - /api/budget/payments (Payment tracking)
 * - Budget page components
 * 
 * SSOT: Tarifa Base Solista = 350,00 €
 * Split: 80% Artista / 10% EAR OS / 10% VIMUME
 * Logística: 1,50 €/km desde Méntrida a partir del km 50
 * Suplemento hotel: +120 € si fin >= 3:00 AM o > 200 km
 */

export const TARIFA_BASE_SOLISTA = 350;
export const SPLIT_ARTISTA = 0.80;
export const SPLIT_EAR = 0.10;
export const SPLIT_VIMUME = 0.10;
export const LOGISTICA_EUR_PER_KM = 1.50;
export const LOGISTICA_KM_FREE = 50;
export const SUPLEMENTO_HOTEL = 120;
export const DEPOSITO_MINIMO = 100;

export interface BudgetBreakdown {
  baseFee: number;
  logisticsCost: number;
  hotelSupplement: number;
  totalGross: number;
  artistNet: number;
  earCommission: number;
  vimumeContribution: number;
}

/**
 * Calcula el desglose económico de una actuación según las reglas SSOT.
 */
export function calculateBudgetBreakdown(
  baseFee: number,
  distanceKm: number,
  lateNight: boolean
): BudgetBreakdown {
  const chargeableKm = Math.max(0, distanceKm - LOGISTICA_KM_FREE);
  const logisticsCost = chargeableKm * LOGISTICA_EUR_PER_KM;
  const hotelSupplement = (lateNight || distanceKm > 200) ? SUPLEMENTO_HOTEL : 0;
  const totalGross = baseFee + logisticsCost + hotelSupplement;

  return {
    baseFee,
    logisticsCost,
    hotelSupplement,
    totalGross,
    artistNet: Math.round(totalGross * SPLIT_ARTISTA * 100) / 100,
    earCommission: Math.round(totalGross * SPLIT_EAR * 100) / 100,
    vimumeContribution: Math.round(totalGross * SPLIT_VIMUME * 100) / 100,
  };
}
