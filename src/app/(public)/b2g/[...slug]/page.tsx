import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BespokeTemplate } from '@/app/components/SClassScreens/BespokeTemplate';
import { PROVINCIAS } from '@/lib/constants/seo-data';
import { resolveGeoLocation } from '@/lib/seo/semantic-engine';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const dynamicParams = true;
export const revalidate = 3600;

const B2G_TECHO_PREVENTIVO_EUR = 14250;
const B2G_SEGURO_RC_EUR = 600000;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};

  const lastSeg = slug[slug.length - 1].toLowerCase();
  const isLastProv = PROVINCIAS.includes(lastSeg);
  const provinceSlug = isLastProv ? lastSeg : 'madrid';
  const eventSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

  const { cityName } = resolveGeoLocation(provinceSlug);

  return {
    title: `Contratar Producción B2G y Agrupaciones en ${cityName} | Desde ${TARIFA_BASE_SOLISTA_EUR} € · Productora EAR`,
    description: `Contratar ${eventSlug.replace(/-/g, ' ') || 'agrupación profesional'} para Ayuntamientos e Instituciones en ${cityName} desde ${TARIFA_BASE_SOLISTA_EUR} €. Techo preventivo ${B2G_TECHO_PREVENTIVO_EUR.toLocaleString('es-ES')} € (Art. 118 LCSP) con dossier FACe y seguro RC ${B2G_SEGURO_RC_EUR.toLocaleString('es-ES')} €.`,
    alternates: {
      canonical: `https://productoraear.com/b2g/${slug.join('/')}`,
    },
  };
}

export default async function B2GCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) notFound();

  const lastSeg = slug[slug.length - 1].toLowerCase();
  const isLastProv = PROVINCIAS.includes(lastSeg);
  const provinceSlug = isLastProv ? lastSeg : 'madrid';
  const eventSlug = isLastProv ? slug.slice(0, slug.length - 1).join('-') : slug.join('-');

  const locationName = isLastProv
    ? resolveGeoLocation(provinceSlug)?.cityName || 'Madrid'
    : 'Madrid';

  const eventLabel = eventSlug.replace(/-/g, ' ') || 'agrupación profesional';
  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Solicitud B2G · ${eventLabel} · ${locationName}`
  )}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Producción B2G & ${eventLabel} en ${locationName}`,
    description: `Soluciones llave en mano para Ayuntamientos, fiestas patronales y alumbrado monumental en ${locationName}. Contrato menor LCSP y seguro de responsabilidad civil.`,
    brand: {
      '@type': 'Brand',
      name: 'Productora EAR',
    },
    offers: {
      '@type': 'Offer',
      url: `https://productoraear.com/b2g/${slug.join('/')}`,
      priceCurrency: 'EUR',
      price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      seller: {
        '@type': 'Organization',
        name: 'Productora EAR',
        telephone: CENTRALITA_EAR_OS,
      },
    },
  };

  return (
    <div className="w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-6 sm:p-10 transition-all duration-300 hover:border-white/20 hover:bg-[#09090d]/90">
          <p className="text-xs uppercase tracking-[0.3em] text-white/50">
            Contratación pública · LCSP Art. 118
          </p>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">
            Producción B2G & {eventLabel} en {locationName}
          </h1>
          <p className="mt-4 max-w-3xl text-sm sm:text-base text-white/70">
            Soluciones llave en mano para Ayuntamientos, fiestas patronales y alumbrado
            monumental en {locationName}. Contrato menor LCSP, dossier FACe y seguro de
            responsabilidad civil {B2G_SEGURO_RC_EUR.toLocaleString('es-ES')} €.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5">
              <p className="text-xs uppercase tracking-widest text-white/50">Tarifa Solista</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {TARIFA_BASE_SOLISTA_EUR} €
              </p>
              <p className="mt-1 text-xs text-white/60">Precio oficial SSOT · IVA no incluido</p>
            </div>
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5">
              <p className="text-xs uppercase tracking-widest text-white/50">Reserva</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {DEPOSITO_STRIPE_EUR} €
              </p>
              <p className="mt-1 text-xs text-white/60">Depósito Stripe para bloqueo de fecha</p>
            </div>
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 transition-all duration-300 hover:border-white/20 hover:-translate-y-0.5">
              <p className="text-xs uppercase tracking-widest text-white/50">Techo preventivo</p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {B2G_TECHO_PREVENTIVO_EUR.toLocaleString('es-ES')} €
              </p>
              <p className="mt-1 text-xs text-white/60">Art. 118 LCSP · Contrato menor</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a
              href="/reservar/solista"
              className="inline-flex items-center justify-center rounded-3xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all duration-300 hover:bg-white/90 hover:-translate-y-0.5"
            >
              Reservar Tarifa Solista · {TARIFA_BASE_SOLISTA_EUR} €
            </a>
            <a
              href="/alquiler"
              className="inline-flex items-center justify-center rounded-3xl bg-[#09090d]/80 border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:-translate-y-0.5"
            >
              Ver packs de inventario
            </a>
            <a
              href="/checkout"
              className="inline-flex items-center justify-center rounded-3xl bg-[#09090d]/80 border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:-translate-y-0.5"
            >
              Ir a checkout
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-3xl bg-[#09090d]/80 border border-white/10 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-white/30 hover:-translate-y-0.5"
            >
              WhatsApp directo · {CENTRALITA_EAR_OS}
            </a>
          </div>
        </div>
      </section>

      <BespokeTemplate
        title={`Producción B2G & ${eventLabel} en ${locationName}`}
        description={`Soluciones llave en mano para Ayuntamientos, fiestas patronales y alumbrado monumental en ${locationName}. Contrato menor LCSP y seguro de responsabilidad civil.`}
        location={locationName}
        province={locationName}
        category="Ayuntamientos B2G"
        serviceId={eventSlug}
        isApex={true}
      />
    </div>
  );
}