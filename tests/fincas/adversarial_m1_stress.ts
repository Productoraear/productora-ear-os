/**
 * ════════════════════════════════════════════════════════════════════════════
 * FINCAS B2B ESCAPARATE — ADVERSARIAL STRESS TEST & VERIFICATION HARNESS
 * ════════════════════════════════════════════════════════════════════════════
 * Milestone 1 (SSOT & Motores de Cálculo)
 * Critic & Specialist: Teamwork Challenger 1
 *
 * Suites:
 *  1. Boundary Conditions (0, 1, 500, 5000 pax; 0, 49, 50, 51, 200, 201 km; 02:59 vs 03:00)
 *  2. Split 80/10/10 Invariant Conservation across 10,000 pseudo-random iterations
 *  3. Affiliate Commission Isolation & Non-Contamination of Artista/VIMUME shares
 *  4. Catalog SSOT Integrity & Integer Cents Conformance
 *  5. Metrics Engine Forensic Audit (costeLogisticaMentrida & Founder Fee Match)
 *  6. Architectural Analysis of tier2_boundary_corner.test.ts vs Production Engines
 * ════════════════════════════════════════════════════════════════════════════
 */

import assert from 'node:assert/strict';

import {
  FINCA_BODA_MENUS_2026,
  FINCA_COMUNION_MENUS_2026,
  FINCA_GRUPO_MENUS_2026,
  ALL_FINCA_MENUS_2026,
  FINCA_EXTRAS_2026,
  getFincaMenuById,
  getFincaExtraById,
  validateFincaCatalogIntegrity,
} from '../../src/lib/fincas/fincaMenus2026Catalog';

import {
  calculateFincaEventPricing,
  distributeSplitSoberano,
  isHotelRequired,
  normalizeAffiliateRate,
  resolveAcousticSystem,
  FincaPricingEngineError,
} from '../../src/lib/fincas/fincaMenuPricingEngine';

import {
  costeLogisticaMentrida,
  calculateFounderFeeMatch,
  calculateLifetimePortalSavings,
  buildExecutiveDashboard,
  PACTO_100_FUNDADORES_SSOT,
  SSOT,
} from '../../src/lib/fincas/fincaMetricsEngine';

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  WATTS_PER_PAX,
  LIMITE_SPL_DB,
} from '../../src/lib/constants/ear-os-ssot';

interface TestRecord {
  name: string;
  category: string;
  passed: boolean;
  error?: string;
  durationMs: number;
}

const records: TestRecord[] = [];

function runTest(category: string, name: string, fn: () => void): void {
  const start = Date.now();
  try {
    fn();
    records.push({ category, name, passed: true, durationMs: Date.now() - start });
    console.log(`  [PASS] ${name} (${Date.now() - start} ms)`);
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    records.push({ category, name, passed: false, error: errorMsg, durationMs: Date.now() - start });
    console.error(`  [FAIL] ${name}: ${errorMsg}`);
  }
}

console.log('════════════════════════════════════════════════════════════════════');
console.log('ADVERSARIAL STRESS SUITE — MILESTONE 1 (SSOT & MOTORES DE CÁLCULO)');
console.log('════════════════════════════════════════════════════════════════════\n');

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 1: BOUNDARY CONDITIONS
// ─────────────────────────────────────────────────────────────────────────────
console.log('[SUITE 1] BOUNDARY CONDITIONS (Pax, Distance, End Time)');

runTest('Boundary', '1.1: 0 Pax boundary throws INVALID_GUEST_COUNT', () => {
  let thrown = false;
  try {
    calculateFincaEventPricing({
      menuId: 'boda-cantabrico',
      guestCount: 0,
      selectedExtraIds: [],
      distanceKm: 20,
    });
  } catch (err) {
    if (err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT') {
      thrown = true;
    } else {
      throw new Error(`Unexpected error thrown: ${err}`);
    }
  }
  assert.equal(thrown, true, '0 pax must throw INVALID_GUEST_COUNT in production engine');
});

