#!/usr/bin/env node
'use strict';
/**
 * ════════════════════════════════════════════════════════════════════════════════
 * ENRICH_PROVIDERS_OVERTURE.CJS — ADQUISICIÓN MASIVA DE CONTACTO REAL
 * ════════════════════════════════════════════════════════════════════════════════
 * Fuente: Overture Maps Places (release 2026-10-21.0, CDLA-Permissive-2.0).
 *   2,57M POIs españoles; 2,39M con teléfono/web/email/redes.
 *
 * FASES:
 *   1. Extrae el parquet español de Overture (si no existe).
 *   2. Cruce exacto por nombre normalizado (todos los gremios).
 *   3. Cruce fuzzy por prefijo + Jaro-Winkler, un lote por gremio.
 *   4. Consolida con reglas de atribución y dedupe telefónico global.
 *
 * SALIDAS:
 *   reports/PROVIDER_ENRICHMENT.json         (overlay por vendorId)
 *   reports/PROVIDER_ENRICHMENT_AUDIT.json   (cifras y rechazos)
 *   reports/PROVIDER_ENRICHMENT_SUMMARY.md   (informe legible)
 *
 * USO:
 *   node scripts/enrich_providers_overture.cjs
 *   node scripts/enrich_providers_overture.cjs --skip-fuzzy
 *   node scripts/enrich_providers_overture.cjs --categories=finca,foto
 *   node scripts/enrich_providers_overture.cjs --resume
 * ════════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawnSync } = require('child_process');
const { consolidate } = require('./lib/provider_enrichment.cjs');
const { applyWebcrawlMerge } = require('./lib/webcrawl_merge.cjs');

const ROOT = path.join(__dirname, '..');
const REPORTS = path.join(ROOT, 'reports');
const TMP = path.join(REPORTS, '.duckdb_tmp');
const IDENTITY = path.join(REPORTS, 'PROVIDER_IDENTITY_MAP.json');
const PROVIDERS = path.join(REPORTS, 'providers_for_match.json');
const PARQUET = path.join(REPORTS, 'overture_places_es_contactable.parquet');
const EXACT_SQL = path.join(__dirname, 'overture_exact.sql');
const FUZZY_SQL = path.join(__dirname, 'overture_fuzzy.sql');
const EXACT_OUT = path.join(REPORTS, 'overture_exact_pairs.jsonl');
const ENRICHMENT = path.join(REPORTS, 'PROVIDER_ENRICHMENT.json');
const AUDIT = path.join(REPORTS, 'PROVIDER_ENRICHMENT_AUDIT.json');
const SUMMARY = path.join(REPORTS, 'PROVIDER_ENRICHMENT_SUMMARY.md');

const DATASET = 'overture:2026-10-21.0';
const LICENSE = 'CDLA-Permissive-2.0';

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const valueOf = (prefix) => {
    const found = args.find((a) => a.startsWith(prefix));
    return found ? found.slice(prefix.length) : '';
};

const SKIP_FUZZY = has('--skip-fuzzy');
const SKIP_EXACT = has('--skip-exact');
const RESUME = has('--resume');
const ONLY_CATEGORIES = valueOf('--categories=').split(',').map((s) => s.trim()).filter(Boolean);

function log(...parts) {
    console.log('[ENRICH]', ...parts);
}

function findDuckdb() {
    const candidates = [
        process.env.DUCKDB_BIN,
        path.join(process.env.LOCALAPPDATA || '', 'ear_os_tools', 'duckdb.exe'),
        path.join(os.homedir(), 'AppData', 'Local', 'ear_os_tools', 'duckdb.exe'),
        'duckdb'
    ].filter(Boolean);
    for (const candidate of candidates) {
        const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', timeout: 15000 });
        if (probe.status === 0) return candidate;
    }
    throw new Error('DuckDB no encontrado. Define DUCKDB_BIN o instala el CLI.');
}

function runSql(duckdb, sqlText, label) {
    fs.mkdirSync(TMP, { recursive: true });
    const sqlPath = path.join(TMP, `${label}.sql`);
    const logPath = path.join(REPORTS, `_enrich_${label}.log`);
    fs.writeFileSync(sqlPath, sqlText, 'utf8');
    const started = Date.now();
    log(`DuckDB → ${label}...`);
    const result = spawnSync(duckdb, ['-c', `.read "${sqlPath.replace(/\\/g, '/')}"`], {
        encoding: 'utf8',
        timeout: 45 * 60 * 1000,
        maxBuffer: 64 * 1024 * 1024,
        env: { ...process.env, TEMP: TMP, TMP: TMP }
    });
    const output = `${result.stdout || ''}\n${result.stderr || ''}`;
    fs.writeFileSync(logPath, output, 'utf8');
    if (result.status !== 0) {
        throw new Error(`DuckDB falló en ${label} (exit ${result.status}). Ver ${path.relative(ROOT, logPath)}`);
    }
    log(`  ok ${label} en ${((Date.now() - started) / 1000).toFixed(1)} s`);
}

function ensureProvidersFile() {
    const source = fs.statSync(IDENTITY);
    if (fs.existsSync(PROVIDERS) && fs.statSync(PROVIDERS).mtimeMs >= source.mtimeMs) return;
    const identity = JSON.parse(fs.readFileSync(IDENTITY, 'utf8'));
    const rows = identity.providers.map((p) => ({
        vendorId: p.vendorId || null,
        key: p.key || '',
        name: p.name || '',
        province: p.province || '',
        category: p.category || 'servicios',
        phone: p.phone || '',
        web: p.web || ''
    }));
    fs.writeFileSync(PROVIDERS, JSON.stringify(rows), 'utf8');
    log(`providers_for_match.json regenerado (${rows.length} proveedores)`);
}

function ensureParquet(duckdb) {
    if (fs.existsSync(PARQUET)) return;
    log('Parquet español de Overture ausente. Extrayendo desde S3...');
    runSql(duckdb, fs.readFileSync(path.join(__dirname, 'overture_extract_es.sql'), 'utf8'), 'extract_es');
}

function runExact(duckdb) {
    if (SKIP_EXACT && fs.existsSync(EXACT_OUT)) {
        log('Exacto omitido (--skip-exact).');
        return;
    }
    runSql(duckdb, fs.readFileSync(EXACT_SQL, 'utf8'), 'exact');
}

function runFuzzy(duckdb, categories) {
    if (SKIP_FUZZY) {
        log('Fuzzy omitido (--skip-fuzzy).');
        return;
    }
    const template = fs.readFileSync(FUZZY_SQL, 'utf8');
    for (const category of categories) {
        const out = path.join(REPORTS, `overture_fuzzy_${category}.jsonl`);
        if (RESUME && fs.existsSync(out) && fs.statSync(out).size > 2) {
            log(`  fuzzy ${category}: ya existe, se reutiliza.`);
            continue;
        }
        const sql = template
            .replace(/__CATEGORY__/g, category.replace(/'/g, "''"))
            .replace(/__OUT__/g, out.replace(/\\/g, '/').replace(/'/g, "''"));
        runSql(duckdb, sql, `fuzzy_${category}`);
    }
}

function readJsonl(file) {
    if (!fs.existsSync(file)) return [];
    const text = fs.readFileSync(file, 'utf8');
    const rows = [];
    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        try {
            rows.push(JSON.parse(trimmed));
        } catch (err) {
            log(`  aviso: línea inválida en ${path.basename(file)}`);
        }
    }
    return rows;
}

function writeSummary(audit) {
    const lines = [
        '# ENRIQUECIMIENTO REAL DE PROVEEDORES — OVERTURE MAPS',
        '',
        `**Dataset:** ${DATASET} · **Licencia:** ${LICENSE}`,
        `**Generado:** ${audit.meta.generatedAt}`,
        '',
        '## Cobertura conseguida',
        '',
        '| Métrica | Valor |',
        '|---|---:|',
        `| Proveedores evaluados | ${audit.meta.providersEvaluated} |`,
        `| Filas candidatas analizadas | ${audit.meta.candidateRows} |`,
        `| Proveedores con candidato | ${audit.meta.vendorsWithCandidates} |`,
        `| **Enriquecidos aceptados** | **${audit.accepted}** |`,
        `| Con teléfono real | ${audit.withPhone} |`,
        `| Con web propia | ${audit.withWeb} |`,
        `| Con email | ${audit.withEmail} |`,
        `| Con redes sociales | ${audit.withSocials} |`,
        `| Con GPS verificado | ${audit.withGeo} |`,
        `| Verified blindados | ${audit.verified} |`,
        `| Ambiguos (contacto retenido) | ${audit.ambiguous} |`,
        `| Teléfonos disputados (compartidos) | ${audit.disputedPhones} |`,
        '',
        '## Por modo de emparejamiento',
        '',
        `- Exacto (nombre normalizado idéntico): **${audit.byMode.exact}**`,
        `- Fuzzy (Jaro-Winkler + provincia + categoría + dominio): **${audit.byMode.fuzzy}**`,
        '',
        '## Por gremio',
        '',
        '| Gremio | Proveedores | Teléfono | Web | Email |',
        '|---|---:|---:|---:|---:|',
        ...Object.entries(audit.byCategory).map(([cat, v]) => `| ${cat} | ${v.providers} | ${v.phone} | ${v.web} | ${v.email} |`),
        '',
        '## Rechazos (trazabilidad)',
        '',
        ...Object.entries(audit.rejections).map(([reason, count]) => `- \`${reason}\`: ${count}`),
        '',
        '> Doctrina: ningún teléfono se atribuye si hay más de una sede posible; un número compartido',
        '> entre proveedores se retira de todos. Cada dato lleva `evidence.dataset`, `evidence.rule` y',
        '> `matched.id` (POI de Overture) para auditoría.'
    ];
    fs.writeFileSync(SUMMARY, `${lines.join('\n')}\n`, 'utf8');
}

function main() {
    fs.mkdirSync(TMP, { recursive: true });
    ensureProvidersFile();
    const providers = JSON.parse(fs.readFileSync(PROVIDERS, 'utf8'));
    const categories = [...new Set(providers.map((p) => p.category))].sort();
    const selected = ONLY_CATEGORIES.length ? categories.filter((c) => ONLY_CATEGORIES.includes(c)) : categories;

    const duckdb = findDuckdb();
    log(`DuckDB: ${duckdb}`);
    log(`Gremios: ${selected.join(', ')}`);

    ensureParquet(duckdb);
    runExact(duckdb);
    runFuzzy(duckdb, selected);

    const candidates = readJsonl(EXACT_OUT);
    for (const category of selected) candidates.push(...readJsonl(path.join(REPORTS, `overture_fuzzy_${category}.jsonl`)));

    log(`Candidatos cargados: ${candidates.length}`);
    const { providers: enriched, audit } = consolidate(providers, candidates, { dataset: DATASET, license: LICENSE });

    fs.writeFileSync(ENRICHMENT, JSON.stringify({
        meta: audit.meta,
        dataset: DATASET,
        license: LICENSE,
        counts: {
            accepted: audit.accepted,
            withPhone: audit.withPhone,
            withWeb: audit.withWeb,
            withEmail: audit.withEmail,
            withSocials: audit.withSocials,
            withGeo: audit.withGeo,
            verified: audit.verified,
            ambiguous: audit.ambiguous,
            disputedPhones: audit.disputedPhones
        },
        providers: enriched
    }), 'utf8');
    fs.writeFileSync(AUDIT, JSON.stringify(audit, null, 2), 'utf8');
    writeSummary(audit);

    if (!has('--no-webcrawl')) {
        const merged = applyWebcrawlMerge({
            enrichmentPath: ENRICHMENT,
            crawlPath: path.join(REPORTS, 'PROVIDER_WEBCRAWL_INTEL.json')
        });
        if (merged.applied) {
            log(`Crawl web fusionado: +${merged.stats.phonesAdded} teléfonos · +${merged.stats.emailsAdded} emails · ${merged.stats.disputedPhones} conflictos retirados · verificados ${merged.stats.verifiedBefore} -> ${merged.stats.verifiedAfter}`);
        } else {
            log(`Sin overlay de crawl web (${merged.reason}). Fase 1 pendiente.`);
        }
    }

    console.log(JSON.stringify(audit, null, 2));
    console.log(`[ENRICH] ${path.relative(ROOT, ENRICHMENT)} · ${Object.keys(enriched).length} proveedores`);
}

main();

