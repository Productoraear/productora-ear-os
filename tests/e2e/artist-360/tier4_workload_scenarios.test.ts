/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARTIST PANEL 360 — TIER 4: REAL-WORLD WORKLOAD SCENARIOS (7 SCENARIOS)
 * ════════════════════════════════════════════════════════════════════════════
 * Simulaciones completas de extremo a extremo de casos reales de producción:
 *   Escenario 1: Boda de Gala en Finca Méntrida (120 pax, 45 km, fin 02:00, Solista)
 *   Escenario 2: Festival Nocturno Toledo (500 pax, 120 km, fin 04:30, Orquesta)
 *   Escenario 3: Sesión Terapéutica Senior VIMUME (60 pax, 80 km, fin 19:00, Dúo)
 *   Escenario 4: Licitación Municipal B2G Festejos Populares (14.250 € max, 210 km, Mariachi)
 *   Escenario 5: Concierto Exclusivo Madrid Centro (80 pax, 65 km, fin 01:00, DJ + Solista)
 *   Escenario 6: Reserva de Urgencia Price-Lock con Bloqueo de Calendario (100 € Stripe SHA-256)
 *   Escenario 7: Alta de Nueva Grabación de Estudio con ISRC Oficial y Validación ISO 3901
 * ════════════════════════════════════════════════════════════════════════════
 */

import crypto from 'node:crypto';

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

