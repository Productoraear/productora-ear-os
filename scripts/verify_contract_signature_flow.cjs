/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICADOR DE FIRMA DIGITAL Y CONTRATO (/reservar/contrato) (W29_T02)
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  [FAIL] ${message}`);
        failed++;
    }
}

console.log('--- AUDITORÍA FORENSE W29_T02: FIRMA DIGITAL Y CONTRATO ---');

// 1. Archivos en disco
const padPath = path.join(__dirname, '..', 'src', 'components', 'booking', 'DigitalSignaturePad.tsx');
const pagePath = path.join(__dirname, '..', 'src', 'app', '(public)', 'reservar', 'contrato', 'page.tsx');

assert(fs.existsSync(padPath), 'DigitalSignaturePad.tsx existe en filesystem');
assert(fs.existsSync(pagePath), 'src/app/(public)/reservar/contrato/page.tsx existe en filesystem');

// 2. Comprobar cero ': any'
const padContent = fs.readFileSync(padPath, 'utf8');
const pageContent = fs.readFileSync(pagePath, 'utf8');

assert(!padContent.includes(': any'), 'DigitalSignaturePad.tsx tiene 0 ": any"');
assert(!pageContent.includes(': any'), 'page.tsx tiene 0 ": any"');

// 3. Comprobar DigitalSignaturePad
assert(padContent.includes('export function DigitalSignaturePad'), 'DigitalSignaturePad exporta función componente');
assert(padContent.includes('HTMLCanvasElement'), 'DigitalSignaturePad interactúa con HTMLCanvasElement');
assert(padContent.includes('SHA-256'), 'DigitalSignaturePad incluye sellado SHA-256');
assert(padContent.includes('base64'), 'DigitalSignaturePad procesa base64 de la firma');

// 4. Comprobar page.tsx
assert(pageContent.includes('DEPOSITO_STRIPE_EUR'), 'page.tsx referencia DEPOSITO_STRIPE_EUR');
assert(pageContent.includes('SPLIT_SOBERANO'), 'page.tsx referencia SPLIT_SOBERANO');
assert(pageContent.includes('Art. 1255 Código Civil'), 'page.tsx referencia marco legal Art. 1255');
assert(pageContent.includes('DigitalSignaturePad'), 'page.tsx embebe DigitalSignaturePad');
assert(pageContent.includes('Suspense'), 'page.tsx envuelve useSearchParams en Suspense para Next.js 15');
assert(pageContent.includes('sha256'), 'page.tsx almacena y muestra el hash SHA-256 de rúbrica');

console.log(`\nRESUMEN: ${passed} verificaciones OK, ${failed} fallos.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
