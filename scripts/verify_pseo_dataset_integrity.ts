#!/usr/bin/env node
/**
 * scripts/verify_pseo_dataset_integrity.ts
 *
 * AUDITOR DE INTEGRIDAD DEL DATASET pSEO (W42_T03 · G-0 / EP-1 / AF-5)
 * --------------------------------------------------------------------
 * Convierte en comando ejecutable la promesa "datos reales antes que URLs".
 * Sin red, sin build, sin base de datos: solo la verdad que hay en disco.
 *
 * Verifica:
 *   1. 52 provincias y 255 nodos en MUNICIPALITIES_DATASET.
 *   2. 100% de TownNode con distanceFromMentrideKm numerico en [0, 2500] km,
 *      y > 0 salvo el propio hub (Mentrida = 0).
 *   3. 0 nodos con comarca placeholder ("Comarca Principal") o vacia.
 *   4. 0 slugs y 0 nombres duplicados dentro de una misma provincia.
 *   5. Anclas de calibracion del hub intactas (Mentrida 0, Navalcarnero 19,
 *      Madrid 54, Toledo 58, Talavera 82, Barcelona 665, Sevilla 515...).
 *   6. MUNICIPALITIES_DATABASE (motor geo): 250 filas, 100% con comarca y
 *      distancia, 0 slugs repetidos.
 *   7. SERVICES_PSEO_EXPANDED presente y con >= 11 servicios cruzables.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_pseo_dataset_integrity.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_pseo_dataset_integrity.ts --json
 *
 * Exit codes: 0 = todas las puertas pasan · 1 = al menos una falla.
 */

import { MUNICIPALITIES_DATASET, SERVICES_PSEO_EXPANDED } from '../src/lib/constants/spanish-municipalities';
import { MUNICIPALITIES_DATABASE } from '../src/lib/geo/spanish-municipalities';

const JSON_OUT = process.argv.includes('--json');
const HUB_SLUG = 'mentrida';
const MAX_KM = 2500;
const PLACEHOLDER = /comarca\s+principal/i;

/** Anclas del scaffold W42_T03: si una se mueve, algo se rompio de verdad. */
const CALIBRATION: Record<string, number> = {
    mentrida: 0,
    navalcarnero: 19,
    madrid: 54,
    toledo: 58,
    'talavera-de-la-reina': 82,
    barcelona: 665,
    sevilla: 515,
    cadiz: 625,
    valencia: 402,
    malaga: 530,
    bilbao: 435,
    zaragoza: 368,
};

interface Check {
    id: string;
    ok: boolean;
    detail: string;
}

const checks: Check[] = [];
const add = (id: string, ok: boolean, detail: string) => checks.push({ id, ok, detail });

// ── Inventario del dataset provincial ───────────────────────────────────────
const provinces = Object.keys(MUNICIPALITIES_DATASET);
const towns = provinces.flatMap((prov) => MUNICIPALITIES_DATASET[prov].map((t) => ({ prov, ...t })));

add('DATASET_PROVINCES_52', provinces.length === 52, `${provinces.length} provincias`);
add('DATASET_NODES_255', towns.length === 255, `${towns.length} nodos`);

const badDistance = towns.filter(
    (t) => typeof t.distanceFromMentrideKm !== 'number'
        || !Number.isFinite(t.distanceFromMentrideKm)
        || t.distanceFromMentrideKm < 0
        || t.distanceFromMentrideKm > MAX_KM,
);
add('DATASET_DISTANCE_100_PCT', badDistance.length === 0,
    `${towns.length - badDistance.length}/${towns.length} con km valido (0..${MAX_KM})` +
    (badDistance.length ? ` · fuera: ${badDistance.map((t) => t.slug).slice(0, 5).join(',')}` : ''));

const badComarca = towns.filter((t) => !t.comarca || PLACEHOLDER.test(t.comarca) || t.comarca.trim().length < 3);
add('DATASET_COMARCA_REAL', badComarca.length === 0,
    `${towns.length - badComarca.length}/${towns.length} con comarca real` +
    (badComarca.length ? ` · placeholders: ${badComarca.map((t) => t.slug).slice(0, 5).join(',')}` : ''));

const dupSlugs: string[] = [];
const dupNames: string[] = [];
for (const prov of provinces) {
    const list = MUNICIPALITIES_DATASET[prov];
    const slugs = new Set<string>();
    const names = new Set<string>();
    for (const t of list) {
        if (slugs.has(t.slug)) dupSlugs.push(`${prov}/${t.slug}`);
        if (names.has(t.name)) dupNames.push(`${prov}/${t.name}`);
        slugs.add(t.slug);
        names.add(t.name);
    }
}
add('DATASET_NO_DUP_SLUG', dupSlugs.length === 0, dupSlugs.length ? dupSlugs.join(',') : '0 duplicados');
add('DATASET_NO_DUP_NAME', dupNames.length === 0, dupNames.length ? dupNames.join(',') : '0 duplicados');

