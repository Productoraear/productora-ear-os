#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * G-6 · SONDA DE PRODUCCION — AF-1 (telemetria honesta) + U13 (/confianza)
 * ════════════════════════════════════════════════════════════════════════════
 * Doctrine: .clinerules §5 G-6 (verde en local no es verde en produccion),
 * §3 AF-1/AF-5 (la telemetria no opina, mide; sin sonda no hay OK) y
 * §1 EP-1/EP-4 (quintupla completa + ledger append-only).
 *
 * Uso:
 *   node .antigravity/probe_af1_g6.cjs            # sonda en seco (no escribe)
 *   node .antigravity/probe_af1_g6.cjs --append   # sonda + fila VERIFICADO
 *   node .antigravity/probe_af1_g6.cjs --json     # solo el informe JSON
 *
 * Exit: 0 -> promesas verificadas · 1 -> SIN_EVIDENCIA (no se escribe nada)
 *
 * Que prueba, exactamente:
 *   AF-1 · el endpoint de salud de webhooks solo declara vida cuando ha
 *          sondeado n8n de verdad. No basta con que el campo `probed` exista:
 *          se exige que `checkedAt` (el instante en que n8n fue interrogado)
 *          este a menos de FRESHNESS_WINDOW_S del reloj de esta sonda. Un
 *          valor hardcodeado no puede cumplir esa condicion dos veces seguidas.
 *   U13  · /confianza responde 200, declara `s-maxage=300` y su HTML trae la
 *          tabla de promesas con los ids del ledger (no una pagina vacia).
 *
 * Fail-closed por construccion: si una sola asercion falla, el script termina
 * con Exit 1 y NO toca el ledger. Nunca escribe una fila optimista.
 * ════════════════════════════════════════════════════════════════════════════
 */
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const HEALTH_URL = 'https://www.productoraear.com/api/webhooks/health';
const CONFIANZA_URL = 'https://www.productoraear.com/confianza';
const LEDGER = path.join(process.cwd(), '.antigravity', 'evidence', 'ledger.jsonl');
const FRESHNESS_WINDOW_S = 120;
const EXPECTED_WEBHOOKS = 7;
const EXPECTED_CACHE_TOKEN = 's-maxage=300';
const PAGE_MARKERS = ['Registro de promesas', 'sha256 del ledger', 'AF-1'];
const CMD_LITERAL = 'node .antigravity/probe_af1_g6.cjs --append';
const ISO_TS = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

const appendMode = process.argv.includes('--append');
const jsonMode = process.argv.includes('--json');

