/**
 * ════════════════════════════════════════════════════════════════════════════
 * EMPIRICAL CHALLENGER VERIFICATION HARNESS — MILESTONE 1 ITERATION 2
 * ════════════════════════════════════════════════════════════════════════════
 * Adversarially validates the 4 reported edge vulnerabilities and their
 * surrounding boundary surfaces against production engines.
 * ════════════════════════════════════════════════════════════════════════════
 */

import assert from 'node:assert/strict';

import {
  calculateFincaEventPricing,
  normalizeAffiliateRate,
  distributeSplitSoberano,
  FincaPricingEngineError,
} from '../src/lib/fincas/fincaMenuPricingEngine';

import {
  calculateFounderFeeMatch,
  costeLogisticaMentrida,
  PACTO_100_FUNDADORES_SSOT,
} from '../src/lib/fincas/fincaMetricsEngine';

console.log('════════════════════════════════════════════════════════════════════');
console.log('RUNNING EMPIRICAL CHALLENGER STRESS HARNESS — M1 ITERATION 2');
console.log('════════════════════════════════════════════════════════════════════\n');

let passCount = 0;
let failCount = 0;

function runTest(name: string, fn: () => void) {
  try {
    fn();
    console.log(`  [PASS] ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  [FAIL] ${name}:`, err);
    failCount++;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. VULNERABILITY 1: FLOAT PAX IN MENU PRICING
// ─────────────────────────────────────────────────────────────────────────────
console.log('[CHALLENGE 1] Float Pax Invariant & Boundary Tests');

runTest('1.1: guestCount = 0.5 must throw INVALID_GUEST_COUNT', () => {
  assert.throws(
    () => calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: 0.5,
      selectedExtraIds: [],
      distanceKm: 10,
    }),
    (err: unknown) => {
      assert.ok(err instanceof FincaPricingEngineError, 'Must be FincaPricingEngineError');
      assert.equal(err.code, 'INVALID_GUEST_COUNT');
      return true;
    }
  );
});

runTest('1.2: guestCount = 0.001 must throw INVALID_GUEST_COUNT', () => {
  assert.throws(
    () => calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: 0.001,
      selectedExtraIds: [],
      distanceKm: 10,
    }),
    (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT'
  );
});

runTest('1.3: guestCount = 0.999 must throw INVALID_GUEST_COUNT', () => {
  assert.throws(
    () => calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: 0.999,
      selectedExtraIds: [],
      distanceKm: 10,
    }),
    (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT'
  );
});

runTest('1.4: guestCount = -0.5 must throw INVALID_GUEST_COUNT', () => {
  assert.throws(
    () => calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: -0.5,
      selectedExtraIds: [],
      distanceKm: 10,
    }),
    (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT'
  );
});

runTest('1.5: guestCount = NaN must throw INVALID_GUEST_COUNT', () => {
  assert.throws(
    () => calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: NaN,
      selectedExtraIds: [],
      distanceKm: 10,
    }),
    (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT'
  );
});

runTest('1.6: guestCount = Infinity must throw INVALID_GUEST_COUNT', () => {
  assert.throws(
    () => calculateFincaEventPricing({
      menuId: 'boda-vasco',
      guestCount: Infinity,
      selectedExtraIds: [],
      distanceKm: 10,
    }),
    (err: unknown) => err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT'
  );
});

runTest('1.7: guestCount = 1.0 (valid minimum pax) succeeds with exact menu price', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-vasco',
    guestCount: 1.0,
    selectedExtraIds: [],
    distanceKm: 10,
  });
  assert.equal(res.menuTotalCents, 13800); // 138 € * 1 pax = 13.800 céntimos
  assert.equal(res.metadata.guestCount, 1);
});

runTest('1.8: guestCount = 1.9 truncates deterministically to 1 pax', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-vasco',
    guestCount: 1.9,
    selectedExtraIds: [],
    distanceKm: 10,
  });
  assert.equal(res.menuTotalCents, 13800);
  assert.equal(res.metadata.guestCount, 1);
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. VULNERABILITY 2: NAN AFFILIATE COMMISSION RATE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[CHALLENGE 2] NaN Affiliate Commission Rate Sanity');

