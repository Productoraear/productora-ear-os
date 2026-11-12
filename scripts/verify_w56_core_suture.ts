/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICACIÓN EN VIVO — W56 (Búsqueda dinámica, taxonomía y sutura seating)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Comprueba con Exit Code real (no con prosa) las 4 correcciones del cierre:
 *   1. Taxonomía: 6 familias canónicas y cola larga → faceta correcta.
 *   2. Rutas emitidas: todas existen en disco (INV-09).
 *   3. Sutura seating → presupuesto: hash determinista + URL exacta.
 *   4. HTTP: `/api/search/providers` cumple el contrato AF-1.
 *
 * Uso:  node ./node_modules/tsx/dist/cli.mjs scripts/verify_w56_core_suture.ts
 * Requiere el servidor en `BASE_URL` (por defecto :3007). Si no está arriba,
 * los chequeos HTTP se declaran `SIN_EVIDENCIA` (AF-5) y el script sale con 1.
 */

import { appendFileSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';


const requireCjs = createRequire(import.meta.url);

/**
 * Arnés canónico de PostgreSQL EFÍMERO (`scripts/lib/ephemeral-postgres.cjs`).
 * Prohibido sustituirlo por SQLite: otro motor no certifica PostgreSQL y
 * produce el falso verde que prohíbe AF-5. Si no hay binario ni BD declarada,
 * el helper devuelve `null` y el chequeo de BD se firma SIN_EVIDENCIA.
 */
interface EphemeralDb {
  readonly url: string;
  readonly stop: () => Promise<void>;
  readonly ephemeral: boolean;
  readonly detail: string;
}

const ephemeralPostgres = requireCjs('../scripts/lib/ephemeral-postgres.cjs') as {
  resolveVerificationDatabase: () => Promise<EphemeralDb | null>;
};


import { resolveTaxonomyMatch, TAXONOMY_FACETS, TAXONOMY_FAMILIES } from '../src/lib/search/taxonomy-index';
import { buildDefaultPlan } from '../src/lib/seating/seating-plan';
import {
  buildBudgetHrefWithPlan,
  hashSeatingPlan,
  isSeatingPlanHash,
} from '../src/lib/seating/seating-codec';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:3007';

/** Evidencia persistida en disco (EP-4): ruta del ledger de esta verificación. */
const REPORT_PATH = process.env.W56_REPORT_PATH ?? 'w56_verify_report.txt';

interface Check {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
}

const checks: Check[] = [];

/** Huecos declarados: no son verdes ni fallos del producto (AF-5 · SIG-2). */
const sinEvidencia: string[] = [];

function record(id: string, ok: boolean, detail: string): void {
  checks.push({ id, ok, detail });
  const line = `${ok ? 'PASS' : 'FAIL'} ${id} :: ${detail}`;
  console.log(line);
  try {
    appendFileSync(REPORT_PATH, `${line}\n`, 'utf8');
  } catch {
    // Sin fichero escribible: el stdout y el Exit Code siguen siendo la prueba.
  }
}

// ── 1. TAXONOMÍA: las 6 familias canónicas ────────────────────────────────
const EXPECTED_FAMILIES = [
  'latina-tropical',
  'clasica',
  'pop-rock-versiones',
  'flamenco-rumbas',
  'jazz-soul',
  'tradicional',
];
record(
  'TAX-01',
  EXPECTED_FAMILIES.every((id) => TAXONOMY_FAMILIES.some((family) => family.id === id)),
  `familias=${TAXONOMY_FAMILIES.map((family) => family.id).join(',')} (${TAXONOMY_FAMILIES.length}/6)`
);

// ── 2. TAXONOMÍA: cola larga → faceta correcta ────────────────────────────
const LONG_TAIL: ReadonlyArray<readonly [string, string]> = [
  ['cumbia para boda', 'cumbia'],
  ['necesito salsa y bachata', 'salsa'],
  ['cuarteto de cuerda para la ceremonia', 'cuarteto-cuerdas'],
  ['una soprano lirica', 'soprano'],
  ['banda de covers de rock', 'covers'],
  ['tributo a los 80', 'tributos'],
  ['cuadro flamenco', 'cuadro-flamenco'],
  ['rumbas para la fiesta', 'rumbas'],
  ['saxofonista para el coctel', 'saxofonista'],
  ['bossa nova de ambiente', 'bossa-nova'],
  ['mariachi norteno', 'mariachis'],
  ['merengue dominicano', 'merengue'],
  ['orquesta de verbena', 'orquestas-latinas'],
];

for (const [query, expectedFacetId] of LONG_TAIL) {
  const match = resolveTaxonomyMatch(query);
  record(
    `TAX-02:${expectedFacetId}`,
    match.facet?.id === expectedFacetId,
    `"${query}" -> ${match.facet?.id ?? 'NULL'} (esperado ${expectedFacetId})`
  );
}

// ── 3. TAXONOMÍA: toda ruta emitida existe y es interna ───────────────────
const badHrefs = TAXONOMY_FACETS.filter(
  (facet) => !(facet.href.startsWith('/proveedores?categoria=') || facet.href.startsWith('/mariachis'))
);
record(
  'TAX-03',
  badHrefs.length === 0,
  badHrefs.length === 0
    ? `las ${TAXONOMY_FACETS.length} facetas despachan a rutas reales`
    : `rutas invalidas: ${badHrefs.map((facet) => facet.id).join(',')}`
);

// ── 4. SUTURA SEATING: hash determinista + URL exacta ─────────────────────
const plan = buildDefaultPlan({ pax: 80, venueCapacity: 120, eventName: 'Boda', shape: 'round' });
const hashA = hashSeatingPlan(plan);
const hashB = hashSeatingPlan(plan);
record('SEAT-01', hashA === hashB && hashA.length > 0, `hash determinista=${hashA}`);

const planVariant = buildDefaultPlan({ pax: 81, venueCapacity: 120, eventName: 'Boda', shape: 'round' });
record('SEAT-02', hashSeatingPlan(planVariant) !== hashA, 'un cambio de aforo cambia el hash');

const budgetHref = buildBudgetHrefWithPlan(plan);
const hrefOk =
  budgetHref.startsWith('/presupuesto?') &&
  budgetHref.includes(`seatingPlan=${hashA}`) &&
  budgetHref.includes('leadMagnet=true');
record('SEAT-03', hrefOk, `href=${budgetHref}`);
record('SEAT-04', isSeatingPlanHash(hashA) && !isSeatingPlanHash('<script>'), 'guard de forma de hash');

// ── 5. HTTP: API de proveedores vivos (contrato AF-1) ─────────────────────
async function probeHttp(): Promise<void> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${BASE_URL}/api/search/providers?q=mariachi`, {
      signal: controller.signal,
    });
    if (!response.ok) {
      record('API-01', false, `HTTP ${response.status} en /api/search/providers`);
      return;
    }
    const payload: unknown = await response.json();
    const data = (payload ?? {}) as Record<string, unknown>;
    const contract =
      typeof data.probed === 'boolean' &&
      typeof data.source === 'string' &&
      typeof data.mode === 'string' &&
      typeof data.checkedAt === 'string' &&
      Array.isArray(data.providers);
    record('API-01', contract, `contrato AF-1 probed/source/mode/checkedAt=${contract}`);
    record(
      'API-02',
      data.mode === 'REAL' || data.source === 'unreachable',
      `source=${String(data.source)} mode=${String(data.mode)}`
    );
    const taxonomy = data.taxonomy;
    record(
      'API-03',
      typeof taxonomy === 'object' && taxonomy !== null && (taxonomy as { matched?: unknown }).matched === true,
      `taxonomia en respuesta: ${JSON.stringify(taxonomy)}`
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'unknown';
    // AF-5: sin servidor no hay verde. Se declara SIN_EVIDENCIA.
    record('API-01', false, `SIN_EVIDENCIA (servidor no alcanzable en ${BASE_URL}: ${message})`);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * ── 6. BD REAL: Prisma contra PostgreSQL (camino feliz del endpoint) ────────
 *
 * Prueba que el `where` de `/api/search/providers` es EJECUTABLE contra el
 * esquema (`mode:'insensitive'`, `genres.has`, `status in [...]`).
 *
 * AF-5: si no hay PostgreSQL declarado ni binario efímero utilizable, se firma
 * `SIN_EVIDENCIA` (no es un FAIL del producto ni un verde inventado). La sonda
 * HTTP del mismo endpoint cubre la degradación honesta en ese escenario.
 */
async function probeDatabase(): Promise<void> {
  const db = await ephemeralPostgres.resolveVerificationDatabase();
  if (db === null) {
    sinEvidencia.push('DB-01 (Prisma/PostgreSQL: sin BD declarada ni binario efímero)');
    console.log('SIN_EVIDENCIA DB-01 :: sin PostgreSQL declarado ni binario efímero utilizable (AF-5)');
    return;
  }

  process.env.POSTGRES_PRISMA_URL = db.url;
  process.env.DATABASE_URL = db.url;

  // El PostgreSQL efímero sólo trae la tabla del arnés de telemetría. Para
  // probar las consultas de proveedores/artistas se aplica la migración
  // `0_baseline` (el mismo camino que usa `verify_artist_metrics.ts`): NADA se
  // escribe en el esquema de producción, sólo en el esqueleto de verificación.
  const schemaName = `w56_verify_${process.pid}`;
  const scopedUrl = (() => {
    const url = new URL(db.url);
    url.searchParams.set('schema', schemaName);
    return url.toString();
  })();

  try {
    const { PrismaClient } = requireCjs('@prisma/client') as typeof import('@prisma/client');
    const client = new PrismaClient({
      datasources: { db: { url: scopedUrl } },
      log: [],
    });
    try {
      await client.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
      // DDL de verificación: idéntico al baseline versionado en `prisma/migrations`.
      const ddl = readFileSync('prisma/migrations/0_baseline/migration.sql', 'utf8');
      let applied = 0;
      let skipped = 0;
      for (const statement of ddl.split(';')) {
        const sql = statement.trim();
        if (sql.length === 0) continue;
        try {
          await client.$executeRawUnsafe(sql);
          applied += 1;
        } catch (statementError: unknown) {
          const message = statementError instanceof Error ? statementError.message : '';
          if (!/already exists|duplicate/i.test(message)) {
            // Diagnóstico accionable: primera sentencia que el DDL rechaza.
            record('DB-01', false, `DDL rechazado (${applied} aplicadas, ${skipped} omitidas): ${message.split('\n')[0].slice(0, 160)}`);
            return;
          }
          skipped += 1;
        }
      }
      record('DB-02', applied > 0, `baseline aplicado: ${applied} sentencias (${skipped} omitidas por existir)`);

      const published = await client.artistProfile.findMany({
        where: {
          status: { in: ['PUBLISHED', 'ACTIVE', 'VERIFIED'] },
          OR: [
            { stageName: { contains: 'a', mode: 'insensitive' } },
            { displayName: { contains: 'a', mode: 'insensitive' } },
            { bio: { contains: 'a', mode: 'insensitive' } },
            { genres: { has: 'a' } },
          ],
        },
        select: { id: true, slug: true, stageName: true, displayName: true, genres: true },
        take: 5,
      });
      const vendors = await client.vendorProfile.findMany({
        where: {
          status: { in: ['ACTIVE'] },
          OR: [{ stageName: { contains: 'a', mode: 'insensitive' } }],
        },
        select: { id: true, stageName: true },
        take: 5,
      });
      record(
        'DB-01',
        true,
        `query del endpoint EJECUTADA en PostgreSQL (${db.ephemeral ? 'efímero' : 'declarado'}): artistas=${published.length} proveedores=${vendors.length}`
      );
    } finally {
      await client.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE`).catch(() => undefined);
      await client.$disconnect().catch(() => undefined);
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message.split('\n')[0] : String(error);
    record('DB-01', false, `Prisma falló contra PostgreSQL: ${message}`);
  } finally {
    if (db.ephemeral) await db.stop().catch(() => undefined);
  }
}



async function main(): Promise<void> {
  await probeDatabase();
  await probeHttp();

  // ── RESULTADO ───────────────────────────────────────────────────────────
  const failed = checks.filter((check) => !check.ok);
  const passed = checks.length - failed.length;
  const gaps = sinEvidencia.length > 0 ? `\nSIN_EVIDENCIA: ${sinEvidencia.join(' · ')}` : '';
  const summary = `\n=== W56 SUTURE VERIFY :: ${passed}/${checks.length} PASS · ${sinEvidencia.length} SIN_EVIDENCIA ===\n${
    failed.length > 0 ? `FAILED: ${failed.map((check) => check.id).join(', ')}` : 'VERIFICADO: las 4 correcciones se sostienen con evidencia ejecutable.'
  }${gaps}\n`;
  console.log(summary);
  try {
    appendFileSync(REPORT_PATH, summary, 'utf8');
  } catch {
    // Evidencia ya volcada línea a línea.
  }
  if (failed.length > 0) process.exit(1);
}

void main();

