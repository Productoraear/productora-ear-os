import type { VanguardiaVariant } from '@/components/vanguardia/vanguardia-theme';

export type ShowcaseId = 'hero' | 'bento' | 'orb' | 'tilt' | 'dock';

export type CostLevel = 'Bajo' | 'Medio';

export interface ShowcaseEntry {
  id: ShowcaseId;
  name: string;
  file: string;
  usage: string;
  /** Estimacion cualitativa por analisis de la tecnica; NO es una medicion (AF-2). */
  cost: CostLevel;
  technique: string;
  mobile: string;
  buildSnippet: (variant: VanguardiaVariant) => string;
}

export const SHOWCASE_ENTRIES: readonly ShowcaseEntry[] = [
  {
    id: 'hero',
    name: 'Hero Cinematico de Particulas',
    file: 'src/components/vanguardia/CinematicParticleHero.tsx',
    usage: 'Portada de Productora EAR y landing de Bodas',
    cost: 'Medio',
    technique: 'Canvas 2D con 56 particulas, pausa fuera de viewport y en pestana oculta; estatico con reduced-motion.',
    mobile: 'Altura minima fija 560 px (sin layout shift). CTA magnetico solo con puntero de raton.',
    buildSnippet: (variant) =>
      `import CinematicParticleHero from '@/components/vanguardia/CinematicParticleHero';\n\n<CinematicParticleHero variant="${variant}" ctaHref="/reservar" />`,
  },
  {
    id: 'bento',
    name: 'Bento Grid Transaccional',
    file: 'src/components/vanguardia/SovereignBentoGrid.tsx',
    usage: 'Ficha de Otzarreta y catalogo de artistas',
    cost: 'Bajo',
    technique: 'CSS Grid y cristal ahumado; cifras de aforo, parking y techo acustico leidas del SSOT.',
    mobile: 'Una columna en movil, dos en tablet, cuatro en escritorio. Geometria fija en el plano de mesas.',
    buildSnippet: (variant) =>
      `import SovereignBentoGrid from '@/components/vanguardia/SovereignBentoGrid';\n\n<SovereignBentoGrid variant="${variant}" title="Caserio Otzarreta" />`,
  },
  {
    id: 'orb',
    name: 'Orbe de Luz Ambiental',
    file: 'src/components/vanguardia/AmbientGlowOrb.tsx',
    usage: 'Esquinas y trasfondo de tarjetas (padre relative + overflow-hidden)',
    cost: 'Bajo',
    technique: 'Un gradiente radial CSS estatico. Sin blur, sin animacion, sin canvas ni WebGL.',
    mobile: 'Sin trabajo continuo de GPU; se pinta una vez.',
    buildSnippet: (variant) =>
      `import AmbientGlowOrb from '@/components/vanguardia/AmbientGlowOrb';\n\n<div className="relative overflow-hidden rounded-3xl">\n  <AmbientGlowOrb variant="${variant}" position="top-right" size={320} />\n</div>`,
  },
  {
    id: 'tilt',
    name: 'Resena con Tilt 3D',
    file: 'src/components/vanguardia/TiltReviewCard.tsx',
    usage: 'Prueba social con valoraciones reales',
    cost: 'Bajo',
    technique: 'Resortes de framer-motion; SHA-256 con Web Crypto nativo (cero dependencias).',
    mobile: 'El tilt se desactiva con puntero tactil; la tarjeta queda estatica y legible.',
    buildSnippet: (variant) =>
      `import TiltReviewCard from '@/components/vanguardia/TiltReviewCard';\n\n<TiltReviewCard\n  variant="${variant}"\n  review={{ author, context, text, rating, sha256 }}\n/>`,
  },
  {
    id: 'dock',
    name: 'Dock Flotante Soberano',
    file: 'src/components/vanguardia/SovereignDock.tsx',
    usage: 'Barra inferior de accesos rapidos, movil y escritorio',
    cost: 'Bajo',
    technique: 'Magnificacion por resorte solo con raton; el Maitre se abre con el evento open-ai-concierge.',
    mobile: 'Objetivos tactiles de 44 px o mas, respeta safe-area-inset-bottom.',
    buildSnippet: (variant) =>
      `import SovereignDock from '@/components/vanguardia/SovereignDock';\n\n<SovereignDock variant="${variant}" placement="fixed" />`,
  },
];
