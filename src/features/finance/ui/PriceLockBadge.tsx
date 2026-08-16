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
      className="bg-black/60 border border-[#ecb613]/30 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_0_30px_rgba(236,182,19,0.15)]"
    >
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#ecb613]/10 rounded-xl">
            <Lock size={20} className="text-[#ecb613]" />
          </div>
          <div>
            <p className="text-[10px] text-[#ecb613] font-black uppercase tracking-[0.3em]">Tarifa Congelada 72h</p>
            <p className="text-white font-mono text-xs opacity-70">HASH: {hash}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-3xl font-display font-black text-white italic">{total.toFixed(0)} €</p>
          <p className="text-[9px] text-gray-500 uppercase tracking-widest">+ 0.50 € Depósito de Garantía</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-2">
          <Activity size={12} /> Distribución de Capital Soberano (80/10/10)
        </p>
        <div className="flex h-2 w-full rounded-full overflow-hidden bg-white/5">
          <div className="bg-white h-full" style={{ width: '80%' }} title="80% Artista"></div>
          <div className="bg-gray-500 h-full" style={{ width: '10%' }} title="10% Infraestructura EAR"></div>
          <div className="bg-[#ecb613] h-full" style={{ width: '10%' }} title="10% Fundación VIMUME"></div>
        </div>
        <div className="flex justify-between text-[9px] font-mono text-gray-500 uppercase">
          <span>Artista: {split.artist}€</span>
          <span>Infraestructura: {split.platform}€</span>
          <span className="text-[#ecb613]">VIMUME: {split.vimume}€</span>
        </div>
      </div>
    </motion.div>
  );
};
