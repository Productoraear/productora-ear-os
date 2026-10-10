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

export const TARIFA_BASE_SOLISTA = 350 as const;
export const SPLIT_ARTISTA = 0.8 as const;
export const SPLIT_EAR = 0.1 as const;
export const SPLIT_VIMUME = 0.1 as const;
export const LOGISTICA_EUR_PER_KM = 1.5 as const;
export const LOGISTICA_KM_FREE = 50 as const;
export const SUPLEMENTO_HOTEL = 120 as const;
export const DEPOSITO_MINIMO = 100 as const;

export interface BudgetBreakdown {
  readonly baseFee: number;
  readonly logisticsCost: number;
  readonly hotelSupplement: number;
  readonly totalGross: number;
  readonly artistNet: number;
  readonly earCommission: number;
  readonly vimumeContribution: number;
}

/**
 * Redondea a 2 decimales de forma determinista evitando errores de coma flotante.
 */
function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Calcula el desglose económico de una actuación según las reglas SSOT.
 *
 * @param baseFee Tarifa base de la actuación en euros.
 * @param distanceKm Distancia total en km desde Méntrida.
 * @param lateNight Indica si la actuación finaliza a las 3:00 AM o más tarde.
 * @returns Desglose económico completo con splits aplicados.
 */
export function calculateBudgetBreakdown(
  baseFee: number,
  distanceKm: number,
  lateNight: boolean
): BudgetBreakdown {
  const safeBaseFee = Number.isFinite(baseFee) && baseFee > 0 ? baseFee : 0;
  const safeDistanceKm = Number.isFinite(distanceKm) && distanceKm > 0 ? distanceKm : 0;

  const chargeableKm = Math.max(0, safeDistanceKm - LOGISTICA_KM_FREE);
  const logisticsCost = round2(chargeableKm * LOGISTICA_EUR_PER_KM);
  const hotelSupplement =
    lateNight || safeDistanceKm > 200 ? SUPLEMENTO_HOTEL : 0;
  const totalGross = round2(safeBaseFee + logisticsCost + hotelSupplement);

  return {
    baseFee: safeBaseFee,
    logisticsCost,
    hotelSupplement,
    totalGross,
    artistNet: round2(totalGross * SPLIT_ARTISTA),
    earCommission: round2(totalGross * SPLIT_EAR),
    vimumeContribution: round2(totalGross * SPLIT_VIMUME),
  };
}