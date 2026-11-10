#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITORÍA FORENSE DE LA COLA · tasks_queue.json ↔ DISCO
 * ════════════════════════════════════════════════════════════════════════════
 * Problema que cierra: `_meta.total_tasks` declaraba 34 tareas cuando el array
 * vivo tiene 40, y ninguna tarea abierta tenía medido su porcentaje real. Un
 * porcentaje escrito a mano es una opinión; este script lo DERIVA de tres
 * hechos observables:
 *
 *   ESCRIBIDO  · al menos un archivo declarado en `files` existe en disco.
 *   TIPOS      · `test` invoca `tsc --noEmit` (validación de tipos declarada).
 *   ARNÉS      · `test` invoca un arnés del repositorio (`scripts/...`), no una
 *                compilación disfrazada de prueba.
 *
 * Regla de porcentaje (la del mandato del CEO):
 *   0%   · sin archivos en disco            → no ha empezado (`SIN_EMPEZAR`)
 *   50%   · escrito, sin arnés declarado    → `CODIGO_SIN_ARNES`
 *   50%   · gate declarado sin arnés en disco → `GATE_SIN_ARNES` (techo duro)
 *   100% · escrito + tipos + arnés presentes → `CANDIDATO_A_FIRMA` (NO firmado)
 *
 * Importante: 100 % aquí significa "el obrero terminó su parte". La firma del
 * Arquitecto vive en `.antigravity/ARCHITECT_APPROVAL.json` y NUNCA se escribe
 * desde este script (worker_self_approval.allowed = false).
 *
 * Uso:
 *   node scripts/audit_queue_forensic.cjs              # informe legible
 *   node scripts/audit_queue_forensic.cjs --json       # informe máquina
 *   node scripts/audit_queue_forensic.cjs --markdown   # tabla para el dossier
 *   node scripts/audit_queue_forensic.cjs --debt-only  # sólo deuda oculta
 *
 * Exit codes: 0 = cola legible y auditada (con o sin deuda) · 2 = cola ilegible.
 * Zero-dep. Sin red.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const QUEUE = path.join(ROOT, '.antigravity', 'tasks_queue.json');
const MIGRATIONS_DIR = path.join(ROOT, 'prisma', 'migrations');

const ARGV = process.argv.slice(2);
const AS_JSON = ARGV.includes('--json');
const AS_MARKDOWN = ARGV.includes('--markdown');
const DEBT_ONLY = ARGV.includes('--debt-only');

/** Estados terminales que no exigen ejecución. */
const CLOSED_STATES = new Set(['COMPLETED', 'COMPLETED_REAL', 'BLOCKED_CEO']);

