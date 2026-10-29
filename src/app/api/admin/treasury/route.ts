export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createHash } from 'node:crypto';
import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';
import { EAR_OS_SSOT } from '@/lib/constants/ear-os-ssot';

/**
 * W02-API-019 — Treasury API Hardening
 * - Validación estricta de inputs (query params) con Zod
 * - try/catch global con respuesta tipada
 * - Headers de seguridad (no-store, nosniff, DENY)
 * - Cero `any` implícitos
 *
 * W41_T09 — Price-Lock 100 € idempotente (POST /api/admin/treasury)
 * - `reference = PRICELOCK:<stripeSessionId>` como clave de idempotencia ACID.
 * - Split 80/10/10 calculado SIEMPRE desde `EAR_OS_SSOT` (cero hardcode).
 * - `originHash` SHA-256 del payload de origen (trazabilidad anti-manipulación).
 * - GET corregido: solo devuelve depósitos Price-Lock y mapea columnas REALES
 *   de `commissionLedger` (antes inventaba `clientName`/`serviceName`/`hash`).
 */

import { z } from 'zod';

// ─────────────────────────────────────────────────────────────
// Constantes de dinero — TODAS nacen del SSOT (cero hardcode)
// ─────────────────────────────────────────────────────────────

const SPLIT_ARTIST = EAR_OS_SSOT.SPLIT_SOBERANO.artista;
const SPLIT_EAR_OS = EAR_OS_SSOT.SPLIT_SOBERANO.earOs;
const SPLIT_VIMUME = EAR_OS_SSOT.SPLIT_SOBERANO.vimume;
const SPLIT_RULE = '80% Artista / 10% EAR OS / 10% VIMUME';
const DEPOSIT_MIN_EUR = EAR_OS_SSOT.DEPOSITO_STRIPE_EUR;
const MAX_PRICE_LOCK_EUR = 50_000;
const SOURCE_PRICE_LOCK = 'STRIPE_PRICE_LOCK';
const REFERENCE_PREFIX = 'PRICELOCK:';
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

// ─────────────────────────────────────────────────────────────
// Schemas
// ─────────────────────────────────────────────────────────────

const QuerySchema = z.object({
  limit: z
    .string()
    .regex(/^\d{1,3}$/, 'limit debe ser numérico (1-3 dígitos)')
    .transform((v) => Number.parseInt(v, 10))
    .refine((n) => n >= 1 && n <= 100, 'limit debe estar entre 1 y 100')
    .optional(),
});

/**
 * Payload del depósito Price-Lock. `.strict()` rechaza cualquier campo extra:
 * el cliente NO puede inyectar `status`, `split`, `amount` alternativos ni
 * `reference`. El importe queda acotado por abajo en el depósito inmutable del
 * SSOT (100,00 €) y por arriba en el techo de sanidad `MAX_PRICE_LOCK_EUR`.
 */
const PriceLockSchema = z
  .object({
    stripeSessionId: z.string().trim().min(8).max(120),
    amountEur: z.coerce
      .number()
      .min(DEPOSIT_MIN_EUR, 'El depósito Price-Lock no puede ser inferior a 100,00 €')
      .max(MAX_PRICE_LOCK_EUR, 'Importe fuera del rango permitido'),
    clientName: z.string().trim().min(2).max(120),
    clientEmail: z.string().trim().email().max(180).optional(),
    serviceName: z.string().trim().min(2).max(160),
    paidAt: z.string().datetime().optional(),
  })
  .strict();

type TreasuryTransaction = {
  id: string;
  reference: string;
  client: string;
  service: string;
  deposit: string;
  hash: string;
  status: string;
  date: string;
};

type TreasuryMetrics = {
  totalDepositsAmount: string;
  totalDepositsCount: number;
  artistSplit: string;
  earOsSplit: string;
  vimumeSplit: string;
  rule: string;
};

type TreasurySuccessResponse = {
  /**
   * Sobre canónico Ω-ADMIN (src/lib/admin/adminTypes.ts): `adminFetch` del panel
   * exige `{ ok: true, data }`. Se añade de forma ADITIVA para no romper a los
   * consumidores legados que leen `success` / `metrics` / `transactions`.
   */
  ok: true;
  data: { metrics: TreasuryMetrics; transactions: TreasuryTransaction[] };
  total: number;
  success: true;
  timestamp: string;
  metrics: TreasuryMetrics;
  transactions: TreasuryTransaction[];
};

type TreasuryErrorResponse = {
  success: false;
  error: string;
  code: string;
  timestamp: string;
};

