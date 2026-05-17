import React from 'react';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { ShieldCheck, Disc } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata = generateArtistSEOMeta('festivales', 'España');

export default function ArtistasFestivalesPage() {
  const schema = generateEventSchema('festivales', 'España');

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
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">Impacto Escénico Contundente</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Arreglos contemporáneos y fusión de metales e instrumentos tradicionales adaptados a los sistemas de sonido PA de gran envergadura.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
            <ShieldCheck className="text-[#ecb613]" size={36} />
            <h3 className="text-lg font-black uppercase">Rider de Nivel 1</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Suministramos un rider técnico detallado en PDF y archivos máster con el mapa de microfonía exacta para agilizar las pruebas de sonido en festivales multitarea.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

      </div>
    </main>
  );
}
