'use client';

/**
 * ════════════════════════════════════════════════════════════════════════════
 * UNIFIED SEARCH — BUSCADOR GLOBAL ÚNICO DE EAR OS (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Absorbe y sustituye a DOS buscadores duplicados que competían por ⌘K:
 *   · `OmniSearchModal`          (índice global + intención + RAG manual)
 *   · `UniversalCommandPalette`  (RAG en vivo + comandos de sistema)
 *
 * Toda la lógica vive en `@/lib/search`. Este componente es SOLO interacción:
 * cero reglas de negocio y cero duplicación de lógica de búsqueda.
 */

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Sparkles,
  Briefcase,
  Car,
  Zap,
  Music,
  Building2,
  Activity,
  ArrowRight,
  Bot,
  Loader2,
  PhoneCall,
  Terminal,
  Layers,
} from 'lucide-react';
import { useSharedContext } from '@/app/context/SharedContext';
import { CENTRALITA } from '@/lib/phone-constants';
import {
  COMMAND_RESULT_LIMIT,
  ORACULO_DEBOUNCE_MS,
  ORACULO_MIN_CHARS,
  SEARCH_PILLARS,
  detectSearchIntent,
  queryOracleRag,
  resolveTaxonomyMatch,
  searchCatalog,
  searchCommands,
  type OracleRagHit,
  type ScoredSearchHit,
  type SearchCommand,
  type SearchPillarId,
} from '@/lib/search';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTOCOMPLETADO VIVO (BLOQUE 1) — /api/search/providers SOBRE POSTGRESQL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Debounce del autocompletado de proveedores (INV-19: 200-300 ms). */
export const PROVIDERS_DEBOUNCE_MS = 250;

/** Timeout duro de la consulta de proveedores (INV-17: ≤ 8.000 ms). */
export const PROVIDERS_TIMEOUT_MS = 8000;

/** Mínimo de caracteres para interrogar la BD. */
const PROVIDERS_MIN_CHARS = 2;

/** Proveedor vivo devuelto por `/api/search/providers`. */
interface LiveProviderHit {
  id: string;
  name: string;
  category: string;
  href: string;
  kind: 'vendor' | 'artist';
}

interface LiveProvidersState {
  hits: LiveProviderHit[];
  loading: boolean;
  /** `true` cuando la BD no respondió: se declara, no se finge (AF-1). */
  degraded: boolean;
}

