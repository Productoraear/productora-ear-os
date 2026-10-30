/**
 * 🧪 VERIFICACIÓN FORENSE — LOGÍSTICA MULTI-ORIGEN (HUB MÉNTRIDA vs RED NACIONAL)
 * ---------------------------------------------------------------------------
 * Demuestra, con aserciones ejecutables, la doctrina de AGENTS.md §3:
 *   1. El Hub Méntrida (Edwin Agudelo / empresas con base en Méntrida) despacha
 *      con franquicia de 50 km (`LOGISTICA_KM_EXENTOS`).
 *   2. El resto de la Red Nacional factura desde el km 0 de su propia base
 *      física (`NETWORK_FRANCHISE_KM = 0`): NO hereda la franquicia del Hub.
 *   3. Un sujeto sin base física verificable LANZA `LogisticsOriginError`
 *      (fail-closed: nunca se inventa Madrid ni Méntrida).
 *   4. El Price-Lock SHA-256 incluye la franquicia: Hub y Red NO comparten
 *      `priceLockHash` para la misma distancia.
 *
 * Uso:  node ./node_modules/tsx/dist/cli.mjs scripts/verify_logistics_multi_origin.ts
 * Coste de red: $0,00 (determinístico, sin llamadas externas).
 * ---------------------------------------------------------------------------
 */

import {
  HUB_MENTRIDA,
  LOGISTICS_ORIGIN_COPY,
  LogisticsOriginError,
  NETWORK_FRANCHISE_KM,
  isMentridaHubSubject,
  resolveLogisticsOrigin,
} from '../src/lib/pricing/logistics-origin';
import { KM_EXENTOS, computeSovereignLogistics } from '../src/lib/pricing/logistics';
import { calculateSovereignQuote } from '../src/lib/pricing/sovereign-pricing';

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

/* ── 1. Hub Méntrida: identidad, no geografía genérica ───────────────────── */
const edwin = resolveLogisticsOrigin({ id: 'edwin-agudelo', name: 'Edwin Agudelo' });
check('Hub: Edwin Agudelo despacha desde el Hub', edwin.kind === 'HUB_MENTRIDA', `kind=${edwin.kind}`);
check('Hub: franquicia de 50 km', edwin.franchiseKm === KM_EXENTOS && edwin.franchiseKm === 50, `franchiseKm=${edwin.franchiseKm}`);
check('Hub: coordenadas canónicas de Méntrida', edwin.coordinates.latitude === HUB_MENTRIDA.latitude && edwin.coordinates.longitude === HUB_MENTRIDA.longitude, `lat=${edwin.coordinates.latitude} lng=${edwin.coordinates.longitude}`);
check('Hub: reconocido por nombre (sin GPS)', isMentridaHubSubject({ name: 'Edwin Agudelo' }), 'isMentridaHubSubject(name)');

const mentridaCompany = resolveLogisticsOrigin({ name: 'Finca El Olivar', city: 'Méntrida', province: 'Toledo' });
check('Hub: empresa con base en Méntrida hereda el Hub', mentridaCompany.kind === 'HUB_MENTRIDA' && mentridaCompany.franchiseKm === 50, `kind=${mentridaCompany.kind} franchiseKm=${mentridaCompany.franchiseKm}`);

/* ── 2. Red Nacional: franquicia CERO, base fiscal propia ────────────────── */
check('Red: NETWORK_FRANCHISE_KM === 0', NETWORK_FRANCHISE_KM === 0, `NETWORK_FRANCHISE_KM=${NETWORK_FRANCHISE_KM}`);

const sevilla = resolveLogisticsOrigin({ name: 'Mariachi Sevilla Sur', city: 'Sevilla', province: 'Sevilla' });
check('Red: proveedor de Sevilla no es Hub', sevilla.kind !== 'HUB_MENTRIDA', `kind=${sevilla.kind}`);
check('Red: franquicia 0 (no hereda 50 km)', sevilla.franchiseKm === 0, `franchiseKm=${sevilla.franchiseKm}`);
check('Red: resuelto por municipio', sevilla.scope === 'municipio', `scope=${sevilla.scope}`);

