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

export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug || slug.length === 0) return {};

  let targetSlug = slug[slug.length - 1];
  if (slug[0] === 'arsenal' && slug.length > 1) {
    targetSlug = slug[1];
  }

  const profile = resolveArsenalPoblacion(targetSlug);

  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    alternates: {
      canonical: profile.canonicalUrl,
    },
    openGraph: {
      title: profile.metaTitle,
      description: profile.metaDescription,
      url: profile.canonicalUrl,
      type: 'website',
      locale: 'es_ES',
      siteName: 'Productora EAR',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200&auto=format&fit=crop',
          width: 1200,
          height: 630,
          alt: profile.h1,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.metaTitle,
      description: profile.metaDescription,
    },
  };
}

export default async function AlquilerPoblacionPage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug || slug.length === 0) {
    notFound();
  }

  let targetSlug = slug[slug.length - 1];
  if (slug[0] === 'arsenal' && slug.length > 1) {
    targetSlug = slug[1];
  }

  const profile = resolveArsenalPoblacion(targetSlug);

  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola, quiero reservar el Show Solista Premium (${TARIFA_BASE_SOLISTA_EUR} €) en ${profile.h1}.`
  )}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `Show Solista Premium (Edwin Agudelo) — ${profile.h1}`,
    description: `Sonorización profesional garantizada: ${WATTS_PER_PAX} W/pax calculados por aforo real + técnico in situ. Sin sorpresas ni costes ocultos.`,
    brand: {
      '@type': 'Brand',
      name: 'Productora EAR',
    },
    offers: {
      '@type': 'Offer',
      url: profile.canonicalUrl,
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
    <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-[#030305]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ArsenalPoblacionLanding profile={profile} />

      {/* 🛡️ Alquiler equipos / DJ — Precio Transparente SSOT S-Class */}
      <section className="bg-[#050507] text-white border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:shadow-2xl hover:shadow-[#ecb613]/5">
          <div className="space-y-2 text-center md:text-left">
            <span className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ecb613] bg-[#ecb613]/10 px-3 py-1 rounded-full border border-[#ecb613]/20">
              Alquiler Equipos / DJ &bull; Tarifa Oficial SSOT
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              Show Solista Premium (Edwin Agudelo)
            </h3>
            <p className="text-sm text-zinc-400 max-w-xl">
              Sonorización profesional garantizada: {WATTS_PER_PAX} W/pax calculados por aforo real + técnico in situ. Sin sorpresas ni costes ocultos.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-right shrink-0">
            <div className="space-y-1">
              <span className="text-xs text-zinc-400 uppercase tracking-wider block font-mono">Precio Transparente</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#ecb613] font-mono">
                {TARIFA_BASE_SOLISTA_EUR} <span className="text-lg font-normal text-white">€</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/reservar/solista"
                className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-[#ecb613] text-black font-semibold text-sm hover:bg-[#ffe066] transition-all duration-300 ease-out shadow-lg shadow-[#ecb613]/10 hover:shadow-[#ecb613]/30"
              >
                Reservar Directo
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 rounded-2xl bg-transparent text-white font-semibold text-sm border border-white/20 hover:border-[#ecb613]/60 hover:text-[#ecb613] transition-all duration-300 ease-out"
              >
                WhatsApp {CENTRALITA_EAR_OS}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}