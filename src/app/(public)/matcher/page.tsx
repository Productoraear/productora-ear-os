import React from 'react';
import { Metadata } from 'next';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';
import { TinderNeuralMatcher } from '@/features/matchmaker/ui/TinderNeuralMatcher';

export const metadata: Metadata = {
  title: 'Tinder Neural Matcher S-Class & Despacho Uber | Productora EAR',
  description: 'Matching inteligente estilo Tinder con presupuesto final con IVA 21% incluido, validación de franjas horarias y cascada de relevo tipo Uber.',
};

export default function MatcherPage() {
  return (
    <MeshGradientBackground intensity="stage">
      <main className="min-h-screen pt-28 sm:pt-32 pb-40 px-4 md:px-8">
        <TinderNeuralMatcher />
      </main>
    </MeshGradientBackground>
  );
}
