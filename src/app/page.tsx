import React from 'react';
import type { Metadata } from 'next';
import { LumenNoiseGrain } from '@/components/lumen/LumenNoiseGrain';
import { CinematicHeroSpot } from '@/components/home/CinematicHeroSpot';
import { SovereignThreeDoorsDistributor } from '@/components/home/SovereignThreeDoorsDistributor';

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
 * Escaparate Cinematográfico "Champagne & Noche de Gala" sobre base #040407
 * (compatibilidad con estándar Aura Onyx #030305).
 * Cabecera: hero cinematográfico de 4 actos (Taste Engine Velocity) con motor
 * Canvas 2D aislado en cliente. Debajo, el Distribuidor Soberano de 3 Puertas
 * hacia los embudos asistidos. Cero apilamiento vertical mono-proveedor.
 *
 * NOTA DE ARQUITECTURA (sticky): `overflow-x-clip` sustituye a `overflow-x-hidden`
 * porque `overflow-x: hidden` convierte `<main>` en scroll container y anularía
 * el `position: sticky` del stage del hero (el clipping visual se mantiene).
 */
export default function Home(): React.JSX.Element {
  return (
    <main
      className="bg-[#040407] relative w-full max-w-full min-h-screen overflow-x-clip text-[#f4f4f5] font-sans selection:bg-[#ecb613] selection:text-[#040407] pb-20"
      style={{
        backgroundImage:
          'radial-gradient(ellipse at 50% 0%, rgba(236,182,19,0.12) 0%, rgba(4,4,7,0.98) 75%)',
      }}
    >
      <CinematicHeroSpot />
      <LumenNoiseGrain />
      <SovereignThreeDoorsDistributor />
    </main>
  );
}
