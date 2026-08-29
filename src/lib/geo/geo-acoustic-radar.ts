/**
 * EAR OS V2 — MASTER GEO-ACOUSTIC RADAR & FLEET DISPATCHER (Reto 3)
 * ==================================================================
 * Motor de cálculo acústico y logístico S-Class para despacho de flota:
 * - Potencia acústica: 12 W/pax con mínimos por tipo de venue.
 * - Sistemas Bose homologados: S1 Pro / F1 Model 812 + Subwoofer Array.
 * - Rider Acústico: Shure Beta 87A / Axient RF / GLXD4.
 * - Logística S-Class desde Hub Central Méntrida (Toledo): 1,50 €/km desde km 50.
 * - Suplemento hotelero (+120 €) si distancia > 200 km o fin >= 03:00 AM.
 * - Límite VIMUME B2G: < 75 dB SPL (forzado a 74 dB en residencias de mayores).
 * - Blindaje Criptográfico: SHA-256 Verification Hash (64 chars hex).
 *
 * EXTENDE: sovereign-pricing + mariachi-dispatch-engine (PROHIBIDO reescribir)
 */

import { createHash } from 'crypto';
import { BASE_SOLISTA, DEPOSITO_STRIPE } from '../pricing/sovereign-pricing';
import { RECARGO_URGENCIA_24_7 } from '../mariachi/mariachi-dispatch-engine';

/* ------------------------------------------------------------------ */
/* Constantes S-Class — Logística y Acústica                           */
/* ------------------------------------------------------------------ */

export const HUB_MENTRIDA = 'Méntrida, Toledo (Hub Central EAR)';
const KM_EXENTO = 50;
const COSTE_KM_SCLASS = 1.50; // €/km a partir del km 50
const SUPLEMENTO_HOTELERO = RECARGO_URGENCIA_24_7; // 120 € (extiende mariachi-dispatch-engine)
const DISTANCIA_MAXIMA_SIN_HOTELES_KM = 200;
const HORA_LIMITE_NOCTURNA = '03:00';

/* Constantes Acústicas */
export const WATTS_PER_PAX = 12;
const MIN_WATTS_INTERIOR = 500;
const MIN_WATTS_EXTERIOR = 1000;
const SPL_VIMUME_MAX = 74; // < 75 dB SPL obligatorio (Art. VIMUME B2G)
const SPL_GENERAL_MAX = 92;

/* Rider de Microfonía S-Class */
export const MICROFONIA_STANDARD = 'Shure Beta 87A / Axient RF / GLXD4';

/* ------------------------------------------------------------------ */
/* Interfaces                                                          */
/* ------------------------------------------------------------------ */

export interface VenueAcousticInput {
  venueName: string;
  venueType: 'SALON_BODA' | 'FINCA_EXTERIOR' | 'IGLESIA' | 'RESIDENCIA_MAYORES' | 'PLAZA_PUBLICA';
  guestCount: number;
  destinationProvince: string;
  distanceKmFromMentrida: number;
  eventEndHour?: string;
  isVimumeContext?: boolean;
}

export interface GeoAcousticOutput {
  acousticRider: {
    totalWatts: number;
    wattsPerPax: number;
    recommendedSystem: string;
    microphones: string;
    maxDecibelsSPL: number;
    isVimumeCompliant: boolean;
  };
  logisticsBreakdown: {
    distanceKm: number;
    billableKm: number;
    kmCost: number;
    hotelSurcharge: number;
    requiresAccommodation: boolean;
    hubOrigin: string;
  };
  totalLogisticsAndAudioEuro: number;
  sha256VerificationHash: string;
}

/* ------------------------------------------------------------------ */
/* Motor de Cálculo Geo-Acoustic                                       */
/* ------------------------------------------------------------------ */

