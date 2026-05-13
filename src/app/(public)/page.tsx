/**
 * 🏛️ EAR OS HOME - S-CLASS MARKETPLACE HUB
 * Purpose: Ultimate entrance to the Event Authority Ecosystem.
 */

"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ImpactSystems from '@/app/components/ImpactSystems';
import { ApexButton } from '@/app/components/SClassScreens/ApexButton';
import DiscoveryHero from '@/app/components/DiscoveryHero';
import { MarketplaceCard } from '@/app/components/SClassScreens/MarketplaceCard';

export default function HomePage() {
  return (
    <main className="bg-[#050505] min-h-screen relative overflow-hidden">
      {/* 🌌 SOVEREIGN AMBIENCE: AURA ONYX DEPTH */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#d4a85515,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#d4a85508,transparent_50%)] pointer-events-none" />
      
      {/* 🎬 CINEMATIC GRAIN EFFECT */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10">
        {/* PHASE 1: DISCOVERY ENGINE (CINEMATIC) */}
        <section>
          <DiscoveryHero />
        </section>

        {/* PHASE 2: S-CLASS MARKETPLACE (PREMIUM GRID) */}
        <section className="max-w-[1400px] mx-auto px-8 py-48">
          {/* Header Node */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-16 mb-32 border-l-[3px] border-[#d4a855] pl-12">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-[#d4a855] block">Curaduría S-Class</span>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] italic">
                Activos de <br />
                <span className="text-white/20">Alto Impacto</span>
              </h2>
            </motion.div>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="text-white/30 text-sm font-bold uppercase tracking-[0.3em] max-w-sm text-right leading-loose"
            >
              Arquitecturas de servicio diseñadas para la dominancia institucional. Disponibilidad verificada bajo protocolo EAR OS.
            </motion.p>
          </div>

          {/* Grid Node */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            <MarketplaceCard 
              index={0}
              id="mariachi-gala"
              title="Mariachi Gala S-Class"
              location="Madrid / Nacional"
              category="MÚSICA ÉLITE"
              price="3.200"
              rating={5.0}
              image="/images/mariachi.png"
            />
            <MarketplaceCard 
              index={1}
              id="solista-premium"
              title="Edwin Agudelo Solista"
              location="España / Europa"
              category="VOCAL PERFORMANCE"
              price="1.800"
              rating={5.0}
              image="/images/wedding.png"
            />
            <MarketplaceCard 
              index={2}
              id="produccion-b2g"
              title="Logística B2B/B2G"
              location="Territorio Nacional"
              category="PRODUCCIÓN"
              price="12.500"
              rating={5.0}
              image="/images/logistics.png"
            />
          </div>
        </section>

        {/* PHASE 3: IMPACT SYSTEMS (REPUTATION ENGINE) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "200px" }}
          transition={{ duration: 1 }}
        >
          <ImpactSystems />
        </motion.div>
      </div>

      {/* 🕯️ SPATIAL LIGHT LEAK */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[1000px] h-[1000px] bg-[#d4a855]/5 blur-[250px] rounded-full pointer-events-none animate-pulse" />
    </main>
  );
}
