'use client';

import React, { useEffect, useState } from 'react';

interface SplineSceneProps {
  scene?: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // Utilizar escena interactiva oficial con fallback garantizado
  const embedUrl = scene && scene.includes('my.spline.design') 
    ? scene 
    : "https://my.spline.design/3dtext-kZDDjO5HuC9GJUM2/";

  return (
    <div className={`relative w-full h-full min-h-[350px] flex items-center justify-center overflow-hidden ${className || ''}`}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-white/20 border-t-[#ecb613] rounded-full animate-spin" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/40">Cargando Escena 3D...</span>
          </div>
        </div>
      )}
      <iframe
        src={embedUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        className="w-full h-full min-h-[350px] border-0 pointer-events-auto"
        title="EAR OS V2 Spline 3D Scene"
        loading="lazy"
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
}

export default SplineScene;
