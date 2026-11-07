/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST PANEL 360 — TIER 1: FEATURE COVERAGE (14 FEATURES × 5 TESTS = 70)
 * ════════════════════════════════════════════════════════════════════════════
 * Cobertura de ruta primaria (happy path) de las 14 características oficiales:
 *   F1:  Format Caché Selector (5 tests)
 *   F2:  Displacement Distance 1,50 €/km (5 tests)
 *   F3:  50 km Exemption Hub Méntrida (5 tests)
 *   F4:  Hotel Supplement 120,00 € (5 tests)
 *   F5:  Base Solista Floor 350,00 € (5 tests)
 *   F6:  Sovereign Split 80/10/10 Integer Cents (5 tests)
 *   F7:  Residual Penny Conservation VIMUME (5 tests)
 *   F8:  100,00 € Stripe Price-Lock Deposit (5 tests)
 *   F9:  100% Deposit Deduction from Total (5 tests)
 *   F10: High-Fidelity Audio Player (5 tests)
 *   F11: ISRC Format Validation ISO 3901 (5 tests)
 *   F12: Canonical ISRC Generation (5 tests)
 *   F13: Acoustic Rider Compliance 12 W/pax < 75 dB SPL (5 tests)
 *   F14: B2G LCSP Ceiling 14.250,00 € (5 tests)
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
} from '../../../src/lib/constants/ear-os-ssot';

import {
  calculateArtistQuote as calculateArtistQuoteImpl,
  settleArtistSplit as settleArtistSplitImpl,
  validateIsrc as validateIsrcImpl,
  generateCanonicalIsrc as generateCanonicalIsrcImpl,
  EDWIN_AGUDELO_PROFILE_360,
  MIN_CACHE_BY_FORMAT,
} from '../../../src/lib/artists/artist-360-contract';

import {
  calculateArtistQuoteOracle,
  settleArtistSplitOracle,
  validateIsrcOracle,
  generateCanonicalIsrcOracle,
  evaluateAcousticRiderOracle,
  evaluateB2gCeilingOracle,
  formatAudioDuration,
  generateOfflineSyntheticWavDataUri,
  CANONICAL_EDWIN_TRACKS,
  assert,
  assertEqual,
  assertCloseTo,
  TestExecutionTracker,
} from './test_contracts';

