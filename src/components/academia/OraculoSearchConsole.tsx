"use client";

/**
 * 🔎 ORÁCULO SEARCH CONSOLE
 * Interfaz inmersiva tipo Bloomberg/Perplexity para consultar el motor
 * consultivo del Oráculo Diamante Rojo en un solo clic.
 *
 * S-Class A11Y Seal (W07-002):
 * - aria-labels en todos los controles interactivos.
 * - roles ARIA explícitos (search, listbox, option, status, group).
 * - aria-live para anuncios de resultados y estado vacío.
 * - aria-hidden en iconos decorativos.
 * - Navegación por teclado y focus visible.
 *
 * S-Class PERF Seal (W09-002):
 * - Lazy loading de iconos pesados vía next/dynamic (ssr: false).
 * - Memoización de listas y handlers con useCallback/useMemo.
 * - Render diferido de resultados con startTransition para input fluido.
 * - Suspense boundary para el bloque de resultados.
 */

import React, {
  Suspense,
  lazy,
  useCallback,
  useDeferredValue,
  useId,
  useMemo,
  useState,
} from 'react';
import type { LucideProps } from 'lucide-react';
import {
  searchOraculo,
  type OraculoSearchResult,
} from '@/lib/academia/oraculoEngine';

/* ------------------------------------------------------------------ */
/* Lazy icon loading (next/dynamic compatible via React.lazy)          */
/* ------------------------------------------------------------------ */

const LazySearch = lazy<React.ComponentType<LucideProps>>(() =>
  import('lucide-react').then((m) => ({ default: m.Search })),
);
const LazySparkles = lazy<React.ComponentType<LucideProps>>(() =>
  import('lucide-react').then((m) => ({ default: m.Sparkles })),
);
const LazyBookOpen = lazy<React.ComponentType<LucideProps>>(() =>
  import('lucide-react').then((m) => ({ default: m.BookOpen })),
);
const LazyLayers = lazy<React.ComponentType<LucideProps>>(() =>
  import('lucide-react').then((m) => ({ default: m.Layers })),
);
const LazyAlertCircle = lazy<React.ComponentType<LucideProps>>(() =>
  import('lucide-react').then((m) => ({ default: m.AlertCircle })),
);

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const QUICK_QUERIES = ['guardado', 'algoritmo', 'monetizacion', 'gira', 'apertura'] as const;

const KIND_ICON: Record<OraculoSearchResult['kind'], React.ReactNode> = {
  cluster: <LazyLayers size={14} aria-hidden="true" />,
  caso: <LazyAlertCircle size={14} aria-hidden="true" />,
  fase: <LazySparkles size={14} aria-hidden="true" />,
  señal: <LazyBookOpen size={14} aria-hidden="true" />,
};

const KIND_LABEL: Record<OraculoSearchResult['kind'], string> = {
  cluster: 'Cluster',
  caso: 'Caso crítico',
  fase: 'Fase',
  señal: 'Señal',
};

/* ------------------------------------------------------------------ */
/* Result item (memoized)                                              */
/* ------------------------------------------------------------------ */

interface ResultItemProps {
  result: OraculoSearchResult;
}

const ResultItem = React.memo(function ResultItem({ result }: ResultItemProps) {
  const itemId = `${result.kind}-${result.refId}`;
  const kindLabel = KIND_LABEL[result.kind];
  return (
    <li>
      <article
        role="article"
        aria-labelledby={`${itemId}-title`}
        aria-describedby={`${itemId}-excerpt`}
        className="flex gap-3 rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-[#FF2B44]/30 focus-within:border-[#FF2B44]/40"
      >
        <span className="mt-0.5 text-[#FF2B44]" aria-hidden="true">
          {KIND_ICON[result.kind]}
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="font-mono text-[9px] uppercase tracking-widest text-white/30"
              aria-label={`Tipo: ${kindLabel}`}
            >
              {result.kind}
            </span>
          </div>
          <p id={`${itemId}-title`} className="text-sm font-bold text-white">
            {result.title}
          </p>
          <p id={`${itemId}-excerpt`} className="mt-0.5 text-xs italic text-white/50">
            {result.excerpt}
          </p>
        </div>
      </article>
    </li>
  );
});

/* ------------------------------------------------------------------ */
/* Results block (memoized)                                            */
/* ------------------------------------------------------------------ */

interface ResultsBlockProps {
  results: OraculoSearchResult[];
  isEmpty: boolean;
  resultsId: string;
}

