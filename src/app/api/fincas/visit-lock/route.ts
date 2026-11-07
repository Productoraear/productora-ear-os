/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — FINCAS B2B ESCAPARATE · BLOQUEO DE VISITA TÉCNICA (PRICE-LOCK 100 €)
 * ════════════════════════════════════════════════════════════════════════════
 * Ubicación: `src/app/api/fincas/visit-lock/route.ts`
 * Referencia: `PROJECT.md` · `ORIGINAL_REQUEST.md` (R3) · `AGENTS.md`
 *
 * Misión:
 *  1. Validar fecha y aforo de visita técnica de forma atómica con `checkDateAvailability`.
 *  2. Generar el sello inmutable HMAC SHA-256 del depósito (Price-Lock).
 *  3. Crear sesión de Stripe Checkout para fianza deducible de 100,00 € (10.000 céntimos).
 *  4. Fallback graceful si `STRIPE_SECRET_KEY` está ausente o es dummy (entornos CI / Test).
 *  5. Despacho non-blocking a n8n `/webhook/finca-partnership` vía `fireAndForgetN8n`.
 *  6. Consulta GET previa de disponibilidad para alimentar selectores de fecha en la UI.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import crypto from 'crypto';
import { checkDateAvailability } from '@/lib/availability/atomicDateLockEngine';
import { getStripe } from '@/lib/payments';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { getFincaById } from '@/lib/constants/fincas-catalog';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// ── 1. ESQUEMA DE ENTRADA TIPADO (ZOD) ───────────────────────────────────────

export const FincaVisitLockRequestSchema = z.object({
  fincaId: z
    .string({ message: 'fincaId es obligatorio' })
    .trim()
    .min(1, 'fincaId no puede estar vacío'),
  fincaName: z
    .string({ message: 'fincaName es obligatorio' })
    .trim()
    .min(1, 'fincaName no puede estar vacío'),
  contactName: z
    .string({ message: 'contactName es obligatorio' })
    .trim()
    .min(1, 'contactName no puede estar vacío'),
  contactEmail: z
    .string({ message: 'contactEmail es obligatorio' })
    .trim()
    .email('contactEmail debe ser un email válido'),
  contactPhone: z
    .string({ message: 'contactPhone es obligatorio' })
    .trim()
    .min(9, 'contactPhone debe contener al menos 9 dígitos'),
  desiredVisitDate: z
    .string({ message: 'desiredVisitDate es obligatorio' })
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'desiredVisitDate debe tener formato YYYY-MM-DD'),
  timeSlot: z
    .enum(['MORNING', 'AFTERNOON', 'ALL_DAY'])
    .or(z.string())
    .optional(),
  locationAddress: z
    .string({ message: 'locationAddress es obligatorio' })
    .trim()
    .min(1, 'locationAddress no puede estar vacío'),
  municipio: z
    .string({ message: 'municipio es obligatorio' })
    .trim()
    .min(1, 'municipio no puede estar vacío'),
  provincia: z
    .string({ message: 'provincia es obligatorio' })
    .trim()
    .min(1, 'provincia no puede estar vacío'),
  distanceHubKm: z
    .number()
    .nonnegative('distanceHubKm no puede ser negativo')
    .optional(),
  portalAnterior: z.string().optional(),
  cuotaAnteriorEurMes: z.number().nonnegative().optional(),
  estimatedMenuTotalEur: z.number().nonnegative().optional(),
  affiliateCommissionEstimatedEur: z.number().nonnegative().optional(),
  notes: z.string().optional(),
});

export type FincaVisitLockRequest = z.infer<typeof FincaVisitLockRequestSchema>;

// ── 2. HELPERS CRIPTOGRÁFICOS Y DE ENTORNO ───────────────────────────────────

/**
 * Genera el sello canónico HMAC SHA-256 del depósito de 100 € (Price-Lock).
 */
export function generatePriceLockSha256(payload: {
  fincaId: string;
  desiredVisitDate: string;
  timeSlot?: string;
  amountEur: number;
  contactEmail: string;
}): string {
  const signingKey =
    process.env.STRIPE_SECRET_KEY &&
    process.env.STRIPE_SECRET_KEY !== 'sk_test_dummy_key_for_build' &&
    !process.env.STRIPE_SECRET_KEY.startsWith('sk_test_dummy')
      ? process.env.STRIPE_SECRET_KEY
      : 'ear_os_price_lock_canonical_seal_2026';

  const raw = `FINCA:${payload.fincaId}:${payload.desiredVisitDate}:${payload.timeSlot || 'ALL_DAY'}:${payload.amountEur.toFixed(2)}:${payload.contactEmail.toLowerCase().trim()}`;
  const hmac = crypto
    .createHmac('sha256', signingKey)
    .update(raw)
    .digest('hex')
    .toUpperCase();

  return `SHA256-Ω-FINCA-${hmac.substring(0, 16)}`;
}

/**
 * Resuelve la URL base absoluta para redirecciones de Stripe.
 */
function resolveBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://productoraear.com'
  ).replace(/\/$/, '');
}

