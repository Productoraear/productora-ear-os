/**
 * MOTOR DE MÉTRICAS EJECUTIVAS PARA FINCAS (SSOT BLOQUE 5 + REGLAS S-CLASS)
 *
 * Reglas de negocio inmutables usadas por este motor:
 * - Tarifa Base Solista (Edwin Agudelo): 350,00 €.
 * - Logística: 1,50 €/km desde Méntrida a partir del km 50. +120 € (Hotel) si
 *   hora fin >= 3:00 AM o distancia > 200 km.
 * - Split Soberano: 80% Artista / 10% EAR OS / 10% VIMUME.
 * - Cierre: Depósito de 100,00 € en Stripe (Price-Lock SHA-256 válido 24h-72h).
 * - Rider Acústico: 12 W/pax (Bose F1 812 / S1 Pro, Shure Beta 87A).
 * - Límite B2G (Art. 118 LCSP): < 15.000,00 € (ajuste preventivo 14.250,00 €) y < 75 dB SPL.
 */

import {
  FincaHomologada,
  SCLASS_12_FINCAS_HOMOLOGADAS,
} from '@/lib/constants/fincas-catalog';
import {
  LIMITE_B2G_LCSP_EUR,
  SAFE_LCSP_CEILING_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
} from '@/lib/constants/ear-os-ssot';
import { eurToCents, centsToEur } from '@/lib/budget/budget-allocator-engine';

export const PACTO_100_FUNDADORES_SSOT = {
  MAX_FUNDADORES_CUPO: 100,
  CUOTA_MENSUAL_MINIMA_MATCH_EUR: 50,
  CUOTA_MENSUAL_DEFECTO_PORTAL_EUR: 250,
  INFLACION_ANUAL_PORTALES_TRADICIONALES_PCT: 0.06,
  INFLACION_ANUAL_EAR_OS_FUNDADOR_PCT: 0.00,
  TASA_FUGA_LEADS_PORTAL_TRADICIONAL_PCT: 0.18,
  VALOR_LEAD_PERDIDO_ESTIMADO_EUR: 3800,
  COMISION_AFILIACION_BASE_PCT: 0.10,
  COMISION_AFILIACION_MAX_PCT: 0.15,
  DIAS_LIQUIDACION_SLA: 7,
} as const;

export const SSOT = {
  TARIFA_BASE_SOLISTA_EUR: 350,
  LOGISTICA_EUR_KM: 1.5,
  UMBRAL_KM_GRATIS: 50,
  HOTEL_EUR: 120,
  HORA_FIN_HOTEL: 3,
  DISTANCIA_HOTEL_KM: 200,
  SPLIT_ARTISTA_PCT: 0.8,
  SPLIT_EAR_PCT: 0.1,
  SPLIT_VIMUME_PCT: 0.1,
  DEPOSITO_STRIPE_EUR: 100,
  RIDER_W_PAX: 12,
  LIMITE_B2G_LCSV_EUR: LIMITE_B2G_LCSP_EUR,
  AJUSTE_PREVENTIVO_B2G_EUR: SAFE_LCSP_CEILING_EUR,
  LIMITE_SPL_DB: 75,
  PRECIO_SONIDO_POR_PAX_B2C: 6.5,
  COMISION_MEDIA_BODAS_NET_PCT: 0.18,
  TICKET_MEDIO_BODA_EUR: 18000,
} as const;

export interface AcousticShieldMetrics {
  fincaId: string;
  fincaName: string;
  exteriorDBA: number;
  cumple75Db: boolean;
  margenSeguridadDb: number;
  estado: 'BLINDADA_GOLD_MASTER' | 'REQUIERE_ATENUACION';
  estrategia: string;
}

export interface FincaProfitabilityMetrics {
  fincaId: string;
  fincaName: string;
  capacidadMaxPax: number;
  eventosAnioProyectados: number;
  ticketMedioPorEvento: number;
  potenciaSonidoW: number;
  logisticaCostePorEvento: number;
  margenFincaAnual: number;
  comisionAfiliacionAnual: number;
  ahorroMultasAnualEstimado: number;
}

export interface BodasNetVsEarOsRow {
  concepto: string;
  bodasNet: number | string;
  earOs: number | string;
  ventaja: 'EAR' | 'EMPATE';
  ahorroAnualEstimado?: number;
}

export interface ExecutiveDashboard {
  totalFincasHomologadas: number;
  totalCapacidadPax: number;
  mercadoPotencialEur: number;
  comisionMedianaPct: number;
  ahorroMedioMultasEur: number;
  blindajeAcustico: AcousticShieldMetrics[];
  rentabilidad: FincaProfitabilityMetrics[];
  comparativa: BodasNetVsEarOsRow[];
}

