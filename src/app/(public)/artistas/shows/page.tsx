import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Sparkles, Star, ShieldCheck, Heart, Trophy, Music, Calendar, 
  ArrowRight, ChevronRight, LayoutGrid 
} from 'lucide-react';
import { ROUTES } from '@/lib/routes';
import { ArtistPricingMatrix } from '@/app/components/artists/ArtistPricingMatrix';
import { ArtistTestimonials } from '@/app/components/artists/ArtistTestimonials';

export const metadata: Metadata = {
  title: 'Shows de Impacto S-Class | Productora EAR',
  description: 'Contrata espectáculos ecuestres y bandas monumentales de mariachi. Edwin Agudelo cantando a caballo y ensambles masivos para eventos corporativos de gran escala.',
  alternates: {
    canonical: 'https://productoraear.com/artistas/shows',
  }
};

export default function ShowsImpactoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "Espectáculos y Shows de Impacto S-Class",
    "description": "Portafolio oficial de espectáculos ecuestres, mariachi a caballo y bandas monumentales de Productora EAR.",
    "url": "https://productoraear.com/artistas/shows"
  };

  const localizedShows = [
    {
      slug: "mariachi-caballo-eventos-sevilla",
      title: "Show Cantando a Caballo en Sevilla",
      location: "Sevilla",
      desc: "Espectáculo ecuestre único que fusiona doma clásica de alta escuela con música.",
      icon: <Sparkles className="text-amber-400" size={24} />
    },
    {
      slug: "mariachi-ayuntamientos-valencia-monumental",
      title: "Banda Monumental en Valencia",
      location: "Valencia",
      desc: "Licitaciones públicas y festivales culturales de gran aforo y solemnidad.",
      icon: <Trophy className="text-[#ecb613]" size={24} />
    },
    {
      slug: "mariachis-corporativos-madrid-monumental",
      title: "Galas Corporativas en Madrid IFEMA",
      location: "Madrid",
      desc: "Amenización espectacular a gran escala para convenciones B2B globales.",
      icon: <LayoutGrid className="text-red-400" size={24} />
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
              <Sparkles size={12} /> Espectáculos de Autor V2
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              HIGH-IMPACT SHOWS
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none text-white font-syne">
            Shows de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white/70">Impacto</span> S-Class
          </h1>
          
          <p className="text-white/40 text-lg md:text-xl italic leading-relaxed max-w-2xl mx-auto">
            La máxima expresión del espectáculo escénico tradicional. Fusiones ecuestres únicas de alta escuela andaluza y ensambles monumentales de 12+ músicos para grandes aforos.
          </p>
        </section>

        {/* DETAILS */}
        <section className="bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden group">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/25 font-mono">
                  Patrimonio Visual de Gran Escala
                </span>
                <span className="text-white/30 text-[9px] font-black uppercase tracking-widest font-mono">
                  S-CLASS LOGISTICS
                </span>
              </div>

              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter leading-[0.9] font-syne">
                Espectáculos <br /><span className="text-[#ecb613]">Monumentales</span>
              </h2>

              <p className="text-white/50 text-sm md:text-base leading-relaxed">
                Diseñados específicamente para captar la atención de multitudes y elevar la marca de marcas líderes e instituciones. Nuestro show estrella, <strong>"Cantando a Caballo"</strong>, presenta a Edwin Agudelo interpretando clásicos rancheros montado sobre caballos de alta escuela con doma clásica rigurosa. Por otro lado, la <strong>Banda Monumental EAR</strong> despliega más de 12 músicos en escena coordinando sistemas de sonido complejos, ideal para ferias, plazas y recintos de exposiciones de gran envergadura.
              </p>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Producciones Especiales Disponibles:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {localizedShows.map((item, idx) => (
                    <Link 
                      key={idx} 
                      href={`/artistas/${item.slug}`} 
                      className="p-4 bg-white/[0.02] border border-white/5 hover:border-[#ecb613]/30 rounded-2xl flex flex-col justify-between transition-all group/link hover:-translate-y-1"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/5 rounded-xl text-white/60">
                          {item.icon}
                        </div>
                        <span className="text-[8px] font-mono font-black text-white/30 uppercase">{item.location}</span>
                      </div>
                      <div>
                        <h5 className="text-[11px] font-black uppercase tracking-tight text-white group-hover/link:text-[#ecb613] transition-colors mb-1">{item.title}</h5>
                        <p className="text-[9px] text-white/40 leading-tight italic">{item.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link 
                  href="/contacto?subject=Reserva+Espectaculo+Ecuestre"
                  className="px-8 py-4 bg-white text-black hover:bg-[#ecb613] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all text-center"
                >
                  Reservar Show Ecuestre
                </Link>
                <Link 
                  href="/contacto?subject=Reserva+Banda+Monumental"
                  className="px-8 py-4 bg-white/5 border border-white/10 hover:border-white/30 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all text-center"
                >
                  Consultar Banda Monumental
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#ecb613]">
                <LayoutGrid size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-syne">Rider de Gran Impacto</h3>
              
              <div className="space-y-4 border-t border-white/5 pt-4">
                {[
                  { label: "Área Mínima Terreno (Ecuestre)", value: "30m x 20m de arena compactada o picadero" },
                  { label: "Acometida Eléctrica (Monumental)", value: "Trifásica de 32A para sistemas de iluminación y sonido" },
                  { label: "Seguridad y Seguro RC", value: "Completo de 600.000€ incluido en la logística del show" },
                  { label: "Duración de la Actuación", value: "90 a 120 minutos de pura espectacularidad" },
                  { label: "Formatos Disponibles", value: "Mariachi a Caballo / Banda de Viento y Cuerda 12+" }
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
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em]">Excelencia Logística EAR OS</span>
            <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne">Tarifas y Transparencia</h2>
            <p className="text-white/40 text-sm md:text-base leading-relaxed">
              Los espectáculos de gran formato requieren coordinación técnica avanzada y logística de transporte especializada. Consulta nuestros costes base auditados.
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
                ¿Buscas un formato tradicional para bodas?
              </h3>
              <p className="text-white/40 text-sm">
                Explora el Ensamble Clásico de Mariachis con 6 integrantes uniformados de gala, idóneo para amenizaciones refinadas de enlaces matrimoniales.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link 
                href="/artistas/orquestas"
                className="px-8 py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all flex items-center justify-center gap-2 group"
              >
                Ver Ensambles de Gala
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/contacto"
                className="px-8 py-5 bg-[#ecb613] hover:bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all"
              >
                Consultar con Productor Técnico
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}
