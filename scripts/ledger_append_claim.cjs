#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * LEDGER APPEND-ONLY · PROCEDENCIA CRIPTOGRÁFICA DE EJECUCIÓN (EP-4)
 * ════════════════════════════════════════════════════════════════════════════
 * Problema que cierra: hasta hoy cada CLAIM del ledger se escribía a mano con un
 * bloque `editor`, de modo que `sha256` y `exit` eran afirmaciones del agente,
 * no artefactos de la ejecución. Este script EJECUTA el comando, captura su
 * Exit Code real, calcula el SHA-256 del cuerpo de salida y sella el commit
 * exacto (`git rev-parse HEAD`) en la misma línea. Si `--expect-exit` no
 * coincide, la línea se escribe como `SOSPECHOSO` y el proceso sale 1: el
 * ledger nunca puede quedar más verde que la realidad (AF-5).
 *
 * Claves de línea (superset de las ya presentes en el ledger):
 *   claim · state · cmd · exit · url · sha256 · ts · head · source · note · supersedes
 *
 * Uso:
 *   node scripts/ledger_append_claim.cjs --claim=ID --state=VERIFICADO \
 *        --expect-exit=0 --note="detalle" -- npm run typecheck
 *   node scripts/ledger_append_claim.cjs --claim=ID --state=SOSPECHOSO --print -- npm run lint
 *
 *   --print        no escribe en el ledger; solo imprime la quíntupla EP-1
 *   --sha256-file  hashea un artefacto de disco en vez de la salida del comando
 *   --supersedes   ID de la línea anterior que esta refuta o enmienda
 *   --order        acción constitutiva (por defecto APPEND)
 *
 * Exit codes: 0 = línea sellada con el Exit Code esperado · 1 = estado real
 * distinto del esperado (se sella SOSPECHOSO) · 2 = uso incorrecto.
 * Sin dependencias externas: solo `node:fs`, `node:crypto`, `node:child_process`.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const LEDGER_DIR = path.join(ROOT, '.antigravity', 'evidence');
const LEDGER = path.join(LEDGER_DIR, 'ledger.jsonl');

const argv = process.argv.slice(2);
const sep = argv.indexOf('--');
const own = sep === -1 ? argv : argv.slice(0, sep);
const cmdParts = sep === -1 ? [] : argv.slice(sep + 1);

function flag(name, fallback) {
  const hit = own.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}
function switchOn(name) {
  return own.includes(`--${name}`);
}

const CLAIM = (flag('claim', '') || '').trim();
const STATE = (flag('state', '') || '').trim().toUpperCase();
const EXPECT = Number(flag('expect-exit', '0'));
const NOTE = flag('note', '');
const URL = flag('url', '') || null;
const SUPERSEDES = flag('supersedes', '') || null;
const ORDER = flag('order', 'APPEND');
const SHA_FILE = flag('sha256-file', '');
const PRINT_ONLY = switchOn('print');
const ALLOWED = ['VERIFICADO', 'SOSPECHOSO', 'FACHADA', 'SIN_EVIDENCIA'];

if (!CLAIM || !ALLOWED.includes(STATE) || cmdParts.length === 0) {
  console.error('USO: node scripts/ledger_append_claim.cjs --claim=<ID> --state=<ESTADO> -- <comando...>');
  console.error('     estados admitidos por EP-2:', ALLOWED.join(' · '));
  process.exit(2);
}

/** Ejecuta el comando literal del arnés y captura exit + salida combinada. */
function run(command) {
  const startedAt = new Date();
  const isWin = process.platform === 'win32';
  const shell = isWin ? 'cmd.exe' : '/bin/sh';
  const shellArgs = isWin ? ['/d', '/s', '/c', command] : ['-c', command];
  const res = spawnSync(shell, shellArgs, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' },
  });
  const body = `${res.stdout || ''}${res.stderr || ''}`;
  return {
    exitCode: typeof res.status === 'number' ? res.status : 1,
    body,
    elapsedMs: Date.now() - startedAt.getTime(),
    startedAt,
  };
}

/** HEAD exacto: la procedencia se ancla al commit, no a la memoria del agente. */
function headSha() {
  const res = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  const sha = (res.stdout || '').trim();
  return /^[0-9a-f]{40}$/.test(sha) ? sha : null;
}

function sha256Of(fileRel) {
  const abs = path.isAbsolute(fileRel) ? fileRel : path.join(ROOT, fileRel);
  return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex');
}

