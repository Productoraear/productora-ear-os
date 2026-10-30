#!/usr/bin/env node
/**
 * AMD-1 · Fila transitoria del claim AF-1 en el ledger append-only (EP-4).
 *
 * Motivo (sancionado por CEO/Arquitecto el 2026-10-30, RESOLUCION T02):
 *   src/app/api/webhooks/health/route.ts ya no es FACHADA (pingN8nInstance() se
 *   ejecuta siempre y el cuerpo declara probed/source/mode/checkedAt), pero
 *   produccion aun no sirve ese codigo. La verdad medida hoy es SOSPECHOSO.
 *   Un FACHADA activo bloquea el deploy (§4) -> paradoja resuelta por mandato.
 *
 * Reglas que respeta:
 *  - Append-only: NO se reescribe ninguna linea previa; se anade una y se
 *    referencia con `supersedes` (EP-4). `supersedes` sobre el PROPIO id no
 *    retira la cadena: la ultima linea del id es la vigente (evidence-ledger.ts:243-263).
 *  - `ts` = instante REAL de escritura, no un literal copiado (EP-1).
 *  - `sha256:"local-patch"` es deliberado: el parche no se ha medido en HTTP
 *    todavia, y esa etiqueta impide que la fila pueda pasar por VERIFICADO.
 *  - Texto ASCII sin acentos: en este ledger ya hay filas con mojibake por una
 *    escritura previa en otra pagina de codigo; no se repite el error.
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const LEDGER = path.join(process.cwd(), '.antigravity', 'evidence', 'ledger.jsonl');
const ts = new Date().toISOString().replace(/\.\d+Z$/, 'Z');

const row = {
  claim: 'AF-1',
  promise: 'El endpoint de salud de webhooks solo declara vida cuando ha sondeado n8n de verdad',
  state: 'SOSPECHOSO',
  cmd: 'lectura de src/app/api/webhooks/health/route.ts:45-93',
  exit: 0,
  url: 'https://www.productoraear.com/api/webhooks/health',
  sha256: 'local-patch',
  ts,
  supersedes: 'AF-1',
  note:
    'AMD-1 sancionado 2026-10-30 (RESOLUCION T02): el codigo ya no es FACHADA ' +
    '(pingN8nInstance() se ejecuta siempre; probed/source/mode/checkedAt en el cuerpo), ' +
    'verificado en local con TCP preflight. Pasa a SOSPECHOSO hasta que produccion lo ' +
    'sirva: se cierra con deploy + sonda G-6 y una fila VERIFICADO nueva. ' +
    'sha256=local-patch es intencional (no hay cuerpo HTTP medido aun).',
};

if (!fs.existsSync(LEDGER)) {
  console.error('[AMD-1][FATAL] No existe el ledger: ' + LEDGER);
  process.exit(2);
}

const before = fs.readFileSync(LEDGER, 'utf8');
const beforeSha = crypto.createHash('sha256').update(before, 'utf8').digest('hex');
const line = JSON.stringify(row);

// Se conserva la ultima fila intacta (append-only) y se garantiza separador LF.
fs.appendFileSync(LEDGER, (before.endsWith('\n') ? '' : '\n') + line + '\n', 'utf8');

const after = fs.readFileSync(LEDGER, 'utf8');
const afterSha = crypto.createHash('sha256').update(after, 'utf8').digest('hex');
const lines = after.split(/\r?\n/).filter((l) => l.trim().length > 0);

console.log(JSON.stringify({
  appended: 'AF-1',
  state: row.state,
  ts,
  lines: lines.length,
  bytes_before: Buffer.byteLength(before, 'utf8'),
  bytes_after: Buffer.byteLength(after, 'utf8'),
  sha256_before: beforeSha,
  sha256_after: afterSha,
  appended_bytes: Buffer.byteLength(line, 'utf8'),
}, null, 2));
