import React from 'react';
import type { Metadata } from 'next';
import { OtzarretaExecutiveDeck } from '@/components/otzarreta/OtzarretaExecutiveDeck';

export const metadata: Metadata = {
  title: 'Alianza Soberana · Restaurante Otzarreta (Derio) & Productora EAR',
  description:
    'Presentación ejecutiva de cierre para Eduardo Martínez: Infraestructura agéntica 24/7, clúster de dominancia en Bizkaia y comparativa de modelos de alianza para Restaurante Otzarreta (Derio).',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AlianzaOtzarretaPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#030305] text-zinc-100 flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-4 selection:bg-[#ecb613] selection:text-black">
      <OtzarretaExecutiveDeck />
    </main>
  );
}
