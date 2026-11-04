/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN DE LA GUÍA MAESTRA DEL COMPILADOR (S-CLASS · Ω-DIAMANTE)
 * ════════════════════════════════════════════════════════════════════════════
 * Objetivo: que la Guía Maestra NUNCA vuelva a ser decoración. Esta batería
 * demuestra, con aserciones ejecutables, que la táctica elegida cambia el grafo.
 *
 * Aserciones (todas obligatorias):
 *  1. Inventario cerrado: 4 objetivos · 4 tácticas · 3 destinatarios.
 *  2. Cada eje tiene directivas ejecutables y alias de deducción.
 *  3. Cero anglicismos ni marcas de terceros en los rótulos de la guía (JUR-4).
 *  4. Deducción correcta desde texto libre, incluida tolerancia a acentos.
 *  5. El eje declarado manda sobre el deducido; un eje inválido cae a defecto.
 *  6. Antifachada: las 4 tácticas producen 4 grafos distintos y cada uno lleva
 *     su identificador y su primera directiva dentro del YAML.
 *  7. Las restricciones de gobierno son las del SSOT (0 Netlify, 0 cifras a mano).
 *  8. Contrato de cola respetado: action ≤ 2000, scaffold ≤ 8000, done_when ≤ 500.
 *  9. Entradas hostiles no lanzan.
 * 10. Cableado estático: endpoint con esquema cerrado, pantalla sin el nombre
 *     antiguo, navegación sin el rótulo obsoleto.
 *
 * Ejecución: npm run verify:master-guide
 * Exit 0 = VERIFICADO · Exit 1 = al menos una aserción falla.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

import {
  DEFAULT_MASTER_GUIDE,
  MASTER_OBJECTIVES,
  MASTER_TACTICS,
  MASTER_TARGETS,
  resolveMasterGuide,
} from '../src/lib/compiler/master-guide';
import { compileIntentToDAG } from '../src/lib/compiler/omega-intent-compiler';
import type { MasterTacticId } from '../src/lib/compiler/master-guide';

const failures: string[] = [];
const rows: Array<{ case: string; ok: boolean; note: string }> = [];

function check(name: string, ok: boolean, note: string): void {
  rows.push({ case: name, ok, note });
  if (!ok) failures.push(`${name}: ${note}`);
}

/** Huella estable del grafo: se ignora el sello de tiempo de cada tirada. */
function fingerprint(yaml: string): string {
  const stable = yaml
    .split('\n')
    .filter((line) => !line.startsWith('# TIMESTAMP_UTC'))
    .join('\n');
  return createHash('sha256').update(stable, 'utf8').digest('hex').slice(0, 16);
}

/** Términos prohibidos en los rótulos visibles: anglicismos y marcas ajenas. */
const BANNED_LABEL_TERMS = [
  'meta-compiler',
  'metacompiler',
  'velocidad media',
  'velocity',
  'hurtado',
  'claude',
  'openai',
  'gpt',
  'vibe',
  'bare-metal',
  'venues',
  'pre-landings',
];

/** Términos prohibidos en la pantalla del compilador (nombre antiguo incluido). */
const BANNED_PAGE_TERMS = [
  'Meta-Compiler',
  'META-COMPILADOR',
  'Meta-Compilador',
  'Velocity Media',
  'Claude Opus',
  'Pre-landings',
  'Venues',
  'Bare-Metal',
  'Vibe Coding',
];

// ────────────────────────────────────────────────────────────────────────────
// 1-3 · Inventario, directivas y pureza de los rótulos
// ────────────────────────────────────────────────────────────────────────────
check(
  'Inventario de la guía',
  MASTER_OBJECTIVES.length === 4 && MASTER_TACTICS.length === 4 && MASTER_TARGETS.length === 3,
  `${MASTER_OBJECTIVES.length} objetivos · ${MASTER_TACTICS.length} tácticas · ${MASTER_TARGETS.length} destinatarios`,
);

const axes = [
  ...MASTER_OBJECTIVES.map((item) => ({ id: item.id, directives: item.directives.length, aliases: item.aliases.length })),
  ...MASTER_TACTICS.map((item) => ({ id: item.id, directives: item.directives.length, aliases: item.aliases.length })),
  ...MASTER_TARGETS.map((item) => ({ id: item.id, directives: item.directives.length, aliases: item.aliases.length })),
];
const starved = axes.filter((axis) => axis.directives < 2 || axis.aliases < 1).map((axis) => axis.id);
check('Cada eje tiene 2+ directivas y 1+ alias', starved.length === 0, starved.join(',') || 'completo');

