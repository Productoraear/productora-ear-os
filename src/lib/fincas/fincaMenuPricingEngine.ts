/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — FINCAS B2B ESCAPARATE · MOTOR FINANCIERO Y PRICING DE MENÚS 2026
 * ════════════════════════════════════════════════════════════════════════════
 * Ubicación: `src/lib/fincas/fincaMenuPricingEngine.ts`
 * Referencia SSOT: `PROJECT.md` · `ORIGINAL_REQUEST.md` (R2, R5) · `AGENTS.md`
 *
 * Invariantes Inmutables de Negocio:
 *  1. Céntimos Enteros (Integer Cents): Cero operaciones flotantes en la ruta del
 *     dinero. Todos los cálculos se efectúan en céntimos enteros deterministas.
 *  2. Split Soberano 80/10/10: 80% Artista/Proveedor, 10% EAR OS Infraestructura,
 *     10% VIMUME Impacto Social. Calculado mediante el algoritmo de mayor resto
 *     (Hare-Niemeyer / Largest Remainder) garantizando suma exacta al céntimo.
 *  3. Logística Canónica S-Class: 1,50 €/km (150 céntimos) tras 50 km exentos.
 *     Suplemento hotelero de 120,00 € (12.000 céntimos) si distancia > 200 km
 *     o si el evento finaliza a partir de las 03:00 AM (madrugada).
 *  4. Comisión de Afiliado para Finca (10% a 15%): Se detrae EXCLUSIVAMENTE de la
 *     cuota del 10% de infraestructura EAR OS. El 80% del artista y el 10% de VIMUME
 *     permanecen 100% blindados e inalterados.
 *  5. Rider Acústico Ley 37/2003: 12 W/pax RMS, límite de salud pública <= 75 dB SPL.
 *  6. Depósito de Bloqueo Deducible: 100,00 € (10.000 céntimos) Stripe Price-Lock SHA-256.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  EAR_OS_SSOT,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  VAT_RATE,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';

import {
  FINCA_MENUS_2026,
  FINCA_EXTRAS_2026,
  getFincaMenuById,
  getFincaExtraById,
  type FincaMenuPackage2026,
  type FincaComplemento2026,
} from './fincaMenus2026Catalog';

// ── CONSTANTES CANÓNICAS EN CÉNTIMOS ENTEROS ─────────────────────────────────

export const LOGISTICA_KM_RATE_CENTS: number = Math.round(LOGISTICA_EUR_PER_KM * 100); // 150 céntimos = 1,50 €
export const LOGISTICA_KM_EXEMPT: number = LOGISTICA_KM_EXENTOS; // 50 km
export const LOGISTICA_HOTEL_CENTS: number = Math.round(SUPLEMENTO_HOTEL_EUR * 100); // 12.000 céntimos = 120,00 €
export const DEPOSITO_PRICE_LOCK_CENTS: number = Math.round(DEPOSITO_STRIPE_EUR * 100); // 10.000 céntimos = 100,00 €

export const COMISION_AFILIADO_MIN_PCT: number = 0.10; // 10%
export const COMISION_AFILIADO_MAX_PCT: number = 0.15; // 15%

// ── CONTRATOS DE DATOS TIPADOS (PROJECT.md) ──────────────────────────────────

/** Parámetros de entrada para el cálculo reactivo del simulador de fincas */
export interface FincaMenuPricingInput {
  menuId: string;
  guestCount: number;
  selectedExtraIds: string[];
  distanceKm: number;
  fincaBaseAddress?: string;
  eventEndTime?: string; // e.g. "04:00", "03:30", "23:00"
  affiliateCommissionPct?: number; // 0.10 a 0.15 (o 10 a 15)
}

/** Desglose individual de cada complemento seleccionado */
export interface FincaExtraBreakdownItem {
  id: string;
  name: string;
  unitPriceCents: number;
  isPerPax: boolean;
  totalItemCents: number;
}