function readQueue() {
  try {
    return JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  } catch (err) {
    console.error(`QUEUE_ILEGIBLE: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }
}

function exists(relative) {
  if (typeof relative !== 'string' || relative.trim().length === 0) return false;
  return fs.existsSync(path.join(ROOT, relative));
}

/** `test` declara tipos si invoca tsc; declara arnés si invoca un script del repo. */
function readTestContract(test) {
  const raw = typeof test === 'string' ? test.trim() : '';
  const declaresTypes = /tsc(\.js)?\s+--noEmit|typescript\/bin\/tsc/.test(raw);
  const harnessMatches = raw.match(/scripts\/[A-Za-z0-9_\-./]+/g) ?? [];
  const harness = harnessMatches.find((candidate) => exists(candidate.replace(/^\.\//, '')));
  return {
    declared: raw.length > 0,
    declaresTypes,
    harnessDeclared: harnessMatches.length > 0,
    harnessInDisk: typeof harness === 'string' ? harness : null,
  };
}

/** Porcentaje derivado de hechos, con su motivo legible. */
function scoreTask(task) {
  const files = Array.isArray(task.files) ? task.files.filter((f) => typeof f === 'string') : [];
  const present = files.filter(exists);
  const missing = files.filter((f) => !exists(f));
  const contract = readTestContract(task.test);
  const allPresent = files.length > 0 && missing.length === 0;

  let percent = 0;
  let bucket = 'SIN_EMPEZAR';
  const blockers = [];

  if (present.length > 0) {
    percent = 50;
    bucket = 'PARCIAL';
    if (!contract.declared) blockers.push('sin `test` declarado en la cola');
    else if (contract.harnessDeclared && contract.harnessInDisk === null) {
      bucket = 'GATE_SIN_ARNES';
      blockers.push('el `test` invoca un arnés que no existe en disco');
    } else if (!contract.harnessDeclared) blockers.push('el `test` es sólo compilación');

    if (missing.length > 0) {
      // Archivos declarados y ausentes: el contrato de la tarea no está completo.
      blockers.push(`ausentes: ${missing.join(', ')}`);
    } else if (contract.declaresTypes && contract.harnessInDisk !== null) {
      percent = 100;
      bucket = 'CANDIDATO_A_FIRMA';
    } else if (contract.harnessInDisk !== null) {
      bucket = 'PARCIAL';
      blockers.push('arnés presente pero `test` no valida tipos (`tsc --noEmit`)');
    }
  } else {
    blockers.push(
      files.length === 0
        ? 'la tarea no declara `files`: no hay superficie verificable'
        : 'ningún archivo declarado existe en disco',
    );
    if (missing.length > 0) blockers.push(`ausentes: ${missing.join(', ')}`);
  }

  return {
    id: task.id,
    title: typeof task.title === 'string' ? task.title : null,
    status: typeof task.status === 'string' ? task.status : 'SIN_ESTADO',
    priority: typeof task.priority === 'string' ? task.priority : null,
    files_declared: files.length,
    files_present: present,
    files_missing: missing,
    all_files_present: allPresent,
    test_declares_types: contract.declaresTypes,
    harness_in_disk: contract.harnessInDisk,
    percent,
    bucket,
    blockers,
  };
}

/**
 * Deuda oculta: hechos tangibles del repo que un informe de cola no puede
 * deducir del array `tasks` y que, si se omiten, convierten el informe en
 * decoración. Cada item se mide aquí; ninguno se declara por memoria.
 */
function measureHiddenDebt() {
  const entries = fs.existsSync(MIGRATIONS_DIR)
    ? fs.readdirSync(MIGRATIONS_DIR, { withFileTypes: true }).filter((item) => item.isDirectory()).map((item) => item.name)
    : [];
  const careerMigration = entries.filter((name) => /career/i.test(name));
  const careerSql = careerMigration
    .map((name) => path.join(MIGRATIONS_DIR, name, 'migration.sql'))
    .filter((absolute) => fs.existsSync(absolute))
    .map((absolute) => path.relative(ROOT, absolute).split(path.sep).join('/'));

  let pkg = {};
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  } catch {
    pkg = {};
  }
  const scripts = typeof pkg.scripts === 'object' && pkg.scripts !== null ? pkg.scripts : {};
  const noEngineScripts = Object.entries(scripts)
    .filter(([, value]) => typeof value === 'string' && value.includes('--no-engine'))
    .map(([key]) => key);

  const ignoredSql = [];
  const gitignore = fs.existsSync(path.join(ROOT, '.gitignore'))
    ? fs.readFileSync(path.join(ROOT, '.gitignore'), 'utf8')
    : '';
  const migrationException = /^\s*!prisma\/migrations\/\*\*\/\*\.sql\s*$/m.test(gitignore);

  return {
    migrations_total: entries.length,
    career_migration_sql: careerSql,
    career_migration_present: careerSql.length > 0,
    prisma_no_engine_scripts: noEngineScripts,
    gitignore_allows_migration_sql: migrationException,
    ignored_sql: ignoredSql,
  };
}

/** Agregados de la cola completa: nada se reporta sin su cifra. */function summarize(live) {
  const open = live.filter((task) => !CLOSED_STATES.has(task.status));
  const closed = live.filter((task) => CLOSED_STATES.has(task.status));
  const sum = open.reduce((acc, task) => acc + task.percent, 0);
  const byBucket = {};
  for (const task of live) byBucket[task.bucket] = (byBucket[task.bucket] ?? 0) + 1;
  return {
    live_tasks: live.length,
    open_tasks: open.length,
    closed_tasks: closed.length,
    fleet_completion_percent: open.length === 0 ? 100 : Math.round((sum / open.length) * 10) / 10,
    by_bucket: byBucket,
    candidate_for_signature: live.filter((task) => task.bucket === 'CANDIDATO_A_FIRMA').map((task) => task.id),
  };
}

function main() {
  const queue = readQueue();
  const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
  const archived = Array.isArray(queue.completed) ? queue.completed : [];
  const live = tasks.map(scoreTask);
  const summary = summarize(live);
  const meta = queue._meta ?? queue.metadata ?? {};
  const hiddenDebt = measureHiddenDebt();

  const report = {
    auditor: 'audit_queue_forensic.cjs',
    ts: new Date().toISOString(),
    source: path.relative(ROOT, QUEUE).split(path.sep).join('/'),
    declared_meta: {
      total_tasks: meta.total_tasks ?? null,
      total_pending: meta.total_pending ?? null,
      total_completed_real: meta.total_completed_real ?? null,
      total_w53_career_os: meta.total_w53_career_os ?? null,
    },
    archived_completed: archived.length,
    hidden_debt: hiddenDebt,
    summary,
    tasks: live,
  };

  if (AS_JSON) {
    console.log(JSON.stringify(report, null, 2));
    return 0;
  }

  const open = live.filter((task) => !CLOSED_STATES.has(task.status));
  const shown = DEBT_ONLY ? open.filter((task) => task.percent < 100) : open;

  if (AS_MARKDOWN) {
    console.log('| ID | ESTADO | ARCHIVOS EN DISCO | % REAL | DEUDA / BLOQUEANTES |');
    console.log('|---|---|---|---|---|');
    for (const task of shown) {
      // Honestidad: si hay archivos declarados y ausentes, el % NO puede ser 100.
      const cap = task.files_missing.length > 0 && task.percent > 50 ? 50 : task.percent;
      const debt = task.blockers.length === 0 ? '—' : task.blockers.join('; ');
      console.log(
        `| ${task.id} | ${task.status} | ${task.files_present.length}/${task.files_declared} | ${cap}% (${task.bucket}) | ${debt} |`,
      );
    }
    console.log('');
    console.log(
      `**Totales**: ${summary.open_tasks} abiertas · ${summary.closed_tasks} cerradas · ${summary.live_tasks} vivas · ` +
        `completitud media de lo abierto = ${summary.fleet_completion_percent}%`,
    );
    console.log('');
    console.log(
      `**Migración W53_T01**: ${hiddenDebt.career_migration_present ? hiddenDebt.career_migration_sql.join(', ') : 'AUSENTE'} · ` +
        `gitignore permite .sql de migraciones = ${hiddenDebt.gitignore_allows_migration_sql} · ` +
        `scripts con --no-engine = ${hiddenDebt.prisma_no_engine_scripts.length === 0 ? 'ninguno' : hiddenDebt.prisma_no_engine_scripts.join(', ')}`,
    );
    return 0;
  }

  console.log('── AUDITORÍA FORENSE DE COLA ─────────────────────────────────');
  console.log(`fuente           : ${report.source}`);
  console.log(`declarado _meta  : ${JSON.stringify(report.declared_meta)}`);
  console.log(`medido           : ${summary.live_tasks} vivas · ${summary.open_tasks} abiertas · ${summary.closed_tasks} cerradas · histórico ${archived.length}`);
  console.log(`completitud media: ${summary.fleet_completion_percent}% (sólo tareas abiertas)`);
  console.log(`buckets          : ${JSON.stringify(summary.by_bucket)}`);
  console.log('');
  console.log('ID'.padEnd(46) + 'ESTADO'.padEnd(14) + 'ARCH'.padEnd(8) + '%');
  for (const task of shown) {
    const arch = `${task.files_present.length}/${task.files_declared}`;
    console.log(`${task.id.padEnd(46)}${task.status.padEnd(14)}${arch.padEnd(8)}${task.percent}% (${task.bucket})`);
    for (const blocker of task.blockers) console.log(`    · ${blocker}`);
  }
  console.log('');
  const markdownTable = shown
    .map((task) => {
      const cap = task.files_missing.length > 0 && task.percent > 50 ? 50 : task.percent;
      const debt = task.blockers.length === 0 ? '—' : task.blockers.join('; ');
      return `| ${task.id} | ${task.status} | ${task.files_present.length}/${task.files_declared} | ${cap}% (${task.bucket}) | ${debt} |`;
    })
    .join('\n');
  if (markdownTable.length > 0) {
    console.log('── TABLA (pegar en el dossier) ───────────────────────────────');
    console.log('| ID | ESTADO | ARCHIVOS EN DISCO | % REAL | DEUDA / BLOQUEANTES |');
    console.log('|---|---|---|---|---|');
    console.log(markdownTable);
    console.log('');
  }
  console.log('── DEUDA OCULTA MEDIDA ──────────────────────────────────────');
  console.log(
    `migración W53 Career : ${hiddenDebt.career_migration_present ? hiddenDebt.career_migration_sql.join(', ') : 'AUSENTE'}`,
  );
  console.log(`migraciones en disco : ${hiddenDebt.migrations_total}`);
  console.log(`gitignore .sql migr. : ${hiddenDebt.gitignore_allows_migration_sql ? 'excepción activa (viaja a Coolify)' : 'IGNORADO: la migración no viajaría'}`);
  console.log(
    `prisma --no-engine   : ${hiddenDebt.prisma_no_engine_scripts.length === 0 ? 'ninguno (0 scripts)' : hiddenDebt.prisma_no_engine_scripts.join(', ')}`,
  );
  console.log('');
  console.log(
    `CANDIDATOS A FIRMA DEL ARQUITECTO: ${summary.candidate_for_signature.length === 0 ? 'ninguno' : summary.candidate_for_signature.join(', ')}`,
  );
  console.log('FIRMA: este script NO aprueba nada (worker_self_approval.allowed = false).');
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { scoreTask, summarize, readTestContract };
