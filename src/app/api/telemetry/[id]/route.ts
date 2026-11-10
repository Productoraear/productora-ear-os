import { NextResponse } from 'next/server';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Telemetría real de pings GPS para seguimiento "Día D".
 *
 * F-6 (persistencia durable): la fuente de verdad es PostgreSQL 16
 * (`LiveTelemetryPing`). Un redeploy de Coolify ya NO vacía el rastro GPS.
 *
 * Contrato de honestidad (AGENTS.md AF-1 / INV-16): toda respuesta declara
 * `probed`, `source`, `mode` y `checkedAt`. Nunca "verde por defecto": si
 * PostgreSQL no responde se sirve la caché de proceso y se declara
 * `source:"static"` + `mode:"SIMULADO"` + `persisted:false` con el error real
 * (SIN_CONFIRMAR, AF-3).
 *
 * AF-1 fija el vocabulario cerrado `source:"live"|"static"`. La respuesta de
 * contingencia llegó a publicar `source:"cache"` (valor fuera del contrato,
 * medido el 2026-11-10 sobre `/api/telemetry/EXP-VERIFY-F6`): se corrige a
 * `"static"` porque es lectura estática de la caché de proceso, no base de datos.
 */

type TelemetryStatus =
  | 'EN_RUTA'
  | 'EN_RECINTO'
  | 'MONTAJE'
  | 'LISTO'
  | 'EN_VIVO'
  | 'FINALIZADO';

const TELEMETRY_STATUSES: readonly TelemetryStatus[] = [
  'EN_RUTA',
  'EN_RECINTO',
  'MONTAJE',
  'LISTO',
  'EN_VIVO',
  'FINALIZADO',
];

type TelemetryPing = {
  lat: number;
  lng: number;
  accuracy: number;
  status: TelemetryStatus;
  at: string;
};

const ID_PATTERN = /^[A-Z0-9-]{4,40}$/;
const LIVE_WINDOW_MS = 120_000;
/** Ventana de lectura devuelta al cliente (traza reciente suficiente). */
const READ_LIMIT = 200;
/** Poda de retención: la tabla no crece indefinidamente. */
const RETENTION_DAYS = 30;

type TelemetryStore = {
  __earTelemetry?: Map<string, TelemetryPing[]>;
};

/**
 * Caché de proceso: NO es fuente de verdad. Sólo actúa como contingencia si
 * PostgreSQL cae durante el evento, para no dejar la UI en "Sin señal aún".
 * Se publica como `source:"static"` (AF-1), jamás como `"live"`.
 */
function getCache(): Map<string, TelemetryPing[]> {
  const store = globalThis as unknown as TelemetryStore;
  if (!store.__earTelemetry) {
    store.__earTelemetry = new Map<string, TelemetryPing[]>();
  }
  return store.__earTelemetry;
}

function cachePing(id: string, ping: TelemetryPing): void {
  const cache = getCache();
  const pings = cache.get(id) ?? [];
  pings.push(ping);
  if (pings.length > READ_LIMIT) {
    pings.splice(0, pings.length - READ_LIMIT);
  }
  cache.set(id, pings);
}

function cacheRead(id: string): TelemetryPing[] {
  return getCache().get(id) ?? [];
}


function isTelemetryStatus(value: unknown): value is TelemetryStatus {
  return typeof value === 'string' && (TELEMETRY_STATUSES as readonly string[]).includes(value);
}

function parsePing(raw: unknown): TelemetryPing | null {
  if (typeof raw !== 'object' || raw === null) {
    return null;
  }
  const body = raw as Record<string, unknown>;

  const { lat, lng, accuracy, status, at } = body;

  if (typeof lat !== 'number' || !Number.isFinite(lat) || lat < -90 || lat > 90) {
    return null;
  }
  if (typeof lng !== 'number' || !Number.isFinite(lng) || lng < -180 || lng > 180) {
    return null;
  }
  if (typeof accuracy !== 'number' || !Number.isFinite(accuracy) || accuracy < 0) {
    return null;
  }
  if (!isTelemetryStatus(status)) {
    return null;
  }

  const atValue = typeof at === 'string' && at.trim().length > 0 ? at : new Date().toISOString();

  return { lat, lng, accuracy, status, at: atValue };
}

function isLive(last: TelemetryPing | null): boolean {
  if (last === null) {
    return false;
  }
  const ts = new Date(last.at).getTime();
  if (!Number.isFinite(ts)) {
    return false;
  }
  return Date.now() - ts < LIVE_WINDOW_MS;
}

/** Convierte una fila persistida al contrato público de ping. */
function rowToPing(row: {
  lat: number;
  lng: number;
  accuracy: number;
  status: string;
  capturedAt: Date;
}): TelemetryPing {
  return {
    lat: row.lat,
    lng: row.lng,
    accuracy: row.accuracy,
    status: isTelemetryStatus(row.status) ? row.status : 'EN_RUTA',
    at: row.capturedAt.toISOString(),
  };
}

