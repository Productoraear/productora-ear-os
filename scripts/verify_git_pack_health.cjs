#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DE SALUD DEL EMPAQUETADO GIT — EAR OS v2 · W42_T01 · F0
 * ════════════════════════════════════════════════════════════════════════════
 * Cierra el Hallazgo 9 (INV-15: repo < 50 MB) con MEDICIÓN, no con promesa.
 *
 * Mide cuatro cosas y solo cuatro:
 *   1. Punteros Git LFS en HEAD        → deben ser 0 (si no, el deploy depende de LFS)
 *   2. Bytes huérfanos en .git/lfs/objects → deben ser 0
 *   3. Objetos sueltos (`count`)        → tolerancia 500
 *   4. `size-pack` en MiB              → techo duro 2500 MiB
 *
 * Uso:
 *   node scripts/verify_git_pack_health.cjs              # solo mide (read-only)
 *   node scripts/verify_git_pack_health.cjs --json       # medición + JSON de 1 línea
 *   node scripts/verify_git_pack_health.cjs --remediate  # sancionado por CEO (AMD-1)
 *
 * `--remediate` ejecuta, EN ESTE ORDEN y solo si los punteros LFS son 0:
 *   a) borra recursivamente .git/lfs/objects
 *   b) git reflog expire --expire-unreachable=now --all
 *   c) git gc --prune=now
 *
 * IRREVERSIBLE. Sin sanción expresa del CEO no se pasa el flag.
 * Exit 0 = sano · Exit 1 = defecto medido · Exit 2 = error de entorno.
 * ════════════════════════════════════════════════════════════════════════════
 */
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const ARGS = process.argv.slice(2);
const REMEDIATE = ARGS.includes('--remediate');
const JSON_ONLY = ARGS.includes('--json');

// Umbrales (scorecard W42_T01)
const MAX_PACK_MIB = 2500;
const MAX_LOOSE = 500;
// Cabecera REAL de un puntero Git LFS (línea 1 del fichero, especificación oficial).
// Buscar la cadena suelta produce falsos positivos con cualquier documento que
// cite el comando de sonda — pasó el 2026-10-30 con este mismo informe.
const LFS_POINTER_PATTERN = '^version https://git-lfs[.]github[.]com/spec/v1$';

function git(args, options = {}) {
  return execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    ...options,
  });
}

function gitSoft(args) {
  // Devuelve { ok, out, status }. `git grep` sale con 1 cuando no hay coincidencias:
  // eso NO es un error, es la respuesta buena de esta sonda.
  try {
    const out = git(args, { stdio: ['ignore', 'pipe', 'pipe'] });
    return { ok: true, out, status: 0 };
  } catch (error) {
    return {
      ok: false,
      out: typeof error.stdout === 'string' ? error.stdout : '',
      status: typeof error.status === 'number' ? error.status : 1,
      message: error.message,
    };
  }
}

function resolveGitDir() {
  const raw = git(['rev-parse', '--git-dir']).trim();
  return path.isAbsolute(raw) ? raw : path.join(ROOT, raw);
}

function dirBytes(target) {
  if (!fs.existsSync(target)) return { exists: false, bytes: 0, files: 0 };
  let bytes = 0;
  let files = 0;
  const stack = [target];
  while (stack.length > 0) {
    const current = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const entry of entries) {
      const abs = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(abs);
      } else if (entry.isFile()) {
        try {
          bytes += fs.statSync(abs).size;
          files += 1;
        } catch {
          /* fichero desaparecido durante el barrido: se ignora */
        }
      }
    }
  }
  return { exists: true, bytes, files };
}

function countLfsPointers() {
  // 0 coincidencias ⇒ git grep sale con status 1 ⇒ pointers = 0.
  const probe = gitSoft(['grep', '-l', '-e', LFS_POINTER_PATTERN, 'HEAD']);
  if (probe.status === 1) return 0;
  if (!probe.ok && probe.status !== 1) {
    // 128 = HEAD ilegible; cualquier otro fallo es entorno, no dato.
    if (probe.status === 128) return -1;
  }
  return probe.out
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0).length;
}

