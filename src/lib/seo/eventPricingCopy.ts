/**
 * COPY DE PRECIOS PARA LANDINGS DE EVENTOS — derivado del SSOT, nunca escrito a mano.
 *
 * INV-01 / INV-03 / INV-10: ningún importe se teclea en una página. La tarifa
 * base, el depósito, el €/km, el techo LCSP y el rider salen de
 * `src/lib/constants/ear-os-ssot.ts`. Si mañana cambia el SSOT, cambian las
 * 24.000 páginas sin tocar una línea de copy.
 *
 * Verificación de equivalencia con los datos del grafo provincial:
 *   Almería 408 km → (408 - 50) × 1,50 = 537,00 € = `deliveryCostBase` del grafo.
 *   Córdoba 266 km → (266 - 50) × 1,50 = 324,00 € = `deliveryCostBase` del grafo.
 * La fórmula aquí no inventa un precio: reproduce el que ya usa el negocio.
 *
 * SEC-2 · role: public | tenant: global. Cero datos personales.
 */
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SUPLEMENTO_HOTEL_EUR,
  LIMITE_B2G_LCSP_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatEur(value: number): string {
  return EUR_FORMATTER.format(value);
}

/** Redondeo a céntimo, sin arrastrar errores de coma flotante. */
function toCents(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Logística S-Class: 1,50 €/km a partir del km 50. Cero € dentro del radio. */
export function computeLogisticsEur(distanceKm: number): number {
  if (!Number.isFinite(distanceKm)) return 0;
  const billableKm = Math.max(0, distanceKm - LOGISTICA_KM_EXENTOS);
  return toCents(billableKm * LOGISTICA_EUR_PER_KM);
}

/** Precio de entrada desde el hub: tarifa base + logística provincial. */
export function computeFromPriceEur(distanceKm: number): number {
  return toCents(TARIFA_BASE_SOLISTA_EUR + computeLogisticsEur(distanceKm));
}

/** Enlace de WhatsApp con el mensaje ya redactado. Sin formularios intermedios. */
export function buildWhatsappUrl(message: string): string {
  const digits = CENTRALITA_EAR_OS.replace(/[^0-9]/g, '');
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Todos los importes y límites ya formateados, en un único objeto inmutable. */
export const EVENT_SSOT_COPY = Object.freeze({
  basePrice: formatEur(TARIFA_BASE_SOLISTA_EUR),
  deposit: formatEur(DEPOSITO_STRIPE_EUR),
  eurPerKm: formatEur(LOGISTICA_EUR_PER_KM),
  exemptKm: LOGISTICA_KM_EXENTOS,
  hotelSupplement: formatEur(SUPLEMENTO_HOTEL_EUR),
  lcspCeiling: formatEur(LIMITE_B2G_LCSP_EUR),
  lcspSafeCeiling: formatEur(AJUSTE_PREVENTIVO_B2G_EUR),
  splLimit: LIMITE_SPL_DB,
  wattsPerPax: WATTS_PER_PAX,
  phone: CENTRALITA_EAR_OS,
} as const);
