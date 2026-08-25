// @ts-nocheck
import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import ChauffeurVipView from '@/features/chauffeur/ui/ChauffeurVipView';
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

  const fullPath = slug.join('-').toLowerCase();
  const lastSeg = slug[slug.length - 1].toLowerCase();
  const isLastProv = PROVINCIAS.includes(lastSeg);
  const provinceSlug = isLastProv ? lastSeg : 'madrid';
  const serviceSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

  const geo = resolveGeoLocation(provinceSlug);
  const cityName = geo?.cityName || geo?.name || (provinceSlug ? provinceSlug.charAt(0).toUpperCase() + provinceSlug.slice(1) : 'Madrid');

  if (/chofer|conductor|transfer|coche|transporte-vip/.test(fullPath)) {
    return {
      title: `Alquiler de Vehículos de Lujo con Conductor & Chófer VIP en ${cityName} | Productora EAR`,
      description: `Flota oficial Mercedes-Benz Clase S, Clase V y Maybach en ${cityName}. Servicios de representación, transfers aeropuerto Barajas FBO, bodas y eventos VIP.`,
      alternates: {
        canonical: `https://www.productoraear.com/servicios/${slug.join('/')}`,
      }
    };
  }

  return {
    title: `${serviceSlug.replace(/-/g, ' ').toUpperCase()} en ${cityName} | Productora EAR`,
    description: `Servicios profesionales de ${serviceSlug.replace(/-/g, ' ')} en ${cityName} con infraestructura técnica directa.`,
    alternates: {
      canonical: `https://www.productoraear.com/servicios/${slug.join('/')}`,
    }
  };
}

export default async function ServiciosCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const fullPath = slug.join('-').toLowerCase();
  const lastSeg = slug[slug.length - 1].toLowerCase();
  const isLastProv = PROVINCIAS.includes(lastSeg);
  const provinceSlug = isLastProv ? lastSeg : 'madrid';
  const serviceSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

  const geo = resolveGeoLocation(provinceSlug);
  const cityName = geo?.cityName || geo?.name || (provinceSlug ? provinceSlug.charAt(0).toUpperCase() + provinceSlug.slice(1) : 'Madrid');

  if (/chofer|conductor|transfer|coche|transporte-vip/.test(fullPath)) {
    return <ChauffeurVipView location={cityName} />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <BespokeTemplate
        title={`${serviceSlug.replace(/-/g, ' ')} en ${cityName}`}
        description={`Producción S-Class y contratación directa de ${serviceSlug.replace(/-/g, ' ')} en ${cityName}.`}
        location={cityName}
        province={cityName}
        category="Servicios"
        serviceId={serviceSlug}
        isApex={true}
      />
    </main>
  );
}
