'use server';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — SERVER ACTION: ENCARGO DE LOGÍSTICA DE FINCAS EN 1-CLIC
 * ════════════════════════════════════════════════════════════════════════════
 * Ubicación: `src/app/actions/fincaLogisticsActions.ts`
 * Referencia SSOT: `PROJECT.md` · `ORIGINAL_REQUEST.md` (R2, R3, R5) · `AGENTS.md`
 *
 * Funcionalidad:
 *  1. Valida los datos del evento, finca y contacto responsable.
 *  2. Ejecuta el cálculo financiero determinista en céntimos enteros
 *     mediante `calculateFincaEventPricing` (menú, extras, logística km,
 *     suplemento hotel, split soberano 80/10/10, comisión afiliado 10-15%).
 *  3. Despacha evento asíncrono no bloqueante a n8n (`/webhook/finca-partnership`)
 *     con eventType `LOGISTICS_1CLICK_ORDER` mediante `fireAndForgetN8n`.
 *  4. Retorna el resumen consolidado de la orden con depósito deducible de 100 €,
 *     rider acústico validado (< 75 dB SPL, 12 W/pax) y SLA de liquidación.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  calculateFincaEventPricing,
  type FincaMenuPricingInput,
  type FincaMenuPricingResult,
  FincaPricingEngineError,
  centsToEur,
} from '@/lib/fincas/fincaMenuPricingEngine';

import {
  getFincaMenuById,
} from '@/lib/fincas/fincaMenus2026Catalog';

import {
  SCLASS_12_FINCAS_HOMOLOGADAS,
  type FincaHomologada,
} from '@/lib/constants/fincas-catalog';

import {
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

// ── CONTRATOS DE TIPOS ───────────────────────────────────────────────────────

export interface FincaLogisticsOrderInput {
  fincaId: string;
  fincaName?: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  municipio?: string;
  provincia?: string;
  distanceKm?: number;
  distanceHubKm?: number;
  fincaBaseAddress?: string;
  menuId: string;
  guestCount: number;
  selectedExtraIds?: string[];
  eventDate: string; // YYYY-MM-DD
  eventEndTime?: string; // e.g. "04:00"
  affiliateCommissionPct?: number; // 0.10 to 0.15
  notes?: string;
}

export interface FincaLogisticsPricingBreakdown {
  menuTotalCents: number;
  extrasTotalCents: number;
  logisticsKmCents: number;
  logisticsHotelCents: number;
  subtotalCents: number;
  ivaCents: number;
  totalWithIvaCents: number;
  depositDeductibleCents: number;
  pendingBalanceWithIvaCents: number;
  split: {
    artistaCents: number;
    earOsCents: number;
    vimumeCents: number;
  };
  affiliateCommission: {
    ratePct: number;
    commissionCents: number;
    earOsNetCents: number;
    liquidationDaysSla: number;
  };
  acousticRider: {
    recommendedWatts: number;
    maxDbSpl: number;
    isCompliant: boolean;
    systemRecommended: string;
    standard: string;
  };
}

export interface FincaLogisticsEventSummary {
  fincaId: string;
  fincaName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  municipio: string;
  provincia: string;
  eventDate: string;
  guestCount: number;
  menuId: string;
  menuName: string;
  distanceKm: number;
  hotelRequired: boolean;
}

export interface FincaLogisticsNextSteps {
  depositAmountEur: number;
  depositInstructions: string;
  coordinationPhone: string;
  slaHours: number;
}

export interface FincaLogisticsOrderResult {
  success: boolean;
  orderId?: string;
  status: 'CONFIRMED' | 'REJECTED' | 'VALIDATION_ERROR';
  message: string;
  pricing?: FincaLogisticsPricingBreakdown;
  eventSummary?: FincaLogisticsEventSummary;
  nextSteps?: FincaLogisticsNextSteps;
  n8nDispatched: boolean;
  timestamp: string;
  errors?: string[];
}

// ── HELPERS INTERNOS DE VALIDACIÓN ───────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidDateFormat(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !Number.isNaN(d.getTime());
}

