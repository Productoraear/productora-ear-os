/**
 * @file useStripe.tsx
 * @description Hook personalizado para interactuar con la instancia de Stripe.
 * Basado en la arquitectura S-Class recuperada.
 */

import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Reemplazar con la clave pública de EAR OS (debería estar en .env)
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

export const useStripe = () => {
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initStripe = async () => {
            try {
                const stripeInstance = await loadStripe(STRIPE_PUBLIC_KEY);
                setStripe(stripeInstance);
            } catch (error) {
                console.error("Stripe Initialization Failed:", error);
            } finally {
                setLoading(false);
            }
        };

        initStripe();
    }, []);

    return { stripe, loading };
};
