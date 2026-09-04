import React from 'react';
import { Metadata } from 'next';
import { CHRISTMAS_LIGHTING_PRODUCTS, CHRISTMAS_LIGHTING_CATEGORIES } from '@/data/luces-navidad';
import ChristmasLightingCatalogView from '@/features/catalog/ui/ChristmasLightingCatalogView';

export const metadata: Metadata = {
  title: 'Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2026 EAR | Productora EAR',
  description: 'Catálogo técnico oficial de 530 referencias en 6 categorías monumentales (196 páginas). Iluminación homologada para Ayuntamientos (LCSP < 14.250 €) y centros comerciales.',
  alternates: {
    canonical: 'https://www.productoraear.com/arsenal/luces-navidad',
  },
  openGraph: {
    title: 'Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2026 EAR | Productora EAR',
    description: '530 referencias de iluminación navideña monumental, motivos 3D transitables y arcos de calle 2026.',
    images: ['/images/demetrio/page_2.jpg'],
    type: 'website'
  }
};

export default function LucesNavidadRootPage() {
  return (
    <ChristmasLightingCatalogView 
      products={CHRISTMAS_LIGHTING_PRODUCTS}
      categories={[...CHRISTMAS_LIGHTING_CATEGORIES]}
      initialCategory="all"
    />
  );
}
