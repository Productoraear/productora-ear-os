import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
    if (!stripePromise) {
        // Reemplazar con tu propia Public Key de Stripe
        stripePromise = loadStripe('pk_test_51QXXXXXXXXXXXXXXXXXXXXXXXXXXXX'); // PON TU PUBLIC KEY AQUÍ
    }
    return stripePromise;
};

export const createCheckoutSession = async (data: {
    providerId: string;
    providerName: string;
    amount: number;
    date: string;
    location: string;
    extras: any[];
}) => {
    // URL de la Cloud Function (ajustar después de deploy)
    // Desarrollo local: http://127.0.0.1:5001/productora-ear-backend/us-central1/createStripeCheckoutSession
    // Producción: https://us-central1-productora-ear-backend.cloudfunctions.net/createStripeCheckoutSession

    const FUNCTION_URL = window.location.hostname === 'localhost'
        ? 'http://127.0.0.1:5001/productora-ear-backend/us-central1/createStripeCheckoutSession'
        : 'https://us-central1-productora-ear-backend.cloudfunctions.net/createStripeCheckoutSession';

    const response = await fetch(FUNCTION_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Error al crear la sesión de pago');
    }

    const session = await response.json();
    return session;
};
