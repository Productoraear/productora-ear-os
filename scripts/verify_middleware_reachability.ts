/**
 * VERIFICACIÓN DE CONTRATO · MIDDLEWARE DE ALCANZABILIDAD (P0 2026-11-21)
 * ─────────────────────────────────────────────────────────────────────────
 * Ejecuta el middleware REAL con peticiones sintéticas y comprueba que las
 * URLs que el CEO reportó en producción no son refluídas al escaparate.
 *
 *   · /calendario/catering/restaurante-otzarreta?intent=ver        → NO 307
 *   · /calendario/catering/restaurante-otzarreta?intent=bloquear    → NO 307
 *   · /proveedores?cat=finca                                        → NO 307
 *   · /proveedores                                                  → NO 307
 *   · /otzarreta                                                    → NO 307
 *   · /celebraciones                                                → 200 (destino legítimo)
 *   · una ruta de taller desconocida sigue refluyendo (el blindaje no se afloja)
 *
 * No sustituye a la sonda `--live` (que mide el despliegue real), pero detecta
 * la regresión en local antes de publicar. Ejecutar:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_middleware_reachability.ts
 */

import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';

const DEFAULT_HOST = 'www.productoraear.com';

interface ProbeCase {
  readonly label: string;
  readonly host?: string;
  readonly path: string;
  readonly mustRedirect: boolean;
  readonly mustNotRedirectTo?: string;
}

const CASES: readonly ProbeCase[] = [
  {
    label: 'Agenda · intent=ver (roto en producción)',
    path: '/calendario/catering/restaurante-otzarreta?intent=ver',
    mustRedirect: false,
  },
  {
    label: 'Agenda · intent=bloquear (roto en producción)',
    path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
    mustRedirect: false,
  },
  {
    label: 'Directorio · ?cat=finca (roto en producción)',
    path: '/proveedores?cat=finca',
    mustRedirect: false,
  },
  { label: 'Directorio raíz', path: '/proveedores', mustRedirect: false },
  { label: 'Dossier insignia', path: '/otzarreta', mustRedirect: false },
  { label: 'Escaparate (destino legítimo)', path: '/celebraciones', mustRedirect: false },
  { label: 'Presupuesto', path: '/presupuesto', mustRedirect: false },
  // ── P0 2026-11-27 · Apertura de tráfico público canónico (Directiva CEO) ──
  { label: 'Bodas', path: '/bodas', mustRedirect: false },
  { label: 'Experiencia', path: '/experiencia', mustRedirect: false },
  { label: 'Licitaciones', path: '/licitaciones', mustRedirect: false },
  { label: 'Reservar · solista', path: '/reservar/solista', mustRedirect: false },
  { label: 'Reservar · subruta canónica', path: '/reservar/mariachi', mustRedirect: false },
  { label: 'Artistas · ficha', path: '/artistas/edwin-agudelo', mustRedirect: false },
  { label: 'Fincas · ficha', path: '/fincas/jardines-la-cartuja', mustRedirect: false },
  { label: 'Proveedores · ficha', path: '/proveedores/finca-ejemplo', mustRedirect: false },
  { label: 'Seating planner', path: '/seating-planner', mustRedirect: false },
  // La protección ESTRICTA sigue viva: /admin sin sesión → /login.
  { label: 'Admin sin sesión (blindaje de sesión intacto)', path: '/admin', mustRedirect: true },
  // Contención multi-dominio: fincasparaboda.com y artistaseuropa.com
  {
    label: 'fincasparaboda.com · Agenda Otzarreta ?intent=ver',
    host: 'fincasparaboda.com',
    path: '/calendario/catering/restaurante-otzarreta?intent=ver',
    mustRedirect: false,
  },
  {
    label: 'fincasparaboda.com · Agenda Otzarreta ?intent=bloquear',
    host: 'fincasparaboda.com',
    path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
    mustRedirect: false,
  },
  {
    label: 'fincasparaboda.com · /celebraciones permitido',
    host: 'fincasparaboda.com',
    path: '/celebraciones',
    mustRedirect: false,
  },
  {
    label: 'fincasparaboda.com · /restaurante-otzarreta permitido',
    host: 'fincasparaboda.com',
    path: '/restaurante-otzarreta',
    mustRedirect: false,
  },
  {
    label: 'fincasparaboda.com · /vimume aislado (redirige)',
    host: 'fincasparaboda.com',
    path: '/vimume',
    mustRedirect: true,
  },
  {
    label: 'artistaseuropa.com · Agenda Otzarreta ?intent=bloquear',
    host: 'artistaseuropa.com',
    path: '/calendario/catering/restaurante-otzarreta?intent=bloquear',
    mustRedirect: false,
  },
  {
    label: 'artistaseuropa.com · Agenda artista ?intent=ver',
    host: 'artistaseuropa.com',
    path: '/calendario/artista/edwin-agudelo?intent=ver',
    mustRedirect: false,
  },
  {
    label: 'artistaseuropa.com · /vimume aislado (redirige)',
    host: 'artistaseuropa.com',
    path: '/vimume',
    mustRedirect: true,
  },
  // El blindaje contra 404 visibles debe seguir vivo para rutas de taller.
  {
    label: 'Ruta de taller desconocida (blindaje intacto)',
    path: '/sandbox/ruta-en-taller',
    mustRedirect: true,
  },
];

let failures = 0;

for (const testCase of CASES) {
  const host = testCase.host ?? DEFAULT_HOST;
  const request = new NextRequest(new URL(testCase.path, `https://${host}`), {
    headers: { host },
  });
  const response = middleware(request);

  const status = response.status;
  const location = response.headers.get('location');
  const isRedirect = status >= 300 && status < 400;
  const problems: string[] = [];

  if (testCase.mustRedirect && !isRedirect) {
    problems.push(`esperaba redirección y devolvió ${status}`);
  }
  if (!testCase.mustRedirect && isRedirect) {
    problems.push(`redirige a ${location ?? '(sin Location)'} — la página nunca se renderiza`);
  }
  if (testCase.mustNotRedirectTo && location?.includes(testCase.mustNotRedirectTo)) {
    problems.push(`refluye a ${testCase.mustNotRedirectTo}`);
  }

  if (problems.length === 0) {
    console.log(`  [OK  ] ${testCase.label} → ${isRedirect ? `${status} ${location}` : status}`);
  } else {
    failures++;
    console.log(`  [FAIL] ${testCase.label}`);
    for (const problem of problems) console.log(`         > ${problem}`);
  }
}

console.log('─────────────────────────────────────────────');
if (failures === 0) {
  console.log(`RESULTADO: ${CASES.length}/${CASES.length} rutas alcanzan su propio contenido.`);
  process.exit(0);
}
console.log(`RESULTADO: ${failures} ruta(s) canibalizada(s) de ${CASES.length}.`);
process.exit(1);
