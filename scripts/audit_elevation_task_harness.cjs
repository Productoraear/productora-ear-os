#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE DE ELEVACIÓN · validador de las tareas Wave 53+
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el mandato de elevación (ARCHITECT_DIRECTIVE_SOTA_2026 §5.3)
 * prohíbe aceptar `tsc --noEmit` como única prueba. La compilación demuestra que
 * el código tipa, no que haga lo que promete. Este arnés verifica lo que sí es
 * falsable y mecánico ANTES de que el Arquitecto firme el cierre:
 *
 *   1. La tarea existe en la cola y su contrato está elevado (mark SOTA_2026).
 *   2. Los archivos declarados en `files` existen en el scaffolding o ya están
 *      escritos (si no existe ninguno, la tarea no ha empezado: Exit 1).
 *   3. Cero `any` explícito en los archivos de la tarea.
 *   4. Si el archivo declara persistencia (`persisted`), exige el tríptico
 *      honesto `mode` / `source` / `persisted` para no volver al modo simulado.
 *   5. El `test` propio de la tarea no puede ser sólo compilación: se declara el
 *      hueco en vez de fingir una prueba.
 *
 * Todo hueco se reporta como SIN_EVIDENCIA y hace Exit 1: el arnés nunca está
 * más verde que la realidad (AF-5).
 *
 * Uso:
 *   node scripts/audit_elevation_task_harness.cjs --task=W53_T02
 *   node scripts/audit_elevation_task_harness.cjs --task=W53_T02 --json
 *
 * Exit codes: 0 = la tarea satisface el contrato elevado · 1 = hueco real ·
 *             2 = uso incorrecto / cola ilegible.
 * Zero-dep. Sin red.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const QUEUE = path.join(ROOT, '.antigravity', 'tasks_queue.json');
const ELEVATION_MARK = 'SOTA_2026_ELEVATION';

const argv = process.argv.slice(2);
const JSON_ONLY = argv.includes('--json');
const TASK_ID = (argv.find((a) => a.startsWith('--task=')) ?? '').replace('--task=', '').trim();

