#!/usr/bin/env node
'use strict';

/**
 * VERIFICADOR — Bóveda de Canciones Prohibidas (W27_T03)
 * Valida presencia de lista de canciones, filtro de coincidencia, generador QR/SVG,
 * exports y cero `any` en el componente y la página.
 * Exit Code 1 en caso de cualquier fallo.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const COMPONENT_PATH = path.join(ROOT, 'src', 'components', 'music', 'ProhibitedSongsVault.tsx');
const PAGE_PATH = path.join(ROOT, 'src', 'app', '(public)', 'musica', 'canciones-prohibidas', 'page.tsx');

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}

const component = read(COMPONENT_PATH);
const page = read(PAGE_PATH);

let passed = 0;
let failed = 0;

function assert(name, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ✔ ${name}`);
  } else {
    failed += 1;
    console.error(`  ✘ ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

function containsAny(source) {
  return /:\s*any\b/.test(source) || /\bas\s+any\b/.test(source) || /<any>/.test(source);
}

console.log('VERIFICADOR — BÓVEDA DE CANCIONES PROHIBIDAS');
console.log('=============================================');

// 1. Presencia de archivos
assert('1. Componente ProhibitedSongsVault.tsx existe', component.length > 0);
assert('2. Página canciones-prohibidas/page.tsx existe', page.length > 0);

// 2. Directiva client
assert("3. Componente declara 'use client'", component.includes("'use client'"));

// 3. Lista canónica de canciones
assert('4. Contiene lista canónica CANONICAL_SONGS', component.includes('CANONICAL_SONGS'));
assert('5. Contiene "La Macarena"', component.includes('Macarena'));
assert('6. Contiene "Despacito"', component.includes('Despacito'));
assert('7. Contiene "Aserejé"', component.includes('Aserejé'));
assert('8. Contiene "Paquito el Chocolatero"', component.includes('Paquito el Chocolatero'));

const altCount = (component.match(/alternative:\s*'/g) || []).length;
assert('9. Lista con al menos 15 temas (alternativas de gala)', altCount >= 15, `alternativas: ${altCount}`);

// 4. Filtro de coincidencia
assert(
  '10. Filtro de coincidencia (normalize + findProhibitedMatch)',
  component.includes('normalize') && component.includes('findProhibitedMatch'),
);

// 5. Generador QR/SVG
assert(
  '11. Generador QR/SVG (qrcode create + <svg>)',
  component.includes('create') && component.includes('<svg'),
);

// 6. Recomendación alternativa
assert(
  '12. Recomendación de alternativa de gala',
  component.includes('alternative') && component.includes('GALA_SAFE_FALLBACK'),
);

// 7. Descarga e impresión del QR
assert(
  '13. Botones de descarga e impresión de QR',
  component.includes('Descargar QR') && component.includes('Imprimir QR'),
);

// 8. Cero `any`
assert('14. Componente sin ": any"', !containsAny(component));

// 9. Exports
assert('15. Componente con export default', component.includes('export default'));

// 10. SEO de la página
assert('16. Página con export const metadata', page.includes('export const metadata'));
assert('17. Título SEO "Bóveda de Canciones Prohibidas"', page.includes('Bóveda de Canciones Prohibidas'));
assert(
  '18. Schema.org JSON-LD presente',
  page.includes('schema.org') && page.includes('application/ld+json'),
);

// 11. Renderizado
assert('19. Página renderiza <ProhibitedSongsVault />', page.includes('<ProhibitedSongsVault'));
assert('20. Página incluye Hero', page.includes('Hero') || page.includes('hero'));

// 12. Cero `any` en página y export default
assert('21. Página sin ": any"', !containsAny(page));
assert('22. Página con export default', page.includes('export default'));

console.log('=============================================');
console.log(`RESULTADO: ${passed} aserciones superadas, ${failed} fallidas.`);

if (failed > 0) {
  process.exit(1);
}
process.exit(0);
