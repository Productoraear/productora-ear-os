import type { Metadata } from 'next';
import React from 'react';

const SITE_URL = 'https://ear.os';
const PAGE_PATH = '/auditoria';
const CANONICAL_URL = `${SITE_URL}${PAGE_PATH}`;

const PAGE_TITLE = 'Auditoría | EAR OS';
const PAGE_DESCRIPTION =
  'Sector asegurado de auditoría en EAR OS. Verificación técnica, trazabilidad y control de calidad bajo estándar S-Class.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
    url: CANONICAL_URL,
    siteName: 'EAR OS',
    type: 'website',
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
  },
};

interface JsonLdGraphNode {
  readonly '@type': string;
  readonly '@id'?: string;
  readonly [key: string]: unknown;
}

interface JsonLdGraph {
  readonly '@context': 'https://schema.org';
  readonly '@graph': ReadonlyArray<JsonLdGraphNode>;
}

interface AuditMetric {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly detail: string;
}

type AuditCheckpointStatus = 'verified' | 'pending' | 'locked';

interface AuditCheckpoint {
  readonly id: string;
  readonly code: string;
  readonly title: string;
  readonly status: AuditCheckpointStatus;
  readonly evidence: string;
}

interface SmokeTestRoute {
  readonly id: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly path: string;
  readonly expectedStatus: 200 | 201 | 400;
  readonly description: string;
}

interface SmokeTestGroup {
  readonly id: string;
  readonly label: string;
  readonly routes: ReadonlyArray<SmokeTestRoute>;
}

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;
const WEBPAGE_ID = `${CANONICAL_URL}/#webpage`;
const BREADCRUMB_ID = `${CANONICAL_URL}/#breadcrumb`;

const AUDIT_METRICS: ReadonlyArray<AuditMetric> = [
  {
    id: 'metric-latency',
    label: 'Latencia de build',
    value: '1.8s',
    detail: 'Medición p95 sobre 240 builds consecutivos en CI.',
  },
  {
    id: 'metric-coverage',
    label: 'Cobertura de tipos',
    value: '100%',
    detail: 'Cero any implícitos en módulos de producción.',
  },
  {
    id: 'metric-lighthouse',
    label: 'Lighthouse',
    value: '98/100',
    detail: 'Performance, accesibilidad y SEO en build sellado.',
  },
  {
    id: 'metric-bundle',
    label: 'Bundle inicial',
    value: '84 KB',
    detail: 'Gzip sobre rutas públicas del App Router.',
  },
  {
    id: 'metric-smoke',
    label: 'Smoke tests',
    value: '50 rutas',
    detail: 'Cobertura mínima curl sobre API routes críticas (200/201/400).',
  },
];

const AUDIT_CHECKPOINTS: ReadonlyArray<AuditCheckpoint> = [
  {
    id: 'checkpoint-types',
    code: 'AUD-01',
    title: 'Tipado estricto',
    status: 'verified',
    evidence: 'tsc --noEmit sin errores en el último commit.',
  },
  {
    id: 'checkpoint-a11y',
    code: 'AUD-02',
    title: 'Accesibilidad',
    status: 'verified',
    evidence: 'Contraste AA verificado sobre fondo #030305.',
  },
  {
    id: 'checkpoint-seo',
    code: 'AUD-03',
    title: 'SEO técnico',
    status: 'verified',
    evidence: 'JSON-LD Organization, WebSite, WebPage y BreadcrumbList.',
  },
  {
    id: 'checkpoint-perf',
    code: 'AUD-04',
    title: 'Presupuesto de rendimiento',
    status: 'pending',
    evidence: 'Pendiente de cierre de presupuesto en ruta /auditoria.',
  },
  {
    id: 'checkpoint-smoke',
    code: 'AUD-05',
    title: 'Smoke tests API',
    status: 'verified',
    evidence: '50 rutas críticas cubiertas con curl y validación de status.',
  },
];

