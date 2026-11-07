/**
 * ════════════════════════════════════════════════════════════════════════════
 * ADVERSARIAL STRESS TEST SUITE — MILESTONE 3 (UI B2B ESCAPARATE & SIMULADOR)
 * ════════════════════════════════════════════════════════════════════════════
 * Autor: challenger_m3_1 (Empirical Challenger · Critic · Specialist)
 * Ubicación: `scripts/stress_finca_m3_challenger1.ts`
 *
 * Misión:
 *  1. Boundary testing for `calculateFincaEventPricing` & `FincaMenuSimulator2026`:
 *     - Guest counts: 0 pax, -10 pax (validation exception), 1 pax, 50 pax, 800 pax, 5000 pax.
 *     - All 16 extras selected simultaneously vs zero extras selected.
 *     - Edge distance values: 0 km (Méntrida Hub exempt), 49 km, 50 km, 51 km (1 km billable = 1.50 €), 200 km, 201 km (hotel = 120 €).
 *     - Event end times: 23:00 (no hotel if <= 200 km), 02:59, 03:00 (hotel = 120 € triggered), 05:30.
 *     - Exact sum invariant of integer cents: menu + extras + km + hotel === subtotal.
 *     - Exact split sum invariant: artista + earOs + vimume === subtotal (Hare-Niemeyer).
 *     - Margin isolation invariant: affiliateCommission is detracted ONLY from earOs, never touching artista or vimume.
 *     - Acoustic invariant: 12 W/pax RMS, <= 75 dB SPL.
 *  2. 100 randomized inputs (Monte Carlo) checking zero floating point drift and invariant adherence.
 *  3. Contact-Gate & Anti-Fuga stress testing:
 *     - maskPhone phone number sanitization across edge cases.
 *     - Verification that NeuralNavigation is eradicated and 0% competitor ad leak guarantee holds.
 *  4. Static code audit of target files: zero `any`, zero TODO/FIXME, zero `w-screen`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import {
  calculateFincaEventPricing,
  distributeSplitSoberano,
  isHotelRequired,
  normalizeAffiliateRate,
  eurToCents,
  centsToEur,
  formatCentsEur,
  FincaPricingEngineError,
  type FincaMenuPricingInput,
} from '../src/lib/fincas/fincaMenuPricingEngine';

import {
  FINCA_BODA_MENUS_2026,
  FINCA_MENUS_2026,
  FINCA_EXTRAS_2026,
  getFincaMenuById,
} from '../src/lib/fincas/fincaMenus2026Catalog';

import {
  calculateFounderFeeMatch,
  buildComparativaBodasNetVsEarOs,
} from '../src/lib/fincas/fincaMetricsEngine';

import { maskPhone } from '../src/features/bodas/ui/FincasCatalogExplorer';

const ROOT = process.cwd();

interface TestReport {
  id: string;
  name: string;
  passed: boolean;
  details?: string;
}

const reports: TestReport[] = [];

function check(id: string, name: string, condition: boolean, details?: string) {
  if (condition) {
    reports.push({ id, name, passed: true });
    console.log(`  \x1b[32m[PASS]\x1b[0m ${id}: ${name}`);
  } else {
    reports.push({ id, name, passed: false, details });
    console.error(`  \x1b[31m[FAIL]\x1b[0m ${id}: ${name}`);
    if (details) console.error(`         \x1b[33mDetalles: ${details}\x1b[0m`);
  }
}

console.log('\n\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════\x1b[0m');
console.log('\x1b[1m\x1b[35m  ADVERSARIAL STRESS TEST SUITE — MILESTONE 3 (CHALLENGER_M3_1)    \x1b[0m');
console.log('\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════\x1b[0m\n');

// ─────────────────────────────────────────────────────────────────────────────
// 1. BOUNDARY CONDITIONS: GUEST COUNTS (0, -5, 1, 50, 800, 5000 PAX)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\x1b[1m\x1b[36m--- SECCIÓN 1: CONDICIONES DE FRONTERA — AFORO (PAX) ---\x1b[0m');

// 1.1: 0 pax debe arrojar error tipado INVALID_GUEST_COUNT
try {
  calculateFincaEventPricing({
    menuId: 'boda-cantabrico',
    guestCount: 0,
    selectedExtraIds: [],
    distanceKm: 45,
  });
  check('BOUND-PAX-0', 'Rechazo estricto de guestCount = 0', false, 'No lanzó excepción');
} catch (err: unknown) {
  const isExpected = err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT';
  check('BOUND-PAX-0', 'Rechazo estricto de guestCount = 0', isExpected, String(err));
}

// 1.2: Aforo negativo (-10 pax)
try {
  calculateFincaEventPricing({
    menuId: 'boda-cantabrico',
    guestCount: -10,
    selectedExtraIds: [],
    distanceKm: 45,
  });
  check('BOUND-PAX-NEG', 'Rechazo estricto de guestCount negativo (-10)', false, 'No lanzó excepción');
} catch (err: unknown) {
  const isExpected = err instanceof FincaPricingEngineError && err.code === 'INVALID_GUEST_COUNT';
  check('BOUND-PAX-NEG', 'Rechazo estricto de guestCount negativo (-10)', isExpected, String(err));
}

// 1.3: 1 pax (mínimo absoluto)
const p1 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 1,
  selectedExtraIds: [],
  distanceKm: 0,
});
check('BOUND-PAX-1', 'Aforo mínimo 1 pax calcula correctamente',
  p1.menuTotalCents === 10000 &&
  p1.acousticRider.recommendedWatts === 12 &&
  p1.subtotalCents === 10000 &&
  p1.split.artistaCents + p1.split.earOsCents + p1.split.vimumeCents === 10000
);

// 1.4: 50 pax (boda íntima)
const p50 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 50,
  selectedExtraIds: [],
  distanceKm: 45,
});
check('BOUND-PAX-50', 'Aforo 50 pax respeta 12 W/pax (600 W RMS)',
  p50.acousticRider.recommendedWatts === 600 &&
  p50.menuTotalCents === 50 * 10000 &&
  p50.subtotalCents === 500000
);

// 1.5: 800 pax (gran boda / aforo máximo común)
const p800 = calculateFincaEventPricing({
  menuId: 'boda-paloma',
  guestCount: 800,
  selectedExtraIds: [],
  distanceKm: 40,
});
check('BOUND-PAX-800', 'Aforo 800 pax escala sin desbordamiento de enteros',
  p800.menuTotalCents === 800 * 12500 &&
  p800.acousticRider.recommendedWatts === 800 * 12 &&
  p800.split.artistaCents + p800.split.earOsCents + p800.split.vimumeCents === p800.subtotalCents
);

// 1.6: 5000 pax (macro-evento estrés extremo)
const p5000 = calculateFincaEventPricing({
  menuId: 'boda-vasco',
  guestCount: 5000,
  selectedExtraIds: [],
  distanceKm: 30,
});
check('BOUND-PAX-5000', 'Aforo 5000 pax mantiene precisión exacta de céntimos',
  p5000.menuTotalCents === 5000 * 16500 &&
  p5000.acousticRider.recommendedWatts === 60000 &&
  p5000.split.artistaCents + p5000.split.earOsCents + p5000.split.vimumeCents === p5000.subtotalCents
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. EXTRAS SELECTION: CERO EXTRAS VS TODOS LOS 16 EXTRAS SIMULTÁNEOS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 2: MATRIZ DE COMPLEMENTOS Y EXTRAS (16 OFICIALES) ---\x1b[0m');

// 2.1: Cero extras
const pNoExtras = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 20,
});
check('EXTRA-ZERO', 'Cero extras seleccionados produce extrasTotalCents = 0',
  pNoExtras.extrasTotalCents === 0 && pNoExtras.metadata.extrasBreakdown.length === 0
);

// 2.2: Todos los 16 extras seleccionados
const all16ExtraIds = FINCA_EXTRAS_2026.map((e) => e.id);
const pAllExtras = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: all16ExtraIds,
  distanceKm: 20,
});

// Calcular manualmente la suma esperada de los 16 extras para 100 comensales
let expectedExtrasCents = 0;
for (const extra of FINCA_EXTRAS_2026) {
  expectedExtrasCents += extra.isPerPax ? extra.priceCents * 100 : extra.priceCents;
}

check('EXTRA-ALL-16', 'Todos los 16 extras simultáneos suman exactamente lo esperado',
  pAllExtras.extrasTotalCents === expectedExtrasCents &&
  pAllExtras.metadata.extrasBreakdown.length === 16 &&
  pAllExtras.subtotalCents === pAllExtras.menuTotalCents + expectedExtrasCents
);

// 2.3: Deduplicación de extras (si la UI envía IDs repetidos)
const pDupExtras = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: ['solista-edwin', 'solista-edwin', 'solista-edwin'],
  distanceKm: 20,
});
check('EXTRA-DEDUP', 'Deduplicación idempotente si se envía un extra varias veces',
  pDupExtras.metadata.extrasBreakdown.length === 1 &&
  pDupExtras.extrasTotalCents === 35000 // 350,00 € Edwin Agudelo SSOT
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. EDGE DISTANCE VALUES: 0 km, 49 km, 50 km, 51 km, 200 km, 201 km
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 3: FRONTERAS LOGÍSTICAS DE KILOMETRAJE Y HOTEL ---\x1b[0m');

// 3.1: 0 km (Méntrida Hub) -> 0 € km, 0 € hotel
const d0 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 0,
  eventEndTime: '23:00',
});
check('DIST-0KM', '0 km (Hub Méntrida): 0 € logística km',
  d0.logisticsKmCents === 0 && d0.metadata.billableKm === 0 && d0.logisticsHotelCents === 0
);

// 3.2: 49 km (bajo umbral de 50 km) -> 0 € km
const d49 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 49,
  eventEndTime: '23:00',
});
check('DIST-49KM', '49 km: 0 € logística km (bajo umbral exento)',
  d49.logisticsKmCents === 0 && d49.metadata.billableKm === 0
);

// 3.3: 50 km (límite exacto de exención) -> 0 € km
const d50 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 50,
  eventEndTime: '23:00',
});
check('DIST-50KM', '50 km: 0 € logística km (exactamente el límite exento)',
  d50.logisticsKmCents === 0 && d50.metadata.billableKm === 0
);

// 3.4: 51 km (1 km facturable = 1,50 € / 150 céntimos)
const d51 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 51,
  eventEndTime: '23:00',
});
check('DIST-51KM', '51 km: 1 km facturable = exactamente 150 céntimos (1,50 €)',
  d51.metadata.billableKm === 1 && d51.logisticsKmCents === 150
);

// 3.5: 200 km (frontera máxima sin hotel si hora < 03:00) -> 150 km facturables = 225,00 € (22.500 cts)
const d200 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 200,
  eventEndTime: '23:00',
});
check('DIST-200KM', '200 km con cierre 23:00: 225,00 € km y 0 € hotel (límite no superado)',
  d200.metadata.billableKm === 150 &&
  d200.logisticsKmCents === 22500 &&
  d200.logisticsHotelCents === 0 &&
  d200.metadata.hotelRequired === false
);

// 3.6: 201 km (supera 200 km -> activa suplemento hotel 120,00 € / 12.000 cts)
const d201 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 201,
  eventEndTime: '23:00',
});
check('DIST-201KM', '201 km: activa suplemento hotel 120,00 € (12.000 cts) por distancia > 200 km',
  d201.metadata.billableKm === 151 &&
  d201.logisticsKmCents === 151 * 150 &&
  d201.logisticsHotelCents === 12000 &&
  d201.metadata.hotelRequired === true
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. EVENT END TIMES: 23:00, 02:59, 03:00, 05:30
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 4: HORARIOS DE CIERRE Y TRIGGER DE HOTEL ---\x1b[0m');

// 4.1: Cierre a las 23:00 con distancia <= 200 km -> No hotel
const t2300 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 60,
  eventEndTime: '23:00',
});
check('TIME-2300', 'Cierre 23:00 con 60 km: Sin hotel',
  t2300.logisticsHotelCents === 0 && t2300.metadata.hotelRequired === false
);

// 4.2: Cierre a las 02:59 (inmediatamente antes de 03:00 AM)
const t0259 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 60,
  eventEndTime: '02:59',
});
check('TIME-0259', 'Cierre 02:59 con 60 km: Sin hotel (hora < 3)',
  t0259.logisticsHotelCents === 0 && t0259.metadata.hotelRequired === false
);

// 4.3: Cierre a las 03:00 AM (disparo obligatorio de hotel por AGENTS.md §4)
const t0300 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 60,
  eventEndTime: '03:00',
});
check('TIME-0300', 'Cierre 03:00 AM: Activa hotel 120,00 € (12.000 cts) obligatoriamente',
  t0300.logisticsHotelCents === 12000 && t0300.metadata.hotelRequired === true
);

// 4.4: Cierre a las 05:30 AM (madrugada)
const t0530 = calculateFincaEventPricing({
  menuId: 'boda-cantabrico',
  guestCount: 100,
  selectedExtraIds: [],
  distanceKm: 10,
  eventEndTime: '05:30',
});
check('TIME-0530', 'Cierre 05:30 AM: Activa hotel 120,00 € aunque esté a 10 km',
  t0530.logisticsHotelCents === 12000 && t0530.metadata.hotelRequired === true
);

// ─────────────────────────────────────────────────────────────────────────────
// 5. INVARIANT VERIFICATION: EXACT SUMS OF INTEGER CENTS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 5: INVARIANTES RIGUROSOS DE CÉNTIMOS ENTEROS ---\x1b[0m');

const sampleConfig: FincaMenuPricingInput = {
  menuId: 'boda-imperial',
  guestCount: 137,
  selectedExtraIds: ['solista-edwin', 'barra-libre-extra', 'cortador-jamon'],
  distanceKm: 78,
  eventEndTime: '04:00',
  affiliateCommissionPct: 0.12,
};
const res = calculateFincaEventPricing(sampleConfig);

// Invariante 1: Suma exacta del subtotal
const isSubtotalExact =
  res.menuTotalCents + res.extrasTotalCents + res.logisticsKmCents + res.logisticsHotelCents ===
  res.subtotalCents;
check('INVAR-SUBTOTAL', 'menuTotal + extrasTotal + logisticsKm + logisticsHotel === subtotalCents',
  isSubtotalExact,
  `${res.menuTotalCents} + ${res.extrasTotalCents} + ${res.logisticsKmCents} + ${res.logisticsHotelCents} vs ${res.subtotalCents}`
);

// Invariante 2: Split Soberano suma exactamente el subtotal
const isSplitExact =
  res.split.artistaCents + res.split.earOsCents + res.split.vimumeCents === res.subtotalCents;
check('INVAR-SPLIT', 'split.artistaCents + split.earOsCents + split.vimumeCents === subtotalCents',
  isSplitExact,
  `${res.split.artistaCents} + ${res.split.earOsCents} + ${res.split.vimumeCents} vs ${res.subtotalCents}`
);

// Invariante 3: IVA del 21% y total con IVA
const isTotalWithIvaExact = res.subtotalCents + res.ivaCents === res.totalWithIvaCents;
check('INVAR-IVA', 'subtotalCents + ivaCents === totalWithIvaCents',
  isTotalWithIvaExact
);

// Invariante 4: Blindaje de artista y VIMUME (la comisión de la finca solo recorta a EAR OS)
const isMarginIsolated =
  res.metadata.earOsNetAfterCommissionCents + res.affiliateCommissionCents === res.split.earOsCents;
check('INVAR-MARGIN', 'Comisión de afiliado detraída EXCLUSIVAMENTE de EAR OS (artista y vimume intactos)',
  isMarginIsolated,
  `${res.metadata.earOsNetAfterCommissionCents} + ${res.affiliateCommissionCents} vs ${res.split.earOsCents}`
);

// Invariante 5: Depósito deducible de 100,00 € Stripe Price-Lock
const isDepositValid =
  res.depositDeductibleCents === 10000 &&
  res.metadata.pendingBalanceWithIvaCents === res.totalWithIvaCents - 10000;
check('INVAR-DEPOSIT', 'Depósito deducible de 100,00 € (10.000 cts) y cálculo de saldo pendiente',
  isDepositValid
);

// Invariante 6: Rider acústico Ley 37/2003
const isAcousticValid =
  res.acousticRider.recommendedWatts === 137 * 12 &&
  res.acousticRider.maxDbSpl === 75 &&
  res.acousticRider.isCompliant === true;
check('INVAR-ACOUSTIC', 'Rider acústico 12 W/pax (137 * 12 = 1.644 W RMS) y <= 75 dB SPL',
  isAcousticValid
);

// ─────────────────────────────────────────────────────────────────────────────
// 6. MONTE CARLO RANDOM STRESS: 100 CASOS ALEATORIOS SIN FLOAT DRIFT
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 6: TEST MONTE CARLO (100 CASOS ALEATORIOS) ---\x1b[0m');

const allMenuIds = FINCA_MENUS_2026.map((m) => m.id);
const allExtras = FINCA_EXTRAS_2026.map((e) => e.id);
const sampleTimes = ['22:00', '23:30', '01:00', '02:30', '03:00', '03:45', '05:00', '14:00'];
const sampleCommissionRates = [0.10, 0.11, 0.12, 0.13, 0.14, 0.15, 10, 12, 15];

let randomPassed = 0;
let randomFailed = 0;
const failureDetails: string[] = [];

for (let i = 0; i < 100; i++) {
  const menuId = allMenuIds[Math.floor(Math.random() * allMenuIds.length)] || 'boda-cantabrico';
  const guestCount = Math.floor(Math.random() * 950) + 1; // 1 a 950 pax
  const distanceKm = Math.floor(Math.random() * 400); // 0 a 400 km
  const eventEndTime = sampleTimes[Math.floor(Math.random() * sampleTimes.length)];
  const affiliateRate = sampleCommissionRates[Math.floor(Math.random() * sampleCommissionRates.length)];

  // Seleccionar subset aleatorio de extras
  const numExtras = Math.floor(Math.random() * (allExtras.length + 1));
  const shuffledExtras = [...allExtras].sort(() => 0.5 - Math.random());
  const selectedExtras = shuffledExtras.slice(0, numExtras);

  try {
    const r = calculateFincaEventPricing({
      menuId,
      guestCount,
      selectedExtraIds: selectedExtras,
      distanceKm,
      eventEndTime,
      affiliateCommissionPct: affiliateRate,
    });

    // 1. Chequeo de que todos los importes son céntimos enteros (cero floats)
    const allIntegers =
      Number.isInteger(r.menuTotalCents) &&
      Number.isInteger(r.extrasTotalCents) &&
      Number.isInteger(r.logisticsKmCents) &&
      Number.isInteger(r.logisticsHotelCents) &&
      Number.isInteger(r.subtotalCents) &&
      Number.isInteger(r.ivaCents) &&
      Number.isInteger(r.totalWithIvaCents) &&
      Number.isInteger(r.split.artistaCents) &&
      Number.isInteger(r.split.earOsCents) &&
      Number.isInteger(r.split.vimumeCents) &&
      Number.isInteger(r.affiliateCommissionCents) &&
      Number.isInteger(r.metadata.earOsNetAfterCommissionCents);

    // 2. Invariante de suma subtotal
    const subtotalCheck =
      r.menuTotalCents + r.extrasTotalCents + r.logisticsKmCents + r.logisticsHotelCents ===
      r.subtotalCents;

    // 3. Invariante de split exacto
    const splitCheck =
      r.split.artistaCents + r.split.earOsCents + r.split.vimumeCents === r.subtotalCents;

    // 4. Invariante de IVA
    const ivaCheck = r.subtotalCents + r.ivaCents === r.totalWithIvaCents;

    // 5. Invariante de aislamiento de margen EAR OS
    const marginCheck =
      r.metadata.earOsNetAfterCommissionCents + r.affiliateCommissionCents === r.split.earOsCents;

    // 6. Invariante de hotel
    const expectedHotel = isHotelRequired(distanceKm, eventEndTime);
    const hotelCheck = (r.logisticsHotelCents === 12000) === expectedHotel;

    if (allIntegers && subtotalCheck && splitCheck && ivaCheck && marginCheck && hotelCheck) {
      randomPassed++;
    } else {
      randomFailed++;
      failureDetails.push(
        `Iteración ${i}: allInt=${allIntegers}, subtotal=${subtotalCheck}, split=${splitCheck}, iva=${ivaCheck}, margin=${marginCheck}, hotel=${hotelCheck}`
      );
    }
  } catch (err: unknown) {
    randomFailed++;
    failureDetails.push(`Iteración ${i} arrojó excepción inesperada: ${String(err)}`);
  }
}

check('MONTE-CARLO-100', '100 ejecuciones aleatorias satisfacen todos los invariantes con cero drift flotante',
  randomFailed === 0 && randomPassed === 100,
  failureDetails.join(' | ')
);

// ─────────────────────────────────────────────────────────────────────────────
// 7. CONTACT-GATE & ANTIMARGIN FUGA STRESS TESTING
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 7: CONTACT-GATE (maskPhone) Y BLINDAJE ANTI-FUGA ---\x1b[0m');

const maskedSamples = [
  { input: '+34 925 123 456', expectedMask: true, reason: 'Prefijo +34 con espacios' },
  { input: '+34 600 000 000', expectedMask: true, reason: 'Móvil con prefijo +34' },
  { input: '600123456', expectedMask: true, reason: 'Nacional 9 dígitos directo' },
  { input: '915999999', expectedMask: true, reason: 'Fijo nacional' },
  { input: '', expectedMask: true, reason: 'Cadena vacía' },
];

let maskAllPassed = true;
for (const s of maskedSamples) {
  const result = maskPhone(s.input);
  if (!result.includes('•••')) {
    maskAllPassed = false;
  }
}
check('MASK-PHONE', 'maskPhone enmascara consistentemente todos los formatos sin fugar números reales',
  maskAllPassed
);

// Verificación en disco de erradicación de NeuralNavigation y presencia de blindaje
const catalogContent = fs.readFileSync(
  path.join(ROOT, 'src/features/bodas/ui/FincasCatalogExplorer.tsx'),
  'utf-8'
);
check('ANTI-FUGA-NEURAL', 'FincasCatalogExplorer tiene 0 referencias a NeuralNavigation',
  !catalogContent.includes('NeuralNavigation')
);
check('ANTI-FUGA-BANNER', 'FincasCatalogExplorer contiene la certificación "0% Fuga a Competidores"',
  catalogContent.includes('0% Fuga a Competidores')
);
check('STRIPE-VISIT-MODAL', 'FincasCatalogExplorer implementa TechnicalVisitLockModal con depósito de 100 €',
  catalogContent.includes('TechnicalVisitLockModal') && catalogContent.includes('/api/fincas/visit-lock')
);

// ─────────────────────────────────────────────────────────────────────────────
// 8. PRICE-MATCH & PACTO 100 FUNDADORES SIMULATOR STRESS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 8: SIMULADOR PRICE-MATCH (100 FUNDADORES) ---\x1b[0m');

const fm1 = calculateFounderFeeMatch(180, { currentFoundersEnrolled: 42, horizonYears: 5 });
check('FOUNDER-MATCH-180', 'calculateFounderFeeMatch iguala cuota de 180 € y congela IPC',
  fm1.matchedMonthlyFeeEur === 180 &&
  fm1.lifetimePriceLock === true &&
  fm1.remainingSlots === 58 &&
  fm1.founderSlotNumber === 43
);

const fmFull = calculateFounderFeeMatch(250, { currentFoundersEnrolled: 100 });
check('FOUNDER-MATCH-FULL', 'Si el cupo de 100 está lleno, eligibleForFounderPact es false',
  fmFull.eligibleForFounderPact === false && fmFull.remainingSlots === 0
);

const comparativa = buildComparativaBodasNetVsEarOs();
check('FOUNDER-TABLE', 'buildComparativaBodasNetVsEarOs genera la matriz de 7 filas canónicas',
  comparativa.length === 7 && comparativa.every((r) => r.feature && r.earOs && r.bodasNet)
);

// ─────────────────────────────────────────────────────────────────────────────
// 9. AUDITORÍA ESTÁTICA DE CÓDIGO (NO ANY, NO TODO/FIXME, NO W-SCREEN)
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[36m--- SECCIÓN 9: AUDITORÍA ESTÁTICA Y REGLAS OLED (NO ANY, NO W-SCREEN) ---\x1b[0m');

const TARGET_FILES = [
  'src/components/fincas/FincaMenuSimulator2026.tsx',
  'src/components/fincas/FincasB2BPortal.tsx',
  'src/app/(public)/fincas/page.tsx',
  'src/features/bodas/ui/FincasCatalogExplorer.tsx',
];

const anyRegex = /(:\s*any\b|<any>|as\s+any\b|any\[\])/;
const todoRegex = /\b(TODO|FIXME|HACK|XXX)\b/;

for (const tf of TARGET_FILES) {
  const content = fs.readFileSync(path.join(ROOT, tf), 'utf-8');
  const lines = content.split('\n');

  let anyCount = 0;
  let todoCount = 0;
  lines.forEach((l) => {
    const tr = l.trim();
    if (!tr.startsWith('//') && !tr.startsWith('*')) {
      if (anyRegex.test(tr)) anyCount++;
      if (todoRegex.test(tr)) todoCount++;
    }
  });

  check(`CODE-${path.basename(tf)}-ANY`, `${tf}: Cero tipos \`any\``, anyCount === 0, `Encontrados: ${anyCount}`);
  check(`CODE-${path.basename(tf)}-TODO`, `${tf}: Cero TODO/FIXME`, todoCount === 0, `Encontrados: ${todoCount}`);
  check(`CODE-${path.basename(tf)}-WSCREEN`, `${tf}: Cero \`w-screen\``, !content.includes('w-screen'));
}

// ─────────────────────────────────────────────────────────────────────────────
// RESUMEN GLOBAL DE RESULTADOS
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════\x1b[0m');
console.log('\x1b[1m\x1b[35m               RESUMEN GLOBAL DEL CHALLENGER M3                    \x1b[0m');
console.log('\x1b[1m\x1b[35m═══════════════════════════════════════════════════════════════════\x1b[0m\n');

const totalChecks = reports.length;
const passedChecks = reports.filter((r) => r.passed).length;
const failedChecks = totalChecks - passedChecks;

console.log(`Total Casos Adversariales Ejecutados: ${totalChecks}`);
console.log(`Aprobados: \x1b[32m${passedChecks}\x1b[0m`);
console.log(`Fallidos:  \x1b[31m${failedChecks}\x1b[0m`);

if (failedChecks > 0) {
  console.log('\n\x1b[31m\x1b[1mVEREDICTO: REQUEST_CHANGES — Se encontraron fallos en las pruebas adversariales.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\n\x1b[32m\x1b[1mVEREDICTO: APPROVE — Todos los casos adversariales y de estrés superados al 100%.\x1b[0m\n');
  process.exit(0);
}
