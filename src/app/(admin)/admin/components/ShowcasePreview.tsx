'use client';

import React from 'react';
import AmbientGlowOrb from '@/components/vanguardia/AmbientGlowOrb';
import CinematicParticleHero from '@/components/vanguardia/CinematicParticleHero';
import SovereignBentoGrid from '@/components/vanguardia/SovereignBentoGrid';
import SovereignDock from '@/components/vanguardia/SovereignDock';
import TiltReviewCard from '@/components/vanguardia/TiltReviewCard';
import type { TiltReview } from '@/components/vanguardia/TiltReviewCard';
import { getVanguardiaTheme } from '@/components/vanguardia/vanguardia-theme';
import type { VanguardiaVariant } from '@/components/vanguardia/vanguardia-theme';
import type { ShowcaseId } from './showcase-registry';

/** Maqueta de composicion. NO es una resena real: nunca se publica (JUR-4). */
const MOCK_REVIEW: TiltReview = {
  author: 'Nombre de ejemplo',
  context: 'Evento de ejemplo',
  text: 'Texto de maqueta para comprobar la composicion. En produccion se enlaza una valoracion real almacenada.',
  rating: 5,
};

export interface ShowcasePreviewProps {
  id: ShowcaseId;
  variant: VanguardiaVariant;
}

export default function ShowcasePreview({ id, variant }: ShowcasePreviewProps) {
  const theme = getVanguardiaTheme(variant);
  switch (id) {
    case 'hero':
      return <CinematicParticleHero variant={variant} />;
    case 'bento':
      return <SovereignBentoGrid variant={variant} />;
    case 'orb':
      return (
        <div className={`relative h-[320px] overflow-hidden rounded-3xl border ${theme.canvas} ${theme.border}`}>
          <AmbientGlowOrb variant={variant} position="top-left" size={360} />
          <AmbientGlowOrb variant={variant} position="bottom-right" size={420} intensity={0.2} />
          <div className={`relative flex h-full items-center justify-center font-mono text-xs ${theme.muted}`}>
            Contenido sobre el orbe
          </div>
        </div>
      );
    case 'tilt':
      return (
        <div className={`rounded-3xl p-6 ${theme.canvas}`}>
          <div className="mx-auto max-w-md">
            <TiltReviewCard variant={variant} review={MOCK_REVIEW} />
          </div>
        </div>
      );
    case 'dock':
      return (
        <div className={`flex h-[220px] items-end justify-center rounded-3xl border p-6 ${theme.canvas} ${theme.border}`}>
          <SovereignDock variant={variant} placement="inline" />
        </div>
      );
  }
}
