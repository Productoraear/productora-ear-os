'use client';

/**
 * ORACLE SEARCH — CONSOLA DE CONSULTA DE LA SALA BLANCA
 *
 * Antes: duplicaba el fetch a RAG con `res.json()` sin tipo, resultados `any`
 * y un `alert()` como acción (fachada). Ahora consume el kernel único
 * (`queryOracleRag`) con timeout, tipado estricto y fuentes trazables.
 */

import React, { useState } from 'react';
import { Search, FileText, ChevronRight, Bot, Loader2, PhoneCall } from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { queryOracleRag, type OracleRagResponse } from '@/lib/search';

export default function OracleSearch() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<OracleRagResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setIsLoading(true);
    try {
      setResponse(await queryOracleRag(trimmed, { limit: 6 }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-[2rem] border border-[#d4a855]/20 bg-[#0a0a0a] p-6 shadow-2xl">
      <form onSubmit={handleSearch} role="search" className="relative mb-8">
        <label htmlFor="oracle-query" className="sr-only">
          Interrogar al Oráculo
        </label>
        <input
          id="oracle-query"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Interrogar al Oráculo…"
          autoComplete="off"
          className="w-full rounded-full border border-white/10 bg-black/50 py-4 pl-12 pr-6 text-white outline-none transition-colors focus:border-[#d4a855]"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          size={18}
          aria-hidden="true"
        />
      </form>

      {isLoading && (
        <div className="flex items-center justify-center gap-2 py-6 font-mono text-xs text-[#d4a855]">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Consultando el índice neuronal…
        </div>
      )}

      {!isLoading && response?.degraded && (
        <div className="rounded-2xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-4 text-xs text-white/70">
          El motor RAG no responde en este instante.{' '}
          <a
            href={CENTRALITA.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-bold text-[#d4a855] hover:underline"
          >
            <PhoneCall className="h-3 w-3" aria-hidden="true" /> Concierge {CENTRALITA.display}
          </a>
        </div>
      )}

      {!isLoading && response?.answer && (
        <div className="mb-6 rounded-2xl border border-[#d4a855]/30 bg-[#d4a855]/10 p-4">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#d4a855]">
            <Bot className="h-4 w-4" aria-hidden="true" /> Respuesta trazada
          </div>
          <p className="whitespace-pre-line text-xs leading-relaxed text-neutral-200">
            {response.answer}
          </p>
        </div>
      )}

      {!isLoading && response && response.hits.length > 0 && (
        <ul className="space-y-2">
          {response.hits.map((hit) => (
            <li
              key={hit.id}
              className="group rounded-2xl border border-white/5 bg-white/5 p-4 transition-all duration-300 ease-out hover:border-[#d4a855]/50"
            >
              <details>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="rounded-xl bg-[#d4a855]/10 p-2.5 text-[#d4a855]">
                      <FileText size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-white">
                        {hit.title}
                      </span>
                      <span className="block font-mono text-[10px] uppercase tracking-widest text-[#d4a855]">
                        score {hit.score.toFixed(2)}
                      </span>
                    </span>
                  </span>
                  <ChevronRight
                    className="h-4 w-4 shrink-0 text-white/20 transition-transform group-hover:translate-x-0.5 group-hover:text-[#d4a855]"
                    aria-hidden="true"
                  />
                </summary>
                <p className="mt-3 whitespace-pre-line border-t border-white/10 pt-3 text-xs leading-relaxed text-white/70">
                  {hit.snippet}
                </p>
              </details>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && response && response.hits.length === 0 && !response.degraded && (
        <p className="text-center text-xs text-white/40">
          Sin nodos coincidentes en el índice para esa consulta.
        </p>
      )}
    </div>
  );
}
