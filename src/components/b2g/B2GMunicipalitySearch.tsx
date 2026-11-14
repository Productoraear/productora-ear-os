'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Building2, Check, MapPin, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { B2GMunicipalityEntry, POPULAR_B2G_MUNICIPALITIES } from '@/lib/geo/b2g-municipal-resolver';

interface B2GMunicipalitySearchProps {
  selectedMunicipality: string;
  onSelect: (entry: B2GMunicipalityEntry) => void;
  className?: string;
}

export function B2GMunicipalitySearch({
  selectedMunicipality,
  onSelect,
  className = ''
}: B2GMunicipalitySearchProps) {
  const [query, setQuery] = useState(selectedMunicipality);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<B2GMunicipalityEntry[]>(POPULAR_B2G_MUNICIPALITIES);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(selectedMunicipality);
  }, [selectedMunicipality]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Búsqueda debounceada
  useEffect(() => {
    if (!isOpen) return;
    if (!query.trim() || query.trim().length < 2) {
      setResults(POPULAR_B2G_MUNICIPALITIES);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/b2g/municipalities?q=${encodeURIComponent(query)}&limit=8`);
        const data = await res.json();
        if (data.success && Array.isArray(data.results)) {
          setResults(data.results);
        }
      } catch (err) {
        console.error('Error buscando municipios:', err);
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSelectEntry = (entry: B2GMunicipalityEntry) => {
    setQuery(entry.name);
    setIsOpen(false);
    onSelect(entry);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label className="text-[10px] font-mono font-bold uppercase text-white/60 block mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Building2 size={12} className="text-[#06b6d4]" />
          Organismo / Municipio (8.131 Ayuntamientos de España)
        </span>
        <span className="text-[9px] text-[#06b6d4] font-mono tracking-wider">
          Auto-población DIR3 y CIF
        </span>
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
          <Search size={14} className="text-[#06b6d4]" />
        </div>
        <input
          type="text"
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          placeholder="Escribe municipio (ej. Toledo, Madrid, Navalcarnero, Illescas)..."
          className="w-full bg-white/5 border border-white/10 hover:border-white/20 focus:border-[#06b6d4] rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder:text-zinc-500 font-mono transition-all outline-none"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white"
        >
          <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Menú flotante de resultados */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-[#0c0d14] border border-white/15 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl animate-in fade-in duration-150">
          <div className="px-3.5 py-2 bg-white/5 border-b border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
            <span>{isLoading ? 'Buscando en censo...' : `${results.length} municipios encontrados`}</span>
            <span className="text-zinc-500 text-[9px]">8.131 entidades locales</span>
          </div>

          <div className="max-h-60 overflow-y-auto divide-y divide-white/5 scrollbar-thin scrollbar-thumb-white/10">
            {results.map((entry) => {
              const isSelected = selectedMunicipality.toLowerCase() === entry.name.toLowerCase();
              return (
                <button
                  key={`${entry.ineCode}-${entry.name}`}
                  type="button"
                  onClick={() => handleSelectEntry(entry)}
                  className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#06b6d4]/15 text-[#06b6d4]'
                      : 'hover:bg-white/5 text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MapPin size={13} className={isSelected ? 'text-[#06b6d4]' : 'text-zinc-500'} />
                    <div className="truncate">
                      <div className="font-bold text-white flex items-center gap-1.5 truncate">
                        <span>{entry.name}</span>
                        {entry.isVerified && (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 text-[8px] font-mono bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                            <ShieldCheck size={9} /> Verificado
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-mono">
                        {entry.province} {entry.comarca ? `· ${entry.comarca}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono text-[10px]">
                    <div className="text-[#06b6d4] font-bold">{entry.dir3}</div>
                    <div className="text-zinc-500 text-[9px]">{entry.cif}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