const onlyProvince = resolveLogisticsOrigin({ name: 'Mariachi Galicia', province: 'Pontevedra' });
check('Red: solo provincia => scope provincia, franquicia 0', onlyProvince.scope === 'provincia' && onlyProvince.franchiseKm === 0, `scope=${onlyProvince.scope} franchiseKm=${onlyProvince.franchiseKm}`);

const declaredGps = resolveLogisticsOrigin({ name: 'Mariachi Bilbao', coordinates: { latitude: 43.263013, longitude: -2.934989 } });
check('Red: GPS declarado => PROVIDER_GPS', declaredGps.kind === 'PROVIDER_GPS' && declaredGps.franchiseKm === 0, `kind=${declaredGps.kind} scope=${declaredGps.scope}`);

const inlineGps = resolveLogisticsOrigin({ name: 'Mariachi Vigo', location: 'Rua do Sol 4, Vigo (42.240600, -8.720700)' });
check('Red: GPS embebido en location => PROVIDER_GPS', inlineGps.kind === 'PROVIDER_GPS' && inlineGps.franchiseKm === 0, `kind=${inlineGps.kind}`);

/* ── 3. Anti-fuga: "Méntrida" en la calle NO convierte en Hub ────────────── */
const madridStreet = resolveLogisticsOrigin({ name: 'Mariachi Madrid Centro', location: 'Calle Méntrida 5, Madrid' });
check('Anti-fuga: calle Méntrida en Madrid no es Hub', madridStreet.kind !== 'HUB_MENTRIDA' && madridStreet.franchiseKm === 0, `kind=${madridStreet.kind} franchiseKm=${madridStreet.franchiseKm}`);

/* ── 4. Fail-closed: sin base física no hay factura de kilómetros ────────── */
let placeholderCaught = false;
try {
  resolveLogisticsOrigin({ name: 'Proveedor Sin Configurar', province: 'Madrid / Toledo' });
} catch (error) {
  placeholderCaught = error instanceof LogisticsOriginError;
}
check('Fail-closed: province placeholder "Madrid / Toledo" no se factura', placeholderCaught, `threw=${placeholderCaught}`);

let emptyCaught = false;
let emptyCode = '';
try {
  resolveLogisticsOrigin({});
} catch (error) {
  if (error instanceof LogisticsOriginError) {
    emptyCaught = true;
    emptyCode = error.code;
  }
}
check('Fail-closed: sujeto sin datos lanza LOGISTICS_ORIGIN_UNRESOLVED', emptyCaught && emptyCode === 'LOGISTICS_ORIGIN_UNRESOLVED', `code=${emptyCode}`);

/* ── 5. Motor logístico: la franquicia manda en el importe ───────────────── */
const hubQuote = calculateSovereignQuote({ format: 'solista', distanceKm: 120, soundRider: 'standard', franchiseKm: 50 });
const networkQuote = calculateSovereignQuote({ format: 'solista', distanceKm: 120, soundRider: 'standard', franchiseKm: 0 });

check('Motor: Hub 120 km => 70 km facturables', hubQuote.logistics.billableKm === 70, `billableKm=${hubQuote.logistics.billableKm}`);
check('Motor: Hub 120 km => 105,00 € de logística', hubQuote.logistics.travelCost === 105, `travelCost=${hubQuote.logistics.travelCost}`);
check('Motor: Red 120 km => 120 km facturables', networkQuote.logistics.billableKm === 120, `billableKm=${networkQuote.logistics.billableKm}`);
check('Motor: Red 120 km => 180,00 € de logística', networkQuote.logistics.travelCost === 180, `travelCost=${networkQuote.logistics.travelCost}`);
check('Motor: Hub 455,00 € vs Red 530,00 €', hubQuote.totalBudget === 455 && networkQuote.totalBudget === 530, `hub=${hubQuote.totalBudget} red=${networkQuote.totalBudget}`);
check('Motor: depósito inmutable 100,00 € en ambos', hubQuote.depositRequired === 100 && networkQuote.depositRequired === 100, `deposito=${hubQuote.depositRequired}`);

