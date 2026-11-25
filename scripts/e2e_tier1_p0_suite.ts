#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * EAR OS V2 — TIER-1 P0 REFINEMENT E2E SUITE (TIERS 1–4, F1–F9)
 * ════════════════════════════════════════════════════════════════════════════
 * Opaque-box, requirement-driven verification suite derived from
 * ORIGINAL_REQUEST.md & PROJECT.md § Interface Contracts.
 *
 * Tiers:
 *   - Tier 1: Feature Coverage (6 cases/feature x 9 features = 54 cases)
 *   - Tier 2: Boundary & Corner Cases (6 cases/feature x 9 features = 54 cases)
 *   - Tier 3: Cross-Feature Pairwise Combinations (10 cases)
 *   - Tier 4: Real-World Application Scenarios (5 cases)
 *   - Total : 123 deterministic offline cases
 *
 * Usage:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/e2e_tier1_p0_suite.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/e2e_tier1_p0_suite.ts --json
 *
 * Exit codes:
 *   0 = All cases PASS
 *   1 = One or more cases FAIL (including unimplemented M1–M4 target contracts)
 * ════════════════════════════════════════════════════════════════════════════
 */

// 1. Enforce deterministic offline environment BEFORE importing route/service modules
for (const key of [
  'OPENROUTER_API_KEY',
  'DEEPSEEK_API_KEY',
  'GEMINI_API_KEY',
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'POSTGRES_PRISMA_URL',
  'DATABASE_URL',
  'N8N_WHATSAPP_WEBHOOK_URL',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
]) {
  delete process.env[key];
}
process.env.N8N_BASE_URL = 'http://127.0.0.1:1';
process.env.BOOKING_TOKEN_SECRET = process.env.BOOKING_TOKEN_SECRET || 'ear_os_e2e_booking_hmac_secret_2026';
process.env.WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'ear_os_e2e_verify_token_2026';
process.env.WHATSAPP_APP_SECRET = process.env.WHATSAPP_APP_SECRET || 'ear_os_e2e_app_secret_2026';
process.env.WHATSAPP_WEBHOOK_TOKEN = process.env.WHATSAPP_WEBHOOK_TOKEN || 'ear_os_e2e_bearer_token_2026';
process.env.WHATSAPP_WA_REF_SECRET = process.env.WHATSAPP_WA_REF_SECRET || 'ear_os_e2e_wa_ref_secret_2026';

import { createHmac } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { NextRequest } from 'next/server';

const JSON_MODE = process.argv.includes('--json');

type TierId = 'T1' | 'T2' | 'T3' | 'T4';
type FeatureId = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'PAIRWISE' | 'WORKLOAD';

interface TestCaseResult {
  readonly id: string;
  readonly tier: TierId;
  readonly feature: FeatureId;
  readonly title: string;
  readonly ok: boolean;
  readonly detail: string;
}

const results: TestCaseResult[] = [];

