import React from 'react';
import Link from 'next/link';
import { generateArtistSEOMeta, generateEventSchema } from '@/lib/artists/seo';
import { Sparkles, Calendar, Star, ShieldCheck } from 'lucide-react';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata = generateArtistSEOMeta('eventos corporativos', 'España');

export default function ArtistasEventosPage() {
  const schema = generateEventSchema('eventos corporativos', 'España');

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
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Gala & Corporativo
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              Premium Shows
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Mariachis Profesionales para Eventos
          </h1>
          <p className="text-white/40 text-lg italic leading-relaxed">
            Consigue la máxima distinción en tus cenas de gala, conferencias empresariales o eventos institucionales de la mano del productor principal Edwin Agudelo.
          </p>
        </section>

        {/* Dynamic Content */}
        <section className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-black uppercase tracking-tight text-white font-syne">La Diferencia Sinfónica</h2>
            <p className="text-white/50 text-sm leading-relaxed">
              No ofrecemos animación convencional. Ofrecemos **arquitectura sónica** diseñada a medida por Edwin Agudelo para impactar positivamente en la conversión de marca y el agasajo a tus clientes VIP.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              Equipamiento técnico inalámbrico de última generación, trajes de alta sastrería mexicana y un repertorio cuidadosamente seleccionado.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
            <ShieldCheck className="text-[#ecb613]" size={36} />
            <h3 className="text-lg font-black uppercase">Seguridad Contractual</h3>
            <p className="text-white/40 text-xs leading-relaxed font-bold">
              Todos nuestros espectáculos cuentan con contratos firmados digitalmente en nuestro Ledger con cláusulas de cumplimiento blindadas y factura formal.
            </p>
          </div>
        </section>

        <ArtistPricingMatrix />
        <ArtistTestimonials />

      </div>
    </main>
  );
}
