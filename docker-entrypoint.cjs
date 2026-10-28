/**
 * ════════════════════════════════════════════════════════════════════════════
 * Ω ENTRYPOINT DE PRODUCCIÓN — MIGRACIONES IDEMPOTENTES ANTES DE SERVIR
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrina: `/api/outreach/intake` responde 503 si la tabla no existe. El
 * runner standalone de Next NO trae el CLI de Prisma ni `prisma/migrations`,
 * así que sin este paso NINGÚN deploy aplicaría `_add_outreach_models` y el
 * puente Harvey → EAR OS quedaría muerto incluso con `CRON_SECRET` puesto.
 *
 * Se implementa en Node (no en sh) por tres motivos medibles:
 *   1. `node --check` lo valida en local y en CI; un `sh` con CRLF de Windows
 *      muere al arrancar y tumbaría producción entera.
 *   2. `spawnSync` con `timeout` garantiza que una DB lenta no cuelgue el
 *      arranque del contenedor.
 *   3. La propagación de señales al `server.js` hijo es explícita, así que
 *      Coolify puede parar el contenedor sin dejar zombies.
 *
 * Fail-open deliberado en el ARRANQUE (si la DB no responde, la web debe
 * servir igual; el 503 honesto lo da la API), fail-closed en la RUTA (sin
 * secreto o sin tabla, no se escribe ni un byte).
 * ════════════════════════════════════════════════════════════════════════════
 */

const { spawn, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const PRISMA_CLI = path.join('node_modules', 'prisma', 'build', 'index.js');
const MIGRATIONS_DIR = path.join('prisma', 'migrations');
const MIGRATE_TIMEOUT_MS = 180_000;

function log(message) {
    process.stdout.write(`[entrypoint] ${message}\n`);
}

function applyMigrations() {
    if (!fs.existsSync(PRISMA_CLI)) {
        log(`AVISO: CLI de Prisma ausente (${PRISMA_CLI}). Migración omitida.`);
        return;
    }
    if (!fs.existsSync(MIGRATIONS_DIR)) {
        log(`AVISO: directorio ${MIGRATIONS_DIR} ausente. Migración omitida.`);
        return;
    }

    log('Aplicando migraciones Prisma (idempotente)...');

    const result = spawnSync(
        process.execPath,
        [PRISMA_CLI, 'migrate', 'deploy'],
        { stdio: 'inherit', timeout: MIGRATE_TIMEOUT_MS },
    );

    if (result.error) {
        log(`AVISO: no se pudo lanzar 'migrate deploy' (${result.error.message}).`);
        log('AVISO: /api/outreach/intake seguirá en 503 hasta migrar la DB.');
        return;
    }
    if (result.signal) {
        log(`AVISO: 'migrate deploy' abortado por señal ${result.signal}.`);
        log('AVISO: /api/outreach/intake seguirá en 503 hasta migrar la DB.');
        return;
    }
    if (result.status !== 0) {
        log(`AVISO: 'migrate deploy' devolvió exit ${result.status}.`);
        log('AVISO: /api/outreach/intake seguirá en 503 hasta migrar la DB.');
        return;
    }

    log('Migraciones OK.');
}

function main() {
    applyMigrations();

    log('Arrancando servidor Next.js...');
    const server = spawn(process.execPath, ['server.js'], { stdio: 'inherit' });

    for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP']) {
        process.on(signal, () => {
            log(`Señal ${signal} recibida; deteniendo servidor.`);
            server.kill(signal);
        });
    }

    server.on('error', (error) => {
        process.stderr.write(`[entrypoint] ERROR al arrancar server.js: ${error.message}\n`);
        process.exit(1);
    });

    server.on('exit', (code, signal) => {
        if (signal) {
            log(`server.js terminó por señal ${signal}.`);
            process.exit(1);
        }
        log(`server.js terminó con exit ${code}.`);
        process.exit(code === null ? 1 : code);
    });
}

main();
