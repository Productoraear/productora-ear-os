import React from 'react';
import { MultiPricer } from '@/features/finance/ui/MultiPricer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cotizador Premium | Productora EAR',
  description: 'Arquitectura de costes de alta fidelidad para servicios de autor y logística táctica.',
};

export default function CotizadorPage() {
  return (
    <main className="min-h-screen bg-[#050505] pt-32 pb-60">
      <MultiPricer />
    </main>
  );
}
