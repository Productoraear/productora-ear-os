import React from 'react';
import { Metadata } from 'next';
import { SClassPricingTerminal } from '@/components/pricing/SClassPricingTerminal';
import { EdwinLegacyPlayer } from '@/features/artists/ui/EdwinLegacyPlayer';
import { Mic2, Star, Sparkles, ArrowRight, MessageCircle, ShieldCheck, Clock, Music2 } from 'lucide-react';
import Link from 'next/link';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Edwin Agudelo | Cantante, Compositor y Mariachi | Disponibilidad Mundial 24/7',
  description: `Cantante y compositor arropado por la figura del mariachi. Disponibilidad mundial 24/7 con exclusividad absoluta en la fecha. Tarifa solista ${TARIFA_BASE_SOLISTA_EUR} €. Sonorización Bose F1 12 W/pax, Price-Lock SHA-256.`,
};

const WHATSAPP_URL = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}`;

const REPERTORIO_TEMAS = 400;
const TRAYECTORIA_ANIOS = 25;
const PRESION_SONORA_W_PAX = 12;
const SEGURO_RC_EUR = 1_000_000;
const SPLIT_ARTISTA_PCT = 80;
const VALORACION_MEDIA = 5.0;
const BODAS_AUDITADAS = 180;
const CIUDADES_ES = 42;
const PAISES_EU = 9;
const HORAS_RESPUESTA = 2;
const PRICE_LOCK_HORAS = 72;

const ARTIST_CANONICAL_URL = 'https://productoraear.com/artistas/edwin-agudelo';
const ARTIST_BOOKING_URL = 'https://productoraear.com/reservar/solista';
const ARTIST_IMAGE_URL = 'https://productoraear.com/media/edwin-hero.jpg';
const ARTIST_EMAIL = 'productoraear@gmail.com';

interface JsonLdOffer {
  '@type': 'Offer';
  url: string;
  price: string;
  priceCurrency: 'EUR';
  priceValidUntil: string;
  availability: string;
  itemOffered: {
    '@type': 'Service';
    name: string;
  };
}

interface JsonLdPerson {
  '@type': ['Person', 'MusicArtist'];
  '@id': string;
  name: string;
  alternateName: string;
  jobTitle: string;
  description: string;
  url: string;
  telephone: string;
  email: string;
  image: string;
  sameAs: string[];
  offers: JsonLdOffer;
}

interface JsonLdQuestion {
  '@type': 'Question';
  name: string;
  acceptedAnswer: {
    '@type': 'Answer';
    text: string;
  };
}

interface JsonLdFaq {
  '@type': 'FAQPage';
  '@id': string;
  mainEntity: JsonLdQuestion[];
}

interface JsonLdGraph {
  '@context': 'https://schema.org';
  '@graph': [JsonLdPerson, JsonLdFaq];
}

export default function EdwinAgudeloPage(): React.JSX.Element {
  const jsonLd: JsonLdGraph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Person', 'MusicArtist'],
        '@id': `${ARTIST_CANONICAL_URL}#artist`,
        name: 'Edwin Agudelo',
        alternateName: 'Edwin Agudelo Tenor',
        jobTitle: 'Tenor Lírico, Compositor y Mariachi Solista',
        description:
          'Tenor lírico de conservatorio con 25 años de trayectoria escénica. Especialista en serenatas de mariachi de gran gala, boleros, baladas y repertorio clásico para bodas y galas en España y Europa.',
        url: ARTIST_CANONICAL_URL,
        telephone: CENTRALITA_EAR_OS,
        email: ARTIST_EMAIL,
        image: ARTIST_IMAGE_URL,
        sameAs: [
          'https://www.youtube.com/@EdwinAgudeloTenor',
          'https://www.instagram.com/edwinagudelotenor',
          WHATSAPP_URL,
        ],
        offers: {
          '@type': 'Offer',
          url: ARTIST_BOOKING_URL,
          price: TARIFA_BASE_SOLISTA_EUR.toFixed(2),
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            name: 'Actuación Solista Premium Edwin Agudelo con Sonido Bose F1',
          },
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${ARTIST_CANONICAL_URL}#faq`,
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cuánto cobra Edwin Agudelo por cantar en una boda o cóctel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `La tarifa base oficial de Edwin Agudelo como solista lírico es de ${TARIFA_BASE_SOLISTA_EUR} € e incluye sistema de sonido profesional Bose F1 Model 812 (1.000 W), microfonía inalámbrica Shure Axient Digital y repertorio a medida.`,
            },
          },
          {
            '@type': 'Question',
            name: '¿Qué repertorio interpreta Edwin Agudelo en sus actuaciones?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Su repertorio abarca más de ${REPERTORIO_TEMAS} temas: serenatas mexicanas tradicionales de mariachi (El Rey, Si Nos Dejan, Volver Volver), boleros de oro, baladas románticas, arias líricas y crossover pop internacional.`,
            },
          },
          {
            '@type': 'Question',
            name: '¿Cómo reservar la fecha con exclusividad 24/7?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: `La reserva se formaliza con un depósito de ${DEPOSITO_STRIPE_EUR} € a través de la pasarela Stripe Price-Lock SHA-256 de Productora EAR, garantizando la exclusividad total de la fecha y el bloqueo inmutable de la tarifa por ${PRICE_LOCK_HORAS} horas.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen w-full overflow-x-hidden bg-[#030305] text-white pt-28 pb-28 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
        <div className="max-w-7xl mx-auto space-y-16">
          {/* Top Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-widest uppercase mb-4 transition-all duration-500 ease-out hover:bg-[#ecb613]/15 hover:border-[#ecb613]/50 hover:shadow-[0_0_24px_-8px_rgba(236,182,19,0.5)] hover:-translate-y-0.5">
                  <Sparkles size={14} className="animate-pulse" />
                  <span>TENOR LÍRICO · {TRAYECTORIA_ANIOS} AÑOS · {REPERTORIO_TEMAS}+ TEMAS</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[1.05]">
                  Edwin <span className="text-[#ecb613] italic">Agudelo</span>
                </h1>
                <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-xl font-light mt-4">
                  Tenor lírico de conservatorio con {TRAYECTORIA_ANIOS} años de trayectoria escénica y {REPERTORIO_TEMAS}+ temas en repertorio. Mariachi de gran gala, boleros, baladas y arias para bodas y galas en {CIUDADES_ES} ciudades de España y {PAISES_EU} países de Europa. Respuesta en menos de {HORAS_RESPUESTA} h.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 flex items-start gap-4 hover:border-[#ecb613]/50 hover:-translate-y-1 hover:shadow-[0_12px_40px_-16px_rgba(236,182,19,0.35)] transition-all duration-300 ease-out shadow-lg">
                  <Star className="text-[#ecb613] shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-white font-syne uppercase tracking-wider">{VALORACION_MEDIA.toFixed(1)} / 5 · {BODAS_AUDITADAS} BODAS</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Valoración media auditada en {BODAS_AUDITADAS} bodas y eventos premium en España.</p>
                  </div>
                </div>
                <div className="group rounded-3xl bg-[#09090d]/80 border border-white/10 p-5 flex items-start gap-4 hover:border-[#ecb613]/50 hover:-translate-y-1 hover:shadow-[0_12px_40px_-16px_rgba(236,182,19,0.35)] transition-all duration-300 ease-out shadow-lg">
                  <Mic2 className="text-[#ecb613] shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6" size={24} />
                  <div>
                    <h4 className="font-bold text-sm text-white font-syne uppercase tracking-wider">{PRESION_SONORA_W_PAX} W/PAX · BOSE F1</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">Bose F1 Model 812 (1.000 W) + Shure Axient Digital inalámbrico.</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-zinc-200 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(236,182,19,0.4)]">
                  <ShieldCheck size={12} className="text-[#ecb613]" />
                  Seguro RC {SEGURO_RC_EUR.toLocaleString('es-ES')} €
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-zinc-200 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(236,182,19,0.4)]">
                  <Music2 size={12} className="text-[#ecb613]" />
                  Split artista {SPLIT_ARTISTA_PCT}%
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-lg border border-white/10 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-zinc-200 hover:bg-white/[0.07] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-12px_rgba(236,182,19,0.4)]">
                  <Clock size={12} className="text-[#ecb613]" />
                  Price-Lock SHA-256 · {PRICE_LOCK_HORAS} h
                </span>
              </div>

              {/* CTA de cierre real */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/reservar/solista"
                  className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#ecb613] text-black font-bold text-sm uppercase tracking-wider overflow-hidden transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:-translate-y-1 hover:shadow-[0_18px_45px_-12px_rgba(236,182,19,0.75)] active:translate-y-0 active:scale-[0.98] shadow-[0_0_30px_-10px_rgba(236,182,19,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" aria-hidden="true" />
                  <span className="relative z-10">Reservar fecha · {TARIFA_BASE_SOLISTA_EUR} €</span>
                  <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#09090d]/80 border border-white/10 text-white font-bold text-sm uppercase tracking-wider transition-all duration-300 ease-out hover:border-[#ecb613]/60 hover:-translate-y-1 hover:bg-[#0d0d12] hover:shadow-[0_18px_45px_-18px_rgba(236,182,19,0.45)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
                >
                  <MessageCircle size={16} className="text-[#ecb613] transition-transform duration-300 group-hover:scale-110" />
                  <span>WhatsApp directo</span>
                </a>
              </div>
            </div>

            <div className="w-full flex justify-center lg:justify-end">
              <SClassPricingTerminal />
            </div>
          </div>

          {/* 🎵 Jukebox Multimedia S-Class de Edwin Agudelo */}
          <section className="space-y-6 pt-8 border-t border-white/10">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold">
                BÓVEDA DE AUTOR · {REPERTORIO_TEMAS}+ TEMAS CATALOGADOS
              </span>
              <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
                Discografía, Vídeos & <span className="text-[#ecb613]">Lírica en Directo</span>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 font-light">
                Reproduce las interpretaciones maestras de Edwin Agudelo: {REPERTORIO_TEMAS}+ temas entre bachata urbana de autor, boleros de oro y clásicos rancheros en directo.
              </p>
            </div>

            <EdwinLegacyPlayer />
          </section>
        </div>
      </main>
    </>
  );
}