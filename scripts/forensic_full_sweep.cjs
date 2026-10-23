#!/usr/bin/env node
/**
 * 🕵️ EAR OS — BARRIDO FORENSE INTEGRAL (bit a bit, átomo a átomo)
 * ------------------------------------------------------------------
 * Inventaría TODO el árbol del proyecto sin cargar ficheros pesados en memoria.
 * Produce:
 *   1. Resumen compacto por consola (< 500 líneas).
 *   2. Informe completo en reports/FORENSIC_SWEEP_*.json (no se lee a mano).
 *
 * Respeta la doctrina ZTM: los data-lakes (.git, node_modules, .next, public/data,
 * vault, data, src/data, nightcrawler_results) se CONTABILIZAN pero NO se abren.
 */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'reports', `FORENSIC_SWEEP_${Date.now()}.json`);

// --- Reglas ZTM: directorios que se cuentan pero NO se leen ----------------------
const SKIP_CONTENT_DIR_PREFIX = [
    '.git', 'node_modules', '.next', '.turbo', 'out', 'dist', 'build', 'coverage',
    'public/data', 'public/images', 'public/audio', 'public/videos', 'public/media',
    'public/brand', 'public/dossiers', 'public/landings', 'public/simulations',
    'vault', 'data', 'src/data', 'scripts/nightcrawler_results'
];

// --- Extensiones binarias / pesadas: NO se leen (solo tamaño) -------------------
const BINARY_EXT = new Set([
    '.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.svg', '.ico', '.avif',
    '.mp3', '.wav', '.ogg', '.mp4', '.webm', '.mov', '.avi',
    '.pdf', '.zip', '.tar', '.gz', '.7z', '.rar', '.bz2',
    '.db', '.sqlite', '.sqlite3', '.dump', '.sql',
    '.xlsx', '.xls', '.csv', '.tsv', '.json.gz',
    '.lock', '.map', '.tsbuildinfo', '.pak', '.exe', '.dll', '.bin', '.woff', '.woff2', '.ttf', '.otf'
]);

// Extensiones de texto que inspeccionamos (solo si <= MAX_READ)
const READ_EXT = new Set([
    '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json', '.md', '.py', '.ps1', '.psm1',
    '.yml', '.yaml', '.env', '.css', '.html', '.txt', '.prisma', '.bat', '.cmd', '.sh',
    '.toml', '.ini', '.cfg', '.gitignore', '.gitattributes', '.clinerules', '.cursorrules',
    '.roomodes', '.eslintrc', '.eslintignore', '.npmrc', '.vercelignore', '.modelfile'
]);

// Marcadores de "ADN EAR OS" (identidad de negocio / producto)
const DNA_MARKERS = [
    /ear\s*os/i, /ear-os/i, /vimume/i, /edwin\s*agudelo/i, /méntrida|mentrida/i,
    /80\s*\/\s*10\s*\/\s*10/, /stripe/i, /dep[oó]sito/i, /price-?lock/i,
    /art\.?\s*118/i, /\blcsp\b/i, /\bdba\b/i, /rider\s*ac[oú]stico/i,
    /\bn8n\b/i, /coolify/i, /82\.29\.179\.172/, /\bomega\b/i, /antigravity/i,
    /atomicdatelock/i, /\bssot\b/i, /qwen/i, /ollama/i, /producci[oó]na? ear/i
];

// Heurística de scripts simulados / purgables (mock)
const MOCK_HINT = /mock|simulad|falso|fake|placeholder|generador|dummy|synthetic/i;

const MAX_READ = 1 * 1024 * 1024; // 1 MB

let stats = {
    scannedAt: new Date().toISOString(),
    totalFiles: 0,
    totalBytes: 0,
    byExt: {},
    byTopDir: {},
    readFiles: 0,
    dnaFiles: 0,
    dnaMarkerHits: {},
    mockCandidates: [],
    largest: [],
    skippedContentFiles: 0,
};

function shouldSkipContent(rel) {
    const norm = rel.replace(/\\/g, '/');
    return SKIP_CONTENT_DIR_PREFIX.some((p) => norm === p || norm.startsWith(p + '/'));
}

function inc(map, key, bytes) {
    if (!map[key]) map[key] = { count: 0, bytes: 0 };
    map[key].count += 1;
    map[key].bytes += bytes;
}

function tagDna(markers) {
    for (const m of markers) stats.dnaMarkerHits[m.source] = (stats.dnaMarkerHits[m.source] || 0) + 1;
}

