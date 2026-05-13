'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEarStore } from '@/store/useEarStore';

export default function NexusNodePage({ params }: { params: { role: string; id: string } }) {
  const router = useRouter();
  const addXp = useEarStore((state) => state.addXp);
  const addInvestment = useEarStore((state) => state.addInvestment);
  
  const [isSyncing, setIsSyncing] = useState(false);
  const [metrics, setMetrics] = useState({ aura: 0, roi: 0, reliability: 0 });

  useEffect(() => {
    // Simulando extracción de métricas cuánticas desde NUCLEO_DATA
    setMetrics({
      aura: parseFloat((Math.random() * (9.9 - 8.5) + 8.5).toFixed(1)),
      roi: Math.floor(Math.random() * 400 + 150),
      reliability: Math.floor(Math.random() * 20 + 80),
    });
  }, [params.id]);

  const handleClaim = () => {
    setIsSyncing(true);
    
    // Inyección en la Bóveda S-Class
    addInvestment({
      id: params.id,
      name: `Nodo ${params.role.toUpperCase()} Alpha`,
      type: params.role as any,
      cost: metrics.roi * 10, // Costo derivado del ROI
      roiProjected: metrics.roi,
      auraLevel: metrics.aura,
      reliabilityScore: metrics.reliability,
    });
    
    // Recompensa por dominancia
    addXp(150);

    setTimeout(() => {
      router.push('/portal'); // Redirigir al dashboard/portal tras asimilar
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-[#d4a855]/30">
      
      {/* Background Holográfico */}
      <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#d4a855]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-white/5 blur-[150px] pointer-events-none" />

      {/* Navbar Minimalista S-Class */}
      <nav className="w-full px-8 py-6 border-b border-white/5 flex justify-between items-center z-10 relative backdrop-blur-md bg-[#050505]/50">
        <div className="font-syne font-bold text-xl tracking-[0.2em] text-white">EAR<span className="text-[#d4a855]">OS</span></div>
        <div className="flex items-center space-x-3">
          <span className="text-xs uppercase tracking-widest text-white/50 font-inter">NEXUS LINK: {params.id}</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
        </div>
      </nav>

      {/* Main Content: Jerarquía Zona Blanca */}
      <main className="max-w-7xl mx-auto px-6 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Lado Izquierdo: Info del Nodo */}
          <div className="lg:col-span-6 space-y-10 animate-fade-in-left">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a855]" />
                <span className="text-[#d4a855] text-xs uppercase tracking-[0.3em] font-bold">Activo Detectado</span>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] mb-6 font-syne">
                HOLOGRAMA <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                  {params.role.toUpperCase()}
                </span>
              </h1>
              <p className="text-white/60 text-lg leading-relaxed font-manrope max-w-lg">
                Has interceptado un nodo de alto rendimiento en la matriz B2B. Sus métricas sugieren una alta afinidad cuántica con tu bóveda de operaciones.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="text-xs uppercase text-white/40 mb-2 font-inter tracking-wider">Aura</div>
                <div className="text-3xl font-black text-white">{metrics.aura} <span className="text-sm text-[#d4a855]">⚡</span></div>
              </div>
              <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="text-xs uppercase text-white/40 mb-2 font-inter tracking-wider">ROI Proy.</div>
                <div className="text-3xl font-black text-white">+{metrics.roi}%</div>
              </div>
              <div className="bg-black/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 hover:border-white/20 transition-colors">
                <div className="text-xs uppercase text-white/40 mb-2 font-inter tracking-wider">Fiabilidad</div>
                <div className="text-3xl font-black text-white">{metrics.reliability}%</div>
              </div>
            </div>
          </div>

          {/* Lado Derecho: ZONA BLANCA (S-Class Interactor) */}
          <div className="lg:col-span-6 animate-fade-in-up delay-200">
            <div className="bg-white text-black p-10 lg:p-14 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_80px_rgba(255,255,255,0.05)]">
              {/* Gradiente sutil interno de la zona blanca */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-200" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#d4a855]/10 rounded-full blur-[60px]" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-8 tracking-tight font-syne flex items-center">
                  Protocolo de Asimilación
                </h3>

                <div className="space-y-6 mb-12 font-manrope">
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <span className="text-black/50 uppercase tracking-widest text-xs font-bold">Firma Digital</span>
                    <span className="font-bold text-black bg-black/5 px-3 py-1 rounded-md text-sm">{params.id.substring(0, 8)}...</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <span className="text-black/50 uppercase tracking-widest text-xs font-bold">Integridad de Nodo</span>
                    <span className="font-bold text-green-600 flex items-center">
                      <span className="material-symbols-outlined text-[1rem] mr-1">check_circle</span>
                      Validado
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/10 pb-4">
                    <span className="text-black/50 uppercase tracking-widest text-xs font-bold">Impacto en Bóveda</span>
                    <span className="font-black text-[#b68d3a]">+150 XP</span>
                  </div>
                </div>

                <button
                  onClick={handleClaim}
                  disabled={isSyncing}
                  className={
                    isSyncing 
                      ? 'w-full py-6 rounded-2xl text-lg font-black tracking-[0.2em] transition-all duration-500 overflow-hidden relative bg-black/5 text-black/50 border border-black/10' 
                      : 'w-full py-6 rounded-2xl text-lg font-black tracking-[0.2em] transition-all duration-500 overflow-hidden relative bg-black text-white hover:bg-[#d4a855] hover:text-black shadow-xl hover:shadow-[0_10px_40px_rgba(212,168,85,0.4)] hover:-translate-y-1'
                  }
                >
                  {!isSyncing ? (
                    <span className="relative z-10 flex items-center justify-center font-inter">
                      VAMPIRIZAR NODO
                      <svg className="w-5 h-5 ml-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                  ) : (
                    <div className="flex items-center justify-center space-x-3 relative z-10">
                      <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      <span className="font-inter">INFLUYENDO MATRIZ...</span>
                    </div>
                  )}
                </button>
                <p className="text-center text-xs text-black/40 mt-6 font-inter font-medium">
                  Al vampirizar este nodo, se sincronizará perpetuamente con tu estado global (Zustand).
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </main>

    </div>
  );
}
