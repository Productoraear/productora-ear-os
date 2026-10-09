import Stripe from 'stripe';

// 🔒 FAIL-CLOSED STRIPE (BLINDAJE SESSION_SECRET P0) — PEREZOSO.
// El módulo se importa SIEMPRE con éxito (no colapsa build/CI sin clave).
// La verificación fail-closed ocurre en el PRIMER uso real de la instancia:
// sin secreto legítimo, la operación lanza excepción (Defensa en Profundidad).
const DUMMY_BUILD_KEY = 'sk_test_dummy_key_for_build';

let _stripeInstance: Stripe | null = null;

function resolveStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key === DUMMY_BUILD_KEY) {
    throw new Error('[STRIPE] STRIPE_SECRET_KEY no configurado en el servidor (fail-closed).');
  }

  if (!_stripeInstance) {
    _stripeInstance = new Stripe(key, {
      apiVersion: '2026-07-29.dahlia' as unknown as '2026-07-29.dahlia',
    });
  }

  return _stripeInstance;
}

/** Acceso tipado y explícito a la instancia Stripe (fail-closed en uso). */
export function getStripe(): Stripe {
  return resolveStripe();
}

/**
 * Export de compatibilidad perezoso.
 * Los consumidores actuales (`import { stripe }`) siguen funcionando sin
 * romperse en import, pero la instancia se resuelve en el primer acceso real.
 */
export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const real = resolveStripe();
    const value = Reflect.get(real as object, prop, real) as unknown;
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(real);
    }
    return value;
  },
});

export async function createCheckoutSession(params: { amount: number; concept: string; metadata?: Record<string, string>; }) {
  try {
    const client = resolveStripe();
    const session = await client.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: params.concept,
            },
            unit_amount: Math.round(params.amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: params.metadata,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com'}/dashboard`,
    });

    if (!session.url) {
      throw new Error('No se pudo generar la URL de Stripe');
    }

    return { id: session.id, url: session.url };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

export const createArtistVerificationSession = async (params: { amount: number; artistId: string }) => {
  const { artistVerification } = require('../config/stripe-products');

  if (params.amount !== 1) {
    throw new Error('El monto del pago debe ser de 1€');
  }

  const client = resolveStripe();
  const session = await client.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: artistVerification.name,
          },
          unit_amount: Math.round(100), // Convert to cents (1€)
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://productoraear.com'}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://productoraear.com'}/cancel`,
    metadata: {
      type: 'artist_verification',
      artistId: params.artistId
    }
  });

  return session.url;
};