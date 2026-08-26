'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, ArrowRight, Phone, MessageCircle, 
  Crown, Heart, Building2, Boxes, Mic2, FileText, CheckCircle2, 
  Calendar, Star, Music, Award, Users, ChevronRight, Sliders
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import type { ProfileContext } from '@/app/components/SClassScreens/CinematicTunnelIgnition';

const CinematicTunnelIgnition = dynamic(
  () => import('@/app/components/SClassScreens/CinematicTunnelIgnition').then(m => m.CinematicTunnelIgnition),
  { ssr: false }
);

import CinematicHeroSClass from '@/components/sclass/CinematicHeroSClass';

const EditorialCuratedHeroSClass = dynamic(
  () => import('@/components/sclass/EditorialCuratedHeroSClass'),
  { ssr: false }
);

const MobileFusionContainer = dynamic(
  () => import('@/components/mobile-fusion/MobileFusionContainer'),
  { ssr: false }
);

const Combo1_VipWeddingGala = dynamic(
  () => import('@/components/mobile-fusion/Combo1_VipWeddingGala'),
  { ssr: false }
);

const Archetype3_AirbnbBento = dynamic(
  () => import('@/components/mobile-fusion/Archetype3_AirbnbBento'),
  { ssr: false }
);

const Archetype9_StorysellingStream = dynamic(
  () => import('@/components/mobile-fusion/Archetype9_StorysellingStream'),
  { ssr: false }
);

export type HomepageScreenMode = 'editorial-curated' | 'classic' | 'mobile-fusion' | 'bento-airbnb' | 'storyselling';

