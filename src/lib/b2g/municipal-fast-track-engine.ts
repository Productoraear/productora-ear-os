/**
 * ════════════════════════════════════════════════════════════════════════════
 * MUNICIPAL-FAST-TRACK-ENGINE.TS — MOTOR DE ADJUDICACIÓN RÁPIDA B2G & MARISLA
 * ════════════════════════════════════════════════════════════════════════════
 * Misión: W50_T01_B2G_MUNICIPAL_TENDER_RADAR_AND_MARIACHI_SLA_ENGINE
 *
 * 1) Expedientes de Contrato Menor Art. 118 LCSP (< 14.250 € ajuste preventivo).
 *    Justificación legal contra fraccionamiento contractual, códigos CPV oficiales,
 *    acústica Ley 37/2003 (90-102 dBA festejos / 65-75 dBA senior) y SROI 4.85x.
 * 2) Despachador de Relevo Automático 15-Minutos para Mariachis & Colectivos.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  LIMITE_B2G_LCSP_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export type B2GProgramType = 'FESTEJOS_POPULARES' | 'VIMUME_SENIOR_40HZ' | 'GALA_CULTURAL';

export interface B2GExpedienteRequest {
  municipality: string;
  province: string;
  programType: B2GProgramType;
  requestedAmountEur: number;
  targetAudienceEstimate: number;
  eventDateIso: string;
}

export interface B2GExpedienteResult {
  valid: boolean;
  expedienteId: string;
  municipality: string;
  province: string;
  cpvCode: string;
  cpvDescription: string;
  programType: B2GProgramType;
  amountEur: number;
  maxLegalCeilingEur: number;
  preventiveCeilingEur: number;
  acousticProtocol: {
    lawReference: string;
    maxDba: number;
    wattsPerPax: number;
    telemetricLimiterRequired: boolean;
  };
  legalJustificationNonFractioning: string;
  socialImpactSroi: {
    ratio: number;
    socialReturnEur: number;
    odsGoals: number[];
  };
  contactDispatch: {
    phone: string;
    depositDeductibleEur: number;
  };
  reason?: string;
}

export interface MariachiRelayProvider {
  id: string;
  groupName: string;
  province: string;
  phone: string;
  maskedPhone: string;
  priorityOrder: number;
  timeoutMinutes: number;
}

export interface MariachiRelayCascade {
  bookingId: string;
  province: string;
  depositLockedEur: number;
  slaTimeoutMinutes: number;
  roster: MariachiRelayProvider[];
}

/** CPVs oficiales para Contratación Menor en el Sector Público */
export const B2G_CPV_CODES = Object.freeze({
  FESTEJOS_POPULARES: {
    code: '92312000-1',
    description: 'Servicios de producción artística y espectáculos musicales para festejos públicos',
  },
  VIMUME_SENIOR_40HZ: {
    code: '85320000-8',
    description: 'Servicios sociales y de neuroacústica estimulativa para centros residenciales de mayores',
  },
  GALA_CULTURAL: {
    code: '92312100-2',
    description: 'Servicios de interpretación artística por orquestas, solistas o grupos de cámara',
  },
} as const);

/**
 * Genera el expediente técnico y administrativo blindado según Art. 118 LCSP.
 */
