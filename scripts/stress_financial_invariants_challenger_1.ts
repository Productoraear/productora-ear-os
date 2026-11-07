/**
 * ════════════════════════════════════════════════════════════════════════════
 * STRESS_FINANCIAL_INVARIANTS_CHALLENGER_1.TS
 * ════════════════════════════════════════════════════════════════════════════
 * Empirical Adversarial Challenger 1: Financial & Invariants Stress Harness
 *
 * Exhaustive property-based verification and hostile boundary challenge for:
 * `src/lib/artists/artist-360-contract.ts`
 *
 * Mandatory Verification Matrix:
 * 1. Split Soberano Invariant: 10,000 randomized property cases:
 *    `artistCents + earOsCents + vimumeCents === totalCents` (0 delta tolerance).
 * 2. Inviolable Solista Floor: >= 350.00 € across negative, zero, NaN, hostile inputs.
 * 3. Exact Distance Boundaries: 0, 49, 50, 51, 199, 200, 201 km.
 * 4. Exact Hour Boundaries: 2:59 (0 € hotel) vs 3:00 (120 € hotel) vs 4:00 (120 € hotel).
 * 5. Deposit Deduction: exactly 100.00 € deducted; net balance >= 0.
 * 6. ISRC ISO 3901 Edge Cases: canonical regex, lowercase normalization, hostile strings.
 * 7. Acoustic Rider (< 75 dB SPL, 12 W/pax) & B2G safe ceiling (< 14,250 €).
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  calculateArtistQuote,
  settleArtistSplit,
  validateIsrc,
  generateCanonicalIsrc,
  MIN_CACHE_BY_FORMAT,
  ArtistFormat,
  ARTIST_360_TRACKS,
  EDWIN_AGUDELO_PROFILE_360,
  ISRC_REGEX,
  ISO_3901_REGEX,
} from '../src/lib/artists/artist-360-contract';

import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  LOGISTICA_KM_HOTEL,
  SUPLEMENTO_HOTEL_EUR,
  HORA_FIN_HOTEL,
  AJUSTE_PREVENTIVO_B2G_EUR,
} from '../src/lib/constants/ear-os-ssot';

interface ChallengerStats {
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  failures: string[];
}

const stats: ChallengerStats = {
  totalAssertions: 0,
  passedAssertions: 0,
  failedAssertions: 0,
  failures: [],
};

function assert(condition: boolean, testId: string, description: string, detail?: string): void {
  stats.totalAssertions++;
  if (condition) {
    stats.passedAssertions++;
  } else {
    stats.failedAssertions++;
    const errMsg = `[FAIL] ${testId} - ${description}${detail ? ` :: ${detail}` : ''}`;
    stats.failures.push(errMsg);
    console.error(`  ❌ ${errMsg}`);
  }
}

// Pseudo-Random Number Generator (Mulberry32 with fixed deterministic seed)
function createPrng(seed: number) {
  let s = seed >>> 0;
  return function next(): number {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

console.log('════════════════════════════════════════════════════════════════');
console.log('⚡ EMPIRICAL CHALLENGER 1: FINANCIAL & INVARIANTS HARNESS');
console.log('   Target: src/lib/artists/artist-360-contract.ts');
console.log('════════════════════════════════════════════════════════════════\n');

// ─────────────────────────────────────────────────────────────────────────────
// 1. PROPERTY-BASED RANDOMIZED SPLIT INVARIANT (10,000 ITERATIONS)
// ─────────────────────────────────────────────────────────────────────────────
console.log('🧪 SUITE 1: Property-Based Split Invariant (10,000 Iterations)...');

const prng = createPrng(0xdeadbeef);
let maxPennyResidual = 0;
let minArtistRatio = 1.0;
let maxArtistRatio = 0.0;

for (let i = 1; i <= 10000; i++) {
  // Test across multiple magnitude tiers:
  // - Tier A (1..1000): Micro-amounts 0.01 € to 10.00 € with floating decimals
  // - Tier B (1001..5000): Typical event quotes 350.00 € to 5,000.00 €
  // - Tier C (5001..9000): High-end corporate & B2G quotes 5,000.00 € to 15,000.00 €
  // - Tier D (9001..10000): Stress edge amounts up to 100,000.00 € with high precision decimals
  let grossAmountEur: number;
  if (i <= 1000) {
    grossAmountEur = 0.01 + prng() * 9.99;
  } else if (i <= 5000) {
    grossAmountEur = 350.0 + prng() * 4650.0;
  } else if (i <= 9000) {
    grossAmountEur = 5000.0 + prng() * 10000.0;
  } else {
    grossAmountEur = 15000.0 + prng() * 85000.0;
  }

  // Vary deposit: 0, 100, or random in [0..200]
  const depositPaidEur = i % 3 === 0 ? DEPOSITO_STRIPE_EUR : i % 3 === 1 ? 0 : Math.round(prng() * 200);

  const res = settleArtistSplit(grossAmountEur, depositPaidEur);

  // Invariant 1: Conservation of integer cents (EXACT STRICT ZERO DELTA)
  const sumCents = res.artistCents + res.earOsCents + res.vimumeCents;
  if (sumCents !== res.totalCents) {
    assert(
      false,
      `SPLIT-10K-${i}`,
      `Strict integer cents conservation failed for gross=${grossAmountEur}`,
      `sumCents=${sumCents}, totalCents=${res.totalCents}`
    );
  }

  // Invariant 2: totalCents equals Math.round(grossAmountEur * 100)
  const expectedTotalCents = Math.round(grossAmountEur * 100);
  if (res.totalCents !== expectedTotalCents) {
    assert(
      false,
      `SPLIT-TOTAL-${i}`,
      `totalCents does not match rounded gross cents`,
      `res.totalCents=${res.totalCents}, expected=${expectedTotalCents}`
    );
  }

  // Invariant 3: Eur representations exactly equal cents / 100
  if (
    res.artistEur !== res.artistCents / 100 ||
    res.earOsEur !== res.earOsCents / 100 ||
    res.vimumeEur !== res.vimumeCents / 100 ||
    res.totalGrossEur !== res.totalCents / 100
  ) {
    assert(false, `SPLIT-EUR-CONV-${i}`, `EUR values drift from cents / 100`);
  }

  // Invariant 4: No negative cents anywhere
  if (res.artistCents < 0 || res.earOsCents < 0 || res.vimumeCents < 0) {
    assert(false, `SPLIT-NEGATIVE-${i}`, `Negative cents produced`);
  }

  // Invariant 5: Net pending balance never negative and exactly equals Math.max(0, artist - deposit)
  const expectedDepositCents = Math.round(depositPaidEur * 100);
  const expectedNetPendingCents = Math.max(0, res.artistCents - expectedDepositCents);
  if (res.artistNetPendingCents !== expectedNetPendingCents) {
    assert(
      false,
      `SPLIT-NET-PENDING-${i}`,
      `Net pending cents mismatch`,
      `got=${res.artistNetPendingCents}, expected=${expectedNetPendingCents}`
    );
  }

  // Track VIMUME penny absorption
  const idealVimumeCents = res.totalCents * 0.1;
  const pennyResidual = Math.abs(res.vimumeCents - idealVimumeCents);
  if (pennyResidual > maxPennyResidual) {
    maxPennyResidual = pennyResidual;
  }

  if (res.totalCents >= 100) {
    const ratio = res.artistCents / res.totalCents;
    if (ratio < minArtistRatio) minArtistRatio = ratio;
    if (ratio > maxArtistRatio) maxArtistRatio = ratio;
  }
}

assert(
  stats.failedAssertions === 0,
  'PBT-SPLIT-10000',
  '10,000 property-based iterations satisfied exact cents conservation (0 drift)',
  `Max VIMUME residual: ${maxPennyResidual.toFixed(4)} cents, Artist ratio range: [${minArtistRatio.toFixed(4)}, ${maxArtistRatio.toFixed(4)}]`
);
console.log(`  ✅ 10,000 split cases verified. Max penny absorption: ${maxPennyResidual.toFixed(4)} cents.`);

// ─────────────────────────────────────────────────────────────────────────────
// 2. INVIOLABLE SOLISTA FLOOR (>= 350,00 €)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🧪 SUITE 2: Inviolable Solista Floor (>= 350,00 €)...');

const solistaFloorCases = [
  { input: 0, desc: 'Zero euro requested' },
  { input: -0.01, desc: 'Negative micro euro requested' },
  { input: -350, desc: 'Negative 350 euro requested' },
  { input: -999999, desc: 'Large negative requested' },
  { input: 1, desc: '1.00 euro requested' },
  { input: 100, desc: '100.00 euro requested' },
  { input: 349.99, desc: '349.99 euro (1 cent below floor)' },
  { input: 350.00, desc: '350.00 euro (exact floor)' },
  { input: NaN, desc: 'NaN requested' },
  { input: undefined, desc: 'Undefined requested' },
  { input: -Infinity, desc: '-Infinity requested' },
];

for (const tc of solistaFloorCases) {
  // Test using requestedBaseCacheEur
  const q1 = calculateArtistQuote({
    format: 'SOLISTA',
    distanceKm: 0,
    requestedBaseCacheEur: tc.input,
  });
  assert(
    q1.baseCacheEur >= TARIFA_BASE_SOLISTA_EUR,
    `SOLISTA-FLOOR-${tc.desc}`,
    `Solista base cache must be >= 350.00 € for ${tc.desc}`,
    `got=${q1.baseCacheEur}`
  );
  assert(
    q1.baseCacheEur === (typeof tc.input === 'number' && !Number.isNaN(tc.input) && tc.input > 350 ? tc.input : 350),
    `SOLISTA-FLOOR-VAL-${tc.desc}`,
    `Solista floor clamps to 350.00 € for ${tc.desc}`,
    `got=${q1.baseCacheEur}`
  );

  // Test using customBaseCacheEur alias
  const q2 = calculateArtistQuote({
    format: 'SOLISTA',
    distanceKm: 0,
    customBaseCacheEur: tc.input,
  });
  assert(
    q2.baseCacheEur >= TARIFA_BASE_SOLISTA_EUR,
    `SOLISTA-ALIAS-${tc.desc}`,
    `customBaseCacheEur alias must uphold 350.00 € floor for ${tc.desc}`,
    `got=${q2.baseCacheEur}`
  );
}

// Test floor preservation when above minimum
const qAbove = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 0,
  requestedBaseCacheEur: 450.00,
});
assert(qAbove.baseCacheEur === 450.00, 'SOLISTA-ABOVE-FLOOR', 'Legitimate cache above floor (450 €) is respected');

// Check all formats for floor enforcement
const formatFloors: Record<ArtistFormat, number> = {
  SOLISTA: 350.0,
  DUO: 500.0,
  MARIACHI: 650.0,
  ORQUESTA: 1800.0,
  DJ: 400.0,
};

for (const [fmt, expectedFloor] of Object.entries(formatFloors)) {
  const qFmt = calculateArtistQuote({
    format: fmt as ArtistFormat,
    distanceKm: 0,
    requestedBaseCacheEur: -100,
  });
  assert(
    qFmt.baseCacheEur === expectedFloor,
    `FORMAT-FLOOR-${fmt}`,
    `Format ${fmt} floor must be exactly ${expectedFloor} €`,
    `got=${qFmt.baseCacheEur}`
  );
}
console.log('  ✅ Inviolable floors verified across all 5 formats and hostile inputs.');

// ─────────────────────────────────────────────────────────────────────────────
// 3. EXACT DISTANCE BOUNDARIES (0, 49, 50, 51, 199, 200, 201 KM)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🧪 SUITE 3: Exact Distance Boundary Stress (0, 49, 50, 51, 199, 200, 201 km)...');

const distanceBoundaries = [
  { km: 0, expectedChargeable: 0, expectedLogistics: 0.0, expectedHotel: 0, desc: '0 km (at hub)' },
  { km: 49, expectedChargeable: 0, expectedLogistics: 0.0, expectedHotel: 0, desc: '49 km (inside 50km exemption)' },
  { km: 50, expectedChargeable: 0, expectedLogistics: 0.0, expectedHotel: 0, desc: '50 km (exact exemption boundary)' },
  { km: 51, expectedChargeable: 1, expectedLogistics: 1.50, expectedHotel: 0, desc: '51 km (1 chargeable km)' },
  { km: 199, expectedChargeable: 149, expectedLogistics: 223.50, expectedHotel: 0, desc: '199 km (1km below hotel trigger)' },
  { km: 200, expectedChargeable: 150, expectedLogistics: 225.00, expectedHotel: 0, desc: '200 km (exact hotel boundary)' },
  { km: 201, expectedChargeable: 151, expectedLogistics: 226.50, expectedHotel: 120.00, desc: '201 km (triggers 120€ hotel)' },
];

for (const b of distanceBoundaries) {
  const q = calculateArtistQuote({
    format: 'SOLISTA',
    distanceKm: b.km,
    endHour24: 1, // early hour to isolate distance hotel trigger
  });

  assert(
    q.chargeableKm === b.expectedChargeable,
    `DIST-CHARGEABLE-${b.km}KM`,
    `Chargeable km for ${b.desc} must be ${b.expectedChargeable}`,
    `got=${q.chargeableKm}`
  );
  assert(
    q.logisticsTotalEur === b.expectedLogistics,
    `DIST-COST-${b.km}KM`,
    `Logistics cost for ${b.desc} must be ${b.expectedLogistics} €`,
    `got=${q.logisticsTotalEur}`
  );
  assert(
    q.hotelSupplementEur === b.expectedHotel,
    `DIST-HOTEL-${b.km}KM`,
    `Hotel supplement for ${b.desc} must be ${b.expectedHotel} €`,
    `got=${q.hotelSupplementEur}`
  );
}

// Additional fractional and negative distance stress
const qNegativeKm = calculateArtistQuote({ format: 'SOLISTA', distanceKm: -50 });
assert(qNegativeKm.chargeableKm === 0, 'DIST-NEG-CHARGEABLE', 'Negative distance produces 0 chargeable km');
assert(qNegativeKm.logisticsTotalEur === 0, 'DIST-NEG-COST', 'Negative distance produces 0.00 € logistics');

const qFractional49 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 49.99 });
assert(qFractional49.chargeableKm === 0, 'DIST-49.99-CHARGEABLE', '49.99 km inside exemption');

const qFractional50 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 50.5 });
assert(qFractional50.chargeableKm === 0.5, 'DIST-50.5-CHARGEABLE', '50.5 km yields 0.5 chargeable km');
assert(qFractional50.logisticsTotalEur === 0.75, 'DIST-50.5-COST', '50.5 km yields 0.75 € logistics');

const qFractional200 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 200.01, endHour24: 1 });
assert(qFractional200.hotelSupplementEur === 120.00, 'DIST-200.01-HOTEL', '200.01 km triggers hotel');

console.log('  ✅ Distance boundaries 0, 49, 50, 51, 199, 200, 201 km verified exactly.');

// ─────────────────────────────────────────────────────────────────────────────
// 4. EXACT HOUR BOUNDARIES (2:59, 3:00, 4:00)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🧪 SUITE 4: Exact Hour Boundary Stress (2:59, 3:00, 4:00)...');

// Boundary test for hour 2:59 (0 € hotel)
// Tested both as decimal representation (2 + 59/60 = 2.98333) and direct 2.59
const qHour259Decimal = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 80,
  endHour24: 2 + 59 / 60, // 2:59 in hours
});
assert(
  qHour259Decimal.hotelSupplementEur === 0,
  'HOUR-2:59-DECIMAL',
  'Hour 2:59 (2.9833h) does NOT trigger hotel supplement',
  `got=${qHour259Decimal.hotelSupplementEur}`
);

const qHour259Direct = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 80,
  endHour24: 2.59,
});
assert(
  qHour259Direct.hotelSupplementEur === 0,
  'HOUR-2:59-DIRECT',
  'Hour 2.59 does NOT trigger hotel supplement',
  `got=${qHour259Direct.hotelSupplementEur}`
);

// Boundary test for hour 3:00 (120 € hotel)
const qHour300 = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 80,
  endHour24: 3.0,
});
assert(
  qHour300.hotelSupplementEur === SUPLEMENTO_HOTEL_EUR,
  'HOUR-3:00',
  'Hour 3:00 EXACTLY triggers 120.00 € hotel supplement',
  `got=${qHour300.hotelSupplementEur}`
);

// Boundary test for hour 4:00 (120 € hotel)
const qHour400 = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 80,
  endHour24: 4.0,
});
assert(
  qHour400.hotelSupplementEur === SUPLEMENTO_HOTEL_EUR,
  'HOUR-4:00',
  'Hour 4:00 triggers 120.00 € hotel supplement',
  `got=${qHour400.hotelSupplementEur}`
);

// Midnight / Default tests
const qHourMidnight = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 80, endHour24: 0 });
assert(qHourMidnight.hotelSupplementEur === 0, 'HOUR-0:00', 'Midnight (0h) does NOT trigger hotel');

const qHourUndefined = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 80 });
assert(qHourUndefined.hotelSupplementEur === 0, 'HOUR-UNDEFINED', 'Undefined hour does NOT trigger hotel');

// Cross-trigger idempotence test: distance > 200 km AND endHour >= 3:00
const qDoubleTrigger = calculateArtistQuote({
  format: 'SOLISTA',
  distanceKm: 250, // triggers hotel
  endHour24: 4,    // ALSO triggers hotel
});
assert(
  qDoubleTrigger.hotelSupplementEur === 120.00,
  'HOTEL-IDEMPOTENT',
  'Both distance > 200 km and hour >= 3 triggers hotel exactly ONCE (120.00 €, not 240 €)',
  `got=${qDoubleTrigger.hotelSupplementEur}`
);

console.log('  ✅ Hour boundaries 2:59 (0 €), 3:00 (120 €), 4:00 (120 €) verified with idempotence.');

// ─────────────────────────────────────────────────────────────────────────────
// 5. DEPOSIT DEDUCTION & SETTLEMENT BALANCE
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🧪 SUITE 5: Deposit Deduction & Settlement Integrity...');

// Verify 100 € deposit deductible across 500 randomized valid quote requests
for (let j = 1; j <= 500; j++) {
  const dist = Math.round(prng() * 300);
  const hour = Math.floor(prng() * 6);
  const q = calculateArtistQuote({
    format: 'SOLISTA',
    distanceKm: dist,
    endHour24: hour,
  });

  assert(
    q.depositDeductibleEur === DEPOSITO_STRIPE_EUR,
    `DEP-DEDUCTIBLE-${j}`,
    'depositDeductibleEur must be 100.00 €'
  );

  const expectedPending = Math.max(0, Math.round((q.totalEventEur - 100.00) * 100) / 100);
  assert(
    q.pendingFinalSettlementEur === expectedPending,
    `DEP-PENDING-${j}`,
    `pendingFinalSettlementEur must equal totalEventEur - 100.00 € exactly`,
    `total=${q.totalEventEur}, pending=${q.pendingFinalSettlementEur}, expected=${expectedPending}`
  );
}

// Canonical Solista check (350 € base, 0 km, 0h)
const qSolistaPure = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 0 });
assert(qSolistaPure.totalEventEur === 350.00, 'SOLISTA-TOTAL', 'Solista total without logistics is 350.00 €');
assert(qSolistaPure.pendingFinalSettlementEur === 250.00, 'SOLISTA-PENDING', 'Pending balance is exactly 250.00 €');

// Split settlement verification for Solista 350 €
const sSolista = settleArtistSplit(350.00, 100.00);
assert(sSolista.totalGrossEur === 350.00, 'SPLIT-SOLISTA-GROSS', 'Total gross 350.00 €');
assert(sSolista.artistEur === 280.00, 'SPLIT-SOLISTA-ARTIST', 'Artist gross 280.00 € (80%)');
assert(sSolista.earOsEur === 35.00, 'SPLIT-SOLISTA-EAROS', 'EAR OS 35.00 € (10%)');
assert(sSolista.vimumeEur === 35.00, 'SPLIT-SOLISTA-VIMUME', 'VIMUME 35.00 € (10%)');
assert(sSolista.depositDeductedCents === 10000, 'SPLIT-SOLISTA-DEP-CENTS', 'Deposit deducted is 10000 cents (100 €)');
assert(sSolista.artistNetPendingEur === 180.00, 'SPLIT-SOLISTA-ARTIST-NET', 'Artist net pending is exactly 180.00 €');
assert(
  sSolista.artistCents + sSolista.earOsCents + sSolista.vimumeCents === sSolista.totalCents,
  'SPLIT-SOLISTA-CONSERVATION',
  'Split sum strictly equals total cents'
);

// Under-deposit edge case: what if total gross < 100 €?
const sTiny = settleArtistSplit(60.00, 100.00);
assert(sTiny.artistNetPendingCents === 0, 'SPLIT-TINY-CLAMP-CENTS', 'Pending cents clamp to 0 (no negative balance)');
assert(sTiny.artistNetPendingEur === 0.00, 'SPLIT-TINY-CLAMP-EUR', 'Pending eur clamps to 0.00 €');
assert(sTiny.artistCents === 4800, 'SPLIT-TINY-ARTIST-CENTS', 'Artist earned 48.00 €');
assert(
  sTiny.artistCents + sTiny.earOsCents + sTiny.vimumeCents === sTiny.totalCents,
  'SPLIT-TINY-CONSERVATION',
  'Cents conservation holds even when gross < deposit'
);

console.log('  ✅ 100.00 € deposit deduction and net pending settlement verified.');

// ─────────────────────────────────────────────────────────────────────────────
// 6. ISRC ISO 3901 EDGE CASES & HOSTILE FUZZING
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🧪 SUITE 6: ISRC ISO 3901 Edge Cases & Hostile Fuzzing...');

// 6.1 Valid Canonical & Normalized Cases
const validIsrcs = [
  'ES-EAR-26-00001',
  'ES-EAR-26-00042',
  'ES-EAR-00-00000',
  'ES-EAR-99-99999',
  'es-ear-26-00001',       // lowercase auto-uppercased
  '  ES-EAR-26-00001  ',   // whitespace trimmed
  '  es-ear-26-00001  ',   // both trimmed & uppercased
];

for (const code of validIsrcs) {
  const res = validateIsrc(code);
  assert(res.valid === true, `ISRC-VALID-${code.trim()}`, `Code "${code}" must be valid`);
  assert(res.country === 'ES', `ISRC-COUNTRY-${code.trim()}`, 'Country is ES');
  assert(res.registrant === 'EAR', `ISRC-REGISTRANT-${code.trim()}`, 'Registrant is EAR');
  assert(res.year.length === 2, `ISRC-YEAR-${code.trim()}`, 'Year has 2 digits');
  assert(res.designation.length === 5, `ISRC-DESIG-${code.trim()}`, 'Designation has 5 digits');
  assert(res.normalized === code.trim().toUpperCase(), `ISRC-NORM-${code.trim()}`, 'Normalized matches');
}

// 6.2 Canonical Generator Roundtrip (100 sequences)
for (let seq = 1; seq <= 100; seq++) {
  const generated = generateCanonicalIsrc(26, seq);
  const validated = validateIsrc(generated);
  assert(
    validated.valid === true,
    `ISRC-GEN-ROUNDTRIP-${seq}`,
    `Generated ISRC "${generated}" must validate as true`
  );
  assert(
    validated.designation === String(seq).padStart(5, '0'),
    `ISRC-GEN-DESIG-${seq}`,
    `Designation must match sequence padded to 5 digits`
  );
}

// 6.3 Hostile, Malformed & Permuted ISRCs
const invalidIsrcs = [
  { code: 'US-EAR-26-00001', reason: 'Foreign country code' },
  { code: 'GB-EAR-26-00001', reason: 'Foreign country code' },
  { code: 'ES-SONY-26-00001', reason: 'Wrong registrant code' },
  { code: 'ES-XXX-26-00001', reason: 'Wrong registrant code' },
  { code: 'ES-EAR-2026-00001', reason: '4-digit year' },
  { code: 'ES-EAR-2-00001', reason: '1-digit year' },
  { code: 'ES-EAR-26-1', reason: '1-digit designation' },
  { code: 'ES-EAR-26-01', reason: '2-digit designation' },
  { code: 'ES-EAR-26-001', reason: '3-digit designation' },
  { code: 'ES-EAR-26-0001', reason: '4-digit designation' },
  { code: 'ES-EAR-26-000001', reason: '6-digit designation' },
  { code: 'ES-EAR-2A-00001', reason: 'Alpha characters in year' },
  { code: 'ES-EAR-26-0001A', reason: 'Alpha characters in designation' },
  { code: 'ES-EAR-XX-YYYYY', reason: 'Non-numeric year and designation' },
  { code: 'ESEAR2600001', reason: 'Missing hyphens' },
  { code: 'ES_EAR_26_00001', reason: 'Underscores instead of hyphens' },
  { code: 'ES/EAR/26/00001', reason: 'Slashes instead of hyphens' },
  { code: 'ES.EAR.26.00001', reason: 'Dots instead of hyphens' },
  { code: '', reason: 'Empty string' },
  { code: '   ', reason: 'Whitespace only' },
  { code: 'ES-EAR-26-00001; DROP TABLE tracks;', reason: 'SQL injection suffix' },
  { code: '<script>alert("xss")</script>', reason: 'XSS script injection' },
  { code: 'ES-EAR-\n26-00001', reason: 'Internal newline injection' },
  { code: 'ES-EAR-\t26-00001', reason: 'Internal tab injection' },
];

for (const tc of invalidIsrcs) {
  const res = validateIsrc(tc.code);
  assert(res.valid === false, `ISRC-INVALID-${tc.reason}`, `Malformed code "${tc.code}" must be rejected`);
  assert(res.error !== undefined && res.error.length > 0, `ISRC-ERR-MSG-${tc.reason}`, 'Error message is returned');
}

// ISO 3901 Universal Regex check
assert(ISO_3901_REGEX.test('ES-EAR-26-00001'), 'ISO-3901-EAR', 'EAR ISRC complies with universal ISO 3901 regex');
assert(ISO_3901_REGEX.test('US-PR3-73-00012'), 'ISO-3901-US', 'Universal ISO 3901 regex handles other standard codes');

console.log('  ✅ ISRC canonical validation and hostile fuzzing verified.');

// ─────────────────────────────────────────────────────────────────────────────
// 7. ACOUSTIC RIDER & B2G LCSP SAFEGUARD
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n🧪 SUITE 7: Acoustic Rider (< 75 dB SPL, 12 W/pax) & B2G Safeguard...');

const paxCases = [
  { pax: 50, expectedWatts: 600 },
  { pax: 100, expectedWatts: 1200 },
  { pax: 250, expectedWatts: 3000 },
  { pax: 500, expectedWatts: 6000 },
  { pax: 0, expectedWatts: 1200 },    // fallback to 100 pax
  { pax: -50, expectedWatts: 1200 },  // fallback to 100 pax
];

for (const tc of paxCases) {
  const q = calculateArtistQuote({
    format: 'SOLISTA',
    distanceKm: 0,
    audiencePax: tc.pax,
  });
  assert(
    q.acousticRider.wattsTotal === tc.expectedWatts,
    `ACOUSTIC-WATTS-${tc.pax}PAX`,
    `Acoustic watts for ${tc.pax} pax must be ${tc.expectedWatts} W`,
    `got=${q.acousticRider.wattsTotal}`
  );
  assert(q.acousticRider.maxSplDb === 75, `ACOUSTIC-SPL-${tc.pax}PAX`, 'SPL ceiling is 75 dB SPL');
  assert(q.acousticRider.compliant === true, `ACOUSTIC-COMPLIANT-${tc.pax}PAX`, 'Acoustic rider is compliant');
}

// B2G ceiling alert (threshold 14.250 € on totalEventEur)
const qBelowB2G = calculateArtistQuote({
  format: 'ORQUESTA',
  distanceKm: 0,
  requestedBaseCacheEur: 14249.99,
});
assert(qBelowB2G.b2gCeilingAlert === false, 'B2G-ALERT-BELOW', '14.249,99 € does NOT trigger B2G ceiling alert');

const qAtB2G = calculateArtistQuote({
  format: 'ORQUESTA',
  distanceKm: 0,
  requestedBaseCacheEur: 14250.00,
});
assert(qAtB2G.b2gCeilingAlert === true, 'B2G-ALERT-AT', '14.250,00 € EXACTLY triggers B2G ceiling alert');

// Test that logistics adding to total triggers B2G ceiling (14.200 € base + 75 € logistics = 14.275 €)
const qLogisticsPushB2G = calculateArtistQuote({
  format: 'ORQUESTA',
  distanceKm: 100, // 50 chargeable km * 1.5 = 75 €
  requestedBaseCacheEur: 14200.00,
});
assert(
  qLogisticsPushB2G.totalEventEur === 14275.00 && qLogisticsPushB2G.b2gCeilingAlert === true,
  'B2G-ALERT-LOGISTICS-PUSH',
  'Total event price including logistics (14.275 €) triggers B2G ceiling alert'
);

const qAboveB2G = calculateArtistQuote({
  format: 'ORQUESTA',
  distanceKm: 200,
  requestedBaseCacheEur: 15000.00,
});
assert(qAboveB2G.b2gCeilingAlert === true, 'B2G-ALERT-ABOVE', '15.000,00 € triggers B2G ceiling alert');

console.log('  ✅ Acoustic rider (12 W/pax, < 75 dB SPL) and B2G ceiling (14.250 €) verified.');

// ─────────────────────────────────────────────────────────────────────────────
// 8. FINAL SUMMARY AND VERDICT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════════════════════════════');
console.log('📊 CHALLENGER 1 EMPIRICAL HARNESS SUMMARY:');
console.log(`   Total Assertions Checked : ${stats.totalAssertions}`);
console.log(`   Passed Assertions        : ${stats.passedAssertions}`);
console.log(`   Failed Assertions        : ${stats.failedAssertions}`);
console.log('════════════════════════════════════════════════════════════════');

if (stats.failedAssertions > 0) {
  console.error(`\n❌ VERDICT: REQUEST_CHANGES — ${stats.failedAssertions} assertions failed!`);
  for (const f of stats.failures) {
    console.error(`   - ${f}`);
  }
  process.exit(1);
} else {
  console.log('\n🏆 VERDICT: APPROVE');
  console.log('   All mathematical invariants, boundary conditions, and financial contracts');
  console.log('   in src/lib/artists/artist-360-contract.ts have passed with ZERO errors.');
  process.exit(0);
}
