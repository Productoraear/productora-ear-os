#!/usr/bin/env node
/**
 * AUDITOR DE IMPORTS HUÉRFANOS (Ω-REAL)
 * ─────────────────────────────────────────────────────────────────────────────
 * Por qué existe: el 2026-10-28 el deploy de producción murió con
 * `Module not found: Can't resolve '@/lib/constants/mariachi-market-intelligence'`
 * en `94d8dcc7d`. Ese fallo NO se ve con `tsc --noEmit` en local (el fichero
 * existía en el working tree) y sí tumba el build del VPS. Auditor fantasma =
 * fachada de papel, así que este fichero resuelve imports contra el ÁRBOL DE GIT
 * (no contra el disco): lo que verifica es exactamente lo que Coolify clona.
 *
 * Uso:
 *   node scripts/audit_orphan_imports.cjs                 # HEAD local
 *   node scripts/audit_orphan_imports.cjs origin/main     # lo que despliega Coolify
 *   node scripts/audit_orphan_imports.cjs origin/main --json
 *
 * Exit codes:
 *   0 = 0 imports rotos (el build no morirá por módulo ausente)
 *   1 = hay imports rotos (se lista fichero -> especificador)
 *   2 = error de entorno (git ausente, ref inválida)
 */
'use strict';

const { execSync } = require('node:child_process');
const path = require('node:path');

const REF = process.argv.find((a) => !a.startsWith('-') && a !== process.argv[0] && a !== process.argv[1]) || 'HEAD';
const AS_JSON = process.argv.includes('--json');
const SHOW_EXCLUDED = process.argv.includes('--show-excluded');

/**
 * Zonas que el build de Next NO compila: `tsconfig.json > exclude` (más las que
 * el bundler ignora por no ser alcanzables). Un import roto aquí NO tumba el
 * build — reportarlo como fallo bloquearía el gate para siempre por deuda de
 * bóveda (212 falsos positivos medidos el 2026-10-28).
 */
const EXCLUDED_PREFIXES = [
    'src/adn_vault/',
    'src/adn_vault_staging/',
    'src/data/staging/',
    'scripts/',
    'Marketing_Skills/',
    'extracted_astra_neural/',
];

/** Entrypoints reales del App Router: de aquí cuelga todo lo que Next compila. */
const ENTRY_PATTERNS = [
    /^src\/app\/.*\.(ts|tsx|js|jsx)$/,
    /^src\/middleware\.(ts|tsx|js)$/,
    /^src\/instrumentation(-edge|-node)?\.(ts|tsx|js)$/,
    /^next\.config\.(ts|js|mjs)$/,
];

const isExcluded = (file) => EXCLUDED_PREFIXES.some((prefix) => file.startsWith(prefix));
const isEntrypoint = (file) => ENTRY_PATTERNS.some((re) => re.test(file));

/** Extensiones que resuelve el bundler de Next (TS + JS + barrels). */
const CANDIDATE_SUFFIXES = [
    '',
    '.ts',
    '.tsx',
    '.js',
    '.jsx',
    '.mjs',
    '.cjs',
    '/index.ts',
    '/index.tsx',
    '/index.js',
];

function git(args, maxBuffer = 1 << 26) {
    return execSync(`git ${args}`, { encoding: 'utf8', maxBuffer, stdio: ['ignore', 'pipe', 'pipe'] });
}

function listTree(ref) {
    const raw = git(`ls-tree -r --name-only ${ref}`);
    return raw.split(/\r?\n/).filter(Boolean);
}

/**
 * Mapa de alias REAL, leído de `tsconfig.json` en la propia ref. Sin esto el
 * auditor inventa convenciones: `@/contexts/X` NO vive en `src/contexts/X`
 * (el tsconfig lo mapea a `src/context/X`) y `@/components/*` tiene DOS raíces.
 * Un resolvedor que ignora `paths` produce falsos BUILD_BREAKER y quema el gate.
 */
function loadPathMap(ref) {
    try {
        const raw = git(`show ${ref}:tsconfig.json`);
        const parsed = JSON.parse(raw);
        const paths = parsed?.compilerOptions?.paths ?? {};
        return Object.entries(paths).map(([pattern, targets]) => [pattern, Array.isArray(targets) ? targets : [targets]]);
    } catch {
        return [];
    }
}

function resolveInTree(fromFile, specifier, tree, pathMap) {
    const isRelative = specifier.startsWith('.');
    if (!isRelative) {
        for (const [pattern, targets] of pathMap) {
            const star = pattern.indexOf('*');
            let captured = '';
            if (star === -1) {
                if (specifier !== pattern) continue;
            } else {
                const prefix = pattern.slice(0, star);
                const suffix = pattern.slice(star + 1);
                if (!specifier.startsWith(prefix) || !specifier.endsWith(suffix)) continue;
                captured = specifier.slice(prefix.length, specifier.length - suffix.length);
            }
            for (const target of targets) {
                const base = path.posix.normalize(target.replace('*', captured));
                for (const ext of CANDIDATE_SUFFIXES) {
                    if (tree.has(base + ext)) return { resolved: true, target: base + ext };
                }
            }
        }
        return { resolved: false, target: specifier };
    }

    const base = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), specifier));
    for (const ext of CANDIDATE_SUFFIXES) {
        if (tree.has(base + ext)) return { resolved: true, target: base + ext };
    }
    return { resolved: false, target: base };
}

