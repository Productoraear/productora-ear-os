/**
 * 🧪 VERIFICACIÓN DEL AISLAMIENTO DE CATÁLOGO (DIRECTIVA CEO)
 * ============================================================================
 * Regla: Edwin Agudelo es Paciente Cero de la vertical MÚSICA. Si la categoría
 * seleccionada no es música (finca, catering, floristería, transporte...), su
 * casilla JAMÁS puede renderizarse en el simulador de presupuesto.
 *
 * Uso: node ./node_modules/tsx/dist/cli.mjs scripts/verify_catalog_isolation.ts
 * ============================================================================
 */

import {
  selectVisibleServices,
  isMusicCategory,
  type EventServicePill,
} from '../src/components/checkout/SovereignCollectiveEventBuilder';

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

const ARTISTA: EventServicePill = {
  id: 'edwin-agudelo-solista',
  category: 'artista',
  title: 'Edwin Agudelo',
  providerName: 'Edwin Agudelo (Tenor)',
  description: 'Show solista',
  priceEur: 550,
  horquilla: '550,00 €',
};

const FINCA: EventServicePill = {
  id: 'finca-ezkertza-berria',
  category: 'finca',
  title: 'Finca Ezkertza',
  providerName: 'Ezkertza Berria',
  description: 'Finca',
  priceEur: 1200,
  horquilla: '1.000 € - 2.500 €',
};

const CATERING: EventServicePill = {
  id: 'catering-brasa-eduardo',
  category: 'catering_gastronomia',
  title: 'Brasa de Encina',
  providerName: 'Eduardo Martínez',
  description: 'Catering',
  priceEur: 2400,
  horquilla: '100 € - 173 € / pax',
};

const CATALOG: EventServicePill[] = [FINCA, ARTISTA, CATERING];

console.log('── 1. isMusicCategory ──');
{
  check('artista es música', isMusicCategory('artista') === true);
  check('finca NO es música', isMusicCategory('finca') === false);
  check('catering NO es música', isMusicCategory('catering_gastronomia') === false);
  check('ALL no es música', isMusicCategory('ALL') === false);
  check('null no es música', isMusicCategory(null) === false);
}

console.log('── 2. Aislamiento: Edwin NUNCA fuera de música ──');
{
  for (const cat of ['finca', 'catering_gastronomia', 'flores_decoracion', 'autobus_transporte', 'ALL'] as const) {
    const visible = selectVisibleServices(CATALOG, cat);
    const hasEdwin = visible.some((s) => s.id === 'edwin-agudelo-solista');
    check(`categoría ${cat}: Edwin ausente`, hasEdwin === false, `visible=${visible.length}`);
  }

  const music = selectVisibleServices(CATALOG, 'artista');
  check('categoría artista: Edwin presente', music.some((s) => s.id === 'edwin-agudelo-solista'));
  check('categoría artista: solo artistas', music.every((s) => s.category === 'artista'), `n=${music.length}`);
}

console.log('── 3. Filtrado por categoría concreta ──');
{
  const fincas = selectVisibleServices(CATALOG, 'finca');
  check('finca: solo casillas de finca', fincas.every((s) => s.category === 'finca'), `n=${fincas.length}`);

  const catering = selectVisibleServices(CATALOG, 'catering_gastronomia');
  check('catering: solo casillas de catering', catering.every((s) => s.category === 'catering_gastronomia'));

  const all = selectVisibleServices(CATALOG, null);
  check('sin categoría: catálogo completo', all.length === CATALOG.length, `${all.length}`);
}

console.log('');
console.log(`RESULTADO: ${passed} PASS · ${failures.length} FAIL`);
if (failures.length > 0) {
  for (const f of failures) console.error(`   FAIL ${f}`);
  process.exit(1);
}
console.log('OK: Aislamiento de catálogo conforme a la directiva del CEO.');
process.exit(0);
