import React from 'react';
import { Metadata } from 'next';
import AuraCinematicPortfolio from '@/components/sclass/AuraCinematicPortfolio';
import SovereignConciergeDock from '@/components/sclass/SovereignConciergeDock';

export const metadata: Metadata = {
  title: 'Aura S-Class · Portafolio Cinemático // Productora EAR',
  description: 'Vampirización de la plantilla Aura en EAR OS. Motion-first luxury portfolio con partículas cuánticas GPU, física Matter, 3D tilt y audio FLAC.',
};

export default function AuraShowcasePage() {
  return (
    <main className="w-full min-h-screen bg-[#030305]">
      <AuraCinematicPortfolio />
      <SovereignConciergeDock
        providerName="Edwin Agudelo (Tenor Lírico S-Class)"
        category="Solista Insignia"
      />
    </main>
  );
}
