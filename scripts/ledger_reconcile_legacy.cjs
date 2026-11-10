#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * SANEAMIENTO LEGACY DEL LEDGER · ENMIENDAS APPEND-ONLY (EP-4 / EP-5)
 * ════════════════════════════════════════════════════════════════════════════
 * Problema que cierra: 27 filas históricas quedaron declaradas `VERIFICADO` sin
 * `url` https (son gates LOCALES: `tsc --noEmit`, `verify:ssot`, `verify:confianza`…).
 * La quíntupla EP-1 es innegociable: una fila sin URL pública se DEGRADA a
 * `SOSPECHOSO` en tiempo de lectura (`src/lib/evidence/evidence-ledger.ts:175`).
 * Esa degradación bloquea `npm run verify:confianza` y con ella `gate:prepush`.
 *
 * Qué hace este script (y qué NO hace):
 *   · NO reescribe ni borra una sola línea previa. El ledger es append-only.
 *   · Añade, por cada fila degradada, una línea `order:"AMEND"` con
 *     `supersedes:<CLAIM_ID>` que declara el estado REAL (`SOSPECHOSO`, porque un
 *     gate local no tiene URL pública) y cita el commit de persistencia.
 *   · Es idempotente: si ya existe la enmienda, no la duplica.
 *
 * Lo que NO puede hacer, y se dice en voz alta: `SOSPECHOSO` no es un VERDE.
 * La página `/confianza` seguirá mostrando estas filas como `SOSPECHOSO`. Para
 * elevarlas a `VERIFICADO` hace falta la URL pública medida (EP-1 `url`), y esa
 * evidencia la produce `verify:confianza --prod`, no este script.
 *
 * Uso:
 *   node scripts/ledger_reconcile_legacy.cjs              # dry-run (imprime plan)
 *   node scripts/ledger_reconcile_legacy.cjs --apply      # escribe las enmiendas
 *   node scripts/ledger_reconcile_legacy.cjs --apply --json
 *
 * Exit: 0 = saneamiento aplicado o ya vigente · 1 = quedan filas degradadas ·
 *       2 = uso/ledger ilegible.
 * Zero-dep. Sin red.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const LEDGER = path.join(ROOT, '.antigravity', 'evidence', 'ledger.jsonl');
const PERSISTENCE_COMMIT = process.env.LEDGER_LEGACY_COMMIT || '834e8fb7';
const MARKER = 'HISTORICO_LEGACY_CONSOLIDADO';

const ARGV = process.argv.slice(2);
const APPLY = ARGV.includes('--apply');
const AS_JSON = ARGV.includes('--json');

const EVIDENCE_STATES = new Set(['VERIFICADO', 'SOSPECHOSO', 'FACHADA', 'SIN_EVIDENCIA']);
const SHA256_HEX = /^[0-9a-f]{64}$/;

/** Misma regla de degradación que `src/lib/evidence/evidence-ledger.ts`. */
function downgradeReasons(row) {
  if (String(row.state || '').toUpperCase() !== 'VERIFICADO') return [];
  const reasons = [];
  const url = typeof row.url === 'string' ? row.url.trim() : '';
  if (typeof row.cmd !== 'string' || row.cmd.trim().length === 0) reasons.push('falta cmd');
  if (typeof row.exit !== 'number') reasons.push('falta exit');
  if (url.length === 0) reasons.push('falta url');
  if (typeof row.sha256 !== 'string' || !SHA256_HEX.test(row.sha256)) reasons.push('sha256 no es hex de 64');
  if (typeof row.ts !== 'string') reasons.push('falta ts');
  if (url.length > 0 && !url.startsWith('https://')) reasons.push('url no https');
  return reasons;
}

function readRows() {
  if (!fs.existsSync(LEDGER)) return [];
  const text = fs.readFileSync(LEDGER, 'utf8');
  return text
    .split(/\r?\n/)
    .map((line, index) => ({ line: index + 1, raw: line.trim() }))
    .filter((entry) => entry.raw.length > 0)
    .map((entry) => {
      try {
        return { ...entry, row: JSON.parse(entry.raw) };
      } catch {
        return { ...entry, row: null };
      }
    });
}

function claimId(row) {
  const id = typeof row.id === 'string' ? row.id : typeof row.claim === 'string' ? row.claim : null;
  return id === null ? null : id.trim();
}

/** Filas vigentes (última aparición por id) que siguen degradadas. */
function degradedActiveRows(entries) {
  const lastIndexById = new Map();
  entries.forEach((entry, index) => {
    if (entry.row === null) return;
    const id = claimId(entry.row);
    if (id !== null) lastIndexById.set(id, index);
  });

  const retired = new Set();
  for (const entry of entries) {
    if (entry.row === null) continue;
    const supersedes = typeof entry.row.supersedes === 'string' ? entry.row.supersedes.trim() : '';
    const id = claimId(entry.row);
    if (supersedes.length > 0 && supersedes !== id) retired.add(supersedes);
  }

  const out = [];
  entries.forEach((entry, index) => {
    if (entry.row === null) return;
    const id = claimId(entry.row);
    if (id === null) return;
    if (lastIndexById.get(id) !== index) return;
    if (retired.has(id)) return;
    const state = String(entry.row.state || '').toUpperCase();
    if (!EVIDENCE_STATES.has(state)) return;
    const reasons = downgradeReasons(entry.row);
    if (reasons.length === 0) return;
    out.push({ id, line: entry.line, state, reasons, row: entry.row });
  });
  return out;
}

