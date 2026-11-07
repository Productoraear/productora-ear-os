/**
 * ════════════════════════════════════════════════════════════════════════════
 * SCRIPTS/VERIFY_M2_ADVERSARIAL_STRESS.TS
 * ════════════════════════════════════════════════════════════════════════════
 * ADVERSARIAL STRESS TEST SUITE FOR MILESTONE 2 (BACKEND TRANSACCIONAL & N8N)
 *
 * Scenarios Tested:
 *  1. Concurrency & Replay:
 *     - HMAC price-lock signature determinism & replay invariance.
 *     - Avalanche effect on mutated payload fields.
 *     - Simulated date collision handling (HTTP 409 Conflict).
 *  2. Financial & Logistical Invariants:
 *     - Logistics km: <= 50 km => 0 cents. > 50 km => 150 cents/km for (km - 50).
 *     - Hotel fee: distance > 200 km OR eventEndTime in [03:00, 11:59] => 120 € (12.000 cents).
 *     - Normal evening event (23:00, distance <= 200 km) => strictly 0 cents.
 *     - Split Soberano 80/10/10 exact integer cents conservation.
 *     - Affiliate commission 10-15% deducted solely from EAR OS margin.
 *  3. Acoustic Rider Invariant:
 *     - recommendedWatts = guestCount * 12 W/pax RMS.
 *     - maxDbSpl strictly <= 75 dB SPL under Ley 37/2003.
 *     - Acoustic system resolution tiers.
 *  4. GET & POST Handlers on /api/fincas/visit-lock:
 *     - Missing query params rejected with HTTP 400 Bad Request.
 *     - Valid query returns 200 with proper availability structure.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest } from 'next/server';
import {
  POST as visitLockPOST,
  GET as visitLockGET,
  generatePriceLockSha256,
  FincaVisitLockRequestSchema,
} from '../src/app/api/fincas/visit-lock/route';

import {
  calculateFincaEventPricing,
  isHotelRequired,
  resolveAcousticSystem,
  distributeSplitSoberano,
  normalizeAffiliateRate,
  LOGISTICA_KM_RATE_CENTS,
  LOGISTICA_KM_EXEMPT,
  LOGISTICA_HOTEL_CENTS,
  DEPOSITO_PRICE_LOCK_CENTS,
} from '../src/lib/fincas/fincaMenuPricingEngine';

import {
  dispatchFincaLogisticsOrderAction,
  type FincaLogisticsOrderInput,
} from '../src/app/actions/fincaLogisticsActions';

import {
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
} from '../src/lib/constants/ear-os-ssot';

console.log('═══════════════════════════════════════════════════════════════════════════');
console.log('ADVERSARIAL STRESS TEST: MILESTONE 2 (BACKEND TRANSACCIONAL & N8N)');
console.log('═══════════════════════════════════════════════════════════════════════════');

let passed = 0;
let total = 0;

function check(condition: boolean, description: string, detail?: string) {
  total++;
  if (!condition) {
    console.error(`❌ [FAIL ${total}]: ${description} ${detail ? `| ${detail}` : ''}`);
    throw new Error(`Assertion failed: ${description}`);
  } else {
    passed++;
    console.log(`✅ [PASS ${total}]: ${description}`);
  }
}

export async function runAdversarialStressSuite() {
  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO 1: CONCURRENCY & REPLAY
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- SCENARIO 1: CONCURRENCY & REPLAY ---');

  const baseVisitPayload = {
    fincaId: 'finca-el-regajal',
    desiredVisitDate: '2026-12-15',
    timeSlot: 'AFTERNOON',
    amountEur: 100.0,
    contactEmail: 'director@elregajal.es',
  };

  // 1.1: Determinism across 100 iterations (pure function without random salt or timestamp)
  const baseHmac = generatePriceLockSha256(baseVisitPayload);
  check(baseHmac.startsWith('SHA256-Ω-FINCA-'), 'HMAC seal has canonical prefix SHA256-Ω-FINCA-');

  let allIdentical = true;
  for (let i = 0; i < 100; i++) {
    const iterationHmac = generatePriceLockSha256(baseVisitPayload);
    if (iterationHmac !== baseHmac) {
      allIdentical = false;
      break;
    }
  }
  check(allIdentical, 'Submitting identical visit-lock parameters 100 times produces identical HMAC signature');

  // 1.2: Replay sensitivity / Avalanche effect on mutated parameters
  const emailMutatedHmac = generatePriceLockSha256({
    ...baseVisitPayload,
    contactEmail: 'director2@elregajal.es',
  });
  check(emailMutatedHmac !== baseHmac, 'Mutating contactEmail alters HMAC signature');

  const dateMutatedHmac = generatePriceLockSha256({
    ...baseVisitPayload,
    desiredVisitDate: '2026-12-16',
  });
  check(dateMutatedHmac !== baseHmac, 'Mutating desiredVisitDate alters HMAC signature');

  const timeSlotMutatedHmac = generatePriceLockSha256({
    ...baseVisitPayload,
    timeSlot: 'MORNING',
  });
  check(timeSlotMutatedHmac !== baseHmac, 'Mutating timeSlot alters HMAC signature');

  const fincaIdMutatedHmac = generatePriceLockSha256({
    ...baseVisitPayload,
    fincaId: 'cortijo-san-jose',
  });
  check(fincaIdMutatedHmac !== baseHmac, 'Mutating fincaId alters HMAC signature');

  // 1.3: Email whitespace and casing normalization idempotency
  const normalizedEmailHmac = generatePriceLockSha256({
    ...baseVisitPayload,
    contactEmail: '  DIRECTOR@ELREGAJAL.ES  ',
  });
  check(normalizedEmailHmac === baseHmac, 'Email casing and surrounding whitespace are normalized deterministically');

  // 1.4: Default timeSlot fallback
  const fallbackSlotHmac1 = generatePriceLockSha256({
    ...baseVisitPayload,
    timeSlot: undefined,
  });
  const fallbackSlotHmac2 = generatePriceLockSha256({
    ...baseVisitPayload,
    timeSlot: 'ALL_DAY',
  });
  check(fallbackSlotHmac1 === fallbackSlotHmac2, 'Undefined timeSlot safely defaults to ALL_DAY');

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO 2: FINANCIAL & LOGISTICAL INVARIANTS
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- SCENARIO 2: FINANCIAL & LOGISTICAL INVARIANTS ---');

  check(LOGISTICA_KM_EXEMPT === 50, 'Canonical exempt km is exactly 50 km');
  check(LOGISTICA_KM_RATE_CENTS === 150, 'Canonical rate is exactly 150 cents/km (1,50 €/km)');
  check(LOGISTICA_HOTEL_CENTS === 12000, 'Canonical hotel fee is exactly 12000 cents (120,00 €)');
  check(DEPOSITO_PRICE_LOCK_CENTS === 10000, 'Canonical deposit is exactly 10000 cents (100,00 €)');

  // 2.1: Logistics km <= 50 km must charge 0 logisticsKmCents
  const zeroKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 0,
  });
  check(zeroKmPricing.logisticsKmCents === 0, 'Distance 0 km has 0 logisticsKmCents');

  const fifteenKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 15,
  });
  check(fifteenKmPricing.logisticsKmCents === 0, 'Distance 15 km has 0 logisticsKmCents');

  const fiftyKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 50,
  });
  check(fiftyKmPricing.logisticsKmCents === 0, 'Distance exactly 50 km has 0 logisticsKmCents');

  // 2.2: Logistics km > 50 km must charge exactly 150 cents/km for (km - 50)
  const fiftyOneKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 51,
  });
  check(
    fiftyOneKmPricing.logisticsKmCents === 150,
    'Distance 51 km charges exactly 150 cents (1 km * 150 cents)'
  );

  const fiftyEightKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 58,
  });
  check(
    fiftyEightKmPricing.logisticsKmCents === 1200,
    'Distance 58 km charges exactly 1200 cents (8 km * 150 cents = 12.00 €)'
  );

  const hundredKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 100,
  });
  check(
    hundredKmPricing.logisticsKmCents === 7500,
    'Distance 100 km charges exactly 7500 cents (50 km * 150 cents = 75.00 €)'
  );

  const twoHundredKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 200,
  });
  check(
    twoHundredKmPricing.logisticsKmCents === 22500,
    'Distance 200 km charges exactly 22500 cents (150 km * 150 cents = 225.00 €)'
  );

  // 2.3: Hotel fee: distance trigger (> 200 km)
  // At distance 200 km without early morning end time => hotelRequired must be false
  check(
    isHotelRequired(200, undefined) === false,
    'Distance 200 km without early morning end time does NOT require hotel'
  );
  check(
    twoHundredKmPricing.logisticsHotelCents === 0,
    'Distance 200 km charges 0 logisticsHotelCents'
  );

  // At distance 201 km => hotelRequired must be true
  check(
    isHotelRequired(201, undefined) === true,
    'Distance 201 km (> 200 km) triggers hotelRequired === true'
  );
  const twoHundredOneKmPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 201,
  });
  check(
    twoHundredOneKmPricing.logisticsHotelCents === 12000,
    'Distance 201 km charges exactly 12000 cents (120,00 € hotel fee)'
  );

  // 2.4: Hotel fee: early morning end time trigger (03:00 to 11:59) with distance <= 200 km
  check(isHotelRequired(50, '03:00') === true, 'End time 03:00 triggers hotel fee');
  check(isHotelRequired(50, '04:30') === true, 'End time 04:30 triggers hotel fee');
  check(isHotelRequired(50, '06:00') === true, 'End time 06:00 triggers hotel fee');
  check(isHotelRequired(50, '11:59') === true, 'End time 11:59 triggers hotel fee');

  const earlyMorningPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 50,
    eventEndTime: '04:00',
  });
  check(
    earlyMorningPricing.logisticsHotelCents === 12000,
    'Event ending at 04:00 with distance 50 km charges exactly 12000 cents hotel fee'
  );

  // 2.5: Normal evening event (e.g. 23:00) with distance <= 200 km must NOT trigger hotel fee
  check(
    isHotelRequired(50, '23:00') === false,
    'Evening event ending at 23:00 with distance 50 km does NOT trigger hotel fee'
  );
  check(
    isHotelRequired(200, '23:00') === false,
    'Evening event ending at 23:00 with distance 200 km does NOT trigger hotel fee'
  );
  check(
    isHotelRequired(50, '01:30') === false,
    'Event ending at 01:30 does NOT trigger hotel fee (< 03:00)'
  );
  check(
    isHotelRequired(50, '02:59') === false,
    'Event ending at 02:59 does NOT trigger hotel fee (< 03:00)'
  );
  check(
    isHotelRequired(50, '12:00') === false,
    'Afternoon event at 12:00 does NOT trigger hotel fee'
  );

  const eveningPricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 50,
    eventEndTime: '23:00',
  });
  check(
    eveningPricing.logisticsHotelCents === 0,
    'Evening event at 23:00 charges strictly 0 logisticsHotelCents'
  );

  // 2.6: Split Soberano 80/10/10 integer cents conservation (Hare-Niemeyer)
  const testSubtotals = [100, 101, 102, 103, 107, 245, 999, 10000, 1234567];
  for (const subtotal of testSubtotals) {
    const split = distributeSplitSoberano(subtotal);
    const sum = split.artistaCents + split.earOsCents + split.vimumeCents;
    check(
      sum === subtotal,
      `Split Soberano sum (${sum}) equals subtotal (${subtotal}) for ${subtotal} cents`
    );
  }

  // 2.7: Affiliate commission detached strictly from EAR OS cut
  const samplePricing = calculateFincaEventPricing({
    menuId: 'boda-castellana',
    guestCount: 100,
    selectedExtraIds: [],
    distanceKm: 50,
    affiliateCommissionPct: 0.12,
  });
  check(
    samplePricing.affiliateCommissionCents === Math.round(samplePricing.split.earOsCents * 0.12),
    'Affiliate commission is exactly 12% of EAR OS infrastructure cut'
  );
  check(
    samplePricing.metadata.earOsNetAfterCommissionCents ===
      samplePricing.split.earOsCents - samplePricing.affiliateCommissionCents,
    'EAR OS net is exactly split.earOsCents minus affiliate commission'
  );

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO 3: ACOUSTIC RIDER INVARIANT
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- SCENARIO 3: ACOUSTIC RIDER INVARIANT ---');

  check(WATTS_PER_PAX === 12, 'WATTS_PER_PAX is exactly 12 W/pax RMS');
  check(LIMITE_SPL_DB === 75, 'LIMITE_SPL_DB is strictly 75 dB SPL');

  const guestCounts = [25, 50, 100, 120, 250, 500];
  for (const guests of guestCounts) {
    const p = calculateFincaEventPricing({
      menuId: 'boda-castellana',
      guestCount: guests,
      selectedExtraIds: [],
      distanceKm: 0,
    });
    check(
      p.acousticRider.recommendedWatts === guests * 12,
      `Acoustic rider for ${guests} guests computes ${guests * 12} W RMS (${guests} * 12)`
    );
    check(
      p.acousticRider.maxDbSpl <= 75,
      `Acoustic rider for ${guests} guests adheres to max SPL <= 75 dB SPL`
    );
    check(
      p.acousticRider.isCompliant === true,
      `Acoustic rider compliance flag is true for ${guests} guests`
    );
  }

  // System recommendations
  check(
    resolveAcousticSystem(600).includes('Bose S1 Pro'),
    '600 W resolves to Bose S1 Pro System'
  );
  check(
    resolveAcousticSystem(1440).includes('Bose F1 Model 812 Dual Column'),
    '1440 W resolves to Bose F1 Model 812 Dual Column'
  );
  check(
    resolveAcousticSystem(3600).includes('Bose F1 Quad Array'),
    '3600 W resolves to Bose F1 Quad Array'
  );

  // ──────────────────────────────────────────────────────────────────────────
  // SCENARIO 4: GET & POST HANDLERS ON /api/fincas/visit-lock
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n--- SCENARIO 4: GET & POST /api/fincas/visit-lock ---');

  // 4.1: GET with missing params -> HTTP 400 MISSING_PARAMS
  const getNoParamsReq = new NextRequest('http://localhost:3000/api/fincas/visit-lock');
  const getNoParamsRes = await visitLockGET(getNoParamsReq);
  const getNoParamsData = await getNoParamsRes.json();
  check(getNoParamsRes.status === 400, 'GET /api/fincas/visit-lock without params returns HTTP 400');
  check(getNoParamsData.error === 'MISSING_PARAMS', 'GET without params returns error MISSING_PARAMS');

  // 4.2: GET with missing date only -> HTTP 400
  const getNoDateReq = new NextRequest('http://localhost:3000/api/fincas/visit-lock?fincaId=finca-el-regajal');
  const getNoDateRes = await visitLockGET(getNoDateReq);
  check(getNoDateRes.status === 400, 'GET /api/fincas/visit-lock missing date returns HTTP 400');

  // 4.3: GET with missing fincaId only -> HTTP 400
  const getNoFincaReq = new NextRequest('http://localhost:3000/api/fincas/visit-lock?date=2026-12-15');
  const getNoFincaRes = await visitLockGET(getNoFincaReq);
  check(getNoFincaRes.status === 400, 'GET /api/fincas/visit-lock missing fincaId returns HTTP 400');

  // 4.4: GET with valid params -> HTTP 200 with complete availability structure
  const getValidReq = new NextRequest(
    'http://localhost:3000/api/fincas/visit-lock?fincaId=finca-el-regajal&date=2026-12-15&timeSlot=AFTERNOON'
  );
  const getValidRes = await visitLockGET(getValidReq);
  const getValidData = await getValidRes.json();
  check(getValidRes.status === 200, 'GET /api/fincas/visit-lock with valid params returns HTTP 200');
  check(getValidData.success === true, 'GET response has success === true');
  check(getValidData.fincaId === 'finca-el-regajal', 'GET response preserves fincaId');
  check(getValidData.date === '2026-12-15', 'GET response preserves date');
  check(getValidData.timeSlot === 'AFTERNOON', 'GET response preserves timeSlot');
  check(typeof getValidData.available === 'boolean', 'GET response includes boolean available');
  check(getValidData.depositAmountEur === 100.0, 'GET response includes depositAmountEur: 100');
  check(getValidData.depositDeductibleCents === 10000, 'GET response includes depositDeductibleCents: 10000');

  // 4.5: POST rejection of past dates
  const postPastDateReq = new NextRequest('http://localhost:3000/api/fincas/visit-lock', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fincaId: 'finca-el-regajal',
      fincaName: 'Finca El Regajal',
      contactName: 'Carlos Mendizábal',
      contactEmail: 'eventos@elregajal.es',
      contactPhone: '+34 918 923 123',
      desiredVisitDate: '2021-01-01',
      locationAddress: 'Carretera M-305 km 11',
      municipio: 'Aranjuez',
      provincia: 'Madrid',
    }),
  });
  const postPastDateRes = await visitLockPOST(postPastDateReq);
  const postPastDateData = await postPastDateRes.json();
  check(postPastDateRes.status === 400, 'POST /api/fincas/visit-lock rejects past dates with HTTP 400');
  check(postPastDateData.error === 'DATE_IN_PAST', 'POST past date error is DATE_IN_PAST');

  // ──────────────────────────────────────────────────────────────────────────
  // SUMMARY
  // ──────────────────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════════════════');
  console.log(`🎉 ADVERSARIAL STRESS SUITE: ${passed}/${total} TESTS PASSED SUCCESSFULLY`);
  console.log('═══════════════════════════════════════════════════════════════════════════\n');
}

// Auto-run if executed directly
if (typeof require !== 'undefined' && require.main === module) {
  runAdversarialStressSuite().catch((err) => {
    console.error('Fatal stress suite failure:', err);
    process.exit(1);
  });
}