/**
 * Huérfano conocido: `embedded-postgres` mata el postmaster con `taskkill /F`
 * en Windows sin esperar a que muera el ÁRBOL real. El proceso `postgres.exe`
 * sobrevive con el puerto 55432 escuchando y responde al TCP (de ahí un
 * `alcanzable por TCP` falso), pero su backend falla y todo arnés de PostgreSQL
 * sale SOSPECHOSO por un zombie del arnés — no del producto. Se detecta y se
 * remedia aquí porque el oráculo TCP de `ephemeral-postgres.cjs` no la ve.
 */
const PG_CTL = path.join(ROOT, 'node_modules', '@embedded-postgres', 'windows-x64', 'native', 'bin', 'pg_ctl.exe');
const PG_DATA = path.join(ROOT, 'node_modules', '.cache', 'ear-ephemeral-pg', 'data');
const PG_PORT = Number(process.env.EAR_EPHEMERAL_PG_PORT ?? 55_432);

function portListening(port) {
  const out = spawnSync('netstat', ['-ano'], { encoding: 'utf8' });
  if (!out.stdout) return false;
  return out.stdout.split(/\r?\n/).some((l) => l.includes(`:${port} `) && l.includes('LISTENING'));
}

function ephemeralClusterAlive() {
  if (process.platform !== 'win32') return false;
  if (!fs.existsSync(PG_CTL) || !fs.existsSync(PG_DATA)) return false;
  const res = spawnSync(PG_CTL, ['-D', PG_DATA, 'status'], { encoding: 'utf8' });
  return res.status === 0;
}

/** PIDs dueños del socket en escucha (netstat, formato `TCP host:puerto ... LISTENING pid`). */
function listenerPids(port) {
  const out = spawnSync('netstat', ['-ano'], { encoding: 'utf8' });
  if (!out.stdout) return [];
  const pids = new Set();
  for (const line of out.stdout.split(/\r?\n/)) {
    if (!line.includes(`:${port} `) || !line.includes('LISTENING')) continue;
    const pid = Number(line.trim().split(/\s+/).pop());
    if (Number.isInteger(pid) && pid > 0) pids.add(pid);
  }
  return [...pids];
}

/**
 * Termina un PID con Win32 (OpenProcess/TerminateProcess) porque `taskkill` es
 * ciego a los procesos que ya no están en la lista del SO pero conservan el
 * socket abierto: ese es exactamente el postmaster muerto que envenenaba el
 * puerto 55432 y hacía fallar el arnés F-6 con un diagnóstico falso.
 */
function terminatePid(pid) {
  const script = [
    "Add-Type -Namespace EarHarness -Name Win32 -MemberDefinition '@",
    '[DllImport("kernel32.dll", SetLastError=true)] public static extern System.IntPtr OpenProcess(int access, bool inherit, int pid);',
    '[DllImport("kernel32.dll", SetLastError=true)] public static extern bool TerminateProcess(System.IntPtr h, uint code);',
    '[DllImport("kernel32.dll", SetLastError=true)] public static extern bool CloseHandle(System.IntPtr h);',
    "'@",
    '-ErrorAction SilentlyContinue',
    `$h=[EarHarness.Win32]::OpenProcess(0x1000,$false,${pid})`,
    'if($h -ne [System.IntPtr]::Zero){',
    '  [void][EarHarness.Win32]::TerminateProcess($h,1)',
    '  [void][EarHarness.Win32]::CloseHandle($h)',
    '}',
  ].join('\n');
  spawnSync('powershell.exe', ['-NoProfile', '-Command', script], { encoding: 'utf8' });
}

function reapOrphanCluster() {
  if (!portListening(PG_PORT) || ephemeralClusterAlive()) return null;
  const pids = listenerPids(PG_PORT);
  for (const pid of pids) terminatePid(pid);
  spawnSync('cmd.exe', ['/d', '/s', '/c', `del /f /q "${path.join(PG_DATA, 'postmaster.pid')}"`], { encoding: 'utf8' });
  const stillListening = portListening(PG_PORT);
  return { port: PG_PORT, pids, reaped: !stillListening };
}

const command = cmdParts.join(' ');
const reaped = reapOrphanCluster();
if (reaped) {
  console.log(
    `ARNES: clúster PostgreSQL efímero huérfano en el puerto ${reaped.port} (postmaster muerto, TCP vivo) -> ` +
      `PIDs ${reaped.pids.join(',') || 'sin dueño'} liberados=${reaped.reaped}`
  );
}
const exec = run(command);

