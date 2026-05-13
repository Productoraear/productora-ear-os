"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ImpactSystems from '@/app/components/ImpactSystems';
import { CinematicTitle } from '@/app/components/effects/CinematicEntrance';
import CinematicEntrance from '@/app/components/effects/CinematicEntrance';
import { ApexButton } from '@/app/components/SClassScreens/ApexButton';

export default function HomePage() {
  return (
    <main className="bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Sovereign Background Ambience - Aura Onyx Depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#d4a85515,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#d4a85508,transparent_50%)] pointer-events-none" />
      
      {/* Cinematic Grain Effect - Native Optimization */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10 pt-48 pb-32">
        <div className="max-w-7xl mx-auto px-6 text-center mb-40">
          <CinematicEntrance delay={0}>
            <span className="inline-block px-6 py-2 rounded-full border border-[#d4a855]/30 text-[#d4a855] text-[10px] font-black uppercase tracking-[0.6em] mb-12 bg-[#d4a855]/5 backdrop-blur-sm">
              SISTEMAS DE IMPACTO
            </span>
            <CinematicTitle 
              text="ARQUITECTURA E INGENIERÍA" 
              className="text-5xl md:text-[8rem] mb-4 leading-[0.8] italic font-black tracking-tighter uppercase"
            />
            <CinematicTitle 
              text="DE EVENTOS Y TALENTO" 
              className="text-5xl md:text-[8rem] mb-12 leading-[0.8] font-black tracking-tighter uppercase"
            />
          </CinematicEntrance>

          <CinematicEntrance delay={0.1}>
            <p className="text-white/40 text-xs md:text-sm uppercase tracking-[0.5em] font-bold max-w-4xl mx-auto leading-relaxed mb-20">
              La mayoría vende ruido y logística. Nosotros diseñamos <span className="text-white">Sistemas de Impacto</span>.
              <br />
              No alquilamos equipos ni representamos nombres; construimos la infraestructura invisible para que el mensaje sea inevitable.
            </p>
          </CinematicEntrance>

          <CinematicEntrance delay={0.2} className="flex flex-col items-center gap-12">
            <ApexButton />
            <div className="flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Ver Infraestructura</span>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-4 h-4 border-b-2 border-r-2 border-[#d4a855] rotate-45"
              />
            </div>
          </CinematicEntrance>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 0.8 }}
        >
          <ImpactSystems />
        </motion.div>
      </div>

      {/* Spatial Light Leak */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4a855]/5 blur-[200px] rounded-full pointer-events-none animate-pulse" />
    </main>
  );
}
