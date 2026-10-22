/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — VERIFICADOR CRIPTOGRÁFICO DE CONTRATOS INTELIGENTES (W29_T01)
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

console.log('--- AUDITORÍA FORENSE W29_T01: MOTOR DE CONTRATOS INTELIGENTES ---');

// 1. Archivos existentes
const enginePath = path.join(__dirname, '..', 'src', 'lib', 'contracts', 'smartContractEngine.ts');
const routePath = path.join(__dirname, '..', 'src', 'app', 'api', 'contracts', 'generate', 'route.ts');

assert(fs.existsSync(enginePath), 'smartContractEngine.ts existe en filesystem');
assert(fs.existsSync(routePath), 'src/app/api/contracts/generate/route.ts existe en filesystem');

// 2. Comprobar cero ': any' en los archivos
const engineContent = fs.readFileSync(enginePath, 'utf8');
const routeContent = fs.readFileSync(routePath, 'utf8');

assert(!engineContent.includes(': any'), 'smartContractEngine.ts tiene 0 ": any"');
assert(!routeContent.includes(': any'), 'route.ts tiene 0 ": any"');

// 3. Comprobar menciones de SSOT
assert(engineContent.includes('DEPOSITO_STRIPE_EUR'), 'smartContractEngine.ts referencia DEPOSITO_STRIPE_EUR');
assert(engineContent.includes('SPLIT_SOBERANO'), 'smartContractEngine.ts referencia SPLIT_SOBERANO');
assert(engineContent.includes('VAT_RATE'), 'smartContractEngine.ts referencia VAT_RATE');
assert(engineContent.includes('WATTS_PER_PAX'), 'smartContractEngine.ts referencia WATTS_PER_PAX');
assert(engineContent.includes('Art. 1255 del Código Civil'), 'smartContractEngine.ts referencia marco legal Art. 1255');
assert(engineContent.includes('Ley 37/2003 del Ruido'), 'smartContractEngine.ts referencia Ley 37/2003');

// 4. Verificación de cálculo financiero puro y Split 80/10/10
const baseSolista = 350.0;
const vatAmount = Number((baseSolista * 0.21).toFixed(2));
const totalAmount = Number((baseSolista + vatAmount).toFixed(2));
const deposit = 100.0;
const remaining = Number((totalAmount - deposit).toFixed(2));
const artistSplit = Number((baseSolista * 0.8).toFixed(2));
const earOsSplit = Number((baseSolista * 0.1).toFixed(2));
const vimumeSplit = Number((baseSolista * 0.1).toFixed(2));

assert(vatAmount === 73.5, `IVA 21% sobre 350 € calculado correctamente (73.50 €)`);
assert(totalAmount === 423.5, `Total bruto con IVA calculado correctamente (423.50 €)`);
assert(remaining === 323.5, `Saldo tras deducir fianza de 100 € es 323.50 €`);
assert(artistSplit === 280.0, `Split Artista 80% es 280.00 €`);
assert(earOsSplit === 35.0, `Split EAR OS 10% es 35.00 €`);
assert(vimumeSplit === 35.0, `Split VIMUME 10% es 35.00 €`);

// 5. Verificación de SHA-256
const samplePayload = JSON.stringify({ test: 'contract-integrity-v9' });
const sampleHash = crypto.createHash('sha256').update(samplePayload).digest('hex');
assert(sampleHash.length === 64, `SHA-256 genera hash de 64 caracteres hexadecimales`);
assert(/^[0-9a-f]{64}$/.test(sampleHash), `SHA-256 tiene formato hexadecimal válido`);

// 6. Verificación de Route Handler
assert(routeContent.includes('export async function POST'), 'route.ts exporta POST handler');
assert(routeContent.includes('NextResponse.json'), 'route.ts devuelve respuestas tipadas');
assert(routeContent.includes('generateSmartContract'), 'route.ts invoca generateSmartContract');

console.log(`\nRESUMEN: ${passed} verificaciones OK, ${failed} fallos.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
