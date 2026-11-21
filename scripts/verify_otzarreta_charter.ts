/**
 * 🧪 VERIFICACIÓN DE CARTA Y AFORO — SANCIÓN DEL CEO 2026-11-21
 * ============================================================================
 * Demuestra mecánicamente las DOS decisiones formales del Director Generalista
 * sobre el catálogo de Restaurante Otzarreta / Ezkertza Berria (Derio):
 *
 *   A. MENÚS 2027: la carta vigente son los 4 menús de gala 145/155/165/185 €
 *      + IVA, con reclamo canónico «Menús de Gala desde 145 € + IVA».
 *      · Ninguna superficie puede seguir publicando el suelo derogado de 100 €.
 *      · El «desde» se deriva del primer menú (no hay segunda cifra viva).
 *
 *   B. AFORO CANÓNICO: salón acristalado 200 pax (interior), jardín/carpa
 *      350 pax (exterior), total finca 350 pax, párking > 120 plazas.
 *      · El exterior y el total NO son literales: se leen de la entidad.
 *
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_otzarreta_charter.ts
 * Coste de red: $0,00 (todo determinístico, lectura de disco y AST-lite).
 * ============================================================================
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  OTZARRETA_ENTITY,
  OTZARRETA_SEATING_PRESET,
  OTZARRETA_WEDDING_MENUS,
  OTZARRETA_WEDDING_MENUS_CLAIM,
} from '../src/lib/constants/otzarreta-entity';

let passed = 0;
const failures: string[] = [];

function check(name: string, condition: boolean, detail?: string): void {
  if (condition) {
    passed += 1;
    console.log(`  OK   ${name}`);
  } else {
    failures.push(`${name}${detail ? ` -> ${detail}` : ''}`);
    console.log(`  FAIL ${name}${detail ? ` -> ${detail}` : ''}`);
  }
}

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');

function read(relative: string): string {
  return readFileSync(path.join(ROOT, relative), 'utf8');
}

/* ── A. CARTA DE GALA 2027 ───────────────────────────────────────────────── */

const EXPECTED_MENUS: ReadonlyArray<{ readonly name: string; readonly priceEur: number }> = [
  { name: 'Menú Tradición', priceEur: 145 },
  { name: 'Menú Asador', priceEur: 155 },
  { name: 'Menú Ezkertza', priceEur: 165 },
  { name: 'Menú Soberano', priceEur: 185 },
];

check(
  'A1 · La carta tiene exactamente 4 menús',
  OTZARRETA_WEDDING_MENUS.length === 4,
  `longitud=${OTZARRETA_WEDDING_MENUS.length}`,
);

EXPECTED_MENUS.forEach((expected, index) => {
  const actual = OTZARRETA_WEDDING_MENUS[index];
  check(
    `A2.${index + 1} · Menú ${index + 1} = «${expected.name}» a ${expected.priceEur} €`,
    actual?.name === expected.name && actual?.priceEur === expected.priceEur,
    `real=${actual?.name ?? 'desconocido'} / ${String(actual?.priceEur)} €`,
  );
});

const prices = OTZARRETA_WEDDING_MENUS.map((menu) => menu.priceEur ?? 0);
const ascending = prices.every((price, index) => index === 0 || price > (prices[index - 1] ?? 0));
check('A3 · Importes estrictamente crecientes (orden de carta)', ascending, prices.join(' < '));

check(
  'A4 · Reclamo canónico literal',
  OTZARRETA_WEDDING_MENUS_CLAIM === 'Menús de Gala desde 145 € + IVA',
  `real="${OTZARRETA_WEDDING_MENUS_CLAIM}"`,
);

check(
  'A5 · El suelo del SSOT se deriva del primer menú (sin segunda cifra)',
  OTZARRETA_ENTITY.weddingPriceFromEur === 145 &&
    OTZARRETA_ENTITY.weddingPriceFromEur === prices[0],
  `weddingPriceFromEur=${OTZARRETA_ENTITY.weddingPriceFromEur}`,
);

check(
  'A6 · Ningún menú por debajo de 145 € ni por encima de 185 €',
  prices.every((price) => price >= 145 && price <= 185),
  prices.join(', '),
);

/* ── A-bis · ANTI-DRIFT EN SUPERFICIES PÚBLICAS (INV-10) ─────────────────── */

const SURFACES: ReadonlyArray<{ readonly file: string; readonly label: string }> = [
  { file: 'src/components/otzarreta/BentoMenuSection.tsx', label: 'Bento /otzarreta' },
  { file: 'src/app/api/concierge/chat/route.ts', label: 'System prompt del Concierge' },
  { file: 'src/app/(public)/otzarreta/page.tsx', label: 'Ficha /otzarreta' },
];

for (const surface of SURFACES) {
  const source = read(surface.file);
  check(
    `A7 · ${surface.label} sin el suelo derogado «100 €»`,
    !/desde\s+100\s*€|de\s+100\s*€\s+a|Cantábrico\s+100\s*€/i.test(source),
    'quedan importes de 2026 en el copy',
  );
  check(
    `A8 · ${surface.label} cita el reclamo canónico o lo deriva`,
    source.includes('OTZARRETA_WEDDING_MENUS_CLAIM') || source.includes('OTZARRETA_WEDDING_MENUS'),
    'no consume la fuente única',
  );
}