function describeError(reason: unknown): string {
  if (reason instanceof Error) {
    return reason.message.slice(0, 180);
  }
  return String(reason).slice(0, 180);
}


export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!ID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  const token = process.env.TELEMETRY_PROVIDER_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'telemetry_disabled' }, { status: 503 });
  }

  const providedToken = req.headers.get('x-ear-provider-token');
  if (!providedToken || providedToken !== token) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 422 });
  }

  const ping = parsePing(raw);
  if (ping === null) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 422 });
  }

  const parsedCapturedAt = new Date(ping.at);
  const capturedAt = Number.isFinite(parsedCapturedAt.getTime()) ? parsedCapturedAt : new Date();

  // ¿Había ya un ping EN_RUTA? Se consulta ANTES de insertar (aviso n8n idempotente).
  let hadEnRuta = false;
  try {
    const previous = await prisma.liveTelemetryPing.findFirst({
      where: { missionId: id, status: 'EN_RUTA' },
      select: { id: true },
    });
    hadEnRuta = previous !== null;
  } catch (reason) {
    console.error(`[telemetry] Pre-lectura fallida para ${id}: ${describeError(reason)}`);
  }

  try {
    await prisma.liveTelemetryPing.create({
      data: {
        missionId: id,
        lat: ping.lat,
        lng: ping.lng,
        accuracy: ping.accuracy,
        status: ping.status,
        source: 'live',
        capturedAt,
      },
      select: { id: true },
    });

    const total = await prisma.liveTelemetryPing.count({ where: { missionId: id } });

    // Caché de contingencia alineada con la verdad persistida.
    cachePing(id, ping);

    // Disparo a n8n: primer ping EN_RUTA y cualquier FINALIZADO.
    if (ping.status === 'FINALIZADO' || (ping.status === 'EN_RUTA' && !hadEnRuta)) {
      fireAndForgetN8n('call-center-intake', { kind: 'telemetry', id, status: ping.status });
    }

    // Poda de retención (best-effort: nunca bloquea la respuesta al proveedor).
    void prisma.liveTelemetryPing
      .deleteMany({
        where: {
          capturedAt: { lt: new Date(Date.now() - RETENTION_DAYS * 86_400_000) },
        },
      })
      .catch(() => undefined);

    return NextResponse.json(
      {
        id,
        ok: true,
        count: total,
        status: ping.status,
        persisted: true,
        probed: true,
        source: 'live',
        mode: 'REAL',
        checkedAt: new Date().toISOString(),
      },
      { status: 202 },
    );
  } catch (reason) {
    const lastError = describeError(reason);
    console.error(`[telemetry] Persistencia fallida para ${id}: ${lastError}`);

    // Contingencia: el ping no se pierde, pero se declara SIN_CONFIRMAR (AF-3).
    cachePing(id, ping);
    const cached = cacheRead(id);

    return NextResponse.json(
      {
        id,
        ok: false,
        persisted: false,
        count: cached.length,
        status: ping.status,
        probed: true,
        source: 'static',
        mode: 'SIMULADO',
        disclaimer:
          'Ping aceptado en caché de proceso: PostgreSQL no confirmó la escritura. Estado SIN_CONFIRMAR (AGENTS.md AF-3).',
        lastError,
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  if (!ID_PATTERN.test(id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 });
  }

  const checkedAt = new Date().toISOString();

  try {
    const [rows, count] = await prisma.$transaction([
      prisma.liveTelemetryPing.findMany({
        where: { missionId: id },
        orderBy: { capturedAt: 'desc' },
        take: READ_LIMIT,
        select: { lat: true, lng: true, accuracy: true, status: true, capturedAt: true },
      }),
      prisma.liveTelemetryPing.count({ where: { missionId: id } }),
    ]);

    const firstRow = rows.at(0);
    const last: TelemetryPing | null = firstRow === undefined ? null : rowToPing(firstRow);

    return NextResponse.json({
      id,
      last,
      count,
      live: isLive(last),
      persisted: true,
      probed: true,
      source: 'live',
      mode: 'REAL',
      checkedAt,
    });
  } catch (reason) {
    const lastError = describeError(reason);
    console.error(`[telemetry] Lectura persistida fallida para ${id}: ${lastError}`);

    const cached = cacheRead(id);
    const last: TelemetryPing | null = cached.at(-1) ?? null;

    return NextResponse.json({
      id,
      last,
      count: cached.length,
      live: isLive(last),
      persisted: false,
      probed: true,
      source: 'static',
      mode: 'SIMULADO',
      disclaimer:
        'PostgreSQL no respondió: se sirve la caché de proceso. Estado SIN_CONFIRMAR (AGENTS.md AF-3).',
      lastError,
      checkedAt,
    });
  }
}

