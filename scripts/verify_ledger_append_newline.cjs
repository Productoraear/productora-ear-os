#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · TERMINADOR \n DEL LEDGER APPEND-ONLY (EP-4)
 * ════════════════════════════════════════════════════════════════════════════
 * `node scripts/verify_ledger_append_newline.cjs`
 *
 * Qué prueba (y por qué cada aserto puede FALLAR de verdad):
 *   1. ledger-real    — `.antigravity/evidence/ledger.jsonl` termina en `\n` y
 *                       TODAS sus líneas no vacías son JSON parseable. Una
 *                       concatenación de dos claims rompe el parseo: cae.
 *   2. terminator     — el script canónico `ledger_append_claim.cjs` sufija
 *                       SIEMPRE `\n` tras el claim (medido, no leído).
 *   3. repair         — si el ledger queda sin salto final, el siguiente APPEND
 *                       lo repara: separador antepuesto + línea nueva cerrada.
 *   4. append-only    — dos APPEND consecutivos producen 2 líneas y NINGUNA
 *                       línea previa cambia de bytes (no se reescribe historia).
 *
 * Aislamiento: los grupos 2-4 corren contra un ledger SINTÉTICO en
 * `os.tmpdir()`. El ledger real JAMÁS se escribe desde este arnés: se verifica
 * en modo lectura. Ningún secreto, ninguna red.
 *
 * `--self-test` fuerza una aserción imposible: si el canal de fallo está roto,
 * el veredicto se invierte y sale 1.
 *
 * Exit codes: 0 = PASS · 1 = FAIL · 2 = uso incorrecto.
 * Zero-dep. Sin red.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const REAL_LEDGER = path.join(ROOT, '.antigravity', 'evidence', 'ledger.jsonl');
const SCRIPT = path.join(ROOT, 'scripts', 'ledger_append_claim.cjs');
const SELF_TEST = process.argv.includes('--self-test');

let pass = 0;
let fail = 0;
const failures = [];

function record(name, ok, detail) {
  if (ok) {
    pass += 1;
    return;
  }
  fail += 1;
  failures.push(`${name}: ${detail ?? 'aserto falso'}`);
}

function eq(name, actual, expected) {
  record(name, Object.is(actual, expected), `esperado=${String(expected)} obtenido=${String(actual)}`);
}

function ok(name, condition, detail) {
  record(name, condition === true, detail);
}

function endsWithNewline(file) {
  const size = fs.statSync(file).size;
  if (size === 0) return false;
  const fd = fs.openSync(file, 'r');
  try {
    const byte = Buffer.alloc(1);
    fs.readSync(fd, byte, 0, 1, size - 1);
    return byte[0] === 0x0a;
  } finally {
    fs.closeSync(fd);
  }
}

function nonEmptyLines(text) {
  return text.split('\n').filter((line) => line.trim().length > 0);
}

function allParseable(text) {
  for (const line of nonEmptyLines(text)) {
    try {
      const parsed = JSON.parse(line);
      if (parsed === null || typeof parsed !== 'object') return false;
    } catch {
      return false;
    }
  }
  return true;
}

// ── 1 · Ledger real: estado en disco ─────────────────────────────────────────

function checkRealLedger() {
  const G = '1.ledger-real';
  ok(`${G} · el ledger existe en disco`, fs.existsSync(REAL_LEDGER));
  if (!fs.existsSync(REAL_LEDGER)) return;

  const text = fs.readFileSync(REAL_LEDGER, 'utf8');
  const lines = nonEmptyLines(text);
  ok(`${G} · el ledger termina en salto de línea`, endsWithNewline(REAL_LEDGER));
  ok(`${G} · ninguna línea está concatenada (todas JSON parseable)`, allParseable(text), 'hay al menos una línea que no parsea como objeto JSON');
  ok(`${G} · el ledger tiene al menos 1 claim`, lines.length >= 1, `líneas=${lines.length}`);

  // Integridad de un JSONL: cada línea NO vacía = 1 objeto JSON con `claim` no
  // vacío y `ts` ISO parseable. Dos claims concatenados rompen el parseo de la
  // línea y este aserto cae. El código de resultado (`exit` entero, `httpStatus`
  // o el literal honesto `NO_OBSERVADO`) es vocabulario heredado y NO se
  // reescribe: la historia es append-only (EP-4) y aquí solo se AUDITA.
  let withClaim = 0;
  let withTimestamp = 0;
  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue; // ya contado por `allParseable`
    }
    if (typeof entry.claim === 'string' && entry.claim.length > 0) withClaim += 1;
    if (typeof entry.ts === 'string' && !Number.isNaN(Date.parse(entry.ts))) withTimestamp += 1;
  }
  eq(`${G} · cada línea es un claim identificado`, withClaim, lines.length);
  eq(`${G} · cada claim lleva timestamp ISO parseable`, withTimestamp, lines.length);
}

// ── Runner del script canónico contra un ledger sintético ────────────────────

/**
 * Copia `ledger_append_claim.cjs` a un sandbox temporal para que escriba su
 * ledger ahí (el script resuelve `.antigravity/evidence/ledger.jsonl` desde su
 * propia ubicación: se replica la estructura de directorios en el sandbox).
 */
function makeSandbox() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ear-ledger-nl-'));
  const scriptsDir = path.join(dir, 'scripts');
  fs.mkdirSync(scriptsDir, { recursive: true });
  fs.mkdirSync(path.join(dir, '.antigravity', 'evidence'), { recursive: true });
  fs.copyFileSync(SCRIPT, path.join(scriptsDir, 'ledger_append_claim.cjs'));
  return {
    dir,
    scriptsDir,
    ledger: path.join(dir, '.antigravity', 'evidence', 'ledger.jsonl'),
    cleanup: () => {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
      } catch {
        // best-effort
      }
    },
  };
}