const guideText = [
  ...MASTER_OBJECTIVES.map((item) => `${item.label} ${item.hint} ${item.directives.join(' ')}`),
  ...MASTER_TACTICS.map((item) => `${item.label} ${item.hint} ${item.directives.join(' ')}`),
  ...MASTER_TARGETS.map((item) => `${item.label} ${item.hint} ${item.deliverable} ${item.directives.join(' ')}`),
].join(' ').toLowerCase();
const labelHits = BANNED_LABEL_TERMS.filter((term) => guideText.includes(term));
check('Rótulos sin anglicismos ni marcas de terceros', labelHits.length === 0, labelHits.join(',') || 'limpio');

// ────────────────────────────────────────────────────────────────────────────
// 4-5 · Deducción de ejes desde texto libre
// ────────────────────────────────────────────────────────────────────────────
const vectors: Array<{ text: string; objective: string; tactic: string }> = [
  { text: 'Llenar el calendario con sobredemanda en bodas de fincas de Guipúzcoa', objective: 'FINCAS', tactic: 'SOBREDEMANDA' },
  { text: 'Tramitar un contrato menor para el ayuntamiento con techo de 14250', objective: 'B2G', tactic: DEFAULT_MASTER_GUIDE.tactic },
  { text: 'Cerrar la deuda tecnica del typecheck y las fachadas', objective: 'ARQUITECTURA', tactic: DEFAULT_MASTER_GUIDE.tactic },
  { text: 'Estrategia de venta elegante con DIAGNÓSTICO para el cliente indeciso', objective: DEFAULT_MASTER_GUIDE.objective, tactic: 'VENTA_ELEGANTE' },
  { text: 'Defender el margen y el reparto 80/10/10 sin regalar comision', objective: DEFAULT_MASTER_GUIDE.objective, tactic: 'MIDAS_SPLIT' },
  { text: 'Crear landings por municipio y provincia con seo local', objective: DEFAULT_MASTER_GUIDE.objective, tactic: 'CAMALEON_GEO' },
];

for (const vector of vectors) {
  const resolved = resolveMasterGuide({}, vector.text);
  check(
    `Deducción «${vector.text.slice(0, 40)}»`,
    resolved.objective.id === vector.objective && resolved.tactic.id === vector.tactic,
    `${resolved.objective.id}/${resolved.tactic.id} (esperado ${vector.objective}/${vector.tactic}) · origen ${resolved.sources.objective}/${resolved.sources.tactic}`,
  );
}

const declaredWins = resolveMasterGuide({ tactic: 'MIDAS_SPLIT' }, 'sobredemanda total en bodas');
check(
  'El eje declarado manda sobre el deducido',
  declaredWins.tactic.id === 'MIDAS_SPLIT' && declaredWins.sources.tactic === 'declarado',
  `${declaredWins.tactic.id}/${declaredWins.sources.tactic}`,
);

const invalidAxis = resolveMasterGuide({ tactic: 'HACK_THE_PLANET' }, '');
check(
  'Un eje inválido cae al defecto declarado',
  invalidAxis.tactic.id === DEFAULT_MASTER_GUIDE.tactic && invalidAxis.sources.tactic === 'defecto',
  `${invalidAxis.tactic.id}/${invalidAxis.sources.tactic}`,
);

