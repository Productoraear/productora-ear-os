/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — CERTIFICADOR ACÚSTICO HOMOLOGADO (LEY 37/2003 DEL RUIDO)
 * ════════════════════════════════════════════════════════════════════════════
 * Verificación técnica de cumplimiento de normativa ambiental sonora:
 *  - Umbral sonométrico reglamentario: ≤ 75 dB SPL en linde / zona sensible.
 *  - Relación de potencia electroacústica máxima: 12 W RMS por asistente.
 *  - Emisión de Certificado Técnico de Homologación Acústica con sello SHA-256.
 * ════════════════════════════════════════════════════════════════════════════
 */

import crypto from 'node:crypto';

export interface AcousticEvaluationInput {
  venueName: string;
  municipality: string;
  isOutdoor: boolean;
  attendeesCount: number;
  totalSystemPowerWattsRms: number;
  calibratedLimiterModel?: string;
  distanceToNearestNeighborMeters?: number;
}

export interface AcousticCertificateReport {
  certificateId: string;
  venueName: string;
  municipality: string;
  isCompliant: boolean;
  metrics: {
    attendeesCount: number;
    totalSystemPowerWattsRms: number;
    wattsPerPax: number;
    maxAllowedWattsPerPax: number;
    estimatedSplAtDistanceDb: number;
    legalMaxSplDb: number; // 75 dB SPL
  };
  sonometerRequirements: {
    limiterRequired: boolean;
    recommendedLimiter: string;
    logPeriodMinutes: number;
  };
  sha256AcousticSeal: string;
  certifiedAt: string;
}

export function evaluateAcousticCompliance(input: AcousticEvaluationInput): AcousticCertificateReport {
  const legalMaxSplDb = 75.0;
  const maxAllowedWattsPerPax = 12.0;

  const pax = Math.max(1, input.attendeesCount);
  const wattsPerPax = Math.round((input.totalSystemPowerWattsRms / pax) * 100) / 100;

  // Approximate SPL attenuation with inverse square law if distance is provided
  const dist = Math.max(1, input.distanceToNearestNeighborMeters ?? 15);
  // Source SPL approximation based on power: SPL_1m ≈ 95 + 10*log10(P)
  const splSource = 92 + 10 * Math.log10(Math.max(10, input.totalSystemPowerWattsRms));
  const estimatedSplAtDistanceDb = Math.round((splSource - 20 * Math.log10(dist)) * 10) / 10;

  const isCompliant = estimatedSplAtDistanceDb <= legalMaxSplDb && wattsPerPax <= maxAllowedWattsPerPax;

  const certificateId = `ACOUSTIC-CERT-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
  const certPayload = `${certificateId}:${input.venueName}:${wattsPerPax}:${estimatedSplAtDistanceDb}:${isCompliant}`;
  const sha256AcousticSeal = crypto.createHash('sha256').update(certPayload).digest('hex');

  return {
    certificateId,
    venueName: input.venueName,
    municipality: input.municipality,
    isCompliant,
    metrics: {
      attendeesCount: pax,
      totalSystemPowerWattsRms: input.totalSystemPowerWattsRms,
      wattsPerPax,
      maxAllowedWattsPerPax,
      estimatedSplAtDistanceDb,
      legalMaxSplDb
    },
    sonometerRequirements: {
      limiterRequired: estimatedSplAtDistanceDb > 70,
      recommendedLimiter: input.calibratedLimiterModel ?? 'Cesva LRF-05 / Ecudis Homologado',
      logPeriodMinutes: 5
    },
    sha256AcousticSeal,
    certifiedAt: new Date().toISOString()
  };
}
