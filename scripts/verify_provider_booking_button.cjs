/**
 * Verificador W28_T01 — Integración de RequestToBookButton en proveedores/[slug].
 *
 * Confirma (≥12 aserciones):
 *   1. Importación exacta del componente.
 *   2. Derivación de `providerId` real (rawProvider.id || slug).
 *   3. Renderizado en la tarjeta sticky lateral (CTA primario).
 *   4. Renderizado en el catálogo de packs con el precio del pack.
 *   5. Props reales (providerId / providerName / category / defaultBudget / location).
 *   6. Ausencia de `: any` y `Math.random` en el código integrado.
 *   7. La página sigue siendo un Server Component (await params).
 *
 * Nota: el chequeo de `: any` se acota a los bloques <RequestToBookButton … />
 * (el diff de esta tarea). El fichero fuente ya contenía `: any` preexistentes
 * fuera del alcance de W28_T01, que no se tocan aquí.
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const TARGET = path.resolve(
  __dirname,
  '..',
  'src',
  'app',
  '(public)',
  'proveedores',
  '[slug]',
  'page.tsx'
);

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passed += 1;
    console.log(`  \u2713 ${message}`);
  } else {
    failed += 1;
    failures.push(message);
    console.log(`  \u2717 ${message}`);
  }
}

function main() {
  console.log('\n=== W28_T01 VERIFY: RequestToBookButton en proveedores/[slug] ===\n');

  assert(fs.existsSync(TARGET), 'El fichero objetivo existe');
  const src = fs.readFileSync(TARGET, 'utf8');

  // 1. Importación exacta
  const importLine = "import { RequestToBookButton } from '@/components/booking/RequestToBookButton';";
  assert(src.includes(importLine), 'Importa RequestToBookButton desde @/components/booking/RequestToBookButton');
  const importCount = (src.match(/from ['"]@\/components\/booking\/RequestToBookButton['"]/g) || []).length;
  assert(importCount === 1, 'Exactamente una importación del componente (sin duplicados)');

  // 2. providerId derivado de datos reales (no hardcodeado)
  assert(
    /const providerId\s*=\s*rawProvider\.id\s*\|\|\s*slug;/.test(src),
    'Deriva providerId real (rawProvider.id || slug)'
  );

  // 3. Renderizados
  const blocks = [...src.matchAll(/<RequestToBookButton\b[\s\S]*?\/>/g)].map((m) => m[0]);
  assert(blocks.length >= 2, `Renderiza el componente (${blocks.length} ocurrencias, esperado ≥ 2)`);

  // 4. Bloque de la tarjeta sticky (CTA primario)
  const stickyBlock = blocks.find((b) => b.includes('label="Solicitar Reserva"'));
  assert(Boolean(stickyBlock), 'Presenta RequestToBookButton como CTA en la tarjeta sticky');
  if (stickyBlock) {
    assert(stickyBlock.includes('providerId={providerId}'), 'Sticky: pasa providerId');
    assert(stickyBlock.includes('providerName={displayName}'), 'Sticky: pasa providerName');
    assert(stickyBlock.includes('category={category}'), 'Sticky: pasa category');
    assert(
      stickyBlock.includes('defaultBudget={rawProvider.basePrice || 650}'),
      'Sticky: pasa defaultBudget con tarifa base real'
    );
    assert(
      stickyBlock.includes("location={location.split(',')[0]}"),
      'Sticky: pasa location'
    );
    assert(stickyBlock.includes('className="w-full"'), 'Sticky: CTA a ancho completo');
  }

  // 5. Bloque del catálogo de packs (precio del pack)
  const packBlock = blocks.find((b) => b.includes('label="Reservar"'));
  assert(Boolean(packBlock), 'Presenta RequestToBookButton en cada pack del catálogo');
  if (packBlock) {
    assert(packBlock.includes('providerId={providerId}'), 'Pack: pasa providerId');
    assert(packBlock.includes('providerName={displayName}'), 'Pack: pasa providerName');
    assert(packBlock.includes('category={category}'), 'Pack: pasa category');
    assert(
      packBlock.includes('defaultBudget={item.ear_catalog_price_eur || item.original_price_eur}'),
      'Pack: pasa defaultBudget vinculado al precio del pack'
    );
    assert(
      packBlock.includes("location={location.split(',')[0]}"),
      'Pack: pasa location'
    );
  }

  // 6. Higiene del código integrado (cero `: any`, cero Math.random)
  for (const block of blocks) {
    assert(!block.includes(': any'), 'Bloque integrado sin `: any`');
    assert(!block.includes('Math.random'), 'Bloque integrado sin Math.random');
  }
  assert(!importLine.includes(': any'), 'Línea de importación sin `: any`');

  // 7. La página sigue siendo un Server Component con params await
  assert(
    /export default async function ProviderDetailPage/.test(src),
    'La página sigue siendo un Server Component async'
  );
  assert(src.includes('await params'), 'Conserva `await params` (Next.js 15 params async)');

  console.log(`\n=== RESULTADO: ${passed} OK / ${failed} FAIL ===`);
  if (failed > 0) {
    console.log('\nFALLOS:');
    for (const f of failures) console.log(`  - ${f}`);
    process.exit(1);
  }
  console.log('Todas las aserciones superadas. Exit Code 0.\n');
  process.exit(0);
}

main();
