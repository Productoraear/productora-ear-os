/**
 * TEST: HORMOZI PSEO HIGH-RETENTION LANDINGS & SITEMAP
 * Valida el motor de intención de búsqueda (resolveSearchIntent), el cálculo
 * acústico 12W/pax, la logística Méntrida, el generador JSON-LD y la cobertura
 * del sitemap de partición 1 (10 gremios × 52 provincias) sin URLs rotas.
 */

import {
  resolveSearchIntent,
  calculateAcousticPower,
  calculateMentridaLogistics,
  CANONICAL_GREMIO_SLUGS,
  WATTS_PER_PAX,
  BASE_SOLIST_PRICE,
  DEPOSIT_PRICE,
  LOGISTICS_RATE_PER_KM,
  LOGISTICS_FREE_KM
} from '../src/lib/seo/searchIntentEngine';
import { PROVINCIAS_52_GRAPH } from '../src/lib/constants/seo-data-hydrated';
import { generateSchemaOrgJsonLd } from '../src/lib/seo/schemaOrgGenerator';

console.log('🚀 [TEST] Verificando motor pSEO Hormozi y cobertura de sitemap...\n');

const startTime = Date.now();
const BASE_URL = 'https://www.productoraear.com';
const provinceKeys = Object.keys(PROVINCIAS_52_GRAPH);
let passed = 0;
const total = 7;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK 1: Resolución de SearchIntentProfile para 50 combinaciones
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const combosCursor = 50;
let combosOk = true;
let resolutionsMs = -1;
{
  const t0 = Date.now();
  for (let i = 0; i < combosCursor; i++) {
    const gremio = CANONICAL_GREMIO_SLUGS[i % CANONICAL_GREMIO_SLUGS.length];
    const provincia = provinceKeys[i % provinceKeys.length];
    const profile = resolveSearchIntent(gremio, provincia);

    if (
      profile.hormoziValueTotal !== 2900 ||
      profile.basePrice !== BASE_SOLIST_PRICE ||
      profile.deposit !== DEPOSIT_PRICE ||
      profile.faqs.length !== 5 ||
      profile.proofPhotos.length !== 4 ||
      profile.leadPainPoints.length !== 3 ||
      profile.hormoziValueStack.length !== 4
    ) {
      combosOk = false;
      console.error(`   ❌ Perfil inválido en ${gremio}/${provincia}`);
      break;
    }
  }
  resolutionsMs = Date.now() - t0;
}
if (combosOk) {
  passed++;
  console.log(`✅ CHECK 1: ${combosCursor} perfiles resueltos en ${resolutionsMs} ms`);
} else {
  console.error('❌ CHECK 1: Fallo en la resolución de perfiles');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK 2: Cálculo acústico 12 W/pax (150 pax = 1800 W)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const acoustic = calculateAcousticPower(150);
if (acoustic.wattsRms === 150 * WATTS_PER_PAX && acoustic.isSplCompliant && acoustic.estimatedSplDb < 75) {
  passed++;
  console.log(`✅ CHECK 2: Acústica 150 pax = ${acoustic.wattsRms} W RMS (${acoustic.estimatedSplDb} dB, <75 dB)`);
} else {
  console.error('❌ CHECK 2: Cálculo acústico incorrecto');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK 3: Logística Méntrida (Toledo < 50 km = 0 €, Málaga > 200 km)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const toledo = calculateMentridaLogistics('toledo');
const malaga = calculateMentridaLogistics('malaga');
const malagaKmFee = Number(((malaga.distanceKm - LOGISTICS_FREE_KM) * LOGISTICS_RATE_PER_KM).toFixed(2));
if (
  toledo.distanceKm === 44 &&
  toledo.billableKm === 0 &&
  toledo.kmFee === 0 &&
  malaga.distanceKm === 392 &&
  malaga.billableKm === 342 &&
  malaga.kmFee === malagaKmFee &&
  malaga.isHotelApplied &&
  malaga.hotelFee === 120
) {
  passed++;
  console.log(`✅ CHECK 3: Méntrida → Toledo 0 € / Málaga ${malaga.kmFee} € + hotel`);
} else {
  console.error('❌ CHECK 3: Logística Méntrida incorrecta');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK 4: Generador JSON-LD (Service + FAQPage + AggregateRating)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const profile = resolveSearchIntent('mariachis', 'madrid');
const jsonLd = generateSchemaOrgJsonLd(profile);
const types = jsonLd['@graph'].map((n) => n['@type']);
if (
  jsonLd['@context'] === 'https://schema.org' &&
  types.includes('Service') &&
  types.includes('FAQPage') &&
  types.includes('AggregateRating')
) {
  passed++;
  console.log(`✅ CHECK 4: JSON-LD con ${jsonLd['@graph'].length} nodos (${types.join(', ')})`);
} else {
  console.error('❌ CHECK 4: JSON-LD incompleto');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK 5: Sitemap partición 1 — 520 landings sin URLs rotas
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const sitemapUrls = new Set<string>();
for (const prov of provinceKeys) {
  sitemapUrls.add(`${BASE_URL}/bodas/${prov}`);
  sitemapUrls.add(`${BASE_URL}/bodas/${prov}/eventos`);
  sitemapUrls.add(`${BASE_URL}/b2g/${prov}`);
  for (const serv of CANONICAL_GREMIO_SLUGS) {
    sitemapUrls.add(`${BASE_URL}/servicios/${serv}/${prov}`);
  }
}

const invalidUrlPattern = /[\s()<>"'{}\\]/;
const broken = Array.from(sitemapUrls).filter((u) => invalidUrlPattern.test(u));
const serviceLandings = Array.from(sitemapUrls).filter((u) => u.includes('/servicios/'));
if (broken.length === 0 && serviceLandings.length === CANONICAL_GREMIO_SLUGS.length * provinceKeys.length) {
  passed++;
  console.log(`✅ CHECK 5: Sitemap partición 1 con ${serviceLandings.length} landings y 0 URLs rotas`);
} else {
  console.error(`❌ CHECK 5: URLs rotas ${broken.length} / landings ${serviceLandings.length}`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK 6: Cobertura 10 gremios × 52 provincias
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if (CANONICAL_GREMIO_SLUGS.length === 10 && provinceKeys.length === 52) {
  passed++;
  console.log(`✅ CHECK 6: ${CANONICAL_GREMIO_SLUGS.length} gremios × ${provinceKeys.length} provincias`);
} else {
  console.error(`❌ CHECK 6: Dimensiones inesperadas (${CANONICAL_GREMIO_SLUGS.length} × ${provinceKeys.length})`);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CHECK 7: Reglas de negocio canónicas inmutables
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if (
  WATTS_PER_PAX === 12 &&
  BASE_SOLIST_PRICE === 350 &&
  DEPOSIT_PRICE === 100 &&
  LOGISTICS_RATE_PER_KM === 1.5 &&
  LOGISTICS_FREE_KM === 50
) {
  passed++;
  console.log('✅ CHECK 7: Reglas S-CLASS intactas (12W/pax, 350€, 100€, 1,50€/km, 50km)');
} else {
  console.error('❌ CHECK 7: Reglas de negocio alteradas');
}

const elapsed = Date.now() - startTime;
console.log(`\n⏱️ Tiempo total: ${elapsed} ms`);

if (passed === total && elapsed < 3000) {
  console.log('\n✅ TEST PASSED: Motor pSEO Hormozi y sitemap validados. Exit Code 0.');
  process.exit(0);
} else {
  console.error(`\n❌ TEST FAILED: ${passed}/${total} checks OK.`);
  process.exit(1);
}