'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, Star, ShieldCheck, ChevronRight, ArrowRight, 
  Crown, Mic2, Users, Trophy, Music, Calendar, Phone,
  Compass, Map, Layers, DollarSign, Bot, Activity, Brain
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { InjectHeroButton, InjectCatalogButton } from './InjectArtistButton';
import TinderMatcherClient from '@/app/components/public/TinderMatcherClient';
import { AstraNeuralStrategicSuite } from '@/app/components/SClassScreens/AstraNeuralStrategicSuite';
import { AstraNeuralExperience } from '@/app/components/SClassScreens/AstraNeuralExperience';

export default function ArtistasPage() {
  const [activePortalView, setActivePortalView] = useState<'ASTRA_ENGINE' | 'ROSTER_CATALOG' | 'HIGH_TICKET_SUITE'>('ASTRA_ENGINE');

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
    <main className="min-h-screen bg-[#050505] text-white pt-28 pb-24 px-4 sm:px-6 md:px-8 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* 🚀 HEADER HERO */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em]">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-ping" />
            ASTRA OS // MOTOR ESTRATÉGICO NEURONAL PARA ARTISTAS
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne leading-[0.95]">
            PORTAL DEL ARTISTA <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-[#ecb613] to-white">& ASTRA NEURAL</span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
            Deconstruye y reconstruye tu carrera artística como Atleta Cultural de Alto Rendimiento. Sigue el protocolo EAR, evalúa tu Rueda de la Vida Artística y apaláncate en el Split Soberano 80/10/10.
          </p>
        </div>

        {/* 🎛️ SELECTOR DE EXPERIENCIA EN EL PORTAL */}
        <div className="flex flex-wrap justify-center gap-3 bg-[#0a0a0e] border border-white/10 p-2 rounded-3xl max-w-3xl mx-auto">
          <button
            onClick={() => setActivePortalView('ASTRA_ENGINE')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activePortalView === 'ASTRA_ENGINE'
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Brain className="w-4 h-4 text-purple-300" /> 1. Astra OS Neural (Hoja de Ruta)
          </button>

          <button
            onClick={() => setActivePortalView('HIGH_TICKET_SUITE')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activePortalView === 'HIGH_TICKET_SUITE'
                ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Crown className="w-4 h-4" /> 2. Arsenal High-Ticket & Split
          </button>

          <button
            onClick={() => setActivePortalView('ROSTER_CATALOG')}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all cursor-pointer ${
              activePortalView === 'ROSTER_CATALOG'
                ? 'bg-white/20 text-white font-black'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-4 h-4" /> 3. Roster de Formatos
          </button>
        </div>

        {/* 🧠 VISTA 1: ASTRA OS NEURAL STRATEGIC ENGINE (EL VIAJE DEL ARTISTA) */}
        {activePortalView === 'ASTRA_ENGINE' && (
          <section className="space-y-6">
            <AstraNeuralExperience />
          </section>
        )}

        {/* 👑 VISTA 2: HIGH-TICKET SUITE & SPLIT SOBERANO */}
        {activePortalView === 'HIGH_TICKET_SUITE' && (
          <section className="space-y-6">
            <AstraNeuralStrategicSuite />
          </section>
        )}

        {/* 🎭 VISTA 3: ROSTER Y CATÁLOGO DE ENSAMBLES */}
        {activePortalView === 'ROSTER_CATALOG' && (
          <div className="space-y-16">
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
                    <h2 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase italic tracking-tight text-white font-syne">
                      {featuredArtist.nombre}
                    </h2>
                    <p className="text-[#ecb613] font-mono text-xs sm:text-sm uppercase tracking-wider mt-1">
                      {featuredArtist.subtitulo}
                    </p>
                  </div>

                  <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                    {featuredArtist.descripcion}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {featuredArtist.formatos.map((f, i) => (
                      <span 
                        key={i} 
                        className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] text-zinc-300 font-mono"
                      >
                        {f}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/artistas/edwin-agudelo"
                      className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-[#ecb613] transition-all text-center flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <span>Ver Dossier & Rider</span>
                      <ArrowRight size={14} />
                    </Link>
                    <InjectHeroButton 
                      artistId={featuredArtist.id} 
                      artistName={featuredArtist.nombre} 
                      basePrice={featuredArtist.basePrice} 
                      formats={featuredArtist.formatos} 
                    />
                  </div>
                </div>

                <div className="lg:col-span-4 bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 space-y-4">
                  <span className="text-[10px] font-mono uppercase text-zinc-400 block">Soberanía de Caché</span>
                  <div className="text-3xl font-black font-mono text-white">{featuredArtist.basePrice}</div>
                  <div className="space-y-2 text-xs font-mono text-zinc-400">
                    <div className="flex justify-between"><span>Valoración:</span><span className="text-amber-400 font-bold">{featuredArtist.rating}</span></div>
                    <div className="flex justify-between"><span>Split:</span><span className="text-emerald-400 font-bold">80/10/10 Soberano</span></div>
                    <div className="flex justify-between"><span>Microfonía:</span><span className="text-white">Shure Axient Digital</span></div>
                  </div>
                </div>
              </div>
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
          </div>
        )}

      </div>
    </main>
  );
}