runTest('2.1: normalizeAffiliateRate(NaN) safely returns COMISION_AFILIADO_MIN_PCT (0.10)', () => {
  const rate = normalizeAffiliateRate(NaN);
  assert.equal(rate, 0.10);
});

runTest('2.2: normalizeAffiliateRate with non-finite values (Infinity, -Infinity)', () => {
  assert.equal(normalizeAffiliateRate(Infinity), 0.10);
  assert.equal(normalizeAffiliateRate(-Infinity), 0.10);
  assert.equal(normalizeAffiliateRate(undefined), 0.10);
  assert.equal(normalizeAffiliateRate(null as unknown as number), 0.10);
});

runTest('2.3: Pricing engine with affiliateCommissionPct: NaN produces strictly finite integer cents', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-vasco',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 10,
    affiliateCommissionPct: NaN,
  });

  assert.ok(Number.isFinite(res.affiliateCommissionCents), 'affiliateCommissionCents must be finite');
  assert.ok(Number.isInteger(res.affiliateCommissionCents), 'affiliateCommissionCents must be an integer');
  assert.ok(Number.isFinite(res.metadata.earOsNetAfterCommissionCents), 'earOsNetAfterCommissionCents must be finite');
  assert.ok(Number.isInteger(res.metadata.earOsNetAfterCommissionCents), 'earOsNetAfterCommissionCents must be an integer');

  // earOsCents is 10% of subtotal (1380000 * 0.10 = 138000)
  // affiliate commission at 10% is 138000 * 0.10 = 13800 céntimos (138.00 €)
  assert.equal(res.split.earOsCents, 138000);
  assert.equal(res.affiliateCommissionCents, 13800);
  assert.equal(res.metadata.earOsNetAfterCommissionCents, 138000 - 13800);
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. VULNERABILITY 3: DUPLICATE EXTRAS BILLING
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[CHALLENGE 3] Duplicate Extras Idempotence');

runTest('3.1: Duplicate fixed extra ["solista-edwin", "solista-edwin"] bills 350.00 € exactly once', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-vasco',
    guestCount: 100,
    selectedExtraIds: ['solista-edwin', 'solista-edwin'],
    distanceKm: 10,
  });

  assert.equal(res.extrasTotalCents, 35000); // 35.000 céntimos (350 €), NOT 70.000 céntimos
  assert.equal(res.metadata.extrasBreakdown.length, 1);
  assert.equal(res.metadata.extrasBreakdown[0]?.id, 'solista-edwin');
  assert.equal(res.metadata.extrasBreakdown[0]?.totalItemCents, 35000);
});

runTest('3.2: 5x duplicate of fixed extra bills 350.00 € exactly once', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-vasco',
    guestCount: 50,
    selectedExtraIds: ['solista-edwin', 'solista-edwin', 'solista-edwin', 'solista-edwin', 'solista-edwin'],
    distanceKm: 10,
  });

  assert.equal(res.extrasTotalCents, 35000);
  assert.equal(res.metadata.extrasBreakdown.length, 1);
});

runTest('3.3: Duplicate perPax extra ["barra-libre-extra", "barra-libre-extra"] bills perPax rate once', () => {
  const guests = 100;
  const res = calculateFincaEventPricing({
    menuId: 'boda-vasco',
    guestCount: guests,
    selectedExtraIds: ['barra-libre-extra', 'barra-libre-extra'],
    distanceKm: 10,
  });

  // barra-libre-extra is 15.00 € (1.500 céntimos) per pax -> 100 * 1500 = 150.000 céntimos
  assert.equal(res.extrasTotalCents, 150000);
  assert.equal(res.metadata.extrasBreakdown.length, 1);
});

