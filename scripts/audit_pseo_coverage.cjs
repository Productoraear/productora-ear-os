#!/usr/bin/env node
/**
 * scripts/audit_pseo_coverage.cjs
 *
 * AUDITOR DE COBERTURA pSEO (AF-5 / EP-1 · Ley del Auditor Real)
 * ---------------------------------------------------------------
 * Mide, SIN construir y SIN red, tres cosas que hasta hoy eran opinión:
 *   1. Cuántos municipios declara de verdad cada dataset del repo.
 *   2. Cuántos servicios/gremios puede cruzar el motor.
 *   3. Cuál es la matriz teórica de URLs y qué porcentaje del universo
 *      municipal español (referencia configurable, por defecto 8131) cubre.
 *
 * Añade el dato que ninguna cifra de marketing suele mirar: el porcentaje de
 * municipios con datos DIFERENCIADORES (distancia real, tier, fincas,
 * festivos). Un municipio sin diferenciales produce una página casi idéntica a
 * las demás: es el patrón que Google llama "doorway page" y castiga con acción
 * manual. Por eso el auditor separa "URLs creadas" de "URLs defendibles".
 *
 * Uso:
 *   node scripts/audit_pseo_coverage.cjs            # informe humano, exit 0
 *   node scripts/audit_pseo_coverage.cjs --json     # resumen máquina
 *   node scripts/audit_pseo_coverage.cjs --strict   # exit 1 si déficit real
 *   node scripts/audit_pseo_coverage.cjs --ine=8200 # cambia la referencia
 *
 * Exit codes:
 *   0 = medición completa (déficit sin --strict es información, no bloqueo)
 *   1 = --strict y (matriz vacía | diferenciales < 90% | cobertura < 100%)
 *   2 = no se pudo leer un fichero fuente (deriva de rutas) → SOSPECHOSO
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARGS = process.argv.slice(2);
const JSON_OUT = ARGS.includes('--json');
const STRICT = ARGS.includes('--strict');
const INE_ARG = ARGS.find((a) => a.startsWith('--ine='));
/** Referencia configurable: nº de municipios de España (INE). No es un claim de copy. */
const INE_UNIVERSE = INE_ARG ? Number(INE_ARG.split('=')[1]) : 8131;

const SOURCES = {
    engineDb: path.join(ROOT, 'src', 'lib', 'geo', 'spanish-municipalities.ts'),
    constants: path.join(ROOT, 'src', 'lib', 'constants', 'spanish-municipalities.ts'),
    sitemapGen: path.join(ROOT, 'src', 'lib', 'seo', 'sitemapGenerator.ts'),
    sitemapApp: path.join(ROOT, 'src', 'app', 'sitemap.ts'),
};

class MissingSourceError extends Error {}

function readSource(key) {
    const file = SOURCES[key];
    if (!fs.existsSync(file)) {
        throw new MissingSourceError(`${key} no existe: ${path.relative(ROOT, file)}`);
    }
    return fs.readFileSync(file, 'utf8');
}

/** Extrae el bloque `[ ... ]` que sigue a `name =`, equilibrando corchetes. */
function sliceArrayBlock(source, name) {
    const idx = source.indexOf(name);
    if (idx === -1) return null;
    const eq = source.indexOf('= [', idx);
    if (eq === -1) return null;
    const open = eq + 2;
    let depth = 0;
    for (let i = open; i < source.length; i += 1) {
        const ch = source[i];
        if (ch === '[') depth += 1;
        else if (ch === ']') {
            depth -= 1;
            if (depth === 0) return source.slice(open, i + 1);
        }
    }
    return null;
}

/** Extrae el bloque `{ ... }` que sigue a `name =`, equilibrando llaves. */
function sliceObjectBlock(source, name) {
    const idx = source.indexOf(name);
    if (idx === -1) return null;
    const eq = source.indexOf('= {', idx);
    if (eq === -1) return null;
    const open = eq + 2;
    let depth = 0;
    for (let i = open; i < source.length; i += 1) {
        const ch = source[i];
        if (ch === '{') depth += 1;
        else if (ch === '}') {
            depth -= 1;
            if (depth === 0) return source.slice(open, i + 1);
        }
    }
    return null;
}

function countMatches(text, re) {
    return (text.match(re) || []).length;
}

