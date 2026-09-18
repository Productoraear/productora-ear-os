"use client";

import React, { useEffect, useRef } from 'react';
import { Search, Plus, Bookmark, X, Sparkles, SlidersHorizontal } from 'lucide-react';

interface CultDirectoryHeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedProvince: string;
  onProvinceChange: (val: string) => void;
  provincesList: string[];
  totalNodesCount: number;
  activeSpotsCount: number;
  bookmarkedCount: number;
  onOpenSubmitModal: () => void;
  onOpenBookmarksDrawer: () => void;
}

export const CultDirectoryHero: React.FC<CultDirectoryHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedProvince,
  onProvinceChange,
  provincesList,
  totalNodesCount,
  activeSpotsCount,
  bookmarkedCount,
  onOpenSubmitModal,
  onOpenBookmarksDrawer,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Atajo de teclado ⌘K o / para enfocar el buscador
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative pt-28 sm:pt-32 pb-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
      {/* 1. Cult UI Pulse Status Badge */}
      <div className="flex items-center gap-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900/90 text-xs font-mono text-zinc-300 shadow-sm backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse cult-pulse-glow" />
          <span className="font-semibold text-white">{activeSpotsCount} Cupos S-Class Activos</span>
          <span className="text-zinc-600">•</span>
          <span className="text-[#ecb613]">{totalNodesCount.toLocaleString('es-ES')} Nodos Auditados</span>
        </div>
      </div>

      {/* 2. Bold Display Typography with Subtle Gradient */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-syne tracking-tight text-white max-w-4xl leading-[1.08] uppercase">
        DIRECTORIO &amp; CATÁLOGO{' '}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613]">
          S-CLASS
        </span>
      </h1>

      <p className="mt-3 text-sm sm:text-base text-zinc-400 font-sans max-w-2xl leading-relaxed">
        Espacios singulares, solistas de gala y equipamiento audiovisual homologado bajo póliza de RC de 1.000.000 €, auditoría acústica &lt; 75 dB SPL y depósito protegido Stripe de 100,00 €.
      </p>

      {/* 3. Search Bar & Fast CTA Controls (Cult UI Pill Glow Search) */}
      <div className="w-full max-w-3xl mt-8 flex flex-col sm:flex-row items-center gap-3">
        {/* Glow Input Container */}
        <div className="cult-input-shadow-glow flex-1 w-full rounded-full bg-zinc-900/90 border border-zinc-800 shadow-xl flex items-center px-4 py-1.5 focus-within:border-[#ecb613]/60 transition-all">
          <Search className="w-5 h-5 text-zinc-400 shrink-0 mr-3" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre, finca, solista o servicio..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none font-sans py-2"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Keyboard shortcut pill */}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-zinc-800/80 border border-zinc-700/60 shrink-0">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>

        {/* Province Quick Filter Dropdown */}
        <div className="relative w-full sm:w-auto shrink-0">
          <select
            value={selectedProvince}
            onChange={(e) => onProvinceChange(e.target.value)}
            className="w-full sm:w-44 appearance-none px-4 py-3 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none focus:border-[#ecb613]/50 cursor-pointer text-center"
          >
            <option value="ALL">📍 Toda España</option>
            {provincesList.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons: Submit New Listing & Saved Bookmarks */}
        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={onOpenSubmitModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#ecb613] text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition-all active:scale-95 shadow-[0_0_15px_rgba(236,182,19,0.3)] whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Proponer Nodo</span>
          </button>

          <button
            type="button"
            onClick={onOpenBookmarksDrawer}
            className={`relative p-3 rounded-full border transition-all active:scale-95 ${
              bookmarkedCount > 0
                ? 'bg-zinc-800 border-[#ecb613]/50 text-[#ecb613]'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
            }`}
            title="Ver Mi Selección Guardada"
          >
            <Bookmark className={`w-4 h-4 ${bookmarkedCount > 0 ? 'fill-[#ecb613]' : ''}`} />
            {bookmarkedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#ecb613] text-black text-[10px] font-mono font-black flex items-center justify-center">
                {bookmarkedCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
