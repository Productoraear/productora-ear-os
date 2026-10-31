import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventLandingScreen from '@/components/seo/EventLandingScreen';
import { buildMunicipalityModel, EVENT_ORIGIN } from '@/lib/seo/eventLandingModel';
import { getMunicipality } from '@/lib/seo/spainMunicipalityCoverage';

/**
 * `/eventos/local/{provincia}/{municipio}` — universo municipal de España.
 *
 * Antes de esta ruta, el dataset de 8.131 municipios (INE) no generaba NI UNA
 * URL: sólo 255 municipios tenían ficha en `MUNICIPALITIES_DATASET`.
 *
 * Por qué la ruta vive bajo `/eventos/local/` y no bajo `/bodas/{prov}/{serv}/{muni}`:
 * `resolveCanonicalBodasMunicipio()` colapsa SIEMPRE la variante municipal hacia
 * la provincia (301 anti-doorway, canonical-taxonomy.ts:237-248). Publicar esa
 * variante en el sitemap sería publicar redirecciones. Aquí cada municipio tiene
 * contenido propio y verificable (INE, provincia, comunidad, distancia, precio).
 *
 * Sin `generateStaticParams`: 8.131 páginas en build romperían INV-15.
 * SEC-1: municipio no cubierto ⇒ 404. SEC-2 · role: public | tenant: global.
 */
export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ provincia: string; municipio: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { provincia, municipio } = await params;
  const municipality = getMunicipality(provincia, municipio);
  const model = municipality ? buildMunicipalityModel(municipality) : null;

  if (!model) {
    return {
      title: 'Municipio no cubierto | Productora EAR',
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${model.title} | Productora EAR`,
    description: model.lede,
    alternates: { canonical: `${EVENT_ORIGIN}${model.canonicalPath}` },
    robots: { index: model.indexable, follow: true },
    openGraph: {
      title: model.title,
      description: model.lede,
      url: `${EVENT_ORIGIN}${model.canonicalPath}`,
      siteName: 'Productora EAR',
      locale: 'es_ES',
      type: 'website',
    },
  };
}

export default async function EventMunicipalityPage({ params }: PageProps) {
  const { provincia, municipio } = await params;
  const municipality = getMunicipality(provincia, municipio);
  if (!municipality) notFound();

  const model = buildMunicipalityModel(municipality);
  if (!model) notFound();

  return <EventLandingScreen model={model} />;
}
