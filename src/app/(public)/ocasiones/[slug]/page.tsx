/**
 * 🏛️ OCCASION HUB - S-CLASS INTENT NODE
 * Purpose: Aggregated destination for high-intent occasion searches.
 */

import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getOccasionBySlug, getAllOccasions } from '@/lib/constants/occasions';
import { MarketplaceCard } from '@/app/components/SClassScreens/MarketplaceCard';
import { motion } from 'framer-motion';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllOccasions().map((occ) => ({
    slug: occ.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const occasion = getOccasionBySlug(params.slug);
  if (!occasion) return {};

  return {
    title: occasion.seoTitle,
    description: occasion.seoDescription,
    alternates: {
      canonical: `https://ear-psi.vercel.app${occasion.canonicalPath}`,
    },
    openGraph: {
      title: occasion.seoTitle,
      description: occasion.seoDescription,
      type: 'website',
    },
  };
}

export default function OccasionHubPage({ params }: Props) {
  const occasion = getOccasionBySlug(params.slug);
  if (!occasion) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-20 overflow-hidden relative">
      {/* BACKGROUND ACCENT */}
      <div className={`absolute top-0 right-0 w-full h-screen bg-gradient-to-b ${occasion.gradient} to-transparent pointer-events-none`} />

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
            {occasion.title.split(' y ')[0]} <br />
            <span className="text-white/20 italic">{occasion.title.split(' y ')[1] || ''}</span>
          </h1>
          <p className="text-lg text-white/40 font-medium max-w-2xl leading-relaxed">
            {occasion.seoDescription}
          </p>
        </header>

        {/* FEATURED GRID */}
        <section className="mb-32">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-2xl font-black uppercase tracking-widest italic">
              Servicios <span className="text-[#d4a855]">S-Class</span> Recomendados
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Aquí mapearíamos los servicios reales filtrados por occasion.primaryServices */}
            {/* Por ahora usamos los placeholders instrumentados para validar el flujo */}
            <MarketplaceCard 
              index={0}
              id="mariachi-gala"
              title="Mariachi Gala S-Class"
              location="Nacional"
              category="MÚSICA ÉLITE"
              price="2.800"
              rating={5.0}
              image="https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=1000"
            />
            {/* ... más cards ... */}
          </div>
        </section>

        {/* SEO FOOTER HUB */}
        <footer className="pt-20 border-t border-white/5 opacity-30 hover:opacity-100 transition-opacity">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {getAllOccasions().map(occ => (
              <a key={occ.slug} href={occ.canonicalPath} className="text-[10px] font-bold uppercase tracking-widest hover:text-[#d4a855] transition-colors">
                {occ.title}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </main>
  );
}
