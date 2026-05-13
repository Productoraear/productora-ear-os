import React, { Suspense } from 'react';
import SovereignNavbar from '@/app/components/layout/SovereignNavbar';
import SovereignBottomNav from '@/app/components/layout/SovereignBottomNav';
import OmniSearchModal from '@/app/components/ui/OmniSearchModal';
import Footer from '@/app/components/Footer';
import { PositiveFrictionModal } from '@/app/components/SClassScreens/PositiveFrictionModal';

/**
 * 🏛️ EAR OS GOLD - PUBLIC LAYOUT
 * Gestiona la experiencia del usuario final (B2C/B2B público).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-20 bg-black" />}>
        <SovereignNavbar />
      </Suspense>
      
      <Suspense fallback={null}>
        <OmniSearchModal />
      </Suspense>

      {children}

      <Footer />

      <Suspense fallback={null}>
        <SovereignBottomNav />
      </Suspense>

      <PositiveFrictionModal />
    </>
  );
}
