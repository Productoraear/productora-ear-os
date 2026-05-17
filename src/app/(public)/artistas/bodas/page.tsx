import React from 'react';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { ShieldCheck, Heart } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata = generateArtistSEOMeta('bodas', 'España');

export default function ArtistasBodasPage() {
  const schema = generateEventSchema('bodas', 'España');

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
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
              <Heart size={12} /> Boda de Ensueño
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              ROMANTIC REPERTOIRE
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis para Bodas & Ceremonias
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Haz de tu día más especial un recuerdo imborrable con la elegancia indiscutible del mariachi de gala de Edwin Agudelo.
          </p>
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">El Toque Romántico Ideal</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              Desde el vals nupcial hasta el cóctel de bienvenida. Adaptamos la formación y la intensidad del show para fundirse en la narrativa de vuestro enlace.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
            <ShieldCheck className="text-[#ecb613]" size={36} />
            <h3 className="text-lg font-black uppercase">Reserva Protegida</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Bloquea hoy mismo vuestra fecha de enlace con total flexibilidad y reembolso garantizado en caso de fuerza mayor.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

      </div>
    </main>
  );
}
