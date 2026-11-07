/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST PANEL 360 — E2E TEST CONTRACTS, ORACLES & EXECUTION HARNESS
 * ════════════════════════════════════════════════════════════════════════════
 * Fuente canónica de oráculos matemáticos, contratos de interfaz y arnés de
 * pruebas para las 14 características del Panel 360 y Ficha de Artista.
 *
 * Basado en:
 *  - ORIGINAL_REQUEST.md (§ R1, R2, R3, R4)
 *  - PROJECT.md (§ Interface Contracts, § Feature Inventory)
 *  - TEST_INFRA.md (§ Test Philosophy, § Coverage Thresholds)
 *  - AGENTS.md (§ 4 Reglas de Negocio Inmutables, § 5 Next.js, § 6 OLED)
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  SAFE_LCSP_CEILING_EUR,
  LIMITE_B2G_LCSP_EUR,
  SPLIT_SOBERANO,
  EAR_OS_SSOT,
} from '../../../src/lib/constants/ear-os-ssot';

import {
  calculateArtistQuote as calculateArtistQuoteImpl,
  settleArtistSplit as settleArtistSplitImpl,
  validateIsrc as validateIsrcImpl,
  generateCanonicalIsrc as generateCanonicalIsrcImpl,
  EDWIN_AGUDELO_PROFILE_360,
  MIN_CACHE_BY_FORMAT,
  ISRC_REGEX,
  type ArtistFormat,
  type QuoteCalculationRequest,
  type QuoteCalculationResult,
  type SettlementSplitResult,
  type IsrcValidationResult,
} from '../../../src/lib/artists/artist-360-contract';

/* ========================================================================== */
/* 1. TIPOS Y CONTRATOS OFICIALES DE INTERFAZ                                 */
/* ========================================================================== */

export type {
  ArtistFormat,
  QuoteCalculationRequest,
  QuoteCalculationResult,
  SettlementSplitResult,
  IsrcValidationResult,
};

export interface AcousticRiderAssessment {
  recommendedWatts: number;
  maxSplDb: number;
  compliant: boolean;
  notes?: string;
}

export interface B2gCeilingAssessment {
  compliant: boolean;
  ceilingEur: number;
  deltaEur: number;
  alert: boolean;
}

export interface ArtistQuoteInput {
  format: ArtistFormat;
  distanceKm: number;
  endHour24?: number;
  requestedBaseCacheEur?: number;
  audiencePax?: number;
}

export interface ArtistQuoteOutput {
  baseCacheEur: number;
  chargeableKm: number;
  exemptKm: number;
  kmRateEur: number;
  logisticsTotalEur: number;
  hotelSupplementEur: number;
  totalEventEur: number;
  depositDeductibleEur: number;
  pendingFinalSettlementEur: number;
  isEdwinAgudeloSovereignFloor: boolean;
  acousticRider: AcousticRiderAssessment;
  b2gCeilingAlert: boolean;
}

export interface ArtistSettlementOutput {
  totalCents: number;
  artistCents: number;
  earOsCents: number;
  vimumeCents: number;
  depositDeductedCents: number;
  artistNetPendingCents: number;
  totalGrossEur: number;
  artistEur: number;
  earOsEur: number;
  vimumeEur: number;
  depositPaidEur: number;
  artistNetPendingEur: number;
}

export interface TrackMetadata {
  id: string;
  title: string;
  artist: string;
  format: ArtistFormat;
  durationSeconds: number;
  audioUrl: string;
  isrc: string;
  bpm?: number;
  genre?: string;
}

/* ========================================================================== */
/* 2. ORÁCULOS MATEMÁTICOS DE REFERENCIA                                      */
/* ========================================================================== */

/**
 * Oráculo de cotización para artista:
 * - Aplica suelo de formato (350€ Solista, 500€ Dúo, 650€ Mariachi, 1800€ Orquesta, 400€ DJ).
 * - Aplica 50 km de franquicia logística desde Hub Méntrida, 1,50 €/km facturables.
 * - Aplica 120,00 € hotel si fin >= 3:00 AM o distancia > 200 km.
 * - Descuenta 100,00 € de depósito de reserva Stripe Price-Lock.
 * - Evalúa rider acústico (12 W/pax, <= 75 dB SPL).
 * - Evalúa techo B2G Art. 118 LCSP (14.250,00 €).
 */
