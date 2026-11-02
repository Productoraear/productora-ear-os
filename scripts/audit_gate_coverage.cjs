#!/usr/bin/env node
/**
 * scripts/audit_gate_coverage.cjs
 * ============================================================================
 * AUDITOR DE COBERTURA DE PUERTAS (meta-gate) · EAR OS · OMEGA V10_SIGMA
 * ============================================================================
 * El agujero que cierra: un auditor que existe en `scripts/` pero que NO es
 * alcanzable desde `npm run gate:prepush` es una fachada de papel (§15): nunca
 * se ejecuta, nunca bloquea y su verde es decorativo. Verificado en disco el
 * 2026-11-02: la cadena de 21 puertas no invoca `verify:sitemap`, `audit:pseo`,
 * `audit:tariff-copy` ni `audit:residues`, y el verificador del sonómetro
 * (`scripts/verify_sonometro_pwa.cjs`, INV-13) ni siquiera tiene alias npm.
 *
 * Qué mide (solo lectura, cero dependencias, cero red):
 *   1. Lee los invariantes `INV-n` de `.clinerules` (la norma viva).
 *   2. Extrae de cada fila los comandos citados como verificación
 *      (`npm run <alias>` y `node scripts/<fichero>`).
 *   3. Comprueba si ese comando EXISTE en package.json / disco.
 *   4. Comprueba si es ALCANZABLE desde `gate:prepush` expandiendo
 *      transitivamente los `npm run` internos de cada script.
 *
 * Veredictos por invariante:
 *   WIRED       citado, existe y la cadena de puertas lo ejecuta
 *   MANUAL      existe pero exige entorno vivo (declarado en MANUAL_GATES)
 *   ORPHAN      existe y NUNCA se ejecuta → fachada de papel
 *   MISSING     la doctrina cita un comando que no está en disco
 *   SIN_COMANDO la fila no cita ningún comando automatizable (juicio humano)
 *
 * Uso:
 *   node scripts/audit_gate_coverage.cjs            # informe humano
 *   node scripts/audit_gate_coverage.cjs --json     # resumen máquina
 *   node scripts/audit_gate_coverage.cjs --strict   # SIN_COMANDO también falla
 *
 * Exit codes:
 *   0 = toda fila con comando está WIRED o MANUAL
 *   1 = hay ORPHAN o MISSING (o SIN_COMANDO con --strict)
 *   2 = no se pudo leer `.clinerules` o `package.json`
 * ============================================================================
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const RULES_PATH = path.join(ROOT, '.clinerules');
const PKG_PATH = path.join(ROOT, 'package.json');
const ARGS = process.argv.slice(2);
const JSON_OUT = ARGS.includes('--json');
const STRICT = ARGS.includes('--strict');

/** Puertas que exigen servicio vivo y por diseño no viven en prepush. */
const MANUAL_GATES = new Map([
    ['sim:event', 'requiere `npm run dev` en :3007 (ver cabecera del script)'],
    ['deploy:freshness', 'se ejecuta DESPUÉS del deploy (G-7), no antes del push'],
    ['probe:cron', 'sonda HTTP contra producción (U5)'],
]);

const SEVERITY = { WIRED: 1, MANUAL: 2, ORPHAN: 3, MISSING: 4, SIN_COMANDO: 0 };

/** Normaliza rutas relativas para comparar entre `npm` y citas de la doctrina. */
function normalize(relPath) {
    return String(relPath).replace(/\\/g, '/').replace(/^\.\//, '');
}

function readUtf8(file) {
    return fs.readFileSync(file, 'utf8');
}

function loadScripts() {
    const pkg = JSON.parse(readUtf8(PKG_PATH));
    const scripts = pkg && pkg.scripts;
    if (!scripts || typeof scripts !== 'object') {
        throw new Error('package.json sin bloque `scripts`');
    }
    return scripts;
}

function parseInvariants(text) {
    const rows = [];
    for (const line of text.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('| INV-')) continue;
        const cells = trimmed.split('|').map((cell) => cell.trim());
        if (cells.length < 4) continue;
        rows.push({ id: cells[1], invariant: cells[2], verification: cells[3] });
    }
    return rows;
}

