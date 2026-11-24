import React from 'react';
import type { Metadata } from 'next';
import { LumenNoiseGrain } from '@/components/lumen/LumenNoiseGrain';
import SovereignScrollytellingStage from '@/components/spatial/SovereignScrollytellingStage';

export const metadata: Metadata = {
  title: 'Productora EAR · Distribuidor Soberano de Contratación Directa (52 Provincias)',
  description:
    'Distribuidor nacional de contratación directa en las 52 provincias de España: Fincas, Caseríos y Asadores Homologados, Roster Artístico S-Class (Edwin Agudelo y agrupaciones de gala) e Ingeniería Acústica & Alquiler de Sonido Line Array.',
  alternates: {
    canonical: 'https://productoraear.com',
  },
  openGraph: {
    title: 'Productora EAR · Distribuidor Soberano de Contratación Directa (52 Provincias)',
    description:
      'Gastronomía y Fincas Homologadas en toda España, Música en Directo (Edwin Agudelo) y Sonorización Profesional Line Array sin intermediarios.',
    url: 'https://productoraear.com',
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website',
  },
};

/**
 * Escenario de Scrollytelling Cinemático Awwwards-tier S-Class.
 * Contenedor maestro con sticky pinning de 4 actos gobernados por useScroll continuo.
 * CLS = 0,000 mediante anclaje de viewport estricto y geometría inmutable.
 */
export default function Home(): React.JSX.Element {
  return (
    <main className="bg-[#030305] relative w-full max-w-full min-h-screen overflow-x-hidden text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black pt-24 pb-28">
      <LumenNoiseGrain />
      <SovereignScrollytellingStage />
    </main>
  );
}
