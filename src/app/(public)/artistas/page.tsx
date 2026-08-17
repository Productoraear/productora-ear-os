import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Star, ShieldCheck, ChevronRight, ArrowRight, 
  Crown, Mic2, Users, Trophy, Music, Calendar, Phone 
} from 'lucide-react';
import { Metadata } from 'next';
import { CENTRALITA } from '@/lib/phone-constants';
import { InjectHeroButton, InjectCatalogButton } from './InjectArtistButton';
import TinderMatcherClient from '@/app/components/public/TinderMatcherClient';
import { AstraNeuralStrategicSuite } from '@/app/components/SClassScreens/AstraNeuralStrategicSuite';

export const metadata: Metadata = {
  title: 'Catálogo de Artistas & Roster S-Class | Productora EAR',
  description: 'Explora y contrata el catálogo exclusivo de artistas, mariachis de gala, ensambles ecuestres y producciones de Productora EAR.',
};

export default function ArtistasPage() {
  const featuredArtist = {
    id: 'edwin-agudelo',
    nombre: 'Edwin Agudelo',
    subtitulo: 'Tenor Lírico & Mariachi de Gran Gala',
    tagline: 'Paciente Cero // Artista Insignia de EAR OS',
    rating: '5.0/5 (350+ Reseñas Verificadas)',
    shows: '37+ Conciertos Internacionales',
    basePrice: 'Desde 650€',
    formatos: ['Solista & Piano Acústico', 'Cuarteto Imperial', 'Quinteto de Honor', 'Cantando a Caballo', 'Banda Monumental'],
    descripcion: 'La vanguardia en Mariachi y música lírica en España. Calibración acústica de alta gama, repertorio de autor y garantía de solvencia logística en todo el territorio nacional.',
  };

  const artists = [
    {
      id: 'mariachi-bodas-madrid-solista',
      nombre: 'Mariachi Imperial de Madrid',
      categoria: 'Mariachi / Gran Gala',
      rating: '4.9/5',
      shows: '450+ Eventos',
      precio: 'Desde 950€',
      tag: 'ALTO LEVERAGE',
      desc: 'Formación clásica de gala para bodas de alto ticket, ceremonias y aniversarios solemnes en la Zona Centro.',
      link: '/artistas/edwin-agudelo#mariachi'
    },
    {
      id: 'mariachis-bodas-barcelona-gala',
      nombre: 'Gala Ranchera Barcelona & Levante',
      categoria: 'Mariachi / Ensamble Real',
      rating: '4.8/5',
      shows: '320+ Eventos',
      precio: 'Desde 1.250€',
      tag: 'TOP B2C',
      desc: 'Ensamble de gala con sección de violines maestros y microfonía inalámbrica para recepciones en Cataluña y Levante.',
      link: '/artistas/edwin-agudelo#mariachi'
    },
    {
      id: 'mariachi-caballo-eventos-sevilla',
      nombre: 'Espectáculo "Cantando a Caballo"',
      categoria: 'Alta Escuela Ecuestre',
      rating: '5.0/5',
      shows: '180+ Eventos',
      precio: 'Desde 5.500€',
      tag: 'FORMATO MONUMENTAL',
      desc: 'Doma clásica y música tradicional en vivo sobre caballos de pura raza española. Ideal para ferias y plazas.',
      link: '/artistas/edwin-agudelo#caballo'
    },
    {
      id: 'solistas-gala-espana',
      nombre: 'Voces Líricas & Solistas de Autor',
      categoria: 'Solistas / Microfonía Hi-Fi',
      rating: '4.9/5',
      shows: '210+ Eventos',
      precio: 'Desde 650€',
      tag: 'ALTA FIDELIDAD',
      desc: 'Repertorio melódico, boleros y canciones de autor con sistemas de amplificación acústica Bose & Neumann.',
      link: '/artistas/solistas'
    }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-32 pb-24 px-4 sm:px-6 md:px-8 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* 🚀 HEADER HERO */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            ROSTER EXCLUSIVO // AUDITORÍA DE INTEGRIDAD EAR
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            CATÁLOGO DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">ARTISTAS S-CLASS</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Formatos artísticos verificados bajo contrato mercantil, alta en Seguridad Social, microfonía sin interferencias y seguro de responsabilidad civil.
          </p>
        </div>

        {/* 👑 INSIGNIA ARTIST CARD: EDWIN AGUDELO */}
        <section className="bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-[#ecb613]/40 rounded-[2.5rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/10 blur-[130px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3.5 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5">
                  <Crown size={12} /> {featuredArtist.tagline}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[9px] font-mono">
                  {featuredArtist.shows}
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white font-syne">
                  {featuredArtist.nombre}
                </h2>
                <p className="text-[#ecb613] text-xs sm:text-sm font-bold uppercase tracking-widest mt-1">
                  {featuredArtist.subtitulo}
                </p>
              </div>

              <p className="text-white/70 text-sm sm:text-base leading-relaxed font-light">
                {featuredArtist.descripcion}
              </p>

              {/* Formatos Disponibles */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block">Formatos Disponibles en Directo:</span>
                <div className="flex flex-wrap gap-2">
                  {featuredArtist.formatos.map((fmt, i) => (
                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-zinc-200">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href="/artistas/edwin-agudelo"
                  className="py-3.5 px-7 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all min-h-[48px]"
                >
                  <span>Ver Dossier Oficial</span>
                  <ChevronRight size={16} />
                </Link>
                <InjectHeroButton 
                  artistId={featuredArtist.id} 
                  artistName={featuredArtist.nombre} 
                  basePrice={featuredArtist.basePrice} 
                  formats={featuredArtist.formatos} 
                />
              </div>
            </div>

            {/* Right Metric Card */}
            <div className="lg:col-span-4 bg-black/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 text-center lg:text-left">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">Tarifa Base Homologada</span>
                <span className="text-3xl sm:text-4xl font-black text-[#ecb613] font-mono">{featuredArtist.basePrice}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10 text-xs text-white/80">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#ecb613] shrink-0" />
                  <span>Sonorización L-Acoustics & Microfonía Axient</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#ecb613] shrink-0" />
                  <span>Cobertura en las 52 Provincias de España</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#ecb613] shrink-0" />
                  <span>Bloqueo Atómico de Fecha con Depósito Reembolsable</span>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={CENTRALITA.tel}
                  className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 text-white/80 hover:text-white transition-all"
                >
                  <Phone size={14} className="text-[#ecb613]" />
                  <span>Centralita: {CENTRALITA.display}</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 🔥 TINDER MATCHER INTERACTIVO DE FORMATOS ARTÍSTICOS (SWIPE S-CLASS) */}
        <section className="pt-4 pb-8">
          <div className="text-center mb-8">
            <span className="text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.4em] block mb-2">
              ✦ MATCHMAKER TÁCTICO EN VIVO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
              Encuentra tu <span className="text-[#ecb613]">Formato Ideal</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto font-light mt-2">
              Desliza o filtra los formatos de directo según aforo, acústica exterior y tipología de evento.
            </p>
          </div>
          <TinderMatcherClient />
        </section>

        {/* 🎭 ENSEMBLES & VERTICAL CATALOG */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613]">CATÁLOGO COMPLETO</span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tight text-white font-syne">
                Formatos & Ensambles de Gira
              </h2>
            </div>
            <Link
              href="/cotizador"
              className="text-xs font-black uppercase tracking-widest text-[#ecb613] hover:underline flex items-center gap-1 min-h-[44px]"
            >
              <span>Abrir Cotizador de Formatos →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {artists.map((art) => (
              <div 
                key={art.id} 
                className="bg-[#0e0e0e] border border-white/10 hover:border-[#ecb613]/50 rounded-3xl p-6 sm:p-8 space-y-6 flex flex-col justify-between group transition-all shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[9px] font-black uppercase tracking-widest font-mono">
                      {art.tag}
                    </span>
                    <span className="text-xl font-black text-white font-mono">{art.precio}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase text-zinc-400 block">{art.categoria}</span>
                    <h3 className="text-2xl font-black uppercase italic tracking-tight text-white group-hover:text-[#ecb613] transition-colors mt-0.5 font-syne">
                      {art.nombre}
                    </h3>
                  </div>

                  <p className="text-white/60 text-xs sm:text-sm leading-relaxed font-light">
                    {art.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                  <Link
                    href={art.link}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider text-center transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <span>Ver Ficha Técnica</span>
                    <ChevronRight size={14} />
                  </Link>
                  <InjectCatalogButton
                    artistId={art.id}
                    artistName={art.nombre}
                    category={art.categoria}
                    basePrice={art.precio}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 🧠 ASTRA NEURAL STRATEGIC SUITE • HIGH-TICKET ARTIST & MANAGEMENT ENGINE */}
        <section className="pt-8">
          <AstraNeuralStrategicSuite />
        </section>

      </div>
    </main>
  );
}
