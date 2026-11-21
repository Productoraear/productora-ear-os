/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE — VIAJE DEL CLIENTE (PAREJA DECIDIDA)
 * ════════════════════════════════════════════════════════════════════════════
 * Demuestra, contra el CATÁLOGO REAL en disco (`public/data/providers/finca*`),
 * que el motor `src/lib/journey/couple-journey-engine.ts`:
 *
 *   1. NO inventa precios: los que devuelve existen en el dataset (AF-2).
 *   2. Filtra de verdad por provincia (antes el filtro era decorativo).
 *   3. Nunca etiqueta TU_FINCA por debajo de 80 % de encaje.
 *   4. Elimina el «45 % de cortesía»: sin criterios evaluables la nota es 0.
 *   5. Declara lo que NO puede demostrar (deseos no verificables).
 *   6. El mensaje de traspaso lleva el brief completo.
 *   7. Usa el depósito canónico del SSOT (INV-03), nunca un 30 % inventado.
 *   8. Es determinista (mismo brief ⇒ mismo resultado, sin Math.random).
 *
 * Uso:    node scripts/verify_couple_journey.cjs
 * Salida: Exit Code 0 si TODAS las aserciones pasan; 1 si alguna falla.
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const ENGINE_TS = path.join(ROOT, 'src', 'lib', 'journey', 'couple-journey-engine.ts');
const SSOT_TS = path.join(ROOT, 'src', 'lib', 'constants', 'ear-os-ssot.ts');
const DATA_DIR = path.join(ROOT, 'public', 'data', 'providers');

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

/** Carga el catálogo real de fincas desde los chunks del manifest. */
function loadRealFincas() {
  const manifest = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'manifest.json'), 'utf8'));
  const entry = manifest.finca;
  const chunks =
    Array.isArray(entry && entry.chunks) && entry.chunks.length > 0 ? entry.chunks : ['finca.json'];

  const venues = [];
  for (const chunk of chunks) {
    const file = path.join(DATA_DIR, chunk);
    if (!fs.existsSync(file)) continue;
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (Array.isArray(parsed)) venues.push(...parsed);
  }
  return venues;
}

/**
 * Invoca el motor TypeScript real con un brief JSON y devuelve la evaluación.
 * Se ejecuta vía `tsx` para que el arnés pruebe el MISMO código que la web
 * (cero reimplementaciones paralelas que puedan divergir).
 */
