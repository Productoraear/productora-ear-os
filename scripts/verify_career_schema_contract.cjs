/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONTRATO EJECUTABLE · W53_T01 CAREER OS (Prisma schema + helpers tipados)
 * ════════════════════════════════════════════════════════════════════════════
 * Cierra el hueco de "done_when: prisma validate Exit 0 y tsc Exit 0", que no se
 * ejecutaba en ninguna puerta: `test` solo invocaba tsc y jamás validaba el schema.
 *
 * Puertas:
 *   1. `prisma validate` (motor real, no parseo casero) → Exit 0.
 *   2. Los 13 modelos del contrato existen en prisma/schema.prisma.
 *   3. `prisma generate` produjo @prisma/client utilizable.
 *   4. tsc --noEmit sobre src/lib/career/** → Exit 0 (si existe código career).
 *
 * Uso:
 *   node scripts/verify_career_schema_contract.cjs
 *
 * Exit codes: 0 = contrato cumplido · 1 = contrato incumplido · 2 = entorno ilegible.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const SCHEMA = path.join(ROOT, 'prisma', 'schema.prisma');

/** Modelos exigidos por el contrato W53_T01 (action del slot en tasks_queue.json). */
const REQUIRED_MODELS = [
  'ArtistProfile',
  'PlatformConnection',
  'MetricSnapshot',
  'Release',
  'Track',
  'MediaAsset',
  'TeamMember',
  'Gig',
  'Contract',
  'RoyaltyStatement',
  'Campaign',
  'FanContact',
  'ContentPost',
];

const results = [];

function run(label, command, args, options = {}) {
  const res = spawnSync(command, args, {
    cwd: ROOT,
    shell: false,
    encoding: 'utf8',
    timeout: options.timeout ?? 180000,
    env: { ...process.env, PRISMA_HIDE_UPDATE_MESSAGE: '1' },
  });
  const exit = res.status === null ? 1 : res.status;
  const stdout = `${res.stdout ?? ''}${res.stderr ?? ''}`.trim();
  results.push({ label, command, exit, stdout });
  return exit;
}

function prismaCli() {
  const bin = path.join(ROOT, 'node_modules', 'prisma', 'build', 'index.js');
  if (!fs.existsSync(bin)) {
    console.error('ENTORNO_ILEGIBLE: node_modules/prisma/build/index.js no existe. Ejecuta npm install.');
    process.exit(2);
  }
  return bin;
}

function main() {
  if (!fs.existsSync(SCHEMA)) {
    console.error(`ENTORNO_ILEGIBLE: ${path.relative(ROOT, SCHEMA)} no existe.`);
    process.exit(2);
  }

  console.log('── W53_T01 · CONTRATO CAREER OS ──────────────────────────────');

  // 1. prisma validate (motor real)
  const cli = prismaCli();
  const validateExit = run('prisma validate', process.execPath, [cli, 'validate']);

  // 2. Modelos del contrato presentes en el schema medido en disco
  const schema = fs.readFileSync(SCHEMA, 'utf8');
  const declared = [...schema.matchAll(/^model\s+(\w+)\s*\{/gm)].map((m) => m[1]);
  const missing = REQUIRED_MODELS.filter((m) => !declared.includes(m));
  const modelExit = missing.length === 0 ? 0 : 1;
  results.push({
    label: 'modelos del contrato',
    command: 'schema.prisma (grep model)',
    exit: modelExit,
    stdout: missing.length === 0
      ? `${REQUIRED_MODELS.length}/${REQUIRED_MODELS.length} presentes`
      : `faltan: ${missing.join(', ')}`,
  });

  // 3. Cliente generado utilizable
  const clientPath = path.join(ROOT, 'node_modules', '.prisma', 'client', 'index.js');
  const generatedExit = fs.existsSync(clientPath) ? 0 : 1;
  results.push({
    label: 'prisma client generado',
    command: 'Test-Path node_modules/.prisma/client/index.js',
    exit: generatedExit,
    stdout: fs.existsSync(clientPath) ? 'existe' : 'ausente',
  });

  // 4. tsc sobre el código career (si ya existe; db.ts puede llegar en otra sesión)
  const careerDir = path.join(ROOT, 'src', 'lib', 'career');
  let tscExit = 0;
  if (fs.existsSync(careerDir)) {
    const tscBin = path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc');
    tscExit = fs.existsSync(tscBin)
      ? run('tsc --noEmit', process.execPath, [tscBin, '--noEmit'])
      : run('tsc --noEmit', 'npx', ['--yes', 'typescript', 'tsc', '--noEmit']);
  } else {
    results.push({
      label: 'tsc --noEmit',
      command: 'Test-Path src/lib/career',
      exit: 0,
      stdout: 'src/lib/career ausente: nada que compilar (la tarea lo creará)',
    });
  }

  // ─── Veredicto ───────────────────────────────────────────────────────────────
  let failed = 0;
  for (const r of results) {
    const status = r.exit === 0 ? 'PASS' : 'FAIL';
    if (r.exit !== 0) failed += 1;
    console.log(`[${status}] ${r.label} -> exit ${r.exit}`);
    if (r.stdout) {
      const lines = r.stdout.split('\n').slice(0, 6);
      for (const line of lines) console.log(`        ${line}`);
    }
  }

  if (failed > 0) {
    console.log(`\nCAREER_SCHEMA_CONTRACT=FAIL (${failed} puerta(s) en rojo)`);
    return 1;
  }
  console.log('\nCAREER_SCHEMA_CONTRACT=PASS');
  return 0;
}

process.exit(main());