function buildAmendment(target) {
  const originalCmd = typeof target.row.cmd === 'string' ? target.row.cmd : null;
  return {
    claim: target.id,
    promise:
      `Fila legacy consolidada (${MARKER}): el claim original (${originalCmd ?? 'sin cmd'}) es un gate LOCAL ` +
      'sin URL publica medida, por lo que NO puede sostener un VERIFICADO bajo EP-1.',
    state: 'SOSPECHOSO',
    cmd: originalCmd,
    exit: typeof target.row.exit === 'number' ? target.row.exit : null,
    url: null,
    sha256: typeof target.row.sha256 === 'string' ? target.row.sha256 : null,
    sha256_scope: typeof target.row.sha256_scope === 'string' ? target.row.sha256_scope : 'stdout+stderr',
    ts: new Date().toISOString(),
    head: PERSISTENCE_COMMIT,
    source: 'live',
    mode: 'REAL',
    order: 'AMEND',
    supersedes: target.id,
    legacy_marker: MARKER,
    persistence_commit: PERSISTENCE_COMMIT,
    downgrade_reasons: target.reasons,
    note:
      'Saneamiento append-only: cero reescritura destructiva. La fila original permanece intacta en el historial. ' +
      'Aviso EP-2: SOSPECHOSO no es un VERDE; para elevar la fila hace falta la URL publica medida.',
  };
}

function main() {
  const entries = readRows();
  if (entries.length === 0) {
    console.error('LEDGER_VACIO: no hay nada que sanear (y nada que demostrar).');
    return 2;
  }

  const degraded = degradedActiveRows(entries);
  const alreadyAmended = new Set(
    entries
      .filter((entry) => entry.row !== null && entry.row.order === 'AMEND' && entry.row.legacy_marker === MARKER)
      .map((entry) => claimId(entry.row)),
  );
  const pending = degraded.filter((target) => !alreadyAmended.has(target.id));

  const plan = pending.map((target) => ({
    id: target.id,
    previous_line: target.line,
    previous_state: target.state,
    reasons: target.reasons,
    amendment_state: 'SOSPECHOSO',
  }));

  if (AS_JSON) {
    console.log(
      JSON.stringify(
        {
          reconciler: 'ledger_reconcile_legacy.cjs',
          ledger: path.relative(ROOT, LEDGER).split(path.sep).join('/'),
          rows_read: entries.length,
          degraded_active: degraded.map((target) => target.id),
          already_amended: [...alreadyAmended],
          pending_count: pending.length,
          applied: false,
          plan,
        },
        null,
        2,
      ),
    );
    if (!APPLY) return pending.length === 0 ? 0 : 1;
  } else {
    console.log('── SANEAMIENTO LEGACY DEL LEDGER (EP-4 append-only) ──────────');
    console.log(`ledger              : ${path.relative(ROOT, LEDGER).split(path.sep).join('/')} · ${entries.length} filas leídas`);
    console.log(`filas degradadas    : ${degraded.length}`);
    console.log(`ya enmendadas       : ${alreadyAmended.size}`);
    console.log(`pendientes de AMEND : ${pending.length}`);
    if (pending.length > 0) {
      console.log('');
      for (const target of pending) {
        console.log(`  · ${target.id} (línea ${target.line}) → AMEND SOSPECHOSO · ${target.reasons.join(', ')}`);
      }
    }
  }

  if (!APPLY) {
    if (pending.length === 0) {
      console.log(`LEDGER_RECONCILE=${degraded.length === 0 ? 'CLEAN' : 'ALREADY_AMENDED'}`);
      return 0;
    }
    console.log('');
    console.log('DRY_RUN: nada escrito. Ejecuta con --apply para sellar las enmiendas.');
    console.log('LEDGER_RECONCILE=PENDING');
    return 1;
  }

  if (pending.length > 0) {
    const lines = pending.map((target) => JSON.stringify(buildAmendment(target))).join('\n');
    const current = fs.readFileSync(LEDGER, 'utf8');
    const prefix = current.length === 0 || current.endsWith('\n') ? '' : '\n';
    fs.appendFileSync(LEDGER, `${prefix}${lines}\n`, 'utf8');
  }

  // Re-medición inmediata: el veredicto no es una promesa, es una lectura.
  const after = degradedActiveRows(readRows());
  const ok = after.length === 0;
  console.log('');
  console.log(`enmiendas escritas  : ${pending.length}`);
  console.log(`degradadas restantes: ${after.length}${after.length === 0 ? '' : ` → ${after.map((t) => t.id).join(', ')}`}`);
  console.log(`LEDGER_RECONCILE=${ok ? 'APPLIED' : 'FAIL'}`);
  if (!ok) console.error('QUEDAN_FILAS_DEGRADADAS: revisar a mano, jamás aflojando el gate.');
  return ok ? 0 : 1;
}

if (require.main === module) {
  process.exit(main());
}

module.exports = { downgradeReasons, degradedActiveRows, buildAmendment, MARKER };
