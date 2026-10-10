import React from 'react';
import type { Metadata } from 'next';
import {
  CHRISTMAS_LIGHTING_PRODUCTS,
  CHRISTMAS_LIGHTING_CATEGORIES,
} from '@/data/luces-navidad';
import ChristmasLightingCatalogView from '@/features/catalog/ui/ChristmasLightingCatalogView';

const SITE_URL = 'https://productoraear.com';
const CANONICAL_PATH = '/arsenal/luces-navidad';
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;
const OG_IMAGE = '/images/demetrio/page_2.jpg';

const PRODUCT_COUNT = CHRISTMAS_LIGHTING_PRODUCTS.length;
const CATEGORY_COUNT = CHRISTMAS_LIGHTING_CATEGORIES.length;
const CATALOG_PAGES = 196;
const LCSP_THRESHOLD = '14.250 €';

const PAGE_TITLE = `Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2026 EAR | Productora EAR`;
const PAGE_DESCRIPTION = `Catálogo técnico oficial de ${PRODUCT_COUNT} referencias en ${CATEGORY_COUNT} categorías monumentales (${CATALOG_PAGES} páginas). Iluminación homologada para Ayuntamientos (LCSP < ${LCSP_THRESHOLD}) y centros comerciales.`;
const OG_DESCRIPTION = `${PRODUCT_COUNT} referencias de iluminación navideña monumental, motivos 3D transitables y arcos de calle 2026.`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: 'Productora EAR',
    locale: 'es_ES',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2026 EAR',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

interface JsonLdListItem {
  '@type': 'ListItem';
  position: number;
  name: string;
}

interface JsonLdBreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

interface JsonLdGraphNode {
  '@type': string;
  '@id': string;
  [key: string]: unknown;
}

interface JsonLdDocument {
  '@context': 'https://schema.org';
  '@graph': JsonLdGraphNode[];
}

const breadcrumbItems: JsonLdBreadcrumbItem[] = [
  {
    '@type': 'ListItem',
    position: 1,
    name: 'Inicio',
    item: SITE_URL,
  },
  {
    '@type': 'ListItem',
    position: 2,
    name: 'Arsenal',
    item: `${SITE_URL}/arsenal`,
  },
  {
    '@type': 'ListItem',
    position: 3,
    name: 'Luces de Navidad',
    item: CANONICAL_URL,
  },
];

const catalogListItems: JsonLdListItem[] = CHRISTMAS_LIGHTING_PRODUCTS.slice(0, 50).map(
  (product, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: product.name,
  }),
);

const jsonLd: JsonLdDocument = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'CollectionPage',
      '@id': `${CANONICAL_URL}#webpage`,
      url: CANONICAL_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: 'es-ES',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: 'Productora EAR',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${OG_IMAGE}`,
      },
      about: {
        '@type': 'Thing',
        name: 'Alumbrado Monumental y Luces de Navidad 2026',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${CANONICAL_URL}#breadcrumb`,
      itemListElement: breadcrumbItems,
    },
    {
      '@type': 'ItemList',
      '@id': `${CANONICAL_URL}#catalog`,
      name: 'Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2026 EAR',
      description: PAGE_DESCRIPTION,
      numberOfItems: PRODUCT_COUNT,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: catalogListItems,
    },
  ],
};

export default function LucesNavidadRootPage(): React.ReactElement {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChristmasLightingCatalogView
        products={CHRISTMAS_LIGHTING_PRODUCTS}
        categories={[...CHRISTMAS_LIGHTING_CATEGORIES]}
        initialCategory="all"
      />
    </>
  );
}