import React from 'react';
import { Metadata } from 'next';
import { SClassPricingTerminal } from '@/components/pricing/SClassPricingTerminal';
import { EdwinLegacyPlayer } from '@/features/artists/ui/EdwinLegacyPlayer';
import { Mic2, Star, ShieldCheck, Award, Sparkles, Music, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Edwin Agudelo | Cantante, Compositor y Mariachi | Disponibilidad Mundial 24/7',
  description: 'Cantante y compositor arropado por la figura del mariachi. Disponibilidad mundial 24/7 con exclusividad absoluta en la fecha. Sonorización Bose F1 12 W/pax, Price-Lock SHA-256.',
};

export default function EdwinAgudeloPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Person', 'MusicArtist'],
        '@id': 'https://productoraear.com/artistas/edwin-agudelo#artist',
        name: 'Edwin Agudelo',
        alternateName: 'Edwin Agudelo Tenor',
        jobTitle: 'Tenor Lírico, Compositor y Mariachi Solista',
        description: 'Tenor lírico de conservatorio con 25 años de trayectoria escénica. Especialista en serenatas de mariachi de gran gala, boleros, baladas y repertorio clásico para bodas y galas en España y Europa.',
        url: 'https://productoraear.com/artistas/edwin-agudelo',
        telephone: '+34693693048',
        email: 'productoraear@gmail.com',
        image: 'https://productoraear.com/media/edwin-hero.jpg',
        sameAs: [
          'https://www.youtube.com/@EdwinAgudeloTenor',
          'https://www.instagram.com/edwinagudelotenor',
          'https://wa.me/34693693048'
        ],
        offers: {
          '@type': 'Offer',
          url: 'https://productoraear.com/artistas/edwin-agudelo',
          price: '350.00',
          priceCurrency: 'EUR',
          priceValidUntil: '2026-12-31',
          availability: 'https://schema.org/InStock',
          itemOffered: {
            '@type': 'Service',
            name: 'Actuación Solista Premium Edwin Agudelo con Sonido Bose F1'
          }
        }
      },
      {
        '@type': 'FAQPage',
        '@id': 'https://productoraear.com/artistas/edwin-agudelo#faq',
        mainEntity: [
          {
            '@type': 'Question',
            name: '¿Cuánto cobra Edwin Agudelo por cantar en una boda o cóctel?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'La tarifa base oficial de Edwin Agudelo como solista lírico es de 350 € e incluye sistema de sonido profesional Bose F1 Model 812 (1.000 W), microfonía inalámbrica Shure Axient Digital y repertorio a medida.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Qué repertorio interpreta Edwin Agudelo en sus actuaciones?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Su repertorio abarca más de 400 temas: serenatas mexicanas tradicionales de mariachi (El Rey, Si Nos Dejan, Volver Volver), boleros de oro, baladas románticas, arias líricas y crossover pop internacional.'
            }
          },
          {
            '@type': 'Question',
            name: '¿Cómo reservar la fecha con exclusividad 24/7?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'La reserva se formaliza con un depósito de 100 € a través de la pasarela Stripe Price-Lock SHA-256 de Productora EAR, garantizando la exclusividad total de la fecha y el bloqueo inmutable de la tarifa por 72 horas.'
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="min-h-screen bg-[#050505] text-white pt-28 pb-28 px-4 md:px-8 font-sans selection:bg-[#ecb613] selection:text-black">
        <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Top Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono tracking-widest uppercase mb-4">
                <Sparkles size={14} />
                <span>CANTANTE Y COMPOSITOR // EXCLUSIVIDAD 24/7 MUNDIAL</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white font-syne leading-[1.05]">
                Edwin <span className="text-[#ecb613] italic">Agudelo</span>
              </h1>
              <p className="text-zinc-300 text-base md:text-lg leading-relaxed max-w-xl font-light mt-4">
                Cantante y compositor arropado por la majestuosa figura del mariachi. Con más de 25 años de trayectoria y oficio real sobre los escenarios, ofrece disponibilidad para viajar a cualquier lugar del mundo (24/7) garantizando exclusividad absoluta en tu fecha.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#0e0e14] border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:border-[#ecb613]/40 transition-colors shadow-lg">
                <Star className="text-[#ecb613] shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-sm text-white font-syne uppercase tracking-wider">5.0 / 5 Verificado</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Satisfacción auditada en bodas y eventos premium en España.</p>
                </div>
              </div>
              <div className="bg-[#0e0e14] border border-white/10 p-5 rounded-2xl flex items-start gap-4 hover:border-[#ecb613]/40 transition-colors shadow-lg">
                <Mic2 className="text-[#ecb613] shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-sm text-white font-syne uppercase tracking-wider">Presión 12 W/PAX</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Sistemas Bose F1 & Microfonía Shure Axient Digital.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400">
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">Seguro RC 1.000.000 €</span>
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">Split Soberano 80%</span>
              <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/10">Price-Lock SHA-256</span>
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
              BÓVEDA DE AUTOR & AUDICIÓN EN VIVO
            </span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
              Discografía, Vídeos & <span className="text-[#ecb613]">Lírica en Directo</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-light">
              Explora y reproduce las interpretaciones maestras de Edwin Agudelo. Desde bachata urbana de autor hasta clásicos rancheros en directo.
            </p>
          </div>

          <EdwinLegacyPlayer />
        </section>

      </div>
    </main>
    </>
  );
}
