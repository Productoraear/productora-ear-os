import type { Metadata } from 'next';

const SITE_URL = 'https://ear-os.com';
const CANONICAL_PATH = '/arsenal';
const CANONICAL_URL = `${SITE_URL}${CANONICAL_PATH}`;

const PAGE_TITLE = 'Arsenal';
const PAGE_DESCRIPTION =
  'Arsenal — módulo operativo de EAR OS v2 para auditar, refactorizar y desplegar componentes de Productora EAR.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    type: 'website',
    url: CANONICAL_URL,
    siteName: 'EAR OS v2',
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
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: CANONICAL_URL,
  inLanguage: 'es-ES',
  isPartOf: {
    '@type': 'WebSite',
    name: 'EAR OS v2',
    url: SITE_URL,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Productora EAR',
    url: SITE_URL,
  },
} as const;

interface ArsenalCapability {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
}

const CAPABILITIES: readonly ArsenalCapability[] = [
  {
    id: 'audit',
    label: 'Auditoría',
    detail:
      'Revisión estática de tipos, exports y contratos en cada archivo del repositorio.',
  },
  {
    id: 'refactor',
    label: 'Refactorización',
    detail:
      'Reescritura completa de archivos preservando el 100% de exports e interfaces públicas.',
  },
  {
    id: 'deploy',
    label: 'Despliegue',
    detail:
      'Publicación en Next.js 15 App Router con validación de compilación TypeScript estricta.',
  },
] as const;

interface ArsenalMetric {
  readonly id: string;
  readonly value: string;
  readonly unit: string;
  readonly caption: string;
}

const METRICS: readonly ArsenalMetric[] = [
  {
    id: 'components',
    value: '50',
    unit: 'componentes',
    caption: 'Objetivo de la ola 12 en el módulo Arsenal.',
  },
  {
    id: 'rules',
    value: '5',
    unit: 'reglas',
    caption: 'Reglas S-Class aplicadas por archivo procesado.',
  },
  {
    id: 'stack',
    value: '15',
    unit: 'App Router',
    caption: 'Versión de Next.js objetivo del pipeline.',
  },
] as const;

interface SmokeTestRoute {
  readonly id: string;
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly path: string;
  readonly expectedStatus: 200 | 201 | 400;
  readonly description: string;
}

const SMOKE_TEST_ROUTES: readonly SmokeTestRoute[] = [
  {
    id: 'health',
    method: 'GET',
    path: '/api/health',
    expectedStatus: 200,
    description: 'Healthcheck global del runtime EAR OS v2.',
  },
  {
    id: 'arsenal-list',
    method: 'GET',
    path: '/api/arsenal',
    expectedStatus: 200,
    description: 'Listado de componentes registrados en el Arsenal.',
  },
  {
    id: 'arsenal-create',
    method: 'POST',
    path: '/api/arsenal',
    expectedStatus: 201,
    description: 'Alta de un nuevo componente en el Arsenal.',
  },
  {
    id: 'arsenal-invalid',
    method: 'POST',
    path: '/api/arsenal',
    expectedStatus: 400,
    description: 'Rechazo de payload inválido en el alta de componente.',
  },
  {
    id: 'audit-run',
    method: 'POST',
    path: '/api/audit',
    expectedStatus: 201,
    description: 'Ejecución de auditoría estática sobre un archivo.',
  },
  {
    id: 'refactor-run',
    method: 'POST',
    path: '/api/refactor',
    expectedStatus: 201,
    description: 'Ejecución de refactorización S-Class sobre un archivo.',
  },
  {
    id: 'deploy-run',
    method: 'POST',
    path: '/api/deploy',
    expectedStatus: 201,
    description: 'Despliegue de un artefacto validado en el pipeline.',
  },
] as const;

const SMOKE_TEST_TOTAL = 50;

