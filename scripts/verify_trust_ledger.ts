#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFY TRUST LEDGER — Puerta de la página U13 `/confianza`
 * ════════════════════════════════════════════════════════════════════════════
 * Cierra el agujero que convierte un registro de pruebas en decoración: el
 * ledger existía, pero nadie lo ejecutaba. Este gate se niega a dar verde si:
 *
 *   1. La página `src/app/(public)/confianza/page.tsx` no existe (G-0).
 *   2. La ruta no está publicada en `src/app/sitemap.ts` (huérfana = invisible).
 *   3. Hay una FACHADA activa en el ledger (§4: bloquea el deploy).
 *   4. Alguna fila `VERIFICADO` fue degradada por quíntupla incompleta (EP-1).
 *   5. El ledger tiene anomalías de formato, no se puede leer o está vacío:
 *      un registro vacío no prueba nada y no puede pasar por verde (AF-5).
 *   6. La página no es alcanzable desde el sitio: `SovereignFooter` debe enlazar
 *      `/confianza` en sus DOS variantes (funnel limpio y footer completo).
 *   7. La ruta no puede retirarse en < 10 min: `next.config.ts` debe declarar
 *      `source: "/confianza"` con `Cache-Control` acotado (JUR-5).
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_trust_ledger.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_trust_ledger.ts --json
 *
 * Exit: 0 → registro íntegro y sin fachadas · 1 → bloqueado · 2 → fatal
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { readEvidenceLedger, type EvidenceState } from '../src/lib/evidence/evidence-ledger';

const ROOT = process.cwd();
const PAGE_RELATIVE_PATH = 'src/app/(public)/confianza/page.tsx';
const SITEMAP_RELATIVE_PATH = 'src/app/sitemap.ts';
const EXPECTED_ROUTE = '/confianza';
const FOOTER_RELATIVE_PATH = 'src/app/components/layout/SovereignFooter.tsx';
const NEXT_CONFIG_RELATIVE_PATH = 'next.config.ts';
const FOOTER_HREF = 'href="/confianza"';
const CACHE_HEADER_TOKEN = 's-maxage=300';

const jsonMode = process.argv.includes('--json');

interface Check {
  id: string;
  ok: boolean;
  detail: string;
}

function readRelative(relativePath: string): string | null {
  const absolute = path.join(ROOT, relativePath);
  if (!existsSync(absolute)) return null;
  try {
    return readFileSync(absolute, 'utf8');
  } catch {
    return null;
  }
}

