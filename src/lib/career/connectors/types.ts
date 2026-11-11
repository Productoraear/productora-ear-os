import { z } from 'zod';

import {
  METRIC_KEYS,
  getPlatform,
  type MetricPoint,
  type SyncMode,
} from '@/lib/career/platform-registry';

// ── Errores tipados del dominio de sincronización ───────────────────────────

export type ConnectorErrorCode =
  | 'RATE_LIMITED'
  | 'TRANSIENT'
  | 'UNAUTHORIZED'
  | 'INVALID_PAYLOAD'
  | 'TIMEOUT'
  | 'NOT_IMPLEMENTED';

export class ConnectorError extends Error {
  readonly code: ConnectorErrorCode;
  readonly httpStatus: number | null;
  /** `Retry-After` (RFC 9110) en milisegundos. null = el proveedor no lo declaró. */
  readonly retryAfterMs: number | null;
  readonly platformId: string;
  readonly retryable: boolean;

  constructor(input: {
    readonly code: ConnectorErrorCode;
    readonly message: string;
    readonly platformId: string;
    readonly httpStatus?: number | null;
    readonly retryAfterMs?: number | null;
    readonly retryable: boolean;
  }) {
    super(input.message);
    this.name = 'ConnectorError';
    this.code = input.code;
    this.platformId = input.platformId;
    this.httpStatus = input.httpStatus ?? null;
    this.retryAfterMs = input.retryAfterMs ?? null;
    this.retryable = input.retryable;
  }
}

/**
 * Clasifica un status HTTP externo SIN creer al proveedor a ciegas:
 *   429 → RATE_LIMITED (reintentable, respeta Retry-After)
 *   5xx → TRANSIENT
 *   401/403 → UNAUTHORIZED (NO reintentable: el token está muerto, reintentar quema cuota)
 *   4xx restante → INVALID_PAYLOAD (NO reintentable)
 */
export function classifyHttpStatus(platformId: string, httpStatus: number, retryAfterMs: number | null): ConnectorError {
  if (httpStatus === 429) {
    return new ConnectorError({
      code: 'RATE_LIMITED',
      message: `HTTP 429 en "${platformId}": rate limit del proveedor.`,
      platformId,
      httpStatus,
      retryAfterMs,
      retryable: true,
    });
  }
  if (httpStatus >= 500) {
    return new ConnectorError({
      code: 'TRANSIENT',
      message: `HTTP ${httpStatus} en "${platformId}": fallo transitorio del proveedor.`,
      platformId,
      httpStatus,
      retryAfterMs,
      retryable: true,
    });
  }
  if (httpStatus === 401 || httpStatus === 403) {
    return new ConnectorError({
      code: 'UNAUTHORIZED',
      message: `HTTP ${httpStatus} en "${platformId}": credencial rechazada.`,
      platformId,
      httpStatus,
      retryAfterMs,
      retryable: false,
    });
  }
  return new ConnectorError({
    code: 'INVALID_PAYLOAD',
    message: `HTTP ${httpStatus} en "${platformId}": respuesta no procesable.`,
    platformId,
    httpStatus,
    retryAfterMs,
    retryable: false,
  });
}

// ── Contrato de conector ────────────────────────────────────────────────────

/**
 * Credencial ya descifrada por el orchestrator antes de invocar al conector.
 * El conector NO descifra: recibe texto plano y muere al terminar la llamada.
 * Ningún conector debe loguear este objeto (INV-14).
 */
export interface ConnectorCredential {
  readonly accessToken: string;
  readonly refreshToken: string | null;
  readonly expiresAt: string | null;
}

/** Vista de la conexión que el conector recibe (sin secretos persistidos). */
export interface ConnectorConnectionView {
  readonly connectionId: string;
  readonly artistId: string;
  readonly platformId: string;
}

/** Entrada de `fetchMetrics`: desde cuándo y con qué credencial. */
export interface ConnectorPullInput {
  readonly connection: ConnectorConnectionView;
  readonly credential: ConnectorCredential;
  /** ISO-8601. null = primera sincronización (rango completo). */
  readonly since: string | null;
  /** Deadline absoluto del intento. El conector lo aplica a su `AbortSignal`. */
  readonly deadline: Date;
}

/**
 * Contrato único que todo conector de plataforma debe satisfacer.
 * `platformId` DEBE existir en src/lib/career/platform-registry.ts (SSOT).
 * Cualquier `fetch` externo del conector va con `AbortSignal.timeout(8000)` (INV-17).
 */
export interface Connector {
  readonly platformId: string;
  authUrl(state: string): string;
  exchangeCode(code: string): Promise<ConnectorCredential>;
  refresh(connection: ConnectorConnectionView, credential: ConnectorCredential): Promise<ConnectorCredential>;
  fetchMetrics(input: ConnectorPullInput): Promise<readonly MetricPoint[]>;
}

// ── Registro de conectores (cerrado: nada fuera del SSOT) ───────────────────

const CONNECTORS = new Map<string, Connector>();

/**
 * Registra un conector. Rechaza ids que no existen en el SSOT de plataformas:
 * un conector inventado es una fachada (AF-2) y aquí muere antes de persistir.
 */
