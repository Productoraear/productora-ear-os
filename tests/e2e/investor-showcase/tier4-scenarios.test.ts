/**
 * ════════════════════════════════════════════════════════════════════════════
 * TIER 4: REAL-WORLD APPLICATION SCENARIOS TEST SUITE
 * ════════════════════════════════════════════════════════════════════════════
 * Comprehensive end-to-end workload demonstrations derived from TEST_INFRA.md:
 *  - Scenario 1: Full Offline Booking Without Postgres (F1, F2, F8)
 *  - Scenario 2: Investor Multi-Service Flow (Artist+Finca+Catering) (F6, F7, F8, F9)
 *  - Scenario 3: Vendor 1-Click Profile Completion from 80% to 100% (F10, F11)
 *  - Scenario 4: Bilingual Compliance & URL Route Health Check (F3, F4, F5)
 *  - Scenario 5: Cross-Engine Stress: 100 Concurrent Date Locks Offline (F1, F2, F8)
 * Total: 5 realistic application scenarios.
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
  auditRoutesCatalogOracle,
  auditBilingualDocsOracle,
  IsolatedOfflineDateLockHarness,
  CANONICAL_MARKETPLACE_CATALOG,
  type CertifiedSClassProfileData,
  type AtomicLockInput,
} from './contracts';

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  SPLIT_SOBERANO,
  CENTRALITA_EAR_OS,
} from '../../../src/lib/constants/ear-os-ssot';

export async function runTier4RealWorldScenariosTests(tracker: TestExecutionTracker): Promise<void> {
  const tempStorePath = path.resolve(process.cwd(), '.data', 'test-tier4-offline-locks.json');
  const offlineHarness = new IsolatedOfflineDateLockHarness(tempStorePath);
  await offlineHarness.purgeAll();

  async function scenario(name: string, fn: () => Promise<void> | void) {
    const start = Date.now();
    try {
      await fn();
      tracker.record({
        tier: 4,
        testName: name,
        passed: true,
        status: 'PASS',
        durationMs: Date.now() - start,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      tracker.record({
        tier: 4,
        testName: name,
        passed: false,
        status: 'FAIL',
        durationMs: Date.now() - start,
        error: msg,
      });
    }
  }

  /* -------------------------------------------------------------------------- */
  /* SCENARIO 1: Full Offline Booking Without Postgres                          */
  /* -------------------------------------------------------------------------- */
  await scenario('Scenario 1: Full Offline Booking Without Postgres (F1, F2, F8)', async () => {
    // 1. Simular circuito abierto de DB (Postgres down)
    offlineHarness.tripCircuitBreaker(10000);
    assert(offlineHarness.isCircuitBreakerActive(), 'Circuit breaker must be active simulating Postgres down');

    // 2. Cliente consulta disponibilidad para Edwin Agudelo el 2026-06-20
    const targetDate = '2026-06-20';
    const avail = await offlineHarness.checkAvailability(targetDate, 'artist:edwin-agudelo');
    assert(avail.available, 'Date must be available before booking');
    assertEqual(avail.storageMode, 'FALLBACK_OFFLINE_DISK', 'Must operate in fallback offline storage mode');

    // 3. Cálculo de liquidación en céntimos enteros (350,00 € tarifa solista)
    const quote = calculateLogisticsOracle(45, 0, TARIFA_BASE_SOLISTA_EUR); // 45 km exentos
    assertEqual(quote.totalEventEur, 350, 'Total event must be 350.00 €');

    const split = calculateHareNiemeyerSplitOracle(quote.totalEventCents, 10000);
    assertEqual(split.providersTotalCents, 28000, 'Artist receives 280.00 € (80%)');
    assertEqual(split.earOsCents, 3500, 'EAR OS receives 35.00 € (10%)');
    assertEqual(split.vimumeCents, 3500, 'VIMUME receives 35.00 € (10%)');
    assertEqual(split.pendingFinalSettlementCents, 25000, 'Pending balance after 100 € deposit is 250.00 €');

    // 4. Bloqueo atómico offline en disco con sello SHA-256
    const lockInput: AtomicLockInput = {
      date: targetDate,
      entityId: 'artist:edwin-agudelo',
      clientName: 'Alejandro Gómez (Inversor Demo)',
      clientEmail: 'alejandro.gomez@investors-club.com',
      stripeSessionId: 'cs_scenario_1_stripe_session',
      priceLockSha256: split.priceLockSha256,
      totalAmountEur: 350,
      depositAmountEur: 100,
    };
    const lockRes = await offlineHarness.lockDate(lockInput);
    assert(lockRes.success, 'Offline date lock must succeed');
    assertEqual(lockRes.storageMode, 'FALLBACK_OFFLINE_DISK', 'Storage mode must be offline disk');

    // 5. Verificar que la fecha queda bloqueada en disco
    const recheck = await offlineHarness.checkAvailability(targetDate, 'artist:edwin-agudelo');
    assert(!recheck.available, 'Date must now be locked');
    assertEqual(recheck.reason, 'OFFLINE_PERSISTED_LOCK', 'Reason must be OFFLINE_PERSISTED_LOCK');

    // 6. Intento concurrente sobre la misma fecha es rechazado
    const colRes = await offlineHarness.lockDate({
      ...lockInput,
      clientName: 'Cliente Concurrente 2',
      stripeSessionId: 'cs_scenario_1_col_session',
    });
    assert(!colRes.success, 'Concurrent booking on locked date must be rejected');
    assertEqual(colRes.reason, 'COLLISION', 'Must return reason COLLISION');
  });

  /* -------------------------------------------------------------------------- */
  /* SCENARIO 2: Investor Multi-Service Flow (Artist+Finca+Catering)            */
  /* -------------------------------------------------------------------------- */
  await scenario('Scenario 2: Investor Multi-Service Flow (Artist+Finca+Catering) (F6, F7, F8, F9)', () => {
    // 1. Etapa 1 Gancho: Intención de búsqueda "boda_gala"
    const intent = 'boda_gala';
    const targetDate = '2026-06-20';

    // 2. Etapa 5 Concierge: Motor de recomendación multi-servicio
    const recs = matchMarketplaceRecommendationsOracle({
      intent,
      targetDate,
      pax: 120,
    });
    assert(recs.matches.length >= 4, 'Must return at least 4 matching providers');

    // 3. Etapa 2 Oferta de alto valor: Carrito consolidado (Boda Completa 5.890 €)
    const sim = simulateInvestorCheckoutOracle('A');
    assertEqual(sim.totalCents, 589000, 'Scenario A total is 5.890,00 €');
    assertEqual(sim.depositCents, 10000, '100 € deposit credited');

    // 4. Split Soberano 80/10/10
    assertEqual(sim.split.providersCents, 471200, 'Providers get 4.712,00 € (80%)');
    assertEqual(sim.split.earOsCents, 58900, 'EAR OS gets 589,00 € (10%)');
    assertEqual(sim.split.vimumeCents, 58900, 'VIMUME gets 589,00 € (10%)');
    assertEqual(sim.split.providersCents + sim.split.earOsCents + sim.split.vimumeCents, 589000, 'Integer cents balance');

    // 5. Etapa 4 CTAs y Simulación Transaccional: Dispersión SEPA instantánea
    assertEqual(sim.sepaDispersions.length, 3, 'Must disperse to 3 SEPA virtual accounts');
    assertEqual(sim.simulatedWebhookEvent.paymentStatus, 'paid', 'Webhook paymentStatus is paid');
    assert(sim.priceLockSha256.length === 64, 'SHA-256 seal is valid 64-char hex string');
  });

  /* -------------------------------------------------------------------------- */
  /* SCENARIO 3: Vendor 1-Click Profile Completion from 80% to 100%             */
  /* -------------------------------------------------------------------------- */
  await scenario('Scenario 3: Vendor 1-Click Profile Completion from 80% to 100% (F10, F11)', () => {
    // 1. Estado inicial del escaparate del proveedor: 80% completado (faltan 2 campos)
    const draftProfile: Partial<CertifiedSClassProfileData> = {
      id: 'finca:villa-escorial',
      legalName: 'Villa Escorial Eventos S.L.',
      tradeName: 'Villa Escorial Park',
      nif: 'B28123456',
      verifiedPhone: CENTRALITA_EAR_OS,
      officialWhatsApp: '+34693693048',
      bioSClass: 'Finca histórica para bodas y galas con aislamiento natural y acústica certificada S-Class.',
      baseTariffEur: 3200,
      depositAcceptedEur: 100,
      audioRider: {
        brand: 'Bose',
        wattsPerPax: 12,
        maxSplDb: 75,
      },
      powerConnection: 'CETAC_32A',
      hubLocation: {
        address: 'Carretera El Escorial km 14',
        municipio: 'San Lorenzo de El Escorial',
        provincia: 'Madrid',
        kmFromMentrida: 42,
      },
      // Falta galería 4K y seguro RC
    };

    const initialAudit = evaluateProfileCompletenessOracle(draftProfile);
    assertEqual(initialAudit.completedFields, 8, 'Initially 8/10 fields completed');
    assertEqual(initialAudit.percentage, 80, 'Initially 80% complete');
    assert(!initialAudit.isSClassCertified, 'Not certified initially');
    assertEqual(initialAudit.missingFields.length, 2, 'Two fields missing');

    // 2. El usuario pulsa '?' y copia la plantilla canónica S-Class
    const certifiedTemplate = generateCertifiedSClassProfileOracle(draftProfile.id);
    assert(certifiedTemplate.gallery4kUrls.length >= 3, 'Template includes 4K gallery');
    assert(certifiedTemplate.civilLiabilityInsuranceEur >= 300000, 'Template includes RC insurance >= 300.000 €');

    // 3. El usuario pulsa "Autocompletar Perfil y Guardar"
    const completedProfile: CertifiedSClassProfileData = {
      ...draftProfile,
      ...certifiedTemplate,
      legalName: draftProfile.legalName!,
      tradeName: draftProfile.tradeName!,
      nif: draftProfile.nif!,
      baseTariffEur: draftProfile.baseTariffEur!,
    };

    // 4. Re-auditoría reactiva confirma el 100% y desbloquea el sello S-Class Gold Master
    const finalAudit = evaluateProfileCompletenessOracle(completedProfile);
    assertEqual(finalAudit.completedFields, 10, 'All 10 fields completed');
    assertEqual(finalAudit.percentage, 100, '100% completion attained');
    assert(finalAudit.isSClassCertified, 'S-Class Gold Master accreditation granted');
    assertEqual(finalAudit.missingFields.length, 0, 'Zero missing fields remaining');
  });

  /* -------------------------------------------------------------------------- */
  /* SCENARIO 4: Bilingual Compliance & URL Route Health Check                  */
  /* -------------------------------------------------------------------------- */
  await scenario('Scenario 4: Bilingual Compliance & URL Route Health Check (F3, F4, F5)', () => {
    // 1. Auditoría de las 496 rutas
    const catalog = auditRoutesCatalogOracle();
    assertEqual(catalog.totalRoutes, 496, 'Total routes count is 496');
    assertEqual(catalog.totalPages, 301, 'Pages count is 301');
    assertEqual(catalog.totalApis, 195, 'APIs count is 195');
    assertEqual(catalog.totalDynamic, 49, 'Dynamic routes count is 49');
    assert(catalog.hasRequiredVerticals, 'All 6 mandatory verticals present in catalog');

    // 2. Auditoría de la documentación bilingüe
    const docs = auditBilingualDocsOracle();
    assertEqual(docs.length, 6, 'Exactly 6 canonical doc pairs');
    for (const d of docs) {
      assert(d.esExists && d.enExists, `Both language versions must exist for ${d.filename}`);
      assert(d.esBytes > 1000 && d.enBytes > 1000, `Both versions must be substantial for ${d.filename}`);
    }

    // 3. Cumplimiento de la Ley del Auditor Real: 14/20 verificado
    const doc05 = docs.find((d) => d.filename === '05_FORENSIC_AUDIT_SCORECARD.md');
    assert(doc05 !== undefined, 'Scorecard doc must exist');
    const esContent = fs.readFileSync(doc05.esPath, 'utf-8');
    assert(esContent.includes('14/20'), 'Must document honest 14/20 score');
    assert(esContent.includes('8/8'), 'Must document 8/8 P0 core verified');
  });

  /* -------------------------------------------------------------------------- */
  /* SCENARIO 5: Cross-Engine Stress: 100 Concurrent Date Locks Offline         */
  /* -------------------------------------------------------------------------- */
  await scenario('Scenario 5: Cross-Engine Stress: 100 Concurrent Date Locks Offline (F1, F2, F8)', async () => {
    const stressHarness = new IsolatedOfflineDateLockHarness(
      path.resolve(process.cwd(), '.data', 'test-scenario-5-stress.json')
    );
    await stressHarness.purgeAll();

    // 10 fechas distintas a lo largo de la temporada 2026
    const seasonDates = [
      '2026-05-16',
      '2026-05-23',
      '2026-05-30',
      '2026-06-06',
      '2026-06-13',
      '2026-06-20',
      '2026-06-27',
      '2026-07-04',
      '2026-07-11',
      '2026-07-18',
    ];

    // Lanzar 100 solicitudes en paralelo: 10 solicitudes concurrentes por cada fecha
    const promises: Promise<{ date: string; success: boolean; reason?: string }>[] = [];

    for (let i = 0; i < 100; i++) {
      const date = seasonDates[i % 10];
      const clientName = `Stress Client ${i}`;
      const session = `cs_stress_session_${i}`;
      const hash = `hash_stress_${i}`;

      promises.push(
        stressHarness
          .lockDate({
            date,
            entityId: 'artist:edwin-agudelo',
            clientName,
            clientEmail: `stress${i}@test.com`,
            stripeSessionId: session,
            priceLockSha256: hash,
            totalAmountEur: 350,
            depositAmountEur: 100,
          })
          .then((res) => ({ date, success: res.success, reason: res.reason }))
      );
    }

    const results = await Promise.all(promises);
    await stressHarness.syncCustomFile();

    // Debe haber exactamente 10 reservas exitosas (1 por cada fecha única) y 90 colisiones
    const successes = results.filter((r) => r.success);
    const collisions = results.filter((r) => !r.success && r.reason === 'COLLISION');

    assertEqual(successes.length, 10, 'Exactly 10 locks must succeed (1 per unique season date)');
    assertEqual(collisions.length, 90, 'Exactly 90 conflicting requests must be rejected as COLLISION');

    // Verificar que el archivo en disco es JSON 100% válido y contiene 10 registros
    const raw = await fs.promises.readFile(path.resolve(process.cwd(), '.data', 'test-scenario-5-stress.json'), 'utf-8');
    const diskRecords = JSON.parse(raw);
    const count = Array.isArray(diskRecords) ? diskRecords.length : (diskRecords.productionEvents?.length || 0);
    assertEqual(count, 10, 'Disk JSON must have exactly 10 records');

    // Limpieza
    await stressHarness.purgeAll();
  });

  // Cleanup
  await offlineHarness.purgeAll();
}
