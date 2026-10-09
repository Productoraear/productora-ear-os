/**
 * GSC TROJAN HORSE FORENSICS (S-CLASS)
 * ----------------------------------------------------------------------------
 * Convierte los ZIPs de Google Search Console (Coverage Validation + Drilldown)
 * en el MAPA DE BATALLA del SEO: usa las propias armas de Google (sus datos de
 * rastreo/indexación) para enumerar EXACTAMENTE qué URLs drenan crawl budget,
 * cuáles están deindexadas (404/noindex/redirección/duplicada) y qué "caballo
 * de troya" (proxy /api/media sobre cdn0.bodas.net) está contaminando el índice.
 *
 * Uso: node scripts/gsc_trojan_horse_forensics.cjs
 * Salida:
 *   reports/gsc_trojan_horse_forensics.json   (datos completos)
 *   reports/gsc_trojan_horse_forensics.md     (resumen ejecutivo)
 *   consola: resumen estadístico < 300 tokens (ZTM)
 * ----------------------------------------------------------------------------
 */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const SOURCE_DIR = process.env.GSC_SOURCE_DIR || 'D:\\Migracion_C\\M2-W10\\Downloads';
const TMP_ROOT = fs.mkdtempSync(path.join(os.tmpdir(), 'gsc-trojan-'));
const OUT_DIR = path.join(process.cwd(), 'reports');
fs.mkdirSync(OUT_DIR, { recursive: true });

/** Mini parser RFC4180: maneja comas dentro de comillas y comillas escapadas. */
function parseCsvLine(line) {
    const out = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
            if (ch === '"') {
                if (line[i + 1] === '"') { cur += '"'; i++; }
                else { inQuotes = false; }
            } else {
                cur += ch;
            }
        } else if (ch === '"') {
            inQuotes = true;
        } else if (ch === ',') {
            out.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    out.push(cur);
    return out.map((c) => c.trim());
}

function readCsv(filePath) {
    if (!fs.existsSync(filePath)) return { header: [], rows: [] };
    const content = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const lines = content.split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length === 0) return { header: [], rows: [] };
    const header = parseCsvLine(lines[0]);
    const rows = lines.slice(1).map(parseCsvLine).filter((r) => r.length > 0);
    return { header, rows };
}

function readMetadata(filePath) {
    const { rows } = readCsv(filePath);
    const meta = {};
    for (const row of rows) {
        if (row.length >= 2) meta[row[0]] = row.slice(1).join(',');
    }
    return meta;
}

function listZips(dir) {
    return fs.readdirSync(dir)
        .filter((f) => f.startsWith('https___www.productoraear.com_-Coverage-') && f.endsWith('.zip'))
        .sort();
}

function extractZip(zipPath, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    const ps = [
        `$ErrorActionPreference='Stop'`,
        `Add-Type -AssemblyName System.IO.Compression.FileSystem`,
        `[System.IO.Compression.ZipFile]::ExtractToDirectory(${JSON.stringify(zipPath)}, ${JSON.stringify(destDir)})`
    ].join('; ');
    execFileSync('pwsh', ['-NoProfile', '-Command', ps], { stdio: 'pipe' });
}

