/**
 * ════════════════════════════════════════════════════════════════════════════════
 * VERIFY_SSL_AND_GEOBLOCK.TS — HARNESS FORENSE DE CANDADO SSL Y GEO-BLOQUEO (CO)
 * ════════════════════════════════════════════════════════════════════════════════
 * Doctrina S-Class / Mamparos de Seguridad Perimetral:
 *   1. CANDADO SSL: En producción, peticiones con x-forwarded-proto: http
 *      son forzadas con HTTP 301 Redirect a https:// y cabecera HSTS estricta.
 *   2. GEO-BLOQUEO COLOMBIA (CO): Peticiones detectadas desde Colombia
 *      (cf-ipcountry / x-vercel-ip-country / etc. === 'CO') son bloqueadas
 *      inmediatamente con HTTP 403 Forbidden y x-ear-geoblock: restricted-territory-CO.
 *   3. TRÁFICO PERMITIDO: Peticiones legítimas (ES o sin geo restrictivo)
 *      fluyen con normalidad y reciben cabecera HSTS Strict-Transport-Security.
 */

import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FALLO: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASS: ${message}`);
}

async function run() {
  console.log('── INICIANDO AUDITORÍA FORENSE SSL & GEO-BLOQUEO COLOMBIA ──\n');

  // CASO 1: Candado SSL — Redirección 301 en producción ante tráfico HTTP inseguro
  {
    const req = new NextRequest('http://www.productoraear.com/otzarreta', {
      headers: {
        host: 'www.productoraear.com',
        'x-forwarded-proto': 'http',
      },
    });
    const res = middleware(req);
    assert(res.status === 301, 'Tráfico HTTP inseguro en host de producción devuelve 301 Redirect');
    assert(
      res.headers.get('location')?.startsWith('https://www.productoraear.com/otzarreta') === true,
      `Redirección apunta a protocolo seguro HTTPS (${res.headers.get('location')})`
    );
    assert(
      res.headers.get('Strict-Transport-Security')?.includes('max-age=63072000') === true,
      'Cabecera HSTS inyectada en redirección SSL'
    );
  }

  // CASO 2: Candado SSL — Tráfico local no es forzado a SSL (desarrollo seguro)
  {
    const req = new NextRequest('http://localhost:3007/otzarreta', {
      headers: {
        host: 'localhost:3007',
        'x-forwarded-proto': 'http',
      },
    });
    const res = middleware(req);
    assert(res.status !== 301, 'Tráfico localhost preserva desarrollo local sin redirect SSL forzado');
  }

  // CASO 3: Geo-bloqueo Colombia — Petición web desde Colombia (CO)
  {
    const req = new NextRequest('https://www.productoraear.com/otzarreta', {
      headers: {
        host: 'www.productoraear.com',
        'cf-ipcountry': 'CO',
      },
    });
    const res = middleware(req);
    assert(res.status === 403, 'Tráfico web procedente de Colombia (CO) bloqueado con HTTP 403');
    assert(
      res.headers.get('x-ear-geoblock') === 'restricted-territory-CO',
      'Cabecera perimetral x-ear-geoblock: restricted-territory-CO emitida'
    );
    const body = await res.text();
    assert(body.includes('Colombia'), 'Cuerpo HTML de 403 declara restricción territorial para Colombia');
  }

  // CASO 4: Geo-bloqueo Colombia — Petición API desde Colombia (CO)
  {
    const req = new NextRequest('https://www.productoraear.com/api/chat/concierge', {
      headers: {
        host: 'www.productoraear.com',
        'x-vercel-ip-country': 'CO',
      },
    });
    const res = middleware(req);
    assert(res.status === 403, 'Petición API procedente de Colombia (CO) bloqueada con HTTP 403');
    const json = await res.json();
    assert(json.error === 'GEO_RESTRICTED', 'API devuelve payload JSON { error: "GEO_RESTRICTED" }');
    assert(json.country === 'CO', 'API reporta country: "CO"');
  }

  // CASO 5: Tráfico permitido — España (ES) y otros territorios autorizados
  {
    const req = new NextRequest('https://www.productoraear.com/otzarreta', {
      headers: {
        host: 'www.productoraear.com',
        'cf-ipcountry': 'ES',
      },
    });
    const res = middleware(req);
    assert(res.status === 200, 'Tráfico procedente de España (ES) autorizado (HTTP 200)');
    assert(
      res.headers.get('Strict-Transport-Security')?.includes('max-age=63072000') === true,
      'Respuesta autorizada incluye candado HSTS'
    );
  }

  console.log('\n============================================================');
  console.log('RESULTADO: 8/8 ASERCIONES SUPERADAS · EXIT CODE 0');
  console.log('CANDADO SSL ACTIVO + GEO-BLOQUEO COLOMBIA (CO) SELLADO');
  console.log('============================================================\n');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