function extractCommands(cell) {
    const commands = [];
    for (const match of cell.matchAll(/\bnpm run ([A-Za-z0-9:_-]+)/g)) {
        commands.push({ kind: 'npm', value: match[1] });
    }
    for (const match of cell.matchAll(/\bnode\s+(?:\.\/)?(scripts\/[A-Za-z0-9_./-]+\.(?:cjs|mjs|js|ts))/g)) {
        commands.push({ kind: 'file', value: normalize(match[1]) });
    }
    if (commands.length === 0 && /\btsc\b/.test(cell)) {
        commands.push({ kind: 'tsc', value: 'tsc --noEmit' });
    }
    return commands;
}

/** Expande `gate:prepush`: alias npm alcanzables + ficheros node ejecutados. */
function expandReachable(scripts, entry) {
    const names = new Set();
    const nodeFiles = new Set();
    const seen = new Set();
    const queue = [entry];

    while (queue.length > 0) {
        const name = queue.shift();
        if (!name || seen.has(name)) continue;
        seen.add(name);
        if (!Object.prototype.hasOwnProperty.call(scripts, name)) continue;
        names.add(name);

        const body = String(scripts[name] || '');
        for (const match of body.matchAll(/\bnpm run ([A-Za-z0-9:_-]+)/g)) {
            queue.push(match[1]);
        }
        for (const match of body.matchAll(/\bnode\s+(?:\.\/)?(scripts\/[A-Za-z0-9_./-]+\.(?:cjs|mjs|js|ts))/g)) {
            nodeFiles.add(normalize(match[1]));
        }
    }

    const hasTsc = [...names].some((name) =>
        /typescript[\\/]bin[\\/]tsc/.test(String(scripts[name] || '')));
    return { names, nodeFiles, hasTsc };
}

function classifyCommand(command, scripts, reach) {
    if (command.kind === 'npm') {
        const exists = Object.prototype.hasOwnProperty.call(scripts, command.value);
        if (!exists) return { status: 'MISSING', detail: 'alias npm inexistente' };
        if (reach.names.has(command.value)) return { status: 'WIRED', detail: 'ejecutado por gate:prepush' };
        if (MANUAL_GATES.has(command.value)) return { status: 'MANUAL', detail: MANUAL_GATES.get(command.value) };
        return { status: 'ORPHAN', detail: 'existe pero gate:prepush no lo invoca' };
    }

    if (command.kind === 'file') {
        const absolute = path.join(ROOT, command.value.split('/').join(path.sep));
        if (!fs.existsSync(absolute)) {
            return { status: 'MISSING', detail: 'el fichero citado no está en disco' };
        }
        if (reach.nodeFiles.has(command.value)) {
            return { status: 'WIRED', detail: 'ejecutado por gate:prepush' };
        }
        if (MANUAL_GATES.has(command.value)) {
            return { status: 'MANUAL', detail: MANUAL_GATES.get(command.value) };
        }
        return { status: 'ORPHAN', detail: 'el fichero existe pero ninguna puerta lo ejecuta' };
    }

    if (command.kind === 'tsc') {
        return reach.hasTsc
            ? { status: 'WIRED', detail: '`tsc --noEmit` presente en gate:prepush' }
            : { status: 'ORPHAN', detail: 'gate:prepush no ejecuta tsc' };
    }

    return { status: 'SIN_COMANDO', detail: 'comando no reconocido' };
}

function aggregate(statuses) {
    if (statuses.length === 0) return 'SIN_COMANDO';
    return statuses.reduce((worst, current) =>
        (SEVERITY[current] > SEVERITY[worst] ? current : worst), 'WIRED');
}

