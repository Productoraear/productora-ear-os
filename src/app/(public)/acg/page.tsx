import type { Metadata } from 'next';
import DecisionBelt from '@/components/acg/DecisionBelt';
import {
  getFincaBySlug,
  buildAcgGraph,
  buildTerritorialInterlinks,
} from '@/lib/acg/acgSemanticGraph';
import { ACG_ARTIST_OFFERS, DECISION_STEPS } from '@/lib/acg/acgDecisionEngine';

const SITE_URL = 'https://ear-os.com';
const CANONICAL_PATH = '/acg';
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

const PAGE_TITLE =
  'Autonomous Commerce Grid · Reserva Directa en 60 segundos | EAR OS';
const PAGE_DESCRIPTION =
  'Cinta de Decisión S-Class: Ruta Uber desde Méntrida, Match Tinder con audio en caliente, Reserva Airbnb con Price-Lock 100 € y Plan Bodas.net con acústica legal. Split Soberano 80/10/10.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: CANONICAL_PATH,
  },
  openGraph: {
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'EAR OS',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

interface DoctrineCard {
  readonly id: string;
  readonly label: string;
  readonly accent: string;
  readonly metric: string;
  readonly detail: string;
}

const DOCTRINE_CARDS: readonly DoctrineCard[] = [
  {
    id: 'split-soberano',
    label: 'Split Soberano',
    accent: '#ecb613',
    metric: '80 / 10 / 10',
    detail:
      '80% Artista · 10% EAR OS · 10% VIMUME. Inmutable en cada liquidación firmada.',
  },
  {
    id: 'price-lock',
    label: 'Price-Lock',
    accent: '#00E5FF',
    metric: '100 € · SHA-256',
    detail:
      'Firma criptográfica válida 24-72h. Depósito 100% reembolsable si no encaja la fecha.',
  },
  {
    id: 'acustica-legal',
    label: 'Acústica Legal',
    accent: '#10B981',
    metric: '< 75 dB · 12 W/pax',
    detail:
      'Rider Bose F1 812 / S1 Pro, Shure Beta 87A. Límite B2G Art. 118 LCSP.',
  },
] as const;

const TERRITORIES: readonly string[] = ['Toledo', 'Madrid', 'Guadalajara'] as const;

interface SmokeTestRoute {
  readonly method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  readonly path: string;
  readonly expected: readonly number[];
  readonly critical: boolean;
}

const SMOKE_TEST_ROUTES: readonly SmokeTestRoute[] = [
  { method: 'GET', path: '/api/acg/graph', expected: [200], critical: true },
  { method: 'GET', path: '/api/acg/offers', expected: [200], critical: true },
  { method: 'GET', path: '/api/acg/decision-steps', expected: [200], critical: true },
  { method: 'GET', path: '/api/acg/interlinks', expected: [200], critical: true },
  { method: 'GET', path: '/api/fincas', expected: [200], critical: true },
  { method: 'GET', path: '/api/fincas/finca-valduerna', expected: [200, 404], critical: true },
  { method: 'GET', path: '/api/artists', expected: [200], critical: true },
  { method: 'GET', path: '/api/artists/offers', expected: [200], critical: true },
  { method: 'GET', path: '/api/bookings', expected: [200], critical: true },
  { method: 'POST', path: '/api/bookings', expected: [201, 400], critical: true },
  { method: 'GET', path: '/api/bookings/price-lock', expected: [200], critical: true },
  { method: 'POST', path: '/api/bookings/price-lock', expected: [201, 400], critical: true },
  { method: 'GET', path: '/api/territories', expected: [200], critical: true },
  { method: 'GET', path: '/api/territories/toledo', expected: [200, 404], critical: true },
  { method: 'GET', path: '/api/territories/madrid', expected: [200, 404], critical: true },
  { method: 'GET', path: '/api/territories/guadalajara', expected: [200, 404], critical: true },
  { method: 'GET', path: '/api/split/soberano', expected: [200], critical: true },
  { method: 'POST', path: '/api/split/soberano', expected: [201, 400], critical: true },
  { method: 'GET', path: '/api/health', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/db', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/redis', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/stripe', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/resend', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/openai', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/supabase', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/cloudflare', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/vercel', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/neon', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/upstash', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/r2', expected: [200, 503], critical: true },
  { method: 'GET', path: '/api/health/doctrine', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/split', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/price-lock', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/acustica', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/b2g', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/lcsp', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/art118', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/sha256', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/jwt', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/csrf', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/ratelimit', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/cors', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/csp', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/hsts', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/xframe', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/xcontent', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/referrer', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/permissions', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/coop', expected: [200], critical: true },
  { method: 'GET', path: '/api/health/coep', expected: [200], critical: true },
] as const;

export default function AcgPage() {
  // Finca de referencia real para el grafo semántico (hub conceptual del ACG).
  const hubFinca = getFincaBySlug('finca-valduerna');
  const heroOffer = ACG_ARTIST_OFFERS[0];
  const graph = buildAcgGraph(hubFinca, heroOffer);

  // Interlinks territoriales canónicos (Toledo/Madrid/Guadalajara → 52 provincias vía SSOT).
  const interlinks = TERRITORIES.flatMap((province) =>
    buildTerritorialInterlinks(province),
  );

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  const criticalRoutes = SMOKE_TEST_ROUTES.filter((route) => route.critical);
  const totalRoutes = SMOKE_TEST_ROUTES.length;

  return (
    <main className="min-h-screen bg-[#030305] text-[#f5f1e8] pt-28 pb-24 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        <DecisionBelt />

        {/* Grafo de interlinking tridimensional visible */}
        <section className="mt-16 pt-10 border-t border-white/10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 mb-5">
            Grafo Semántico Transaccional · Geografía × Gremio × Formato
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DECISION_STEPS.map((step) => (
              <div
                key={step.id}
                className="rounded-2xl bg-[#050507] border border-white/10 p-5"
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-widest"
                  style={{ color: step.accent }}
                >
                  {step.nickname} Layer · {step.label}
                </span>
                <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
                  {step.hint}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {interlinks.map((link) => (
              <a
                key={`${link.anchor}-${link.href}`}
                href={link.href}
                className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/10 text-white/60 hover:text-white hover:bg-white/[0.06] font-mono text-[10px] transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>

        {/* Blindaje doctrinal — datos reales, cero copy vacío */}
        <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {DOCTRINE_CARDS.map((card) => (
            <div
              key={card.id}
              className="rounded-2xl bg-[#050507] border border-white/10 p-5"
            >
              <p
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: card.accent }}
              >
                {card.label}
              </p>
              <p
                className="font-mono text-lg mt-2 tracking-tight"
                style={{ color: card.accent }}
              >
                {card.metric}
              </p>
              <p className="font-body text-sm text-white/60 mt-2 leading-relaxed">
                {card.detail}
              </p>
            </div>
          ))}
        </section>

        {/* Smoke Tests S-Class · 50 API routes críticas (curl + status 200/201/400) */}
        <section className="mt-10 pt-10 border-t border-white/10">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
              Smoke Tests S-Class · {totalRoutes} API Routes Críticas
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-[#10B981]">
              {criticalRoutes.length} / {totalRoutes} critical · curl + status 200/201/400
            </p>
          </div>

          <div className="rounded-2xl bg-[#050507] border border-white/10 overflow-hidden">
            <div className="grid grid-cols-[80px_1fr_140px] gap-3 px-5 py-3 border-b border-white/10 bg-white/[0.02]">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Method
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Path
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40 text-right">
                Expected
              </span>
            </div>
            <ul className="divide-y divide-white/5">
              {SMOKE_TEST_ROUTES.map((route) => (
                <li
                  key={`${route.method}-${route.path}`}
                  className="grid grid-cols-[80px_1fr_140px] gap-3 px-5 py-2.5 items-center hover:bg-white/[0.02] transition-colors"
                >
                  <span
                    className="font-mono text-[10px] uppercase tracking-widest"
                    style={{
                      color:
                        route.method === 'GET'
                          ? '#00E5FF'
                          : route.method === 'POST'
                            ? '#ecb613'
                            : route.method === 'PUT'
                              ? '#10B981'
                              : '#EF4444',
                    }}
                  >
                    {route.method}
                  </span>
                  <code className="font-mono text-xs text-white/70 truncate">
                    {route.path}
                  </code>
                  <span className="font-mono text-[10px] text-white/50 text-right tracking-wider">
                    {route.expected.join(' / ')}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="font-mono text-[10px] text-white/30 mt-4 leading-relaxed">
            Ejecución: <code className="text-white/50">curl -s -o /dev/null -w &quot;%&#123;http_code&#125;&quot; $BASE_URL$PATH</code> · Assert status ∈ expected. Fallo en cualquier route critical → bloqueo de deploy.
          </p>
        </section>
      </div>
    </main>
  );
}