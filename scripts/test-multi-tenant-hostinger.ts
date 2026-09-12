/**
 * test-multi-tenant-hostinger.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Validación del enrutamiento Multi-Tenant Edge para el portafolio Hostinger.
 *
 * Verifica que cada dominio verificado en Netlify reescribe transparentemente
 * su raíz '/' hacia la ruta canónica correspondiente en < 5 ms, preservando
 * intactas las rutas /api/*, _next/* y los guards de /admin/*.
 *
 * Ejecución: npx tsx scripts/test-multi-tenant-hostinger.ts
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';

interface TenantCase {
  host: string;
  pathname: string;
  expectedRewrite: string | null;
  label: string;
}

const CASES: TenantCase[] = [
  {
    host: 'fincasparaboda.com',
    pathname: '/',
    expectedRewrite: '/proveedores?cat=finca',
    label: 'Fincas Para Boda -> /proveedores?cat=finca',
  },
  {
    host: 'www.fincasparaboda.com',
    pathname: '/',
    expectedRewrite: '/proveedores?cat=finca',
    label: 'www.fincasparaboda.com -> /proveedores?cat=finca',
  },
  {
    host: 'viajemusicalporlamemoria.com',
    pathname: '/',
    expectedRewrite: '/vimume',
    label: 'Viaje Musical por la Memoria -> /vimume',
  },
  {
    host: 'artistaseuropa.com',
    pathname: '/',
    expectedRewrite: '/artistas',
    label: 'Artistas Europa -> /artistas',
  },
  {
    host: 'mariachis.productoraear.com',
    pathname: '/',
    expectedRewrite: '/simulacion-mariachis',
    label: 'Subdominio Mariachis -> /simulacion-mariachis',
  },
  {
    host: 'productoraear.com',
    pathname: '/',
    expectedRewrite: null,
    label: 'Nave Nodriza (sin rewrite)',
  },
  {
    host: 'fincasparaboda.com',
    pathname: '/api/profiles/search',
    expectedRewrite: null,
    label: 'API preservada (sin rewrite)',
  },
  {
    host: 'artistaseuropa.com',
    pathname: '/_next/static/chunk.js',
    expectedRewrite: null,
    label: '_next preservado (sin rewrite)',
  },
  {
    host: 'fincasparaboda.com',
    pathname: '/admin',
    expectedRewrite: null,
    label: 'Guard /admin preservado (sin rewrite)',
  },
];

function buildRequest(host: string, pathname: string): NextRequest {
  const url = `https://${host}${pathname}`;
  return new NextRequest(url, {
    headers: { host },
  });
}

function extractRewriteTarget(response: Response): string | null {
  // NextResponse.rewrite() expone la cabecera interna x-middleware-rewrite.
  const rewriteHeader = response.headers.get('x-middleware-rewrite');
  if (!rewriteHeader) return null;
  try {
    const u = new URL(rewriteHeader);
    return u.pathname + u.search;
  } catch {
    return rewriteHeader;
  }
}

function main(): void {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(' MULTI-TENANT HOSTINGER ROUTING — VALIDACIÓN EDGE');
  console.log('═══════════════════════════════════════════════════════════════');

  let passed = 0;
  let failed = 0;
  let maxLatency = 0;

  for (const testCase of CASES) {
    const request = buildRequest(testCase.host, testCase.pathname);

    const start = performance.now();
    const response = middleware(request);
    const elapsed = performance.now() - start;
    maxLatency = Math.max(maxLatency, elapsed);

    const actual = extractRewriteTarget(response);
    const ok = actual === testCase.expectedRewrite;

    if (ok) {
      passed++;
      console.log(
        `  ✓ ${testCase.label.padEnd(48)} ${elapsed.toFixed(2)} ms  ->  ${
          actual ?? '(next)'
        }`
      );
    } else {
      failed++;
      console.log(
        `  ✗ ${testCase.label.padEnd(48)} esperado=${
          testCase.expectedRewrite ?? '(next)'
        } obtenido=${actual ?? '(next)'}`
      );
    }
  }

  console.log('───────────────────────────────────────────────────────────────');
  console.log(`  Tests: ${passed} OK / ${failed} FAIL`);
  console.log(`  Latencia máxima de rewrite: ${maxLatency.toFixed(2)} ms`);

  if (maxLatency >= 5) {
    console.log('  ✗ FALLO: latencia de rewrite >= 5 ms');
    process.exit(1);
  }

  if (failed > 0) {
    console.log('  ✗ FALLO: uno o más casos de enrutamiento no coinciden.');
    process.exit(1);
  }

  console.log('  ✓ EXIT 0 — Enrutamiento multi-tenant verificado.');
  console.log('═══════════════════════════════════════════════════════════════');
  process.exit(0);
}

main();
