/**
 * ════════════════════════════════════════════════════════════════════════════
 * MOTOR TARIFARIO DEL SOLISTA (EDWIN AGUDELO) — DIRECTIVA COMERCIAL CEO
 * ════════════════════════════════════════════════════════════════════════════
 * Reglas canónicas (SSOT `ear-os-ssot.ts`, ZONA CERO):
 *  · Tarifa estándar mínima oficial: 550,00 € con 100 km incluidos.
 *  · Suelo inviolable: 350,00 € (Pack Solista Premium), solo vía cupón válido.
 *  · Reserva de bloqueo de fecha: 50% del total presupuestado.
 *  · Km adicional por encima de los 100 incluidos: 1,50 €/km (SSOT).
 *
 * Este módulo es PURO e ISOMORFO (sin `fs`, sin `node:*`): puede importarse
 * desde componentes `'use client'` y desde Server Actions / Route Handlers.
 * El padrón de afiliados vive en disco y se inyecta como input, de modo que
 * el motor nunca inventa códigos ni toca red en el cliente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_ESTANDAR_SOLISTA_EUR,
  TARIFA_BASE_SOLISTA_EUR,
  SOLISTA_KM_INCLUIDOS,
  LOGISTICA_EUR_PER_KM,
  RESERVA_BLOQUEO_PCT,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
} from '@/lib/constants/ear-os-ssot';

/** Suelo tarifario absoluto del Solista (350,00 €). */
export const SUELO_SOLISTA_EUR: number = TARIFA_BASE_SOLISTA_EUR;

/** Tarifa estándar mínima oficial sin descuento (550,00 €). */
export const TARIFA_SOLISTA_EUR: number = TARIFA_ESTANDAR_SOLISTA_EUR;

/** Kilómetros incluidos en la tarifa estándar (100 km). */
export const KM_INCLUIDOS: number = SOLISTA_KM_INCLUIDOS;

/** Coste del kilómetro adicional por encima de la franquicia incluida. */
export const COSTE_KM_ADICIONAL_EUR: number = LOGISTICA_EUR_PER_KM;

/** Porcentaje de reserva de bloqueo de fecha (50%). */
export const RESERVA_PCT: number = RESERVA_BLOQUEO_PCT;

/** Etiqueta comercial del pack promocional de afiliados. */
export const PACK_SOLISTA_PREMIUM_ETIQUETA = 'Pack Solista Premium';

/** Condiciones contractuales completas que el resumen previo al pago declara. */
export const CONDICIONES_CONTRATO_SOLISTA = Object.freeze({
  concepto:
    'Show Solista Premium de 1 hora (2 pases de 30 min) con sonorización profesional, repertorio personalizable y canción dedicada.',
  kmIncluidos: `Los primeros ${KM_INCLUIDOS} km de desplazamiento desde el Hub Méntrida están incluidos en la tarifa de ${TARIFA_SOLISTA_EUR.toFixed(2).replace('.', ',')} €.`,
  costeKmAdicional: `${COSTE_KM_ADICIONAL_EUR.toFixed(2).replace('.', ',')} €/km adicional a partir del km ${KM_INCLUIDOS + 1}.`,
  suplementoHotel: `+${SUPLEMENTO_HOTEL_EUR.toFixed(2).replace('.', ',')} € de suplemento hotelero si la distancia supera ${LOGISTICA_KM_HOTEL} km o el evento finaliza a partir de las 0${HORA_FIN_HOTEL}:00 AM.`,
  reserva: `Reserva de bloqueo de fecha: ${(RESERVA_PCT * 100).toFixed(0)}% del total presupuestado. La fecha queda bloqueada de forma atómica al confirmarse el pago.`,
  liquidacion:
    'El 50% restante se liquida con fecha límite 72 horas antes del evento, contra contrato digital firmado y factura.',
  cancelacion:
    'Cancelación por el cliente: una vez bloqueada la fecha se retiene la reserva del 50% en concepto de esfuerzo de producción.',
  fuerzaMayor:
    'Fuerza mayor documentada (enfermedad con parte médico, accidente, catástrofe o prohibición administrativa): reprogramación sin penalización o reembolso íntegro de la reserva en 7 días hábiles.',
} as const);

/** Motivo tipado de rechazo de un cupón (nunca un string libre). */
export type CuponRechazoMotivo = 'VACIO' | 'FORMATO_INVALIDO' | 'NO_EXISTE' | 'INACTIVO';

