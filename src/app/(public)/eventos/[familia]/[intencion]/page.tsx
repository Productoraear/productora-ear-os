import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventLandingScreen from '@/components/seo/EventLandingScreen';
import { buildIntentModel, EVENT_ORIGIN } from '@/lib/seo/eventLandingModel';
import { EVENT_FAMILY_BY_ID, getEventIntent, getIntentSearchPhrases, isEventFamilyId } from '@/lib/seo/eventIntentTaxonomy';

/**
 * `/eventos/{familia}/{intencion}` — 300 tipologías declaradas en el SSOT.
 *
 * SEC-1: intención no declarada ⇒ 404. Nunca se renderiza una página con el
 * slug del visitante dentro de un texto genérico (eso es doorway).
 * SEC-2 · role: public | tenant: global.
 */
export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ familia: string; intencion: string }>;
}

function resolveIntent(familia: string, intencion: string) {
  if (!isEventFamilyId(familia)) return null;
  const intent = getEventIntent(intencion);
  if (!intent || intent.family !== familia) return null;
  return { family: EVENT_FAMILY_BY_ID[intent.family], intent };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { familia, intencion } = await params;
  const resolved = resolveIntent(familia, intencion);

  if (!resolved) {
    return {
      title: 'Tipología de evento no encontrada | Productora EAR',
      robots: { index: false, follow: true },
    };
  }

  const model = buildIntentModel(resolved.intent);

  return {
    title: `${model.title} | Productora EAR`,
    description: model.lede,
    keywords: getIntentSearchPhrases(resolved.intent),
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

export default async function EventIntentPage({ params }: PageProps) {
  const { familia, intencion } = await params;
  const resolved = resolveIntent(familia, intencion);
  if (!resolved) notFound();

  return <EventLandingScreen model={buildIntentModel(resolved.intent)} />;
}
