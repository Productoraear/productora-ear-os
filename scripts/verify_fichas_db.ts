/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🧪 VERIFICACIÓN FORENSE — PERSISTENCIA ACID DE FICHAS (W44)
 * ════════════════════════════════════════════════════════════════════════════
 * Las 2.150 fichas de W43 viven en JSON. Esta prueba exige que su escritura en
 * PostgreSQL 16 sea REAL, IDEMPOTENTE y AUDITABLE — y se niega a fingirlo:
 *
 *   A. CONTRATO (ejecutable siempre, coste $0,00)
 *      Plan construido desde las fuentes selladas, doctrina de datos intacta
 *      (cero `verified:true` sin teléfono real, cero centralita, cero hash
 *      inventado), claves únicas y huella SHA-256 determinista y sensible.
 *
 *   B. ARNÉS RELACIONAL (`node:sqlite`, motor SQL real embebido)
 *      Ejecuta el MISMO upsert por clave natural: N pasadas => N filas,
 *      misma huella, cero duplicados, y ROLLBACK deja 0 filas (atomicidad).
 *      ⚠️ NO es PostgreSQL 16: prueba el plan de escritura, no el motor remoto.
 *
 *   C. POSTGRESQL 16 REAL (sólo si hay base viva configurada)
 *      Conexión, N upserts x2 y relectura: la huella persistida debe ser
 *      idéntica a la del plan. Si la base no responde se declara
 *      `SKIPPED + SIN_EVIDENCIA_MÁQUINA` (nunca "verificado").
 *
 * Uso:
 *   npm run verify:fichas:db                    # A + B (C se omite si no hay DB)
 *   npm run verify:fichas:db -- --require-db    # exige C: Exit 2 sin base viva
 *   npm run verify:fichas:db -- --limit=50      # humo sobre 50 fichas
 *
 * Exit: 0 = tiers obligatorios OK · 1 = aserción rota · 2 = falta la base exigida.
 * ════════════════════════════════════════════════════════════════════════════
 */

import {
  assertRowDoctrine,
  buildRows,
  describeDbTarget,
  fingerprintRows,
  type DbTarget,
  type FichaDbRow,
  type FichaDbStats,
} from './fichas_db_rows.cjs';
import { runRelationalHarness, type HarnessResult } from './fichas_db_sqlite_harness.cjs';
import {
  createPrismaClient,
  isUnavailableError,
  loadEnvironment,
  pingDatabase,
  readBackRows,
  resolveDatabaseUrl,
  upsertBatches,
  type PrismaLike,
} from './sync_fichas_to_db.cjs';

type Severity = 'required' | 'advisory';

interface CaseResult {
  readonly section: string;
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
  readonly severity: Severity;
}

const CASES: CaseResult[] = [];
const CENTRALITA = '693693048';
const HEX64 = /^[0-9a-f]{64}$/;
const CHUNK = 100;
const PING_TIMEOUT_MS = 8000;

function check(section: string, name: string, ok: boolean, detail: string, severity: Severity = 'required'): void {
  CASES.push({ section, name, ok, detail, severity });
}

