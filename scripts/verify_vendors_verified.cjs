'use strict';

// ═══════════════════════════════════════════════════════════════════════════
// W37_T02 — VERIFICADOR ANTI-FACHADA DE /api/vendors
// 1) Réplica exacta (CommonJS, sin dependencias) de normalizePhone /
//    isVerifiablePhone / pickVerifiablePhone de src/app/api/vendors/route.ts.
// 2) Guards de código: la ruta no puede reintroducir fachadas
//    (Math.random, verified: true hardcodeado, generadores de datos fake).
// 3) Auditoría de datos REAL: ninguna partición edge puede exponer
//    verified:true sin un teléfono real verificable.
// Sale con código 1 si alguna aserción falla.
// ═══════════════════════════════════════════════════════════════════════════

const fs = require('fs');
const path = require('path');

const PLACEHOLDER_CANON = '+34693693048';
const PHONE_KEY_RE = /^(phone|telephone|telefono|telefonos|tel|movil|whatsapp|mobile)$/;
const DIACRITICS_RE = /[\u0300-\u036f]/g;

function normalizePhone(raw) {
  if (raw === null || raw === undefined) return null;
  const text = String(raw).trim();
  if (!text) return null;
  let cleaned = text.replace(/[^0-9+]/g, '');
  if (!cleaned) return null;
  if (cleaned.startsWith('00')) {
    cleaned = `+${cleaned.slice(2)}`;
  }
  if (cleaned.startsWith('+')) {
    const digits = cleaned.slice(1);
    if (!/^\d{9,15}$/.test(digits)) return null;
    if (digits.length === 11 && digits.startsWith('34')) return `+34${digits.slice(2)}`;
    return `+${digits}`;
  }
  if (/^34\d{9}$/.test(cleaned)) return `+${cleaned}`;
  if (/^[6789]\d{8}$/.test(cleaned)) return `+34${cleaned}`;
  if (/^\d{9,15}$/.test(cleaned)) return `+${cleaned}`;
  return null;
}

function isVerifiablePhone(raw) {
  const normalized = normalizePhone(raw);
  if (normalized === null) return false;
  if (normalized === PLACEHOLDER_CANON) return false;
  if (/^\+34(\d)\1{8}$/.test(normalized)) return false;
  return true;
}

function isPhoneKey(key) {
  const plain = String(key).normalize('NFD').replace(DIACRITICS_RE, '').toLowerCase();
  return PHONE_KEY_RE.test(plain);
}

function pickVerifiablePhone(record) {
  for (const key of Object.keys(record)) {
    if (!isPhoneKey(key)) continue;
    if (isVerifiablePhone(record[key])) return normalizePhone(record[key]);
  }
  return null;
}

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    passed += 1;
    console.log(`PASS  ${label}`);
  } else {
    failed += 1;
    console.error(`FAIL  ${label}`);
  }
}

// ── 1. Semántica telefónica (la centralita NUNCA es un teléfono verificable) ──
const cases = [
  ['612 345 678', true],
  ['612345678', true],
  ['+34 612 345 678', true],
  ['0034612345678', true],
  ['+34 693 693 048', false],
  ['693693048', false],
  ['0034693693048', false],
  ['+34693693048', false],
  ['', false],
  [null, false],
  [undefined, false],
  ['000000000', false],
  ['+34666666666', false],
  ['666 666 666', false],
  ['12345', false],
];

for (const [input, expected] of cases) {
  const actual = isVerifiablePhone(input);
  check(`isVerifiablePhone(${String(JSON.stringify(input))}) === ${expected}`, actual === expected);
}

// El flag persistido se ignora: solo manda el teléfono real.
check('pickVerifiablePhone descarta registro con solo centralita', pickVerifiablePhone({ phone: '+34 693 693 048', verified: true }) === null);
check('pickVerifiablePhone rescata telefono real en clave alternativa', pickVerifiablePhone({ phone: '+34 693 693 048', telephone: '612 345 678' }) === '+34612345678');

// ── 2. Guards de código sobre la ruta ──
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'vendors', 'route.ts');
const routeSource = fs.readFileSync(routePath, 'utf8');

const forbiddenTokens = ['Math.random', 'Proveedor Verificado EAR', 'verified: true', 'faker', 'Lorem ipsum', 'MOCK_'];
for (const token of forbiddenTokens) {
  check(`route.ts no contiene el token prohibido ${JSON.stringify(token)}`, !routeSource.includes(token));
}
check('route.ts recalcula verified con isVerifiablePhone', routeSource.includes('isVerifiablePhone('));
check('route.ts poda antes de truncar el catálogo (sin slice ciego)', !routeSource.includes('.slice(0, 300)') && routeSource.includes('vendors.length >= MAX_CATALOGUE_VENDORS'));

// ── 3. Auditoría de datos de las particiones edge ──
const EDGE_DIR = path.join(__dirname, '..', 'public', 'data', 'providers');
const EDGE_FILES = [
  'finca.json', 'catering.json', 'musica.json', 'foto.json', 'decoracion.json',
  'servicios.json', 'moda.json', 'transporte.json', 'sonido.json', 'wedding.json', 'senior_care.json',
];

let edgeTotal = 0;
let edgeVerified = 0;
let edgeViolations = 0;

for (const file of EDGE_FILES) {
  const fullPath = path.join(EDGE_DIR, file);
  if (!fs.existsSync(fullPath)) {
    check(`partición edge presente: ${file}`, false);
    continue;
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
  } catch {
    check(`partición edge parseable: ${file}`, false);
    continue;
  }
  if (!Array.isArray(parsed)) {
    check(`partición edge es un array: ${file}`, false);
    continue;
  }
  const violations = parsed.filter((record) => (
    record
    && typeof record === 'object'
    && record.verified === true
    && pickVerifiablePhone(record) === null
  )).length;
  edgeTotal += parsed.length;
  edgeVerified += parsed.filter((record) => record && typeof record === 'object' && record.verified === true).length;
  edgeViolations += violations;
  check(`edge ${file}: ${parsed.length} reg, 0 verified:true sin teléfono real (violaciones=${violations})`, violations === 0);
}

check(`catálogo edge no vacío (verified:true=${edgeVerified} de ${edgeTotal})`, edgeVerified > 0);
check('catálogo edge sin placeholders servidos (0 violaciones globales)', edgeViolations === 0);

// ── 4. End-to-end: el lake que consume /api/vendors produce un roster servible ──
const SSOT_LAKE = path.join(__dirname, '..', 'src', 'data', 'vampirized_providers.json');
if (fs.existsSync(SSOT_LAKE)) {
  const list = JSON.parse(fs.readFileSync(SSOT_LAKE, 'utf8'));
  const roster = [];
  for (const item of list) {
    if (roster.length >= 300) break;
    if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
    const name = typeof item.name === 'string' ? item.name.trim() : '';
    const id = typeof item.id === 'string' ? item.id : (typeof item.slug === 'string' ? item.slug : '');
    if (!name || !id) continue;
    if (pickVerifiablePhone(item) === null) continue;
    roster.push(pickVerifiablePhone(item));
  }
  check(`lake servible: ${roster.length} proveedores verificados (1..300)`, roster.length > 0 && roster.length <= 300);
} else {
  console.log('SKIP  lake vampirized_providers.json ausente (entorno sin ingesta)');
}

console.log(JSON.stringify({
  passed,
  failed,
  edge: { total: edgeTotal, verifiedTrue: edgeVerified, violations: edgeViolations },
}));

if (failed > 0) {
  process.exit(1);
}
