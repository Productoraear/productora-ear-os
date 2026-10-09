import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments';

// ============================================================================
// 💳 STRIPE SESSION HANDLER (S-CLASS)
// ============================================================================

interface CreateSessionBody {
  amount: number;
  concept: string;
  clientName?: string;
  clientPhone?: string;
  metadata?: Record<string, string | number | undefined>;
}

/**
 * 🛰️ Despacho NO bloqueante del lead a la Centralita n8n (call-center-intake).
 * Garantiza que ningún lead del formulario /checkout/presupuesto quede huérfano:
 * si n8n falla o no responde, la sesión de Stripe continúa sin verse afectada.
 */
function dispatchLeadToCallCenter(url: string, payload: Record<string, string | null>): void {
  void fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => { });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CreateSessionBody;
    const { amount, concept, metadata, clientName, clientPhone } = body;

    if (!amount || !concept) {
      return NextResponse.json(
        { error: 'MISSING_PAYMENT_PARAMETERS', details: 'Amount and concept are required.' },
        { status: 400 }
      );
    }

    // Normalización de metadata a string (Stripe exige valores string).
    const stripeMetadata: Record<string, string> = metadata
      ? Object.fromEntries(
        Object.entries(metadata).map(([key, value]) => [key, String(value)]),
      )
      : {};

    const proveedor = metadata?.providerName ?? metadata?.format;
    const fecha = metadata?.eventDate;

    // 🔔 LEAD INTAKE: solo campos reales del formulario de presupuesto.
    dispatchLeadToCallCenter('https://n8n.productoraear.com/webhook/call-center-intake', {
      source: 'checkout-presupuesto',
      proveedor: proveedor != null ? String(proveedor) : String(concept),
      nombre: clientName ?? null,
      telefono: clientPhone ?? null,
      email: null,
      fecha: fecha != null ? String(fecha) : null,
      invitados: null,
      createdAt: new Date().toISOString(),
    });

    // Ejecutar creación real vía SDK
    const session = await createCheckoutSession({
      amount: Number(amount),
      concept: String(concept),
      metadata: stripeMetadata,
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
      status: 'READY'
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno en la pasarela de pagos.';
    console.error('❌ [STRIPE_API_FAILURE]:', error);
    return NextResponse.json(
      {
        error: 'STRIPE_SESSION_ERROR',
        details: message
      },
      { status: 500 }
    );
  }
}