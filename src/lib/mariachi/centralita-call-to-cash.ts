/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — MOTOR CANÓNICO CENTRALITA DE MARIACHIS S-CLASS (DIRECTIVA v5)
 * ════════════════════════════════════════════════════════════════════════════
 * Implementa de forma pura e isomorfa (0 dependencias de Node, 0 `any`):
 *
 *  1. EMBUDO "CALL-TO-CASH" EN 1 CLIC:
 *     - Línea oficial centralita: `tel:+34693693048` (`CENTRALITA_EAR_OS`).
 *     - WhatsApp Express preformateado al carácter:
 *       "Hola, necesito mariachi en [Municipio] para la fecha [DD/MM] a las [HH:MM]. ¿Tenéis disponibilidad y precio?"
 *
 *  2. CONCILIACIÓN CON EL TARIFARIO OFICIAL Y AISLAMIENTO DE CATÁLOGO:
 *     - Edwin Agudelo (Mariachi Solista Premium / Solista con pistas):
 *       · Tarifa base: 550,00 € con 100 km incluidos (1,50 €/km adicional).
 *       · Reserva inmediata: 50% vía Stripe Checkout para bloquear fecha.
 *       · Suelo de cupón afiliado/redes: 350,00 € (`calculateSolistaQuote`).
 *     - Agrupaciones externas asociadas (Trío / Cuarteto / Agrupación Completa):
 *       · Aislamiento estricto: jamás heredan la tarifa de solista ni los 100 km de Edwin.
 *       · Split Soberano 80/10/10 exacto en céntimos enteros (80% agrupación, 10% EAR OS, 10% VIMUME).
 *       · Si la agrupación no tiene precio cerrado en base de datos (`hasClosedPrice === false`),
 *         activa el modo `"COTIZACION_EXPRESS_ASISTIDA"` que canaliza el lead a la centralita.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  CENTRALITA_EAR_OS,
  DEPOSITO_STRIPE_EUR,
  HORA_FIN_HOTEL,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  RESERVA_BLOQUEO_PCT,
  SOLISTA_KM_INCLUIDOS,
  SPLIT_SOBERANO,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  TARIFA_ESTANDAR_SOLISTA_EUR,
} from '../constants/ear-os-ssot';
import {
  calculateSolistaQuote,
  type AfiliadoCupon,
  type CuponRechazoMotivo,
} from '../pricing/solista-pricing';
import { MARIACHI_FORMAT_BY_ID } from './mariachi-formats';

export type ExpressMariachiFormatId =
  | 'solista_edwin'
  | 'trio'
  | 'cuarteto'
  | 'agrupacion_completa';

export type MariachiPricingMode =
  | 'EDWIN_SOLISTA_OFICIAL'
  | 'AGRUPACION_PRECIO_CERRADO'
  | 'COTIZACION_EXPRESS_ASISTIDA';

export interface ExpressMariachiFormatSpec {
  readonly id: ExpressMariachiFormatId;
  readonly shortLabel: string;
  readonly title: string;
  readonly subtitle: string;
  readonly membersLabel: string;
  readonly membersCount: number;
  readonly isEdwinSoloist: boolean;
  /**
   * Indica si el formato tiene tarifa cerrada en base de datos por defecto.
   * `trio` opera por defecto bajo "Cotización Express Asistida" (sin tarifa cerrada fija en SSOT)
   * salvo que se indique una tarifa cerrada verificada de una agrupación concreta.
   */
  readonly defaultHasClosedPrice: boolean;
  /** Precio base en euros cuando existe tarifa cerrada en catálogo; `null` si requiere Cotización Express Asistida. */
  readonly closedBasePriceEur: number | null;
}

