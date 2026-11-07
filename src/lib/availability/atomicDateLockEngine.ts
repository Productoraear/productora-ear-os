/**
 * ATOMIC DATE LOCK ENGINE // ANTI-COLLISION ACID GUARD & OFFLINE RESILIENCE
 *
 * Motor canónico de verificación y bloqueo atómico de fechas contra colisiones
 * bajo gobernanza S-Class (Antigravity Omega v11.0 / ZTM).
 *
 * Arquitectura Dual-Engine:
 *  1. Primario (ACID PostgreSQL): Transacciones interactivas contra `calendarBlock`
 *     y `ProductionEvent` cuando PostgreSQL está disponible.
 *  2. Secundario (Fallback Offline Resiliente): Persistencia local en disco
 *     (`.data/offline-date-locks.json`), con:
 *      - Circuit breaker de 10 segundos que evita demoras de socket cuando la DB no escucha.
 *      - Escritura atómica en disco (`tmp` file + `fs.promises.rename`).
 *      - Cola de serialización en proceso (`enqueueMutation`) contra condiciones de carrera.
 *      - Idempotencia estricta por `stripeSessionId`.
 *      - Sello criptográfico SHA-256 (`priceLockSha256`).
 *      - Sincronización transparente con `entity-calendar-store.ts`.
 *      - Cero excepciones no controladas ni respuestas 500 en dev/demo.
 */

import { promises as fs } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { classifyDbFailure } from '@/lib/db/dbFailureClassifier';
import { reserveEntitySlot, releaseEntitySlot } from '@/lib/calendar/entity-calendar-store';
import { CALENDAR_ENTITY_KINDS, type CalendarEntityKind } from '@/lib/calendar/entity-calendar-types';

// ============================================================================
// TIPOS Y CONTRATOS PÚBLICOS
// ============================================================================

export interface AvailabilityCheckInput {
  /** Fecha ISO del evento (YYYY-MM-DD o ISO completo) */
  eventDate?: string;
  /** Compatibilidad polimórfica para contratos que envíen `date` */
  date?: string;
  /** ID del artista/proveedor a bloquear (opcional: si se omite, chequeo global) */
  artistProfileId?: string;
  /** Tipología de la entidad dueña de la agenda (`artista`, `catering`, `finca`…). */
  entityKind?: string;
  /** Slug canónico de la entidad dueña de la agenda (`edwin-agudelo`, `abc-espacio-71015`…). */
  entitySlug?: string;
  /** Franja horaria solicitada (e.g. "14:00", "18:00", "21:30") */
  timeSlot?: string;
  /** ID de producción a excluir del chequeo (para re-validaciones) */
  excludeProductionId?: string;
}

export interface AvailabilityCheckResult {
  available: boolean;
  reason:
    | 'AVAILABLE'
    | 'CALENDAR_BLOCKED'
    | 'PRODUCTION_COLLISION'
    | 'MAX_DAILY_CAP_REACHED'
    | 'INVALID_DATE'
    | 'OFFLINE_PERSISTED_LOCK'
    | 'BLOCKED_BY_CALENDAR'
    | 'LOCKED_BY_EVENT';
  conflictingBlockId?: string;
  conflictingProductionId?: string;
  normalizedDate: string;
  timeSlot?: string;
  dailyGigsBooked?: number;
  entityScope?: string;
  lockExpiresAt?: string;
  storageMode?: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
}

export interface AtomicLockInput {
  /** Fecha ISO del evento */
  eventDate?: string;
  /** Compatibilidad polimórfica con contratos `date` */
  date?: string;
  artistProfileId?: string;
  entityKind?: string;
  entitySlug?: string;
  productionEventId?: string;
  timeSlot?: string;
  bufferMinutes?: number;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
  location?: string;
  stripeSessionId?: string;
  priceLockSha256?: string;
  totalAmountEur?: number;
  depositAmountEur?: number;
  status?: string;
  entityId?: string;
}

export interface AtomicLockResult {
  success: boolean;
  blockId?: string;
  reason: string;
  productionId?: string;
  lockId?: string;
  priceLockSha256?: string;
  storageMode: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
  lockExpiresAt?: string;
}

export interface AtomicUnlockInput {
  lockId?: string;
  productionId?: string;
  stripeSessionId?: string;
  eventDate?: string;
  date?: string;
  artistProfileId?: string;
  entityKind?: string;
  entitySlug?: string;
  timeSlot?: string;
}

export interface AtomicUnlockResult {
  success: boolean;
  reason: string;
  releasedLockId?: string;
  storageMode: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
}

export interface ReleaseStaleLocksResult {
  success: boolean;
  releasedCount: number;
  reason: string;
  storageMode: 'PRIMARY_POSTGRES' | 'FALLBACK_OFFLINE_DISK';
}

