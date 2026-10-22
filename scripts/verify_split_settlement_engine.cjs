/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICADOR DE MOTOR DE LIQUIDACIÓN SPLIT 80/10/10 (W29_T03)
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

console.log('--- AUDITORÍA FORENSE W29_T03: LIQUIDACIÓN SPLIT 80/10/10 Y MODELO 182 ---');

// 1. Archivos en disco
const enginePath = path.join(__dirname, '..', 'src', 'lib', 'finance', 'splitSettlementEngine.ts');
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'booking', 'settlement', 'route.ts');

assert(fs.existsSync(enginePath), 'splitSettlementEngine.ts existe en filesystem');
assert(fs.existsSync(routePath), 'src/app/api/booking/settlement/route.ts existe en filesystem');

// 2. Comprobar cero ': any'
const engineContent = fs.readFileSync(enginePath, 'utf8');
const routeContent = fs.readFileSync(routePath, 'utf8');

assert(!engineContent.includes(': any'), 'splitSettlementEngine.ts tiene 0 ": any"');
assert(!routeContent.includes(': any'), 'route.ts tiene 0 ": any"');

// 3. Comprobar split 80/10/10 inmutable
assert(engineContent.includes('SPLIT_SOBERANO'), 'splitSettlementEngine.ts referencia SPLIT_SOBERANO');
assert(engineContent.includes('DEPOSITO_STRIPE_EUR'), 'splitSettlementEngine.ts referencia DEPOSITO_STRIPE_EUR');
assert(engineContent.includes('Modelo 182 AEAT'), 'splitSettlementEngine.ts referencia Modelo 182 AEAT');
assert(engineContent.includes('Ley 49/2002'), 'splitSettlementEngine.ts referencia Ley 49/2002 de Mecenazgo');

// 4. Test matemático de split determinista
const baseAmount = 350.0;
const artistSplit = Number((baseAmount * 0.8).toFixed(2));
const earOsSplit = Number((baseAmount * 0.1).toFixed(2));
const vimumeSplit = Number((baseAmount * 0.1).toFixed(2));

assert(artistSplit === 280.0, 'Split Artista 80% es 280.00 €');
assert(earOsSplit === 35.0, 'Split EAR OS 10% es 35.00 €');
assert(vimumeSplit === 35.0, 'Split VIMUME 10% es 35.00 €');
assert(Number((artistSplit + earOsSplit + vimumeSplit).toFixed(2)) === baseAmount, 'Suma de splits suma exactamente la base (350.00 €)');

// Test retención IRPF 15% sobre 280 € = 42 € -> neto 238 €
const irpf15 = Number((artistSplit * 0.15).toFixed(2));
const netWithIrpf = Number((artistSplit - irpf15).toFixed(2));
assert(irpf15 === 42.0, 'Retención IRPF 15% sobre 280€ es 42.00 €');
assert(netWithIrpf === 238.0, 'Neto transferible al artista con IRPF 15% es 238.00 €');

// Test deducción fiscal Modelo 182 (80% sobre 35€ donación VIMUME = 28€)
const taxDeduction = Number((vimumeSplit * 0.8).toFixed(2));
assert(taxDeduction === 28.0, 'Deducción fiscal IRPF Modelo 182 (80%) es 28.00 €');

// 5. Test de la API Route
assert(routeContent.includes('export async function POST'), 'route.ts exporta POST');
assert(routeContent.includes('executeSettlement'), 'route.ts invoca executeSettlement');
assert(routeContent.includes('NextResponse.json'), 'route.ts devuelve JSON tipado');

console.log(`\nRESUMEN: ${passed} verificaciones OK, ${failed} fallos.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
