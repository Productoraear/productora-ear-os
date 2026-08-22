// @ts-nocheck
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import { resolveGeoLocation } from '@/lib/seo/semantic-engine';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};

  const lastSeg = slug[slug.length - 1].toLowerCase();
  const isLastProv = PROVINCIAS.includes(lastSeg);
  const provinceSlug = isLastProv ? lastSeg : 'madrid';
  const eventSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

  const { cityName } = resolveGeoLocation(provinceSlug);

  return {
    title: `Licitaciones B2G y Producción Institucional en ${cityName} | Productora EAR`,
    description: `Servicios de ${eventSlug.replace(/-/g, ' ')} para Ayuntamientos e Instituciones Públicas en ${cityName}. Cumplimiento estricto LCSP, seguro RC 600.000€ y memorias técnicas.`,
    alternates: {
      canonical: `https://www.productoraear.com/b2g/${slug.join('/')}`,
    }
  };
}

export default async function B2GCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const lastSeg = slug[slug.length - 1].toLowerCase();
  const isLastProv = PROVINCIAS.includes(lastSeg);
  const provinceSlug = isLastProv ? lastSeg : 'madrid';
  const eventSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

  const locationName = isLastProv ? (resolveGeoLocation(provinceSlug)?.cityName || 'Madrid') : 'Madrid';

  return (
    <BespokeTemplate
      title={`Producción B2G & ${eventSlug.replace(/-/g, ' ')} en ${locationName}`}
      description={`Soluciones llave en mano para Ayuntamientos, fiestas patronales y alumbrado monumental en ${locationName}. Contrato menor LCSP y seguro de responsabilidad civil.`}
      location={locationName}
      province={locationName}
      category="Ayuntamientos B2G"
      serviceId={eventSlug}
      isApex={true}
    />
  );
}