/** Resultado de la validación de un cupón de afiliado. */
export interface CuponValidationResult {
  readonly valido: boolean;
  readonly motivo?: CuponRechazoMotivo;
  readonly codigoNormalizado: string;
  readonly afiliadoNombre?: string;
  readonly descuentoEur: number;
}

/**
 * Afiliado mínimo que el motor necesita para validar un cupón.
 * Se resuelve desde `/api/affiliates/register` (persistencia en disco).
 */
export interface AfiliadoCupon {
  readonly affiliateCode: string;
  readonly name?: string;
  readonly companyName?: string;
  readonly status?: string;
}

export interface SolistaQuoteInput {
  /** Kilómetros del desplazamiento (Hub Méntrida → destino). */
  readonly distanciaKm: number;
  /** Hora de fin en formato 24h (>= 3 activa el suplemento hotelero). */
  readonly horaFin?: number;
  /** Código de afiliado introducido por el cliente (opcional). */
  readonly cupon?: string | null;
  /** Padrón de afiliados activos. Sin padrón, ningún cupón es válido. */
  readonly afiliados?: readonly AfiliadoCupon[];
  /** Fecha del evento (YYYY-MM-DD) para la fecha límite de liquidación. */
  readonly fechaEvento?: string | null;
}

/** Desglose completo y trazable que alimenta el resumen previo al pago. */
export interface SolistaQuoteBreakdown {
  readonly concepto: string;
  /** Tarifa de lista antes de descuentos (550,00 €). */
  readonly tarifaBaseEur: number;
  /** Descuento aplicado por cupón de afiliado (0 si no hay cupón válido). */
  readonly descuentoAfiliadoEur: number;
  /** Etiqueta del pack promocional cuando el cupón es válido. */
  readonly packPromocional: string | null;
  /** Código de afiliado normalizado (válido o no, para auditoría). */
  readonly cuponCodigo: string | null;
  /** Motivo de rechazo del cupón cuando no aplica. */
  readonly cuponMotivo: CuponRechazoMotivo | null;
  readonly distanciaKm: number;
  /** Kilómetros incluidos en la tarifa (100). */
  readonly kmIncluidos: number;
  /** Kilómetros facturables por encima de la franquicia. */
  readonly kmAdicionales: number;
  readonly costeKmAdicionalEur: number;
  /** Suplemento hotelero (0 si no aplica). */
  readonly suplementoHotelEur: number;
  /** Total presupuestado (tarifa + logística + hotel). */
  readonly totalEur: number;
  /** Reserva de bloqueo de fecha (50% del total). */
  readonly reservaEur: number;
  /** Importe pendiente de liquidación (50% del total). */
  readonly liquidacionEur: number;
  /** Fecha límite de liquidación (ISO 8601) o cadena vacía. */
  readonly fechaLimiteLiquidacion: string;
  readonly condiciones: typeof CONDICIONES_CONTRATO_SOLISTA;
}

/** Redondeo monetario determinista a céntimos (cero deriva flotante). */
function toCents(eur: number): number {
  return Math.round(eur * 100);
}

function fromCents(cents: number): number {
  return Math.round(cents) / 100;
}

/**
 * Normaliza un código de cupón: mayúsculas, sin acentos ni separadores
 * decorativos. `ear-ezkertza-1234` → `EAR-EZKERTZA-1234`.
 */
