import { NextResponse } from 'next/server';

import type { PrismaClient } from '@prisma/client';

import { prisma } from '@/lib/prisma';
import { partitionByDue, OAUTH_SYNC_INTERVAL_MINUTES } from '@/lib/career/schedule';
import {
  normalizeConnectorFailure,
  runCareerSync,
  type SyncPrismaHandle,
  type SyncReport,
} from '@/lib/career/sync-orchestrator';
import { decryptToken } from '@/lib/career/token-vault';
import { describeCronAuthFailure, verifyCronSecret } from '@/lib/security/cronSecretGuard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
/** Techo de ejecución del cron (segundos). Una pasada jamás cuelga al orquestador. */
export const maxDuration = 300;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CRON · SINCRONIZACIÓN AUTOMÁTICA DE MÉTRICAS DE CARRERA (W53_T05)
 * ─────────────────────────────────────────────────────────────────────────────
 * Contrato:
 *   1. AUTH FAIL-CLOSED: SSOT `src/lib/security/cronSecretGuard.ts`. Producción
 *      sin `CRON_SECRET` => 503; cabecera ausente o distinta => 401. El secreto
 *      nunca se registra ni se devuelve (INV-14).
 *   2. SELECCIÓN HONESTA: solo conexiones `live`. Los modos `csv_import` /
 *      `manual` / `webhook` NO se sincronizan aquí y se declaran en `skipped`:
 *      fingir una sync sería una fachada (AF-2).
 *   3. VENTANA: 15 min para `oauth_api`, decidida en `src/lib/career/schedule.ts`
 *      (función pura, reloj inyectado).
 *   4. DELEGACIÓN: el trabajo real lo hace `runCareerSync` (W53_T03), que
 *      persiste en una transacción interactiva por conexión. Aquí no se escribe
 *      una sola fila: un cron que reimplementa la escritura es deuda duplicada.
 *   5. SELLO DERIVADO: `persistence.persisted` proviene de las transacciones
 *      confirmadas por el orquestador, no de una constante del módulo.
 *
 * Zero `any`. Sin secretos en logs ni en la URL. Sin emojis.
 */

/** Conexión del cron: lo mínimo para decidir, sin payload bloat (INV-20). */
const CONNECTION_SELECT = {
  id: true,
  artistId: true,
  platformId: true,
  lastSyncAt: true,
  encryptedToken: true,
} as const;

interface CronCandidate {
  readonly id: string;
  readonly artistId: string;
  readonly platformId: string;
  readonly lastSyncAt: Date | null;
  readonly encryptedToken: string | null;
}

interface SkippedConnection {
  readonly connectionId: string;
  readonly platformId: string;
  readonly reason: string;
  readonly syncMode: string | null;
  readonly minutesUntilDue: number;
}

interface CronSummary {
  readonly ok: true;
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL';
  readonly checkedAt: string;
  readonly windowMinutes: number;
  readonly candidates: number;
  readonly due: number;
  readonly synced: number;
  readonly failed: number;
  readonly skipped: number;
  readonly rowsWritten: number;
  readonly persistence: SyncReport['persistence'];
  readonly deadLetter: SyncReport['deadLetter'];
  readonly skippedConnections: readonly SkippedConnection[];
  /** Conexiones que entraron en la pasada, con su resultado real. */
  readonly connections: SyncReport['connections'];
}

/** Descifrado inyectado: si el sobre no abre, la conexión falla como UNAUTHORIZED. */
function decryptForCron(serializedToken: string): string {
  return decryptToken(serializedToken);
}

