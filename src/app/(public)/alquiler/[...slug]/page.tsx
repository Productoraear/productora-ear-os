import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { resolveArsenalPoblacion } from '@/lib/seo/arsenalPoblacionesEngine';
import { ArsenalPoblacionLanding } from '@/features/alquiler-poblaciones/ui/ArsenalPoblacionLanding';
import {
  TARIFA_BASE_SOLISTA_EUR,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

const SITE_URL = 'https://productoraear.com';
const OG_IMAGE_URL =
  'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop';
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const PRICE_VALID_UNTIL = '2026-12-31';

export const dynamicParams = true;

function resolveTargetSlug(slug: string[] | undefined): string | null {
  if (!slug || slug.length === 0) return null;
  if (slug[0] === 'arsenal' && slug.length > 1) return slug[1];
  return slug[slug.length - 1];
}

function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalized = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalized}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const targetSlug = resolveTargetSlug(slug);
  if (!targetSlug) return {};

  const profile = resolveArsenalPoblacion(targetSlug);
  const canonicalUrl = toAbsoluteUrl(profile.canonicalUrl);

  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: profile.metaTitle,
      description: profile.metaDescription,
      url: canonicalUrl,
      type: 'website',
      locale: 'es_ES',
      siteName: 'Productora EAR',
      images: [
        {
          url: OG_IMAGE_URL,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
          alt: profile.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.metaTitle,
      description: profile.metaDescription,
      images: [OG_IMAGE_URL],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

export default async function AlquilerPoblacionPage({ params }: PageProps) {
  const { slug } = await params;
  const targetSlug = resolveTargetSlug(slug);
  if (!targetSlug) {
    notFound();
  }

  const profile = resolveArsenalPoblacion(targetSlug);
  const canonicalUrl = toAbsoluteUrl(profile.canonicalUrl);
  const priceFormatted = TARIFA_BASE_SOLISTA_EUR.toFixed(2);
  const productName = `Show Solista Premium (Edwin Agudelo) — ${profile.h1}`;
  const productDescription = `Sonorización profesional garantizada: ${WATTS_PER_PAX} W/pax calculados por aforo real + técnico in situ. Sin sorpresas ni costes ocultos.`;

  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola, quiero reservar el Show Solista Premium (${TARIFA_BASE_SOLISTA_EUR} €) en ${profile.h1}.`
  )}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    description: productDescription,
    brand: {
      '@type': 'Brand',
      name: 'Productora EAR',
    },
    offers: {
      '@type': 'Offer',
      url: canonicalUrl,
      priceCurrency: 'EUR',
      price: priceFormatted,
      availability: 'https://schema.org/InStock',
      priceValidUntil: PRICE_VALID_UNTIL,
      seller: {
        '@type': 'Organization',
        name: 'Productora EAR',
        telephone: CENTRALITA_EAR_OS,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#030305]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArsenalPoblacionLanding profile={profile} />

      {/* 🛡️ Alquiler equipos / DJ — Precio Transparente SSOT S-Class */}
      <section
        aria-labelledby="alquiler-solista-heading"
        className="bg-[#050507] text-white border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-500 ease-out hover:border-[#ecb613]/40 hover:shadow-2xl hover:shadow-[#ecb613]/5 hover:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-3 py-1 rounded-full border border-[#ecb613]/20 transition-colors duration-300 ease-out hover:bg-[#ecb613]/15 hover:border-[#ecb613]/40 motion-reduce:transition-none">
              Alquiler Equipos / DJ &bull; Tarifa Oficial SSOT
            </span>
            <h3
              id="alquiler-solista-heading"
              className="text-xl sm:text-2xl font-bold font-display text-white"
            >
              Show Solista Premium (Edwin Agudelo)
            </h3>
            <p className="text-sm text-zinc-400 max-w-xl">{productDescription}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-right shrink-0">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block font-mono">
                Precio Transparente
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#ecb613] font-mono">
                {TARIFA_BASE_SOLISTA_EUR}{' '}
                <span className="text-lg font-normal text-white">€</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/reservar/solista"
                aria-label={`Reservar Show Solista Premium en ${profile.h1}`}
                className="group relative inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#ecb613] text-black font-semibold text-sm overflow-hidden transition-all duration-300 ease-out shadow-lg shadow-[#ecb613]/10 hover:bg-[#ffe066] hover:shadow-[#ecb613]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full motion-reduce:hidden"
                />
                <span className="relative z-10">Reservar Directo</span>
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Contactar por WhatsApp al ${CENTRALITA_EAR_OS}`}
                className="group relative inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-transparent text-white font-semibold text-sm border border-white/20 overflow-hidden transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:text-[#ecb613] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050507] motion-reduce:transform-none motion-reduce:transition-none"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[#ecb613]/0 transition-colors duration-300 ease-out group-hover:bg-[#ecb613]/5 motion-reduce:transition-none"
                />
                <span className="relative z-10">WhatsApp {CENTRALITA_EAR_OS}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}