/**
 * 🧪 VERIFICACIÓN FORENSE — PARIDAD DEL MOTOR DE PRECIOS CON EL SSOT
 * ---------------------------------------------------------------------------
 * Objetivo: demostrar que NO existe un segundo motor de dinero.
 *   1. Invariantes SSOT (base 350 €, depósito 100 €, franquicia 50 km).
 *   2. Franquicia y hotel canónicos (0/50/200/201 km, 03:00 AM).
 *   3. Paridad exacta entre terminal de pricing, Astra, Deal-Closer,
 *      centralita mariachi, radar geo-acústico y Price-Lock.
 *   4. Bloqueo estático de matemáticas paralelas en la ruta de venta.
 *
 * Uso:  npx --no-install tsx scripts/verify_pricing_ssot_unification.ts
 * Coste de red: $0,00 (todo determinístico, sin llamadas externas).
 * ---------------------------------------------------------------------------
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BASE_SOLISTA,
  DEPOSITO_STRIPE,
  KM_EXENTOS,
  COSTE_KM,
  SUPLEMENTO_HOTEL,
  SUPLEMENTO_QUINTETO,
  calculateSovereignQuote,
  computeSovereignLogistics,
  parseEndHour,
} from '../src/lib/pricing/sovereign-pricing';
import {
  calculateEdwinAgudeloFormatPricing,
  calculateGeoPricing,
} from '../src/lib/services/pricing/geo-pricer';
import { runSelfDiagnostics } from '../src/lib/pricing/price-lock-verifier';
import { runAstraDiagnostics } from '../src/lib/astra/astra-conversation-engine';
import { processLeadToCheckout } from '../src/lib/orchestrators/deal-closer';
import { calculateMariachiDispatch } from '../src/lib/mariachi/mariachi-dispatch-engine';
import { calculateGeoAcousticRadar } from '../src/lib/geo/geo-acoustic-radar';

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

/* ── 1. Invariantes SSOT ─────────────────────────────────────────────────── */
check('SSOT: tarifa base solista 350,00 €', BASE_SOLISTA === 350, `BASE_SOLISTA=${BASE_SOLISTA}`);
check('SSOT: depósito Stripe 100,00 €', DEPOSITO_STRIPE === 100, `DEPOSITO_STRIPE=${DEPOSITO_STRIPE}`);
check('SSOT: franquicia de 50 km', KM_EXENTOS === 50, `KM_EXENTOS=${KM_EXENTOS}`);
check('SSOT: tarifa logística 1,50 €/km (doctrina CEO)', COSTE_KM === 1.5, `COSTE_KM=${COSTE_KM}`);

/* ── 2. Franquicia y hotel canónicos ─────────────────────────────────────── */
const zeroKm = computeSovereignLogistics(0);
const fortyKm = computeSovereignLogistics(40);
const fiftyKm = computeSovereignLogistics(50);
const hundredKm = computeSovereignLogistics(100);
const twoHundredKm = computeSovereignLogistics(200);
const twoOhOneKm = computeSovereignLogistics(201);
const earlyEnd = computeSovereignLogistics(10, '03:00');
const beforeHotelHour = computeSovereignLogistics(10, '02:59');

