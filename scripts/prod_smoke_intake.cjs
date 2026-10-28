#!/usr/bin/env node
/**
 * ============================================================================
 * EAR OS - SMOKE DE PRODUCCION (OMEGA-VERIFICABLE): PUENTE HARVEY -> EAR OS
 * ============================================================================
 * Doctrina: "verde en CI" no vale si produccion no lo sirve. Este script
 * convierte el despliegue en una PUERTA DURA: falla si la ruta no existe en la
 * imagen viva, para que un run verde signifique "desplegado y sirviendo".
 *
 * Lectura forense de codigos en GET /api/outreach/intake:
 *   404             -> la ruta NO existe en la imagen desplegada (deploy viejo).
 *   401 | 403       -> la ruta EXISTE y el guard de CRON_SECRET esta activo.
 *   405             -> la ruta EXISTE y rechaza el metodo.
 *   400 | 422       -> la ruta EXISTE y valida payload (zod).
 *   503             -> la ruta EXISTE; falla cerrado (sin secreto o sin BD).
 *   200 | 201 | 207 -> la ruta EXISTE y respondio datos.
 *
 * CORRECCION FORENSE (2026-10-28, medida contra produccion): el marcador
 * 'Error 404 // Productora EAR' NO es un detector de soft-404. Next.js serializa
 * el fallback del boundary `notFound` dentro del payload RSC de TODAS las
 * paginas validas; se comprobo que la HOME (200, contenido real) tambien lo
 * contiene (`marker404=1`). Usarlo producia un falso positivo permanente que
 * habria bloqueado CI para siempre.
 *
 * Discriminador real (el que se usa aqui):
 *   - HTTP 404                                  -> ruta inexistente.
 *   - <title>404 | Productora EAR</title>       -> pagina de error (soft o dura).
 *   - <title> propio de la pagina               -> pagina real servida.
 * Evidencia de control: `/` => 'Productora EAR :: Alquiler de Equipos...';
 * `/mariachis/red/alicante` => '... Musica en Alicante' (10 menciones);
 * `/zzz-no-existe-12345` y `/api/outreach/intake` => '404 | Productora EAR'.
 *
 * Fingerprint de imagen: el campo `"b":"<buildId>"` del payload RSC identifica
 * la build desplegada. Si el buildId NO cambia tras un despliegue, el despliegue
 * no se aplico (esto es evidencia maquina, no una promesa).
 *
 * Uso:
 *   node scripts/prod_smoke_intake.cjs
 *   node scripts/prod_smoke_intake.cjs --wait=900
 *   node scripts/prod_smoke_intake.cjs --post
 *   node scripts/prod_smoke_intake.cjs --skip-landing
 *   node scripts/prod_smoke_intake.cjs --provincia=toledo --code=QW44K3UQ
 *
 * Variables de entorno: PROD_BASE_URL (def. https://www.productoraear.com),
 *                       CRON_SECRET (solo para --post; nunca se imprime).
 *
 * Exit codes: 0 = OK · 1 = ruta ausente (404) · 2 = landing soft-404 (bloque
 *             no desplegado) · 3 = POST autenticado no certificado ·
 *             4 = error de red / timeout.
 * ============================================================================
 */

'use strict';

const BASE_URL = (process.env.PROD_BASE_URL || 'https://www.productoraear.com').replace(/\/+$/, '');
const INTAKE_PATH = '/api/outreach/intake';
/** Discriminador real de pagina de error (ver cabecera). El marcador del boundary
 *  NO sirve: aparece en el payload RSC de cualquier pagina valida. */
const NOT_FOUND_TITLE = /<title>\s*404\b/i;
/** El <title> propio de una pagina real, para dejar evidencia en el log. */
const TITLE_PATTERN = /<title>([^<]{0,160})<\/title>/i;
/** buildId de Next dentro del payload RSC (identifica la imagen desplegada). */
const BUILD_ID_PATTERNS = [/"b":"([A-Za-z0-9_-]{6,64})"/, /\\"b\\":\\"([A-Za-z0-9_-]{6,64})\\"/];
/** Codigos que demuestran que la ruta existe (auth / metodo / validacion / BD). */
const ROUTE_ALIVE = new Set([200, 201, 207, 400, 401, 403, 405, 422, 503]);
/** Codigos que certifican persistencia real de un prospecto. */
const POST_ACCEPTED = new Set([200, 201, 207]);
const POLL_INTERVAL_MS = 20_000;