// ────────────────────────────────────────────────────────────────────────────
// 6-8 · Antifachada: la táctica cambia el grafo · gobierno SSOT · contrato
// ────────────────────────────────────────────────────────────────────────────
async function verifyCompiledGraph(): Promise<void> {
  const intent = 'Lanzar la campaña de captación de fincas y bodas en Toledo';
  const pairs: Array<{ tactic: MasterTacticId; result: Awaited<ReturnType<typeof compileIntentToDAG>> }> = [];

  for (const tactic of MASTER_TACTICS) {
    const result = await compileIntentToDAG(intent, {
      mode: 'OMEGA_FULLSTACK',
      engine: 'CLOUD',
      skipOllamaArchitect: true,
      objective: 'FINCAS',
      tactic: tactic.id,
      targetAgent: 'CLINE',
      sourceIntent: intent,
    });
    pairs.push({ tactic: tactic.id, result });
  }

  const prints = new Set(pairs.map((pair) => fingerprint(pair.result.yaml)));
  check(
    'Las 4 tácticas producen 4 grafos distintos',
    prints.size === MASTER_TACTICS.length,
    `${prints.size} huellas distintas de ${MASTER_TACTICS.length}`,
  );

  for (const pair of pairs) {
    const directive = MASTER_TACTICS.find((item) => item.id === pair.tactic)?.directives[0] ?? '';
    const stamped = pair.result.yaml.includes(`GUIA_TACTICA: "${pair.tactic}"`);
    const inYaml = directive.length > 0 && pair.result.yaml.includes(directive);
    const inScaffold = directive.length > 0 && pair.result.jsonTask.scaffold.includes(directive);
    check(
      `Grafo gobernado por la táctica ${pair.tactic}`,
      stamped && inYaml && inScaffold && pair.result.guide.tactic === pair.tactic,
      `sello=${stamped} yaml=${inYaml} scaffold=${inScaffold}`,
    );
  }

  const allYaml = pairs.map((pair) => pair.result.yaml).join('\n');
  check(
    'Gobierno derivado del SSOT (Coolify, 0 Netlify como destino)',
    !allYaml.includes('Build Netlify') && allYaml.includes('Coolify') && allYaml.includes('Split Soberano'),
    allYaml.includes('Build Netlify') ? 'conserva «Build Netlify»' : 'Coolify presente y split derivado',
  );

  const contractOk = pairs.every((pair) => {
    const task = pair.result.jsonTask;
    return task.title.length <= 240
      && task.action.length <= 2000
      && task.description.length <= 2000
      && task.scaffold.length <= 8000
      && task.done_when.length <= 500
      && task.validation.length <= 500;
  });
  const sizes = pairs
    .map((pair) => `${pair.tactic}:${pair.result.jsonTask.action.length}/${pair.result.jsonTask.scaffold.length}/${pair.result.jsonTask.done_when.length}`)
    .join(' ');
  check('Contrato de la cola respetado (action/scaffold/done_when)', contractOk, sizes);

  const huge = await compileIntentToDAG('x'.repeat(20000), {
    mode: 'OMEGA_FULLSTACK',
    engine: 'CLOUD',
    skipOllamaArchitect: true,
    objective: 'ARQUITECTURA',
    tactic: 'MIDAS_SPLIT',
    targetAgent: 'CLINE',
    sourceIntent: 'y'.repeat(20000),
    masterPromptOverride: 'z'.repeat(20000),
  });
  check(
    'Una orden de 20.000 caracteres no rompe el contrato de la cola',
    huge.jsonTask.action.length <= 2000 && huge.jsonTask.scaffold.length <= 8000 && huge.jsonTask.done_when.length <= 500,
    `action=${huge.jsonTask.action.length} scaffold=${huge.jsonTask.scaffold.length} done_when=${huge.jsonTask.done_when.length}`,
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 10 · Cableado estático: endpoint cerrado, pantalla limpia, navegación honesta
// ────────────────────────────────────────────────────────────────────────────
function verifyWiring(): void {
  const routeSource = readFileSync(join(process.cwd(), 'src/app/api/admin/compile-intent/route.ts'), 'utf8');
  check(
    'El endpoint valida los tres ejes con esquema cerrado',
    routeSource.includes('z.enum(MASTER_OBJECTIVE_IDS)')
      && routeSource.includes('z.enum(MASTER_TACTIC_IDS)')
      && routeSource.includes('z.enum(MASTER_TARGET_IDS)'),
    'objetivo/táctica/destinatario',
  );
  check(
    'El endpoint resuelve la guía en el servidor',
    routeSource.includes('resolveMasterGuide('),
    'sin resolución en servidor',
  );

  const pageSource = readFileSync(join(process.cwd(), 'src/app/(admin)/admin/compiler/page.tsx'), 'utf8');
  const pageHits = BANNED_PAGE_TERMS.filter((term) => pageSource.includes(term));
  check(
    'La pantalla no muestra el nombre antiguo ni marcas de terceros',
    pageHits.length === 0,
    pageHits.join(',') || 'limpio',
  );
  const usesSsot = ['MASTER_OBJECTIVES.map(', 'MASTER_TACTICS.map(', 'MASTER_TARGETS.map('].every((token) =>
    pageSource.includes(token),
  );
  check('La pantalla consume el SSOT de la guía', usesSsot, usesSsot ? 'sin duplicar selectores' : 'quedan selectores locales');
  check(
    'La pantalla envía los ejes como campos validados',
    pageSource.includes('objective: selectedObjective')
      && pageSource.includes('tactic: selectedTactic')
      && pageSource.includes('targetAgent: selectedTargetAgent'),
    'envío en texto libre',
  );

  const navSource = readFileSync(join(process.cwd(), 'src/lib/config/admin-navigation.ts'), 'utf8');
  check('La navegación no usa el rótulo antiguo', !navSource.includes('Meta-Compiler'), 'rótulo obsoleto en el cockpit');
}

async function main(): Promise<void> {
  await verifyCompiledGraph();
  verifyWiring();

  const summary = {
    verdict: failures.length === 0 ? 'VERIFICADO' : 'FALLIDO',
    cases: rows.length,
    passed: rows.filter((row) => row.ok).length,
    failed: failures.length,
    rows,
    failures,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (failures.length > 0) {
    console.error(`[verify:master-guide] ${failures.length} aserción(es) fallida(s).`);
    process.exitCode = 1;
    return;
  }
  console.log(`[verify:master-guide] VERIFICADO · ${rows.length}/${rows.length} casos. Exit 0.`);
}

void main();