/** Resultado formal y exhaustivo del cálculo financiero en céntimos enteros */
export interface FincaMenuPricingResult {
  menuTotalCents: number;
  extrasTotalCents: number;
  logisticsKmCents: number;
  logisticsHotelCents: number;
  subtotalCents: number;
  ivaCents: number;
  totalWithIvaCents: number;
  split: {
    artistaCents: number;
    earOsCents: number;
    vimumeCents: number;
  };
  affiliateCommissionCents: number;
  acousticRider: {
    recommendedWatts: number; // guestCount * 12 W/pax
    maxDbSpl: number; // 75 dB SPL
    isCompliant: boolean;
    isCompliantWithHealthStandard: boolean;
    systemRecommended: string;
  };
  depositDeductibleCents: number; // 10.000 céntimos (100,00 €)
  
  // Metadatos auxiliares de presentación (en céntimos enteros)
  metadata: {
    menuName: string;
    menuPricePerPaxCents: number;
    guestCount: number;
    billableKm: number;
    hotelRequired: boolean;
    earOsNetAfterCommissionCents: number;
    pendingBalanceWithIvaCents: number; // totalWithIvaCents - depositDeductibleCents
    extrasBreakdown: FincaExtraBreakdownItem[];
  };
}

// ── ERRORES TIPADOS DEL MOTOR ────────────────────────────────────────────────

export type FincaPricingErrorCode =
  | 'INVALID_GUEST_COUNT'
  | 'INVALID_DISTANCE'
  | 'MENU_NOT_FOUND'
  | 'INVALID_COMMISSION_RATE';

export class FincaPricingEngineError extends Error {
  readonly code: FincaPricingErrorCode;

  constructor(code: FincaPricingErrorCode, message: string) {
    super(`[FincaPricingEngine/${code}] ${message}`);
    this.name = 'FincaPricingEngineError';
    this.code = code;
  }
}

// ── FUNCIONES DE CONVERSIÓN Y FORMATEO SEGURO ────────────────────────────────

/**
 * Convierte euros decimales a céntimos enteros redondeados.
 */
export function eurToCents(eur: number): number {
  if (!Number.isFinite(eur) || eur < 0) {
    throw new FincaPricingEngineError('INVALID_COMMISSION_RATE', `Importe no válido: ${eur}`);
  }
  return Math.round(eur * 100);
}

/**
 * Convierte céntimos enteros a euros para presentación en UI.
 */
export function centsToEur(cents: number): number {
  return cents / 100;
}

/**
 * Formatea céntimos enteros a divisa europea (ej: 12.345,67 €).
 */