export default function Home() {
  const [activeProfile, setActiveProfile] = useState<ProfileContext | null>(null);
  const [homepageMode, setHomepageMode] = useState<HomepageScreenMode>('editorial-curated');

  // Load configured active homepage mode from localStorage / admin studio
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('ear_active_homepage_screen') as HomepageScreenMode;
      if (savedMode && ['editorial-curated', 'classic', 'mobile-fusion', 'bento-airbnb', 'storyselling'].includes(savedMode)) {
        setHomepageMode(savedMode);
      }
    } catch (e) {}

    const handleStorageChange = () => {
      try {
        const updatedMode = localStorage.getItem('ear_active_homepage_screen') as HomepageScreenMode;
        if (updatedMode) setHomepageMode(updatedMode);
      } catch (e) {}
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleIgnition = (profile: ProfileContext) => {
    setActiveProfile(profile);
    setTimeout(() => {
      document.getElementById('neural-tunnel-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const occasionLinks = [
    { title: 'Bodas de Gala', href: '/artistas/bodas', tag: 'B2C VIP' },
    { title: 'Cumpleaños & Fiestas', href: '/artistas/cumpleanos', tag: 'FAMILIAR' },
    { title: 'Licitaciones B2G', href: '/ocasiones/ayuntamientos', tag: 'SECTOR PÚBLICO' },
    { title: 'Eventos Corporativos', href: '/ocasiones/corporativo', tag: 'B2B ÉLITE' },
    { title: 'Ferias & Grandes Formatos', href: '/ocasiones/ferias', tag: 'MASIVO' },
    { title: 'Mariachis en Madrid', href: '/servicios/mariachis/madrid', tag: 'LOCAL' },
  ];

  // 1. Render Mode: Editorial Curated Hero S-Class (Momento WOW + 4 Perfiles Bento)
  if (homepageMode === 'editorial-curated') {
    return (
      <div className="bg-[#050505] min-h-screen text-white flex flex-col">
        <EditorialCuratedHeroSClass />
      </div>
    );
  }

  // 2. Render Mode: Mobile Fusion Hub as Homepage
  if (homepageMode === 'mobile-fusion') {
    return (
      <div className="bg-[#050505] min-h-screen">
        <MobileFusionContainer />
      </div>
    );
  }

  // 3. Render Mode: Bento Airbnb Curated Experience as Homepage
  if (homepageMode === 'bento-airbnb') {
    return (
      <div className="bg-[#050505] min-h-screen py-6 px-4 max-w-lg mx-auto">
        <Archetype3_AirbnbBento />
      </div>
    );
  }

  // 4. Render Mode: Storyselling Stream as Homepage
  if (homepageMode === 'storyselling') {
    return (
      <div className="bg-[#050505] min-h-screen max-w-lg mx-auto">
        <Archetype9_StorysellingStream />
      </div>
    );
  }

  // 5. Render Mode: Classic S-Class Gateway
  return (
    <div className="bg-[#050505] text-white min-h-screen flex flex-col selection:bg-[#ecb613] selection:text-black">
      
      {/* 🚀 HERO SECTION: CINEMATIC S-CLASS WITH 4 SOVEREIGN PROFILES */}
      <CinematicHeroSClass />

      {/* 👑 PACIENTE CERO: EDWIN AGUDELO (TARJETA DE HONOR INSIGNIA) */}
      <section className="px-4 sm:px-6 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-b from-[#121212] to-[#080808] border border-[#ecb613]/40 rounded-[2.5rem] sm:rounded-[3.5rem] p-6 sm:p-12 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#ecb613]/10 blur-[100px] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Bio & Authority */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase tracking-widest font-mono">
                    PACIENTE CERO // ARTISTA INSIGNIA
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/60 text-[9px] font-mono">
                    37+ CONCIERTOS INTERNACIONALES
                  </span>
                </div>

                <div>
                  <h2 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white font-syne">
                    Edwin Agudelo
                  </h2>
                  <p className="text-[#ecb613] text-xs sm:text-sm font-bold uppercase tracking-widest mt-1">
                    Tenor Lírico & Mariachi de Gran Gala
                  </p>
                </div>

                <p className="text-white/60 text-sm sm:text-base leading-relaxed font-light">
                  La validación viva de EAR OS. Desde recitales íntimos a piano hasta grandes ensambles orquestales de 16 músicos y espectáculos ecuestres de alta escuela. Cobertura en toda España con ingeniería acústica dedicada.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 block">Solista & Piano</span>
                    <span className="text-lg font-black text-white">650€</span>
                  </div>
                  <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 block">Cuarteto Imperial</span>
                    <span className="text-lg font-black text-[#ecb613]">950€</span>
                  </div>
                  <div className="bg-black/60 p-3.5 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-mono uppercase text-zinc-400 block">Gran Gala (6+)</span>
                    <span className="text-lg font-black text-white">2.800€</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Link
                    href="/artistas/edwin-agudelo"
                    className="py-3.5 px-6 rounded-2xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
                  >
                    <span>Ver Dossier Oficial de Edwin Agudelo</span>
                    <ChevronRight size={16} />
                  </Link>
                  <Link
                    href="/mobile-fusion"
                    className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ecb613]/20 to-purple-500/20 hover:bg-white/15 border border-[#ecb613]/50 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 min-h-[48px] transition-all shadow-lg"
                  >
                    <Sparkles size={16} className="text-[#ecb613]" />
                    <span>📱 10 Diseños Mobile-First (Airbnb + Uber + Tinder + Bodas)</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Key Metrics & Seals */}
              <div className="lg:col-span-5 bg-black/60 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
                <h3 className="text-xs font-mono font-black uppercase tracking-widest text-[#ecb613] flex items-center gap-2">
                  <ShieldCheck size={16} /> Garantías de Contratación S-Class
                </h3>

                <ul className="space-y-3 text-xs text-white/80">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Microfonía inalámbrica Shure Axient Digital & Neumann sin interferencias.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Póliza de Responsabilidad Civil de 1.000.000€ y altas de Seguridad Social.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#ecb613] shrink-0 mt-0.5" />
                    <span>Bloqueo atómico de fecha con depósito de reserva trazable.</span>
                  </li>
                </ul>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                  <span className="text-[10px] font-mono text-zinc-400 block uppercase">Disponibilidad Actual</span>
                  <span className="text-sm font-black text-emerald-400">● Calendario Abierto para Temporada 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🧠 TÚNEL NEURAL CINEMÁTICO — IGNICIÓN POR SCROLL */}
      <section id="neural-tunnel-section" className="px-4 sm:px-6 pb-8 relative z-10">
        <AnimatePresence mode="wait">
          {activeProfile && (
            <CinematicTunnelIgnition
              key={activeProfile}
              profileContext={activeProfile}
              onClose={() => setActiveProfile(null)}
            />
          )}
        </AnimatePresence>
      </section>

    </div>
  );
}
