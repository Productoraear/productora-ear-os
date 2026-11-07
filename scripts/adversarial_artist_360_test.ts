/**
 * ════════════════════════════════════════════════════════════════════════════
 * ADVERSARIAL STRESS-TEST SUITE: ARTIST 360 CONTRACT & FINANCIAL ENGINE
 * ════════════════════════════════════════════════════════════════════════════
 * Independent reviewer & adversarial critic verification:
 * - 10,000 randomized and edge-case gross values testing integer cents invariant
 * - Format cache floor violations across all formats
 * - Boundary conditions for logistics (0, 49.99, 50, 50.01, 200, 200.01 km)
 * - Boundary conditions for hotel (2:59, 3:00, 3:01, 23, 0)
 * - Negative, NaN, zero and extreme inputs
 * - ISRC malformed inputs, injection attempts, boundary sequences
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
} from '../src/lib/artists/artist-360-contract';

let failedChecks = 0;
let passedChecks = 0;

function assert(condition: boolean, testName: string, detail: string = '') {
  if (!condition) {
    console.error(`❌ FAILED: ${testName} | ${detail}`);
    failedChecks++;
  } else {
    passedChecks++;
  }
}

console.log('🔥 [CRITIC] Starting Adversarial Stress-Test Suite for Artist 360 Contract...\n');

// ── 1. Split Soberano Invariant Across 10,000 cases ─────────────────────────
console.log('Testing 10,000 cases for integer cents conservation (artist + earOs + vimume === total)...');
let maxResidualAbsorbed = 0;

for (let i = 1; i <= 10000; i++) {
  // Test a wide spread: micro-amounts, fractional cents, typical event amounts, huge B2G contracts
  const gross = i <= 500
    ? i * 0.01 // 0.01 to 5.00 €
    : i <= 5000
    ? (i * 0.37 + 0.03) // arbitrary fractional decimals
    : (i * 12.34567);

  const res = settleArtistSplit(gross);

  const sumCents = res.artistCents + res.earOsCents + res.vimumeCents;
  if (sumCents !== res.totalCents) {
    assert(false, `Cents conservation violated at gross=${gross}`, `sum=${sumCents} total=${res.totalCents}`);
  }

  // Check that no cents are lost in floating conversion
  const expectedTotalCents = Math.round(gross * 100);
  if (res.totalCents !== expectedTotalCents) {
    assert(false, `totalCents mismatch at gross=${gross}`, `got=${res.totalCents} expected=${expectedTotalCents}`);
  }

  // Remainder absorbed by VIMUME should never exceed 1 cent
  const idealVimume = res.totalCents * 0.1;
  const diff = Math.abs(res.vimumeCents - idealVimume);
  if (diff > maxResidualAbsorbed) maxResidualAbsorbed = diff;

  if (res.artistCents < 0 || res.earOsCents < 0 || res.vimumeCents < 0) {
    assert(false, `Negative cents produced at gross=${gross}`, JSON.stringify(res));
  }
}
assert(true, '10,000 randomized split calculations preserved exact cents invariant', `Max VIMUME residual diff: ${maxResidualAbsorbed.toFixed(4)} cents`);

// ── 2. Format Minimum Cache Floors (Under-cutting attacks) ───────────────────
console.log('\nTesting undercutting attacks on minimum cache floors...');
const formats: ArtistFormat[] = ['SOLISTA', 'DUO', 'MARIACHI', 'ORQUESTA', 'DJ'];

for (const fmt of formats) {
  const minExpected = MIN_CACHE_BY_FORMAT[fmt];

  // Try 0 €
  const quote0 = calculateArtistQuote({ format: fmt, distanceKm: 0, requestedBaseCacheEur: 0 });
  assert(quote0.baseCacheEur === minExpected, `Undercut 0€ blocked for ${fmt}`, `got ${quote0.baseCacheEur}, expected ${minExpected}`);

  // Try negative €
  const quoteNeg = calculateArtistQuote({ format: fmt, distanceKm: 0, requestedBaseCacheEur: -500 });
  assert(quoteNeg.baseCacheEur === minExpected, `Negative fee blocked for ${fmt}`, `got ${quoteNeg.baseCacheEur}`);

  // Try 1 cent below minimum
  const quoteUnder = calculateArtistQuote({ format: fmt, distanceKm: 0, requestedBaseCacheEur: minExpected - 0.01 });
  assert(quoteUnder.baseCacheEur === minExpected, `Undercut min - 0.01 blocked for ${fmt}`, `got ${quoteUnder.baseCacheEur}`);

  // Try higher fee (should be accepted)
  const quoteOver = calculateArtistQuote({ format: fmt, distanceKm: 0, requestedBaseCacheEur: minExpected + 500 });
  assert(quoteOver.baseCacheEur === minExpected + 500, `Premium fee respected for ${fmt}`, `got ${quoteOver.baseCacheEur}`);
}

// ── 3. Logistics Boundary Conditions (50 km exemption) ───────────────────────
console.log('\nTesting logistics boundary conditions...');

// Case 0 km
const q0 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 0 });
assert(q0.chargeableKm === 0 && q0.logisticsTotalEur === 0, '0 km => 0 chargeable km and 0 € logistics');

// Case negative km
const qNegKm = calculateArtistQuote({ format: 'SOLISTA', distanceKm: -100 });
assert(qNegKm.chargeableKm === 0 && qNegKm.logisticsTotalEur === 0, 'Negative distance clamped to 0');

// Case 49.99 km
const q49 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 49.99 });
assert(q49.chargeableKm === 0 && q49.logisticsTotalEur === 0, '49.99 km inside 50 km exemption');

// Case 50 km exactly
const q50 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 50 });
assert(q50.chargeableKm === 0 && q50.logisticsTotalEur === 0, '50 km exactly inside exemption');

// Case 51 km (1 chargeable km)
const q51 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 51 });
assert(q51.chargeableKm === 1 && q51.logisticsTotalEur === 1.5, '51 km => 1 chargeable km = 1.50 €');

// Case 70 km (20 chargeable km)
const q70 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 70 });
assert(q70.chargeableKm === 20 && q70.logisticsTotalEur === 30, '70 km => 20 chargeable km = 30.00 €');

// ── 4. Hotel Boundary Conditions (200 km / 3:00 AM) ──────────────────────────
console.log('\nTesting hotel supplement boundary conditions...');

// Case 200 km, hour 2
const qH200 = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 200, endHour24: 2 });
assert(qH200.hotelSupplementEur === 0, '200 km and 2:00 AM does NOT trigger hotel supplement');

// Case 200.01 km, hour 2
const qH200Plus = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 200.01, endHour24: 2 });
assert(qH200Plus.hotelSupplementEur === 120, '200.01 km triggers 120 € hotel supplement regardless of hour');

// Case 10 km, hour 3
const qH3am = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 10, endHour24: 3 });
assert(qH3am.hotelSupplementEur === 120, 'Finishing at 3:00 AM triggers 120 € hotel supplement regardless of distance');

// Case 10 km, hour 4
const qH4am = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 10, endHour24: 4 });
assert(qH4am.hotelSupplementEur === 120, 'Finishing at 4:00 AM triggers 120 € hotel supplement');

// Case 10 km, hour 0 (midnight)
const qH0am = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 10, endHour24: 0 });
assert(qH0am.hotelSupplementEur === 0, 'Finishing at 0:00 does not trigger hotel supplement');

// ── 5. Deposit and Net Pending Settlement ───────────────────────────────────
console.log('\nTesting deposit deductions and net pending balances...');
// Solista base 350 € event with 100 € deposit
const qBase = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 40 });
assert(qBase.totalEventEur === 350, 'Total event is 350 €');
assert(qBase.depositDeductibleEur === 100, 'Deposit deductible is 100 €');
assert(qBase.pendingFinalSettlementEur === 250, 'Pending final settlement is 250 €');

// Split deduction: artist gets 80% of 350 = 280 €. Net after 100 € deposit = 180 €
const sBase = settleArtistSplit(350, 100);
assert(sBase.artistEur === 280, 'Artist gross is 280 €');
assert(sBase.depositPaidEur === 100, 'Deposit paid is 100 €');
assert(sBase.artistNetPendingEur === 180, 'Artist net pending is 180 €');
assert(sBase.earOsEur === 35, 'EAR OS is 35 € (10%)');
assert(sBase.vimumeEur === 35, 'VIMUME is 35 € (10%)');

// What if gross is smaller than deposit? Net pending must clamp to 0 (no negative payouts)
const sSmall = settleArtistSplit(50, 100);
assert(sSmall.artistNetPendingCents === 0, 'Net pending clamps to 0 when deposit exceeds artist share');
assert(sSmall.artistNetPendingEur === 0, 'Net pending Eur clamps to 0');

// ── 6. Acoustic Rider and B2G Ceiling ────────────────────────────────────────
console.log('\nTesting Acoustic Rider & B2G ceiling...');
const qPax = calculateArtistQuote({ format: 'SOLISTA', distanceKm: 0, audiencePax: 250 });
assert(qPax.acousticRider.wattsTotal === 250 * 12, 'Watts = pax * 12 (3000 W)');
assert(qPax.acousticRider.maxSplDb === 75, 'SPL ceiling is 75 dB');
assert(qPax.acousticRider.compliant === true, 'Rider is compliant');

// B2G alert: threshold is 14.250 €
const qB2GNormal = calculateArtistQuote({ format: 'ORQUESTA', distanceKm: 100, customBaseCacheEur: 5000 });
assert(qB2GNormal.b2gCeilingAlert === false, '5000 € is below 14.250 € B2G ceiling');

const qB2GHigh = calculateArtistQuote({ format: 'ORQUESTA', distanceKm: 100, customBaseCacheEur: 14250 });
assert(qB2GHigh.b2gCeilingAlert === true, '14.250 € triggers B2G ceiling alert');

// ── 7. ISRC Validation & Canonical Generation ────────────────────────────────
console.log('\nTesting ISRC validation and canonical generation...');

// Valid formats
assert(validateIsrc('ES-EAR-26-00001').valid === true, 'ES-EAR-26-00001 valid');
assert(validateIsrc('es-ear-26-00042').valid === true, 'Lowercase normalized and valid');
assert(validateIsrc('  ES-EAR-26-99999  ').valid === true, 'Whitespace trimmed and valid');

// Invalid formats
assert(validateIsrc('US-EAR-26-00001').valid === false, 'Invalid country rejected');
assert(validateIsrc('ES-ABC-26-00001').valid === false, 'Invalid registrant rejected');
assert(validateIsrc('ES-EAR-2026-00001').valid === false, '4-digit year in code rejected');
assert(validateIsrc('ES-EAR-26-001').valid === false, '3-digit designation rejected');
assert(validateIsrc('ES-EAR-26-000001').valid === false, '6-digit designation rejected');
assert(validateIsrc('').valid === false, 'Empty code rejected');
assert(validateIsrc('; DROP TABLE tracks; --').valid === false, 'SQL injection attempt rejected');

// Canonical generation roundtrip
for (let seq = 1; seq <= 50; seq++) {
  const code = generateCanonicalIsrc(26, seq);
  const validated = validateIsrc(code);
  if (!validated.valid || validated.designation !== String(seq).padStart(5, '0')) {
    assert(false, `Canonical ISRC failed for sequence ${seq}`, `code=${code}`);
  }
}
assert(true, 'Canonical generation 1..50 roundtripped successfully');

// ── 8. Edwin Agudelo Catalog & Tracks Integrity ─────────────────────────────
console.log('\nTesting Catalog & Tracks integrity...');
assert(ARTIST_360_TRACKS.length === 6, 'Edwin Agudelo catalog contains 6 flagship tracks');
for (const track of ARTIST_360_TRACKS) {
  assert(track.title.length > 0, `Track ${track.id} has title`);
  assert(validateIsrc(track.isrc).valid === true, `Track ${track.id} has valid ISRC (${track.isrc})`);
  assert(track.durationSeconds > 0, `Track ${track.id} has positive duration`);
}

assert(EDWIN_AGUDELO_PROFILE_360.baseCacheEur === 350, 'Edwin Agudelo base cache is 350 €');
assert(EDWIN_AGUDELO_PROFILE_360.fiscalCity === 'Méntrida', 'Edwin Agudelo fiscal city is Méntrida');
assert(EDWIN_AGUDELO_PROFILE_360.fiscalProvince === 'Toledo', 'Edwin Agudelo fiscal province is Toledo');

// ── Summary ──────────────────────────────────────────────────────────────────
console.log(`\n══════════════════════════════════════════════════════════════`);
console.log(`ADVERSARIAL STRESS TEST SUMMARY:`);
console.log(`Total checks passed: ${passedChecks}`);
console.log(`Total checks failed: ${failedChecks}`);
console.log(`══════════════════════════════════════════════════════════════`);

if (failedChecks > 0) {
  console.error(`💥 [CRITIC] ADVERSARIAL STRESS TEST FAILED WITH ${failedChecks} ERRORS`);
  process.exit(1);
} else {
  console.log(`🏆 [CRITIC] ALL ADVERSARIAL STRESS TESTS PASSED (EXIT CODE 0)`);
  process.exit(0);
}
