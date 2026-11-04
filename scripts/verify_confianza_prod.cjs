#!/usr/bin/env node
/**
 * scripts/verify_confianza_prod.cjs
 *
 * Sonda HTTP sobre https://www.productoraear.com/confianza (ORDER Ω-001).
 * Exige:
 *  - HTTP 200
 *  - 0 tokens prohibidos: source=missing, probed=false, Modo SIMULADO, 0 fila(s) vigente(s)
 *  - Presencia de source=live y Modo REAL
 *  - >= 1 fila vigente
 *  - SHA-256 calculado e impreso en stdout
 */
'use strict';

const crypto = require('node:crypto');

const PROD_URL = 'https://www.productoraear.com/confianza';

async function main() {
  const ts = new Date().toISOString();
  const res = await fetch(PROD_URL, { headers: { 'Cache-Control': 'no-cache' } });
  const html = await res.text();
  const bytes = Buffer.byteLength(html, 'utf8');
  const sha256 = crypto.createHash('sha256').update(html, 'utf8').digest('hex');

  const forbidden = ['source=missing', 'probed=false', 'Modo SIMULADO', '0 fila(s) vigente(s)'];
  const hitForbidden = forbidden.filter((tok) => html.includes(tok));
  const hasLive = html.includes('source=live');
  const hasReal = html.includes('Modo REAL');
  const rowsMatch = html.match(/(\d+)\s+fila\(s\)\s+vigente\(s\)/i);
  const rows = rowsMatch ? Number(rowsMatch[1]) : (hasLive ? 1 : 0);

  const ok = res.status === 200 && hitForbidden.length === 0 && hasLive && hasReal && rows >= 1;

  console.log(JSON.stringify({
    HTTP_STATUS: res.status,
    BYTES: bytes,
    SHA256: sha256,
    ROWS: rows,
    SOURCE: hasLive ? 'live' : 'missing_or_simulated',
    TS: ts,
    FORBIDDEN_HITS: hitForbidden,
    OK: ok
  }, null, 2));

  process.exit(ok ? 0 : 1);
}

main().catch((err) => {
  console.error('[verify_confianza_prod][FATAL]', err);
  process.exit(2);
});

