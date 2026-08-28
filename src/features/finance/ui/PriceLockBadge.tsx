// src/features/finance/ui/PriceLockBadge.tsx
'use client';

import React from 'react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriceLockBadgeProps {
  hash: string;
  total: number;
  split: { artist: number; platform: number; vimume: number };
}

export const PriceLockBadge: React.FC<PriceLockBadgeProps> = ({ hash, total, split }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-b from-[#081226] via-[#040914] to-[#000000] border border-[#AAD6CD]/25 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_0_35px_rgba(8,18,38,0.85),0_0_20px_rgba(37,141,205,0.15)]"
    >
      <div className="flex items-center justify-between mb-4 border-b border-[#AAD6CD]/15 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#258DCD]/15 border border-[#258DCD]/30 rounded-xl text-[#AAD6CD]">
            <Lock size={20} className="text-[#AAD6CD]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#AAD6CD]/10 border border-[#AAD6CD]/30 text-[9px] text-[#AAD6CD] font-mono font-bold uppercase tracking-wider mb-1">
              <ShieldCheck size={10} />
              <span>Tarifa Congelada 72h SHA-256</span>
            </div>
            <p className="text-[#AAD6CD]/80 font-mono text-xs">HASH: {hash}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-display font-black text-white italic">{total.toFixed(0)} €</p>
          <p className="text-[9px] text-[#AAD6CD]/60 uppercase tracking-widest">+ Depósito Reembolsable</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <Activity size={12} className="text-[#258DCD]" /> Distribución de Capital Soberano (80/10/10)
        </p>
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5 border border-[#AAD6CD]/10">
          <div className="bg-white h-full" style={{ width: '80%' }} title="80% Artista"></div>
          <div className="bg-[#258DCD] h-full" style={{ width: '10%' }} title="10% Infraestructura EAR"></div>
          <div className="bg-[#AAD6CD] h-full" style={{ width: '10%' }} title="10% Fundación VIMUME"></div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-zinc-400 uppercase">
          <span>Artista (80%): <strong className="text-white">{split.artist}€</strong></span>
          <span>Infraestructura (10%): <strong className="text-[#258DCD]">{split.platform}€</strong></span>
          <span>VIMUME (10%): <strong className="text-[#AAD6CD]">{split.vimume}€</strong></span>
        </div>
      </div>
    </motion.div>
  );
};