export async function runTier1FeatureCoverageTests(tracker: TestExecutionTracker): Promise<void> {
  const tier = 1;

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 1: Format Caché Selector (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 1: SOLISTA default selects baseCache 350.0 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const oracle = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 0, endHour24: 0 });
      const impl = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0 });
      assertEqual(oracle.baseCacheEur, 350.0, 'Oracle base Solista 350€');
      assertEqual(impl.baseCacheEur, 350.0, 'Impl base Solista 350€');
      assertEqual(impl.baseCacheEur, oracle.baseCacheEur, 'Match Oracle vs Impl');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T1.F1.1: Format SOLISTA selecciona caché base SSOT de 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 2: DUO default selects baseCache 500.0 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const oracle = calculateArtistQuoteOracle({ format: 'DUO', distanceKm: 0, endHour24: 0 });
      const impl = calculateArtistQuoteImpl({ format: 'DUO', distanceKm: 0, endHour24: 0 });
      assertEqual(oracle.baseCacheEur, 500.0, 'Oracle base DUO 500€');
      assertEqual(impl.baseCacheEur, 500.0, 'Impl base DUO 500€');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T1.F1.2: Format DUO selecciona caché base catálogo de 500,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 3: MARIACHI default selects baseCache 650.0 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const oracle = calculateArtistQuoteOracle({ format: 'MARIACHI', distanceKm: 0, endHour24: 0 });
      const impl = calculateArtistQuoteImpl({ format: 'MARIACHI', distanceKm: 0, endHour24: 0 });
      assertEqual(oracle.baseCacheEur, 650.0, 'Oracle base MARIACHI 650€');
      assertEqual(impl.baseCacheEur, 650.0, 'Impl base MARIACHI 650€');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T1.F1.3: Format MARIACHI selecciona caché base catálogo de 650,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 4: ORQUESTA default selects baseCache 1800.0 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const oracle = calculateArtistQuoteOracle({ format: 'ORQUESTA', distanceKm: 0, endHour24: 0 });
      const impl = calculateArtistQuoteImpl({ format: 'ORQUESTA', distanceKm: 0, endHour24: 0 });
      assertEqual(oracle.baseCacheEur, 1800.0, 'Oracle base ORQUESTA 1800€');
      assertEqual(impl.baseCacheEur, 1800.0, 'Impl base ORQUESTA 1800€');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T1.F1.4: Format ORQUESTA selecciona caché base catálogo de 1.800,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 5: DJ default selects baseCache 400.0 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const oracle = calculateArtistQuoteOracle({ format: 'DJ', distanceKm: 0, endHour24: 0 });
      const impl = calculateArtistQuoteImpl({ format: 'DJ', distanceKm: 0, endHour24: 0 });
      assertEqual(oracle.baseCacheEur, 400.0, 'Oracle base DJ 400€');
      assertEqual(impl.baseCacheEur, 400.0, 'Impl base DJ 400€');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T1.F1.5: Format DJ selecciona caché base catálogo de 400,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 2: Displacement Distance (1,50 €/km) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 6: 60 km generates 10 chargeable km at 1.50 €/km = 15.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 60, endHour24: 0 });
      assertEqual(quote.chargeableKm, 10, '60 - 50 = 10 chargeable km');
      assertEqual(quote.logisticsTotalEur, 15.0, '10 * 1.50 = 15.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T1.F2.1: Desplazamiento a 60 km calcula 10 km facturables a 1,50 €/km = 15,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 7: 100 km generates 50 chargeable km at 1.50 €/km = 75.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 100, endHour24: 0 });
      assertEqual(quote.chargeableKm, 50, '100 - 50 = 50 chargeable km');
      assertEqual(quote.logisticsTotalEur, 75.0, '50 * 1.50 = 75.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T1.F2.2: Desplazamiento a 100 km calcula 50 km facturables a 1,50 €/km = 75,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 8: 150 km generates 100 chargeable km at 1.50 €/km = 150.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 150, endHour24: 0 });
      assertEqual(quote.chargeableKm, 100, '150 - 50 = 100 chargeable km');
      assertEqual(quote.logisticsTotalEur, 150.0, '100 * 1.50 = 150.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T1.F2.3: Desplazamiento a 150 km calcula 100 km facturables a 1,50 €/km = 150,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 9: Fractional distance 80.5 km generates 30.5 chargeable km = 45.75 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 80.5, endHour24: 0 });
      assertEqual(quote.chargeableKm, 30.5, '80.5 - 50 = 30.5 chargeable km');
      assertEqual(quote.logisticsTotalEur, 45.75, '30.5 * 1.50 = 45.75 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T1.F2.4: Desplazamiento fraccionario 80,5 km calcula 45,75 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 10: 200 km generates 150 chargeable km at 1.50 €/km = 225.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 200, endHour24: 0 });
      assertEqual(quote.chargeableKm, 150, '200 - 50 = 150 chargeable km');
      assertEqual(quote.logisticsTotalEur, 225.0, '150 * 1.50 = 225.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T1.F2.5: Desplazamiento a 200 km calcula 150 km facturables = 225,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 3: 50 km Exemption (Hub Méntrida) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 11: Distance 0 km produces 0 chargeable km and 0.00 € logistics cost
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '0 km -> 0 chargeable km');
      assertEqual(quote.logisticsTotalEur, 0.0, '0 km -> 0.00 €');
      assertEqual(quote.exemptKm, 50, 'Exempt km is 50');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T1.F3.1: Distancia 0 km (local Méntrida) tiene 0 km facturables y 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 12: Distance 20 km produces 0 chargeable km and 0.00 € logistics cost
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 20, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '20 km -> 0 chargeable km');
      assertEqual(quote.logisticsTotalEur, 0.0, '20 km -> 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T1.F3.2: Distancia 20 km (Navalcarnero) tiene 0 km facturables y 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 13: Distance 40 km produces 0 chargeable km and 0.00 € logistics cost
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 40, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '40 km -> 0 chargeable km');
      assertEqual(quote.logisticsTotalEur, 0.0, '40 km -> 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T1.F3.3: Distancia 40 km (Toledo norte) tiene 0 km facturables y 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 14: Distance 49 km produces 0 chargeable km and 0.00 € logistics cost
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 49, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '49 km -> 0 chargeable km');
      assertEqual(quote.logisticsTotalEur, 0.0, '49 km -> 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T1.F3.4: Distancia 49 km (límite inferior de franquicia) produce 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 15: Distance 50 km (exact exemption threshold) produces 0 chargeable km and 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 50, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '50 km -> 0 chargeable km');
      assertEqual(quote.logisticsTotalEur, 0.0, '50 km -> 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T1.F3.5: Distancia 50 km (umbral exacto de franquicia) produce 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 4: Hotel Supplement (120,00 €) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 16: Distance 100 km and end hour 1 (01:00 AM) requires no hotel (0.00 €)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 100, endHour24: 1 });
      assertEqual(quote.hotelSupplementEur, 0.0, 'End hour 1, distance 100 km -> No hotel');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T1.F4.1: Distancia 100 km y fin a las 01:00 AM no activa suplemento hotel (0,00 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 17: Distance 201 km and end hour 1 (01:00 AM) triggers hotel supplement (120.00 €)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 201, endHour24: 1 });
      assertEqual(quote.hotelSupplementEur, 120.0, 'Distance 201 km > 200 km -> Hotel 120 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T1.F4.2: Distancia 201 km (>200 km) activa suplemento hotel de 120,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 18: Distance 40 km and end hour 3 (03:00 AM) triggers hotel supplement (120.00 €)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 40, endHour24: 3 });
      assertEqual(quote.hotelSupplementEur, 120.0, 'End hour 3 >= 3:00 AM -> Hotel 120 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T1.F4.3: Fin a las 03:00 AM (>=03:00) activa suplemento hotel de 120,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 19: Distance 150 km and end hour 4 (04:00 AM) triggers hotel supplement (120.00 €)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 150, endHour24: 4 });
      assertEqual(quote.hotelSupplementEur, 120.0, 'End hour 4 >= 3:00 AM -> Hotel 120 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T1.F4.4: Fin a las 04:00 AM activa suplemento hotel de 120,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 20: Distance 250 km and end hour 4 (04:00 AM) triggers single hotel supplement (120.00 €)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 250, endHour24: 4 });
      assertEqual(quote.hotelSupplementEur, 120.0, 'Both distance > 200 and hour >= 3 -> Single 120 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T1.F4.5: Cumplir ambos criterios (250 km y 04:00 AM) cobra un único suplemento de 120,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 5: Base Solista Floor (350,00 €) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 21: Solista quote with default customBase preserves 350.00 € floor
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0 });
      assertEqual(quote.baseCacheEur, 350.0, 'Base must be 350 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T1.F5.1: Cotización Solista por defecto preserva suelo canónico de 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 22: Solista quote with lower requested fee (200.00 €) is floored to 350.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 200 });
      assertEqual(quote.baseCacheEur, 350.0, '200 € floored to 350 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T1.F5.2: Solicitud de tarifa a 200,00 € se blinda y eleva al suelo de 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 23: Solista quote with requested fee 349.99 € is floored to 350.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 349.99 });
      assertEqual(quote.baseCacheEur, 350.0, '349.99 € floored to 350 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T1.F5.3: Solicitud a 349,99 € se blinda y eleva al suelo de 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 24: Solista quote at 350.00 € sets isEdwinAgudeloSovereignFloor to true
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0 });
      assertEqual(quote.isEdwinAgudeloSovereignFloor, true, 'isEdwinAgudeloSovereignFloor must be true');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T1.F5.4: Bandera isEdwinAgudeloSovereignFloor activada en tarifa suelo de 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 25: EDWIN_AGUDELO_PROFILE_360 profile enforces 350.00 € base fee
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(EDWIN_AGUDELO_PROFILE_360.baseCacheEur, 350.0, 'Profile base cache must be 350 €');
      assertEqual(EDWIN_AGUDELO_PROFILE_360.format, 'SOLISTA', 'Profile format must be SOLISTA');
      assertEqual(EDWIN_AGUDELO_PROFILE_360.fiscalCity, 'Méntrida', 'Profile city must be Méntrida');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T1.F5.5: Perfil canónico EDWIN_AGUDELO_PROFILE_360 incorpora tarifa base de 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 6: Sovereign Split 80/10/10 Integer Cents (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 26: Total 1000.00 € splits to 800.00 € artist, 100.00 € EAR OS, 100.00 € VIMUME
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(1000.0);
      assertEqual(split.artistAmountEur, 800.0, 'Artist 80% of 1000 = 800 €');
      assertEqual(split.earOsAmountEur, 100.0, 'EAR OS 10% of 1000 = 100 €');
      assertEqual(split.vimumeAmountEur, 100.0, 'VIMUME 10% of 1000 = 100 €');
      assertEqual(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur, 1000.0, 'Split sum exact 1000 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T1.F6.1: Reparto de 1.000,00 € genera 800,00 € (80%), 100,00 € (10%), 100,00 € (10%)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 27: Base Solista 350.00 € splits to 280.00 € artist, 35.00 € EAR OS, 35.00 € VIMUME
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(350.0);
      assertEqual(split.artistAmountEur, 280.0, 'Artist 80% of 350 = 280 €');
      assertEqual(split.earOsAmountEur, 35.0, 'EAR OS 10% of 350 = 35 €');
      assertEqual(split.vimumeAmountEur, 35.0, 'VIMUME 10% of 350 = 35 €');
      assertEqual(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur, 350.0, 'Split sum exact 350 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T1.F6.2: Reparto de base Solista (350,00 €) genera 280,00 €, 35,00 € y 35,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 28: Base Duo 500.00 € splits to 400.00 € artist, 50.00 € EAR OS, 50.00 € VIMUME
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(500.0);
      assertEqual(split.artistAmountEur, 400.0, 'Artist 80% of 500 = 400 €');
      assertEqual(split.earOsAmountEur, 50.0, 'EAR OS 10% of 500 = 50 €');
      assertEqual(split.vimumeAmountEur, 50.0, 'VIMUME 10% of 500 = 50 €');
      assertEqual(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur, 500.0, 'Split sum exact 500 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T1.F6.3: Reparto de base Dúo (500,00 €) genera 400,00 €, 50,00 € y 50,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 29: Base Mariachi 650.00 € splits to 520.00 € artist, 65.00 € EAR OS, 65.00 € VIMUME
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(650.0);
      assertEqual(split.artistAmountEur, 520.0, 'Artist 80% of 650 = 520 €');
      assertEqual(split.earOsAmountEur, 65.0, 'EAR OS 10% of 650 = 65 €');
      assertEqual(split.vimumeAmountEur, 65.0, 'VIMUME 10% of 650 = 65 €');
      assertEqual(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur, 650.0, 'Split sum exact 650 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T1.F6.4: Reparto de base Mariachi (650,00 €) genera 520,00 €, 65,00 € y 65,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 30: Base Orquesta 1800.00 € splits to 1440.00 € artist, 180.00 € EAR OS, 180.00 € VIMUME
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(1800.0);
      assertEqual(split.artistAmountEur, 1440.0, 'Artist 80% of 1800 = 1440 €');
      assertEqual(split.earOsAmountEur, 180.0, 'EAR OS 10% of 1800 = 180 €');
      assertEqual(split.vimumeAmountEur, 180.0, 'VIMUME 10% of 1800 = 180 €');
      assertEqual(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur, 1800.0, 'Split sum exact 1800 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T1.F6.5: Reparto de base Orquesta (1.800,00 €) genera 1.440,00 €, 180,00 € y 180,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 7: Residual Penny Conservation (VIMUME) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 31: Odd amount 100.01 € (10001 cents) conserves every single cent
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(100.01);
      assertEqual(split.totalCents, 10001, '10001 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 10001, 'Sum must equal 10001 cents');
      assertEqual(split.artistCents, 8001, '8001 artist cents');
      assertEqual(split.earOsCents, 1000, '1000 EAR OS cents');
      assertEqual(split.vimumeCents, 1000, '1000 VIMUME cents');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T1.F7.1: Importe 100,01 € conserva la suma exacta de 10.001 céntimos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 32: Odd amount 100.03 € (10003 cents) assigns remainder cent to VIMUME
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(100.03);
      assertEqual(split.totalCents, 10003, '10003 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 10003, 'Sum must equal 10003 cents');
      assertEqual(split.artistCents, 8002, '8002 artist cents');
      assertEqual(split.earOsCents, 1000, '1000 EAR OS cents');
      assertEqual(split.vimumeCents, 1001, '1001 VIMUME cents (absorbs penny)');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T1.F7.2: Importe 100,03 € asigna céntimo residual a VIMUME (1.001 céntimos)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 33: Odd amount 100.05 € (10005 cents) satisfies exact cent conservation
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(100.05);
      assertEqual(split.totalCents, 10005, '10005 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 10005, 'Sum must equal 10005 cents');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T1.F7.3: Importe 100,05 € conserva exactamente 10.005 céntimos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 34: Odd amount 100.07 € (10007 cents) assigns remainder cent to VIMUME
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(100.07);
      assertEqual(split.totalCents, 10007, '10007 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 10007, 'Sum must equal 10007 cents');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T1.F7.4: Importe 100,07 € asigna ajuste residual a VIMUME (10.007 céntimos)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 35: Odd amount 1070.33 € satisfies exact cent conservation
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(1070.33);
      const totalCents = Math.round(1070.33 * 100);
      const artistCents = Math.round(split.artistAmountEur * 100);
      const earOsCents = Math.round(split.earOsAmountEur * 100);
      const vimumeCents = Math.round(split.vimumeAmountEur * 100);
      assertEqual(artistCents + earOsCents + vimumeCents, totalCents, '107033 cents conserved');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T1.F7.5: Importe 1.070,33 € conserva exactamente 107.033 céntimos enteros',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 8: 100,00 € Stripe Price-Lock Deposit (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 36: SSOT constant DEPOSITO_STRIPE_EUR is exactly 100.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(DEPOSITO_STRIPE_EUR, 100.0, 'DEPOSITO_STRIPE_EUR must be 100.0');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T1.F8.1: Constante SSOT DEPOSITO_STRIPE_EUR fijada en 100,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 37: Quote calculation includes 100.00 € deductible deposit
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0 });
      assertEqual(quote.depositDeductibleEur, 100.0, 'Deposit deductible must be 100.0 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T1.F8.2: Cálculo de presupuesto declara depósito deducible de 100,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 38: Split calculation includes 100.00 € deposit paid by default
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(500.0);
      assertEqual(split.depositPaidEur, 100.0, 'Default deposit paid must be 100.0 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T1.F8.3: Liquidación Split Soberano asume depósito de 100,00 € por defecto',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 39: Deposit converts to exactly 10000 integer cents
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(500.0, 100.0);
      assertEqual(split.depositDeductedCents, 10000, 'Deposit in cents is 10000');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T1.F8.4: Depósito de 100,00 € se convierte a exactamente 10.000 céntimos enteros',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 40: Deposit deduction is reflected in settlement result
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(350.0);
      // Artist gross: 280 € -> pending after 100 € deposit = 180 €
      assertEqual(split.artistNetPendingEur, 180.0, '280 - 100 = 180 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T1.F8.5: Liquidación refleja saldo neto pendiente de artista descontando 100,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 9: 100% Deposit Deduction from Total (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 41: Total event 350.00 € has pending balance 250.00 € after 100.00 € deposit
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0 });
      assertEqual(quote.totalEventEur, 350.0, 'Total 350 €');
      assertEqual(quote.pendingFinalSettlementEur, 250.0, '350 - 100 = 250 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T1.F9.1: Total evento 350,00 € descuenta 100,00 € dejando 250,00 € pendientes',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 42: Total event 575.00 € has pending balance 475.00 € after 100.00 € deposit
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      // 350 + (120 - 50)*1.5 + 120 = 350 + 105 + 120 = 575 €
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 120, endHour24: 4 });
      assertEqual(quote.totalEventEur, 575.0, 'Total 575 €');
      assertEqual(quote.pendingFinalSettlementEur, 475.0, '575 - 100 = 475 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T1.F9.2: Total evento 575,00 € descuenta 100,00 € dejando 475,00 € pendientes',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 43: Total event 650.00 € has pending balance 550.00 € after 100.00 € deposit
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'MARIACHI', distanceKm: 0, endHour24: 0 });
      assertEqual(quote.totalEventEur, 650.0, 'Total 650 €');
      assertEqual(quote.pendingFinalSettlementEur, 550.0, '650 - 100 = 550 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T1.F9.3: Total Mariachi 650,00 € descuenta 100,00 € dejando 550,00 € pendientes',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 44: Total event 1800.00 € has pending balance 1700.00 € after 100.00 € deposit
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'ORQUESTA', distanceKm: 0, endHour24: 0 });
      assertEqual(quote.totalEventEur, 1800.0, 'Total 1800 €');
      assertEqual(quote.pendingFinalSettlementEur, 1700.0, '1800 - 100 = 1700 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T1.F9.4: Total Orquesta 1.800,00 € descuenta 100,00 € dejando 1.700,00 € pendientes',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 45: Artist split net pending earnings subtracts 100.00 € deposit
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(1000.0);
      // Artist 80% = 800 € -> pending after 100 € deposit = 700 €
      assertEqual(split.artistNetPendingEur, 700.0, '800 - 100 = 700 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T1.F9.5: Liquidación neta a artista descuenta íntegramente los 100,00 € (700,00 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 10: High-Fidelity Audio Player (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 46: Canonical track list contains 5 complete tracks with required metadata
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assert(CANONICAL_EDWIN_TRACKS.length >= 5, 'Track list has at least 5 tracks');
      for (const track of CANONICAL_EDWIN_TRACKS) {
        assert(Boolean(track.id), 'Track has id');
        assert(Boolean(track.title), 'Track has title');
        assert(Boolean(track.artist), 'Track has artist');
        assert(track.durationSeconds > 0, 'Track duration > 0');
        assert(Boolean(track.isrc), 'Track has ISRC');
      }
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T1.F10.1: Catálogo oficial de pistas contiene 5 grabaciones completas con metadatos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 47: Audio duration formatting produces standard MM:SS string (195s -> "03:15")
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const formatted = formatAudioDuration(195);
      assertEqual(formatted, '03:15', '195s formatted as 03:15');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T1.F10.2: Formateador de tiempo traduce 195 segundos a "03:15"',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 48: Audio duration formatting produces standard MM:SS string for round minute (180s -> "03:00")
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const formatted = formatAudioDuration(180);
      assertEqual(formatted, '03:00', '180s formatted as 03:00');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T1.F10.3: Formateador de tiempo traduce 180 segundos a "03:00"',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 49: Procedural WAV generator creates valid Data URI with "data:audio/wav;base64," prefix
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const uri = generateOfflineSyntheticWavDataUri(440, 0.1);
      assert(uri.startsWith('data:audio/wav;base64,'), 'URI has correct data prefix');
      assert(uri.length > 50, 'URI has sound data payload');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T1.F10.4: Generador procedural WAV crea Data URI reproducible sin red externa',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 50: Procedural WAV Data URI decodes to a valid RIFF/WAVE header
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const uri = generateOfflineSyntheticWavDataUri(440, 0.1);
      const base64Data = uri.replace('data:audio/wav;base64,', '');
      const raw = Buffer.from(base64Data, 'base64');
      const riffHeader = raw.subarray(0, 4).toString('ascii');
      const waveHeader = raw.subarray(8, 12).toString('ascii');
      assertEqual(riffHeader, 'RIFF', 'Header must contain RIFF');
      assertEqual(waveHeader, 'WAVE', 'Header must contain WAVE');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T1.F10.5: Audio sintético decodifica cabecera canónica RIFF/WAVE conforme a norma',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 11: ISRC Format Validation (ISO 3901) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 51: Valid ISRC ES-EAR-26-00001 returns valid: true
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const result = validateIsrcImpl('ES-EAR-26-00001');
      assertEqual(result.valid, true, 'ES-EAR-26-00001 must be valid');
      assertEqual(result.country, 'ES', 'Country ES');
      assertEqual(result.registrant, 'EAR', 'Registrant EAR');
      assertEqual(result.year, '26', 'Year 26');
      assertEqual(result.designation, '00001', 'Designation 00001');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T1.F11.1: Código ES-EAR-26-00001 valida satisfactoriamente con valid: true',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 52: Valid ISRC ES-EAR-26-00042 extracts country ES, registrant EAR, year 26, seq 00042
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const result = validateIsrcImpl('ES-EAR-26-00042');
      assertEqual(result.valid, true, 'Valid code');
      assertEqual(result.designation, '00042', 'Designation 00042');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T1.F11.2: Código ES-EAR-26-00042 extrae correctamente designador 00042',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 53: Invalid country FR-EAR-26-00001 returns valid: false with reason
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const result = validateIsrcImpl('FR-EAR-26-00001');
      assertEqual(result.valid, false, 'Invalid country prefix FR');
      assert(Boolean(result.reason), 'Reason is provided');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T1.F11.3: Código con país ajeno FR-EAR-26-00001 se rechaza con valid: false',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 54: Invalid registrant ES-XYZ-26-00001 returns valid: false with reason
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const result = validateIsrcImpl('ES-XYZ-26-00001');
      assertEqual(result.valid, false, 'Invalid registrant XYZ');
      assert(Boolean(result.reason), 'Reason is provided');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T1.F11.4: Código con registrante ajeno ES-XYZ-26-00001 se rechaza con valid: false',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 55: Lowercase code es-ear-26-00001 is normalized to uppercase and validates
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const result = validateIsrcImpl('es-ear-26-00001');
      assertEqual(result.valid, true, 'Lowercase code normalized');
      assertEqual(result.code, 'ES-EAR-26-00001', 'Normalized to uppercase');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T1.F11.5: Código en minúsculas es-ear-26-00001 se normaliza a mayúsculas y valida',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 12: Canonical ISRC Generation (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 56: generateCanonicalIsrc(26, 1) yields ES-EAR-26-00001
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(26, 1);
      assertEqual(code, 'ES-EAR-26-00001', 'Formatted as ES-EAR-26-00001');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T1.F12.1: Generación canónica año 26, secuencia 1 produce ES-EAR-26-00001',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 57: generateCanonicalIsrc(26, 42) yields ES-EAR-26-00042
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(26, 42);
      assertEqual(code, 'ES-EAR-26-00042', 'Formatted as ES-EAR-26-00042');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T1.F12.2: Generación canónica año 26, secuencia 42 produce ES-EAR-26-00042',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 58: generateCanonicalIsrc(26, 12345) yields ES-EAR-26-12345
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(26, 12345);
      assertEqual(code, 'ES-EAR-26-12345', 'Formatted as ES-EAR-26-12345');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T1.F12.3: Generación canónica año 26, secuencia 12345 produce ES-EAR-26-12345',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 59: generateCanonicalIsrc(25, 999) yields ES-EAR-25-00999
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(25, 999);
      assertEqual(code, 'ES-EAR-25-00999', 'Formatted as ES-EAR-25-00999');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T1.F12.4: Generación canónica año 25, secuencia 999 produce ES-EAR-25-00999',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 60: Output of generateCanonicalIsrc satisfies validateIsrc with valid: true
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const generated = generateCanonicalIsrcImpl(26, 77);
      const validated = validateIsrcImpl(generated);
      assertEqual(validated.valid, true, 'Generated code validates successfully');
      assertEqual(validated.code, 'ES-EAR-26-00077', 'Code matches expected');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T1.F12.5: Código canónico generado supera validación ISO 3901 con valid: true',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 13: Acoustic Rider Compliance (12 W/pax, < 75 dB SPL) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 61: SSOT constant WATTS_PER_PAX is exactly 12 W/pax
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(WATTS_PER_PAX, 12, 'WATTS_PER_PAX must be 12');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T1.F13.1: Constante SSOT WATTS_PER_PAX fijada en 12 W/pax',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 62: SSOT constant LIMITE_SPL_DB is exactly 75 dB SPL
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(LIMITE_SPL_DB, 75, 'LIMITE_SPL_DB must be 75');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T1.F13.2: Constante SSOT LIMITE_SPL_DB fijada en 75 dB SPL (salud pública)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 63: 50 pax calculates 600 W RMS and is compliant
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const assessment = evaluateAcousticRiderOracle(50);
      assertEqual(assessment.recommendedWatts, 600, '50 pax * 12 W = 600 W');
      assertEqual(assessment.maxSplDb, 75, 'SPL is 75 dB');
      assertEqual(assessment.compliant, true, 'Compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T1.F13.3: Rider para 50 pax dimensiona 600 W RMS cumpliendo < 75 dB SPL',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 64: 100 pax calculates 1200 W RMS and is compliant
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const assessment = evaluateAcousticRiderOracle(100);
      assertEqual(assessment.recommendedWatts, 1200, '100 pax * 12 W = 1200 W');
      assertEqual(assessment.compliant, true, 'Compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T1.F13.4: Rider para 100 pax dimensiona 1.200 W RMS cumpliendo < 75 dB SPL',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 65: 500 pax calculates 6000 W RMS and is compliant
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const assessment = evaluateAcousticRiderOracle(500);
      assertEqual(assessment.recommendedWatts, 6000, '500 pax * 12 W = 6000 W');
      assertEqual(assessment.compliant, true, 'Compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T1.F13.5: Rider para 500 pax dimensiona 6.000 W RMS cumpliendo < 75 dB SPL',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 14: B2G LCSP Ceiling (14.250,00 €) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 66: SSOT constant SAFE_LCSP_CEILING_EUR is exactly 14.250,00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(SAFE_LCSP_CEILING_EUR, 14250.0, 'SAFE_LCSP_CEILING_EUR must be 14250.0');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T1.F14.1: Constante SSOT SAFE_LCSP_CEILING_EUR fijada en 14.250,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 67: SSOT constant LIMITE_B2G_LCSP_EUR is exactly 15.000,00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(LIMITE_B2G_LCSP_EUR, 15000.0, 'LIMITE_B2G_LCSP_EUR must be 15000.0');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T1.F14.2: Constante SSOT LIMITE_B2G_LCSP_EUR fijada en 15.000,00 € legal',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 68: Standard quote of 1.000,00 € does not trigger B2G ceiling alert
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const assessment = evaluateB2gCeilingOracle(1000.0);
      assertEqual(assessment.alert, false, '1000 € must not alert');
      assertEqual(assessment.compliant, true, '1000 € is compliant');
      assertEqual(assessment.deltaEur, -13250.0, 'Delta is -13250 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T1.F14.3: Presupuesto estándar de 1.000,00 € no activa alerta de techo B2G',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 69: Quote of 14.000,00 € does not trigger B2G ceiling alert
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const assessment = evaluateB2gCeilingOracle(14000.0);
      assertEqual(assessment.alert, false, '14000 € must not alert');
      assertEqual(assessment.compliant, true, '14000 € is compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T1.F14.4: Presupuesto de 14.000,00 € permanece en zona segura sin alerta B2G',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 70: Ratio SAFE_LCSP_CEILING_EUR / LIMITE_B2G_LCSP_EUR is exactly 0.95 (95% preventive ceiling)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const ratio = SAFE_LCSP_CEILING_EUR / LIMITE_B2G_LCSP_EUR;
      assertCloseTo(ratio, 0.95, 0.0001, 'Ratio must be 0.95');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T1.F14.5: Ratio preventivo de seguridad B2G es exactamente del 95% (0,95)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}
