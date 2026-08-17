'use client';

import React, { useState } from 'react';
import { AstraNeuralExperience } from '@/app/components/SClassScreens/AstraNeuralExperience';
import TinderMatcherClient from '@/app/components/public/TinderMatcherClient';
import { EdwinDossierHero } from '@/app/components/artistas/EdwinDossierHero';
import { TheSignalOnboarding } from '@/app/components/artistas/TheSignalOnboarding';
import { Sparkles, ShieldCheck, UserCheck, Compass, Music, Flame } from 'lucide-react';

export default function ArtistasHubPage() {
  // Triaje Inicial: 'BOOKING' (por defecto para maximizar conversión B2B/B2C) | 'THE_SIGNAL' | 'ASTRA_OS'
  const [activeIntent, setActiveIntent] = useState<'BOOKING' | 'THE_SIGNAL' | 'ASTRA_OS'>('BOOKING');

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 selection:bg-[#ecb613] selection:text-black">
      
      {/* 🎛️ 1. HEADER DE TRIAJE SUPERIOR (NAVEGACIÓN INTUITIVA EN < 3s) */}
      <section className="border-b border-white/10 bg-[#08080c]/90 backdrop-blur-xl sticky top-20 z-30 py-4 px-4 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-lg sm:text-xl font-black tracking-wider text-[#ecb613] flex items-center justify-center md:justify-start gap-2 font-syne uppercase">
              <Sparkles size={18} className="animate-pulse text-[#ecb613]" /> EAR ARTISTS ECOSYSTEM
            </h1>
            <p className="text-[11px] text-zinc-400 font-light">
              Plataforma Unificada: Booking de Gala, Talent Accelerator The Signal & E-Management
            </p>
          </div>

          {/* SELECTOR DE EMBUDO DIRECTO (3 VÍAS) */}
          <div className="flex flex-wrap justify-center bg-[#121218] p-1.5 rounded-2xl border border-white/10 shadow-inner">
            <button
              onClick={() => setActiveIntent('BOOKING')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeIntent === 'BOOKING'
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20 font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <UserCheck size={14} /> Contratar Artistas (Roster)
            </button>

            <button
              onClick={() => setActiveIntent('THE_SIGNAL')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeIntent === 'THE_SIGNAL'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Compass size={14} /> Postular a "The Signal"
            </button>

            <button
              onClick={() => setActiveIntent('ASTRA_OS')}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${
                activeIntent === 'ASTRA_OS'
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 font-black'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck size={14} /> Acceso Astra OS (E-Manager)
            </button>
          </div>
        </div>
      </section>

      {/* 🚀 2. RENDERIZADO CONDICIONAL POR INTENCIÓN DEL USUARIO */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 md:px-8">
        
        {/* EMBUDO 1: CLIENTE BUSCANDO CONTRATAR (BOOKING / B2B / B2C) */}
        {activeIntent === 'BOOKING' && (
          <div className="space-y-16">
            {/* DOSSIER HERO DEL PACIENTE CERO (EDWIN AGUDELO) */}
            <EdwinDossierHero />

            {/* MATCHMAKER INTERACTIVO TINDER-MATCHER & ROSTER */}
            <div className="border-t border-white/10 pt-12 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold block">
                    SELECCIÓN NEURAL DE ESPECTÁCULOS
                  </span>
                  <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tight text-white font-syne mt-1">
                    Roster Oficial & Matchmaker S-Class
                  </h2>
                </div>
                <p className="text-xs text-zinc-400 font-light max-w-md">
                  Filtra por formato, provincia y presupuesto con tecnología Tinder-Match y auditoría de rider Bose F1.
                </p>
              </div>

              <TinderMatcherClient />
            </div>
          </div>
        )}

        {/* EMBUDO 2: TALENTO BUSCANDO UNIRSE A LA RED (THE SIGNAL) */}
        {activeIntent === 'THE_SIGNAL' && (
          <TheSignalOnboarding onQualified={() => setActiveIntent('ASTRA_OS')} />
        )}

        {/* EMBUDO 3: SUITE INTERNA ASTRA OS & DANI ARAGÓN (GESTIÓN PRIVADA) */}
        {activeIntent === 'ASTRA_OS' && (
          <AstraNeuralExperience />
        )}

      </main>

    </div>
  );
}