export const EXPRESS_MARIACHI_FORMATS: readonly ExpressMariachiFormatSpec[] = Object.freeze([
  {
    id: 'solista_edwin',
    shortLabel: 'Solista con pistas',
    title: 'Mariachi Solista Premium (Edwin Agudelo)',
    subtitle:
      'Voz tenor solista de gran gala con pistas master HD, sonido calibrado y 100 km incluidos desde Hub Méntrida.',
    membersLabel: '1 Solista (Edwin Agudelo)',
    membersCount: 1,
    isEdwinSoloist: true,
    defaultHasClosedPrice: true,
    closedBasePriceEur: TARIFA_ESTANDAR_SOLISTA_EUR,
  },
  {
    id: 'trio',
    shortLabel: 'Trío',
    title: 'Trío Mariachi Asociado (Red Nacional)',
    subtitle:
      'Agrupación externa asociada de 3 músicos charros. Disponibilidad y caché según sede municipal.',
    membersLabel: '3 Músicos Asociados',
    membersCount: 3,
    isEdwinSoloist: false,
    defaultHasClosedPrice: false,
    closedBasePriceEur: null,
  },
  {
    id: 'cuarteto',
    shortLabel: 'Cuarteto',
    title: 'Cuarteto Clásico Ranchero (Red Verificada)',
    subtitle:
      'Trompeta, vihuela, guitarrón y violín. Agrupación asociada verificada bajo Split Soberano 80/10/10.',
    membersLabel: '4 Músicos Asociados',
    membersCount: 4,
    isEdwinSoloist: false,
    defaultHasClosedPrice: true,
    closedBasePriceEur: MARIACHI_FORMAT_BY_ID.cuarteto.basePrice,
  },
  {
    id: 'agrupacion_completa',
    shortLabel: 'Agrupación Completa',
    title: 'Agrupación Completa de Gala (6 a 8 Músicos)',
    subtitle:
      '2 trompetas, violines, vihuela y guitarrón para bodas, fincas y eventos corporativos o patronales.',
    membersLabel: '6 - 8 Músicos',
    membersCount: 6,
    isEdwinSoloist: false,
    defaultHasClosedPrice: true,
    closedBasePriceEur: MARIACHI_FORMAT_BY_ID.gala.basePrice,
  },
]);

export const EXPRESS_FORMAT_BY_ID: Readonly<
  Record<ExpressMariachiFormatId, ExpressMariachiFormatSpec>
> = Object.freeze({
  solista_edwin: EXPRESS_MARIACHI_FORMATS[0],
  trio: EXPRESS_MARIACHI_FORMATS[1],
  cuarteto: EXPRESS_MARIACHI_FORMATS[2],
  agrupacion_completa: EXPRESS_MARIACHI_FORMATS[3],
});

/** Teléfono oficial en formato `tel:` para marcado en 1 clic. */
export const CENTRALITA_TEL_HREF = `tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`;

/** Dígitos limpios para enlace `https://wa.me/<digits>`. */
export const CENTRALITA_WA_DIGITS = CENTRALITA_EAR_OS.replace(/\D/g, '');

export interface WhatsAppExpressParams {
  readonly municipality?: string | null;
  readonly dateDdMm?: string | null;
  readonly timeHhMm?: string | null;
}

/**
 * Formatea una fecha ISO (`YYYY-MM-DD`) o texto `DD/MM` al formato corto `DD/MM`.
 * Si está vacía o no es interpretable, devuelve `'a convenir'`.
 */
export function normalizeDateDdMm(raw: string | null | undefined): string {
  if (typeof raw !== 'string') return 'a convenir';
  const trimmed = raw.trim();
  if (!trimmed) return 'a convenir';

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (isoMatch) {
    return `${isoMatch[3]}/${isoMatch[2]}`;
  }

  const slashMatch = /^(\d{1,2})\/(\d{1,2})(?:\/\d{2,4})?$/.exec(trimmed);
  if (slashMatch) {
    return `${slashMatch[1].padStart(2, '0')}/${slashMatch[2].padStart(2, '0')}`;
  }

  return trimmed.slice(0, 16);
}

/**
 * Normaliza una hora a formato `HH:MM`.
 */
export function normalizeTimeHhMm(raw: string | null | undefined): string {
  if (typeof raw !== 'string') return '21:00';
  const trimmed = raw.trim();
  const match = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
  if (match) {
    const h = Math.min(23, Math.max(0, Number(match[1])));
    const m = Math.min(59, Math.max(0, Number(match[2])));
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  }
  return trimmed.length > 0 ? trimmed.slice(0, 8) : '21:00';
}

