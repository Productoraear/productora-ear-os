'use client';

import { useEffect, useState } from 'react';

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!document.querySelector('script[src*="spline-viewer"]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.src = 'https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js';
      document.head.appendChild(script);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full ${className || ''}`}>
      {/* @ts-ignore custom element */}
      <spline-viewer url={scene} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