const EUROS = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatEuros(value: number): string {
  return EUROS.format(Math.round(value));
}

export function costeLogisticaMentrida(distanciaKm: number, horaFin = 23): number {
  let total = 0;
  if (distanciaKm > SSOT.UMBRAL_KM_GRATIS) {
    total += (distanciaKm - SSOT.UMBRAL_KM_GRATIS) * SSOT.LOGISTICA_EUR_KM;
  }
  if ((horaFin >= SSOT.HORA_FIN_HOTEL && horaFin < 12) || distanciaKm > SSOT.DISTANCIA_HOTEL_KM) {
    total += SSOT.HOTEL_EUR;
  }
  return Math.round(total);
}

export function calcularRiderAcustico(pax: number): { wattsTotales: number; sistema: string } {
  const wattsTotales = pax * SSOT.RIDER_W_PAX;
  const sistema =
    wattsTotales <= 600
      ? 'Bose S1 Pro + Shure Beta 87A'
      : wattsTotales <= 2400
        ? 'Bose F1 812 (doble) + Behringer XR18'
        : 'Line Array Bose F1 812 + Subgraves + Axient RF';
  return { wattsTotales, sistema };
}

export function calcularAcousticShield(finca: FincaHomologada): AcousticShieldMetrics {
  const { exteriorDBA } = finca.limiteAcustico;
  const cumple75Db = exteriorDBA <= SSOT.LIMITE_SPL_DB;
  const margenSeguridadDb = Math.max(0, SSOT.LIMITE_SPL_DB - exteriorDBA);

  return {
    fincaId: finca.id,
    fincaName: finca.name,
    exteriorDBA,
    cumple75Db,
    margenSeguridadDb,
    estado: cumple75Db ? 'BLINDADA_GOLD_MASTER' : 'REQUIERE_ATENUACION',
    estrategia: cumple75Db
      ? 'Matriz Bose F1 de dispersión controlada + DSP autorregulado. Cero multas y cero quejas vecinales.'
      : 'Atenuación vegetal, DSP con recorte de graves y limitador telemático homologado para bajar a <75 dB.',
  };
}

export function calcularProfitability(finca: FincaHomologada, eventosAnio = 28): FincaProfitabilityMetrics {
  const ticketMedioPorEvento = Math.min(
    SSOT.TICKET_MEDIO_BODA_EUR,
    finca.capacidadMaxPax * 52,
  );
  const logisticaCostePorEvento = costeLogisticaMentrida(finca.distanciaHubMentridaKm);
  const ingresoTotalesAnual = ticketMedioPorEvento * eventosAnio;

  // Margen atribuible a la finca: ingreso total menos coste logístico de la
  // producción técnica de EAR y menos la tarifa base del solista por evento.
  const margenFincaAnual = Math.round(
    ingresoTotalesAnual -
    eventosAnio * (SSOT.TARIFA_BASE_SOLISTA_EUR + logisticaCostePorEvento),
  );

  const comisionAfiliacionAnual = Math.round(ingresoTotalesAnual * finca.comisionAfiliacionPct);

  // Multas municipales típicas por superar 75 dB: ~600 € por evento denunciado.
  const ahorroMultasAnualEstimado = finca.limiteAcustico.exteriorDBA > SSOT.LIMITE_SPL_DB
    ? Math.round(eventosAnio * 0.12 * 600)
    : 0;

  return {
    fincaId: finca.id,
    fincaName: finca.name,
    capacidadMaxPax: finca.capacidadMaxPax,
    eventosAnioProyectados: eventosAnio,
    ticketMedioPorEvento,
    potenciaSonidoW: finca.capacidadMaxPax * SSOT.RIDER_W_PAX,
    logisticaCostePorEvento,
    margenFincaAnual,
    comisionAfiliacionAnual,
    ahorroMultasAnualEstimado,
  };
}