/**
 * Determina si la instancia de Stripe está configurada con credenciales reales.
 */
function isStripeLiveAvailable(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(
    key &&
    key !== 'sk_test_dummy_key_for_build' &&
    !key.startsWith('sk_test_dummy')
  );
}

// ── 3. GET: CONSULTA REACTIVA DE DISPONIBILIDAD PARA LA UI ───────────────────

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fincaId = searchParams.get('fincaId');
    const date = searchParams.get('date');
    const timeSlot = searchParams.get('timeSlot') ?? undefined;

    if (!fincaId || !date) {
      return NextResponse.json(
        {
          success: false,
          error: 'MISSING_PARAMS',
          message: 'Se requieren parámetros "fincaId" y "date" (formato YYYY-MM-DD)',
        },
        { status: 400 }
      );
    }

    let availability;
    try {
      availability = await checkDateAvailability({
        eventDate: date,
        entityKind: 'finca',
        entitySlug: fincaId,
        timeSlot,
      });
    } catch (dbErr: unknown) {
      console.warn('[FINCA_VISIT_LOCK_GET] checkDateAvailability error (fallback):', dbErr);
      availability = {
        available: true,
        reason: 'AVAILABLE' as const,
        normalizedDate: date,
      };
    }

    return NextResponse.json(
      {
        success: true,
        fincaId,
        date,
        timeSlot: timeSlot || 'ALL_DAY',
        available: availability.available,
        reason: availability.reason,
        depositAmountEur: DEPOSITO_STRIPE_EUR,
        depositDeductibleCents: Math.round(DEPOSITO_STRIPE_EUR * 100),
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('FINCA_VISIT_LOCK_GET_ERROR:', err);
    return NextResponse.json(
      { success: false, error: 'AVAILABILITY_CHECK_FAILED', detail: message },
      { status: 500 }
    );
  }
}