export interface OfflineCalendarBlock {
  id: string;
  artistProfileId?: string | null;
  date: string;
  createdAt: string;
}

export interface OfflineProductionEvent {
  id: string;
  title: string;
  eventDate: string;
  eventType: string;
  status: string;
  totalBudget: number;
  clientEmail?: string | null;
  clientName?: string | null;
  clientPhone?: string | null;
  location?: string | null;
  guestCount: number;
  serviceLines: unknown[];
  stakeholders: unknown[];
  metadata: {
    timeSlot?: string | null;
    horaTramo?: string | null;
    bufferMinutes?: number;
    artistProfileId?: string | null;
    entityKind?: string | null;
    entitySlug?: string | null;
    entityScope?: string | null;
    stripeSessionId?: string | null;
    priceLockSha256: string;
    lockedAt: string;
    lockExpiresAt?: string | null;
    isOfflineFallback: true;
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

export interface OfflineDateLockStoreData {
  calendarBlocks: OfflineCalendarBlock[];
  productionEvents: OfflineProductionEvent[];
  updatedAt: string;
}

// ============================================================================
// CONFIGURACIÓN Y ESTADO GLOBAL EN MEMORIA
// ============================================================================

const STORE_FILE =
  process.env.EAR_OFFLINE_DATE_LOCKS_STORE?.trim() ||
  path.join(process.cwd(), '.data', 'offline-date-locks.json');

const DB_CIRCUIT_BREAKER_TTL_MS = 10_000; // 10 segundos de fast-path offline

interface OfflineStoreCache {
  loaded: boolean;
  data: OfflineDateLockStoreData;
}

interface GlobalOfflineState {
  __earOfflineLockQueue?: Promise<unknown>;
  __earOfflineDbCircuitBreakerUntil?: number;
  __earOfflineLockStoreCache?: OfflineStoreCache;
}

const globalStore = globalThis as typeof globalThis & GlobalOfflineState;

const cache: OfflineStoreCache = (globalStore.__earOfflineLockStoreCache ??= {
  loaded: false,
  data: {
    calendarBlocks: [],
    productionEvents: [],
    updatedAt: new Date().toISOString(),
  },
});

/** Serializa mutaciones en proceso para erradicar condiciones de carrera en disco. */
function enqueueMutation<T>(task: () => Promise<T>): Promise<T> {
  const previous = globalStore.__earOfflineLockQueue ?? Promise.resolve();
  const next = previous.then(task, task);
  globalStore.__earOfflineLockQueue = next.catch(() => undefined);
  return next;
}

// ============================================================================
// CIRCUIT BREAKER FAST-PATH
// ============================================================================

export function isDbCircuitOpen(): boolean {
  const until = globalStore.__earOfflineDbCircuitBreakerUntil;
  return typeof until === 'number' && Date.now() < until;
}

export function tripDbCircuit(): void {
  globalStore.__earOfflineDbCircuitBreakerUntil = Date.now() + DB_CIRCUIT_BREAKER_TTL_MS;
}

export function resetDbCircuitBreaker(): void {
  globalStore.__earOfflineDbCircuitBreakerUntil = undefined;
}

export function getDbCircuitBreakerStatus(): { isOpen: boolean; openUntil: number | null } {
  const until = globalStore.__earOfflineDbCircuitBreakerUntil ?? null;
  return {
    isOpen: typeof until === 'number' && Date.now() < until,
    openUntil: until,
  };
}

/** Detecta si un error indica indisponibilidad de PostgreSQL. */
function isDbConnectivityError(err: unknown): boolean {
  if (!err) return false;
  const report = classifyDbFailure(err);
  if (
    report.kind === 'DB_UNREACHABLE' ||
    report.kind === 'DB_URL_MISSING' ||
    report.kind === 'DB_POOL_TIMEOUT' ||
    report.kind === 'DB_CONNECTION_CLOSED'
  ) {
    return true;
  }
  const msg = err instanceof Error ? err.message : String(err);
  const name = err instanceof Error ? err.name : '';
  if (
    name.includes('PrismaClientInitializationError') ||
    msg.includes("Can't reach database server") ||
    msg.includes('could not connect to server') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('ENOTFOUND') ||
    msg.includes('P1001')
  ) {
    return true;
  }
  return false;
}

// ============================================================================
// PERSISTENCIA DURABLE EN DISCO (TMP + RENAME)
// ============================================================================

async function loadStoreFromDisk(): Promise<void> {
  if (cache.loaded) return;
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      const rec = parsed as Partial<OfflineDateLockStoreData>;
      cache.data = {
        calendarBlocks: Array.isArray(rec.calendarBlocks) ? rec.calendarBlocks : [],
        productionEvents: Array.isArray(rec.productionEvents) ? rec.productionEvents : [],
        updatedAt: typeof rec.updatedAt === 'string' ? rec.updatedAt : new Date().toISOString(),
      };
    }
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code !== 'ENOENT') {
      console.warn('[atomicDateLockEngine] Archivo de locks corrupto o ilegible; se reinicializa:', error);
    }
    cache.data = {
      calendarBlocks: [],
      productionEvents: [],
      updatedAt: new Date().toISOString(),
    };
  } finally {
    cache.loaded = true;
  }
}

