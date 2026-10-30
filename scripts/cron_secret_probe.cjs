#!/usr/bin/env node
/**
 * ============================================================================
 * EAR OS - SONDA DEL SECRETO DE CRON (P0): "GitHub Secrets == servidor vivo"
 * ============================================================================
 * Cierra el agujero de observabilidad del incidente 2026-10-30: el smoke de
 * produccion devolvia `POST /api/outreach/intake -> HTTP 401` y no habia forma
 * de saber SI el 401 era por secreto distinto, por cabecera ausente o por
 * secreto ausente en el VPS. Ahora se comparan HUELLAS, no valores:
 *
 *   huella = "sha256:" + 12 primeros hex de SHA-256(secreto normalizado)
 *
 * Con 48 bits, dos valores distintos dan huellas distintas con probabilidad
 * abrumadora, y la huella NO permite reconstruir el secreto (que por doctrina
 * mide >= 32 caracteres; si mide menos, el servidor la RETIENE).
 *
 * Doble evidencia (no una promesa):
 *   1) HUELLA: compara la del secreto local (GitHub Secret / .env) con la que
 *      publica `/api/health` en `cron.fingerprints`.
 *   2) VIVO: lanza `GET /api/outreach/intake` con `Authorization: Bearer ...`
 *      y lee el codigo real (lectura pura: 0 escrituras, 0 efectos de dinero).
 *
 * Uso:
 *   node scripts/cron_secret_probe.cjs
 *   node scripts/cron_secret_probe.cjs --secret=<valor> --no-live
 *   node scripts/cron_secret_probe.cjs --base=http://localhost:3007
 *   npm run probe:cron
 *
 * Variables: CRON_SECRET (obligatoria para comparar), PROD_BASE_URL.
 *
 * Exit codes:
 *   0 = MATCH y ruta protegida atendiendo con auth correcta
 *   3 = el servidor rechaza la credencial (HTTP 401) -> secreto distinto
 *   4 = error de red / timeout
 *   5 = huellas distintas (el valor local no es el del servidor)
 *   6 = el servidor no tiene CRON_SECRET (fail-closed, HTTP 503)
 *   7 = no hay secreto local que probar
 * ============================================================================
 */

'use strict';

const crypto = require('node:crypto');

const DEFAULTS = {
    base: (process.env.PROD_BASE_URL || 'https://www.productoraear.com').replace(/\/+$/, ''),
    path: '/api/outreach/intake',
    timeoutMs: 20_000,
};

const FINGERPRINT_HEX_LENGTH = 12;
const MIN_FINGERPRINTABLE_LENGTH = 32;
const WITHHELD = 'WITHHELD_WEAK_SECRET';
const ABSENT = 'ABSENT';
const UNKNOWN = 'SIN_DATO';

/** Debe replicar EXACTAMENTE `normalizeCronSecret` de cronSecretGuard.ts. */
function normalizeSecret(raw) {
    if (typeof raw !== 'string') return '';
    let value = raw.replace(/^\uFEFF/, '').trim();
    value = value.replace(/^bearer\s+/i, '').trim();
    if (value.length >= 2) {
        const first = value.charAt(0);
        const last = value.charAt(value.length - 1);
        if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
            value = value.slice(1, -1).trim();
        }
    }
    return value;
}

/** Misma funcion que `fingerprintCronSecret` (TS) para que las huellas casen. */
function fingerprint(raw) {
    const value = normalizeSecret(raw);
    if (value.length === 0) return ABSENT;
    if (value.length < MIN_FINGERPRINTABLE_LENGTH) return WITHHELD;
    const digest = crypto.createHash('sha256').update(value, 'utf8').digest('hex');
    return `sha256:${digest.slice(0, FINGERPRINT_HEX_LENGTH)}`;
}