export function formatCentsEur(cents: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

// ── REGLAS DE DETECCIÓN Y VALIDACIÓN ─────────────────────────────────────────

/**
 * Determina si el evento requiere suplemento hotelero según distancia u hora de fin.
 * Requiere hotel si:
 *   - distancia > 200 km
 *   - hora de finalización >= 03:00 AM (madrugada) y antes de las 12:00 PM
 */
export function isHotelRequired(distanceKm: number, eventEndTime?: string): boolean {
  if (distanceKm > LOGISTICA_KM_HOTEL) {
    return true;
  }

  if (eventEndTime) {
    const match = eventEndTime.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (match && match[1]) {
      const hours = parseInt(match[1], 10);
      if (hours >= HORA_FIN_HOTEL && hours < 12) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Selecciona el sistema de sonido Bose recomendado según la potencia RMS necesaria.
 */
export function resolveAcousticSystem(watts: number): string {
  if (watts <= 600) {
    return 'Bose S1 Pro System (Compacto / Directo Acústico / Batería)';
  }
  if (watts <= 2400) {
    return 'Bose F1 Model 812 Dual Column (Array Flexible 1.000W RMS)';
  }
  return 'Bose F1 Quad Array + Subwoofers + Limitador Cesva Homologado LRF';
}

/**
 * Normaliza el porcentaje de comisión de afiliado entre 10% y 15%.
 * Admite tanto formato decimal (0.12) como entero (12).
 */
export function normalizeAffiliateRate(rate?: number): number {
  if (rate === undefined || rate === null || !Number.isFinite(rate)) {
    return COMISION_AFILIADO_MIN_PCT;
  }
  let normalized = rate;
  if (normalized > 1) {
    normalized = normalized / 100;
  }
  return Math.min(COMISION_AFILIADO_MAX_PCT, Math.max(COMISION_AFILIADO_MIN_PCT, normalized));
}

// ── MOTOR DE REPARTO DETERMINISTA DE MAYOR RESTO (SPLIT 80/10/10) ────────────

/**
 * Reparto exacto de céntimos enteros bajo el Split Soberano 80/10/10.
 * Utiliza el método de Hamilton / Hare-Niemeyer con desempate canónico:
 * 1. Artista (orden 0)
 * 2. EAR OS (orden 1)
 * 3. VIMUME (orden 2)
 *
 * Invariante garantizado: artistaCents + earOsCents + vimumeCents === totalCents.
 */
export function distributeSplitSoberano(totalCents: number): {
  artistaCents: number;
  earOsCents: number;
  vimumeCents: number;
} {
  if (totalCents <= 0) {
    return { artistaCents: 0, earOsCents: 0, vimumeCents: 0 };
  }

  const exactArtista = totalCents * 80;
  const exactEarOs = totalCents * 10;
  const exactVimume = totalCents * 10;

  const floorArtista = Math.floor(exactArtista / 100);
  const floorEarOs = Math.floor(exactEarOs / 100);
  const floorVimume = Math.floor(exactVimume / 100);

  let assigned = floorArtista + floorEarOs + floorVimume;
  let pending = totalCents - assigned;

  const remainders = [
    { key: 'artista', rest: exactArtista % 100, order: 0 },
    { key: 'earOs', rest: exactEarOs % 100, order: 1 },
    { key: 'vimume', rest: exactVimume % 100, order: 2 },
  ];

  // Ordenar por mayor resto desc, y ante empate por orden canónico asc
  remainders.sort((a, b) => b.rest - a.rest || a.order - b.order);

  const result = {
    artistaCents: floorArtista,
    earOsCents: floorEarOs,
    vimumeCents: floorVimume,
  };

  for (let i = 0; i < remainders.length && pending > 0; i++) {
    const item = remainders[i];
    if (!item) break;
    if (item.key === 'artista') result.artistaCents += 1;
    else if (item.key === 'earOs') result.earOsCents += 1;
    else if (item.key === 'vimume') result.vimumeCents += 1;
    pending -= 1;
  }

  return result;
}

// ── FUNCIÓN PRINCIPAL DE CÁLCULO ─────────────────────────────────────────────

/**
 * Calcula de forma reactiva y determinista la cotización integral del evento en una finca:
 *  - Coste de Menú = guestCount * menuPricePerPaxCents
 *  - Coste de Complementos = Σ (isPerPax ? price * guestCount : price)
 *  - Logística km = max(0, distanceKm - 50) * 150 céntimos
 *  - Suplemento hotel = 12.000 céntimos si distanceKm > 200 o fin >= 03:00 AM
 *  - Subtotal neto = Menú + Complementos + Logística km + Hotel
 *  - IVA = 21% sobre subtotal neto
 *  - Total con IVA = Subtotal neto + IVA
 *  - Split Soberano = 80/10/10 sobre subtotal neto (Hare-Niemeyer)
 *  - Comisión de Afiliado = 10% a 15% sobre margen EAR OS (detraído de earOsCents)
 *  - Rider Acústico = guestCount * 12 W/pax, límite < 75 dB SPL
 *  - Depósito deducible = 10.000 céntimos (100,00 €)
 */
export function calculateFincaEventPricing(input: FincaMenuPricingInput): FincaMenuPricingResult {
  // 1. Validación estricta de parámetros
  const guests = Math.floor(input.guestCount);
  if (!Number.isFinite(input.guestCount) || guests <= 0) {
    throw new FincaPricingEngineError(
      'INVALID_GUEST_COUNT',
      `Número de comensales inválido: ${input.guestCount}. Debe ser un entero positivo.`,
    );
  }

  const distance = Math.max(0, Number.isFinite(input.distanceKm) ? Math.round(input.distanceKm) : 0);

  // 2. Localización y cálculo del Menú 2026
  const menu = getFincaMenuById(input.menuId);
  if (!menu) {
    throw new FincaPricingEngineError(
      'MENU_NOT_FOUND',
      `El menú con identificador "${input.menuId}" no existe en el catálogo canónico 2026.`,
    );
  }
  const menuTotalCents = guests * menu.pricePerPaxCents;

  // 3. Cálculo de Complementos y Extras Seleccionados
  const extrasBreakdown: FincaExtraBreakdownItem[] = [];
  let extrasTotalCents = 0;

  const uniqueExtraIds = Array.isArray(input.selectedExtraIds)
    ? [...new Set(input.selectedExtraIds)]
    : [];

  for (const extraId of uniqueExtraIds) {
    const extra = getFincaExtraById(extraId);
    if (extra) {
      const itemCents = extra.isPerPax ? extra.priceCents * guests : extra.priceCents;
      extrasTotalCents += itemCents;
      extrasBreakdown.push({
        id: extra.id,
        name: extra.name,
        unitPriceCents: extra.priceCents,
        isPerPax: extra.isPerPax,
        totalItemCents: itemCents,
      });
    }
  }

  // 4. Cálculo de Logística S-Class (km y hotel)
  const billableKm = Math.max(0, distance - LOGISTICA_KM_EXEMPT);
  const logisticsKmCents = billableKm * LOGISTICA_KM_RATE_CENTS;

  const hotelRequired = isHotelRequired(distance, input.eventEndTime);
  const logisticsHotelCents = hotelRequired ? LOGISTICA_HOTEL_CENTS : 0;

  // 5. Agregación de Subtotal Neto e IVA 21%
  const subtotalCents = menuTotalCents + extrasTotalCents + logisticsKmCents + logisticsHotelCents;
  const ivaCents = Math.round(subtotalCents * VAT_RATE);
  const totalWithIvaCents = subtotalCents + ivaCents;

  // 6. Split Soberano 80/10/10 (Determinista)
  const split = distributeSplitSoberano(subtotalCents);

  // 7. Comisión de Afiliado para la Finca (10% a 15% sobre margen EAR OS)
  const commissionRate = normalizeAffiliateRate(input.affiliateCommissionPct);
  // Se detrae EXCLUSIVAMENTE del margen de infraestructura EAR OS (split.earOsCents)
  const affiliateCommissionCents = Math.round(split.earOsCents * commissionRate);
  const earOsNetAfterCommissionCents = split.earOsCents - affiliateCommissionCents;

  // 8. Rider Acústico y Sistema de Sonido Recomendado
  const recommendedWatts = guests * WATTS_PER_PAX;
  const maxDbSpl = LIMITE_SPL_DB;
  const isCompliant = maxDbSpl <= 75;
  const systemRecommended = resolveAcousticSystem(recommendedWatts);

  // 9. Depósito de Bloqueo Deducible
  const depositDeductibleCents = DEPOSITO_PRICE_LOCK_CENTS;
  const pendingBalanceWithIvaCents = Math.max(0, totalWithIvaCents - depositDeductibleCents);

  return {
    menuTotalCents,
    extrasTotalCents,
    logisticsKmCents,
    logisticsHotelCents,
    subtotalCents,
    ivaCents,
    totalWithIvaCents,
    split,
    affiliateCommissionCents,
    acousticRider: {
      recommendedWatts,
      maxDbSpl,
      isCompliant,
      isCompliantWithHealthStandard: isCompliant,
      systemRecommended,
    },
    depositDeductibleCents,
    metadata: {
      menuName: menu.name,
      menuPricePerPaxCents: menu.pricePerPaxCents,
      guestCount: guests,
      billableKm,
      hotelRequired,
      earOsNetAfterCommissionCents,
      pendingBalanceWithIvaCents,
      extrasBreakdown,
    },
  };
}