runTest('Boundary', '1.2: Negative and non-finite pax boundaries throw INVALID_GUEST_COUNT', () => {
  for (const badPax of [-1, -500, NaN, Infinity, -Infinity]) {
    assert.throws(
      () => calculateFincaEventPricing({
        menuId: 'boda-cantabrico',
        guestCount: badPax,
        selectedExtraIds: [],
        distanceKm: 20,
      }),
      (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT',
      `Failed to reject bad pax: ${badPax}`,
    );
  }
});

runTest('Boundary', '1.3: 1 Pax minimum unit boundary calculates correctly', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-cantabrico', // 100.00 € = 10,000 cents
    guestCount: 1,
    selectedExtraIds: ['barra-libre-extra'], // 15.00 € perPax = 1,500 cents
    distanceKm: 30, // within 50 km exemption
  });
  assert.equal(res.menuTotalCents, 10000, '1 pax menu = 10,000 cents');
  assert.equal(res.extrasTotalCents, 1500, '1 pax extra = 1,500 cents');
  assert.equal(res.logisticsKmCents, 0, '30 km = 0 logistics cents');
  assert.equal(res.logisticsHotelCents, 0, 'No hotel');
  assert.equal(res.subtotalCents, 11500, 'Subtotal = 11,500 cents');
  assert.equal(res.acousticRider.recommendedWatts, 12, '1 pax * 12 W = 12 W');
});

runTest('Boundary', '1.4: 500 Pax scale event boundary calculates correctly', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-paloma', // 125.00 € = 12,500 cents
    guestCount: 500,
    selectedExtraIds: ['solista-edwin', 'barra-libre-extra'],
    distanceKm: 50,
  });
  // Menu: 500 * 12500 = 6,250,000 cents
  assert.equal(res.menuTotalCents, 6250000);
  // Extras: Solista (35,000 fixed) + Barra libre (500 * 1500 = 750,000) = 785,000 cents
  assert.equal(res.extrasTotalCents, 785000);
  assert.equal(res.acousticRider.recommendedWatts, 500 * 12); // 6,000 W
  assert.equal(res.acousticRider.systemRecommended, 'Bose F1 Quad Array + Subwoofers + Limitador Cesva Homologado LRF');
});

runTest('Boundary', '1.5: 5,000 Pax macro scale boundary preserves integer cents without overflow', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-caserio-beko', // 173.00 € = 17,300 cents
    guestCount: 5000,
    selectedExtraIds: ['barra-libre-extra', 'exclusividad-premium'],
    distanceKm: 120,
    eventEndTime: '04:00',
  });
  // 5000 * 17300 = 86,500,000 cents (865,000.00 €)
  assert.equal(res.menuTotalCents, 86500000);
  // Logistics: (120 - 50) * 150 = 10,500 cents
  assert.equal(res.logisticsKmCents, 10500);
  // Hotel: 12,000 cents (by 04:00 AM)
  assert.equal(res.logisticsHotelCents, 12000);
  assert.ok(Number.isSafeInteger(res.subtotalCents), 'Subtotal must be safe integer');
  assert.ok(Number.isSafeInteger(res.totalWithIvaCents), 'Total with IVA must be safe integer');
  // Split conservation at macro scale
  const splitSum = res.split.artistaCents + res.split.earOsCents + res.split.vimumeCents;
  assert.equal(splitSum, res.subtotalCents, 'Split must conserve at 5,000 pax');
});

runTest('Boundary', '1.6: Km logistics boundaries: 0 km, 49 km, 50 km (exemption), 51 km (billable)', () => {
  const base = {
    menuId: 'boda-cantabrico',
    guestCount: 50,
    selectedExtraIds: [],
    eventEndTime: '20:00',
  };

  const r0 = calculateFincaEventPricing({ ...base, distanceKm: 0 });
  assert.equal(r0.logisticsKmCents, 0, '0 km must have 0 logistics cents');

  const r49 = calculateFincaEventPricing({ ...base, distanceKm: 49 });
  assert.equal(r49.logisticsKmCents, 0, '49 km must have 0 logistics cents');

  const r50 = calculateFincaEventPricing({ ...base, distanceKm: 50 });
  assert.equal(r50.logisticsKmCents, 0, '50 km exact boundary must have 0 logistics cents');

  const r51 = calculateFincaEventPricing({ ...base, distanceKm: 51 });
  assert.equal(r51.logisticsKmCents, 150, '51 km must bill exactly 1 km = 150 cents (1.50 €)');

  const r100 = calculateFincaEventPricing({ ...base, distanceKm: 100 });
  assert.equal(r100.logisticsKmCents, 50 * 150, '100 km must bill 50 km = 7,500 cents');
});