/** Split Soberano 80/10/10 con reparto exacto al céntimo. */
type PriceLockSplit = {
  artist: number;
  earOs: number;
  vimume: number;
  rule: string;
  depositDeductible: true;
};

/** Estructura real persistida en `commissionLedger.notes` (JSON auditables). */
type PriceLockLedgerNotes = {
  clientName: string;
  serviceName: string;
  clientEmail: string | null;
  paidAt: string;
  originHash: string;
  origin: string;
  split: PriceLockSplit;
};

type PriceLockAckResponse = {
  /**
   * Sobre Ω-ADMIN ADITIVO (W41_T16). `adminFetch` —el cliente único del panel—
   * rechaza cualquier respuesta sin `ok: true` (`adminFetch.ts:259-265`). Sin
   * este campo, un POST correcto (201) se convertía en un fallo FALSO en la UI
   * mientras la fila ya estaba escrita en el ledger: la peor mentira posible
   * sobre dinero. `success` se conserva para los consumidores legados.
   */
  ok: true;
  success: true;
  timestamp: string;
  idempotent: true;
  replay: boolean;
  data: {
    id: string;
    reference: string;
    amount: number;
    created: boolean;
    status: string;
    paidAt: string | null;
    originHash: string;
    originMatchesStored: boolean | null;
    split: PriceLockSplit;
  };
};

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-Robots-Tag': 'noindex, nofollow',
};

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function jsonResponse<T extends object>(
  body: T,
  status: number = 200
): NextResponse<T> {
  return NextResponse.json<T>(body, {
    status,
    headers: SECURITY_HEADERS,
  });
}

function errorResponse(
  code: string,
  message: string,
  status: number
): NextResponse<TreasuryErrorResponse> {
  return jsonResponse<TreasuryErrorResponse>(
    {
      success: false,
      error: message,
      code,
      timestamp: new Date().toISOString(),
    },
    status
  );
}

function safeNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function safeString(value: unknown, fallback: string): string {
  if (typeof value === 'string' && value.trim().length > 0) return value;
  return fallback;
}

function formatDate(value: unknown): string {
  const d = value instanceof Date ? value : new Date(String(value ?? Date.now()));
  if (Number.isNaN(d.getTime())) {
    return new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Refuerza con cabeceras de seguridad las respuestas del guard (401/403). */
function withSecurityHeaders(response: NextResponse): NextResponse {
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value);
  }
  return response;
}

/**
 * Parseo blindado del JSON almacenado en `commissionLedger.notes`.
 * Nunca lanza y nunca devuelve un array: el mapeo del GET jamás inventa datos.
 */
function parseLedgerNotes(raw: unknown): Record<string, unknown> {
  if (typeof raw !== 'string') return {};
  const trimmed = raw.trim();
  if (trimmed.length === 0) return {};
  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return {};
    }
    return parsed as Record<string, unknown>;
  } catch {
    return {};
  }
}

