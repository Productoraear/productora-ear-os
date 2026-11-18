import React from 'react';
import type { Metadata } from 'next';
import { OtzarretaExecutiveDeck } from '@/components/otzarreta/OtzarretaExecutiveDeck';

export const metadata: Metadata = {
  title: 'Propuesta Ejecutiva · Restaurante Otzarreta (Derio) & Productora EAR',
  description:
    'Alianza estratégica 2026: Infraestructura agéntica 24/7, clúster de 126 landings transaccionales y garantía de retorno para Restaurante Otzarreta (Derio, Bizkaia).',
  robots: {
    index: false,
    follow: false,
  },
};

export default function PropuestaOtzarretaPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#030305] text-zinc-100 flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-4 selection:bg-[#ecb613] selection:text-black">
      <OtzarretaExecutiveDeck />
    </main>
  );
}
