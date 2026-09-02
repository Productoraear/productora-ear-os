'use client';

import React from 'react';
import SovereignNavbar from '@/app/components/layout/SovereignNavbar';
import About from '@/widgets/about/AboutWidget';
import SocialImpactWidget from '@/widgets/about/SocialImpactWidget';

/**
 * 🏛️ QUIÉNES SOMOS - LA NARRATIVA S-CLASS
 * Página de autoridad y visión de Productora EAR.
 */
export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <SovereignNavbar />
      <About />
      <SocialImpactWidget />
    </main>
  );
}
