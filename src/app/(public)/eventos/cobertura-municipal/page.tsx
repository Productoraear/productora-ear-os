import type { Metadata } from 'next';
import EventLandingScreen from '@/components/seo/EventLandingScreen';
import { buildMunicipalIndexModel, EVENT_ORIGIN } from '@/lib/seo/eventLandingModel';

/**
 * `/eventos/cobertura-municipal` — índice de cobertura municipal.
 *
 * Ruta de rastreo hacia las 8.131 fichas municipales. NO se usa
 * `/eventos/municipales` porque esa URL ya es una landing B2G viva.
 *
 * SEC-2 · role: public | tenant: global.
 */
export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const model = buildMunicipalIndexModel();

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

export default function MunicipalIndexPage() {
  return <EventLandingScreen model={buildMunicipalIndexModel()} />;
}
