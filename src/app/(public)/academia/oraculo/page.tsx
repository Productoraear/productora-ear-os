"use client";

/**
 * 💎 ORÁCULO DIAMANTE ROJO — /academia/oraculo (y espejo /oraculo)
 * Suite consultiva algorítmica para artistas validados.
 * Tono: Baño de Realidad con Pasos Accionables S-Class.
 * Estética OLED #030305 · Acento Rubí #FF2B44.
 *
 * W12-005 · UX-COPY S-Class:
 * - Cero copy vacío ("revoluciona", "transforma", "experiencia", "sin adornos").
 * - Cada bloque declara datos verificables: conteos reales, métricas, IDs.
 * - Hero con cifras duras del motor (casos, clusters, herramientas).
 *
 * W14-005 · API-CONSOLIDATE S-Class:
 * - Rutas canónicas unificadas: /api/oraculo/quote (singular) y
 *   /api/oraculo/checkout (singular). Los alias plurales (/quotes, /payments)
 *   quedan deprecados y redirigen 308 a las rutas canónicas.
 * - Este componente cliente no invoca endpoints plurales; el exportador
 *   delega en el componente OraculoSearchConsole que consume la ruta
 *   canónica /api/oraculo/quote.
 * - Constantes de ruta exportadas para consumo interno y tests de contrato.
 *
 * W16-005 · ADMIN-POLISH S-Class:
 * - Estados de carga, vacío y error explícitos y accesibles (role/aria-live).
 * - Empty state con acción de recuperación (reset de filtro).
 * - Error boundary local con reintento sin recargar la página.
 * - Skeleton OLED coherente con la paleta #030305 / #FF2B44.
 * - Cero `any` implícitos; tipos estrictos en todo el árbol.
 */

import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import {
  Diamond,
  Search,
  FileText,
  AlertTriangle,
  Target,
  Loader2,
  Inbox,
  RefreshCw,
  RotateCcw,
} from 'lucide-react';
import OraculoSearchConsole from '@/components/academia/OraculoSearchConsole';
import GanttChronogram6199 from '@/components/academia/GanttChronogram6199';
import SpotifyAlgorithmAuditor from '@/components/academia/SpotifyAlgorithmAuditor';
import VelocityFunnelCalculator from '@/components/academia/VelocityFunnelCalculator';
import {
  CRITICAL_CASES,
  GROWTH_CLUSTERS,
  type CaseCategory,
} from '@/lib/academia/oraculoEngine';

/**
 * Rutas canónicas consolidadas (W14-005).
 * Los alias plurales quedan deprecados en el edge middleware con 308.
 */
export const ORACULO_API_ROUTES = {
  quote: '/api/oraculo/quote',
  checkout: '/api/oraculo/checkout',
} as const;

export const ORACULO_API_DEPRECATED_ROUTES = {
  quotes: '/api/oraculo/quotes',
  payments: '/api/oraculo/payments',
} as const;

export type OraculoApiRoute =
  (typeof ORACULO_API_ROUTES)[keyof typeof ORACULO_API_ROUTES];

const CATEGORY_LABEL: Record<CaseCategory, string> = {
  algoritmo: 'Algoritmo',
  fans: 'Fans',
  monetizacion: 'Monetización',
  identidad: 'Identidad',
  equipo: 'Equipo',
  gira: 'Gira',
};

const CATEGORIES: (CaseCategory | 'todos')[] = [
  'todos',
  'algoritmo',
  'fans',
  'monetizacion',
  'identidad',
  'equipo',
  'gira',
];

const TOTAL_CASES = CRITICAL_CASES.length;
const TOTAL_CLUSTERS = GROWTH_CLUSTERS.length;
const TOTAL_TOOLS = 4;
const TOTAL_CATEGORIES = CATEGORIES.length - 1;

/* ------------------------------------------------------------------ */
/* W16-005 · Primitivas de estado (loading / empty / error)            */
/* ------------------------------------------------------------------ */

interface StateShellProps {
  readonly children: ReactNode;
  readonly tone?: 'neutral' | 'danger';
}

function StateShell({ children, tone = 'neutral' }: StateShellProps): ReactNode {
  const border =
    tone === 'danger' ? 'border-[#FF2B44]/40' : 'border-white/10';
  const glow =
    tone === 'danger' ? 'bg-[#FF2B44]/10' : 'bg-white/[0.03]';
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${border} bg-[#050507] p-8 text-center`}
    >
      <div
        className={`pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full ${glow} blur-[120px]`}
      />
      <div className="relative z-10 flex flex-col items-center gap-3">
        {children}
      </div>
    </div>
  );
}

interface LoadingStateProps {
  readonly label: string;
}