export function calculateGeoAcousticRadar(input: VenueAcousticInput): GeoAcousticOutput {
  /* --- Cálculo Acústico S-Class --- */
  const isExterior = input.venueType === 'FINCA_EXTERIOR' || input.venueType === 'PLAZA_PUBLICA';

  let totalWatts = input.guestCount * WATTS_PER_PAX;
  if (isExterior) {
    totalWatts = Math.max(totalWatts, MIN_WATTS_EXTERIOR);
  } else {
    totalWatts = Math.max(totalWatts, MIN_WATTS_INTERIOR);
  }

  const recommendedSystem =
    totalWatts <= 600
      ? 'Bose S1 Pro System'
      : 'Bose F1 Model 812 + Subwoofer Array';

  /* --- Límite de Decibelios (VIMUME B2G Compliance) --- */
  const isVimumeRestricted = input.isVimumeContext === true || input.venueType === 'RESIDENCIA_MAYORES';
  const maxDecibelsSPL = isVimumeRestricted ? SPL_VIMUME_MAX : SPL_GENERAL_MAX;
  const isVimumeCompliant = maxDecibelsSPL < 75;

  /* --- Logística S-Class desde Hub Central Méntrida --- */
  const distanceKm = input.distanceKmFromMentrida;
  const billableKm = Math.max(0, distanceKm - KM_EXENTO);
  const kmCost = Math.round(billableKm * COSTE_KM_SCLASS * 100) / 100;

  const requiresAccommodation =
    distanceKm > DISTANCIA_MAXIMA_SIN_HOTELES_KM ||
    (input.eventEndHour !== undefined && input.eventEndHour >= HORA_LIMITE_NOCTURNA);

  const hotelSurcharge = requiresAccommodation ? SUPLEMENTO_HOTELERO : 0;

  /* --- Total Logística + Audio --- */
  const totalLogisticsAndAudioEuro = Math.round((kmCost + hotelSurcharge) * 100) / 100;

  /* --- Firma Criptográfica SHA-256 (Price-Lock Verification) --- */
  const payloadToHash = [
    'GEO_ACOUSTIC_RADAR',
    input.venueName,
    input.venueType,
    `${totalWatts}W`,
    recommendedSystem,
    `${maxDecibelsSPL}dB`,
    `${distanceKm}km`,
    `${kmCost}EUR`,
    `${hotelSurcharge}EUR`,
    `BASE:${BASE_SOLISTA}`,
    `DEP:${DEPOSITO_STRIPE}`,
  ].join('|');

  const sha256VerificationHash = createHash('sha256').update(payloadToHash).digest('hex');

  return {
    acousticRider: {
      totalWatts,
      wattsPerPax: WATTS_PER_PAX,
      recommendedSystem,
      microphones: MICROFONIA_STANDARD,
      maxDecibelsSPL,
      isVimumeCompliant,
    },
    logisticsBreakdown: {
      distanceKm,
      billableKm,
      kmCost,
      hotelSurcharge,
      requiresAccommodation,
      hubOrigin: HUB_MENTRIDA,
    },
    totalLogisticsAndAudioEuro,
    sha256VerificationHash,
  };
}

/* ------------------------------------------------------------------ */
/* Suite de Auto-Diagnóstico (4 Tests)                                  */
/* ------------------------------------------------------------------ */

export interface GeoAcousticDiagnosticTest {
  id: number;
  name: string;
  description: string;
  pass: boolean;
  details: Record<string, unknown>;
}

export interface GeoAcousticDiagnosticResult {
  engine: string;
  version: string;
  timestamp: string;
  tests: GeoAcousticDiagnosticTest[];
  allPass: boolean;
}

