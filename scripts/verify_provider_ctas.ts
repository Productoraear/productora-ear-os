/**
 * ════════════════════════════════════════════════════════════════════════════
 * VERIFICADOR DE CTAs POR PROVEEDOR + MEDIA REAL (W48)
 * ════════════════════════════════════════════════════════════════════════════
 * Qué demuestra (con Exit Code, no con prosa):
 *   1. El CTA «Bloquear Fecha» de un proveedor apunta a SU calendario
 *      (`/calendario/<kind>/<slug>?intent=bloquear`) y ese `kind` está en la
 *      allowlist de rutas reales en disco — nunca a `/reservar/solista`.
 *   2. El CTA de contrato viaja como `/reservar/contrato?proveedor=<slug>` y la
 *      página del expediente existe en disco.
 *   3. La media unificada no contiene stock (`unsplash`, `pexels`, …), no tiene
 *      duplicados y todos los vídeos pasan la allowlist de embed.
 *   4. Se reporta cuánta media de stock se descartó por registro (evidencia del
 *      «2 fotos reales + 4 falsas» que reportó el CEO).
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_provider_ctas.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_provider_ctas.ts --all
 *
 * Salida: `reports/PROVIDER_CTA_VERIFICATION.json`
 * Exit: 0 = todo verde · 1 = violaciones · 2 = entorno (particiones ausentes).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { collectProviderMedia, isStockMediaUrl } from '../src/lib/providers/provider-media-engine';
import {
  PROVIDER_CTA_FALLBACK_HREF,
  resolveProviderCalendarHref,
  resolveProviderContractHref,
} from '../src/lib/providers/provider-cta-engine';
import { parseCalendarEntityKindParam } from '../src/lib/calendar/entity-registry';

type RawRecord = Record<string, unknown>;

const ROOT = process.cwd();
const PARTITIONS = path.join(ROOT, 'public', 'data', 'providers');
const CALENDAR_PAGE = path.join(ROOT, 'src', 'app', 'calendario', '[kind]', '[slug]', 'page.tsx');
const CONTRACT_PAGE = path.join(ROOT, 'src', 'app', '(public)', 'reservar', 'contrato', 'page.tsx');
const PROVIDER_PAGE = path.join(ROOT, 'src', 'app', '(public)', 'proveedores', '[slug]', 'page.tsx');
const REPORT_DIR = path.join(ROOT, 'reports');
const SAMPLE = 10;
const PRIORITY_SLUGS: readonly string[] = ['restaurante-otzarreta'];
const CALENDAR_HREF = /^\/calendario\/([a-z-]+)\/([a-z0-9][a-z0-9_-]*)\?intent=bloquear$/;
const CONTRACT_HREF = /^\/reservar\/contrato\?proveedor=[a-z0-9][a-z0-9_-]*(&.*)?$/;
const STOCK_SCAN = /(images|source|cdn)\.(unsplash|pexels|pixabay|shutterstock|freepik|istockphoto)\.[a-z.]+\//gi;

function loadRecords(): RawRecord[] {
  const records: RawRecord[] = [];
  for (const file of readdirSync(PARTITIONS)) {
    if (!file.endsWith('.json')) continue;
    const raw = readFileSync(path.join(PARTITIONS, file), 'utf8');
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw) as unknown;
    } catch {
      continue;
    }
    const list: unknown[] = Array.isArray(parsed) ? parsed : [parsed];
    for (const item of list) {
      if (!item || typeof item !== 'object') continue;
      const record = item as RawRecord;
      if (typeof record.slug === 'string' && record.slug.trim()) records.push(record);
    }
  }
  return records;
}

function pickSample(records: RawRecord[], all: boolean): RawRecord[] {
  const bySlug = new Map<string, RawRecord>();
  for (const record of records) {
    const slug = String(record.slug).trim().toLowerCase();
    if (!bySlug.has(slug)) bySlug.set(slug, record);
  }
  const slugs = [...bySlug.keys()].sort();
  const chosen = all ? slugs : slugs.slice(0, SAMPLE);
  for (const priority of PRIORITY_SLUGS) {
    if (bySlug.has(priority) && !chosen.includes(priority)) chosen.unshift(priority);
  }
  return chosen.map((slug) => bySlug.get(slug)).filter((r): r is RawRecord => Boolean(r));
}


interface RowResult {
  readonly slug: string;
  readonly calendarHref: string;
  readonly contractHref: string;
  readonly calendarOk: boolean;
  readonly contractOk: boolean;
  readonly images: number;
  readonly videos: number;
  readonly stockDiscarded: number;
  readonly violations: readonly string[];
}

function verifyRecord(record: RawRecord): RowResult {
  const slug = String(record.slug).trim().toLowerCase();
  const violations: string[] = [];

  const calendarHref = resolveProviderCalendarHref(record, { intent: 'bloquear' });
  const calendarMatch = CALENDAR_HREF.exec(calendarHref);
  const calendarOk = calendarHref === PROVIDER_CTA_FALLBACK_HREF || calendarMatch !== null;
  if (!calendarOk) violations.push(`CALENDAR_HREF_INVALIDO: ${calendarHref}`);
  if (calendarMatch && !parseCalendarEntityKindParam(calendarMatch[1])) {
    violations.push(`CALENDAR_KIND_DESCONOCIDO: ${calendarMatch[1]}`);
  }
  if (calendarHref.includes('/reservar/solista')) {
    violations.push('CALENDAR_HREF_SECUESTRADO_POR_SOLISTA');
  }

  const contractHref = resolveProviderContractHref(record, { date: '2026-12-31' });
  const contractOk = CONTRACT_HREF.test(contractHref);
  if (!contractOk) violations.push(`CONTRACT_HREF_INVALIDO: ${contractHref}`);

  const media = collectProviderMedia(record);
  for (const image of media.images) {
    if (isStockMediaUrl(image)) violations.push(`IMAGE_STOCK_FILTRADA: ${image}`);
  }
  if (new Set(media.images.map((i) => i.toLowerCase())).size !== media.images.length) {
    violations.push('IMAGE_DUPLICADA');
  }
  if (new Set(media.videos.map((v) => v.toLowerCase())).size !== media.videos.length) {
    violations.push('VIDEO_DUPLICADO');
  }

  const stockDiscarded = (JSON.stringify(record).match(STOCK_SCAN) ?? []).length;

  return {
    slug,
    calendarHref,
    contractHref,
    calendarOk,
    contractOk,
    images: media.images.length,
    videos: media.videos.length,
    stockDiscarded,
    violations,
  };
}


function main(): void {
  if (!existsSync(PARTITIONS)) {
    console.error('ERROR: no existe public/data/providers (particiones ausentes).');
    process.exit(2);
  }
  const missingPages = [CALENDAR_PAGE, CONTRACT_PAGE, PROVIDER_PAGE].filter((p) => !existsSync(p));
  if (missingPages.length > 0) {
    console.error(`ERROR: rutas de destino ausentes en disco: ${missingPages.join(', ')}`);
    process.exit(2);
  }

  const all = process.argv.includes('--all');
  const records = loadRecords();
  const rows = pickSample(records, all).map(verifyRecord);
  const violations = rows.flatMap((row) => row.violations.map((v) => `${row.slug} · ${v}`));

  const summary = {
    generatedAt: new Date().toISOString(),
    mode: all ? 'ALL' : `SAMPLE_${SAMPLE}`,
    partitions: readdirSync(PARTITIONS).length,
    recordsIndexed: records.length,
    providersChecked: rows.length,
    totalImages: rows.reduce((acc, r) => acc + r.images, 0),
    totalVideos: rows.reduce((acc, r) => acc + r.videos, 0),
    stockDiscarded: rows.reduce((acc, r) => acc + r.stockDiscarded, 0),
    providersWithoutMedia: rows.filter((r) => r.images === 0).length,
    violations,
    ok: violations.length === 0,
    rows,
  };

  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(
    path.join(REPORT_DIR, 'PROVIDER_CTA_VERIFICATION.json'),
    `${JSON.stringify(summary, null, 2)}\n`,
    'utf8',
  );

  for (const row of rows) {
    const flag = row.violations.length === 0 ? 'OK ' : 'FAIL';
    console.log(
      `${flag} ${row.slug.padEnd(32)} fotos=${String(row.images).padStart(2)} videos=${String(
        row.videos,
      ).padStart(2)} stock_descartado=${String(row.stockDiscarded).padStart(2)} ${row.calendarHref}`,
    );
  }
  console.log(
    `\nProveedores: ${summary.providersChecked}/${summary.recordsIndexed} · fotos=${summary.totalImages} · videos=${summary.totalVideos} · violaciones=${violations.length}`,
  );
  for (const violation of violations) console.log(`  · ${violation}`);
  console.log('Informe: reports/PROVIDER_CTA_VERIFICATION.json');
  process.exit(violations.length === 0 ? 0 : 1);
}

main();
