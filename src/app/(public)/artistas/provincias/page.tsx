import type { Metadata } from 'next';
import { Suspense } from 'react';
import ArtistasProvinciasClient from './ArtistasProvinciasClient';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Artistas y Mariachis por Provincias | Productora EAR',
  description: `Cobertura nacional de Edwin Agudelo y formatos S-Class (Solista ${TARIFA_BASE_SOLISTA_EUR} €, Dúo 480 €, Quinteto 750 €) en todas las provincias. Reserva directa en 60 segundos con Price-Lock ${DEPOSITO_STRIPE_EUR} €.`,
  alternates: {
    canonical: 'https://productoraear.com/artistas/provincias',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Artistas y Mariachis por Provincias — Productora EAR',
  description:
    'Cobertura nacional de artistas S-Class por provincias. Tarifa Solista con Price-Lock y reserva directa.',
  brand: {
    '@type': 'Brand',
    name: 'Productora EAR',
  },
  offers: {
    '@type': 'Offer',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
    url: 'https://productoraear.com/reservar/solista',
    seller: {
      '@type': 'Organization',
      name: 'Productora EAR',
      telephone: CENTRALITA_EAR_OS,
    },
  },
};

export default function ArtistasProvinciasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="min-h-screen w-full overflow-x-hidden bg-[#030305] pt-40 text-center font-mono text-xs uppercase tracking-widest text-white/40">
            Cargando cobertura territorial…
          </div>
        }
      >
        <ArtistasProvinciasClient />
      </Suspense>
    </>
  );
}