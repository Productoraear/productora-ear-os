/**
 * ════════════════════════════════════════════════════════════════════════════
 * CAREER OS · HELPERS TIPADOS SOBRE PRISMA (W53_T01)
 * ════════════════════════════════════════════════════════════════════════════
 * Contrato de datos del Career Manifest. Reglas NO negociables de este módulo:
 *
 *   1. ANCLAJE ÚNICO: la identidad del artista vive en `artistProfile` (tabla
 *      física "artistProfile"). `ArtistProfile` (@@map "career_artist_profile")
 *      es la extensión 1:1 y su PK es el id de `artistProfile`. Nunca se crea
 *      una tercera tabla de identidad.
 *   2. DINERO EN CÉNTIMOS ENTEROS: todo importe es `Int` de céntimos.
 *      Prohibido Float para divisa, prohibido redondear en cliente.
 *   3. PLATAFORMAS: `platformId` procede de src/lib/career/platform-registry.ts
 *      (SSOT). Este módulo valida contra el registro y NO inventa plataformas.
 *   4. ESTADO HONESTO (AF-2): sin OAuth real la fuente declarada es "demo" o
 *      "manual". `status: "live"` exige credencial cifrada guardada.
 *   5. CONSULTA QUIRÚRGICA (INV-20): todos los `select` son explícitos.
 *   6. CERO `any`: el módulo compila con `strict: true` y tipos derivados.
 *
 * Server-only: importa PrismaClient a través del singleton `src/lib/prisma.ts`.
 * Ningún componente `"use client"` debe importar este fichero (INV-07).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

import {
  getPlatform,
  type ConnectionStatus,
  type MetricKey,
  type MetricPoint,
  type SyncMode,
} from '@/lib/career/platform-registry';

// ── Tipos públicos del dominio Career ───────────────────────────────────────

/** Fuente declarada de una métrica. Refleja `CareerMetricSource` del schema. */
export type CareerMetricSource = 'api' | 'csv' | 'manual' | 'demo';

/** Fila mínima de conexión lista para el panel (sin secretos). */
export interface CareerConnectionView {
  readonly id: string;
  readonly platformId: string;
  readonly platformLabel: string;
  readonly syncMode: SyncMode | 'unknown';
  readonly status: ConnectionStatus;
  readonly lastSyncAt: string | null;
  readonly error: string | null;
  /** true solo cuando existe token OAuth cifrado guardado. */
  readonly hasCredential: boolean;
}

/** Serie temporal normalizada de una métrica. */
export interface CareerMetricSeriesPoint {
  readonly metric: MetricKey;
  readonly value: number;
  readonly capturedAt: string;
  readonly source: CareerMetricSource;
}

/** Error de contrato de datos. Se lanza antes de tocar la base de datos. */
export class CareerDataContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CareerDataContractError';
  }
}

// ── Guardas de contrato ─────────────────────────────────────────────────────

function assertPlatformId(platformId: string): void {
  if (getPlatform(platformId) === undefined) {
    throw new CareerDataContractError(
      `platformId "${platformId}" no existe en platform-registry.ts. Prohibido inventar plataformas.`,
    );
  }
}

/** Convierte euros a céntimos enteros rechazando precisión superior al céntimo. */
export function eurosToCents(euros: number): number {
  if (!Number.isFinite(euros) || euros < 0) {
    throw new CareerDataContractError(`Importe euros inválido: ${String(euros)}`);
  }
  const cents = Math.round(euros * 100);
  if (Math.abs(euros * 100 - cents) > 1e-6) {
    throw new CareerDataContractError(
      `Importe con fracción de céntimo: ${euros}. El SSOT trabaja con céntimos enteros.`,
    );
  }
  return cents;
}

/** Serializa céntimos a formato monetario determinista (sin Intl en servidor). */
export function formatCents(cents: number): string {
  const sign = cents < 0 ? '-' : '';
  const abs = Math.abs(Math.trunc(cents));
  const units = Math.floor(abs / 100);
  const decimals = abs % 100;
  return `${sign}${units},${decimals.toString().padStart(2, '0')} €`;
}

// ── Proyecciones (select explícito, cero payload bloat) ─────────────────────

