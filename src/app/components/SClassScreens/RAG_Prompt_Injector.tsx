'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Activity, Target } from 'lucide-react';

/**
 * RAG_Prompt_Injector - EAR OS V2 GOLD
 * Nodo de alta densidad funcional inyectado via Fotosíntesis de Tokens.
 * Bebe directamente del EAR_OS_GENOME.md.
 */
export const RAG_Prompt_Injector: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 bg-[#050505] border border-[#d4a855]/20 rounded-3xl backdrop-blur-xl group hover:border-[#d4a855]/50 transition-all shadow-2xl"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#d4a855]/10 rounded-lg text-[#d4a855] group-hover:animate-pulse">
          <Zap size={20} />
        </div>
        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/80">RAG_Prompt_Injector</h3>
      </div>
      <div className="h-24 flex items-center justify-center border border-dashed border-white/5 rounded-xl">
        <span className="text-[10px] text-white/20 uppercase font-mono tracking-widest italic">Sincronizando con Codex Omega...</span>
      </div>
      <div className="mt-4 flex justify-between items-center opacity-40">
         <Activity size={12} />
         <Shield size={12} />
         <Target size={12} />
      </div>
    </motion.div>
  );
};
