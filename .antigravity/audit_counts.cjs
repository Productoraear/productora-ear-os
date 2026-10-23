#!/usr/bin/env node
// Auditoría de conteo ZTM — sin volcar data lakes, solo métricas.
const fs = require('fs');
const path = require('path');

function countDir(dir, filter, out) {
    if (!fs.existsSync(dir)) { out.push(`  (NO EXISTE) ${dir}`); return; }
    let total = 0;
    const byFolder = new Map();
    const walk = (d) => {
        for (const e of fs.readdirSync(d, { withFileTypes: true })) {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (!filter || filter(e.name)) {
                total++;
                const leaf = path.basename(path.dirname(p));
                byFolder.set(leaf, (byFolder.get(leaf) || 0) + 1);
            }
        }
    };
    walk(dir);
    out.push(`  TOTAL: ${total} archivos`);
    const sorted = [...byFolder.entries()].sort((a, b) => b[1] - a[1]);
    for (const [k, v] of sorted) out.push(`    - ${k}: ${v}`);
}

function countJson(dir) {
    if (!fs.existsSync(dir)) return [`  (NO EXISTE) ${dir}`];
    const out = [];
    let totalBytes = 0;
    let totalRecords = 0;
    for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.json'))) {
        const p = path.join(dir, f);
        const st = fs.statSync(p);
        totalBytes += st.size;
        let recs = '?';
        try {
            const j = JSON.parse(fs.readFileSync(p, 'utf8'));
            recs = Array.isArray(j) ? j.length : (typeof j === 'object' ? Object.keys(j).length : 'n/a');
            if (Array.isArray(j)) totalRecords += j.length;
        } catch { recs = 'ERR'; }
        out.push(`    - ${f}: ${(st.size / 1024).toFixed(1)} KB | ${recs} registros`);
    }
    out.push(`  TOTAL: ${(totalBytes / 1048576).toFixed(2)} MB | ${totalRecords} registros`);
    return out;
}

const out = [];
out.push('=== 1. BOVEDA HTML (vault/proveedores_html_indexados) ===');
countDir(path.join('vault', 'proveedores_html_indexados'), (n) => n.endsWith('.html'), out);

out.push('');
out.push('=== 2. DATA EDGE (public/data/providers) ===');
out.push(...countJson(path.join('public', 'data', 'providers')));

out.push('');
out.push('=== 3. SRCDATA B2G (src/data/b2g) ===');
countDir(path.join('src', 'data', 'b2g'), (n) => n.endsWith('.json'), out);
out.push(...countJson(path.join('src', 'data', 'b2g')));

out.push('');
out.push('=== 4. SRCDATA RAG ===');
for (const f of ['ear-rag-database.json', 'b2g_opportunities_database.json', 'providers_canonical.json']) {
    const p = path.join('src', 'data', f);
    if (fs.existsSync(p)) {
        const st = fs.statSync(p);
        let recs = '?';
        try { const j = JSON.parse(fs.readFileSync(p, 'utf8')); recs = Array.isArray(j) ? j.length : 'obj'; } catch { }
        out.push(`  - ${f}: ${(st.size / 1048576).toFixed(2)} MB | ${recs}`);
    }
}

out.push('');
out.push('=== 5. COLA OMEGA (tasks_queue.json) ===');
const tq = path.join('.antigravity', 'tasks_queue.json');
if (fs.existsSync(tq)) {
    try {
        const j = JSON.parse(fs.readFileSync(tq, 'utf8'));
        const tasks = Array.isArray(j) ? j : (j.tasks || []);
        out.push(`  total tareas: ${tasks.length}`);
        const byStatus = {};
        for (const t of tasks) { const s = t.status || t.state || '?'; byStatus[s] = (byStatus[s] || 0) + 1; }
        for (const [k, v] of Object.entries(byStatus)) out.push(`    - ${k}: ${v}`);
    } catch (e) { out.push('  ERROR parse: ' + e.message); }
} else out.push('  (NO EXISTE)');

console.log(out.join('\n'));