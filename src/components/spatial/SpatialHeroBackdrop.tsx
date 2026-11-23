'use client';

import React from 'react';
import dynamic from 'next/dynamic';

/**
 * Carga diferida del lienzo de la capa 0. `ssr: false` solo es válido en un módulo cliente.
 * El placeholder reserva la misma geometría (absolute inset-0) para CLS 0.
 */
const SovereignSpatialCanvas = dynamic(() => import('./SovereignSpatialCanvas'), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="absolute inset-0 z-0 bg-[#030305]" />,
});

export default function SpatialHeroBackdrop(): React.JSX.Element {
  return <SovereignSpatialCanvas />;
}
