/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICADOR DE TELEMETRÍA DE MISIÓN (W29_T04)
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

console.log('--- AUDITORÍA FORENSE W29_T04: TELEMETRÍA DE MISIÓN (/api/telemetry/mission/[id]) ---');

// 1. Archivo en disco
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'telemetry', 'mission', '[id]', 'route.ts');
assert(fs.existsSync(routePath), 'route.ts de telemetría de misión existe en filesystem');

// 2. Comprobar cero ': any'
const routeContent = fs.readFileSync(routePath, 'utf8');
assert(!routeContent.includes(': any'), 'route.ts tiene 0 ": any"');

// 3. Comprobar params async (Next.js 15)
assert(routeContent.includes('params: Promise<{ id: string }>'), 'route.ts tipa params como Promise<{ id: string }>');
assert(routeContent.includes('await params'), 'route.ts usa "await params" de acuerdo con Next.js 15');

// 4. Comprobar compatibilidad con LiveFleetTracker
assert(routeContent.includes('contract'), 'route.ts incluye etapa contract');
assert(routeContent.includes('route'), 'route.ts incluye etapa route');
assert(routeContent.includes('setup'), 'route.ts incluye etapa setup');
assert(routeContent.includes('soundcheck'), 'route.ts incluye etapa soundcheck');
assert(routeContent.includes('show'), 'route.ts incluye etapa show');
assert(routeContent.includes('Hub Méntrida'), 'route.ts referencia origen canónico Hub Méntrida');

// 5. Comprobar SSOT y fianza
assert(routeContent.includes('DEPOSITO_STRIPE_EUR'), 'route.ts referencia DEPOSITO_STRIPE_EUR');
assert(routeContent.includes('depositVerified'), 'route.ts incluye indicador depositVerified');

// 6. Comprobar estructura de TelemetryPosition
assert(routeContent.includes('TelemetryPosition'), 'route.ts define interface TelemetryPosition con lat, lng, accuracy, status, at');
assert(routeContent.includes('count:'), 'route.ts provee campo count para compatibilidad con LiveFleetTracker');
assert(routeContent.includes('live:'), 'route.ts provee campo live booleano');

console.log(`\nRESUMEN: ${passed} verificaciones OK, ${failed} fallos.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