function audit() {
    const engineSrc = readSource('engineDb');
    const constantsSrc = readSource('constants');
    const sitemapGenSrc = readSource('sitemapGen');
    const sitemapAppSrc = readSource('sitemapApp');

    // ── 1. MUNICIPALITIES_DATABASE (motor pSEO de poblaciones) ────────────────
    const dbBlock = sliceArrayBlock(engineSrc, 'MUNICIPALITIES_DATABASE');
    if (!dbBlock) throw new MissingSourceError('MUNICIPALITIES_DATABASE no encontrado');

    const dbRows = dbBlock.split('\n').filter((l) => l.trim().startsWith('{ id:'));
    const tiers = { 1: 0, 2: 0, 3: 0, otros: 0 };
    let dbWithFincas = 0;
    let dbWithPatronal = 0;
    let dbWithIntent = 0;
    for (const row of dbRows) {
        const tier = row.match(/tier:\s*(\d)/);
        if (tier && (tier[1] === '1' || tier[1] === '2' || tier[1] === '3')) tiers[tier[1]] += 1;
        else tiers.otros += 1;
        if (/hasFincas:\s*true/.test(row)) dbWithFincas += 1;
        if (/hasPatronalEvents:\s*true/.test(row)) dbWithPatronal += 1;
        if (/searchIntentScore:\s*\d+/.test(row)) dbWithIntent += 1;
    }

    // ── 2. MUNICIPALITIES_DATASET (provincia → TownNode[]) ───────────────────
    const datasetBlock = sliceObjectBlock(constantsSrc, 'MUNICIPALITIES_DATASET');
    if (!datasetBlock) throw new MissingSourceError('MUNICIPALITIES_DATASET no encontrado');

    const townNodes = countMatches(datasetBlock, /\{\s*name:/g);
    const townNodesWithDistance = countMatches(datasetBlock, /distanceFromMentrideKm:\s*\d+/g);
    const datasetProvinces = countMatches(datasetBlock, /^\s{2}'[a-z-]+':\s*\[/gm);

    // ── 3. SERVICES_PSEO_EXPANDED (gremios/servicios cruzables) ──────────────
    const servicesBlock = sliceArrayBlock(constantsSrc, 'SERVICES_PSEO_EXPANDED');
    if (!servicesBlock) throw new MissingSourceError('SERVICES_PSEO_EXPANDED no encontrado');
    const services = countMatches(servicesBlock, /\{\s*id:\s*'/g);

    // ── 4. Sitemap: particiones declaradas y rutas estáticas ─────────────────
    const partitionsMatch = sitemapGenSrc.match(/SITEMAP_PARTITIONS\s*=\s*\[([^\]]*)\]/);
    const partitions = partitionsMatch
        ? partitionsMatch[1].split(',').filter((s) => s.trim().length > 0).length
        : 0;
    const staticBlock = sliceArrayBlock(sitemapAppSrc, 'STATIC_ROUTES');
    const staticRoutes = staticBlock ? countMatches(staticBlock, /\{\s*path:/g) : 0;

    // ── 5. Matriz teórica y diferenciales ────────────────────────────────────
    const engineMunicipalities = dbRows.length;
    const geoMatrix = engineMunicipalities * services;
    const differentiatorHits = dbWithFincas + dbWithPatronal + dbWithIntent;
    const differentiatorRatio =
        engineMunicipalities === 0 ? 0 : differentiatorHits / (engineMunicipalities * 3);
    const datasetDistanceRatio = townNodes === 0 ? 0 : townNodesWithDistance / townNodes;
    const coveragePct = Math.min(100, (engineMunicipalities / INE_UNIVERSE) * 100);
    const missingMunicipalities = Math.max(0, INE_UNIVERSE - engineMunicipalities);

    const checks = [
        { id: 'ENGINE_DB_PRESENT', ok: engineMunicipalities > 0, detail: `${engineMunicipalities} municipios` },
        { id: 'SERVICES_PRESENT', ok: services > 0, detail: `${services} servicios` },
        { id: 'DATASET_PRESENT', ok: townNodes > 0, detail: `${townNodes} nodos en ${datasetProvinces} provincias` },
        { id: 'PARTITIONS_DECLARED', ok: partitions > 0, detail: `${partitions} particiones` },
        { id: 'STATIC_ROUTES_PRESENT', ok: staticRoutes > 0, detail: `${staticRoutes} rutas estáticas` },
        {
            id: 'DIFFERENTIATORS_HEALTHY',
            ok: differentiatorRatio >= 0.9,
            detail: `ratio diferenciales motor=${(differentiatorRatio * 100).toFixed(1)}% (umbral 90%)`,
        },
        {
            id: 'DATASET_DISTANCE_HEALTHY',
            ok: datasetDistanceRatio >= 0.9,
            detail: `dataset con distancia real=${(datasetDistanceRatio * 100).toFixed(1)}% (umbral 90%)`,
        },
        {
            id: 'COVERAGE_COMPLETE',
            ok: engineMunicipalities >= INE_UNIVERSE,
            detail: `cobertura=${coveragePct.toFixed(2)}% de ${INE_UNIVERSE} (faltan ${missingMunicipalities})`,
        },
    ];

    const failed = checks.filter((c) => !c.ok).map((c) => c.id);

    return {
        engine_municipalities: engineMunicipalities,
        engine_tiers: tiers,
        engine_with_fincas: dbWithFincas,
        engine_with_patronal: dbWithPatronal,
        engine_with_intent_score: dbWithIntent,
        dataset_towns: townNodes,
        dataset_towns_with_distance: townNodesWithDistance,
        dataset_provinces: datasetProvinces,
        services,
        sitemap_partitions: partitions,
        static_routes: staticRoutes,
        geo_matrix_theoretical: geoMatrix,
        ine_universe: INE_UNIVERSE,
        coverage_pct: Number(coveragePct.toFixed(2)),
        missing_municipalities: missingMunicipalities,
        differentiator_ratio: Number((differentiatorRatio * 100).toFixed(2)),
        dataset_distance_ratio: Number((datasetDistanceRatio * 100).toFixed(2)),
        checks: checks.length,
        failed,
        strict: STRICT,
        exit_code: STRICT && failed.length > 0 ? 1 : 0,
    };
}


function main() {
    let summary;
    try {
        summary = audit();
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (JSON_OUT) {
            console.log(JSON.stringify({ error: message, exit_code: 2, state: 'SOSPECHOSO' }, null, 2));
        } else {
            console.error(`[FAIL] PSEO_SOURCE_MISSING: ${message}`);
        }
        process.exit(2);
    }

    if (JSON_OUT) {
        console.log(JSON.stringify(summary, null, 2));
    } else {
        console.log('AUDIT pSEO COVERAGE · medición sin red, sin build');
        console.log('-'.repeat(72));
        console.log(`Motor MUNICIPALITIES_DATABASE : ${summary.engine_municipalities} municipios ` +
            `(T1=${summary.engine_tiers[1]} T2=${summary.engine_tiers[2]} T3=${summary.engine_tiers[3]} otros=${summary.engine_tiers.otros})`);
        console.log(`  fincas=${summary.engine_with_fincas} · patronales=${summary.engine_with_patronal} · intencion=${summary.engine_with_intent_score}`);
        console.log(`Dataset provincial (TownNode) : ${summary.dataset_towns} nodos en ${summary.dataset_provinces} provincias ` +
            `(${summary.dataset_towns_with_distance} con distancia real)`);
        console.log(`Servicios cruzables           : ${summary.services}`);
        console.log(`Matriz teorica                : ${summary.geo_matrix_theoretical} URLs ` +
            `(${summary.engine_municipalities} x ${summary.services})`);
        console.log(`Universo de referencia        : ${summary.ine_universe} municipios -> cobertura ${summary.coverage_pct}% ` +
            `(faltan ${summary.missing_municipalities})`);
        console.log(`Diferenciales                 : motor ${summary.differentiator_ratio}% · dataset ${summary.dataset_distance_ratio}%`);
        console.log(`Sitemap                       : ${summary.sitemap_partitions} particiones · ${summary.static_routes} rutas estaticas`);
        console.log('-'.repeat(72));
        if (summary.failed.length > 0) {
            console.log(`[FAIL] ${summary.failed.length}/${summary.checks} checks: ${summary.failed.join(' · ')}`);
        } else {
            console.log(`[OK] ${summary.checks}/${summary.checks} checks`);
        }
        console.log(`EXIT=${summary.exit_code}${summary.strict ? '' : ' (deficit = informacion, no bloqueo)'}`);
    }

    process.exit(summary.exit_code);
}

main();
