/**
 * EAR OS · PostgreSQL EFÍMERO para arneses de verificación (F-6)
 * ---------------------------------------------------------------------------
 * Problema que resuelve: la estación local no tiene PostgreSQL en :5432, así
 * que el arnés firmaba SIN_EVIDENCIA (Exit 2) sin probar la persistencia.
 *
 * Alternativa DESCARTADA: SQLite en memoria. Habría dado Exit 0 sin probar el
 * motor de producción (`prisma/schema.prisma:6` declara PostgreSQL). Cambiar de
 * motor no certifica el sistema: es el falso verde que prohíbe AF-5.
 *
 * Estrategia:
 *   1. Reutiliza un PostgreSQL alcanzable (`EAR_VERIFY_DATABASE_URL`, luego
 *      `POSTGRES_PRISMA_URL` / `DATABASE_URL`) si responde en < 3 s.
 *   2. Si no hay, arranca PostgreSQL EFÍMERO bajo `node_modules/.cache` con el
 *      paquete `embedded-postgres` (binario portable, sin servicios del SO).
 *   3. Crea la base de trabajo y aplica el DDL de la migración 20261109190000.
 *   4. `stop()` apaga el servidor (el clúster queda cacheado y se reutiliza).
 *
 * El ciclo de vida del servidor vive en un proceso hijo (`ephemeral-pg-server.cjs`)
 * porque `embedded-postgres` engancha `process.on('exit')` y no permite un
 * apagado limpio dentro del mismo proceso que ya usa Prisma.
 *
 * Regla de honestidad: sin binario se devuelve `null` (SIN_EVIDENCIA).
 */
const { spawn } = require('node:child_process');
const net = require('node:net');
const path = require('node:path');

const { ROOT, EPHEMERAL_PORT, EPHEMERAL_URL, VERIFY_DB } = require('./ephemeral-postgres-core.cjs');

const SERVER_SCRIPT = path.join(__dirname, 'ephemeral-pg-server.cjs');
const RETENCION_MS = 4000;

function log(line) {
  process.stdout.write(`${line}\n`);
}

/** Conexión directa por red (sin Prisma: el motor puede no estar todavía). */
function probeTcp(port = EPHEMERAL_PORT, timeoutMs = 700) {
  return new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port });
    const done = (ok) => {
      socket.destroy();
      resolve(ok);
    };
    socket.setTimeout(timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('timeout', () => done(false));
    socket.once('error', () => done(false));
  });
}

/** ¿Responde la base de datos de `url`? (SELECT 1 por TCP, sin Prisma). */
function probeUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return Promise.resolve(false);
  }
  return probeTcp(Number(parsed.port || 5432));
}

/**
 * Ciclo de vida del PostgreSQL efímero en un proceso hijo.
 * Devuelve `{ url, stop, detail }` o `null` si no se pudo levantar.
 */
function startServerProcess() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SERVER_SCRIPT], {
      cwd: ROOT,
      env: { ...process.env, EAR_EPHEMERAL_PG_PORT: String(EPHEMERAL_PORT) },
      stdio: ['pipe', 'pipe', 'inherit'],
    });

    let buffer = '';
    let settled = false;
    let ready = false;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    const timer = setTimeout(() => {
      if (!ready) {
        try {
          child.kill();
        } catch {
          // best-effort
        }
        log('SIN_EVIDENCIA: el PostgreSQL efímero no respondió en 120 s.');
        finish(null);
      }
    }, 120_000);

    child.stdout.setEncoding('utf8');
    child.stdout.on('data', (chunk) => {
      buffer += chunk;
      let index = buffer.indexOf('\n');
      while (index >= 0) {
        const line = buffer.slice(0, index).trim();
        buffer = buffer.slice(index + 1);
        if (line === 'READY') {
          ready = true;
          clearTimeout(timer);
          let stopped = false;
          finish({
            url: EPHEMERAL_URL,
            detail: `PostgreSQL efímero en ${EPHEMERAL_URL.replace(/:[^:@/]+@/, ':***@')} · DDL 20261109190000 aplicado`,
            stop: async () => {
              if (stopped) return;
              stopped = true;
              try {
                child.stdin.write('STOP\n');
              } catch {
                // El hijo puede haber terminado ya.
              }
              await new Promise((done) => {
                setTimeout(done, RETENCION_MS);
              });
              try {
                child.kill();
              } catch {
                // Ya terminó.
              }
            },
          });
        } else if (line.startsWith('FAILED')) {
          clearTimeout(timer);
          finish(null);
        }
        index = buffer.indexOf('\n');
      }
    });

    child.once('exit', () => {
      if (!ready) {
        clearTimeout(timer);
        finish(null);
      }
    });
  });
}

/** URL de PostgreSQL para un arnés (declarada o efímera). */
async function resolveVerificationDatabase() {
  const declared =
    process.env.EAR_VERIFY_DATABASE_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    '';

  if (declared && (await probeUrl(declared))) {
    return {
      url: declared,
      stop: async () => undefined,
      detail: 'PostgreSQL declarado, alcanzable por TCP',
      ephemeral: false,
    };
  }

  if (declared) {
    const masked = declared.replace(/\/\/[^@]*@/, '//***@');
    log(`AVISO: la URL declarada no responde (${masked.slice(0, 100)}). Se levanta PostgreSQL efímero.`);
  }

  const started = await startServerProcess();
  return started === null ? null : { ...started, ephemeral: true };
}

module.exports = {
  ROOT,
  EPHEMERAL_URL,
  VERIFY_DB,
  probeTcp,
  probeUrl,
  resolveVerificationDatabase,
};