check('Franquicia: 40 km => desplazamiento 0 €', fortyKm.travelCost === 0, `travelCost=${fortyKm.travelCost}`);
check('Franquicia: 50 km => desplazamiento 0 €', fiftyKm.travelCost === 0, `travelCost=${fiftyKm.travelCost}`);
check(
  'Tramo facturable: 100 km => 50 km × 1,50 € = 75 €',
  hundredKm.billableKm === 50 && hundredKm.travelCost === 75,
  `billableKm=${hundredKm.billableKm} · travelCost=${hundredKm.travelCost}`,
);
check(
  'Hotel: 200 km NO pernocta',
  twoHundredKm.requiresHotel === false && twoHundredKm.hotelSupplement === 0,
  `requiresHotel=${twoHundredKm.requiresHotel}`,
);
check(
  'Hotel: 201 km SÍ pernocta (+120 €)',
  twoOhOneKm.requiresHotel === true && twoOhOneKm.hotelSupplement === SUPLEMENTO_HOTEL,
  `hotelSupplement=${twoOhOneKm.hotelSupplement}`,
);
check(
  'Hotel: fin a las 03:00 AM activa pernocta aunque sean 10 km',
  earlyEnd.requiresHotel === true && earlyEnd.travelCost === 0,
  `endHour=${String(parseEndHour('03:00'))} · hotel=${earlyEnd.hotelSupplement}`,
);
check(
  'Hotel: fin a las 02:59 AM NO activa pernocta',
  beforeHotelHour.requiresHotel === false,
  `hotel=${beforeHotelHour.hotelSupplement}`,
);
check('Orden: 0 km sin pernocta', zeroKm.totalLogistics === 0, `total=${zeroKm.totalLogistics}`);

/* ── 3. Presupuesto soberano + split ─────────────────────────────────────── */
const quote100 = calculateSovereignQuote({ format: 'solista', distanceKm: 100, soundRider: 'standard' });
const quote100Again = calculateSovereignQuote({ format: 'solista', distanceKm: 100, soundRider: 'standard' });
const splitSum = quote100.split.artist80 + quote100.split.earOs10 + quote100.split.vimume10;

check('Presupuesto: 350 € + 75 € logística = 425 €', quote100.totalBudget === 425, `totalBudget=${quote100.totalBudget}`);
check('Split 80/10/10 cierra al céntimo', splitSum === quote100.totalBudget, `suma=${splitSum}`);
check(
  'Price-Lock: hash SHA-256 determinista',
  quote100.priceLockHash === quote100Again.priceLockHash && /^[a-f0-9]{64}$/.test(quote100.priceLockHash),
  `hash=${quote100.priceLockHash.slice(0, 16)}…`,
);
const corrupted = calculateSovereignQuote({ format: 'solista', distanceKm: Number.NaN, soundRider: 'standard' });
check(
  'Blindaje NaN: distancia corrupta => 0 km (nunca NaN en Stripe)',
  Number.isFinite(corrupted.totalBudget) && corrupted.totalBudget === 350,
  `total=${corrupted.totalBudget}`,
);
check(
  'Rider Bose F1 Elite: +150 € sobre el total canónico',
  calculateSovereignQuote({ format: 'solista', distanceKm: 100, soundRider: 'bose_f1_elite' }).totalBudget === 575,
  `total=${calculateSovereignQuote({ format: 'solista', distanceKm: 100, soundRider: 'bose_f1_elite' }).totalBudget}`,
);

/* ── 4. Paridad entre motores ───────────────────────────────────────────── */
const mariachi100 = calculateMariachiDispatch({
  format: 'solista_edwin',
  serviceType: 'boda_nupcial',
  urgency: 'estandar',
  locationCity: 'Madrid',
  distanceKm: 100,
  clientPhone: '+34600000000',
});
check(
  'Paridad centralita mariachi: misma logística que el SSOT',
  mariachi100.totalPriceEur === BASE_SOLISTA + computeSovereignLogistics(100).totalLogistics,
  `total=${mariachi100.totalPriceEur} €`,
);

const geo100 = calculateGeoAcousticRadar({
  venueName: 'Finca Test SSOT',
  venueType: 'SALON_BODA',
  guestCount: 100,
  destinationProvince: 'Toledo',
  distanceKmFromMentrida: 100,
});
check(
  'Paridad radar geo-acústico: kmCost idéntico al SSOT',
  geo100.logisticsBreakdown.kmCost === computeSovereignLogistics(100).travelCost,
  `kmCost=${geo100.logisticsBreakdown.kmCost} €`,
);

const geoNight = calculateGeoAcousticRadar({
  venueName: 'Finca Test Madrugada',
  venueType: 'FINCA_EXTERIOR',
  guestCount: 100,
  destinationProvince: 'Toledo',
  distanceKmFromMentrida: 120,
  eventEndHour: '03:30',
});
check(
  'Paridad radar geo-acústico: pernocta por hora de fin',
  geoNight.logisticsBreakdown.hotelSurcharge === SUPLEMENTO_HOTEL,
  `hotel=${geoNight.logisticsBreakdown.hotelSurcharge} €`,
);

