import React, { Suspense } from 'react';
import { Metadata } from 'next';
import AuraCinematicPortfolio from '@/components/sclass/AuraCinematicPortfolio';
import SovereignConciergeDock from '@/components/sclass/SovereignConciergeDock';

export const metadata: Metadata = {
  title: 'Aura S-Class · Portafolio Cinemático // Productora EAR',
  description:
    'Portafolio cinemático de Productora EAR: 12 producciones activas, 48 shows en 2024, partículas cuánticas GPU, física Matter, 3D tilt y audio FLAC 24-bit.',
};

function AuraPortfolioSkeleton(): React.JSX.Element {
  return (
    <div
      className="w-full min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-6 px-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando portafolio cinemático Aura S-Class"
    >
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-2 border-[#030305] border-t-[#C9A227] animate-spin motion-reduce:animate-none" />
        <div className="absolute inset-2 rounded-full border border-[#C9A227]/20 animate-pulse motion-reduce:animate-none" />
      </div>
      <p className="text-[#C9A227]/80 text-sm tracking-[0.3em] uppercase font-light animate-pulse motion-reduce:animate-none">
        Inicializando Aura S-Class
      </p>
      <span className="sr-only">Cargando portafolio cinemático</span>
    </div>
  );
}

function AuraPortfolioErrorFallback(): React.JSX.Element {
  return (
    <div
      className="w-full min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-4 px-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="w-14 h-14 rounded-full border border-[#C9A227]/40 flex items-center justify-center transition-all duration-700 ease-out hover:border-[#C9A227] hover:shadow-[0_0_25px_-5px_rgba(201,162,39,0.4)] motion-reduce:transition-none">
        <span className="text-[#C9A227] text-2xl font-light">!</span>
      </div>
      <p className="text-[#C9A227] text-lg tracking-[0.2em] uppercase font-light">
        Portafolio temporalmente no disponible
      </p>
      <p className="text-white/60 text-sm max-w-md">
        No pudimos cargar la experiencia cinemática. Por favor recarga la página o contacta al
        concierge soberano.
      </p>
      <button
        type="button"
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
        }}
        className="group relative mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/5 text-[#C9A227] text-xs tracking-[0.25em] uppercase font-light transition-all duration-500 ease-out hover:border-[#C9A227] hover:bg-[#C9A227]/15 hover:shadow-[0_0_30px_-5px_rgba(201,162,39,0.5)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:scale-[0.97] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        aria-label="Recargar portafolio cinemático"
      >
        <span className="relative z-10">Recargar</span>
        <span
          aria-hidden="true"
          className="relative z-10 transition-transform duration-500 ease-out group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          →
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-[#C9A227]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(201,162,39,0.18), transparent 70%)',
          }}
        />
      </button>
    </div>
  );
}

function AuraPortfolioEmptyState(): React.JSX.Element {
  return (
    <div
      className="w-full min-h-screen bg-[#030305] flex flex-col items-center justify-center gap-4 px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-14 h-14 rounded-full border border-[#C9A227]/40 flex items-center justify-center transition-all duration-700 ease-out hover:border-[#C9A227] hover:shadow-[0_0_25px_-5px_rgba(201,162,39,0.4)] hover:scale-105 motion-reduce:transition-none motion-reduce:hover:scale-100">
        <span className="text-[#C9A227] text-2xl font-light">◇</span>
      </div>
      <p className="text-[#C9A227] text-lg tracking-[0.2em] uppercase font-light">
        Sin producciones activas
      </p>
      <p className="text-white/60 text-sm max-w-md">
        El portafolio cinemático está vacío por el momento. Nuevas producciones S-Class se
        publicarán próximamente.
      </p>
    </div>
  );
}

function AuraConciergeSkeleton(): React.JSX.Element {
  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#030305] border border-[#C9A227]/30 animate-pulse motion-reduce:animate-none"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando concierge soberano"
    >
      <span className="sr-only">Cargando concierge soberano</span>
    </div>
  );
}

export default function AuraShowcasePage(): React.JSX.Element {
  return (
    <main className="relative w-full min-h-screen bg-[#030305] overflow-x-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.06),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-1000 ease-out hover:opacity-100 motion-reduce:transition-none"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(201,162,39,0.04), transparent 65%)',
        }}
      />
      <div className="relative z-10">
        <Suspense fallback={<AuraPortfolioSkeleton />}>
          <AuraCinematicPortfolio />
        </Suspense>
        <Suspense fallback={<AuraConciergeSkeleton />}>
          <SovereignConciergeDock
            providerName="Edwin Agudelo (Tenor Lírico S-Class)"
            category="Solista Insignia"
          />
        </Suspense>
      </div>
    </main>
  );
}

export {
  AuraPortfolioSkeleton,
  AuraPortfolioErrorFallback,
  AuraPortfolioEmptyState,
  AuraConciergeSkeleton,
};