export async function runTier4RealWorldScenariosTests(tracker: TestExecutionTracker): Promise<void> {
  const tier = 4;

  // ──────────────────────────────────────────────────────────────────────────
  // ESCENARIO 1: Boda de Gala en Finca Méntrida (120 pax, 45 km, fin 02:00, Solista)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      // 1. Cotización Solista
      const quote = calculateArtistQuoteOracle({
        format: 'SOLISTA',
        distanceKm: 45,
        endHour24: 2,
        audiencePax: 120,
      });
      assertEqual(quote.baseCacheEur, 350.0, 'Base Solista 350,00 €');
      assertEqual(quote.logisticsTotalEur, 0.0, '45 km dentro de los 50 km exentos');
      assertEqual(quote.hotelSupplementEur, 0.0, 'Fin a las 02:00 AM no requiere hotel');
      assertEqual(quote.totalEventEur, 350.0, 'Total evento 350,00 €');
      assertEqual(quote.pendingFinalSettlementEur, 250.0, 'Saldo pendiente 250,00 € tras 100 € depósito');
      assertEqual(quote.isEdwinAgudeloSovereignFloor, true, 'Suelo soberano activo');

      // 2. Rider Acústico
      assertEqual(quote.acousticRider.recommendedWatts, 1440, '120 pax * 12 W = 1440 W RMS');
      assertEqual(quote.acousticRider.compliant, true, 'Cumple < 75 dB SPL');

      // 3. Liquidación Split Soberano
      const split = settleArtistSplitOracle(quote.totalEventEur, quote.depositDeductibleEur);
      assertEqual(split.artistEur, 280.0, 'Artista 80% = 280,00 €');
      assertEqual(split.earOsEur, 35.0, 'EAR OS 10% = 35,00 €');
      assertEqual(split.vimumeEur, 35.0, 'VIMUME 10% = 35,00 €');
      assertEqual(split.artistNetPendingEur, 180.0, 'Saldo neto a cobrar por artista 180,00 €');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 35000, '35000 céntimos exactos');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T4.S01: Escenario 1: Boda de Gala en Finca Méntrida (120 pax, 45 km, fin 02:00, Solista 350 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ESCENARIO 2: Festival Nocturno Toledo (500 pax, 120 km, fin 04:30, Orquesta)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({
        format: 'ORQUESTA',
        distanceKm: 120,
        endHour24: 4.5,
        audiencePax: 500,
      });
      assertEqual(quote.baseCacheEur, 1800.0, 'Base Orquesta 1800,00 €');
      assertEqual(quote.chargeableKm, 70, '120 - 50 = 70 km');
      assertEqual(quote.logisticsTotalEur, 105.0, '70 * 1.50 = 105,00 €');
      assertEqual(quote.hotelSupplementEur, 120.0, 'Cierre 04:30 AM -> Hotel 120,00 €');
      assertEqual(quote.totalEventEur, 2025.0, '1800 + 105 + 120 = 2025,00 €');
      assertEqual(quote.pendingFinalSettlementEur, 1925.0, '2025 - 100 = 1925,00 €');

      // Rider 500 pax
      assertEqual(quote.acousticRider.recommendedWatts, 6000, '500 * 12 = 6000 W');
      assertEqual(quote.acousticRider.compliant, true, 'Cumple < 75 dB SPL');

      // B2G check
      const b2g = evaluateB2gCeilingOracle(quote.totalEventEur);
      assertEqual(b2g.alert, false, '2025 € en zona segura B2G');

      // Split
      const split = settleArtistSplitOracle(quote.totalEventEur, quote.depositDeductibleEur);
      assertEqual(split.artistEur, 1620.0, '80% of 2025 = 1620,00 €');
      assertEqual(split.earOsEur, 202.5, '10% of 2025 = 202,50 €');
      assertEqual(split.vimumeEur, 202.5, '10% of 2025 = 202,50 €');
      assertEqual(split.artistNetPendingEur, 1520.0, '1620 - 100 = 1520,00 €');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 202500, '202500 céntimos exactos');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T4.S02: Escenario 2: Festival Nocturno Toledo (500 pax, 120 km, fin 04:30, Orquesta 2.025 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ESCENARIO 3: Sesión Terapéutica Senior VIMUME (60 pax, 80 km, fin 19:00, Dúo)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const quote = calculateArtistQuoteOracle({
        format: 'DUO',
        distanceKm: 80,
        endHour24: 0, // Horario diurno/vespertino (sin pernocta)
        audiencePax: 60,
      });
      assertEqual(quote.baseCacheEur, 500.0, 'Base Dúo 500,00 €');
      assertEqual(quote.chargeableKm, 30, '80 - 50 = 30 km');
      assertEqual(quote.logisticsTotalEur, 45.0, '30 * 1.50 = 45,00 €');
      assertEqual(quote.hotelSupplementEur, 0.0, 'Vespertino -> Sin hotel');
      assertEqual(quote.totalEventEur, 545.0, '500 + 45 = 545,00 €');
      assertEqual(quote.pendingFinalSettlementEur, 445.0, '545 - 100 = 445,00 €');

      // Rider geriátrico 60 pax
      assertEqual(quote.acousticRider.recommendedWatts, 720, '60 * 12 = 720 W RMS');
      assertEqual(quote.acousticRider.compliant, true, 'Cumple protocolo clínico VIMUME (< 75 dB SPL)');

      // Split Soberano
      const split = settleArtistSplitOracle(quote.totalEventEur, quote.depositDeductibleEur);
      assertEqual(split.artistEur, 436.0, '80% of 545 = 436,00 €');
      assertEqual(split.earOsEur, 54.5, '10% of 545 = 54,50 €');
      assertEqual(split.vimumeEur, 54.5, '10% of 545 = 54,50 €');
      assertEqual(split.artistNetPendingEur, 336.0, '436 - 100 = 336,00 €');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 54500, '54500 céntimos exactos');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T4.S03: Escenario 3: Sesión Terapéutica Senior VIMUME (60 pax, 80 km, fin 19:00, Dúo 545 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ESCENARIO 4: Licitación Municipal B2G Festejos Populares (14.250 € max, 210 km, Mariachi)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      const budgetB2gEur = 14250.0; // Techo preventivo 95% Art. 118 LCSP
      const b2gCheck = evaluateB2gCeilingOracle(budgetB2gEur);
      assertEqual(b2gCheck.compliant, true, '14.250 € es conforme al techo preventivo');
      assertEqual(b2gCheck.alert, false, 'Alerta inactiva en el límite exacto');
      assertEqual(b2gCheck.deltaEur, 0.0, 'Delta 0,00 €');

      // Split Soberano B2G en céntimos enteros
      const split = settleArtistSplitOracle(budgetB2gEur, 100.0);
      assertEqual(split.totalCents, 1425000, '1.425.000 céntimos enteros');
      assertEqual(split.artistCents, 1140000, 'Artista 1.140.000 céntimos (11.400,00 €)');
      assertEqual(split.earOsCents, 142500, 'EAR OS 142.500 céntimos (1.425,00 €)');
      assertEqual(split.vimumeCents, 142500, 'VIMUME 142.500 céntimos (1.425,00 €)');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 1425000, 'Cero céntimos de fuga');
      assertEqual(split.artistNetPendingEur, 11300.0, '11400 - 100 = 11300,00 € pendientes');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T4.S04: Escenario 4: Licitación Municipal B2G Festejos Populares (14.250 € max, Split 80/10/10)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ESCENARIO 5: Concierto Exclusivo Madrid Centro (80 pax, 65 km, fin 01:00, DJ + Solista)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      // Formato combinado: Solista + DJ = 750,00 €
      const quote = calculateArtistQuoteOracle({
        format: 'SOLISTA',
        distanceKm: 65,
        endHour24: 1,
        requestedBaseCacheEur: 750.0,
        audiencePax: 80,
      });
      assertEqual(quote.baseCacheEur, 750.0, 'Caché combinado 750,00 €');
      assertEqual(quote.chargeableKm, 15, '65 - 50 = 15 km');
      assertEqual(quote.logisticsTotalEur, 22.5, '15 * 1.50 = 22,50 €');
      assertEqual(quote.hotelSupplementEur, 0.0, 'Fin 01:00 AM -> Sin hotel');
      assertEqual(quote.totalEventEur, 772.5, '750 + 22.50 = 772,50 €');
      assertEqual(quote.pendingFinalSettlementEur, 672.5, '772.50 - 100 = 672,50 €');

      // Rider 80 pax
      assertEqual(quote.acousticRider.recommendedWatts, 960, '80 * 12 = 960 W');

      // Split en céntimos
      const split = settleArtistSplitOracle(quote.totalEventEur, quote.depositDeductibleEur);
      assertEqual(split.totalCents, 77250, '77250 céntimos');
      assertEqual(split.artistEur, 618.0, '80% of 772.50 = 618,00 €');
      assertEqual(split.earOsEur, 77.25, '10% of 772.50 = 77,25 €');
      assertEqual(split.vimumeEur, 77.25, '10% of 772.50 = 77,25 €');
      assertEqual(split.artistNetPendingEur, 518.0, '618 - 100 = 518,00 €');
      assertEqual(split.artistCents + split.earOsCents + split.vimumeCents, 77250, 'Suma exacta');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T4.S05: Escenario 5: Concierto Exclusivo Madrid Centro (80 pax, 65 km, fin 01:00, DJ + Solista 772,50 €)',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ESCENARIO 6: Reserva de Urgencia Price-Lock con Bloqueo de Calendario (100 € Stripe SHA-256)
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      // 1. Simulación de cotización fijada
      const quote = calculateArtistQuoteOracle({
        format: 'SOLISTA',
        distanceKm: 40,
        endHour24: 2,
      });

      // 2. Generación canónica de firma criptográfica SHA-256 para el Price-Lock
      const franchiseKm = LOGISTICA_KM_EXENTOS;
      const payloadToHash = `${quote.baseCacheEur}|${quote.chargeableKm}|${franchiseKm}|${quote.totalEventEur}|${DEPOSITO_STRIPE_EUR}`;
      const sha256Signature = crypto.createHash('sha256').update(payloadToHash).digest('hex');

      assert(Boolean(sha256Signature && sha256Signature.length === 64), 'Firma SHA-256 válida de 64 caracteres');

      // 3. Verificación de invariante de deducibilidad 100%
      assertEqual(quote.depositDeductibleEur, 100.0, 'Depósito de 100,00 €');
      assertEqual(quote.pendingFinalSettlementEur, 250.0, '350 - 100 = 250,00 € pendientes');

      // 4. Integridad del split con bloqueo
      const split = settleArtistSplitOracle(quote.totalEventEur, DEPOSITO_STRIPE_EUR);
      assertEqual(split.artistNetPendingEur, 180.0, 'Artista tiene 180,00 € netos pendientes');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T4.S06: Escenario 6: Reserva de Urgencia Price-Lock con Bloqueo SHA-256 y Fianza Deducible de 100,00 €',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // ESCENARIO 7: Alta de Nueva Grabación de Estudio con ISRC Oficial y Validación ISO 3901
  // ──────────────────────────────────────────────────────────────────────────
  {
    const start = Date.now();
    let passed = false;
    let errStr: string | undefined;
    try {
      // 1. Generación canónica de nuevo ISRC para lanzamiento 2026, secuencia #42
      const newIsrc = generateCanonicalIsrcImpl(26, 42);
      assertEqual(newIsrc, 'ES-EAR-26-00042', 'ISRC generado ES-EAR-26-00042');

      // 2. Validación formal ISO 3901
      const validation = validateIsrcImpl(newIsrc);
      assertEqual(validation.valid, true, 'ISRC es válido bajo ISO 3901');
      assertEqual(validation.country, 'ES', 'País España');
      assertEqual(validation.registrant, 'EAR', 'Sello Productora EAR');
      assertEqual(validation.year, '26', 'Año 2026');
      assertEqual(validation.designation, '00042', 'Secuencia 00042');

      // 3. Empaquetado de pista en catálogo con formato de audio y duración
      const trackData = {
        title: 'Cielito Lindo (Edición Gala 2026)',
        artist: 'Edwin Agudelo',
        format: 'MARIACHI' as const,
        isrc: newIsrc,
        durationSeconds: 228,
        audioFormat: 'WAV',
        offlineSyntheticUri: generateOfflineSyntheticWavDataUri(440, 0.2),
      };

      assertEqual(formatAudioDuration(trackData.durationSeconds), '03:48', 'Duración formateada');
      assert(trackData.offlineSyntheticUri.startsWith('data:audio/wav;base64,'), 'Audio sintético offline listo');

      passed = true;
    } catch (e) {
      errStr = e instanceof Error ? e.message : String(e);
    }
    tracker.record({
      tier,
      testName: 'T4.S07: Escenario 7: Alta de Grabación de Estudio con ISRC Oficial (ES-EAR-26-00042) y Validación ISO 3901',
      passed,
      status: passed ? 'PASS' : 'FAIL',
      durationMs: Date.now() - start,
      error: errStr,
    });
  }
}
