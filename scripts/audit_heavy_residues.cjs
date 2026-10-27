#!/usr/bin/env node
/**
 * 🧹 AUDITOR DE RESIDUOS PESADOS (EAR OS · HIGIENE DE DISCO SIN RIESGO)
 * ---------------------------------------------------------------------------
 * Clasifica los ficheros pesados del árbol de trabajo y decide cuáles pueden
 * evacuar a la bóveda externa SIN romper builds ni código:
 *
 *   - tracked   : versionado en Git  -> JAMÁS se mueve.
 *   - ignored   : cubierto por .gitignore -> no viaja en el build de Coolify.
 *   - references: menciones del nombre/ruta en el código versionado.
 *
 * Solo se evacua un fichero si es `ignored` Y tiene CERO referencias.
 * Los referenciados desde código se quedan (la doctrina permite datos
 * pesados gitignored) y se reportan como deuda P1.
 *
 * Uso:
 *   node scripts/audit_heavy_residues.cjs                 (auditoría)
 *   node scripts/audit_heavy_residues.cjs --move          (evacua los seguros)
 *   node scripts/audit_heavy_residues.cjs --min-mb=5      (umbral)
 * ---------------------------------------------------------------------------
 */

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = process.cwd();
const VAULT_DIR = 'D:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\RESIDUOS_PROJECT_CLEANUP_2026';
const SKIP_DIRS = new Set(['.git', 'node_modules', '.next', '.vercel', '.firebase', '.models', '.omni_tmp']);
const NEVER_MOVE_PREFIXES = ['public/', 'prisma/', 'src/app/', 'src/components/', 'src/lib/', 'src/hooks/', '.env'];

const args = process.argv.slice(2);
const shouldMove = args.includes('--move');
const minMbArg = args.find((arg) => arg.startsWith('--min-mb='));
const requestedMb = minMbArg ? Number(minMbArg.split('=')[1]) : 10;
const MIN_MB = Number.isFinite(requestedMb) && requestedMb > 0 ? requestedMb : 10;
const MIN_BYTES = MIN_MB * 1024 * 1024;

function git(argsList) {
  try {
    return execFileSync('git', argsList, {
      cwd: ROOT,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch (error) {
    return typeof error.stdout === 'string' ? error.stdout : '';
  }
}

const tracked = new Set(
  git(['ls-files', '-z'])
    .split('\u0000')
    .filter((entry) => entry.length > 0),
);

function walk(dir, output) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return output;
  }
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) walk(absolute, output);
      continue;
    }
    if (!entry.isFile()) continue;
    let size = 0;
    try {
      size = fs.statSync(absolute).size;
    } catch {
      continue;
    }
    if (size < MIN_BYTES) continue;
    output.push({
      absolute,
      relative: path.relative(ROOT, absolute).split(path.sep).join('/'),
      bytes: size,
    });
  }
  return output;
}

function isIgnored(relative) {
  try {
    execFileSync('git', ['check-ignore', '-q', '--', relative], { cwd: ROOT, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function findReferences(relative, haystack) {
  const basename = path.basename(relative);
  const withoutExtension = basename.includes('.') ? basename.slice(0, basename.lastIndexOf('.')) : basename;
  const needles = [relative, basename, withoutExtension].filter((needle) => needle.length > 3);
  return needles.some((needle) => haystack.includes(needle)) ? ['código versionado'] : [];
}

/* ── Índice de referencias (una sola pasada, sin spawn por fichero) ─────── */
const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.cjs', '.mjs', '.json', '.prisma',
  '.yml', '.yaml', '.md', '.html', '.css', '.toml', '.ps1', '.bat', '.sh',
]);

const haystack = [];
for (const relative of tracked) {
  if (!TEXT_EXTENSIONS.has(path.extname(relative).toLowerCase())) continue;
  const absolute = path.join(ROOT, relative.split('/').join(path.sep));
  try {
    if (fs.statSync(absolute).size > 3 * 1024 * 1024) continue;
    haystack.push(fs.readFileSync(absolute, 'utf8'));
  } catch {
    /* fichero ilegible: se ignora */
  }
}
const haystackText = haystack.join('\n');

/* ── Clasificación ──────────────────────────────────────────────────────── */
const candidates = walk(ROOT, [])
  .filter((file) => !tracked.has(file.relative))
  .sort((a, b) => b.bytes - a.bytes);

const report = candidates.map((file) => {
  const ignored = isIgnored(file.relative);
  const references = findReferences(file.relative, haystackText);
  const doctrineProtected = NEVER_MOVE_PREFIXES.some((prefix) => file.relative.startsWith(prefix));
  return {
    path: file.relative,
    mb: Math.round((file.bytes / (1024 * 1024)) * 10) / 10,
    ignored,
    references: references.slice(0, 3),
    movable: ignored && references.length === 0 && !doctrineProtected,
  };
});

const round = (value) => Math.round(value * 10) / 10;
const totalMb = round(report.reduce((sum, item) => sum + item.mb, 0));
const movable = report.filter((item) => item.movable);
const movableMb = round(movable.reduce((sum, item) => sum + item.mb, 0));

console.log('── AUDITORÍA DE RESIDUOS PESADOS ───────────────────────────────');
console.log(`umbral      : ${MIN_MB} MB`);
console.log(`candidatos  : ${report.length} (${totalMb} MB no versionados)`);
console.log(`evacuables  : ${movable.length} (${movableMb} MB)`);
console.log('');
for (const item of report) {
  const flag = item.movable ? 'MOVER' : item.references.length > 0 ? 'REFERENCIADO' : 'PROTEGIDO';
  console.log(`${flag.padEnd(13)} ${String(item.mb).padStart(7)} MB  ${item.path}`);
  if (item.references.length > 0) console.log(`              ↳ refs: ${item.references.join(', ')}`);
}

if (!shouldMove) {
  console.log('\nModo auditoría. Ejecuta con --move para evacuar los ficheros MOVER a la bóveda.');
  process.exit(0);
}

/* ── Evacuación con manifiesto ──────────────────────────────────────────── */
if (!fs.existsSync(VAULT_DIR)) fs.mkdirSync(VAULT_DIR, { recursive: true });

const manifestPath = path.join(VAULT_DIR, 'MANIFEST.json');
const manifest = fs.existsSync(manifestPath)
  ? JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  : { createdAt: new Date().toISOString(), root: ROOT, entries: [] };

let movedCount = 0;
let movedMb = 0;

for (const item of movable) {
  const source = path.join(ROOT, item.path.split('/').join(path.sep));
  const target = path.join(VAULT_DIR, item.path.split('/').join(path.sep));
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.renameSync(source, target);
  manifest.entries.push({ from: item.path, to: target, mb: item.mb, movedAt: new Date().toISOString() });
  movedCount += 1;
  movedMb += item.mb;
  console.log(`✔ evacuado: ${item.path} -> ${target}`);
}

manifest.updatedAt = new Date().toISOString();
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`\nEvacuados ${movedCount} ficheros (${round(movedMb)} MB) a ${VAULT_DIR}`);
console.log(`Manifiesto forense: ${manifestPath}`);
process.exit(0);

