import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import ChauffeurVipView from '@/features/chauffeur/ui/ChauffeurVipView';
import { resolveGeoLocation } from '@/lib/seo/semantic-engine';

interface PageProps {
  params: Promise<{
    servicio: string;
    provincia: string;
  }>;
}

function formatText(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function formatProvincia(slug: string): string {
  if (!slug) return 'Madrid';
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { servicio, provincia } = await params;
  if (!servicio) return {};

  const fullPath = `${servicio}-${provincia}`.toLowerCase();
  const geo = resolveGeoLocation(provincia);
  const cityName = geo?.cityName || geo?.name || formatProvincia(provincia);
  const serviceFormatted = formatText(servicio);

  if (/chofer|conductor|transfer|coche|transporte-vip/.test(fullPath)) {
    return {
      title: `Alquiler de Vehículos de Lujo con Conductor & Chófer VIP en ${cityName} | Productora EAR`,
      description: `Flota oficial Mercedes-Benz Clase S, Clase V y Maybach en ${cityName}. Servicios de representación, transfers aeropuerto Barajas FBO, bodas y eventos VIP.`,
      alternates: {
        canonical: `https://www.productoraear.com/servicios/${servicio}/${provincia}`,
      }
    };
  }

  return {
    title: `${serviceFormatted} en ${cityName} | Productora EAR`,
    description: `Servicios profesionales de ${serviceFormatted} en ${cityName} con infraestructura técnica directa, sonido calibrado y garantía S-Class.`,
    alternates: {
      canonical: `https://www.productoraear.com/servicios/${servicio}/${provincia}`,
    }
  };
}

export default async function ServiciosProvinciaPage({ params }: PageProps) {
  const { servicio, provincia } = await params;
  if (!servicio) notFound();

  const fullPath = `${servicio}-${provincia}`.toLowerCase();
  const geo = resolveGeoLocation(provincia);
  const cityName = geo?.cityName || geo?.name || formatProvincia(provincia);
  const serviceFormatted = formatText(servicio);

  if (/chofer|conductor|transfer|coche|transporte-vip/.test(fullPath)) {
    return <ChauffeurVipView location={cityName} />;
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <BespokeTemplate
        title={`${serviceFormatted} en ${cityName}`}
        description={`Producción S-Class y contratación directa de ${serviceFormatted} en ${cityName} con infraestructura técnica asegurada.`}
        location={cityName}
        province={cityName}
        category={servicio}
        serviceId={servicio}
        isApex={true}
      />
    </main>
  );
}