function sha256Hex(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

async function fetchRaw(url, timeoutMs = 25000) {
  const startedAt = Date.now();
  const res = await fetch(url, {
    method: 'GET',
    redirect: 'follow',
    // Ni cache de CDN ni de navegador: se mide el origen, no un intermedio.
    headers: { 'cache-control': 'no-cache', pragma: 'no-cache' },
    signal: AbortSignal.timeout(timeoutMs),
  });
  const buffer = Buffer.from(await res.arrayBuffer());
  return {
    status: res.status,
    headers: res.headers,
    body: buffer,
    latencyMs: Date.now() - startedAt,
    finalUrl: res.url || url,
  };
}

function parseJsonOrNull(buffer) {
  try {
    return JSON.parse(buffer.toString('utf8'));
  } catch {
    return null;
  }
}

function isoToMs(value) {
  if (typeof value !== 'string' || !ISO_TS.test(value)) return null;
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
}

function appendRows(rows) {
  const before = fs.readFileSync(LEDGER, 'utf8');
  const payload = rows.map((row) => JSON.stringify(row)).join('\n') + '\n';
  fs.appendFileSync(LEDGER, (before.endsWith('\n') ? '' : '\n') + payload, 'utf8');
  const after = fs.readFileSync(LEDGER, 'utf8');
  return {
    appended: rows.length,
    lines_before: before.split(/\r?\n/).filter((l) => l.trim().length > 0).length,
    lines_after: after.split(/\r?\n/).filter((l) => l.trim().length > 0).length,
    sha256_after: sha256Hex(Buffer.from(after, 'utf8')),
  };
}


async function main() {
  const report = {
    probed: false,
    source: 'live',
    mode: 'REAL',
    checkedAt: new Date().toISOString(),
    claims: {},
  };
  const failures = [];

  // ── Sonda 1 · AF-1 (telemetria honesta del cluster n8n) ───────────────────
  let health = null;
  try {
    const res = await fetchRaw(HEALTH_URL);
    const json = parseJsonOrNull(res.body);
    health = {
      httpStatus: res.status,
      bytes: res.body.length,
      sha256: sha256Hex(res.body),
      latencyMs: res.latencyMs,
      json,
    };
    report.probed = true;
    const instance = json !== null && json.instance && typeof json.instance === 'object' ? json.instance : null;
    report.claims['AF-1'] = {
      httpStatus: res.status,
      bytes: res.body.length,
      sha256: health.sha256,
      latencyMs: res.latencyMs,
      probedField: json === null ? null : json.probed,
      sourceField: json === null ? null : json.source,
      modeField: json === null ? null : json.mode,
      instanceAlive: instance === null ? null : instance.alive,
      instanceCheckedAt: instance === null ? null : instance.checkedAt,
      webhooks: json === null || !Array.isArray(json.webhooks) ? null : json.webhooks.length,
      dlqCount: json === null || json.dlqCount === undefined ? null : json.dlqCount,
    };

    if (res.status !== 200) failures.push('AF-1: HTTP ' + res.status + ' (se exige 200)');
    if (json === null) {
      failures.push('AF-1: el cuerpo no es JSON parseable');
    } else {
      if (json.probed !== true) failures.push('AF-1: probed!==true (sonda no ejecutada)');
      if (json.source !== 'live') failures.push('AF-1: source distinto de "live"');
      if (json.mode !== 'REAL') failures.push('AF-1: mode distinto de "REAL"');
      if (instance === null) {
        failures.push('AF-1: falta el objeto `instance` con el resultado de la sonda');
      } else {
        if (typeof instance.alive !== 'boolean') {
          failures.push('AF-1: instance.alive no es booleano (no hay veredicto de sonda)');
        }
        const checkedMs = isoToMs(instance.checkedAt);
        const ageS = checkedMs === null ? null : (Date.now() - checkedMs) / 1000;
        report.claims['AF-1'].freshnessSeconds = ageS;
        if (checkedMs === null) {
          failures.push('AF-1: instance.checkedAt no es ISO-8601 UTC');
        } else if (ageS > FRESHNESS_WINDOW_S || ageS < -30) {
          failures.push(
            'AF-1: instance.checkedAt no es fresco (' + ageS.toFixed(1) + ' s fuera de ' +
            FRESHNESS_WINDOW_S + ' s): un literal hardcodeado no puede pasar esta asercion'
          );
        }
      }
      if (!Array.isArray(json.webhooks) || json.webhooks.length !== EXPECTED_WEBHOOKS) {
        failures.push('AF-1: se esperaban ' + EXPECTED_WEBHOOKS + ' webhooks canonicos');
      }
      if (typeof json.dlqCount !== 'number') {
        failures.push('AF-1: dlqCount ausente o no numerico');
      }
    }
  } catch (error) {
    failures.push('AF-1: la sonda HTTP fallo (' + (error instanceof Error ? error.message : String(error)) + ')');
  }

  // ── Sonda 2 · U13 (/confianza servida desde el ledger) ────────────────────
  let confianza = null;
  try {
    const res = await fetchRaw(CONFIANZA_URL);
    const html = res.body.toString('utf8');
    const cacheControl = res.headers.get('cache-control') || '';
    confianza = {
      httpStatus: res.status,
      bytes: res.body.length,
      sha256: sha256Hex(res.body),
      latencyMs: res.latencyMs,
      cacheControl,
      contentType: res.headers.get('content-type'),
      markers: PAGE_MARKERS.filter((marker) => html.includes(marker)),
      finalUrl: res.finalUrl,
    };
    report.claims['U13'] = confianza;

    if (res.status !== 200) failures.push('U13: HTTP ' + res.status + ' (se exige 200)');
    if (!cacheControl.includes(EXPECTED_CACHE_TOKEN)) {
      failures.push('U13: Cache-Control sin ' + EXPECTED_CACHE_TOKEN + ' (observado: "' + cacheControl + '")');
    }
    const missingMarkers = PAGE_MARKERS.filter((marker) => !html.includes(marker));
    if (missingMarkers.length > 0) {
      failures.push('U13: HTML sin marcadores ' + JSON.stringify(missingMarkers) + ' (pagina vacia o no generada desde el ledger)');
    }
  } catch (error) {
    failures.push('U13: la sonda HTTP fallo (' + (error instanceof Error ? error.message : String(error)) + ')');
  }

  const verified = failures.length === 0;
  report.failures = failures;
  report.verdict = verified ? 'VERIFICADO' : 'SIN_EVIDENCIA';
  report.exit_code = verified ? 0 : 1;

  const ts = report.checkedAt.replace(/\.\d+Z$/, 'Z');
  if (verified && appendMode) {
    const rows = [
      {
        claim: 'AF-1',
        promise: 'El endpoint de salud de webhooks solo declara vida cuando ha sondeado n8n de verdad',
        state: 'VERIFICADO',
        cmd: CMD_LITERAL,
        exit: 0,
        httpStatus: health.httpStatus,
        url: HEALTH_URL,
        sha256: health.sha256,
        bytes: health.bytes,
        ts,
        supersedes: 'AF-1',
        note:
          'Confirmado en produccion: probed=true, source=live, mode=REAL, instance.alive=' +
          String(health.json.instance.alive) + ', instance.checkedAt fresco (' +
          report.claims['AF-1'].freshnessSeconds.toFixed(1) + ' s), ' +
          health.json.webhooks.length + ' webhooks canonicos y dlqCount=' +
          String(health.json.dlqCount) + '. El sha256 identifica la instantanea: el cuerpo ' +
          'lleva checkedAt/timestamp y cambia en cada peticion (no reproducible byte a byte).',
      },
      {
        claim: 'U13',
        promise: 'Existe una pagina publica donde cada promesa figura con su estado, su URL de prueba y su fecha',
        state: 'VERIFICADO',
        cmd: CMD_LITERAL,
        exit: 0,
        httpStatus: confianza.httpStatus,
        url: CONFIANZA_URL,
        sha256: confianza.sha256,
        bytes: confianza.bytes,
        ts,
        supersedes: 'U13',
        note:
          'HTTP 200 en el host final con Cache-Control "' + confianza.cacheControl +
          '" (retirada < 10 min, JUR-5). El HTML incluye la tabla de promesas y el sha256 del ' +
          'ledger: se genero en build desde .antigravity/evidence/ledger.jsonl, no es una pagina vacia. ' +
          'sha256 sobre el cuerpo descomprimido.',
      },
    ];
    report.ledger_write = appendRows(rows);
  } else if (appendMode) {
    report.ledger_write = { skipped: true, reason: 'SIN_EVIDENCIA: no se escribe ninguna fila' };
  }

  if (jsonMode) {
    process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  } else {
    console.log('[G-6] ' + (verified ? 'VERIFICADO' : 'SIN_EVIDENCIA') + ' · probed=' + report.probed + ' · mode=' + report.mode);
    if (health) {
      console.log('[G-6] AF-1 · HTTP ' + health.httpStatus + ' · ' + health.bytes + ' B · sha256=' + health.sha256);
      console.log('[G-6] AF-1 · ' + JSON.stringify(report.claims['AF-1']));
    }
    if (confianza) {
      console.log('[G-6] U13  · HTTP ' + confianza.httpStatus + ' · ' + confianza.bytes + ' B · sha256=' + confianza.sha256);
      console.log('[G-6] U13  · cache-control="' + confianza.cacheControl + '" · markers=' + JSON.stringify(confianza.markers));
    }
    for (const failure of failures) console.log('[FAIL] ' + failure);
    if (report.ledger_write) console.log('[G-6] ledger: ' + JSON.stringify(report.ledger_write));
    console.log('SUMMARY ' + JSON.stringify({ exit_code: report.exit_code, verdict: report.verdict, failures: failures.length }));
  }

  process.exit(verified ? 0 : 1);
}

main().catch((error) => {
  console.error('[G-6][FATAL] ' + (error instanceof Error ? error.stack : String(error)));
  process.exit(2);
});