runTest('3.4: Interleaved duplicates ["solista-edwin", "barra-libre-extra", "solista-edwin", "barra-libre-extra"]', () => {
  const res = calculateFincaEventPricing({
    menuId: 'boda-vasco',
    guestCount: 100,
    selectedExtraIds: ['solista-edwin', 'barra-libre-extra', 'solista-edwin', 'barra-libre-extra'],
    distanceKm: 10,
  });

  // 35000 + 150000 = 185.000 céntimos
  assert.equal(res.extrasTotalCents, 185000);
  assert.equal(res.metadata.extrasBreakdown.length, 2);
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. VULNERABILITY 4: FOUNDER FEE MATCH MINIMUM 50 € FLOOR
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[CHALLENGE 4] Founder Fee Match 50 € Floor Protection');

runTest('4.1: calculateFounderFeeMatch(1.0) clamps to 50.00 € (5.000 céntimos)', () => {
  const match = calculateFounderFeeMatch(1.0);
  assert.equal(match.matchedMonthlyFeeEur, 50);
  assert.equal(match.matchedMonthlyFeeCents, 5000);
  assert.equal(match.previousMonthlyFeeEur, 50);
  assert.equal(match.matchedAnnualFeeEur, 600); // 50 * 12
  assert.equal(match.matchedAnnualFeeCents, 60000);
});

runTest('4.2: calculateFounderFeeMatch(0.01) clamps to 50.00 €', () => {
  const match = calculateFounderFeeMatch(0.01);
  assert.equal(match.matchedMonthlyFeeEur, 50);
  assert.equal(match.matchedMonthlyFeeCents, 5000);
});

runTest('4.3: calculateFounderFeeMatch(49.99) clamps to 50.00 €', () => {
  const match = calculateFounderFeeMatch(49.99);
  assert.equal(match.matchedMonthlyFeeEur, 50);
  assert.equal(match.matchedMonthlyFeeCents, 5000);
});

runTest('4.4: calculateFounderFeeMatch(50.00) remains exactly 50.00 €', () => {
  const match = calculateFounderFeeMatch(50.00);
  assert.equal(match.matchedMonthlyFeeEur, 50);
  assert.equal(match.matchedMonthlyFeeCents, 5000);
});

runTest('4.5: calculateFounderFeeMatch(50.01) preserves 50.01 € without truncation', () => {
  const match = calculateFounderFeeMatch(50.01);
  assert.equal(match.matchedMonthlyFeeEur, 50.01);
  assert.equal(match.matchedMonthlyFeeCents, 5001);
});

runTest('4.6: calculateFounderFeeMatch with invalid inputs (0, -50, NaN) defaults to SSOT default (250 €)', () => {
  const matchZero = calculateFounderFeeMatch(0);
  assert.equal(matchZero.matchedMonthlyFeeEur, PACTO_100_FUNDADORES_SSOT.CUOTA_MENSUAL_DEFECTO_PORTAL_EUR);
  assert.equal(matchZero.matchedMonthlyFeeEur, 250);

  const matchNeg = calculateFounderFeeMatch(-50);
  assert.equal(matchNeg.matchedMonthlyFeeEur, 250);

  const matchNaN = calculateFounderFeeMatch(NaN);
  assert.equal(matchNaN.matchedMonthlyFeeEur, 250);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. ADDITIONAL REGRESSION & INVARIANT AUDIT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n[CHALLENGE 5] Circadian Logistics & Split Conservation');

runTest('5.1: 24h clock: 20 km at 23:00 has 0 hotel cost; 20 km at 03:00 has 120 € hotel cost', () => {
  assert.equal(costeLogisticaMentrida(20, 23), 0);
  assert.equal(costeLogisticaMentrida(20, 2), 0);
  assert.equal(costeLogisticaMentrida(20, 3), 120);
  assert.equal(costeLogisticaMentrida(20, 11), 120);
  assert.equal(costeLogisticaMentrida(20, 12), 0);
});

runTest('5.2: Split 80/10/10 zero-drift integrity across 1,000 cents values', () => {
  for (let c = 0; c < 1000; c++) {
    const s = distributeSplitSoberano(c);
    assert.equal(s.artistaCents + s.earOsCents + s.vimumeCents, c);
  }
});

console.log('\n════════════════════════════════════════════════════════════════════');
console.log(`RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('════════════════════════════════════════════════════════════════════');

if (failCount > 0) {
  process.exit(1);
}
