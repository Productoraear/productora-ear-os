'use strict';

// Replica exacta (CommonJS, sin dependencias) de normalizePhone/isVerifiablePhone
// definidas en src/app/api/vendors/route.ts.

function normalizePhone(raw) {
  if (!raw) return null;
  let cleaned = raw.replace(/[\s\-()]/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = '+' + cleaned.slice(2);
  } else if (/^[6789]\d{8}$/.test(cleaned)) {
    cleaned = '+34' + cleaned;
  }
  if (!/^\+\d{9,15}$/.test(cleaned)) return null;
  return cleaned;
}

function isVerifiablePhone(raw) {
  const normalized = normalizePhone(raw);
  if (normalized === null) return false;
  if (normalized === '+34693693048') return false;
  if (/^\+34(\d)\1{8}$/.test(normalized)) return false;
  return true;
}

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

const cases = [
  ['612 345 678', true],
  ['+34 693 693 048', false],
  ['', false],
  ['000000000', false],
  ['0034612345678', true],
  ['+34666666666', false],
];

for (const [input, expected] of cases) {
  const actual = isVerifiablePhone(input);
  if (actual === expected) {
    passed += 1;
    console.log(`PASS  isVerifiablePhone(${JSON.stringify(input)}) === ${expected}`);
  } else {
    failed += 1;
    console.error(`FAIL  isVerifiablePhone(${JSON.stringify(input)}) === ${actual} (expected ${expected})`);
  }
}

// Guardas de codigo: la ruta no puede re-introducir las fachadas.
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'vendors', 'route.ts');
const routeSource = fs.readFileSync(routePath, 'utf8');

const forbiddenTokens = ['Math.random', 'Proveedor Verificado EAR'];
for (const token of forbiddenTokens) {
  if (routeSource.includes(token)) {
    failed += 1;
    console.error(`FAIL  route.ts contains forbidden token: ${JSON.stringify(token)}`);
  } else {
    passed += 1;
    console.log(`PASS  route.ts does not contain ${JSON.stringify(token)}`);
  }
}

console.log(JSON.stringify({ passed, failed }));

if (failed > 0) {
  process.exit(1);
}
