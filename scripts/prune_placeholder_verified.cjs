const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════
// PODA QUIRÚRGICA DEL INVENTARIO (ZTM — procesa en disco, no lee en contexto)
// Regla de negocio SSOT: un registro SOLO está verificado si tiene un
// teléfono REAL distinto de la centralita (+34 693 693 048) y no vacío.
// Los placeholder de centralita y los sin teléfono pasan a verified:false.
// ═══════════════════════════════════════════════════════════════════════

const PLACEHOLDER_RAW = '+34 693 693 048';

function normPhone(p) {
    if (p == null) return '';
    return String(p).replace(/[^0-9]/g, '');
}

function phoneKeyOf(keys) {
    return keys.find((k) => /telefono|telefono_|phone|tel|movil|movil_|whatsapp/i.test(k));
}

function isRealPhone(p, placeholderNorm) {
    const n = normPhone(p);
    if (!n) return false;
    if (n === placeholderNorm) return false;
    return n.length >= 9;
}

function pruneFile(file) {
    if (!fs.existsSync(file)) {
        console.log(`SKIP (no existe): ${file}`);
        return null;
    }
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!Array.isArray(data)) {
        console.log(`SKIP (no es array): ${file}`);
        return null;
    }

    const placeholderNorm = normPhone(PLACEHOLDER_RAW);
    let verifiedTrue = 0;
    let verifiedFalse = 0;

    for (const record of data) {
        if (!record || typeof record !== 'object') continue;
        const pk = phoneKeyOf(Object.keys(record));
        const real = pk ? isRealPhone(record[pk], placeholderNorm) : false;
        record.verified = real;
        if (real) verifiedTrue += 1;
        else verifiedFalse += 1;
    }

    fs.writeFileSync(file, JSON.stringify(data), 'utf8');
    const kb = (fs.statSync(file).size / 1024).toFixed(1);
    console.log(`${file}: ${data.length} reg | verified:true=${verifiedTrue} verified:false=${verifiedFalse} | ${kb} KB`);
    return { file, total: data.length, verifiedTrue, verifiedFalse };
}

const EDGE_DIR = path.join(__dirname, '..', 'public', 'data', 'providers');
const EDGE_FILES = [
    'finca.json', 'catering.json', 'musica.json', 'foto.json', 'decoracion.json',
    'servicios.json', 'moda.json', 'transporte.json', 'sonido.json', 'wedding.json', 'senior_care.json'
];

const LAKE_FILES = [
    'src/data/all_providers_database.json',
    'src/data/vampirized_providers.json'
];

console.log('═══════ PODA EDGE (public/data/providers — sirve a producción) ═══════');
const edgeResults = EDGE_FILES
    .map((f) => pruneFile(path.join(EDGE_DIR, f)))
    .filter(Boolean);

console.log('\n═══════ PODA DATA LAKES (src/data — SSOT de ingesta, gitignored) ═══════');
const lakeResults = LAKE_FILES
    .map((f) => pruneFile(path.join(__dirname, '..', f)))
    .filter(Boolean);

const all = [...edgeResults, ...lakeResults];
const totalRecords = all.reduce((acc, r) => acc + r.total, 0);
const totalTrue = all.reduce((acc, r) => acc + r.verifiedTrue, 0);
const totalFalse = all.reduce((acc, r) => acc + r.verifiedFalse, 0);

console.log('\n═══════ RESUMEN GLOBAL DE LA PODA ═══════');
console.log(`Registros procesados: ${totalRecords}`);
console.log(`verified:true  (teléfono real): ${totalTrue}`);
console.log(`verified:false (placeholder/centralita o vacío): ${totalFalse}`);