/**
 * Construye el mensaje exacto de la Directiva v5 (Paso 1.1.B):
 * "Hola, necesito mariachi en [Municipio] para la fecha [DD/MM] a las [HH:MM]. ¿Tenéis disponibilidad y precio?"
 */
export function buildMariachiWhatsAppExpressMessage(params: WhatsAppExpressParams): string {
  const municipality =
    typeof params.municipality === 'string' && params.municipality.trim().length > 0
      ? params.municipality.trim()
      : 'Madrid';
  const dateDdMm = normalizeDateDdMm(params.dateDdMm);
  const timeHhMm = normalizeTimeHhMm(params.timeHhMm);

  return `Hola, necesito mariachi en ${municipality} para la fecha ${dateDdMm} a las ${timeHhMm}. ¿Tenéis disponibilidad y precio?`;
}

/**
 * Devuelve la URL completa `https://wa.me/34693693048?text=...` lista para abrir en 1 clic.
 */
export function buildMariachiWhatsAppExpressUrl(params: WhatsAppExpressParams): string {
  const message = buildMariachiWhatsAppExpressMessage(params);
  return `https://wa.me/${CENTRALITA_WA_DIGITS}?text=${encodeURIComponent(message)}`;
}

export interface SovereignSplitCents {
  readonly artist80Cents: number;
  readonly earOs10Cents: number;
  readonly vimume10Cents: number;
  readonly artist80Eur: number;
  readonly earOs10Eur: number;
  readonly vimume10Eur: number;
}

/**
 * Calcula el Split Soberano 80/10/10 exacto en céntimos enteros sin pérdida de redondeo.
 * Invariante: `artist80Cents + earOs10Cents + vimume10Cents === totalCents`.
 */
export function computeSovereignSplitCents(totalCents: number): SovereignSplitCents {
  const safeTotalCents = Math.max(0, Math.round(totalCents));
  const artist80Cents = Math.round(safeTotalCents * SPLIT_SOBERANO.artista);
  const earOs10Cents = Math.round(safeTotalCents * SPLIT_SOBERANO.earOs);
  const vimume10Cents = safeTotalCents - artist80Cents - earOs10Cents;

  return {
    artist80Cents,
    earOs10Cents,
    vimume10Cents,
    artist80Eur: artist80Cents / 100,
    earOs10Eur: earOs10Cents / 100,
    vimume10Eur: vimume10Cents / 100,
  };
}

export interface ExpressMariachiQuoteInput {
  readonly formatId: ExpressMariachiFormatId;
  readonly distanceKm: number;
  readonly endHour?: number;
  readonly municipality?: string;
  readonly dateDdMm?: string;
  readonly timeHhMm?: string;
  /** Código de cupón de afiliado/redes (solo aplica a `solista_edwin`). */
  readonly couponCode?: string | null;
  readonly affiliates?: readonly AfiliadoCupon[];
  /**
   * Para agrupaciones externas asociadas (`trio`, `cuarteto`, `agrupacion_completa`):
   * permite indicar si la agrupación asignada en ese municipio tiene precio cerrado en DB.
   * Si es `false` (o `null` en `trio`), se activa `"COTIZACION_EXPRESS_ASISTIDA"`.
   */
  readonly externalBandClosedPriceEur?: number | null;
  readonly forceAssistedQuote?: boolean;
}

export interface ExpressMariachiQuoteResult {
  readonly format: ExpressMariachiFormatSpec;
  readonly pricingMode: MariachiPricingMode;
  readonly isEdwinSoloist: boolean;
  readonly hasClosedPrice: boolean;
  readonly municipality: string;
  readonly dateDdMm: string;
  readonly timeHhMm: string;
  readonly distanceKm: number;
  readonly includedKm: number;
  readonly billableKm: number;
  readonly kmRateEur: number;
  readonly basePriceEur: number | null;
  readonly affiliateDiscountEur: number;
  readonly affiliateCouponFloorEur: number;
  readonly couponApplied: string | null;
  readonly couponRejectionReason: CuponRechazoMotivo | null;
  readonly logisticsCostEur: number;
  readonly hotelSupplementEur: number;
  readonly totalEur: number | null;
  readonly totalCents: number;
  /**
   * Importe de señal / reserva para bloqueo de fecha:
   * - Edwin Solista Premium: 50% vía Stripe Checkout (`RESERVA_BLOQUEO_PCT = 0.5`).
   * - Agrupación externa con precio cerrado: 100,00 € (`DEPOSITO_STRIPE_EUR`).
   * - Agrupación sin precio cerrado ("Cotización Express Asistida"): 0 € (canaliza a centralita).
   */
  readonly depositEur: number;
  readonly depositCents: number;
  readonly depositPctLabel: string;
  readonly balanceEur: number;
  readonly split: SovereignSplitCents;
  readonly whatsappExpressUrl: string;
  readonly centralitaTelHref: string;
}