const connectionSelect = {
  id: true,
  platformId: true,
  status: true,
  encryptedToken: true,
  lastSyncAt: true,
  error: true,
} satisfies Prisma.PlatformConnectionSelect;

const metricSelect = {
  metric: true,
  value: true,
  capturedAt: true,
  source: true,
} satisfies Prisma.MetricSnapshotSelect;

const gigSelect = {
  id: true,
  venue: true,
  city: true,
  eventDate: true,
  status: true,
  feeCents: true,
  depositCents: true,
} satisfies Prisma.GigSelect;

function toConnectionView(
  row: Prisma.PlatformConnectionGetPayload<{ select: typeof connectionSelect }>,
): CareerConnectionView {
  const def = getPlatform(row.platformId);
  return {
    id: row.id,
    platformId: row.platformId,
    platformLabel: def?.label ?? row.platformId,
    syncMode: def?.syncMode ?? 'unknown',
    status: row.status as ConnectionStatus,
    lastSyncAt: row.lastSyncAt === null ? null : row.lastSyncAt.toISOString(),
    error: row.error,
    hasCredential: row.encryptedToken !== null,
  };
}

/**
 * Lista las conexiones de plataforma de un artista SIN exponer tokens.
 * Una fila fuera del registry se reporta con `platformLabel = platformId` y
 * `syncMode = "unknown"` (no se inventa etiqueta comercial).
 */
export async function listConnections(artistId: string): Promise<CareerConnectionView[]> {
  const rows = await prisma.platformConnection.findMany({
    where: { artistId },
    select: connectionSelect,
    orderBy: { platformId: 'asc' },
  });
  return rows.map(toConnectionView);
}

/**
 * Alta o actualización idempotente de una conexión (1 fila por artista+plataforma).
 * `status: "live"` exige credencial cifrada: sin token no se finge conexión real.
 */
export async function upsertConnection(input: {
  readonly artistId: string;
  readonly platformId: string;
  readonly status: ConnectionStatus;
  readonly encryptedToken?: string | null;
  readonly error?: string | null;
  readonly lastSyncAt?: Date | null;
}): Promise<CareerConnectionView> {
  assertPlatformId(input.platformId);
  const encryptedToken = input.encryptedToken ?? null;
  if (input.status === 'live' && encryptedToken === null) {
    throw new CareerDataContractError(
      `Conexión "${input.platformId}" marcada live sin credencial cifrada: es una fachada (AF-2).`,
    );
  }
  const row = await prisma.platformConnection.upsert({
    where: {
      uniq_connection_artist_platform: {
        artistId: input.artistId,
        platformId: input.platformId,
      },
    },
    create: {
      artistId: input.artistId,
      platformId: input.platformId,
      status: input.status,
      encryptedToken,
      error: input.error ?? null,
      lastSyncAt: input.lastSyncAt ?? null,
    },
    update: {
      status: input.status,
      encryptedToken,
      error: input.error ?? null,
      lastSyncAt: input.lastSyncAt ?? null,
    },
    select: connectionSelect,
  });
  return toConnectionView(row);
}

/**
 * Ingesta de un lote de `MetricPoint` del registry. Valida contra el SSOT de
 * plataformas y métricas: un `metric` que la plataforma no declara se rechaza.
 * La serie es append-only por `capturedAt` (histórico de métricas, no estado).
 */
export async function ingestMetricPoints(
  points: readonly MetricPoint[],
): Promise<{ readonly inserted: number }> {
  if (points.length === 0) return { inserted: 0 };
  for (const point of points) {
    const def = getPlatform(point.platformId);
    if (def === undefined) {
      throw new CareerDataContractError(
        `MetricPoint con platformId "${point.platformId}" fuera del registry.`,
      );
    }
    if (!def.metrics.includes(point.metric)) {
      throw new CareerDataContractError(
        `La plataforma "${point.platformId}" no declara la métrica "${point.metric}".`,
      );
    }
    if (!Number.isInteger(point.value)) {
      throw new CareerDataContractError(
        `MetricPoint.value debe ser entero (dinero en céntimos): recibido ${point.value}.`,
      );
    }
  }
  const created = await prisma.metricSnapshot.createMany({
    data: points.map((point) => ({
      artistId: point.artistId,
      platformId: point.platformId,
      metric: point.metric,
      value: point.value,
      capturedAt: new Date(point.capturedAt),
      source: point.source satisfies CareerMetricSource,
    })),
  });
  return { inserted: created.count };
}

