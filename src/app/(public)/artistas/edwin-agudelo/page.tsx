import React from 'react';
import { EdwinAgudeloDossier } from '@/features/artists/ui/EdwinAgudeloDossier';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edwin Agudelo | Master Artist S-Class | Productora EAR',
  description: 'Dossier de alta fidelidad de Edwin Agudelo. La vanguardia absoluta en Mariachi, Banda y Corridos para eventos VIP.',
};

export default function EdwinAgudeloPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <PredatorNav />
      <EdwinAgudeloDossier />
    </main>
  );
}