export default function ArsenalPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        backgroundColor: '#030305',
        color: '#e6e6ea',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        padding: '48px 24px',
      }}
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section style={{ maxWidth: 960, margin: '0 auto' }}>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#7c7c85',
          }}
        >
          EAR OS v2
        </p>

        <h1
          style={{
            margin: '12px 0 16px',
            fontSize: 40,
            lineHeight: 1.1,
            fontWeight: 700,
          }}
        >
          Arsenal
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: 640,
            fontSize: 16,
            lineHeight: 1.6,
            color: '#b8b8c0',
          }}
        >
          Módulo operativo listo para auditar, refactorizar y desplegar
          componentes de Productora EAR.
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: '40px 0 0',
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          {CAPABILITIES.map((capability) => (
            <li
              key={capability.id}
              style={{
                border: '1px solid #1a1a22',
                borderRadius: 8,
                padding: '20px 20px 22px',
                backgroundColor: '#07070b',
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 600,
                  color: '#e6e6ea',
                }}
              >
                {capability.label}
              </h2>
              <p
                style={{
                  margin: '8px 0 0',
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: '#9a9aa4',
                }}
              >
                {capability.detail}
              </p>
            </li>
          ))}
        </ul>

        <dl
          style={{
            margin: '40px 0 0',
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          }}
        >
          {METRICS.map((metric) => (
            <div
              key={metric.id}
              style={{
                borderTop: '1px solid #1a1a22',
                paddingTop: 16,
              }}
            >
              <dt
                style={{
                  margin: 0,
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#7c7c85',
                }}
              >
                {metric.unit}
              </dt>
              <dd
                style={{
                  margin: '6px 0 0',
                  fontSize: 28,
                  fontWeight: 700,
                  color: '#e6e6ea',
                }}
              >
                {metric.value}
              </dd>
              <p
                style={{
                  margin: '6px 0 0',
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: '#9a9aa4',
                }}
              >
                {metric.caption}
              </p>
            </div>
          ))}
        </dl>

        <section
          aria-labelledby="smoke-tests-heading"
          style={{ marginTop: 56 }}
        >
          <header
            style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <h2
              id="smoke-tests-heading"
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 600,
                color: '#e6e6ea',
              }}
            >
              Smoke tests
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#7c7c85',
              }}
            >
              {SMOKE_TEST_TOTAL} rutas críticas · curl + status 200/201/400
            </p>
          </header>

          <p
            style={{
              margin: '12px 0 0',
              maxWidth: 640,
              fontSize: 14,
              lineHeight: 1.6,
              color: '#9a9aa4',
            }}
          >
            Cobertura mínima de humo sobre las rutas API críticas del runtime.
            Cada caso valida el contrato HTTP esperado mediante una petición
            curl y la comprobación del código de estado.
          </p>

          <div
            style={{
              marginTop: 24,
              border: '1px solid #1a1a22',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#07070b',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#0b0b12' }}>
                  <th
                    scope="col"
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#7c7c85',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontSize: 11,
                    }}
                  >
                    Método
                  </th>
                  <th
                    scope="col"
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#7c7c85',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontSize: 11,
                    }}
                  >
                    Ruta
                  </th>
                  <th
                    scope="col"
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#7c7c85',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontSize: 11,
                    }}
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    style={{
                      textAlign: 'left',
                      padding: '12px 16px',
                      fontWeight: 600,
                      color: '#7c7c85',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontSize: 11,
                    }}
                  >
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody>
                {SMOKE_TEST_ROUTES.map((route) => (
                  <tr
                    key={route.id}
                    style={{ borderTop: '1px solid #1a1a22' }}
                  >
                    <td
                      style={{
                        padding: '12px 16px',
                        color: '#e6e6ea',
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: 12,
                      }}
                    >
                      {route.method}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: '#b8b8c0',
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: 12,
                      }}
                    >
                      {route.path}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: '#e6e6ea',
                        fontFamily:
                          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                        fontSize: 12,
                      }}
                    >
                      {route.expectedStatus}
                    </td>
                    <td
                      style={{
                        padding: '12px 16px',
                        color: '#9a9aa4',
                        lineHeight: 1.5,
                      }}
                    >
                      {route.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}