function main(): void {
  const checks: Check[] = [];

  const page = readRelative(PAGE_RELATIVE_PATH);
  checks.push(page === null
    ? { id: 'G0_PAGE', ok: false, detail: `No existe ${PAGE_RELATIVE_PATH}` }
    : { id: 'G0_PAGE', ok: true, detail: `${PAGE_RELATIVE_PATH} (${page.length} B)` });

  if (page !== null) {
    const usesClient = /['"]use client['"]/.test(page);
    checks.push(usesClient
      ? { id: 'STATIC_SERVER_COMPONENT', ok: false, detail: 'La página declara "use client": el ledger debe leerse en build' }
      : { id: 'STATIC_SERVER_COMPONENT', ok: true, detail: 'Server Component sin "use client"' });
  }

  const sitemap = readRelative(SITEMAP_RELATIVE_PATH);
  checks.push(sitemap !== null && sitemap.includes(EXPECTED_ROUTE)
    ? { id: 'SITEMAP', ok: true, detail: `${EXPECTED_ROUTE} publicada en sitemap.ts` }
    : { id: 'SITEMAP', ok: false, detail: `${EXPECTED_ROUTE} no aparece en ${SITEMAP_RELATIVE_PATH}` });

  const footer = readRelative(FOOTER_RELATIVE_PATH);
  const footerLinks = footer === null ? 0 : footer.split(FOOTER_HREF).length - 1;
  checks.push(footer === null
    ? { id: 'FOOTER_LINK', ok: false, detail: `No existe ${FOOTER_RELATIVE_PATH}` }
    : footerLinks >= 2
      ? { id: 'FOOTER_LINK', ok: true, detail: `${footerLinks} enlaces a ${EXPECTED_ROUTE} (funnel limpio + footer completo)` }
      : { id: 'FOOTER_LINK', ok: false, detail: `Solo ${footerLinks} enlace(s) a ${EXPECTED_ROUTE}: una de las dos variantes del footer queda huérfana` });

  const nextConfig = readRelative(NEXT_CONFIG_RELATIVE_PATH);
  const declaresSource = nextConfig !== null && new RegExp(`source:\\s*["']${EXPECTED_ROUTE}["']`).test(nextConfig);
  const declaresCache = nextConfig !== null && nextConfig.includes(CACHE_HEADER_TOKEN);
  checks.push(declaresSource && declaresCache
    ? { id: 'CACHE_HEADER', ok: true, detail: `${EXPECTED_ROUTE} declara ${CACHE_HEADER_TOKEN} (declarativo: G-6 debe confirmarlo en producción)` }
    : { id: 'CACHE_HEADER', ok: false, detail: `Falta la regla de ${EXPECTED_ROUTE} en ${NEXT_CONFIG_RELATIVE_PATH} (source=${declaresSource} · ${CACHE_HEADER_TOKEN}=${declaresCache})` });

  const ledger = readEvidenceLedger(ROOT);

  checks.push(ledger.source === 'live'
    ? { id: 'LEDGER_READ', ok: true, detail: `${ledger.ledgerPath} · ${ledger.ledgerBytes ?? 0} B · sha256=${ledger.ledgerSha256 ?? '—'}` }
    : { id: 'LEDGER_READ', ok: false, detail: `Ledger no leído (source=${ledger.source})` });

  checks.push(ledger.activeClaims.length > 0
    ? { id: 'LEDGER_NOT_EMPTY', ok: true, detail: `${ledger.activeClaims.length} fila(s) vigente(s)` }
    : { id: 'LEDGER_NOT_EMPTY', ok: false, detail: 'Registro vacío: no prueba nada' });

  const facades = ledger.activeClaims.filter((claim) => claim.state === 'FACHADA').map((claim) => claim.id);
  checks.push(facades.length === 0
    ? { id: 'NO_FACADE', ok: true, detail: '0 fachadas activas' }
    : { id: 'NO_FACADE', ok: false, detail: `FACHADA activa: ${facades.join(', ')}` });

  const degraded = ledger.activeClaims.filter((claim) => claim.downgraded).map((claim) => claim.id);
  checks.push(degraded.length === 0
    ? { id: 'QUINTUPLA', ok: true, detail: 'Todas las filas VERIFICADO llevan cmd+exit+url+sha256+ts' }
    : { id: 'QUINTUPLA', ok: false, detail: `Filas degradadas por quíntupla incompleta: ${degraded.join(', ')}` });

  checks.push(ledger.anomalies.length === 0
    ? { id: 'LEDGER_FORMAT', ok: true, detail: '0 anomalías de formato' }
    : { id: 'LEDGER_FORMAT', ok: false, detail: `${ledger.anomalies.length} anomalía(s): línea ${ledger.anomalies.map((a) => a.line).join(', ')}` });

  const counts: Record<EvidenceState, number> = ledger.counts;
  const failures = checks.filter((check) => !check.ok);

  if (jsonMode) {
    console.log(JSON.stringify({
      exit_code: failures.length === 0 ? 0 : 1,
      checks,
      counts,
      ledgerSha256: ledger.ledgerSha256,
      ledgerUpdatedAt: ledger.ledgerUpdatedAt,
      blockReasons: ledger.blockReasons,
    }));
  } else {
    console.log(`[CONFIANZA] Ledger: ${ledger.ledgerPath} · ${ledger.ledgerBytes ?? 0} B · sha256=${ledger.ledgerSha256 ?? '—'}`);
    console.log(`[CONFIANZA] Estados vigentes: VERIFICADO=${counts.VERIFICADO} · SOSPECHOSO=${counts.SOSPECHOSO} · FACHADA=${counts.FACHADA} · SIN_EVIDENCIA=${counts.SIN_EVIDENCIA}`);
    for (const check of checks) {
      console.log(`${check.ok ? '[OK]  ' : '[FAIL]'} ${check.id}: ${check.detail}`);
    }
    if (ledger.blockReasons.length > 0) {
      console.log('');
      for (const reason of ledger.blockReasons) console.log(`[BLOQUEO] ${reason}`);
    }
    console.log('');
    console.log(`SUMMARY ${JSON.stringify({
      exit_code: failures.length === 0 ? 0 : 1,
      rows: ledger.activeClaims.length,
      facades: facades.length,
      degraded: degraded.length,
      anomalies: ledger.anomalies.length,
      checks: checks.length,
      failed: failures.map((check) => check.id),
    })}`);
  }

  process.exit(failures.length === 0 ? 0 : 1);
}

try {
  main();
} catch (error) {
  const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  console.error(`[CONFIANZA][FATAL] ${detail}`);
  process.exit(2);
}
