// Ruta: src/app/components/studio/EmanagerStudioMasterV2.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Lock, Zap, ChevronRight, Activity } from 'lucide-react';
import { useStudioProgress } from '../../hooks/useStudioProgress';
import { AssetAnalyticsNASA } from './AssetAnalyticsNASA';
import { ToolVaultGrid } from './ToolVaultGrid';

/**
 * EmanagerStudioMasterV2 - Orquestador de la fase avanzada.
 * Implementa la purga nominal Edwin Agudelo y lógica de Truth Engine.
 */
const EmanagerStudioMasterV2: React.FC<{ userId: string }> = ({ userId }) => {
  const { progress, loading } = useStudioProgress(userId);

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-2 border-[#D4AF37]/20 border-t-[#D4AF37] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Montserrat'] pb-32">
      {/* Header Cinematográfico */}
      <header className="p-6 flex justify-between items-center sticky top-0 bg-[#050505]/80 backdrop-blur-xl z-50 border-b border-white/5">
        <button className="p-2 -ml-2 text-white hover:text-[#D4AF37] transition-colors"><ArrowLeft size={24} /></button>
        <div className="text-center">
          <span className="text-[#D4AF37] font-['Cinzel'] font-bold tracking-[0.3em] uppercase text-[10px] block">Emanager Studio</span>
          <span className="text-gray-500 text-[8px] font-bold uppercase tracking-widest">Protocolo Edwin Agudelo</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-lg shadow-[#D4AF37]/5">
          <Award size={20} className="text-[#D4AF37]" />
        </div>
      </header>

      <main className="p-6 space-y-12">
        {/* Hero de Nivel Avanzado */}
        <section className="space-y-6">
          <div>
            <span className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.4em] mb-2 block font-mono">Status: S-Class Operative</span>
            <h1 className="text-4xl font-['Cinzel'] font-black leading-tight">
              Ingeniería de <br/><span className="text-[#D4AF37]">Autoridad Forense</span>
            </h1>
          </div>
          
          {/* XP HUD */}
          <div className="bg-[#0A0A0A] border border-white/5 p-6 rounded-3xl">
            <div className="flex justify-between items-end mb-4">
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Sincronización Total</span>
              <span className="text-[#D4AF37] font-black text-xl">84%</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: 0 }} 
                 animate={{ width: '84%' }} 
                 className="h-full bg-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
               />
            </div>
          </div>
        </section>

        {/* Módulo NASA: Analytics */}
        <section>
          <AssetAnalyticsNASA />
        </section>

        {/* Bóveda de Herramientas Tácticas */}
        <section>
          <ToolVaultGrid />
        </section>

        {/* Lección Destacada (Directiva Omega) */}
        <section className="bg-gradient-to-br from-[#D4AF37]/15 to-black border border-[#D4AF37]/30 rounded-[2.5rem] p-10 relative overflow-hidden group">
           <div className="absolute inset-0 bg-[url('https://picsum.photos/id/158/800/600')] bg-cover bg-center opacity-5 group-hover:scale-105 transition-transform duration-1000"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-black shadow-lg">
                    <Zap size={20} fill="currentColor" />
                 </div>
                 <h4 className="text-xl font-bold uppercase tracking-tight font-['Cinzel']">Lección Maestra</h4>
              </div>
              <p className="text-sm text-gray-400 leading-relaxed mb-10 italic">
                "Diseña tu arquitectura de patrimonio antes de que el mercado defina tu precio."
              </p>
              <button className="w-full py-5 bg-white text-black font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-all">
                INICIAR PRUEBA DE TRABAJO <ChevronRight size={18} />
              </button>
           </div>
        </section>
      </main>
    </div>
  );
};

export default EmanagerStudioMasterV2;