const hubSplitSum = hubQuote.split.artist80 + hubQuote.split.earOs10 + hubQuote.split.vimume10;
const networkSplitSum = networkQuote.split.artist80 + networkQuote.split.earOs10 + networkQuote.split.vimume10;
check('Split 80/10/10 exacto (Hub y Red)', hubSplitSum === hubQuote.totalBudget && networkSplitSum === networkQuote.totalBudget, `hub=${hubSplitSum}/${hubQuote.totalBudget} red=${networkSplitSum}/${networkQuote.totalBudget}`);
check('Split: artista 80 % del total', hubQuote.split.artist80 === Math.round(hubQuote.totalBudget * 0.8), `artist80=${hubQuote.split.artist80}`);

/* ── 6. Price-Lock SHA-256 firmado con la franquicia ─────────────────────── */
check('Price-Lock: hash distinto Hub vs Red a igual distancia', hubQuote.priceLockHash !== networkQuote.priceLockHash, `hub=${hubQuote.priceLockHash.slice(0, 12)}… red=${networkQuote.priceLockHash.slice(0, 12)}…`);
check('Price-Lock: hash sha256 de 64 hex', /^[0-9a-f]{64}$/.test(hubQuote.priceLockHash), `len=${hubQuote.priceLockHash.length}`);
check('Price-Lock: determinista (mismo input => mismo hash)', calculateSovereignQuote({ format: 'solista', distanceKm: 120, soundRider: 'standard', franchiseKm: 50 }).priceLockHash === hubQuote.priceLockHash, 'recompute');

/* ── 7. Compatibilidad histórica y datos corruptos ───────────────────────── */
check('Legacy: sin franchiseKm => franquicia del SSOT (50 km)', computeSovereignLogistics(120).franchiseKm === 50, `franchiseKm=${computeSovereignLogistics(120).franchiseKm}`);
check('Legacy: franquicia ilegible => 0 km (no regala kilómetros)', computeSovereignLogistics(120, undefined, { franchiseKm: 'basura' }).franchiseKm === 0, 'franchiseKm=0');
check('Legacy: distancia negativa => 0 km facturables', computeSovereignLogistics(-40, undefined, { franchiseKm: 0 }).billableKm === 0, 'billableKm=0');

/* ── 8. Copy comercial alineado con el motor (AF-4) ──────────────────────── */
const copyBlob = `${LOGISTICS_ORIGIN_COPY.hub} ${LOGISTICS_ORIGIN_COPY.network} ${LOGISTICS_ORIGIN_COPY.networkNote}`;
check('Copy: el Hub anuncia los 50 km incluidos', LOGISTICS_ORIGIN_COPY.hub.includes('50 km'), LOGISTICS_ORIGIN_COPY.hub);
check('Copy: la Red Nacional declara que NO hereda la franquicia', LOGISTICS_ORIGIN_COPY.networkNote.includes('no heredan la franquicia'), 'networkNote');
check('Copy: cero "Hub Central" (copy soberano)', !copyBlob.includes('Hub Central'), 'ok');
check('Copy: cero promesas de franquicia en la Red', !LOGISTICS_ORIGIN_COPY.network.includes('50 km'), LOGISTICS_ORIGIN_COPY.network);

/* ── Informe final ───────────────────────────────────────────────────────── */
for (const testCase of cases) {
  console.log(`${testCase.ok ? 'PASS' : 'FAIL'} | ${testCase.name} | ${testCase.detail}`);
}

const failed = cases.filter((testCase) => !testCase.ok);
const summary = {
  verdict: failed.length === 0 ? 'PASS' : 'FAIL',
  cases: cases.length,
  passed: cases.length - failed.length,
  failed: failed.map((testCase) => testCase.name),
  checkedAt: new Date().toISOString(),
};

console.log('── VERIFICACIÓN LOGÍSTICA MULTI-ORIGEN ──');
console.log(JSON.stringify(summary, null, 2));
console.log(`VERDICT=${summary.verdict}`);

process.exitCode = failed.length === 0 ? 0 : 1;

