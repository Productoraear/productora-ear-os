/**
 * 🛰️ TRIGGER COOLIFY DEPLOY & BARE-METAL VPS READINESS (S-CLASS)
 * -------------------------------------------------------------
 * Prueba forense de conectividad HTTP/TCP contra Hostinger VPS Coolify v4
 * IP: 82.29.179.172:8000
 *
 * Dispara el webhook REAL de despliegue (`COOLIFY_DEPLOY_WEBHOOK`) y reporta el
 * código HTTP que devuelve Coolify. Prohibido simular: si no hay webhook, falla
 * (Exit 2) en vez de imprimir "todo verificado".
 *
 * Exit codes: 0 = deploy encolado por Coolify · 1 = rechazo HTTP / error de red ·
 *             2 = falta COOLIFY_DEPLOY_WEBHOOK en el entorno.
 */

const http = require('http');

const COOLIFY_HOST = process.env.COOLIFY_HOST || '82.29.179.172';
const COOLIFY_PORT = Number(process.env.COOLIFY_PORT || 8000);
const COOLIFY_WEBHOOK_URL = process.env.COOLIFY_DEPLOY_WEBHOOK || '';

async function testVpsConnectivity() {
  console.log('\n--- VERIFICACIÓN DE CONECTIVIDAD BARE-METAL COOLIFY ---');
  console.log(`Target: http://${COOLIFY_HOST}:${COOLIFY_PORT}`);

  return new Promise((resolve) => {
    const startTime = Date.now();
    const req = http.get(
      {
        host: COOLIFY_HOST,
        port: COOLIFY_PORT,
        path: '/',
        timeout: 8000,
      },
      (res) => {
        const durationMs = Date.now() - startTime;
        console.log(`  [PASS] Conectividad HTTP confirmada (${durationMs}ms)`);
        console.log(`  [INFO] Código HTTP devuelto: ${res.statusCode} (${res.statusMessage})`);
        
        // Coolify suele devolver 200, 301, 302 o 401 en el root
        if ([200, 301, 302, 307, 308, 401, 403].includes(res.statusCode)) {
          console.log('  [PASS] Panel Coolify v4 operativo en VPS Bare-Metal.');
          resolve(true);
        } else {
          console.warn(`  [WARN] Código inusual devuelto por Coolify: ${res.statusCode}`);
          resolve(true);
        }
      }
    );

    req.on('error', (err) => {
      console.error(`  [FAIL] Error de conexión con ${COOLIFY_HOST}:${COOLIFY_PORT} -> ${err.message}`);
      resolve(false);
    });

    req.on('timeout', () => {
      req.destroy();
      console.error(`  [FAIL] Timeout conectando a ${COOLIFY_HOST}:${COOLIFY_PORT}`);
      resolve(false);
    });
  });
}

async function triggerWebhookIfAvailable() {
  if (!COOLIFY_WEBHOOK_URL) {
    console.error('\n[FAIL] COOLIFY_DEPLOY_WEBHOOK no definido en el entorno.');
    console.error('       Sin webhook NO hay despliegue. Configura la URL de la app en Coolify');
    console.error('       (GET /api/v1/deploy?uuid=...) o pulsa "Deploy" en el panel.');
    console.error('       Este script no simula despliegues: o dispara de verdad, o falla.');
    return 'NOT_CONFIGURED';
  }

  // La URL contiene el UUID secreto de la app: solo se publica el host.
  const hostOnly = COOLIFY_WEBHOOK_URL.replace(/^(https?:\/\/[^/]+).*$/i, '$1');
  console.log(`\n[EXEC] Disparando webhook de despliegue en ${hostOnly} (UUID oculto)`);

  const transport = COOLIFY_WEBHOOK_URL.startsWith('https:') ? require('https') : http;
  const startedAt = Date.now();

  return new Promise((resolve) => {
    const req = transport.get(COOLIFY_WEBHOOK_URL, { timeout: 45000 }, (res) => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        if (body.length < 400) body += chunk;
      });
      res.on('end', () => {
        const flat = body.replace(/\s+/g, ' ').trim().slice(0, 300) || '<vacio>';
        console.log(`  [INFO] HTTP ${res.statusCode} en ${Date.now() - startedAt}ms`);
        console.log(`  [INFO] Respuesta Coolify: ${flat}`);

        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('  [PASS] Coolify acepto el despliegue (encolado).');
          resolve('OK');
        } else {
          console.error('  [FAIL] Coolify RECHAZO el webhook. El deploy NO esta en marcha.');
          console.error('         Causas tipicas: UUID de app invalido (404), token/otra app (401/403)');
          console.error('         o app en estado inconsistente (500). Revisa el panel en el puerto 8000.');
          resolve('FAILED');
        }
      });
    });

    req.on('timeout', () => {
      req.destroy();
      console.error('\n[FAIL] Timeout de 45s esperando a Coolify: el deploy no esta confirmado.');
      resolve('FAILED');
    });

    req.on('error', (err) => {
      console.error(`\n[FAIL] Error de red al disparar el webhook: ${err.message}`);
      resolve('FAILED');
    });
  });
}

async function main() {
  const isConnected = await testVpsConnectivity();
  const trigger = await triggerWebhookIfAvailable();

  if (!isConnected) {
    console.error('\n❌ Error crítico: No se pudo verificar conectividad con el VPS Bare-Metal.');
    process.exit(1);
  }

  if (trigger === 'NOT_CONFIGURED') {
    console.error('\n❌ Despliegue NO disparado: falta COOLIFY_DEPLOY_WEBHOOK (Exit 2).\n');
    process.exit(2);
  }

  if (trigger !== 'OK') {
    console.error('\n❌ Coolify no acepto el despliegue (Exit 1).\n');
    process.exit(1);
  }

  console.log('\n✅ Webhook aceptado por Coolify. Verifica con:');
  console.log('   node scripts/prod_smoke_intake.cjs --wait=1500 --post\n');
  process.exit(0);
}

main();
