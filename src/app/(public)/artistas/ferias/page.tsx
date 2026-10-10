import React from 'react';
import Link from 'next/link';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { ShieldCheck, Award, MessageCircle, CalendarCheck, ArrowRight } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata = generateArtistSEOMeta('ferias', 'España');

const WHATSAPP_HREF = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
  'Hola, quiero reservar mariachis para una feria o fiesta popular.'
)}`;

export default function ArtistasFeriasPage() {
  const baseSchema = generateEventSchema('ferias', 'España');

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Mariachis para Ferias & Fiestas Populares',
    description:
      'Espectáculo de mariachis de gran formato para ferias, fiestas patronales y celebraciones populares en España. Homologación PRL y seguros incluidos.',
    brand: {
      '@type': 'Brand',
      name: 'EAR OS',
    },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'EUR',
      price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
      availability: 'https://schema.org/InStock',
      url: 'https://ear-os.com/reservar/solista',
      priceValidUntil: '2026-12-31',
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        value: 1,
        unitCode: 'C62',
      },
    },
  };

  const mergedSchema = Array.isArray(baseSchema)
    ? [...baseSchema, offerSchema]
    : [baseSchema, offerSchema];

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#050505] text-white pt-40 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mergedSchema) }}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Award size={12} /> Fiestas Populares
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              PUBLIC SHOWS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Ferias & Fiestas
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Energía, alegría y máxima afinación para las celebraciones patronales y ferias más concurridas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/reservar/solista"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#ecb613] text-black font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)]"
            >
              <CalendarCheck size={16} />
              Reservar desde {TARIFA_BASE_SOLISTA_EUR} €
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#09090d]/80 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:border-[#ecb613]/40 hover:bg-[#09090d] transition-all duration-300"
            >
              <MessageCircle size={16} className="text-[#ecb613]" />
              WhatsApp Directo
            </a>
          </div>

          <p className="text-white/30 text-[10px] font-mono uppercase tracking-widest pt-2">
            Depósito de reserva: {DEPOSITO_STRIPE_EUR} € · Tarifa Solista: {TARIFA_BASE_SOLISTA_EUR} €
          </p>
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center hover:border-white/20 transition-all duration-500">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Espectáculos de Plaza Pública
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Espectáculos de gran formato pensados para congregar a miles de personas. Arreglos alegres de alta interacción coral que aseguran el disfrute de familias y visitantes.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/reservar/solista"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-3xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black uppercase tracking-widest hover:bg-[#ecb613]/20 transition-all duration-300"
              >
                Reservar Solista · {TARIFA_BASE_SOLISTA_EUR} €
              </Link>
              <Link
                href="/alquiler"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-3xl bg-white/5 border border-white/10 text-white/70 text-[10px] font-black uppercase tracking-widest hover:border-white/30 hover:text-white transition-all duration-300"
              >
                Ver Packs de Inventario
              </Link>
            </div>
          </div>
          <div className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-8 space-y-4 hover:border-[#ecb613]/30 transition-all duration-500">
            <ShieldCheck className="text-[#ecb613]" size={36} />
            <h3 className="text-lg font-black uppercase">Homologación y Seguros</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Cumplimos estrictamente con todas las directrices de prevención de riesgos (PRL), altas de seguridad social y seguros de responsabilidad civil requeridos por ayuntamientos.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

        {/* CTA Final */}
        <section className="bg-[#09090d]/80 border border-white/10 rounded-3xl p-10 md:p-14 text-center space-y-6 hover:border-[#ecb613]/30 transition-all duration-500">
          <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter font-syne">
            Asegura tu fecha en feria
          </h2>
          <p className="text-white/40 text-sm max-w-xl mx-auto">
            Las fechas de feria se agotan con meses de antelación. Reserva ahora con depósito de {DEPOSITO_STRIPE_EUR} € y bloquea tu espectáculo.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/checkout"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#ecb613] text-black font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all duration-300 hover:scale-[1.02] shadow-[0_0_40px_-10px_rgba(236,182,19,0.6)]"
            >
              Ir al Checkout
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-[#09090d]/80 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:border-[#ecb613]/40 transition-all duration-300"
            >
              <MessageCircle size={16} className="text-[#ecb613]" />
              +34 693 693 048
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}