function runEngine(brief, venues, limit) {
  const enginePath = ENGINE_TS.replace(/\\/g, '/');
  const runner = [
    "import { evaluateJourney, buildAdvisorMessage } from '" + enginePath + "';",
    'const payload = JSON.parse(process.env.JOURNEY_PAYLOAD);',
    'const result = evaluateJourney(payload.venues, payload.brief, payload.limit);',
    'const selected = result.results.length > 0 ? result.results[0] : null;',
    'const out = {',
    '  scores: result.results.map((r) => r.score),',
    '  slugs: result.results.map((r) => r.slug),',
    '  provinces: result.results.map((r) => r.province),',
    '  reasons: result.results.map((r) => r.matched.map((m) => m.code)),',
    '  prices: result.results.map((r) => r.price),',
    '  tiers: result.results.map((r) => r.tier),',
    '  disclosures: result.disclosures,',
    '  unevaluated: result.unevaluatedWishes,',
    '  depositEur: result.depositEur,',
    '  totalPool: result.totalPool,',
    '  message: buildAdvisorMessage(result, selected),',
    '  selected: selected ? { name: selected.name, slug: selected.slug } : null,',
    '};',
    "process.stdout.write('JOURNEY_RESULT:' + JSON.stringify(out));",
  ].join('\n');

  const raw = execFileSync(
    process.execPath,
    [path.join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs'), '--eval', runner],
    {
      cwd: ROOT,
      env: { ...process.env, JOURNEY_PAYLOAD: JSON.stringify({ brief, venues, limit }) },
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  const marker = 'JOURNEY_RESULT:';
  const index = raw.lastIndexOf(marker);
  if (index === -1) {
    throw new Error('El motor no devolvió resultado parseable:\n' + raw.slice(0, 2000));
  }
  return JSON.parse(raw.slice(index + marker.length).trim());
}

function main() {
  console.log('\n=== ARNÉS: VIAJE DEL CLIENTE · PAREJA DECIDIDA (EAR OS) ===\n');

  assert(fs.existsSync(ENGINE_TS), 'El motor existe en disco');
  assert(fs.existsSync(SSOT_TS), 'El SSOT canónico existe en disco');
  assert(fs.existsSync(DATA_DIR), 'El Data Lake de proveedores existe en disco');

  const engineSrc = fs.readFileSync(ENGINE_TS, 'utf8');
  const ssotSrc = fs.readFileSync(SSOT_TS, 'utf8');
  const codeOnly = engineSrc.replace(/\/\*[\s\S]*?\*\//g, '');

  // ── Higiene del código (SEC / INV) ────────────────────────────────────────
  assert(!/Math\.random/.test(engineSrc), 'Motor determinista (sin Math.random)');
  assert(!/\bfs\b/.test(codeOnly), 'Capa pura: sin fs');
  assert(!/from ['"]node:/.test(engineSrc), 'Capa pura: sin node:*');
  assert(!/:\s*any\b/.test(engineSrc), 'Sin `any` explícito');
  assert(/DEPOSITO_STRIPE_EUR/.test(engineSrc), 'Importa el depósito del SSOT (INV-03)');
  assert(
    /export const DEPOSITO_STRIPE_EUR: number = 100/.test(ssotSrc),
    'SSOT declara el depósito canónico de 100 EUR',
  );

  const venues = loadRealFincas();
  console.log(`\n  · Catálogo real cargado: ${venues.length} fincas\n`);
  assert(venues.length > 1000, `Catálogo real con volumen suficiente (${venues.length} fincas)`);

  const realPrices = venues
    .map((v) => (typeof v.price_eur === 'number' && v.price_eur > 0 ? v.price_eur : null))
    .filter((v) => v !== null);

  // ── Escenario: pareja decidida que apenas empieza a buscar ────────────────
  const brief = {
    province: 'Madrid',
    date: '2027-06-19',
    guests: 120,
    budgetEur: 18000,
    wishes: ['EXCLUSIVITY', 'GARDENS', 'CIVIL_CEREMONY', 'ACCOMMODATION', 'ALL_NIGHT'],
    styleNote: 'Boda de día, ceremonia al aire libre, baile hasta tarde.',
  };

  const first = runEngine(brief, venues, 6);
  const second = runEngine(brief, venues, 6);

  // ── 1. Determinismo ───────────────────────────────────────────────────────
  assert(
    JSON.stringify(first.slugs) === JSON.stringify(second.slugs),
    'Determinista: el mismo brief devuelve las mismas fincas',
  );

  // ── 2. Resultados reales y ordenados ──────────────────────────────────────
  assert(first.totalPool === venues.length, `Evalúa el catálogo completo (${first.totalPool})`);
  assert(first.slugs.length > 0, `Devuelve alternativas (${first.slugs.length})`);
  const sortedDesc = first.scores.every((s, i) => i === 0 || first.scores[i - 1] >= s);
  assert(sortedDesc, `Ordenadas por encaje descendente (${first.scores.join(', ')})`);

  // ── 3. Los resultados existen de verdad en el dataset ─────────────────────
  const realSlugs = new Set(
    venues.map((v) => String(v.slug !== null && v.slug !== undefined ? v.slug : v.id)),
  );
  assert(
    first.slugs.every((slug) => realSlugs.has(slug)),
    'Todas las fincas devueltas existen en el catálogo real (cero invención)',
  );

  // ── 4. CERO precios inventados (AF-2) ─────────────────────────────────────
  const pricesTruthful = first.prices.every(
    (price) =>
      price.source === 'UNKNOWN' ||
      (price.source === 'DATASET' && realPrices.indexOf(price.eur) !== -1),
  );
  assert(pricesTruthful, 'Ningún precio devuelto es inventado: todos constan en el dataset');

  // ── 5. Filtro de provincia REAL (antes era decorativo) ────────────────────
  const topProvince = first.provinces.length > 0 ? first.provinces[0] : '';
  assert(
    /madrid|^m$|^md$/i.test(topProvince),
    `La primera alternativa es de Madrid (recibido: ${topProvince})`,
  );

  // ── 6. Etiquetas honestas ─────────────────────────────────────────────────
  const badTier = first.tiers.some((tier, i) => tier === 'TU_FINCA' && first.scores[i] < 80);
  assert(!badTier, 'Ningún resultado con encaje < 80 % se etiqueta TU_FINCA');

  // ── 6b. La nota DISCRIMINA (no está saturada al 100 %) ────────────────────
  // Se evalúa el pool completo de una provincia real para comprobar que el
  // motor produce más de un nivel de encaje. Un motor que devuelve 100 % a
  // todo el catálogo es una fachada, igual que el antiguo suelo del 45 %.
  const poolBrief = { ...brief, province: 'Madrid' };
  const pool = runEngine(poolBrief, venues.filter((v) => /madrid/i.test(String(v.province || ''))), 200);
  const distinctScores = new Set(pool.scores).size;
  assert(
    distinctScores >= 3,
    `El encaje discrimina de verdad: ${distinctScores} niveles distintos sobre el pool completo`,
  );
  assert(
    pool.scores.some((s) => s < 95),
    'Existen fincas por debajo del 95 % (la nota no es un adorno)',
  );
  assert(
    pool.disclosures.some((d) => /empatan al/i.test(d)),
    'Declara el empate del primer puesto en vez de inventar un orden',
  );

  // ── 6c. El municipio DESEMPATA cuando la pareja lo declara ────────────────
  // Realidad medida del Data Lake: las 14 fincas que encabezan el ranking no
  // publican precio ni valoración y comparten `services_list`. El ÚNICO dato
  // que las distingue es el municipio (11 distintos). Por eso el municipio no
  // puede expresarse como subida de nota (ya están al 100 %): se expresa como
  // motivo declarado + bono acotado. Se comprueba la evidencia, no la nota.
  const madridPool = venues.filter((v) => /madrid/i.test(String(v.province || '')));
  const withoutZone = runEngine({ ...poolBrief, locality: null }, madridPool, 200);
  const withZone = runEngine({ ...poolBrief, locality: 'El Escorial' }, madridPool, 200);

  const escorial = madridPool.filter((v) => /escorial/i.test(String(v.municipality || '')));
  assert(escorial.length > 0, `Existe al menos una finca en El Escorial (${escorial.length})`);
  const firstEscorial = String(escorial[0].slug ?? escorial[0].id);
  assert(
    withZone.slugs[0] === firstEscorial,
    'La finca del pueblo declarado pasa al primer puesto',
  );

  // El motivo LOCALITY debe aparecer SÓLO cuando la pareja declara la zona.
  const reasonsOf = (run, slug) => run.reasons[run.slugs.indexOf(slug)] || [];
  assert(
    reasonsOf(withZone, firstEscorial).includes('LOCALITY'),
    'La finca de El Escorial declara el motivo LOCALITY cuando se pide esa zona',
  );
  assert(
    !reasonsOf(withoutZone, firstEscorial).includes('LOCALITY'),
    'Sin zona declarada NO se inventa el motivo LOCALITY',
  );

  // Bono acotado: ninguna nota puede superar 100.
  assert(
    withZone.scores.every((s) => s <= 100 && s >= 0),
    'Ninguna puntuación sale del rango 0-100 (bono acotado)',
  );

  assert(
    withoutZone.message.indexOf('Zona preferida') === -1 &&
      withZone.message.includes('Zona preferida: El Escorial'),
    'El mensaje al asesor incluye la zona preferida sólo cuando se declara',
  );

  // ── 7. Transparencia: declara lo que no puede verificar ───────────────────
  assert(
    first.unevaluated.indexOf('ALL_NIGHT') !== -1,
    'Declara ALL_NIGHT como deseo NO verificable (no lo finge)',
  );
  assert(
    first.disclosures.some((d) => /no publica/i.test(d)),
    'Publica un aviso explícito de lo que el catálogo no demuestra',
  );

  // ── 8. Anti-fachada: sin criterios evaluables, la nota es 0 ───────────────
  const bare = runEngine(
    { province: null, date: null, guests: 100, budgetEur: 0, wishes: [] },
    [{ id: 'x1', name: 'Sin datos', province: null }],
    3,
  );
  assert(
    bare.slugs.length === 0,
    'Un proveedor sin ningún criterio evaluable NO se presenta (fin del 45 % de cortesía)',
  );

  // ── 9. El mensaje de traspaso lleva el BRIEF completo ─────────────────────
  const msg = first.message;
  assert(/Madrid/.test(msg), 'El mensaje al asesor incluye la provincia');
  assert(/19\/06\/2027/.test(msg), 'El mensaje al asesor incluye la fecha en formato es-ES');
  assert(/120/.test(msg), 'El mensaje al asesor incluye los comensales');
  assert(/18\.000|18 000|18000/.test(msg), 'El mensaje al asesor incluye el presupuesto');
  assert(/Exclusividad del espacio/.test(msg), 'El mensaje al asesor incluye los deseos');
  assert(
    first.selected !== null && msg.indexOf(first.selected.name) !== -1,
    'El mensaje al asesor incluye la finca elegida por nombre',
  );

  // ── 10. Depósito canónico (INV-03), nunca un 30 % inventado ──────────────
  assert(first.depositEur === 100, `Depósito canónico de 100 EUR (recibido: ${first.depositEur})`);
  assert(/100/.test(msg), 'El mensaje declara el depósito de 100 EUR');
  assert(!/30\s*%/.test(msg), 'El mensaje NO promete un 30 % de depósito (regla INV-03)');

  console.log('\n  Finca elegida: ' + (first.selected ? first.selected.name : 'ninguna'));
  console.log('  Encaje: ' + first.scores.join(' %, ') + ' %');
  console.log('\n=== RESULTADO: ' + passed + ' OK / ' + failed + ' FAIL ===');
  if (failed > 0) {
    console.log('\nFALLOS:');
    for (const f of failures) console.log('  - ' + f);
    process.exit(1);
  }
  console.log('Todas las aserciones superadas. Exit Code 0.\n');
  process.exit(0);
}

main();
