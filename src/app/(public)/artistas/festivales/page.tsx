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
    <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-40 pb-24 font-sans selection:bg-[#ecb613]/30 selection:text-white">
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
        <section className="space-y-6 text-center max-w-3xl mx-auto animate-[fadeIn_0.8s_ease-out]">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1.5 transition-all duration-500 hover:bg-purple-500/20 hover:border-purple-500/40 hover:shadow-[0_0_30px_-8px_rgba(168,85,247,0.6)]">
              <Disc size={12} className="animate-[spin_6s_linear_infinite]" /> Live Stage
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              FESTIVAL HEADLINER
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Grandes Festivales
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Edwin Agudelo en formato sinfónico para escenarios de festival: metales en directo, arreglos propios y rider técnico de Nivel 1.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/reservar/solista"
              className="group relative inline-flex items-center gap-2 rounded-3xl bg-[#ecb613] text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_0_60px_-5px_rgba(236,182,19,0.85)] active:scale-[0.97] active:translate-y-0 shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] overflow-hidden will-change-transform"
            >
              <span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                aria-hidden="true"
              />
              <span className="relative">Reservar desde {TARIFA_BASE_SOLISTA_EUR} €</span>
              <ArrowRight
                size={16}
                className="relative transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-3xl bg-[#09090d]/80 border border-white/10 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 ease-out hover:border-[#ecb613]/50 hover:bg-[#09090d] hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_0_40px_-12px_rgba(236,182,19,0.5)] active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] will-change-transform"
            >
              <MessageCircle
                size={16}
                className="text-[#ecb613] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:rotate-6"
              />
              WhatsApp {CENTRALITA_EAR_OS}
            </a>
          </div>
        </section>

        {/* Dynamic Content */}
        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center transition-all duration-500 ease-out hover:border-white/20 hover:bg-[#09090d] hover:shadow-[0_30px_80px_-40px_rgba(236,182,19,0.25)]">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Formato para escenarios grandes
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Sección de metales (trompeta, trompeta, vihuela, guitarrón) más arreglos propios de Edwin Agudelo, adaptados a sistemas PA de gran formato. Set configurable de 45 a 90 minutos.
            </p>
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl font-black text-[#ecb613] font-syne transition-all duration-500 ease-out hover:drop-shadow-[0_0_20px_rgba(236,182,19,0.7)]">
                {TARIFA_BASE_SOLISTA_EUR} €
              </span>
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                Tarifa base solista
              </span>
            </div>
          </div>
          <div className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 space-y-4 transition-all duration-500 ease-out hover:border-[#ecb613]/40 hover:bg-[#09090d] hover:-translate-y-1.5 hover:shadow-[0_25px_70px_-25px_rgba(236,182,19,0.4)] will-change-transform">
            <ShieldCheck
              className="text-[#ecb613] transition-transform duration-500 ease-out group-hover:scale-110 group-hover:rotate-3"
              size={36}
            />
            <h3 className="text-lg font-black uppercase">Rider de Nivel 1</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Rider técnico en PDF con mapa de microfonía, canales de monitoreo y máster de referencia. Enviado al equipo de producción del festival al confirmar la fecha.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

        {/* CTA Final */}
        <section className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-10 md:p-16 text-center space-y-6 transition-all duration-500 ease-out hover:border-[#ecb613]/40 hover:bg-[#09090d] hover:shadow-[0_30px_80px_-40px_rgba(236,182,19,0.3)]">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter font-syne">
            Asegura tu fecha en cartel
          </h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto leading-relaxed">
            Confirmación desde {TARIFA_BASE_SOLISTA_EUR} €. Disponibilidad limitada por temporada de festivales.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/reservar/solista"
              className="group relative inline-flex items-center gap-2 rounded-3xl bg-[#ecb613] text-black px-8 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_0_60px_-5px_rgba(236,182,19,0.85)] active:scale-[0.97] active:translate-y-0 shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] overflow-hidden will-change-transform"
            >
              <span
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
                aria-hidden="true"
              />
              <span className="relative">Reservar ahora</span>
              <ArrowRight
                size={16}
                className="relative transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              />
            </Link>
            <Link
              href="/alquiler"
              className="group inline-flex items-center gap-2 rounded-3xl bg-[#09090d]/80 border border-white/10 px-8 py-4 text-xs font-black uppercase tracking-widest text-white transition-all duration-300 ease-out hover:border-[#ecb613]/50 hover:bg-[#09090d] hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_0_40px_-12px_rgba(236,182,19,0.5)] active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] will-change-transform"
            >
              Ver packs de alquiler
              <ArrowRight
                size={16}
                className="text-[#ecb613] transition-transform duration-300 ease-out group-hover:translate-x-1.5"
              />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}