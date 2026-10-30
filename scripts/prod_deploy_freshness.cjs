#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * AUDITOR DE FRESCURA DEL DESPLIEGUE (ley del auditor real).
 *
 * Problema que cierra: el pipeline podia quedar verde mientras produccion seguia
 * sirviendo una imagen vieja. Caso real medido (30-oct-2026): Coolify devolvio 401
 * al trigger, el paso tenia continue-on-error, el job salio verde, y el bundle vivo
 * NO contenia el fix de voz. Nadie lo detecto hasta auditar el chunk a mano.
 *
 * Verdad medida: GET /api/health devuelve el `buildSha` grabado en la imagen
 * (Docker ARG EAR_BUILD_SHA <- ${{ github.sha }}). Se compara con el SHA esperado.
 *
 * Exit codes:
 *   0  FRESH      el SHA vivo coincide con el esperado (o modo diagnostico OK)
 *   4  STALE      produccion sirve otro SHA (o ninguno): deploy NO ejecutado
 *   5  UNVERIFIABLE  /api/health no expone buildSha (imagen anterior al sello)
 *   1  ERROR de red/formato
 *
 * Uso:
 *   node scripts/prod_deploy_freshness.cjs                     (diagnostico)
 *   node scripts/prod_deploy_freshness.cjs --expect=<sha> --wait=120
 */
'use strict';

const BASE = process.env.EAR_PROD_BASE_URL || 'https://www.productoraear.com';

function arg(name, fallback) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

const EXPECTED = (arg('expect', '') || process.env.EAR_EXPECTED_SHA || '').trim();
const WAIT = Number(arg('wait', process.env.EAR_FRESHNESS_WAIT || '0')) || 0;
const INTERVAL = 15000;

const DEPLOY_REMEDY =
  'REMEDIACION (despliegue): Coolify > Settings > Advanced > API access = Enabled; Keys & Tokens > crear key con permiso Deploy; ' +
  'guardarla como secret COOLIFY_API_TOKEN (y el endpoint en COOLIFY_WEBHOOK_URL). ' +
  'Alternativa: activar el auto-deploy por git webhook. ' +
  'Mientras esto no ocurra, el codigo commiteado NO esta sirviendose.';

/**
 * Segundo modo de fallo, MEDIDO el 30-oct-2026 (run 41025070925): el trigger de
 * Coolify devolvio 200 y el fix SI estaba en produccion (buildId nuevo, agujas
 * del fix presentes en el chunk vivo), pero /api/health publicaba
 * `buildSha=unknown` porque Coolify compila desde Git y NO pasa build-args: el
 * `ARG EAR_BUILD_SHA` del Dockerfile caia a su valor por defecto. Acusar a esto
 * de "imagen anterior al sello" es un diagnostico falso; por eso el veredicto
 * ahora separa "sin clave buildSha" de "clave con valor unknown".
 */
const SEAL_REMEDY =
  'REMEDIACION (sello): la imagen se construyo fuera del CI (Coolify compila desde Git) y por eso EAR_BUILD_SHA llega con su valor por defecto. ' +
  'Coolify > app > Environment Variables: crear EAR_BUILD_SHA = $SOURCE_COMMIT con "Available during build" (se pasa como build-arg al Dockerfile); ' +
  'y/o Advanced > Build > "Source commit availability = Available during build" para que SOURCE_COMMIT exista durante el build. ' +
  'Alternativa: desplegar la imagen firmada de GHCR (ghcr.io/productoraear/productora-ear-os:sha-<commit>) en vez de compilar desde Git.';


