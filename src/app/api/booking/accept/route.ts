import { NextRequest, NextResponse } from 'next/server';
import { DEPOSITO_STRIPE_EUR, SPLIT_SOBERANO, CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import {
    verifyAcceptanceToken,
    ACCEPTANCE_SLA_MS,
    AcceptancePayload,
    TokenVerification
} from '@/lib/booking/acceptance-token';
import { createCheckoutSession } from '@/lib/payments';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BOOKING_STATUS_ACCEPTED = 'ACCEPTED_BY_PROVIDER' as const;

/** Almacén en memoria de estado para reservas aceptadas (idempotencia y telemetría). */
const acceptedBookingsRegistry = new Map<string, {
    requestId: string;
    providerId: string;
    status: typeof BOOKING_STATUS_ACCEPTED;
    acceptedAt: string;
    checkoutUrl: string;
    depositAmountEur: number;
}>();

interface AcceptRequestBody {
    token?: string;
    notes?: string;
    confirmedFeeEur?: number;
}

/**
 * GET /api/booking/accept?token=...
 * Valida el token criptográfico HMAC SHA-256 sin consumir ni mutar estado.
 * Devuelve información de la reserva, tiempo restante del SLA de 2 horas
 * y honorarios netos calculados según el Split Soberano del 80%.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
    try {
        const token = req.nextUrl.searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Token criptográfico de aceptación requerido.' },
                { status: 400 }
            );
        }

        const verification: TokenVerification = verifyAcceptanceToken(token);

        if (!verification.valid) {
            const errorMessages: Record<string, string> = {
                MALFORMED: 'El enlace de aceptación está corrupto o incompleto.',
                BAD_SIGNATURE: 'Firma criptográfica inválida (posible manipulación de URL).',
                EXPIRED: 'La ventana de exclusividad de 2 horas para este bolo ha expirado.',
                NO_SECRET: 'Servidor no configurado para validación criptográfica.'
            };

            return NextResponse.json(
                {
                    success: false,
                    reason: verification.reason,
                    error: errorMessages[verification.reason] ?? 'Token no válido.'
                },
                { status: verification.status }
            );
        }

        const { payload, remainingMs } = verification;
        const alreadyAccepted = acceptedBookingsRegistry.get(payload.requestId);

        return NextResponse.json({
            success: true,
            valid: true,
            status: alreadyAccepted ? alreadyAccepted.status : 'PENDING_ACCEPTANCE',
            payload,
            remainingMs,
            slaTotalMs: ACCEPTANCE_SLA_MS,
            depositAmountEur: DEPOSITO_STRIPE_EUR,
            splitNetoArtistaPct: SPLIT_SOBERANO.artista * 100, // 80%
            alreadyAccepted: Boolean(alreadyAccepted),
            checkoutUrl: alreadyAccepted ? alreadyAccepted.checkoutUrl : null
        });
    } catch (err) {
        console.error('[booking/accept][GET] Error interno:', err instanceof Error ? err.message : String(err));
        return NextResponse.json(
            { success: false, error: 'Error interno al verificar la invitación.' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/booking/accept
 * Formaliza la aceptación del artista/proveedor:
 * 1. Valida el token HMAC SHA-256 (ventana SLA 2 horas).
 * 2. Transiciona el estado a 'ACCEPTED_BY_PROVIDER'.
 * 3. Genera la sesión de Stripe Checkout para el depósito de 100 € (DEPOSITO_STRIPE_EUR).
 * 4. Despacha telemetría y webhooks a n8n en background.
 * 5. Devuelve la checkoutUrl para formalizar la fianza.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        let bodyRaw: unknown;
        try {
            bodyRaw = await req.json();
        } catch {
            return NextResponse.json(
                { success: false, error: 'Cuerpo de solicitud JSON inválido.' },
                { status: 400 }
            );
        }

        if (typeof bodyRaw !== 'object' || bodyRaw === null) {
            return NextResponse.json(
                { success: false, error: 'El cuerpo debe ser un objeto JSON.' },
                { status: 400 }
            );
        }

        const body = bodyRaw as AcceptRequestBody;
        const token = body.token ?? req.nextUrl.searchParams.get('token');

        if (!token || typeof token !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Token criptográfico de aceptación ausente.' },
                { status: 400 }
            );
        }

        const verification: TokenVerification = verifyAcceptanceToken(token);

        if (!verification.valid) {
            return NextResponse.json(
                {
                    success: false,
                    reason: verification.reason,
                    error: verification.reason === 'EXPIRED'
                        ? 'La ventana de exclusividad de 2 horas ha vencido.'
                        : 'Token de aceptación inválido o firma manipulada.'
                },
                { status: verification.status }
            );
        }

        const payload: AcceptancePayload = verification.payload;
        const existing = acceptedBookingsRegistry.get(payload.requestId);

        if (existing) {
            return NextResponse.json({
                success: true,
                status: BOOKING_STATUS_ACCEPTED,
                requestId: payload.requestId,
                providerId: payload.providerId,
                depositAmountEur: DEPOSITO_STRIPE_EUR,
                checkoutUrl: existing.checkoutUrl,
                acceptedAt: existing.acceptedAt,
                message: 'Bolo ya aceptado previamente. Utilice el enlace de pago generado.'
            });
        }

        // Generación de Sesión de Stripe Checkout con Depósito SSOT (100 €)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com';
        let checkoutUrl = `${baseUrl}/checkout/presupuesto?format=Fianza&deposit=${DEPOSITO_STRIPE_EUR}&requestId=${encodeURIComponent(payload.requestId)}`;
        let stripeSessionId: string | null = null;

        try {
            const stripeSession = await createCheckoutSession({
                amount: DEPOSITO_STRIPE_EUR,
                concept: `Depósito de Reserva y Bloqueo de Fecha (${payload.requestId})`,
                metadata: {
                    requestId: payload.requestId,
                    providerId: payload.providerId,
                    status: BOOKING_STATUS_ACCEPTED,
                    depositEur: String(DEPOSITO_STRIPE_EUR),
                    source: 'booking_accept_flow'
                }
            });

            if (stripeSession?.url) {
                checkoutUrl = stripeSession.url;
                stripeSessionId = stripeSession.id;
            }
        } catch (stripeErr) {
            console.warn(
                '[booking/accept] Fallback Stripe Checkout (modo offline/dev):',
                stripeErr instanceof Error ? stripeErr.message : String(stripeErr)
            );
            // Mantiene checkoutUrl en fallback canónico para no bloquear el flujo
        }

        const acceptedAt = new Date().toISOString();

        // Registro atómico del estado ACCEPTED_BY_PROVIDER
        const record = {
            requestId: payload.requestId,
            providerId: payload.providerId,
            status: BOOKING_STATUS_ACCEPTED,
            acceptedAt,
            checkoutUrl,
            depositAmountEur: DEPOSITO_STRIPE_EUR
        };
        acceptedBookingsRegistry.set(payload.requestId, record);

        // Despacho no bloqueante al clúster n8n (Stripe Price-Lock y Call Center)
        fireAndForgetN8n('stripe-price-lock', {
            event: 'PROVIDER_ACCEPTED',
            status: BOOKING_STATUS_ACCEPTED,
            requestId: payload.requestId,
            providerId: payload.providerId,
            depositAmountEur: DEPOSITO_STRIPE_EUR,
            checkoutUrl,
            stripeSessionId,
            acceptedAt,
            centralita: CENTRALITA_EAR_OS
        });

        fireAndForgetN8n('call-center-intake', {
            source: 'booking_acceptance_flow',
            action: 'DISPATCH_CLIENT_DEPOSIT_LINK',
            status: BOOKING_STATUS_ACCEPTED,
            requestId: payload.requestId,
            providerId: payload.providerId,
            checkoutUrl,
            acceptedAt
        });

        return NextResponse.json({
            success: true,
            status: BOOKING_STATUS_ACCEPTED,
            requestId: payload.requestId,
            providerId: payload.providerId,
            depositAmountEur: DEPOSITO_STRIPE_EUR,
            checkoutUrl,
            acceptedAt,
            message: 'Bolo formalmente aceptado. Depósito de 100 € desbloqueado para formalización del cliente.'
        }, { status: 200 });

    } catch (err) {
        console.error('[booking/accept][POST] Error crítico:', err instanceof Error ? err.message : String(err));
        return NextResponse.json(
            { success: false, error: 'Error interno al procesar la aceptación de la reserva.' },
            { status: 500 }
        );
    }
}