/** Ejecuta el script canónico del sandbox contra un comando inocuo y portable. */
function runAppend(box, claim) {
  const result = spawnSync(
    process.execPath,
    [
      path.join(box.scriptsDir, 'ledger_append_claim.cjs'),
      `--claim=${claim}`,
      '--state=VERIFICADO',
      '--expect-exit=0',
      '--note=sintetico',
      '--',
      'node',
      '-e',
      'process.stdout.write("ok")',
    ],
    { encoding: 'utf8', cwd: box.dir },
  );
  return { status: result.status, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

// ── 2 · Terminador explícito ─────────────────────────────────────────────────

function checkTerminator() {
  const G = '2.terminator';
  const box = makeSandbox();
  try {
    const first = runAppend(box, 'NL_TEST_FIRST');
    eq(`${G} · primer APPEND Exit 0`, first.status, 0);
    ok(`${G} · el script informa del terminador explícito`, first.stdout.includes('terminador \\n explícito'), first.stdout.slice(-200));
    ok(`${G} · el ledger creado termina en salto de línea`, endsWithNewline(box.ledger));

    const text = fs.readFileSync(box.ledger, 'utf8');
    eq(`${G} · una línea por claim`, nonEmptyLines(text).length, 1);
    ok(`${G} · la línea es JSON parseable`, allParseable(text));

    const second = runAppend(box, 'NL_TEST_SECOND');
    eq(`${G} · segundo APPEND Exit 0`, second.status, 0);
    const afterTwo = fs.readFileSync(box.ledger, 'utf8');
    eq(`${G} · dos claims => dos líneas (sin concatenación)`, nonEmptyLines(afterTwo).length, 2);
    ok(`${G} · ambas líneas parsean`, allParseable(afterTwo), 'concatenación detectada');
    ok(`${G} · el ledger sigue terminando en salto`, endsWithNewline(box.ledger));
  } finally {
    box.cleanup();
  }
}

// ── 3 · Reparación de un ledger sin salto final ──────────────────────────────

function checkRepair() {
  const G = '3.repair';
  const box = makeSandbox();
  try {
    // Estado hostil: claim previo SIN salto final (lo que deja un editor o una
    // redirección de shell sin EOL).
    const previous = JSON.stringify({ claim: 'PREVIO_SIN_SALTO', exit: 0 });
    fs.writeFileSync(box.ledger, previous, 'utf8');
    ok(`${G} · el fixture no termina en salto`, !endsWithNewline(box.ledger));

    const run = runAppend(box, 'NL_TEST_REPAIR');
    eq(`${G} · APPEND sobre ledger sin salto Exit 0`, run.status, 0);
    ok(`${G} · el script declara la reparación`, run.stdout.includes('LEDGER_REPAIR'), run.stdout.slice(-200));

    const text = fs.readFileSync(box.ledger, 'utf8');
    eq(`${G} · el claim previo NO se destruye`, nonEmptyLines(text).length, 2);
    ok(`${G} · ninguna línea queda concatenada`, allParseable(text), text.slice(0, 200));
    ok(`${G} · el ledger reparado termina en salto`, endsWithNewline(box.ledger));
    ok(`${G} · el claim previo conserva su identificador`, text.includes('"claim":"PREVIO_SIN_SALTO"'));
  } finally {
    box.cleanup();
  }
}

// ── 4 · Historia inmutable (append-only) ─────────────────────────────────────

function checkAppendOnly() {
  const G = '4.append-only';
  const box = makeSandbox();
  try {
    const first = runAppend(box, 'NL_TEST_HISTORY_A');
    eq(`${G} · primer APPEND Exit 0`, first.status, 0);
    const before = fs.readFileSync(box.ledger, 'utf8');
    const second = runAppend(box, 'NL_TEST_HISTORY_B');
    eq(`${G} · segundo APPEND Exit 0`, second.status, 0);
    const after = fs.readFileSync(box.ledger, 'utf8');

    ok(`${G} · el fichero crece por el final`, after.length > before.length);
    ok(`${G} · los bytes previos no se reescriben`, after.startsWith(before), 'la historia anterior cambió');
    eq(
      `${G} · el claim A aparece exactamente una vez`,
      nonEmptyLines(after).filter((line) => line.includes('NL_TEST_HISTORY_A')).length,
      1,
    );
  } finally {
    box.cleanup();
  }
}

// ── Ejecución ────────────────────────────────────────────────────────────────

checkRealLedger();
checkTerminator();
checkRepair();
checkAppendOnly();

if (SELF_TEST) {
  // Aserción imposible: si sigue en PASS con el canal de fallo roto, el arnés
  // es una fachada y se invierte el veredicto.
  record('self-test · aserción imposible (debe fallar)', false, 'canal de fallo verificado');
}

const total = pass + fail;
console.log('── ARNÉS FALSABLE · LEDGER APPEND-ONLY · TERMINADOR \\n ──');
console.log(`aserciones: ${pass}/${total} · fallos: ${fail}`);
if (fail > 0) {
  for (const line of failures) console.log(`  FAIL · ${line}`);
}
console.log(`LEDGER_NEWLINE=${fail === 0 ? 'PASS' : 'FAIL'}`);
process.exit(fail === 0 ? 0 : 1);
