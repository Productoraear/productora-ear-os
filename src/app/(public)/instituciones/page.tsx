import React from 'react';
import { Metadata } from 'next';
import B2GInstitutionalPortal from '@/components/b2g/B2GInstitutionalPortal';
import {
  TARIFA_BASE_SOLISTA_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Canal Instituciones & Administraciones Públicas (Art. 118 LCSP) | Productora EAR',
  description:
    'Gabinete técnico para Administraciones Locales, Ayuntamientos y Diputaciones. Contratación menor simplificada, facturación FACe y programas ODS 2030. Tarifa Solista desde 350 €.',
  alternates: {
    canonical: 'https://productoraear.com/instituciones',
  },
};

const institutionalOfferJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Producción Audiovisual Institucional — Tarifa Solista',
  description:
    'Servicio de producción audiovisual para Administraciones Públicas bajo Art. 118 LCSP. Contratación menor simplificada, facturación FACe y programas ODS 2030.',
  brand: {
    '@type': 'Brand',
    name: 'Productora EAR',
  },
  offers: {
    '@type': 'Offer',
    url: 'https://productoraear.com/reservar/solista',
    priceCurrency: 'EUR',
    price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
    availability: 'https://schema.org/InStock',
    seller: {
      '@type': 'Organization',
      name: 'Productora EAR',
      telephone: CENTRALITA_EAR_OS,
      url: 'https://productoraear.com',
    },
  },
};

export default function InstitucionesPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(institutionalOfferJsonLd) }}
      />
      <B2GInstitutionalPortal />
    </main>
  );
}