/**
 * Serie temporal de una métrica concreta (últimas `limit` capturas, más reciente
 * primero). Devuelve `[]` si no hay datos: 0 filas no es un dato inventado.
 */
export async function getMetricSeries(input: {
  readonly artistId: string;
  readonly platformId: string;
  readonly metric: MetricKey;
  readonly limit?: number;
}): Promise<CareerMetricSeriesPoint[]> {
  assertPlatformId(input.platformId);
  const rows = await prisma.metricSnapshot.findMany({
    where: {
      artistId: input.artistId,
      platformId: input.platformId,
      metric: input.metric,
    },
    select: metricSelect,
    orderBy: { capturedAt: 'desc' },
    take: Math.min(Math.max(input.limit ?? 90, 1), 365),
  });
  return rows.map((row) => ({
    metric: row.metric as MetricKey,
    value: row.value,
    capturedAt: row.capturedAt.toISOString(),
    source: row.source as CareerMetricSource,
  }));
}

/**
 * Próximos bolos en cartera o confirmados, en céntimos enteros.
 * El depósito viaja como dato deducible: no resta del caché (INV-03).
 */
export async function listUpcomingGigs(input: {
  readonly artistId: string;
  readonly from?: Date;
  readonly limit?: number;
}): Promise<
  readonly {
    id: string;
    venue: string;
    city: string | null;
    eventDate: string;
    status: string;
    feeCents: number;
    depositCents: number;
  }[]
> {
  const rows = await prisma.gig.findMany({
    where: {
      artistId: input.artistId,
      eventDate: { gte: input.from ?? new Date() },
      status: { in: ['HOLD', 'CONFIRMED'] },
    },
    select: gigSelect,
    orderBy: { eventDate: 'asc' },
    take: Math.min(Math.max(input.limit ?? 20, 1), 100),
  });
  return rows.map((row) => ({
    id: row.id,
    venue: row.venue,
    city: row.city,
    eventDate: row.eventDate.toISOString(),
    status: row.status,
    feeCents: row.feeCents,
    depositCents: row.depositCents,
  }));
}

/**
 * Cabecera del panel de carrera. Ancla en `artistProfile` (SSOT) y lee la
 * extensión `careerProfile` en la MISMA consulta (sin N+1 ni segunda identidad).
 */
export async function getCareerHeader(artistId: string): Promise<{
  readonly artistId: string;
  readonly stageName: string | null;
  readonly displayName: string | null;
  readonly careerTerritory: string | null;
  readonly baseFeeCents: number | null;
  readonly connections: number;
  readonly releases: number;
} | null> {
  const row = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    select: {
      id: true,
      stageName: true,
      displayName: true,
      careerProfile: { select: { territory: true, baseFeeCents: true } },
      _count: { select: { platformLinks: true, releases: true } },
    },
  });
  if (row === null) return null;
  return {
    artistId: row.id,
    stageName: row.stageName,
    displayName: row.displayName,
    careerTerritory: row.careerProfile?.territory ?? null,
    baseFeeCents: row.careerProfile?.baseFeeCents ?? null,
    connections: row._count.platformLinks,
    releases: row._count.releases,
  };
}

/**
 * Reparto Soberano 80/10/10 en céntimos enteros, sin errores de redondeo:
 * el residuo de la división entera se asigna al artista (nunca se pierde dinero).
 */
export function splitSovereignCents(grossCents: number): {
  readonly artistCents: number;
  readonly platformCents: number;
  readonly vimumeCents: number;
} {
  if (!Number.isInteger(grossCents) || grossCents < 0) {
    throw new CareerDataContractError(`grossCents debe ser entero >= 0: ${grossCents}`);
  }
  const platformCents = Math.floor(grossCents / 10);
  const vimumeCents = Math.floor(grossCents / 10);
  const artistCents = grossCents - platformCents - vimumeCents;
  return { artistCents, platformCents, vimumeCents };
}

export { prisma };