export function buildComparativaBodasNetVsEarOs(): BodasNetVsEarOsRow[] {
  const depositoCierreEarOs = 100;

  return [
    {
      concepto: 'Cuota anual de alta en directorio',
      bodasNet: 'Cuota del portal',
      earOs: '0 € de cuota fija',
      ventaja: 'EAR',
    },
    {
      concepto: '0% Fuga publicitaria a competidores',
      bodasNet: 'Alta fuga: banners y recomendados rivales en tu ficha',
      earOs: '0% Fuga: escaparate 100% blindado y exclusivo',
      ventaja: 'EAR',
      ahorroAnualEstimado: PACTO_100_FUNDADORES_SSOT.VALOR_LEAD_PERDIDO_ESTIMADO_EUR,
    },
    {
      concepto: 'Comisión por lead / contacto',
      bodasNet: 'Tarifa del portal',
      earOs: '10% Split Soberano',
      ventaja: 'EAR',
    },
    {
      concepto: 'Depósito de cierre inmutable',
      bodasNet: 'Sin depósito (lead frío)',
      earOs: `${depositoCierreEarOs} € Stripe Price-Lock`,
      ventaja: 'EAR',
    },
    {
      concepto: 'Calidad del lead recibido',
      bodasNet: 'Sin filtro previo',
      earOs: 'Filtrado por la Conserjería',
      ventaja: 'EAR',
    },
    {
      concepto: 'Blindaje acústico <75 dB SPL',
      bodasNet: 'No incluido',
      earOs: 'Incluido y certificado',
      ventaja: 'EAR',
    },
    {
      concepto: 'Liquidación de comisiones',
      bodasNet: '30-60 días',
      earOs: 'Máx. 7 días hábiles',
      ventaja: 'EAR',
    },
  ];
}

export function buildExecutiveDashboard(): ExecutiveDashboard {
  const blindajeAcustico = SCLASS_12_FINCAS_HOMOLOGADAS.map(calcularAcousticShield);
  const rentabilidad = SCLASS_12_FINCAS_HOMOLOGADAS.map((f) => calcularProfitability(f));

  const totalCapacidadPax = SCLASS_12_FINCAS_HOMOLOGADAS.reduce(
    (acc, f) => acc + f.capacidadMaxPax,
    0,
  );

  const mercadoPotencialEur = SCLASS_12_FINCAS_HOMOLOGADAS.reduce(
    (acc, f) => acc + calcularProfitability(f).ticketMedioPorEvento * 28,
    0,
  );

  const comisionMedianaPct =
    SCLASS_12_FINCAS_HOMOLOGADAS.sort((a, b) => a.comisionAfiliacionPct - b.comisionAfiliacionPct)[
      Math.floor(SCLASS_12_FINCAS_HOMOLOGADAS.length / 2)
    ].comisionAfiliacionPct;

  const ahorroMedioMultasEur = Math.round(
    rentabilidad.reduce((acc, r) => acc + r.ahorroMultasAnualEstimado, 0) /
    SCLASS_12_FINCAS_HOMOLOGADAS.length,
  );

  return {
    totalFincasHomologadas: SCLASS_12_FINCAS_HOMOLOGADAS.length,
    totalCapacidadPax,
    mercadoPotencialEur,
    comisionMedianaPct,
    ahorroMedioMultasEur,
    blindajeAcustico,
    rentabilidad,
    comparativa: buildComparativaBodasNetVsEarOs(),
  };
}

// ── PACTO 100 FUNDADORES: CONTRATOS Y MOTORES DE SIMULACIÓN ──────────────────

export interface FounderFeeMatchOptions {
  currentFoundersEnrolled?: number;
  projectedAnnualWeddings?: number;
  averageWeddingTicketEur?: number;
  horizonYears?: number;
}

export interface YearProjectionBreakdown {
  year: number;
  competitorFeeEur: number;
  earOsFounderFeeEur: number;
  inflationSavingsEur: number;
  fugaRetentionSavingsEur: number;
  acousticFinesSavingsEur: number;
  affiliateCommissionIncomeEur: number;
  netAnnualBenefitEur: number;
  cumulativeBenefitEur: number;
}

export interface FounderFeeMatchResult {
  eligibleForFounderPact: boolean;
  founderSlotNumber: number | null;
  remainingSlots: number;
  previousMonthlyFeeEur: number;
  previousAnnualFeeEur: number;
  matchedMonthlyFeeEur: number;
  matchedAnnualFeeEur: number;
  matchedMonthlyFeeCents: number;
  matchedAnnualFeeCents: number;
  lifetimePriceLock: boolean;
  guarantees: {
    zeroAdLeakage: boolean;
    exclusiveShowcase: boolean;
    acousticCertificationDbSpl: number;
    affiliateCommissionRangePct: readonly [number, number];
    settlementSlaDays: number;
    depositDeductibleEur: number;
  };
  breakdownByYear: YearProjectionBreakdown[];
  summaryLifetimeSavingsEur: {
    horizonYears: number;
    totalFeeInflationSavingsEur: number;
    totalFugaRetentionSavingsEur: number;
    totalAcousticFinesSavingsEur: number;
    totalAffiliateEarningsEur: number;
    totalNetLifetimeAdvantageEur: number;
  };
}

