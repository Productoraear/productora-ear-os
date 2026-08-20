import { Metadata } from 'next';
import FincasLandingClient from './FincasLandingClient';

export const metadata: Metadata = {
  title: 'Fincas para Bodas en Madrid y Toledo | Espacios Exclusivos Sin Comisiones',
  description: 'Alquiler de fincas exclusivas para bodas en Madrid, Toledo y Guadalajara. Presupuesto transparente, libertad de catering y acústica auditada para música en vivo.',
  keywords: [
    'fincas para bodas en madrid',
    'fincas para bodas en toledo',
    'alquiler de fincas bodas',
    'fincas con encanto bodas',
    'fincas de boda sin exclusividad',
    'fincas de boda con alojamiento'
  ],
  alternates: {
    canonical: 'https://fincasparaboda.com/fincas-landing',
  },
  openGraph: {
    title: 'Fincas para Bodas en Madrid y Toledo | Sin Comisiones Ocultas',
    description: 'Encuentra el espacio perfecto para tu boda con acústica auditada y libertad total de proveedores.',
    url: 'https://fincasparaboda.com/fincas-landing',
    siteName: 'FincasParaBoda.com',
    images: [
      {
        url: 'https://fincasparaboda.com/og-fincas.jpg',
        width: 1200,
        height: 630,
        alt: 'Fincas Exclusivas para Bodas en Madrid y Toledo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Fincas de Bodas en Madrid y Toledo',
    description: 'Catálogo de fincas verificadas para bodas en la zona centro de España.',
    url: 'https://fincasparaboda.com/fincas-landing',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Fincas para Bodas en Madrid',
        url: 'https://fincasparaboda.com/fincas-bodas-madrid'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Fincas para Bodas en Toledo',
        url: 'https://fincasparaboda.com/fincas-bodas-toledo'
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <FincasLandingClient />
    </>
  );
}
