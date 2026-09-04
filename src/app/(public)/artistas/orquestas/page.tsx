import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, Star, ShieldCheck, Heart, Sparkles, Trophy, Music, Calendar, 
  ArrowRight, ChevronRight, Mic2 
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata: Metadata = {
  title: 'Orquestas de Gala S-Class | Ensambles Productora EAR',
  description: 'Contrata las mejores agrupaciones y ensambles de mariachi en España. Puestas en escena soberbias dirigidas por Edwin Agudelo con trajes de charro de gala.',
  alternates: {
    canonical: 'https://www.productoraear.com/artistas/orquestas',
  }
};

export default function OrquestasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "Orquestas y Ensambles S-Class",
    "description": "Portafolio oficial de orquestas y agrupaciones de gran escala del ecosistema Productora EAR.",
    "url": "https://productoraear.com/artistas/orquestas"
  };

  const localizedOrquestas = [
    {
      slug: "mariachis-bodas-barcelona-gala",
      title: "Ensamble de Gala en Barcelona",
      location: "Barcelona",
      desc: "Gran puesta en escena con 6+ músicos y sombreros tradicionales.",
      icon: <Users className="text-amber-400" size={24} />
    },
    {
      slug: "mariachi-aniversarios-zaragoza-gala",
      title: "Agrupación Profesional en Zaragoza",
      location: "Zaragoza",
      desc: "Perfecto para aniversarios, bodas de oro y eventos de empresa.",
      icon: <Music className="text-[#ecb613]" size={24} />
    }
  ];

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
              <Users size={12} /> Academia Diamante Rojo V2
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              S-CLASS ENSAMBLES
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white font-syne">
            Orquestas <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white/70">S-Class</span>
          </h1>
          
          <p className="text-white/40 text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto">
            La majestuosidad y el poder sónico de ensambles de gran formato. Formaciones tradicionales de alta escuela coordinadas bajo estándares militares de etiqueta.
          </p>
        </section>

        {/* DETAILS */}
        <section className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden group">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono">
                  Curaduría Militar de Escena
                </span>
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest font-mono">
                  S-CLASS STANDARDS
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] font-syne">
                Ensambles <br /><span className="text-[#ecb613]">Profesionales</span>
              </h2>

              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                Nuestras agrupaciones representan el cenit de la puesta en escena mexicana en la península ibérica. Con un mínimo de 6 integrantes (guitarrón, vihuela, guitarra, violines y trompetas), cada músico es rigurosamente seleccionado de la Academia Diamante Rojo, asegurando una presentación de gala pulcra, trajes bordados a mano de alta costura y un comportamiento social intachable alineado con los protocolos de eventos corporativos e institucionales.
              </p>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Nodos Territoriales de Ensambles:</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {localizedOrquestas.map((item, idx) => (
                    <Link 
                      key={idx} 
                      href={`/artistas/${item.slug}`} 
                      className="p-5 bg-white/[0.02] border border-white/5 hover:border-[#ecb613]/30 rounded-2xl flex flex-col justify-between transition-all group/link hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/5 rounded-xl text-white/60">
                          {item.icon}
                        </div>
                        <span className="text-[8px] font-mono font-black text-white/30 uppercase">{item.location}</span>
                      </div>
                      <div>
                        <h5 className="text-[12px] font-black uppercase tracking-tight text-white group-hover/link:text-[#ecb613] transition-colors mb-1">{item.title}</h5>
                        <p className="text-[9px] text-white/40 leading-tight italic">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/contacto?subject=Reserva+Ensamble+Mariachi+6"
                  className="px-8 py-4 bg-white text-black hover:bg-[#ecb613] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all text-center"
                >
                  Reservar Ensamble de Gala
                </Link>
                <Link 
                  href="/artistas"
                  className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/30 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all text-center"
                >
                  Explorar Catálogo General
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#ecb613]">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-syne">Ficha de Formación</h3>
              
              <div className="space-y-4 border-t border-white/5 pt-4">
                {[
                  { label: "Músicos en Escena", value: "Desde 6 hasta 12 integrantes en gala" },
                  { label: "Rider de Microfonía", value: "Inalámbrica Shure / Ecualización digital" },
                  { label: "Duración Recomendada", value: "60 a 120 minutos en dos bloques" },
                  { label: "Repertorio de Apertura", value: "El Rey, La Bikina, Si Nos Dejan" },
                  { label: "Cumplimiento Operativo", value: "Seguro RC de montaje y coordinación directa de tiempos" }
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
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Garantía Corporativa EAR OS</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne">Tarifas y Transparencia</h2>
            <p className="text-white/40 text-sm md:text-base leading-relaxed">
              El valor de los ensambles de gran formato radica en su impacto visual y su potencia sonora natural. Consulta el desglose tarifario sin sobrecostes ocultos.
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
                ¿Buscas formatos individuales?
              </h3>
              <p className="text-white/40 text-sm">
                Si buscas una amenización acústica íntima y flexible, consulta nuestra selección de solistas de alta alcurnia.
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
