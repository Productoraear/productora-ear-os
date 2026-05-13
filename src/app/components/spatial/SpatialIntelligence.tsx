'use client';

import dynamic from 'next/dynamic';
import { useBiometricIntent, useBiometricStore } from '@/lib/hooks/useBiometricIntent';
import { useEffect } from 'react';
import { useSharedContext } from '@/app/context/SharedContext';

const GravityEngine = dynamic(() => import('@/features/spatial/GravityEngine'), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#050505] z-[-1]" />
});

export function SpatialIntelligence() {
  useBiometricIntent();
  const { isReadyToCommit } = useBiometricStore();
  const { setIsPricerOpen } = useSharedContext();

  // Biometría Neural: Si detectamos intención de compra, abrimos el BespokePricer
  useEffect(() => {
    if (isReadyToCommit) {
      console.log('🛡️ [NEURAL BIOMETRICS] Intención detectada. Activando Checkout Espacial.');
      setIsPricerOpen(true);
    }
  }, [isReadyToCommit, setIsPricerOpen]);

  return <GravityEngine />;
}
