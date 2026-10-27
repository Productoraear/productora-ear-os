import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import crypto from 'crypto';
import { checkDateAvailability } from '@/lib/availability/atomicDateLockEngine';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
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
const MAX_TOTAL_ESTIMADO_EUR = 1_000_000;
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
 * Narrowing tipado y sanitización del payload. Cero `any`: `req.json()` es
 * `unknown` hasta que este guardián lo convierte en un contrato verificable.
 */
function parseDepositRequest(rawBody: unknown): SanitizedDepositRequest | { error: string } {
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
    totalEstimado: Math.min(Math.max(totalEstimado, 0), MAX_TOTAL_ESTIMADO_EUR),
    artistProfileId: sanitizeToken(body.artistProfileId, 1, 64),
    idempotencyKey: sanitizeToken(body.idempotencyKey, 8, 128),
    landingSlug,
    landingCluster,
    landingFormatId,
  };
}

export async function POST(req: NextRequest) {
  try {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return NextResponse.json(
        { error: 'pagos_no_configurados' },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeSecret, {
      apiVersion: '2025-01-27.acacia' as never,
    });

    // Lectura defensiva: un body corrupto jamás debe escalar a un 500.
    const rawBody: unknown = await req.json().catch(() => null);
    const parsed = parseDepositRequest(rawBody);

    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
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
            error: 'Fecha inválida: el motor de disponibilidad no pudo interpretar el día solicitado.',
            reason: availability.reason,
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          error:
            'La fecha solicitada ya está comprometida por una reserva activa. Selecciona otro día o contacta por WhatsApp para la lista de espera prioritaria.',
          reason: availability.reason,
          conflictingBlockId: availability.conflictingBlockId,
          conflictingProductionId: availability.conflictingProductionId,
        },
        { status: 409 }
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

    const session = await stripe.checkout.sessions.create({
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
      return NextResponse.json(
        {
          error:
            'Stripe no generó el enlace de pago. Reintenta en unos segundos o contacta por WhatsApp al +34 693 693 048.',
          orderId,
          priceLockHash,
        },
        { status: 502 }
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
    console.error('[SOLISTA DEPOSIT ERROR]', error);
    return NextResponse.json(
      { error: 'Error al crear el depósito de reserva' },
      { status: 500 }
    );
  }
}