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

const { execSync, spawnSync } = require('node:child_process');
const path = require('node:path');

/**
 * DEFECTO CORREGIDO (2026-11-11): `--staged` estaba DOCUMENTADO (cabecera y
 * `audit:http:staged`) pero `REF` se resolvía con `find(a => !a.startsWith('-'))`
 * y el flag se descartaba en silencio: `--staged` auditaba HEAD igual que sin
 * flag. Un modo que miente sobre lo que mide es una fachada (AF-5). Ahora el flag
 * se traduce a la ref real del índice, que es lo que se va a commitear.
 */
const STAGED = process.argv.includes('--staged');
const GIT_INDEX = 'GIT_INDEX';
const REF =
    (process.argv.find((a) => !a.startsWith('-') && a !== process.argv[0] && a !== process.argv[1]) || null) ||
    (STAGED ? GIT_INDEX : 'HEAD');
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

/**
 * LECTURA EN LOTE (2026-11-11 · BLOQUEO DE PREPUSH MEDIDO).
 * ───────────────────────────────────────────────────────────────────────────
 * DEFECTO: `makeReader` ejecutaba `git show <ref>:<file>` con `execSync` por
 * CADA fichero del grafo. En este árbol (3.464 ficheros rastreados, ~2.600
 * alcanzables) cada `execSync` paga el arranque completo de git y el de un
 * `cmd /d /s /c` intermedio: medido a ~800 ms por invocación en esta máquina.
 * Resultado real: `npm run gate:prepush` quedó colgado > 25 min en este paso
 * con 3 procesos zombis (PIDs 20532/31820/29012) y bloqueó la terminal. El
 * gate no era lento: era logarítmicamente inviable.
 *
 * ARREGLO: un ÚNICO `git cat-file --batch` con todos los objetos pedidos por
 * stdin. Mismo dato, mismo árbol de git, mismo veredicto; una sola invocación.
 * Se parsea el protocolo documentado (`<oid> blob <size>\n<contenido>\n`).
 */
function catFileBatch(ref, files) {
    const contents = new Map();
    if (files.length === 0) return contents;

    // Sin `encoding` explícito la salida es un Buffer: el contenido llega binario tal
    // cual y se decodifica por fichero (un .png tampoco rompe el parseo).
    const full = spawnSync('git', ['cat-file', '--batch'], {
        input: files.map((file) => objectSpec(ref, file)).join('\n') + '\n',
        maxBuffer: 1 << 28,
    });
    if (full.error || !full.stdout) {
        throw new Error(`git cat-file --batch falló: ${full.error ? full.error.message : 'sin salida'}`);
    }

    // Contadores reales del modo --batch (declarados en la salida, no inferidos).
    const status = full.stdout;
    let cursor = 0;
    for (const file of files) {
        const headerEnd = status.indexOf(10, cursor); // '\n'
        if (headerEnd === -1) break;
        const header = status.subarray(cursor, headerEnd).toString('utf8');
        cursor = headerEnd + 1;

        // Objeto ausente o ilegible: `<spec> missing|ambiguous` ⇒ sin imports que rastrear.
        const fields = header.split(' ');
        if (fields.length === 2 && (fields[1] === 'missing' || fields[1] === 'ambiguous')) {
            contents.set(file, '');
            continue;
        }
        if (fields.length < 3) {
            contents.set(file, '');
            continue;
        }
        const size = Number.parseInt(fields[2], 10);
        if (!Number.isFinite(size) || size < 0) {
            contents.set(file, '');
            break; // protocolo roto: no se inventan contenidos
        }
        contents.set(file, status.subarray(cursor, cursor + size).toString('utf8'));
        cursor += size + 1; // contenido + '\n' separador
    }
    return contents;
}

function listTree(ref) {
    // Índice (pre-commit): lo que de verdad se va a commitear, no el working tree
    // (que puede contener basura sin stagear) ni HEAD (que aún no lo tiene).
    const cmd = ref === GIT_INDEX
        ? 'git ls-files --cached'
        : `git ls-tree -r --name-only ${ref}`;
    const raw = execSync(cmd, { encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'pipe'] });
    return raw.split(/\r?\n/).filter(Boolean);
}

/** Contenido de un objeto del índice: `git cat-file --batch` admite `:<path>`. */
function objectSpec(ref, file) {
    return ref === GIT_INDEX ? `:${file}` : `${ref}:${file}`;
}

/**
 * Mapa de alias REAL, leído de `tsconfig.json` en la propia ref. Sin esto el
 * auditor inventa convenciones: `@/contexts/X` NO vive en `src/contexts/X`
 * (el tsconfig lo mapea a `src/context/X`) y `@/components/*` tiene DOS raíces.
 * Un resolvedor que ignora `paths` produce falsos BUILD_BREAKER y quema el gate.
 */
function loadPathMap(ref) {
    try {
        const raw = execSync(
            ref === GIT_INDEX ? 'git show :tsconfig.json' : `git show ${ref}:tsconfig.json`,
            { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }
        );
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

function makeReader(ref, files) {
    // Sin lista de ficheros no hay lote que pedir (llamadas legadas): degrado honesto.
    const contents = files ? catFileBatch(ref, [...new Set(files)]) : new Map();
    return (file) => contents.get(file) ?? '';
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
    const pathMap = loadPathMap(ref);
    const entrypoints = [...tree].filter(isEntrypoint).filter((file) => !isExcluded(file));
    // LECTURA EN LOTE: se pide el árbol ENTERO elegible en una sola invocación de git
    // (entrypoints + todo candidato resoluble). Un fichero no alcanzado sólo ocupa
    // memoria unos milisegundos; una invocación de git por fichero costaba minutos.
    const candidates = [...tree].filter((file) => /\.[cm]?[jt]sx?$/.test(file));
    const read = makeReader(ref, candidates);
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
function analyzeExcluded(tree, pathMap, ref) {
    const excludedFiles = [...tree].filter(
        (file) => isExcluded(file) && /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(file)
    );
    const read = makeReader(ref, excludedFiles);
    const broken = [];
    let files = 0;
    for (const file of excludedFiles) {
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
        if (REF !== GIT_INDEX) git(`rev-parse --verify ${REF}`);
        tree = new Set(listTree(REF));
    } catch (error) {
        console.error(`AUDIT_ENV_ERROR: no se pudo leer la ref "${REF}": ${error.message}`);
        process.exit(2);
    }

    const reachable = analyzeReachable(REF, tree);
    const excluded = analyzeExcluded(tree, reachable.pathMap, REF);

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