export function normalizarCodigoCupon(raw: string | null | undefined): string {
  if (typeof raw !== 'string') return '';
  return raw
    .trim()
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Valida un cupón de afiliado contra el padrón.
 * FAIL-CLOSED: sin padrón, con código desconocido o con afiliado inactivo,
 * el cupón NO se aplica y el descuento es 0,00 €.
 */
export function validarCuponAfiliado(
  raw: string | null | undefined,
  afiliados: readonly AfiliadoCupon[] = [],
): CuponValidationResult {
  const codigo = normalizarCodigoCupon(raw);

  if (codigo.length === 0) {
    return { valido: false, motivo: 'VACIO', codigoNormalizado: '', descuentoEur: 0 };
  }

  // Estructura canónica: EAR-<SLUG>-<SUFIJO> (slug 2-12 alfanuméricos).
  if (!/^EAR-[A-Z0-9]{2,12}-[A-Z0-9]{3,8}$/.test(codigo)) {
    return {
      valido: false,
      motivo: 'FORMATO_INVALIDO',
      codigoNormalizado: codigo,
      descuentoEur: 0,
    };
  }

  const match = afiliados.find((a) => normalizarCodigoCupon(a.affiliateCode) === codigo);

  if (!match) {
    return { valido: false, motivo: 'NO_EXISTE', codigoNormalizado: codigo, descuentoEur: 0 };
  }

  const estado = (match.status || 'ACTIVE_HOMOLOGATED').toUpperCase();
  if (estado !== 'ACTIVE_HOMOLOGATED' && estado !== 'ACTIVE') {
    return { valido: false, motivo: 'INACTIVO', codigoNormalizado: codigo, descuentoEur: 0 };
  }

  return {
    valido: true,
    codigoNormalizado: codigo,
    afiliadoNombre: match.companyName || match.name,
    descuentoEur: fromCents(toCents(TARIFA_SOLISTA_EUR) - toCents(SUELO_SOLISTA_EUR)),
  };
}

/**
 * Fecha límite de liquidación: 72 h antes del evento.
 * Si la fecha no es interpretable devuelve cadena vacía (jamás una fecha falsa).
 */
export function calcularFechaLimiteLiquidacion(fechaEvento: string | null | undefined): string {
  if (typeof fechaEvento !== 'string' || fechaEvento.trim().length === 0) return '';
  const parsed = new Date(`${fechaEvento.trim()}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Date(parsed.getTime() - 72 * 60 * 60 * 1000).toISOString();
}

/**
 * Motor único de cotización del Solista.
 *
 * Invariantes verificados en runtime:
 *  1. `totalEur` NUNCA es inferior a `SUELO_SOLISTA_EUR` (350,00 €).
 *  2. Sin cupón válido, la tarifa es la estándar mínima oficial (550,00 €).
 *  3. `reservaEur + liquidacionEur` suma exactamente `totalEur` (céntimos).
 *  4. El kilometraje adicional solo se factura por encima de `KM_INCLUIDOS`.
 */
export function calculateSolistaQuote(input: SolistaQuoteInput): SolistaQuoteBreakdown {
  const distanciaKm =
    Number.isFinite(input.distanciaKm) && input.distanciaKm > 0
      ? Math.round(input.distanciaKm * 10) / 10
      : 0;

  const cupon = validarCuponAfiliado(input.cupon, input.afiliados ?? []);

  const tarifaCents = toCents(TARIFA_SOLISTA_EUR);
  const descuentoCents = cupon.valido
    ? Math.min(tarifaCents - toCents(SUELO_SOLISTA_EUR), toCents(cupon.descuentoEur))
    : 0;
  const tarifaAplicadaCents = tarifaCents - descuentoCents;

  const kmAdicionales = Math.max(0, Math.round(distanciaKm) - KM_INCLUIDOS);
  const costeKmCents = toCents(kmAdicionales * COSTE_KM_ADICIONAL_EUR);

  const requiereHotel =
    distanciaKm > LOGISTICA_KM_HOTEL ||
    (typeof input.horaFin === 'number' &&
      Number.isFinite(input.horaFin) &&
      input.horaFin >= HORA_FIN_HOTEL);
  const hotelCents = requiereHotel ? toCents(SUPLEMENTO_HOTEL_EUR) : 0;

  const totalCents = tarifaAplicadaCents + costeKmCents + hotelCents;
  // Blindaje anti-deriva: el total jamás cae por debajo del suelo del SSOT.
  const totalSeguroCents = Math.max(totalCents, toCents(SUELO_SOLISTA_EUR));

  const reservaCents = Math.round(totalSeguroCents * RESERVA_PCT);
  const liquidacionCents = totalSeguroCents - reservaCents;

  return {
    concepto: CONDICIONES_CONTRATO_SOLISTA.concepto,
    tarifaBaseEur: fromCents(tarifaCents),
    descuentoAfiliadoEur: fromCents(descuentoCents),
    packPromocional: cupon.valido ? PACK_SOLISTA_PREMIUM_ETIQUETA : null,
    cuponCodigo: cupon.codigoNormalizado.length > 0 ? cupon.codigoNormalizado : null,
    cuponMotivo: cupon.valido ? null : (cupon.motivo ?? null),
    distanciaKm,
    kmIncluidos: KM_INCLUIDOS,
    kmAdicionales,
    costeKmAdicionalEur: fromCents(costeKmCents),
    suplementoHotelEur: fromCents(hotelCents),
    totalEur: fromCents(totalSeguroCents),
    reservaEur: fromCents(reservaCents),
    liquidacionEur: fromCents(liquidacionCents),
    fechaLimiteLiquidacion: calcularFechaLimiteLiquidacion(input.fechaEvento),
    condiciones: CONDICIONES_CONTRATO_SOLISTA,
  };
}
