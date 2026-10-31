import type { Metadata } from 'next';
import EventLandingScreen from '@/components/seo/EventLandingScreen';
import { buildHubModel, EVENT_ORIGIN } from '@/lib/seo/eventLandingModel';

/**
 * `/eventos` — HUB del catálogo de eventos.
 *
 * Antes de este cambio la ruta devolvía un placeholder de 27 líneas con el texto
 * "Agenda de eventos de Productora EAR": sin datos, sin enlaces, sin canonical y
 * sin una sola URL de evento. Se sustituye por el hub real del catálogo (300
 * tipologías, 8 familias, cobertura municipal) y se conserva la promesa de
 * agenda enlazando a la disponibilidad real (`/reservar/solista`).
 *
 * SEC-2 · role: public | tenant: global.
 * ISR diaria: el contenido sólo cambia si cambia el SSOT o la cobertura.
 */
export const revalidate = 86400;

export function generateMetadata(): Metadata {
  const model = buildHubModel();

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

export default function EventosHubPage() {
  return <EventLandingScreen model={buildHubModel()} />;
}