/**
 * Motor unificado de los Pasos 1 y 2 de la Directiva v5:
 *  - Si `formatId === 'solista_edwin'`:
 *    · Tarifa base 550,00 € con 100 km incluidos (1,50 €/km adicional).
 *    · Reserva inmediata del 50% vía Stripe Checkout.
 *    · Suelo de cupón de afiliado/redes: 350,00 €.
 *  - Si `formatId` es una agrupación externa (`trio`, `cuarteto`, `agrupacion_completa`):
 *    · Aislamiento estricto: jamás aplica la tarifa de solista de Edwin ni su cupón.
 *    · Si no tiene precio cerrado en DB (`hasClosedPrice === false`), devuelve
 *      `pricingMode: 'COTIZACION_EXPRESS_ASISTIDA'`.
 *    · Asigna margen bajo el Split Soberano 80/10/10.
 */
export function evaluateExpressMariachiQuote(
  input: ExpressMariachiQuoteInput,
): ExpressMariachiQuoteResult {
  const format = EXPRESS_FORMAT_BY_ID[input.formatId] ?? EXPRESS_FORMAT_BY_ID.solista_edwin;
  const municipality =
    typeof input.municipality === 'string' && input.municipality.trim().length > 0
      ? input.municipality.trim()
      : 'Madrid';
  const dateDdMm = normalizeDateDdMm(input.dateDdMm);
  const timeHhMm = normalizeTimeHhMm(input.timeHhMm);
  const distanceKm =
    Number.isFinite(input.distanceKm) && input.distanceKm > 0
      ? Math.round(input.distanceKm)
      : 0;
  const endHour =
    typeof input.endHour === 'number' && Number.isFinite(input.endHour) ? input.endHour : 2;

  const whatsappExpressUrl = buildMariachiWhatsAppExpressUrl({
    municipality,
    dateDdMm,
    timeHhMm,
  });

  // ── CASO 1: EDWIN AGUDELO (MARIACHI SOLISTA PREMIUM) ──────────────────────
  if (format.isEdwinSoloist) {
    const solistaQuote = calculateSolistaQuote({
      distanciaKm: distanceKm,
      horaFin: endHour,
      cupon: input.couponCode,
      afiliados: (input as any).afiliados ?? [],
    });

    const totalCents = Math.round(solistaQuote.totalEur * 100);
    const depositCents = Math.round(solistaQuote.reservaEur * 100);
    const split = computeSovereignSplitCents(totalCents);

    return {
      format,
      pricingMode: 'EDWIN_SOLISTA_OFICIAL',
      isEdwinSoloist: true,
      hasClosedPrice: true,
      municipality,
      dateDdMm,
      timeHhMm,
      distanceKm,
      includedKm: SOLISTA_KM_INCLUIDOS,
      billableKm: solistaQuote.kmAdicionales,
      kmRateEur: LOGISTICA_EUR_PER_KM,
      basePriceEur: solistaQuote.tarifaBaseEur,
      affiliateDiscountEur: solistaQuote.descuentoAfiliadoEur,
      affiliateCouponFloorEur: TARIFA_BASE_SOLISTA_EUR,
      couponApplied:
        solistaQuote.descuentoAfiliadoEur > 0 ? solistaQuote.cuponCodigo : null,
      couponRejectionReason: solistaQuote.cuponMotivo,
      logisticsCostEur: solistaQuote.costeKmAdicionalEur,
      hotelSupplementEur: solistaQuote.suplementoHotelEur,
      totalEur: solistaQuote.totalEur,
      totalCents,
      depositEur: solistaQuote.reservaEur,
      depositCents,
      depositPctLabel: `${Math.round(RESERVA_BLOQUEO_PCT * 100)}% Reserva Stripe Agenda`,
      balanceEur: solistaQuote.liquidacionEur,
      split,
      whatsappExpressUrl,
      centralitaTelHref: CENTRALITA_TEL_HREF,
    };
  }

  // ── CASO 2: AGRUPACIONES EXTERNAS ASOCIADAS (AISLAMIENTO ESTRICTO) ────────
  // Jamás se aplica la tarifa de solista (550 € / 350 €) ni los 100 km de Edwin.
  const resolvedClosedBase =
    typeof input.externalBandClosedPriceEur === 'number' &&
      Number.isFinite(input.externalBandClosedPriceEur) &&
      input.externalBandClosedPriceEur > 0
      ? input.externalBandClosedPriceEur
      : format.closedBasePriceEur;

  const hasClosedPrice = !input.forceAssistedQuote && resolvedClosedBase !== null;

  if (!hasClosedPrice || resolvedClosedBase === null) {
    const emptySplit = computeSovereignSplitCents(0);
    return {
      format,
      pricingMode: 'COTIZACION_EXPRESS_ASISTIDA',
      isEdwinSoloist: false,
      hasClosedPrice: false,
      municipality,
      dateDdMm,
      timeHhMm,
      distanceKm,
      includedKm: LOGISTICA_KM_EXENTOS,
      billableKm: Math.max(0, distanceKm - LOGISTICA_KM_EXENTOS),
      kmRateEur: LOGISTICA_EUR_PER_KM,
      basePriceEur: null,
      affiliateDiscountEur: 0,
      affiliateCouponFloorEur: TARIFA_BASE_SOLISTA_EUR,
      couponApplied: null,
      couponRejectionReason: null,
      logisticsCostEur: 0,
      hotelSupplementEur: 0,
      totalEur: null,
      totalCents: 0,
      depositEur: 0,
      depositCents: 0,
      depositPctLabel: 'Cotización Express Asistida · Centralita',
      balanceEur: 0,
      split: emptySplit,
      whatsappExpressUrl,
      centralitaTelHref: CENTRALITA_TEL_HREF,
    };
  }

  // Agrupación asociada con precio cerrado en base de datos
  const billableKm = Math.max(0, distanceKm - LOGISTICA_KM_EXENTOS);
  const logisticsCents = Math.round(billableKm * LOGISTICA_EUR_PER_KM * 100);
  const requiresHotel = distanceKm > LOGISTICA_KM_HOTEL || endHour >= HORA_FIN_HOTEL;
  const hotelCents = requiresHotel ? Math.round(SUPLEMENTO_HOTEL_EUR * 100) : 0;
  const baseCents = Math.round(resolvedClosedBase * 100);
  const totalCents = baseCents + logisticsCents + hotelCents;
  const depositCents = Math.round(DEPOSITO_STRIPE_EUR * 100);
  const balanceCents = Math.max(0, totalCents - depositCents);
  const split = computeSovereignSplitCents(totalCents);

  return {
    format,
    pricingMode: 'AGRUPACION_PRECIO_CERRADO',
    isEdwinSoloist: false,
    hasClosedPrice: true,
    municipality,
    dateDdMm,
    timeHhMm,
    distanceKm,
    includedKm: LOGISTICA_KM_EXENTOS,
    billableKm,
    kmRateEur: LOGISTICA_EUR_PER_KM,
    basePriceEur: resolvedClosedBase,
    affiliateDiscountEur: 0,
    affiliateCouponFloorEur: TARIFA_BASE_SOLISTA_EUR,
    couponApplied: null,
    couponRejectionReason: null,
    logisticsCostEur: logisticsCents / 100,
    hotelSupplementEur: hotelCents / 100,
    totalEur: totalCents / 100,
    totalCents,
    depositEur: depositCents / 100,
    depositCents,
    depositPctLabel: `Señal Price-Lock (${DEPOSITO_STRIPE_EUR.toFixed(0)} € Deducibles)`,
    balanceEur: balanceCents / 100,
    split,
    whatsappExpressUrl,
    centralitaTelHref: CENTRALITA_TEL_HREF,
  };
}



