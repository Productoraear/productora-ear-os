"use client";

/**
 * 🔎 ORÁCULO SEARCH CONSOLE
 * Interfaz inmersiva tipo Bloomberg/Perplexity para consultar el motor
 * consultivo del Oráculo Diamante Rojo en un solo clic.
 */

import React, { useMemo, useState } from 'react';
import { Search, Sparkles, BookOpen, Layers, AlertCircle } from 'lucide-react';
import {
  searchOraculo,
  type OraculoSearchResult,
} from '@/lib/academia/oraculoEngine';

const QUICK_QUERIES = ['guardado', 'algoritmo', 'monetizacion', 'gira', 'apertura'];

const KIND_ICON: Record<OraculoSearchResult['kind'], React.ReactNode> = {
  cluster: <Layers size={14} />,
  caso: <AlertCircle size={14} />,
  fase: <Sparkles size={14} />,
  señal: <BookOpen size={14} />,
};

export default function OraculoSearchConsole() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchOraculo(query, 10), [query]);

  return (
    <div className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]">
          <Search size={18} />
        </div>
        <div>
          <h3 className="font-mono text-sm font-bold uppercase tracking-widest text-white">
            Consola de Consulta
          </h3>
          <p className="text-[11px] text-white/40">
            Interroga al motor: clusters, casos críticos, cronograma y señales.
          </p>
        </div>
      </div>

      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca: guardado, apertura, monetización, gira…"
          aria-label="Consulta al Oráculo Diamante Rojo"
          className="w-full rounded-2xl border border-white/10 bg-black/60 py-4 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#FF2B44]/50 focus:outline-none"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => setQuery(q)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50 transition-all hover:border-[#FF2B44]/40 hover:text-white"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {query && results.length === 0 && (
          <p className="py-6 text-center text-xs italic text-white/40">
            Sin coincidencias. Reformula la consulta con otro término.
          </p>
        )}
        {results.map((result) => (
          <div
            key={`${result.kind}-${result.refId}`}
            className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-[#FF2B44]/30"
          >
            <span className="mt-0.5 text-[#FF2B44]">{KIND_ICON[result.kind]}</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] uppercase tracking-widest text-white/30">
                  {result.kind}
                </span>
              </div>
              <p className="text-sm font-bold text-white">{result.title}</p>
              <p className="mt-0.5 text-xs italic text-white/50">{result.excerpt}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}