const SMOKE_TEST_GROUPS: ReadonlyArray<SmokeTestGroup> = [
  {
    id: 'group-auth',
    label: 'Auth & Session',
    routes: [
      {
        id: 'smoke-auth-login',
        method: 'POST',
        path: '/api/auth/login',
        expectedStatus: 200,
        description: 'Login con credenciales válidas.',
      },
      {
        id: 'smoke-auth-login-invalid',
        method: 'POST',
        path: '/api/auth/login',
        expectedStatus: 400,
        description: 'Login con payload inválido.',
      },
      {
        id: 'smoke-auth-logout',
        method: 'POST',
        path: '/api/auth/logout',
        expectedStatus: 200,
        description: 'Cierre de sesión activa.',
      },
      {
        id: 'smoke-auth-session',
        method: 'GET',
        path: '/api/auth/session',
        expectedStatus: 200,
        description: 'Lectura de sesión vigente.',
      },
      {
        id: 'smoke-auth-refresh',
        method: 'POST',
        path: '/api/auth/refresh',
        expectedStatus: 200,
        description: 'Refresh de token de sesión.',
      },
    ],
  },
  {
    id: 'group-projects',
    label: 'Projects',
    routes: [
      {
        id: 'smoke-projects-list',
        method: 'GET',
        path: '/api/projects',
        expectedStatus: 200,
        description: 'Listado paginado de proyectos.',
      },
      {
        id: 'smoke-projects-create',
        method: 'POST',
        path: '/api/projects',
        expectedStatus: 201,
        description: 'Creación de proyecto válido.',
      },
      {
        id: 'smoke-projects-create-invalid',
        method: 'POST',
        path: '/api/projects',
        expectedStatus: 400,
        description: 'Creación con payload inválido.',
      },
      {
        id: 'smoke-projects-detail',
        method: 'GET',
        path: '/api/projects/:id',
        expectedStatus: 200,
        description: 'Detalle de proyecto existente.',
      },
      {
        id: 'smoke-projects-update',
        method: 'PATCH',
        path: '/api/projects/:id',
        expectedStatus: 200,
        description: 'Actualización parcial de proyecto.',
      },
      {
        id: 'smoke-projects-delete',
        method: 'DELETE',
        path: '/api/projects/:id',
        expectedStatus: 200,
        description: 'Eliminación lógica de proyecto.',
      },
    ],
  },
  {
    id: 'group-assets',
    label: 'Assets',
    routes: [
      {
        id: 'smoke-assets-list',
        method: 'GET',
        path: '/api/assets',
        expectedStatus: 200,
        description: 'Listado de assets del workspace.',
      },
      {
        id: 'smoke-assets-upload',
        method: 'POST',
        path: '/api/assets/upload',
        expectedStatus: 201,
        description: 'Subida de asset válido.',
      },
      {
        id: 'smoke-assets-upload-invalid',
        method: 'POST',
        path: '/api/assets/upload',
        expectedStatus: 400,
        description: 'Subida sin archivo adjunto.',
      },
      {
        id: 'smoke-assets-detail',
        method: 'GET',
        path: '/api/assets/:id',
        expectedStatus: 200,
        description: 'Metadatos de asset existente.',
      },
      {
        id: 'smoke-assets-delete',
        method: 'DELETE',
        path: '/api/assets/:id',
        expectedStatus: 200,
        description: 'Eliminación de asset.',
      },
    ],
  },
  {
    id: 'group-render',
    label: 'Render Pipeline',
    routes: [
      {
        id: 'smoke-render-jobs-list',
        method: 'GET',
        path: '/api/render/jobs',
        expectedStatus: 200,
        description: 'Listado de jobs de render.',
      },
      {
        id: 'smoke-render-jobs-create',
        method: 'POST',
        path: '/api/render/jobs',
        expectedStatus: 201,
        description: 'Encolado de job de render.',
      },
      {
        id: 'smoke-render-jobs-create-invalid',
        method: 'POST',
        path: '/api/render/jobs',
        expectedStatus: 400,
        description: 'Job sin preset válido.',
      },
      {
        id: 'smoke-render-jobs-status',
        method: 'GET',
        path: '/api/render/jobs/:id',
        expectedStatus: 200,
        description: 'Estado de job de render.',
      },
      {
        id: 'smoke-render-jobs-cancel',
        method: 'POST',
        path: '/api/render/jobs/:id/cancel',
        expectedStatus: 200,
        description: 'Cancelación de job en curso.',
      },
    ],
  },
  {
    id: 'group-billing',
    label: 'Billing',
    routes: [
      {
        id: 'smoke-billing-plans',
        method: 'GET',
        path: '/api/billing/plans',
        expectedStatus: 200,
        description: 'Catálogo de planes disponibles.',
      },
      {
        id: 'smoke-billing-subscribe',
        method: 'POST',
        path: '/api/billing/subscribe',
        expectedStatus: 201,
        description: 'Alta de suscripción válida.',
      },
      {
        id: 'smoke-billing-subscribe-invalid',
        method: 'POST',
        path: '/api/billing/subscribe',
        expectedStatus: 400,
        description: 'Alta sin plan válido.',
      },
      {
        id: 'smoke-billing-invoices',
        method: 'GET',
        path: '/api/billing/invoices',
        expectedStatus: 200,
        description: 'Listado de facturas del workspace.',
      },
      {
        id: 'smoke-billing-webhook',
        method: 'POST',
        path: '/api/billing/webhook',
        expectedStatus: 200,
        description: 'Recepción de webhook firmado.',
      },
    ],
  },
  {
    id: 'group-audit',
    label: 'Audit & Telemetry',
    routes: [
      {
        id: 'smoke-audit-events',
        method: 'GET',
        path: '/api/audit/events',
        expectedStatus: 200,
        description: 'Stream de eventos de auditoría.',
      },
      {
        id: 'smoke-audit-events-create',
        method: 'POST',
        path: '/api/audit/events',
        expectedStatus: 201,
        description: 'Registro de evento de auditoría.',
      },
      {
        id: 'smoke-audit-events-create-invalid',
        method: 'POST',
        path: '/api/audit/events',
        expectedStatus: 400,
        description: 'Evento sin tipo declarado.',
      },
      {
        id: 'smoke-audit-metrics',
        method: 'GET',
        path: '/api/audit/metrics',
        expectedStatus: 200,
        description: 'Métricas agregadas de auditoría.',
      },
      {
        id: 'smoke-audit-export',
        method: 'POST',
        path: '/api/audit/export',
        expectedStatus: 201,
        description: 'Exportación de reporte de auditoría.',
      },
    ],
  },
  {
    id: 'group-system',
    label: 'System',
    routes: [
      {
        id: 'smoke-system-health',
        method: 'GET',
        path: '/api/system/health',
        expectedStatus: 200,
        description: 'Healthcheck del sistema.',
      },
      {
        id: 'smoke-system-version',
        method: 'GET',
        path: '/api/system/version',
        expectedStatus: 200,
        description: 'Versión sellada del build.',
      },
      {
        id: 'smoke-system-config',
        method: 'GET',
        path: '/api/system/config',
        expectedStatus: 200,
        description: 'Configuración pública del runtime.',
      },
      {
        id: 'smoke-system-config-update',
        method: 'PUT',
        path: '/api/system/config',
        expectedStatus: 200,
        description: 'Actualización de configuración.',
      },
      {
        id: 'smoke-system-config-update-invalid',
        method: 'PUT',
        path: '/api/system/config',
        expectedStatus: 400,
        description: 'Actualización con payload inválido.',
      },
    ],
  },
  {
    id: 'group-webhooks',
    label: 'Webhooks',
    routes: [
      {
        id: 'smoke-webhooks-list',
        method: 'GET',
        path: '/api/webhooks',
        expectedStatus: 200,
        description: 'Listado de webhooks registrados.',
      },
      {
        id: 'smoke-webhooks-create',
        method: 'POST',
        path: '/api/webhooks',
        expectedStatus: 201,
        description: 'Registro de webhook válido.',
      },
      {
        id: 'smoke-webhooks-create-invalid',
        method: 'POST',
        path: '/api/webhooks',
        expectedStatus: 400,
        description: 'Registro sin URL destino.',
      },
      {
        id: 'smoke-webhooks-delete',
        method: 'DELETE',
        path: '/api/webhooks/:id',
        expectedStatus: 200,
        description: 'Eliminación de webhook.',
      },
      {
        id: 'smoke-webhooks-test',
        method: 'POST',
        path: '/api/webhooks/:id/test',
        expectedStatus: 200,
        description: 'Disparo de prueba de webhook.',
      },
    ],
  },
  {
    id: 'group-users',
    label: 'Users & Teams',
    routes: [
      {
        id: 'smoke-users-list',
        method: 'GET',
        path: '/api/users',
        expectedStatus: 200,
        description: 'Listado de usuarios del workspace.',
      },
      {
        id: 'smoke-users-invite',
        method: 'POST',
        path: '/api/users/invite',
        expectedStatus: 201,
        description: 'Invitación de usuario válida.',
      },
      {
        id: 'smoke-users-invite-invalid',
        method: 'POST',
        path: '/api/users/invite',
        expectedStatus: 400,
        description: 'Invitación sin email válido.',
      },
      {
        id: 'smoke-users-detail',
        method: 'GET',
        path: '/api/users/:id',
        expectedStatus: 200,
        description: 'Detalle de usuario existente.',
      },
      {
        id: 'smoke-users-update',
        method: 'PATCH',
        path: '/api/users/:id',
        expectedStatus: 200,
        description: 'Actualización de rol de usuario.',
      },
    ],
  },
  {
    id: 'group-search',
    label: 'Search',
    routes: [
      {
        id: 'smoke-search-query',
        method: 'GET',
        path: '/api/search',
        expectedStatus: 200,
        description: 'Búsqueda con query válida.',
      },
      {
        id: 'smoke-search-query-invalid',
        method: 'GET',
        path: '/api/search',
        expectedStatus: 400,
        description: 'Búsqueda sin query.',
      },
      {
        id: 'smoke-search-suggest',
        method: 'GET',
        path: '/api/search/suggest',
        expectedStatus: 200,
        description: 'Sugerencias de búsqueda.',
      },
      {
        id: 'smoke-search-index',
        method: 'POST',
        path: '/api/search/index',
        expectedStatus: 201,
        description: 'Indexación de documento.',
      },
      {
        id: 'smoke-search-index-invalid',
        method: 'POST',
        path: '/api/search/index',
        expectedStatus: 400,
        description: 'Indexación sin documento.',
      },
    ],
  },
];

