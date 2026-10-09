/**
 * @file useStripe.tsx
 * @description Hook personalizado para interactuar con la instancia de Stripe.
 * Basado en la arquitectura S-Class recuperada.
 */

import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';

// 🔒 FAIL-CLOSED STRIPE CLIENT (BLINDAJE SESSION_SECRET P0): sin public key real, no se carga Stripe.
const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export const useStripe = () => {
    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initStripe = async () => {
            try {
                // 🔒 FAIL-CLOSED: sin public key real, no se instancia Stripe (jamás clave falsa).
                if (!STRIPE_PUBLIC_KEY || STRIPE_PUBLIC_KEY === 'pk_test_placeholder') {
                    console.error('[USE_STRIPE] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no configurada (fail-closed).');
                    setStripe(null);
                } else {
                    const stripeInstance = await loadStripe(STRIPE_PUBLIC_KEY);
                    setStripe(stripeInstance);
                }
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
