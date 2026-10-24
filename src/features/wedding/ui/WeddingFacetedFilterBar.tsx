'use client';

import React from 'react';
import {
  CalendarDays,
  MapPin,
  SlidersHorizontal,
  Clock,
  BadgeCheck,
} from 'lucide-react';
import {
  PRICE_TIERS,
  WEDDING_MOMENTS,
  RADIO_OPTIONS,
} from '@/lib/constants/wedding-taxonomy';
import type {
  WeddingFacetState,
  WeddingMomentId,
} from '@/lib/constants/wedding-taxonomy';

interface WeddingFacetedFilterBarProps {
  state: WeddingFacetState;
  onChange: (patch: Partial<WeddingFacetState>) => void;
  totalResults: number;
}

/** 🎛️ Barra de filtros facetados (bodas.net S-Class): Precio, Fecha, Radio y Momento. */
export function WeddingFacetedFilterBar({
  state,
  onChange,
  totalResults,
}: WeddingFacetedFilterBarProps) {
  return (
    <div className="sticky top-20 z-30 rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] overflow-hidden">
      <div className="px-5 sm:px-6 py-4 flex items-center justify-between gap-4 border-b border-white/5">
        <div className="flex items-center gap-2.5 min-w-0">
          <SlidersHorizontal className="w-4 h-4 text-[#ecb613] shrink-0" />
          <span className="text-[10px] font-mono font-black uppercase tracking-[0.25em] text-white/40 truncate">
            Filtros Facetados S-Class
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <BadgeCheck className="w-4 h-4 text-[#ecb613]" />
          <span className="text-xs font-mono text-white/70">
            {totalResults.toLocaleString('es-ES')} opciones
          </span>
        </div>
      </div>

      <div className="px-5 sm:px-6 py-4 space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40 w-20 shrink-0">
            Precio
          </span>
          {PRICE_TIERS.map((tier) => {
            const active = state.precio === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => onChange({ precio: active ? 'all' : tier.id })}
                aria-pressed={active}
                className={`px-4 py-2 rounded-2xl border text-xs font-bold tracking-wide transition-all duration-300 ease-out cursor-pointer ${
                  active
                    ? 'bg-[#ecb613] text-black border-transparent shadow-[0_0_20px_rgba(236,182,19,0.35)]'
                    : 'bg-white/[0.03] text-white/70 border-white/10 hover:border-[#ecb613]/50 hover:text-white'
                }`}
              >
                <span className="font-mono">{tier.glyph}</span>
                <span className="ml-1.5 hidden sm:inline">{tier.name}</span>
                <span className="ml-2 text-[10px] font-mono opacity-70">{tier.label}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="flex items-center gap-2.5 rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 transition-all duration-300 hover:border-[#ecb613]/40 cursor-pointer">
            <CalendarDays className="w-4 h-4 text-[#ecb613] shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40">Fecha</span>
              <input
                type="date"
                value={state.fecha ?? ''}
                onChange={(e) => onChange({ fecha: e.target.value || null })}
                className="bg-transparent text-sm text-white outline-none [color-scheme:dark] w-full"
              />
            </div>
          </label>

          <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 transition-all duration-300 hover:border-[#ecb613]/40">
            <MapPin className="w-4 h-4 text-[#ecb613] shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40">Radio (km)</span>
              <select
                value={state.radioKm}
                onChange={(e) => onChange({ radioKm: Number(e.target.value) })}
                className="bg-transparent text-sm text-white outline-none w-full cursor-pointer [&>option]:bg-[#0c0a0e]"
              >
                {RADIO_OPTIONS.map((km) => (
                  <option key={km} value={km}>{km} km</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 transition-all duration-300 hover:border-[#ecb613]/40">
            <Clock className="w-4 h-4 text-[#ecb613] shrink-0" />
            <div className="flex flex-col flex-1">
              <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40">Momento</span>
              <select
                value={state.momento}
                onChange={(e) => onChange({ momento: e.target.value as WeddingMomentId | 'all' })}
                className="bg-transparent text-sm text-white outline-none w-full cursor-pointer [&>option]:bg-[#0c0a0e]"
              >
                <option value="all">Todo el evento</option>
                {WEDDING_MOMENTS.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
