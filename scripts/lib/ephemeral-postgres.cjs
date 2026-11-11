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
 * Socket (Socket.v0): hay oyentes que sobreviven a `taskkill`/`Get-Process` (procesos
 * que ya no están en la lista del SO pero conservan el socket abierto). Por eso el
 * oráculo de disponibilidad consulta SQL y, si el puerto efímero está envenenado,
 * el arnés levanta el clúster en `EAR_EPHEMERAL_PG_FALLBACK_PORT` (55433) en lugar
 * de firmar SOSPECHOSO por un zombie del entorno.
 *
 * Regla de honestidad: sin binario se devuelve `null` (SIN_EVIDENCIA).
 */
const { spawn } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');

const {
  ROOT,
  EPHEMERAL_PORT,
  EPHEMERAL_URL,
  VERIFY_DB,
  DDL_FILE,
  DDL_TABLE,
} = require('./ephemeral-postgres-core.cjs');


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

/** DDL de la migración 20261109190000 (idempotente), compartido con el servidor hijo. */
function ddlStatements() {
  return fs
    .readFileSync(DDL_FILE, 'utf8')
    .replace(/CREATE UNIQUE INDEX (?!IF NOT EXISTS)/g, 'CREATE UNIQUE INDEX IF NOT EXISTS')
    .replace(/CREATE INDEX (?!IF NOT EXISTS)/g, 'CREATE INDEX IF NOT EXISTS')
    .split(';')
    .map((chunk) => chunk.trim())
    .filter((chunk) => chunk.length > 0);
}

/**
 * DDL aplicable SIN ventana de indisponibilidad: el servidor vivo puede estar
 * atendiendo otros arneses, así que un `CREATE INDEX` sin `CONCURRENTLY` puede
 * quedar en espera de un lock hasta que venza el TCP del padre y el oráculo
 * (que sólo mira el socket) declare «alcanzable» un clúster que no responde SQL.
 */
function ddlStatementsConcurrent() {
  return ddlStatements()
    .map((statement) =>
      statement.replace(/^CREATE UNIQUE INDEX IF NOT EXISTS/i, 'CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS')
    )
    .map((statement) =>
      statement.replace(/^CREATE INDEX IF NOT EXISTS(?! CONCURRENTLY)/i, 'CREATE INDEX CONCURRENTLY IF NOT EXISTS')
    );
}

/** Aplica el DDL sin Prisma, con timeout por sentencia. Devuelve true si responde. */
async function applyDdl(url, { concurrent = false } = {}) {
  let Client;
  try {
    ({ Client } = await import('pg'));
  } catch {
    return false;
  }
  const client = new Client({ connectionString: url, connectionTimeoutMillis: 3000, query_timeout: 15000 });
  try {
    await client.connect();
    for (const statement of concurrent ? ddlStatementsConcurrent() : ddlStatements()) {
      await client.query(statement);
    }
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => undefined);
  }
}

/**
 * ¿La base NO declarada de `url` admite conexión SQL y tiene la tabla F-6?
 * El TCP abierto no basta: un postmaster muerto o un `CREATE INDEX` bloqueado
 * deja el socket escuchando mientras niega el handshake de PostgreSQL.
 */
async function probeSql(url) {
  let Client;
  try {
    ({ Client } = await import('pg'));
  } catch {
    return false;
  }
  const client = new Client({
    connectionString: url,
    connectionTimeoutMillis: 3000,
    statement_timeout: 5000,
    query_timeout: 5000,
  });
  try {
    await client.connect();
    const exists = await client.query({ text: 'SELECT to_regclass($1) AS reg', values: [`public.${DDL_TABLE}`] });
    if (exists.rows?.[0]?.reg) return true;
    return await applyDdl(url, { concurrent: true });
  } catch {
    return false;
  } finally {
    await client.end().catch(() => undefined);
  }
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
  const port = EPHEMERAL_PORT;
  const url = EPHEMERAL_URL;
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [SERVER_SCRIPT], {
      cwd: ROOT,
      env: { ...process.env, EAR_EPHEMERAL_PG_PORT: String(port), EAR_EPHEMERAL_PG_URL: url },
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
            url,
            detail: `PostgreSQL efímero en ${url.replace(/:[^:@/]+@/, ':***@')} · DDL 20261109190000 aplicado`,
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
    const sqlReady = await probeSql(declared);
    if (sqlReady) {
      return {
        url: declared,
        stop: async () => undefined,
        detail: 'PostgreSQL declarado, alcanzable por TCP y SQL (tabla F-6 presente)',
        sqlReady: true,
        ephemeral: false,
      };
    }
    // Un socket abierto no es una base utilizable (postmaster zombie, lock o
    // credenciales): se degrada al efímero en vez de firmar un FAIL del producto.
    const masked = declared.replace(/\/\/[^@]*@/, '//***@');
    log(`AVISO: la URL declarada acepta TCP pero no responde SQL (${masked.slice(0, 100)}). Se levanta PostgreSQL efímero.`);
  }

  if (declared) {
    const masked = declared.replace(/\/\/[^@]*@/, '//***@');
    log(`AVISO: la URL declarada no responde (${masked.slice(0, 100)}). Se levanta PostgreSQL efímero.`);
  }

  const started = await startServerProcess();
  if (started !== null) return { ...started, ephemeral: true, sqlReady: true };

  // Puerto principal envenenado por un oyente que no muere (Socket.v0): se
  // reintenta en el puerto alternativo antes de declarar SIN_EVIDENCIA.
  const fallbackPort = Number(process.env.EAR_EPHEMERAL_PG_FALLBACK_PORT ?? EPHEMERAL_PORT + 1);
  if (fallbackPort !== EPHEMERAL_PORT) {
    log(`AVISO: puerto ${EPHEMERAL_PORT} no utilizable; reintentando el efímero en ${fallbackPort}.`);
    const previous = process.env.EAR_EPHEMERAL_PG_PORT;
    process.env.EAR_EPHEMERAL_PG_PORT = String(fallbackPort);
    try {
      const retry = await startServerProcess();
      if (retry !== null) return { ...retry, ephemeral: true, sqlReady: true };
    } finally {
      if (previous === undefined) delete process.env.EAR_EPHEMERAL_PG_PORT;
      else process.env.EAR_EPHEMERAL_PG_PORT = previous;
    }
  }
  return null;
}

module.exports = {
  ROOT,
  EPHEMERAL_URL,
  VERIFY_DB,
  probeTcp,
  probeUrl,
  resolveVerificationDatabase,
};
