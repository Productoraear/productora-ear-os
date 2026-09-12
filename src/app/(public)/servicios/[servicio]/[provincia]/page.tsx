import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChauffeurVipView from '@/features/chauffeur/ui/ChauffeurVipView';
import { resolveGeoLocation } from '@/lib/seo/semantic-engine';
import { resolveSearchIntent } from '@/lib/seo/searchIntentEngine';
import HormoziGrandSlamLanding from '@/features/landing/HormoziGrandSlamLanding';

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

  if (/chofer|conductor|transfer|coche|transporte-vip/.test(fullPath)) {
    return {
      title: `Alquiler de Vehículos de Lujo con Conductor & Chófer VIP en ${cityName} | Productora EAR`,
      description: `Flota oficial Mercedes-Benz Clase S, Clase V y Maybach en ${cityName}. Servicios de representación, transfers aeropuerto Barajas FBO, bodas y eventos VIP.`,
      alternates: {
        canonical: `https://productoraear.com/servicios/${servicio}/${provincia}`,
      }
    };
  }

  const profile = resolveSearchIntent(servicio, provincia);
  return {
    title: `${profile.gremioLabel} en ${profile.provinciaName} | Productora EAR`,
    description: `${profile.dreamOutcome} Presupuesto cerrado desde ${profile.basePrice} € con fianza de ${profile.deposit} € (Price-Lock SHA-256). Logística Méntrida 1,50 €/km y Garantía de Relevo Uber 0% cancelaciones.`,
    alternates: {
      canonical: `https://productoraear.com/servicios/${servicio}/${provincia}`,
    },
    openGraph: {
      title: `${profile.gremioLabel} en ${profile.provinciaName} | Productora EAR`,
      description: profile.dreamOutcome,
      type: 'website',
      url: `https://productoraear.com/servicios/${servicio}/${provincia}`,
      locale: 'es_ES'
    }
  };
}

export default async function ServiciosProvinciaPage({ params }: PageProps) {
  const { servicio, provincia } = await params;
  if (!servicio) notFound();

  const fullPath = `${servicio}-${provincia}`.toLowerCase();
  const geo = resolveGeoLocation(provincia);
  const cityName = geo?.cityName || geo?.name || formatProvincia(provincia);

  if (/chofer|conductor|transfer|coche|transporte-vip/.test(fullPath)) {
    return <ChauffeurVipView location={cityName} />;
  }

  const profile = resolveSearchIntent(servicio, provincia);

  return <HormoziGrandSlamLanding profile={profile} />;
}