export function calculateArtistQuoteOracle(input: ArtistQuoteInput): ArtistQuoteOutput {
  const minBase = MIN_CACHE_BY_FORMAT[input.format];
  const requested = input.requestedBaseCacheEur ?? minBase;
  const baseCacheEur = Math.max(requested, minBase);

  const safeDistance = Math.max(0, input.distanceKm);
  const exemptKm = LOGISTICA_KM_EXENTOS;
  const chargeableKm = Math.max(0, safeDistance - exemptKm);
  const logisticsTotalEur = Math.round(chargeableKm * LOGISTICA_EUR_PER_KM * 100) / 100;

  const endHour = input.endHour24 ?? 0;
  const requiresHotel = endHour >= HORA_FIN_HOTEL || safeDistance > LOGISTICA_KM_HOTEL;
  const hotelSupplementEur = requiresHotel ? SUPLEMENTO_HOTEL_EUR : 0;

  const totalEventEur = Math.round((baseCacheEur + logisticsTotalEur + hotelSupplementEur) * 100) / 100;
  const depositDeductibleEur = DEPOSITO_STRIPE_EUR;
  const pendingFinalSettlementEur = Math.max(0, Math.round((totalEventEur - depositDeductibleEur) * 100) / 100);

  const pax = Math.max(1, input.audiencePax ?? 50);
  const recommendedWatts = pax * WATTS_PER_PAX;
  const acousticRider: AcousticRiderAssessment = {
    recommendedWatts,
    maxSplDb: LIMITE_SPL_DB,
    compliant: LIMITE_SPL_DB <= 75,
    notes: `${pax} pax × 12 W/pax = ${recommendedWatts} W RMS | Salud pública < 75 dB SPL`,
  };

  const b2gCeilingAlert = totalEventEur > SAFE_LCSP_CEILING_EUR;

  return {
    baseCacheEur,
    chargeableKm,
    exemptKm,
    kmRateEur: LOGISTICA_EUR_PER_KM,
    logisticsTotalEur,
    hotelSupplementEur,
    totalEventEur,
    depositDeductibleEur,
    pendingFinalSettlementEur,
    isEdwinAgudeloSovereignFloor: input.format === 'SOLISTA' && baseCacheEur === TARIFA_BASE_SOLISTA_EUR,
    acousticRider,
    b2gCeilingAlert,
  };
}

/**
 * Oráculo de liquidación Split Soberano 80/10/10 en céntimos enteros:
 * - 80% Artista Ejecutor
 * - 10% EAR OS Infraestructura
 * - 10% VIMUME Impacto Social (absorbe resto de redondeo)
 * Invariante: artistCents + earOsCents + vimumeCents === totalCents
 */
export function settleArtistSplitOracle(
  totalGrossEur: number,
  depositPaidEur: number = DEPOSITO_STRIPE_EUR
): ArtistSettlementOutput {
  const safeTotalGross = Math.max(0, totalGrossEur);
  const totalCents = Math.round(safeTotalGross * 100);
  const depositCents = Math.round(Math.max(0, depositPaidEur) * 100);

  const artistCents = Math.round(totalCents * SPLIT_SOBERANO.artista);
  const earOsCents = Math.round(totalCents * SPLIT_SOBERANO.earOs);
  const vimumeCents = totalCents - artistCents - earOsCents;

  const artistNetPendingCents = Math.max(0, artistCents - depositCents);

  return {
    totalCents,
    artistCents,
    earOsCents,
    vimumeCents,
    depositDeductedCents: depositCents,
    artistNetPendingCents,
    totalGrossEur: totalCents / 100,
    artistEur: artistCents / 100,
    earOsEur: earOsCents / 100,
    vimumeEur: vimumeCents / 100,
    depositPaidEur: depositCents / 100,
    artistNetPendingEur: artistNetPendingCents / 100,
  };
}

/**
 * Oráculo de validación ISRC bajo ISO 3901 y prefijo ES-EAR-YY-NNNNN.
 */
export function validateIsrcOracle(code: string): IsrcValidationResult {
  const trimmed = (code || '').trim().toUpperCase();
  if (!ISRC_REGEX.test(trimmed)) {
    return {
      valid: false,
      code: trimmed,
      country: '',
      registrant: '',
      year: '',
      designation: '',
      reason: 'El código debe cumplir el formato internacional ES-EAR-YY-NNNNN',
    };
  }

  const parts = trimmed.split('-');
  return {
    valid: true,
    code: trimmed,
    country: parts[0],
    registrant: parts[1],
    year: parts[2],
    designation: parts[3],
  };
}

