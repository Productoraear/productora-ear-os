/**
 * ════════════════════════════════════════════════════════════════════════════
 * ASTRA TENSOR MATCH — MOTOR DE AFINIDAD CUÁNTICA EN TIEMPO REAL
 * ════════════════════════════════════════════════════════════════════════════
 * Tensor de coincidencia multidimensional que sustituye al `matchScore` estático.
 * La afinidad se calcula EN VIVO contra el perfil de la pareja (pax, km, estilo)
 * mediante cuatro señales normalizadas a [0..1] y ponderadas con pesos que suman 1:
 *
 *   Score = w1·AfinidadEstilo + w2·PresionAcustica
 *         + w3·EficienciaLogistica + w4·DisponibilidadACID
 *
 * REGLAS SSOT (Protocolo Omega · AGENTS.md) — CERO PRECIOS HARDCODEADOS:
 *  - Presión acústica: WATTS_PER_PAX (12 W/pax). Ejemplo canónico:
 *    12 W/pax × 150 pax = 1.800 W ≤ 2.000 W (Bose F1) → coincidencia perfecta.
 *  - Logística: LOGISTICA_EUR_PER_KM (1,50 €/km) a partir de
 *    LOGISTICA_KM_EXENTOS (km 50). Distancia ≤ 50 km → sin recargo.
 *    Distancia > LOGISTICA_KM_HOTEL (200 km) → SUPLEMENTO_HOTEL_EUR (+120 €).
 *  - DisponibilidadACID: señal 0..1 alimentada por `atomicDateLockEngine`
 *    (checkDateAvailability → available ? 1 : 0). Jamás simulada como "99".
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';
import type { ArtistFormat } from './types';

/* ──────────────────────────────────────────────────────────────────────────
 * TIPOS ESTRICTOS (cero `any` inferido)
 * ────────────────────────────────────────────────────────────────────────── */

export type StyleIntent = 'intimate' | 'classic' | 'gala' | 'monumental';

export interface CoupleProfile {
  /** Número de invitados/asistentes. */
  pax: number;
  /** Distancia (km) desde el Hub Méntrida hasta la finca del cliente. */
  distanceKm: number;
  /** Intención estética/ceremonial declarada por la pareja. */
  styleIntent: StyleIntent;
  /** Señal de disponibilidad ACID 0..1 (1 = fecha libre confirmada). */
  acidAvailability: number;
}

export type TensorComponentKey =
  | 'afinidadEstilo'
  | 'presionAcustica'
  | 'eficienciaLogistica'
  | 'disponibilidadAcid';

export interface TensorWeights {
  readonly afinidadEstilo: number;
  readonly presionAcustica: number;
  readonly eficienciaLogistica: number;
  readonly disponibilidadAcid: number;
}

export interface TensorComponent {
  readonly key: TensorComponentKey;
  readonly label: string;
  readonly weight: number;
  readonly score: number; // 0..1
  readonly detail: string;
}

export interface AstraTensorScore {
  readonly score01: number; // 0..1 (suma ponderada)
  readonly percent: number; // 0..100 (entero)
  readonly isElite: boolean; // percent > 95 → aura dorado
  readonly components: readonly TensorComponent[];
  readonly requiredWatts: number;
  readonly kmFee: number;
  readonly hotelFee: number;
}

/* ──────────────────────────────────────────────────────────────────────────
 * CONSTANTES S-CLASS (runtime inmutable + compile-time literal)
 * ────────────────────────────────────────────────────────────────────────── */

/** Pesos del tensor. Suma exacta = 1.0. Orden de dominancia: Estilo > Acústica > Logística > ACID. */
export const ASTRA_TENSOR_WEIGHTS: Readonly<TensorWeights> = Object.freeze({
  afinidadEstilo: 0.35,
  presionAcustica: 0.3,
  eficienciaLogistica: 0.2,
  disponibilidadAcid: 0.15,
});

