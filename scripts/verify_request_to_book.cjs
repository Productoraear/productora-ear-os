#!/usr/bin/env node
'use strict';

/**
 * Verificador del endpoint Request-to-Book (W26_T04_REQUEST_TO_BOOK_API).
 *  - Replica la función de requestId y comprueba idempotencia.
 *  - Audita por texto el route.ts (contiene '202', '422', 'call-center-intake',
 *    'createHash'; NO contiene 'stripe' ni ': any').
 * Sale con 1 ante cualquier fallo.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROUTE_PATH = path.join(
    __dirname,
    '..',
    'src',
    'app',
    'api',
    'booking',
    'request',
    'route.ts'
);

function buildRequestId(providerId, eventDate, clientPhone) {
    return (
        'REQ-' +
        crypto
            .createHash('sha256')
            .update(providerId + eventDate + clientPhone)
            .digest('hex')
            .slice(0, 12)
            .toUpperCase()
    );
}

let failures = 0;

function assert(condition, label) {
    if (condition) {
        console.log('PASS:', label);
    } else {
        console.error('FAIL:', label);
        failures += 1;
    }
}

// 1. Idempotencia del requestId
const a = buildRequestId('p-001', '2026-12-24T20:00:00.000Z', '+34693693048');
const b = buildRequestId('p-001', '2026-12-24T20:00:00.000Z', '+34693693048');
assert(a === b, 'idempotencia: misma solicitud -> mismo id');
assert(a.startsWith('REQ-'), 'requestId lleva prefijo REQ-');
assert(a.length === 16, 'requestId tiene longitud REQ- + 12 hex');

const c = buildRequestId('p-001', '2026-12-24T20:00:00.000Z', '+34600000001');
assert(a !== c, 'telefono distinto -> id distinto');

// 2. Auditoría por texto del route.ts
let source;
try {
    source = fs.readFileSync(ROUTE_PATH, 'utf8');
} catch (err) {
    console.error('FAIL: no se pudo leer', ROUTE_PATH, err.message);
    process.exit(1);
}

for (const token of ['202', '422', 'call-center-intake', 'createHash']) {
    assert(source.includes(token), `route.ts contiene '${token}'`);
}

const lower = source.toLowerCase();
assert(!lower.includes('stripe'), "route.ts NO contiene 'stripe' (case-insensitive)");
assert(!source.includes(': any'), "route.ts NO contiene ': any'");

if (failures > 0) {
    console.error(`\n${failures} comprobacion(es) fallaron.`);
    process.exit(1);
}

console.log('\nOK: W26_T04 Request-to-Book verificado.');
process.exit(0);