async function persistStoreToDisk(): Promise<void> {
  try {
    await fs.mkdir(path.dirname(STORE_FILE), { recursive: true });
    const tmp = `${STORE_FILE}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`;
    const payload = JSON.stringify(cache.data, null, 2);
    await fs.writeFile(tmp, payload, 'utf8');
    try {
      await fs.rename(tmp, STORE_FILE);
    } catch {
      // Resiliencia Windows (MoveFile con sobrescritura si rename es retenido)
      await fs.copyFile(tmp, STORE_FILE);
      await fs.unlink(tmp).catch(() => undefined);
    }
  } catch (error) {
    console.warn('[atomicDateLockEngine] Persistencia en disco no disponible; operando en memoria:', error);
  }
}

/** Recarga explícitamente el almacenamiento desde disco (invalida la caché en memoria). */
export async function reloadOfflineStoreFromDisk(): Promise<void> {
  cache.loaded = false;
  await loadStoreFromDisk();
}

/** Obtiene una copia diagnóstica del almacén de bloqueos offline. */
export async function getOfflineDateLockStore(): Promise<OfflineDateLockStoreData> {
  await loadStoreFromDisk();
  return JSON.parse(JSON.stringify(cache.data)) as OfflineDateLockStoreData;
}

// ============================================================================
// NORMALIZACIÓN DE FECHAS Y ENTIDADES
// ============================================================================

/**
 * Normaliza una fecha a rango [00:00:00, 23:59:59.999] del día indicado.
 */
function getDayRange(eventDate: string): { start: Date; end: Date; dateStr: string } | null {
  if (typeof eventDate !== 'string' || eventDate.trim().length === 0) return null;
  const trimmed = eventDate.trim();

  // YYYY-MM-DD canónico
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(trimmed);
  if (match) {
    const [, y, m, d] = match;
    const year = Number(y);
    const month = Number(m);
    const day = Number(d);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
    return { start, end, dateStr: `${y}-${m}-${d}` };
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) return null;

  const start = new Date(parsed);
  start.setHours(0, 0, 0, 0);
  const end = new Date(parsed);
  end.setHours(23, 59, 59, 999);
  const dateStr = start.toISOString().slice(0, 10);

  return { start, end, dateStr };
}

/** Clave de aislamiento de la entidad evaluada (`kind:slug`) o `null`. */
function entityScope(input: { entityKind?: string; entitySlug?: string }): string | null {
  if (!input.entitySlug) return null;
  const kind = (input.entityKind || 'servicios').trim().toLowerCase();
  return `${kind}:${input.entitySlug.trim().toLowerCase()}`;
}

/** Calcula el sello criptográfico SHA-256 Price-Lock. */
function computePriceLockSha256(data: {
  eventDate: string;
  clientName?: string;
  totalAmountEur?: number;
  depositAmountEur?: number;
  stripeSessionId?: string;
  entitySlug?: string;
}): string {
  const payload = [
    data.eventDate.slice(0, 10),
    data.entitySlug || 'edwin-agudelo',
    data.clientName || 'Cliente EAR OS',
    (data.totalAmountEur ?? 350).toFixed(2),
    (data.depositAmountEur ?? 100).toFixed(2),
    data.stripeSessionId || 'OFFLINE_PRICE_LOCK_SEAL',
  ].join('::');
  return createHash('sha256').update(payload).digest('hex');
}

// ============================================================================
// VERIFICACIÓN DE DISPONIBILIDAD (OFFLINE & PRISMA)
// ============================================================================

