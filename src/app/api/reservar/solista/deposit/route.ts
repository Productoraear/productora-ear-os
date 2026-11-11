import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import { checkDateAvailability, lockDateAtomically, unlockDateAtomically } from '@/lib/availability/atomicDateLockEngine';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { DEPOSITO_STRIPE_EUR, MAX_TOTAL_ESTIMADO_EUR } from '@/lib/constants/ear-os-ssot';
import { classifyDbFailure } from '@/lib/db/dbFailureClassifier';
import { LANDING_CLUSTERS, sanitizeLandingSlug } from '@/lib/reservar/landing-attribution';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Depósito vinculante en céntimos, derivado del SSOT inmutable (100,00 € → 10000 cts).
// Prohibido hardcodear: DEPOSITO_STRIPE_EUR es la única fuente de verdad.
const DEPOSIT_CENTS = Math.round(DEPOSITO_STRIPE_EUR * 100);
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';

// ── BLINDAJE DE ENTRADA (OWASP ASVS L3) ─────────────────────────────────────
// Ventana física razonable de kilometraje para la red nacional. Rechaza NaN,
// Infinity, negativos y valores absurdos que corromperían la telemetría.
const MAX_DISTANCIA_KM = 5000;
// Techo anti-desbordamiento del presupuesto declarado por el cliente.
// P0-2: único valor canónico y compartido con el MCP Concierge (SSOT).
// Prohibido recortar en silencio con `Math.min`: un presupuesto que excede el
// techo se RECHAZA con 400 explícito, jamás se maquilla.
const MAX_TOTAL_ESTIMADO_INPUT_EUR = MAX_TOTAL_ESTIMADO_EUR;
const MAX_FORMATO_CHARS = 120;

interface DepositRequestBody {
  fecha?: unknown;
  formato?: unknown;
  distanciaKm?: unknown;
  horaFin?: unknown;
  totalEstimado?: unknown;
  artistProfileId?: unknown;
  idempotencyKey?: unknown;
  landingSlug?: unknown;
  landingCluster?: unknown;
  landingFormatId?: unknown;
}

interface SanitizedDepositRequest {
  fecha: string;
  formato: string;
  distanciaKm: number;
  horaFin: string;
  totalEstimado: number;
  artistProfileId?: string;
  idempotencyKey?: string;
  /** Slug de la landing de origen (atribución comercial, OWASP-safe). */
  landingSlug?: string;
  /** Clúster de procedencia, siempre dentro de la allow-list. */
  landingCluster?: string;
  /** Formato SSOT que la landing estaba vendiendo. */
  landingFormatId?: string;
}

/** Elimina caracteres de control y colapsa espacios: anti-inyección en metadata Stripe. */
function sanitizeText(value: string, maxLength: number): string {
  let clean = '';
  for (const char of value) {
    const code = char.codePointAt(0) ?? 0;
    clean += code < 32 || code === 127 ? ' ' : char;
  }
  return clean.replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

/** Acepta únicamente tokens seguros (ids de artista, claves de idempotencia). */
function sanitizeToken(value: unknown, minLength: number, maxLength: number): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (trimmed.length < minLength || trimmed.length > maxLength) return undefined;
  return /^[A-Za-z0-9_-]+$/.test(trimmed) ? trimmed : undefined;
}

/**
 * Normaliza la fecha a `YYYY-MM-DD` y exige un día real del calendario.
 * Rechaza `2026-02-31` (Date lo desbordaría a marzo) y cualquier entrada no ISO.
 */
