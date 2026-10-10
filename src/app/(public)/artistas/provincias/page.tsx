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

interface JsonLdOffer {
  '@type': 'Offer';
  price: string;
  priceCurrency: 'EUR';
  availability: string;
  url: string;
  seller: {
    '@type': 'Organization';
    name: string;
    telephone: string;
  };
}

interface JsonLdProduct {
  '@context': 'https://schema.org';
  '@type': 'Product';
  name: string;
  description: string;
  brand: {
    '@type': 'Brand';
    name: string;
  };
  offers: JsonLdOffer;
}

const jsonLd: JsonLdProduct = {
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

function ProvinciasLoadingFallback(): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando cobertura territorial de artistas por provincias"
      className="min-h-screen w-full overflow-x-hidden bg-[#030305] pt-40"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 text-center">
        <div
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-white/60 motion-reduce:animate-none"
        />
        <p className="font-mono text-xs uppercase tracking-widest text-white/40">
          Cargando cobertura territorial…
        </p>
        <div
          aria-hidden="true"
          className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-lg border border-white/5 bg-white/[0.02] motion-reduce:animate-none"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ArtistasProvinciasPage(): React.JSX.Element {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense fallback={<ProvinciasLoadingFallback />}>
        <ArtistasProvinciasClient />
      </Suspense>
    </>
  );
}