let sha256;
let bytes = exec.body.length;
if (SHA_FILE) {
  try {
    sha256 = sha256Of(SHA_FILE);
    const abs = path.isAbsolute(SHA_FILE) ? SHA_FILE : path.join(ROOT, SHA_FILE);
    bytes = fs.statSync(abs).size;
  } catch (err) {
    console.error(`SHA256_FILE_ERROR ${SHA_FILE}: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(2);
  }
} else {
  sha256 = crypto.createHash('sha256').update(exec.body, 'utf8').digest('hex');
}

const exitOk = exec.exitCode === EXPECT;
const finalState = exitOk ? STATE : 'SOSPECHOSO';

const entry = {
  claim: CLAIM,
  promise: NOTE || null,
  state: finalState,
  cmd: command,
  exit: exec.exitCode,
  url: URL,
  sha256,
  sha256_scope: SHA_FILE ? `file:${SHA_FILE}` : 'stdout+stderr',
  bytes,
  ts: exec.startedAt.toISOString(),
  head: headSha(),
  source: 'live',
  elapsed_ms: exec.elapsedMs,
  order: ORDER,
  supersedes: SUPERSEDES,
  note: NOTE || null,
};

const line = JSON.stringify(entry);

console.log('── LEDGER CLAIM (EP-1 quíntupla) ─────────────────────────────');
console.log(
  `CLAIM{${entry.claim}} :: cmd="${entry.cmd}" :: exit=${entry.exit} :: url="${entry.url ?? ''}" :: sha256=${entry.sha256} :: ts=${entry.ts}`
);
console.log(
  `state=${finalState} head=${entry.head ? entry.head.slice(0, 8) : 'SIN_GIT'} scope=${entry.sha256_scope} elapsed=${entry.elapsed_ms}ms`
);

if (PRINT_ONLY) {
  console.log('--print: ledger NO escrito. Línea propuesta:');
  console.log(line);
  process.exit(exitOk ? 0 : 1);
}

fs.mkdirSync(LEDGER_DIR, { recursive: true });
/**
 * ESCRITURA APPEND-ONLY CON TERMINADOR EXPLÍCITO (EP-4).
 *
 * DEFECTO CORREGIDO: hasta esta versión la línea se escribía con un prefijo
 * `\n` CONDICIONAL y SIN sufijo final. El fichero sólo quedaba bien formado
 * mientras el último byte escrito fuese el `}` del JSON. Basta que un escritor
 * previo (editor, redirección de shell sin EOL, tool de terceros) deje el
 * ledger sin salto final para que el siguiente CLAIM se CONCATENE al anterior
 * y produzca una línea no parseable. Aquí el terminador NO es condicional:
 *
 *   1. Se lee el tamaño real del fichero antes de escribir.
 *   2. Si el último byte NO es `\n`, se antepone el separador (repara el fichero).
 *   3. SIEMPRE se sufija `\n`: la línea nueva queda cerrada y el siguiente
 *      APPEND heredará un fichero terminado en salto.
 *
 * Verificado por `node scripts/verify_ledger_append_newline.cjs` (Exit 1 si
 * cualquier línea del ledger queda concatenada o si el fichero no termina
 * en salto de línea).
 */
const NL = '\n';
function endsWithNewline(file) {
  const size = fs.statSync(file).size;
  if (size === 0) return true;
  const fd = fs.openSync(file, 'r');
  try {
    const lastByte = Buffer.alloc(1);
    fs.readSync(fd, lastByte, 0, 1, size - 1);
    return lastByte[0] === 0x0a;
  } finally {
    fs.closeSync(fd);
  }
}

const needsSeparator = fs.existsSync(LEDGER) && fs.statSync(LEDGER).size > 0 && !endsWithNewline(LEDGER);
fs.appendFileSync(LEDGER, `${needsSeparator ? NL : ''}${line}${NL}`, 'utf8');
if (needsSeparator) {
  console.log('LEDGER_REPAIR: el fichero no terminaba en salto de línea; separador explícito antepuesto.');
}
const total = fs.readFileSync(LEDGER, 'utf8').trim().split(/\r?\n/).length;
console.log(`APPEND OK -> .antigravity/evidence/ledger.jsonl (${total} líneas, terminador \\n explícito)`);

if (!exitOk) {
  console.error(`ESTADO REAL ≠ ESPERADO: exit=${exec.exitCode} esperado=${EXPECT} -> sellado SOSPECHOSO (SIG-1).`);
  process.exit(1);
}
process.exit(0);
