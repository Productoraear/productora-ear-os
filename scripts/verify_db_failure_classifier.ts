/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN DEL CLASIFICADOR DE FALLOS DE POSTGRESQL (AF-1 / INV-16)
 * ════════════════════════════════════════════════════════════════════════════
 * Objetivo: que un fallo de DB NUNCA vuelva a reportarse como `code=UNKNOWN`
 * cuando la causa es identificable, y que jamás se filtre la cadena de conexión.
 *
 * Aserciones (todas obligatorias):
 *  1. `P1001` (Prisma known error) → DB_UNREACHABLE.
 *  2. `PrismaClientInitializationError` real del repo (`errorCode: undefined`)
 *     con el mensaje del motor → DB_UNREACHABLE, no UNKNOWN.
 *  3. Variable de entorno ausente → DB_URL_MISSING.
 *  4. SQLSTATE `28P01` → DB_AUTH_FAILED · `3D000` → DB_NOT_FOUND.
 *  5. `P2021` (tabla ausente) → DB_SCHEMA_MISSING · `P2024` → DB_POOL_TIMEOUT.
 *  6. Un `code` que sea una URL de conexión NO se devuelve: sale `UNKNOWN`.
 *  7. Fuga cero: ningún campo del informe contiene `://`, `password` ni `@`.
 *  8. Entradas hostiles (`null`, `undefined`, string, número) no lanzan.
 *
 * Ejecución: npm run verify:db-failure
 * Exit 0 = VERIFICADO · Exit 1 = al menos una aserción falla.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { classifyDbFailure } from '../src/lib/db/dbFailureClassifier';

interface Case {
  name: string;
  err: unknown;
  kind: string;
  code: string;
}

const PRISMA_REAL_INIT_ERROR = {
  name: 'PrismaClientInitializationError',
  clientVersion: '6.12.0',
  errorCode: undefined,
  message:
    "\nInvalid `prisma.smartLock.findMany()` invocation\n\nCan't reach database server at `localhost:5432`\n\nPlease make sure your database server is running at `localhost:5432`.",
};

const CASES: Case[] = [
  {
    name: 'P1001 Prisma known error',
    err: Object.assign(new Error('socket hang up'), { code: 'P1001' }),
    kind: 'DB_UNREACHABLE',
    code: 'P1001',
  },
  {
    name: 'PrismaClientInitializationError real (errorCode undefined)',
    err: PRISMA_REAL_INIT_ERROR,
    kind: 'DB_UNREACHABLE',
    code: 'UNKNOWN',
  },
  {
    name: 'Variable de entorno ausente',
    err: {
      name: 'PrismaClientInitializationError',
      message: 'error: Environment variable not found: POSTGRES_PRISMA_URL.',
    },
    kind: 'DB_URL_MISSING',
    code: 'UNKNOWN',
  },
  {
    name: 'SQLSTATE 28P01 password authentication failed',
    err: { code: '28P01', message: 'password authentication failed for user "postgres"' },
    kind: 'DB_AUTH_FAILED',
    code: '28P01',
  },
  {
    name: 'SQLSTATE 3D000 base de datos inexistente',
    err: { code: '3D000', message: 'database "ear_os" does not exist' },
    kind: 'DB_NOT_FOUND',
    code: '3D000',
  },
  {
    name: 'P2021 tabla ausente (falta prisma db push)',
    err: { code: 'P2021', message: 'The table `public.SmartLock` does not exist in the current database.' },
    kind: 'DB_SCHEMA_MISSING',
    code: 'P2021',
  },
  {
    name: 'P2024 pool agotado',
    err: { code: 'P2024', message: 'Timed out fetching a new connection from the pool.' },
    kind: 'DB_POOL_TIMEOUT',
    code: 'P2024',
  },
  {
    name: 'Anti-fuga: code = URL de conexión',
    err: { code: 'postgresql://postgres:secret@localhost:5432/ear_os' },
    kind: 'DB_UNKNOWN',
    code: 'UNKNOWN',
  },
  { name: 'Error genérico de red', err: new Error('ECONNREFUSED 127.0.0.1:5432'), kind: 'DB_UNREACHABLE', code: 'UNKNOWN' },
  { name: 'null', err: null, kind: 'DB_UNKNOWN', code: 'UNKNOWN' },
  { name: 'undefined', err: undefined, kind: 'DB_UNKNOWN', code: 'UNKNOWN' },
  { name: 'string suelto', err: 'boom', kind: 'DB_UNKNOWN', code: 'UNKNOWN' },
  { name: 'número suelto', err: 42, kind: 'DB_UNKNOWN', code: 'UNKNOWN' },
];

const FORBIDDEN = ['://', 'password', '@', 'secret'];
const failures: string[] = [];
const rows: Array<{ case: string; kind: string; code: string; ok: boolean }> = [];

for (const testCase of CASES) {
  let report: { kind: string; code: string; action: string };
  try {
    report = classifyDbFailure(testCase.err);
  } catch (thrown) {
    failures.push(`${testCase.name}: LANZÓ una excepción (${String(thrown)})`);
    rows.push({ case: testCase.name, kind: '<THROW>', code: '<THROW>', ok: false });
    continue;
  }

  const kindOk = report.kind === testCase.kind;
  const codeOk = report.code === testCase.code;
  const actionOk = typeof report.action === 'string' && report.action.length >= 20;
  const leak = FORBIDDEN.filter((token) =>
    `${report.kind}|${report.code}|${report.action}`.toLowerCase().includes(token),
  );
  const ok = kindOk && codeOk && actionOk && leak.length === 0;

  if (!kindOk) failures.push(`${testCase.name}: kind=${report.kind} (esperado ${testCase.kind})`);
  if (!codeOk) failures.push(`${testCase.name}: code=${report.code} (esperado ${testCase.code})`);
  if (!actionOk) failures.push(`${testCase.name}: action vacía o demasiado corta`);
  if (leak.length > 0) failures.push(`${testCase.name}: FUGA de datos en el informe (${leak.join(',')})`);

  rows.push({ case: testCase.name, kind: report.kind, code: report.code, ok });
}

const summary = {
  verdict: failures.length === 0 ? 'VERIFICADO' : 'FALLIDO',
  cases: CASES.length,
  passed: rows.filter((row) => row.ok).length,
  failed: failures.length,
  rows,
  failures,
};

console.log(JSON.stringify(summary, null, 2));

if (failures.length > 0) {
  console.error(`[verify:db-failure] ${failures.length} aserción(es) fallida(s).`);
  process.exitCode = 1;
} else {
  console.log(`[verify:db-failure] VERIFICADO · ${CASES.length}/${CASES.length} casos. Exit 0.`);
}