function printTable(results) {
    const header = ['INV', 'ESTADO', 'COMANDOS', 'DIAGNÓSTICO'];
    const rows = results.map((row) => [
        row.id,
        row.status,
        row.commands.length > 0 ? row.commands.map((command) => command.label).join(' + ') : '—',
        row.detail,
    ]);

    const widths = header.map((title, index) =>
        Math.max(title.length, ...rows.map((cells) => String(cells[index]).length)));
    const line = (cells) => cells
        .map((cell, index) => String(cell).padEnd(widths[index]))
        .join('  ');

    console.log(line(header));
    console.log(widths.map((width) => '-'.repeat(width)).join('  '));
    for (const cells of rows) console.log(line(cells));
}

function main() {
    let rulesText;
    let scripts;
    try {
        rulesText = readUtf8(RULES_PATH);
        scripts = loadScripts();
    } catch (error) {
        console.error(`FATAL: ${error instanceof Error ? error.message : String(error)}`);
        process.exit(2);
    }

    if (!Object.prototype.hasOwnProperty.call(scripts, 'gate:prepush')) {
        console.error('FATAL: package.json no declara `gate:prepush` (G-3).');
        process.exit(2);
    }

    const invariants = parseInvariants(rulesText);
    if (invariants.length === 0) {
        console.error('FATAL: `.clinerules` no contiene filas `| INV-n |` parseables.');
        process.exit(2);
    }

    const reach = expandReachable(scripts, 'gate:prepush');
    const results = [];

    for (const invariant of invariants) {
        const commands = extractCommands(invariant.verification).map((command) => ({
            ...command,
            label: command.kind === 'npm' ? `npm run ${command.value}` : command.value,
            ...classifyCommand(command, scripts, reach),
        }));

        const status = aggregate(commands.map((command) => command.status));
        const failures = commands
            .filter((command) => command.status !== 'WIRED')
            .map((command) => `${command.label} → ${command.detail}`);

        const detail = commands.length === 0
            ? `sin comando automatizable: «${invariant.verification}»`
            : failures.length > 0
                ? failures.join(' | ')
                : 'todas las pruebas se ejecutan en gate:prepush';

        results.push({
            id: invariant.id,
            invariant: invariant.invariant.replace(/\*\*/g, ''),
            status,
            commands,
            detail,
        });
    }

    const summary = results.reduce((acc, row) => {
        acc[row.status] = (acc[row.status] || 0) + 1;
        return acc;
    }, {});

    if (JSON_OUT) {
        console.log(JSON.stringify({
            probed: true,
            source: 'live',
            mode: 'REAL',
            checkedAt: new Date().toISOString(),
            entry: 'gate:prepush',
            reachableAliases: reach.names.size,
            reachableFiles: [...reach.nodeFiles],
            summary,
            invariants: results,
        }, null, 2));
    } else {
        console.log('── COBERTURA DE PUERTAS · .clinerules ↔ gate:prepush ──────────────');
        console.log(`alias npm alcanzables desde gate:prepush : ${reach.names.size}`);
        console.log(`ficheros node ejecutados por la cadena     : ${reach.nodeFiles.size}`);
        console.log('');
        printTable(results);
        console.log('');
        console.log(`resumen: ${results.length} invariantes · ` +
            `WIRED=${summary.WIRED || 0} · MANUAL=${summary.MANUAL || 0} · ` +
            `ORPHAN=${summary.ORPHAN || 0} · MISSING=${summary.MISSING || 0} · ` +
            `SIN_COMANDO=${summary.SIN_COMANDO || 0}`);
    }

    const blocking = results.filter((row) =>
        row.status === 'ORPHAN' ||
        row.status === 'MISSING' ||
        (STRICT && row.status === 'SIN_COMANDO'));

    if (blocking.length > 0) {
        if (!JSON_OUT) {
            console.error('');
            console.error(`FAIL: ${blocking.length} invariante(s) sin puerta real → ` +
                blocking.map((row) => row.id).join(', '));
            console.error('Un invariante que no se ejecuta en gate:prepush es una fachada de papel (§15).');
        }
        process.exit(1);
    }

    if (!JSON_OUT) {
        console.log('');
        console.log('PASS: todo invariante con comando se ejecuta en la cadena de puertas.');
    }
    process.exit(0);
}

main();




