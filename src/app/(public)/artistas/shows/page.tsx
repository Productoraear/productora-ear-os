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

interface LocalizedShow {
  slug: string;
  title: string;
  location: string;
  desc: string;
  icon: React.ReactNode;
}

interface RiderSpec {
  label: string;
  value: string;
}

interface ShowMetric {
  label: string;
  value: string;
  detail: string;
}

export default function ShowsImpactoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    "name": "Espectáculos y Shows de Impacto S-Class",
    "description": "Portafolio oficial de espectáculos ecuestres, mariachi a caballo y bandas monumentales de Productora EAR.",
    "url": "https://productoraear.com/artistas/shows"
  };

  const localizedShows: LocalizedShow[] = [
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

  const riderSpecs: RiderSpec[] = [
    { label: "Área Mínima Terreno (Ecuestre)", value: "30m x 20m de arena compactada o picadero" },
    { label: "Acometida Eléctrica (Monumental)", value: "Trifásica de 32A para sistemas de iluminación y sonido" },
    { label: "Seguridad y Seguro RC", value: "Completo de 600.000€ incluido en la logística del show" },
    { label: "Duración de la Actuación", value: "90 a 120 minutos de pura espectacularidad" },
    { label: "Formatos Disponibles", value: "Mariachi a Caballo / Banda de Viento y Cuerda 12+" }
  ];

  const showMetrics: ShowMetric[] = [
    {
      label: "Aforo Cubierto",
      value: "500 – 5.000",
      detail: "asistentes por función en recintos cerrados y plazas"
    },
    {
      label: "Músicos en Escena",
      value: "12+",
      detail: "integrantes en la Banda Monumental EAR"
    },
    {
      label: "Potencia Sonora",
      value: "32A trifásica",
      detail: "sistema de sonido e iluminación profesional"
    },
    {
      label: "Cobertura RC",
      value: "600.000€",
      detail: "seguro de responsabilidad civil incluido"
    }
  ];

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans selection:bg-[#ecb613]/30 overflow-hidden">
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
            Doma clásica andaluza sobre caballo con Edwin Agudelo al cante, y ensambles de 12+ músicos con sistemas de sonido trifásicos para aforos de 500 a 5.000 asistentes.
          </p>
        </section>

        {/* METRICS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {showMetrics.map((metric, idx) => (
            <div
              key={idx}
              className="bg-[#0b0b0b] border border-white/5 rounded-3xl p-6 flex flex-col gap-2 hover:border-[#ecb613]/30 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(236,182,19,0.25)] transition-all duration-500 ease-out group/metric"
            >
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/30 font-mono group-hover/metric:text-[#ecb613]/70 transition-colors duration-500">
                {metric.label}
              </span>
              <span className="text-2xl md:text-3xl font-black italic tracking-tighter text-[#ecb613] font-syne group-hover/metric:scale-[1.03] origin-left transition-transform duration-500">
                {metric.value}
              </span>
              <span className="text-[10px] text-white/40 leading-tight">
                {metric.detail}
              </span>
            </div>
          ))}
        </section>

        {/* DETAILS */}
        <section className="bg-gradient-to-br from-[#0d0d0d] to-[#030305] border border-white/5 rounded-[3.5rem] p-8 md:p-16 relative overflow-hidden group">
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
                Diseñados para aforos de 500 a 5.000 asistentes y elevar la marca de marcas líderes e instituciones. Nuestro show estrella, <strong>&quot;Cantando a Caballo&quot;</strong>, presenta a Edwin Agudelo interpretando clásicos rancheros montado sobre caballos de alta escuela con doma clásica rigurosa. Por otro lado, la <strong>Banda Monumental EAR</strong> despliega más de 12 músicos en escena coordinando sistemas de sonido complejos, ideal para ferias, plazas y recintos de exposiciones de gran envergadura.
              </p>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-[#ecb613]">Producciones Especiales Disponibles:</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  {localizedShows.map((item, idx) => (
                    <Link
                      key={idx}
                      href={`/artistas/${item.slug}`}
                      className="p-4 bg-white/[0.02] border border-white/5 hover:border-[#ecb613]/40 rounded-2xl flex flex-col justify-between transition-all duration-500 ease-out group/link hover:-translate-y-1.5 hover:bg-white/[0.04] hover:shadow-[0_20px_50px_-20px_rgba(236,182,19,0.3)]"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-white/5 rounded-xl text-white/60 group-hover/link:bg-[#ecb613]/10 group-hover/link:text-[#ecb613] transition-all duration-500">
                          {item.icon}
                        </div>
                        <span className="text-[8px] font-mono font-black text-white/30 uppercase group-hover/link:text-[#ecb613]/70 transition-colors duration-500">{item.location}</span>
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
                  className="group/cta relative overflow-hidden px-8 py-4 bg-white text-black hover:bg-[#ecb613] rounded-xl text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 ease-out text-center hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(236,182,19,0.5)] active:translate-y-0 active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Reservar Show Ecuestre
                    <ArrowRight size={12} className="group-hover/cta:translate-x-1 transition-transform duration-500" />
                  </span>
                </Link>
                <Link
                  href="/contacto?subject=Reserva+Banda+Monumental"
                  className="group/cta2 relative overflow-hidden px-8 py-4 bg-white/5 border border-white/10 hover:border-[#ecb613]/50 hover:bg-[#ecb613]/5 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] text-white hover:text-[#ecb613] transition-all duration-500 ease-out text-center hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Consultar Banda Monumental
                    <ChevronRight size={12} className="group-hover/cta2:translate-x-1 transition-transform duration-500" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#080808] border border-white/5 rounded-[2.5rem] p-8 md:p-10 space-y-6 hover:border-[#ecb613]/20 transition-colors duration-500">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#ecb613]">
                <LayoutGrid size={24} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight font-syne">Rider de Gran Impacto</h3>

              <div className="space-y-4 border-t border-white/5 pt-4">
                {riderSpecs.map((spec, i) => (
                  <div key={i} className="flex flex-col gap-1 group/spec">
                    <span className="text-[9px] font-black text-white/30 uppercase tracking-widest group-hover/spec:text-[#ecb613]/70 transition-colors duration-300">{spec.label}</span>
                    <span className="text-xs font-bold text-white/80 group-hover/spec:text-white transition-colors duration-300">{spec.value}</span>
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
          <div className="bg-[#0b0b0b] rounded-[3rem] border border-white/5 p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 hover:border-[#ecb613]/20 transition-colors duration-500">
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
                className="group/cta3 px-8 py-5 bg-white/5 hover:bg-white text-white hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all duration-500 ease-out flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(255,255,255,0.3)] active:translate-y-0 active:scale-[0.98]"
              >
                Ver Ensambles de Gala
                <ChevronRight size={14} className="group-hover/cta3:translate-x-1 transition-transform duration-500" />
              </Link>
              <Link
                href="/contacto"
                className="group/cta4 px-8 py-5 bg-[#ecb613] hover:bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-center transition-all duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[0_20px_50px_-15px_rgba(236,182,19,0.6)] active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Consultar con Productor Técnico
                <ArrowRight size={14} className="group-hover/cta4:translate-x-1 transition-transform duration-500" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}