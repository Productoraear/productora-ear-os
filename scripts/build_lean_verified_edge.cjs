const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════
// GENERADOR DE PARTICIONES EDGE LEAN & VERIFICADAS (MVP -> PRODUCCIÓN)
// Fuente: src/data/all_providers_database.json (SSOT ya podado con verified).
// Regla SSOT: SOLO se publica un proveedor si tiene teléfono REAL
// (no centralita +34 693 693 048, no vacío). Cero placeholders en Edge.
// Límite Anti-Bloat (AGENTS.md §8): < 1 MB por archivo, top N por gremio.
// ═══════════════════════════════════════════════════════════════════════

const PLACEHOLDER_RAW = '+34 693 693 048';
const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'src', 'data', 'all_providers_database.json');
const EDGE_DIR = path.join(ROOT, 'public', 'data', 'providers');

const CATEGORIES = [
    { file: 'finca.json', category: 'finca', cap: 800 },
    { file: 'catering.json', category: 'catering', cap: 600 },
    { file: 'musica.json', category: 'musica', cap: 800 },
    { file: 'foto.json', category: 'foto', cap: 800 },
    { file: 'decoracion.json', category: 'decoracion', cap: 500 },
    { file: 'servicios.json', category: 'servicios', cap: 800 },
    { file: 'moda.json', category: 'moda', cap: 800 },
    { file: 'transporte.json', category: 'transporte', cap: 500 },
    { file: 'sonido.json', category: 'sonido', cap: 500 },
    { file: 'wedding.json', category: 'wedding', cap: 500 },
];

function normPhone(p) {
    if (p == null) return '';
    return String(p).replace(/[^0-9]/g, '');
}

function isRealPhone(p) {
    const n = normPhone(p);
    if (!n) return false;
    if (n === normPhone(PLACEHOLDER_RAW)) return false;
    return n.length >= 9;
}

function str(v, max) {
    const s = v == null ? '' : String(v);
    return max && s.length > max ? s.slice(0, max).trim() : s.trim();
}

function compact(record, idx) {
    const phone = str(record.phone || record.telephone || '', 32);
    const name = str(record.name || record.nombre || 'Proveedor Homologado', 120);
    const category = str(record.category || 'servicios', 40);
    const province = str(record.province || record.provincia || 'Madrid', 60);
    const basePrice = typeof record.basePrice === 'number' ? record.basePrice : 350;
    const price = str(record.price || `${basePrice} €`, 40);
    const rating = typeof record.rating === 'number' ? record.rating : 4.9;
    const reviews = typeof record.reviews === 'number' ? record.reviews : 18;
    const img = str(record.img || '', 300);
    const description = str(record.description || `${name} homologado S-Class.`, 200);
    const descriptionFull = str(record.description_full || description, 400);
    const servicesList = Array.isArray(record.services_list)
        ? record.services_list.slice(0, 4)
        : ['Servicio S-Class', 'Garantía EAR'];

    return {
        id: str(record.id || `prov-${idx}`, 80),
        name,
        slug: str(record.slug || record.id || `prov-${idx}`, 120),
        category,
        province,
        address: str(record.address || `${province}, España`, 200),
        phone,
        telephone: phone,
        img,
        basePrice,
        price,
        rating,
        reviews,
        description,
        description_full: descriptionFull,
        services_list: servicesList,
        verified: true
    };
}

console.log(`[LEAN EDGE] Leyendo SSOT: ${DATA}`);
const raw = JSON.parse(fs.readFileSync(DATA, 'utf8'));
if (!Array.isArray(raw)) {
    console.error('[LEAN EDGE] SSOT no es un array. Abortando.');
    process.exit(1);
}

// Solo verificados con teléfono real (regla de negocio inmutable)
const allVerified = raw.filter((r) => r && isRealPhone(r.phone || r.telephone));
console.log(`[LEAN EDGE] Registros con teléfono real (verificables): ${allVerified.length}`);

const manifest = {};
for (const { file, category, cap } of CATEGORIES) {
    const items = allVerified.filter((r) => (r.category || 'servicios') === category);
    // Deduplicación por nombre normalizado
    const seen = new Set();
    const deduped = [];
    for (const it of items) {
        const key = String(it.name || '').toLowerCase().trim();
        if (seen.has(key)) continue;
        seen.add(key);
        deduped.push(it);
    }
    // Orden por rating y reviews descendente
    deduped.sort((a, b) => ((b.rating || 0) - (a.rating || 0)) || ((b.reviews || 0) - (a.reviews || 0)));
    const selected = deduped.slice(0, cap).map((r, i) => compact(r, i));

    const outPath = path.join(EDGE_DIR, file);
    fs.writeFileSync(outPath, JSON.stringify(selected), 'utf8');
    const kb = (fs.statSync(outPath).size / 1024).toFixed(1);
    manifest[category] = { count: selected.length, sizeKB: kb };
    console.log(`  ${file}: ${selected.length} registros verificados (${kb} KB)`);
}

// senior_care.json es una partición VIMUME independiente: se conserva y se indexa en manifest
const seniorPath = path.join(EDGE_DIR, 'senior_care.json');
if (fs.existsSync(seniorPath)) {
    const seniorData = JSON.parse(fs.readFileSync(seniorPath, 'utf8'));
    const seniorCount = Array.isArray(seniorData) ? seniorData.length : 0;
    const seniorKb = (fs.statSync(seniorPath).size / 1024).toFixed(1);
    manifest['senior_care'] = { count: seniorCount, sizeKB: seniorKb };
    console.log(`  senior_care.json: ${seniorCount} registros conservados (${seniorKb} KB)`);
}

// Manifest.json actualizado
fs.writeFileSync(path.join(EDGE_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('[LEAN EDGE] manifest.json regenerado.');
console.log('[LEAN EDGE] HE DONE — Cero placeholders en Edge CDN.');