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

console.log('--- VERIFICACIÓN W28_T06: EAR DECK PRO PLAYER SPEC ---\n');

const specPath = path.join(__dirname, '..', 'docs', 'specs', 'EAR_DECK_ARCHITECTURE_SPEC.md');

it('1. docs/specs/EAR_DECK_ARCHITECTURE_SPEC.md existe', () => {
    assert.strictEqual(fs.existsSync(specPath), true, 'El archivo de especificación debe existir');
});

const specContent = fs.existsSync(specPath) ? fs.readFileSync(specPath, 'utf-8') : '';

it('2. Especificación cumple con estructura ISO/IEC 25010', () => {
    assert.match(specContent, /ISO\/IEC\s*25010/);
});

it('3. Especificación incluye diagramas de arquitectura C4 Model', () => {
    assert.match(specContent, /C4/);
    assert.match(specContent, /graph TD/);
});

it('4. Especificación contempla motor de audio con AudioWorklet', () => {
    assert.match(specContent, /AudioWorklet/);
});

it('5. Especificación contempla Ledger criptográfico encadenado SHA-256', () => {
    assert.match(specContent, /SHA-256/);
});

it('6. Especificación contempla integración de hardware con Web MIDI API', () => {
    assert.match(specContent, /Web\s*MIDI/);
});

it('7. Especificación define contrato de interfaz TrackMetadata', () => {
    assert.match(specContent, /export\s+interface\s+TrackMetadata/);
});

it('8. Especificación define contrato de interfaz PlaybackLedgerEntry', () => {
    assert.match(specContent, /export\s+interface\s+PlaybackLedgerEntry/);
});

it('9. Especificación define contrato de interfaz MidiMapping', () => {
    assert.match(specContent, /export\s+interface\s+MidiMapping/);
});

it('10. Especificación define contrato de interfaz AudioEngine', () => {
    assert.match(specContent, /export\s+interface\s+AudioEngine/);
});

it('11. Especificación establece el umbral forense legal de > 30 segundos para devengo', () => {
    assert.match(specContent, />\s*30\s*s/i);
});

it('12. Especificación define exportación a entidades de gestión (SGAE, AGEDI, AIE)', () => {
    assert.match(specContent, /SGAE/);
    assert.match(specContent, /AGEDI/);
    assert.match(specContent, /AIE/);
});

it('13. Especificación proyecta transición hacia app nativa Tauri (Rust) con stems ONNX', () => {
    assert.match(specContent, /Tauri/);
    assert.match(specContent, /Rust/);
    assert.match(specContent, /ONNX/);
});

console.log(`\nResultado: ${passed} superadas, ${failed} fallidas.`);
if (failed > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
