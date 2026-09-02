import React from 'react';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { Sparkles, Calendar } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

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
        <ArtistTestimonials />

      </div>
    </main>
  );
}
