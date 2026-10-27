'use client';

/**
 * DISCOVERY SEARCH — BÚSQUEDA VERTICAL CANÓNICA DEL HERO
 *
 * Antes: duplicaba el buscador de la píldora con provincias hardcodeadas
 * (9 de 52) y un `handleSearch` que sólo hacía `console.log` (fachada).
 * Ahora: misma fuente de datos (10 gremios × 52 provincias) y mismo contrato
 * de URL que `AirbnbFloatingPillSearchBar`, ambos a través del kernel único.
 */

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, MapPin, Search, Sparkles } from 'lucide-react';
import {
  ALL_SPANISH_PROVINCES,
  BODAS_NET_CATEGORIES,
} from '@/lib/constants/spain-regions-and-categories';
import { buildProviderHref } from '@/lib/search';

const ALL_CATEGORY = 'ALL';

interface DiscoverySearchProps {
  onSearch?: (filters: { category: string; province: string; date: string }) => void;
}

export default function DiscoverySearch({ onSearch }: DiscoverySearchProps) {
  const router = useRouter();

  const [category, setCategory] = useState<string>(ALL_CATEGORY);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const province = location.trim();
    onSearch?.({ category, province, date });

    router.push(
      buildProviderHref({
        category,
        province,
        date,
      })
    );
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto w-full max-w-4xl space-y-4"
      aria-label="Buscador de proveedores por gremio, provincia y fecha"
    >
      {/* 1. GREMIOS CANÓNICOS (10 de Bodas.net) */}
      <div
        role="group"
        aria-label="Gremio del proveedor"
        className="flex flex-wrap items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/[0.03] p-2 backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => setCategory(ALL_CATEGORY)}
          aria-pressed={category === ALL_CATEGORY}
          className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ease-out ${
            category === ALL_CATEGORY
              ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
              : 'text-white/50 hover:bg-white/5 hover:text-white'
          }`}
        >
          <span aria-hidden="true">✨</span> Todos
        </button>

        {BODAS_NET_CATEGORIES.map((option) => {
          const isSelected = category === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setCategory(option.id)}
              aria-pressed={isSelected}
              className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300 ease-out ${
                isSelected
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span aria-hidden="true">{option.iconEmoji}</span> {option.shortLabel}
            </button>
          );
        })}
      </div>

      {/* 2. TERRITORIO + FECHA */}
      <div className="grid grid-cols-1 gap-2 rounded-[2rem] border border-white/10 bg-[#09090d]/80 p-3 shadow-xl backdrop-blur-md md:grid-cols-5">
        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 md:col-span-3">
          <MapPin className="h-4 w-4 shrink-0 text-[#ecb613]" aria-hidden="true" />
          <label htmlFor="discovery-location" className="sr-only">
            Provincia o ciudad
          </label>
          <input
            id="discovery-location"
            type="text"
            list="discovery-provinces"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Provincia, ciudad o código postal…"
            autoComplete="off"
            className="w-full border-none bg-transparent text-sm font-bold text-white placeholder:text-white/30 focus:outline-none"
          />
          <datalist id="discovery-provinces">
            {ALL_SPANISH_PROVINCES.map((province) => (
              <option key={province} value={province} />
            ))}
          </datalist>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-white/[0.04] p-3 md:col-span-2">
          <CalendarIcon className="h-4 w-4 shrink-0 text-[#ecb613]" aria-hidden="true" />
          <label htmlFor="discovery-date" className="sr-only">
            Fecha del evento
          </label>
          <input
            id="discovery-date"
            type="date"
            min={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full border-none bg-transparent font-mono text-xs text-white focus:outline-none sm:text-sm"
          />
        </div>
      </div>

      {/* 3. CTA */}
      <div className="flex justify-center pt-2">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ecb613] to-[#f5d76e] px-16 py-4 font-black uppercase italic tracking-widest text-black shadow-[0_10px_30px_rgba(236,182,19,0.25)] transition-all duration-300 ease-out md:w-auto"
        >
          <Search className="h-4 w-4" aria-hidden="true" />
          Descubrir proveedores
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </motion.button>
      </div>
    </form>
  );
}
