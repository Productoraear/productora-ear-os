/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONCILIACIÓN FORENSE DE CONTADORES · tasks_queue.json ↔ MEDICIÓN REAL
 * ════════════════════════════════════════════════════════════════════════════
 * Problema que cierra: `_meta.total_pending` se desincronizó (llegó a declarar 3
 * mientras había 35 tareas pendientes) y `total_tasks` cuenta tareas HISTÓRICAS
 * ya ejecutadas, así que el `40` no coincide con las 39 tareas vivas del array.
 * Este auditor RECUENTA el array `tasks` estado por estado y compara con
 * `_meta`. No reescribe la cola: firma. Si hay divergencia, sale 1.
 *
 * Modo escritura: `syncQueueMeta()` deja `_meta` igual a la medición y lo sella
 * con `meta_reconciled_at` + `meta_measurement`; nunca toca las tareas.
 *
 * Uso:
 *   node scripts/audit_queue_counter_integrity.cjs         # audita (Exit 0/1)
 *   node scripts/audit_queue_counter_integrity.cjs --sync   # concilia _meta
 *
 * Exit codes: 0 = contadores coinciden · 1 = divergencia · 2 = cola ilegible.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const QUEUE = path.join(ROOT, '.antigravity', 'tasks_queue.json');

/** Estados que NO requieren ejecución (ya hechas o bloqueadas por decisión). */
const EXECUTABLE_STATES = new Set(['PENDING', 'QUEUED', 'NOT_STARTED']);

function readQueue() {
  try {
    return JSON.parse(fs.readFileSync(QUEUE, 'utf8'));
  } catch (err) {
    console.error(`QUEUE_ILLEGIBLE: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }
}

/** Recuento por estado sobre el array vivo `tasks` (nunca sobre `_meta`). */
function measure(queue) {
  const tasks = Array.isArray(queue.tasks) ? queue.tasks : [];
  const byStatus = {};
  for (const task of tasks) {
    const status = typeof task.status === 'string' ? task.status : 'SIN_ESTADO';
    byStatus[status] = (byStatus[status] ?? 0) + 1;
  }
  const counted = (status) => byStatus[status] ?? 0;
  return {
    live_tasks: tasks.length,
    by_status: byStatus,
    completed_real: counted('COMPLETED_REAL'),
    completed_legacy: counted('COMPLETED'),
    code_present_pending_gate: counted('CODE_PRESENT_PENDING_GATE'),
    blocked_ceo: counted('BLOCKED_CEO'),
    pending_w53: tasks.filter((t) => t.status === 'PENDING' && String(t.id).startsWith('W53_')).length,
    pending_all: counted('PENDING'),
    queued: counted('QUEUED'),
    pending_executable: tasks.filter((t) => EXECUTABLE_STATES.has(t.status)).length,
    historic_completed_in_completed_array: Array.isArray(queue.completed) ? queue.completed.length : 0,
  };
}

/** Divergencias entre lo declarado en `_meta` y lo medido en `tasks`. */
function divergences(queue, measured) {
  const meta = queue._meta ?? queue.metadata ?? {};
  const out = [];
  const cmp = (declaredKey, measuredValue, label) => {
    if (!(declaredKey in meta)) return;
    if (meta[declaredKey] !== measuredValue) out.push(`${label}: _meta.${declaredKey}=${meta[declaredKey]} vs medido=${measuredValue}`);
  };
  cmp('total_pending', measured.pending_executable, 'tareas pendientes ejecutables');
  cmp('total_completed_real', measured.completed_real, 'completadas reales');
  cmp('total_blocked_ceo', measured.blocked_ceo, 'bloqueadas por CEO');
  cmp('total_w53_career_os', measured.pending_w53, 'W53 Career OS');
  // `total_tasks` se documenta como negativo histórico: incluye tareas ya
  // ejecutadas. Se informa siempre, no se exige igualdad.
  return out;
}

function syncQueueMeta(queue, measured) {
  const meta = queue._meta ?? queue.metadata;
  if (!meta || typeof meta !== 'object') {
    console.error('QUEUE_SIN_META: nada que conciliar.');
    process.exit(2);
  }
  meta.total_pending = measured.pending_executable;
  meta.total_completed_real = measured.completed_real;
  meta.total_blocked_ceo = measured.blocked_ceo;
  meta.total_w53_career_os = measured.pending_w53;
  meta.last_updated = new Date().toISOString();
  meta.meta_reconciled_at = meta.last_updated;
  meta.meta_measurement =
    'audit_queue_counter_integrity.cjs · recuento por estado sobre el array tasks (fuente única de verdad)';
  fs.writeFileSync(QUEUE, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
}

function main() {
  const sync = process.argv.includes('--sync');
  const queue = readQueue();
  const measured = measure(queue);
  const drift = divergences(queue, measured);
  const meta = queue._meta ?? queue.metadata ?? {};

  console.log('── CONCILIACIÓN DE CONTADORES (tasks_queue.json) ─────────────');
  console.log(`tasks vivas          : ${measured.live_tasks}`);
  console.log(`por estado           : ${JSON.stringify(measured.by_status)}`);
  console.log(`pendientes ejecutables: ${measured.pending_executable} (PENDING+QUEUED+NOT_STARTED)`);
  console.log(`completadas reales   : ${measured.completed_real} · histórico en completed[]: ${measured.historic_completed_in_completed_array}`);
  console.log(`declarado _meta.total_pending: ${meta.total_pending ?? '<ausente>'} · _meta.total_tasks: ${meta.total_tasks ?? '<ausente>'}`);
  console.log(`ultima conciliacion  : ${meta.meta_reconciled_at ?? meta.last_updated ?? '<ausente>'}`);

  if (drift.length > 0) {
    console.error('\nDIVERGENCIA MEDIDA:');
    for (const line of drift) console.error(`  x ${line}`);
    if (sync) {
      syncQueueMeta(queue, measured);
      console.log('META_CONCILIADA: _meta reescrito con la medición (las tareas no se tocaron).');
      return 0;
    }
    console.log('\nQUEUE_COUNTERS=DRIFT');
    return 1;
  }

  console.log('\nQUEUE_COUNTERS=CONSISTENT');
  return 0;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { measure, divergences, readQueue, QUEUE };
