import Stripe from 'stripe';
// Configuración con versión de API Dahlia para compatibilidad total
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key_for_build', {
    apiVersion: '2026-04-22.dahlia'
});
export async function createCheckoutSession(params) {
    try {
        const session = await stripe.checkout.sessions.create({
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
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}
export const createArtistVerificationSession = async (params) => {
    const { artistVerification } = require('../config/stripe-products');
    if (params.amount !== 1) {
        throw new Error('El monto del pago debe ser de 1€');
    }
    const session = await stripe.checkout.sessions.create({
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
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
        metadata: {
            type: 'artist_verification',
            artistId: params.artistId
        }
    });
    return session.url;
};