const deal = processLeadToCheckout(
  'Hola, quiero a Edwin en formato Trío para mi boda, estamos a 100 km.',
  100,
  'edwin-agudelo',
);
const expectedDeal = calculateSovereignQuote({ format: 'trio', distanceKm: 100, soundRider: 'standard' });
check(
  'Paridad Deal-Closer: total firmado = motor soberano',
  deal.success === true && deal.financials !== undefined && deal.financials.totalBudget === expectedDeal.totalBudget,
  deal.financials === undefined ? 'sin financials' : `total=${deal.financials.totalBudget} € (esperado ${expectedDeal.totalBudget} €)`,
);

/* ── 4 bis. Motor geo-pricer (ruta de dinero: cero tarifas duplicadas) ───── */
const HUB_COORDS = { lat: 40.416775, lng: -3.703790 };
const TOLEDO_COORDS = { lat: 39.862831, lng: -4.027324 };

const geoQuote = await calculateGeoPricing({
  artistId: 'edwin-agudelo',
  origin: HUB_COORDS,
  destination: TOLEDO_COORDS,
  baseFee: BASE_SOLISTA,
  costPerKm: COSTE_KM,
  franchiseKm: KM_EXENTOS,
  depositMode: 'fixed',
  depositValue: DEPOSITO_STRIPE,
});
const geoExpectedTravel: number = computeSovereignLogistics(geoQuote.distanceKm).travelCost;

check(
  'Geo-pricer: trayecto idéntico a la logística canónica',
  Math.abs(geoQuote.travelCost - geoExpectedTravel) <= 0.5,
  `distancia=${geoQuote.distanceKm} km · travelCost=${geoQuote.travelCost} € (canónico ${geoExpectedTravel} €)`,
);
check(
  'Geo-pricer: total = 350 € + logística del SSOT',
  Math.abs(geoQuote.totalAmount - (BASE_SOLISTA + geoExpectedTravel)) <= 0.5,
  `total=${geoQuote.totalAmount} € (esperado ${BASE_SOLISTA + geoExpectedTravel} €)`,
);
check(
  'Geo-pricer: depósito por defecto = Price-Lock inmutable de 100 €',
  geoQuote.depositAmount === DEPOSITO_STRIPE,
  `depositAmount=${geoQuote.depositAmount} €`,
);

const edwinSolista = await calculateEdwinAgudeloFormatPricing({
  origin: HUB_COORDS,
  destination: TOLEDO_COORDS,
});
check(
  'Motor Edwin: base 350 € del SSOT y tarifa 1,50 €/km (no 0,75)',
  edwinSolista.baseFee === BASE_SOLISTA && Math.abs(edwinSolista.travelCost - geoExpectedTravel) <= 0.5,
  `base=${edwinSolista.baseFee} € · travelCost=${edwinSolista.travelCost} € · km facturables=${Math.max(0, edwinSolista.distanceKm - KM_EXENTOS).toFixed(2)}`,
);
check(
  'Motor Edwin: depósito de 100 € (no 30% de reserva)',
  edwinSolista.depositAmount === DEPOSITO_STRIPE,
  `depositAmount=${edwinSolista.depositAmount} €`,
);

const edwinQuinteto = await calculateEdwinAgudeloFormatPricing({
  origin: HUB_COORDS,
  destination: TOLEDO_COORDS,
  musiciansCount: 3,
});
check(
  'Motor Edwin: grupo => mínimo 5 músicos y base 750 € del SSOT',
  edwinQuinteto.effectiveMusicians === 5 && edwinQuinteto.baseFee === BASE_SOLISTA + SUPLEMENTO_QUINTETO,
  `músicos=${edwinQuinteto.effectiveMusicians} · base=${edwinQuinteto.baseFee} €`,
);
const edwinSplitSum: number =
  edwinQuinteto.split.providerAmount +
  edwinQuinteto.split.platformEarAmount +
  edwinQuinteto.split.affiliateVimumeAmount;
