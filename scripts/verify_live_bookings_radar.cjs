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

console.log('--- VERIFICACIÓN W28_T05: LIVE BOOKINGS RADAR ---\n');

// 1. Archivo LiveBookingsRadar.tsx
const radarPath = path.join(__dirname, '..', 'src', 'components', 'dashboard', 'LiveBookingsRadar.tsx');
it('1. src/components/dashboard/LiveBookingsRadar.tsx existe', () => {
    assert.strictEqual(fs.existsSync(radarPath), true, 'LiveBookingsRadar.tsx debe existir');
});

const radarSource = fs.existsSync(radarPath) ? fs.readFileSync(radarPath, 'utf-8') : '';

it('2. LiveBookingsRadar.tsx es un Client Component ("use client")', () => {
    assert.match(radarSource, /^['"]use client['"]/);
});

it('3. LiveBookingsRadar.tsx exporta la función/componente LiveBookingsRadar', () => {
    assert.match(radarSource, /export\s+function\s+LiveBookingsRadar/);
});

it('4. LiveBookingsRadar.tsx define el tipo BookingStatus', () => {
    assert.match(radarSource, /export\s+type\s+BookingStatus\s*=/);
});

it('5. BookingStatus incluye estado PENDIENTE_PROVEEDOR', () => {
    assert.match(radarSource, /['"]PENDIENTE_PROVEEDOR['"]/);
});

it('6. BookingStatus incluye estado ACCEPTED_BY_PROVIDER', () => {
    assert.match(radarSource, /['"]ACCEPTED_BY_PROVIDER['"]/);
});

it('7. BookingStatus incluye estado FIANZA_STRIPE_LOCKED', () => {
    assert.match(radarSource, /['"]FIANZA_STRIPE_LOCKED['"]/);
});

it('8. BookingStatus incluye estado EXPIRADO', () => {
    assert.match(radarSource, /['"]EXPIRADO['"]/);
});

it('9. LiveBookingsRadar.tsx implementa cuenta atrás SLA de 2 horas', () => {
    assert.match(radarSource, /getRemainingSlaFormatted/);
    assert.match(radarSource, /2h\s*SLA/i);
});

it('10. LiveBookingsRadar.tsx consume DEPOSITO_STRIPE_EUR del SSOT', () => {
    assert.match(radarSource, /DEPOSITO_STRIPE_EUR/);
    assert.match(radarSource, /from\s+['"]@\/lib\/constants\/ear-os-ssot['"]/);
});

it('11. LiveBookingsRadar.tsx consume SPLIT_SOBERANO (80% artista) del SSOT', () => {
    assert.match(radarSource, /SPLIT_SOBERANO/);
    assert.match(radarSource, /SPLIT_SOBERANO\.artista/);
});

it('12. LiveBookingsRadar.tsx implementa exportación de datos a CSV', () => {
    assert.match(radarSource, /handleDownloadCsv/);
    assert.match(radarSource, /text\/csv/);
});

it('13. LiveBookingsRadar.tsx tiene filtros por búsqueda y estado', () => {
    assert.match(radarSource, /filteredBookings/);
    assert.match(radarSource, /statusFilter/);
});

it('14. LiveBookingsRadar.tsx no contiene ": any"', () => {
    assert.doesNotMatch(radarSource, /:\s*any\b/);
});

// 15. Página en panel/reservas/page.tsx
const pagePath = path.join(__dirname, '..', 'src', 'app', '(dashboard)', 'panel', 'reservas', 'page.tsx');
it('15. src/app/(dashboard)/panel/reservas/page.tsx existe', () => {
    assert.strictEqual(fs.existsSync(pagePath), true, 'La página del panel de reservas debe existir');
});

const pageSource = fs.existsSync(pagePath) ? fs.readFileSync(pagePath, 'utf-8') : '';

it('16. page.tsx importa y renderiza LiveBookingsRadar', () => {
    assert.match(pageSource, /import\s+{\s*LiveBookingsRadar\s*}\s+from/);
    assert.match(pageSource, /<LiveBookingsRadar\s*\/>/);
});

it('17. page.tsx define metadatos canónicos de la vista', () => {
    assert.match(pageSource, /export\s+const\s+metadata\s*:\s*Metadata/);
    assert.match(pageSource, /Radar de Reservas en Vivo/);
});

it('18. page.tsx no contiene ": any"', () => {
    assert.doesNotMatch(pageSource, /:\s*any\b/);
});

console.log(`\nResultado: ${passed} superadas, ${failed} fallidas.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
