#!/usr/bin/env node
/**
 * SEC-3 / INV-07 · GUARD DE SECRETOS PÚBLICOS EN EL BUNDLE DEL CLIENTE
 * ---------------------------------------------------------------------------
 * Un `NEXT_PUBLIC_*` o un `VITE_*` se INLINEA en el JavaScript que descarga el
 * navegador: cualquiera lo lee con DevTools. Si la variable contiene una
 * credencial de servidor (Gemini, Telegram, Stripe secret, Firebase admin…),
 * el secreto está comprometido en producción.
 *
 * Este guard convierte esa regla doctrinal en una compuerta ejecutable:
 *   1. Recorre `src/` (código) y los ficheros `.env*` (configuración).
 *   2. Detecta: `process.env.<NEXT_PUBLIC_|VITE_><CREDENCIAL>`, y definiciones
 *      `<NEXT_PUBLIC_|VITE_><CREDENCIAL>=` en cualquier `.env*` versionado.
 *   3. Ignora comentarios del código y líneas de comentario de los `.env*`,
 *      para no fallar por documentación.
 *   4. Lista los `NEXT_PUBLIC_*` que SÍ son legítimos (no secretos) con un
 *      allow-list explícito; cualquier otro prefijo público de una credencial
 *      es un fallo.
 *
 * Exit codes: 0 = 0 fugas · 1 = fuga detectada (SOSPECHOSO, no se firma).
 * Zero-dep · sin red · sólo lectura.
 */
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = process.cwd();
const SCAN_DIR = path.join(ROOT, 'src');

/** Nombres de credencial cuyo prefijo público es SIEMPRE una fuga. */
const SECRET_MARKERS = [
  'GEMINI',
  'TELEGRAM',
  'FIREBASE_ADMIN',
  'SERVICE_ROLE',
  'SECRET',
  'PRIVATE',
  'TOKEN',
  'PASSWORD',
  'API_KEY',
  'MASTER_PIN',
  'WEBHOOK',
];

/**
 * Allow-list auditada: claves públicas por diseño (identificadores de cliente
 * que Stripe/Supabase/Firebase/Mapbox exigen en el navegador). Nada de aquí
 * autoriza a un secreto: si una de estas variables se filtrara con una clave
 * privada, SEC-3 seguiría roto y se rotaría.
 */
const PUBLIC_ALLOWED = new Set([
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
  'NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN',
  'NEXT_PUBLIC_BASE_URL',
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXT_PUBLIC_WHATSAPP_PHONE',
  'NEXT_PUBLIC_STRIPE_SOLISTA_LINK',
  'NEXT_PUBLIC_CLARITY_PROJECT_ID',
]);

const CODE_PATTERN = /process\.env\.((?:NEXT_PUBLIC_|VITE_)[A-Z0-9_]+)/g;
const ENV_DEF_PATTERN = /^\s*((?:NEXT_PUBLIC_|VITE_)[A-Z0-9_]+)\s*=/;

const violations = [];
const scanned = { code: 0, env: 0 };

function isSecretName(name) {
  if (PUBLIC_ALLOWED.has(name)) return false;
  return SECRET_MARKERS.some((marker) => name.includes(marker));
}

function walk(dir) {
  const out = [];
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      out.push(...walk(full));
    } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

/** ¿La línea es un comentario? (`//`, `*`, `/*`, `#`) */
function isComment(line) {
  const trimmed = line.trim();
  return trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*');
}

/** ¿El fichero está versionado en Git? (lo versionado llega al build de Coolify). */
function isGitTracked(relPath) {
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', relPath], {
      cwd: ROOT,
      stdio: ['ignore', 'ignore', 'ignore'],
    });
    return true;
  } catch {
    return false;
  }
}

for (const file of walk(SCAN_DIR)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  scanned.code += 1;
  lines.forEach((line, index) => {
    if (isComment(line)) return;
    for (const match of line.matchAll(CODE_PATTERN)) {
      const name = match[1];
      if (isSecretName(name)) {
        violations.push(`${rel}:${index + 1} · process.env.${name}`);
      }
    }
  });
}

for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isFile() || !entry.name.startsWith('.env')) continue;
  scanned.env += 1;
  const tracked = isGitTracked(entry.name);
  const scope = tracked ? 'VERSIONADO' : 'local';
  const lines = fs.readFileSync(path.join(ROOT, entry.name), 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.trim().startsWith('#')) return;
    const match = line.match(ENV_DEF_PATTERN);
    if (match && isSecretName(match[1])) {
      violations.push(`${entry.name}:${index + 1} · definición ${match[1]} (${scope})`);
    }
  });
}

console.log('SEC-3 / INV-07 · GUARD DE SECRETOS CON PREFIJO PÚBLICO');
console.log('=======================================================');
console.log(`Ficheros de código auditados: ${scanned.code}`);
console.log(`Ficheros .env* auditados    : ${scanned.env}`);
console.log(`Allow-list pública auditada : ${PUBLIC_ALLOWED.size} variables`);
console.log('-------------------------------------------------------');
if (violations.length === 0) {
  console.log('PUBLIC_SECRET_LEAKS=0');
  console.log('RESULTADO: VERIFICADO — 0 credenciales con prefijo público alcanzables por el cliente.');
  process.exit(0);
}
for (const violation of violations) console.log(`FUGA: ${violation}`);
console.log(`PUBLIC_SECRET_LEAKS=${violations.length}`);
console.log('RESULTADO: SOSPECHOSO — retira el prefijo público o pasa la credencial por el servidor.');
process.exit(1);