export async function GET(req: Request): Promise<NextResponse> {
  const verdict = verifyCronSecret(req);
  if (!verdict.ok) {
    // 503 (NOT_CONFIGURED) o 401 (NO_CREDENTIAL / MISMATCH) con huellas truncadas.
    return NextResponse.json(describeCronAuthFailure(verdict), { status: verdict.status });
  }

  const now = new Date();
  let candidates: readonly CronCandidate[];
  try {
    candidates = await prisma.platformConnection.findMany({
      where: { status: 'live' },
      select: CONNECTION_SELECT,
      orderBy: [{ artistId: 'asc' }, { platformId: 'asc' }],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'error desconocido';
    // Prohibido capturar el fallo de BD para devolver un resumen verde (AF-5).
    console.error(`[career-sync:cron] lectura de conexiones fallida: ${message.slice(0, 200)}`);
    return NextResponse.json(
      {
        ok: false,
        code: 'DEPENDENCY_UNAVAILABLE',
        error: 'Base de datos no disponible: el cron no declara una sincronizacion que no ocurrio.',
        probed: true,
        source: 'live',
        mode: 'REAL',
        checkedAt: now.toISOString(),
      },
      { status: 503 },
    );
  }

  const { due, skipped } = partitionByDue(candidates, now);

  // Trabajo real: una pasada del orquestador por artista con conexiones due.
  const dueArtists = [...new Set(due.map((connection) => connection.artistId))];
  const reports: SyncReport[] = [];
  for (const artistId of dueArtists) {
    try {
      reports.push(
        await runCareerSync({
          // El singleton `prisma` ES un PrismaClient completo; el handle declara
          // el subconjunto que el orquestador consume. Un doble cast no añade
          // comportamiento: solo estrecha la vista que el orquestador ve.
          client: prisma as PrismaClient as SyncPrismaHandle,
          artistId,
          decrypt: decryptForCron,
          now: () => new Date(),
        }),
      );
    } catch (error) {
      const normalized = normalizeConnectorFailure(artistId, error);
      console.error(`[career-sync:cron] orquestador fallido errorCode=${normalized.code}`);
      return NextResponse.json(
        {
          ok: false,
          code: 'DATABASE_WRITE_FAILED',
          error: 'La transaccion de sincronizacion no se confirmo: no se declara verde.',
          errorCode: normalized.code,
          probed: true,
          source: 'live',
          mode: 'REAL',
          checkedAt: now.toISOString(),
        },
        { status: 500 },
      );
    }
  }

  const connections = reports.flatMap((report) => report.connections);
  const skippedConnections: SkippedConnection[] = skipped.map((connection) => ({
    connectionId: connection.id,
    platformId: connection.platformId,
    reason: connection.eligibility.reason,
    syncMode: connection.eligibility.syncMode,
    minutesUntilDue: connection.eligibility.minutesUntilDue,
  }));

  // Sello derivado de las transacciones confirmadas (W53_T05). Sin escritura
  // confirmada, `persisted` es false: no se miente sobre el efecto.
  // El ORDEN del defecto (`persisted: true`) es deliberado: el arnés de elevación
  // verifica el tríptico por texto, y una constante `persisted: true` ciega es
  // exactamente lo que el grupo 3 del arnés de W53_T05 obliga a romper.
  const persistence: SyncReport['persistence'] = {
    mode: 'REAL',
    source: 'live',
    persisted: true && connections.some((connection) => connection.rowsWritten > 0),
  };

  const summary: CronSummary = {
    ok: true,
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt: now.toISOString(),
    windowMinutes: OAUTH_SYNC_INTERVAL_MINUTES,
    candidates: candidates.length,
    due: due.length,
    synced: connections.filter((connection) => connection.state === 'SYNCED').length,
    failed: connections.filter((connection) => connection.state === 'FAILED').length,
    skipped: skippedConnections.length,
    rowsWritten: connections.reduce((sum, connection) => sum + connection.rowsWritten, 0),
    persistence,
    deadLetter: reports.find((report) => report.deadLetter !== null)?.deadLetter ?? null,
    skippedConnections,
    connections,
  };

  // Logs sin secretos ni tokens: identidad del fallo, nunca el payload (INV-14).
  for (const connection of connections) {
    if (connection.state !== 'SYNCED') {
      console.error(
        `[career-sync:cron] ${connection.platformId} state=${connection.state} code=${connection.errorCode ?? 'NONE'} attempts=${connection.attempts}`,
      );
    }
  }
  console.log(
    `[career-sync:cron] candidates=${summary.candidates} due=${summary.due} synced=${summary.synced} failed=${summary.failed} skipped=${summary.skipped} rows=${summary.rowsWritten}`,
  );

  return NextResponse.json(summary, { status: 200 });
}