/**
 * Oráculo de generación canónica de ISRC.
 */
export function generateCanonicalIsrcOracle(yearTwoDigits: number, sequenceNumber: number): string {
  const yy = String(yearTwoDigits).padStart(2, '0').slice(-2);
  const nnnnn = String(sequenceNumber).padStart(5, '0').slice(-5);
  return `ES-EAR-${yy}-${nnnnn}`;
}

/**
 * Oráculo de evaluación acústica Ley 37/2003.
 */
export function evaluateAcousticRiderOracle(pax: number, maxDbSpl: number = LIMITE_SPL_DB): AcousticRiderAssessment {
  const safePax = Math.max(1, pax);
  const recommendedWatts = safePax * WATTS_PER_PAX;
  const compliant = maxDbSpl <= LIMITE_SPL_DB;
  return {
    recommendedWatts,
    maxSplDb: maxDbSpl,
    compliant,
    notes: compliant
      ? `Aforo ${safePax} pax: ${recommendedWatts} W RMS (< 75 dB SPL)`
      : `ALERTA: Presión sonora ${maxDbSpl} dB excede límite de salud pública (75 dB SPL)`,
  };
}

/**
 * Oráculo de evaluación de techo B2G Art. 118 LCSP.
 */
export function evaluateB2gCeilingOracle(totalGrossEur: number): B2gCeilingAssessment {
  const ceilingEur = SAFE_LCSP_CEILING_EUR;
  const deltaEur = Math.round((totalGrossEur - ceilingEur) * 100) / 100;
  const alert = totalGrossEur > ceilingEur;
  return {
    compliant: !alert,
    ceilingEur,
    deltaEur,
    alert,
  };
}

/* ========================================================================== */
/* 3. UTILIDADES DEL REPRODUCTOR HI-FI Y AUDIO PROCEDURAL                     */
/* ========================================================================== */

/**
 * Formatea duración en segundos a cadena MM:SS.
 */
export function formatAudioDuration(seconds: number): string {
  if (seconds < 0 || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

/**
 * Genera un Data URI WAV procedural offline en memoria.
 * Permite simulación de audio 100% local sin requerir red ni assets externos.
 */
export function generateOfflineSyntheticWavDataUri(
  frequencyHz: number = 440,
  durationSec: number = 0.5,
  sampleRate: number = 8000
): string {
  const numSamples = Math.floor(durationSec * sampleRate);
  const dataByteLength = numSamples * 2; // 16-bit mono
  const buffer = new ArrayBuffer(44 + dataByteLength);
  const view = new DataView(buffer);

  // RIFF identifier
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + dataByteLength, true); // file size - 8
  view.setUint32(8, 0x57415645, false); // "WAVE"

  // fmt subchunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1 mono)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // data subchunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, dataByteLength, true);

  // Generar tono senoidal
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const sample = Math.sin(2 * Math.PI * frequencyHz * t) * 0.5; // -0.5 a 0.5
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  // Convertir a base64
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = typeof Buffer !== 'undefined'
    ? Buffer.from(buffer).toString('base64')
    : btoa(binary);

  return `data:audio/wav;base64,${base64}`;
}

export const CANONICAL_EDWIN_TRACKS: readonly TrackMetadata[] = Object.freeze([
  {
    id: 'track-01',
    title: 'El Rey (Gala Mariachi)',
    artist: 'Edwin Agudelo',
    format: 'MARIACHI',
    durationSeconds: 195,
    audioUrl: '/media/edwin/el-rey.mp3',
    isrc: 'ES-EAR-26-00001',
    bpm: 110,
    genre: 'Mariachi Sinfónico',
  },
  {
    id: 'track-02',
    title: 'Bésame Mucho (Acústico Íntimo)',
    artist: 'Edwin Agudelo',
    format: 'SOLISTA',
    durationSeconds: 210,
    audioUrl: '/media/edwin/besame-mucho.mp3',
    isrc: 'ES-EAR-26-00002',
    bpm: 85,
    genre: 'Bolero de Gala',
  },
  {
    id: 'track-03',
    title: 'Si Nos Dejan (Dúo Nupcial)',
    artist: 'Edwin Agudelo',
    format: 'DUO',
    durationSeconds: 180,
    audioUrl: '/media/edwin/si-nos-dejan.mp3',
    isrc: 'ES-EAR-26-00003',
    bpm: 95,
    genre: 'Ranchera Romántica',
  },
  {
    id: 'track-04',
    title: 'Noche de Fiesta (Orquesta)',
    artist: 'Edwin Agudelo & Orquesta',
    format: 'ORQUESTA',
    durationSeconds: 240,
    audioUrl: '/media/edwin/noche-de-fiesta.mp3',
    isrc: 'ES-EAR-26-00004',
    bpm: 128,
    genre: 'Espectáculo Festejos',
  },
  {
    id: 'track-05',
    title: 'Sovereign Lounge Sunset (DJ Set)',
    artist: 'Edwin Agudelo Live DJ',
    format: 'DJ',
    durationSeconds: 300,
    audioUrl: '/media/edwin/sunset-lounge.mp3',
    isrc: 'ES-EAR-26-00005',
    bpm: 122,
    genre: 'Deep Organic House',
  },
]);

/* ========================================================================== */
/* 4. ASSERTION RUNNER Y MÉTRICAS DE EJECUCIÓN                                */
/* ========================================================================== */

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`AssertionError: ${message}`);
  }
}

