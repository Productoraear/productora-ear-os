import { NextResponse } from 'next/server';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Telemetría real de pings GPS para seguimiento "Día D".
 *
 * v1 en memoria del proceso; persistencia PostgreSQL en Wave 27.
 * Sustituye los datos simulados (setInterval + generación aleatoria de SPL)
 * que antes alimentaban LiveFleetTracker. Este backend es la fuente de verdad;
 * la UI se conecta a él en la tarea W26_T03.
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
const MAX_PINGS_PER_ID = 200;
const LIVE_WINDOW_MS = 120_000;

type TelemetryStore = {
  __earTelemetry?: Map<string, TelemetryPing[]>;
};

function getStore(): Map<string, TelemetryPing[]> {
  const store = globalThis as unknown as TelemetryStore;
  if (!store.__earTelemetry) {
    store.__earTelemetry = new Map<string, TelemetryPing[]>();
  }
  return store.__earTelemetry;
}

function getPings(id: string): TelemetryPing[] {
  return getStore().get(id) ?? [];
}

function appendPing(id: string, ping: TelemetryPing): TelemetryPing[] {
  const store = getStore();
  const pings = store.get(id) ?? [];
  pings.push(ping);
  // Mantener solo los últimos N pings para no crecer sin límite en memoria.
  if (pings.length > MAX_PINGS_PER_ID) {
    pings.splice(0, pings.length - MAX_PINGS_PER_ID);
  }
  store.set(id, pings);
  return pings;
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

  const previous = getPings(id);
  const hadEnRuta = previous.some((p) => p.status === 'EN_RUTA');

  const pings = appendPing(id, ping);

  // Disparo a n8n: primer ping EN_RUTA y cualquier FINALIZADO.
  if (ping.status === 'FINALIZADO' || (ping.status === 'EN_RUTA' && !hadEnRuta)) {
    fireAndForgetN8n('call-center-intake', { kind: 'telemetry', id, status: ping.status });
  }

  return NextResponse.json(
    { id, ok: true, count: pings.length, status: ping.status },
    { status: 202 },
  );
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

  const pings = getPings(id);
  const last: TelemetryPing | null = pings.length > 0 ? (pings[pings.length - 1] ?? null) : null;

  return NextResponse.json({
    id,
    last,
    count: pings.length,
    live: isLive(last),
  });
}