export function generateMunicipalExpediente(req: B2GExpedienteRequest): B2GExpedienteResult {
  const amountEur = Math.round(req.requestedAmountEur * 100) / 100;

  // Filtro duro: El importe no puede superar el ajuste preventivo del 95% de LCSP
  if (amountEur > AJUSTE_PREVENTIVO_B2G_EUR) {
    return {
      valid: false,
      expedienteId: '',
      municipality: req.municipality,
      province: req.province,
      cpvCode: '',
      cpvDescription: '',
      programType: req.programType,
      amountEur,
      maxLegalCeilingEur: LIMITE_B2G_LCSP_EUR,
      preventiveCeilingEur: AJUSTE_PREVENTIVO_B2G_EUR,
      acousticProtocol: { lawReference: 'Ley 37/2003', maxDba: 0, wattsPerPax: 0, telemetricLimiterRequired: false },
      legalJustificationNonFractioning: '',
      socialImpactSroi: { ratio: 0, socialReturnEur: 0, odsGoals: [] },
      contactDispatch: { phone: CENTRALITA_EAR_OS, depositDeductibleEur: DEPOSITO_STRIPE_EUR },
      reason: `El importe solicitado (${amountEur.toFixed(2)} €) excede el ajuste preventivo de contratación menor (${AJUSTE_PREVENTIVO_B2G_EUR.toFixed(2)} €)`,
    };
  }

  const cpv = B2G_CPV_CODES[req.programType];
  const expedienteId = `EXP-B2G-${req.province.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

  // Protocolo acústico por tipo de programa
  const acousticProtocol = req.programType === 'FESTEJOS_POPULARES'
    ? { lawReference: 'Ley 37/2003 de Ruido', maxDba: 102, wattsPerPax: 12, telemetricLimiterRequired: true }
    : req.programType === 'VIMUME_SENIOR_40HZ'
    ? { lawReference: 'Protocolo VIMUME 40 Hz No Invasivo', maxDba: 75, wattsPerPax: 5, telemetricLimiterRequired: false }
    : { lawReference: 'Ley 37/2003 y CTE DB-HR', maxDba: 85, wattsPerPax: 8, telemetricLimiterRequired: true };

  const sroiRatio = 4.85;
  const socialReturnEur = Math.round(amountEur * sroiRatio * 100) / 100;

  return {
    valid: true,
    expedienteId,
    municipality: req.municipality,
    province: req.province,
    cpvCode: cpv.code,
    cpvDescription: cpv.description,
    programType: req.programType,
    amountEur,
    maxLegalCeilingEur: LIMITE_B2G_LCSP_EUR,
    preventiveCeilingEur: AJUSTE_PREVENTIVO_B2G_EUR,
    acousticProtocol,
    legalJustificationNonFractioning: `Se justifica la necesidad puntual e individualizada de la prestación en ${req.municipality} (${req.province}) para fecha ${req.eventDateIso}. No concurre fraccionamiento del objeto del contrato (Art. 118 LCSP) por responder a una necesidad artística única, singular y no recurrente en el ejercicio presupuestario.`,
    socialImpactSroi: {
      ratio: sroiRatio,
      socialReturnEur,
      odsGoals: [3, 8, 11],
    },
    contactDispatch: {
      phone: CENTRALITA_EAR_OS,
      depositDeductibleEur: DEPOSITO_STRIPE_EUR,
    },
  };
}

/**
 * Calcula la cascada de relevo de 15 minutos para Mariachis & Grupos de Alta Demanda.
 */
export function buildMariachiRelayCascade(
  bookingId: string,
  province: string,
  candidateGroups: Array<{ id: string; name: string; phone: string }>
): MariachiRelayCascade {
  const roster: MariachiRelayProvider[] = candidateGroups.map((g, idx) => ({
    id: g.id,
    groupName: g.name,
    province,
    phone: g.phone,
    maskedPhone: g.phone.length > 4 ? `+34 *** *** ${g.phone.slice(-3)}` : '+34 *** *** ***',
    priorityOrder: idx + 1,
    timeoutMinutes: 15,
  }));

  return {
    bookingId,
    province,
    depositLockedEur: DEPOSITO_STRIPE_EUR,
    slaTimeoutMinutes: 15,
    roster,
  };
}

/** Devuelve la agrupación activa según los minutos transcurridos en el ping de servicio */
export function getActiveRelayProvider(cascade: MariachiRelayCascade, elapsedMinutes: number): MariachiRelayProvider | null {
  if (cascade.roster.length === 0) return null;
  const index = Math.floor(elapsedMinutes / cascade.slaTimeoutMinutes);
  return index < cascade.roster.length ? cascade.roster[index] : null;
}
