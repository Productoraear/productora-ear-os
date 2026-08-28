'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import CinematicHeroSClass from '@/components/sclass/CinematicHeroSClass';
import type { ProfileContext } from '@/app/components/SClassScreens/CinematicTunnelIgnition';

const CinematicTunnelIgnition = dynamic(
  () => import('@/app/components/SClassScreens/CinematicTunnelIgnition').then(m => m.CinematicTunnelIgnition),
  { ssr: false }
);

export default function Home() {
  const [activeProfile, setActiveProfile] = useState<ProfileContext | null>(null);

  const handleProfileIgnition = (profile: ProfileContext) => {
    setActiveProfile(profile);
    setTimeout(() => {
      document.getElementById('neural-tunnel-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const occasionLinks = [
    { title: 'Bodas de Gala', href: '/bodas', tag: 'B2C VIP' },
    { title: 'Licitaciones B2G', href: '/ocasiones/ayuntamientos', tag: 'SECTOR PÚBLICO' },
    { title: 'Eventos Corporativos & Fincas', href: '/proveedores', tag: 'B2B ÉLITE' },
    { title: 'VIMUME Neuroacústica', href: '/vimume', tag: 'SILVER ECONOMY' },
    { title: 'Catering de Brasas', href: '/catering-brasas', tag: 'SHOWCOOKING' },
    { title: 'Paciente Cero', href: '/artistas/edwin-agudelo', tag: 'TENOR LÍRICO' }
  ];

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-[#ecb613] selection:text-black relative overflow-x-hidden">
      {/* 1. PORTADA SOBERANA: 4 PERFILES EXCLUSIVOS */}
      <CinematicHeroSClass onProfileIgnite={handleProfileIgnition} />

      {/* 2. ACCESOS DIRECTOS DE ALTA VELOCIDAD */}
      <div className="border-y border-white/5 bg-[#0a0a0f]/90 py-3.5 px-6 overflow-x-auto no-scrollbar z-20">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-[700px]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">
              ACCESOS DIRECTOS SOBERANOS:
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            {occasionLinks.map((occ, i) => (
              <Link
                key={i}
                href={occ.href}
                className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 text-xs font-mono text-white/80 transition-all flex items-center gap-1.5 group"
              >
                <span>{occ.title}</span>
                <span className="text-[9px] opacity-60 font-bold group-hover:opacity-100">{occ.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. VIAJE DEL CLIENTE // TÚNEL NEURAL MODAL / INLINE IGNITION */}
      <AnimatePresence>
        {activeProfile && (
          <section id="neural-tunnel-section" className="relative py-12 px-4 sm:px-6 z-30">
            <div className="max-w-7xl mx-auto">
              <CinematicTunnelIgnition 
                profileContext={activeProfile}
                onClose={() => setActiveProfile(null)}
              />
            </div>
          </section>
        )}
      </AnimatePresence>
    </main>
  );
}
