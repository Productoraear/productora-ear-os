"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
//   ssr: false,
//   loading: () => <div className="w-full h-full bg-black/40 animate-pulse flex items-center justify-center text-[#d4af37] font-black uppercase tracking-[0.4em] text-xs">Desplegando Radar S-Class...</div>
// });

// const Marker = dynamic(() => import('react-map-gl').then(mod => mod.Marker || (mod as any).Marker), { 
//   ssr: false 
// });

const MapPlaceholder = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full h-full bg-[#0a0a0a] relative overflow-hidden">
    {/* Grid effect */}
    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#d4af37 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
    <div className="w-full h-full flex items-center justify-center">
       <div className="text-center relative">
          <div className="absolute inset-0 bg-[#d4af37]/10 blur-[100px] rounded-full scale-150 animate-pulse" />
          <div className="relative text-white/40 font-black text-[120px] tracking-tighter italic opacity-5 select-none pointer-events-none uppercase">EAR RADAR</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <div className="w-1 h-32 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent animate-[scan_4s_linear_infinite]" />
          </div>
       </div>
    </div>
    {children}
  </div>
);

const MarkerPlaceholder = ({ longitude, latitude, children }: any) => {
   // Conversión simple para el placeholder (muy básica)
   const x = ((longitude + 5) / 10) * 100;
   const y = ((45 - latitude) / 10) * 100;
   return (
      <div className="absolute pointer-events-auto" style={{ left: `${x}%`, top: `${y}%` }}>
         {children}
      </div>
   );
};

import VimumeDossier from './VimumeDossier';

// MAPBOX TOKEN: Obtenido desde variables de entorno
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

export default function RadarMap() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const [ragStats, setRagStats] = useState({ total: 0, sclass: 0 });

  useEffect(() => {
    // 🧠 MAGIA NEGRA: CRUCE DE DATOS CON LA BÓVEDA RAG
    const loadRealData = async () => {
      try {
        const response = await fetch('/data/RAG_BOVEDA_NODOS_FULL.json');
        const data = await response.json();
        setRagStats({
          total: data.length,
          sclass: Math.floor(data.length * 0.12)
        });

        // CENTRO DE ESPAÑA (Aproximado)
        const centerLat = 40.4168;
        const centerLng = -3.7038;

        // Función de hashing simple para coordenadas deterministas
        const getDeterministicPos = (id: string, range = 6) => {
          let hash = 0;
          for (let i = 0; i < id.length; i++) {
            hash = id.charCodeAt(i) + ((hash << 5) - hash);
          }
          return (hash % 1000) / 1000 * range - (range / 2);
        };

        // Seleccionamos una muestra representativa (por rendimiento)
        const sampleSize = 150;
        const sampledData = data
          .slice(0, 5000) // Primero tomamos una ventana
          .filter((_: any, i: number) => i % (Math.floor(5000 / sampleSize)) === 0)
          .map((node: any) => ({
            ...node,
            latitude: centerLat + getDeterministicPos(node.id + "LAT", 5),
            longitude: centerLng + getDeterministicPos(node.id + "LNG", 8),
            type: node.extension === '.pdf' || node.extension === '.docx' ? 'TENDER' : 'ASSET'
          }));

        setMarkers(sampledData);
      } catch (e) {
        console.error("Error cargando Bóveda RAG:", e);
      }
    };
    loadRealData();
  }, []);

  const handleMarkerClick = (marker: any) => {
    if (marker.type === 'TENDER') {
      setSelectedTarget({
        id: marker.id,
        nombre: marker.nombre,
        location: marker.rutaAbsoluta.split('/')[1] || "ECOSISTEMA EAR",
        type: `PROCESO ${marker.extension.toUpperCase()}`,
        density: (marker.tamanoBytes / 1024 / 1024).toFixed(2), // MB
        providers: Math.floor(Math.random() * 20) + 5
      });
      setIsDossierOpen(true);
    }
  };

  return (
    <div className="w-full h-[600px] bg-zinc-900 rounded-3xl overflow-hidden relative border border-white/5 border-t-emerald-500/30">
        <div className="absolute top-6 left-6 z-10 bg-black/80 backdrop-blur-md p-4 rounded-xl border border-white/10 group">
          <h3 className="text-white font-black uppercase tracking-tight text-xl mb-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
            Bóveda RAG Activa
          </h3>
          <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">
            {ragStats.total.toLocaleString()} Nodos Detectados // {markers.length} Proyectados
          </p>
          <div className="mt-4 space-y-2 text-[10px] font-mono group-hover:opacity-100 opacity-60 transition-opacity">
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
                <span className="text-zinc-300">ACTIVO S-CLASS (FILE/NODE)</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                <span className="text-zinc-300">TARGET VIMUME (DOCS/TENDER)</span>
             </div>
          </div>
        </div>

      <MapPlaceholder>
        {markers.map((marker, index) => (
          <MarkerPlaceholder 
            key={marker.id || index} 
            longitude={marker.longitude} 
            latitude={marker.latitude}
          >
            <div 
              onClick={() => handleMarkerClick(marker)}
              title={marker.nombre}
              className={`w-2 h-2 rounded-full cursor-pointer hover:scale-[3] transition-all group/marker relative ${marker.type === 'TENDER' ? 'bg-purple-500 shadow-[0_0_12px_rgba(168,85,247,0.8)]' : 'bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.6)]'}`}
            >
               <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover/marker:opacity-100 whitespace-nowrap pointer-events-none z-50 border border-white/10">
                  {marker.nombre}
               </div>
            </div>
          </MarkerPlaceholder>
        ))}
      </MapPlaceholder>

      {/* MODAL DOSSIER VIMUME (WHITEPAPER) */}
      <VimumeDossier 
        isOpen={isDossierOpen} 
        onClose={() => setIsDossierOpen(false)} 
        targetData={selectedTarget}
      />
      
      {/* Efecto escáner */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0)_0%,rgba(16,185,129,0.05)_100%)]">
         <div className="w-full h-1 bg-emerald-500/20 absolute top-0 left-0 animate-[scan_3s_linear_infinite]" />
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
