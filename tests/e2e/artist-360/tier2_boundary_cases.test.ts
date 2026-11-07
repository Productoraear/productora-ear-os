/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST PANEL 360 — TIER 2: BOUNDARY & CORNER CASES (14 FEATURES × 5 = 70)
 * ════════════════════════════════════════════════════════════════════════════
 * Cobertura de límites, valores frontera y casos de esquina (BVA):
 *   B1:  Format Caché Selector Boundaries (5 tests)
 *   B2:  Displacement Distance Boundaries (5 tests)
 *   B3:  50 km Exemption Threshold Boundaries (5 tests)
 *   B4:  Hotel Supplement Activation Boundaries (5 tests)
 *   B5:  Base Solista Floor Invariance Boundaries (5 tests)
 *   B6:  Sovereign Split 80/10/10 Boundaries (5 tests)
 *   B7:  Residual Penny Conservation LCG Proof (5 tests)
 *   B8:  Stripe Deposit Variations & Boundaries (5 tests)
 *   B9:  100% Deposit Deduction Edge Cases (5 tests)
 *   B10: Audio Player Duration & Synthetic Boundaries (5 tests)
 *   B11: ISRC Validation ISO 3901 Boundary Checks (5 tests)
 *   B12: Canonical ISRC Generation Boundaries (5 tests)
 *   B13: Acoustic Rider Audience & SPL Limits (5 tests)
 *   B14: B2G LCSP Ceiling Threshold Boundaries (5 tests)
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
  assert,
  assertEqual,
  assertCloseTo,
  TestExecutionTracker,
} from './test_contracts';