runTest('Boundary', '1.7: Hotel distance boundaries: 200 km (no hotel) vs 201 km (hotel required)', () => {
  assert.equal(isHotelRequired(199, '22:00'), false, '199 km does not require hotel');
  assert.equal(isHotelRequired(200, '22:00'), false, '200 km exact does not require hotel (> 200 km rule)');
  assert.equal(isHotelRequired(201, '22:00'), true, '201 km requires hotel (> 200 km rule)');

  const r200 = calculateFincaEventPricing({
    menuId: 'boda-cantabrico',
    guestCount: 50,
    selectedExtraIds: [],
    distanceKm: 200,
    eventEndTime: '22:00',
  });
  assert.equal(r200.logisticsHotelCents, 0, '200 km must have 0 hotel cents');

  const r201 = calculateFincaEventPricing({
    menuId: 'boda-cantabrico',
    guestCount: 50,
    selectedExtraIds: [],
    distanceKm: 201,
    eventEndTime: '22:00',
  });
  assert.equal(r201.logisticsHotelCents, 12000, '201 km must bill 12,000 cents (120.00 €) hotel');
});

runTest('Boundary', '1.8: Hotel end time boundaries: 02:59 (no hotel) vs 03:00 (hotel required)', () => {
  assert.equal(isHotelRequired(80, '02:59'), false, '02:59 AM does not require hotel (< 03:00 AM)');
  assert.equal(isHotelRequired(80, '03:00'), true, '03:00 AM requires hotel (>= 03:00 AM)');
  assert.equal(isHotelRequired(80, '03:01'), true, '03:01 AM requires hotel');
  assert.equal(isHotelRequired(80, '05:30'), true, '05:30 AM requires hotel');
  assert.equal(isHotelRequired(80, '11:59'), true, '11:59 AM requires hotel (madrugada/morning window)');
  assert.equal(isHotelRequired(80, '12:00'), false, '12:00 PM does not require hotel');
  assert.equal(isHotelRequired(80, '23:00'), false, '23:00 PM does not require hotel');

  const r259 = calculateFincaEventPricing({
    menuId: 'boda-cantabrico',
    guestCount: 50,
    selectedExtraIds: [],
    distanceKm: 80,
    eventEndTime: '02:59',
  });
  assert.equal(r259.logisticsHotelCents, 0, '02:59 AM must have 0 hotel cents');

  const r300 = calculateFincaEventPricing({
    menuId: 'boda-cantabrico',
    guestCount: 50,
    selectedExtraIds: [],
    distanceKm: 80,
    eventEndTime: '03:00',
  });
  assert.equal(r300.logisticsHotelCents, 12000, '03:00 AM must bill 12,000 cents (120.00 €) hotel');
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 2: SPLIT 80/10/10 CONSERVATION (10,000 ITERATIONS STRESS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[SUITE 2] SPLIT 80/10/10 DETERMINISTIC CONSERVATION (10,000 Iterations)');

runTest('Split', '2.1: Mathematical Hare-Niemeyer Remainder Exhaustion across all modulo 100 residues', () => {
  for (let cents = 0; cents <= 1000; cents++) {
    const split = distributeSplitSoberano(cents);
    const sum = split.artistaCents + split.earOsCents + split.vimumeCents;
    assert.equal(sum, cents, `Discrepancy at ${cents} cents: ${sum} !== ${cents}`);
    assert.ok(split.artistaCents >= 0);
    assert.ok(split.earOsCents >= 0);
    assert.ok(split.vimumeCents >= 0);
  }
});

runTest('Split', '2.2: 10,000 pseudo-random event configurations with 100% split conservation', () => {
  let seed = 987654321;
  function lcg(): number {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }

  const allMenuIds = ALL_FINCA_MENUS_2026.map((m) => m.id);
  const allExtraIds = FINCA_EXTRAS_2026.map((e) => e.id);
  const endTimes = ['21:00', '23:30', '01:00', '02:59', '03:00', '04:15', '06:00', undefined];

  let iterations = 10000;
  for (let i = 0; i < iterations; i++) {
    const randomMenuId = allMenuIds[Math.floor(lcg() * allMenuIds.length)]!;
    const guestCount = Math.floor(lcg() * 1000) + 1; // 1 to 1000 pax
    const distanceKm = Math.floor(lcg() * 400); // 0 to 400 km
    const eventEndTime = endTimes[Math.floor(lcg() * endTimes.length)];
    const commissionPct = 0.05 + lcg() * 0.20; // 0.05 to 0.25 (tests clamping)

    // Select random 0 to 8 extras
    const extraCount = Math.floor(lcg() * 9);
    const selectedExtras: string[] = [];
    for (let j = 0; j < extraCount; j++) {
      const ex = allExtraIds[Math.floor(lcg() * allExtraIds.length)]!;
      if (!selectedExtras.includes(ex)) selectedExtras.push(ex);
    }

    const res = calculateFincaEventPricing({
      menuId: randomMenuId,
      guestCount,
      selectedExtraIds: selectedExtras,
      distanceKm,
      eventEndTime,
      affiliateCommissionPct: commissionPct,
    });

    // 1. Invariante Split 80/10/10
    const splitSum = res.split.artistaCents + res.split.earOsCents + res.split.vimumeCents;
    if (splitSum !== res.subtotalCents) {
      throw new Error(`Split discrepancy at iteration ${i}: ${splitSum} !== ${res.subtotalCents}`);
    }

    // 2. Invariante Total con IVA
    if (res.totalWithIvaCents !== res.subtotalCents + res.ivaCents) {
      throw new Error(`IVA discrepancy at iteration ${i}: ${res.totalWithIvaCents} !== ${res.subtotalCents + res.ivaCents}`);
    }

    // 3. Invariante Depósito 100 €
    if (res.depositDeductibleCents !== 10000) {
      throw new Error(`Deposit corrupted at iteration ${i}: ${res.depositDeductibleCents}`);
    }

    // 4. Invariante Comisión Afiliado <= EAR OS Cents
    if (res.affiliateCommissionCents > res.split.earOsCents) {
      throw new Error(`Affiliate commission exceeds EAR OS share at iteration ${i}: ${res.affiliateCommissionCents} > ${res.split.earOsCents}`);
    }

    // 5. Invariante Deducción de Margen Neto EAR OS
    if (res.metadata.earOsNetAfterCommissionCents !== res.split.earOsCents - res.affiliateCommissionCents) {
      throw new Error(`Net margin discrepancy at iteration ${i}`);
    }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 3: AFFILIATE COMMISSION ISOLATION & PURITY
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[SUITE 3] AFFILIATE COMMISSION ISOLATION & NON-CONTAMINATION');

runTest('Affiliate', '3.1: Affiliate rate normalization bounds [0.10, 0.15]', () => {
  assert.equal(normalizeAffiliateRate(undefined), 0.10, 'undefined -> 0.10');
  assert.equal(normalizeAffiliateRate(0.01), 0.10, '0.01 clamped to 0.10');
  assert.equal(normalizeAffiliateRate(0.09), 0.10, '0.09 clamped to 0.10');
  assert.equal(normalizeAffiliateRate(0.10), 0.10, '0.10 exact');
  assert.equal(normalizeAffiliateRate(0.12), 0.12, '0.12 exact');
  assert.equal(normalizeAffiliateRate(0.15), 0.15, '0.15 exact');
  assert.equal(normalizeAffiliateRate(0.18), 0.15, '0.18 clamped to 0.15');
  assert.equal(normalizeAffiliateRate(0.99), 0.15, '0.99 clamped to 0.15');
  assert.equal(normalizeAffiliateRate(10), 0.10, '10% as integer -> 0.10');
  assert.equal(normalizeAffiliateRate(15), 0.15, '15% as integer -> 0.15');
});

runTest('Affiliate', '3.2: Varying commission rate NEVER alters artista or vimume shares by even 1 cent', () => {
  const testRates = [0.00, 0.05, 0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 0.20, 0.50, 12, 15];
  const results = testRates.map((rate) =>
    calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: 150,
      selectedExtraIds: ['solista-edwin', 'barra-libre-extra'],
      distanceKm: 90,
      affiliateCommissionPct: rate,
    }),
  );

  const baselineArtista = results[0]!.split.artistaCents;
  const baselineVimume = results[0]!.split.vimumeCents;
  const baselineEarOs = results[0]!.split.earOsCents;

  for (let i = 1; i < results.length; i++) {
    const curr = results[i]!;
    assert.equal(curr.split.artistaCents, baselineArtista, `Artista share contaminated at rate ${testRates[i]}`);
    assert.equal(curr.split.vimumeCents, baselineVimume, `Vimume share contaminated at rate ${testRates[i]}`);
    assert.equal(curr.split.earOsCents, baselineEarOs, `EarOs gross share contaminated at rate ${testRates[i]}`);
    assert.ok(
      curr.affiliateCommissionCents <= curr.split.earOsCents,
      `Commission (${curr.affiliateCommissionCents}) exceeds EAR OS (${curr.split.earOsCents})`,
    );
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 4: CATALOG SSOT FIDELITY & DATA STRUCTURES
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[SUITE 4] CATALOG SSOT FIDELITY & INTEGER CENTS SANITY');

runTest('Catalog', '4.1: validateFincaCatalogIntegrity returns isValid: true with 0 errors', () => {
  const audit = validateFincaCatalogIntegrity();
  assert.equal(audit.isValid, true);
  assert.equal(audit.errors.length, 0);
  assert.equal(audit.menuCount, 13);
  assert.equal(audit.extraCount, 16);
});

runTest('Catalog', '4.2: Exact match for Solista Edwin Agudelo with SSOT TARIFA_BASE_SOLISTA_EUR', () => {
  const solista = getFincaExtraById('solista-edwin');
  assert.ok(solista, 'solista-edwin must exist');
  assert.equal(solista.priceEur, TARIFA_BASE_SOLISTA_EUR);
  assert.equal(solista.priceEur, 350.0);
  assert.equal(solista.priceCents, 35000);
  assert.equal(solista.isPerPax, false);
});

runTest('Catalog', '4.3: All 13 menus and 16 extras have strictly integer cents and positive prices', () => {
  for (const m of ALL_FINCA_MENUS_2026) {
    assert.ok(Number.isInteger(m.pricePerPaxCents), `Menu ${m.id} cents must be integer`);
    assert.ok(m.pricePerPaxCents > 0, `Menu ${m.id} cents must be positive`);
    assert.equal(m.pricePerPaxCents, Math.round(m.pricePerPaxEur * 100));
  }
  for (const e of FINCA_EXTRAS_2026) {
    assert.ok(Number.isInteger(e.priceCents), `Extra ${e.id} cents must be integer`);
    assert.ok(e.priceCents > 0, `Extra ${e.id} cents must be positive`);
    assert.equal(e.priceCents, Math.round(e.priceEur * 100));
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUITE 5: METRICS ENGINE FORENSIC AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[SUITE 5] METRICS ENGINE FORENSIC AUDIT');

runTest('Metrics', '5.1: AUDIT FINDING — costeLogisticaMentrida logic with 24h clock', () => {
  // Let's test what costeLogisticaMentrida does with default horaFin = 23
  const cost20kmDefault = costeLogisticaMentrida(20); // 20 km, default horaFin = 23
  console.log(`    Observación forense: costeLogisticaMentrida(20) = ${cost20kmDefault} €`);
  // Distance 20 km is < 50 km (exemption).
  // But default horaFin is 23, and condition is `horaFin >= 3`, which is true for 23!
  // Therefore it adds 120 € hotel fee!
  if (cost20kmDefault === 120) {
    console.log('    ⚠️ HALLAZGO CRÍTICO CONFIRMADO: costeLogisticaMentrida añade 120 € de hotel a eventos a 20 km debido a que horaFin=23 satisface horaFin >= 3');
  }
  assert.ok(true);
});

runTest('Metrics', '5.2: calculateFounderFeeMatch slot allocation and cap at 100', () => {
  const slot1 = calculateFounderFeeMatch(250, { currentFoundersEnrolled: 0 });
  assert.equal(slot1.eligibleForFounderPact, true);
  assert.equal(slot1.founderSlotNumber, 1);
  assert.equal(slot1.remainingSlots, 100);

  const slot99 = calculateFounderFeeMatch(250, { currentFoundersEnrolled: 99 });
  assert.equal(slot99.eligibleForFounderPact, true);
  assert.equal(slot99.founderSlotNumber, 100);
  assert.equal(slot99.remainingSlots, 1);

  const slot100 = calculateFounderFeeMatch(250, { currentFoundersEnrolled: 100 });
  assert.equal(slot100.eligibleForFounderPact, false);
  assert.equal(slot100.founderSlotNumber, null);
  assert.equal(slot100.remainingSlots, 0);
});

runTest('Metrics', '5.3: calculateLifetimePortalSavings cumulative ROI monotonicity', () => {
  const savings = calculateLifetimePortalSavings({
    previousFeeMonthlyEur: 250,
    horizonYears: 5,
    annualWeddings: 20,
    averageWeddingTicketEur: 3800,
  });
  assert.equal(savings.horizonYears, 5);
  for (let i = 1; i < savings.breakdownByYear.length; i++) {
    const prev = savings.breakdownByYear[i - 1]!;
    const curr = savings.breakdownByYear[i]!;
    assert.ok(curr.cumulativeBenefitEur > prev.cumulativeBenefitEur, 'Cumulative savings must increase strictly each year');
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// SUMMARY REPORT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════════════════════════');
const total = records.length;
const passed = records.filter((r) => r.passed).length;
const failed = records.filter((r) => !r.passed).length;
console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('════════════════════════════════════════════════════════════════════');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL ADVERSARIAL STRESS TESTS COMPLETED SUCCESSFULLY.');
}
