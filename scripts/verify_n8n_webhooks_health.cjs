/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICADOR DE HEALTH CHECK Y DISPATCHER N8N (W30_T01)
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

console.log('--- AUDITORÍA FORENSE W30_T01: HEALTH CHECK DE WEBHOOKS N8N ---');

// 1. Archivos en filesystem
const dispatcherPath = path.join(__dirname, '..', 'src', 'lib', 'services', 'n8n-dispatcher.ts');
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'webhooks', 'health', 'route.ts');

assert(fs.existsSync(dispatcherPath), 'n8n-dispatcher.ts existe en filesystem');
assert(fs.existsSync(routePath), 'src/app/api/webhooks/health/route.ts existe en filesystem');

// 2. Comprobar cero ': any'
const dispatcherContent = fs.readFileSync(dispatcherPath, 'utf8');
const routeContent = fs.readFileSync(routePath, 'utf8');

assert(!dispatcherContent.includes(': any'), 'n8n-dispatcher.ts tiene 0 ": any"');
assert(!routeContent.includes(': any'), 'route.ts tiene 0 ": any"');

// 3. Comprobar los 7 webhooks canónicos S-Class
const canonicalSlugs = [
    'b2b-quote',
    'stripe-price-lock',
    'finca-partnership',
    'vimume-clinical-report',
    'call-center-intake',
    'autonomous-escalation',
    'executive-kpi-radar',
];

canonicalSlugs.forEach((slug) => {
    assert(routeContent.includes(`'${slug}'`), `route.ts referencia webhook canónico: ${slug}`);
    assert(dispatcherContent.includes(`'${slug}'`), `n8n-dispatcher.ts soporta webhook: ${slug}`);
});

// 4. Comprobar funciones no bloqueantes y DLQ
assert(dispatcherContent.includes('fireAndForgetN8n'), 'n8n-dispatcher.ts exporta fireAndForgetN8n');
assert(dispatcherContent.includes('getDeadLetterQueue'), 'n8n-dispatcher.ts implementa getDeadLetterQueue (DLQ)');
assert(dispatcherContent.includes('buildN8nWebhookUrl'), 'n8n-dispatcher.ts exporta buildN8nWebhookUrl');
assert(dispatcherContent.includes('https://n8n.productoraear.com'), 'n8n-dispatcher.ts define URL base canónica');

// 5. Comprobar Route Handler
assert(routeContent.includes('export async function GET'), 'route.ts exporta GET');
assert(routeContent.includes('NextResponse.json'), 'route.ts devuelve JSON tipado');

console.log(`\nRESUMEN: ${passed} verificaciones OK, ${failed} fallos.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
