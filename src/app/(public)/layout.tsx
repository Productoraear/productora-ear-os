import React, { Suspense } from 'react';
import PublicNavbar from '@/components/public/PublicNavbar';
import PublicFooter from '@/components/public/PublicFooter';
import SovereignBottomNav from '@/app/components/layout/SovereignBottomNav';
import OmniSearchModal from '@/app/components/ui/OmniSearchModal';
import { PositiveFrictionModal } from '@/app/components/SClassScreens/PositiveFrictionModal';
import ThemeWrapper from '@/app/components/layout/ThemeWrapper';

/**
 * 🏛️ VIMUME OS - PUBLIC LAYOUT
 * Shell única canónica para la experiencia pública.
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeWrapper>
      <Suspense fallback={<div className="h-20 bg-black" />}>
        <PublicNavbar />
      </Suspense>
      
      <Suspense fallback={null}>
        <OmniSearchModal />
      </Suspense>

      {/* Main Content Area */}
      {children}

      <Suspense fallback={<div className="h-40 bg-black" />}>
        <PublicFooter />
      </Suspense>

      <Suspense fallback={null}>
        <SovereignBottomNav />
      </Suspense>

      <PositiveFrictionModal />
    </ThemeWrapper>
  );
}
