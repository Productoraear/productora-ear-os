"use client";

import React from 'react';
import { motion } from 'framer-motion';
import ImpactSystems from '@/app/components/ImpactSystems';
import { ApexButton } from '@/app/components/SClassScreens/ApexButton';
import { DiscoveryHero } from '@/app/components/DiscoveryHero';
import { MarketplaceCard } from '@/app/components/SClassScreens/MarketplaceCard';

export default function HomePage() {
  return (
    <main className="bg-[#050505] min-h-screen relative overflow-hidden">
      {/* Sovereign Background Ambience - Aura Onyx Depth */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#d4a85515,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,#d4a85508,transparent_50%)] pointer-events-none" />
      
      {/* Cinematic Grain Effect - Native Optimization */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      <div className="relative z-10 pt-48 pb-32">
        {/* MISSION 1: DISCOVERY ENGINE */}
        <section className="mb-48">
          <DiscoveryHero />
        </section>

        {/* MISSION 2: PREMIUM MARKETPLACE GRID */}
        <section className="max-w-7xl mx-auto px-6 mb-48">
          <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-[#d4a855]">Curaduría S-Class</span>
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                Protocolos <br />
                <span className="text-white/20">de Alta Demanda</span>
              </h2>
            </div>
            <p className="text-white/30 text-xs font-black uppercase tracking-[0.3em] max-w-sm text-right leading-relaxed">
              Explora las infraestructuras más solicitadas para esta temporada. Disponibilidad en tiempo real verificada por EAR OS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <MarketplaceCard 
              index={0}
              id="mariachi-gala"
              title="Mariachi Gala S-Class"
              location="Madrid / Nacional"
              category="MÚSICA ÉLITE"
              price="2.800"
              rating={5.0}
              image="https://images.unsplash.com/photo-1514525253361-bee8718a300a?auto=format&fit=crop&q=80&w=1000"
            />
            <MarketplaceCard 
              index={1}
              id="solista-premium"
              title="Edwin Agudelo Solista"
              location="España / Europa"
              category="VOCAL PERFORMANCE"
              price="1.500"
              rating={4.9}
              image="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=1000"
            />
            <MarketplaceCard 
              index={2}
              id="produccion-b2g"
              title="Infraestructura B2G"
              location="Ayuntamientos"
              category="PRODUCCIÓN"
              price="10.000"
              rating={5.0}
              image="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
            />
          </div>
        </section>

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
