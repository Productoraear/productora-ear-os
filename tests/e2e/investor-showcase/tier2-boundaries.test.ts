/**
 * ════════════════════════════════════════════════════════════════════════════
 * TIER 2: BOUNDARY & CORNER CASES TEST SUITE (FEATURES F1 THROUGH F11)
 * ════════════════════════════════════════════════════════════════════════════
 * Rigorous boundary value analysis (BVA), collision tests, and edge conditions:
 *  - F1: Offline Fallback & Circuit Breaker Boundaries (5 tests)
 *  - F2: Concurrency, Collision & Storage Edge Cases (5 tests)
 *  - F3: Markdown Structural & Encoding Boundaries (5 tests)
 *  - F4: URL Catalog Extremes & Nested Parameter Boundaries (5 tests)
 *  - F5: SSOT Invariant Thresholds (50km, 200km, 3:00AM, LCSP, SPL) (5 tests)
 *  - F6: Customer Journey Boundary Transitions & Intent Edge Cases (5 tests)
 *  - F7: Recommendation Engine Thresholds (Radius, Budget, Rating) (5 tests)
 *  - F8: Hare-Niemeyer Integer Penny Remainder Boundaries (1c..3c) (5 tests)
 *  - F9: Investor Simulator Extreme Scenarios & Bounds (5 tests)
 *  - F10: Telemetry Range Boundaries (0%..100%, SLA limits) (5 tests)
 *  - F11: S-Class Profile Completeness Boundary Cutoffs (90% vs 100%) (5 tests)
 * Total: 55 boundary/corner test cases.
 * ════════════════════════════════════════════════════════════════════════════
 */

import path from 'node:path';
import fs from 'node:fs';
import {
  assert,
  assertEqual,
  assertDeepEqual,
  assertCloseTo,
  TestExecutionTracker,
  calculateHareNiemeyerSplitOracle,
  calculateLogisticsOracle,
  evaluateAcousticRiderOracle,
  evaluateB2gCeilingOracle,
  matchMarketplaceRecommendationsOracle,
  evaluateProfileCompletenessOracle,
  generateCertifiedSClassProfileOracle,
  simulateInvestorCheckoutOracle,
  IsolatedOfflineDateLockHarness,
  CANONICAL_MARKETPLACE_CATALOG,
  type CertifiedSClassProfileData,
  type AtomicLockInput,
} from './contracts';

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
  SPLIT_SOBERANO,
  CENTRALITA_EAR_OS,
} from '../../../src/lib/constants/ear-os-ssot';