function relOf(abs) {
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

function fail(code, message) {
  console.error(`ARNES_ELEVACION=FAIL ${message}`);
  process.exit(code);
}

if (!TASK_ID) fail(2, 'uso: node scripts/audit_elevation_task_harness.cjs --task=<ID>');

let queue;
try {
  queue = JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
} catch (err) {
  fail(2, `QUEUE_ILEGIBLE: ${err instanceof Error ? err.message : String(err)}`);
}

const liveTasks = Array.isArray(queue.tasks) ? queue.tasks : [];
const archived = Array.isArray(queue.completed) ? queue.completed : [];
const task = liveTasks.find((t) => t && t.id === TASK_ID) ?? archived.find((t) => t && t.id === TASK_ID);
if (!task) fail(1, `${TASK_ID} no existe en tasks[] ni en completed[]`);

const findings = [];
const checks = {
  task_id: TASK_ID,
  status: task.status ?? null,
  contract_mark: null,
  files_declared: 0,
  files_present: [],
  files_missing: [],
  compile_only_harness: false,
  explicit_any: [],
  persistence_markers: null,
};

// 1 · contrato elevado
const contract = task.elevation_contract;
if (contract !== null && typeof contract === 'object' && contract.mark === ELEVATION_MARK) {
  checks.contract_mark = contract.mark;
} else {
  findings.push(`contrato NO elevado: falta elevation_contract.mark=${ELEVATION_MARK}`);
}

// 2 · archivos declarados en disco
const files = Array.isArray(task.files) ? task.files.filter((f) => typeof f === 'string') : [];
checks.files_declared = files.length;
for (const f of files) {
  if (fs.existsSync(path.join(ROOT, f))) checks.files_present.push(f);
  else checks.files_missing.push(f);
}
if (files.length === 0) findings.push('la tarea no declara `files`: no hay superficie verificable');
else if (checks.files_present.length === 0) {
  findings.push(
    `ningún archivo declarado existe todavía (${checks.files_missing.length} ausentes): la tarea no está implementada`
  );
}

// 3 · cero `any` explícito + 4 · honestidad de persistencia
const ANY_RE = /(?::\s*any\b|<any>|\bas\s+any\b)/;
for (const f of checks.files_present) {
  if (!/\.(ts|tsx|cjs|mjs)$/.test(f)) continue;
  let source;
  try {
    source = fs.readFileSync(path.join(ROOT, f), 'utf8');
  } catch {
    continue;
  }
  source.split(/\r?\n/).forEach((line, i) => {
    if (ANY_RE.test(line) && !/^\s*(\/\/|\*)/.test(line)) checks.explicit_any.push(`${f}:${i + 1}`);
  });
  if (/persisted\s*:/.test(source)) {
    const triad = {
      mode: /mode\s*:\s*['"]REAL['"]/.test(source),
      source: /source\s*:\s*['"]live['"]/.test(source),
      persisted: /persisted\s*:\s*true/.test(source),
    };
    checks.persistence_markers = checks.persistence_markers ?? {};
    checks.persistence_markers[relOf(path.join(ROOT, f))] = triad;
    if (!triad.mode || !triad.source || !triad.persisted) {
      findings.push(
        `${f} declara \`persisted\` sin el tríptico honesto (mode:"REAL" / source:"live" / persisted:true): riesgo de fachada`
      );
    }
  }
}
if (checks.explicit_any.length > 0) {
  const shown = checks.explicit_any.slice(0, 5).join(', ');
  findings.push(
    `tipos any explícitos: ${shown}${checks.explicit_any.length > 5 ? ` … (+${checks.explicit_any.length - 5})` : ''}`
  );
}

// 5 · arnés propio falsable
const test = typeof task.test === 'string' ? task.test.trim() : '';
const COMPILE_ONLY = /^\s*node\s+\.\/node_modules\/typescript\/bin\/tsc\s+--noEmit\s*$/;
const SELF_HARNESS = /audit_elevation_task_harness\.cjs/.test(test);
if (!test) findings.push('la tarea no declara `test`: sin arnés no hay prueba');
else if (COMPILE_ONLY.test(test)) {
  checks.compile_only_harness = true;
  findings.push('`test` es sólo compilación: no prueba comportamiento');
} else if (!SELF_HARNESS && !/scripts\//.test(test)) {
  findings.push('`test` no invoca un arnés del repositorio: no es reproducible');
}

const ok = findings.length === 0;
const report = {
  arnes: 'audit_elevation_task_harness.cjs',
  ts: new Date().toISOString(),
  verdict: ok ? 'PASS' : 'FAIL',
  checks,
  findings,
};

if (JSON_ONLY) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('── ARNÉS FALSABLE DE ELEVACIÓN ────────────────────────────────');
  console.log(`tarea            : ${TASK_ID} [${checks.status ?? 'sin estado'}]`);
  console.log(`contrato elevado : ${checks.contract_mark ?? 'NO'}`);
  console.log(`archivos         : ${checks.files_present.length}/${checks.files_declared} presentes`);
  if (checks.files_missing.length) console.log(`  ausentes       : ${checks.files_missing.join(', ')}`);
  console.log(`any explícitos   : ${checks.explicit_any.length}`);
  if (checks.persistence_markers) {
    for (const [f, triad] of Object.entries(checks.persistence_markers)) {
      console.log(`persistencia     : ${f} mode=${triad.mode} source=${triad.source} persisted=${triad.persisted}`);
    }
  }
  if (!ok) {
    console.log('\nHUECOS (SIN_EVIDENCIA):');
    for (const f of findings) console.log(`  · ${f}`);
  }
}

console.log(`ARNES_ELEVACION=${ok ? 'PASS' : 'FAIL'} FINDINGS=${findings.length}`);
process.exit(ok ? 0 : 1);