function generateOrderId(fincaId: string): string {
  const cleanId = fincaId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
  const time = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${cleanId}-${time}-${random}`;
}

function findCatalogFinca(id: string): FincaHomologada | undefined {
  return SCLASS_12_FINCAS_HOMOLOGADAS.find(
    (f) => f.id === id || f.slug === id
  );
}

// ── SERVER ACTION PRINCIPAL ──────────────────────────────────────────────────

export async function dispatchFincaLogisticsOrderAction(
  payload: FincaLogisticsOrderInput
): Promise<FincaLogisticsOrderResult> {
  const timestamp = new Date().toISOString();
  const errors: string[] = [];

  // 1. Sanitización y resolución de catálogo
  const rawFincaId = (payload.fincaId || '').trim();
  if (!rawFincaId) {
    errors.push('El identificador de la finca es obligatorio.');
  }

  const catalogFinca = findCatalogFinca(rawFincaId);

  const fincaName = (payload.fincaName || catalogFinca?.name || rawFincaId).trim();
  const contactName = (payload.contactName || '').trim();
  const contactEmail = (payload.contactEmail || '').trim();
  const contactPhone = (payload.contactPhone || '').trim();
  const municipio = (payload.municipio || catalogFinca?.location || 'No especificado').trim();
  const provincia = (payload.provincia || catalogFinca?.provincia || 'España').trim();

  const distanceKm = typeof payload.distanceKm === 'number' && Number.isFinite(payload.distanceKm)
    ? Math.max(0, payload.distanceKm)
    : typeof payload.distanceHubKm === 'number' && Number.isFinite(payload.distanceHubKm)
    ? Math.max(0, payload.distanceHubKm)
    : catalogFinca?.distanciaHubMentridaKm ?? 0;

  const affiliateRate = typeof payload.affiliateCommissionPct === 'number' && Number.isFinite(payload.affiliateCommissionPct)
    ? payload.affiliateCommissionPct
    : catalogFinca?.comisionAfiliacionPct ?? 0.10;

  // 2. Validación de campos obligatorios
  if (!contactName || contactName.length < 2) {
    errors.push('El nombre de contacto debe tener al menos 2 caracteres.');
  }

  if (!contactEmail || !isValidEmail(contactEmail)) {
    errors.push('El correo electrónico de contacto no es válido.');
  }

  const cleanPhone = contactPhone.replace(/[\s\-\(\)\.]/g, '');
  if (!contactPhone || cleanPhone.length < 9) {
    errors.push('El teléfono de contacto debe tener al menos 9 dígitos.');
  }

  const rawDate = (payload.eventDate || '').trim();
  if (!rawDate || !isValidDateFormat(rawDate)) {
    errors.push('La fecha del evento debe tener formato válido YYYY-MM-DD.');
  }

  const guests = Math.floor(payload.guestCount);
  if (!Number.isFinite(payload.guestCount) || guests <= 0) {
    errors.push('El número de comensales debe ser un entero positivo mayor a cero.');
  }

  const rawMenuId = (payload.menuId || '').trim();
  const menu = getFincaMenuById(rawMenuId);
  if (!rawMenuId || !menu) {
    errors.push(`El menú seleccionado "${rawMenuId}" no existe en el catálogo canónico 2026.`);
  }

  if (errors.length > 0) {
    return {
      success: false,
      status: 'VALIDATION_ERROR',
      message: 'Se encontraron errores de validación en la solicitud de logística.',
      errors,
      n8nDispatched: false,
      timestamp,
    };
  }

  // 3. Ejecución del motor financiero
  let pricingResult: FincaMenuPricingResult;
  try {
    const pricingInput: FincaMenuPricingInput = {
      menuId: rawMenuId,
      guestCount: guests,
      selectedExtraIds: Array.isArray(payload.selectedExtraIds) ? payload.selectedExtraIds : [],
      distanceKm,
      fincaBaseAddress: payload.fincaBaseAddress,
      eventEndTime: payload.eventEndTime,
      affiliateCommissionPct: affiliateRate,
    };

    pricingResult = calculateFincaEventPricing(pricingInput);
  } catch (err: unknown) {
    const errorMsg = err instanceof FincaPricingEngineError
      ? err.message
      : err instanceof Error
      ? err.message
      : 'Error de cálculo en el motor financiero';

    return {
      success: false,
      status: 'REJECTED',
      message: errorMsg,
      errors: [errorMsg],
      n8nDispatched: false,
      timestamp,
    };
  }

  // 4. Identificador único de orden
  const orderId = generateOrderId(rawFincaId);

  // 5. Preparación del payload para n8n webhook (PROJECT.md)
  const n8nPayload = {
    eventType: 'LOGISTICS_1CLICK_ORDER' as const,
    orderId,
    fincaId: rawFincaId,
    fincaName,
    contactName,
    contactEmail,
    contactPhone,
    municipio,
    provincia,
    distanceHubKm: distanceKm,
    menuId: rawMenuId,
    menuName: pricingResult.metadata.menuName,
    guestCount: guests,
    eventDate: rawDate,
    eventEndTime: payload.eventEndTime || 'STANDARD',
    selectedExtraIds: payload.selectedExtraIds || [],
    selectedExtrasCount: (payload.selectedExtraIds || []).length,
    estimatedMenuTotalEur: centsToEur(pricingResult.menuTotalCents),
    estimatedExtrasTotalEur: centsToEur(pricingResult.extrasTotalCents),
    logisticsKmEur: centsToEur(pricingResult.logisticsKmCents),
    logisticsHotelEur: centsToEur(pricingResult.logisticsHotelCents),
    subtotalNetEur: centsToEur(pricingResult.subtotalCents),
    ivaEur: centsToEur(pricingResult.ivaCents),
    totalWithIvaEur: centsToEur(pricingResult.totalWithIvaCents),
    depositDeductibleEur: centsToEur(pricingResult.depositDeductibleCents),
    affiliateCommissionEstimatedEur: centsToEur(pricingResult.affiliateCommissionCents),
    affiliateCommissionPct: affiliateRate,
    split: {
      artistaEur: centsToEur(pricingResult.split.artistaCents),
      earOsEur: centsToEur(pricingResult.split.earOsCents),
      vimumeEur: centsToEur(pricingResult.split.vimumeCents),
    },
    acousticRider: {
      recommendedWatts: pricingResult.acousticRider.recommendedWatts,
      maxDbSpl: pricingResult.acousticRider.maxDbSpl,
      systemRecommended: pricingResult.acousticRider.systemRecommended,
      isCompliant: pricingResult.acousticRider.isCompliant,
    },
    notes: payload.notes || '',
    timestamp,
  };

  // 6. Despacho Asíncrono No Bloqueante a n8n
  try {
    fireAndForgetN8n('finca-partnership', n8nPayload);
  } catch (n8nErr: unknown) {
    console.error('[fincaLogisticsActions] Error encolando fireAndForgetN8n:', n8nErr);
  }

  // 7. Retorno estructurado al cliente
  return {
    success: true,
    orderId,
    status: 'CONFIRMED',
    message: `Encargo logístico registrado con éxito para "${fincaName}". Coordinación técnica en marcha.`,
    pricing: {
      menuTotalCents: pricingResult.menuTotalCents,
      extrasTotalCents: pricingResult.extrasTotalCents,
      logisticsKmCents: pricingResult.logisticsKmCents,
      logisticsHotelCents: pricingResult.logisticsHotelCents,
      subtotalCents: pricingResult.subtotalCents,
      ivaCents: pricingResult.ivaCents,
      totalWithIvaCents: pricingResult.totalWithIvaCents,
      depositDeductibleCents: pricingResult.depositDeductibleCents,
      pendingBalanceWithIvaCents: pricingResult.metadata.pendingBalanceWithIvaCents,
      split: {
        artistaCents: pricingResult.split.artistaCents,
        earOsCents: pricingResult.split.earOsCents,
        vimumeCents: pricingResult.split.vimumeCents,
      },
      affiliateCommission: {
        ratePct: Math.round(affiliateRate > 1 ? affiliateRate : affiliateRate * 100),
        commissionCents: pricingResult.affiliateCommissionCents,
        earOsNetCents: pricingResult.metadata.earOsNetAfterCommissionCents,
        liquidationDaysSla: 7,
      },
      acousticRider: {
        recommendedWatts: pricingResult.acousticRider.recommendedWatts,
        maxDbSpl: pricingResult.acousticRider.maxDbSpl,
        isCompliant: pricingResult.acousticRider.isCompliant,
        systemRecommended: pricingResult.acousticRider.systemRecommended,
        standard: 'Ley 37/2003 (< 75 dB SPL, 12 W/pax RMS)',
      },
    },
    eventSummary: {
      fincaId: rawFincaId,
      fincaName,
      contactName,
      contactEmail,
      contactPhone,
      municipio,
      provincia,
      eventDate: rawDate,
      guestCount: guests,
      menuId: rawMenuId,
      menuName: pricingResult.metadata.menuName,
      distanceKm,
      hotelRequired: pricingResult.metadata.hotelRequired,
    },
    nextSteps: {
      depositAmountEur: DEPOSITO_STRIPE_EUR,
      depositInstructions: 'El bloqueo de fecha y visita técnica requiere un depósito deducible de 100,00 € (100% descontable de la liquidación final).',
      coordinationPhone: CENTRALITA_EAR_OS,
      slaHours: 24,
    },
    n8nDispatched: true,
    timestamp,
  };
}
