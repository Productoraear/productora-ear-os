'use client';

import React, { useState, useMemo } from 'react';
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
  Layers,
  Search,
  CheckCircle2,
  Copy,
  Check,
  FileSpreadsheet,
  Zap
} from 'lucide-react';
import { VIMUME_BLOCKS, VimumeOntologyBlock, VimumeLevelItem } from '@/lib/constants/vimume-100-levels';

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

const BLOCK_COLORS: Record<string, { border: string; glow: string; text: string; bg: string }> = {
  A: { border: 'border-[#8b5cf6]/40', glow: 'rgba(139,92,246,0.2)', text: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]/10' },
  B: { border: 'border-[#AAD6CD]/40', glow: 'rgba(170,214,205,0.2)', text: 'text-[#AAD6CD]', bg: 'bg-[#AAD6CD]/10' },
  C: { border: 'border-pink-500/40', glow: 'rgba(236,72,153,0.2)', text: 'text-pink-400', bg: 'bg-pink-500/10' },
  D: { border: 'border-cyan-500/40', glow: 'rgba(6,182,212,0.2)', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  E: { border: 'border-emerald-500/40', glow: 'rgba(16,185,129,0.2)', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  F: { border: 'border-blue-500/40', glow: 'rgba(59,130,246,0.2)', text: 'text-blue-400', bg: 'bg-blue-500/10' },
  G: { border: 'border-amber-500/40', glow: 'rgba(245,158,11,0.2)', text: 'text-amber-400', bg: 'bg-amber-500/10' },
  H: { border: 'border-indigo-500/40', glow: 'rgba(99,102,241,0.2)', text: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  I: { border: 'border-[#ecb613]/40', glow: 'rgba(236,182,19,0.2)', text: 'text-[#ecb613]', bg: 'bg-[#ecb613]/10' },
  J: { border: 'border-purple-500/40', glow: 'rgba(168,85,247,0.2)', text: 'text-purple-400', bg: 'bg-purple-500/10' }
};

export const VimumeOntologyExplorer: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string>('A');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);
  const [copiedLevel, setCopiedLevel] = useState<number | null>(null);

  const selectedBlock = VIMUME_BLOCKS.find(b => b.blockId === selectedBlockId) || VIMUME_BLOCKS[0];
  const activeColor = BLOCK_COLORS[selectedBlock.blockId] || BLOCK_COLORS.A;

  // Filtrado de búsqueda global en los 100 niveles
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results: (VimumeLevelItem & { blockId: string; blockName: string })[] = [];
    
    for (const block of VIMUME_BLOCKS) {
      for (const lvl of block.levels) {
        if (
          lvl.title.toLowerCase().includes(query) ||
          lvl.scope.toLowerCase().includes(query) ||
          lvl.level.toString().includes(query)
        ) {
          results.push({ ...lvl, blockId: block.blockId, blockName: block.name });
        }
      }
    }
    return results;
  }, [searchQuery]);

  const handleCopy = (text: string, levelNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedLevel(levelNum);
    setTimeout(() => setCopiedLevel(null), 2000);
  };

  return (
    <div className="rounded-[2.5rem] bg-gradient-to-b from-[#0e0e14] via-[#08080c] to-[#040407] border border-[#ecb613]/30 p-6 sm:p-10 space-y-8 shadow-[0_0_80px_rgba(236,182,19,0.12)] relative overflow-hidden">
      {/* Glow ambiental dinámico */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-[140px] pointer-events-none transition-colors duration-700" 
        style={{ backgroundColor: activeColor.glow }}
      />

      {/* Header & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10 relative z-10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase font-bold">
            <Sparkles size={13} />
            <span>ARQUITECTURA DEL CONOCIMIENTO // BENTO GRID L1-L100</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne tracking-tight">
            Matriz Ontológica <span className="text-[#ecb613]">100 Niveles de Verdad</span>
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 font-light max-w-2xl leading-relaxed">
            Explora las 100 dimensiones científicas, clínicas, acústicas y jurídicas que blindan a VIMUME como el estándar sociosanitario de vanguardia.
          </p>
        </div>

        {/* Buscador semántico */}
        <div className="relative w-full lg:w-72">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar por concepto o nivel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-white/10 rounded-2xl py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-[#ecb613] transition-colors"
          />
        </div>
      </div>

      {/* Selector Bento de Bloques A-J */}
      {!searchResults && (
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 relative z-10">
          {VIMUME_BLOCKS.map((block) => {
            const Icon = BLOCK_ICONS[block.blockId] || Brain;
            const isSelected = selectedBlockId === block.blockId;
            const color = BLOCK_COLORS[block.blockId] || BLOCK_COLORS.A;

            return (
              <button
                key={block.blockId}
                type="button"
                onClick={() => {
                  setSelectedBlockId(block.blockId);
                  setExpandedLevel(null);
                }}
                className={`p-3 sm:p-3.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? `${color.bg} ${color.border} ${color.text} shadow-lg scale-105 font-bold`
                    : 'bg-white/[0.02] text-zinc-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-[11px] font-mono font-black">Bloque {block.blockId}</span>
                <span className="text-[8px] font-mono opacity-70 tracking-tighter truncate max-w-[65px]">
                  {block.range}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Content Area: Resultados de Búsqueda O Bloque Seleccionado */}
      <div className="relative z-10">
        {searchResults ? (
          /* VISTA RESULTADOS DE BÚSQUEDA */
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 pb-2 border-b border-white/10">
              <span>{searchResults.length} Resultados para &quot;{searchQuery}&quot;</span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#ecb613] hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {searchResults.map((lvl) => (
                <div
                  key={`${lvl.blockId}-${lvl.level}`}
                  className="p-4 rounded-2xl bg-black/60 border border-white/10 hover:border-[#ecb613]/50 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-lg bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] font-black">
                        L{lvl.level}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-400">
                        Bloque {lvl.blockId} • {lvl.blockName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(`[Nivel ${lvl.level} - ${lvl.title}]: ${lvl.scope}`, lvl.level)}
                      className="text-zinc-500 hover:text-white transition-colors"
                      title="Copiar extracto ontológico"
                    >
                      {copiedLevel === lvl.level ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white font-syne leading-snug">{lvl.title}</h5>
                    <p className="text-[11px] text-zinc-300 font-light mt-1 leading-relaxed">{lvl.scope}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* VISTA BENTO GRID DEL BLOQUE ACTIVO */
          <div className="p-6 sm:p-8 rounded-3xl bg-black/70 border border-white/10 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className={`text-[10px] font-mono uppercase font-bold block ${activeColor.text}`}>
                  Bloque {selectedBlock.blockId} // Rango {selectedBlock.range}
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white font-syne">
                  {selectedBlock.name}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-400">
                  {selectedBlock.levels.length} Dimensiones Certificadas
                </span>
              </div>
            </div>

            {/* Bento Grid de Dimensiones (L1-L10 de este bloque) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {selectedBlock.levels.map((lvl) => {
                const isExpanded = expandedLevel === lvl.level;

                return (
                  <motion.div
                    key={lvl.level}
                    layout
                    onClick={() => setExpandedLevel(isExpanded ? null : lvl.level)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 flex flex-col justify-between ${
                      isExpanded
                        ? `bg-gradient-to-br from-black to-[#100d1c] ${activeColor.border} shadow-[0_0_25px_rgba(139,92,246,0.2)]`
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-lg border text-[10px] font-mono font-black ${activeColor.bg} ${activeColor.border} ${activeColor.text}`}>
                          L{lvl.level}
                        </span>
                        <h5 className="text-xs font-bold text-white font-syne leading-snug">
                          {lvl.title}
                        </h5>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(`[Nivel ${lvl.level} - ${lvl.title}]: ${lvl.scope}`, lvl.level);
                          }}
                          className="p-1 rounded text-zinc-500 hover:text-white transition-colors"
                          title="Copiar extracto"
                        >
                          {copiedLevel === lvl.level ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                        <ChevronDown
                          size={15}
                          className={`text-zinc-500 transition-transform ${isExpanded ? 'rotate-180 text-white' : ''}`}
                        />
                      </div>
                    </div>

                    <p className={`text-[11px] font-light leading-relaxed ${isExpanded ? 'text-zinc-200' : 'text-zinc-400 line-clamp-2'}`}>
                      {lvl.scope}
                    </p>

                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400"
                      >
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <CheckCircle2 size={12} />
                          Acreditado en SSOT
                        </span>
                        <span className="text-zinc-500">Hash SHA-256 Auditado</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Callout */}
      <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-zinc-400 relative z-10">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#ecb613]" />
          <span>Base de conocimiento indexada en RAG vectorial y oráculo cognitivo de EAR OS V2</span>
        </div>
        <span className="text-white font-bold">100 / 100 DIMENSIONES ACTIVAS</span>
      </div>
    </div>
  );
};