export interface LifetimeSavingsInput {
  previousFeeMonthlyEur: number;
  horizonYears?: number;
  annualWeddings?: number;
  averageWeddingTicketEur?: number;
  hasAcousticRisk?: boolean;
  logisticsAdoptionPct?: number;
}

export interface LifetimeSavingsResult {
  horizonYears: number;
  breakdownByYear: YearProjectionBreakdown[];
  totalCompetitorSpendEur: number;
  totalEarOsSpendEur: number;
  totalFeeSavingsEur: number;
  totalFugaRetentionSavingsEur: number;
  totalAcousticSavingsEur: number;
  totalAffiliateEarningsEur: number;
  netLifetimeAdvantageEur: number;
  roiMultiplier: number;
}

export function calculateLifetimePortalSavings(
  input: LifetimeSavingsInput,
): LifetimeSavingsResult {
  const horizonYears = Math.max(1, Math.min(10, Math.round(input.horizonYears ?? 5)));
  const baseMonthlyEur = Math.max(0, input.previousFeeMonthlyEur);
  const baseAnnualEur = baseMonthlyEur * 12;
  const annualWeddings = Math.max(1, Math.round(input.annualWeddings ?? 20));
  const avgTicketEur = Math.max(500, Math.round(input.averageWeddingTicketEur ?? 3800));
  const hasAcousticRisk = Boolean(input.hasAcousticRisk);
  const logisticsAdoptionPct = Math.max(0, Math.min(1, input.logisticsAdoptionPct ?? 0.5));

  const inflationRate = PACTO_100_FUNDADORES_SSOT.INFLACION_ANUAL_PORTALES_TRADICIONALES_PCT;
  const breakdownByYear: YearProjectionBreakdown[] = [];

  let totalCompetitorSpendEur = 0;
  let totalEarOsSpendEur = 0;
  let totalFeeSavingsEur = 0;
  let totalFugaRetentionSavingsEur = 0;
  let totalAcousticSavingsEur = 0;
  let totalAffiliateEarningsEur = 0;
  let runningCumulative = 0;

  for (let year = 1; year <= horizonYears; year++) {
    const competitorFeeEur = Math.round(baseAnnualEur * Math.pow(1 + inflationRate, year - 1) * 100) / 100;
    const earOsFounderFeeEur = baseAnnualEur;
    const inflationSavingsEur = Math.round((competitorFeeEur - earOsFounderFeeEur) * 100) / 100;
    const fugaRetentionSavingsEur = PACTO_100_FUNDADORES_SSOT.VALOR_LEAD_PERDIDO_ESTIMADO_EUR;
    const acousticFinesSavingsEur = hasAcousticRisk ? Math.round(annualWeddings * 0.12 * 600) : 0;
    const affiliateEvents = Math.round(annualWeddings * logisticsAdoptionPct);
    const affiliateCommissionIncomeEur = Math.round(
      affiliateEvents * avgTicketEur * PACTO_100_FUNDADORES_SSOT.COMISION_AFILIACION_BASE_PCT,
    );

    const netAnnualBenefitEur = Math.round(
      (inflationSavingsEur + fugaRetentionSavingsEur + acousticFinesSavingsEur + affiliateCommissionIncomeEur) * 100,
    ) / 100;

    runningCumulative = Math.round((runningCumulative + netAnnualBenefitEur) * 100) / 100;

    breakdownByYear.push({
      year,
      competitorFeeEur,
      earOsFounderFeeEur,
      inflationSavingsEur,
      fugaRetentionSavingsEur,
      acousticFinesSavingsEur,
      affiliateCommissionIncomeEur,
      netAnnualBenefitEur,
      cumulativeBenefitEur: runningCumulative,
    });

    totalCompetitorSpendEur += competitorFeeEur;
    totalEarOsSpendEur += earOsFounderFeeEur;
    totalFeeSavingsEur += inflationSavingsEur;
    totalFugaRetentionSavingsEur += fugaRetentionSavingsEur;
    totalAcousticSavingsEur += acousticFinesSavingsEur;
    totalAffiliateEarningsEur += affiliateCommissionIncomeEur;
  }

  return {
    horizonYears,
    breakdownByYear,
    totalCompetitorSpendEur: Math.round(totalCompetitorSpendEur * 100) / 100,
    totalEarOsSpendEur: Math.round(totalEarOsSpendEur * 100) / 100,
    totalFeeSavingsEur: Math.round(totalFeeSavingsEur * 100) / 100,
    totalFugaRetentionSavingsEur: Math.round(totalFugaRetentionSavingsEur * 100) / 100,
    totalAcousticSavingsEur: Math.round(totalAcousticSavingsEur * 100) / 100,
    totalAffiliateEarningsEur: Math.round(totalAffiliateEarningsEur * 100) / 100,
    netLifetimeAdvantageEur: runningCumulative,
    roiMultiplier: totalEarOsSpendEur > 0 ? Math.round((runningCumulative / totalEarOsSpendEur) * 100) / 100 : 0,
  };
}