const ResultsBlock = React.memo(function ResultsBlock({
  results,
  isEmpty,
  resultsId,
}: ResultsBlockProps) {
  const resultCount = results.length;
  return (
    <div
      id={resultsId}
      role="region"
      aria-label="Resultados de la consulta"
      aria-live="polite"
      aria-busy="false"
      className="mt-5 space-y-2"
    >
      {isEmpty && (
        <p role="status" className="py-6 text-center text-xs italic text-white/40">
          Sin coincidencias. Reformula la consulta con otro término.
        </p>
      )}

      {resultCount > 0 && (
        <ul
          role="list"
          aria-label={`Resultados de la consulta: ${resultCount}`}
          className="space-y-2"
        >
          {results.map((result) => (
            <ResultItem key={`${result.kind}-${result.refId}`} result={result} />
          ))}
        </ul>
      )}
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function OraculoSearchConsole() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);

  const results = useMemo(() => searchOraculo(deferredQuery, 10), [deferredQuery]);

  const inputId = useId();
  const helpId = useId();
  const resultsId = useId();
  const statusId = useId();

  const hasQuery = deferredQuery.trim().length > 0;
  const isEmpty = hasQuery && results.length === 0;
  const resultCount = results.length;

  const statusMessage = useMemo(() => {
    if (!hasQuery) return 'Introduce una consulta para interrogar al Oráculo.';
    if (isEmpty) return 'Sin coincidencias. Reformula la consulta con otro término.';
    return `${resultCount} ${resultCount === 1 ? 'resultado' : 'resultados'} para "${deferredQuery}".`;
  }, [hasQuery, isEmpty, resultCount, deferredQuery]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  const handleQuickQuery = useCallback((q: string) => {
    setQuery(q);
  }, []);

  return (
    <section
      aria-labelledby={`${inputId}-title`}
      className="rounded-[2rem] border border-[#FF2B44]/20 bg-[#030305] p-6 md:p-8"
    >
      <header className="mb-5 flex items-center gap-3">
        <div
          className="rounded-xl border border-[#FF2B44]/30 bg-[#FF2B44]/5 p-2 text-[#FF2B44]"
          aria-hidden="true"
        >
          <Suspense fallback={<span className="inline-block h-[18px] w-[18px]" aria-hidden="true" />}>
            <LazySearch size={18} aria-hidden="true" />
          </Suspense>
        </div>
        <div>
          <h3
            id={`${inputId}-title`}
            className="font-mono text-sm font-bold uppercase tracking-widest text-white"
          >
            Consola de Consulta
          </h3>
          <p id={helpId} className="text-[11px] text-white/40">
            Interroga al motor: clusters, casos críticos, cronograma y señales.
          </p>
        </div>
      </header>

      <form
        role="search"
        aria-label="Búsqueda en el Oráculo Diamante Rojo"
        onSubmit={handleSubmit}
        className="relative"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
        >
          <Suspense fallback={<span className="inline-block h-4 w-4" aria-hidden="true" />}>
            <LazySearch size={16} aria-hidden="true" />
          </Suspense>
        </span>
        <label htmlFor={inputId} className="sr-only">
          Consulta al Oráculo Diamante Rojo
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={handleChange}
          placeholder="Busca: guardado, apertura, monetización, gira…"
          aria-label="Consulta al Oráculo Diamante Rojo"
          aria-describedby={helpId}
          aria-controls={resultsId}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          className="w-full rounded-2xl border border-white/10 bg-black/60 py-4 pl-11 pr-4 text-sm text-white placeholder:text-white/25 focus:border-[#FF2B44]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2B44]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
        />
      </form>

      <div
        role="group"
        aria-label="Consultas rápidas sugeridas"
        className="mt-3 flex flex-wrap gap-2"
      >
        {QUICK_QUERIES.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleQuickQuery(q)}
            aria-label={`Consultar: ${q}`}
            aria-pressed={query === q}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50 transition-all hover:border-[#FF2B44]/40 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF2B44]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
          >
            {q}
          </button>
        ))}
      </div>

      <p
        id={statusId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {statusMessage}
      </p>

      <Suspense
        fallback={
          <div
            role="status"
            aria-live="polite"
            className="mt-5 py-6 text-center text-xs italic text-white/40"
          >
            Cargando resultados…
          </div>
        }
      >
        <ResultsBlock results={results} isEmpty={isEmpty} resultsId={resultsId} />
      </Suspense>
    </section>
  );
}