import React from 'react';
import { Metadata } from 'next';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { SERVICIOS, PROVINCIAS } from '@/lib/constants/seo-data';

interface PageProps {
  params: Promise<{
    nicho: string;
    ciudad: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { nicho, ciudad } = await params;
  const formattedNicho = nicho.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const formattedCiudad = ciudad.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return {
    title: `${formattedNicho} en ${formattedCiudad} | Productora EAR GOLD`,
    description: `Servicios S-Class de ${formattedNicho} en ${formattedCiudad}. Ingeniería de impacto y logística táctica para eventos de alto nivel.`,
  };
}

export default async function CityServicePage({ params }: PageProps) {
  const { nicho, ciudad } = await params;
  const service = SERVICIOS.find(s => s.slug === nicho.toLowerCase());
  const formattedCiudad = ciudad.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const title = service ? `${service.nombre} en ${formattedCiudad}` : `${nicho.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} en ${formattedCiudad}`;
  const description = service 
    ? `${service.descripcion} Despliegue operativo en la provincia de ${formattedCiudad}.`
    : `Infraestructura técnica de élite para ${nicho.replace(/-/g, ' ')} en ${formattedCiudad}.`;

  return (
    <BespokeTemplate 
      title={title}
      description={description}
      location={formattedCiudad}
      serviceId={nicho}
      keywords={[nicho, ciudad, 'S-Class', 'Aura Onyx']}
    />
  );
}

export async function generateStaticParams() {
  const params = [];
  const targetNichos = ['edwin-agudelo-solista', 'edwin-agudelo-mariachi-6', 'edwin-caballo', 'banda-monumental'];
  
  for (const n of targetNichos) {
    for (const p of PROVINCIAS) {
      params.push({ nicho: n, ciudad: p });
    }
  }
  
  return params;
}
