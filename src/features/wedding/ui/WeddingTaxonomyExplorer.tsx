'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  WEDDING_GREMIOS,
  WEDDING_MACRO_GREMIOS,
  getCategoriesByGremio,
  getGremioById,
  buildBodasCategoryHref,
  getGremioProviderCount,
} from '@/lib/constants/wedding-taxonomy';
import type { WeddingFacetState, WeddingGremioId } from '@/lib/constants/wedding-taxonomy';
import { WeddingFacetedFilterBar } from './WeddingFacetedFilterBar';
import { WeddingCategoryCard } from './WeddingCategoryCard';

const DEFAULT_FACET_STATE: WeddingFacetState = {
  gremio: 'musica',
  categoria: null,
  provincia: 'madrid',
  precio: 'all',
  fecha: null,
  radioKm: 100,
  momento: 'all',
};

/**
 * 🧭 EXPLORADOR DE TAXONOMÍA CANÓNICA (NIVEL 1 → NIVEL 3).
 * Selector de macro-gremios + barra de filtros facetados + rejilla de categorías.
 * Estado reactivo vía URL Search Params (gremio, provincia) sin recargas.
 */
export function WeddingTaxonomyExplorer() {
  const searchParams = useSearchParams();

  const initialGremio: WeddingGremioId =
    getGremioById(searchParams.get('gremio') ?? '')?.id ?? DEFAULT_FACET_STATE.gremio;
  const initialProvincia = searchParams.get('provincia') ?? DEFAULT_FACET_STATE.provincia;

  const [state, setState] = useState<WeddingFacetState>({
    ...DEFAULT_FACET_STATE,
    gremio: initialGremio,
    provincia: initialProvincia,
  });

  const activeGremio = getGremioById(state.gremio) ?? WEDDING_MACRO_GREMIOS[0];
  const categories = useMemo(() => getCategoriesByGremio(state.gremio), [state.gremio]);
  const totalResults = getGremioProviderCount(state.gremio);

  const handlePatch = (patch: Partial<WeddingFacetState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="space-y-6">
      {/* Encabezado + selector de provincia */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
        <div className="space-y-2 max-w-2xl">
          <span className="text-xs font-mono font-black uppercase tracking-[0.3em] text-[#ecb613]">
            Taxonomía Canónica de Gremios · pSEO
          </span>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne leading-[1.1] text-balance">
            Navega como en bodas.net, a velocidad instantánea
          </h2>
          <p className="text-sm text-white/55 font-light leading-relaxed max-w-xl text-pretty">
            De la taxonomía de macro-gremios a la ficha canónica. Cada categoría pliega a su
            servicio canónico para consolidar la señal SEO sin URLs doorway.
          </p>
        </div>

        <label className="flex items-center gap-2.5 rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 transition-all duration-300 hover:border-[#ecb613]/40 min-w-[200px]">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40">Provincia</span>
          <input
            type="text"
            value={state.provincia}
            onChange={(e) => handlePatch({ provincia: e.target.value })}
            placeholder="madrid"
            className="bg-transparent text-sm text-white outline-none w-full"
          />
        </label>
      </div>

      {/* Selector de macro-gremios (NIVEL 1) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {WEDDING_GREMIOS.map((gremio) => {
          const active = state.gremio === gremio.id;
          return (
            <button
              key={gremio.id}
              type="button"
              onClick={() => handlePatch({ gremio: gremio.id })}
              aria-pressed={active}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all duration-300 ease-out cursor-pointer ${
                active
                  ? 'bg-[#ecb613] text-black border-transparent shadow-[0_0_25px_rgba(236,182,19,0.35)]'
                  : 'bg-white/[0.03] text-white/60 border-white/10 hover:border-[#ecb613]/50 hover:text-white'
              }`}
            >
              <span aria-hidden>{gremio.emoji}</span>
              <span>{gremio.name}</span>
              <span className={`text-[10px] font-mono font-bold ${active ? 'text-black/60' : 'text-white/30'}`}>
                {getGremioProviderCount(gremio.id).toLocaleString('es-ES')}
              </span>
            </button>
          );
        })}
      </div>

      {/* Barra de filtros facetados (NIVEL 3) */}
      <WeddingFacetedFilterBar
        state={state}
        onChange={handlePatch}
        totalResults={totalResults}
      />

      {/* Rejilla de categorías hoja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <WeddingCategoryCard
            key={cat.slug}
            category={cat}
            gremio={activeGremio}
            href={buildBodasCategoryHref(state.provincia, cat.slug)}
          />
        ))}
      </div>

      {/* Nota de trazabilidad SSOT */}
      <p className="text-[10px] font-mono text-white/30 leading-relaxed pt-2">
        Cifras derivadas del manifest público del Data Lake (SSOT). Contadores por gremio trazables,
        cero cifras inventadas. Depósito Price-Lock 100 € y Split 80/10/10 gobernados por
        ear-os-ssot.ts (Zona Cero).
      </p>
    </div>
  );
}
