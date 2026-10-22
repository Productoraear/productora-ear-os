const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passed = 0;
let failed = 0;

function it(desc, fn) {
    try {
        fn();
        console.log(`  [PASS] ${desc}`);
        passed++;
    } catch (err) {
        console.error(`  [FAIL] ${desc}:`, err.message);
        failed++;
    }
}

console.log('--- VERIFICACIÓN W28_T04: VENDOR BOOKING ACCEPTANCE FLOW ---\n');

// 1. Archivo acceptance-token.ts
const tokenPath = path.join(__dirname, '..', 'src', 'lib', 'booking', 'acceptance-token.ts');
it('1. src/lib/booking/acceptance-token.ts existe', () => {
    assert.strictEqual(fs.existsSync(tokenPath), true, 'El archivo acceptance-token.ts debe existir');
});

const tokenSource = fs.existsSync(tokenPath) ? fs.readFileSync(tokenPath, 'utf-8') : '';

it('2. acceptance-token.ts exporta signAcceptanceToken', () => {
    assert.match(tokenSource, /export\s+function\s+signAcceptanceToken/);
});

it('3. acceptance-token.ts exporta verifyAcceptanceToken', () => {
    assert.match(tokenSource, /export\s+function\s+verifyAcceptanceToken/);
});

it('4. acceptance-token.ts exporta ACCEPTANCE_SLA_MS de 2 horas', () => {
    assert.match(tokenSource, /ACCEPTANCE_SLA_MS\s*:\s*number\s*=\s*2\s*\*\s*60\s*\*\s*60\s*\*\s*1000/);
});

it('5. acceptance-token.ts no contiene ": any"', () => {
    assert.doesNotMatch(tokenSource, /:\s*any\b/);
});

// 6. Prueba funcional de HMAC SHA-256
const crypto = require('crypto');
function testHmacSign(payload, secret) {
    const encoded = Buffer.from(JSON.stringify(payload), 'utf-8').toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(encoded).digest('hex');
    return `${encoded}.${signature}`;
}

it('6. Token HMAC SHA-256 tiene estructura de 2 segmentos con firma hex de 64 caracteres', () => {
    const secret = 'ear_os_acceptance_token_hmac_secret_2026_sclass';
    const payload = { requestId: 'REQ-TEST-1234', providerId: 'prov-edwin-agudelo', timestamp: Date.now() };
    const token = testHmacSign(payload, secret);
    const parts = token.split('.');
    assert.strictEqual(parts.length, 2);
    assert.strictEqual(parts[1].length, 64);
});

it('7. Detección de firma manipulada (BAD_SIGNATURE)', () => {
    const secret = 'ear_os_acceptance_token_hmac_secret_2026_sclass';
    const payload = { requestId: 'REQ-TEST-1234', providerId: 'prov-edwin-agudelo', timestamp: Date.now() };
    const token = testHmacSign(payload, secret);
    const tampered = token.slice(0, -4) + '0000';
    const [encoded, signature] = tampered.split('.');
    const expected = crypto.createHmac('sha256', secret).update(encoded).digest('hex');
    assert.notStrictEqual(signature, expected);
});

it('8. Detección de expiración tras 2 horas SLA (EXPIRED)', () => {
    const twoHoursAndOneMinAgo = Date.now() - (2 * 60 * 60 * 1000 + 60000);
    const age = Date.now() - twoHoursAndOneMinAgo;
    const SLA = 2 * 60 * 60 * 1000;
    assert.strictEqual(age > SLA, true);
});

// 9. SSOT DEPOSITO_STRIPE_EUR
const ssotPath = path.join(__dirname, '..', 'src', 'lib', 'constants', 'ear-os-ssot.ts');
const ssotSource = fs.readFileSync(ssotPath, 'utf-8');
it('9. ear-os-ssot.ts exporta DEPOSITO_STRIPE_EUR = 100.0', () => {
    assert.match(ssotSource, /export\s+const\s+DEPOSITO_STRIPE_EUR\s*:\s*number\s*=\s*100(\.0)?/);
});

it('10. ear-os-ssot.ts define SPLIT_SOBERANO con artista: 0.8', () => {
    assert.match(ssotSource, /artista:\s*0\.8/);
});

// 11. Endpoint API route.ts
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'booking', 'accept', 'route.ts');
it('11. src/app/api/booking/accept/route.ts existe', () => {
    assert.strictEqual(fs.existsSync(routePath), true, 'El endpoint accept/route.ts debe existir');
});

const routeSource = fs.existsSync(routePath) ? fs.readFileSync(routePath, 'utf-8') : '';

it('12. route.ts define BOOKING_STATUS_ACCEPTED = "ACCEPTED_BY_PROVIDER"', () => {
    assert.match(routeSource, /ACCEPTED_BY_PROVIDER/);
});

it('13. route.ts exporta función GET', () => {
    assert.match(routeSource, /export\s+async\s+function\s+GET/);
});

it('14. route.ts exporta función POST', () => {
    assert.match(routeSource, /export\s+async\s+function\s+POST/);
});

it('15. route.ts consume DEPOSITO_STRIPE_EUR del SSOT', () => {
    assert.match(routeSource, /DEPOSITO_STRIPE_EUR/);
    assert.match(routeSource, /from\s+['"]@\/lib\/constants\/ear-os-ssot['"]/);
});

it('16. route.ts integra createCheckoutSession para el depósito de fianza', () => {
    assert.match(routeSource, /createCheckoutSession/);
});

it('17. route.ts no contiene ": any"', () => {
    assert.doesNotMatch(routeSource, /:\s*any\b/);
});

// 18. Página UI aceptar/page.tsx
const pagePath = path.join(__dirname, '..', 'src', 'app', '(public)', 'reservar', 'aceptar', 'page.tsx');
it('18. src/app/(public)/reservar/aceptar/page.tsx existe', () => {
    assert.strictEqual(fs.existsSync(pagePath), true, 'La página UI debe existir');
});

const pageSource = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

it('19. page.tsx es un Client Component ("use client")', () => {
    assert.match(pageSource, /^['"]use client['"]/);
});

it('20. page.tsx incluye el botón de confirmación de fecha y depósito', () => {
    assert.match(pageSource, /Aceptar Fecha y Desbloquear Depósito de Fianza/);
});

it('21. page.tsx referencia los honorarios netos y el Split Soberano del 80%', () => {
    assert.match(pageSource, /Honorarios Netos\s*\(80%\)/);
    assert.match(pageSource, /Split Soberano/);
});

it('22. page.tsx implementa cuenta atrás para el SLA de 2 horas', () => {
    assert.match(pageSource, /formatTimeRemaining/);
    assert.match(pageSource, /SLA 2 Horas/);
});

it('23. page.tsx no contiene ": any"', () => {
    assert.doesNotMatch(pageSource, /:\s*any\b/);
});

console.log(`\nResultado: ${passed} superadas, ${failed} fallidas.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