const EMPTY_LIVE_PROVIDERS: LiveProvidersState = {
  hits: [],
  loading: false,
  degraded: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/** Saneado por tipo de la respuesta (frontera externa, SEC-4): cero `any`. */
function parseLiveProviders(payload: unknown): LiveProviderHit[] {
  if (!isRecord(payload) || !Array.isArray(payload.providers)) return [];
  const hits: LiveProviderHit[] = [];
  for (const entry of payload.providers) {
    if (!isRecord(entry)) continue;
    const name = typeof entry.name === 'string' ? entry.name : '';
    const href = typeof entry.href === 'string' ? entry.href : '';
    if (name.length === 0 || !href.startsWith('/')) continue;
    hits.push({
      id: typeof entry.id === 'string' ? entry.id : name,
      name,
      category: typeof entry.category === 'string' ? entry.category : 'Proveedor',
      href,
      kind: entry.kind === 'artist' ? 'artist' : 'vendor',
    });
  }
  return hits;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MODELO DE FILAS NAVEGABLES (↑ ↓ ↵)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type NavigableRow =
  | { kind: 'intent'; key: string; href: string }
  | { kind: 'taxonomy'; key: string; href: string }
  | { kind: 'provider'; key: string; href: string; provider: LiveProviderHit }
  | { kind: 'catalog'; key: string; href: string; hit: ScoredSearchHit }
  | { kind: 'command'; key: string; href: string; command: SearchCommand };


interface OraclePanelState {
  hits: OracleRagHit[];
  answer: string | null;
  loading: boolean;
  degraded: boolean;
  showAnswer: boolean;
}

const EMPTY_ORACLE: OraclePanelState = {
  hits: [],
  answer: null,
  loading: false,
  degraded: false,
  showAnswer: false,
};

const GROUP_LABEL: Record<SearchCommand['group'], string> = {
  CONVERSION: 'Conversión inmediata',
  NAVEGACION: 'Navegación canónica',
  ADMINISTRACION: 'Administración',
};

function renderCategoryIcon(category: string): React.ReactNode {
  switch (category) {
    case 'servicios':
      return <Briefcase className="h-4 w-4 text-emerald-400" aria-hidden="true" />;
    case 'flota':
      return <Car className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />;
    case 'arsenal':
      return <Zap className="h-4 w-4 text-amber-400" aria-hidden="true" />;
    case 'artistas':
      return <Music className="h-4 w-4 text-purple-400" aria-hidden="true" />;
    case 'b2g':
      return <Building2 className="h-4 w-4 text-blue-400" aria-hidden="true" />;
    case 'vimume':
      return <Activity className="h-4 w-4 text-rose-400" aria-hidden="true" />;
    default:
      return <Sparkles className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />;
  }
}

export const UnifiedSearch: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen } = useSharedContext();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [pillar, setPillar] = useState<SearchPillarId>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [oracle, setOracle] = useState<OraclePanelState>(EMPTY_ORACLE);
  /** Proveedores VIVOS de PostgreSQL (autocompletado, Bloque 1). */
  const [liveProviders, setLiveProviders] = useState<LiveProvidersState>(EMPTY_LIVE_PROVIDERS);


  const inputRef = useRef<HTMLInputElement>(null);
  const baseId = useId();
  const dialogTitleId = `${baseId}-title`;
  const listboxId = `${baseId}-listbox`;
  const optionId = useCallback((index: number) => `${baseId}-option-${index}`, [baseId]);

  const open = useCallback(() => setIsSearchOpen(true), [setIsSearchOpen]);
  const close = useCallback(() => setIsSearchOpen(false), [setIsSearchOpen]);

  // ── Efectos de ciclo de vida ────────────────────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) {
      document.body.style.overflow = 'unset';
      setQuery('');
      setPillar('all');
      setSelectedIndex(0);
      setOracle(EMPTY_ORACLE);
      return;
    }

    document.body.style.overflow = 'hidden';
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 80);
    return () => window.clearTimeout(focusTimer);
  }, [isSearchOpen]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
        return;
      }
      if (event.key === 'Escape') close();
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [close, open]);

  // ── Oráculo RAG en vivo (debounce + abort) ──────────────────────────────
  useEffect(() => {
    if (!isSearchOpen) return;

    const trimmed = query.trim();
    if (trimmed.length < ORACULO_MIN_CHARS) {
      setOracle(EMPTY_ORACLE);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;
    setOracle((previous) => ({ ...previous, loading: true, showAnswer: false }));

    const timer = window.setTimeout(() => {
      void queryOracleRag(trimmed, { limit: 4, signal: controller.signal }).then(
        (response) => {
          if (cancelled) return;
          setOracle({
            hits: response.hits,
            answer: response.answer,
            loading: false,
            degraded: response.degraded,
            showAnswer: false,
          });
        }
      );
    }, ORACULO_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, isSearchOpen]);


  // ── Autocompletado VIVO de proveedores (debounce 250 ms + AbortController) ─
  useEffect(() => {
    if (!isSearchOpen) return;

    const trimmed = query.trim();
    if (trimmed.length < PROVIDERS_MIN_CHARS) {
      setLiveProviders(EMPTY_LIVE_PROVIDERS);
      return;
    }

    const controller = new AbortController();
    const timeoutTimer = window.setTimeout(() => controller.abort(), PROVIDERS_TIMEOUT_MS);
    let cancelled = false;
    setLiveProviders((previous) => ({ ...previous, loading: true }));

    const debounceTimer = window.setTimeout(() => {
      void fetch(`/api/search/providers?q=${encodeURIComponent(trimmed)}&limit=6`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
        .then(async (response) => {
          if (!response.ok) throw new Error(`HTTP_${response.status}`);
          const payload: unknown = await response.json();
          if (cancelled) return;
          const degraded = isRecord(payload) && payload.source === 'unreachable';
          setLiveProviders({
            hits: parseLiveProviders(payload),
            loading: false,
            degraded,
          });
        })
        .catch(() => {
          // Fail-open honesto: sin datos de BD, el catálogo y la taxonomía siguen.
          if (cancelled) return;
          setLiveProviders({ hits: [], loading: false, degraded: true });
        })
        .finally(() => window.clearTimeout(timeoutTimer));
    }, PROVIDERS_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      controller.abort();
      window.clearTimeout(debounceTimer);
      window.clearTimeout(timeoutTimer);
    };
  }, [query, isSearchOpen]);

  // ── Resultados: un único kernel alimenta las tres capas ─────────────────
  const intentMatch = useMemo(() => detectSearchIntent(query), [query]);
  const taxonomyMatch = useMemo(() => resolveTaxonomyMatch(query), [query]);
  const catalogHits = useMemo(() => searchCatalog(query, { pillar }), [query, pillar]);

  const commandHits = useMemo(
    () => searchCommands(query, COMMAND_RESULT_LIMIT),
    [query]
  );

  const rows = useMemo<NavigableRow[]>(() => {
    const next: NavigableRow[] = [];

    if (intentMatch) {
      next.push({ kind: 'intent', key: 'intent', href: intentMatch.targetUrl });
    }

    // 🎼 TAXONOMÍA (Bloque 2): un género de cola larga resuelto por el motor.
    if (taxonomyMatch.facet !== null) {
      next.push({ kind: 'taxonomy', key: `taxonomy-${taxonomyMatch.facet.id}`, href: taxonomyMatch.href });
    }

    // 🗄️ PROVEEDORES VIVOS (Bloque 1): filas reales de PostgreSQL.
    for (const provider of liveProviders.hits) {
      next.push({
        kind: 'provider',
        key: `provider-${provider.kind}-${provider.id}`,
        href: provider.href,
        provider,
      });
    }

    for (const hit of catalogHits) {
      next.push({
        kind: 'catalog',
        key: `catalog-${hit.item.id}`,
        href: hit.item.url,
        hit,
      });
    }

    for (const scored of commandHits) {
      next.push({
        kind: 'command',
        key: `command-${scored.command.id}`,
        href: scored.command.href,
        command: scored.command,
      });
    }

    return next;
  }, [intentMatch, taxonomyMatch, liveProviders.hits, catalogHits, commandHits]);


  useEffect(() => {
    setSelectedIndex(0);
  }, [rows.length]);

  const catalogRows = useMemo(
    () => rows.map((row, index) => ({ row, index })).filter((entry) => entry.row.kind === 'catalog'),
    [rows]
  );

  /** Filas de proveedores vivos (PostgreSQL) para pintar su grupo propio. */
  const providerRows = useMemo(
    () => rows.map((row, index) => ({ row, index })).filter((entry) => entry.row.kind === 'provider'),
    [rows]
  );

  /** Fila única de taxonomía (género de cola larga resuelto por el motor). */
  const taxonomyRow = useMemo(() => {
    const index = rows.findIndex((row) => row.kind === 'taxonomy');
    return index === -1 ? null : { row: rows[index], index };
  }, [rows]);

  const intentRow = useMemo(() => {
    const index = rows.findIndex((row) => row.kind === 'intent');
    return index === -1 ? null : { row: rows[index], index };
  }, [rows]);


  const commandGroups = useMemo(() => {
    const groups: Array<{
      group: SearchCommand['group'];
      items: Array<{ row: NavigableRow; index: number }>;
    }> = [];

    rows.forEach((row, index) => {
      if (row.kind !== 'command') return;
      const existing = groups.find((entry) => entry.group === row.command.group);
      if (existing) existing.items.push({ row, index });
      else groups.push({ group: row.command.group, items: [{ row, index }] });
    });

    return groups;
  }, [rows]);

  const navigate = useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (rows.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedIndex((previous) => (previous + 1) % rows.length);
        return;
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedIndex((previous) => (previous - 1 + rows.length) % rows.length);
        return;
      }

      if (event.key === 'Enter') {
        event.preventDefault();
        const row = rows[selectedIndex];
        if (row) navigate(row.href);
      }
    },
    [navigate, rows, selectedIndex]
  );

  const revealOracleAnswer = useCallback(() => {
    setOracle((previous) => ({ ...previous, showAnswer: true }));
  }, []);

  const clearQuery = useCallback(() => {
    setQuery('');
    setOracle(EMPTY_ORACLE);
    inputRef.current?.focus();
  }, []);

  const hasResults = rows.length > 0;
  const activeDescendant = hasResults ? optionId(selectedIndex) : undefined;


  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDER
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <div
          className="fixed inset-0 z-[999] flex items-start justify-center px-4 pt-16 sm:pt-24"
          role="presentation"
        >
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
            onClick={close}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-[#ecb613]/40 bg-[#09090d]/95 shadow-[0_0_60px_rgba(236,182,19,0.15)] backdrop-blur-md"
          >
            <h2 id={dialogTitleId} className="sr-only">
              Buscador global EAR OS: catálogo, intención comercial, comandos de
              sistema y Oráculo neural
            </h2>

            {/* 1. BARRA DE ENTRADA */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-black/50 px-5 py-4">
              <Search className="h-5 w-5 shrink-0 text-[#ecb613]" aria-hidden="true" />
              <label htmlFor={`${baseId}-input`} className="sr-only">
                Buscar en EAR OS
              </label>
              <input
                id={`${baseId}-input`}
                ref={inputRef}
                type="text"
                role="combobox"
                aria-expanded={hasResults}
                aria-controls={listboxId}
                aria-activedescendant={activeDescendant}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Bodas, fincas, mariachis, DJ en Toledo, licitaciones B2G…"
                className="flex-1 bg-transparent text-base font-medium text-white placeholder-neutral-500 focus:outline-none sm:text-lg"
              />

              {query.length > 0 && (
                <button
                  type="button"
                  onClick={clearQuery}
                  aria-label="Borrar búsqueda"
                  className="rounded-lg p-1 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              )}

              <button
                type="button"
                onClick={close}
                aria-label="Cerrar buscador"
                className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-xs text-neutral-400 transition-colors hover:text-white"
              >
                ESC
              </button>
            </div>

            {/* 2. PILARES DEL CATÁLOGO */}
            <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/5 bg-black/30 px-4 py-2.5">
              {SEARCH_PILLARS.map((option) => {
                const isSelected = pillar === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPillar(option.id)}
                    aria-pressed={isSelected}
                    className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-300 ease-out ${
                      isSelected
                        ? 'bg-[#ecb613] font-bold text-black shadow-md shadow-[#ecb613]/20'
                        : 'border border-white/5 bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>


            {/* 3. RESULTADOS */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {oracle.showAnswer && oracle.answer && (
                <div className="rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/10 p-4">
                  <div className="mb-2 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-[#ecb613]">
                    <Bot className="h-4 w-4" aria-hidden="true" />
                    Oráculo EAR RAG · respuesta trazada
                  </div>
                  <p className="whitespace-pre-line text-xs leading-relaxed text-neutral-200">
                    {oracle.answer}
                  </p>
                </div>
              )}

              {oracle.hits.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-3">
                  <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/40">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                      Evidencia neuronal ({oracle.hits.length})
                    </span>
                    {oracle.degraded && <span className="text-[#FF2B44]">degradado</span>}
                  </div>
                  <ul className="space-y-1.5">
                    {oracle.hits.map((hit) => (
                      <li
                        key={hit.id}
                        className="rounded-xl border border-white/5 bg-black/40 p-2.5 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="truncate font-semibold text-white">{hit.title}</span>
                          <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[9px] text-emerald-400">
                            {hit.score.toFixed(2)}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 leading-relaxed text-white/60">
                          {hit.snippet}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {oracle.loading && (
                <div className="flex items-center justify-center gap-2 p-3 font-mono text-xs text-[#ecb613]">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Consultando el índice neuronal…
                </div>
              )}

              {hasResults ? (
                <div
                  id={listboxId}
                  role="listbox"
                  aria-label="Resultados de búsqueda"
                  className="space-y-2"
                >

                  {/* Intención comercial canónica (posición 0) */}
                  {intentRow && intentRow.row.kind === 'intent' && intentMatch && (
                    <div role="group" aria-label="Intención comercial recomendada">
                      <button
                        type="button"
                        id={optionId(intentRow.index)}
                        role="option"
                        aria-selected={selectedIndex === intentRow.index}
                        onMouseEnter={() => setSelectedIndex(intentRow.index)}
                        onClick={() => navigate(intentRow.row.href)}
                        className={`group w-full rounded-2xl border p-4 text-left transition-all duration-300 ease-out ${
                          selectedIndex === intentRow.index
                            ? 'border-[#ecb613] bg-gradient-to-r from-[#ecb613]/20 via-[#ecb613]/10 to-transparent shadow-[0_0_30px_rgba(236,182,19,0.2)]'
                            : 'border-[#ecb613]/30 bg-[#ecb613]/5 hover:border-[#ecb613]/60'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ecb613] px-2.5 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-black">
                              <Sparkles className="h-3 w-3" aria-hidden="true" />
                              Intención directa
                            </span>
                            <span className="font-mono text-xs text-[#ecb613]/80">
                              {intentMatch.category}
                            </span>
                          </div>
                          <span className="shrink-0 rounded-xl border border-[#ecb613]/40 bg-black px-3 py-1 font-mono text-xs font-black text-[#ecb613]">
                            {intentMatch.priceFormatted}
                          </span>
                        </div>
                        <h3 className="flex items-center justify-between font-syne text-base font-black text-white transition-colors group-hover:text-[#ecb613]">
                          <span>
                            {intentMatch.recommendedProvider} — {intentMatch.recommendedService}
                          </span>
                          <ArrowRight
                            className="h-4 w-4 shrink-0 text-[#ecb613] transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-zinc-300">
                          {intentMatch.highlightText}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-white/10 pt-2 font-mono text-[11px] text-zinc-400">
                          <span>📞 {intentMatch.canonicalPhone}</span>
                          <span>🔒 Depósito Stripe 100 €</span>
                          <span className="text-[#ecb613]">Recomendación canónica</span>
                        </div>
                      </button>
                    </div>
                  )}
                  {/* 🎼 Género / formato de cola larga (taxonomía facetada, Bloque 2) */}
                  {taxonomyRow && taxonomyMatch.facet !== null && (
                    <div role="group" aria-label="Género musical resuelto">
                      <button
                        type="button"
                        id={optionId(taxonomyRow.index)}
                        role="option"
                        aria-selected={selectedIndex === taxonomyRow.index}
                        onMouseEnter={() => setSelectedIndex(taxonomyRow.index)}
                        onClick={() => navigate(taxonomyRow.row.href)}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3.5 text-left transition-all duration-300 ease-out ${
                          selectedIndex === taxonomyRow.index
                            ? 'border-[#00E5FF]/70 bg-[#00E5FF]/10'
                            : 'border-[#00E5FF]/25 bg-[#00E5FF]/[0.03] hover:border-[#00E5FF]/50'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#00E5FF]/30 bg-black/60">
                            <Music className="h-4 w-4 text-[#00E5FF]" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block font-mono text-[10px] uppercase tracking-wider text-[#00E5FF]">
                              {taxonomyMatch.family?.label ?? 'Género'} · formato resuelto
                            </span>
                            <span className="block truncate text-sm font-bold text-white">
                              {taxonomyMatch.label}
                            </span>
                            <span className="block truncate text-xs text-neutral-400">
                              {taxonomyMatch.facet.formats.join(' · ')}
                            </span>
                          </span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 text-[#00E5FF]" aria-hidden="true" />
                      </button>
                    </div>
                  )}

                  {/* 🗄️ Proveedores VIVOS de PostgreSQL (autocompletado real, Bloque 1) */}
                  {(providerRows.length > 0 || liveProviders.loading || liveProviders.degraded) && (
                    <div role="group" aria-label="Proveedores vivos en base de datos">
                      <div
                        aria-hidden="true"
                        className="flex items-center justify-between px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/40"
                      >
                        <span>Proveedores en base de datos ({providerRows.length})</span>
                        {liveProviders.loading && <span className="text-[#ecb613]">consultando…</span>}
                        {liveProviders.degraded && !liveProviders.loading && (
                          <span className="text-[#FF2B44]">BD no alcanzable</span>
                        )}
                      </div>
                      {providerRows.map(({ row, index }) =>
                        row.kind === 'provider' ? (
                          <button
                            key={row.key}
                            type="button"
                            id={optionId(index)}
                            role="option"
                            aria-selected={selectedIndex === index}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => navigate(row.href)}
                            className={`mb-1.5 flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ease-out ${
                              selectedIndex === index
                                ? 'border-emerald-400/60 bg-emerald-400/10'
                                : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <span className="flex min-w-0 items-center gap-3">
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/60">
                                <Building2 className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-bold text-white">{row.provider.name}</span>
                                <span className="block truncate font-mono text-[11px] text-neutral-400">
                                  {row.provider.category}
                                </span>
                              </span>
                            </span>
                            <ArrowRight className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                          </button>
                        ) : null
                      )}
                    </div>
                  )}



                  {/* Catálogo global rankeado */}
                  {catalogRows.length > 0 && (
                    <div role="group" aria-label="Catálogo EAR OS">
                      <div
                        aria-hidden="true"
                        className="px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/40"
                      >
                        Catálogo EAR OS ({catalogRows.length})
                      </div>
                      {catalogRows.map(({ row, index }) =>
                        row.kind === 'catalog' ? (
                          <button
                            key={row.key}
                            type="button"
                            id={optionId(index)}
                            role="option"
                            aria-selected={selectedIndex === index}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => navigate(row.href)}
                            className={`mb-1.5 flex w-full items-center justify-between gap-4 rounded-2xl border p-3.5 text-left transition-all duration-300 ease-out ${
                              selectedIndex === index
                                ? 'border-[#ecb613]/60 bg-gradient-to-r from-white/[0.08] to-white/[0.03] shadow-lg'
                                : 'border-white/5 bg-white/[0.02] hover:border-white/20'
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3.5">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black">
                                {row.hit.item.image ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={row.hit.item.image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  renderCategoryIcon(row.hit.item.category)
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className="mb-0.5 flex items-center gap-2">
                                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#ecb613]">
                                    {row.hit.item.categoryLabel}
                                  </span>
                                  {row.hit.item.badge && (
                                    <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-neutral-300">
                                      {row.hit.item.badge}
                                    </span>
                                  )}
                                </div>
                                <h4 className="truncate text-sm font-bold text-white">
                                  {row.hit.item.title}
                                </h4>
                                <p className="max-w-lg truncate text-xs text-neutral-400">
                                  {row.hit.item.subtitle}
                                </p>
                              </div>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              {row.hit.item.price && (
                                <span className="rounded-lg border border-white/10 bg-black/60 px-2.5 py-1 font-mono text-xs font-bold text-[#ecb613]">
                                  {row.hit.item.price}
                                </span>
                              )}
                              <div
                                className={`rounded-lg p-1.5 transition-colors ${
                                  selectedIndex === index
                                    ? 'bg-[#ecb613] text-black'
                                    : 'text-neutral-500'
                                }`}
                              >
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                              </div>
                            </div>
                          </button>
                        ) : null
                      )}
                    </div>
                  )}


                  {/* Puente al directorio: la paleta global y el filtro del
                      directorio comparten el mismo parámetro `q` (buscador único). */}
                  {query.trim().length >= 2 && (
                    <button
                      type="button"
                      onClick={() => navigate(`/proveedores?q=${encodeURIComponent(query.trim())}`)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#258DCD]/30 bg-[#258DCD]/5 p-3 text-left transition-all duration-300 ease-out hover:border-[#258DCD]/70 hover:bg-[#258DCD]/10"
                    >
                      <span className="flex min-w-0 items-center gap-2 text-xs font-semibold text-white">
                        <Building2 className="h-4 w-4 shrink-0 text-[#258DCD]" aria-hidden="true" />
                        <span className="truncate">
                          Ver «{query.trim()}» en el directorio de proveedores
                        </span>
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#258DCD]" aria-hidden="true" />
                    </button>
                  )}

                  {/* Comandos de sistema agrupados */}
                  {commandGroups.map((entry) => (
                    <div key={entry.group} role="group" aria-label={GROUP_LABEL[entry.group]}>
                      <div
                        aria-hidden="true"
                        className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/40"
                      >
                        <Terminal className="h-3 w-3" aria-hidden="true" />
                        {GROUP_LABEL[entry.group]} ({entry.items.length})
                      </div>
                      {entry.items.map(({ row, index }) =>
                        row.kind === 'command' ? (
                          <button
                            key={row.key}
                            type="button"
                            id={optionId(index)}
                            role="option"
                            aria-selected={selectedIndex === index}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => navigate(row.href)}
                            className={`mb-1.5 flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-all duration-300 ease-out ${
                              selectedIndex === index
                                ? 'border-[#ecb613]/40 bg-[#ecb613]/10'
                                : 'border-white/5 bg-white/5 hover:border-[#ecb613]/40'
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/60">
                                <ArrowRight
                                  className="h-3.5 w-3.5 text-[#ecb613]"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate font-syne text-xs font-bold text-white sm:text-sm">
                                  {row.command.title}
                                </div>
                                <div className="truncate font-mono text-[11px] text-white/50">
                                  {row.command.subtitle}
                                </div>
                              </div>
                            </div>
                            {row.command.badge && (
                              <span className="shrink-0 rounded-full border border-[#ecb613]/20 bg-[#ecb613]/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[#ecb613]">
                                {row.command.badge}
                              </span>
                            )}
                          </button>
                        ) : null
                      )}
                    </div>
                  ))}
                </div>

              ) : (
                <div className="px-4 py-10 text-center">
                  <p className="mb-4 text-sm text-neutral-400">
                    Sin coincidencias directas para{' '}
                    <span className="font-semibold text-white">{query}</span>.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {oracle.answer && (
                      <button
                        type="button"
                        onClick={revealOracleAnswer}
                        className="flex items-center gap-2 rounded-xl bg-[#ecb613] px-5 py-2.5 text-xs font-bold text-black shadow-lg shadow-[#ecb613]/20 transition-all hover:brightness-110"
                      >
                        <Bot className="h-4 w-4" aria-hidden="true" />
                        Ver respuesta del Oráculo
                      </button>
                    )}
                    <a
                      href={`${CENTRALITA.whatsapp}?text=${encodeURIComponent(
                        `Hola, necesito ayuda con: ${query}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-white/15"
                    >
                      <PhoneCall className="h-4 w-4 text-[#ecb613]" aria-hidden="true" />
                      Concierge {CENTRALITA.display}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* 4. PIE CON ATAJOS Y ORÁCULO */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-black/60 px-5 py-3 font-mono text-[11px] text-neutral-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white">
                    ↑↓
                  </kbd>
                  Navegar
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white">
                    ↵
                  </kbd>
                  Abrir
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white">
                    ⌘K
                  </kbd>
                  Buscador
                </span>
              </div>

              {query.trim().length >= ORACULO_MIN_CHARS && (
                <button
                  type="button"
                  onClick={revealOracleAnswer}
                  disabled={oracle.loading || !oracle.answer}
                  className="flex items-center gap-1 font-semibold text-[#ecb613] transition-colors hover:underline disabled:opacity-40"
                >
                  {oracle.loading ? (
                    <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
                  ) : (
                    <Bot className="h-3 w-3" aria-hidden="true" />
                  )}
                  Preguntar al Oráculo
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UnifiedSearch;

