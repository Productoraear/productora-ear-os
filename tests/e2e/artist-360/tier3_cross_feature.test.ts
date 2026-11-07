/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST PANEL 360 — TIER 3: CROSS-FEATURE INTERACTIONS (14 COMBINATIONS)
 * ════════════════════════════════════════════════════════════════════════════
 * Cobertura de combinaciones cruzadas e interacciones multidominio:
 *   Format × Distance × Hotel × Split × Deposit × Rider × B2G × ISRC
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
  CANONICAL_EDWIN_TRACKS,
  assert,
  assertEqual,
  assertCloseTo,
  TestExecutionTracker,
} from './test_contracts';

export async function runTier3CrossFeatureTests(tracker: TestExecutionTracker): Promise<void> {
  const tier = 3;

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 1: Solista + Exemption (45 km) + Normal End (01:00 AM) + Deposit + Split
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 45, endHour24: 1 });
      assertEqual(quote.baseCacheEur, 350.0, 'Base Solista 350 €');
      assertEqual(quote.logisticsTotalEur, 0.0, 'Within 50 km exempt');
      assertEqual(quote.hotelSupplementEur, 0.0, 'End at 01:00 AM, no hotel');
      assertEqual(quote.totalEventEur, 350.0, 'Total 350 €');
      assertEqual(quote.pendingFinalSettlementEur, 250.0, '350 - 100 = 250 € pending');

      const split = settleArtistSplitImpl(quote.totalEventEur);
      assertEqual(split.artistAmountEur, 280.0, 'Artist 80% = 280 €');
      assertEqual(split.earOsAmountEur, 35.0, 'EAR OS 10% = 35 €');
      assertEqual(split.vimumeAmountEur, 35.0, 'VIMUME 10% = 35 €');
      assertEqual(split.artistNetPendingEur, 180.0, '280 - 100 = 180 € net pending');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C01: Solista + Franquicia 45 km + Fin 01:00 AM + Depósito 100 € + Split 80/10/10',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 2: Duo + Moderate Distance (120 km) + 02:00 AM + 100 € Deposit
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'DUO', distanceKm: 120, endHour24: 2 });
      assertEqual(quote.baseCacheEur, 500.0, 'Base Duo 500 €');
      assertEqual(quote.chargeableKm, 70, '120 - 50 = 70 km');
      assertEqual(quote.logisticsTotalEur, 105.0, '70 * 1.50 = 105.00 €');
      assertEqual(quote.hotelSupplementEur, 0.0, 'Hour 2 < 3, no hotel');
      assertEqual(quote.totalEventEur, 605.0, '500 + 105 = 605.00 €');
      assertEqual(quote.pendingFinalSettlementEur, 505.0, '605 - 100 = 505.00 €');

      const split = settleArtistSplitImpl(quote.totalEventEur);
      assertEqual(split.artistAmountEur, 484.0, '80% of 605 = 484.00 €');
      assertEqual(split.earOsAmountEur, 60.5, '10% of 605 = 60.50 €');
      assertEqual(split.vimumeAmountEur, 60.5, '10% of 605 = 60.50 €');
      assertEqual(split.artistNetPendingEur, 384.0, '484 - 100 = 384.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C02: Dúo + Desplazamiento 120 km + Fin 02:00 AM + Depósito 100 € + Liquidación',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 3: Mariachi + Long Distance (250 km) + 04:00 AM (Both Hotel Triggers)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'MARIACHI', distanceKm: 250, endHour24: 4 });
      assertEqual(quote.baseCacheEur, 650.0, 'Base Mariachi 650 €');
      assertEqual(quote.chargeableKm, 200, '250 - 50 = 200 km');
      assertEqual(quote.logisticsTotalEur, 300.0, '200 * 1.50 = 300.00 €');
      assertEqual(quote.hotelSupplementEur, 120.0, 'Hotel 120 €');
      assertEqual(quote.totalEventEur, 1070.0, '650 + 300 + 120 = 1070.00 €');
      assertEqual(quote.pendingFinalSettlementEur, 970.0, '1070 - 100 = 970.00 €');

      const split = settleArtistSplitImpl(quote.totalEventEur);
      assertEqual(split.artistAmountEur, 856.0, '80% of 1070 = 856.00 €');
      assertEqual(split.earOsAmountEur, 107.0, '10% of 1070 = 107.00 €');
      assertEqual(split.vimumeAmountEur, 107.0, '10% of 1070 = 107.00 €');
      assertEqual(split.artistNetPendingEur, 756.0, '856 - 100 = 756.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C03: Mariachi + Larga Distancia 250 km + Fin 04:00 AM + Hotel + Split Soberano',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 4: Orquesta + 80 km + 500 pax Acoustic Rider + Split Remainder
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'ORQUESTA', distanceKm: 80, endHour24: 1 });
      assertEqual(quote.baseCacheEur, 1800.0, 'Base Orquesta 1800 €');
      assertEqual(quote.chargeableKm, 30, '80 - 50 = 30 km');
      assertEqual(quote.logisticsTotalEur, 45.0, '30 * 1.50 = 45.00 €');
      assertEqual(quote.totalEventEur, 1845.0, '1800 + 45 = 1845.00 €');

      const rider = evaluateAcousticRiderOracle(500);
      assertEqual(rider.recommendedWatts, 6000, '500 * 12 = 6000 W');
      assertEqual(rider.compliant, true, 'Compliant');

      const split = settleArtistSplitImpl(quote.totalEventEur);
      assertEqual(split.artistAmountEur, 1476.0, '80% of 1845 = 1476.00 €');
      assertEqual(split.earOsAmountEur, 184.5, '10% of 1845 = 184.50 €');
      assertEqual(split.vimumeAmountEur, 184.5, '10% of 1845 = 184.50 €');
      assertEqual(split.artistNetPendingEur, 1376.0, '1476 - 100 = 1376.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C04: Orquesta + 80 km + Rider 500 pax (6.000 W) + Split 80/10/10',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 5: DJ + Méntrida Exemption (45 km) + Late Night 03:30 AM (Hotel)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'DJ', distanceKm: 45, endHour24: 3.5 });
      assertEqual(quote.baseCacheEur, 400.0, 'Base DJ 400 €');
      assertEqual(quote.logisticsTotalEur, 0.0, '45 km within exemption');
      assertEqual(quote.hotelSupplementEur, 120.0, 'Hour 3.5 >= 3:00 AM -> Hotel 120 €');
      assertEqual(quote.totalEventEur, 520.0, '400 + 120 = 520.00 €');
      assertEqual(quote.pendingFinalSettlementEur, 420.0, '520 - 100 = 420.00 €');

      const split = settleArtistSplitImpl(quote.totalEventEur);
      assertEqual(split.artistAmountEur, 416.0, '80% of 520 = 416.00 €');
      assertEqual(split.earOsAmountEur, 52.0, '10% of 520 = 52.00 €');
      assertEqual(split.vimumeAmountEur, 52.0, '10% of 520 = 52.00 €');
      assertEqual(split.artistNetPendingEur, 316.0, '416 - 100 = 316.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C05: DJ + Franquicia 45 km + Cierre 03:30 AM (Hotel 120 €) + Depósito y Split',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 6: Solista Under-Floor Attempt (250 €) + 210 km + B2G Safe Check
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 210, endHour24: 1, customBaseCacheEur: 250 });
      assertEqual(quote.baseCacheEur, 350.0, 'Floor preserved 350 €');
      assertEqual(quote.chargeableKm, 160, '210 - 50 = 160 km');
      assertEqual(quote.logisticsTotalEur, 240.0, '160 * 1.50 = 240.00 €');
      assertEqual(quote.hotelSupplementEur, 120.0, '210 km > 200 km -> Hotel 120 €');
      assertEqual(quote.totalEventEur, 710.0, '350 + 240 + 120 = 710.00 €');

      const b2g = evaluateB2gCeilingOracle(quote.totalEventEur);
      assertEqual(b2g.alert, false, '710 € well below 14250 €');
      assertEqual(b2g.compliant, true, 'Compliant');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C06: Solista blindado (350 €) + 210 km + Hotel + Verificación techo B2G conforme',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 7: High Custom Cache (5000 €) + 150 km + 04:00 AM + 300 pax Rider
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'ORQUESTA', distanceKm: 150, endHour24: 4, customBaseCacheEur: 5000 });
      assertEqual(quote.baseCacheEur, 5000.0, '5000 € base');
      assertEqual(quote.logisticsTotalEur, 150.0, '100 * 1.50 = 150.00 €');
      assertEqual(quote.hotelSupplementEur, 120.0, 'Hotel 120 €');
      assertEqual(quote.totalEventEur, 5270.0, '5000 + 150 + 120 = 5270.00 €');

      const rider = evaluateAcousticRiderOracle(300);
      assertEqual(rider.recommendedWatts, 3600, '300 * 12 = 3600 W');

      const split = settleArtistSplitImpl(quote.totalEventEur);
      assertEqual(split.artistAmountEur, 4216.0, '80% of 5270 = 4216.00 €');
      assertEqual(split.earOsAmountEur, 527.0, '10% of 5270 = 527.00 €');
      assertEqual(split.vimumeAmountEur, 527.0, '10% of 5270 = 527.00 €');
      assertEqual(split.artistNetPendingEur, 4116.0, '4216 - 100 = 4116.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C07: Caché alto (5.000 €) + 150 km + Fin 04:00 AM + Rider 300 pax + Liquidación',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 8: Track Selection in Hi-Fi Audio Player + ISRC Validation + Format Link
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const track = CANONICAL_EDWIN_TRACKS[0]; // El Rey
      assertEqual(track.format, 'MARIACHI', 'Format is MARIACHI');
      assertEqual(track.isrc, 'ES-EAR-26-00001', 'ISRC is ES-EAR-26-00001');

      const isrcCheck = validateIsrcImpl(track.isrc);
      assertEqual(isrcCheck.valid, true, 'ISRC must be valid');
      assertEqual(isrcCheck.designation, '00001', 'Designation 00001');

      const formatBase = MIN_CACHE_BY_FORMAT[track.format];
      assertEqual(formatBase, 650.0, 'Mariachi base is 650 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C08: Reproductor Hi-Fi selecciona pista + Validación ISRC + Enlace a formato Mariachi',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 9: Odd Decimal Distance + Strict Penny Conservation Split + Deposit
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteImpl({ format: 'DUO', distanceKm: 77, endHour24: 1 });
      assertEqual(quote.chargeableKm, 27, '77 - 50 = 27 km');
      assertEqual(quote.logisticsTotalEur, 40.5, '27 * 1.50 = 40.50 €');
      assertEqual(quote.totalEventEur, 540.5, '500 + 40.50 = 540.50 €');

      const split = settleArtistSplitOracle(quote.totalEventEur);
      assertEqual(split.totalCents, 54050, '54050 cents');
      assertEqual(split.artistCents, 43240, '80% = 43240 cents');
      assertEqual(split.earOsCents, 5405, '10% = 5405 cents');
      assertEqual(split.vimumeCents, 5405, '10% = 5405 cents');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 54050, 'Sum = 54050 cents');
      assertEqual(split.artistNetPendingEur, 332.4, '432.40 - 100 = 332.40 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C09: Kilometraje decimal impar (77 km) + Conservación total de céntimos + Saldo neto',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 10: Acoustic Rider at Maximum Public Health SPL Ceiling + Solista Gala
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const rider = evaluateAcousticRiderOracle(100, 75.0);
      assertEqual(rider.recommendedWatts, 1200, '100 * 12 = 1200 W');
      assertEqual(rider.compliant, true, '75.0 dB is compliant');

      const quote = calculateArtistQuoteImpl({ format: 'SOLISTA', distanceKm: 35, endHour24: 1 });
      assertEqual(quote.baseCacheEur, 350.0, '350.0 €');
      assertEqual(quote.totalEventEur, 350.0, '350.0 € total');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C10: Gala Solista + Rider acústico al umbral límite de 75,0 dB SPL (Conforme Ley 37/2003)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 11: Near-Ceiling B2G Contract Proposal (14.200,00 €) + Split 80/10/10
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const b2g = evaluateB2gCeilingOracle(14200.0);
      assertEqual(b2g.alert, false, '14200 € within safe ceiling');
      assertEqual(b2g.compliant, true, 'Compliant');

      const split = settleArtistSplitOracle(14200.0);
      assertEqual(split.artistEur, 11360.0, '80% of 14200 = 11360.00 €');
      assertEqual(split.earOsEur, 1420.0, '10% of 14200 = 1420.00 €');
      assertEqual(split.vimumeEur, 1420.0, '10% of 14200 = 1420.00 €');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 1420000, 'Conserved 1420000c');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C11: Contrato menor B2G cercano al límite (14.200,00 €) + Split Soberano al céntimo',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 12: Over-Ceiling B2G Contract (14.500,00 €) Triggers Preventive Alert
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const b2g = evaluateB2gCeilingOracle(14500.0);
      assertEqual(b2g.alert, true, '14500 € > 14250 € triggers alert');
      assertEqual(b2g.compliant, false, 'Non-compliant with safe preventive threshold');
      assertEqual(b2g.deltaEur, 250.0, 'Delta is +250.00 €');

      const split = settleArtistSplitOracle(14500.0);
      assertEqual(split.artistEur, 11600.0, '80% of 14500 = 11600.00 €');
      assertEqual(split.earOsEur, 1450.0, '10% of 14500 = 1450.00 €');
      assertEqual(split.vimumeEur, 1450.0, '10% of 14500 = 1450.00 €');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C12: Licitación de 14.500,00 € dispara alerta preventiva B2G + Reparto exacto',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 13: Canonical ISRC Generation -> Catalog Integration -> Audio Duration Display
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const isrc = generateCanonicalIsrcImpl(26, 88);
      assertEqual(isrc, 'ES-EAR-26-00088', 'Generated ISRC');

      const validation = validateIsrcImpl(isrc);
      assertEqual(validation.valid, true, 'ISRC is valid');
      assertEqual(validation.country, 'ES', 'Country ES');

      const durationStr = formatAudioDuration(230);
      assertEqual(durationStr, '03:50', '230s -> 03:50');
      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C13: Generación ISRC canónico + Validación ISO 3901 + Visualización duración pista',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // COMBO 14: Complete 4-Layer End-to-End Synergy
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      // 1. Layer 1: Format & Reactive Logistics
      const quote = calculateArtistQuoteOracle({
        format: 'MARIACHI',
        distanceKm: 120,
        endHour24: 4,
        audiencePax: 150,
      });
      assertEqual(quote.baseCacheEur, 650.0, 'Mariachi 650 €');
      assertEqual(quote.logisticsTotalEur, 105.0, '70 * 1.50 = 105.00 €');
      assertEqual(quote.hotelSupplementEur, 120.0, 'Hotel 120.00 €');
      assertEqual(quote.totalEventEur, 875.0, '650 + 105 + 120 = 875.00 €');
      assertEqual(quote.pendingFinalSettlementEur, 775.0, '875 - 100 = 775.00 €');

      // 2. Layer 2: Audio Player Track Selection
      const track = CANONICAL_EDWIN_TRACKS[0];
      assert(Boolean(track.audioUrl), 'Track audio url exists');
      assertEqual(formatAudioDuration(track.durationSeconds), '03:15', 'Duration formatted');

      // 3. Layer 3: ISRC Validation & Canonical Generator
      const isrcCheck = validateIsrcImpl(track.isrc);
      assertEqual(isrcCheck.valid, true, 'ISRC is valid');
      const nextIsrc = generateCanonicalIsrcImpl(26, 99);
      assertEqual(nextIsrc, 'ES-EAR-26-00099', 'Next ISRC generated');

      // 4. Layer 4: Sovereign Split & Price-Lock Deposit
      const split = settleArtistSplitOracle(quote.totalEventEur, quote.depositDeductibleEur);
      assertEqual(split.artistEur, 700.0, '80% of 875 = 700.00 €');
      assertEqual(split.earOsEur, 87.5, '10% of 875 = 87.50 €');
      assertEqual(split.vimumeEur, 87.5, '10% of 875 = 87.50 €');
      assertEqual(split.artistNetPendingEur, 600.0, '700 - 100 = 600.00 €');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 87500, '87500 cents');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T3.C14: Sinergia completa de 4 Capas (Formato + Logística + Audio + ISRC + Split Soberano)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}
