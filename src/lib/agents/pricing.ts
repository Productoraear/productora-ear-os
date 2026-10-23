import {
  TARIFA_BASE_SOLISTA_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_STRIPE_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  SPLIT_SOBERANO,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

/** Redondeo monetario a céntimos. */
export function roundEur(value: number): number {
  return Math.round(value * 100) / 100;
}

export interface QuoteBreakdown {
  readonly base: number;
  readonly logistica: number;
  readonly hotel: number;
  readonly total: number;
  readonly deposito: number;
  readonly restoTrasDeposito: number;
}

/**
 * Presupuesto del Solista desde el Hub Méntrida (solo Edwin Agudelo).
 * Hotel si distancia > 200 km o si el show termina de madrugada (>= 3:00 y < 12:00).
 * Supuesto: `endHour` es la hora de fin en formato 0-23; las horas >= 12 se consideran tarde/noche, no madrugada.
 */
export function computeSoloQuote(distanceKm: number, endHour: number): QuoteBreakdown {
  const km: number = Math.max(0, distanceKm);
  const logistica: number = roundEur(Math.max(0, km - LOGISTICA_KM_EXENTOS) * LOGISTICA_EUR_PER_KM);
  const madrugada: boolean = endHour >= HORA_FIN_HOTEL && endHour < 12;
  const hotel: number = km > LOGISTICA_KM_HOTEL || madrugada ? SUPLEMENTO_HOTEL_EUR : 0;
  const total: number = roundEur(TARIFA_BASE_SOLISTA_EUR + logistica + hotel);
  return {
    base: TARIFA_BASE_SOLISTA_EUR,
    logistica,
    hotel,
    total,
    deposito: DEPOSITO_STRIPE_EUR,
    restoTrasDeposito: roundEur(total - DEPOSITO_STRIPE_EUR),
  };
}

export interface SplitBreakdown {
  readonly artista: number;
  readonly earOs: number;
  readonly vimume: number;
}

export function computeSplit(total: number): SplitBreakdown {
  const artista: number = roundEur(total * SPLIT_SOBERANO.artista);
  const earOs: number = roundEur(total * SPLIT_SOBERANO.earOs);
  return { artista, earOs, vimume: roundEur(total - artista - earOs) };
}

export interface B2gVerdict {
  readonly allowed: boolean;
  readonly ceiling: number;
  readonly margin: number;
}

export function checkB2gCeiling(amountEur: number): B2gVerdict {
  return {
    allowed: amountEur < AJUSTE_PREVENTIVO_B2G_EUR,
    ceiling: AJUSTE_PREVENTIVO_B2G_EUR,
    margin: roundEur(AJUSTE_PREVENTIVO_B2G_EUR - amountEur),
  };
}

export type AcousticContext = 'festejo' | 'boda_exterior' | 'boda_interior' | 'solista' | 'vimume_senior';

interface DbaRange {
  readonly min: number;
  readonly max: number;
}

const RIDER_DBA: Readonly<Record<AcousticContext, DbaRange>> = {
  festejo: { min: 90, max: 102 },
  boda_exterior: { min: 85, max: 90 },
  boda_interior: { min: 80, max: 85 },
  solista: { min: 70, max: 80 },
  vimume_senior: { min: 65, max: 75 },
};

export function isAcousticContext(value: string): value is AcousticContext {
  return Object.prototype.hasOwnProperty.call(RIDER_DBA, value);
}

export interface RiderResult {
  readonly context: AcousticContext;
  readonly minDba: number;
  readonly maxDba: number;
  readonly watts: number;
  readonly healthLimitDb: number;
}

export function computeRider(context: AcousticContext, pax: number): RiderResult {
  const range: DbaRange = RIDER_DBA[context];
  return {
    context,
    minDba: range.min,
    maxDba: range.max,
    watts: Math.round(Math.max(0, pax) * WATTS_PER_PAX),
    healthLimitDb: LIMITE_SPL_DB,
  };
}