function parseIsoDate(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const candidate = value.trim().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) return null;
  const parsed = new Date(`${candidate}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10) === candidate ? candidate : null;
}

/** Franja de finalización en formato 24h estricto; cualquier otra forma se descarta. */
function parseHoraFin(value: unknown): string {
  if (typeof value !== 'string') return '';
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  return match ? `${match[1]}:${match[2]}` : '';
}

/** Convierte a número finito (acepta string numérico de formularios legacy). */
function parseFiniteNumber(value: unknown): number | null {
  const parsed =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && value.trim().length > 0
        ? Number(value)
        : Number.NaN;
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Error tipado de validación. `code` viaja al cuerpo HTTP para que el cliente
 * (y la telemetría) distingan la causa sin leer prosa.
 */
interface DepositRequestError {
  error: string;
  code?: string;
}

/**
 * Narrowing tipado y sanitización del payload. Cero `any`: `req.json()` es
 * `unknown` hasta que este guardián lo convierte en un contrato verificable.
 */
function parseDepositRequest(rawBody: unknown): SanitizedDepositRequest | DepositRequestError {
  if (typeof rawBody !== 'object' || rawBody === null || Array.isArray(rawBody)) {
    return { error: 'Payload inválido: se espera un objeto JSON de reserva.' };
  }

  const body = rawBody as DepositRequestBody;

  const fecha = parseIsoDate(body.fecha);
  if (!fecha) {
    return { error: 'Fecha inválida: se requiere un día real en formato YYYY-MM-DD.' };
  }

  const distanciaKm = parseFiniteNumber(body.distanciaKm);
  if (distanciaKm === null || distanciaKm < 0 || distanciaKm > MAX_DISTANCIA_KM) {
    return {
      error: `Distancia inválida: se requiere un número entre 0 y ${MAX_DISTANCIA_KM} km.`,
    };
  }

  const formatoSanitized = typeof body.formato === 'string' ? sanitizeText(body.formato, MAX_FORMATO_CHARS) : '';
  const totalEstimado = parseFiniteNumber(body.totalEstimado) ?? 0;

  // ── P0-2 · GUARD, NO CLAMP ──────────────────────────────────────────────────
  // Un importe negativo o por encima del techo SSOT no se «ajusta»: se rechaza
  // con 400 explícito. El recorte silencioso convertía 100.000.000 € en
  // 1.000.000 € y el cliente recibía un checkout con un número que no pidió.
  if (totalEstimado < 0 || totalEstimado > MAX_TOTAL_ESTIMADO_INPUT_EUR) {
    return {
      error: `PRESUPUESTO_EXCEDE_MAXIMO_LEGAL: el importe debe estar entre 0,00 € y ${MAX_TOTAL_ESTIMADO_INPUT_EUR.toLocaleString('es-ES')},00 €.`,
      code: 'PRESUPUESTO_EXCEDE_MAXIMO_LEGAL',
    };
  }

  // ── ATRIBUCIÓN (P1): procedencia de la landing ────────────────────────────
  // El clúster NUNCA se acepta como texto libre: allow-list cerrada o vacío.
  // El slug se valida con el mismo contrato que usa el configurador cliente.
  const landingSlug = sanitizeLandingSlug(body.landingSlug) ?? undefined;
  const clusterRaw =
    typeof body.landingCluster === 'string'
      ? sanitizeText(body.landingCluster, 40).toLowerCase()
      : '';
  const landingCluster = (LANDING_CLUSTERS as readonly string[]).includes(clusterRaw)
    ? clusterRaw
    : undefined;
  const landingFormatId = sanitizeToken(body.landingFormatId, 2, 32)?.toLowerCase();

  return {
    fecha,
    formato: formatoSanitized.length > 0 ? formatoSanitized : 'solista',
    distanciaKm,
    horaFin: parseHoraFin(body.horaFin),
    totalEstimado,
    artistProfileId: sanitizeToken(body.artistProfileId, 1, 64),
    idempotencyKey: sanitizeToken(body.idempotencyKey, 8, 128),
    landingSlug,
    landingCluster,
    landingFormatId,
  };
}

/**
 * Vista tipada de un error de Stripe v22 sin `any`: el discriminante fiable es
 * `type` (`StripeRateLimitError`, `StripeConnectionError`, `StripeAPIError`…)
 * y `code` sólo cuando es un string (`rate_limit`, `idempotency_error`…).
 */
interface StripeErrorView {
  readonly type: string;
  readonly code: string;
}

/** Extrae la vista tipada de un error de Stripe; `null` si no lo es. */
function asStripeError(error: unknown): StripeErrorView | null {
  if (typeof error !== 'object' || error === null) return null;
  const record = error as Record<string, unknown>;
  const type = record.type;
  if (typeof type !== 'string' || !type.startsWith('Stripe')) return null;
  const code = record.code;
  return { type, code: typeof code === 'string' ? code : '' };
}

export async function POST(req: NextRequest) {
  // Declarado fuera del `try` para que el clasificador del `catch` disponga de
  // la misma referencia tipada (cero `any`, cero `TS18046`).
  let stripe: Stripe | null = null;
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      // Resiliencia S-Class: si el servidor no tiene inyectada la clave secreta de API,
      // nunca bloqueamos el cobro. Redirigimos al Stripe Payment Link oficial configurado.
      const fallbackUrl =
        process.env.NEXT_PUBLIC_STRIPE_SOLISTA_LINK ||
        'https://buy.stripe.com/5kQ5kF2Ryh03fCT3Et4Vy0f';
      return NextResponse.json({
        url: fallbackUrl,
        mode: 'payment_link_fallback',
        warning: 'stripe_secret_missing_fallback_to_payment_link',
      });
    }

    stripe = new Stripe(stripeSecret, {
      apiVersion: '2025-01-27.acacia' as never,
    });

    // Lectura defensiva: un body corrupto jamás debe escalar a un 500.
    const rawBody: unknown = await req.json().catch(() => null);
    const parsed = parseDepositRequest(rawBody);

    if ('error' in parsed) {
      // P0-2: el motivo viaja con código de máquina (`PRESUPUESTO_EXCEDE_MAXIMO_LEGAL`),
      // no como prosa suelta imposible de auditar.
      return NextResponse.json(
        parsed.code === undefined
          ? { ok: false, error: parsed.error }
          : { ok: false, error: parsed.error, code: parsed.code },
        { status: 400, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    const {
      fecha,
      formato,
      distanciaKm,
      horaFin,
      totalEstimado,
      artistProfileId,
      idempotencyKey,
      landingSlug,
      landingCluster,
      landingFormatId,
    } = parsed;

    // Atribución lista para persistir: cadena vacía = sin procedencia declarada.
    const attributionSlug = landingSlug ?? '';
    const attributionCluster = landingCluster ?? '';
    const attributionFormatId = landingFormatId ?? '';

    // ── W06-001 · GUARDIÁN ANTI-COLISIÓN ACID ──────────────────────────────
    // Verificación atómica de disponibilidad ANTES de materializar la sesión
    // Stripe. Impide que dos clientes reserven el mismo sábado.
    const availability = await checkDateAvailability({
      eventDate: fecha,
      artistProfileId,
      // Aislamiento por entidad: la agenda del artista evaluado, no la global.
      entityKind: 'artista',
      entitySlug: artistProfileId,
    });

    if (!availability.available) {
      // La fecha inválida es un error de cliente (400), no una colisión (409).
      if (availability.reason === 'INVALID_DATE') {
        return NextResponse.json(
          {
            ok: false,
            error: 'Fecha inválida: el motor de disponibilidad no pudo interpretar el día solicitado.',
            reason: availability.reason,
          },
          { status: 400, headers: { 'Cache-Control': 'no-store' } }
        );
      }

      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          error:
            'La fecha solicitada ya está comprometida por una reserva activa. Selecciona otro día o contacta por WhatsApp para la lista de espera prioritaria.',
          reason: availability.reason,
          conflictingBlockId: availability.conflictingBlockId,
          conflictingProductionId: availability.conflictingProductionId,
        },
        { status: 409, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // ── P0-3 · ESCRITURA DEL CANDADO (reserva pesimista, no sólo lectura) ───
    // La comprobación anterior es un `SELECT`: con 100 compradores simultáneos,
    // todos ven la fecha libre y reciben checkout (sobreventa MEDIDA: 82/100).
    // El candado se MATERIALIZA aquí: el primero que escribe gana y los demás
    // reciben 409. El writer es serializable (cola en proceso + transacción
    // interactiva en PostgreSQL), de ahí la exclusión mutua.
    const lockHolder = artistProfileId ?? 'edwin-agudelo';
    const lockTicket = `${idempotencyKey ?? crypto.randomUUID()}-${Date.now()}`;
    const lockSha256 = crypto
      .createHash('sha256')
      .update(`${lockHolder}::${fecha}::${lockTicket}`)
      .digest('hex');

    const dateLock = await lockDateAtomically({
      eventDate: fecha,
      artistProfileId: lockHolder,
      entityKind: 'artista',
      entitySlug: lockHolder,
      // Sin franja declarada, la agenda es exclusiva: un evento por artista/día.
      clientName: 'Depósito Price-Lock pendiente',
      stripeSessionId: lockTicket,
      priceLockSha256: lockSha256,
      totalAmountEur: totalEstimado > 0 ? totalEstimado : undefined,
      depositAmountEur: DEPOSITO_STRIPE_EUR,
      status: 'PENDING_DEPOSIT',
      location: `Reserva ${formato} · ${distanciaKm} km`,
    });

    if (!dateLock.success) {
      const isInvalidDate = dateLock.reason === 'INVALID_DATE';
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          reason: dateLock.reason,
          error: isInvalidDate
            ? 'Fecha inválida: el motor de bloqueo no pudo interpretar el día solicitado.'
            : 'Otro comprador acaba de bloquear ese día con este artista. Selecciona otra fecha o entra en la lista de espera por WhatsApp en el +34 693 693 048.',
          conflictingProductionId: dateLock.productionId,
          conflictingBlockId: dateLock.blockId,
        },
        { status: isInvalidDate ? 400 : 409, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // Idempotencia de orden: si el cliente aporta una clave estable, dos reintentos
    // del mismo intento producen el MISMO orderId, el MISMO priceLockHash y, por
    // tanto, EXACTAMENTE una sesión Stripe (SCORECARD Ω-DIAMANTE §19).
    const orderId = `EAR-SOLISTA-${idempotencyKey ?? Date.now()}`;
    const priceLockHash = crypto
      .createHash('sha256')
      .update(`${orderId}-${DEPOSIT_CENTS}-${fecha}-${stripeSecret}`)
      .digest('hex');

    // Si Stripe no emite enlace de pago, el candado se LIBERA: una caída de la
    // pasarela no puede congelar la agenda del artista (compensación explícita).
    const releaseDateLock = async (): Promise<void> => {
      try {
        await unlockDateAtomically({
          stripeSessionId: lockTicket,
          eventDate: fecha,
          artistProfileId: lockHolder,
          entityKind: 'artista',
          entitySlug: lockHolder,
        });
      } catch (unlockError: unknown) {
        console.error('[SOLISTA DEPOSIT] No se pudo liberar el candado de fecha', classifyDbFailure(unlockError));
      }
    };

    let session: Stripe.Checkout.Session;
    try {
      session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: `${BASE_URL}/reservar/solista?deposit=confirmado&order_id=${orderId}&lock=${priceLockHash.slice(0, 16)}&session_id={CHECKOUT_SESSION_ID}${attributionSlug ? `&landing=${encodeURIComponent(attributionSlug)}&cluster=${encodeURIComponent(attributionCluster)}` : ''}`,
      cancel_url: `${BASE_URL}/reservar/solista?deposit=cancelado`,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Depósito Vinculante de Reserva — ${formato === 'mariachi' ? 'Mariachi de Gala' : 'Solista S-Class'}`,
              description: `Bloqueo inmutable de fecha ${fecha} · Distancia ${distanciaKm} km · Fin ~${horaFin || 'N/D'} · Presupuesto total ${totalEstimado || 0} €`,
            },
            unit_amount: DEPOSIT_CENTS,
          },
          quantity: 1,
        },
      ],
      metadata: {
        orderId,
        tipo: 'DEPOSITO_SOLISTA_S_CLASS',
        fecha,
        formato,
        distanciaKm: String(distanciaKm),
        horaFin,
        totalEstimado: String(totalEstimado),
        artistProfileId: artistProfileId ?? '',
        depositCents: String(DEPOSIT_CENTS),
        idempotencyKey: idempotencyKey ?? '',
        // Atribución comercial: la landing que originó el depósito.
        landingSlug: attributionSlug,
        landingCluster: attributionCluster,
        landingFormatId: attributionFormatId,
        priceLockHash,
      },
    }, idempotencyKey ? { idempotencyKey: priceLockHash } : undefined);
    } catch (stripeFailure: unknown) {
      await releaseDateLock();
      throw stripeFailure;
    }

    // Despacho asíncrono al workflow n8n de Stripe Price-Lock (no bloqueante).
    // `fireAndForgetN8n` delega en `dispatchToN8n`, que reintenta con backoff y
    // encola en DLQ si n8n cae: jamás retrasa ni tumba esta respuesta.
    fireAndForgetN8n('stripe-price-lock', {
      event: 'deposit_session_created',
      orderId,
      priceLockHash,
      fecha,
      formato,
      distanciaKm,
      horaFin,
      totalEstimado,
      depositCents: DEPOSIT_CENTS,
      artistProfileId: artistProfileId ?? '',
      idempotencyKey: idempotencyKey ?? '',
      // Atribución: n8n recibe de qué landing vino el dinero (cero leads huérfanos).
      landingSlug: attributionSlug,
      landingCluster: attributionCluster,
      landingFormatId: attributionFormatId,
      sessionId: session.id,
      timestamp: new Date().toISOString()
    });

    // Sin URL de checkout no hay pago posible: fallar explícito, nunca devolver null.
    if (!session.url) {
      console.error('[SOLISTA DEPOSIT] Stripe devolvió una sesión sin URL de checkout', session.id);
      await releaseDateLock();
      return NextResponse.json(
        {
          ok: false,
          code: 'STRIPE_NO_CHECKOUT_URL',
          error:
            'Stripe no generó el enlace de pago. Reintenta en unos segundos o contacta por WhatsApp al +34 693 693 048.',
          orderId,
          priceLockHash,
        },
        { status: 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return NextResponse.json(
      {
        url: session.url,
        orderId,
        priceLockHash,
        depositCents: DEPOSIT_CENTS,
        fecha,
        landingSlug: attributionSlug,
        landingCluster: attributionCluster,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error: unknown) {
    // ════════════════════════════════════════════════════════════════════════
    // P0-1 · CLASIFICADOR DE FALLO (cero 500 mudo en la ruta del dinero)
    // ════════════════════════════════════════════════════════════════════════
    // Causa raíz MEDIDA en la auditoría de estrés (100 bloqueos concurrentes):
    //   StripeRateLimitError → «Request rate limit exceeded» → 500 genérico
    //   (25 de 100 compradores perdían la reserva en el último paso).
    // Aquí todo fallo se traduce a un código HTTP estructurado y accionable.
    const report = classifyDbFailure(error);
    const stripeError = asStripeError(error);
    const stripeType: string = stripeError?.type ?? '';
    const stripeCode: string = stripeError?.code ?? '';

    console.error('[SOLISTA DEPOSIT ERROR]', {
      errorCode: report.code,
      dbKind: report.kind,
      stripeType: stripeType || null,
      stripeCode: stripeCode || null,
    });

    // 1 · Saturación de Stripe: el fan debe REINTENTAR, no perder la reserva.
    if (
      stripeType === 'StripeRateLimitError' ||
      stripeCode === 'rate_limit' ||
      stripeType === 'StripeConnectionError'
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          reason: 'STRIPE_RATE_LIMIT',
          error:
            'Estamos recibiendo una punta de reservas simultáneas. Reintenta en 30 segundos: tu fecha no se ha perdido. También puedes cerrarla por WhatsApp en el +34 693 693 048.',
          retryAfterSeconds: 30,
        },
        { status: 429, headers: { 'Cache-Control': 'no-store', 'Retry-After': '30' } }
      );
    }

    // 2 · Motor de bloqueo / base de datos saturada o inalcanzable.
    if (
      report.kind === 'DB_POOL_TIMEOUT' ||
      report.kind === 'DB_CONNECTION_CLOSED' ||
      report.kind === 'DB_UNREACHABLE' ||
      report.code === 'P2034' ||
      report.code === 'P2024' ||
      report.code === '40001' ||
      report.code === '40P01'
    ) {
      return NextResponse.json(
        {
          ok: false,
          code: 'DATE_LOCK_CONTENTION',
          reason: report.kind,
          error:
            'El candado de fecha está bajo contención en este instante. Reintenta en unos segundos o cierra la reserva por WhatsApp en el +34 693 693 048.',
          retryAfterSeconds: 10,
        },
        { status: 409, headers: { 'Cache-Control': 'no-store', 'Retry-After': '10' } }
      );
    }

    // 3 · Stripe rechazó la petición (validación, clave revocada…): 422 explícito.
    if (stripeType !== '') {
      return NextResponse.json(
        {
          ok: false,
          code: 'STRIPE_SESSION_REJECTED',
          reason: stripeType,
          error:
            'Stripe no pudo crear el enlace de pago. Inténtalo de nuevo o contacta por WhatsApp al +34 693 693 048.',
        },
        { status: 422, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    // 4 · Último recurso: 503 declarado, nunca un 500 mudo.
    // AF-1: `SIN_EVIDENCIA` de causa exacta ⇒ se declara y se pide reintento.
    return NextResponse.json(
      {
        ok: false,
        code: 'DEPOSIT_UNAVAILABLE',
        reason: report.kind,
        error:
          'El servicio de reservas no está disponible en este momento. Reintenta en un minuto o contacta por WhatsApp al +34 693 693 048.',
        retryAfterSeconds: 60,
      },
      { status: 503, headers: { 'Cache-Control': 'no-store', 'Retry-After': '60' } }
    );
  }
}