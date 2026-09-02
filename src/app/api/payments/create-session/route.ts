import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/lib/payments';

// ============================================================================
// 💳 STRIPE SESSION HANDLER (S-CLASS)
// ============================================================================

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, concept, metadata } = body;

    if (!amount || !concept) {
      return NextResponse.json(
        { error: 'MISSING_PAYMENT_PARAMETERS', details: 'Amount and concept are required.' },
        { status: 400 }
      );
    }

    // Ejecutar creación real vía SDK
    const session = await createCheckoutSession({
      amount: Number(amount),
      concept: String(concept),
      metadata: metadata || {}
    });

    return NextResponse.json({
      id: session.id,
      url: session.url,
      status: 'READY'
    });

  } catch (error: any) {
    console.error('❌ [STRIPE_API_FAILURE]:', error);
    return NextResponse.json(
      { 
        error: 'STRIPE_SESSION_ERROR', 
        details: error.message || 'Error interno en la pasarela de pagos.' 
      },
      { status: 500 }
    );
  }
}
