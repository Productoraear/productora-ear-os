#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * TEST DEL ENTRYPOINT DE PRODUCCIÓN (docker-entrypoint.cjs)
 * ════════════════════════════════════════════════════════════════════════════
 * Motivo: el entrypoint es lo PRIMERO que se ejecuta en el contenedor. Si tiene
 * un fallo, producción no arranca. Y como no hay Docker en esta máquina, el
 * único modo honesto de firmarlo es reproducir sus tres caminos en un sandbox
 * con un `server.js` y un CLI de Prisma falsos.
 *
 * Escenarios cubiertos:
 *   A) CLI de Prisma presente + `migrate deploy` exit 0 → migra y arranca.
 *   B) CLI de Prisma ausente → avisa y arranca igual (fail-open).
 *   C) `migrate deploy` exit 1 → avisa y arranca igual (fail-open).
 *
 * Criterio de éxito: en LOS TRES casos el servidor llega a arrancar (la web no
 * se cae por un problema de base de datos) y los casos B y C dejan constancia
 * explícita del 503 que sufrirá /api/outreach/intake.
 *
 * Uso: node scripts/test_docker_entrypoint.cjs
 * Exit: 0 si los 3 escenarios pasan, 1 si alguno falla.
 * ════════════════════════════════════════════════════════════════════════════
 */

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const ENTRYPOINT_SRC = path.join(ROOT, 'docker-entrypoint.cjs');

const FAKE_PRISMA_CLI = [
    "process.stdout.write('[fake-prisma] migrate deploy ejecutado\\n');",
    'process.exit(Number(process.env.FAKE_PRISMA_EXIT || 0));',
    '',
].join('\n');

const FAKE_SERVER = [
    "process.stdout.write('FAKE_SERVER_UP\\n');",
    'process.exit(0);',
    '',
].join('\n');

function buildSandbox({ withPrismaCli, prismaExit }) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ear-entrypoint-'));

    fs.copyFileSync(ENTRYPOINT_SRC, path.join(dir, 'docker-entrypoint.cjs'));
    fs.writeFileSync(path.join(dir, 'server.js'), FAKE_SERVER, 'utf8');
    fs.mkdirSync(path.join(dir, 'prisma', 'migrations'), { recursive: true });

    if (withPrismaCli) {
        const cliDir = path.join(dir, 'node_modules', 'prisma', 'build');
        fs.mkdirSync(cliDir, { recursive: true });
        fs.writeFileSync(path.join(cliDir, 'index.js'), FAKE_PRISMA_CLI, 'utf8');
    }

    return { dir, prismaExit };
}

function runCase(name, options, expectations) {
    const { dir, prismaExit } = buildSandbox(options);

    const result = spawnSync(process.execPath, ['docker-entrypoint.cjs'], {
        cwd: dir,
        encoding: 'utf8',
        timeout: 60_000,
        env: { ...process.env, FAKE_PRISMA_EXIT: String(prismaExit ?? 0) },
    });

    const stdout = result.stdout ?? '';
    const failures = [];

    if (result.status !== 0) {
        failures.push(`exit distinto de 0 (fue ${result.status})`);
    }
    if (!stdout.includes('Arrancando servidor Next.js...')) {
        failures.push('no se intentó arrancar server.js');
    }
    if (!stdout.includes('FAKE_SERVER_UP')) {
        failures.push('server.js nunca se ejecutó');
    }
    for (const needle of expectations) {
        if (!stdout.includes(needle)) {
            failures.push(`falta en la salida: "${needle}"`);
        }
    }

    fs.rmSync(dir, { recursive: true, force: true });

    if (failures.length === 0) {
        console.log(`  [PASS] ${name}`);
        return true;
    }
    console.log(`  [FAIL] ${name}`);
    for (const failure of failures) {
        console.log(`         -> ${failure}`);
    }
    console.log('         salida bruta:');
    for (const line of stdout.split('\n')) {
        if (line.trim() !== '') console.log(`           ${line}`);
    }
    return false;
}

console.log('--- TEST DEL ENTRYPOINT (3 escenarios) ---');

const results = [
    runCase(
        'A) migracion OK -> migra y arranca',
        { withPrismaCli: true, prismaExit: 0 },
        ['Aplicando migraciones Prisma', '[fake-prisma] migrate deploy ejecutado', 'Migraciones OK.'],
    ),
    runCase(
        'B) CLI de Prisma ausente -> avisa y arranca',
        { withPrismaCli: false, prismaExit: 0 },
        ['CLI de Prisma ausente', 'Migración omitida'],
    ),
    runCase(
        'C) migrate deploy falla (exit 1) -> avisa y arranca',
        { withPrismaCli: true, prismaExit: 1 },
        ['devolvió exit 1', '/api/outreach/intake seguirá en 503'],
    ),
];

const passed = results.filter(Boolean).length;
console.log(`ENTRYPOINT_TEST=${passed === results.length ? 'PASS' : 'FAIL'} (${passed}/${results.length})`);

process.exit(passed === results.length ? 0 : 1);
