import React from 'react';
import { Metadata } from 'next';
import JardinesLaCartujaGrandSlam from '@/components/fincas/JardinesLaCartujaGrandSlam';

export const metadata: Metadata = {
  title: 'Jardines La Cartuja · Oferta Irresistible S-Class | EAR OS',
  description: 'Experiencia inmersiva y cotizador en tiempo real para Jardines La Cartuja (El Puig, Valencia). Reserva de depósito de 100 € Price-Lock y garantía acústica S-Class.',
};

export default function JardinesLaCartujaPage() {
  return (
    <div className="w-full min-h-screen bg-[#030305]">
      <JardinesLaCartujaGrandSlam initialEditMode={false} />
    </div>
  );
}
