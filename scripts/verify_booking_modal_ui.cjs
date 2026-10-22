#!/usr/bin/env node
'use strict';

/**
 * Verificador del RequestToBookModal (W27_T01_REQUEST_TO_BOOK_MODAL_UI).
 *  - Audita por texto RequestToBookModal.tsx y RequestToBookButton.tsx.
 *  - Exige tokens de accesibilidad (role='dialog', aria-modal, Escape, focus trap)
 *    y de integración real con POST /api/booking/request (PENDING_PROVIDER, requestId).
 *  - Prohíbe ': any' y 'Math.random'.
 * Sale con 1 ante cualquier fallo.
 */

const fs = require('fs');
const path = require('path');

const MODAL_PATH = path.join(
    __dirname,
    '..',
    'src',
    'components',
    'booking',
    'RequestToBookModal.tsx'
);
const BUTTON_PATH = path.join(
    __dirname,
    '..',
    'src',
    'components',
    'booking',
    'RequestToBookButton.tsx'
);

let failures = 0;

function assert(condition, label) {
    if (condition) {
        console.log('PASS:', label);
    } else {
        console.error('FAIL:', label);
        failures += 1;
    }
}

function readSource(filePath, label) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`FAIL: no se pudo leer ${label} (${filePath}): ${err.message}`);
        failures += 1;
        return '';
    }
}

const modalSource = readSource(MODAL_PATH, 'RequestToBookModal.tsx');
const buttonSource = readSource(BUTTON_PATH, 'RequestToBookButton.tsx');

// 1. Integración real con el endpoint de reserva
for (const token of ['/api/booking/request', 'PENDING_PROVIDER', 'requestId']) {
    assert(modalSource.includes(token), `RequestToBookModal.tsx contiene '${token}'`);
}

// 2. Accesibilidad estricta WCAG (role, modal, Escape, focus trap)
for (const token of ['role="dialog"', 'aria-modal="true"', 'Escape', 'keydown', 'focus']) {
    assert(modalSource.includes(token), `RequestToBookModal.tsx contiene '${token}'`);
}

// 3. Botón embebible correctamente conectado al modal
assert(buttonSource.includes('RequestToBookButton'), "RequestToBookButton.tsx exporta RequestToBookButton");
assert(buttonSource.includes('RequestToBookModal'), "RequestToBookButton.tsx importa RequestToBookModal");
assert(buttonSource.includes('aria-haspopup="dialog"'), "RequestToBookButton.tsx declara aria-haspopup='dialog'");

// 4. Cero `any` y cero aleatoriedad en ambos archivos
for (const [source, label] of [
    [modalSource, 'RequestToBookModal.tsx'],
    [buttonSource, 'RequestToBookButton.tsx'],
]) {
    assert(!source.includes(': any'), `${label} NO contiene ': any'`);
    assert(!source.includes('Math.random'), `${label} NO contiene 'Math.random'`);
}

if (failures > 0) {
    console.error(`\n${failures} comprobacion(es) fallaron.`);
    process.exit(1);
}

console.log('\nOK: W27_T01 RequestToBookModal UI verificado.');
process.exit(0);
