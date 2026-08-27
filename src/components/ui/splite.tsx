'use client';

import React, { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense 
      fallback={
        <div className="w-full h-full flex items-center justify-center bg-black/40 backdrop-blur-sm min-h-[300px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#ecb613] rounded-full animate-spin" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Cargando Escena 3D...</span>
          </div>
        </div>
      }
    >
      <Spline 
        scene={scene}
        className={className}
      />
    </Suspense>
  );
}

export default SplineScene;