const bentoSource = read('src/components/otzarreta/BentoMenuSection.tsx');
check(
  'A9 · El Bento ya no titula «Siete menús»',
  !/Siete menús/i.test(bentoSource),
  'título fósil del catálogo anterior',
);

/* ── B. PRESET OFICIAL DE AFORO ──────────────────────────────────────────── */

check(
  'B1 · Salón acristalado (interior) = 200 pax',
  OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax === 200,
  `real=${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax}`,
);

check(
  'B2 · Jardín/carpa (exterior) = 350 pax',
  OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax === 350,
  `real=${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax}`,
);

check(
  'B3 · Capacidad total de la finca = 350 pax (leída de la entidad)',
  OTZARRETA_SEATING_PRESET.totalPax === 350 &&
    OTZARRETA_SEATING_PRESET.totalPax === OTZARRETA_ENTITY.capacityPax,
  `totalPax=${OTZARRETA_SEATING_PRESET.totalPax}`,
);

check(
  'B4 · El exterior se deriva de la entidad (cero literal duplicado)',
  OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax === OTZARRETA_ENTITY.capacityPax,
  `${OTZARRETA_SEATING_PRESET.exteriorGarden.capacityPax} != ${OTZARRETA_ENTITY.capacityPax}`,
);

check(
  'B5 · Párking privado garantizado ≥ 120 plazas (directiva «>120»)',
  OTZARRETA_SEATING_PRESET.parkingSpaces >= 120,
  `parkingSpaces=${OTZARRETA_SEATING_PRESET.parkingSpaces}`,
);

check(
  'B6 · Párking no promete más plazas de las publicadas en la ficha',
  OTZARRETA_SEATING_PRESET.parkingSpaces <= OTZARRETA_ENTITY.parkingSpaces,
  `${OTZARRETA_SEATING_PRESET.parkingSpaces} > ${OTZARRETA_ENTITY.parkingSpaces}`,
);

check(
  'B7 · El interior no excede el total (una sala no supera la finca)',
  OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax <= OTZARRETA_SEATING_PRESET.totalPax,
  `${OTZARRETA_SEATING_PRESET.interiorSalon.capacityPax} > ${OTZARRETA_SEATING_PRESET.totalPax}`,
);

check(
  'B8 · El interior respeta el rango estándar publicado 50–200',
  OTZARRETA_SEATING_PRESET.interiorSalon.standardRange === '50 a 200 comensales',
  `real="${OTZARRETA_SEATING_PRESET.interiorSalon.standardRange}"`,
);

const plannerSource = read('src/app/(public)/seating-planner/page.tsx');
check(
  'B9 · El planificador consume el preset (cero aforo inventado en la ruta)',
  plannerSource.includes('OTZARRETA_SEATING_PRESET'),
  'la ruta no importa el preset',
);

const conciergeSource = read('src/app/api/concierge/chat/route.ts');
check(
  'B10 · El Concierge cita aforo y párking del preset',
  conciergeSource.includes('OTZARRETA_SEATING_PRESET.interiorSalon') &&
    conciergeSource.includes('OTZARRETA_SEATING_PRESET.parkingSpaces'),
  'el prompt sigue con cifras literales',
);

/* ── A-ter · COTIZADOR DE /otzarreta/[slug] (carta canónica) ─────────────── */

const explorerSource = read('src/components/otzarreta/OtzarretaExperienceExplorer.tsx');
check(
  'A10 · El cotizador renderiza la carta canónica, no el dataset crudo',
  /CANONICAL_OTZARRETA_MENUS/.test(explorerSource) &&
    !/\{OFFICIAL_OTZARRETA_MENUS\.map/.test(explorerSource),
  'la UI sigue mapeando los paquetes de 2026',
);

check(
  'A11 · Las 4 bodas canónicas están enlazadas por id',
  ['boda-tradicion', 'boda-asador', 'boda-ezkertza', 'boda-soberano'].every((id) =>
    explorerSource.includes(id),
  ),
  'falta algún id canónico',
);

check(
  'A12 · Ningún paquete de boda conserva el importe 2026 en su etiqueta',
  !/pricePerPax:\s*(?:100|123\.4|125|138|142\.5|155|173)\b/.test(explorerSource) ||
    explorerSource.includes('withCanonicalWeddingPricing'),
  'precios de 2026 sin capa canónica',
);

/* ── C. ZONA CERO INTACTA ────────────────────────────────────────────────── */

const ssotSource = read('src/lib/constants/ear-os-ssot.ts');
check(
  'C1 · El catálogo no invade el SSOT financiero (INV-05)',
  !ssotSource.includes('otzarreta-entity') && !ssotSource.includes('OTZARRETA_WEDDING_MENUS'),
  'ear-os-ssot.ts importa el catálogo',
);

/* ── RESUMEN ─────────────────────────────────────────────────────────────── */

console.log('\n' + '─'.repeat(72));
if (failures.length === 0) {
  console.log(`VEREDICTO: PASS · ${passed}/${passed} aserciones`);
  console.log('Carta de gala 2027 y preset de aforo conformes a la sanción del CEO.');
  process.exit(0);
}
console.log(`VEREDICTO: FAIL · ${failures.length} fallo(s) de ${passed + failures.length}`);
for (const failure of failures) console.log(`  · ${failure}`);
process.exit(1);

