/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — B2B HOMOLOGACIÓN & ONBOARDING PACTO DE 100 FUNDADORES
 * ════════════════════════════════════════════════════════════════════════════
 * Ubicación: `src/app/api/b2b/homologacion/route.ts`
 * Referencia: `PROJECT.md` · `ORIGINAL_REQUEST.md` (R1, R3) · `AGENTS.md`
 *
 * Misión:
 *  1. Validación técnica algorítmica de acometida, RC y convoy (SLA < 15 min).
 *  2. Activación del Pacto de 100 Fundadores con igualación de cuota (Price-Match).
 *  3. Despacho non-blocking a n8n `/webhook/finca-partnership` vía `fireAndForgetN8n`.
 *  4. Retrocompatibilidad total con `FincasB2BPortal.tsx`.
 *  5. Tipado estricto sin tipos `any`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { validateFincaTechnicalAudit } from '@/lib/b2b-billing-engine';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { calculateFounderFeeMatch } from '@/lib/fincas/fincaMetricsEngine';
import type { FincaHomologada } from '@/lib/constants/fincas-catalog';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Contrato de entrada para la homologación B2B y solicitud de Pacto de Fundadores.
 * Tipado estricto sin tipos `any`.
 */
export interface B2BHomologacionInput {
  name: string;
  location: string;
  provincia?: string;
  cif?: string;
  potenciaKw?: number | string;
  tomaElectrica?: string;
  polizaRCEuros?: number | string;
  aseguradora?: string;
  numeroPoliza?: string;
  limiteInteriorDBA?: number | string;
  limiteExteriorDBA?: number | string;
  accesoConvoy14Plazas?: boolean;
  director?: string;
  telefono?: string;
  email?: string;
  // Campos del Pacto de 100 Fundadores (Price-Match)
  portalAnterior?: string;
  cuotaAnteriorEurMes?: number | string;
  isFounderPactApplied?: boolean;
  // Metadatos y geografía opcionales
  fincaId?: string;
  distanceHubKm?: number | string;
  estimatedMenuTotalEur?: number | string;
  affiliateCommissionEstimatedEur?: number | string;
}

/**
 * Contrato de payload para el webhook n8n /webhook/finca-partnership (SSOT PROJECT.md)
 */
export interface FincaPartnershipWebhookPayload {
  eventType: 'VISIT_LOCK_REQUEST' | 'ONBOARDING_FOUNDER_PRICE_MATCH' | 'LOGISTICS_1CLICK_ORDER';
  fincaId: string;
  fincaName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  municipio: string;
  provincia: string;
  distanceHubKm: number;
  portalAnterior?: string;
  cuotaAnteriorEurMes?: number;
  estimatedMenuTotalEur?: number;
  affiliateCommissionEstimatedEur?: number;
  timestamp: string;
  // Metadatos extendidos para telemetría
  auditScore?: number;
  auditApproved?: boolean;
  expedicionId?: string;
  isFounderPactApplied?: boolean;
  matchedMonthlyFeeEur?: number;
  founderSlotNumber?: number | null;
  [key: string]: unknown;
}

/**
 * Estructura de la garantía y desglose de Fundador devuelta al cliente
 */
export interface FounderPactResponseInfo {
  applied: boolean;
  eligible: boolean;
  founderSlotNumber: number | null;
  remainingSlots: number;
  portalAnterior: string;
  cuotaAnteriorEurMes: number;
  cuotaIgualadaEurMes: number;
  cuotaIgualadaEurAnio: number;
  cuotaIgualadaCentsMes: number;
  lifetimePriceLock: boolean;
}

/**
 * Respuesta tipada para el cliente de onboarding B2B
 */
export interface B2BHomologacionResponse {
  success: boolean;
  expedicionId?: string;
  timestamp: string;
  slaOnboardingMinutos: number;
  resultadoAuditoria: {
    aprobado: boolean;
    score: number;
    infracciones: string[];
    estado: 'PRE_HOMOLOGADA_VALIDA' | 'REQUIERE_SUBSANACION_TECNICA';
  };
  mensaje: string;
  pactoFundadores?: FounderPactResponseInfo | null;
  webhookDispatched?: boolean;
  error?: string;
}

function isObjectRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