const hub = towns.find((t) => t.slug === HUB_SLUG);
add('HUB_PRESENT_ZERO_KM', Boolean(hub) && hub?.distanceFromMentrideKm === 0,
    hub ? `${hub.name} = ${hub.distanceFromMentrideKm} km` : 'hub ausente');

const bySlugOrName = new Map<string, number>();
for (const t of towns) {
    bySlugOrName.set(t.slug, t.distanceFromMentrideKm);
    const key = t.name.toLowerCase();
    if (!bySlugOrName.has(key)) bySlugOrName.set(key, t.distanceFromMentrideKm);
}
const drift = Object.entries(CALIBRATION).filter(([key, km]) => bySlugOrName.get(key) !== km);
add('CALIBRATION_ANCHORS', drift.length === 0,
    drift.length === 0
        ? `${Object.keys(CALIBRATION).length} anclas exactas`
        : `deriva: ${drift.map(([s, k]) => `${s}!=${k}`).join(',')}`);

const overZero = towns.filter((t) => t.slug !== HUB_SLUG && t.distanceFromMentrideKm <= 0);
add('DATASET_NO_ZERO_EXCEPT_HUB', overZero.length === 0, `${overZero.length} nodos a 0 km fuera del hub`);

// ── Motor geo (MUNICIPALITIES_DATABASE) ────────────────────────────────────
const geo = MUNICIPALITIES_DATABASE;
add('GEO_ROWS_250', geo.length === 250, `${geo.length} filas`);

const geoBad = geo.filter(
    (m) => typeof m.distanceFromMentrideKm !== 'number'
        || !Number.isFinite(m.distanceFromMentrideKm)
        || m.distanceFromMentrideKm < 0
        || m.distanceFromMentrideKm > MAX_KM
        || !m.comarca
        || PLACEHOLDER.test(m.comarca),
);
add('GEO_ENRICHED_100_PCT', geoBad.length === 0,
    `${geo.length - geoBad.length}/${geo.length} con comarca + km` +
    (geoBad.length ? ` · sin dato: ${geoBad.map((m) => m.slug).slice(0, 5).join(',')}` : ''));

const geoSlugs = new Set<string>();
const geoDup: string[] = [];
for (const m of geo) {
    if (geoSlugs.has(m.slug)) geoDup.push(m.slug);
    geoSlugs.add(m.slug);
}
add('GEO_NO_DUP_SLUG', geoDup.length === 0, geoDup.length ? geoDup.join(',') : '0 duplicados');

add('SERVICES_PSEO_PRESENT', SERVICES_PSEO_EXPANDED.length >= 11, `${SERVICES_PSEO_EXPANDED.length} servicios`);

// ── Salida ─────────────────────────────────────────────────────────────────
const failed = checks.filter((c) => !c.ok);
const kms = towns.map((t) => t.distanceFromMentrideKm);
const summary = {
    provinces: provinces.length,
    towns: towns.length,
    geo_rows: geo.length,
    services: SERVICES_PSEO_EXPANDED.length,
    km_min: Math.min(...kms),
    km_max: Math.max(...kms),
    km_avg: Number((kms.reduce((a, b) => a + b, 0) / kms.length).toFixed(1)),
    checks: checks.length,
    failed: failed.map((c) => c.id),
    exit_code: failed.length === 0 ? 0 : 1,
    state: failed.length === 0 ? 'VERIFICADO' : 'SOSPECHOSO',
};

if (JSON_OUT) {
    console.log(JSON.stringify({ ...summary, details: checks }, null, 2));
} else {
    console.log('VERIFY pSEO DATASET INTEGRITY · sin red, sin build');
    console.log('-'.repeat(72));
    for (const c of checks) console.log(`${c.ok ? '[OK]  ' : '[FAIL]'} ${c.id}: ${c.detail}`);
    console.log('-'.repeat(72));
    console.log(`Nodos ${summary.towns} · provincias ${summary.provinces} · geo ${summary.geo_rows} · ` +
        `km ${summary.km_min}..${summary.km_max} (media ${summary.km_avg})`);
    console.log(`${failed.length === 0 ? '[OK]' : '[FAIL]'} ${checks.length - failed.length}/${checks.length} checks · ` +
        `state=${summary.state}`);
    console.log(`EXIT=${summary.exit_code}`);
}

process.exit(summary.exit_code);