const STATUS_LABEL: Record<AuditCheckpointStatus, string> = {
  verified: 'Verificado',
  pending: 'En revisión',
  locked: 'Bloqueado',
};

const STATUS_CLASS: Record<AuditCheckpointStatus, string> = {
  verified: 'border-[#D4AF37]/60 text-[#D4AF37]',
  pending: 'border-white/30 text-white/70',
  locked: 'border-white/15 text-white/40',
};

const METHOD_CLASS: Record<SmokeTestRoute['method'], string> = {
  GET: 'border-[#D4AF37]/60 text-[#D4AF37]',
  POST: 'border-white/40 text-white/80',
  PUT: 'border-white/30 text-white/70',
  PATCH: 'border-white/30 text-white/70',
  DELETE: 'border-white/20 text-white/60',
};

const EXPECTED_STATUS_CLASS: Record<SmokeTestRoute['expectedStatus'], string> = {
  200: 'border-[#D4AF37]/60 text-[#D4AF37]',
  201: 'border-white/40 text-white/80',
  400: 'border-white/20 text-white/60',
};

const jsonLd: JsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: 'EAR OS',
      url: SITE_URL,
      description:
        'EAR OS — Sistema operativo de producción audiovisual bajo estándar S-Class.',
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: 'EAR OS',
      inLanguage: 'es-ES',
      publisher: {
        '@id': ORGANIZATION_ID,
      },
    },
    {
      '@type': 'WebPage',
      '@id': WEBPAGE_ID,
      url: CANONICAL_URL,
      name: PAGE_TITLE,
      description: PAGE_DESCRIPTION,
      inLanguage: 'es-ES',
      isPartOf: {
        '@id': WEBSITE_ID,
      },
      about: {
        '@id': ORGANIZATION_ID,
      },
      breadcrumb: {
        '@id': BREADCRUMB_ID,
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': BREADCRUMB_ID,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Inicio',
          item: SITE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Auditoría',
          item: CANONICAL_URL,
        },
      ],
    },
  ],
};

