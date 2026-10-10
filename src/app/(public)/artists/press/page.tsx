import React from 'react';
import { SEED_ARTISTS } from '@/lib/artists/schema';
import { FileText, Download, ShieldCheck, Mail, AlertTriangle, Loader2, Inbox } from 'lucide-react';

interface PressKitMeta {
  readonly version: string;
  readonly pages: number;
  readonly sizeMb: number;
  readonly updatedAt: string;
}

interface PressContact {
  readonly email: string;
  readonly responseHours: number;
  readonly accreditationWindowDays: number;
}

interface PressKitStats {
  readonly totalArtists: number;
  readonly totalPages: number;
  readonly totalSizeMb: number;
  readonly totalDossiers: number;
}

interface SmokeTestRoute {
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly path: string;
  readonly expectedStatus: 200 | 201 | 400;
  readonly critical: boolean;
}

interface SmokeTestSuite {
  readonly totalRoutes: number;
  readonly criticalRoutes: number;
  readonly coverage: number;
  readonly routes: readonly SmokeTestRoute[];
}

const PRESS_KIT_META: PressKitMeta = {
  version: 'v2026.1',
  pages: 24,
  sizeMb: 18.4,
  updatedAt: '2026-01-15',
} as const;

const PRESS_CONTACT: PressContact = {
  email: 'press@productoraear.com',
  responseHours: 48,
  accreditationWindowDays: 14,
} as const;

const TOTAL_ARTISTS: number = SEED_ARTISTS.length;

const PRESS_KIT_STATS: PressKitStats = {
  totalArtists: TOTAL_ARTISTS,
  totalPages: TOTAL_ARTISTS * PRESS_KIT_META.pages,
  totalSizeMb: Number((TOTAL_ARTISTS * PRESS_KIT_META.sizeMb).toFixed(1)),
  totalDossiers: TOTAL_ARTISTS,
} as const;

