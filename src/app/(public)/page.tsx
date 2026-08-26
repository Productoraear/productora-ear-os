'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Sparkles, ShieldCheck, ArrowRight, Phone, MessageCircle, 
  Crown, Heart, Building2, Boxes, Mic2, FileText, CheckCircle2, 
  Calendar, Star, Music, Award, Users, ChevronRight, Sliders, Flame
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

const LuxuryMarketplaceExperience = dynamic(
  () => import('@/components/sclass/LuxuryMarketplaceExperience'),
  { ssr: false }
);

const AcousticAtlasSClassExperience = dynamic(
  () => import('@/components/sclass/AcousticAtlasSClassExperience'),
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

export type HomepageScreenMode = 
  | 'editorial-curated' 
  | 'luxury-marketplace'
  | 'acoustic-atlas'
  | 'classic' 
  | 'mobile-fusion' 
  | 'bento-airbnb' 
  | 'storyselling';

export default function Home() {
  const [activeProfile, setActiveProfile] = useState<ProfileContext | null>(null);
  const [homepageMode, setHomepageMode] = useState<HomepageScreenMode>('editorial-curated');

  // Load configured active homepage mode from localStorage / admin studio
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem('ear_active_homepage_screen') as HomepageScreenMode;
      if (savedMode && ['editorial-curated', 'luxury-marketplace', 'acoustic-atlas', 'classic', 'mobile-fusion', 'bento-airbnb', 'storyselling'].includes(savedMode)) {
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

  // 1. Render Mode: Luxury Marketplace (Inspirado en Dribbble S-Class: Música, Brasas, Pantallas, Cotizador)
  if (homepageMode === 'luxury-marketplace') {
    return (
      <div className="bg-[#050505] min-h-screen text-white flex flex-col">
        <LuxuryMarketplaceExperience />
      </div>
    );
  }

  // 2. Render Mode: Acoustic Atlas & Tour Journey
  if (homepageMode === 'acoustic-atlas') {
    return (
      <div className="bg-[#050505] min-h-screen text-white flex flex-col">
        <AcousticAtlasSClassExperience />
      </div>
    );
  }

  // 3. Render Mode: Editorial Curated Hero S-Class (Momento WOW + 4 Perfiles Bento)
  if (homepageMode === 'editorial-curated') {
    return (
      <div className="bg-[#050505] min-h-screen text-white flex flex-col">
        <EditorialCuratedHeroSClass />
      </div>
    );
  }

  // 4. Render Mode: Mobile Fusion Hub as Homepage
  if (homepageMode === 'mobile-fusion') {
    return (
      <div className="bg-[#050505] min-h-screen">
        <MobileFusionContainer />
      </div>
    );
  }

  // 5. Render Mode: Bento Airbnb Curated Experience as Homepage
  if (homepageMode === 'bento-airbnb') {
    return (
      <div className="bg-[#050505] min-h-screen py-6 px-4 max-w-lg mx-auto">
        <Archetype3_AirbnbBento />
      </div>
    );
  }

  // 6. Render Mode: Storyselling Stream as Homepage
  if (homepageMode === 'storyselling') {
    return (
      <div className="bg-[#050505] min-h-screen max-w-lg mx-auto">
        <Archetype9_StorysellingStream />
      </div>
    );
  }

  // 7. Render Mode: S-Class Master Gateway Original
  return (
    <div className="bg-[#050505] text-white overflow-hidden flex flex-col min-h-screen">
      <CinematicHeroSClass onProfileIgnite={handleIgnition} />

      <div className="border-y border-white/5 bg-[#0a0a0a]/80 py-4 px-6 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 min-w-[700px]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
            <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
              OCASIONES Y RUTAS PRIORITARIAS:
            </span>
          </div>
          <div className="flex items-center gap-3">
            {occasionLinks.map((occ, i) => (
              <Link
                key={i}
                href={occ.href}
                className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 text-xs font-mono text-white/80 transition-all flex items-center gap-1.5"
              >
                <span>{occ.title}</span>
                <span className="text-[9px] opacity-60 font-bold">{occ.tag}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {activeProfile && (
        <section id="neural-tunnel-section" className="relative py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <CinematicTunnelIgnition 
              profileContext={activeProfile}
              onClose={() => setActiveProfile(null)}
            />
          </div>
        </section>
      )}
    </div>
  );
}
