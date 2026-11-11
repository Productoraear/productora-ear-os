/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAREER OS · VENTANA DE SINCRONIZACIÓN (W53_T05)
 * ════════════════════════════════════════════════════════════════════════════
 * Decide QUÉ conexiones toca sincronizar en una pasada de cron. Reglas:
 *
 *   1. La ventana depende del modo de sincronización declarado en el SSOT
 *      (`src/lib/career/platform-registry.ts`), no de una tabla paralela:
 *      `oauth_api` = 15 min; `csv_import` / `manual` / `webhook` = fuera de
 *      ventana (0 min) porque no existe API a la que preguntar. Fingir una
 *      sincronización de `csv_import` sería una fachada (AF-2).
 *   2. `lastSyncAt === null` es DUE — nunca sincronizada — y es el caso de toda
 *      conexión recién creada. Confundirlo con «fuera de ventana» dejaría al
 *      artista sin primera sincronización para siempre.
 *   3. Una fecha de último sync en el futuro (reloj del servidor movido hacia
 *      atrás) se trata como DUE: es más honesto reintentar que dormir una
 *      conexión durante horas por un reloj desajustado.
 *
 * Este módulo es PURO: no lee reloj, ni entorno, ni base de datos. El instante
 * de referencia se inyecta. Cero `any`. Server-only.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { getPlatform, type SyncMode } from '@/lib/career/platform-registry';

/** Intervalo canónico de la sincronización automática por API (15 minutos). */
export const OAUTH_SYNC_INTERVAL_MINUTES = 15 as const;

/** Milisegundos por minuto (aritmética entera, sin floats sueltos). */
const MS_PER_MINUTE = 60_000 as const;

/**
 * Intervalo por modo de sincronización, en minutos.
 * `0` significa «fuera de ventana»: el modo no tiene API que sincronizar.
 */
export const SYNC_INTERVAL_MINUTES: Readonly<Record<SyncMode, number>> = {
  oauth_api: OAUTH_SYNC_INTERVAL_MINUTES,
  csv_import: 0,
  manual: 0,
  webhook: 0,
};

/** Modos que el cron PUEDE sincronizar. Todo lo demás se declara en `skipped`. */
export const CRON_SYNCABLE_MODES: readonly SyncMode[] = ['oauth_api'];

export type SyncEligibilityReason =
  | 'DUE_NEVER_SYNCED'
  | 'DUE_INTERVAL_ELAPSED'
  | 'DUE_CLOCK_SKEW'
  | 'NOT_DUE'
  | 'MODE_NOT_SYNCABLE'
  | 'PLATFORM_UNKNOWN';

export interface SyncEligibility {
  /** ¿Debe entrar en la pasada de este cron?. */
  readonly due: boolean;
  readonly reason: SyncEligibilityReason;
  readonly syncMode: SyncMode | null;
  /** Intervalo aplicado en minutos (0 si el modo no es sincronizable). */
  readonly intervalMinutes: number;
  /** Minutos restantes hasta la próxima ventana (0 si ya toca o no aplica). */
  readonly minutesUntilDue: number;
  /** `lastSyncAt` normalizado a ISO-8601 (null si nunca se sincronizó). */
  readonly lastSyncAt: string | null;
}

/** Entrada mínima: lo que el cron ya trae de la base (select quirúrgico). */
export interface SyncEligibilityInput {
  readonly platformId: string;
  readonly lastSyncAt: Date | string | null;
}

/** Milisegundos de intervalo para un modo (fuera del contrato => 0). */
export function intervalMsForMode(syncMode: SyncMode): number {
  return SYNC_INTERVAL_MINUTES[syncMode] * MS_PER_MINUTE;
}

/** ¿Este modo puede sincronizarse automáticamente?. */
export function isSyncableMode(syncMode: SyncMode): boolean {
  return CRON_SYNCABLE_MODES.includes(syncMode);
}

function toDate(value: Date | string | null): Date | null {
  if (value === null) return null;
  const date = typeof value === 'string' ? new Date(value) : value;
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Evalúa una conexión contra la ventana de sincronización.
 * `now` es obligatorio: sin reloj inyectado la prueba no es determinista.
 */
export function evaluateSyncEligibility(input: SyncEligibilityInput, now: Date): SyncEligibility {
  const def = getPlatform(input.platformId);
  const lastSyncDate = toDate(input.lastSyncAt);
  const lastSyncAt = lastSyncDate === null ? null : lastSyncDate.toISOString();

  if (def === undefined) {
    return {
      due: false,
      reason: 'PLATFORM_UNKNOWN',
      syncMode: null,
      intervalMinutes: 0,
      minutesUntilDue: 0,
      lastSyncAt,
    };
  }

  const intervalMinutes = SYNC_INTERVAL_MINUTES[def.syncMode];
  if (!isSyncableMode(def.syncMode)) {
    return {
      due: false,
      reason: 'MODE_NOT_SYNCABLE',
      syncMode: def.syncMode,
      intervalMinutes,
      minutesUntilDue: 0,
      lastSyncAt,
    };
  }

  if (lastSyncDate === null) {
    return {
      due: true,
      reason: 'DUE_NEVER_SYNCED',
      syncMode: def.syncMode,
      intervalMinutes,
      minutesUntilDue: 0,
      lastSyncAt: null,
    };
  }

  const elapsedMs = now.getTime() - lastSyncDate.getTime();
  const intervalMs = intervalMsForMode(def.syncMode);

  // Reloj del servidor por detrás del último sync: se reintenta (ver cabecera).
  if (elapsedMs < 0) {
    return {
      due: true,
      reason: 'DUE_CLOCK_SKEW',
      syncMode: def.syncMode,
      intervalMinutes,
      minutesUntilDue: 0,
      lastSyncAt,
    };
  }

  if (elapsedMs >= intervalMs) {
    return {
      due: true,
      reason: 'DUE_INTERVAL_ELAPSED',
      syncMode: def.syncMode,
      intervalMinutes,
      minutesUntilDue: 0,
      lastSyncAt,
    };
  }

  return {
    due: false,
    reason: 'NOT_DUE',
    syncMode: def.syncMode,
    intervalMinutes,
    minutesUntilDue: Math.max(1, Math.ceil((intervalMs - elapsedMs) / MS_PER_MINUTE)),
    lastSyncAt,
  };
}

/**
 * Particiona un lote de conexiones en «toca» / «no toca».
 * Orden estable: respeta el orden de entrada (el cron no reordena la base).
 */
export function partitionByDue<T extends SyncEligibilityInput>(
  connections: readonly T[],
  now: Date,
): {
  readonly due: readonly T[];
  readonly skipped: readonly (T & { readonly eligibility: SyncEligibility })[];
} {
  const due: T[] = [];
  const skipped: (T & { readonly eligibility: SyncEligibility })[] = [];
  for (const connection of connections) {
    const eligibility = evaluateSyncEligibility(connection, now);
    if (eligibility.due) due.push(connection);
    else skipped.push({ ...connection, eligibility });
  }
  return { due, skipped };
}