function parseArgs(argv) {
    const opts = {
        waitSeconds: 0,
        doPost: false,
        skipLanding: false,
        provincia: 'alicante',
        code: '6V2G69VV',
    };
    for (const raw of argv) {
        if (raw === '--post') opts.doPost = true;
        else if (raw === '--skip-landing') opts.skipLanding = true;
        else if (raw.startsWith('--wait=')) opts.waitSeconds = Number(raw.slice(7)) || 0;
        else if (raw.startsWith('--provincia=')) opts.provincia = raw.slice(12);
        else if (raw.startsWith('--code=')) opts.code = raw.slice(7);
        else if (raw === '--help' || raw === '-h') {
            console.log('Uso: node scripts/prod_smoke_intake.cjs [--wait=SEG] [--post] [--skip-landing] [--provincia=X] [--code=Y]');
            process.exit(0);
        } else {
            console.error(`Argumento no reconocido: ${raw}`);
            process.exit(4);
        }
    }
    return opts;
}

async function hit(url, init = {}, timeoutMs = 20_000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, {
            ...init,
            signal: controller.signal,
            redirect: 'follow',
            cache: 'no-store',
        });
        const body = await res.text();
        return { status: res.status, body, ok: true };
    } catch (error) {
        const aborted = error && (error.name === 'AbortError' || error.name === 'TimeoutError');
        return {
            status: 0,
            body: aborted ? 'TIMEOUT' : String((error && error.message) || error),
            ok: false,
        };
    } finally {
        clearTimeout(timer);
    }
}

function tail(text, max = 320) {
    const flat = String(text).replace(/\s+/g, ' ').trim();
    return flat.length > max ? `${flat.slice(0, max)}...` : flat;
}

/** Titulo literal del documento (evidencia legible en CI). */
function extractTitle(html) {
    const match = html.match(TITLE_PATTERN);
    return match ? match[1].trim() : null;
}

/** buildId de la build viva: prueba maquina de que un despliegue se aplico. */
function extractBuildId(html) {
    for (const pattern of BUILD_ID_PATTERNS) {
        const match = html.match(pattern);
        if (match) return match[1];
    }
    return null;
}

/**
 * Huella de la imagen desplegada. Se lee de la home porque es la ruta que
 * siempre existe: si el buildId cambia, hay build nueva en produccion; si no
 * cambia, el despliegue NO se aplico aunque el panel diga "success".
 */
async function fingerprintImage() {
    const res = await hit(`${BASE_URL}/`);
    if (!res.ok) return { buildId: null, detail: 'NETWORK' };
    return {
        buildId: extractBuildId(res.body),
        detail: `HTTP_${res.status}`,
    };
}

/** 1. La ruta del puente debe EXISTIR en la imagen desplegada. */
async function checkIntakeRoute(waitSeconds) {
    const url = `${BASE_URL}${INTAKE_PATH}`;
    const deadline = Date.now() + waitSeconds * 1000;
    let attempt = 0;
    let last = { status: 0, body: '', ok: false };

    for (;;) {
        attempt += 1;
        last = await hit(url);
        const stamp = new Date().toISOString().slice(11, 19);
        console.log(`  [GET ] intento ${attempt} ${stamp} HTTP=${last.status || last.body}`);

        if (last.status !== 404 || Date.now() >= deadline) break;
        const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
        console.log(`  [WAIT] 404: la imagen desplegada no incluye la ruta. Reintento en ${POLL_INTERVAL_MS / 1000}s (quedan ${left}s).`);
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }

    if (!last.ok) {
        console.error(`  [FAIL] Sin respuesta de ${BASE_URL} (${last.body}).`);
        return { code: 4, detail: 'NETWORK' };
    }
    if (last.status === 404) {
        console.error('  [FAIL] HTTP 404: la ruta NO existe en produccion. Deploy viejo o webhook de Coolify no aplicado.');
        return { code: 1, detail: 'ROUTE_MISSING' };
    }
    if (!ROUTE_ALIVE.has(last.status)) {
        console.error(`  [FAIL] HTTP ${last.status} inesperado. Cuerpo: ${tail(last.body)}`);
        return { code: 1, detail: `UNEXPECTED_${last.status}` };
    }
    // Guard anti-fachada: 200 con el <title> de la pagina 404 = la ruta no existe,
    // alguien respondio 200 con el shell de error.
    if (NOT_FOUND_TITLE.test(last.body)) {
        console.error(`  [FAIL] HTTP ${last.status} pero el documento es la pagina 404 (${extractTitle(last.body)}).`);
        return { code: 1, detail: 'ROUTE_MISSING_TITLE_404' };
    }
    console.log(`  [PASS] Ruta viva (HTTP ${last.status}). El puente Harvey -> EAR OS esta desplegado.`);
    return { code: 0, detail: `HTTP_${last.status}` };
}