function parseArgs(argv) {
    const opts = {
        secret: process.env.CRON_SECRET || '',
        base: DEFAULTS.base,
        path: DEFAULTS.path,
        timeoutMs: DEFAULTS.timeoutMs,
        live: true,
    };
    for (const arg of argv) {
        if (arg === '--no-live') opts.live = false;
        else if (arg.startsWith('--secret=')) opts.secret = arg.slice('--secret='.length);
        else if (arg.startsWith('--base=')) opts.base = arg.slice('--base='.length).replace(/\/+$/, '');
        else if (arg.startsWith('--path=')) opts.path = arg.slice('--path='.length);
        else if (arg.startsWith('--timeout=')) {
            const parsed = Number.parseInt(arg.slice('--timeout='.length), 10);
            if (Number.isFinite(parsed) && parsed > 0) opts.timeoutMs = parsed;
        }
    }
    return opts;
}

async function hit(url, init, timeoutMs) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
        const res = await fetch(url, { ...init, signal: controller.signal, redirect: 'follow' });
        const body = await res.text();
        return { ok: true, status: res.status, body };
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        return { ok: false, status: 0, body: message };
    } finally {
        clearTimeout(timer);
    }
}

function parseJson(body) {
    try {
        return { ok: true, value: JSON.parse(body) };
    } catch {
        return { ok: false, value: null };
    }
}

function tail(value, max) {
    const text = String(value == null ? '' : value);
    return text.length > max ? `${text.slice(0, max)}...` : text;
}

/** Lee la huella publicada por el servidor en /api/health -> `cron`. */
async function readServerHealth(base, timeoutMs) {
    const res = await hit(`${base}/api/health`, { headers: { Accept: 'application/json' } }, timeoutMs);
    if (!res.ok) {
        return { reachable: false, configured: null, fingerprints: [], weak: null, mode: null, detail: res.body };
    }
    const parsed = parseJson(res.body);
    if (!parsed.ok || res.status !== 200) {
        return { reachable: true, configured: null, fingerprints: [], weak: null, mode: null, detail: 'health sin JSON valido' };
    }
    const cron = parsed.value && typeof parsed.value === 'object' ? parsed.value.cron : null;
    if (!cron || typeof cron !== 'object') {
        return {
            reachable: true,
            configured: null,
            fingerprints: [],
            weak: null,
            mode: null,
            detail: 'health sin bloque cron (imagen anterior a la sonda)',
        };
    }
    const fingerprints = Array.isArray(cron.fingerprints)
        ? cron.fingerprints.filter((row) => typeof row === 'string')
        : [];
    return {
        reachable: true,
        configured: typeof cron.configured === 'boolean' ? cron.configured : null,
        fingerprints,
        weak: typeof cron.weak === 'boolean' ? cron.weak : null,
        mode: typeof cron.mode === 'string' ? cron.mode : null,
        detail: 'ok',
    };
}

