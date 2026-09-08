'use client';

import React from 'react';
import { 
  Search, 
  X, 
  Layers, 
  Building2, 
  UtensilsCrossed, 
  Flower2, 
  Music2, 
  Volume2, 
  Video, 
  HeartHandshake, 
  Shirt, 
  Car,
  Filter,
  MapPin
} from 'lucide-react';

export interface CategoryItem {
  id: string;
  label: string;
  count: number;
  icon: any;
}

interface BentoFilterBarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedProvince: string;
  onProvinceChange: (prov: string) => void;
  provincesList: string[];
  totalResults: number;
}

export const BentoFilterBar: React.FC<BentoFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  selectedProvince,
  onProvinceChange,
  provincesList,
  totalResults,
}) => {
  return (
    <div className="w-full bg-[#050505] border border-[#1a1a1a] rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl">
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. BARRA SUPERIOR: TELEMETRÍA, BÚSQUEDA Y FILTRO PROVINCIA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-[#258DCD] uppercase tracking-widest block font-semibold">
            Índice de Proveedores Auditados
          </span>
          <p className="text-sm font-bold text-white font-syne uppercase mt-0.5">
            {totalResults.toLocaleString()} Profesionales Homologados
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {/* Selector de Provincia */}
          <div className="relative w-full sm:w-44">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
            <select
              value={selectedProvince}
              onChange={(e) => onProvinceChange(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1a1a1a] hover:border-[#258DCD]/50 text-neutral-300 rounded-xl pl-8 pr-7 py-2.5 text-xs font-mono focus:outline-none focus:border-[#258DCD] transition-colors appearance-none cursor-pointer"
            >
              <option value="">Toda España</option>
              {provincesList.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500 text-[10px]">
              ▼
            </div>
          </div>

          {/* Campo de Búsqueda Rápida */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Filtrar por nombre o servicio..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#0a0a0f] border border-[#1a1a1a] hover:border-[#258DCD]/50 rounded-xl pl-9 pr-8 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#258DCD] transition-colors font-mono"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                title="Limpiar búsqueda"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. PESTAÑAS DE CATEGORÍA: ZERO HORIZONTAL OVERFLOW
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="pt-3 border-t border-[#1a1a1a]">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 md:flex-wrap scrollbar-none max-w-full">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-2 rounded-xl text-[11px] font-mono uppercase tracking-wider flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#258DCD] text-black font-extrabold shadow-md shadow-[#258DCD]/20'
                    : 'bg-[#0a0a0f] text-neutral-400 hover:text-white border border-[#1a1a1a] hover:border-[#258DCD]/40'
                }`}
              >
                <Icon size={13} className={isSelected ? 'text-black' : 'text-[#258DCD]'} />
                <span>{cat.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  isSelected ? 'bg-black/20 text-black' : 'bg-white/5 text-neutral-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