export function registerConnector(connector: Connector): void {
  if (getPlatform(connector.platformId) === undefined) {
    throw new ConnectorError({
      code: 'NOT_IMPLEMENTED',
      message: `platformId "${connector.platformId}" no existe en platform-registry.ts. Prohibido inventar plataformas.`,
      platformId: connector.platformId,
      retryable: false,
    });
  }
  if (CONNECTORS.has(connector.platformId)) {
    throw new ConnectorError({
      code: 'NOT_IMPLEMENTED',
      message: `Conector duplicado para "${connector.platformId}": el registro es único por plataforma.`,
      platformId: connector.platformId,
      retryable: false,
    });
  }
  CONNECTORS.set(connector.platformId, connector);
}

/** Devuelve el conector registrado o null (la sincronización lo trata como skip honesto). */
export function resolveConnector(platformId: string): Connector | null {
  return CONNECTORS.get(platformId) ?? null;
}

/** Ids con conector real disponible, para el panel de conexiones. */
export function listRegisteredConnectorIds(): readonly string[] {
  return [...CONNECTORS.keys()].sort();
}

/** Vacía el registro (solo pruebas: aísla cada caso sin estado residual). */
export function clearConnectorRegistry(): void {
  CONNECTORS.clear();
}

// ── Reintentos con jitter (backoff exponencial acotado) ─────────────────────

export interface RetryPolicy {
  /** Número de REINTENTOS tras el primer intento fallido. 3 reintentos = 4 intentos. */
  readonly maxRetries: number;
  readonly baseDelayMs: number;
  readonly maxDelayMs: number;
  /** Techo del jitter. 0 = determinista (solo para pruebas). */
  readonly jitterMs: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 3,
  baseDelayMs: 250,
  maxDelayMs: 4_000,
  jitterMs: 120,
} as const;

/**
 * Backoff "full jitter" (AWS Architecture Blog): `min(cap, base * 2^n) + U(0, jitter)`.
 * El jitter evita el rebaño sincronizado de reintentos contra un proveedor que ya
 * devolvió 429. `attempt` es 0-based. Con `jitterMs: 0` el valor es determinista.
 */
export function computeBackoffMs(attempt: number, policy: RetryPolicy = DEFAULT_RETRY_POLICY): number {
  if (!Number.isInteger(attempt) || attempt < 0) {
    throw new RangeError(`attempt debe ser entero >= 0: ${String(attempt)}`);
  }
  const exponential = Math.min(policy.maxDelayMs, policy.baseDelayMs * 2 ** attempt);
  const jitter = policy.jitterMs > 0 ? Math.floor(Math.random() * policy.jitterMs) : 0;
  return Math.min(policy.maxDelayMs, exponential + jitter);
}

// ── Validación estricta de la salida del conector (SEC-4) ───────────────────

const metricPointSchema = z.object({
  artistId: z.string().min(1),
  platformId: z.string().min(1),
  metric: z.enum(METRIC_KEYS),
  value: z.number().int(),
  capturedAt: z.string().min(1),
  source: z.enum(['api', 'csv', 'manual', 'demo']),
}) satisfies z.ZodType<MetricPoint>;

const metricPointsSchema = z.array(metricPointSchema);

/**
 * Valida y normaliza el lote del conector. Rechaza:
 *   · platformId fuera del registry,
 *   · metric que la plataforma no declara en el SSOT,
 *   · value no entero (dinero en céntimos),
 *   · capturedAt no parseable.
 * Un lote inválido NUNCA se persiste parcialmente: error antes de abrir transacción.
 */
export function assertMetricPoints(
  platformId: string,
  points: readonly MetricPoint[],
): readonly MetricPoint[] {
  const def = getPlatform(platformId);
  if (def === undefined) {
    throw new ConnectorError({
      code: 'NOT_IMPLEMENTED',
      message: `platformId "${platformId}" fuera del SSOT.`,
      platformId,
      retryable: false,
    });
  }
  const parsed = metricPointsSchema.safeParse(points);
  if (!parsed.success) {
    throw new ConnectorError({
      code: 'INVALID_PAYLOAD',
      message: `Lote de métricas con forma inválida: ${parsed.error.issues[0]?.message ?? 'sin detalle'}`,
      platformId,
      retryable: false,
    });
  }
  for (const point of parsed.data) {
    if (point.platformId !== platformId) {
      throw new ConnectorError({
        code: 'INVALID_PAYLOAD',
        message: `Métrica de "${point.platformId}" dentro de un lote de "${platformId}".`,
        platformId,
        retryable: false,
      });
    }
    if (!def.metrics.includes(point.metric)) {
      throw new ConnectorError({
        code: 'INVALID_PAYLOAD',
        message: `La plataforma "${platformId}" no declara la métrica "${point.metric}".`,
        platformId,
        retryable: false,
      });
    }
    if (Number.isNaN(Date.parse(point.capturedAt))) {
      throw new ConnectorError({
        code: 'INVALID_PAYLOAD',
        message: `capturedAt no parseable en "${platformId}": ${point.capturedAt}`,
        platformId,
        retryable: false,
      });
    }
  }
  return parsed.data;
}

/** Deriva el `source` honesto del `MetricPoint` desde el `syncMode` del SSOT. */
export function sourceForSyncMode(syncMode: SyncMode): MetricPoint['source'] {
  if (syncMode === 'oauth_api' || syncMode === 'webhook') return 'api';
  if (syncMode === 'csv_import') return 'csv';
  return 'manual';
}
