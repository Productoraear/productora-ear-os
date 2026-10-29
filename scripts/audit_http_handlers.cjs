#!/usr/bin/env node
/**
 * AUDITOR DE HANDLERS HTTP HUÉRFANOS (Ω-REAL)
 * ─────────────────────────────────────────────────────────────────────────────
 * Por qué existe: el 2026-10-29 el commit `5ca084a2a` se firmó como "VERIFICADO
 * en contrato" llevando un consumidor HTTP sin productor:
 *   `ControlDashboard.tsx` hace `useAdminResource('/api/admin/affiliates')`
 *   y `src/app/api/admin/affiliates/route.ts` NO estaba en el árbol de git.
 * Los tres instrumentos entonces vigentes (`tsc --noEmit`, `eslint`,
 * `audit_orphan_imports.cjs`) auditan IMPORTS; ninguno audita URLs de `fetch`.
 * Resultado: el tab Afiliados devuelve 404 en producción y el build de Coolify
 * sale VERDE — un defecto que aterriza en silencio, peor que `Module not found`.
 *
 * Qué mide: todo literal `/api/…` escrito en ficheros RASTREADOS bajo `src/`
 * debe tener un `route.{ts,tsx,js,jsx,mjs,cjs}` (App Router) o un fichero de
 * `src/pages/api/` (Pages Router) que lo sirva EN LA MISMA REF. No toca el disco:
 * lo que verifica es exactamente lo que Coolify clona.
 *
 * Uso:
 *   node scripts/audit_http_handlers.cjs                  # HEAD local
 *   node scripts/audit_http_handlers.cjs origin/main      # lo que despliega Coolify
 *   node scripts/audit_http_handlers.cjs --staged         # índice (pre-commit)
 *   node scripts/audit_http_handlers.cjs HEAD --json
 *   node scripts/audit_http_handlers.cjs --update-baseline # congela la deuda actual
 *
 * Deuda aceptada: `HEAD` arrastra 205 consumidores de rutas inexistentes en
 * páginas de demostración (`/api/health/*`, `/api/projects`…). Se congelan en
 * `scripts/audit_http_handlers.baseline.json`; el gate SOLO falla con deuda
 * NUEVA. Congelar es reconocer el agujero, no taparlo: cada entrada queda
 * datada y con su fichero.
 *
 * Límite declarado (no se finge cobertura): las URLs construidas por template
 * literal con interpolación (`/api/x/${id}`) no son resolubles estáticamente y
 * se contabilizan aparte en `AUDIT_DYNAMIC_REFUSED`. No cuentan como huérfanas
 * ni como verificadas.
 *
 * Exit codes:
 *   0 = 0 consumidores HTTP huérfanos
 *   1 = hay consumidores sin productor (se lista fichero:línea -> URL)
 *   2 = error de entorno (git ausente, ref inválida)
 */
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const ARGV = process.argv.slice(2);
const AS_JSON = ARGV.includes('--json');
const STAGED = ARGV.includes('--staged');
const REF = ARGV.find((arg) => !arg.startsWith('-')) || 'HEAD';

/**
 * Deuda aceptada. Sin esto el gate es inservible: en HEAD conviven 205
 * consumidores de rutas inexistentes (catálogos de `/api/health/*` y
 * `/api/projects` en páginas de demostración de 2024). La regla es la de
 * `audit_orphan_imports`: la deuda de bóveda se reporta, no pinta el gate de
 * rojo PARA SIEMPRE; lo que JAMÁS puede pasar es deuda NUEVA.
 */
const BASELINE_PATH =
    (ARGV.find((arg) => arg.startsWith('--baseline=')) || '').slice('--baseline='.length) ||
    'scripts/audit_http_handlers.baseline.json';
const UPDATE_BASELINE = ARGV.includes('--update-baseline');

const baselineKey = (file, url) => `${file} -> ${url}`;

/** Zonas que el build de Next NO compila (mismo criterio que audit_orphan_imports). */
const EXCLUDED_PREFIXES = [
    'src/adn_vault/',
    'src/adn_vault_staging/',
    'src/data/staging/',
    'scripts/',
    'Marketing_Skills/',
    'extracted_astra_neural/',
];