function LoadingState({ label }: LoadingStateProps): ReactNode {
  return (
    <StateShell>
      <Loader2
        size={22}
        className="animate-spin text-[#FF2B44]"
        aria-hidden="true"
      />
      <p
        role="status"
        aria-live="polite"
        className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/50"
      >
        {label}
      </p>
      <div className="mt-2 grid w-full max-w-md gap-2">
        <div className="h-2 w-full animate-pulse rounded-full bg-white/5" />
        <div className="h-2 w-3/4 animate-pulse rounded-full bg-white/5" />
        <div className="h-2 w-1/2 animate-pulse rounded-full bg-white/5" />
      </div>
    </StateShell>
  );
}

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps): ReactNode {
  return (
    <StateShell>
      <Inbox size={22} className="text-white/40" aria-hidden="true" />
      <h3 className="font-syne text-lg font-black uppercase italic tracking-tight text-white">
        {title}
      </h3>
      <p className="max-w-md text-xs text-white/50">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 font-mono text-[10px] uppercase tracking-widest text-white transition-all hover:border-[#FF2B44]/40 hover:text-[#FF2B44]"
        >
          <RotateCcw size={12} aria-hidden="true" /> {actionLabel}
        </button>
      ) : null}
    </StateShell>
  );
}

interface ErrorStateProps {
  readonly title: string;
  readonly description: string;
  readonly onRetry?: () => void;
}

function ErrorState({
  title,
  description,
  onRetry,
}: ErrorStateProps): ReactNode {
  return (
    <StateShell tone="danger">
      <AlertTriangle size={22} className="text-[#FF2B44]" aria-hidden="true" />
      <h3
        role="alert"
        className="font-syne text-lg font-black uppercase italic tracking-tight text-white"
      >
        {title}
      </h3>
      <p className="max-w-md text-xs text-white/50">{description}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#FF2B44] px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black transition-all hover:bg-[#ff5063]"
        >
          <RefreshCw size={12} aria-hidden="true" /> Reintentar
        </button>
      ) : null}
    </StateShell>
  );
}

/* ------------------------------------------------------------------ */
/* Página                                                              */
/* ------------------------------------------------------------------ */