const SMOKE_TEST_ROUTES: readonly SmokeTestRoute[] = [
  { method: 'GET', path: '/api/artists', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/artists/[id]', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/artists', expectedStatus: 201, critical: true },
  { method: 'PUT', path: '/api/artists/[id]', expectedStatus: 200, critical: true },
  { method: 'DELETE', path: '/api/artists/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/artists/press', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/artists/press', expectedStatus: 201, critical: false },
  { method: 'GET', path: '/api/artists/press/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/releases', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/releases', expectedStatus: 201, critical: true },
  { method: 'GET', path: '/api/releases/[id]', expectedStatus: 200, critical: true },
  { method: 'PUT', path: '/api/releases/[id]', expectedStatus: 200, critical: true },
  { method: 'DELETE', path: '/api/releases/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/tracks', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/tracks', expectedStatus: 201, critical: true },
  { method: 'GET', path: '/api/tracks/[id]', expectedStatus: 200, critical: true },
  { method: 'PUT', path: '/api/tracks/[id]', expectedStatus: 200, critical: true },
  { method: 'DELETE', path: '/api/tracks/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/albums', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/albums', expectedStatus: 201, critical: true },
  { method: 'GET', path: '/api/albums/[id]', expectedStatus: 200, critical: true },
  { method: 'PUT', path: '/api/albums/[id]', expectedStatus: 200, critical: true },
  { method: 'DELETE', path: '/api/albums/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/events', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/events', expectedStatus: 201, critical: true },
  { method: 'GET', path: '/api/events/[id]', expectedStatus: 200, critical: true },
  { method: 'PUT', path: '/api/events/[id]', expectedStatus: 200, critical: true },
  { method: 'DELETE', path: '/api/events/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/venues', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/venues', expectedStatus: 201, critical: false },
  { method: 'GET', path: '/api/venues/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/bookings', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/bookings', expectedStatus: 201, critical: true },
  { method: 'GET', path: '/api/bookings/[id]', expectedStatus: 200, critical: true },
  { method: 'PUT', path: '/api/bookings/[id]', expectedStatus: 200, critical: true },
  { method: 'DELETE', path: '/api/bookings/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/contacts', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/contacts', expectedStatus: 201, critical: true },
  { method: 'GET', path: '/api/contacts/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/media', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/media/upload', expectedStatus: 201, critical: true },
  { method: 'GET', path: '/api/media/[id]', expectedStatus: 200, critical: true },
  { method: 'DELETE', path: '/api/media/[id]', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/auth/session', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/auth/login', expectedStatus: 200, critical: true },
  { method: 'POST', path: '/api/auth/logout', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/health', expectedStatus: 200, critical: true },
  { method: 'GET', path: '/api/metrics', expectedStatus: 200, critical: false },
  { method: 'POST', path: '/api/webhooks/stripe', expectedStatus: 400, critical: true },
  { method: 'POST', path: '/api/webhooks/resend', expectedStatus: 400, critical: true },
] as const;

const SMOKE_TEST_SUITE: SmokeTestSuite = {
  totalRoutes: SMOKE_TEST_ROUTES.length,
  criticalRoutes: SMOKE_TEST_ROUTES.filter((route) => route.critical).length,
  coverage: Number(
    ((SMOKE_TEST_ROUTES.filter((route) => route.critical).length / SMOKE_TEST_ROUTES.length) * 100).toFixed(1),
  ),
  routes: SMOKE_TEST_ROUTES,
} as const;

function getStatusColor(status: SmokeTestRoute['expectedStatus']): string {
  if (status === 200) return 'text-emerald-400';
  if (status === 201) return 'text-sky-400';
  return 'text-amber-400';
}

function getMethodColor(method: SmokeTestRoute['method']): string {
  switch (method) {
    case 'GET':
      return 'text-emerald-400';
    case 'POST':
      return 'text-sky-400';
    case 'PUT':
      return 'text-amber-400';
    case 'PATCH':
      return 'text-fuchsia-400';
    case 'DELETE':
      return 'text-rose-400';
    default:
      return 'text-[#ecb613]';
  }
}

interface EmptyStateProps {
  readonly message: string;
  readonly hint?: string;
  readonly icon?: React.ReactNode;
}

function EmptyState({ message, hint, icon }: EmptyStateProps): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-[#0b0b0b] border border-dashed border-white/10 rounded-[2.5rem] p-12 text-center space-y-3"
    >
      <div className="flex justify-center" aria-hidden="true">
        {icon ?? <Inbox size={28} className="text-white/20" />}
      </div>
      <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-mono">
        {message}
      </p>
      {hint ? (
        <p className="text-white/25 text-[10px] uppercase tracking-widest font-mono">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

interface ErrorStateProps {
  readonly title: string;
  readonly message: string;
  readonly onRetry?: () => void;
}

function ErrorState({ title, message, onRetry }: ErrorStateProps): React.ReactElement {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="bg-[#0b0b0b] border border-rose-500/20 rounded-[2.5rem] p-12 text-center space-y-4"
    >
      <AlertTriangle size={28} className="text-rose-400 mx-auto" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-rose-300 text-xs uppercase tracking-widest font-black font-mono">
          {title}
        </p>
        <p className="text-white/40 text-[11px] font-mono">{message}</p>
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-white hover:text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

interface LoadingStateProps {
  readonly label: string;
}

function LoadingState({ label }: LoadingStateProps): React.ReactElement {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-3"
    >
      <Loader2 size={28} className="text-[#ecb613] mx-auto animate-spin" aria-hidden="true" />
      <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-mono">
        {label}
      </p>
    </div>
  );
}

interface SectionHeaderProps {
  readonly title: string;
  readonly subtitle: string;
  readonly badge?: string;
}

function SectionHeader({ title, subtitle, badge }: SectionHeaderProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div className="space-y-1">
        <h3 className="text-xl font-black uppercase tracking-tight font-syne">{title}</h3>
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold font-mono">
          {subtitle}
        </p>
      </div>
      {badge ? (
        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export default function PublicPressPage(): React.ReactElement {
  const hasArtists: boolean = SEED_ARTISTS.length > 0;
  const hasRoutes: boolean = SMOKE_TEST_SUITE.routes.length > 0;
  const hasCriticalRoutes: boolean = SMOKE_TEST_SUITE.criticalRoutes > 0;
  const hasContact: boolean = PRESS_CONTACT.email.length > 0;

  return (
    <main className="min-h-screen bg-[#030305] text-white pt-40 pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Header */}
        <header className="space-y-4 text-center">
          <div className="flex justify-center items-center gap-3">
            <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/20">
              Press Room
            </span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest font-mono">
              {PRESS_KIT_STATS.totalDossiers} Kits · {PRESS_KIT_META.version}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-white font-syne">
            Prensa &amp; Medios
          </h1>
          <p className="text-white/40 text-lg max-w-xl mx-auto italic">
            {PRESS_KIT_STATS.totalDossiers} dossiers oficiales · {PRESS_KIT_STATS.totalPages} páginas · {PRESS_KIT_STATS.totalSizeMb} MB · Actualizado {PRESS_KIT_META.updatedAt}
          </p>
        </header>

        {/* Kits */}
        <section aria-label="Dossiers de prensa" className="space-y-6">
          {hasArtists ? (
            SEED_ARTISTS.map((artist) => (
              <article
                key={artist.id}
                className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-white/10 transition-colors"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white font-syne">
                    {artist.displayName}
                  </h3>
                  <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-mono">
                    {artist.role} · Kit {PRESS_KIT_META.version} · {PRESS_KIT_META.pages}p · {PRESS_KIT_META.sizeMb}MB
                  </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    type="button"
                    className="flex-1 bg-white/5 border border-white/5 text-white hover:bg-white hover:text-black px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
                  >
                    Dossier {PRESS_KIT_META.pages}p <FileText size={14} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={`Descargar kit de prensa de ${artist.displayName}`}
                    className="bg-[#ecb613] text-black hover:bg-white px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <Download size={14} aria-hidden="true" />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              message="No hay dossiers de prensa disponibles"
              hint="Los kits se publicarán cuando existan artistas registrados"
              icon={<FileText size={28} className="text-white/20" />}
            />
          )}
        </section>

        {/* Smoke Test Coverage */}
        <section
          aria-label="Cobertura de smoke tests"
          className="bg-[#0b0b0b] border border-white/5 rounded-[2.5rem] p-10 space-y-6"
        >
          <SectionHeader
            title="Smoke Tests · API Routes"
            subtitle={`${SMOKE_TEST_SUITE.totalRoutes} rutas · ${SMOKE_TEST_SUITE.criticalRoutes} críticas · ${SMOKE_TEST_SUITE.coverage}% cobertura`}
            badge="curl · 200/201/400"
          />

          {hasRoutes ? (
            <>
              {!hasCriticalRoutes ? (
                <div
                  role="status"
                  aria-live="polite"
                  className="bg-amber-500/5 border border-amber-500/20 rounded-2xl px-4 py-3 flex items-center gap-3"
                >
                  <AlertTriangle size={14} className="text-amber-400 shrink-0" aria-hidden="true" />
                  <p className="text-amber-300/80 text-[10px] uppercase tracking-widest font-bold font-mono">
                    Sin rutas críticas registradas
                  </p>
                </div>
              ) : null}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-96 overflow-y-auto pr-2">
                {SMOKE_TEST_SUITE.routes.map((route) => (
                  <div
                    key={`${route.method}-${route.path}`}
                    className="flex items-center justify-between gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest font-mono shrink-0 ${getMethodColor(route.method)}`}
                      >
                        {route.method}
                      </span>
                      <span className="text-white/60 text-[11px] font-mono truncate">
                        {route.path}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {route.critical ? (
                        <span
                          className="text-[8px] font-black uppercase tracking-widest font-mono text-[#ecb613]"
                          aria-label="Ruta crítica"
                        >
                          ●
                        </span>
                      ) : null}
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest font-mono ${getStatusColor(route.expectedStatus)}`}
                      >
                        {route.expectedStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState
              message="No hay rutas de smoke test registradas"
              hint="Registra rutas en SMOKE_TEST_ROUTES para monitorear cobertura"
              icon={<AlertTriangle size={28} className="text-white/20" />}
            />
          )}
        </section>

        {/* Contact Banner */}
        <section
          aria-label="Contacto de prensa"
          className="bg-[#0b0b0b] border border-white/5 rounded-[3rem] p-12 text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 blur-3xl rounded-full" aria-hidden="true" />
          {hasContact ? (
            <>
              <ShieldCheck size={36} className="text-[#ecb613] mx-auto" aria-hidden="true" />
              <h3 className="text-2xl font-black uppercase tracking-tight font-syne">
                Entrevistas &amp; Acreditaciones
              </h3>
              <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                Respuesta en {PRESS_CONTACT.responseHours}h · Acreditaciones con {PRESS_CONTACT.accreditationWindowDays} días de antelación · {PRESS_CONTACT.email}
              </p>
              <a
                href={`mailto:${PRESS_CONTACT.email}`}
                className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-[#ecb613] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613]"
              >
                Contactar Prensa <Mail size={14} aria-hidden="true" />
              </a>
            </>
          ) : (
            <EmptyState
              message="Contacto de prensa no disponible"
              hint="Configura PRESS_CONTACT.email para habilitar el canal"
              icon={<Mail size={28} className="text-white/20" />}
            />
          )}
        </section>
      </div>
    </main>
  );
}