import React from 'react';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { Sparkles, Smile } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata = generateArtistSEOMeta('cumpleaños', 'España');

export default function ArtistasCumpleanosPage() {
  const schema = generateEventSchema('cumpleaños', 'España');

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-36 sm:pt-40 pb-24 font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16 sm:space-y-20">
        
        {/* Hero */}
        <section className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 font-mono">
              <Smile size={12} /> Celebración Familiar
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              BIRTHDAY SERENADES
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-none">
            Mariachis para Cumpleaños & Fiestas
          </h1>
          <p className="text-white/40 text-base sm:text-lg italic leading-relaxed">
            Sorprende con "Las Mañanitas" en directo interpretadas con la elegancia sónica del repertorio premium de Edwin Agudelo.
          </p>
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] sm:rounded-[3rem] p-8 sm:p-16 grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white font-syne">Rancheras y Alegría en Directo</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              La mejor música para animar a familiares e invitados. Coordinamos el inicio del show con velas, pasteles de cumpleaños y dedicatorias alegres.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
            <Sparkles className="text-[#ecb613]" size={32} />
            <h3 className="text-lg font-black uppercase">Diversión Asegurada</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Un espectáculo ameno y sumamente interactivo donde los homenajeados cantan y bailan al ritmo de la mejor música tradicional.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

      </div>
    </main>
  );
}
