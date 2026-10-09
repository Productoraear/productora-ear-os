import React from 'react';
import Link from 'next/link';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { Sparkles, Calendar } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';
import { DEPOSITO_STRIPE_EUR, CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export const metadata = generateArtistSEOMeta('aniversarios', 'España');

export default function ArtistasAniversariosPage() {
  const schema = generateEventSchema('aniversarios', 'España');

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-6 space-y-20">

        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5">
              <Sparkles size={12} /> Hitos Singulares
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              MEMORABLE SHOWS
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Aniversarios & Bodas de Oro
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Homenajes llenos de sentimiento y emoción profunda con las rancheras clásicas preferidas de tus seres queridos.
          </p>
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">El Regalo Más Emotivo</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Sorprende en bodas de plata, bodas de oro o aniversarios de trayectoria con una entrada triunfal. Edwin Agudelo y su equipo de gala entonarán las baladas más conmovedoras con la máxima fidelidad acústica.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
            <Calendar className="text-[#ecb613]" size={36} />
            <h3 className="text-lg font-black uppercase">Planificación Fina</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Coordinamos la entrada secreta, los temas musicales exactos y las dedicatorias personalizadas con total discreción para garantizar la sorpresa absoluta.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />

        {/* CTA de compra real — Depósito 100 € deducible con bloqueo atómico de fecha/hora */}
        <section className="bg-[#09090d]/80 border border-white/10 backdrop-blur-md rounded-3xl p-10 md:p-14 text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white font-syne">
            Bloquea tu fecha hoy
          </h2>
          <p className="text-white/50 text-sm leading-relaxed">
            Depósito de {DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} € 100% deducible del total del show,
            con bloqueo atómico y exclusivo de fecha y hora. Cero cancelaciones de última hora, cero mirones.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/reservar/solista"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#ecb613] text-black text-sm font-black uppercase tracking-widest transition-all duration-300 ease-out hover:bg-[#f5c93a] hover:scale-[1.03] active:scale-[0.98]"
            >
              Bloquear Fecha (Stripe 100 €)
            </Link>
            <a
              href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/\s/g, '')}?text=${encodeURIComponent('Hola, quiero bloquear mi fecha para un aniversario con Edwin Agudelo (Depósito 100 € deducible).')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/10 text-white text-sm font-black uppercase tracking-widest border border-white/10 hover:bg-white/20 transition-all duration-300"
            >
              Consultar por WhatsApp
            </a>
          </div>
        </section>

        <ArtistTestimonials />

      </div>
    </main>
  );
}