export function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`AssertionError [${message}]: Esperado ${String(expected)}, recibido ${String(actual)}`);
  }
}

export function assertCloseTo(actual: number, expected: number, epsilon: number = 0.001, message: string): void {
  if (Math.abs(actual - expected) > epsilon) {
    throw new Error(`AssertionError [${message}]: Valor ${actual} difiere de ${expected} por más de ${epsilon}`);
  }
}

export interface TestResult {
  tier: number;
  featureId?: number;
  testName: string;
  passed: boolean;
  status: 'PASS' | 'FAIL';
  durationMs: number;
  error?: string;
  details?: Record<string, unknown>;
}

export class TestExecutionTracker {
  private results: TestResult[] = [];
  private startTime = Date.now();

  record(res: TestResult): void {
    this.results.push(res);
  }

  getResults(): readonly TestResult[] {
    return this.results;
  }

  getTierResults(tier: number): TestResult[] {
    return this.results.filter((r) => r.tier === tier);
  }

  getFeatureResults(tier: number, featureId: number): TestResult[] {
    return this.results.filter((r) => r.tier === tier && r.featureId === featureId);
  }

  getPassCount(): number {
    return this.results.filter((r) => r.passed).length;
  }

  getFailCount(): number {
    return this.results.filter((r) => !r.passed).length;
  }

  getTotalCount(): number {
    return this.results.length;
  }

  getTotalDurationMs(): number {
    return Date.now() - this.startTime;
  }

  getSummary() {
    const total = this.getTotalCount();
    const pass = this.getPassCount();
    const fail = this.getFailCount();
    const durationMs = this.getTotalDurationMs();
    const passRate = total > 0 ? Math.round((pass / total) * 100) : 0;
    return {
      total,
      pass,
      fail,
      durationMs,
      passRate,
      tier1Count: this.getTierResults(1).length,
      tier2Count: this.getTierResults(2).length,
      tier3Count: this.getTierResults(3).length,
      tier4Count: this.getTierResults(4).length,
    };
  }

  printSummary(): void {
    const summary = this.getSummary();
    console.log('\n╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║               ARTIST 360 PANEL — E2E TEST SCORECARD                  ║');
    console.log('╚══════════════════════════════════════════════════════════════════════╝');
    console.log(`  Total Casos de Prueba : ${summary.total}`);
    console.log(`  Tier 1 (Feature Cov)   : ${summary.tier1Count} tests`);
    console.log(`  Tier 2 (Boundaries)    : ${summary.tier2Count} tests`);
    console.log(`  Tier 3 (Cross-Feature) : ${summary.tier3Count} tests`);
    console.log(`  Tier 4 (Scenarios)     : ${summary.tier4Count} escenarios`);
    console.log(`  Aprobados (PASS)       : ${summary.pass}`);
    console.log(`  Fallidos (FAIL)        : ${summary.fail}`);
    console.log(`  Tasa de Éxito          : ${summary.passRate}%`);
    console.log(`  Tiempo Total           : ${summary.durationMs} ms`);

    if (summary.fail > 0) {
      console.log('\n❌ Casos fallidos:');
      this.results
        .filter((r) => !r.passed)
        .forEach((r) => {
          console.log(`  [T${r.tier}] ${r.testName}: ${r.error}`);
        });
    }
  }
}
