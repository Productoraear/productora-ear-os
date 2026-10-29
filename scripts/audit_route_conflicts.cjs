#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * AUDITOR DE CONFLICTOS DE RUTA — Next.js App Router (Exit Code real)
 * ════════════════════════════════════════════════════════════════════════════
 * Detecta, ANTES del build, el fallo P0:
 *   "You cannot have two parallel pages that resolve to the same path."
 *
 * Qué hace:
 *   1. Recorre `src/app` y resuelve el pathname REAL de cada `page.*` / `route.*`
 *      eliminando grupos de ruta `(public)`, `(auth)`… que no aportan segmento.
 *   2. Salta carpetas privadas (`_carpeta`), slots paralelos (`@modal`) e
 *      intercepciones (`(.)`, `(..)`, `(...)`), que no son rutas navegables.
 *   3. Denuncia también dos rutas dinámicas hermanas con distinto nombre de
 *      segmento (`[id]` vs `[slug]`), que Next rechaza igual.
 *
 * Uso:    node scripts/audit_route_conflicts.cjs
 * Exit:   0 → 0 conflictos · 1 → hay conflictos (bloquea el build)
 * Salida: legible + resumen JSON de 1 línea apto para logs/CI.
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const PAGE_EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js', '.mdx']);
const ROUTE_BASENAMES = new Set(['page', 'route']);

/** La raíz debe existir: si no, el auditor miente y eso es una fachada. */
if (!fs.existsSync(APP_DIR)) {
    console.error(`[ROUTE-AUDIT] FATAL: no existe ${APP_DIR}`);
    process.exit(2);
}

function isRouteGroup(segment) {
    return segment.startsWith('(') && segment.endsWith(')') && !/^\(\.{1,3}\)/.test(segment);
}

function isInterceptingRoute(segment) {
    return /^\(\.{1,3}\)/.test(segment);
}

function isParallelSlot(segment) {
    return segment.startsWith('@');
}

function isPrivateFolder(segment) {
    return segment.startsWith('_');
}

function isDynamicSegment(segment) {
    return segment.startsWith('[') && segment.endsWith(']');
}

/** Clave canónica del pathname: los segmentos dinámicos colapsan a un marcador. */
function canonicalize(segments) {
    return '/' + segments.map((segment) => (isDynamicSegment(segment) ? '[]' : segment)).join('/');
}

/** @type {Array<{ kind: 'page' | 'route', pathname: string, key: string, dynamicNames: string[], intercepted: boolean, file: string }>} */
const routes = [];

/**
 * @param {string} dir
 * @param {string[]} resolved Segmentos ya resueltos (sin grupos ni slots)
 * @param {string[]} dynamicNames Nombre de segmento dinámico por posición
 * @param {boolean} intercepted Dentro de una intercepción: no es ruta navegable
 */
function walk(dir, resolved, dynamicNames, intercepted) {
    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (error) {
        console.error(`[ROUTE-AUDIT] No se pudo leer ${dir}: ${error.message}`);
        return;
    }

    for (const entry of entries) {
        const absolute = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            if (isPrivateFolder(entry.name)) continue;
            if (isInterceptingRoute(entry.name)) {
                walk(absolute, resolved, dynamicNames, true);
                continue;
            }
            if (isParallelSlot(entry.name) || isRouteGroup(entry.name)) {
                walk(absolute, resolved, dynamicNames, intercepted);
                continue;
            }
            walk(
                absolute,
                [...resolved, entry.name],
                isDynamicSegment(entry.name) ? [...dynamicNames, entry.name] : dynamicNames,
                intercepted
            );
            continue;
        }

        if (!entry.isFile()) continue;

        const extension = path.extname(entry.name);
        if (!PAGE_EXTENSIONS.has(extension)) continue;

        const basename = path.basename(entry.name, extension);
        if (!ROUTE_BASENAMES.has(basename)) continue;

        routes.push({
            kind: basename === 'page' ? 'page' : 'route',
            pathname: resolved.length === 0 ? '/' : `/${resolved.join('/')}`,
            key: canonicalize(resolved),
            dynamicNames,
            intercepted,
            file: path.relative(process.cwd(), absolute).replace(/\\/g, '/'),
        });
    }
}

walk(APP_DIR, [], [], false);

/** @type {Map<string, typeof routes>} */
const byKey = new Map();
for (const route of routes) {
    if (route.intercepted) continue;
    const bucket = byKey.get(route.key);
    if (bucket) bucket.push(route);
    else byKey.set(route.key, [route]);
}

const conflicts = [];
for (const [key, bucket] of byKey) {
    if (bucket.length < 2) continue;

    const pages = bucket.filter((entry) => entry.kind === 'page');
    const handlers = bucket.filter((entry) => entry.kind === 'route');

    if (pages.length > 1) {
        conflicts.push({ type: 'DUPLICATE_PAGE', key, files: pages.map((entry) => entry.file) });
    }
    if (handlers.length > 1) {
        conflicts.push({
            type: 'DUPLICATE_ROUTE_HANDLER',
            key,
            files: handlers.map((entry) => entry.file),
        });
    }
    if (pages.length > 0 && handlers.length > 0) {
        conflicts.push({ type: 'PAGE_VS_ROUTE_HANDLER', key, files: bucket.map((entry) => entry.file) });
    }

    const signatures = new Set(bucket.map((entry) => entry.dynamicNames.join('|')));
    if (signatures.size > 1) {
        conflicts.push({
            type: 'DYNAMIC_SLUG_MISMATCH',
            key,
            files: bucket.map((entry) => `${entry.file} → ${entry.pathname}`),
        });
    }
}

const navRoutes = routes.filter((route) => !route.intercepted);
const pageCount = navRoutes.filter((route) => route.kind === 'page').length;

console.log('[ROUTE-AUDIT] Directorio:', path.relative(process.cwd(), APP_DIR));
console.log(
    `[ROUTE-AUDIT] Rutas navegables: ${navRoutes.length} (páginas: ${pageCount} · ` +
        `handlers: ${navRoutes.length - pageCount}) · interceptadas ignoradas: ` +
        `${routes.length - navRoutes.length}`
);

if (conflicts.length === 0) {
    console.log('[ROUTE-AUDIT] ✅ 0 conflictos de ruta.');
    console.log(
        `SUMMARY ${JSON.stringify({ exit_code: 0, routes: navRoutes.length, conflicts: 0, types: [] })}`
    );
    process.exit(0);
}

for (const conflict of conflicts) {
    console.error(`\n✗ ${conflict.type} en ${conflict.key}`);
    for (const file of conflict.files) {
        console.error(`    - ${file}`);
    }
}

const types = Array.from(new Set(conflicts.map((conflict) => conflict.type)));
console.error(
    `\n[ROUTE-AUDIT] ❌ ${conflicts.length} conflicto(s). El build fallará: ` +
        'dos ficheros no pueden resolver al mismo pathname.'
);
console.log(
    `SUMMARY ${JSON.stringify({
        exit_code: 1,
        routes: navRoutes.length,
        conflicts: conflicts.length,
        types,
    })}`
);
process.exit(1);