/** 2. La landing dinamica debe servirse de verdad (no el documento 404). */
async function checkLanding(opts) {
    if (opts.skipLanding) {
        console.log('  [SKIP] Landing (--skip-landing).');
        return { code: 0, detail: 'SKIPPED' };
    }
    const url = `${BASE_URL}/mariachis/red/${encodeURIComponent(opts.provincia)}?inv=${encodeURIComponent(opts.code)}`;
    const res = await hit(url);
    if (!res.ok) {
        console.error(`  [FAIL] Landing sin respuesta (${res.body}).`);
        return { code: 4, detail: 'NETWORK' };
    }
    const title = extractTitle(res.body);
    if (res.status === 404) {
        console.error(`  [FAIL] Landing HTTP 404 (${title || 'sin titulo'}): la ruta no existe en la imagen desplegada.`);
        return { code: 2, detail: 'LANDING_404' };
    }
    if (NOT_FOUND_TITLE.test(res.body)) {
        console.error(`  [FAIL] Soft-404 real: la landing responde HTTP ${res.status} pero su <title> es "${title}".`);
        console.error('         Detector: <title>404 | Productora EAR. (El marcador del boundary NO se usa: aparece en toda pagina valida.)');
        return { code: 2, detail: 'SOFT_404' };
    }
    if (!title) {
        console.error(`  [FAIL] Landing sin <title> reconocible (${res.body.length} bytes): documento inesperado.`);
        return { code: 2, detail: 'LANDING_NO_TITLE' };
    }
    console.log(`  [PASS] Landing real (HTTP ${res.status}, ${res.body.length} bytes, title="${title}").`);
    return { code: 0, detail: `HTTP_${res.status}`, buildId: extractBuildId(res.body) };
}

/** 3. POST autenticado: certifica persistencia (idempotente por externalId). */
async function checkAuthenticatedPost() {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        console.log('  [SKIP] POST autenticado: CRON_SECRET no definido en el entorno.');
        return { code: 0, detail: 'SKIPPED_NO_SECRET' };
    }
    const stamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
    const payload = {
        prospects: [
            {
                externalId: `smoke-${stamp}-a1`,
                companyName: 'Smoke Test EAR OS',
                email: 'smoke-deploy-check@productoraear.com',
                city: 'Madrid',
                country: 'ES',
                source: 'harvey',
            },
        ],
    };
    const res = await hit(
        `${BASE_URL}${INTAKE_PATH}`,
        {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secret}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        },
        45_000,
    );

    if (!res.ok) {
        console.error(`  [FAIL] POST sin respuesta (${res.body}).`);
        return { code: 4, detail: 'NETWORK' };
    }
    if (POST_ACCEPTED.has(res.status)) {
        console.log(`  [PASS] POST HTTP ${res.status}: ${tail(res.body)}`);
        return { code: 0, detail: `HTTP_${res.status}` };
    }
    console.error(`  [FAIL] POST HTTP ${res.status}: ${tail(res.body, 480)}`);
    if (res.status === 401) console.error('         CRON_SECRET del cliente != CRON_SECRET de Coolify.');
    if (res.status === 503) console.error('         503: falta CRON_SECRET en el VPS o falta migracion (prisma migrate deploy).');
    if (res.status === 400 || res.status === 422) console.error('         400/422: esquema rechazado (revisar contrato zod del intake).');
    return { code: 3, detail: `POST_HTTP_${res.status}` };
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    console.log('--- SMOKE DE PRODUCCION: PUENTE HARVEY -> EAR OS ---');
    console.log(`  BASE=${BASE_URL}${opts.waitSeconds > 0 ? ` WAIT=${opts.waitSeconds}s` : ''}`);

    const image = await fingerprintImage();
    console.log(`SMOKE_IMAGE_BUILD_ID=${image.buildId || 'UNKNOWN'} (${image.detail})`);

    const route = await checkIntakeRoute(opts.waitSeconds);
    console.log(`SMOKE_INTAKE_GET=${route.detail}`);

    const landing = await checkLanding(opts);
    console.log(`SMOKE_LANDING=${landing.detail}`);
    if (landing.buildId && image.buildId && landing.buildId !== image.buildId) {
        console.error(`  [WARN] buildId inconsistente entre home (${image.buildId}) y landing (${landing.buildId}): posible despliegue a medias.`);
    }

    let post = { code: 0, detail: 'NOT_REQUESTED' };
    if (opts.doPost) {
        post = await checkAuthenticatedPost();
        console.log(`SMOKE_POST=${post.detail}`);
    }

    const exitCode = route.code || landing.code || post.code || 0;
    console.log(`SMOKE_RESULT=${exitCode === 0 ? 'OK' : 'FAILED'} EXIT=${exitCode}`);
    process.exit(exitCode);
}

main().catch((error) => {
    console.error(`[FATAL] ${tail(error && error.stack ? error.stack : error, 600)}`);
    process.exit(4);
});