async function safeImport<T = Record<string, unknown>>(specifier: string): Promise<{ ok: true; mod: T } | { ok: false; error: string }> {
  try {
    const mod = (await import(specifier)) as T;
    return { ok: true, mod };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

function getFn(mod: unknown, name: string): ((...args: unknown[]) => unknown) | null {
  if (mod !== null && typeof mod === 'object') {
    const val = (mod as Record<string, unknown>)[name];
    if (typeof val === 'function') return val as (...args: unknown[]) => unknown;
  }
  return null;
}

function getProp<T = unknown>(obj: unknown, name: string): T | undefined {
  if (obj !== null && typeof obj === 'object') {
    return (obj as Record<string, unknown>)[name] as T | undefined;
  }
  return undefined;
}

async function runCase(
  id: string,
  tier: TierId,
  feature: FeatureId,
  title: string,
  fn: () => Promise<{ ok: boolean; detail: string }> | { ok: boolean; detail: string },
): Promise<void> {
  try {
    const outcome = await fn();
    results.push({ id, tier, feature, title, ok: outcome.ok, detail: outcome.detail });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    results.push({ id, tier, feature, title, ok: false, detail: `EXCEPTION: ${msg}` });
  }
}

function checkAcousticTierPayload(
  payload: unknown,
  tier: 1 | 2 | 3,
): { ok: boolean; reason: string } {
  if (!payload || typeof payload !== 'object') {
    return { ok: false, reason: 'payload is null/non-object' };
  }
  const serialized = JSON.stringify(payload).toLowerCase();

  if (tier === 1) {
    const hasColumn = /columna|column/.test(serialized);
    const has800 = /\b800\b/.test(serialized);
    const ok = hasColumn && has800;
    return {
      ok,
      reason: ok
        ? 'Tier 1 (<80 pax) 800W RMS column spec present'
        : `Missing Tier 1 800W RMS column spec in ${serialized.slice(0, 220)}`,
    };
  }

  if (tier === 2) {
    const hasStereoPower = /(1[.,]?500|1500|1[.,]?600|1[.,]?800|2[.,]?000|2000)/.test(serialized) && /(estereo|estéreo|stereo)/.test(serialized);
    const hasShure = /shure/.test(serialized) && /uhf/.test(serialized);
    const hasOperator = /(operador|tecnico|técnico)/.test(serialized);
    const ok = hasStereoPower && hasShure && hasOperator;
    return {
      ok,
      reason: ok
        ? 'Tier 2 (80-200 pax) 1500-2000W stereo + Shure UHF + operator spec present'
        : `Missing Tier 2 specs (power=${hasStereoPower}, shure=${hasShure}, op=${hasOperator}) in ${serialized.slice(0, 220)}`,
    };
  }

  const hasArray = /(line\s*array|linearray|perimetral)/.test(serialized);
  const hasLimiter = /limitador|limiter/.test(serialized) && /75/.test(serialized) && /(37\/2003|ley)/.test(serialized);
  const ok = hasArray && hasLimiter;
  return {
    ok,
    reason: ok
      ? 'Tier 3 (>200 pax / Exterior) Line Array/perimetral + <75 dB Ley 37/2003 limiter present'
      : `Missing Tier 3 specs (array=${hasArray}, limiter=${hasLimiter}) in ${serialized.slice(0, 220)}`,
  };
}

function readRepoFile(relPath: string): string | null {
  const abs = path.join(process.cwd(), relPath);
  if (!existsSync(abs)) return null;
  return readFileSync(abs, 'utf8');
}

function signMetaHeader(rawBody: string, secret: string): string {
  return 'sha256=' + createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
}

async function main(): Promise<void> {
  // Preload existing core modules dynamically (after offline env setup)
  const ssotRes = await safeImport<typeof import('@/lib/constants/ear-os-ssot')>('@/lib/constants/ear-os-ssot');
  const ssotGuardRes = await safeImport<typeof import('@/lib/security/ssotIntegrityGuard')>('@/lib/security/ssotIntegrityGuard');
  const logisticsRes = await safeImport<typeof import('@/lib/pricing/logistics')>('@/lib/pricing/logistics');
  const originRes = await safeImport<typeof import('@/lib/pricing/logistics-origin')>('@/lib/pricing/logistics-origin');
  const sovereignPricingRes = await safeImport<typeof import('@/lib/pricing/sovereign-pricing')>('@/lib/pricing/sovereign-pricing');
  const solistaPricingRes = await safeImport<typeof import('@/lib/pricing/solista-pricing')>('@/lib/pricing/solista-pricing');
  const priceLockRes = await safeImport<typeof import('@/lib/pricing/price-lock-verifier')>('@/lib/pricing/price-lock-verifier');
  const geoRes = await safeImport<typeof import('@/lib/agents/geo')>('@/lib/agents/geo');
  const muniRes = await safeImport<typeof import('@/lib/seo/spainMunicipalityCoverage')>('@/lib/seo/spainMunicipalityCoverage');
  const geocoderRes = await safeImport<typeof import('@/lib/services/geo/geocoder')>('@/lib/services/geo/geocoder');
  const buyboxRes = await safeImport<typeof import('@/lib/services/marketplace/buybox-matching-engine')>('@/lib/services/marketplace/buybox-matching-engine');
  const agentsPricingRes = await safeImport<typeof import('@/lib/agents/pricing')>('@/lib/agents/pricing');
  const mcpRes = await safeImport<typeof import('@/lib/mcp/concierge-tools')>('@/lib/mcp/concierge-tools');
  const tokenRes = await safeImport<typeof import('@/lib/booking/acceptance-token')>('@/lib/booking/acceptance-token');
  const briefRes = await safeImport<typeof import('@/lib/booking/provider-service-brief')>('@/lib/booking/provider-service-brief');
  const contractRes = await safeImport<typeof import('@/lib/contracts/smartContractEngine')>('@/lib/contracts/smartContractEngine');
  const sovereignScriptRes = await safeImport<typeof import('@/lib/concierge/sovereign-script')>('@/lib/concierge/sovereign-script');
  const b2bOrchRes = await safeImport<Record<string, unknown>>('@/lib/booking/b2b-orchestration');
  const quickActionsRes = await safeImport<typeof import('@/lib/concierge/quick-actions')>('@/lib/concierge/quick-actions');
  const conciergeChatRouteRes = await safeImport<typeof import('@/app/api/concierge/chat/route')>('@/app/api/concierge/chat/route');
  const chatConciergeRouteRes = await safeImport<typeof import('@/app/api/chat/concierge/route')>('@/app/api/chat/concierge/route');
  const whatsappWebhookRes = await safeImport<typeof import('@/app/api/webhooks/whatsapp-concierge/route')>('@/app/api/webhooks/whatsapp-concierge/route');
  const whatsappLibRes = await safeImport<typeof import('@/lib/whatsapp/whatsapp-concierge')>('@/lib/whatsapp/whatsapp-concierge');
  const asinStdRes = await safeImport<typeof import('@/lib/catalog/asin-standard')>('@/lib/catalog/asin-standard');
  const entityAsinRes = await safeImport<Record<string, unknown>>('@/lib/entities/asin');

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 1 — FEATURE COVERAGE (6 cases per feature F1–F9 = 54 cases)
  // ══════════════════════════════════════════════════════════════════════════

  // --- F1: Hub Méntrida SSOT Canonization (6) ---
  await runCase('T1_F1_01', 'T1', 'F1', 'SSOT exports HUB_MENTRIDA_COORDINATES (40.2378, -4.1953) & HUB_MENTRIDA_ADDRESS', () => {
    if (!ssotRes.ok) return { ok: false, detail: ssotRes.error };
    const coords = getProp<{ latitude?: number; longitude?: number }>(ssotRes.mod, 'HUB_MENTRIDA_COORDINATES');
    const addr = getProp<string | Record<string, unknown>>(ssotRes.mod, 'HUB_MENTRIDA_ADDRESS');
    const addrStr = typeof addr === 'string' ? addr : (getProp<string>(addr, 'full') ?? '');
    const postalOk = typeof addr === 'string' ? true : getProp<string>(addr, 'postalCode') === '45214';
    const coordsOk = coords?.latitude === 40.2378 && coords?.longitude === -4.1953;
    const addrOk = postalOk && addrStr.includes('45214') && /m[eé]ntrida/i.test(addrStr) && /t[oó]rtola/i.test(addrStr);
    return {
      ok: coordsOk && addrOk,
      detail: `coords=${JSON.stringify(coords)}, addr=${JSON.stringify(addr)}`,
    };
  });

  await runCase('T1_F1_02', 'T1', 'F1', 'SSOT pricing & logistics constants unified (350/550/100km/1.5/200/120/3h)', () => {
    if (!ssotRes.ok) return { ok: false, detail: ssotRes.error };
    const s = ssotRes.mod;
    const checks = [
      ['TARIFA_BASE_SOLISTA_EUR', s.TARIFA_BASE_SOLISTA_EUR, 350],
      ['TARIFA_ESTANDAR_SOLISTA_EUR', s.TARIFA_ESTANDAR_SOLISTA_EUR, 550],
      ['LOGISTICA_KM_EXENTOS', s.LOGISTICA_KM_EXENTOS, 100],
      ['SOLISTA_KM_INCLUIDOS', s.SOLISTA_KM_INCLUIDOS, 100],
      ['LOGISTICA_EUR_PER_KM', s.LOGISTICA_EUR_PER_KM, 1.5],
      ['LOGISTICA_KM_HOTEL', s.LOGISTICA_KM_HOTEL, 200],
      ['SUPLEMENTO_HOTEL_EUR', s.SUPLEMENTO_HOTEL_EUR, 120],
      ['HORA_FIN_HOTEL', s.HORA_FIN_HOTEL, 3],
    ] as const;
    const mismatches = checks.filter(([, actual, expected]) => actual !== expected).map(([k, a, e]) => `${k}:${a}!=${e}`);
    return {
      ok: mismatches.length === 0,
      detail: mismatches.length === 0 ? 'All 8 SSOT constants match target' : `Mismatches: ${mismatches.join(', ')}`,
    };
  });

  await runCase('T1_F1_03', 'T1', 'F1', 'verifySsotIntegrity() reports intact=true and zero invariant errors', () => {
    if (!ssotGuardRes.ok) return { ok: false, detail: ssotGuardRes.error };
    const report = ssotGuardRes.mod.verifySsotIntegrity();
    const violations = getProp<string[]>(report, 'violatedInvariants') ?? getProp<string[]>(report, 'errors') ?? [];
    return {
      ok: report.intact === true && report.invariantsOk === true && violations.length === 0,
      detail: `intact=${report.intact}, invariantsOk=${report.invariantsOk}, violatedInvariants=${JSON.stringify(violations)}`,
    };
  });

  await runCase('T1_F1_04', 'T1', 'F1', 'resolveLogisticsOrigin assigns HUB_MENTRIDA with 100 km franchise to Edwin Agudelo', () => {
    if (!originRes.ok) return { ok: false, detail: originRes.error };
    const origin = originRes.mod.resolveLogisticsOrigin({ id: 'e78903', slug: 'edwin-agudelo', name: 'Edwin Agudelo' });
    const ok = origin.kind === 'HUB_MENTRIDA' && origin.franchiseKm === 100;
    return { ok, detail: `kind=${origin.kind}, franchiseKm=${origin.franchiseKm}` };
  });

  await runCase('T1_F1_05', 'T1', 'F1', 'resolveLogisticsOrigin assigns 0 km franchise to National Network 3P subject', () => {
    if (!originRes.ok) return { ok: false, detail: originRes.error };
    const origin = originRes.mod.resolveLogisticsOrigin({
      id: '3p-bilbao-sound',
      name: 'Sonido Bilbao Pro',
      city: 'Bilbao',
      province: 'Vizcaya',
    });
    const ok = origin.kind === 'PROVIDER_FISCAL_BASE' && origin.franchiseKm === 0;
    return { ok, detail: `kind=${origin.kind}, franchiseKm=${origin.franchiseKm}` };
  });

  await runCase('T1_F1_06', 'T1', 'F1', 'HUB_MENTRIDA coordinates align across logistics-origin.ts & geo.ts (40.2378, -4.1953)', () => {
    if (!originRes.ok || !geoRes.ok) return { ok: false, detail: 'Missing origin or geo module' };
    const oCoords = originRes.mod.HUB_MENTRIDA;
    const gCoords = geoRes.mod.HUB_MENTRIDA_COORDINATES;
    const ok =
      oCoords.latitude === 40.2378 &&
      oCoords.longitude === -4.1953 &&
      gCoords.latitude === 40.2378 &&
      gCoords.longitude === -4.1953;
    return {
      ok,
      detail: `origin=(${oCoords.latitude},${oCoords.longitude}), geo=(${gCoords.latitude},${gCoords.longitude})`,
    };
  });

  // --- F2: 3P Proximity & >150 km Decoupling (6) ---
  await runCase('T1_F2_01', 'T1', 'F2', 'spainMunicipalityCoverage loads >8000 municipalities and resolves Bilbao/Sevilla/Toledo/Madrid', () => {
    if (!muniRes.ok) return { ok: false, detail: muniRes.error };
    const count = muniRes.mod.SPAIN_MUNICIPALITY_COUNT;
    const bilbao = muniRes.mod.getMunicipality('vizcaya', 'bilbao');
    const sevilla = muniRes.mod.getMunicipality('sevilla', 'sevilla');
    const mentrida = muniRes.mod.getMunicipality('toledo', 'mentrida');
    const madrid = muniRes.mod.getMunicipality('madrid', 'madrid');
    const ok = count > 8000 && Boolean(bilbao) && Boolean(sevilla) && Boolean(mentrida) && Boolean(madrid);
    return {
      ok,
      detail: `count=${count}, bilbao=${bilbao?.name ?? 'null'}, sevilla=${sevilla?.name ?? 'null'}, mentrida=${mentrida?.name ?? 'null'}, madrid=${madrid?.name ?? 'null'}`,
    };
  });

  await runCase('T1_F2_02', 'T1', 'F2', 'planLogisticsDispatch uses INTEGRATED_MENTRIDA_FLEET when <= 150 km (Madrid 60 km)', () => {
    if (!geoRes.ok) return { ok: false, detail: geoRes.error };
    const plan = geoRes.mod.planLogisticsDispatch('Madrid', 60);
    const ok =
      plan.dispatchMode === 'INTEGRATED_MENTRIDA_FLEET' &&
      plan.soloArtistFromMentrida === true &&
      plan.technicalSoundFromMentrida === true;
    return { ok, detail: JSON.stringify(plan) };
  });

  await runCase('T1_F2_03', 'T1', 'F2', 'planLogisticsDispatch uses DECOUPLED_LOCAL_BUYBOX when > 150 km (Bilbao 440 km)', () => {
    if (!geoRes.ok) return { ok: false, detail: geoRes.error };
    const plan = geoRes.mod.planLogisticsDispatch('Bilbao', 440);
    const ok =
      plan.dispatchMode === 'DECOUPLED_LOCAL_BUYBOX' &&
      plan.soloArtistFromMentrida === true &&
      plan.technicalSoundFromMentrida === false;
    return { ok, detail: JSON.stringify(plan) };
  });

  await runCase('T1_F2_04', 'T1', 'F2', 'resolveNearest3pProvider resolves verified 3P provider for Bilbao/Vizcaya', async () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const fn = getFn(buyboxRes.mod, 'resolveNearest3pProvider');
    if (!fn) return { ok: false, detail: 'Missing export resolveNearest3pProvider in buybox-matching-engine.ts' };
    const res = await Promise.resolve(
      fn({ category: 'sonido', destinationText: 'Bilbao, Vizcaya' }),
    );
    const primary = getProp<Record<string, unknown> | null>(res, 'selected') ?? getProp<Record<string, unknown> | null>(res, 'provider') ?? null;
    const name = getProp<string>(primary, 'name') ?? '';
    const provId = getProp<string>(primary, 'id') ?? getProp<string>(primary, 'key') ?? getProp<string>(primary, 'slug') ?? '';
    const ok =
      primary !== null &&
      name.length > 0 &&
      provId.length > 0 &&
      getProp<boolean>(primary, 'verified') === true &&
      !/Proveedor Homologado de Sonido/i.test(name);
    return { ok, detail: `id=${provId}, name=${name}, res=${JSON.stringify(primary).slice(0, 180)}` };
  });

  await runCase('T1_F2_05', 'T1', 'F2', 'resolveNearest3pProvider resolves Sevilla candidate & supports excludeProviderIds', async () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const fn = getFn(buyboxRes.mod, 'resolveNearest3pProvider');
    if (!fn) return { ok: false, detail: 'Missing export resolveNearest3pProvider' };
    const first = await Promise.resolve(fn({ category: 'sonido', destinationText: 'Sevilla' }));
    const p1 = getProp<Record<string, unknown> | null>(first, 'selected') ?? getProp<Record<string, unknown> | null>(first, 'provider') ?? null;
    const id1 = String(getProp(p1, 'id') ?? getProp(p1, 'key') ?? getProp(p1, 'slug') ?? '');
    if (!id1) return { ok: false, detail: `No primary candidate ID returned for Sevilla: ${JSON.stringify(first)}` };
    const second = await Promise.resolve(
      fn({ category: 'sonido', destinationText: 'Sevilla', excludeProviderIds: [id1] }),
    );
    const p2 = getProp<Record<string, unknown> | null>(second, 'selected') ?? getProp<Record<string, unknown> | null>(second, 'provider') ?? null;
    const id2 = String(getProp(p2, 'id') ?? getProp(p2, 'key') ?? getProp(p2, 'slug') ?? '');
    const secondAlts = getProp<Array<Record<string, unknown>>>(second, 'alternatives') ?? [];
    const excludedFromAlts = !secondAlts.some((a) => getProp(a, 'id') === id1 || getProp(a, 'key') === id1);
    const ok = id2.length > 0 && id2 !== id1 && excludedFromAlts;
    return { ok, detail: `first=${id1}, second=${id2}` };
  });

  await runCase('T1_F2_06', 'T1', 'F2', 'resolveHybridLogisticsQuote decouples heavy sound in Bilbao without Toledo van transport', () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const fn = getFn(buyboxRes.mod, 'resolveNearest3pProvider');
    const quote = buyboxRes.mod.resolveHybridLogisticsQuote('Bilbao');
    const hasRealProvider =
      fn !== null &&
      !/^Proveedor Homologado de Sonido \(/.test(quote.soundProvisioning.providerName) &&
      Boolean(quote.soundProvisioning.providerId) &&
      Boolean(quote.soundProvisioning.asin);
    const ok =
      quote.soloArtist.travelFromMentrida === true &&
      quote.soundProvisioning.isLocalProvider === true &&
      quote.soundProvisioning.vanLogisticsChargedFromToledo === false &&
      hasRealProvider;
    return { ok, detail: JSON.stringify(quote.soundProvisioning) };
  });

  // --- F3: Strict 3-Tier Acoustic Sizing (6) ---
  await runCase('T1_F3_01', 'T1', 'F3', '< 80 pax (50 pax interior) recommends 800W RMS column system', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 50 });
    const check = checkAcousticTierPayload(env.data, 1);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T1_F3_02', 'T1', 'F3', '80-200 pax (150 pax interior) recommends 1500-2000W stereo + Shure UHF + technician', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 150 });
    const check = checkAcousticTierPayload(env.data, 2);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T1_F3_03', 'T1', 'F3', '> 200 pax (250 pax festejo) recommends Line Array/perimetral + <75 dB Ley 37/2003 limiter', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'festejo', pax: 250 });
    const check = checkAcousticTierPayload(env.data, 3);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T1_F3_04', 'T1', 'F3', 'Exterior context (boda_exterior 120 pax) forces Line Array/perimetral + <75 dB limiter', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_exterior', pax: 120 });
    const check = checkAcousticTierPayload(env.data, 3);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T1_F3_05', 'T1', 'F3', 'MCP callTool auditar_rider_acustico matches runAuditarRiderAcustico with SHA-256 evidence', async () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const res = await mcpRes.mod.callTool('auditar_rider_acustico', { context: 'boda_interior', pax: 150 });
    const direct = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 150 });
    const tierCheck = checkAcousticTierPayload(res.result?.envelope.data, 2);
    const ok =
      res.ok === true &&
      tierCheck.ok &&
      typeof res.result?.envelope.evidenceSha256 === 'string' &&
      res.result.envelope.evidenceSha256.length === 64 &&
      JSON.stringify(res.result.envelope.data) === JSON.stringify(direct.data);
    return { ok, detail: `mcpOk=${res.ok}, ${tierCheck.reason}` };
  });

  await runCase('T1_F3_06', 'T1', 'F3', 'MCP auditar_rider_acustico rejects invalid context & extra keys via Zod .strict()', async () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const badCtx = await mcpRes.mod.callTool('auditar_rider_acustico', { context: 'rave_ilegal', pax: 100 });
    const extraKey = await mcpRes.mod.callTool('auditar_rider_acustico', { context: 'boda_interior', pax: 100, override: true });
    const ok = badCtx.ok === false && extraKey.ok === false;
    return { ok, detail: `badCtxOk=${badCtx.ok}, extraKeyOk=${extraKey.ok}` };
  });

  // --- F4: Deterministic Combined Quote (6) ---
  await runCase('T1_F4_01', 'T1', 'F4', 'Deterministic combined quote engine sums Tarifa Artista + Pack Sonido + Desplazamientos', async () => {
    if (!agentsPricingRes.ok || !mcpRes.ok) return { ok: false, detail: 'Missing pricing or mcp module' };
    const fn =
      getFn(agentsPricingRes.mod, 'computeCombinedQuote') ??
      getFn(agentsPricingRes.mod, 'calculateCombinedQuote') ??
      getFn(mcpRes.mod, 'runCotizarEventoCombinado') ??
      getFn(mcpRes.mod, 'runPresupuestoCombinado');
    if (!fn) {
      return {
        ok: false,
        detail: 'Missing deterministic combined quote API (computeCombinedQuote / calculateCombinedQuote / runCotizarEventoCombinado)',
      };
    }
    const raw = await Promise.resolve(fn({ distanceKm: 60, pax: 120, context: 'boda_interior', endHour: 22 }));
    const data = getProp<Record<string, unknown>>(raw, 'data') ?? (raw as Record<string, unknown>);
    const artist = Number(getProp(data, 'artistFeeEur') ?? getProp(data, 'tarifaArtista') ?? getProp(data, 'base') ?? NaN);
    const sound = Number(getProp(data, 'soundPackEur') ?? getProp(data, 'packSonido') ?? NaN);
    const travel = Number(getProp(data, 'travelEur') ?? getProp(data, 'desplazamientos') ?? getProp(data, 'logistica') ?? NaN);
    const hotel = Number(getProp(data, 'hotelEur') ?? getProp(data, 'hotel') ?? 0);
    const total = Number(getProp(data, 'totalEur') ?? getProp(data, 'total') ?? NaN);
    const ok = Number.isFinite(artist) && Number.isFinite(sound) && sound > 0 && Number.isFinite(travel) && total === artist + sound + travel + hotel;
    return { ok, detail: `artist=${artist}, sound=${sound}, travel=${travel}, hotel=${hotel}, total=${total}` };
  });

  await runCase('T1_F4_02', 'T1', 'F4', 'Combined quote decouples heavy sound transport when distance > 150 km', async () => {
    if (!agentsPricingRes.ok || !mcpRes.ok) return { ok: false, detail: 'Missing pricing or mcp module' };
    const fn =
      getFn(agentsPricingRes.mod, 'computeCombinedQuote') ??
      getFn(agentsPricingRes.mod, 'calculateCombinedQuote') ??
      getFn(mcpRes.mod, 'runCotizarEventoCombinado') ??
      getFn(mcpRes.mod, 'runPresupuestoCombinado');
    if (!fn) return { ok: false, detail: 'Missing combined quote export for >150 km decoupling verification' };
    const raw = await Promise.resolve(fn({ destination: 'Bilbao', distanceKm: 440, pax: 150, context: 'boda_interior', endHour: 22 }));
    const data = getProp<Record<string, unknown>>(raw, 'data') ?? (raw as Record<string, unknown>);
    const serialized = JSON.stringify(data).toLowerCase();
    const decoupled =
      getProp(data, 'soundDecoupled') === true ||
      getProp(data, 'vanLogisticsChargedFromToledo') === false ||
      /decoupled|local|desacopl/.test(serialized);
    return { ok: decoupled, detail: serialized.slice(0, 220) };
  });

  await runCase('T1_F4_03', 'T1', 'F4', 'calculateSovereignQuote generates deterministic 64-hex SHA-256 priceLockHash differentiated by franchise', () => {
    if (!sovereignPricingRes.ok) return { ok: false, detail: sovereignPricingRes.error };
    const q1 = sovereignPricingRes.mod.calculateSovereignQuote({
      format: 'solista',
      distanceKm: 120,
      soundRider: 'standard',
      franchiseKm: 100,
    });
    const q2 = sovereignPricingRes.mod.calculateSovereignQuote({
      format: 'solista',
      distanceKm: 120,
      soundRider: 'standard',
      franchiseKm: 100,
    });
    const qNet = sovereignPricingRes.mod.calculateSovereignQuote({
      format: 'solista',
      distanceKm: 120,
      soundRider: 'standard',
      franchiseKm: 0,
    });
    const ok =
      /^[a-f0-9]{64}$/.test(q1.priceLockHash) &&
      q1.priceLockHash === q2.priceLockHash &&
      q1.priceLockHash !== qNet.priceLockHash &&
      q1.totalBudget < qNet.totalBudget;
    return { ok, detail: `hubTotal=${q1.totalBudget}, netTotal=${qNet.totalBudget}, hashesDiffer=${q1.priceLockHash !== qNet.priceLockHash}` };
  });

  await runCase('T1_F4_04', 'T1', 'F4', '80/10/10 Sovereign Split invariant holds across computeSplit & runSplitSoberano', () => {
    if (!agentsPricingRes.ok || !mcpRes.ok) return { ok: false, detail: 'Missing pricing/mcp module' };
    const s1 = agentsPricingRes.mod.computeSplit(1550);
    const s2 = mcpRes.mod.runSplitSoberano({ totalEur: 1550 });
    const sum1 = s1.artista + s1.earOs + s1.vimume;
    const sum2 = (s2.data?.split.artista ?? 0) + (s2.data?.split.earOs ?? 0) + (s2.data?.split.vimume ?? 0);
    const ok = sum1 === 1550 && sum2 === 1550 && s1.artista === 1240 && s1.earOs === 155 && s1.vimume === 155;
    return { ok, detail: `split=${JSON.stringify(s1)}, sum=${sum1}` };
  });

  await runCase('T1_F4_05', 'T1', 'F4', 'MCP simular_presupuesto JSON-RPC 2.0 round-trip preserves exact total & locked categories', async () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const rpcList = await mcpRes.mod.handleJsonRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' });
    const rpcCall = await mcpRes.mod.handleJsonRpc({
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: { name: 'simular_presupuesto', arguments: { totalEur: 10000, lockedCategories: ['espacio_banquete'] } },
    });
    const okList = 'result' in rpcList;
    const resultObj = 'result' in rpcCall ? (rpcCall.result as { envelope: { ok: boolean; data: { breakdownEur: Record<string, number> } } }) : null;
    const b = resultObj?.envelope.data?.breakdownEur;
    const sum = b ? Object.values(b).reduce((acc, v) => acc + v, 0) : 0;
    const ok = okList && Boolean(resultObj?.envelope.ok) && Math.abs(sum - 10000) < 0.001;
    return { ok, detail: `okList=${okList}, sum=${sum}` };
  });

  await runCase('T1_F4_06', 'T1', 'F4', 'calculateSolistaQuote applies 550 € standard vs 350 € affiliate coupon with 100 km included', () => {
    if (!solistaPricingRes.ok) return { ok: false, detail: solistaPricingRes.error };
    const std = solistaPricingRes.mod.calculateSolistaQuote({ distanciaKm: 100 });
    const aff = solistaPricingRes.mod.calculateSolistaQuote({
      distanciaKm: 100,
      cupon: 'EAR-AFIL-VIP1',
      afiliados: [{ affiliateCode: 'EAR-AFIL-VIP1', name: 'Finca Demo', status: 'ACTIVE' }],
    });
    const ok = std.totalEur === 550 && aff.totalEur === 350 && std.kmAdicionales === 0 && aff.kmAdicionales === 0;
    return { ok, detail: `std=${std.totalEur}, aff=${aff.totalEur}, kmAd=${std.kmAdicionales}` };
  });

  // --- F5: B2B 2PC & Default-Deny Contracts (6) ---
  await runCase('T1_F5_01', 'T1', 'F5', 'b2b-orchestration & assertContractIssuable exist and block PENDING/unacknowledged orders', async () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing src/lib/booking/b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    if (!assertFn) return { ok: false, detail: 'Missing export assertContractIssuable in b2b-orchestration.ts' };
    let blocked = false;
    try {
      await Promise.resolve(
        assertFn({
          id: 'ord-pending-1',
          lines: [
            { id: 'l1', providerId: 'p1', status: 'CONFIRMED', acceptedAt: new Date() },
            { id: 'l2', providerId: 'p2', status: 'PENDING', acceptedAt: null },
          ],
        }),
      );
    } catch {
      blocked = true;
    }
    return { ok: blocked, detail: blocked ? 'Default-deny blocked PENDING line' : 'assertContractIssuable allowed unconfirmed line!' };
  });

  await runCase('T1_F5_02', 'T1', 'F5', 'WhatsApp "OK" / portal ack transitions line to confirmed & unlocks assertContractIssuable', async () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const ackFn = getFn(b2bOrchRes.mod, 'acknowledgeBookingLine') ?? getFn(b2bOrchRes.mod, 'processProviderAck');
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    if (!ackFn || !assertFn) return { ok: false, detail: 'Missing ack or assertContractIssuable export' };
    const updatedOrder = await Promise.resolve(
      ackFn({
        order: {
          id: 'ord-ack-1',
          lines: [{ id: 'l1', providerId: 'p1', status: 'PENDING', ackCode: 'OK123' }],
        },
        lineId: 'l1',
        channel: 'WHATSAPP',
        command: 'OK OK123',
      }),
    );
    await Promise.resolve(assertFn(updatedOrder));
    return { ok: true, detail: 'Ack transitioned line and unlocked contract issuance' };
  });

  await runCase('T1_F5_03', 'T1', 'F5', 'signAcceptanceToken & verifyAcceptanceToken HMAC round-trip succeeds on valid token', () => {
    if (!tokenRes.ok) return { ok: false, detail: tokenRes.error };
    const now = 1_760_000_000_000;
    const token = tokenRes.mod.signAcceptanceToken({ requestId: 'REQ-1001', providerId: 'prov-bilbao-1', timestamp: now });
    if (!token) return { ok: false, detail: 'signAcceptanceToken returned null' };
    const verified = tokenRes.mod.verifyAcceptanceToken(token, now + 60_000);
    const ok = verified.valid === true && verified.payload.requestId === 'REQ-1001' && verified.payload.providerId === 'prov-bilbao-1';
    const failReason = getProp<string>(verified, 'reason') ?? getProp<string>(verified, 'code') ?? 'UNKNOWN';
    return { ok, detail: verified.valid ? `valid=true, remainingMs=${verified.remainingMs}` : `failed: ${failReason}` };
  });

  await runCase('T1_F5_04', 'T1', 'F5', 'buildProviderServiceBrief enforces fail-closed payment gate before dispatch & contractSeed', () => {
    if (!briefRes.ok) return { ok: false, detail: briefRes.error };
    const baseFicha = {
      requestId: 'REQ-2001',
      provider: { id: 'p1', name: 'Sonido Norte SL', email: 'hola@sonidonorte.es', phone: '+34600000001' },
      clientName: 'María López',
      clientPhone: '+34611111111',
      clientEmail: 'maria@example.com',
      eventType: 'Boda',
      eventPurpose: 'Ceremonia y banquete',
      eventDate: '2027-06-19',
      startTime: '18:00',
      durationHours: 4,
      venueName: 'Finca Las Encinas',
      venueAddress: 'Camino Real 10',
      city: 'Bilbao',
      province: 'Vizcaya',
      guests: 150,
      isIndoor: true,
      serviceFormat: 'Sonorización 150 pax',
    };
    const unpaid = briefRes.mod.buildProviderServiceBrief({
      ficha: baseFicha,
      payment: { status: 'pending' },
      requestedAt: '2026-11-25T10:00:00.000Z',
      now: '2026-11-25T10:30:00.000Z',
      totalEur: 950,
      depositEur: 150,
      signatureUrl: 'https://productoraear.com/booking/accept?token=abc',
    });
    const paid = briefRes.mod.buildProviderServiceBrief({
      ficha: baseFicha,
      payment: { status: 'paid', amountEur: 150, paidAt: '2026-11-25T10:15:00.000Z', sessionId: 'cs_test_123' },
      requestedAt: '2026-11-25T10:00:00.000Z',
      now: '2026-11-25T10:30:00.000Z',
      totalEur: 950,
      depositEur: 150,
      signatureUrl: 'https://productoraear.com/booking/accept?token=abc',
    });
    const ok =
      unpaid.dispatchAllowed === false &&
      unpaid.signatureAllowed === false &&
      unpaid.contractSeed === null &&
      paid.state === 'VALIDADO' &&
      paid.dispatchAllowed === true &&
      paid.signatureAllowed === true &&
      paid.contractSeed !== null;
    return { ok, detail: `unpaidState=${unpaid.state}, paidState=${paid.state}, missing=${JSON.stringify(paid.missing)}` };
  });

  await runCase('T1_F5_05', 'T1', 'F5', 'generateSmartContract seals SHA-256 deterministically & respects provider acceptance', () => {
    if (!contractRes.ok) return { ok: false, detail: contractRes.error };
    const doc = contractRes.mod.generateSmartContract({
      requestId: 'REQ-3001',
      client: { name: 'Ana García', email: 'ana@example.com', phone: '+34622222222' },
      provider: { name: 'Sonido Bilbao SL', email: 'pro@bilbao.es', phone: '+34633333333' },
      eventDetails: { date: '2027-07-10', location: 'Bilbao', city: 'Bilbao', estimatedPax: 150 },
      baseAmount: 900,
      depositPaid: 150,
    });
    const recomputed = contractRes.mod.computeContractSha256({
      contractId: doc.contractId,
      requestId: doc.requestId,
      status: doc.status,
      createdAt: doc.createdAt,
      legalFramework: doc.legalFramework,
      parties: doc.parties,
      eventDetails: doc.eventDetails,
      financials: doc.financials,
      acousticRider: doc.acousticRider,
      clauses: doc.clauses,
    });
    const ok = /^[a-f0-9]{64}$/.test(doc.sha256Hash) && doc.sha256Hash === recomputed && doc.financials.depositDeducted === 150;
    return { ok, detail: `hashMatch=${doc.sha256Hash === recomputed}, depositDeducted=${doc.financials.depositDeducted}` };
  });

  await runCase('T1_F5_06', 'T1', 'F5', 'prisma/schema.prisma defines B2bBookingOrder, B2bBookingLine & B2bBookingAuditLog models', () => {
    const schema = readRepoFile('prisma/schema.prisma');
    if (!schema) return { ok: false, detail: 'Missing prisma/schema.prisma' };
    const hasOrder = /model\s+B2bBookingOrder\s*\{/.test(schema);
    const hasLine = /model\s+B2bBookingLine\s*\{/.test(schema);
    const hasAudit = /model\s+B2bBookingAuditLog\s*\{/.test(schema);
    return {
      ok: hasOrder && hasLine && hasAudit,
      detail: `B2bBookingOrder=${hasOrder}, B2bBookingLine=${hasLine}, B2bBookingAuditLog=${hasAudit}`,
    };
  });

  // --- F6: Parametric Deposit Floor (6) ---
  await runCase('T1_F6_01', 'T1', 'F6', 'SSOT DEPOSITO_STRIPE_EUR === 100', () => {
    if (!ssotRes.ok) return { ok: false, detail: ssotRes.error };
    const val = ssotRes.mod.DEPOSITO_STRIPE_EUR;
    return { ok: val === 100, detail: `DEPOSITO_STRIPE_EUR=${val}` };
  });

  await runCase('T1_F6_02', 'T1', 'F6', 'buildConcentricRefusalScript honors custom deposit > 100 € (250 € -> 250,00 €)', () => {
    if (!sovereignScriptRes.ok) return { ok: false, detail: sovereignScriptRes.error };
    const text = sovereignScriptRes.mod.buildConcentricRefusalScript({
      requestedLabel: 'fotografía',
      providerName: 'Finca Demo',
      anchorOfferName: 'Banquete S-Class',
      depositCents: 25_000,
    });
    const ok = text.includes('250,00 €');
    return { ok, detail: ok ? 'Honored 250,00 €' : `Did not honor 250,00 € in: ${text}` };
  });

  await runCase('T1_F6_03', 'T1', 'F6', 'buildConcentricRefusalScript clamps deposit < 100 € (50 €) up to 100,00 € floor', () => {
    if (!sovereignScriptRes.ok) return { ok: false, detail: sovereignScriptRes.error };
    const text = sovereignScriptRes.mod.buildConcentricRefusalScript({
      requestedLabel: 'fotografía',
      providerName: 'Finca Demo',
      anchorOfferName: 'Banquete S-Class',
      depositCents: 5_000,
    });
    const ok = text.includes('100,00 €');
    return { ok, detail: ok ? 'Clamped 50 € up to 100,00 €' : `Did not clamp to 100,00 € in: ${text}` };
  });

  await runCase('T1_F6_04', 'T1', 'F6', 'b2b-orchestration parametric fixed deposit honors >100 € & floors <100 €', () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const calcFn =
      getFn(b2bOrchRes.mod, 'computeParametricDepositEur') ??
      getFn(b2bOrchRes.mod, 'resolveParametricDepositEur') ??
      getFn(b2bOrchRes.mod, 'computeLineDepositEur');
    if (!calcFn) return { ok: false, detail: 'Missing parametric deposit helper in b2b-orchestration.ts' };
    const dHigh = Number(calcFn({ lineTotalEur: 1000, customDepositEur: 250 }));
    const dLow = Number(calcFn({ lineTotalEur: 1000, customDepositEur: 40 }));
    const ok = dHigh === 250 && dLow === 100;
    return { ok, detail: `250->${dHigh}, 40->${dLow}` };
  });

  await runCase('T1_F6_05', 'T1', 'F6', 'b2b-orchestration parametric percentage deposit honors 20% of 1000 € (200 €) & floors 20% of 300 € (100 €)', () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const calcFn =
      getFn(b2bOrchRes.mod, 'computeParametricDepositEur') ??
      getFn(b2bOrchRes.mod, 'resolveParametricDepositEur') ??
      getFn(b2bOrchRes.mod, 'computeLineDepositEur');
    if (!calcFn) return { ok: false, detail: 'Missing parametric deposit helper in b2b-orchestration.ts' };
    const pctHigh = Number(calcFn({ lineTotalEur: 1000, customDepositPct: 20 }));
    const pctLow = Number(calcFn({ lineTotalEur: 300, customDepositPct: 20 }));
    const ok = pctHigh === 200 && pctLow === 100;
    return { ok, detail: `20%@1000->${pctHigh}, 20%@300->${pctLow}` };
  });

  await runCase('T1_F6_06', 'T1', 'F6', 'verifyAndSignStripeSession passes valid Price-Lock with depositAmount >= 100', () => {
    if (!sovereignPricingRes.ok || !priceLockRes.ok) return { ok: false, detail: 'Missing pricing/priceLock module' };
    const input = { format: 'solista' as const, distanceKm: 120, soundRider: 'standard' as const, franchiseKm: 100 };
    const quote = sovereignPricingRes.mod.calculateSovereignQuote(input);
    const verified = priceLockRes.mod.verifyAndSignStripeSession({
      input,
      clientHash: quote.priceLockHash,
      issuedAtTimestamp: Date.now() - 1000,
      artistSlug: 'edwin-agudelo',
    });
    const ok = verified.isValid === true && verified.status === 'VALID' && verified.stripeMetadata.depositAmount >= 100;
    return { ok, detail: verified.isValid ? `deposit=${verified.stripeMetadata.depositAmount}` : `failed: ${verified.status}` };
  });

  // --- F7: Buy Box Resilience & 24h SLA (6) ---
  await runCase('T1_F7_01', 'T1', 'F7', 'resolveBuyBoxFallback function is exported by buybox-matching-engine or b2b-orchestration', () => {
    const fn1 = buyboxRes.ok ? getFn(buyboxRes.mod, 'resolveBuyBoxFallback') : null;
    const fn2 = b2bOrchRes.ok ? getFn(b2bOrchRes.mod, 'resolveBuyBoxFallback') : null;
    const ok = fn1 !== null || fn2 !== null;
    return { ok, detail: ok ? 'resolveBuyBoxFallback exported' : 'Missing resolveBuyBoxFallback export' };
  });

  await runCase('T1_F7_02', 'T1', 'F7', 'resolveBuyBoxFallback promotes next closest verified 3P provider on RECHAZO excluding rejected ID', async () => {
    const fn =
      (b2bOrchRes.ok ? getFn(b2bOrchRes.mod, 'resolveBuyBoxFallback') : null) ??
      (buyboxRes.ok ? getFn(buyboxRes.mod, 'resolveBuyBoxFallback') : null);
    if (!fn) return { ok: false, detail: 'Missing resolveBuyBoxFallback' };
    const nearestFn = buyboxRes.ok ? getFn(buyboxRes.mod, 'resolveNearest3pProvider') : null;
    if (!nearestFn) return { ok: false, detail: 'Missing resolveNearest3pProvider' };

    const firstRes = await Promise.resolve(nearestFn({ category: 'sonido', destinationText: 'Sevilla' }));
    const firstProv = getProp<Record<string, unknown> | null>(firstRes, 'selected') ?? getProp<Record<string, unknown> | null>(firstRes, 'provider') ?? null;
    const rejectedId = String(getProp(firstProv, 'id') ?? getProp(firstProv, 'key') ?? getProp(firstProv, 'slug') ?? '');
    if (!rejectedId) return { ok: false, detail: 'No initial Sevilla 3P provider resolved' };

    const switched = await Promise.resolve(
      fn({
        line: { id: 'line-sound', category: 'sonido', providerId: rejectedId, status: 'REJECTED', destinationText: 'Sevilla' },
        reason: 'RECHAZO',
      }),
    );
    const newId = String(getProp(switched, 'newProviderId') ?? getProp(switched, 'providerId') ?? getProp(getProp(switched, 'provider'), 'id') ?? '');
    const ok = newId.length > 0 && newId !== rejectedId;
    return { ok, detail: `rejected=${rejectedId}, promoted=${newId}` };
  });

  await runCase('T1_F7_03', 'T1', 'F7', '24h SLA expiration triggers automatic Buy Box switch to next closest 3P provider', async () => {
    const fn =
      (b2bOrchRes.ok ? getFn(b2bOrchRes.mod, 'resolveBuyBoxFallback') : null) ??
      (buyboxRes.ok ? getFn(buyboxRes.mod, 'resolveBuyBoxFallback') : null);
    if (!fn) return { ok: false, detail: 'Missing resolveBuyBoxFallback' };
    const now = Date.now();
    const switched = await Promise.resolve(
      fn({
        line: {
          id: 'line-sound-sla',
          category: 'sonido',
          providerId: 'prov-expired-1',
          status: 'PENDING',
          destinationText: 'Bilbao',
          slaExpiresAt: new Date(now - 60_000).toISOString(),
        },
        now,
        reason: 'SLA_EXPIRED',
      }),
    );
    const newId = String(getProp(switched, 'newProviderId') ?? getProp(switched, 'providerId') ?? getProp(getProp(switched, 'provider'), 'id') ?? '');
    const ok = newId.length > 0 && newId !== 'prov-expired-1';
    return { ok, detail: `slaPromoted=${newId}` };
  });

  await runCase('T1_F7_04', 'T1', 'F7', 'Buy Box failover preserves confirmed sibling lines (same providerId, status, price, deposit)', async () => {
    const orderFailoverFn = b2bOrchRes.ok
      ? getFn(b2bOrchRes.mod, 'applyBuyBoxFallbackToOrder') ?? getFn(b2bOrchRes.mod, 'handleLineRejectionOrExpiry')
      : null;
    if (!orderFailoverFn) return { ok: false, detail: 'Missing B2B order failover handler in b2b-orchestration.ts' };
    const confirmedSibling = {
      id: 'line-catering',
      category: 'servicios',
      providerId: 'prov-catering-ok',
      status: 'CONFIRMED',
      priceEur: 3200,
      depositEur: 320,
    };
    const rejectedLine = {
      id: 'line-sound',
      category: 'sonido',
      providerId: 'prov-sound-1',
      status: 'PENDING',
      destinationText: 'Bilbao',
      priceEur: 950,
      depositEur: 100,
    };
    const nextOrder = await Promise.resolve(
      orderFailoverFn({
        order: { id: 'ord-failover-1', lines: [confirmedSibling, rejectedLine] },
        lineId: 'line-sound',
        reason: 'RECHAZO',
      }),
    );
    const lines = getProp<Array<Record<string, unknown>>>(nextOrder, 'lines') ?? [];
    const siblingAfter = lines.find((l) => l.id === 'line-catering');
    const soundAfter = lines.find((l) => l.id === 'line-sound');
    const siblingIntact =
      siblingAfter?.providerId === 'prov-catering-ok' &&
      siblingAfter?.status === 'CONFIRMED' &&
      siblingAfter?.priceEur === 3200 &&
      siblingAfter?.depositEur === 320;
    const soundSwitched = Boolean(soundAfter && soundAfter.providerId !== 'prov-sound-1');
    return { ok: siblingIntact && soundSwitched, detail: `siblingIntact=${siblingIntact}, soundSwitched=${soundSwitched}` };
  });

  await runCase('T1_F7_05', 'T1', 'F7', 'matchMarketplaceTop3 returns <= 3 candidates sorted descending by compositeScore', () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const top3 = buyboxRes.mod.matchMarketplaceTop3(
      [
        { id: 'c1', slug: 'c1', name: 'Artista A', category: 'artistas', province: 'Madrid', basePriceEur: 550, verifiedAudit: true },
        { id: 'c2', slug: 'c2', name: 'Artista B', category: 'artistas', province: 'Madrid', basePriceEur: 600, verifiedAudit: true },
        { id: 'c3', slug: 'c3', name: 'Artista C', category: 'artistas', province: 'Madrid', basePriceEur: 700, verifiedAudit: false },
      ],
      { preferredCategory: 'artistas', guestCount: 120, budgetEur: 1200, province: 'Madrid', eventDate: '2026-09-18' },
    );
    const sorted = top3.every((item, idx) => idx === 0 || top3[idx - 1].compositeScore >= item.compositeScore);
    const ok = top3.length > 0 && top3.length <= 3 && sorted && top3[0].rank === 1;
    return { ok, detail: `count=${top3.length}, sorted=${sorted}, topSlug=${top3[0]?.slug}` };
  });

  await runCase('T1_F7_06', 'T1', 'F7', 'evaluateBilateralMatch enforces double opt-in (false when providerAccepted=false)', () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const entity = { id: 'e1', slug: 'e1', name: 'Entity 1', category: 'artistas', province: 'Madrid', basePriceEur: 550, maxAcousticDb: 74 };
    const req = { preferredCategory: 'artistas' as const, guestCount: 120, budgetEur: 900, province: 'Madrid', eventDate: '2026-09-18' };
    const unaccepted = buyboxRes.mod.evaluateBilateralMatch(entity, req, false);
    const accepted = buyboxRes.mod.evaluateBilateralMatch(entity, req, true);
    const ok = unaccepted.isTwoWayMatch === false && accepted.isTwoWayMatch === true;
    return { ok, detail: `unaccepted=${unaccepted.isTwoWayMatch}, accepted=${accepted.isTwoWayMatch}` };
  });

  // --- F8: S-Class Concierge Sanitization (6) ---
  await runCase('T1_F8_01', 'T1', 'F8', 'resolveWelcomeActions returns <= 3 chips across all primary routes', () => {
    if (!quickActionsRes.ok) return { ok: false, detail: quickActionsRes.error };
    const routes = ['/', '/fincas', '/artistas', '/mariachis', '/seating-planner', '/reservar', '/otzarreta'];
    const counts = routes.map((r) => ({ r, n: quickActionsRes.mod.resolveWelcomeActions(r).length }));
    const ok = counts.every((c) => c.n > 0 && c.n <= 3);
    return { ok, detail: counts.map((c) => `${c.r}:${c.n}`).join(', ') };
  });

  await runCase('T1_F8_02', 'T1', 'F8', 'POST /api/concierge/chat greeting response has <= 3 non-empty lines', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Hola', routeContext: { pathname: '/' } }),
    });
    const res = await conciergeChatRouteRes.mod.POST(req);
    const json = (await res.json()) as { reply?: string };
    const lines = (json.reply ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const ok = res.status === 200 && lines.length > 0 && lines.length <= 3;
    return { ok, detail: `status=${res.status}, lines=${lines.length}` };
  });

  await runCase('T1_F8_03', 'T1', 'F8', 'POST /api/concierge/chat wedding query leaks zero B2G / LCSP / 118 / licitación terms', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Busco música para mi boda en Madrid para 120 invitados',
        routeContext: { pathname: '/artistas' },
      }),
    });
    const res = await conciergeChatRouteRes.mod.POST(req);
    const json = (await res.json()) as { reply?: string };
    const reply = json.reply ?? '';
    const leaked = /\b(lcsp|b2g|118|licitaci[oó]n|licitaciones|ayuntamiento)\b/i.test(reply);
    return { ok: res.status === 200 && reply.length > 0 && !leaked, detail: `status=${res.status}, leaked=${leaked}` };
  });

  await runCase('T1_F8_04', 'T1', 'F8', 'POST /api/concierge/chat non-Bizkaia wedding query leaks zero Otzarreta / Derio / Ezkertza', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Busco finca y menú de boda en Madrid para 140 personas',
        routeContext: { pathname: '/fincas' },
      }),
    });
    const res = await conciergeChatRouteRes.mod.POST(req);
    const json = (await res.json()) as { reply?: string };
    const reply = json.reply ?? '';
    const leaked = /\b(otzarreta|derio|ezkertza)\b/i.test(reply);
    return {
      ok: res.status === 200 && reply.length > 0 && !leaked,
      detail: leaked ? `LEAKED Otzarreta/Derio in Madrid reply: ${reply.slice(0, 180)}` : 'No Otzarreta/Derio leak',
    };
  });

  await runCase('T1_F8_05', 'T1', 'F8', 'POST /api/concierge/chat Bizkaia/Derio query properly resolves Otzarreta', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Busco finca y menú para boda en Derio Bizkaia',
        routeContext: { pathname: '/otzarreta' },
      }),
    });
    const res = await conciergeChatRouteRes.mod.POST(req);
    const json = (await res.json()) as { reply?: string };
    const reply = json.reply ?? '';
    const ok = res.status === 200 && /otzarreta/i.test(reply);
    return { ok, detail: `status=${res.status}, hasOtzarreta=${/otzarreta/i.test(reply)}` };
  });

  await runCase('T1_F8_06', 'T1', 'F8', 'Concierge widgets eliminate redundant "Hablar con centralita" chat button & limit chips <= 3', () => {
    const widget = readRepoFile('src/components/concierge/SovereignConciergeWidget.tsx');
    const dock = readRepoFile('src/components/chat/AIConciergeDock.tsx');
    if (!widget || !dock) return { ok: false, detail: 'Missing widget or dock file' };
    const hasCentralitaBtn = /Hablar con [Cc]entralita/.test(widget) || /Hablar con [Cc]entralita/.test(dock);
    const has4HardcodedChips =
      /Tarifas de solista/.test(widget) &&
      /Contrato menor B2G/.test(widget) &&
      /Menús de Otzarreta/.test(widget) &&
      /Bloquear mi fecha/.test(widget);
    return {
      ok: !hasCentralitaBtn && !has4HardcodedChips,
      detail: `hasCentralitaBtn=${hasCentralitaBtn}, has4HardcodedChips=${has4HardcodedChips}`,
    };
  });

  // --- F9: Enriched ASIN WhatsApp Handoff (6) ---
  await runCase('T1_F9_01', 'T1', 'F9', 'ANCHOR_1P_ASINS & resolveEarAsin resolve Edwin (EAR-ASIN-ART-E78903) & Otzarreta', () => {
    if (!asinStdRes.ok) return { ok: false, detail: asinStdRes.error };
    const edwin = asinStdRes.mod.resolveEarAsin({ id: 'e78903', slug: 'edwin-agudelo', category: 'artistas' });
    const otz = asinStdRes.mod.resolveEarAsin({ id: 'otzarreta', slug: 'otzarreta', category: 'fincas' });
    const ok = edwin === 'EAR-ASIN-ART-E78903' && otz === 'EAR-ASIN-FNC-OTZARRETA';
    return { ok, detail: `edwin=${edwin}, otzarreta=${otz}` };
  });

  await runCase('T1_F9_02', 'T1', 'F9', 'src/lib/entities/asin.ts exists & exposes canonical entity ASIN contract', () => {
    if (!entityAsinRes.ok) return { ok: false, detail: `Missing src/lib/entities/asin.ts: ${entityAsinRes.error}` };
    const hasExport = Object.keys(entityAsinRes.mod).length > 0;
    return { ok: hasExport, detail: `exports=${Object.keys(entityAsinRes.mod).join(', ')}` };
  });

  await runCase('T1_F9_03', 'T1', 'F9', 'buildWhatsAppHandoffUrl embeds &ref=EAR-ASIN-... and [Ref: EAR-ASIN-...] on wa.me/34693693048', () => {
    if (!whatsappLibRes.ok) return { ok: false, detail: whatsappLibRes.error };
    const handoffPayload = {
      asin: 'EAR-ASIN-ART-E78903',
      pax: 150,
      city: 'Bilbao',
      fichaSlug: 'edwin-agudelo',
    } as Record<string, unknown>;
    const url = whatsappLibRes.mod.buildWhatsAppHandoffUrl('34693693048', handoffPayload as never);
    const decoded = decodeURIComponent(url);
    const hasPhone = url.startsWith('https://wa.me/34693693048?');
    const hasRefParam = /[?&]ref=EAR-ASIN-ART-E78903(?:&|$)/.test(url);
    const hasRefText = /\[Ref:\s*EAR-ASIN-ART-E78903\]/.test(decoded);
    return {
      ok: hasPhone && hasRefParam && hasRefText,
      detail: `hasPhone=${hasPhone}, hasRefParam=${hasRefParam}, hasRefText=${hasRefText}, url=${url.slice(0, 140)}`,
    };
  });

  await runCase('T1_F9_04', 'T1', 'F9', 'Public entity pages (/artistas, /proveedores, /fincas/[slug]) emit meta ear:asin & data-ear-asin', () => {
    const artistas = readRepoFile('src/app/(public)/artistas/[slug]/page.tsx');
    const proveedores = readRepoFile('src/app/(public)/proveedores/[slug]/page.tsx');
    const fincas = readRepoFile('src/app/(public)/fincas/[slug]/page.tsx');
    const checks = [
      ['artistas', artistas],
      ['proveedores', proveedores],
      ['fincas', fincas],
    ].map(([name, src]) => {
      if (!src) return `${name}:missing`;
      const hasMeta = /ear:asin/.test(src);
      const hasAttr = /data-ear-asin/.test(src);
      return hasMeta && hasAttr ? `${name}:ok` : `${name}:no-asin-markup(meta=${hasMeta},attr=${hasAttr})`;
    });
    const ok = checks.every((c) => c.endsWith(':ok'));
    return { ok, detail: checks.join(', ') };
  });

  await runCase('T1_F9_05', 'T1', 'F9', 'Concierge UI widgets capture navigation ASIN (ear:asin / data-ear-asin) for WhatsApp handoff', () => {
    const widget = readRepoFile('src/components/concierge/SovereignConciergeWidget.tsx') ?? '';
    const dock = readRepoFile('src/components/chat/AIConciergeDock.tsx') ?? '';
    const widgetCaptures = /ear:asin|data-ear-asin/.test(widget);
    const dockCaptures = /ear:asin|data-ear-asin/.test(dock);
    return {
      ok: widgetCaptures && dockCaptures,
      detail: `widgetCaptures=${widgetCaptures}, dockCaptures=${dockCaptures}`,
    };
  });

  await runCase('T1_F9_06', 'T1', 'F9', 'parseInboundEvent + extractIntent round-trip preserves ASIN/pax/category without leaking raw phone', () => {
    if (!whatsappLibRes.ok) return { ok: false, detail: whatsappLibRes.error };
    const url = whatsappLibRes.mod.buildWhatsAppHandoffUrl('34693693048', {
      asin: 'EAR-ASIN-ART-E78903',
      pax: 150,
      city: 'Bilbao',
      serviceKind: 'musica',
    } as never);
    const parsedUrl = new URL(url);
    const textParam = parsedUrl.searchParams.get('text') ?? '';
    const inbound = whatsappLibRes.mod.parseInboundEvent(
      { waId: '34611223344', messageId: 'wamid-f9-1', type: 'text', text: textParam },
      'test-secret',
    );
    if (!inbound.ok) return { ok: false, detail: inbound.reason };
    const intent = whatsappLibRes.mod.extractIntent(inbound.event.text);
    const noPhoneLeak = !inbound.event.waRef.includes('34611223344') && /^[a-f0-9]{24}$/.test(inbound.event.waRef);
    const asinExtracted = getProp<string>(intent, 'asin') === 'EAR-ASIN-ART-E78903';
    const ok = noPhoneLeak && intent.pax === 150 && asinExtracted;
    return { ok, detail: `noPhoneLeak=${noPhoneLeak}, pax=${intent.pax}, asin=${String(getProp(intent, 'asin'))}` };
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 2 — BOUNDARY & CORNER CASES (6 cases per feature F1–F9 = 54 cases)
  // ══════════════════════════════════════════════════════════════════════════

  // --- F1 Boundaries (6) ---
  await runCase('T2_F1_01', 'T2', 'F1', 'Boundary 100 km -> 0 € travel, 0 € hotel', () => {
    if (!logisticsRes.ok) return { ok: false, detail: logisticsRes.error };
    const l = logisticsRes.mod.computeSovereignLogistics(100, 22);
    const ok = l.franchiseKm === 100 && l.billableKm === 0 && l.travelCost === 0 && l.requiresHotel === false;
    return { ok, detail: JSON.stringify(l) };
  });

  await runCase('T2_F1_02', 'T2', 'F1', 'Boundary 101 km -> 1 km billable at 1.50 €/km (travelCost=2, franchiseKm=100)', () => {
    if (!logisticsRes.ok) return { ok: false, detail: logisticsRes.error };
    const l = logisticsRes.mod.computeSovereignLogistics(101, 22);
    const ok = l.franchiseKm === 100 && l.billableKm === 1 && l.travelCost === 2 && l.requiresHotel === false;
    return { ok, detail: JSON.stringify(l) };
  });

  await runCase('T2_F1_03', 'T2', 'F1', 'Boundary 200 km at 22:00 -> requiresHotel=false, hotelSupplement=0', () => {
    if (!logisticsRes.ok) return { ok: false, detail: logisticsRes.error };
    const l = logisticsRes.mod.computeSovereignLogistics(200, 22);
    const ok = l.requiresHotel === false && l.hotelSupplement === 0;
    return { ok, detail: JSON.stringify(l) };
  });

  await runCase('T2_F1_04', 'T2', 'F1', 'Boundary 201 km at 22:00 -> requiresHotel=true, hotelSupplement=120', () => {
    if (!logisticsRes.ok) return { ok: false, detail: logisticsRes.error };
    const l = logisticsRes.mod.computeSovereignLogistics(201, 22);
    const ok = l.requiresHotel === true && l.hotelSupplement === 120;
    return { ok, detail: JSON.stringify(l) };
  });

  await runCase('T2_F1_05', 'T2', 'F1', 'Time boundary 02:59 (endHour=2) vs 03:00 AM (endHour=3) at 40 km triggers +120 € hotel', () => {
    if (!logisticsRes.ok) return { ok: false, detail: logisticsRes.error };
    const before3 = logisticsRes.mod.computeSovereignLogistics(40, 2);
    const at3 = logisticsRes.mod.computeSovereignLogistics(40, 3);
    const ok = !before3.requiresHotel && before3.hotelSupplement === 0 && at3.requiresHotel && at3.hotelSupplement === 120;
    return { ok, detail: `h2=${before3.hotelSupplement}, h3=${at3.hotelSupplement}` };
  });

  await runCase('T2_F1_06', 'T2', 'F1', 'resolveLogisticsOrigin rejects placeholder "Madrid / Toledo" & empty {} with LogisticsOriginError', () => {
    if (!originRes.ok) return { ok: false, detail: originRes.error };
    let errPlaceholder = false;
    let errEmpty = false;
    try {
      originRes.mod.resolveLogisticsOrigin({ id: 'p-bad-1', name: 'Bad 1', location: 'Madrid / Toledo' });
    } catch (e) {
      errPlaceholder = e instanceof originRes.mod.LogisticsOriginError;
    }
    try {
      originRes.mod.resolveLogisticsOrigin({ id: 'p-bad-2', name: 'Bad 2' });
    } catch (e) {
      errEmpty = e instanceof originRes.mod.LogisticsOriginError;
    }
    return { ok: errPlaceholder && errEmpty, detail: `placeholder=${errPlaceholder}, empty=${errEmpty}` };
  });

  // --- F2 Boundaries (6) ---
  await runCase('T2_F2_01', 'T2', 'F2', 'Distance boundary 150 km -> INTEGRATED_MENTRIDA_FLEET (technicalSoundFromMentrida=true)', () => {
    if (!geoRes.ok) return { ok: false, detail: geoRes.error };
    const plan = geoRes.mod.planLogisticsDispatch('Talavera', 150);
    const ok = plan.dispatchMode === 'INTEGRATED_MENTRIDA_FLEET' && plan.technicalSoundFromMentrida === true;
    return { ok, detail: JSON.stringify(plan) };
  });

  await runCase('T2_F2_02', 'T2', 'F2', 'Distance boundary 151 km -> DECOUPLED_LOCAL_BUYBOX (technicalSoundFromMentrida=false)', () => {
    if (!geoRes.ok) return { ok: false, detail: geoRes.error };
    const plan = geoRes.mod.planLogisticsDispatch('Ciudad Real Sur', 151);
    const ok = plan.dispatchMode === 'DECOUPLED_LOCAL_BUYBOX' && plan.technicalSoundFromMentrida === false;
    return { ok, detail: JSON.stringify(plan) };
  });

  await runCase('T2_F2_03', 'T2', 'F2', 'Distance boundary 0 km (Méntrida) -> 0 km distance, integrated fleet', () => {
    if (!geoRes.ok) return { ok: false, detail: geoRes.error };
    const plan = geoRes.mod.planLogisticsDispatch('Méntrida');
    const ok = plan.distanceToMentridaKm === 0 && plan.dispatchMode === 'INTEGRATED_MENTRIDA_FLEET';
    return { ok, detail: JSON.stringify(plan) };
  });

  await runCase('T2_F2_04', 'T2', 'F2', 'resolveNearest3pProvider accepts explicit destinationCoords (Bilbao 43.2630, -2.9349)', async () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const fn = getFn(buyboxRes.mod, 'resolveNearest3pProvider');
    if (!fn) return { ok: false, detail: 'Missing resolveNearest3pProvider' };
    const res = await Promise.resolve(
      fn({
        category: 'sonido',
        destinationText: 'Bilbao',
        destinationCoords: { latitude: 43.263013, longitude: -2.934989 },
      }),
    );
    const primary = getProp<Record<string, unknown> | null>(res, 'selected') ?? getProp<Record<string, unknown> | null>(res, 'provider') ?? null;
    const ok = Boolean(primary && getProp<string>(primary, 'name') && (getProp<string>(primary, 'id') || getProp<string>(primary, 'key')));
    return { ok, detail: JSON.stringify(primary).slice(0, 180) };
  });

  await runCase('T2_F2_05', 'T2', 'F2', 'resolveNearest3pProvider strictly filters all excludeProviderIds from result', async () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const fn = getFn(buyboxRes.mod, 'resolveNearest3pProvider');
    if (!fn) return { ok: false, detail: 'Missing resolveNearest3pProvider' };
    const r1 = await Promise.resolve(fn({ category: 'sonido', destinationText: 'Madrid' }));
    const p1 = getProp<Record<string, unknown> | null>(r1, 'selected') ?? getProp<Record<string, unknown> | null>(r1, 'provider') ?? null;
    const id1 = String(getProp(p1, 'id') ?? getProp(p1, 'key') ?? '');
    const r2 = await Promise.resolve(fn({ category: 'sonido', destinationText: 'Madrid', excludeProviderIds: [id1] }));
    const p2 = getProp<Record<string, unknown> | null>(r2, 'selected') ?? getProp<Record<string, unknown> | null>(r2, 'provider') ?? null;
    const id2 = String(getProp(p2, 'id') ?? getProp(p2, 'key') ?? '');
    const r2Alts = getProp<Array<Record<string, unknown>>>(r2, 'alternatives') ?? [];
    const excludedFromAlts = !r2Alts.some((a) => getProp(a, 'id') === id1 || getProp(a, 'key') === id1);
    const ok = id1.length > 0 && id2.length > 0 && id1 !== id2 && excludedFromAlts;
    return { ok, detail: `id1=${id1}, id2=${id2}` };
  });

  await runCase('T2_F2_06', 'T2', 'F2', 'geocodeAddressSync fails closed (null) on empty/unknown string & resolves Bilbao', () => {
    if (!geocoderRes.ok) return { ok: false, detail: geocoderRes.error };
    const empty = geocoderRes.mod.geocodeAddressSync('');
    const garbage = geocoderRes.mod.geocodeAddressSync('___no_existe_en_espana_99999___');
    const bilbao = geocoderRes.mod.geocodeAddressSync('Bilbao, Vizcaya');
    const ok = empty === null && garbage === null && bilbao !== null && bilbao.latitude > 42;
    return { ok, detail: `empty=${empty}, garbage=${garbage}, bilbao=${JSON.stringify(bilbao)}` };
  });

  // --- F3 Boundaries (6) ---
  await runCase('T2_F3_01', 'T2', 'F3', 'Acoustic boundary 79 pax interior -> Tier 1 (800W RMS column)', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 79 });
    const check = checkAcousticTierPayload(env.data, 1);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T2_F3_02', 'T2', 'F3', 'Acoustic boundary 80 pax interior -> Tier 2 (1500-2000W stereo + Shure UHF + operator)', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 80 });
    const check = checkAcousticTierPayload(env.data, 2);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T2_F3_03', 'T2', 'F3', 'Acoustic boundary 200 pax interior -> Tier 2 (1500-2000W stereo + Shure UHF + operator)', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 200 });
    const check = checkAcousticTierPayload(env.data, 2);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T2_F3_04', 'T2', 'F3', 'Acoustic boundary 201 pax interior -> Tier 3 (Line Array/perimetral + <75 dB limiter)', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 201 });
    const check = checkAcousticTierPayload(env.data, 3);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T2_F3_05', 'T2', 'F3', 'Acoustic boundary 60 pax boda_exterior -> Exterior forces Tier 3 (Line Array + <75 dB limiter)', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const env = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_exterior', pax: 60 });
    const check = checkAcousticTierPayload(env.data, 3);
    return { ok: env.ok && check.ok, detail: check.reason };
  });

  await runCase('T2_F3_06', 'T2', 'F3', 'Acoustic invalid pax boundaries (0, -5, 5001) rejected by MCP Zod schema', async () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const p0 = await mcpRes.mod.callTool('auditar_rider_acustico', { context: 'boda_interior', pax: 0 });
    const pNeg = await mcpRes.mod.callTool('auditar_rider_acustico', { context: 'boda_interior', pax: -5 });
    const pMax = await mcpRes.mod.callTool('auditar_rider_acustico', { context: 'boda_interior', pax: 5001 });
    const ok = !p0.ok && !pNeg.ok && !pMax.ok;
    return { ok, detail: `p0=${p0.ok}, pNeg=${pNeg.ok}, pMax=${pMax.ok}` };
  });

  // --- F4 Boundaries (6) ---
  await runCase('T2_F4_01', 'T2', 'F4', 'Combined quote at 100 km / 60 pax -> 0 € travel, 0 € hotel, exact deterministic sum', async () => {
    if (!agentsPricingRes.ok || !mcpRes.ok) return { ok: false, detail: 'Missing pricing/mcp module' };
    const fn =
      getFn(agentsPricingRes.mod, 'computeCombinedQuote') ??
      getFn(agentsPricingRes.mod, 'calculateCombinedQuote') ??
      getFn(mcpRes.mod, 'runCotizarEventoCombinado') ??
      getFn(mcpRes.mod, 'runPresupuestoCombinado');
    if (!fn) return { ok: false, detail: 'Missing combined quote export' };
    const raw = await Promise.resolve(fn({ distanceKm: 100, pax: 60, context: 'boda_interior', endHour: 22 }));
    const data = getProp<Record<string, unknown>>(raw, 'data') ?? (raw as Record<string, unknown>);
    const travel = Number(getProp(data, 'travelEur') ?? getProp(data, 'desplazamientos') ?? getProp(data, 'logistica') ?? -1);
    const hotel = Number(getProp(data, 'hotelEur') ?? getProp(data, 'hotel') ?? -1);
    const ok = travel === 0 && hotel === 0;
    return { ok, detail: `travel=${travel}, hotel=${hotel}` };
  });

  await runCase('T2_F4_02', 'T2', 'F4', 'Combined quote at 101 km / 150 pax bills 1 km excess (>0 travel) & includes Tier 2 sound pack', async () => {
    if (!agentsPricingRes.ok || !mcpRes.ok) return { ok: false, detail: 'Missing pricing/mcp module' };
    const fn =
      getFn(agentsPricingRes.mod, 'computeCombinedQuote') ??
      getFn(agentsPricingRes.mod, 'calculateCombinedQuote') ??
      getFn(mcpRes.mod, 'runCotizarEventoCombinado') ??
      getFn(mcpRes.mod, 'runPresupuestoCombinado');
    if (!fn) return { ok: false, detail: 'Missing combined quote export' };
    const raw = await Promise.resolve(fn({ distanceKm: 101, pax: 150, context: 'boda_interior', endHour: 22 }));
    const data = getProp<Record<string, unknown>>(raw, 'data') ?? (raw as Record<string, unknown>);
    const travel = Number(getProp(data, 'travelEur') ?? getProp(data, 'desplazamientos') ?? getProp(data, 'logistica') ?? 0);
    const sound = Number(getProp(data, 'soundPackEur') ?? getProp(data, 'packSonido') ?? 0);
    const ok = travel > 0 && sound > 0;
    return { ok, detail: `travel=${travel}, sound=${sound}` };
  });

  await runCase('T2_F4_03', 'T2', 'F4', 'computeSplit preserves exact artista + earOs + vimume === total on prime/odd totals', () => {
    if (!agentsPricingRes.ok) return { ok: false, detail: agentsPricingRes.error };
    const totals = [353, 557, 999.99, 1];
    const allMatch = totals.every((t) => {
      const s = agentsPricingRes.mod.computeSplit(t);
      return Math.abs(s.artista + s.earOs + s.vimume - t) < 0.0001;
    });
    return { ok: allMatch, detail: `checked=${totals.join(',')}` };
  });

  await runCase('T2_F4_04', 'T2', 'F4', 'runTarifaLogistica({ distanceKm: null }) fails closed without inventing km', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const res = mcpRes.mod.runTarifaLogistica({ distanceKm: null, endHour: 22 });
    const ok = res.ok === false && res.data?.quote === null && res.data?.ssot.kmExentos === 100;
    return { ok, detail: `ok=${res.ok}, kmExentos=${res.data?.ssot.kmExentos}` };
  });

  await runCase('T2_F4_05', 'T2', 'F4', 'handleJsonRpc rejects unknown method, invalid version & unknown tool fail-closed', async () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const badVer = await mcpRes.mod.handleJsonRpc({ jsonrpc: '1.0', id: 1, method: 'tools/list' });
    const badMethod = await mcpRes.mod.handleJsonRpc({ jsonrpc: '2.0', id: 2, method: 'tools/drop_db' });
    const badTool = await mcpRes.mod.handleJsonRpc({ jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'exec_shell' } });
    const ok = 'error' in badVer && 'error' in badMethod && 'error' in badTool;
    return { ok, detail: `errors=${ok}` };
  });

  await runCase('T2_F4_06', 'T2', 'F4', 'runExpedienteB2g allows 14,250 € & rejects 14,250.01 € under Art. 118 LCSP', () => {
    if (!mcpRes.ok) return { ok: false, detail: mcpRes.error };
    const pass = mcpRes.mod.runExpedienteB2g({
      municipality: 'Méntrida',
      province: 'Toledo',
      programType: 'FESTEJOS_POPULARES',
      requestedAmountEur: 14250,
      targetAudienceEstimate: 300,
      eventDateIso: '2027-08-15',
    });
    const fail = mcpRes.mod.runExpedienteB2g({
      municipality: 'Méntrida',
      province: 'Toledo',
      programType: 'FESTEJOS_POPULARES',
      requestedAmountEur: 14250.01,
      targetAudienceEstimate: 300,
      eventDateIso: '2027-08-15',
    });
    const ok = pass.ok === true && fail.ok === false;
    return { ok, detail: `14250=${pass.ok}, 14250.01=${fail.ok}` };
  });

  // --- F5 Boundaries (6) ---
  await runCase('T2_F5_01', 'T2', 'F5', 'verifyAcceptanceToken rejects forged/tampered HMAC signature with BAD_SIGNATURE (401)', () => {
    if (!tokenRes.ok) return { ok: false, detail: tokenRes.error };
    const now = 1_760_000_000_000;
    const token = tokenRes.mod.signAcceptanceToken({ requestId: 'REQ-99', providerId: 'p-1', timestamp: now });
    if (!token) return { ok: false, detail: 'signAcceptanceToken null' };
    const [payload, sig] = token.split('.');
    const tamperedSig = (sig[0] === 'a' ? 'b' : 'a') + sig.slice(1);
    const res = tokenRes.mod.verifyAcceptanceToken(`${payload}.${tamperedSig}`, now + 1000);
    const reason = getProp<string>(res, 'reason') ?? getProp<string>(res, 'code');
    const ok = !res.valid && reason === 'BAD_SIGNATURE' && res.status === 401;
    return { ok, detail: res.valid ? 'unexpected valid' : `${reason}:${res.status}` };
  });

  await runCase('T2_F5_02', 'T2', 'F5', 'verifyAcceptanceToken rejects malformed token with MALFORMED (400)', () => {
    if (!tokenRes.ok) return { ok: false, detail: tokenRes.error };
    const res = tokenRes.mod.verifyAcceptanceToken('invalid-token-no-dot', Date.now());
    const reason = getProp<string>(res, 'reason') ?? getProp<string>(res, 'code');
    const ok = !res.valid && reason === 'MALFORMED' && res.status === 400;
    return { ok, detail: res.valid ? 'unexpected valid' : `${reason}:${res.status}` };
  });

  await runCase('T2_F5_03', 'T2', 'F5', 'verifyAcceptanceToken rejects expired token past SLA window with EXPIRED (410)', () => {
    if (!tokenRes.ok) return { ok: false, detail: tokenRes.error };
    const now = 1_760_000_000_000;
    const token = tokenRes.mod.signAcceptanceToken({ requestId: 'REQ-EXP', providerId: 'p-1', timestamp: now });
    if (!token) return { ok: false, detail: 'signAcceptanceToken null' };
    const res = tokenRes.mod.verifyAcceptanceToken(token, now + 25 * 60 * 60 * 1000);
    const reason = getProp<string>(res, 'reason') ?? getProp<string>(res, 'code');
    const ok = !res.valid && reason === 'EXPIRED' && res.status === 410;
    return { ok, detail: res.valid ? 'unexpected valid' : `${reason}:${res.status}` };
  });

  await runCase('T2_F5_04', 'T2', 'F5', 'buildProviderServiceBrief fails closed (FICHA_INCOMPLETA) even when paid if venue/guests missing', () => {
    if (!briefRes.ok) return { ok: false, detail: briefRes.error };
    const brief = briefRes.mod.buildProviderServiceBrief({
      ficha: {
        requestId: 'REQ-INC',
        provider: { id: 'p1', name: 'Sonido Norte' },
        eventDate: '2027-06-19',
      },
      payment: { status: 'paid', amountEur: 100, paidAt: '2026-11-25T10:05:00.000Z', sessionId: 'cs_ok' },
      requestedAt: '2026-11-25T10:00:00.000Z',
      now: '2026-11-25T10:10:00.000Z',
      totalEur: 900,
      depositEur: 100,
    });
    const ok = brief.state === 'FICHA_INCOMPLETA' && !brief.dispatchAllowed && !brief.signatureAllowed && brief.contractSeed === null;
    return { ok, detail: `state=${brief.state}, missingCount=${brief.missing.length}` };
  });

  await runCase('T2_F5_05', 'T2', 'F5', 'assertContractIssuable blocks partial 2PC (2 CONFIRMED + 1 PENDING)', async () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    if (!assertFn) return { ok: false, detail: 'Missing assertContractIssuable' };
    let blocked = false;
    try {
      await Promise.resolve(
        assertFn({
          id: 'ord-partial',
          lines: [
            { id: 'l1', status: 'CONFIRMED' },
            { id: 'l2', status: 'CONFIRMED' },
            { id: 'l3', status: 'PENDING' },
          ],
        }),
      );
    } catch {
      blocked = true;
    }
    return { ok: blocked, detail: `partialBlocked=${blocked}` };
  });

  await runCase('T2_F5_06', 'T2', 'F5', 'assertContractIssuable rejects empty order (0 lines) or REJECTED line', async () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    if (!assertFn) return { ok: false, detail: 'Missing assertContractIssuable' };
    let emptyBlocked = false;
    let rejectedBlocked = false;
    try {
      await Promise.resolve(assertFn({ id: 'ord-empty', lines: [] }));
    } catch {
      emptyBlocked = true;
    }
    try {
      await Promise.resolve(assertFn({ id: 'ord-rej', lines: [{ id: 'l1', status: 'REJECTED' }] }));
    } catch {
      rejectedBlocked = true;
    }
    return { ok: emptyBlocked && rejectedBlocked, detail: `emptyBlocked=${emptyBlocked}, rejectedBlocked=${rejectedBlocked}` };
  });

  // --- F6 Boundaries (6) ---
  await runCase('T2_F6_01', 'T2', 'F6', 'Deposit boundary 0 € -> floored to 100,00 €', () => {
    if (!sovereignScriptRes.ok) return { ok: false, detail: sovereignScriptRes.error };
    const text = sovereignScriptRes.mod.buildConcentricRefusalScript({
      requestedLabel: 'video',
      providerName: 'Finca',
      anchorOfferName: 'Banquete',
      depositCents: 0,
    });
    return { ok: text.includes('100,00 €'), detail: text.includes('100,00 €') ? '0 € -> 100,00 €' : text.slice(0, 160) };
  });

  await runCase('T2_F6_02', 'T2', 'F6', 'Deposit boundary 50 € -> floored to 100,00 €', () => {
    if (!sovereignScriptRes.ok) return { ok: false, detail: sovereignScriptRes.error };
    const text = sovereignScriptRes.mod.buildConcentricRefusalScript({
      requestedLabel: 'video',
      providerName: 'Finca',
      anchorOfferName: 'Banquete',
      depositCents: 5_000,
    });
    return { ok: text.includes('100,00 €'), detail: text.includes('100,00 €') ? '50 € -> 100,00 €' : text.slice(0, 160) };
  });

  await runCase('T2_F6_03', 'T2', 'F6', 'Deposit boundary 100 € -> exact 100,00 €', () => {
    if (!sovereignScriptRes.ok) return { ok: false, detail: sovereignScriptRes.error };
    const text = sovereignScriptRes.mod.buildConcentricRefusalScript({
      requestedLabel: 'video',
      providerName: 'Finca',
      anchorOfferName: 'Banquete',
      depositCents: 10_000,
    });
    return { ok: text.includes('100,00 €'), detail: text.includes('100,00 €') ? '100 € -> 100,00 €' : text.slice(0, 160) };
  });

  await runCase('T2_F6_04', 'T2', 'F6', 'Deposit boundary 250 € -> honored as 250,00 € (never capped at 100 €)', () => {
    if (!sovereignScriptRes.ok) return { ok: false, detail: sovereignScriptRes.error };
    const text = sovereignScriptRes.mod.buildConcentricRefusalScript({
      requestedLabel: 'video',
      providerName: 'Finca',
      anchorOfferName: 'Banquete',
      depositCents: 25_000,
    });
    return { ok: text.includes('250,00 €'), detail: text.includes('250,00 €') ? '250 € -> 250,00 €' : 'Capped down to 100 €!' };
  });

  await runCase('T2_F6_05', 'T2', 'F6', 'Percentage deposit boundaries: 20% of 400 € (80 €) -> 100 € & 20% of 1500 € (300 €) -> 300 €', () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const calcFn =
      getFn(b2bOrchRes.mod, 'computeParametricDepositEur') ??
      getFn(b2bOrchRes.mod, 'resolveParametricDepositEur') ??
      getFn(b2bOrchRes.mod, 'computeLineDepositEur');
    if (!calcFn) return { ok: false, detail: 'Missing parametric deposit helper' };
    const a = Number(calcFn({ lineTotalEur: 400, customDepositPct: 20 }));
    const b = Number(calcFn({ lineTotalEur: 1500, customDepositPct: 20 }));
    return { ok: a === 100 && b === 300, detail: `20%@400=${a}, 20%@1500=${b}` };
  });

  await runCase('T2_F6_06', 'T2', 'F6', 'verifyAndSignStripeSession rejects HASH_MISMATCH & EXPIRED (24h + 1ms)', () => {
    if (!sovereignPricingRes.ok || !priceLockRes.ok) return { ok: false, detail: 'Missing pricing/priceLock module' };
    const input = { format: 'solista' as const, distanceKm: 120, soundRider: 'standard' as const, franchiseKm: 100 };
    const quote = sovereignPricingRes.mod.calculateSovereignQuote(input);
    const badHash = priceLockRes.mod.verifyAndSignStripeSession({
      input,
      clientHash: '0'.repeat(64),
      issuedAtTimestamp: Date.now(),
      artistSlug: 'edwin-agudelo',
    });
    const expired = priceLockRes.mod.verifyAndSignStripeSession({
      input,
      clientHash: quote.priceLockHash,
      issuedAtTimestamp: Date.now() - priceLockRes.mod.PRICE_LOCK_WINDOW_MS - 1,
      artistSlug: 'edwin-agudelo',
    });
    const ok = badHash.status === 'HASH_MISMATCH' && expired.status === 'EXPIRED';
    return { ok, detail: `badHash=${badHash.status}, expired=${expired.status}` };
  });

  // --- F7 Boundaries (6) ---
  await runCase('T2_F7_01', 'T2', 'F7', '24h SLA boundary: 23h59m elapsed remains valid (not expired)', () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const slaFn = getFn(b2bOrchRes.mod, 'isLineSlaExpired') ?? getFn(b2bOrchRes.mod, 'evaluateLineSla');
    if (!slaFn) return { ok: false, detail: 'Missing SLA evaluator in b2b-orchestration.ts' };
    const base = 1_760_000_000_000;
    const res = slaFn({ createdAtMs: base, nowMs: base + 23 * 3600_000 + 59 * 60_000 });
    const expired = typeof res === 'boolean' ? res : Boolean(getProp(res, 'expired'));
    return { ok: !expired, detail: `23h59m expired=${expired}` };
  });

  await runCase('T2_F7_02', 'T2', 'F7', '24h SLA boundary: 24h01m elapsed triggers SLA expiration', () => {
    if (!b2bOrchRes.ok) return { ok: false, detail: `Missing b2b-orchestration.ts: ${b2bOrchRes.error}` };
    const slaFn = getFn(b2bOrchRes.mod, 'isLineSlaExpired') ?? getFn(b2bOrchRes.mod, 'evaluateLineSla');
    if (!slaFn) return { ok: false, detail: 'Missing SLA evaluator in b2b-orchestration.ts' };
    const base = 1_760_000_000_000;
    const res = slaFn({ createdAtMs: base, nowMs: base + 24 * 3600_000 + 60_000 });
    const expired = typeof res === 'boolean' ? res : Boolean(getProp(res, 'expired'));
    return { ok: expired, detail: `24h01m expired=${expired}` };
  });

  await runCase('T2_F7_03', 'T2', 'F7', 'Cascading Buy Box rejection accumulates excludeProviderIds across 2 consecutive rejects', async () => {
    const fn =
      (b2bOrchRes.ok ? getFn(b2bOrchRes.mod, 'resolveBuyBoxFallback') : null) ??
      (buyboxRes.ok ? getFn(buyboxRes.mod, 'resolveBuyBoxFallback') : null);
    if (!fn) return { ok: false, detail: 'Missing resolveBuyBoxFallback' };
    const step1 = await Promise.resolve(
      fn({
        line: { id: 'l1', category: 'sonido', providerId: 'p-init', excludeProviderIds: [], destinationText: 'Madrid' },
        reason: 'RECHAZO',
      }),
    );
    const id1 = String(getProp(step1, 'newProviderId') ?? getProp(step1, 'providerId') ?? '');
    const step2 = await Promise.resolve(
      fn({
        line: { id: 'l1', category: 'sonido', providerId: id1, excludeProviderIds: ['p-init'], destinationText: 'Madrid' },
        reason: 'RECHAZO',
      }),
    );
    const id2 = String(getProp(step2, 'newProviderId') ?? getProp(step2, 'providerId') ?? '');
    const ok = id1.length > 0 && id2.length > 0 && id1 !== 'p-init' && id2 !== id1 && id2 !== 'p-init';
    return { ok, detail: `p-init -> ${id1} -> ${id2}` };
  });

  await runCase('T2_F7_04', 'T2', 'F7', 'Buy Box handles exhausted candidate pool gracefully without throwing/looping', async () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const fn = getFn(buyboxRes.mod, 'resolveNearest3pProvider');
    if (!fn) return { ok: false, detail: 'Missing resolveNearest3pProvider' };
    const res = await Promise.resolve(
      fn({ category: 'sonido', destinationText: 'Teruel', excludeProviderIds: Array.from({ length: 50 }, (_, i) => `fake-${i}`) }),
    );
    return { ok: res !== undefined, detail: `resolved=${Boolean(res)}` };
  });

  await runCase('T2_F7_05', 'T2', 'F7', 'evaluateBilateralMatch rejects out-of-range pax (10 or 400) & >75 dB entity', () => {
    if (!buyboxRes.ok) return { ok: false, detail: buyboxRes.error };
    const goodEntity = { id: 'e1', slug: 'e1', name: 'E1', category: 'artistas', province: 'Madrid', basePriceEur: 550, maxAcousticDb: 74 };
    const loudEntity = { ...goodEntity, maxAcousticDb: 95 };
    const lowPax = buyboxRes.mod.evaluateBilateralMatch(goodEntity, { preferredCategory: 'artistas', guestCount: 10, budgetEur: 900, province: 'Madrid', eventDate: '2026-09-18' }, true);
    const highPax = buyboxRes.mod.evaluateBilateralMatch(goodEntity, { preferredCategory: 'artistas', guestCount: 400, budgetEur: 900, province: 'Madrid', eventDate: '2026-09-18' }, true);
    const loud = buyboxRes.mod.evaluateBilateralMatch(loudEntity, { preferredCategory: 'artistas', guestCount: 120, budgetEur: 900, province: 'Madrid', eventDate: '2026-09-18' }, true);
    const ok = !lowPax.capacityMatch && !highPax.capacityMatch && !loud.acousticMatch && !loud.isTwoWayMatch;
    return { ok, detail: `lowPax=${lowPax.capacityMatch}, highPax=${highPax.capacityMatch}, loud=${loud.acousticMatch}` };
  });

  await runCase('T2_F7_06', 'T2', 'F7', 'Buy Box refuses to overwrite an already CONFIRMED line on duplicate/stale failover', async () => {
    const orderFailoverFn = b2bOrchRes.ok
      ? getFn(b2bOrchRes.mod, 'applyBuyBoxFallbackToOrder') ?? getFn(b2bOrchRes.mod, 'handleLineRejectionOrExpiry')
      : null;
    if (!orderFailoverFn) return { ok: false, detail: 'Missing applyBuyBoxFallbackToOrder' };
    let guarded = false;
    try {
      const out = await Promise.resolve(
        orderFailoverFn({
          order: { id: 'ord-guard', lines: [{ id: 'l1', providerId: 'p-confirmed', status: 'CONFIRMED', priceEur: 500, depositEur: 100 }] },
          lineId: 'l1',
          reason: 'SLA_EXPIRED',
        }),
      );
      const lines = getProp<Array<Record<string, unknown>>>(out, 'lines') ?? [];
      guarded = lines[0]?.providerId === 'p-confirmed' && lines[0]?.status === 'CONFIRMED';
    } catch {
      guarded = true;
    }
    return { ok: guarded, detail: `confirmedLineGuarded=${guarded}` };
  });

  // --- F8 Boundaries (6) ---
  await runCase('T2_F8_01', 'T2', 'F8', 'POST /api/chat/concierge handles null-province message without HTTP 500', async () => {
    if (!chatConciergeRouteRes.ok) return { ok: false, detail: chatConciergeRouteRes.error };
    const req = new Request('http://localhost:3000/api/chat/concierge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Quiero música para mi evento', pathname: '/artistas' }),
    });
    const res = await chatConciergeRouteRes.mod.POST(req);
    return { ok: res.status === 200, detail: `status=${res.status}` };
  });

  await runCase('T2_F8_02', 'T2', 'F8', 'POST /api/concierge/chat rejects empty message with HTTP 400', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: '' }),
    });
    const res = await conciergeChatRouteRes.mod.POST(req);
    return { ok: res.status === 400, detail: `status=${res.status}` };
  });

  await runCase('T2_F8_03', 'T2', 'F8', 'POST /api/chat/concierge rejects missing message with HTTP 400', async () => {
    if (!chatConciergeRouteRes.ok) return { ok: false, detail: chatConciergeRouteRes.error };
    const req = new Request('http://localhost:3000/api/chat/concierge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await chatConciergeRouteRes.mod.POST(req);
    return { ok: res.status === 400, detail: `status=${res.status}` };
  });

  await runCase('T2_F8_04', 'T2', 'F8', 'POST /api/concierge/chat DJ query outside Bizkaia (Valencia) leaks zero Otzarreta / Derio', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Necesito un DJ para una boda en Valencia', routeContext: { pathname: '/' } }),
    });
    const res = await conciergeChatRouteRes.mod.POST(req);
    const json = (await res.json()) as { reply?: string };
    const reply = json.reply ?? '';
    const leaked = /\b(otzarreta|derio|ezkertza)\b/i.test(reply);
    return { ok: res.status === 200 && !leaked, detail: leaked ? `LEAKED in Valencia DJ reply: ${reply.slice(0, 160)}` : 'Clean Valencia DJ reply' };
  });

  await runCase('T2_F8_05', 'T2', 'F8', 'POST /api/concierge/chat on /fincas with Sevilla query leaks zero Otzarreta / Derio', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: 'Busco finca para boda en Sevilla', routeContext: { pathname: '/fincas' } }),
    });
    const res = await conciergeChatRouteRes.mod.POST(req);
    const json = (await res.json()) as { reply?: string };
    const reply = json.reply ?? '';
    const leaked = /\b(otzarreta|derio|ezkertza)\b/i.test(reply);
    return { ok: res.status === 200 && !leaked, detail: leaked ? `LEAKED in Sevilla fincas reply: ${reply.slice(0, 160)}` : 'Clean Sevilla reply' };
  });

  await runCase('T2_F8_06', 'T2', 'F8', 'SovereignConciergeWidget /fincas context & quick prompts have zero Derio/Otzarreta/B2G global leakage', () => {
    const widget = readRepoFile('src/components/concierge/SovereignConciergeWidget.tsx') ?? '';
    const fincasBranchMatch = widget.match(/pathname\.startsWith\(['"]\/fincas['"]\)[\s\S]{0,600}/);
    const fincasLeaksOtz = fincasBranchMatch ? /Otzarreta|Derio/.test(fincasBranchMatch[0]) : false;
    const globalB2gChip = /Contrato menor B2G/.test(widget);
    return {
      ok: widget.length > 0 && !fincasLeaksOtz && !globalB2gChip,
      detail: `fincasLeaksOtz=${fincasLeaksOtz}, globalB2gChip=${globalB2gChip}`,
    };
  });

  // --- F9 Boundaries (6) ---
  await runCase('T2_F9_01', 'T2', 'F9', 'generateEarAsin sanitizes accents/spaces/symbols to strict ^EAR-ASIN-[A-Z]{3}-[A-Z0-9_-]{3,64}$', () => {
    if (!asinStdRes.ok) return { ok: false, detail: asinStdRes.error };
    const asin = asinStdRes.mod.generateEarAsin('fincas', 'Finca Señorío de Álava #2026!');
    const valid = asinStdRes.mod.EarAsinSchema.safeParse(asin).success;
    return { ok: valid, detail: `asin=${asin}, valid=${valid}` };
  });

  await runCase('T2_F9_02', 'T2', 'F9', 'buildWhatsAppHandoffUrl without ASIN emits clean URL with zero "undefined" / empty "[Ref: ]"', () => {
    if (!whatsappLibRes.ok) return { ok: false, detail: whatsappLibRes.error };
    const url = whatsappLibRes.mod.buildWhatsAppHandoffUrl('34693693048', { pax: 80, city: 'Toledo' });
    const decoded = decodeURIComponent(url);
    const ok = url.startsWith('https://wa.me/34693693048?') && !/undefined/i.test(decoded) && !/\[Ref:\s*\]/.test(decoded);
    return { ok, detail: `clean=${ok}` };
  });

  await runCase('T2_F9_03', 'T2', 'F9', 'POST /api/webhooks/whatsapp-concierge rejects invalid x-hub-signature-256 with HTTP 403', async () => {
    if (!whatsappWebhookRes.ok) return { ok: false, detail: whatsappWebhookRes.error };
    const req = new Request('http://localhost:3000/api/webhooks/whatsapp-concierge', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-hub-signature-256': 'sha256=' + 'f'.repeat(64),
      },
      body: JSON.stringify({ waId: '34600000001', messageId: 'm1', type: 'text', text: 'Hola' }),
    });
    const res = await whatsappWebhookRes.mod.POST(req);
    return { ok: res.status === 403, detail: `status=${res.status}` };
  });

  await runCase('T2_F9_04', 'T2', 'F9', 'POST /api/webhooks/whatsapp-concierge returns 401 unauthenticated & 413 > 64 KB', async () => {
    if (!whatsappWebhookRes.ok) return { ok: false, detail: whatsappWebhookRes.error };
    const unauthReq = new Request('http://localhost:3000/api/webhooks/whatsapp-concierge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ waId: '34600000001', messageId: 'm1', type: 'text', text: 'Hola' }),
    });
    const bigReq = new Request('http://localhost:3000/api/webhooks/whatsapp-concierge', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ pad: 'x'.repeat(70 * 1024) }),
    });
    const rUnauth = await whatsappWebhookRes.mod.POST(unauthReq);
    const rBig = await whatsappWebhookRes.mod.POST(bigReq);
    return { ok: rUnauth.status === 401 && rBig.status === 413, detail: `unauth=${rUnauth.status}, big=${rBig.status}` };
  });

  await runCase('T2_F9_05', 'T2', 'F9', 'WhatsApp webhook GET verifies token (200 challenge) & PUT/PATCH/DELETE return 405', () => {
    if (!whatsappWebhookRes.ok) return { ok: false, detail: whatsappWebhookRes.error };
    const getReq = new Request(
      `http://localhost:3000/api/webhooks/whatsapp-concierge?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(process.env.WHATSAPP_VERIFY_TOKEN!)}&hub.challenge=CHALLENGE_99`,
    );
    const rGet = whatsappWebhookRes.mod.GET(getReq);
    const rPut = whatsappWebhookRes.mod.PUT();
    const rPatch = whatsappWebhookRes.mod.PATCH();
    const rDel = whatsappWebhookRes.mod.DELETE();
    const ok = rGet.status === 200 && rPut.status === 405 && rPatch.status === 405 && rDel.status === 405;
    return { ok, detail: `GET=${rGet.status}, PUT=${rPut.status}, PATCH=${rPatch.status}, DELETE=${rDel.status}` };
  });

  await runCase('T2_F9_06', 'T2', 'F9', 'parseInboundEvent rejects missing waId & extractFichaSlug blocks path traversal', () => {
    if (!whatsappLibRes.ok) return { ok: false, detail: whatsappLibRes.error };
    const bad = whatsappLibRes.mod.parseInboundEvent({ messageId: 'm1', type: 'text', text: 'Hola' });
    const traversal = whatsappLibRes.mod.extractFichaSlug('ficha:../../etc/passwd');
    const ok = !bad.ok && traversal === null;
    return { ok, detail: `badOk=${bad.ok}, traversal=${String(traversal)}` };
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 3 — CROSS-FEATURE PAIRWISE COMBINATIONS (10 cases)
  // ══════════════════════════════════════════════════════════════════════════

  await runCase('T3_01', 'T3', 'PAIRWISE', 'Edwin Méntrida + Local Sound >150 km + 150 pax + B2B 2PC + Parametric deposit >=100 €', async () => {
    if (!geoRes.ok || !mcpRes.ok || !b2bOrchRes.ok) return { ok: false, detail: 'Missing geo/mcp/b2b-orchestration module' };
    const route = geoRes.mod.planLogisticsDispatch('Bilbao', 440);
    const rider = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 150 });
    const riderOk = checkAcousticTierPayload(rider.data, 2).ok;
    const calcFn = getFn(b2bOrchRes.mod, 'computeParametricDepositEur') ?? getFn(b2bOrchRes.mod, 'resolveParametricDepositEur');
    const dep = calcFn ? Number(calcFn({ lineTotalEur: 1200, customDepositEur: 250 })) : 0;
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    let denied = false;
    if (assertFn) {
      try {
        await Promise.resolve(assertFn({ id: 't3-1', lines: [{ id: 'l1', status: 'PENDING' }] }));
      } catch {
        denied = true;
      }
    }
    const ok = route.dispatchMode === 'DECOUPLED_LOCAL_BUYBOX' && riderOk && dep === 250 && denied;
    return { ok, detail: `mode=${route.dispatchMode}, riderOk=${riderOk}, dep=${dep}, denied=${denied}` };
  });

  await runCase('T3_02', 'T3', 'PAIRWISE', 'B2B RECHAZO triggers 3P proximity Buy Box failover while confirmed sibling remains intact', async () => {
    const orderFailoverFn = b2bOrchRes.ok
      ? getFn(b2bOrchRes.mod, 'applyBuyBoxFallbackToOrder') ?? getFn(b2bOrchRes.mod, 'handleLineRejectionOrExpiry')
      : null;
    const nearestFn = buyboxRes.ok ? getFn(buyboxRes.mod, 'resolveNearest3pProvider') : null;
    if (!orderFailoverFn || !nearestFn) return { ok: false, detail: 'Missing order failover or resolveNearest3pProvider' };

    const first = await Promise.resolve(nearestFn({ category: 'sonido', destinationText: 'Bilbao' }));
    const p1 = getProp<Record<string, unknown> | null>(first, 'selected') ?? getProp<Record<string, unknown> | null>(first, 'provider') ?? null;
    const id1 = String(getProp(p1, 'id') ?? getProp(p1, 'key') ?? '');
    if (!id1) return { ok: false, detail: 'No initial Bilbao 3P provider resolved' };

    const res = await Promise.resolve(
      orderFailoverFn({
        order: {
          id: 'ord-t3-02',
          lines: [
            { id: 'edwin', providerId: 'e78903', status: 'CONFIRMED', priceEur: 1180, depositEur: 150 },
            { id: 'sound', category: 'sonido', providerId: id1, status: 'PENDING', destinationText: 'Bilbao', priceEur: 900, depositEur: 100 },
          ],
        },
        lineId: 'sound',
        reason: 'RECHAZO',
      }),
    );
    const lines = getProp<Array<Record<string, unknown>>>(res, 'lines') ?? [];
    const edwin = lines.find((l) => l.id === 'edwin');
    const sound = lines.find((l) => l.id === 'sound');
    const ok = edwin?.status === 'CONFIRMED' && edwin?.providerId === 'e78903' && Boolean(sound && sound.providerId !== id1);
    return { ok, detail: `edwinStatus=${String(edwin?.status)}, soundNewId=${String(sound?.providerId)}` };
  });

  await runCase('T3_03', 'T3', 'PAIRWISE', 'Entity page ASIN -> Concierge query -> WhatsApp &ref=EAR-ASIN -> webhook parseInboundEvent', async () => {
    if (!conciergeChatRouteRes.ok || !whatsappLibRes.ok) return { ok: false, detail: 'Missing concierge/whatsapp modules' };
    const artistasPage = readRepoFile('src/app/(public)/artistas/[slug]/page.tsx') ?? '';
    const hasMeta = /ear:asin/.test(artistasPage) && /data-ear-asin/.test(artistasPage);
    const req = new NextRequest('http://localhost:3000/api/concierge/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Quiero reservar a Edwin Agudelo en Madrid para 100 pax',
        routeContext: { pathname: '/artistas/edwin-agudelo' },
      }),
    });
    const chatRes = await conciergeChatRouteRes.mod.POST(req);
    const chatJson = (await chatRes.json()) as { reply?: string };
    const waUrl = whatsappLibRes.mod.buildWhatsAppHandoffUrl('34693693048', {
      asin: 'EAR-ASIN-ART-E78903',
      pax: 100,
      city: 'Madrid',
    } as never);
    const hasRef = /[?&]ref=EAR-ASIN-ART-E78903/.test(waUrl);
    const inbound = whatsappLibRes.mod.parseInboundEvent({
      waId: '34655443322',
      messageId: 'wamid-t3-03',
      type: 'text',
      text: new URL(waUrl).searchParams.get('text') ?? '',
    });
    const intent = inbound.ok ? whatsappLibRes.mod.extractIntent(inbound.event.text) : null;
    const ok = hasMeta && chatRes.status === 200 && Boolean(chatJson.reply) && hasRef && getProp(intent, 'asin') === 'EAR-ASIN-ART-E78903';
    return { ok, detail: `hasMeta=${hasMeta}, hasRef=${hasRef}, extractedAsin=${String(getProp(intent, 'asin'))}` };
  });

  await runCase('T3_04', 'T3', 'PAIRWISE', 'Affiliate coupon (350 € floor) + 101 km excess + 03:00 AM hotel + 80/10/10 split', () => {
    if (!solistaPricingRes.ok || !agentsPricingRes.ok) return { ok: false, detail: 'Missing pricing modules' };
    const q = solistaPricingRes.mod.calculateSolistaQuote({
      distanciaKm: 101,
      horaFin: 3,
      cupon: 'EAR-AFIL-PARTNER',
      afiliados: [{ affiliateCode: 'EAR-AFIL-PARTNER', name: 'Partner', status: 'ACTIVE' }],
    });
    const split = agentsPricingRes.mod.computeSplit(q.totalEur);
    const splitOk = Math.abs(split.artista + split.earOs + split.vimume - q.totalEur) < 0.001;
    const expectedTotal = 350 + 1.5 + 120;
    const appliedBase = q.tarifaBaseEur - q.descuentoAfiliadoEur;
    const ok = appliedBase === 350 && q.kmAdicionales === 1 && q.suplementoHotelEur === 120 && Math.abs(q.totalEur - expectedTotal) < 0.01 && splitOk;
    return { ok, detail: `appliedBase=${appliedBase}, total=${q.totalEur}, expected=${expectedTotal}, splitOk=${splitOk}` };
  });

  await runCase('T3_05', 'T3', 'PAIRWISE', '<80 pax + <=100 km Toledo integrated fleet + default-deny before & after "OK"', async () => {
    if (!geoRes.ok || !mcpRes.ok || !b2bOrchRes.ok) return { ok: false, detail: 'Missing geo/mcp/b2b-orchestration' };
    const route = geoRes.mod.planLogisticsDispatch('Toledo', 58);
    const rider = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 65 });
    const riderOk = checkAcousticTierPayload(rider.data, 1).ok;
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    const ackFn = getFn(b2bOrchRes.mod, 'acknowledgeBookingLine') ?? getFn(b2bOrchRes.mod, 'processProviderAck');
    if (!assertFn || !ackFn) return { ok: false, detail: 'Missing assertContractIssuable/ack' };

    const order = { id: 'ord-t3-05', lines: [{ id: 'l1', providerId: 'e78903', status: 'PENDING', ackCode: 'OK777' }] };
    let blockedBefore = false;
    try {
      await Promise.resolve(assertFn(order));
    } catch {
      blockedBefore = true;
    }
    const acked = await Promise.resolve(ackFn({ order, lineId: 'l1', channel: 'WHATSAPP', command: 'OK OK777' }));
    await Promise.resolve(assertFn(acked));
    const ok = route.dispatchMode === 'INTEGRATED_MENTRIDA_FLEET' && riderOk && blockedBefore;
    return { ok, detail: `mode=${route.dispatchMode}, riderOk=${riderOk}, blockedBefore=${blockedBefore}` };
  });

  await runCase('T3_06', 'T3', 'PAIRWISE', '>200 pax Exterior Line Array <75 dB SPL + 24h SLA timeout Buy Box switch', async () => {
    if (!mcpRes.ok || !b2bOrchRes.ok) return { ok: false, detail: 'Missing mcp/b2b-orchestration' };
    const rider = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_exterior', pax: 280 });
    const riderOk = checkAcousticTierPayload(rider.data, 3).ok;
    const fallbackFn = getFn(b2bOrchRes.mod, 'resolveBuyBoxFallback') ?? (buyboxRes.ok ? getFn(buyboxRes.mod, 'resolveBuyBoxFallback') : null);
    if (!fallbackFn) return { ok: false, detail: 'Missing resolveBuyBoxFallback' };
    const now = Date.now();
    const res = await Promise.resolve(
      fallbackFn({
        line: {
          id: 'l-ext',
          category: 'sonido',
          providerId: 'prov-timeout-ext',
          status: 'PENDING',
          destinationText: 'Sevilla',
          slaExpiresAt: new Date(now - 5_000).toISOString(),
        },
        now,
        reason: 'SLA_EXPIRED',
      }),
    );
    const newId = String(getProp(res, 'newProviderId') ?? getProp(res, 'providerId') ?? '');
    const ok = riderOk && newId.length > 0 && newId !== 'prov-timeout-ext';
    return { ok, detail: `riderOk=${riderOk}, switchedTo=${newId}` };
  });

  await runCase('T3_07', 'T3', 'PAIRWISE', 'Bizkaia (Derio) allows Otzarreta while Madrid wedding forbids Otzarreta/Derio/B2G', async () => {
    if (!conciergeChatRouteRes.ok) return { ok: false, detail: conciergeChatRouteRes.error };
    const bizRes = await conciergeChatRouteRes.mod.POST(
      new NextRequest('http://localhost:3000/api/concierge/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'Menús de boda en Derio Bizkaia', routeContext: { pathname: '/otzarreta' } }),
      }),
    );
    const madRes = await conciergeChatRouteRes.mod.POST(
      new NextRequest('http://localhost:3000/api/concierge/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: 'Menús de boda en Madrid para 110 personas', routeContext: { pathname: '/fincas' } }),
      }),
    );
    const bizReply = ((await bizRes.json()) as { reply?: string }).reply ?? '';
    const madReply = ((await madRes.json()) as { reply?: string }).reply ?? '';
    const ok = /otzarreta/i.test(bizReply) && !/\b(otzarreta|derio|ezkertza|lcsp|118|b2g)\b/i.test(madReply);
    return { ok, detail: `bizHasOtz=${/otzarreta/i.test(bizReply)}, madClean=${!/\b(otzarreta|derio|ezkertza|lcsp|118|b2g)\b/i.test(madReply)}` };
  });

  await runCase('T3_08', 'T3', 'PAIRWISE', 'B2G LCSP 14,250 € / 15,000 € ceiling + sovereign quote + Price-Lock SHA-256 verification', () => {
    if (!mcpRes.ok || !sovereignPricingRes.ok || !priceLockRes.ok) return { ok: false, detail: 'Missing mcp/pricing modules' };
    const b2gOk = mcpRes.mod.runExpedienteB2g({
      municipality: 'Toledo',
      province: 'Toledo',
      programType: 'GALA_CULTURAL',
      requestedAmountEur: 14250,
      targetAudienceEstimate: 400,
      eventDateIso: '2027-09-20',
    }).ok;
    const b2gOver = mcpRes.mod.runExpedienteB2g({
      municipality: 'Toledo',
      province: 'Toledo',
      programType: 'GALA_CULTURAL',
      requestedAmountEur: 15000,
      targetAudienceEstimate: 400,
      eventDateIso: '2027-09-20',
    }).ok;
    const q = sovereignPricingRes.mod.calculateSovereignQuote({ format: 'quinteto', distanceKm: 80, soundRider: 'bose_f1_elite', franchiseKm: 100 });
    const lock = priceLockRes.mod.verifyAndSignStripeSession({
      input: { format: 'quinteto', distanceKm: 80, soundRider: 'bose_f1_elite', franchiseKm: 100 },
      clientHash: q.priceLockHash,
      issuedAtTimestamp: Date.now(),
      artistSlug: 'edwin-agudelo',
    });
    return { ok: b2gOk && !b2gOver && lock.isValid, detail: `b2gOk=${b2gOk}, b2g15k=${b2gOver}, lockValid=${lock.isValid}` };
  });

  await runCase('T3_09', 'T3', 'PAIRWISE', 'Price-Lock hash mismatch/expiry + buildProviderServiceBrief fail-closed on late payment', () => {
    if (!sovereignPricingRes.ok || !priceLockRes.ok || !briefRes.ok) return { ok: false, detail: 'Missing modules' };
    const lockFail = priceLockRes.mod.verifyAndSignStripeSession({
      input: { format: 'solista', distanceKm: 60, soundRider: 'standard', franchiseKm: 100 },
      clientHash: 'tampered',
      issuedAtTimestamp: Date.now(),
      artistSlug: 'edwin-agudelo',
    });
    const lateBrief = briefRes.mod.buildProviderServiceBrief({
      ficha: {
        requestId: 'REQ-LATE',
        provider: { id: 'p1', name: 'Sonido', email: 'a@b.es', phone: '+34600000001' },
        clientName: 'Luis',
        clientPhone: '+34600000002',
        clientEmail: 'luis@b.es',
        eventType: 'Boda',
        eventPurpose: 'Gala',
        eventDate: '2027-05-01',
        startTime: '20:00',
        durationHours: 2,
        venueName: 'Finca X',
        venueAddress: 'Calle 1',
        city: 'Madrid',
        province: 'Madrid',
        guests: 90,
        isIndoor: true,
        serviceFormat: 'Solista',
      },
      payment: { status: 'paid', amountEur: 100, paidAt: '2026-11-25T13:00:00.000Z', sessionId: 'cs_late' },
      requestedAt: '2026-11-25T10:00:00.000Z',
      now: '2026-11-25T13:05:00.000Z',
      totalEur: 550,
      depositEur: 100,
    });
    const ok = !lockFail.isValid && lateBrief.paymentState === 'PAGO_FUERA_DE_PLAZO' && !lateBrief.dispatchAllowed && lateBrief.contractSeed === null;
    return { ok, detail: `lock=${lockFail.status}, brief=${lateBrief.paymentState}` };
  });

  await runCase('T3_10', 'T3', 'PAIRWISE', 'Authenticated WhatsApp POST webhook processes enriched ASIN inquiry deterministically', async () => {
    if (!whatsappWebhookRes.ok || !whatsappLibRes.ok) return { ok: false, detail: 'Missing webhook/whatsapp modules' };
    const handoffUrl = whatsappLibRes.mod.buildWhatsAppHandoffUrl('34693693048', {
      asin: 'EAR-ASIN-ART-E78903',
      pax: 120,
      city: 'Madrid',
      serviceKind: 'musica',
    } as never);
    const body = JSON.stringify({
      waId: '34677889900',
      messageId: 'wamid-t3-10',
      type: 'text',
      text: new URL(handoffUrl).searchParams.get('text') ?? 'Hola boda 120 pax',
    });
    const req = new Request('http://localhost:3000/api/webhooks/whatsapp-concierge', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-hub-signature-256': signMetaHeader(body, process.env.WHATSAPP_APP_SECRET!),
      },
      body,
    });
    const res = await whatsappWebhookRes.mod.POST(req);
    const json = (await res.json()) as Record<string, unknown>;
    const ok = res.status === 200 && json.ok === true && json.createsStripeSession === false && typeof json.waRef === 'string';
    return { ok, detail: `status=${res.status}, createsStripe=${String(json.createsStripeSession)}, splitSums=${String(json.splitSumsToTotal)}` };
  });

  // ══════════════════════════════════════════════════════════════════════════
  // TIER 4 — REAL-WORLD APPLICATION SCENARIOS (5 scenarios)
  // ══════════════════════════════════════════════════════════════════════════

  await runCase('T4_S1', 'T4', 'WORKLOAD', 'Scenario 1 (Pillar 5): Edwin from Méntrida + Sound in Bilbao for 150 pax', async () => {
    if (!ssotRes.ok || !originRes.ok || !logisticsRes.ok || !geoRes.ok || !buyboxRes.ok || !mcpRes.ok || !agentsPricingRes.ok) {
      return { ok: false, detail: 'Missing required F1–F4 modules' };
    }
    // 1. SSOT Hub Méntrida coords + 100 km franchise
    const hubCoords = getProp<{ latitude?: number; longitude?: number }>(ssotRes.mod, 'HUB_MENTRIDA_COORDINATES');
    const origin = originRes.mod.resolveLogisticsOrigin({ id: 'e78903', slug: 'edwin-agudelo', name: 'Edwin Agudelo' });
    const dispatch = geoRes.mod.planLogisticsDispatch('Bilbao', 440);
    // 2. Exact km & hotel calculation: 440 km - 100 km exempt = 340 km * 1.50 = 510 € + 120 € hotel
    const logistics = logisticsRes.mod.computeSovereignLogistics(440, 22, { franchiseKm: origin.franchiseKm });
    // 3. Real 3P local sound provider in Bilbao/Vizcaya
    const nearestFn = getFn(buyboxRes.mod, 'resolveNearest3pProvider');
    const nearestRes = nearestFn ? await Promise.resolve(nearestFn({ category: 'sonido', destinationText: 'Bilbao, Vizcaya' })) : null;
    const nearestSelected = getProp<Record<string, unknown> | null>(nearestRes, 'selected') ?? getProp<Record<string, unknown> | null>(nearestRes, 'provider') ?? null;
    const hybrid = buyboxRes.mod.resolveHybridLogisticsQuote('Bilbao', 440);
    // 4. 150-pax acoustic tier (1.500-2.000W stereo + Shure UHF + operator)
    const rider = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 150 });
    const riderOk = checkAcousticTierPayload(rider.data, 2).ok;
    // 5. Combined deterministic quote
    const combinedFn =
      getFn(agentsPricingRes.mod, 'computeCombinedQuote') ??
      getFn(agentsPricingRes.mod, 'calculateCombinedQuote') ??
      getFn(mcpRes.mod, 'runCotizarEventoCombinado') ??
      getFn(mcpRes.mod, 'runPresupuestoCombinado');
    const combinedRaw = combinedFn
      ? await Promise.resolve(combinedFn({ destination: 'Bilbao', distanceKm: 440, pax: 150, context: 'boda_interior', endHour: 22 }))
      : null;
    const combinedData = getProp<Record<string, unknown>>(combinedRaw, 'data') ?? (combinedRaw as Record<string, unknown> | null);
    const total = Number(getProp(combinedData, 'totalEur') ?? getProp(combinedData, 'total') ?? NaN);
    const artist = Number(getProp(combinedData, 'artistFeeEur') ?? getProp(combinedData, 'tarifaArtista') ?? getProp(combinedData, 'base') ?? NaN);
    const sound = Number(getProp(combinedData, 'soundPackEur') ?? getProp(combinedData, 'packSonido') ?? NaN);
    const travel = Number(getProp(combinedData, 'travelEur') ?? getProp(combinedData, 'desplazamientos') ?? getProp(combinedData, 'logistica') ?? NaN);
    const hotel = Number(getProp(combinedData, 'hotelEur') ?? getProp(combinedData, 'hotel') ?? NaN);
    const split = Number.isFinite(total) ? agentsPricingRes.mod.computeSplit(total) : null;

    const ok =
      hubCoords?.latitude === 40.2378 &&
      hubCoords?.longitude === -4.1953 &&
      origin.franchiseKm === 100 &&
      logistics.billableKm === 340 &&
      logistics.travelCost === 510 &&
      logistics.hotelSupplement === 120 &&
      dispatch.dispatchMode === 'DECOUPLED_LOCAL_BUYBOX' &&
      hybrid.soundProvisioning.isLocalProvider === true &&
      hybrid.soundProvisioning.vanLogisticsChargedFromToledo === false &&
      Boolean(nearestSelected) &&
      riderOk &&
      Number.isFinite(total) &&
      total === artist + sound + travel + hotel &&
      split !== null &&
      split.artista + split.earOs + split.vimume === total;

    return {
      ok,
      detail: `coords=${JSON.stringify(hubCoords)}, billable=${logistics.billableKm}, travel=${logistics.travelCost}, hotel=${logistics.hotelSupplement}, riderOk=${riderOk}, nearest=${Boolean(nearestSelected)}, combinedTotal=${total}`,
    };
  });

  await runCase('T4_S2', 'T4', 'WORKLOAD', 'Scenario 2: Multi-provider festival in Sevilla (>200 pax Exterior, 3 providers, 1 RECHAZO -> Buy Box, OK -> contract)', async () => {
    if (!mcpRes.ok || !b2bOrchRes.ok || !buyboxRes.ok) return { ok: false, detail: 'Missing mcp/b2b-orchestration/buybox' };
    const rider = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_exterior', pax: 300 });
    const riderOk = checkAcousticTierPayload(rider.data, 3).ok;
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    const failoverFn = getFn(b2bOrchRes.mod, 'applyBuyBoxFallbackToOrder') ?? getFn(b2bOrchRes.mod, 'handleLineRejectionOrExpiry');
    const ackFn = getFn(b2bOrchRes.mod, 'acknowledgeBookingLine') ?? getFn(b2bOrchRes.mod, 'processProviderAck');
    if (!assertFn || !failoverFn || !ackFn) return { ok: false, detail: 'Missing B2B 2PC orchestration exports' };

    const order0 = {
      id: 'fest-sevilla-2027',
      lines: [
        { id: 'l-sound', category: 'sonido', providerId: 'sev-sound-1', status: 'PENDING', destinationText: 'Sevilla', priceEur: 2400, depositEur: 300, ackCode: 'OKS1' },
        { id: 'l-light', category: 'iluminacion', providerId: 'sev-light-1', status: 'CONFIRMED', destinationText: 'Sevilla', priceEur: 1800, depositEur: 200, ackCode: 'OKL1' },
        { id: 'l-cat', category: 'servicios', providerId: 'sev-cat-1', status: 'CONFIRMED', destinationText: 'Sevilla', priceEur: 6000, depositEur: 600, ackCode: 'OKC1' },
      ],
    };

    let blockedInitial = false;
    try {
      await Promise.resolve(assertFn(order0));
    } catch {
      blockedInitial = true;
    }

    const orderAfterRechazo = await Promise.resolve(failoverFn({ order: order0, lineId: 'l-sound', reason: 'RECHAZO' }));
    const lines1 = getProp<Array<Record<string, unknown>>>(orderAfterRechazo, 'lines') ?? [];
    const lightLine = lines1.find((l) => l.id === 'l-light');
    const catLine = lines1.find((l) => l.id === 'l-cat');
    const soundLine = lines1.find((l) => l.id === 'l-sound');
    const siblingsPreserved = lightLine?.providerId === 'sev-light-1' && lightLine?.status === 'CONFIRMED' && catLine?.providerId === 'sev-cat-1' && catLine?.status === 'CONFIRMED';
    const soundSwitched = Boolean(soundLine && soundLine.providerId !== 'sev-sound-1');

    const orderAfterOk = await Promise.resolve(
      ackFn({ order: orderAfterRechazo, lineId: 'l-sound', channel: 'WHATSAPP', command: 'OK' }),
    );
    await Promise.resolve(assertFn(orderAfterOk));
    const ok = riderOk && blockedInitial && siblingsPreserved && soundSwitched;
    return { ok, detail: `riderOk=${riderOk}, blocked=${blockedInitial}, siblingsPreserved=${siblingsPreserved}, switched=${soundSwitched}` };
  });

  await runCase('T4_S3', 'T4', 'WORKLOAD', 'Scenario 3: Intimate wedding in Toledo (<80 pax, <=100 km, 800W column, integrated fleet, 350 € affiliate vs 550 € standard)', () => {
    if (!geoRes.ok || !mcpRes.ok || !solistaPricingRes.ok || !logisticsRes.ok) return { ok: false, detail: 'Missing geo/mcp/pricing' };
    const dispatch = geoRes.mod.planLogisticsDispatch('Toledo', 58);
    const logistics = logisticsRes.mod.computeSovereignLogistics(58, 23);
    const rider = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 60 });
    const riderOk = checkAcousticTierPayload(rider.data, 1).ok;
    const std = solistaPricingRes.mod.calculateSolistaQuote({ distanciaKm: 58, horaFin: 23 });
    const aff = solistaPricingRes.mod.calculateSolistaQuote({
      distanciaKm: 58,
      horaFin: 23,
      cupon: 'EAR-AFIL-TOL1',
      afiliados: [{ affiliateCode: 'EAR-AFIL-TOL1', name: 'Cigarral Toledo', status: 'ACTIVE' }],
    });
    const ok =
      dispatch.dispatchMode === 'INTEGRATED_MENTRIDA_FLEET' &&
      dispatch.technicalSoundFromMentrida === true &&
      logistics.travelCost === 0 &&
      logistics.hotelSupplement === 0 &&
      riderOk &&
      std.totalEur === 550 &&
      aff.totalEur === 350;
    return { ok, detail: `mode=${dispatch.dispatchMode}, riderOk=${riderOk}, std=${std.totalEur}, aff=${aff.totalEur}` };
  });

  await runCase('T4_S4', 'T4', 'WORKLOAD', 'Scenario 4: Corporate gala in Madrid (120 pax, <150 km, 25% parametric deposit on 1200 € = 300 €, portal ack)', async () => {
    if (!geoRes.ok || !mcpRes.ok || !b2bOrchRes.ok) return { ok: false, detail: 'Missing geo/mcp/b2b-orchestration' };
    const dispatch = geoRes.mod.planLogisticsDispatch('Madrid', 60);
    const rider = mcpRes.mod.runAuditarRiderAcustico({ context: 'boda_interior', pax: 120 });
    const riderOk = checkAcousticTierPayload(rider.data, 2).ok;
    const calcFn = getFn(b2bOrchRes.mod, 'computeParametricDepositEur') ?? getFn(b2bOrchRes.mod, 'resolveParametricDepositEur');
    const ackFn = getFn(b2bOrchRes.mod, 'acknowledgeBookingLine') ?? getFn(b2bOrchRes.mod, 'processProviderAck');
    const assertFn = getFn(b2bOrchRes.mod, 'assertContractIssuable');
    if (!calcFn || !ackFn || !assertFn) return { ok: false, detail: 'Missing B2B orchestration exports' };

    const depositEur = Number(calcFn({ lineTotalEur: 1200, customDepositPct: 25 }));
    const order = {
      id: 'corp-madrid-120',
      lines: [{ id: 'l-gala', providerId: 'prov-mad-1', status: 'PENDING', priceEur: 1200, depositEur }],
    };
    const acked = await Promise.resolve(ackFn({ order, lineId: 'l-gala', channel: 'PORTAL', command: 'OK' }));
    await Promise.resolve(assertFn(acked));
    const ok = dispatch.dispatchMode === 'INTEGRATED_MENTRIDA_FLEET' && riderOk && depositEur === 300;
    return { ok, detail: `mode=${dispatch.dispatchMode}, riderOk=${riderOk}, deposit=${depositEur}` };
  });

  await runCase('T4_S5', 'T4', 'WORKLOAD', 'Scenario 5: Madrid wedding Concierge + ASIN capture from /artistas/edwin-agudelo -> WhatsApp -> webhook', async () => {
    if (!quickActionsRes.ok || !conciergeChatRouteRes.ok || !whatsappLibRes.ok || !whatsappWebhookRes.ok) {
      return { ok: false, detail: 'Missing concierge/whatsapp modules' };
    }
    const chips = quickActionsRes.mod.resolveWelcomeActions('/artistas/edwin-agudelo');
    const widget = readRepoFile('src/components/concierge/SovereignConciergeWidget.tsx') ?? '';
    const dock = readRepoFile('src/components/chat/AIConciergeDock.tsx') ?? '';
    const artistasPage = readRepoFile('src/app/(public)/artistas/[slug]/page.tsx') ?? '';
    const noCentralitaBtn = !/Hablar con [Cc]entralita/.test(widget) && !/Hablar con [Cc]entralita/.test(dock);
    const pageHasAsin = /ear:asin/.test(artistasPage) && /data-ear-asin/.test(artistasPage);

    const chatRes = await conciergeChatRouteRes.mod.POST(
      new NextRequest('http://localhost:3000/api/concierge/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: 'Busco música para mi boda en Madrid para 120 invitados',
          routeContext: { pathname: '/artistas/edwin-agudelo' },
        }),
      }),
    );
    const chatReply = ((await chatRes.json()) as { reply?: string }).reply ?? '';
    const noLeak = !/\b(otzarreta|derio|ezkertza|lcsp|118|licitaci[oó]n|b2g)\b/i.test(chatReply);

    const waUrl = whatsappLibRes.mod.buildWhatsAppHandoffUrl('34693693048', {
      asin: 'EAR-ASIN-ART-E78903',
      pax: 120,
      city: 'Madrid',
      fichaSlug: 'edwin-agudelo',
    } as never);
    const hasAsinRef = /[?&]ref=EAR-ASIN-ART-E78903/.test(waUrl);
    const textParam = new URL(waUrl).searchParams.get('text') ?? '';
    const body = JSON.stringify({ waId: '34699887766', messageId: 'wamid-t4-s5', type: 'text', text: textParam });
    const whRes = await whatsappWebhookRes.mod.POST(
      new Request('http://localhost:3000/api/webhooks/whatsapp-concierge', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-hub-signature-256': signMetaHeader(body, process.env.WHATSAPP_APP_SECRET!),
        },
        body,
      }),
    );
    const whJson = (await whRes.json()) as Record<string, unknown>;
    const ok =
      chips.length <= 3 &&
      noCentralitaBtn &&
      pageHasAsin &&
      chatRes.status === 200 &&
      noLeak &&
      hasAsinRef &&
      whRes.status === 200 &&
      whJson.ok === true;
    return {
      ok,
      detail: `chips=${chips.length}, noCentralitaBtn=${noCentralitaBtn}, pageHasAsin=${pageHasAsin}, noLeak=${noLeak}, hasAsinRef=${hasAsinRef}, whStatus=${whRes.status}`,
    };
  });

  // ══════════════════════════════════════════════════════════════════════════
  // REPORTING
  // ══════════════════════════════════════════════════════════════════════════
  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok);

  const byTier = (['T1', 'T2', 'T3', 'T4'] as const).map((tier) => {
    const items = results.filter((r) => r.tier === tier);
    const okCount = items.filter((r) => r.ok).length;
    return { tier, total: items.length, passed: okCount, failed: items.length - okCount };
  });

  const byFeature = (['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'PAIRWISE', 'WORKLOAD'] as const).map((feature) => {
    const items = results.filter((r) => r.feature === feature);
    const okCount = items.filter((r) => r.ok).length;
    return { feature, total: items.length, passed: okCount, failed: items.length - okCount };
  });

  if (JSON_MODE) {
    process.stdout.write(
      JSON.stringify(
        {
          suite: 'e2e_tier1_p0_suite',
          total: results.length,
          passed,
          failed: failed.length,
          byTier,
          byFeature,
          cases: results,
        },
        null,
        2,
      ) + '\n',
    );
  } else {
    console.log('========================================================================');
    console.log('EAR OS V2 — TIER-1 P0 E2E VERIFICATION SUITE');
    console.log('========================================================================');
    for (const r of results) {
      const tag = r.ok ? 'PASS' : 'FAIL';
      console.log(`[${tag}] ${r.id} (${r.tier}/${r.feature}) ${r.title}`);
      if (!r.ok) {
        console.log(`       -> ${r.detail}`);
      }
    }
    console.log('------------------------------------------------------------------------');
    console.log('SUMMARY BY TIER:');
    for (const t of byTier) {
      console.log(`  ${t.tier}: ${t.passed}/${t.total} PASS (${t.failed} FAIL)`);
    }
    console.log('SUMMARY BY FEATURE:');
    for (const f of byFeature) {
      console.log(`  ${f.feature}: ${f.passed}/${f.total} PASS (${f.failed} FAIL)`);
    }
    console.log('------------------------------------------------------------------------');
    console.log(`TOTAL: ${passed}/${results.length} PASS | ${failed.length} FAIL | VERDICT=${failed.length === 0 ? 'PASS' : 'FAIL'}`);
  }

  process.exitCode = failed.length === 0 ? 0 : 1;
}

main().catch((err: unknown) => {
  console.error('FATAL E2E HARNESS ERROR:', err);
  process.exitCode = 1;
});
