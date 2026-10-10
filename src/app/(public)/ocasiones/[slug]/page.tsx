/**
 * 🏛️ OCCASION HUB - S-CLASS INTENT NODE
 * Purpose: Aggregated destination for high-intent occasion searches.
 * Sealed: SSOT pricing, real CTAs, JSON-LD Offer, Luxury OLED.
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOccasionBySlug, getAllOccasions } from '@/lib/constants/occasions';
import {
  TARIFA_BASE_SOLISTA_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllOccasions().map((occ) => ({
    slug: occ.slug,
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const occasion = getOccasionBySlug(params.slug);
  if (!occasion) return {};

  return {
    title: occasion.seoTitle,
    description: occasion.seoDescription,
    alternates: {
      canonical: `https://productoraear.com${occasion.canonicalPath}`,
    },
    openGraph: {
      title: occasion.seoTitle,
      description: occasion.seoDescription,
      type: 'website',
    },
  };
}

export default async function OccasionHubPage(props: Props) {
  const params = await props.params;
  const occasion = getOccasionBySlug(params.slug);
  if (!occasion) notFound();

  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    `Hola, quiero información para ${occasion.title}`
  )}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${occasion.title} — Producción S-Class EAR OS`,
    description: occasion.seoDescription,
    brand: {
      '@type': 'Brand',
      name: 'Productora EAR',
    },
    offers: {
      '@type': 'Offer',
      price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `https://productoraear.com${occasion.canonicalPath}`,
    },
  };

  const titleParts = occasion.title.split(' y ');
  const titlePrimary = titleParts[0];
  const titleSecondary = titleParts[1] || '';

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-white pt-32 pb-20 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* BACKGROUND ACCENT */}
      <div
        className={`absolute top-0 right-0 w-full h-screen bg-gradient-to-b ${occasion.gradient} to-transparent pointer-events-none`}
      />

      <div className="container-custom relative z-10">
        {/* HEADER */}
        <header className="max-w-4xl mb-24">
          <span
            className="text-[10px] font-black uppercase tracking-[0.5em] mb-4 block"
            style={{ color: occasion.accentColor }}
          >
            {occasion.intent}
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter italic mb-8 leading-[0.9]">
            {titlePrimary} <br />
            <span className="text-white/20 italic">{titleSecondary}</span>
          </h1>
          <p className="text-lg text-white/40 font-medium max-w-2xl leading-relaxed">
            {occasion.seoDescription}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="/reservar/solista"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#d4a855] text-black font-black text-xs uppercase tracking-wider min-h-[44px] shadow-lg shadow-[#d4a855]/20 hover:bg-[#e6bd6a] active:scale-95 transition-all"
            >
              Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider min-h-[44px] transition-all"
            >
              WhatsApp Directo
            </a>
          </div>
        </header>

        {/* FEATURED GRID */}
        <section className="mb-24 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono text-[#d4a855] uppercase tracking-widest block">
                Roster Verificado
              </span>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight italic text-white">
                Artistas e Infraestructura <span className="text-[#d4a855]">S-Class</span>
              </h2>
            </div>
            <a
              href={`/checkout?occasion=${occasion.slug}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#d4a855] text-black font-black text-xs uppercase tracking-wider min-h-[44px] shadow-lg shadow-[#d4a855]/20 hover:bg-[#e6bd6a] active:scale-95 transition-all"
            >
              <span>Reservar {occasion.title} en Vivo</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Edwin Agudelo Insignia Card */}
            <div className="bg-[#09090d]/80 border border-[#d4a855]/30 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl relative overflow-hidden group hover:border-[#d4a855] hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-4 right-4 bg-[#d4a855]/10 border border-[#d4a855]/30 px-3 py-1 rounded-full text-[8px] font-black uppercase text-[#d4a855] tracking-widest">
                Artista Insignia
              </div>
              <div className="space-y-3">
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                  Tenor Lírico & Mariachi
                </span>
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white group-hover:text-[#d4a855] transition-colors">
                  Edwin Agudelo
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Formaciones de autor de 1 a 16 músicos para {occasion.title.toLowerCase()}. Producción acústica S-Class y protocolo de gala.
                </p>
                <div className="text-sm font-mono text-white pt-2">
                  Tarifa Solista desde{' '}
                  <strong className="text-2xl font-black text-[#d4a855]">
                    {TARIFA_BASE_SOLISTA_EUR} €
                  </strong>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/5">
                <a
                  href="/artistas/edwin-agudelo"
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] transition-all"
                >
                  Ver Dossier Oficial
                </a>
                <a
                  href="/reservar/solista"
                  className="w-full py-3 rounded-xl bg-[#d4a855] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] shadow-lg shadow-[#d4a855]/20 hover:bg-[#e6bd6a] active:scale-95 transition-all"
                >
                  Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
                </a>
              </div>
            </div>

            {/* Production S-Class Card */}
            <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                  Infraestructura Acústica
                </span>
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">
                  Sonorización L-Acoustics K2
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Rider técnico certificado con microfonía Shure Axient Digital e iluminación robótica DMX para recintos y exteriores.
                </p>
                <div className="text-sm font-mono text-white pt-2">
                  Tarifas desde{' '}
                  <strong className="text-2xl font-black text-white">1.800 €</strong>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <a
                  href="/alquiler"
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] transition-all"
                >
                  Añadir al Presupuesto
                </a>
              </div>
            </div>

            {/* Institutional / B2G Card */}
            <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300">
              <div className="space-y-3">
                <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-400">
                  Garantía Jurídica
                </span>
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white">
                  Pliegos & Póliza RC 1M€
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Contratación formal adaptada a la LCSP, facturación electrónica FACe y cobertura de seguridad social en regla.
                </p>
                <div className="text-sm font-mono text-emerald-400 pt-2 font-bold">
                  ✓ Homologación B2G / B2B Certificada
                </div>
              </div>
              <div className="pt-4 border-t border-white/5">
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[44px] transition-all"
                >
                  Solicitar Pliegos Técnicos
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* SEO FOOTER HUB */}
        <footer className="pt-16 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {getAllOccasions().map((occ) => (
              <a
                key={occ.slug}
                href={occ.canonicalPath}
                className="text-xs font-bold uppercase tracking-wider hover:text-[#d4a855] transition-colors py-2 min-h-[44px] flex items-center"
              >
                {occ.title}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}