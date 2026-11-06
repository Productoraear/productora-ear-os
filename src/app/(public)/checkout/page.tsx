import React from 'react';
import type { Metadata } from 'next';
import { SovereignFullCheckoutExperience } from '@/components/checkout/SovereignFullCheckoutExperience';

export const metadata: Metadata = {
  title: 'Pasarela de Pago Segura · Productora EAR OS',
  description: 'Proceso de contratación y pago editable con garantía Price-Lock SHA-256 e idempotencia 1:1.',
};

export default function CheckoutPage() {
  return (
    <main>
      <SovereignFullCheckoutExperience />
    </main>
  );
}