function parseCountObjects() {
  const raw = git(['count-objects', '-v']);
  const map = Object.create(null);
  for (const line of raw.split('\n')) {
    const match = line.match(/^([a-z-]+):\s*(.+)$/);
    if (!match) continue;
    map[match[1]] = match[2].trim();
  }
  const num = (key) => {
    const parsed = Number.parseInt(map[key], 10);
    return Number.isFinite(parsed) ? parsed : 0;
  };
  return {
    looseObjects: num('count'),
    looseKiB: num('size'),
    inPack: num('in-pack'),
    packs: num('packs'),
    sizePackKiB: num('size-pack'),
    prunePackable: num('prune-packable'),
    garbage: num('garbage'),
    sizeGarbageKiB: num('size-garbage'),
  };
}

function measure() {
  const gitDir = resolveGitDir();
  const lfsDir = path.join(gitDir, 'lfs', 'objects');
  const lfs = dirBytes(lfsDir);
  const counts = parseCountObjects();
  const sizePackMiB = Number((counts.sizePackKiB / 1024).toFixed(2));
  const lfsPointersInHead = countLfsPointers();
  const gitDirBytes = dirBytes(gitDir).bytes;

  const checks = [
    {
      id: 'LFS_POINTERS_IN_HEAD',
      pass: lfsPointersInHead === 0,
      detail: `${lfsPointersInHead} puntero(s)`,
      rule: '=== 0',
    },
    {
      id: 'LFS_ORPHAN_BYTES',
      pass: lfs.bytes === 0,
      detail: `${(lfs.bytes / (1024 * 1024)).toFixed(2)} MiB en .git/lfs/objects`,
      rule: '=== 0',
    },
    {
      id: 'LOOSE_OBJECTS',
      pass: counts.looseObjects <= MAX_LOOSE,
      detail: `${counts.looseObjects} objeto(s) suelto(s)`,
      rule: `<= ${MAX_LOOSE}`,
    },
    {
      id: 'SIZE_PACK_MIB',
      pass: sizePackMiB < MAX_PACK_MIB,
      detail: `${sizePackMiB} MiB en ${counts.packs} pack(s)`,
      rule: `< ${MAX_PACK_MIB}`,
    },
  ];

  return {
    gitDir,
    lfsDir,
    lfsPointersInHead,
    lfsOrphanBytes: lfs.bytes,
    lfsOrphanFiles: lfs.files,
    gitDirMiB: Number((gitDirBytes / (1024 * 1024)).toFixed(2)),
    sizePackMiB,
    counts,
    checks,
    failed: checks.filter((check) => !check.pass).map((check) => check.id),
  };
}

function runGitStep(label, args) {
  process.stdout.write(`[STEP] ${label} -> git ${args.join(' ')}\n`);
  const started = Date.now();
  const result = gitSoft(args);
  const ms = Date.now() - started;
  if (!result.ok && result.status !== 1) {
    process.stdout.write(`[WARN] ${label} salio con status ${result.status} (${ms} ms)\n`);
    return false;
  }
  process.stdout.write(`[OK]   ${label} (${ms} ms)\n`);
  return true;
}