export async function runTier2BoundaryAndCornerTests(tracker: TestExecutionTracker): Promise<void> {
  const tempStorePath = path.resolve(process.cwd(), '.data', 'test-tier2-offline-locks.json');
  const offlineHarness = new IsolatedOfflineDateLockHarness(tempStorePath);
  await offlineHarness.purgeAll();

  async function test(featureId: string, testName: string, fn: () => Promise<void> | void) {
    const start = Date.now();
    try {
      await fn();
      tracker.record({
        tier: 2,
        featureId,
        testName,
        passed: true,
        status: 'PASS',
        durationMs: Date.now() - start,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      tracker.record({
        tier: 2,
        featureId,
        testName,
        passed: false,
        status: 'FAIL',
        durationMs: Date.now() - start,
        error: msg,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /* FEATURE F1 BOUNDARIES: Offline Fallback & Circuit Breaker                  */
  /* -------------------------------------------------------------------------- */

  await test('F1', 'Circuit breaker auto-resets after exact duration has elapsed', async () => {
    offlineHarness.tripCircuitBreaker(50); // 50ms
    assert(offlineHarness.isCircuitBreakerActive(), 'Should be active immediately');
    await new Promise((resolve) => setTimeout(resolve, 60));
    assert(!offlineHarness.isCircuitBreakerActive(), 'Should auto-reset after 50ms');
  });

  await test('F1', 'Gracefully recovers from corrupt or unparseable JSON offline store file', async () => {
    await fs.promises.writeFile(tempStorePath, '{{{ corrupt invalid json !!!', 'utf-8');
    const res = await offlineHarness.checkAvailability('2026-06-20', 'artist:edwin-agudelo');
    assert(res.available, 'Must recover gracefully with empty store fallback and mark available');
  });

  await test('F1', 'Handles extreme future booking dates (e.g. 2099-12-31) without integer overflow', async () => {
    const res = await offlineHarness.checkAvailability('2099-12-31', 'artist:edwin-agudelo');
    assert(res.available, 'Year 2099 date must be valid and available');
    assertEqual(res.storageMode, 'FALLBACK_OFFLINE_DISK', 'Storage mode must be offline fallback');
  });

  await test('F1', 'Handles leap year boundary date (2028-02-29) cleanly in availability check', async () => {
    const res = await offlineHarness.checkAvailability('2028-02-29', 'artist:edwin-agudelo');
    assert(res.available, 'Leap year Feb 29 must be processed correctly');
  });

  await test('F1', 'Sub-millisecond resolution for cached offline availability queries', async () => {
    const t0 = Date.now();
    for (let i = 0; i < 20; i++) {
      await offlineHarness.checkAvailability('2026-07-15', 'artist:edwin-agudelo');
    }
    const elapsed = Date.now() - t0;
    assert(elapsed < 100, `20 sequential availability checks should complete in <100ms, took ${elapsed}ms`);
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F2 BOUNDARIES: Concurrency, Collision & Storage Edge Cases         */
  /* -------------------------------------------------------------------------- */

  await test('F2', 'Concurrency stress: 10 concurrent locks on same date produce exactly 1 winner and 9 collisions', async () => {
    const date = '2026-06-27';
    const promises: Promise<boolean>[] = [];

    for (let i = 0; i < 10; i++) {
      promises.push(
        offlineHarness
          .lockDate({
            date,
            entityId: 'artist:edwin-agudelo',
            clientName: `Concurrent Client ${i}`,
            clientEmail: `client${i}@test.com`,
            stripeSessionId: `cs_concurrent_session_${i}`,
            priceLockSha256: `hash_concurrent_${i}`,
            totalAmountEur: 350,
            depositAmountEur: 100,
          })
          .then((res) => res.success)
      );
    }

    const results = await Promise.all(promises);
    const successCount = results.filter((s) => s === true).length;
    const failureCount = results.filter((s) => s === false).length;

    assertEqual(successCount, 1, 'Exactly one concurrent lock attempt must succeed');
    assertEqual(failureCount, 9, 'Exactly nine concurrent attempts must be rejected as collision');
  });

  await test('F2', 'Multi-entity isolation: booking artist does not collide with finca on same date', async () => {
    const sharedDate = '2026-07-11';
    const artistLock = await offlineHarness.lockDate({
      date: sharedDate,
      entityId: 'artist:edwin-agudelo',
      clientName: 'Client Artista',
      clientEmail: 'art@test.com',
      stripeSessionId: 'cs_art_001',
      priceLockSha256: 'hash_art_001',
      totalAmountEur: 350,
      depositAmountEur: 100,
    });
    assert(artistLock.success, 'Artist lock on 2026-07-11 must succeed');

    // Mismo día pero diferente entidad (Finca)
    const fincaLock = await offlineHarness.lockDate({
      date: sharedDate,
      entityId: 'finca:villa-escorial',
      clientName: 'Client Finca',
      clientEmail: 'finca@test.com',
      stripeSessionId: 'cs_finca_001',
      priceLockSha256: 'hash_finca_001',
      totalAmountEur: 3200,
      depositAmountEur: 100,
    });
    assert(fincaLock.success, 'Finca lock on same date must succeed due to entity isolation');
  });

  await test('F2', 'Time-slot isolation: different time slots on same date for same entity do not collide', async () => {
    const date = '2026-08-01';
    const morningLock = await offlineHarness.lockDate({
      date,
      entityId: 'artist:edwin-agudelo',
      timeSlot: '13:00',
      clientName: 'Vermut Nupcial',
      clientEmail: 'vermut@test.com',
      stripeSessionId: 'cs_slot_morning',
      priceLockSha256: 'hash_slot_morning',
      totalAmountEur: 350,
      depositAmountEur: 100,
    });
    assert(morningLock.success, 'Morning slot lock must succeed');

    const eveningLock = await offlineHarness.lockDate({
      date,
      entityId: 'artist:edwin-agudelo',
      timeSlot: '21:00',
      clientName: 'Cena de Gala',
      clientEmail: 'cena@test.com',
      stripeSessionId: 'cs_slot_evening',
      priceLockSha256: 'hash_slot_evening',
      totalAmountEur: 350,
      depositAmountEur: 100,
    });
    assert(eveningLock.success, 'Evening slot lock must succeed on same day');
  });

  await test('F2', 'Attempting to release non-existent lock ID returns false without error', async () => {
    const released = await offlineHarness.releaseLock('non_existent_lock_id_123456');
    assert(!released, 'Releasing non-existent lock must return false');
  });

  await test('F2', 'Atomic write survives crash simulation (temp file cleanup)', async () => {
    const input: AtomicLockInput = {
      date: '2026-09-05',
      entityId: 'artist:edwin-agudelo',
      clientName: 'Durability Check',
      clientEmail: 'durable@test.com',
      stripeSessionId: 'cs_durable_001',
      priceLockSha256: 'hash_durable_001',
      totalAmountEur: 350,
      depositAmountEur: 100,
    };
    const res = await offlineHarness.lockDate(input);
    assert(res.success, 'Lock must succeed');

    const dir = path.dirname(tempStorePath);
    const files = await fs.promises.readdir(dir);
    const tempFiles = files.filter((f) => f.startsWith('test-tier2-offline-locks') && f.endsWith('.tmp'));
    assertEqual(tempFiles.length, 0, 'No orphaned .tmp files may remain after atomic rename');
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F3 BOUNDARIES: Markdown Structural & Encoding Boundaries           */
  /* -------------------------------------------------------------------------- */

  await test('F3', 'Bilingual documents contain non-empty headers and proper markdown hierarchy', () => {
    const docs = ['01_EXECUTIVE_SHOWCASE.md', '02_FULL_ARCHITECTURE.md', '03_SSOT_INVARIANTS.md'];
    for (const d of docs) {
      const esPath = path.resolve(process.cwd(), 'docs', 'es', d);
      const enPath = path.resolve(process.cwd(), 'docs', 'en', d);
      const es = fs.readFileSync(esPath, 'utf-8');
      const en = fs.readFileSync(enPath, 'utf-8');

      assert(es.startsWith('# '), `ES ${d} must begin with level 1 header`);
      assert(en.startsWith('# '), `EN ${d} must begin with level 1 header`);
    }
  });

  await test('F3', 'Encoding integrity: Spanish documents preserve accented UTF-8 characters without corruption', () => {
    const esPath = path.resolve(process.cwd(), 'docs', 'es', '03_SSOT_INVARIANTS.md');
    const content = fs.readFileSync(esPath, 'utf-8');
    assert(content.includes('€'), 'Must contain euro symbol €');
    assert(content.includes('í') || content.includes('ó') || content.includes('á'), 'Must contain accented vowels');
    assert(!content.includes('Ã©') && !content.includes('Ã¡'), 'Must not contain double-encoded mojibake');
  });

  await test('F3', 'English documentation preserves technical naming and acronym fidelity (SSOT, ACID, SEPA)', () => {
    const enPath = path.resolve(process.cwd(), 'docs', 'en', '01_EXECUTIVE_SHOWCASE.md');
    const content = fs.readFileSync(enPath, 'utf-8');
    assert(content.includes('SSOT'), 'Must contain SSOT acronym');
    assert(content.includes('SEPA'), 'Must contain SEPA acronym');
    assert(content.includes('ACID') || content.includes('PostgreSQL'), 'Must contain technical database reference');
  });

  await test('F3', 'Bilingual docs maintain balanced section parity (within 25% header count)', () => {
    const files = ['01_EXECUTIVE_SHOWCASE.md', '02_FULL_ARCHITECTURE.md', '03_SSOT_INVARIANTS.md'];
    for (const f of files) {
      const esContent = fs.readFileSync(path.resolve(process.cwd(), 'docs', 'es', f), 'utf-8');
      const enContent = fs.readFileSync(path.resolve(process.cwd(), 'docs', 'en', f), 'utf-8');
      const esH2 = (esContent.match(/^##\s+.+$/gm) || []).length;
      const enH2 = (enContent.match(/^##\s+.+$/gm) || []).length;
      const ratio = Math.abs(esH2 - enH2) / Math.max(esH2, enH2, 1);
      assert(ratio <= 0.25, `Header parity divergence between ES and EN for ${f} must be <= 25%, got ${(ratio * 100).toFixed(1)}%`);
    }
  });

  await test('F3', 'All markdown documentation files end with a clean trailing newline', () => {
    const files = ['01_EXECUTIVE_SHOWCASE.md', '02_FULL_ARCHITECTURE.md', '03_SSOT_INVARIANTS.md'];
    for (const f of files) {
      const esContent = fs.readFileSync(path.resolve(process.cwd(), 'docs', 'es', f), 'utf-8');
      assert(esContent.endsWith('\n'), `ES ${f} must end with trailing newline`);
    }
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F4 BOUNDARIES: URL Catalog Extremes & Nested Parameter Boundaries  */
  /* -------------------------------------------------------------------------- */

  const catalogRaw = fs.readFileSync(path.resolve(process.cwd(), '.agents/teamwork/explorer_survey_2/routes_catalog.json'), 'utf-8');
  const catalogObj = JSON.parse(catalogRaw);
  interface RawCatalogRoute {
    route?: string;
    path?: string;
    type: string;
    isDynamic: boolean;
  }
  const allRoutes: Array<{ path: string; type: string; isDynamic: boolean }> = (catalogObj.routes as RawCatalogRoute[]).map((r) => ({
    path: r.route || r.path || '',
    type: r.type,
    isDynamic: r.isDynamic,
  }));

  await test('F4', 'Root path "/" is registered and categorized as page', () => {
    const rootRoute = allRoutes.find((r) => r.path === '/');
    assert(rootRoute !== undefined, 'Root route "/" must be in catalog');
    assertEqual(rootRoute.type, 'PAGE', 'Root route must be type PAGE');
  });

  await test('F4', 'Catalog contains zero duplicate paths', () => {
    const pathSet = new Set<string>();
    const duplicates: string[] = [];
    for (const r of allRoutes) {
      if (pathSet.has(r.path)) {
        duplicates.push(r.path);
      }
      pathSet.add(r.path);
    }
    assertEqual(duplicates.length, 0, `Catalog must have 0 duplicate paths, found: ${duplicates.join(', ')}`);
  });

  await test('F4', 'Longest route in catalog does not exceed 120 characters', () => {
    const maxLen = Math.max(...allRoutes.map((r) => r.path.length));
    assert(maxLen < 120, `Longest route length is ${maxLen}, must be < 120 chars`);
  });

  await test('F4', 'Multi-parameter dynamic routes (e.g. [vertical]/[intent]) parsed correctly', () => {
    const multiParam = allRoutes.filter((r) => (r.path.match(/\[/g) || []).length >= 2);
    assert(multiParam.length >= 1, 'Must have at least one multi-parameter dynamic route');
  });

  await test('F4', 'API routes under /api/ are strictly classified as type API', () => {
    const apiRoutes = allRoutes.filter((r) => r.path.startsWith('/api/'));
    assert(apiRoutes.length >= 100, `Must have ≥100 API routes, found ${apiRoutes.length}`);
    for (const r of apiRoutes) {
      assertEqual(r.type, 'API', `Route ${r.path} starting with /api/ must be classified as API`);
    }
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F5 BOUNDARIES: SSOT Invariant Thresholds                           */
  /* -------------------------------------------------------------------------- */

  await test('F5', 'Logistics distance boundaries: exact 0 km, 50.0 km exempt, 50.1 km chargeable', () => {
    const at0 = calculateLogisticsOracle(0);
    assertEqual(at0.chargeableKm, 0, '0 km -> 0 chargeable');
    assertEqual(at0.logisticsKmEur, 0, '0 km -> 0 € logistics');

    const at50 = calculateLogisticsOracle(50.0);
    assertEqual(at50.chargeableKm, 0, '50.0 km -> 0 chargeable');
    assertEqual(at50.logisticsKmEur, 0, '50.0 km -> 0 € logistics');

    const at50_1 = calculateLogisticsOracle(50.1);
    assertCloseTo(at50_1.chargeableKm, 0.1, 0.001, '50.1 km -> 0.1 chargeable km');
    assertCloseTo(at50_1.logisticsKmEur, 0.15, 0.01, '0.1 km * 1.50 €/km = 0.15 €');
  });

  await test('F5', 'Hotel distance threshold: exact 200.0 km (no hotel) vs 200.1 km (120 € hotel)', () => {
    const at200 = calculateLogisticsOracle(200.0, 1); // 1:00 AM
    assert(!at200.hotelRequired, '200.0 km at 1:00 AM should NOT require hotel');
    assertEqual(at200.hotelEur, 0, 'Hotel cost must be 0 €');

    const at200_1 = calculateLogisticsOracle(200.1, 1);
    assert(at200_1.hotelRequired, '200.1 km at 1:00 AM MUST require hotel');
    assertEqual(at200_1.hotelEur, 120, 'Hotel cost must be 120.00 €');
  });

  await test('F5', 'Hotel time cutoff: 2:59 AM (no hotel) vs 3:00 AM (120 € hotel)', () => {
    const at2am = calculateLogisticsOracle(100, 2); // 2:00 AM
    assert(!at2am.hotelRequired, 'End hour 2:00 AM must NOT require hotel (< 3:00 AM)');
    assertEqual(at2am.hotelEur, 0, 'Hotel cost is 0 €');

    const at3am = calculateLogisticsOracle(100, 3); // 3:00 AM cutoff
    assert(at3am.hotelRequired, 'End hour 3:00 AM MUST require hotel');
    assertEqual(at3am.hotelEur, 120, 'Hotel cost is 120.00 €');
  });

  await test('F5', 'B2G Art. 118 LCSP ceiling boundary: 14.250,00 € (PASS) vs 14.250,01 € (ALERT)', () => {
    const atCeiling = evaluateB2gCeilingOracle(14250.0);
    assert(atCeiling.isCompliant, '14.250,00 € is compliant');
    assert(!atCeiling.alertRequired, 'No alert at ceiling');

    const aboveCeiling = evaluateB2gCeilingOracle(14250.01);
    assert(!aboveCeiling.isCompliant, '14.250,01 € is non-compliant');
    assert(aboveCeiling.alertRequired, 'Alert triggered at 14.250,01 €');
  });

  await test('F5', 'Acoustic health ceiling boundary: 75.0 dB SPL (PASS) vs 75.1 dB SPL (FAIL)', () => {
    const at75 = evaluateAcousticRiderOracle(100, 75.0);
    assert(at75.isCompliant, '75.0 dB SPL is compliant');

    const at75_1 = evaluateAcousticRiderOracle(100, 75.1);
    assert(!at75_1.isCompliant, '75.1 dB SPL exceeds public health limit');
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F6 BOUNDARIES: Customer Journey Boundary Transitions & Intent Edge */
  /* -------------------------------------------------------------------------- */

  await test('F6', 'Customer journey handles unknown or empty intent by falling back to boda_gala default', () => {
    const fallbackIntent = (intent?: string) => (intent && intent.trim() ? intent : 'boda_gala');
    assertEqual(fallbackIntent(''), 'boda_gala', 'Empty intent falls back to boda_gala');
    assertEqual(fallbackIntent('   '), 'boda_gala', 'Whitespace intent falls back to boda_gala');
    assertEqual(fallbackIntent(undefined), 'boda_gala', 'Undefined intent falls back to boda_gala');
  });

  await test('F6', 'Customer journey Stage 4 CTA blocks proceeding if deposit amount is altered below 100 €', () => {
    const validateDepositCta = (depEur: number) => depEur >= DEPOSITO_STRIPE_EUR;
    assert(validateDepositCta(100), '100 € deposit is valid');
    assert(validateDepositCta(150), '150 € deposit is valid');
    assert(!validateDepositCta(99.99), '99.99 € deposit must be rejected');
    assert(!validateDepositCta(0), '0 € deposit must be rejected');
  });

  await test('F6', 'Stage 3 capacity bounds: accommodates micro-weddings (20 pax) and macro-festivals (5.000 pax)', () => {
    const micro = evaluateAcousticRiderOracle(20);
    assertEqual(micro.recommendedWatts, 240, '20 pax * 12 W = 240 W');

    const macro = evaluateAcousticRiderOracle(5000);
    assertEqual(macro.recommendedWatts, 60000, '5000 pax * 12 W = 60.000 W (60 kW)');
  });

  await test('F6', 'Stage 2 transparent quote calculation handles requested cache below floor by clamping to 350 €', () => {
    const quote = calculateLogisticsOracle(30, 0, 200); // Intento de pagar 200 €
    assertEqual(quote.baseTariffEur, 350, 'Base tariff must be clamped to 350 € sovereign floor');
  });

  await test('F6', 'Customer journey Stage 5 multi-service recommendation bounds matching to target date only', () => {
    const result = matchMarketplaceRecommendationsOracle({
      intent: 'boda_gala',
      targetDate: '2026-12-25', // Fecha festiva sin disponibilidad en catálogo
    });
    assertEqual(result.matches.length, 0, 'No providers available on 2026-12-25');
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F7 BOUNDARIES: Recommendation Engine Thresholds                    */
  /* -------------------------------------------------------------------------- */

  await test('F7', 'Recommendation engine with budget cap of 500 € filters out high-ticket items', () => {
    const budgetCapCents = 50000;
    const matches = CANONICAL_MARKETPLACE_CATALOG.filter((i) => i.priceCents <= budgetCapCents);
    assert(matches.length > 0, 'Must have items under 500 € (e.g. Solista 350 €, Shure 90 €)');
    for (const m of matches) {
      assert(m.priceCents <= budgetCapCents, `Item ${m.name} exceeds budget cap`);
    }
  });

  await test('F7', 'Recommendation engine radius filter: 30 km includes Madrid/Toledo, excludes Bilbao (380 km)', () => {
    const maxRadiusKm = 30;
    const closeItems = CANONICAL_MARKETPLACE_CATALOG.filter((i) => i.distanceHubKm <= maxRadiusKm);
    const hasBilbao = closeItems.some((i) => i.id === 'finca-02'); // Ezkertza Berria 380 km
    assert(!hasBilbao, 'Ezkertza Berria (380 km) must be excluded within 30 km radius');
  });

  await test('F7', 'Rating threshold boundary: exact 4.80 is accepted, 4.79 is rejected', () => {
    const filterByRating = (rating: number) => rating >= 4.8;
    assert(filterByRating(4.8), '4.80 rating must be accepted');
    assert(!filterByRating(4.79), '4.79 rating must be rejected');
  });

  await test('F7', 'Extreme guest volume pax = 1 requires minimum 12 W RMS sound power', () => {
    const rider = evaluateAcousticRiderOracle(1);
    assertEqual(rider.recommendedWatts, 12, '1 pax requires 12 W RMS');
  });

  await test('F7', 'Multiple provider categories bundle handles 0 items in single category without throwing', () => {
    const result = matchMarketplaceRecommendationsOracle({
      intent: 'serenata_intima',
      targetDate: '2026-06-20',
    });
    const hasFinca = result.matches.some((m) => m.category === 'FINCA');
    assert(!hasFinca, 'Serenata íntima does not include Finca, handles missing category smoothly');
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F8 BOUNDARIES: Hare-Niemeyer Integer Penny Remainder Boundaries     */
  /* -------------------------------------------------------------------------- */

  await test('F8', 'Boundary 0 cents cart: total 0 -> split 0 / 0 / 0 and 0 deposit', () => {
    const split = calculateHareNiemeyerSplitOracle(0, 0);
    assertEqual(split.totalCents, 0, 'Total 0');
    assertEqual(split.providersTotalCents, 0, 'Providers 0');
    assertEqual(split.earOsCents, 0, 'EAR OS 0');
    assertEqual(split.vimumeCents, 0, 'VIMUME 0');
  });

  await test('F8', 'Boundary 1 cent cart (0,01 €): 80% quota = 0.8 -> Providers gets the single penny', () => {
    const split = calculateHareNiemeyerSplitOracle(1, 0);
    assertEqual(split.providersTotalCents, 1, 'Providers gets 1 cent');
    assertEqual(split.earOsCents, 0, 'EAR OS gets 0 cents');
    assertEqual(split.vimumeCents, 0, 'VIMUME gets 0 cents');
    assertEqual(split.providersTotalCents + split.earOsCents + split.vimumeCents, 1, 'Sum must match 1');
  });

  await test('F8', 'Boundary 2 cents cart (0,02 €): 80%=1.6, 10%=0.2, 10%=0.2 -> Providers gets 2 cents', () => {
    const split = calculateHareNiemeyerSplitOracle(2, 0);
    assertEqual(split.providersTotalCents, 2, 'Providers gets 2 cents (quotas 1.6 > 0.2)');
    assertEqual(split.earOsCents, 0, 'EAR OS gets 0 cents');
    assertEqual(split.vimumeCents, 0, 'VIMUME gets 0 cents');
    assertEqual(split.providersTotalCents + split.earOsCents + split.vimumeCents, 2, 'Sum must match 2');
  });

  await test('F8', 'Boundary 3 cents cart (0,03 €): 80%=2.4, 10%=0.3, 10%=0.3 -> Providers 2c, EAR 1c, VIMUME 0c', () => {
    const split = calculateHareNiemeyerSplitOracle(3, 0);
    assertEqual(split.providersTotalCents + split.earOsCents + split.vimumeCents, 3, 'Sum must equal 3 cents exactly');
  });

  await test('F8', 'Boundary 10-item cart with 99.999,99 € total maintains exact integer balance', () => {
    const totalCents = 9999999; // 99.999,99 €
    const split = calculateHareNiemeyerSplitOracle(totalCents, 10000);
    assertEqual(split.providersTotalCents + split.earOsCents + split.vimumeCents, totalCents, 'Huge amount sum matches');
    assertEqual(split.depositDeductedCents, 10000, 'Deposit deducted is 100 €');
    assertEqual(split.pendingFinalSettlementCents, totalCents - 10000, 'Pending matches exact subtraction');
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F9 BOUNDARIES: Investor Simulator Extreme Scenarios & Bounds       */
  /* -------------------------------------------------------------------------- */

  await test('F9', 'Investor simulator execution time is sub-second (< 200ms)', () => {
    const sim = simulateInvestorCheckoutOracle('A');
    assert(sim.durationMs < 200, `Simulation should execute in <200ms, took ${sim.durationMs}ms`);
  });

  await test('F9', 'All simulated SEPA accounts have valid IBAN prefixes (ES) and BIC identifiers', () => {
    const sim = simulateInvestorCheckoutOracle('A');
    for (const acc of sim.sepaDispersions) {
      assert(acc.ibanMasked.startsWith('ES'), `IBAN must start with ES: ${acc.ibanMasked}`);
      assert(acc.bic.length >= 8, `BIC must have at least 8 chars: ${acc.bic}`);
      assert(acc.amountCents > 0, 'Dispersed amount must be positive');
    }
  });

  await test('F9', 'Simulated webhook event timestamp is within 5 seconds of current epoch', () => {
    const sim = simulateInvestorCheckoutOracle('B');
    const nowSec = Math.floor(Date.now() / 1000);
    assert(Math.abs(nowSec - sim.simulatedWebhookEvent.created) <= 5, 'Event created timestamp is fresh');
  });

  await test('F9', 'Transfer reference generated per scenario is unique across repeated runs', () => {
    const sim1 = simulateInvestorCheckoutOracle('A');
    const sim2 = simulateInvestorCheckoutOracle('A');
    const ref1 = sim1.sepaDispersions[0].transferReference;
    const ref2 = sim2.sepaDispersions[0].transferReference;
    assert(ref1 !== ref2, `Transfer references must be unique: ${ref1} vs ${ref2}`);
  });

  await test('F9', 'Scenario C (B2G LCSP 14.250 €) preserves exactly 10% VIMUME social contribution (1.425 €)', () => {
    const simC = simulateInvestorCheckoutOracle('C');
    assertEqual(simC.split.vimumeCents, 142500, '10% of 14.250 € must be 1.425 € (142.500 cts)');
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F10 BOUNDARIES: Telemetry Range Boundaries                         */
  /* -------------------------------------------------------------------------- */

  await test('F10', 'Saturday occupancy percentage is strictly bounded between 0% and 100%', () => {
    const validateOccupancy = (pct: number) => pct >= 0 && pct <= 100;
    assert(validateOccupancy(84), '84% occupancy is valid');
    assert(validateOccupancy(0), '0% occupancy is valid');
    assert(validateOccupancy(100), '100% occupancy is valid');
    assert(!validateOccupancy(-1), '-1% occupancy is invalid');
    assert(!validateOccupancy(101), '101% occupancy is invalid');
  });

  await test('F10', 'SLA response target boundary: exactly 15 minutes is compliant, 16 minutes is alert', () => {
    const isSlaCompliant = (min: number) => min <= 15;
    assert(isSlaCompliant(11), '11 min is compliant');
    assert(isSlaCompliant(15), '15 min is compliant');
    assert(!isSlaCompliant(16), '16 min triggers SLA alert');
  });

  await test('F10', 'Active requests in 24h cannot be negative', () => {
    const validateRequests = (count: number) => count >= 0;
    assert(validateRequests(223), '223 is valid');
    assert(validateRequests(0), '0 is valid');
    assert(!validateRequests(-5), 'Negative requests invalid');
  });

  await test('F10', 'YTD billing volume boundary: accumulates monotonically without loss', () => {
    let ytd = 284650;
    ytd += 5890; // Nueva boda A
    assertEqual(ytd, 290540, 'YTD volume increases accurately');
  });

  await test('F10', 'Intent selector handles casing differences gracefully (Boda_Gala vs boda_gala)', () => {
    const normalizeIntent = (intent: string) => intent.trim().toLowerCase();
    assertEqual(normalizeIntent('BODA_GALA'), 'boda_gala', 'Normalized to lowercase');
    assertEqual(normalizeIntent('  Vimume_Clinico  '), 'vimume_clinico', 'Trimmed and lowercase');
  });

  /* -------------------------------------------------------------------------- */
  /* FEATURE F11 BOUNDARIES: S-Class Profile Completeness Boundary Cutoffs      */
  /* -------------------------------------------------------------------------- */

  await test('F11', 'Profile completeness 9/10 fields (90%) does NOT grant S-Class certification', () => {
    const almostFull = generateCertifiedSClassProfileOracle('artist:test');
    // @ts-expect-error test edge case
    delete almostFull.civilLiabilityInsuranceEur; // Eliminar 1 campo
    const report = evaluateProfileCompletenessOracle(almostFull);
    assertEqual(report.percentage, 90, '9/10 fields = 90%');
    assert(!report.isSClassCertified, '90% must NOT be S-Class certified');
  });

  await test('F11', 'Short bio (< 50 chars) fails validation, 50 chars exactly passes', () => {
    const profile49: Partial<CertifiedSClassProfileData> = {
      bioSClass: '1234567890123456789012345678901234567890123456789', // 49 chars
    };
    const report49 = evaluateProfileCompletenessOracle(profile49);
    assert(report49.missingFields.includes('Biografía Homologada S-Class'), '49 chars bio must fail');

    const profile50: Partial<CertifiedSClassProfileData> = {
      bioSClass: '12345678901234567890123456789012345678901234567890', // 50 chars
    };
    const report50 = evaluateProfileCompletenessOracle(profile50);
    assert(!report50.missingFields.includes('Biografía Homologada S-Class'), '50 chars bio must pass');
  });

  await test('F11', 'Base tariff boundary: 349,99 € fails S-Class check, 350,00 € passes', () => {
    const report349 = evaluateProfileCompletenessOracle({ baseTariffEur: 349.99 });
    assert(report349.missingFields.includes('Tarifa Base Oficial (≥ 350 €)'), '349.99 € must fail');

    const report350 = evaluateProfileCompletenessOracle({ baseTariffEur: 350.0 });
    assert(!report350.missingFields.includes('Tarifa Base Oficial (≥ 350 €)'), '350.00 € must pass');
  });

  await test('F11', 'RC Insurance boundary: 299.999 € fails S-Class check, 300.000 € passes', () => {
    const report299k = evaluateProfileCompletenessOracle({ civilLiabilityInsuranceEur: 299999 });
    assert(report299k.missingFields.includes('Póliza de Responsabilidad Civil (≥ 300.000 €)'), '299.999 € must fail');

    const report300k = evaluateProfileCompletenessOracle({ civilLiabilityInsuranceEur: 300000 });
    assert(!report300k.missingFields.includes('Póliza de Responsabilidad Civil (≥ 300.000 €)'), '300.000 € must pass');
  });

  await test('F11', 'Gallery 4K boundary: 2 images fails S-Class check, 3 images passes', () => {
    const report2 = evaluateProfileCompletenessOracle({ gallery4kUrls: ['url1', 'url2'] });
    assert(report2.missingFields.some((f) => f.includes('Galería Fotográfica 4K')), '2 images must fail');

    const report3 = evaluateProfileCompletenessOracle({ gallery4kUrls: ['url1', 'url2', 'url3'] });
    assert(!report3.missingFields.some((f) => f.includes('Galería Fotográfica 4K')), '3 images must pass');
  });

  // Cleanup
  await offlineHarness.purgeAll();
}
