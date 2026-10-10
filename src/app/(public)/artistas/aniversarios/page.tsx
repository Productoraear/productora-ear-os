import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { Sparkles, Calendar, ArrowRight, MessageCircle } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';
import { DEPOSITO_STRIPE_EUR, CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

const SITE_URL = 'https://productora-ear.com';
const CANONICAL_PATH = '/artistas/aniversarios';

export const metadata: Metadata = {
  ...generateArtistSEOMeta('aniversarios', 'España'),
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}${CANONICAL_PATH}`,
  },
  openGraph: {
    title: 'Mariachis para Aniversarios & Bodas de Oro | Edwin Agudelo',
    description:
      'Mariachis profesionales para aniversarios, bodas de plata y bodas de oro en España. Bloquea tu fecha con depósito deducible.',
    url: `${SITE_URL}${CANONICAL_PATH}`,
    siteName: 'Productora EAR',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: `${SITE_URL}/og/artistas-aniversarios.jpg`,
        width: 1200,
        height: 630,
        alt: 'Mariachis para Aniversarios y Bodas de Oro — Edwin Agudelo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mariachis para Aniversarios & Bodas de Oro | Edwin Agudelo',
    description:
      'Mariachis profesionales para aniversarios y bodas de oro en España.',
    images: [`${SITE_URL}/og/artistas-aniversarios.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function ArtistasAniversariosPage(): React.JSX.Element {
  const schema = generateEventSchema('aniversarios', 'España');

  const depositoFormateado: string = DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',');
  const whatsappNumber: string = CENTRALITA_EAR_OS.replace(/\s/g, '');
  const whatsappMessage: string = encodeURIComponent(
    'Hola, quiero bloquear mi fecha para un aniversario con Edwin Agudelo (Depósito 100 € deducible).'
  );
  const whatsappHref: string = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans antialiased selection:bg-[#ecb613]/30 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-20">
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 transition-all duration-500 hover:bg-[#ecb613]/15 hover:border-[#ecb613]/40 hover:shadow-[0_0_24px_-6px_rgba(236,182,19,0.5)]">
              <Sparkles size={12} className="animate-pulse" /> Hitos Singulares
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              MEMORABLE SHOWS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Aniversarios &amp; Bodas de Oro
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Repertorio de rancheras clásicas, boleros y baladas para bodas de plata, bodas de oro y aniversarios de trayectoria.
          </p>
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center transition-all duration-500 hover:border-white/10 hover:shadow-[0_0_60px_-20px_rgba(236,182,19,0.15)]">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">
              Formato para Aniversarios
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Edwin Agudelo y su equipo de gala interpretan rancheras, boleros y baladas en formato acústico o con sonorización profesional. Repertorio adaptado a bodas de plata, bodas de oro y aniversarios de trayectoria, con entrada coordinada y dedicatorias personalizadas.
            </p>
          </div>
          <div className="group bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 transition-all duration-500 hover:bg-white/[0.07] hover:border-[#ecb613]/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(236,182,19,0.25)]">
            <Calendar
              className="text-[#ecb613] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]"
              size={36}
            />
            <h3 className="text-lg font-black uppercase">Coordinación del evento</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Definimos hora de entrada, temas musicales exactos y dedicatorias con antelación. Confirmación por escrito del setlist y del guion de la sorpresa antes del evento.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />

        {/* CTA de compra real — Depósito 100 € deducible con bloqueo atómico de fecha/hora */}
        <section className="relative overflow-hidden bg-[#09090d]/80 border border-white/10 backdrop-blur-md rounded-3xl p-10 md:p-14 text-center space-y-6 max-w-3xl mx-auto transition-all duration-500 hover:border-[#ecb613]/25 hover:shadow-[0_0_80px_-30px_rgba(236,182,19,0.35)]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-48 rounded-full bg-[#ecb613]/10 blur-3xl opacity-60 transition-opacity duration-700 hover:opacity-100"
          />
          <h2 className="relative text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-syne">
            Bloquea tu fecha hoy
          </h2>
          <p className="relative text-white/50 text-sm leading-relaxed">
            Depósito de {depositoFormateado} € 100% deducible del total del show,
            con bloqueo atómico y exclusivo de fecha y hora. Cero cancelaciones de última hora, cero mirones.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/reservar/solista"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#ecb613] text-black text-sm font-black uppercase tracking-widest transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:scale-[1.03] hover:shadow-[0_12px_40px_-10px_rgba(236,182,19,0.7)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              Bloquear Fecha (Stripe 100 €)
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white text-sm font-black uppercase tracking-widest border border-white/10 transition-all duration-300 ease-out hover:bg-white/20 hover:border-white/25 hover:scale-[1.03] hover:shadow-[0_12px_40px_-12px_rgba(255,255,255,0.25)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
            >
              <MessageCircle
                size={16}
                className="transition-transform duration-300 group-hover:scale-110"
              />
              Consultar por WhatsApp
            </a>
          </div>
        </section>

        <ArtistTestimonials />
      </div>
    </main>
  );
}