/** Lectura estricta de un campo string no vacío dentro de un JSON parseado. */
function readStringField(
  record: Record<string, unknown>,
  key: string
): string | null {
  const value = record[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

/**
 * Hash SHA-256 del origen del depósito (provenance). Solo usa campos ESTABLES
 * del Price-Lock (sesión Stripe + importe + cliente + servicio): `paidAt` queda
 * fuera a propósito para que un reintento legítimo sin timestamp produzca el
 * mismo hash y no dispare una falsa alarma de manipulación.
 */
function computeOriginHash(input: {
  stripeSessionId: string;
  amountEur: number;
  clientName: string;
  serviceName: string;
}): string {
  const canonical = [
    'PRICELOCK_V1',
    input.stripeSessionId,
    input.amountEur.toFixed(2),
    input.clientName.toUpperCase(),
    input.serviceName.toUpperCase(),
  ].join('|');
  return createHash('sha256').update(canonical, 'utf8').digest('hex');
}

/**
 * Split Soberano 80/10/10 con reparto EXACTO al céntimo: VIMUME absorbe el
 * residuo de redondeo, de modo que `artist + earOs + vimume === amountEur`
 * siempre. Cero céntimos evaporados y ningún porcentaje escrito a mano.
 */
function computeSovereignSplit(amountEur: number): PriceLockSplit {
  const artist = Math.round(amountEur * SPLIT_ARTIST * 100) / 100;
  const earOs = Math.round(amountEur * SPLIT_EAR_OS * 100) / 100;
  const vimume = Math.round((amountEur - artist - earOs) * 100) / 100;
  return {
    artist,
    earOs,
    vimume,
    rule: SPLIT_RULE,
    depositDeductible: true,
  };
}

// ─────────────────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────────────────

export async function GET(request: Request): Promise<NextResponse> {
  try {
    // 1. Auth guard
    const auth = await requireAdmin(request);
    if (!auth.ok) return withSecurityHeaders(auth.response);

    // 2. Validación estricta de query params
    const url = new URL(request.url);
    const rawLimit = url.searchParams.get('limit');
    const parsedQuery = QuerySchema.safeParse(
      rawLimit !== null ? { limit: rawLimit } : {}
    );

    if (!parsedQuery.success) {
      return errorResponse(
        'INVALID_QUERY',
        parsedQuery.error.issues[0]?.message ?? 'Parámetros inválidos',
        400
      );
    }

    const limit = parsedQuery.data.limit ?? DEFAULT_LIMIT;

    // 3. Estado inicial — cero vanidad
    let totalDepositsAmount = 0;
    let transactions: TreasuryTransaction[] = [];

    // 4. Consulta DB Prisma (opcional, tolerante a fallos)
    if (process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL) {
      try {
        const dbEntries = await prisma.commissionLedger.findMany({
          // Tesorería = SOLO depósitos Price-Lock. Las comisiones de afiliados
          // viven en su propio panel; mezclarlas inflaba el "Total Custodia".
          where: {
            OR: [
              { sourceEvent: SOURCE_PRICE_LOCK },
              { reference: { startsWith: REFERENCE_PREFIX } },
            ],
          },
          orderBy: { createdAt: 'desc' },
          take: Math.min(limit, MAX_LIMIT),
        });

        if (dbEntries.length > 0) {
          transactions = dbEntries.map((t): TreasuryTransaction => {
            const amount = safeNumber(t.amount, 0);
            const notes = parseLedgerNotes(t.notes);
            return {
              id: safeString(t.id, 'unknown'),
              reference: safeString(t.reference, 'NO_REFERENCE'),
              // Campos REALES: clientName/serviceName viven en el JSON de `notes`.
              // Si faltan se declara la ausencia; jamás se inventa un cliente.
              client: readStringField(notes, 'clientName') ?? 'NO_DECLARADO',
              service: readStringField(notes, 'serviceName') ?? 'NO_DECLARADO',
              deposit: `${amount.toFixed(2)} €`,
              hash: readStringField(notes, 'originHash') ?? 'NO_HASH',
              status: safeString(t.status, 'PENDING'),
              date: formatDate(t.createdAt),
            };
          });

          totalDepositsAmount = dbEntries.reduce(
            (acc, curr) => acc + safeNumber(curr.amount, 0),
            0
          );
        }
      } catch (dbErr) {
        console.warn(
          '[TREASURY API] DB inaccesible, usando transacciones del ledger local',
          dbErr instanceof Error ? dbErr.message : 'unknown'
        );
      }
    }

    // 5. Split Soberano Inmutable 80 / 10 / 10
    const artistSplit = totalDepositsAmount * SPLIT_ARTIST;
    const earOsSplit = totalDepositsAmount * SPLIT_EAR_OS;
    const vimumeSplit = totalDepositsAmount * SPLIT_VIMUME;

    const metrics: TreasuryMetrics = {
      totalDepositsAmount: totalDepositsAmount.toFixed(2),
      totalDepositsCount: transactions.length,
      artistSplit: artistSplit.toFixed(2),
      earOsSplit: earOsSplit.toFixed(2),
      vimumeSplit: vimumeSplit.toFixed(2),
      rule: SPLIT_RULE,
    };

    const payload: TreasurySuccessResponse = {
      // Sobre Ω-ADMIN (lo exige `adminFetch`): una sola verdad para el panel.
      ok: true,
      data: { metrics, transactions },
      total: transactions.length,
      // Campos legados: /admin/tesoreria sigue leyendo `success` y `metrics`.
      success: true,
      timestamp: new Date().toISOString(),
      metrics,
      transactions,
    };

    return jsonResponse<TreasurySuccessResponse>(payload, 200);
  } catch (err) {
    console.error(
      '[TREASURY API] Error crítico:',
      err instanceof Error ? err.message : 'unknown'
    );
    return errorResponse(
      'INTERNAL_ERROR',
      'Error interno del servidor',
      500
    );
  }
}

/* ══════════════════════════════════════════════════════════════════════════
 * POST — Registro idempotente del depósito Price-Lock 100 € (W41_T09)
 * ══════════════════════════════════════════════════════════════════════════
 * Idempotencia ACID REAL (no simulada):
 *   - Clave: `reference = PRICELOCK:<stripeSessionId>`, columna `@unique`.
 *   - Estrategia: CREATE optimista + captura de P2002 (unique violation).
 *     Así N reintentos —incluso concurrentes— producen EXACTAMENTE 1 fila.
 *   - En un replay NO se sobrescribe nada: el Price-Lock es inmutable.
 *   - `originHash` SHA-256 permite detectar un reintento con payload alterado
 *     (misma sesión Stripe, importe o cliente distintos) → `originMatchesStored:false`.
 * Dinero: el importe y el split vienen del SSOT; el cliente no puede inyectarlos.
 * ══════════════════════════════════════════════════════════════════════════ */

const LEDGER_SELECT = {
  id: true,
  reference: true,
  amount: true,
  status: true,
  createdAt: true,
  notes: true,
  sourceEvent: true,
} as const;

type LedgerRow = {
  id: string;
  reference: string | null;
  amount: number;
  status: string;
  createdAt: Date;
  notes: string | null;
  sourceEvent: string | null;
};

export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. RBAC: sin Bearer Firebase + rol ADMIN no se registra dinero.
    const auth = await requireAdmin(request);
    if (!auth.ok) return withSecurityHeaders(auth.response);

    // 2. Cuerpo JSON tolerante a fallos (nunca un throw sin control).
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return errorResponse('INVALID_JSON', 'Cuerpo JSON inválido', 400);
    }

    // 3. Validación estricta (anti mass-assignment con .strict()).
    const parsedBody = PriceLockSchema.safeParse(rawBody);
    if (!parsedBody.success) {
      return errorResponse(
        'INVALID_BODY',
        parsedBody.error.issues[0]?.message ?? 'Payload inválido',
        400
      );
    }

    const body = parsedBody.data;
    const reference = `${REFERENCE_PREFIX}${body.stripeSessionId}`;
    const paidAt = body.paidAt ?? new Date().toISOString();
    const split = computeSovereignSplit(body.amountEur);
    const originHash = computeOriginHash(body);

    const notes: PriceLockLedgerNotes = {
      clientName: body.clientName,
      serviceName: body.serviceName,
      clientEmail: body.clientEmail ?? null,
      paidAt,
      originHash,
      origin: 'POST /api/admin/treasury',
      split,
    };

    // 4. Escritura idempotente: CREATE + captura de la colisión de `reference`.
    let row: LedgerRow;
    let created = true;
    try {
      row = await prisma.commissionLedger.create({
        data: {
          reference,
          amount: body.amountEur,
          currency: 'EUR',
          sourceEvent: SOURCE_PRICE_LOCK,
          description: `${body.clientName} · ${body.serviceName}`,
          notes: JSON.stringify(notes),
        },
        select: LEDGER_SELECT,
      });
    } catch (createErr) {
      const isUniqueCollision =
        createErr instanceof Prisma.PrismaClientKnownRequestError &&
        createErr.code === 'P2002';
      if (!isUniqueCollision) throw createErr;

      const existing = await prisma.commissionLedger.findUnique({
        where: { reference },
        select: LEDGER_SELECT,
      });
      if (!existing) throw createErr; // Colisión fuera de `reference`: se propaga.
      row = existing;
      created = false;
    }

    // 5. Auditoría de provenance: ¿el replay trae el mismo origen que la fila?
    const storedNotes = parseLedgerNotes(row.notes);
    const storedHash = readStringField(storedNotes, 'originHash');
    const originMatchesStored: boolean | null = created
      ? true
      : storedHash === null
        ? null
        : storedHash === originHash;

    const payload: PriceLockAckResponse = {
      // Sobre Ω-ADMIN (lo exige `adminFetch`): misma verdad que el GET.
      ok: true,
      success: true,
      timestamp: new Date().toISOString(),
      idempotent: true,
      replay: !created,
      data: {
        id: row.id,
        reference: row.reference ?? reference,
        amount: safeNumber(row.amount, body.amountEur),
        created,
        status: safeString(row.status, 'PENDING'),
        paidAt: readStringField(storedNotes, 'paidAt'),
        originHash,
        originMatchesStored,
        split,
      },
    };

    // 201 sólo cuando la fila nace ahora; 200 cuando es un replay idempotente.
    return jsonResponse<PriceLockAckResponse>(payload, created ? 201 : 200);
  } catch (err) {
    console.error(
      '[TREASURY API] POST error:',
      err instanceof Error ? err.message : 'unknown'
    );
    return errorResponse(
      'INTERNAL_ERROR',
      'No se pudo registrar el depósito Price-Lock',
      500
    );
  }
}