async function probe() {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20000);
  try {
    const res = await fetch(`${BASE}/api/health`, {
      headers: { 'user-agent': 'EAR-OS-deploy-freshness' },
      signal: ctrl.signal,
      cache: 'no-store',
    });
    const text = await res.text();
    let json = null;
    try {
      json = JSON.parse(text);
    } catch {
      return {
        http: res.status,
        sha: null,
        present: false,
        buildSource: null,
        buildTime: 'unknown',
        raw: text.slice(0, 160),
      };
    }
    const present = typeof json.buildSha === 'string';
    const sha = present ? json.buildSha.trim() : null;
    const buildSource = typeof json.buildSource === 'string' ? json.buildSource : null;
    return { http: res.status, sha, present, buildSource, buildTime: json.buildTime || 'unknown', raw: '' };
  } finally {
    clearTimeout(t);
  }
}

function matches(live, expected) {
  if (!live || !expected) return false;
  if (live === expected) return true;
  const short = expected.slice(0, 7).toLowerCase();
  const liveShort = live.slice(0, 7).toLowerCase();
  return live.length >= 7 && liveShort === short;
}

(async () => {
  const deadline = Date.now() + WAIT * 1000;
  let attempt = 0;
  let last = null;

  for (;;) {
    attempt += 1;
    try {
      last = await probe();
    } catch (err) {
      console.log(`HEALTH_ERROR intento ${attempt}: ${err instanceof Error ? err.message : String(err)}`);
      last = { http: 0, sha: null, present: false, buildSource: null, buildTime: 'unknown', raw: 'red' };
    }
    const ok = last.http === 200 && matches(last.sha, EXPECTED);
    console.log(
      `HEALTH intento ${attempt} http=${last.http} buildSha=${last.sha || '<ausente>'} buildSource=${last.buildSource || '<ausente>'} buildTime=${last.buildTime || '<ausente>'}` +
        (EXPECTED ? ` esperado=${EXPECTED.slice(0, 7)}` : '')
    );
    if (ok || !EXPECTED || Date.now() >= deadline) break;
    await new Promise((r) => setTimeout(r, INTERVAL));
  }

  if (!EXPECTED) {
    console.log(`MODO_DIAGNOSTICO base=${BASE}`);
    if (last && last.sha && last.sha !== 'unknown') {
      console.log(
        `RESULTADO: produccion publica buildSha=${last.sha} (buildSource=${last.buildSource || '<ausente>'}); usar --expect=<sha> para convertirlo en puerta.`
      );
    } else if (last && last.present) {
      console.log(
        'RESULTADO: produccion publica la clave buildSha pero SIN valor (unknown): la imagen se construyo sin build-args (Coolify compilando desde Git). El sello existe; la procedencia no.'
      );
      console.log(SEAL_REMEDY);
    } else {
      console.log('RESULTADO: produccion NO publica buildSha (imagen anterior al sello). El deploy del sello aun no ha ocurrido.');
      console.log(DEPLOY_REMEDY);
    }
    process.exit(0);
  }

  if (last && last.http === 200 && last.sha && last.sha !== 'unknown' && matches(last.sha, EXPECTED)) {
    console.log('VERDICT=FRESH produccion sirve el commit construido en este run.');
    process.exit(0);
  }

  if (!last || last.http !== 200) {
    console.log(`::error::/api/health no responde (http=${last ? last.http : 0}).`);
    process.exit(1);
  }

  if (!last.sha || last.sha === 'unknown') {
    if (last.present) {
      console.log(
        `VERDICT=UNVERIFIABLE buildSha sin valor (buildSource=${last.buildSource || 'none'}): la imagen viva no declara QUE commit sirve. No es una imagen vieja: es una imagen sin sello.`
      );
      console.log(SEAL_REMEDY);
    } else {
      console.log('VERDICT=UNVERIFIABLE produccion no expone buildSha: la imagen viva es anterior al sello de procedencia (deploy no aplicado).');
      console.log(DEPLOY_REMEDY);
    }
    process.exit(5);
  }

  console.log(`VERDICT=STALE produccion sirve ${last.sha.slice(0, 7)} pero este run construyo ${EXPECTED.slice(0, 7)}.`);
  console.log(DEPLOY_REMEDY);
  process.exit(4);
})().catch((err) => {
  console.error('FRESHNESS_AUDIT_CRASH', err);
  process.exit(1);
});
