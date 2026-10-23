const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = 'H:\\AI_MODELS_HUB';

function human(bytes) {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1024) return (mb / 1024).toFixed(2) + ' GB';
    return mb.toFixed(2) + ' MB';
}

function walk(dir) {
    const results = [];
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return results;
    }
    for (const e of entries) {
        const full = path.join(dir, e.name);
        if (e.isDirectory()) {
            results.push(...walk(full));
        } else if (e.isFile()) {
            let size = 0;
            try { size = fs.statSync(full).size; } catch (_) { }
            results.push({ full, name: e.name, ext: path.extname(e.name).toLowerCase(), size });
        }
    }
    return results;
}

console.log('=== AUDITORIA H:\\AI_MODELS_HUB ===');
if (!fs.existsSync(ROOT)) {
    console.log('NO_EXISTE');
    process.exit(0);
}

// Top-level listing with per-dir size
const top = fs.readdirSync(ROOT, { withFileTypes: true });
const dirSizes = [];
for (const e of top) {
    const full = path.join(ROOT, e.name);
    if (e.isDirectory()) {
        const files = walk(full);
        const total = files.reduce((a, f) => a + f.size, 0);
        dirSizes.push({ dir: e.name, files: files.length, bytes: total });
    } else {
        dirSizes.push({ dir: '[FILE] ' + e.name, files: 1, bytes: fs.statSync(full).size });
    }
}
dirSizes.sort((a, b) => b.bytes - a.bytes);
console.log('\n--- DIRECTORIOS / ARCHIVOS TOP-LEVEL POR TAMAÑO ---');
for (const d of dirSizes) {
    console.log(`${d.dir} | ${d.files} archivos | ${human(d.bytes)}`);
}

// Extension census
const all = walk(ROOT);
const byExt = {};
for (const f of all) {
    const key = f.ext || '(sin ext)';
    if (!byExt[key]) byExt[key] = { count: 0, bytes: 0 };
    byExt[key].count++;
    byExt[key].bytes += f.size;
}
console.log('\n--- CENSO POR EXTENSION ---');
Object.entries(byExt).sort((a, b) => b[1].bytes - a[1].bytes).forEach(([ext, v]) => {
    console.log(`${ext.padEnd(18)} | ${String(v.count).padStart(6)} archivos | ${human(v.bytes)}`);
});

// Largest files (model blobs)
const sorted = all.slice().sort((a, b) => b.size - a.size).slice(0, 30);
console.log('\n--- TOP 30 ARCHIVOS MAS PESADOS (candidatos a GGUF/onnx/safetensors) ---');
for (const f of sorted) {
    console.log(`${human(f.size).padStart(10)} | ${f.full}`);
}

// Cross with ollama list
console.log('\n--- OLLAMA LIST (modelos cargados) ---');
try {
    const out = execSync('ollama list', { encoding: 'utf8', shell: 'powershell.exe' });
    console.log(out.trim());
} catch (e) {
    console.log('ERROR_ollama_list: ' + (e.message || e));
}

console.log('\n=== FIN AUDITORIA ===');