/** App Router: fichero `route.<ext>` dentro de `src/app`. Pages Router: `src/pages/api`. */
const APP_ROUTE_FILE = /^(src\/app\/.+)\/route\.(ts|tsx|js|jsx|mjs|cjs)$/;
const PAGES_ROUTE_FILE = /^src\/pages\/(api\/.+?)\.(ts|tsx|js|jsx|mjs|cjs)$/;

/** Un literal de ruta de API dentro de comillas simples, dobles o backticks. */
const SEARCH_PATTERN = "['\"`]/api/[A-Za-z0-9_-]";

/** Extrae `/api/…` de un fragmento de línea. */
const LITERAL = /\/api\/[A-Za-z0-9_\-\/\[\]]*/g;

const isExcluded = (file) => EXCLUDED_PREFIXES.some((prefix) => file.startsWith(prefix));

function git(args, { allowFailure = false } = {}) {
    try {
        return execFileSync('git', args, {
            encoding: 'utf8',
            maxBuffer: 1 << 28,
            stdio: ['ignore', 'pipe', 'pipe'],
        });
    } catch (error) {
        if (allowFailure) return '';
        throw error;
    }
}

function listFiles() {
    const raw = STAGED
        ? git(['ls-files', '--cached'])
        : git(['ls-tree', '-r', '--name-only', REF]);
    return raw.split(/\r?\n/).filter(Boolean);
}

/**
 * `git grep` resuelve en UNA pasada lo que un `git show` por fichero tardaría
 * minutos: devuelve `<rev>:<path>:<línea>:<contenido>` (o `<path>:<línea>:…`
 * cuando se busca en el índice).
 */
function grepApiLiterals() {
    const base = ['grep', '-n', '-I', '--no-color', '-E'];
    const args = STAGED
        ? [...base, '--cached', SEARCH_PATTERN, '--', 'src/']
        : [...base, SEARCH_PATTERN, REF, '--', 'src/'];
    const raw = git(args, { allowFailure: true });
    if (!raw) return [];

    const prefix = STAGED ? '' : `${REF}:`;
    const hits = [];
    for (const rawLine of raw.split(/\r?\n/)) {
        if (!rawLine) continue;
        const payload = rawLine.startsWith(prefix) ? rawLine.slice(prefix.length) : rawLine;
        const match = /^(.*?):(\d+):(.*)$/.exec(payload);
        if (!match) continue;
        hits.push({ file: match[1], line: Number(match[2]), content: match[3] });
    }
    return hits;
}

/**
 * Índice de productores. Los grupos de ruta del App Router (`(admin)`) no son
 * segmentos de URL y se descartan, o el resolutor inventaría 404 inexistentes.
 */
function buildRouteIndex(files) {
    const routes = [];
    for (const file of files) {
        const app = APP_ROUTE_FILE.exec(file);
        if (app) {
            const segments = app[1]
                .replace(/^src\/app/, '')
                .split('/')
                .filter(Boolean)
                .filter((segment) => !/^\(.*\)$/.test(segment));
            routes.push({ file, segments });
            continue;
        }
        const pages = PAGES_ROUTE_FILE.exec(file);
        if (pages) {
            routes.push({ file, segments: pages[1].split('/').filter(Boolean) });
        }
    }
    return routes;
}

/** `[id]` consume un segmento; `[...slug]` / `[[...slug]]` consumen el resto. */
function matchesRoute(consumer, route) {
    for (let i = 0; i < route.length; i += 1) {
        const segment = route[i];
        if (segment.startsWith('[[')) return true;
        if (segment.startsWith('[...')) return i < consumer.length;
        if (i >= consumer.length) return false;
        if (segment.startsWith('[')) continue;
        if (segment !== consumer[i]) return false;
    }
    return route.length === consumer.length;
}

function isComment(content) {
    const trimmed = content.trim();
    return (
        trimmed.startsWith('//') ||
        trimmed.startsWith('*') ||
        trimmed.startsWith('/*') ||
        trimmed.startsWith('{/*')
    );
}

function loadBaseline() {
    try {
        const raw = fs.readFileSync(path.resolve(process.cwd(), BASELINE_PATH), 'utf8');
        const parsed = JSON.parse(raw);
        const entries = Array.isArray(parsed?.accepted) ? parsed.accepted : [];
        return new Set(entries.map((entry) => baselineKey(entry.file, entry.url)));
    } catch (error) {
        if (error.code === 'ENOENT') return new Set();
        throw error;
    }
}

