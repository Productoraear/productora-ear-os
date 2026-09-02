'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  ShieldCheck, 
  Landmark, 
  Heart, 
  Music, 
  TrendingUp, 
  Users, 
  Activity, 
  Award,
  Layers
} from 'lucide-react';
import { VIMUME_BLOCKS, VimumeOntologyBlock } from '@/lib/constants/vimume-100-levels';

const BLOCK_ICONS: Record<string, React.ElementType> = {
  A: Brain,
  B: Activity,
  C: Heart,
  D: Users,
  E: TrendingUp,
  F: Landmark,
  G: ShieldCheck,
  H: Layers,
  I: Music,
  J: Award
};

export const VimumeOntologyExplorer: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('A');

  const selectedBlock = VIMUME_BLOCKS.find(b => b.blockId === selectedBlockId) || VIMUME_BLOCKS[0];

  return (
    <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0e0e14] to-[#06060a] border border-[#ecb613]/30 p-6 sm:p-10 space-y-8 shadow-[0_0_60px_rgba(236,182,19,0.1)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase font-bold">
            <Sparkles size={13} />
            <span>BASE DE CONOCIMIENTO // ONTOLOGÍA DE 100 NIVELES</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne">
            Arquitectura Semántica del <span className="text-[#ecb613]">ADN VIMUME</span>
          </h3>
        </div>

        <div className="text-xs font-mono text-zinc-400 bg-black/60 px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-2 w-fit">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>10 Bloques • 100 Niveles Semánticos Activos</span>
        </div>
      </div>

      {/* Block Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
        {VIMUME_BLOCKS.map((block) => {
          const Icon = BLOCK_ICONS[block.blockId] || Brain;
          const isSelected = selectedBlockId === block.blockId;

          return (
            <button
              key={block.blockId}
              onClick={() => setSelectedBlockId(block.blockId)}
              className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                isSelected
                  ? 'bg-[#ecb613] text-black border-[#ecb613] font-bold shadow-lg shadow-[#ecb613]/25 scale-105'
                  : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span className="text-[10px] font-mono font-black">{block.blockId}</span>
              <span className="text-[8px] font-mono tracking-tighter opacity-80 truncate max-w-[70px]">{block.range}</span>
            </button>
          );
        })}
      </div>

      {/* Active Block Content */}
      <div className="p-6 sm:p-8 rounded-3xl bg-black/70 border border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold block">
              Bloque {selectedBlock.blockId} // Rango {selectedBlock.range}
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white font-syne">
              {selectedBlock.name}
            </h4>
          </div>

          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
            {selectedBlock.levels.length} Dimensiones Acreditadas
          </span>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {selectedBlock.levels.map((lvl) => (
            <div
              key={lvl.level}
              className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ecb613]/30 transition-colors space-y-1.5 flex gap-3 items-start"
            >
              <span className="px-2 py-1 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] font-black shrink-0">
                L{lvl.level}
              </span>
              <div className="space-y-0.5 min-w-0">
                <h5 className="text-xs font-bold text-white font-syne leading-snug">
                  {lvl.title}
                </h5>
                <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                  {lvl.scope}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