function messageOf(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

const ARGV: readonly string[] = process.argv.slice(2);
const REQUIRE_DB: boolean = ARGV.includes('--require-db');
const LIMIT_ARG: string | undefined = ARGV.find((token: string) => token.startsWith('--limit='));
const LIMIT: number = LIMIT_ARG === undefined ? 0 : Number(LIMIT_ARG.slice('--limit='.length));

/* ── Plan de escritura (fuentes selladas de W43 + HTML fuente) ────────────── */
const plan = buildRows(LIMIT > 0 && Number.isInteger(LIMIT) ? { limit: LIMIT } : {});
const rows: readonly FichaDbRow[] = plan.rows;
const stats: FichaDbStats = plan.stats;
const planSha256: string = fingerprintRows(rows);
const FLOOR: number = LIMIT > 0 ? LIMIT : 2000;

/* ── A. CONTRATO DE DATOS ─────────────────────────────────────────────────── */
check(
  'A. Contrato',
  'El plan se construye desde las fuentes selladas sin pérdida de fichas',
  rows.length >= Math.min(FLOOR, stats.planFichas) && rows.length === stats.fichas && stats.planFichas >= rows.length,
  `fichas=${String(rows.length)} · universo=${String(stats.planFichas)} · media completitud=${String(stats.completenessMedia)}`,
);

check(
  'A. Contrato',
  'Procedencia HTML real: cada ficha sellada apunta a un HTML distinto del corpus',
  stats.htmlSelladas + stats.htmlAusentes === stats.fichas && stats.htmlDigestsUnicos === stats.htmlSelladas,
  `selladas=${String(stats.htmlSelladas)} · ausentes=${String(stats.htmlAusentes)} · digests únicos=${String(stats.htmlDigestsUnicos)}`,
);

const verifiedWithoutPhone: readonly FichaDbRow[] = rows.filter((row: FichaDbRow) => row.verified && row.phone === null);
check(
  'A. Contrato',
  'Cero `verified:true` sin teléfono real publicable (§4bis)',
  verifiedWithoutPhone.length === 0,
  `verificadas=${String(stats.verificadas)} · infractoras=${String(verifiedWithoutPhone.length)} · muestra=${
    verifiedWithoutPhone
      .slice(0, 3)
      .map((row: FichaDbRow) => row.key)
      .join(',') || '∅'
  }`,
);

const centralitaLeaks: readonly FichaDbRow[] = rows.filter(
  (row: FichaDbRow) => row.phone !== null && row.phone.replace(/\D/g, '').includes(CENTRALITA),
);
check(
  'A. Contrato',
  'La centralita soberana no se persiste como teléfono de proveedor',
  centralitaLeaks.length === 0,
  `fugas=${String(centralitaLeaks.length)} · muestra=${
    centralitaLeaks
      .slice(0, 3)
      .map((row: FichaDbRow) => row.key)
      .join(',') || '∅'
  }`,
);

const badHashes: readonly FichaDbRow[] = rows.filter(
  (row: FichaDbRow) =>
    !HEX64.test(row.provenanceHash) ||
    (row.htmlSha256 !== null && !HEX64.test(row.htmlSha256)) ||
    !Number.isInteger(row.completeness) ||
    row.completeness < 0 ||
    row.completeness > 100 ||
    row.sources.length === 0,
);
check(
  'A. Contrato',
  'Provenance y completitud íntegros (SHA-256 hex64, rango 0..100, con fuentes)',
  badHashes.length === 0,
  `infractoras=${String(badHashes.length)} · muestra=${
    badHashes
      .slice(0, 3)
      .map((row: FichaDbRow) => row.key)
      .join(',') || '∅'
  }`,
);

const uniqueKeys: number = new Set(rows.map((row: FichaDbRow) => row.key)).size;
check(
  'A. Contrato',
  'Clave natural única: el upsert no puede bifurcar una ficha en dos filas',
  uniqueKeys === rows.length,
  `claves=${String(uniqueKeys)} · filas=${String(rows.length)}`,
);

/* Doctrina adversarial: siete filas corruptas DEBEN ser rechazadas. */
const DOCTRINE_MUTATIONS: readonly { readonly name: string; readonly patch: Record<string, unknown> }[] = [
  { name: 'verified-sin-telefono', patch: { verified: true, phone: null } },
  { name: 'centralita', patch: { phone: CENTRALITA } },
  { name: 'telefono-placeholder', patch: { phone: '000000000' } },
  { name: 'provenance-hash-corto', patch: { provenanceHash: 'abc123' } },
  { name: 'html-hash-no-hex', patch: { htmlSha256: 'ZZZZZZZZ' } },
  { name: 'completitud-fuera-de-rango', patch: { completeness: 101 } },
  { name: 'sin-fuentes', patch: { sources: [] } },
];
const baseRow: FichaDbRow | undefined = rows[0];
const acceptedMutations: string[] = [];
if (baseRow !== undefined) {
  for (const mutation of DOCTRINE_MUTATIONS) {
    const candidate: Record<string, unknown> = { ...baseRow, ...mutation.patch };
    let rejected = false;
    try {
      assertRowDoctrine(candidate);
    } catch {
      rejected = true;
    }
    if (!rejected) acceptedMutations.push(mutation.name);
  }
}
check(
  'A. Contrato',
  'Doctrina adversarial: toda fila corrupta aborta la escritura',
  baseRow !== undefined && acceptedMutations.length === 0,
  `mutaciones=${String(DOCTRINE_MUTATIONS.length)} · aceptadas=${String(acceptedMutations.length)} · ${acceptedMutations.join(',') || 'ninguna'}`,
);

const shuffledSha256: string = fingerprintRows([...rows].reverse());
const tamperedRows: readonly FichaDbRow[] =
  baseRow === undefined
    ? []
    : rows.map((row: FichaDbRow) => (row.key === baseRow.key ? { ...row, completeness: row.completeness + 1 } : row));
const tamperedSha256: string = tamperedRows.length === 0 ? '' : fingerprintRows(tamperedRows);
check(
  'A. Contrato',
  'Huella determinista ante reordenación y SENSIBLE ante un solo campo alterado',
  shuffledSha256 === planSha256 && tamperedSha256 !== planSha256,
  `plan=${planSha256.slice(0, 16)}… · reordenada=${shuffledSha256.slice(0, 16)}… · alterada=${tamperedSha256.slice(0, 16)}…`,
);

/* ── B. ARNÉS RELACIONAL (motor SQL real embebido · NO es PostgreSQL 16) ─── */
let harness: HarnessResult | null = null;
try {
  harness = runRelationalHarness(rows);
} catch (error) {
  check('B. Arnés relacional', 'El arnés se ejecuta sobre el esquema Prisma real', false, messageOf(error));
}

if (harness !== null) {
  check(
    'B. Arnés relacional',
    'El DDL se deriva del esquema Prisma y cubre el contrato de filas (cero deriva)',
    harness.aliasCoverage.missingInSchema.length === 0 && harness.aliasCoverage.extraInSchema.length === 0,
    `motor=${harness.engine} · columnas=${String(harness.schemaColumns.length)} · faltan=${JSON.stringify(
      harness.aliasCoverage.missingInSchema,
    )} · sobran=${JSON.stringify(harness.aliasCoverage.extraInSchema)}`,
  );
  check(
    'B. Arnés relacional',
    'N upserts x2 => exactamente N filas (una por ficha)',
    harness.countAfterFirstPass === rows.length && harness.countAfterSecondPass === rows.length,
    `pasada1=${String(harness.countAfterFirstPass)} · pasada2=${String(harness.countAfterSecondPass)} · esperadas=${String(rows.length)}`,
  );
  check(
    'B. Arnés relacional',
    'La huella persistida reproduce el plan en ambas pasadas',
    harness.fingerprintFirst === planSha256 && harness.fingerprintSecond === planSha256,
    `plan=${planSha256.slice(0, 16)}… · pasada1=${harness.fingerprintFirst.slice(0, 16)}… · pasada2=${harness.fingerprintSecond.slice(0, 16)}…`,
  );
  check(
    'B. Arnés relacional',
    'Atomicidad: la transacción revertida no deja una sola fila',
    harness.rollback.inserted === rows.length && harness.rollback.countAfterRollback === 0,
    `dentro=${String(harness.rollback.inserted)} · tras ROLLBACK=${String(harness.rollback.countAfterRollback)}`,
  );
  check(
    'B. Arnés relacional',
    'Cero claves duplicadas tras el upsert',
    harness.duplicateKeys.length === 0,
    `duplicadas=${String(harness.duplicateKeys.length)}`,
  );
  check(
    'B. Arnés relacional',
    'Todas las aserciones internas del arnés en verde',
    harness.failures.length === 0,
    `assertions=${String(harness.assertions.length)} · fallos=${JSON.stringify(harness.failures)}`,
  );
}

/* ── C. POSTGRESQL 16 REAL (evidencia sólo si hay base viva) ─────────────── */
async function safeDisconnect(prisma: PrismaLike): Promise<void> {
  try {
    await prisma.$disconnect();
  } catch {
    /* la conexión ya estaba rota: nada que liberar */
  }
}

async function runPostgresTier(): Promise<void> {
  const section = 'C. PostgreSQL 16';
  const severity: Severity = REQUIRE_DB ? 'required' : 'advisory';

  loadEnvironment();
  const resolved = resolveDatabaseUrl();
  if (resolved === null) {
    check(
      section,
      'URL de base configurada',
      false,
      'sin POSTGRES_PRISMA_URL ni DATABASE_URL · SIGNAL=SIN_EVIDENCIA_MÁQUINA',
      severity,
    );
    return;
  }

  const target: DbTarget | null = describeDbTarget(resolved.url);
  const label =
    target === null ? 'destino no parseable' : `${target.host}:${target.port}/${String(target.database)} (${target.user})`;

  let prisma: PrismaLike;
  try {
    prisma = createPrismaClient(resolved.url);
  } catch (error) {
    check(
      section,
      'Cliente Prisma generado',
      false,
      `${messageOf(error)} · SIGNAL=SIN_EVIDENCIA_MÁQUINA`,
      severity,
    );
    return;
  }

  try {
    await pingDatabase(prisma, PING_TIMEOUT_MS);
    check(section, 'Base alcanzable (`SELECT 1`)', true, `${label} · env=${resolved.key}`);
  } catch (error) {
    const unavailable: boolean = isUnavailableError(error);
    check(
      section,
      'Base alcanzable (`SELECT 1`)',
      false,
      `${label} · ${unavailable ? 'DB_UNREACHABLE' : 'DB_ERROR'} · ${messageOf(error)} · SIGNAL=SIN_EVIDENCIA_MÁQUINA`,
      severity,
    );
    await safeDisconnect(prisma);
    return;
  }

  try {
    const keys: readonly string[] = rows.map((row: FichaDbRow) => row.key);
    const firstPass = await upsertBatches(prisma, rows, CHUNK);
    const firstRows = await readBackRows(prisma, keys, CHUNK);
    const secondPass = await upsertBatches(prisma, rows, CHUNK);
    const persisted = await readBackRows(prisma, keys, CHUNK);

    check(
      section,
      'N upserts x2 => exactamente 1 fila por ficha',
      firstRows.length === rows.length && persisted.length === rows.length,
      `persistidas=${String(persisted.length)}/${String(rows.length)} · lotes=${String(firstPass.batches)} · upserts=${String(
        firstPass.written + secondPass.written,
      )}`,
    );
    check(
      section,
      'Huella persistida idéntica al plan (cero deriva de contenido)',
      fingerprintRows(persisted) === planSha256,
      `${fingerprintRows(persisted).slice(0, 16)}… vs plan ${planSha256.slice(0, 16)}…`,
    );
  } catch (error) {
    check(section, 'Escritura y relectura verificadas', false, messageOf(error), severity);
  } finally {
    await safeDisconnect(prisma);
  }
}

/* ── Cierre: resumen y código de salida ───────────────────────────────────── */
function summarise(): number {
  const requiredFailures: readonly CaseResult[] = CASES.filter(
    (item: CaseResult) => !item.ok && item.severity === 'required',
  );
  const advisoryFailures: readonly CaseResult[] = CASES.filter(
    (item: CaseResult) => !item.ok && item.severity === 'advisory',
  );
  for (const item of requiredFailures) console.error(`❌ [${item.section}] ${item.name} — ${item.detail}`);
  for (const item of advisoryFailures) console.warn(`⚠️ [${item.section}] ${item.name} — ${item.detail}`);

  const postgresVerified: boolean = CASES.some(
    (item: CaseResult) => item.ok && item.name === 'Huella persistida idéntica al plan (cero deriva de contenido)',
  );
  const relationalVerified: boolean = harness !== null && harness.ok;

  // Precedencia de salida: 2 = falta la base exigida (causa raíz), 1 = aserción.
  const nonDbFailures: readonly CaseResult[] = requiredFailures.filter(
    (item: CaseResult) => item.section !== 'C. PostgreSQL 16',
  );
  const dbMissing: boolean = REQUIRE_DB && !postgresVerified;
  const exit: number = nonDbFailures.length > 0 ? 1 : dbMissing ? 2 : requiredFailures.length > 0 ? 1 : 0;

  console.log(
    JSON.stringify(
      {
        verifier: 'verify_fichas_db',
        total: CASES.length,
        passed: CASES.filter((item: CaseResult) => item.ok).length,
        failed: requiredFailures.length,
        advisory: advisoryFailures.length,
        fichas: rows.length,
        planSha256,
        tiers: {
          contract: requiredFailures.some((item: CaseResult) => item.section.startsWith('A.')) ? 'FAILED' : 'VERIFIED',
          relationalHarness: relationalVerified ? `VERIFIED (${harness?.engine ?? 'n/a'})` : 'FAILED',
          postgres16: postgresVerified ? 'VERIFIED' : 'SKIPPED · SIN_EVIDENCIA_MÁQUINA',
        },
        requireDb: REQUIRE_DB,
        exit,
      },
      null,
      2,
    ),
  );
  return exit;
}

async function main(): Promise<void> {
  await runPostgresTier();
  process.exit(summarise());
}

void main();