function writeBaseline(entries) {
    const payload = {
        generatedAt: new Date().toISOString(),
        ref: STAGED ? 'STAGED_INDEX' : REF,
        note: 'Deuda aceptada de consumidores HTTP sin productor (rutas inexistentes en el arbol). Solo la deuda NUEVA rompe el gate audit:http.',
        accepted: entries.map((item) => ({ file: item.file, url: item.url })),
    };
    const target = path.resolve(process.cwd(), BASELINE_PATH);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
}

function main() {
    let files;
    try {
        if (!STAGED) git(['rev-parse', '--verify', REF]);
        files = listFiles();
    } catch (error) {
        console.error(`AUDIT_ENV_ERROR: no se pudo leer "${STAGED ? 'el índice' : REF}": ${error.message}`);
        process.exit(2);
    }

    const routes = buildRouteIndex(files);
    const hits = grepApiLiterals();

    const orphans = [];
    const dynamic = [];
    let checked = 0;

    for (const hit of hits) {
        if (isExcluded(hit.file)) continue;
        if (isComment(hit.content)) continue;

        LITERAL.lastIndex = 0;
        let match;
        while ((match = LITERAL.exec(hit.content)) !== null) {
            const rawLiteral = match[0];
            const end = match.index + rawLiteral.length;
            const url = rawLiteral.replace(/[?#].*$/, '').replace(/\/+$/, '');

            if (hit.content.slice(end, end + 2) === '${') {
                dynamic.push(`${hit.file}:${hit.line} -> ${rawLiteral}...`);
                continue;
            }
            if (url.length < 5) continue;

            checked += 1;
            const segments = url.split('/').filter(Boolean);
            const resolved = routes.some((route) => matchesRoute(segments, route.segments));
            if (!resolved) orphans.push({ file: hit.file, line: hit.line, url });
        }
    }

    const known = loadBaseline();
    const knownDebt = [];
    const fresh = [];
    for (const item of orphans) {
        if (known.has(baselineKey(item.file, item.url))) knownDebt.push(item);
        else fresh.push(item);
    }
    if (UPDATE_BASELINE) writeBaseline(orphans);

    const uniqueUrls = [...new Set(fresh.map((item) => item.url))].sort();

    if (AS_JSON) {
        console.log(
            JSON.stringify(
                {
                    ref: STAGED ? 'STAGED_INDEX' : REF,
                    mode: 'http-consumer-to-route-handler',
                    routeHandlers: routes.length,
                    literalsChecked: checked,
                    orphansTotal: orphans.length,
                    orphansNew: fresh.length,
                    knownDebt: knownDebt.length,
                    orphanUrls: uniqueUrls,
                    dynamicRefused: dynamic.length,
                    findings: fresh,
                },
                null,
                2
            )
        );
    } else {
        console.log(`AUDIT_REF=${STAGED ? 'STAGED_INDEX' : REF}`);
        console.log('AUDIT_MODE=http-consumer-to-route-handler');
        console.log(`AUDIT_ROUTE_HANDLERS=${routes.length}`);
        console.log(`AUDIT_API_LITERALS_CHECKED=${checked}`);
        console.log(`AUDIT_ORPHAN_HTTP=${fresh.length}`);
        for (const item of fresh.slice(0, 100)) {
            console.log(`  ORPHAN_HTTP ${item.file}:${item.line} -> ${item.url}`);
        }
        if (uniqueUrls.length > 0) {
            console.log(`AUDIT_ORPHAN_URLS=${uniqueUrls.join(',')}`);
        }
        console.log(`AUDIT_KNOWN_DEBT=${knownDebt.length} (deuda aceptada en ${BASELINE_PATH})`);
        console.log(
            `AUDIT_DYNAMIC_REFUSED=${dynamic.length} (template literal con interpolación: no resoluble estáticamente)`
        );
        if (UPDATE_BASELINE) {
            console.log(`AUDIT_BASELINE_WRITTEN=${BASELINE_PATH} (${orphans.length} entradas)`);
        }
    }

    if (UPDATE_BASELINE) process.exit(0);
    process.exit(fresh.length === 0 ? 0 : 1);
}

main();
