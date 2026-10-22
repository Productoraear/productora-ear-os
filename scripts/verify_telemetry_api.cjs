#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROUTE = path.join(
  __dirname,
  '..',
  'src',
  'app',
  'api',
  'telemetry',
  '[id]',
  'route.ts',
);

const source = fs.readFileSync(ROUTE, 'utf8');

const REQUIRED = ['await params', 'TELEMETRY_PROVIDER_TOKEN', '503', '422', 'fireAndForgetN8n'];
const FORBIDDEN = ['Math.random', ': any'];

let failed = false;

for (const token of REQUIRED) {
  if (source.includes(token)) {
    console.log(`OK: contiene '${token}'`);
  } else {
    console.error(`FAIL: falta '${token}' en route.ts`);
    failed = true;
  }
}

for (const token of FORBIDDEN) {
  if (source.includes(token)) {
    console.error(`FAIL: '${token}' prohibido presente en route.ts`);
    failed = true;
  } else {
    console.log(`OK: no contiene '${token}'`);
  }
}

if (failed) {
  process.exit(1);
}

console.log('verify_telemetry_api: PASS');