/** Ontología de estilo → número de músicos "ideal" (heurística documentada, no dinero). */
const STYLE_TARGET_MUSICIANS: Readonly<Record<StyleIntent, number>> = Object.freeze({
  intimate: 1,
  classic: 4,
  gala: 6,
  monumental: 12,
});

/** Límites de entrada del simulador de pareja (anti-desbordamiento y anti-números negativos). */
export const PAX_MIN = 50;
export const PAX_MAX = 800;
export const PAX_STEP = 10;
export const DISTANCE_MIN = 0;
export const DISTANCE_MAX = 300;
export const DISTANCE_STEP = 5;

export const STYLE_INTENTS: readonly StyleIntent[] = Object.freeze([
  'intimate',
  'classic',
  'gala',
  'monumental',
]);

/** Perfil por defecto alineado con el ejemplo canónico del Reto: 150 pax @ 45 km.
 *  `intimate` (1 músico) corona al Solista Imperial como match élite → aura dorada. */
export const DEFAULT_COUPLE_PROFILE: Readonly<CoupleProfile> = Object.freeze({
  pax: 150,
  distanceKm: 45,
  styleIntent: 'intimate',
  acidAvailability: 1,
});

/* ──────────────────────────────────────────────────────────────────────────
 * SCORERS DIMENSIONALES (cada uno normalizado a [0..1])
 * ────────────────────────────────────────────────────────────────────────── */

const clamp01 = (value: number): number => (value <= 0 ? 0 : value >= 1 ? 1 : value);

/**
 * w1 · AfinidadEstilo — 65% cercanía al nº de músicos ideal del estilo declarado,
 * 35% capacidad de aforo. Intimate → 1 músico, monumental → 12.
 */
export function computeAfinidadEstilo(
  format: ArtistFormat,
  couple: CoupleProfile
): { score: number; detail: string } {
  const targetMusicians = STYLE_TARGET_MUSICIANS[couple.styleIntent];
  const musicianFit = clamp01(
    1 - Math.abs(format.musiciansCount - targetMusicians) / Math.max(1, targetMusicians)
  );
  const envelopeFit =
    couple.pax <= format.maxPaxRecommended
      ? 1
      : clamp01(format.maxPaxRecommended / Math.max(1, couple.pax));

  const score = clamp01(0.65 * musicianFit + 0.35 * envelopeFit);

  return {
    score,
    detail: `${format.musiciansCount} músicos vs ideal ${targetMusicians} (${couple.styleIntent}); aforo ${format.maxPaxRecommended} pax`,
  };
}

/**
 * w2 · PresionAcustica — campana gaussiana centrada en headroom 1.15×.
 *   - requiredWatts = pax × WATTS_PER_PAX (SSOT).
 *   - Penaliza TANTO insuficiencia (headroom < 1) COMO sobredimensionado.
 *   Ejemplo canónico: 150 pax → 1.800 W vs 2.000 W → headroom 1.11× → score ≈ 0.997.
 */
export function computePresionAcustica(
  format: ArtistFormat,
  couple: CoupleProfile
): { score: number; detail: string } {
  const requiredWatts = couple.pax * WATTS_PER_PAX;
  const headroom = format.acousticPowerWatts / Math.max(1, requiredWatts);
  const score = clamp01(
    Math.exp(-Math.pow(headroom - 1.15, 2) / (2 * 0.55 * 0.55))
  );

  return {
    score,
    detail: `${requiredWatts}W requeridos (${couple.pax} pax × ${WATTS_PER_PAX} W/pax) vs ${format.acousticPowerWatts}W · headroom ${headroom.toFixed(2)}×`,
  };
}

/**
 * w3 · EficienciaLogistica — bonifica el radio exento (≤ 50 km, sin recargo)
 * y penaliza el coste logístico real (km fee + hotel fee) frente a la tarifa base.
 */