/** GET autenticado a la ruta protegida: mide el contrato, no el contenido. */
async function probeLive(opts) {
    const res = await hit(
        `${opts.base}${opts.path}`,
        {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${normalizeSecret(opts.secret)}`,
                Accept: 'application/json',
            },
        },
        opts.timeoutMs,
    );
    if (!res.ok) return { status: 0, code: 'NETWORK', detail: tail(res.body, 160) };
    const parsed = parseJson(res.body);
    const payload = parsed.ok ? parsed.value : null;
    const code =
        payload && typeof payload === 'object' && typeof payload.code === 'string'
            ? payload.code
            : payload && typeof payload === 'object' && typeof payload.error === 'string'
              ? tail(payload.error, 80)
              : tail(res.body, 80);
    return { status: res.status, code, detail: tail(res.body, 240) };
}

async function main() {
    const opts = parseArgs(process.argv.slice(2));
    const localSecret = normalizeSecret(opts.secret);
    const localFingerprint = fingerprint(localSecret);

    console.log('--- SONDA DE CRON_SECRET (huella local vs servidor vivo) ---');
    console.log(`  BASE=${opts.base} PATH=${opts.live ? opts.path : '(no-live)'}`);
    console.log(`CRON_FP_LOCAL=${localFingerprint}`);
    if (localSecret.length > 0) console.log(`CRON_LOCAL_LENGTH=${localSecret.length}`);

    if (localSecret.length === 0) {
        console.error('  [FAIL] No hay secreto local: exporta CRON_SECRET o usa --secret=<valor>.');
        console.log('CRON_VERDICT=NO_LOCAL_SECRET');
        return 7;
    }

    const health = await readServerHealth(opts.base, opts.timeoutMs);
    if (!health.reachable) {
        console.error(`  [FAIL] /api/health inalcanzable (${health.detail}).`);
        console.log('CRON_VERDICT=NETWORK');
        return 4;
    }
    const serverFingerprints = health.fingerprints.length > 0 ? health.fingerprints : [UNKNOWN];
    console.log(`CRON_FP_SERVER=${serverFingerprints.join('|')}`);
    console.log(
        `CRON_SERVER_CONFIGURED=${health.configured === null ? 'UNKNOWN' : health.configured ? '1' : '0'}`,
    );
    if (health.weak === true) console.log('CRON_SERVER_WEAK=1');
    if (health.detail !== 'ok') console.log(`CRON_SERVER_DETAIL=${health.detail}`);

    const match = serverFingerprints.includes(UNKNOWN)
        ? '-1'
        : serverFingerprints.includes(localFingerprint)
          ? '1'
          : '0';
    console.log(`CRON_MATCH=${match}`);

    let live = { status: 0, code: 'NOT_REQUESTED', detail: 'sin sonda viva' };
    if (opts.live) {
        live = await probeLive(opts);
        console.log(`CRON_LIVE_AUTH=HTTP_${live.status}`);
        if (live.code) console.log(`CRON_LIVE_CODE=${live.code}`);
    } else {
        console.log('CRON_LIVE_AUTH=NOT_REQUESTED');
    }

    if (health.configured === false || live.status === 503) {
        console.error('  [FAIL] El servidor no tiene CRON_SECRET: fallo cerrado (503). Definelo en Coolify.');
        console.log('CRON_VERDICT=SERVER_NOT_CONFIGURED');
        return 6;
    }

    if (live.status === 0 && opts.live) {
        console.error(`  [FAIL] Ruta protegida inalcanzable: ${live.detail}`);
        console.log('CRON_VERDICT=NETWORK');
        return 4;
    }

    if (live.status === 401) {
        console.error('  [FAIL] El servidor rechaza la credencial (HTTP 401).');
        console.error(`         local=${localFingerprint} servidor=${serverFingerprints.join('|')}`);
        if (match === '-1') {
            console.error('         El servidor no publica huellas: imagen anterior a esta sonda.');
            console.error('         Despliega este commit y repite `npm run probe:cron` para comparar.');
        } else {
            console.error('         Si las huellas difieren, GitHub Secrets y Coolify no tienen el MISMO valor.');
        }
        if (live.detail) console.error(`         respuesta: ${live.detail}`);
        console.log(`CRON_VERDICT=${match === '-1' ? 'AUTH_401_FP_UNKNOWN' : 'MISMATCH'}`);
        return 3;
    }

    if (match === '0') {
        console.error('  [FAIL] Huella local != huella del servidor (el valor no es el mismo).');
        console.log('CRON_VERDICT=MISMATCH');
        return 5;
    }

    console.log('CRON_VERDICT=MATCH');
    if (live.status === 200) {
        console.log('  [PASS] Huella y autenticacion en vivo correctas.');
        return 0;
    }
    if (live.status === 503) {
        console.log('  [WARN] Auth correcta, backend 503 (esquema/BD): revisar migraciones.');
        return 0;
    }
    console.log(`  [WARN] Auth aceptada pero la ruta respondio HTTP ${live.status} (${live.code}).`);
    return 0;
}

main()
    .then((code) => {
        process.exit(code);
    })
    .catch((error) => {
        console.error('[FATAL]', error && error.stack ? error.stack : error);
        process.exit(4);
    });