async function checkDateAvailabilityOffline(
  input: AvailabilityCheckInput,
  range: { start: Date; end: Date; dateStr: string },
  scope: string | null
): Promise<AvailabilityCheckResult> {
  await loadStoreFromDisk();
  const { dateStr, start } = range;
  const normalizedSlug = input.entitySlug?.trim().toLowerCase();

  // 1. Chequeo de calendarBlock offline
  const conflictingBlock = cache.data.calendarBlocks.find((block) => {
    if (input.artistProfileId && block.artistProfileId && block.artistProfileId !== input.artistProfileId) {
      return false;
    }
    const bDate = block.date.slice(0, 10);
    return bDate === dateStr;
  });

  if (conflictingBlock) {
    return {
      available: false,
      reason: 'CALENDAR_BLOCKED',
      conflictingBlockId: conflictingBlock.id,
      normalizedDate: start.toISOString(),
      timeSlot: input.timeSlot,
      entityScope: scope ?? undefined,
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  }

  // 2. Chequeo de ProductionEvent activo offline en la misma fecha
  const activeEvents = cache.data.productionEvents.filter((prod) => {
    if (prod.status === 'CANCELLED' || prod.status === 'DRAFT') return false;
    if (input.excludeProductionId && prod.id === input.excludeProductionId) return false;

    const pDate = prod.eventDate.slice(0, 10);
    if (pDate !== dateStr) return false;

    // Aislamiento por entidad
    if (normalizedSlug) {
      const prodSlug = prod.metadata?.entitySlug?.trim().toLowerCase();
      if (prodSlug && prodSlug !== normalizedSlug) {
        return false;
      }
    }
    return true;
  });

  const dailyCount = activeEvents.length;

  if (dailyCount >= 6) {
    return {
      available: false,
      reason: 'MAX_DAILY_CAP_REACHED',
      normalizedDate: start.toISOString(),
      timeSlot: input.timeSlot,
      dailyGigsBooked: dailyCount,
      entityScope: scope ?? undefined,
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  }

  if (input.timeSlot) {
    const conflicting = activeEvents.find((prod) => {
      const metaSlot = prod.metadata?.timeSlot || prod.metadata?.horaTramo;
      if (!metaSlot) return true; // Bloqueo de jornada completa
      return metaSlot === input.timeSlot;
    });

    if (conflicting) {
      return {
        available: false,
        reason: 'PRODUCTION_COLLISION',
        conflictingProductionId: conflicting.id,
        normalizedDate: start.toISOString(),
        timeSlot: input.timeSlot,
        dailyGigsBooked: dailyCount,
        entityScope: scope ?? undefined,
        storageMode: 'FALLBACK_OFFLINE_DISK',
      };
    }
  } else if (activeEvents.length > 0) {
    return {
      available: false,
      reason: 'PRODUCTION_COLLISION',
      conflictingProductionId: activeEvents[0].id,
      normalizedDate: start.toISOString(),
      dailyGigsBooked: dailyCount,
      entityScope: scope ?? undefined,
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  }

  return {
    available: true,
    reason: 'AVAILABLE',
    normalizedDate: start.toISOString(),
    timeSlot: input.timeSlot,
    dailyGigsBooked: dailyCount,
    entityScope: scope ?? undefined,
    storageMode: 'FALLBACK_OFFLINE_DISK',
  };
}

/**
 * Verifica de forma atómica si una fecha y franja horaria están disponibles.
 * Permite invocación polimórfica: `checkDateAvailability(input)` o `checkDateAvailability(date, entityId)`.
 */
export async function checkDateAvailability(
  inputOrDate: AvailabilityCheckInput | string,
  maybeEntityId?: string
): Promise<AvailabilityCheckResult> {
  const input: AvailabilityCheckInput =
    typeof inputOrDate === 'string'
      ? {
          eventDate: inputOrDate,
          artistProfileId: maybeEntityId,
          entitySlug: maybeEntityId,
        }
      : inputOrDate;

  const rawDate = input.eventDate || input.date || '';
  const range = getDayRange(rawDate);
  if (!range) {
    return {
      available: false,
      reason: 'INVALID_DATE',
      normalizedDate: rawDate,
    };
  }

  const { start, end } = range;
  const scope = entityScope(input);

  // ⚡ Fast-path si el circuit breaker ya detectó PostgreSQL caído
  if (isDbCircuitOpen()) {
    return checkDateAvailabilityOffline(input, range, scope);
  }

  // Intento primario transaccional con Prisma
  try {
    const blockWhere: Record<string, unknown> = {
      date: { gte: start, lte: end },
    };
    if (input.artistProfileId) {
      blockWhere.artistProfileId = input.artistProfileId;
    }

    const conflictingBlock = await prisma.calendarBlock.findFirst({
      where: blockWhere,
      orderBy: { createdAt: 'desc' },
    });

    if (conflictingBlock) {
      return {
        available: false,
        reason: 'CALENDAR_BLOCKED',
        conflictingBlockId: conflictingBlock.id,
        normalizedDate: start.toISOString(),
        timeSlot: input.timeSlot,
        entityScope: scope ?? undefined,
        storageMode: 'PRIMARY_POSTGRES',
      };
    }

    const productionWhere: Record<string, unknown> = {
      eventDate: { gte: start, lte: end },
      status: { notIn: ['CANCELLED', 'DRAFT'] },
    };
    if (input.excludeProductionId) {
      productionWhere.id = { not: input.excludeProductionId };
    }
    if (scope && input.entitySlug) {
      productionWhere.metadata = {
        path: ['entitySlug'],
        equals: input.entitySlug.trim().toLowerCase(),
      };
    }

    const activeProductions = await prisma.productionEvent.findMany({
      where: productionWhere,
      orderBy: { createdAt: 'desc' },
    });

    const dailyCount = activeProductions.length;

    if (dailyCount >= 6) {
      return {
        available: false,
        reason: 'MAX_DAILY_CAP_REACHED',
        normalizedDate: start.toISOString(),
        timeSlot: input.timeSlot,
        dailyGigsBooked: dailyCount,
        entityScope: scope ?? undefined,
        storageMode: 'PRIMARY_POSTGRES',
      };
    }

    if (input.timeSlot) {
      const conflictingProduction = activeProductions.find((prod) => {
        const meta =
          prod.metadata && typeof prod.metadata === 'object'
            ? (prod.metadata as Record<string, unknown>)
            : null;
        if (!meta) return true;
        const metaSlot = meta.timeSlot || meta.horaTramo;
        if (!metaSlot) return true;
        return metaSlot === input.timeSlot;
      });

      if (conflictingProduction) {
        return {
          available: false,
          reason: 'PRODUCTION_COLLISION',
          conflictingProductionId: conflictingProduction.id,
          normalizedDate: start.toISOString(),
          timeSlot: input.timeSlot,
          dailyGigsBooked: dailyCount,
          entityScope: scope ?? undefined,
          storageMode: 'PRIMARY_POSTGRES',
        };
      }
    } else if (activeProductions.length > 0) {
      return {
        available: false,
        reason: 'PRODUCTION_COLLISION',
        conflictingProductionId: activeProductions[0].id,
        normalizedDate: start.toISOString(),
        dailyGigsBooked: dailyCount,
        entityScope: scope ?? undefined,
        storageMode: 'PRIMARY_POSTGRES',
      };
    }

    return {
      available: true,
      reason: 'AVAILABLE',
      normalizedDate: start.toISOString(),
      timeSlot: input.timeSlot,
      dailyGigsBooked: dailyCount,
      entityScope: scope ?? undefined,
      storageMode: 'PRIMARY_POSTGRES',
    };
  } catch (error: unknown) {
    if (isDbConnectivityError(error)) {
      tripDbCircuit();
      return checkDateAvailabilityOffline(input, range, scope);
    }
    // Si no es un error de conectividad conocido, fallback resiliente para proteger la navegación
    console.warn('[atomicDateLockEngine:checkDateAvailability] Error de DB, activando fallback offline:', error);
    tripDbCircuit();
    return checkDateAvailabilityOffline(input, range, scope);
  }
}

// ============================================================================
// BLOQUEO ATÓMICO DE FECHAS (OFFLINE & PRISMA)
// ============================================================================

async function lockDateAtomicallyOffline(
  input: AtomicLockInput,
  range: { start: Date; end: Date; dateStr: string },
  scope: string | null
): Promise<AtomicLockResult> {
  return enqueueMutation(async (): Promise<AtomicLockResult> => {
    await loadStoreFromDisk();
    const { start, dateStr } = range;
    const normalizedEntitySlug = input.entitySlug?.trim().toLowerCase() ?? null;

    // 0. Idempotencia Stripe: si ya existe para esta sesión, devolver lock existente
    if (input.stripeSessionId) {
      const existingBySession = cache.data.productionEvents.find(
        (e) => e.status !== 'CANCELLED' && e.metadata?.stripeSessionId === input.stripeSessionId
      );
      if (existingBySession) {
        return {
          success: true,
          reason: 'LOCKED',
          productionId: existingBySession.id,
          lockId: existingBySession.id,
          priceLockSha256: existingBySession.metadata.priceLockSha256,
          storageMode: 'FALLBACK_OFFLINE_DISK',
          lockExpiresAt: existingBySession.metadata.lockExpiresAt ?? undefined,
        };
      }
    }

    // 1. Re-verificar disponibilidad offline
    const avail = await checkDateAvailabilityOffline(
      {
        eventDate: dateStr,
        artistProfileId: input.artistProfileId,
        entityKind: input.entityKind,
        entitySlug: input.entitySlug,
        timeSlot: input.timeSlot,
        excludeProductionId: input.productionEventId,
      },
      range,
      scope
    );

    if (!avail.available) {
      return {
        success: false,
        reason: avail.reason,
        blockId: avail.conflictingBlockId,
        productionId: avail.conflictingProductionId,
        storageMode: 'FALLBACK_OFFLINE_DISK',
      };
    }

    // 2. Materializar evento offline
    const prodId =
      input.productionEventId ||
      `offline_prod_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const priceLockSha256 =
      input.priceLockSha256 ||
      computePriceLockSha256({
        eventDate: dateStr,
        clientName: input.clientName,
        totalAmountEur: input.totalAmountEur,
        depositAmountEur: input.depositAmountEur,
        stripeSessionId: input.stripeSessionId,
        entitySlug: normalizedEntitySlug ?? undefined,
      });

    const nowIso = new Date().toISOString();
    const newEvent: OfflineProductionEvent = {
      id: prodId,
      title: `Reserva Tramo ${input.timeSlot || 'Día Completo'} - ${input.clientName || 'Cliente Directo'}`,
      eventDate: start.toISOString(),
      eventType: 'SOLISTA_S_CLASS',
      status: input.status || 'PAID_CONFIRMED',
      totalBudget: input.totalAmountEur ?? 350,
      clientEmail: input.clientEmail || null,
      clientName: input.clientName || 'Cliente EAR OS',
      clientPhone: input.clientPhone || null,
      location: input.location || 'Ubicación Confirmada Cliente',
      guestCount: 100,
      serviceLines: [],
      stakeholders: [],
      metadata: {
        timeSlot: input.timeSlot || null,
        horaTramo: input.timeSlot || null,
        bufferMinutes: input.bufferMinutes || 30,
        artistProfileId: input.artistProfileId || null,
        entityKind: input.entityKind || null,
        entitySlug: normalizedEntitySlug,
        entityScope: scope,
        stripeSessionId: input.stripeSessionId || null,
        priceLockSha256,
        lockedAt: nowIso,
        isOfflineFallback: true,
      },
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    cache.data.productionEvents.push(newEvent);
    cache.data.updatedAt = nowIso;
    await persistStoreToDisk();

    // 3. Sincronización con el almacén visual por entidad
    if (normalizedEntitySlug && input.timeSlot) {
      try {
        const rawKind = input.entityKind || 'artista';
        const kind: CalendarEntityKind = CALENDAR_ENTITY_KINDS.some((k) => k.kind === rawKind)
          ? (rawKind as CalendarEntityKind)
          : 'artista';
        await reserveEntitySlot(kind, normalizedEntitySlug, dateStr, input.timeSlot, input.clientName);
      } catch (syncErr) {
        console.warn('[atomicDateLockEngine] Sincronización con entity-calendar-store omitida:', syncErr);
      }
    }

    return {
      success: true,
      reason: 'LOCKED',
      productionId: prodId,
      lockId: prodId,
      priceLockSha256,
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  });
}

/**
 * Bloquea una fecha y franja horaria de forma ATÓMICA.
 * Opera con transacciones interactivas de PostgreSQL (Prisma ACID) o deriva al
 * motor offline serializado (`.data/offline-date-locks.json`) ante caída de DB.
 */
export async function lockDateAtomically(
  input: AtomicLockInput
): Promise<AtomicLockResult> {
  const rawDate = input.eventDate || input.date || '';
  const range = getDayRange(rawDate);
  if (!range) {
    return {
      success: false,
      reason: 'INVALID_DATE',
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  }

  const { start, end, dateStr } = range;
  const scope = entityScope(input);
  const normalizedEntitySlug = input.entitySlug?.trim().toLowerCase() ?? null;

  // ⚡ Fast-path si el circuit breaker está activo
  if (isDbCircuitOpen()) {
    return lockDateAtomicallyOffline(input, range, scope);
  }

  try {
    const lockResult = await prisma.$transaction(async (tx) => {
      // 0. Idempotencia Stripe
      if (input.stripeSessionId) {
        const existingBySession = await tx.productionEvent.findFirst({
          where: { metadata: { path: ['stripeSessionId'], equals: input.stripeSessionId } },
        });
        if (existingBySession) {
          const meta = existingBySession.metadata as Record<string, unknown> | null;
          return {
            success: true,
            reason: 'LOCKED',
            productionId: existingBySession.id,
            lockId: existingBySession.id,
            priceLockSha256: typeof meta?.priceLockSha256 === 'string' ? meta.priceLockSha256 : undefined,
            storageMode: 'PRIMARY_POSTGRES' as const,
          };
        }
      }

      // 1. Re-verificar calendarBlock
      const existingBlock = await tx.calendarBlock.findFirst({
        where: {
          date: { gte: start, lte: end },
          ...(input.artistProfileId ? { artistProfileId: input.artistProfileId } : {}),
        },
      });

      if (existingBlock) {
        return {
          success: false,
          reason: 'CALENDAR_BLOCKED',
          blockId: existingBlock.id,
          storageMode: 'PRIMARY_POSTGRES' as const,
        };
      }

      // 2. Re-verificar colisión en ProductionEvent
      const activeEvents = await tx.productionEvent.findMany({
        where: {
          eventDate: { gte: start, lte: end },
          status: { notIn: ['CANCELLED', 'DRAFT'] },
          ...(input.productionEventId ? { id: { not: input.productionEventId } } : {}),
          ...(normalizedEntitySlug
            ? { metadata: { path: ['entitySlug'], equals: normalizedEntitySlug } }
            : {}),
        },
      });

      if (activeEvents.length >= 6) {
        return {
          success: false,
          reason: 'MAX_DAILY_CAP_REACHED',
          storageMode: 'PRIMARY_POSTGRES' as const,
        };
      }

      if (input.timeSlot) {
        const slotCollision = activeEvents.find((e) => {
          const meta =
            e.metadata && typeof e.metadata === 'object' ? (e.metadata as Record<string, unknown>) : null;
          if (!meta) return true;
          const s = meta.timeSlot || meta.horaTramo;
          return !s || s === input.timeSlot;
        });

        if (slotCollision) {
          return {
            success: false,
            reason: 'PRODUCTION_COLLISION',
            productionId: slotCollision.id,
            storageMode: 'PRIMARY_POSTGRES' as const,
          };
        }
      } else if (activeEvents.length > 0) {
        return {
          success: false,
          reason: 'PRODUCTION_COLLISION',
          productionId: activeEvents[0].id,
          storageMode: 'PRIMARY_POSTGRES' as const,
        };
      }

      // 3. Crear ProductionEvent con metadata JSON segura
      const priceLockSha256 =
        input.priceLockSha256 ||
        computePriceLockSha256({
          eventDate: dateStr,
          clientName: input.clientName,
          totalAmountEur: input.totalAmountEur,
          depositAmountEur: input.depositAmountEur,
          stripeSessionId: input.stripeSessionId,
          entitySlug: normalizedEntitySlug ?? undefined,
        });

      const prod = await tx.productionEvent.create({
        data: {
          title: `Reserva Tramo ${input.timeSlot || 'Día Completo'} - ${input.clientName || 'Cliente Directo'}`,
          eventDate: start,
          location: input.location || 'Ubicación Confirmada Cliente',
          status: input.status || 'PAID_CONFIRMED',
          clientName: input.clientName || 'Cliente EAR OS',
          totalBudget: input.totalAmountEur ?? 350,
          metadata: {
            timeSlot: input.timeSlot || null,
            horaTramo: input.timeSlot || null,
            bufferMinutes: input.bufferMinutes || 30,
            artistProfileId: input.artistProfileId || null,
            entityKind: input.entityKind || null,
            entitySlug: normalizedEntitySlug,
            entityScope: scope,
            stripeSessionId: input.stripeSessionId || null,
            priceLockSha256,
            lockedAt: new Date().toISOString(),
          },
        },
      });

      return {
        success: true,
        reason: 'LOCKED',
        productionId: prod.id,
        lockId: prod.id,
        priceLockSha256,
        storageMode: 'PRIMARY_POSTGRES' as const,
      };
    });

    // Sincronización visual opcional en background
    if (lockResult.success && normalizedEntitySlug && input.timeSlot) {
      try {
        const rawKind = input.entityKind || 'artista';
        const kind: CalendarEntityKind = CALENDAR_ENTITY_KINDS.some((k) => k.kind === rawKind)
          ? (rawKind as CalendarEntityKind)
          : 'artista';
        await reserveEntitySlot(kind, normalizedEntitySlug, dateStr, input.timeSlot, input.clientName);
      } catch (syncErr) {
        console.warn('[atomicDateLockEngine] Sincronización de slot omitida:', syncErr);
      }
    }

    return lockResult;
  } catch (error: unknown) {
    if (isDbConnectivityError(error)) {
      tripDbCircuit();
      return lockDateAtomicallyOffline(input, range, scope);
    }
    console.warn('[atomicDateLockEngine:lockDateAtomically] Error de DB, activando fallback offline:', error);
    tripDbCircuit();
    return lockDateAtomicallyOffline(input, range, scope);
  }
}

// ============================================================================
// DESBLOQUEO ATÓMICO DE FECHAS
// ============================================================================

export async function unlockDateAtomically(
  input: AtomicUnlockInput
): Promise<AtomicUnlockResult> {
  const normalizedEntitySlug = input.entitySlug?.trim().toLowerCase();
  const rawDate = input.eventDate || input.date;
  const range = rawDate ? getDayRange(rawDate) : null;

  // Intento en PostgreSQL si el circuit breaker está cerrado
  if (!isDbCircuitOpen()) {
    try {
      let releasedId: string | undefined;

      if (input.lockId || input.productionId) {
        const targetId = input.lockId || input.productionId;
        const updated = await prisma.productionEvent.updateMany({
          where: { id: targetId },
          data: { status: 'CANCELLED' },
        });
        if (updated.count > 0) releasedId = targetId;
      } else if (input.stripeSessionId) {
        const found = await prisma.productionEvent.findFirst({
          where: { metadata: { path: ['stripeSessionId'], equals: input.stripeSessionId } },
        });
        if (found) {
          await prisma.productionEvent.update({
            where: { id: found.id },
            data: { status: 'CANCELLED' },
          });
          releasedId = found.id;
        }
      }

      if (range) {
        await prisma.calendarBlock.deleteMany({
          where: {
            date: { gte: range.start, lte: range.end },
            ...(input.artistProfileId ? { artistProfileId: input.artistProfileId } : {}),
          },
        });
      }

      if (normalizedEntitySlug && input.timeSlot && rawDate) {
        try {
          const rawKind = input.entityKind || 'artista';
          const kind: CalendarEntityKind = CALENDAR_ENTITY_KINDS.some((k) => k.kind === rawKind)
            ? (rawKind as CalendarEntityKind)
            : 'artista';
          await releaseEntitySlot(kind, normalizedEntitySlug, rawDate.slice(0, 10), input.timeSlot);
        } catch (syncErr) {
          console.warn('[atomicDateLockEngine] Fallo al liberar slot visual:', syncErr);
        }
      }

      return {
        success: true,
        reason: 'UNLOCKED',
        releasedLockId: releasedId,
        storageMode: 'PRIMARY_POSTGRES',
      };
    } catch (err: unknown) {
      if (isDbConnectivityError(err)) {
        tripDbCircuit();
      }
    }
  }

  // Fallback offline garantizado
  return enqueueMutation(async (): Promise<AtomicUnlockResult> => {
    await loadStoreFromDisk();
    let releasedId: string | undefined;

    for (const prod of cache.data.productionEvents) {
      const matchId =
        (input.lockId && prod.id === input.lockId) ||
        (input.productionId && prod.id === input.productionId);
      const matchSession =
        input.stripeSessionId && prod.metadata?.stripeSessionId === input.stripeSessionId;
      const matchDate =
        range && prod.eventDate.slice(0, 10) === range.dateStr &&
        (!normalizedEntitySlug || prod.metadata?.entitySlug === normalizedEntitySlug);

      if (matchId || matchSession || matchDate) {
        prod.status = 'CANCELLED';
        prod.updatedAt = new Date().toISOString();
        releasedId = prod.id;
      }
    }

    if (range) {
      cache.data.calendarBlocks = cache.data.calendarBlocks.filter((b) => {
        if (input.artistProfileId && b.artistProfileId !== input.artistProfileId) return true;
        return b.date.slice(0, 10) !== range.dateStr;
      });
    }

    cache.data.updatedAt = new Date().toISOString();
    await persistStoreToDisk();

    if (normalizedEntitySlug && input.timeSlot && rawDate) {
      try {
        const rawKind = input.entityKind || 'artista';
        const kind: CalendarEntityKind = CALENDAR_ENTITY_KINDS.some((k) => k.kind === rawKind)
          ? (rawKind as CalendarEntityKind)
          : 'artista';
        await releaseEntitySlot(kind, normalizedEntitySlug, rawDate.slice(0, 10), input.timeSlot);
      } catch (syncErr) {
        console.warn('[atomicDateLockEngine] Fallo al liberar slot offline visual:', syncErr);
      }
    }

    return {
      success: true,
      reason: 'UNLOCKED',
      releasedLockId: releasedId,
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  });
}

// ============================================================================
// LIBERACIÓN DE BLOQUEOS PENDIENTES OBSOLETOS (STALE LOCKS)
// ============================================================================

export async function releaseStalePendingLocks(
  ttlMinutes = 30
): Promise<ReleaseStaleLocksResult> {
  const cutoff = new Date(Date.now() - ttlMinutes * 60 * 1000);

  if (!isDbCircuitOpen()) {
    try {
      const res = await prisma.productionEvent.updateMany({
        where: {
          status: 'PENDING_DEPOSIT',
          createdAt: { lt: cutoff },
        },
        data: { status: 'CANCELLED' },
      });

      return {
        success: true,
        releasedCount: res.count,
        reason: 'STALE_LOCKS_RELEASED',
        storageMode: 'PRIMARY_POSTGRES',
      };
    } catch (err: unknown) {
      if (isDbConnectivityError(err)) {
        tripDbCircuit();
      }
    }
  }

  // Fallback offline
  return enqueueMutation(async (): Promise<ReleaseStaleLocksResult> => {
    await loadStoreFromDisk();
    let releasedCount = 0;
    const now = Date.now();

    for (const prod of cache.data.productionEvents) {
      if (prod.status === 'PENDING_DEPOSIT') {
        const createdMs = new Date(prod.createdAt).getTime();
        const expiresMs = prod.metadata?.lockExpiresAt
          ? new Date(prod.metadata.lockExpiresAt).getTime()
          : null;

        const isStale = (now - createdMs > ttlMinutes * 60 * 1000) || (expiresMs !== null && now > expiresMs);
        if (isStale) {
          prod.status = 'CANCELLED';
          prod.updatedAt = new Date().toISOString();
          releasedCount += 1;
        }
      }
    }

    if (releasedCount > 0) {
      cache.data.updatedAt = new Date().toISOString();
      await persistStoreToDisk();
    }

    return {
      success: true,
      releasedCount,
      reason: 'STALE_LOCKS_RELEASED',
      storageMode: 'FALLBACK_OFFLINE_DISK',
    };
  });
}