export function runGeoAcousticDiagnostics(): GeoAcousticDiagnosticResult {
  const tests: GeoAcousticDiagnosticTest[] = [];

  /* --- Test 1: Boda estándar 150 pax a 80 km de Méntrida --- */
  try {
    const t1Input: VenueAcousticInput = {
      venueName: 'Boda Estándar Salón',
      venueType: 'SALON_BODA',
      guestCount: 150,
      destinationProvince: 'Toledo',
      distanceKmFromMentrida: 80,
    };
    const t1 = calculateGeoAcousticRadar(t1Input);

    const pass1 =
      t1.acousticRider.totalWatts === 1800 &&
      t1.acousticRider.recommendedSystem.includes('F1') &&
      t1.logisticsBreakdown.kmCost === 45;

    tests.push({
      id: 1,
      name: 'Boda_Estandar_150pax_80km',
      description: `1.800 W | ${t1.acousticRider.recommendedSystem} | ${t1.logisticsBreakdown.kmCost}€ logística km`,
      pass: pass1,
      details: {
        totalWatts: t1.acousticRider.totalWatts,
        expectedWatts: 1800,
        system: t1.acousticRider.recommendedSystem,
        kmCost: t1.logisticsBreakdown.kmCost,
        expectedKmCost: 45,
      },
    });
  } catch (e) {
    tests.push({ id: 1, name: 'Boda_Estandar_150pax_80km', description: 'ERROR', pass: false, details: { error: String(e) } });
  }

  /* --- Test 2: Evento VIMUME en residencia (Límite estricto <75 dB SPL) --- */
  try {
    const t2Input: VenueAcousticInput = {
      venueName: 'Residencia Mayores VIMUME',
      venueType: 'RESIDENCIA_MAYORES',
      guestCount: 30,
      destinationProvince: 'Toledo',
      distanceKmFromMentrida: 15,
      isVimumeContext: true,
    };
    const t2 = calculateGeoAcousticRadar(t2Input);

    const pass2 =
      t2.acousticRider.maxDecibelsSPL < 75 &&
      t2.acousticRider.isVimumeCompliant === true;

    tests.push({
      id: 2,
      name: 'VIMUME_Residencia_Limite_SPL',
      description: `Límite estricto ${t2.acousticRider.maxDecibelsSPL} dB SPL (<75 certificado) | VimumeCompliant: ${t2.acousticRider.isVimumeCompliant}`,
      pass: pass2,
      details: {
        maxDecibelsSPL: t2.acousticRider.maxDecibelsSPL,
        expectedMaxSPL: 74,
        isVimumeCompliant: t2.acousticRider.isVimumeCompliant,
      },
    });
  } catch (e) {
    tests.push({ id: 2, name: 'VIMUME_Residencia_Limite_SPL', description: 'ERROR', pass: false, details: { error: String(e) } });
  }

  /* --- Test 3: Logística larga distancia 250 km con fin a las 04:00 AM --- */
  try {
    const t3Input: VenueAcousticInput = {
      venueName: 'Evento Larga Distancia',
      venueType: 'FINCA_EXTERIOR',
      guestCount: 80,
      destinationProvince: 'Zaragoza',
      distanceKmFromMentrida: 250,
      eventEndHour: '04:00',
    };
    const t3 = calculateGeoAcousticRadar(t3Input);

    const pass3 =
      t3.logisticsBreakdown.hotelSurcharge === 120 &&
      t3.logisticsBreakdown.requiresAccommodation === true;

    tests.push({
      id: 3,
      name: 'Logistica_Larga_Distancia_250km',
      description: `250 km | ${t3.logisticsBreakdown.kmCost}€ km + ${t3.logisticsBreakdown.hotelSurcharge}€ hotelero (fin 04:00 AM)`,
      pass: pass3,
      details: {
        distanceKm: t3.logisticsBreakdown.distanceKm,
        billableKm: t3.logisticsBreakdown.billableKm,
        kmCost: t3.logisticsBreakdown.kmCost,
        hotelSurcharge: t3.logisticsBreakdown.hotelSurcharge,
        expectedHotelSurcharge: 120,
        requiresAccommodation: t3.logisticsBreakdown.requiresAccommodation,
      },
    });
  } catch (e) {
    tests.push({ id: 3, name: 'Logistica_Larga_Distancia_250km', description: 'ERROR', pass: false, details: { error: String(e) } });
  }

  /* --- Test 4: Firma SHA-256 de 64 caracteres emitida válidamente --- */
  try {
    const t4Input: VenueAcousticInput = {
      venueName: 'Verificación Criptográfica',
      venueType: 'SALON_BODA',
      guestCount: 100,
      destinationProvince: 'Madrid',
      distanceKmFromMentrida: 60,
    };
    const t4 = calculateGeoAcousticRadar(t4Input);

    const hashLength = t4.sha256VerificationHash.length;
    const isValidHex = /^[0-9a-f]{64}$/.test(t4.sha256VerificationHash);
    const pass4 = hashLength === 64 && isValidHex;

    tests.push({
      id: 4,
      name: 'SHA256_Verification_Hash',
      description: `Hash SHA-256: ${t4.sha256VerificationHash.substring(0, 16)}... (${hashLength} chars) | Hex válido: ${isValidHex}`,
      pass: pass4,
      details: {
        hashLength,
        expectedLength: 64,
        isValidHex,
        hashPrefix: t4.sha256VerificationHash.substring(0, 16),
      },
    });
  } catch (e) {
    tests.push({ id: 4, name: 'SHA256_Verification_Hash', description: 'ERROR', pass: false, details: { error: String(e) } });
  }

  const allPass = tests.every((t) => t.pass);

  return {
    engine: 'GEO_ACOUSTIC_RADAR_FLEET_DISPATCHER',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    tests,
    allPass,
  };
}