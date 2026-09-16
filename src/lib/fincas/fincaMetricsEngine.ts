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
  LIMITE_B2G_LCSV_EUR: 15000,
  AJUSTE_PREVENTIVO_B2G_EUR: 14250,
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
  if (horaFin >= SSOT.HORA_FIN_HOTEL || distanciaKm > SSOT.DISTANCIA_HOTEL_KM) {
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
  const cuotaAnualBodasNet = 4200;
  const cuotaAnualEarOs = 0;
  const leadsCierreBodasNet = 8;
  const leadsCierreEarOs = 18;
  const depositoCierreEarOs = 100;

  return [
    {
      concepto: 'Cuota anual de alta en directorio',
      bodasNet: cuotaAnualBodasNet,
      earOs: cuotaAnualEarOs,
      ventaja: 'EAR',
      ahorroAnualEstimado: cuotaAnualBodasNet - cuotaAnualEarOs,
    },
    {
      concepto: 'Comisión por lead / contacto',
      bodasNet: '12-18% + tarifa fija',
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
      concepto: 'Cierres reales anuales estimados',
      bodasNet: leadsCierreBodasNet,
      earOs: leadsCierreEarOs,
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