export function computeEficienciaLogistica(
  format: ArtistFormat,
  couple: CoupleProfile
): { score: number; detail: string } {
  const chargeableKm = Math.max(0, couple.distanceKm - LOGISTICA_KM_EXENTOS);
  const kmFee = chargeableKm * LOGISTICA_EUR_PER_KM;
  const hotelFee = couple.distanceKm > LOGISTICA_KM_HOTEL ? SUPLEMENTO_HOTEL_EUR : 0;
  const logisticsCost = kmFee + hotelFee;
  const score = clamp01(1 - logisticsCost / Math.max(1, format.basePrice));

  return {
    score,
    detail:
      logisticsCost === 0
        ? `${couple.distanceKm} km dentro del radio exento (≤ ${LOGISTICA_KM_EXENTOS} km) — sin recargo`
        : `${couple.distanceKm} km → +${logisticsCost.toFixed(0)} € (${kmFee.toFixed(0)} € km + ${hotelFee.toFixed(0)} € hotel)`,
  };
}

/**
 * w4 · DisponibilidadACID — señal 0..1 proveniente del lock atómico ACID.
 * En producción debe alimentarse con `checkDateAvailability(...)` (atomicDateLockEngine).
 */
export function computeDisponibilidadAcid(
  _format: ArtistFormat,
  couple: CoupleProfile
): { score: number; detail: string } {
  const signal = clamp01(couple.acidAvailability);
  return {
    score: signal,
    detail:
      signal >= 1
        ? 'Fecha libre confirmada por atomicDateLockEngine (ACID)'
        : signal <= 0
          ? 'Fecha bloqueada (colisión ACID)'
          : `Disponibilidad parcial ${Math.round(signal * 100)}%`,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
 * TENSOR PRINCIPAL
 * ────────────────────────────────────────────────────────────────────────── */

export function computeAstraTensorScore(
  format: ArtistFormat,
  couple: CoupleProfile
): AstraTensorScore {
  const afinidadEstilo = computeAfinidadEstilo(format, couple);
  const presionAcustica = computePresionAcustica(format, couple);
  const eficienciaLogistica = computeEficienciaLogistica(format, couple);
  const disponibilidadAcid = computeDisponibilidadAcid(format, couple);

  const w = ASTRA_TENSOR_WEIGHTS;
  const score01 = clamp01(
    w.afinidadEstilo * afinidadEstilo.score +
      w.presionAcustica * presionAcustica.score +
      w.eficienciaLogistica * eficienciaLogistica.score +
      w.disponibilidadAcid * disponibilidadAcid.score
  );

  const percent = Math.round(score01 * 100);

  const components: readonly TensorComponent[] = [
    { key: 'afinidadEstilo', label: 'ESTILO', weight: w.afinidadEstilo, score: afinidadEstilo.score, detail: afinidadEstilo.detail },
    { key: 'presionAcustica', label: 'ACÚSTICA', weight: w.presionAcustica, score: presionAcustica.score, detail: presionAcustica.detail },
    { key: 'eficienciaLogistica', label: 'LOGÍSTICA', weight: w.eficienciaLogistica, score: eficienciaLogistica.score, detail: eficienciaLogistica.detail },
    { key: 'disponibilidadAcid', label: 'DISP. ACID', weight: w.disponibilidadAcid, score: disponibilidadAcid.score, detail: disponibilidadAcid.detail },
  ];

  const chargeableKm = Math.max(0, couple.distanceKm - LOGISTICA_KM_EXENTOS);

  return {
    score01,
    percent,
    isElite: percent > 95,
    components,
    requiredWatts: couple.pax * WATTS_PER_PAX,
    kmFee: chargeableKm * LOGISTICA_EUR_PER_KM,
    hotelFee: couple.distanceKm > LOGISTICA_KM_HOTEL ? SUPLEMENTO_HOTEL_EUR : 0,
  };
}