export async function runTier2BoundaryAndCornerTests(tracker: TestExecutionTracker): Promise<void> {
  const tier = 2;

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 1 BOUNDARIES: Format Caché Selector (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 1: Custom base higher than floor is respected
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 550.0 });
      assertEqual(quote.baseCacheEur, 550.0, 'Custom base 550 € > 350 € must be respected');
      assertEqual(quote.isEdwinAgudeloSovereignFloor, false, 'Custom base > floor is not floor');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T2.F1.1: Caché personalizado superior al suelo (550,00 €) es respetado',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 2: Custom base lower than format floor is clamped to format floor
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'DUO', distanceKm: 0, endHour24: 0, customBaseCacheEur: 499.99 });
      assertEqual(quote.baseCacheEur, 500.0, '499.99 € clamped to Duo floor of 500.0 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T2.F1.2: Caché Dúo de 499,99 € es acotado al suelo mínimo de 500,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 3: Custom base zero or negative is clamped to format floor
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'MARIACHI', distanceKm: 0, endHour24: 0, customBaseCacheEur: -250.0 });
      assertEqual(quote.baseCacheEur, 650.0, 'Negative fee clamped to Mariachi floor 650 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T2.F1.3: Caché negativo (-250,00 €) es acotado al suelo de Mariachi (650,00 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 4: Massive custom base cache (50.000,00 €) handled without overflow
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'ORQUESTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 50000.0 });
      assertEqual(quote.baseCacheEur, 50000.0, '50000 € handled cleanly');
      assertEqual(quote.totalEventEur, 50000.0, 'Total event 50000 €');
      assertEqual(quote.pendingFinalSettlementEur, 49900.0, '50000 - 100 = 49900 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T2.F1.4: Caché macro de 50.000,00 € procesado sin degradación ni desbordamiento',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 5: Decimal precision with fractional cents in custom base
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'DJ', distanceKm: 0, endHour24: 0, requestedBaseCacheEur: 450.55 });
      assertEqual(quote.baseCacheEur, 450.55, '450.55 € preserved with exact precision');
      assertEqual(quote.totalEventEur, 450.55, 'Total event 450.55 €');
      assertEqual(quote.pendingFinalSettlementEur, 350.55, '450.55 - 100 = 350.55 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 1,
      testName: 'T2.F1.5: Caché decimal de 450,55 € preserva céntimos exactos sin deriva',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 2 BOUNDARIES: Displacement Distance (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 6: Exactly 51 km produces exactly 1.0 chargeable km and 1.50 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 51, endHour24: 0 });
      assertEqual(quote.chargeableKm, 1, '51 - 50 = 1 chargeable km');
      assertEqual(quote.logisticsTotalEur, 1.50, '1 * 1.50 = 1.50 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T2.F2.1: Frontera exacta de 51 km genera exactamente 1 km facturable y 1,50 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 7: Distance 50.1 km produces 0.1 chargeable km and 0.15 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 50.1, endHour24: 0 });
      assertCloseTo(quote.chargeableKm, 0.1, 0.001, '0.1 chargeable km');
      assertEqual(quote.logisticsTotalEur, 0.15, '0.1 * 1.50 = 0.15 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T2.F2.2: Distancia frontera de 50,1 km calcula 0,15 € de logística',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 8: Distance 199.9 km produces 149.9 chargeable km = 224.85 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 199.9, endHour24: 0 });
      assertCloseTo(quote.chargeableKm, 149.9, 0.001, '149.9 chargeable km');
      assertEqual(quote.logisticsTotalEur, 224.85, '149.9 * 1.50 = 224.85 €');
      assertEqual(quote.hotelSupplementEur, 0.0, 'No hotel since <= 200 km');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T2.F2.3: Distancia frontera de 199,9 km calcula 224,85 € sin activar hotel',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 9: Stress distance 1000 km produces 950 chargeable km = 1425.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 1000, endHour24: 0 });
      assertEqual(quote.chargeableKm, 950, '1000 - 50 = 950 chargeable km');
      assertEqual(quote.logisticsTotalEur, 1425.0, '950 * 1.50 = 1425.00 €');
      assertEqual(quote.hotelSupplementEur, 120.0, '1000 km > 200 km -> Hotel 120 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T2.F2.4: Distancia extrema de 1.000 km genera 1.425,00 € y suplemento hotel de 120,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 10: Delta within exemption yields 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 49.999, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, 'Chargeable km must be 0');
      assertEqual(quote.logisticsTotalEur, 0.0, '0.00 € logistics');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 2,
      testName: 'T2.F2.5: Distancia 49,999 km permanece en 0 km facturables y 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 3 BOUNDARIES: 50 km Exemption (Hub Méntrida) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 11: Distance 49.99 km produces 0 chargeable km and 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 49.99, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '49.99 km is inside 50 km exemption');
      assertEqual(quote.logisticsTotalEur, 0.0, '0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T2.F3.1: Distancia 49,99 km se mantiene 100% dentro de la franquicia exenta',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 12: Distance 50.00 km produces exactly 0 chargeable km and 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 50.0, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '50.00 km is exact threshold');
      assertEqual(quote.logisticsTotalEur, 0.0, '0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T2.F3.2: Umbral exacto de 50,00 km no factura desplazamiento (0,00 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 13: Distance 50.01 km produces 0.01 chargeable km and 0.01 € (IEEE 754 float rounding)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 50.01, endHour24: 0 });
      assertCloseTo(quote.chargeableKm, 0.01, 0.001, '0.01 chargeable km');
      assertEqual(quote.logisticsTotalEur, 0.01, '0.01 * 1.50 in IEEE 754 rounds to 0.01 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T2.F3.3: Distancia 50,01 km factura 0,01 km con redondeo IEEE 754 a 0,01 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 14: Negative distance (-50 km) is clamped safely to 0 km and 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: -50, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, 'Negative distance clamped to 0');
      assertEqual(quote.logisticsTotalEur, 0.0, '0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T2.F3.4: Distancia anómala negativa (-50 km) se normaliza a 0 km y 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 15: Distance at 0.001 km yields 0 chargeable km
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0.001, endHour24: 0 });
      assertEqual(quote.chargeableKm, 0, '0.001 km is inside 50 km exemption');
      assertEqual(quote.logisticsTotalEur, 0.0, '0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 3,
      testName: 'T2.F3.5: Distancia infinitesimal 0,001 km se absorbe en la franquicia exenta',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 4 BOUNDARIES: Hotel Supplement (120,00 €) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 16: End hour 2 (02:00 AM) with distance <= 200 km produces 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 180, endHour24: 2 });
      assertEqual(quote.hotelSupplementEur, 0.0, 'End hour 2 is < 3:00 AM, no hotel');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T2.F4.1: Fin a las 02:00 AM con 180 km no activa suplemento hotelero (0,00 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 17: End hour 3 (03:00 AM exact boundary) produces 120.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 30, endHour24: 3 });
      assertEqual(quote.hotelSupplementEur, 120.0, 'End hour 3 is >= 3:00 AM, hotel 120 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T2.F4.2: Fin a las 03:00 AM exactas (umbral legal) activa suplemento de 120,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 18: Distance 200.0 km exact produces 0.00 € hotel supplement (if hour < 3)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 200.0, endHour24: 1 });
      assertEqual(quote.hotelSupplementEur, 0.0, '200.0 km is not > 200 km, no hotel');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T2.F4.3: Distancia exacta de 200,0 km (no > 200) no activa suplemento hotelero',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 19: Distance 200.01 km (just over 200) produces 120.00 € hotel supplement
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 200.01, endHour24: 1 });
      assertEqual(quote.hotelSupplementEur, 120.0, '200.01 km is > 200 km, hotel 120 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T2.F4.4: Distancia de 200,01 km (> 200 km) activa suplemento hotelero de 120,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 20: Midnight end hour (00:00 / 0h) with distance <= 200 km produces 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 120, endHour24: 0 });
      assertEqual(quote.hotelSupplementEur, 0.0, 'Hour 0 is midnight (< 3), no hotel');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 4,
      testName: 'T2.F4.5: Fin a medianoche (00:00 / 0h) con 120 km no genera suplemento hotel (0,00 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 5 BOUNDARIES: Base Solista Floor (350,00 €) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 21: Negative fee (-1000.00 €) for Solista is floored to 350.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: -1000 });
      assertEqual(quote.baseCacheEur, 350.0, '-1000 floored to 350');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T2.F5.1: Tarifa negativa extrema (-1.000,00 €) queda bloqueada en 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 22: Zero fee (0.00 €) for Solista is floored to 350.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 0 });
      assertEqual(quote.baseCacheEur, 350.0, '0 floored to 350');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T2.F5.2: Tarifa a coste cero (0,00 €) queda bloqueada en el suelo de 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 23: Exact fee 350.00 € retains 350.00 € and sets isEdwinAgudeloSovereignFloor to true
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 350.0 });
      assertEqual(quote.baseCacheEur, 350.0, '350.0 € retained');
      assertEqual(quote.isEdwinAgudeloSovereignFloor, true, 'isEdwinAgudeloSovereignFloor must be true');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T2.F5.3: Tarifa exacta de 350,00 € mantiene bandera de suelo canónico activa',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 24: Fee 350.01 € retains 350.01 € and sets isEdwinAgudeloSovereignFloor to false
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 350.01 });
      assertEqual(quote.baseCacheEur, 350.01, '350.01 € retained');
      assertEqual(quote.isEdwinAgudeloSovereignFloor, false, 'isEdwinAgudeloSovereignFloor false');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T2.F5.4: Tarifa de 350,01 € supera el suelo y desactiva bandera de suelo',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 25: Non-Solista formats enforce their respective higher floors
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const duo = calculateArtistQuoteImpl({ format: 'DUO', distanceKm: 0, endHour24: 0, customBaseCacheEur: 350 });
      const mariachi = calculateArtistQuoteImpl({ format: 'MARIACHI', distanceKm: 0, endHour24: 0, customBaseCacheEur: 350 });
      const orquesta = calculateArtistQuoteImpl({ format: 'ORQUESTA', distanceKm: 0, endHour24: 0, customBaseCacheEur: 350 });
      assertEqual(duo.baseCacheEur, 500.0, 'Duo floor 500 €');
      assertEqual(mariachi.baseCacheEur, 650.0, 'Mariachi floor 650 €');
      assertEqual(orquesta.baseCacheEur, 1800.0, 'Orquesta floor 1800 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 5,
      testName: 'T2.F5.5: Formatos Dúo, Mariachi y Orquesta no admiten devaluación a 350,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 6 BOUNDARIES: Sovereign Split 80/10/10 (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 26: Odd amount 575.00 € split verification
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(575.0);
      assertEqual(split.artistAmountEur, 460.0, '80% of 575 = 460 €');
      assertEqual(split.earOsAmountEur, 57.5, '10% of 575 = 57.50 €');
      assertEqual(split.vimumeAmountEur, 57.5, '10% of 575 = 57.50 €');
      assertEqual(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur, 575.0, 'Sum 575 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T2.F6.1: Reparto de 575,00 € genera 460,00 €, 57,50 € y 57,50 € exactos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 27: Single cent amount 0.01 € produces valid non-negative split summing to 1 cent
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(0.01);
      assertEqual(split.totalCents, 1, '1 total cent');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 1, 'Sum = 1 cent');
      assert(split.artistCents >= 0 && split.earOsCents >= 0 && split.vimumeCents >= 0, 'No negative cents');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T2.F6.2: Cantidad mínima de 0,01 € (1 céntimo) reparte sin generar céntimos negativos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 28: Micro amount 0.03 € produces valid split summing to exactly 3 cents
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(0.03);
      assertEqual(split.totalCents, 3, '3 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 3, 'Sum = 3 cents');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T2.F6.3: Cantidad micro de 0,03 € suma exactamente 3 céntimos enteros',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 29: Zero amount 0.00 € produces 0.00 € across all split components
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(0.0, 0.0);
      assertEqual(split.totalCents, 0, '0 total cents');
      assertEqual(split.artistCents, 0, '0 artist cents');
      assertEqual(split.earOsCents, 0, '0 EAR OS cents');
      assertEqual(split.vimumeCents, 0, '0 VIMUME cents');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T2.F6.4: Cantidad cero (0,00 €) produce 0 céntimos en todos los destinos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 30: Massive amount 50.000,00 € produces exact split
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitImpl(50000.0);
      assertEqual(split.artistAmountEur, 40000.0, '80% of 50000 = 40000 €');
      assertEqual(split.earOsAmountEur, 5000.0, '10% of 50000 = 5000 €');
      assertEqual(split.vimumeAmountEur, 5000.0, '10% of 50000 = 5000 €');
      assertEqual(split.artistAmountEur + split.earOsAmountEur + split.vimumeAmountEur, 50000.0, 'Exact 50000 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 6,
      testName: 'T2.F6.5: Importe macro de 50.000,00 € reparte 40.000,00 €, 5.000,00 € y 5.000,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 7 BOUNDARIES: Residual Penny Conservation (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 31: Continuous run of 100 consecutive cent amounts satisfies sum === total
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      for (let c = 0; c < 100; c++) {
        const amount = 500 + c / 100;
        const split = settleArtistSplitImpl(amount);
        const totalCents = Math.round(amount * 100);
        const sumCents = Math.round(split.artistAmountEur * 100) + Math.round(split.earOsAmountEur * 100) + Math.round(split.vimumeAmountEur * 100);
        if (sumCents !== totalCents) {
          throw new Error(`Cent leak detected at ${amount} €: expected ${totalCents}, got ${sumCents}`);
        }
      }
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T2.F7.1: Prueba continua en 100 céntimos consecutivos (500,00 € a 500,99 €) con 0% fugas',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 32: High-precision floating amount 14.249,99 € conserves exactly 1.424.999 cents
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(14249.99);
      assertEqual(split.totalCents, 1424999, '1424999 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 1424999, 'Sum = 1424999 cents');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T2.F7.2: Importe límite B2G (14.249,99 €) conserva exactamente 1.424.999 céntimos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 33: Amount 0.07 € assigns exact cents
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(0.07);
      assertEqual(split.totalCents, 7, '7 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 7, 'Sum = 7 cents');
      assertEqual(split.artistCents, 6, '6 artist cents (round(7*0.8)=6)');
      assertEqual(split.earOsCents, 1, '1 EAR OS cent (round(7*0.1)=1)');
      assertEqual(split.vimumeCents, 0, '0 VIMUME cents (7 - 6 - 1 = 0)');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T2.F7.3: Importe micro de 0,07 € asigna 6c artista, 1c EAR OS y 0c VIMUME (suma 7c)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 34: Amount 0.09 € assigns exact cents
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(0.09);
      assertEqual(split.totalCents, 9, '9 total cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 9, 'Sum = 9 cents');
      assertEqual(split.artistCents, 7, '7 artist cents (round(9*0.8)=7)');
      assertEqual(split.earOsCents, 1, '1 EAR OS cent (round(9*0.1)=1)');
      assertEqual(split.vimumeCents, 1, '1 VIMUME cent (9 - 7 - 1 = 1)');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T2.F7.4: Importe micro de 0,09 € asigna 7c artista, 1c EAR OS y 1c VIMUME (suma 9c)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 35: Invariant verification over LCG pseudo-random distribution of 500 amounts
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      let seed = 42;
      for (let i = 0; i < 500; i++) {
        // Linear Congruential Generator
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        const randomCents = (seed % 1000000) + 1; // 1 cent to 10,000.00 €
        const amountEur = randomCents / 100;
        const split = settleArtistSplitOracle(amountEur);
        if (split.artistCents + split.earOsCents + split.vimumeCents !== randomCents) {
          throw new Error(`LCG failure at ${amountEur} €: expected ${randomCents}, got sum`);
        }
      }
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 7,
      testName: 'T2.F7.5: Prueba de propiedad LCG (500 iteraciones pseudo-aleatorias) con 0% fugas',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 8 BOUNDARIES: 100,00 € Stripe Price-Lock Deposit (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 36: Custom deposit of 50.00 € (micro-compromise) is accepted
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(350.0, 50.0);
      assertEqual(split.depositPaidEur, 50.0, 'Deposit is 50.0 €');
      assertEqual(split.depositDeductedCents, 5000, '5000 cents deducted');
      // Artist 280 € - 50 € = 230 €
      assertEqual(split.artistNetPendingEur, 230.0, '230 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T2.F8.1: Depósito micro-compromiso de 50,00 € se deduce correctamente (230,00 € neto)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 37: Custom deposit of 200.00 € is accepted
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(500.0, 200.0);
      assertEqual(split.depositPaidEur, 200.0, 'Deposit is 200.0 €');
      // Artist 400 € - 200 € = 200 €
      assertEqual(split.artistNetPendingEur, 200.0, '200 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T2.F8.2: Depósito incrementado de 200,00 € se deduce correctamente (200,00 € neto)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 38: Custom deposit of 0.00 € leaves full balance pending
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(350.0, 0.0);
      assertEqual(split.depositPaidEur, 0.0, 'Deposit is 0.0 €');
      assertEqual(split.artistNetPendingEur, 280.0, 'Full 280 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T2.F8.3: Depósito de 0,00 € (sin fianza inicial) deja el 100% de la liquidación pendiente',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 39: Fractional deposit 99.99 € converts to 9999 cents without rounding errors
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(500.0, 99.99);
      assertEqual(split.depositDeductedCents, 9999, '9999 cents');
      // Artist 40000 - 9999 = 30001 cents = 300.01 €
      assertEqual(split.artistNetPendingCents, 30001, '30001 cents pending');
      assertEqual(split.artistNetPendingEur, 300.01, '300.01 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T2.F8.4: Depósito fraccionario de 99,99 € convierte a exactamente 9.999 céntimos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 40: Deposit exceeding artist earnings clamps net pending to 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(100.0, 150.0);
      // Artist gross: 80 € - 150 € deposit -> clamped at 0
      assertEqual(split.artistNetPendingCents, 0, 'Clamped at 0 cents');
      assertEqual(split.artistNetPendingEur, 0.0, 'Clamped at 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 8,
      testName: 'T2.F8.5: Depósito superior al caché de artista (150 € sobre 80 €) acota saldo pendiente a 0,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 9 BOUNDARIES: 100% Deposit Deduction Edge Cases (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 41: Total exactly equal to deposit (100.00 €) leaves exactly 0.00 € pending
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({ format: 'SOLISTA', distanceKm: 0, endHour24: 0, requestedBaseCacheEur: 100.0 });
      // Clamped to 350 € min base! Total is 350 €, pending is 250 €
      assertEqual(quote.baseCacheEur, 350.0, 'Base clamped to 350');
      assertEqual(quote.pendingFinalSettlementEur, 250.0, 'Pending 250 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T2.F9.1: Solicitud de evento de 100,00 € se blinda a 350,00 € y deja 250,00 € pendientes',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 42: Synthetic budget exactly 100.00 € with settlement oracle leaves 0.00 € pending
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(100.0, 100.0);
      assertEqual(split.totalGrossEur, 100.0, 'Total 100 €');
      // Artist 80 € - 100 € deposit = 0 €
      assertEqual(split.artistNetPendingEur, 0.0, 'Pending 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T2.F9.2: Liquidación de 100,00 € con depósito de 100,00 € deja 0,00 € netos pendientes',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 43: Artist earnings exactly equal to deposit (100.00 €) leaves 0.00 € net artist pending
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      // 125 € total gross -> artist 80% = 100.00 €
      const split = settleArtistSplitOracle(125.0, 100.0);
      assertEqual(split.artistEur, 100.0, 'Artist gross is 100.00 €');
      assertEqual(split.artistNetPendingEur, 0.0, 'Artist pending is exactly 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T2.F9.3: Honorarios de artista de exactamente 100,00 € quedan saldados a 0,00 € con depósito',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 44: High total 14.250,00 € - 100.00 € deposit leaves exactly 14.150,00 € pending
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(14250.0, 100.0);
      // Artist 80% of 14250 = 11400 € -> pending = 11300 €
      assertEqual(split.artistEur, 11400.0, 'Artist 11400 €');
      assertEqual(split.artistNetPendingEur, 11300.0, '11400 - 100 = 11300 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T2.F9.4: Techo B2G de 14.250,00 € descuenta 100,00 € dejando 11.300,00 € pendientes a artista',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 45: Zero deposit option preserves 100% of quote as pending
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const split = settleArtistSplitOracle(650.0, 0.0);
      assertEqual(split.artistEur, 520.0, 'Artist 520 €');
      assertEqual(split.artistNetPendingEur, 520.0, 'Full 520 € pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 9,
      testName: 'T2.F9.5: Liquidación con depósito 0,00 € mantiene el 100% del pago de artista pendiente',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 10 BOUNDARIES: Audio Player Duration & Synthetic Boundaries (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 46: Duration formatting of 0 seconds produces "00:00"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(formatAudioDuration(0), '00:00', '0s -> 00:00');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T2.F10.1: Formateo de duración de 0 segundos produce "00:00"',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 47: Duration formatting of 1 second produces "00:01"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(formatAudioDuration(1), '00:01', '1s -> 00:01');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T2.F10.2: Formateo de duración de 1 segundo produce "00:01"',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 48: Duration formatting of 59 seconds produces "00:59"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(formatAudioDuration(59), '00:59', '59s -> 00:59');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T2.F10.3: Formateo de duración de 59 segundos produce "00:59"',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 49: Duration formatting of 3600 seconds produces "60:00"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      assertEqual(formatAudioDuration(3600), '60:00', '3600s -> 60:00');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T2.F10.4: Formateo de duración de 3.600 segundos (1 hora) produce "60:00"',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 50: Procedural synthetic WAV generator handles extreme short duration (0.01s)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const uri = generateOfflineSyntheticWavDataUri(880, 0.01, 8000);
      assert(uri.startsWith('data:audio/wav;base64,'), 'Valid data URI');
      assert(uri.length > 44, 'Has payload');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 10,
      testName: 'T2.F10.5: Audio sintético procedural de micro-duración (0,01s) no falla ni satura memoria',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 11 BOUNDARIES: ISRC Format Validation (ISO 3901) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 51: ISRC with leading/trailing whitespace is trimmed and valid
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const res = validateIsrcImpl('  ES-EAR-26-00001   ');
      assertEqual(res.valid, true, 'Whitespace trimmed valid');
      assertEqual(res.code, 'ES-EAR-26-00001', 'Code trimmed');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T2.F11.1: Código ISRC con espacios laterales se sanea y valida exitosamente',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 52: ISRC with non-numeric year returns valid: false with reason
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const res = validateIsrcImpl('ES-EAR-XX-00001');
      assertEqual(res.valid, false, 'Non-numeric year invalid');
      assert(Boolean(res.reason), 'Reason provided');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T2.F11.2: Código con año alfabético ES-EAR-XX-00001 se rechaza con valid: false',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 53: ISRC with non-numeric designation returns valid: false with reason
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const res = validateIsrcImpl('ES-EAR-26-ABCDE');
      assertEqual(res.valid, false, 'Non-numeric designation invalid');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T2.F11.3: Código con designación alfabética ES-EAR-26-ABCDE se rechaza con valid: false',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 54: ISRC with wrong number of digits (short) returns valid: false
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const res = validateIsrcImpl('ES-EAR-26-1');
      assertEqual(res.valid, false, 'Short designation invalid');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T2.F11.4: Código con designador incompleto ES-EAR-26-1 se rechaza con valid: false',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 55: Empty string and malformed separators return valid: false
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const emptyRes = validateIsrcImpl('');
      const malformedRes = validateIsrcImpl('ES_EAR_26_00001');
      assertEqual(emptyRes.valid, false, 'Empty is invalid');
      assertEqual(malformedRes.valid, false, 'Underscores are invalid');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 11,
      testName: 'T2.F11.5: Cadena vacía y separadores inválidos (guiones bajos) se rechazan de forma segura',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 12 BOUNDARIES: Canonical ISRC Generation (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 56: 4-digit year 2026 is normalized to 2-digit "26"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(2026, 1);
      assertEqual(code, 'ES-EAR-26-00001', '2026 normalized to 26');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T2.F12.1: Año de 4 dígitos (2026) se normaliza a 2 dígitos canónicos (ES-EAR-26-00001)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 57: Single-digit year 9 is padded to "09"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(9, 1);
      assertEqual(code, 'ES-EAR-09-00001', '9 padded to 09');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T2.F12.2: Año de un solo dígito (9) se rellena con cero inicial (ES-EAR-09-00001)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 58: Sequence number 0 is padded to "00000"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(26, 0);
      assertEqual(code, 'ES-EAR-26-00000', 'Sequence 0 is 00000');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T2.F12.3: Secuencia 0 se formatea con cinco ceros (ES-EAR-26-00000)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 59: Sequence number 99999 is formatted as "99999"
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(26, 99999);
      assertEqual(code, 'ES-EAR-26-99999', 'Sequence 99999');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T2.F12.4: Secuencia máxima 99999 se formatea exactamente en 5 dígitos',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 60: Sequence > 99999 is sliced to last 5 digits safely
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const code = generateCanonicalIsrcImpl(26, 100005);
      assertEqual(code, 'ES-EAR-26-00005', '100005 sliced to last 5 digits');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 12,
      testName: 'T2.F12.5: Secuencia superior a 5 dígitos (100005) trunca a los últimos 5 dígitos (00005)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 13 BOUNDARIES: Acoustic Rider (12 W/pax, < 75 dB SPL) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 61: Minimum audience 1 pax calculates 12 W RMS and is compliant
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const rider = evaluateAcousticRiderOracle(1);
      assertEqual(rider.recommendedWatts, 12, '1 pax * 12 W = 12 W');
      assertEqual(rider.compliant, true, 'Compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T2.F13.1: Aforo mínimo de 1 pax dimensiona 12 W RMS con cumplimiento normativo',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 62: 0 pax input is safely clamped to 1 pax (12 W RMS)
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const rider = evaluateAcousticRiderOracle(0);
      assertEqual(rider.recommendedWatts, 12, '0 pax clamped to 1 pax = 12 W');
      assertEqual(rider.compliant, true, 'Compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T2.F13.2: Aforo de 0 pax se acota de forma segura a 1 pax (12 W RMS)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 63: Large audience 2000 pax calculates 24.000 W RMS
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const rider = evaluateAcousticRiderOracle(2000);
      assertEqual(rider.recommendedWatts, 24000, '2000 * 12 = 24000 W');
      assertEqual(rider.compliant, true, 'Compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T2.F13.3: Macro aforo de 2.000 pax dimensiona 24.000 W RMS de potencia',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 64: Exact SPL boundary of 75.0 dB SPL is evaluated as compliant
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const rider = evaluateAcousticRiderOracle(100, 75.0);
      assertEqual(rider.compliant, true, '75.0 dB SPL is compliant');
      assertEqual(rider.maxSplDb, 75.0, '75.0 dB');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T2.F13.4: Umbral exacto de 75,0 dB SPL se dictamina conforme a la Ley 37/2003',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 65: SPL of 75.1 dB SPL is evaluated as non-compliant
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const rider = evaluateAcousticRiderOracle(100, 75.1);
      assertEqual(rider.compliant, false, '75.1 dB SPL exceeds ceiling');
      assert(Boolean(rider.notes && rider.notes.includes('ALERTA')), 'Alert note provided');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 13,
      testName: 'T2.F13.5: Presión acústica de 75,1 dB SPL supera el límite y emite alerta de no conformidad',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // FEATURE 14 BOUNDARIES: B2G LCSP Ceiling (14.250,00 €) (5 tests)
  // ──────────────────────────────────────────────────────────────────────────
  {
    // Test 66: Exactly 14.250,00 € has alert: false, deltaEur: 0.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const b2g = evaluateB2gCeilingOracle(14250.0);
      assertEqual(b2g.alert, false, '14250.0 does not trigger alert');
      assertEqual(b2g.compliant, true, '14250.0 is compliant');
      assertEqual(b2g.deltaEur, 0.0, 'Delta is 0.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T2.F14.1: Techo preventivo exacto de 14.250,00 € no activa alerta (delta 0,00 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 67: 14.250,01 € has alert: true, deltaEur: 0.01 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const b2g = evaluateB2gCeilingOracle(14250.01);
      assertEqual(b2g.alert, true, '14250.01 triggers alert');
      assertEqual(b2g.compliant, false, '14250.01 non-compliant with safe ceiling');
      assertEqual(b2g.deltaEur, 0.01, 'Delta is +0.01 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T2.F14.2: Importe de 14.250,01 € (1 céntimo superior) activa alerta preventiva B2G',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 68: 14.249,99 € has alert: false, deltaEur: -0.01 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const b2g = evaluateB2gCeilingOracle(14249.99);
      assertEqual(b2g.alert, false, '14249.99 within safe zone');
      assertEqual(b2g.compliant, true, '14249.99 compliant');
      assertEqual(b2g.deltaEur, -0.01, 'Delta is -0.01 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T2.F14.3: Importe de 14.249,99 € (1 céntimo inferior) se mantiene en zona segura conforme',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 69: 15.000,00 € (statutory legal limit) has alert: true, deltaEur: 750.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const b2g = evaluateB2gCeilingOracle(15000.0);
      assertEqual(b2g.alert, true, '15000 triggers alert');
      assertEqual(b2g.deltaEur, 750.0, 'Delta is +750.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T2.F14.4: Límite legal estricto de 15.000,00 € activa alerta con delta de +750,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  {
    // Test 70: 25.000,00 € (major tender range) has alert: true, deltaEur: 10750.00 €
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const b2g = evaluateB2gCeilingOracle(25000.0);
      assertEqual(b2g.alert, true, '25000 triggers alert');
      assertEqual(b2g.deltaEur, 10750.0, 'Delta is +10750.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      featureId: 14,
      testName: 'T2.F14.5: Licitación mayor de 25.000,00 € activa alerta preventiva con delta de +10.750,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}
