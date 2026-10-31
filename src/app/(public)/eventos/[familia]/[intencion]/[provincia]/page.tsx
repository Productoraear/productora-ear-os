import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import EventLandingScreen from '@/components/seo/EventLandingScreen';
import { buildIntentProvinceModel, EVENT_ORIGIN, getProvinceEntity } from '@/lib/seo/eventLandingModel';
import { getEventIntent, getIntentSearchPhrases, isEventFamilyId } from '@/lib/seo/eventIntentTaxonomy';

/**
 * `/eventos/{familia}/{intencion}/{provincia}` — 300 × 52 = 15.600 páginas.
 *
 * Sin `generateStaticParams`: 15.600 páginas en build romperían el presupuesto de
 * INV-15 (build < 60 s). Se renderizan bajo demanda con ISR diaria y datos del
 * grafo provincial (distancia real, capital, comunidad, venues).
 *
 * SEC-1: provincia inexistente en PROVINCIAS_52_GRAPH ⇒ 404.
 * SEC-2 · role: public | tenant: global.
 */
export const revalidate = 86400;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ familia: string; intencion: string; provincia: string }>;
}

function resolve(familia: string, intencion: string, provincia: string) {
  if (!isEventFamilyId(familia)) return null;
  const intent = getEventIntent(intencion);
  if (!intent || intent.family !== familia) return null;
  if (!getProvinceEntity(provincia)) return null;
  return { intent, provincia };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { familia, intencion, provincia } = await params;
  const resolved = resolve(familia, intencion, provincia);

  if (!resolved) {
    return {
      title: 'Evento no disponible para esa provincia | Productora EAR',
      robots: { index: false, follow: true },
    };
  }

  const model = buildIntentProvinceModel(resolved.intent, resolved.provincia);
  if (!model) {
    return {
      title: 'Evento no disponible para esa provincia | Productora EAR',
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${model.title} | Productora EAR`,
    description: model.lede,
    keywords: getIntentSearchPhrases(resolved.intent, getProvinceEntity(resolved.provincia)?.name),
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

export default async function EventIntentProvincePage({ params }: PageProps) {
  const { familia, intencion, provincia } = await params;
  const resolved = resolve(familia, intencion, provincia);
  if (!resolved) notFound();

  const model = buildIntentProvinceModel(resolved.intent, resolved.provincia);
  if (!model) notFound();

  return <EventLandingScreen model={model} />;
}
