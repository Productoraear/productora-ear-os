import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { CorporateAgreementBookingCockpit } from '@/components/booking/CorporateAgreementBookingCockpit';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acuerdo Oficial & Reserva de Fecha | Productora EAR',
  description:
    'Hoja de encargo, condiciones contractuales y bloqueo atómico de fecha para eventos corporativos, galas y bodas con fianza deducible vía Stripe Price-Lock.',
};

export default function CorporateAgreementPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-zinc-100 font-sans pt-24 pb-20 px-4 sm:px-6 selection:bg-[#ecb613] selection:text-black">
      <Suspense
        fallback={
          <div className="max-w-6xl mx-auto p-12 text-center text-zinc-500 font-mono text-xs">
            Cargando Hoja de Acuerdo y Motor de Disponibilidad...
          </div>
        }
      >
        <CorporateAgreementBookingCockpit />
      </Suspense>
    </main>
  );
}

