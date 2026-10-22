/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS — AUDITORÍA AUTOMÁTICA EN VIVO DEL SITEMAP (HTTP 200 PROOF)
 * ════════════════════════════════════════════════════════════════════════════
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3007';

// Lista canónica de rutas críticas a auditar en vivo
const CANONICAL_URLS_TO_AUDIT = [
    // 1. Rutas Core de Conversión y Venta
    '/',
    '/reservar/solista',
    '/reservar/contrato',
    '/reservar/aceptar',
    '/panel/reservas',
    '/vimume',
    '/calculadora',
    '/cotizador',
    '/presupuesto',
    '/checkout/presupuesto',

    // 2. Directorios y Verticales
    '/bodas',
    '/fincas',
    '/proveedores',
    '/artistas',
    '/artistas/edwin-agudelo',
    '/mariachis',
    '/mariachis/unirse',
    '/dj-para-bodas',
    '/catering-de-brasas',
    '/arroces',
    '/alquiler-equipos-sonido-audiovisuales',
    '/alquiler-pantallas-led-madrid',
    '/rider-tecnico',
    '/b2g',
    '/ayuntamientos',
    '/empresarios',
    '/precios',
    '/servicios',

    // 3. Rutas de API Clave
    '/api/webhooks/health',
    '/api/telemetry/mission/MIS-CANONICAL-2026',
];

async function auditUrl(route) {
    const fullUrl = `${BASE_URL}${route}`;
    const start = Date.now();
    try {
        const response = await fetch(fullUrl, {
            headers: { 'Accept': 'text/html,application/json' },
            signal: AbortSignal.timeout(30000),
        });
        const duration = Date.now() - start;
        return {
            route,
            url: fullUrl,
            status: response.status,
            ok: response.status >= 200 && response.status < 400,
            durationMs: duration,
        };
    } catch (err) {
        return {
            route,
            url: fullUrl,
            status: 0,
            ok: false,
            error: err.message,
            durationMs: Date.now() - start,
        };
    }
}

async function runAudit() {
    console.log(`\n--- INICIANDO AUDITORÍA EN VIVO DE RUTAS SITEMAP (${CANONICAL_URLS_TO_AUDIT.length} URLs) ---`);
    console.log(`Target: ${BASE_URL}\n`);

    let passed = 0;
    let failed = 0;
    const results = [];

    for (const route of CANONICAL_URLS_TO_AUDIT) {
        const res = await auditUrl(route);
        results.push(res);
        if (res.ok) {
            console.log(`  [HTTP ${res.status}] ${res.durationMs.toString().padStart(4, ' ')}ms  OK  ->  ${route}`);
            passed++;
        } else {
            console.error(`  [HTTP ${res.status}] ${res.durationMs.toString().padStart(4, ' ')}ms  FAIL ->  ${route} (${res.error || 'Status ' + res.status})`);
            failed++;
        }
    }

    console.log(`\n======================================================`);
    console.log(`AUDITORÍA COMPLETADA: ${passed} OK / ${failed} Fallos de ${CANONICAL_URLS_TO_AUDIT.length} URLs.`);
    console.log(`======================================================\n`);

    // Guardar reporte forense JSON
    const reportPath = path.join(__dirname, '..', 'reports', 'SITEMAP_LIVE_AUDIT_REPORT.json');
    fs.mkdirSync(path.dirname(reportPath), { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify({ auditedAt: new Date().toISOString(), total: CANONICAL_URLS_TO_AUDIT.length, passed, failed, results }, null, 2));

    if (failed > 0) process.exit(1);
    process.exit(0);
}

runAudit();