export async function POST(
  req: NextRequest
): Promise<NextResponse<B2BHomologacionResponse>> {
  try {
    const rawData: unknown = await req.json();

    if (!isObjectRecord(rawData)) {
      return NextResponse.json(
        {
          success: false,
          timestamp: new Date().toISOString(),
          slaOnboardingMinutos: 15,
          resultadoAuditoria: {
            aprobado: false,
            score: 0,
            infracciones: ['Cuerpo de la petición inválido o ausente'],
            estado: 'REQUIERE_SUBSANACION_TECNICA'
          },
          mensaje: 'Cuerpo de la petición inválido o ausente',
          error: 'Cuerpo de la petición inválido o ausente'
        },
        { status: 400 }
      );
    }

    const data = (rawData as unknown) as B2BHomologacionInput;

    const name = typeof data.name === 'string' ? data.name.trim() : '';
    const location = typeof data.location === 'string' ? data.location.trim() : '';
    const provincia = typeof data.provincia === 'string' && data.provincia.trim() ? data.provincia.trim() : 'Madrid';
    const director = typeof data.director === 'string' ? data.director.trim() : '';
    const telefono = typeof data.telefono === 'string' ? data.telefono.trim() : '';
    const email = typeof data.email === 'string' ? data.email.trim() : '';
    const tomaElectricaRaw = typeof data.tomaElectrica === 'string' ? data.tomaElectrica : 'CETAC 32A 3P+N+T';
    const aseguradora = typeof data.aseguradora === 'string' ? data.aseguradora : 'Pendiente';
    const numeroPoliza = typeof data.numeroPoliza === 'string' ? data.numeroPoliza : 'Pendiente';
    const potenciaKw = Number(data.potenciaKw) || 0;
    const polizaRCEuros = Number(data.polizaRCEuros) || 0;
    const accesoConvoy14Plazas = Boolean(data.accesoConvoy14Plazas);

    // Campos de Fundador
    const portalAnterior = typeof data.portalAnterior === 'string' && data.portalAnterior.trim().length > 0
      ? data.portalAnterior.trim()
      : undefined;

    const cuotaAnteriorEurMes = data.cuotaAnteriorEurMes !== undefined && !Number.isNaN(Number(data.cuotaAnteriorEurMes))
      ? Number(data.cuotaAnteriorEurMes)
      : undefined;

    const hasFounderInputs = Boolean(portalAnterior || (cuotaAnteriorEurMes !== undefined && cuotaAnteriorEurMes > 0));
    const isFounderPactApplied = typeof data.isFounderPactApplied === 'boolean'
      ? data.isFounderPactApplied
      : hasFounderInputs;

    const distanceHubKm = typeof data.distanceHubKm === 'number'
      ? data.distanceHubKm
      : (Number(data.distanceHubKm) || 0);

    const estimatedMenuTotalEur = data.estimatedMenuTotalEur !== undefined && !Number.isNaN(Number(data.estimatedMenuTotalEur))
      ? Number(data.estimatedMenuTotalEur)
      : undefined;

    const affiliateCommissionEstimatedEur = data.affiliateCommissionEstimatedEur !== undefined && !Number.isNaN(Number(data.affiliateCommissionEstimatedEur))
      ? Number(data.affiliateCommissionEstimatedEur)
      : undefined;

    // 1. Auditoría técnica algorítmica SSOT (src/lib/b2b-billing-engine.ts)
    const auditResult = validateFincaTechnicalAudit({
      name,
      location,
      provincia,
      potenciaKw,
      tomaElectrica: tomaElectricaRaw as FincaHomologada['tomaElectrica'],
      polizaRC: {
        coberturaEuros: polizaRCEuros,
        aseguradora,
        numeroPoliza,
        vigenteHasta: '2027-12-31'
      },
      accesoConvoy14Plazas
    });

    const expedicionId = `HOM-${Date.now().toString(36).toUpperCase()}`;
    const timestamp = new Date().toISOString();

    // 2. Cálculo opcional del Pacto de Fundadores (src/lib/fincas/fincaMetricsEngine.ts)
    let pactoFundadoresInfo: FounderPactResponseInfo | null = null;
    let matchedMonthlyFeeEur: number | undefined = undefined;
    let founderSlotNumber: number | null = null;

    if (isFounderPactApplied) {
      const feeMatchResult = calculateFounderFeeMatch(cuotaAnteriorEurMes ?? 250);
      matchedMonthlyFeeEur = feeMatchResult.matchedMonthlyFeeEur;
      founderSlotNumber = feeMatchResult.founderSlotNumber;

      pactoFundadoresInfo = {
        applied: true,
        eligible: feeMatchResult.eligibleForFounderPact,
        founderSlotNumber: feeMatchResult.founderSlotNumber,
        remainingSlots: feeMatchResult.remainingSlots,
        portalAnterior: portalAnterior ?? 'Portal no especificado',
        cuotaAnteriorEurMes: cuotaAnteriorEurMes ?? feeMatchResult.previousMonthlyFeeEur,
        cuotaIgualadaEurMes: feeMatchResult.matchedMonthlyFeeEur,
        cuotaIgualadaEurAnio: feeMatchResult.matchedAnnualFeeEur,
        cuotaIgualadaCentsMes: feeMatchResult.matchedMonthlyFeeCents,
        lifetimePriceLock: feeMatchResult.lifetimePriceLock
      };
    }

    // 3. Despacho Asíncrono No-Bloqueante a n8n
    // fireAndForgetN8n lanza el fetch en background sin await, garantizando latencia 0 en la respuesta HTTP
    const webhookPayload: FincaPartnershipWebhookPayload = {
      eventType: 'ONBOARDING_FOUNDER_PRICE_MATCH',
      fincaId: typeof data.fincaId === 'string' && data.fincaId.trim() ? data.fincaId.trim() : expedicionId,
      fincaName: name || 'Finca Sin Nombre',
      contactName: director || 'Responsable de Finca',
      contactEmail: email || '',
      contactPhone: telefono || '',
      municipio: location || 'No especificado',
      provincia,
      distanceHubKm,
      portalAnterior,
      cuotaAnteriorEurMes,
      estimatedMenuTotalEur,
      affiliateCommissionEstimatedEur,
      timestamp,
      auditScore: auditResult.score,
      auditApproved: auditResult.aprobado,
      expedicionId,
      isFounderPactApplied,
      matchedMonthlyFeeEur,
      founderSlotNumber
    };

    try {
      fireAndForgetN8n('finca-partnership', webhookPayload as unknown as Record<string, unknown>);
    } catch (n8nErr: unknown) {
      // Blindaje de resiliencia: la falla del webhook jamás tumba la respuesta de la homologación
      console.error('[b2b/homologacion] Error encolando fireAndForgetN8n:', n8nErr);
    }

    // 4. Respuesta Inmediata al Cliente (<50ms)
    return NextResponse.json({
      success: true,
      expedicionId,
      timestamp,
      slaOnboardingMinutos: 15,
      resultadoAuditoria: {
        aprobado: auditResult.aprobado,
        score: auditResult.score,
        infracciones: auditResult.infracciones,
        estado: auditResult.aprobado ? 'PRE_HOMOLOGADA_VALIDA' : 'REQUIERE_SUBSANACION_TECNICA'
      },
      pactoFundadores: pactoFundadoresInfo,
      webhookDispatched: true,
      mensaje: auditResult.aprobado
        ? (isFounderPactApplied
          ? `Homologación técnica completada (< 15 min). Plaza de Fundador reservada con cuota igualada a ${matchedMonthlyFeeEur ?? 250} €/mes vitalicios.`
          : 'Homologación técnica completada con éxito (< 15 min). La finca cumple con la normativa de seguridad de Productora EAR.')
        : 'Se han detectado desviaciones técnicas que deben subsanarse antes de la inclusión en la red oficial.'
    });
  } catch (error: unknown) {
    console.error('B2B_HOMOLOGACION_ERROR:', error);
    return NextResponse.json(
      {
        success: false,
        timestamp: new Date().toISOString(),
        slaOnboardingMinutos: 15,
        resultadoAuditoria: {
          aprobado: false,
          score: 0,
          infracciones: ['Error interno al procesar la homologación express'],
          estado: 'REQUIERE_SUBSANACION_TECNICA'
        },
        mensaje: 'Error al procesar la homologación express',
        error: 'Error al procesar la homologación express'
      },
      { status: 500 }
    );
  }
}