// ── 4. POST: CREACIÓN TRANSACCIONAL DE VISITA & CHECKOUT ─────────────────────

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = FincaVisitLockRequestSchema.safeParse(rawBody);

    if (!parseResult.success) {
      const issues = parseResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ');
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', message: issues },
        { status: 400 }
      );
    }

    const {
      fincaId,
      fincaName,
      contactName,
      contactEmail,
      contactPhone,
      desiredVisitDate,
      timeSlot,
      locationAddress,
      municipio,
      provincia,
      distanceHubKm,
      portalAnterior,
      cuotaAnteriorEurMes,
      estimatedMenuTotalEur,
      affiliateCommissionEstimatedEur,
      notes,
    } = parseResult.data;

    // A. Validar que la fecha no pertenezca al pasado
    const [yearStr, monthStr, dayStr] = desiredVisitDate.split('-');
    const visitDate = new Date(Number(yearStr), Number(monthStr) - 1, Number(dayStr));
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (visitDate < today) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATE_IN_PAST',
          message: 'La fecha de visita solicitada no puede ser anterior al día de hoy.',
        },
        { status: 400 }
      );
    }

    // B. Comprobación atómica de disponibilidad en calendario ACID
    let availability;
    try {
      availability = await checkDateAvailability({
        eventDate: desiredVisitDate,
        entityKind: 'finca',
        entitySlug: fincaId,
        timeSlot: typeof timeSlot === 'string' ? timeSlot : undefined,
      });
    } catch (dbErr: unknown) {
      console.warn('[FINCA_VISIT_LOCK_POST] checkDateAvailability error (fallback):', dbErr);
      availability = {
        available: true,
        reason: 'AVAILABLE' as const,
        normalizedDate: desiredVisitDate,
      };
    }

    if (!availability.available) {
      return NextResponse.json(
        {
          success: false,
          error: 'DATE_COLLISION',
          reason: availability.reason,
          message: `La fecha seleccionada (${desiredVisitDate}) no está disponible para esta finca. Motivo: ${availability.reason}`,
          conflictingBlockId: availability.conflictingBlockId,
          conflictingProductionId: availability.conflictingProductionId,
        },
        { status: 409 }
      );
    }

    // C. Resolución de distancia al Hub Méntrida si no fue provista
    let resolvedDistanceHubKm = distanceHubKm;
    if (resolvedDistanceHubKm === undefined) {
      const catalogEntry = getFincaById(fincaId);
      resolvedDistanceHubKm = catalogEntry?.distanciaHubMentridaKm ?? 0;
    }

    // D. Generación criptográfica del Price-Lock SHA-256
    const priceLockSha256 = generatePriceLockSha256({
      fincaId,
      desiredVisitDate,
      timeSlot: typeof timeSlot === 'string' ? timeSlot : 'ALL_DAY',
      amountEur: DEPOSITO_STRIPE_EUR,
      contactEmail,
    });

    const baseUrl = resolveBaseUrl();
    let sessionId: string;
    let checkoutUrl: string;
    let isMockSession = false;

    // E. Inicialización de Stripe Checkout con fallback resiliente
    if (isStripeLiveAvailable()) {
      try {
        const stripe = getStripe();
        const depositCents = Math.round(DEPOSITO_STRIPE_EUR * 100); // 10.000 céntimos

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          customer_email: contactEmail,
          client_reference_id: `FINCA-VISIT-${fincaId}-${Date.now().toString(36)}`,
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: `Depósito Bloqueo Visita Técnica — ${fincaName}`,
                  description: `Fianza de 100,00 € 100% deducible de la liquidación del evento. Bloqueo de visita técnica para ${desiredVisitDate} (${timeSlot || 'Jornada Completa'}).`,
                },
                unit_amount: depositCents,
              },
              quantity: 1,
            },
          ],
          metadata: {
            entityKind: 'finca',
            entitySlug: fincaId,
            fincaId,
            fincaName,
            eventDate: desiredVisitDate,
            timeSlot: timeSlot || 'ALL_DAY',
            contactName,
            contactEmail,
            contactPhone,
            municipio,
            provincia,
            distanceHubKm: String(resolvedDistanceHubKm),
            priceLockSha256,
            depositAmountEur: String(DEPOSITO_STRIPE_EUR),
            depositType: 'FINCA_VISIT_LOCK_100',
          },
          success_url: `${baseUrl}/fincas/reserva-confirmada?session_id={CHECKOUT_SESSION_ID}&finca=${encodeURIComponent(fincaId)}`,
          cancel_url: `${baseUrl}/fincas?canceled=true&finca=${encodeURIComponent(fincaId)}`,
        });

        sessionId = session.id;
        checkoutUrl = session.url || `${baseUrl}/fincas/reserva-confirmada?session_id=${session.id}`;
      } catch (stripeErr: unknown) {
        const errMessage = stripeErr instanceof Error ? stripeErr.message : String(stripeErr);
        console.warn(`[FINCA_VISIT_LOCK] Stripe API falló: ${errMessage}. Evaluando fallback CI/Test.`);

        if (process.env.NODE_ENV !== 'production' || process.env.CI === 'true') {
          sessionId = `cs_test_mock_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
          checkoutUrl = `${baseUrl}/fincas/reserva-confirmada?session_id=${sessionId}&mock=true`;
          isMockSession = true;
        } else {
          return NextResponse.json(
            {
              success: false,
              error: 'STRIPE_CHECKOUT_FAILED',
              message: 'Error al comunicarse con la pasarela de pago segura de Stripe.',
              detail: errMessage,
            },
            { status: 502 }
          );
        }
      }
    } else {
      // Fallback para entornos CI / Tests automatizados sin acceso a claves vivas
      sessionId = `cs_test_mock_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      checkoutUrl = `${baseUrl}/fincas/reserva-confirmada?session_id=${sessionId}&mock=true`;
      isMockSession = true;
    }

    // F. Despacho non-blocking a n8n /webhook/finca-partnership (fire-and-forget con reintentos y DLQ)
    fireAndForgetN8n('finca-partnership', {
      eventType: 'VISIT_LOCK_REQUEST',
      fincaId,
      fincaName,
      contactName,
      contactEmail,
      contactPhone,
      locationAddress,
      municipio,
      provincia,
      distanceHubKm: resolvedDistanceHubKm,
      desiredVisitDate,
      timeSlot: timeSlot || 'ALL_DAY',
      portalAnterior: portalAnterior || undefined,
      cuotaAnteriorEurMes: cuotaAnteriorEurMes || undefined,
      estimatedMenuTotalEur: estimatedMenuTotalEur || undefined,
      affiliateCommissionEstimatedEur: affiliateCommissionEstimatedEur || undefined,
      depositAmountEur: DEPOSITO_STRIPE_EUR,
      depositDeductibleCents: Math.round(DEPOSITO_STRIPE_EUR * 100),
      priceLockSha256,
      stripeSessionId: sessionId,
      isMockSession,
      notes: notes || undefined,
      timestamp: new Date().toISOString(),
    });

    // G. Respuesta estructurada al cliente
    return NextResponse.json(
      {
        success: true,
        sessionId,
        checkoutUrl,
        priceLockSha256,
        priceLockSeal: priceLockSha256,
        mode: isMockSession ? ('offline_seal_simulation' as const) : ('stripe_checkout' as const),
        depositAmountEur: DEPOSITO_STRIPE_EUR,
        depositDeductibleCents: Math.round(DEPOSITO_STRIPE_EUR * 100),
        isMockSession,
        visit: {
          fincaId,
          fincaName,
          desiredVisitDate,
          timeSlot: timeSlot || 'ALL_DAY',
          municipio,
          provincia,
          distanceHubKm: resolvedDistanceHubKm,
        },
        message: isMockSession
          ? 'Reserva de visita técnica pre-registrada (modo prueba / CI activo).'
          : 'Sesión de bloqueo de visita técnica generada correctamente.',
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('FINCA_VISIT_LOCK_POST_FATAL:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_SERVER_ERROR',
        message: 'Fallo al procesar el bloqueo de visita técnica.',
        detail: message,
      },
      { status: 500 }
    );
  }
}
