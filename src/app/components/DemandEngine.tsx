"use client";
import React from 'react';

/**
 * 🏛️ DEMAND ENGINE - EAR OS GOLD
 * Módulo de detección de demanda y señales de mercado.
 * Estado: En recalibración V99.
 */
export const DemandEngine = () => {
  return (
    <div className="glass-pane p-8 border-white/5 bg-white/[0.02] relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-[#d4a855]/20 group-hover:bg-[#d4a855] transition-colors" />
      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-[#d4a855] mb-4">Demand Engine</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center opacity-40">
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Market Signals</span>
          <span className="text-[10px] font-mono text-[#d4a855]">RECALIBRATING</span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-[#d4a855]/20 animate-pulse" />
        </div>
        <p className="text-[9px] text-white/20 uppercase font-black tracking-widest leading-relaxed">
            Ingeniería de tracción comercial pausada por Drift Gate v.99. 
            Esperando validación de Fase 3.
        </p>
      </div>
    </div>
  );
};

export default DemandEngine;