/** Clasifica una URL en un patrón estructural (la "huella" del enemigo). */
function classifyUrl(url) {
    if (!url) return 'UNKNOWN';
    const u = url.replace(/^https?:\/\/(www\.)?productoraear\.com/, '');
    if (u.includes('/api/media?url=')) {
        return u.includes('bodas.net') ? 'MEDIA_PROXY_BODASNET' : 'MEDIA_PROXY_OTHER';
    }
    if (/^\/proveedores\/prov-\d+/i.test(u)) return 'RAW_NUMERIC_PROVIDER';
    if (/^\/proveedores\/prov-[a-z]/i.test(u)) return 'RAW_SLUG_PROVIDER';
    if (/^\/bodas\/[^/]+\/[^/]+\/[^/]+$/i.test(u)) return 'DOORWAY_BODAS_3L';
    if (/^\/servicios\/.+\/.+\/[^/]+$/i.test(u)) return 'DOORWAY_SERVICIOS';
    if (/^\/weddings\//i.test(u)) return 'WEDDINGS_DEPRECATED';
    if (/^\/toledo\//i.test(u)) return 'TOLEDO_HUB';
    return 'OTHER';
}

function summarize(collection) {
    const byIncidence = {};   // Incidencia -> Set(url) counts by pattern
    const byIncPattern = {};  // Incidencia -> pattern -> count
    const patterns = new Set();
    for (const item of collection) {
        const inc = item.incidencia || 'SIN_INCIDENCIA';
        const pat = item.pattern;
        byIncidence[inc] = (byIncidence[inc] || 0) + 1;
        byIncPattern[inc] = byIncPattern[inc] || {};
        byIncPattern[inc][pat] = (byIncPattern[inc][pat] || 0) + 1;
        patterns.add(pat);
    }
    return { byIncidence, byIncPattern, patterns: [...patterns].sort() };
}

function main() {
    const zips = listZips(SOURCE_DIR);
    if (zips.length === 0) {
        console.error(`❌ No hay ZIPs de GSC en ${SOURCE_DIR}`);
        process.exit(1);
    }

    const collection = [];
    const perZip = {};

    for (const zipName of zips) {
        const zipPath = path.join(SOURCE_DIR, zipName);
        const destDir = path.join(TMP_ROOT, zipName.replace(/[^a-zA-Z0-9._-]/g, '_'));
        extractZip(zipPath, destDir);

        const meta = readMetadata(path.join(destDir, 'Metadatos.csv'));
        const table = readCsv(path.join(destDir, 'Tabla.csv'));

        const urlIdx = table.header.findIndex((h) => /url/i.test(h));
        const lastCrawlIdx = table.header.findIndex((h) => /último rastreo|last crawl/i.test(h));
        const statusIdx = table.header.findIndex((h) => /estado|status/i.test(h));

        const entries = table.rows
            .map((r) => ({
                url: urlIdx >= 0 ? r[urlIdx] : r[0],
                lastCrawl: lastCrawlIdx >= 0 ? r[lastCrawlIdx] : '',
                status: statusIdx >= 0 ? r[statusIdx] : '',
                incidencia: meta['Incidencia'] || '',
                sitemap: meta['Sitemap'] || ''
            }))
            .filter((e) => e.url && /^https?:\/\//i.test(e.url));

        for (const e of entries) {
            e.pattern = classifyUrl(e.url);
            collection.push(e);
        }
        perZip[zipName] = { incidencia: meta['Incidencia'] || '', count: entries.length };
    }

    const { byIncidence, byIncPattern, patterns } = summarize(collection);

    // Muestras representativas por patrón para el informe.
    const samples = {};
    for (const e of collection) {
        if (!samples[e.pattern]) samples[e.pattern] = [];
        if (samples[e.pattern].length < 3) samples[e.pattern].push(e.url);
    }

    const md = [
        '# 🐴 GSC TROJAN HORSE FORENSICS — MAPA DE BATALLA SEO',
        `> Generado: ${new Date().toISOString()} · Fuente: ${zips.length} ZIPs de Search Console`,
        '',
        '## Resumen por Incidencia (Index Coverage)',
        '| Incidencia | URLs | Distribución por patrón |',
        '|---|---|---|'
    ];
    for (const inc of Object.keys(byIncidence).sort()) {
        const pats = Object.entries(byIncPattern[inc] || {})
            .sort((a, b) => b[1] - a[1])
            .map(([p, n]) => `${p} (${n})`)
            .join(', ');
        md.push(`| ${inc} | ${byIncidence[inc]} | ${pats} |`);
    }
    md.push('');
    md.push('## Patrones estructurales detectados');
    for (const p of patterns) {
        md.push(`- **${p}**`);
    }
    md.push('');
    md.push('## Muestras por patrón');
    for (const p of Object.keys(samples).sort()) {
        md.push(`### ${p}`);
        for (const u of samples[p]) md.push(`- ${u}`);
        md.push('');
    }

    const report = {
        generatedAt: new Date().toISOString(),
        sourceDir: SOURCE_DIR,
        zipCount: zips.length,
        totalUrls: collection.length,
        perZip,
        byIncidence,
        byIncPattern,
        patterns,
        samples
    };

    fs.writeFileSync(path.join(OUT_DIR, 'gsc_trojan_horse_forensics.json'), JSON.stringify(report, null, 2), 'utf8');
    fs.writeFileSync(path.join(OUT_DIR, 'gsc_trojan_horse_forensics.md'), md.join('\n'), 'utf8');

    // ── Resumen en consola (ZTM < 300 tokens) ──
    console.log('=== GSC TROJAN HORSE FORENSICS ===');
    console.log(`ZIPs: ${zips.length} · URLs: ${collection.length}`);
    for (const inc of Object.keys(byIncidence).sort()) {
        console.log(`${inc}: ${byIncidence[inc]}`);
    }
    console.log('Patrones: ' + patterns.join(' | '));
    console.log('Reporte: reports/gsc_trojan_horse_forensics.md');

    // Limpieza del temporal
    fs.rmSync(TMP_ROOT, { recursive: true, force: true });
}

main();