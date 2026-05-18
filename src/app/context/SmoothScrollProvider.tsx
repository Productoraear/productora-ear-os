'use client';

import { ReactLenis } from '@studio-freight/react-lenis';
import { ReactNode, useEffect, useState } from 'react';

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Si es un dispositivo táctil, no usamos Lenis para evitar saturar el hilo principal (TBT)
  if (isTouch) return <>{children}</>;

  const lenisChildren: Parameters<typeof ReactLenis>[0]['children'] = children;

  return (
    <ReactLenis root options={{ 
      lerp: 0.1, 
      duration: 1.2, 
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 0, // Deshabilitar explícitamente en touch si llegara a cargar
    }}>
      {lenisChildren}
    </ReactLenis>
  );
}