check(
  'Motor Edwin: split 80/10/10 cierra sobre el total',
  Math.abs(edwinSplitSum - edwinQuinteto.totalAmount) <= 0.02,
  `split=${edwinQuinteto.split.providerAmount}/${edwinQuinteto.split.platformEarAmount}/${edwinQuinteto.split.affiliateVimumeAmount} · total=${edwinQuinteto.totalAmount} €`,
);

/* ── 5. Suites embebidas de los guardianes ──────────────────────────────── */
check('Price-Lock verifier: 4/4 casos PASS', runSelfDiagnostics(), 'suite runSelfDiagnostics()');
check('Astra: 4/4 casos PASS', runAstraDiagnostics().passed, 'suite runAstraDiagnostics()');

/* ── 6. Bloqueo estático de motores paralelos ───────────────────────────── */
const scriptDir: string = path.dirname(fileURLToPath(import.meta.url));
const projectRoot: string = path.resolve(scriptDir, '..');
const filesToScan: readonly string[] = [
  'src/lib/astra/astra-conversation-engine.ts',
  'src/lib/orchestrators/deal-closer.ts',
  'src/lib/mariachi/mariachi-dispatch-engine.ts',
  'src/lib/geo/geo-acoustic-radar.ts',
  'src/lib/pricing/price-lock-verifier.ts',
  'src/lib/services/pricing/geo-pricer.ts',
  'src/lib/actions/stripe-checkout.ts',
  'src/app/actions/vendorActions.ts',
  'src/config/stripe-products.ts',
  'src/app/actions/checkoutActions.ts',
  'src/app/api/quote/generate-lock/route.ts',
];
const forbiddenRules: readonly { pattern: RegExp; label: string }[] = [
  { pattern: /\*\s*COSTE_KM/, label: 'multiplicación manual por COSTE_KM (ignora la franquicia)' },
  { pattern: /billableKm\s*\*\s*1\.5/, label: 'tarifa legacy 1,50 €/km hardcodeada' },
  { pattern: /distanceKm\s*\*\s*0\.35/, label: 'tarifa legacy 0,35 €/km hardcodeada' },
  { pattern: /costPerKm\s*[:=]\s*0\.75/, label: 'tarifa legacy 0,75 €/km hardcodeada' },
  { pattern: /depositValue:\s*150/, label: 'depósito de 150 € no canónico (SSOT: 100 €)' },
  { pattern: /depositValue:\s*30\b/, label: 'depósito porcentual del 30% no canónico (SSOT: 100 € fijos)' },
  { pattern: /baseFee\s*=\s*(1200|550|900|1800)\b/, label: 'escalera de tarifas hardcodeada en la ruta de venta' },
  { pattern: /totalAmount\s*\*\s*0\.(80|10|8|1)\b/, label: 'split hardcodeado (SSOT: SPLIT_SOBERANO)' },
];
const violations: string[] = [];
for (const relative of filesToScan) {
  const content: string = readFileSync(path.join(projectRoot, relative), 'utf8');
  for (const rule of forbiddenRules) {
    if (rule.pattern.test(content)) violations.push(`${relative}: ${rule.label}`);
  }
}
check(
  'Anti-duplicidad: 0 motores logísticos paralelos en la ruta de venta',
  violations.length === 0,
  violations.length === 0 ? `${filesToScan.length} archivos limpios` : violations.join(' | '),
);

/* ── Informe ─────────────────────────────────────────────────────────────── */
const passed: number = cases.filter((c: CaseResult) => c.ok).length;
for (const c of cases) {
  console.log(`${c.ok ? '✅' : '❌'} ${c.name}\n   ${c.detail}`);
}
console.log(`\n${passed}/${cases.length} comprobaciones superadas · motor de precios unificado en el SSOT.`);
process.exitCode = passed === cases.length ? 0 : 1;


