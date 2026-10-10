import React from 'react';
import Link from 'next/link';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { ShieldCheck, Disc, ArrowRight, MessageCircle } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';
import {
  TARIFA_BASE_SOLISTA_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata = generateArtistSEOMeta('festivales', 'España');

export default function ArtistasFestivalesPage() {
  const schema = generateEventSchema('festivales', 'España');

  const whatsappHref = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
    'Hola, quiero información para contratar mariachis para un festival.'
  )}`;

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Mariachis para Grandes Festivales — Edwin Agudelo',
    description:
      'Espectáculo sinfónico de mariachi para grandes festivales con rider técnico de Nivel 1 y arreglos contemporáneos.',
    brand: {
      '@type': 'Brand',
      name: 'Edwin Agudelo',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: 'https://edwinagudelo.com/reservar/solista',
    },
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-white pt-40 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5">
              <Disc size={12} /> Live Stage
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              FESTIVAL HEADLINER
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Grandes Festivales
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            El virtuosismo sinfónico de Edwin Agudelo en los escenarios de mayor proyección del panorama nacional.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/reservar/solista"
              className="group inline-flex items-center gap-2 rounded-3xl bg-[#ecb613] text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-[#f5c93a] hover:scale-[1.03] shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)]"
            >
              Reservar desde {TARIFA_BASE_SOLISTA_EUR} €
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-3xl bg-[#09090d]/80 border border-white/10 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:border-[#ecb613]/40 hover:bg-[#09090d]"
            >
              <MessageCircle size={16} className="text-[#ecb613]" />
              WhatsApp {CENTRALITA_EAR_OS}
            </a>
          </div>
        </section>

        {/* Dynamic Content */}
        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center transition-all duration-500 hover:border-white/20">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Impacto Escénico Contundente
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Arreglos contemporáneos y fusión de metales e instrumentos tradicionales adaptados a los sistemas de sonido PA de gran envergadura.
            </p>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-black text-[#ecb613] font-syne">
                {TARIFA_BASE_SOLISTA_EUR} €
              </span>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                Tarifa base solista
              </span>
            </div>
          </div>
          <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-4 transition-all duration-500 hover:border-[#ecb613]/30 hover:bg-[#09090d]">
            <ShieldCheck className="text-[#ecb613]" size={36} />
            <h3 className="text-lg font-black uppercase">Rider de Nivel 1</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Suministramos un rider técnico detallado en PDF y archivos máster con el mapa de microfonía exacta para agilizar las pruebas de sonido en festivales multitarea.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

        {/* CTA Final */}
        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-10 md:p-16 text-center space-y-6 transition-all duration-500 hover:border-[#ecb613]/30">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter font-syne">
            Asegura tu fecha en cartel
          </h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
            Confirmación inmediata desde {TARIFA_BASE_SOLISTA_EUR} €. Disponibilidad limitada por temporada de festivales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/reservar/solista"
              className="group inline-flex items-center gap-2 rounded-3xl bg-[#ecb613] text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 hover:bg-[#f5c93a] hover:scale-[1.03]"
            >
              Reservar ahora
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/alquiler"
              className="inline-flex items-center gap-2 rounded-3xl bg-[#09090d]/80 border border-white/10 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 hover:border-[#ecb613]/40"
            >
              Ver packs de alquiler
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}