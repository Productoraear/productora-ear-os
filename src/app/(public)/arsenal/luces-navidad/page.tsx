import React from 'react';
import { Metadata } from 'next';
import { CHRISTMAS_LIGHTING_PRODUCTS, CHRISTMAS_LIGHTING_CATEGORIES } from '@/data/luces-navidad';
import ChristmasLightingCatalogView from '@/features/catalog/ui/ChristmasLightingCatalogView';

export const metadata: Metadata = {
  title: 'Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2025 | Productora EAR',
  description: 'Catálogo técnico oficial de 358 referencias en 11 categorías. Iluminación monumental para Ayuntamientos (LCSP), centros comerciales y fincas.',
  alternates: {
    canonical: 'https://www.productoraear.com/arsenal/luces-navidad',
  },
  openGraph: {
    title: 'Catálogo Oficial Alumbrado Monumental & Luces de Navidad 2025 | Productora EAR',
    description: '358 referencias de iluminación navideña monumental, motivos 3D transitables y tecnología Twinkly Pro.',
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
