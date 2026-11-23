import React from 'react';
import type { Metadata } from 'next';
import { LumenNoiseGrain } from '@/components/lumen/LumenNoiseGrain';
import SpatialHeroBackdrop from '@/components/spatial/SpatialHeroBackdrop';
import AtmosphericGlowLayers from '@/components/spatial/AtmosphericGlowLayers';
import DomainParallaxStage from '@/components/spatial/DomainParallaxStage';
import SpatialBentoHub from '@/components/spatial/SpatialBentoHub';
import SpatialHomeDock from '@/components/spatial/SpatialHomeDock';
import { CENTRALITA } from '@/lib/phone-constants';

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
 * Narrativa de 4 actos sobre 5 estratos físicos (z-index). Cada acto reserva su altura
 * con geometría fija para CLS 0. Las cifras salen del SSOT; no hay valores quemados.
 */
export default function Home(): React.JSX.Element {
  return (
    <main className="bg-[#030305] relative w-full max-w-full min-h-screen overflow-x-hidden text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black pt-24 pb-28">
      <LumenNoiseGrain />

      {/* ACTO 0 · HERO CINEMÁTICO (100vh, altura reservada) */}
      <section aria-labelledby="hero-titulo" className="relative isolate h-[100svh] min-h-[560px] overflow-hidden">
        <SpatialHeroBackdrop />
        <AtmosphericGlowLayers tone="oro" />
        <div className="relative z-[30] flex h-full flex-col items-center justify-center px-6 text-center">
          <h1 id="hero-titulo" className="max-w-3xl font-[family-name:var(--font-src-syne)] text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
            La Primera Infraestructura Soberana para Grandes Eventos
          </h1>
          <p className="mt-6 max-w-xl text-sm text-zinc-400">
            Fincas, música en directo y sonorización, contratados sin intermediarios.
          </p>
          <div aria-hidden="true" className="absolute bottom-24 flex flex-col items-center gap-2 text-xs text-zinc-400">
            <span className="h-10 w-px animate-bounce bg-[#ecb613]/60 motion-reduce:animate-none" />
            Desliza para explorar
          </div>
        </div>
      </section>

      {/* ACTOS 1 a 3 · VERTICALES GASTRONÓMICA, MUSICAL Y B2G */}
      <section className="relative isolate overflow-hidden py-24">
        <AtmosphericGlowLayers tone="brasa" />
        <DomainParallaxStage domain="gastronomia" />
        <div className="relative z-[40]">
          <SpatialBentoHub />
        </div>
        <DomainParallaxStage domain="musica" />
        <DomainParallaxStage domain="b2g" />
      </section>

      {/* ACTO 4 · CONVERSIÓN SOBERANA (depósito Stripe 100 € y centralita oficial) */}
      <section aria-labelledby="cierre-titulo" className="relative isolate overflow-hidden px-6 py-24 text-center">
        <AtmosphericGlowLayers tone="rubi" />
        <div className="relative z-[40] mx-auto max-w-2xl">
          <h2 id="cierre-titulo" className="font-[family-name:var(--font-src-syne)] text-3xl font-bold text-white">
            Bloquea tu fecha
          </h2>
          <p className="mt-4 text-sm text-zinc-400">
            Depósito deducible de 100,00 € vía Stripe Price-Lock. Centralita oficial: {CENTRALITA.display}.
          </p>
        </div>
      </section>

      {/* CAPA 4 · HUD SOBERANO INMUTABLE (fixed, safe-area) */}
      <SpatialHomeDock />
    </main>
  );
}
