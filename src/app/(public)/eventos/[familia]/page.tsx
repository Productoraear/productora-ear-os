import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventLandingScreen from '@/components/seo/EventLandingScreen';
import { buildFamilyModel, EVENT_ORIGIN } from '@/lib/seo/eventLandingModel';
import {
  EVENT_FAMILY_BY_ID,
  EVENT_FAMILY_IDS,
  isEventFamilyId,
} from '@/lib/seo/eventIntentTaxonomy';

/**
 * `/eventos/{familia}` — 8 familias canónicas.
 *
 * SEC-1: una familia no declarada en la taxonomía responde 404 (nunca una
 * página vacía con 200, que el rastreador leería como contenido).
 * SEC-2 · role: public | tenant: global.
 */
export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ familia: string }>;
}

export function generateStaticParams(): Array<{ familia: string }> {
  return EVENT_FAMILY_IDS.map((familia) => ({ familia }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { familia } = await params;

  if (!isEventFamilyId(familia)) {
    return { title: 'Familia de evento no encontrada | Productora EAR', robots: { index: false, follow: true } };
  }

  const model = buildFamilyModel(EVENT_FAMILY_BY_ID[familia]);

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

export default async function EventFamilyPage({ params }: PageProps) {
  const { familia } = await params;
  if (!isEventFamilyId(familia)) notFound();

  return <EventLandingScreen model={buildFamilyModel(EVENT_FAMILY_BY_ID[familia])} />;
}