/** Captura `from '...'`, `import('...')` y `require('...')`. */
const IMPORT_RE = /(?:from\s+|import\s*\(\s*|require\s*\(\s*)['"]([^'"]+)['"]/g;

function makeReader(ref) {
    const cache = new Map();
    return (file) => {
        if (!cache.has(file)) {
            let content = '';
            try {
                content = git(`show ${ref}:"${file}"`, 1 << 24);
            } catch {
                content = ''; // binario o no legible: no hay imports que rastrear
            }
            cache.set(file, content);
        }
        return cache.get(file);
    };
}

function collectImports(content) {
    const specs = [];
    IMPORT_RE.lastIndex = 0;
    let match;
    while ((match = IMPORT_RE.exec(content)) !== null) {
        const specifier = match[1];
        if (specifier.startsWith('.') || specifier.startsWith('@/')) specs.push(specifier);
    }
    return specs;
}

/**
 * BFS desde los entrypoints del App Router: reproduce exactamente el grafo que
 * el bundler recorre. Un import roto DENTRO de este grafo tumba `next build`;
 * uno fuera (bóveda huérfana, scripts sueltos) no lo toca.
 */
function analyzeReachable(ref, tree) {
    const read = makeReader(ref);
    const pathMap = loadPathMap(ref);
    const entrypoints = [...tree].filter(isEntrypoint).filter((file) => !isExcluded(file));
    const reachable = new Set();
    const queue = [...entrypoints];
    const broken = [];
    let importsChecked = 0;

    while (queue.length > 0) {
        const file = queue.shift();
        if (reachable.has(file)) continue;
        reachable.add(file);

        for (const specifier of collectImports(read(file))) {
            importsChecked++;
            const { resolved, target } = resolveInTree(file, specifier, tree, pathMap);
            if (!resolved) {
                broken.push({ file, specifier, target });
                continue;
            }
            if (!reachable.has(target)) queue.push(target);
        }
    }

    return { entrypoints, reachable, broken, importsChecked, pathMap };
}

/** Imports rotos en zonas que el build no compila: deuda, nunca rojo de gate. */
function analyzeExcluded(tree, pathMap) {
    const read = makeReader(REF);
    const broken = [];
    let files = 0;
    for (const file of tree) {
        if (!isExcluded(file) || !/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(file)) continue;
        files++;
        for (const specifier of collectImports(read(file))) {
            const { resolved, target } = resolveInTree(file, specifier, tree, pathMap);
            if (!resolved) broken.push({ file, specifier, target });
        }
    }
    return { files, broken };
}

function main() {
    let tree;
    try {
        git(`rev-parse --verify ${REF}`);
        tree = new Set(listTree(REF));
    } catch (error) {
        console.error(`AUDIT_ENV_ERROR: no se pudo leer la ref "${REF}": ${error.message}`);
        process.exit(2);
    }

    const reachable = analyzeReachable(REF, tree);
    const excluded = analyzeExcluded(tree, reachable.pathMap);

    if (AS_JSON) {
        console.log(
            JSON.stringify(
                {
                    ref: REF,
                    mode: 'reachable-from-app-router',
                    entrypoints: reachable.entrypoints.length,
                    reachableFiles: reachable.reachable.size,
                    importsChecked: reachable.importsChecked,
                    brokenReachable: reachable.broken,
                    brokenInExcludedZones: excluded.broken.length,
                },
                null,
                2
            )
        );
    } else {
        console.log(`AUDIT_REF=${REF}`);
        console.log('AUDIT_MODE=reachable-from-app-router');
        console.log(`AUDIT_ENTRYPOINTS=${reachable.entrypoints.length}`);
        console.log(`AUDIT_REACHABLE_FILES=${reachable.reachable.size}`);
        console.log(`AUDIT_IMPORTS_CHECKED=${reachable.importsChecked}`);
        console.log(`AUDIT_BROKEN_REACHABLE=${reachable.broken.length}`);
        for (const item of reachable.broken.slice(0, 100)) {
            console.log(`  BUILD_BREAKER ${item.file} -> ${item.specifier}`);
        }
        console.log(`AUDIT_BROKEN_IN_EXCLUDED_ZONES=${excluded.broken.length} (no compilado por Next: deuda, no bloquea)`);
        if (SHOW_EXCLUDED) {
            for (const item of excluded.broken.slice(0, 60)) {
                console.log(`  DEBT ${item.file} -> ${item.specifier}`);
            }
        }
    }

    process.exit(reachable.broken.length === 0 ? 0 : 1);
}

main();
