import Stripe from 'stripe';

// Configuración con versión de API Dahlia para compatibilidad total
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { 
  apiVersion: '2026-04-22.dahlia' 
});

export async function createCheckoutSession(params: { 
  amount: number; 
  concept: string; 
  artistId?: string; // Para Stripe Connect o seguimiento
  provincia?: string; // Mapa de calor SEO
  evento?: string; // AI metadata
  metadata?: Record<string, string>; 
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'klarna', 'revolut_pay'],
      mode: 'payment',
      billing_address_collection: 'required',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: params.concept,
              description: params.provincia && params.evento 
                ? `Servicio de Mariachi en ${params.provincia} - ${params.evento}`
                : 'Reserva Premium EAR OS',
            },
            unit_amount: Math.round(params.amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        ...params.metadata,
        artistId: params.artistId || 'productora-ear',
        provincia: params.provincia || 'n/a',
        evento: params.evento || 'n/a',
        source: 'EAR_OS_DOMINANCE_ENGINE'
      },
      // Descomentar cuando Stripe Connect esté configurado para splits automáticos
      // payment_intent_data: {
      //   application_fee_amount: 1500,
      //   transfer_data: { destination: params.artistId },
      // },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com'}/success?session_id={CHECKOUT_SESSION_ID}&provincia=${params.provincia || ''}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://productoraear.com'}/servicios/mariachis/${params.provincia || ''}`,
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

export const createArtistVerificationSession = async (artistId: string) => {
  const { artistVerification } = require('../config/stripe-products');

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: artistVerification.name,
          },
          unit_amount: artistVerification.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
    metadata: {
      type: 'artist_verification',
      artistId: artistId
    }
  });

  return session.url;
};
