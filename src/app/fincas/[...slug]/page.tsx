import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import gscIntentLandings from '@/data/telemetry/gsc-sitemap-intent-landings.json';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

export const dynamicParams = true;
export const revalidate = 3600;

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

interface GscIntentItem {
  internalPath: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};

  const rawPath = '/fincas/' + slug.join('/').toLowerCase();

  // Buscar en intenciones GSC
  const gscItem = (gscIntentLandings.allIntents as GscIntentItem[])?.find(
    (item: GscIntentItem) => item.internalPath.toLowerCase() === rawPath || item.internalPath.toLowerCase() === `${rawPath}/`
  );

  if (gscItem) {
    return {
      title: `${gscItem.seoTitle} | Productora EAR`,
      description: gscItem.metaDescription,
      alternates: {
        canonical: gscItem.canonicalUrl,
      },
      openGraph: {
        title: gscItem.seoTitle,
        description: gscItem.metaDescription,
        url: gscItem.canonicalUrl,
        images: ['/og-image-vimume.jpg'],
        siteName: 'Productora EAR',
        locale: 'es_ES',
        type: 'website'
      }
    };
  }

  const lastSlug = slug[slug.length - 1];
  const fincaName = lastSlug.replace(/-/g, ' ').toUpperCase();
  const provName = slug.length > 1 ? slug[0].toUpperCase() : 'MADRID';

  return {
    title: `${fincaName} · Finca Homologada para Bodas y Eventos en ${provName} | Productora EAR`,
    description: `Servicios musicales, sonido 12W/pax Bose F1 y catering de brasas homologados para ${fincaName} (${provName}). Presupuesto cerrado y reserva directa.`,
    alternates: {
      canonical: `https://productoraear.com/fincas/${slug.join('/')}`,
    }
  };
}

export default async function FincaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const rawPath = '/fincas/' + slug.join('/').toLowerCase();
  const lastSlug = slug[slug.length - 1];

  // Buscar en intenciones GSC
  const gscItem = (gscIntentLandings.allIntents as GscIntentItem[])?.find(
    (item: GscIntentItem) => item.internalPath.toLowerCase() === rawPath || item.internalPath.toLowerCase() === `${rawPath}/`
  );

  const prov = slug.length > 1 ? slug[0] : 'madrid';
  const fincaTitle = gscItem?.seoTitle || `${lastSlug.replace(/-/g, ' ').toUpperCase()} · Finca Homologada para Eventos`;
  const fincaDesc = gscItem?.metaDescription || `Espacio certificado para bodas en ${prov.toUpperCase()}. Acústica calibrada 12 W/pax Bose F1 y póliza de responsabilidad civil de 1.000.000 €.`;

  return (
    <BespokeTemplate
      title={fincaTitle}
      description={fincaDesc}
      location={prov.toUpperCase()}
      province={prov.toUpperCase()}
      category="Fincas y Espacios Exclusivos"
      serviceId={lastSlug}
      isApex={true}
    />
  );
}
