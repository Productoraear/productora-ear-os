import React from 'react';
import { EdwinAgudeloDossier } from '@/features/artists/ui/EdwinAgudeloDossier';
import PublicNavbar from '@/app/components/public/PublicNavbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edwin Agudelo | Artista Principal | Productora EAR',
  description: 'Dossier de alta especialización de Edwin Agudelo. La vanguardia en Mariachi, Banda y Corridos para eventos institucionales y privados.',
};

export default function EdwinAgudeloPage() {
  return (
    <main className="min-h-screen bg-[#050505]">
      <PublicNavbar />
      <EdwinAgudeloDossier />
    </main>
  );
}