export function calculateFounderFeeMatch(
  previousFeeMonthlyEur: number,
  options?: FounderFeeMatchOptions,
): FounderFeeMatchResult {
  const currentFounders = Math.max(0, Math.min(100, Math.round(options?.currentFoundersEnrolled ?? 42)));
  const eligibleForFounderPact = currentFounders < PACTO_100_FUNDADORES_SSOT.MAX_FUNDADORES_CUPO;
  const founderSlotNumber = eligibleForFounderPact ? currentFounders + 1 : null;
  const remainingSlots = Math.max(0, PACTO_100_FUNDADORES_SSOT.MAX_FUNDADORES_CUPO - currentFounders);

  const normalizedMonthlyEur =
    !Number.isFinite(previousFeeMonthlyEur) || previousFeeMonthlyEur <= 0
      ? PACTO_100_FUNDADORES_SSOT.CUOTA_MENSUAL_DEFECTO_PORTAL_EUR
      : Math.max(
          PACTO_100_FUNDADORES_SSOT.CUOTA_MENSUAL_MINIMA_MATCH_EUR,
          Math.round(previousFeeMonthlyEur * 100) / 100,
        );

  const previousMonthlyFeeEur = normalizedMonthlyEur;
  const previousAnnualFeeEur = Math.round(previousMonthlyFeeEur * 12 * 100) / 100;

  const matchedMonthlyFeeEur = previousMonthlyFeeEur;
  const matchedAnnualFeeEur = previousAnnualFeeEur;
  const matchedMonthlyFeeCents = eurToCents(matchedMonthlyFeeEur);
  const matchedAnnualFeeCents = eurToCents(matchedAnnualFeeEur);

  const horizonYears = options?.horizonYears ?? 5;
  const lifetimeSavings = calculateLifetimePortalSavings({
    previousFeeMonthlyEur: matchedMonthlyFeeEur,
    horizonYears,
    annualWeddings: options?.projectedAnnualWeddings ?? 20,
    averageWeddingTicketEur: options?.averageWeddingTicketEur ?? 3800,
    hasAcousticRisk: false,
    logisticsAdoptionPct: 0.5,
  });

  return {
    eligibleForFounderPact,
    founderSlotNumber,
    remainingSlots,
    previousMonthlyFeeEur,
    previousAnnualFeeEur,
    matchedMonthlyFeeEur,
    matchedAnnualFeeEur,
    matchedMonthlyFeeCents,
    matchedAnnualFeeCents,
    lifetimePriceLock: eligibleForFounderPact,
    guarantees: {
      zeroAdLeakage: true,
      exclusiveShowcase: true,
      acousticCertificationDbSpl: SSOT.LIMITE_SPL_DB,
      affiliateCommissionRangePct: [
        PACTO_100_FUNDADORES_SSOT.COMISION_AFILIACION_BASE_PCT,
        PACTO_100_FUNDADORES_SSOT.COMISION_AFILIACION_MAX_PCT,
      ] as const,
      settlementSlaDays: PACTO_100_FUNDADORES_SSOT.DIAS_LIQUIDACION_SLA,
      depositDeductibleEur: SSOT.DEPOSITO_STRIPE_EUR,
    },
    breakdownByYear: lifetimeSavings.breakdownByYear,
    summaryLifetimeSavingsEur: {
      horizonYears,
      totalFeeInflationSavingsEur: lifetimeSavings.totalFeeSavingsEur,
      totalFugaRetentionSavingsEur: lifetimeSavings.totalFugaRetentionSavingsEur,
      totalAcousticFinesSavingsEur: lifetimeSavings.totalAcousticSavingsEur,
      totalAffiliateEarningsEur: lifetimeSavings.totalAffiliateEarningsEur,
      totalNetLifetimeAdvantageEur: lifetimeSavings.netLifetimeAdvantageEur,
    },
  };
}