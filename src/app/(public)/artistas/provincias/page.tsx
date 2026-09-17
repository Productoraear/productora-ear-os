import type { Metadata } from 'next';
import { Suspense } from 'react';
import ArtistasProvinciasClient from './ArtistasProvinciasClient';

export const metadata: Metadata = {
  title: 'Artistas y Mariachis por Provincias | Productora EAR',
  description:
    'Cobertura nacional de Edwin Agudelo y formatos S-Class (Solista 350 €, Dúo 480 €, Quinteto 750 €) en todas las provincias. Reserva directa en 60 segundos con Price-Lock 100 €.',
  alternates: {
    canonical: 'https://productoraear.com/artistas/provincias',
  },
};

export default function ArtistasProvinciasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#030305] pt-40 text-center font-mono text-xs text-white/40 uppercase tracking-widest">
          Cargando cobertura territorial…
        </div>
      }
    >
      <ArtistasProvinciasClient />
    </Suspense>
  );
}