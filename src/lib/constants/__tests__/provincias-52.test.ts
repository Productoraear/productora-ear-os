/**
 * B5.42 — TEST DE INTEGRIDAD: 52 PROVINCIAS CANÓNICAS
 * Valida que el dataset territorial pSEO contenga exactamente las 52 provincias
 * de España con slugs RFC 3986 válidos y datos logísticos coherentes.
 *
 * Ejecución: npx tsx src/lib/constants/__tests__/provincias-52.test.ts
 * Salida: Exit Code 0 si todas las aserciones pasan.
 */
import assert from 'node:assert/strict';
import { PROVINCIAS_52_GRAPH } from '../seo-data-hydrated';

const EXPECTED_PROVINCES = 52;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

let passed = 0;
function check(label: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`  ✓ ${label}`);
}

console.log('PROVINCIAS_52_GRAPH — Integridad Territorial pSEO');

check('debe contener exactamente 52 provincias', () => {
  const slugs = Object.keys(PROVINCIAS_52_GRAPH);
  assert.equal(slugs.length, EXPECTED_PROVINCES, `Se esperaban ${EXPECTED_PROVINCES}, hay ${slugs.length}`);
});

check('cada provincia debe tener un slug RFC 3986 válido', () => {
  for (const [slug, entity] of Object.entries(PROVINCIAS_52_GRAPH)) {
    assert.match(slug, slugRegex, `Slug inválido: ${slug}`);
    assert.equal(entity.slug, slug, `entity.slug no coincide con la clave: ${slug}`);
    assert.ok(entity.slug.length >= 3, `Slug demasiado corto: ${slug}`);
    assert.ok(entity.slug.length <= 70, `Slug demasiado largo: ${slug}`);
  }
});

check('cada provincia debe tener datos logísticos coherentes', () => {
  for (const entity of Object.values(PROVINCIAS_52_GRAPH)) {
    assert.ok(entity.distanceFromHubKm > 0, `distanceFromHubKm <= 0 en ${entity.slug}`);
    assert.ok(entity.distanceFromHubKm < 2000, `distanceFromHubKm >= 2000 en ${entity.slug}`);
    assert.ok(entity.deliveryCostBase >= 0, `deliveryCostBase < 0 en ${entity.slug}`);
    assert.ok(entity.featuredVenuesCount >= 0, `featuredVenuesCount < 0 en ${entity.slug}`);
    assert.equal(entity.logisticsSpecs.wattsPerPax, 12, `wattsPerPax != 12 en ${entity.slug}`);
    assert.ok(entity.topIntents.length > 0, `topIntents vacío en ${entity.slug}`);
  }
});

check('no debe haber slugs duplicados', () => {
  const slugs = Object.keys(PROVINCIAS_52_GRAPH);
  assert.equal(new Set(slugs).size, slugs.length, 'Existen slugs duplicados');
});

check('debe incluir las provincias clave de la zona centro', () => {
  assert.ok(PROVINCIAS_52_GRAPH['madrid'], 'Falta madrid');
  assert.ok(PROVINCIAS_52_GRAPH['toledo'], 'Falta toledo');
  assert.ok(PROVINCIAS_52_GRAPH['salamanca'], 'Falta salamanca');
  assert.ok(PROVINCIAS_52_GRAPH['valladolid'], 'Falta valladolid');
});

console.log(`\n✅ B5.42 OK — ${passed}/5 aserciones superadas · ${Object.keys(PROVINCIAS_52_GRAPH).length} provincias canónicas`);