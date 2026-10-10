import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import type { ReactElement } from 'react';

const SITE_URL = 'https://productoraear.com';
const CANONICAL_PATH = '/afiliados';
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

const PAGE_TITLE = 'Programa de Afiliados | Productora EAR';
const PAGE_DESCRIPTION =
  'Programa de Afiliados de Productora EAR: comisión del 30% por venta, cookie de atribución de 60 días, tracking en tiempo real y pagos el día 5 de cada mes vía SPEI o PayPal.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: 'Productora EAR',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  robots: {
    index: false,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: CANONICAL_URL,
  inLanguage: 'es-MX',
  isPartOf: {
    '@type': 'WebSite',
    name: 'Productora EAR',
    url: SITE_URL,
  },
};

export default function AfiliadoRedirectPage(): never {
  permanentRedirect(CANONICAL_PATH);
}

export function AfiliadoJsonLd(): ReactElement {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}