
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  EventsShowreelHero,
  BusinessSolutionsSection,
  ArtistsRosterBenefits,
  ArchitectureEngSplit,
  PricingElitePack 
} from '@/components/sections';
import { THEME } from '@/lib/dna/theme';
import { ArrowRight } from 'lucide-react';

/**
 * 🛰️ MODULE: HOME CORE (S-CLASS V2.4 - AGENCY EDITION)
 * El "Norte Magnetico" de Productora EAR.
 */

interface HomeProps {
  onNavigate?: (id: string) => void;
  hideHeader?: boolean;
}

export default function Home({ onNavigate, hideHeader }: HomeProps) {
  return (
    <div className="bg-[#221d10] text-white selection:bg-[#ecb613] selection:text-[#221d10] w-full relative overflow-x-hidden">
      
      {/* SECTION 1: THE VISION (Cinematic Showreel) */}
      <EventsShowreelHero />

      {/* SECTION 2: THE BUSINESS (Corporate Power) */}
      <div id="business-section">
        <BusinessSolutionsSection />
      </div>

      {/* SECTION 3: THE BRIDGE (Engineering vs Architecture) */}
      <ArchitectureEngSplit />

      {/* SECTION 4: THE TALENT (Artist Ecosystem) */}
      <div id="artists-section">
        <ArtistsRosterBenefits />
      </div>

      {/* SECTION 5: THE TRANSACTION (Investment Tiers) */}
      <PricingElitePack />

      {/* SECTION 6: FOOTER / GLOBAL ACCESS */}
      <section className="py-32 px-12 border-t border-white/5 bg-[#1a150a]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-12">
          <div className="text-center lg:text-left">
            <h2 className="font-cinzel text-4xl lg:text-6xl font-black tracking-tighter text-white mb-4">
              ¿ESTÁS LISTO?
            </h2>
            <p className="text-[#ecb613] font-black text-[10px] tracking-[0.5em] uppercase">
              Inicia tu transmutación ahora
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              onClick={() => onNavigate?.('contact')}
              className="bg-[#ecb613] text-[#221d10] px-16 py-6 font-black text-[10px] uppercase tracking-[0.4em] shadow-xl shadow-[#ecb613]/10"
            >
              INICIAR AUDITORÍA
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
              onClick={() => onNavigate?.('arsenal')}
              className="border border-white/10 px-16 py-6 font-black text-[10px] uppercase tracking-[0.4em]"
            >
              EXPLORAR ARSENAL
            </motion.button>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-white/5 flex justify-between items-center">
          <span className="text-[9px] font-black text-white/20 tracking-widest">© 2026 PRODUCTORA EAR // S-CLASS OS</span>
          <div className="flex gap-8">
            <a href="#" className="text-[9px] font-black text-white/20 hover:text-[#ecb613] transition-colors">INSTAGRAM</a>
            <a href="#" className="text-[9px] font-black text-white/20 hover:text-[#ecb613] transition-colors">LINKEDIN</a>
          </div>
        </div>
      </section>
    </div>
  );
}
