import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Disc, Star, ShieldCheck, Heart, Trophy, Music, Calendar, 
  ArrowRight, ChevronRight 
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata: Metadata = {
  title: 'DJs & Ingeniería Rítmica S-Class | Productora EAR',
  description: 'Contrata DJs profesionales y servicios de diseño de iluminación y sonido de gala para eventos corporativos, institucionales y fiestas exclusivas.',
  alternates: {
    canonical: 'https://www.productoraear.com/artistas/djs',
  }
};

export default function DJsElectronicPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "DJs e Ingeniería Rítmica S-Class",
    "description": "Portafolio oficial de DJs y soluciones de ingeniería acústica de Productora EAR.",
    "url": "https://productoraear.com/artistas/djs"
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-40 pb-24 font-sans selection:bg-[#ecb613]/30 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-1/3 left-0 w-[500px] h-[500px] bg-white/[0.02] blur-[120px] rounded-full pointer-events-none -translate-x-1/4" />

      <div className="max-w-7xl mx-auto px-6 space-y-24 relative z-10">
        
        {/* HERO */}
        <section className="space-y-6 text-center max-w-4xl mx-auto">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20 flex items-center gap-1.5 font-mono">
              <Disc size={12} /> Ingeniería de Sonido V2
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              ELECTRONIC & DJS
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white font-syne">
            DJs & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white/70">Electronic</span> S-Class
          </h1>
          
          <p className="text-white/40 text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto">
            La confluencia del diseño acústico premium y la ingeniería rítmica. Sets exclusivos de música electrónica, house melódico y fisiones tradicionales con percusión en vivo.
          </p>
        </section>

        {/* DETAILS */}
        <section className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden group">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono">
                  Curaduría Rítmica de Precisión
                </span>
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest font-mono">
                  S-CLASS ENGINEERING
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] font-syne">
                Ingeniería <br /><span className="text-[#ecb613]">Rítmica</span>
              </h2>

              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                El ritmo corporativo y de gala exige una transición fluida y un control absoluto de las intensidades acústicas. Nuestros DJs e ingenieros de cabina no solo diseñan transiciones elegantes, sino que operan con equipos de sonido de rango completo calibrados específicamente para el recinto. Ofrecemos fisiones en directo que incluyen solistas de viento o percusión charra interpretando sobre bases rítmicas modernas de house melódico.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/contacto?subject=Reserva+DJ+Premium"
                  className="px-8 py-4 bg-white text-black hover:bg-[#ecb613] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all text-center animate-pulse"
                >
                  Contratar DJ Premium
                </Link>
                <Link 
                  href="/artistas"
                  className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/30 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all text-center"
                >
                  Ver Catálogo de Artistas
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#ecb613]">
                <Disc size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-syne">Ficha de Ingeniería</h3>
              
              <div className="space-y-4 border-t border-white/5 pt-4">
                {[
                  { label: "Equipamiento Cabina", value: "Pioneer DJ CDJ-3000 / DJM-A9 Standard Global" },
                  { label: "Diseño Lumínico Acoplado", value: "Cabezas móviles LED DMX de alta definición" },
                  { label: "Soporte Sonoro", value: "Columnas auto-alimentadas Bose L1 PRO / F1 System" },
                  { label: "Duración de los Sets", value: "Desde 120 minutos hasta 5 horas continuas" },
                  { label: "Repertorio y Playlists", value: "Curaduría adaptada según el protocolo del Planner OS" }
                ].map((spec, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">{spec.label}</span>
                    <span className="text-xs font-bold text-white/80">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        </section>

        {/* PRICING */}
        <section className="space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Excelencia Técnica EAR OS</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne">Tarifas y Transparencia</h2>
            <p className="text-white/40 text-sm md:text-base leading-relaxed">
              La calidad rítmica depende del rigor acústico. Consulta el desglose tarifario garantizado sin costes de intermediarios.
            </p>
          </div>

          <ArtistPricingMatrix />
        </section>

        {/* TESTIMONIALS */}
        <ArtistTestimonials />

        {/* PREVENTS DEAD ENDS */}
        <section className="border-t border-white/5 pt-20">
          <div className="bg-[#0b0b0b] rounded-[3rem] border border-white/5 p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.4em] font-mono">
                Ecosistema EAR OS
              </span>
              <h3 className="text-3xl font-black uppercase italic tracking-tight font-syne">
                ¿Prefieres un show tradicional en acústico?
              </h3>
              <p className="text-white/40 text-sm">
                Consulta las opciones de solistas premium lideradas por la impecable trayectoria de Edwin Agudelo.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link 
                href="/artistas/solistas"
                className="px-8 py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all flex items-center justify-center gap-2 group"
              >
                Ver Solistas Premium
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contacto"
                className="px-8 py-5 bg-[#ecb613] hover:bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all"
              >
                Hablar con Dirección Artística
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