function remediate() {
  const before = measure();

  process.stdout.write('[1/3] Sonda previa de punteros LFS en HEAD\n');
  if (before.lfsPointersInHead !== 0) {
    process.stdout.write(
      `[ABORT] ${before.lfsPointersInHead} puntero(s) LFS en HEAD: borrar .git/lfs/objects romperia el deploy. Purga cancelada.\n`,
    );
    return false;
  }
  process.stdout.write('[OK]   0 punteros LFS en HEAD: el arbol no depende de LFS\n');

  process.stdout.write('[2/3] Purga de restos LFS huerfanos\n');
  if (fs.existsSync(before.lfsDir)) {
    const removed = dirBytes(before.lfsDir);
    fs.rmSync(before.lfsDir, { recursive: true, force: true });
    process.stdout.write(
      `[OK]   .git/lfs/objects eliminado (${removed.files} fichero(s), ${(removed.bytes / (1024 * 1024)).toFixed(2)} MiB)\n`,
    );
  } else {
    process.stdout.write('[OK]   .git/lfs/objects no existe: nada que purgar\n');
  }

  process.stdout.write('[3/3] Purga de objetos inalcanzables (sancionada por CEO, AMD-1)\n');
  const reflogOk = runGitStep('reflog expire --expire-unreachable=now --all', [
    'reflog',
    'expire',
    '--expire-unreachable=now',
    '--all',
  ]);
  const gcOk = runGitStep('gc --prune=now', ['gc', '--prune=now']);

  return reflogOk && gcOk;
}

function printTable(result, header) {
  process.stdout.write(`\n${header}\n`);
  process.stdout.write('--------------------------------------------------------------\n');
  for (const check of result.checks) {
    const tag = check.pass ? '[OK]  ' : '[FAIL]';
    process.stdout.write(
      `${tag} ${check.id.padEnd(22)} ${String(check.detail).padEnd(30)} ${check.rule}\n`,
    );
  }
  process.stdout.write('--------------------------------------------------------------\n');
  process.stdout.write(
    `git-dir=${result.gitDirMiB} MiB · size-pack=${result.sizePackMiB} MiB · in-pack=${result.counts.inPack} · packs=${result.counts.packs} · loose=${result.counts.looseObjects} · garbage=${result.counts.garbage}\n`,
  );
}

function main() {
  // Validacion de entorno: si esto no es un repo git, no hay nada que medir.
  const probe = gitSoft(['rev-parse', '--is-inside-work-tree']);
  if (!probe.ok || probe.out.trim() !== 'true') {
    process.stdout.write(
      'SUMMARY ' + JSON.stringify({ exit_code: 2, error: 'NOT_A_GIT_WORK_TREE', cwd: ROOT }) + '\n',
    );
    process.exit(2);
  }

  const before = measure();
  printTable(before, 'SALUD GIT - MEDICION PREVIA');

  let baselinePackMiB = before.sizePackMiB;
  let result = before;
  let remediationOk = false;

  if (REMEDIATE) {
    remediationOk = remediate();
    result = measure();
    printTable(result, 'SALUD GIT - MEDICION POSTERIOR');
    process.stdout.write(
      `[DELTA] size-pack ${baselinePackMiB} MiB -> ${result.sizePackMiB} MiB (${(baselinePackMiB - result.sizePackMiB).toFixed(2)} MiB recuperados)\n`,
    );
  }

  const summary = {
    exit_code: result.failed.length === 0 ? 0 : 1,
    lfsPointersInHead: result.lfsPointersInHead,
    lfsOrphanBytes: result.lfsOrphanBytes,
    looseObjects: result.counts.looseObjects,
    sizePackMiB: result.sizePackMiB,
    savedMiB: Number((baselinePackMiB - result.sizePackMiB).toFixed(2)),
    inPack: result.counts.inPack,
    packs: result.counts.packs,
    gitDirMiB: result.gitDirMiB,
    remediate: REMEDIATE,
    remediationOk,
    checks: result.checks.length,
    failed: result.failed,
  };

  if (!JSON_ONLY) {
    const verdict = result.failed.length === 0 ? '[SANEADO]' : '[BLOQUEO]';
    const detail =
      result.failed.length === 0 ? 'las 4 puertas en verde' : result.failed.join(', ');
    process.stdout.write(`\n${verdict} Salud de empaquetado: ${detail}\n`);
  }
  process.stdout.write('SUMMARY ' + JSON.stringify(summary) + '\n');
  process.exit(summary.exit_code);
}

main();