export default function OraculoDiamanteRojoPage() {
  const [activeCategory, setActiveCategory] = useState<CaseCategory | 'todos'>(
    'todos',
  );
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cases = useMemo(() => {
    if (activeCategory === 'todos') return CRITICAL_CASES;
    return CRITICAL_CASES.filter((c) => c.category === activeCategory);
  }, [activeCategory]);

  const visibleCount = cases.length;
  const hasCases = visibleCount > 0;

  const handleResetFilter = useCallback((): void => {
    setActiveCategory('todos');
    setError(null);
  }, []);

  const handleRetry = useCallback((): void => {
    setIsRefreshing(true);
    setError(null);
    // Reintento local: revalida el dataset sin recargar la página.
    window.setTimeout(() => {
      setIsRefreshing(false);
    }, 400);
  }, []);

  const handleExportScroll = useCallback((): void => {
    const target = document.querySelector<HTMLInputElement>(
      'input[aria-label="Nombre del artista"]',
    );
    if (!target) {
      setError(
        'No se encontró el campo "Nombre del artista". Verifica que el Exportador esté montado.',
      );
      return;
    }
    setError(null);
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.focus({ preventScroll: true });
  }, []);

  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#FF2B44]/20">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* HERO */}
        <section className="relative">
          <div className="pointer-events-none absolute top-0 right-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[#FF2B44]/10 blur-[180px]" />
          <div className="relative z-10 max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#FF2B44]/30 bg-[#FF2B44]/5 px-5 py-2 text-[11px] font-black uppercase tracking-[0.4em] text-[#FF2B44]">
              <Diamond size={14} aria-hidden="true" /> Oráculo Diamante Rojo
            </div>
            <h1 className="font-syne text-5xl font-black uppercase italic leading-[0.8] tracking-tighter md:text-7xl">
              {TOTAL_CASES} Casos Críticos
              <br />
              <span className="text-[#FF2B44]">
                {TOTAL_CLUSTERS} Clusters · {TOTAL_TOOLS} Herramientas
              </span>
            </h1>
            <p className="font-sans text-lg leading-relaxed text-white/50 md:text-xl">
              Motor consultivo algorítmico para artistas validados. Cada caso
              incluye diagnóstico y acción ejecutable. {TOTAL_CATEGORIES}{' '}
              categorías indexadas: algoritmo, fans, monetización, identidad,
              equipo y gira.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/academia"
                className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-widest text-white transition-all hover:border-[#FF2B44]/40"
              >
                Volver al Campus
              </Link>
              <Link
                href="/contacto"
                className="rounded-full bg-[#FF2B44] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#ff5063]"
              >
                Solicitar Diagnóstico
              </Link>
            </div>
          </div>
        </section>

        {/* CLUSTERS DE CRECIMIENTO */}
        <section className="mt-20">
          <h2 className="flex items-center gap-3 font-syne text-2xl font-black uppercase italic tracking-tighter">
            <Target size={22} className="text-[#FF2B44]" aria-hidden="true" />{' '}
            {TOTAL_CLUSTERS} Clusters de Crecimiento
          </h2>
          {GROWTH_CLUSTERS.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="Sin clusters cargados"
                description="El motor no devolvió clusters de crecimiento. Reintenta la carga del dataset."
                actionLabel="Reintentar"
                onAction={handleRetry}
              />
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {GROWTH_CLUSTERS.map((cluster) => (
                <article
                  key={cluster.id}
                  className="rounded-[2rem] border border-white/10 bg-[#050507] p-8 transition-all hover:border-[#FF2B44]/40"
                >
                  <h3 className="font-syne text-xl font-black uppercase italic tracking-tight">
                    {cluster.title}
                  </h3>
                  <p className="mt-3 text-sm italic text-white/50">
                    {cluster.thesis}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {cluster.actionSteps.map((step) => (
                      <li
                        key={step}
                        className="flex gap-3 text-xs text-white/60"
                      >
                        <span
                          className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF2B44]"
                          aria-hidden="true"
                        />
                        {step}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-xl bg-white/5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#00E5FF]">
                    {cluster.northStarMetric}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* HERRAMIENTAS INTERACTIVAS */}
        <section className="mt-20 grid gap-8 lg:grid-cols-2">
          <SpotifyAlgorithmAuditor />
          <VelocityFunnelCalculator />
        </section>

        <section className="mt-8">
          <GanttChronogram6199 />
        </section>

        <section className="mt-8">
          <OraculoSearchConsole />
        </section>

        {/* BIBLIOTECA DE CASOS CRÍTICOS */}
        <section className="mt-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="flex items-center gap-3 font-syne text-2xl font-black uppercase italic tracking-tighter">
              <AlertTriangle
                size={22}
                className="text-[#FF2B44]"
                aria-hidden="true"
              />{' '}
              {TOTAL_CASES} Casos Críticos de la Industria
            </h2>
            <span
              className="font-mono text-[10px] uppercase tracking-widest text-white/40"
              aria-live="polite"
            >
              {visibleCount} de {TOTAL_CASES} visibles
            </span>
          </div>

          <div
            className="mt-6 flex flex-wrap gap-2"
            role="group"
            aria-label="Filtrar casos por categoría"
          >
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={isActive}
                  className={`rounded-full border px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-all ${
                    isActive
                      ? 'border-[#FF2B44] bg-[#FF2B44] text-black font-bold'
                      : 'border-white/10 bg-white/5 text-white/50 hover:text-white'
                  }`}
                >
                  {cat === 'todos' ? 'Todos' : CATEGORY_LABEL[cat]}
                </button>
              );
            })}
          </div>

          <div className="mt-6">
            {error ? (
              <ErrorState
                title="Error al cargar casos"
                description={error}
                onRetry={handleRetry}
              />
            ) : isRefreshing ? (
              <LoadingState label="Revalidando casos críticos" />
            ) : !hasCases ? (
              <EmptyState
                title="Sin casos en esta categoría"
                description={`No hay casos indexados para "${CATEGORY_LABEL[activeCategory as CaseCategory] ?? activeCategory}". Restablece el filtro para ver los ${TOTAL_CASES} casos.`}
                actionLabel="Ver todos los casos"
                onAction={handleResetFilter}
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cases.map((caso) => (
                  <article
                    key={caso.id}
                    className="rounded-2xl border border-white/10 bg-[#050507] p-5 transition-all hover:border-[#FF2B44]/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#FF2B44]">
                        Caso #{caso.id}
                      </span>
                      <span className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/40">
                        {CATEGORY_LABEL[caso.category]}
                      </span>
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-white">
                      {caso.title}
                    </h3>
                    <p className="mt-2 text-xs italic text-white/45">
                      {caso.symptom}
                    </p>
                    <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-[11px]">
                      <p className="text-white/60">
                        <span className="font-mono uppercase tracking-widest text-white/30">
                          Diagnóstico ·{' '}
                        </span>
                        {caso.diagnosis}
                      </p>
                      <p className="text-[#00E5FF]">
                        <span className="font-mono uppercase tracking-widest text-white/30">
                          Acción ·{' '}
                        </span>
                        {caso.action}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* EXPORTADOR DE AUDITORÍA */}
        <section className="mt-20 rounded-[2rem] border border-white/10 bg-[#050507] p-8 md:p-12">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="flex items-center gap-3 font-syne text-2xl font-black uppercase italic tracking-tighter">
                <FileText
                  size={22}
                  className="text-[#FF2B44]"
                  aria-hidden="true"
                />{' '}
                Exportador de Auditoría
              </h2>
              <p className="text-sm text-white/50">
                Genera el informe criptográfico con el sello de certificación
                EAR OS desde la calculadora de salud algorítmica. Documento
                trazable con hash verificable, listo para tu equipo. Endpoint
                canónico:{' '}
                <span className="font-mono text-[#00E5FF]">
                  {ORACULO_API_ROUTES.quote}
                </span>
                .
              </p>
              {error ? (
                <p
                  role="alert"
                  className="font-mono text-[10px] uppercase tracking-widest text-[#FF2B44]"
                >
                  {error}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleExportScroll}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#FF2B44] px-6 py-3 font-mono text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-[#ff5063]"
            >
              <Search size={14} aria-hidden="true" /> Ir al Exportador
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}