function walk(dir, relBase) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
        return;
    }
    for (const ent of entries) {
        if (ent.name === 'reports' && relBase === '') continue; // evitar re-leer el propio informe
        const abs = path.join(dir, ent.name);
        const rel = relBase ? path.join(relBase, ent.name) : ent.name;
        if (ent.isDirectory()) {
            walk(abs, rel);
        } else if (ent.isFile()) {
            let size = 0;
            try { size = fs.statSync(abs).size; } catch { size = 0; }
            stats.totalFiles += 1;
            stats.totalBytes += size;

            const ext = path.extname(ent.name).toLowerCase() || '.noext';
            inc(stats.byExt, ext, size);

            const top = relBase ? relBase.split(path.sep)[0] : ent.name;
            inc(stats.byTopDir, top, size);

            stats.largest.push({ path: rel, bytes: size });

            const norm = rel.replace(/\\/g, '/');
            const isReadableExt = READ_EXT.has(ext);
            if (shouldSkipContent(norm) || !isReadableExt || BINARY_EXT.has(ext) || size > MAX_READ) {
                stats.skippedContentFiles += 1;
                continue;
            }

            let text = '';
            try { text = fs.readFileSync(abs, 'utf8'); } catch { continue; }
            stats.readFiles += 1;

            const markers = DNA_MARKERS.filter((m) => m.test(text));
            if (markers.length > 0) {
                stats.dnaFiles += 1;
                tagDna(markers);
            }

            // candidatos mock: nombre o primeras 2KB con hint
            const head = text.slice(0, 2048);
            if (ext === '.py' || ext === '.cjs' || ext === '.ps1' || ext === '.js' || ext === '.ts') {
                if (MOCK_HINT.test(ent.name) || MOCK_HINT.test(head)) {
                    stats.mockCandidates.push(rel);
                }
            }
        }
    }
}

walk(ROOT, '');

// Ordenar largest
stats.largest.sort((a, b) => b.bytes - a.bytes);
stats.largestTop = stats.largest.slice(0, 25);
stats.largest = undefined;

// Histograma ordenado
stats.byExtSorted = Object.entries(stats.byExt)
    .map(([ext, v]) => ({ ext, count: v.count, mb: +(v.bytes / (1024 * 1024)).toFixed(2) }))
    .sort((a, b) => b.mb - a.mb)
    .slice(0, 40);

stats.byTopDirSorted = Object.entries(stats.byTopDir)
    .map(([dir, v]) => ({ dir, count: v.count, mb: +(v.bytes / (1024 * 1024)).toFixed(2) }))
    .sort((a, b) => b.mb - a.mb)
    .slice(0, 40);

stats.dnaMarkerHitsSorted = Object.entries(stats.dnaMarkerHits)
    .map(([m, c]) => ({ marker: m, files: c }))
    .sort((a, b) => b.files - a.files)
    .slice(0, 40);

stats.mockCandidates = stats.mockCandidates.slice(0, 200);

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(stats, null, 2), 'utf8');

// ---- Resumen compacto por consola ----
const mb = (b) => (b / (1024 * 1024)).toFixed(2);
console.log('═══ EAR OS — BARRIDO FORENSE INTEGRAL ═══');
console.log(`Archivos totales: ${stats.totalFiles}`);
console.log(`Tamaño total:    ${mb(stats.totalBytes)} MB`);
console.log(`Archivos leídos (texto <=1MB): ${stats.readFiles}`);
console.log(`Archivos contados sin abrir:   ${stats.skippedContentFiles}`);
console.log(`Archivos con ADN EAR OS: ${stats.dnaFiles}`);
console.log('');
console.log('── TOP 25 archivos más pesados ──');
for (const f of stats.largestTop) console.log(`  ${mb(f.bytes).padStart(9)} MB  ${f.path}`);
console.log('');
console.log('── TOP extensiones por peso ──');
for (const e of stats.byExtSorted) console.log(`  ${String(e.mb).padStart(9)} MB  ${String(e.count).padStart(6)} arch  ${e.ext}`);
console.log('');
console.log('── TOP directorios por peso ──');
for (const d of stats.byTopDirSorted) console.log(`  ${String(d.mb).padStart(9)} MB  ${String(d.count).padStart(6)} arch  ${d.dir}`);
console.log('');
console.log('── TOP marcadores de ADN EAR OS ──');
for (const m of stats.dnaMarkerHitsSorted) console.log(`  ${String(m.files).padStart(5)} arch  ${m.marker}`);
console.log('');
console.log('── Candidatos mock/purgables (máx 200) ──');
for (const c of stats.mockCandidates) console.log('  ' + c);
console.log('');
console.log(`Informe completo: ${path.relative(ROOT, OUT)}`);