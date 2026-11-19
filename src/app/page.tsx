import React from 'react';
import type { Metadata } from 'next';
import { SovereignThreeDoorsDistributor } from '@/components/home/SovereignThreeDoorsDistributor';
import { LumenNoiseGrain } from '@/components/lumen/LumenNoiseGrain';

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

export default function Home(): React.JSX.Element {
  return (
    <main className="bg-[#030305] relative w-full max-w-full min-h-screen overflow-x-hidden text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black pt-20 sm:pt-24 pb-16">
      {/* Textura de Grano de Ruido SVG Acelerada por GPU */}
      <LumenNoiseGrain />

      {/* DISTRIBUIDOR SOBERANO: ARQUITECTURA DE TRES PUERTAS (AURA ONYX) */}
      <SovereignThreeDoorsDistributor />
    </main>
  );
}