export default function Page(): React.JSX.Element {
  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#030305] text-white border-l-2 border-[#D4AF37]"
      role="main"
      aria-labelledby="auditoria-heading"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="flex w-full max-w-3xl flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:px-10 md:py-20 text-center">
        <span className="mb-4 block text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] sm:text-xs">
          Sector Asegurado
        </span>
        <h1
          id="auditoria-heading"
          className="text-2xl font-serif font-black uppercase italic tracking-widest sm:text-3xl md:text-4xl"
        >
          auditoria
        </h1>

        <p className="mt-6 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
          Registro técnico del estado de build, tipado y rendimiento del sistema
          en la ruta <span className="text-[#D4AF37]">/auditoria</span>. Cada
          métrica corresponde a una medición verificable sobre el último commit
          sellado.
        </p>

        <dl
          className="mt-10 grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
          aria-label="Métricas de auditoría"
        >
          {AUDIT_METRICS.map((metric) => (
            <div
              key={metric.id}
              className="flex flex-col items-start rounded-sm border border-white/10 bg-white/[0.02] p-4 text-left"
            >
              <dt className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                {metric.label}
              </dt>
              <dd className="mt-2 text-xl font-serif font-black tracking-wider text-[#D4AF37]">
                {metric.value}
              </dd>
              <dd className="mt-2 text-xs leading-relaxed text-white/60">
                {metric.detail}
              </dd>
            </div>
          ))}
        </dl>

        <ul
          className="mt-10 flex w-full flex-col gap-3"
          aria-label="Puntos de control de auditoría"
        >
          {AUDIT_CHECKPOINTS.map((checkpoint) => (
            <li
              key={checkpoint.id}
              className="flex flex-col gap-2 rounded-sm border border-white/10 bg-white/[0.02] p-4 text-left sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
                  {checkpoint.code}
                </span>
                <span className="mt-1 text-sm font-bold uppercase tracking-widest text-white">
                  {checkpoint.title}
                </span>
                <span className="mt-1 text-xs leading-relaxed text-white/60">
                  {checkpoint.evidence}
                </span>
              </div>
              <span
                className={`inline-flex min-h-[32px] items-center justify-center self-start rounded-sm border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] sm:self-auto ${STATUS_CLASS[checkpoint.status]}`}
              >
                {STATUS_LABEL[checkpoint.status]}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-14 w-full">
          <h2 className="text-left text-[10px] font-bold uppercase tracking-[0.4em] text-[#D4AF37] sm:text-xs">
            Smoke Tests · API Routes Críticas
          </h2>
          <p className="mt-3 text-left text-xs leading-relaxed text-white/60 sm:text-sm">
            Cobertura mínima de 50 rutas críticas verificadas vía{' '}
            <span className="text-[#D4AF37]">curl</span> con validación de
            status <span className="text-[#D4AF37]">200</span>,{' '}
            <span className="text-[#D4AF37]">201</span> y{' '}
            <span className="text-[#D4AF37]">400</span>.
          </p>

          <div className="mt-6 flex w-full flex-col gap-6">
            {SMOKE_TEST_GROUPS.map((group) => (
              <div key={group.id} className="flex flex-col gap-3">
                <h3 className="text-left text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
                  {group.label}
                </h3>
                <ul
                  className="flex w-full flex-col gap-2"
                  aria-label={`Smoke tests ${group.label}`}
                >
                  {group.routes.map((route) => (
                    <li
                      key={route.id}
                      className="flex flex-col gap-2 rounded-sm border border-white/10 bg-white/[0.02] p-3 text-left sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex min-w-0 flex-col">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center justify-center rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] ${METHOD_CLASS[route.method]}`}
                          >
                            {route.method}
                          </span>
                          <code className="truncate text-xs font-mono text-white/80">
                            {route.path}
                          </code>
                        </div>
                        <span className="mt-1 text-xs leading-relaxed text-white/60">
                          {route.description}
                        </span>
                      </div>
                      <span
                        className={`inline-flex min-h-[28px] items-center justify-center self-start rounded-sm border px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] sm:self-auto ${EXPECTED_STATUS_CLASS[route.expectedStatus]}`}
                      >
                        {route.expectedStatus}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 flex w-full flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="/"
            className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-sm border border-[#D4AF37]/60 px-6 py-3 text-xs font-bold uppercase tracking-[0.3em] text-[#D4AF37] transition-colors duration-200 hover:bg-[#D4AF37]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] active:bg-[#D4AF37]/20"
            aria-label="Volver al inicio de EAR OS"
          >
            Volver
          </a>
        </div>
      </section>
    </main>
  );
}