#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · AGENTE SOBERANO FRONT-FACING (SUPERVISOR + HERRAMIENTAS)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: la arquitectura de "un supervisor con herramientas
 * deterministas" es prosa decorativa si nadie demuestra que las herramientas
 * devuelven las cifras del SSOT y que fallan cuando deben fallar.
 *
 * Qué prueba (y cómo se rompe: Exit 1):
 *   T1 · MANIFEST        · 8 herramientas declaradas, cada una con motor real.
 *   T2 · TARIFA_SSOT     · la tarifa sale de `ear-os-ssot`, no de literales.
 *   T3 · TARIFA_NO_KM    · sin distancia ⇒ `ok:false`, jamás una estimación.
 *   T4 · SPLIT_10_10     · el Split 80/10/10 suma el 100 % del total.
 *   T5 · BUDGET_LOCK     · con la finca pagada (🔒) Σ === total y no se mueve.
 *   T6 · ACOUSTIC        · un festejo supera el límite y SE DECLARA.
 *   T7 · B2G_CEILING     · 14.250 € pasa; 14.250,01 € se rechaza (Art. 118).
 *   T8 · FICHA_NO_PHONE  · la ficha NO contiene el teléfono del proveedor.
 *   T9 · PRICE_LOCK      · el enlace apunta a un terminal que SÍ lee `base`.
 *  T10 · ZOD_STRICT      · campos extra ⇒ INVALID_PARAMS (no se cuelan).
 *  T11 · HANDOFF_HMAC    · un `ref` manipulado NO resuelve contexto.
 *  T12 · HANDOFF_NO_PII  · el token no transporta teléfono, email ni nombre.
 *  T13 · POLICY_HANDOFF  · > 5.000 € exige humano; 350 € cierra solo.
 *  T14 · JSONRPC_LOOP    · `tools/list` y `tools/call` responden 2.0 válido.
 *  T15 · NO_SIDE_EFFECT  · ninguna herramienta cobra ni bloquea.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concierge_mcp_tools.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concierge_mcp_tools.ts --json
 *
 * Exit: 0 = contrato vivo · 1 = promesa rota · 2 = fatal (módulo ilegible).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import {
  CONCIERGE_TOOL_MANIFEST,
  CONCIERGE_TOOL_NAMES,
  callTool,
  executeToolPlan,
  handleJsonRpc,
  listTools,
  parseToolPlan,
  runAuditarRiderAcustico,
  runConsultarProveedor,
  runExpedienteB2g,
  runPrepararPriceLock,
  runSimularPresupuesto,
  runSplitSoberano,
  runTarifaLogistica,
  stableSha256,
} from '../src/lib/mcp/concierge-tools';
import type { SimularPresupuestoData, TarifaLogisticaData } from '../src/lib/mcp/concierge-tools';
import {
  HUMAN_HANDOFF_THRESHOLD_EUR,
  containsUnmaskedProviderPhone,
  evaluateHumanHandoff,
  maskPhone,
  redactPii,
} from '../src/lib/mcp/concierge-policy';
import {
  buildHandoffQuery,
  issueHandoffToken,
  readHandoffToken,
  verifyHandoffToken,
} from '../src/lib/mcp/concierge-handoff';
import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SAFE_LCSP_CEILING_EUR,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '../src/lib/constants/ear-os-ssot';

const JSON_MODE: boolean = process.argv.includes('--json');

interface CaseResult {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(id: string, ok: boolean, detail: string): void {
  cases.push({ id, ok, detail });
}

function euro(value: number): string {
  return value.toFixed(2);
}

async function main(): Promise<void> {
  /* ── T1 · MANIFEST ──────────────────────────────────────────────────────── */
  const names: readonly string[] = CONCIERGE_TOOL_NAMES;
  const manifestNames: readonly string[] = CONCIERGE_TOOL_MANIFEST.map((tool) => tool.name);
  check(
    'T1_MANIFEST',
    names.length === 8 && manifestNames.length === 8 && manifestNames.every((name) => names.includes(name)),
    `declaradas=${names.length} manifest=${manifestNames.length} [${manifestNames.join(', ')}]`,
  );

  /* ── T2 · TARIFA_SSOT (350 base + km + hotel) ───────────────────────────── */
  // 120 km ⇒ 70 km facturables × 1,50 = 105,00 € · fin 03:00 ⇒ hotel 120,00 €
  // (DOCTRINA `AGENTS.md`: el hotel salta con hora fin >= 3:00 AM o > 200 km;
  //  terminar a las 02:00 NO lo activa — así lo codifica `HORA_FIN_HOTEL`).
  const tarifa = runTarifaLogistica({ distanceKm: 120, endHour: 3 }, { source: 'live' });
  const tarifaData: TarifaLogisticaData = tarifa.data;
  const expectedLogistica: number = (120 - LOGISTICA_KM_EXENTOS) * LOGISTICA_EUR_PER_KM;
  const expectedTotal: number = TARIFA_BASE_SOLISTA_EUR + expectedLogistica + SUPLEMENTO_HOTEL_EUR;
  check(
    'T2_TARIFA_SSOT',
    tarifa.ok &&
      tarifaData.quote !== null &&
      tarifaData.quote.base === TARIFA_BASE_SOLISTA_EUR &&
      tarifaData.quote.logistica === expectedLogistica &&
      tarifaData.quote.hotel === SUPLEMENTO_HOTEL_EUR &&
      tarifaData.quote.total === expectedTotal &&
      tarifaData.quote.deposito === DEPOSITO_STRIPE_EUR,
    `base=${euro(tarifaData.quote?.base ?? -1)} logistica=${euro(tarifaData.quote?.logistica ?? -1)} ` +
      `hotel=${euro(tarifaData.quote?.hotel ?? -1)} total=${euro(tarifaData.quote?.total ?? -1)} ` +
      `deposito=${euro(tarifaData.quote?.deposito ?? -1)} esperado=${euro(expectedTotal)}`,
  );

  /* ── T3 · TARIFA_NO_KM (fail-closed) ────────────────────────────────────── */
  const sinKm = runTarifaLogistica({ distanceKm: null, endHour: 2 }, { source: 'live' });
  check(
    'T3_TARIFA_NO_KM',
    sinKm.ok === false && sinKm.data.quote === null && sinKm.probed === true,
    `ok=${sinKm.ok} quote=${String(sinKm.data.quote)} error=${sinKm.error?.slice(0, 50) ?? 'null'}`,
  );

  /* ── T4 · SPLIT_10_10 (Σ = 100 %) ───────────────────────────────────────── */
  const split = runSplitSoberano({ totalEur: 575 }, { source: 'live' });
  const sumSplit: number = split.data.split.artista + split.data.split.earOs + split.data.split.vimume;
  check(
    'T4_SPLIT_10_10',
    split.ok && Math.abs(sumSplit - 575) < 0.005 && split.data.split.vimume === 57.5,
    `artista=${euro(split.data.split.artista)} earOs=${euro(split.data.split.earOs)} ` +
      `vimume=${euro(split.data.split.vimume)} Σ=${euro(sumSplit)}`,
  );

  /* ── T5 · BUDGET_LOCK ("ya pagué la finca") ─────────────────────────────── */
  const budget = runSimularPresupuesto(
    { totalEur: 12000, lockedCategories: ['espacio_banquete'] },
    { source: 'live' },
  );
  const budgetData: SimularPresupuestoData = budget.data;
  const sumCents: number =
    budgetData.allocation === null
      ? -1
      : Object.values(budgetData.allocation.amountsCents).reduce((acc, value) => acc + value, 0);
  check(
    'T5_BUDGET_LOCK',
    budget.ok &&
      budgetData.allocation !== null &&
      sumCents === 1_200_000 &&
      budgetData.allocation.locked.includes('espacio_banquete'),
    `totalCents=${sumCents} (esperado 1200000) finca=${budgetData.allocation?.amountsCents.espacio_banquete} ` +
      `locked=[${(budgetData.locked ?? []).join(',')}]`,
  );

  /* ── T6 · ACOUSTIC (declara el exceso, no lo esconde) ───────────────────── */
  const riderFestejo = runAuditarRiderAcustico({ context: 'festejo', pax: 200 }, { source: 'live' });
  const riderSenior = runAuditarRiderAcustico({ context: 'vimume_senior', pax: 30 }, { source: 'live' });
  check(
    'T6_ACOUSTIC',
    riderFestejo.data.exceedsPublicHealthLimit === true &&
      riderFestejo.data.rider?.maxDba === 102 &&
      riderSenior.data.exceedsPublicHealthLimit === false &&
      riderSenior.data.rider?.watts === 360,
    `festejo_max=${riderFestejo.data.rider?.maxDba}dBA excede=${riderFestejo.data.exceedsPublicHealthLimit} · ` +
      `senior_max=${riderSenior.data.rider?.maxDba}dBA watts=${riderSenior.data.rider?.watts}`,
  );

  /* ── T7 · B2G_CEILING (Art. 118 LCSP, techo preventivo) ─────────────────── */
  const baseB2g = {
    municipality: 'Méntrida',
    province: 'Toledo',
    programType: 'GALA_CULTURAL' as const,
    targetAudienceEstimate: 300,
    eventDateIso: '2026-12-31',
  };
  const dentro = runExpedienteB2g({ ...baseB2g, requestedAmountEur: SAFE_LCSP_CEILING_EUR }, { source: 'live' });
  const fuera = runExpedienteB2g(
    { ...baseB2g, requestedAmountEur: SAFE_LCSP_CEILING_EUR + 0.01 },
    { source: 'live' },
  );
  check(
    'T7_B2G_CEILING',
    dentro.ok && dentro.data.valid && dentro.data.cpvCode === '92312100-2' && fuera.ok === false,
    `techo=${euro(SAFE_LCSP_CEILING_EUR)} en_techo=${dentro.ok} sobre_techo=${fuera.ok} ` +
      `cpv=${dentro.data.cpvCode} rechazo=${fuera.error?.slice(0, 45) ?? 'null'}`,
  );

  /* ── T8 · FICHA_NO_PHONE (anti-picaresca · cero SSRF) ───────────────────── */
  // Se usa una ficha DORADA real (con teléfono verificado en origen): es el
  // único caso donde un leak sería posible y, por tanto, el único que prueba algo.
  const target = readGoldFichaForTest();
  const ficha = runConsultarProveedor({ query: target.slug }, { source: 'static' });
  const fichaText: string = ficha.data.facts.join(' | ');
  const leaksPhone: boolean = target.phone !== null && containsUnmaskedProviderPhone(fichaText, target.phone);
  check(
    'T8_FICHA_NO_PHONE',
    ficha.ok &&
      ficha.probed === true &&
      ficha.source === 'static' &&
      ficha.data.found === true &&
      ficha.data.verified === true &&
      ficha.data.provenanceHash !== null &&
      fichaText.includes('se entrega al confirmar la reserva') &&
      leaksPhone === false,
    `slug=${target.slug} phone_len=${target.phone?.length ?? 0} found=${ficha.data.found} ` +
      `verified=${ficha.data.verified} leaksPhone=${leaksPhone} facts=${ficha.data.facts.length}`,
  );

  /* ── T9 · PRICE_LOCK (el enlace apunta al terminal que SÍ lee `base`) ───── */
  const lock = runPrepararPriceLock({ venue: 'Otzarreta', format: 'Acompañamiento solista', totalEur: 455 }, { source: 'live' });
  const href: string = lock.data.href;
  check(
    'T9_PRICE_LOCK',
    lock.ok &&
      lock.data.createsStripeSession === false &&
      lock.data.depositEur === DEPOSITO_STRIPE_EUR &&
      href.startsWith('/checkout/presupuesto?') &&
      href.includes('base=455') &&
      href.includes('venue=Otzarreta'),
    `href=${href} deposit=${euro(lock.data.depositEur)} creaStripe=${String(lock.data.createsStripeSession)}`,
  );

  /* ── T10 · ZOD_STRICT (un campo extra no se cuela al motor) ─────────────── */
  const conExtra = await callTool('tarifa_logistica', { distanceKm: 120, endHour: 2, precioInventado: 99 });
  const nombreFalso = await callTool('cobrar_tarjeta', { amount: 9999 });
  check(
    'T10_ZOD_STRICT',
    conExtra.ok === false &&
      conExtra.error?.code === -32602 &&
      nombreFalso.ok === false &&
      nombreFalso.error?.code === -32601,
    `extra_code=${String(conExtra.error?.code)} tool_falsa_code=${String(nombreFalso.error?.code)}`,
  );

  /* ── T11 · HANDOFF_HMAC (token manipulado ⇒ null) ───────────────────────── */
  const now: number = Date.UTC(2026, 10, 11, 12, 0, 0);
  const token: string | null = issueHandoffToken({ ref: 'otzarreta', pax: 120, date: null }, now);
  const manipulated: string = token === null ? '' : `${token.slice(0, -3)}AAA`;
  const verifiedOk = token === null ? null : verifyHandoffToken(token, now);
  const verifiedBad = verifyHandoffToken(manipulated, now);
  const verifiedExpired = token === null ? null : verifyHandoffToken(token, now + 8 * 24 * 60 * 60 * 1000);
  check(
    'T11_HANDOFF_HMAC',
    token !== null &&
      verifiedOk?.pax === 120 &&
      verifiedOk?.ref === 'otzarreta' &&
      verifiedBad === null &&
      verifiedExpired === null,
    `pax=${String(verifiedOk?.pax)} manipulado=${String(verifiedBad)} caducado=${String(verifiedExpired)}`,
  );

  /* ── T12 · HANDOFF_NO_PII (INV-14: la URL no lleva datos personales) ────── */
  const query: string | null = buildHandoffQuery({ ref: 'otzarreta', pax: 120, date: '2026-12-31' }, now);
  const decoded: string = query === null ? '' : decodeURIComponent(query);
  const rawToken: string | null = readHandoffToken(query === null ? null : `?${query}`);
  const piiFree: boolean =
    decoded.length > 0 &&
    !/\d{9}/.test(decoded) &&
    !decoded.includes('@') &&
    !/nombre|telefono|phone|email/i.test(decoded);
  check(
    'T12_HANDOFF_NO_PII',
    piiFree && rawToken !== null && verifyHandoffToken(rawToken, now)?.date === '2026-12-31',
    `len=${decoded.length} piiFree=${piiFree} date=${String(verifyHandoffToken(rawToken, now)?.date)}`,
  );

  /* ── T13 · POLICY_HANDOFF (fail-closed > 5.000 €) ───────────────────────── */
  const barato = evaluateHumanHandoff({ amountEur: TARIFA_BASE_SOLISTA_EUR });
  const caro = evaluateHumanHandoff({ amountEur: HUMAN_HANDOFF_THRESHOLD_EUR + 1 });
  const tecnico = evaluateHumanHandoff({ amountEur: 900, technicalCustomization: true });
  check(
    'T13_POLICY_HANDOFF',
    barato.requiresHuman === false &&
      caro.requiresHuman === true &&
      caro.reason === 'AMOUNT_ABOVE_THRESHOLD' &&
      caro.humanPhone === '+34 693 693 048' &&
      tecnico.requiresHuman === true &&
      evaluateHumanHandoff({ amountEur: HUMAN_HANDOFF_THRESHOLD_EUR }).requiresHuman === false,
    `350€=${String(barato.requiresHuman)} ${HUMAN_HANDOFF_THRESHOLD_EUR + 1}€=${String(caro.requiresHuman)} ` +
      `(${caro.reason}) tecnico=${String(tecnico.requiresHuman)} umbral_exacto=${String(
        evaluateHumanHandoff({ amountEur: HUMAN_HANDOFF_THRESHOLD_EUR }).requiresHuman,
      )}`,
  );

  /* ── T14 · JSONRPC_LOOP (wire format MCP) ───────────────────────────────── */
  const listResponse = await handleJsonRpc({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, now);
  const callResponse = await handleJsonRpc(
    { jsonrpc: '2.0', id: 2, method: 'tools/call', params: { name: 'split_soberano', arguments: { totalEur: 350 } } },
    now,
  );
  const badVersion = await handleJsonRpc({ jsonrpc: '1.0', id: 3, method: 'tools/list' }, now);
  const listResult = 'result' in listResponse ? (listResponse.result as { tools: readonly unknown[] }) : null;
  const callResult =
    'result' in callResponse
      ? (callResponse.result as { tool: string; envelope: { evidenceSha256: string; checkedAt: string } })
      : null;
  check(
    'T14_JSONRPC_LOOP',
    listResult !== null &&
      listResult.tools.length === 8 &&
      callResult !== null &&
      callResult.tool === 'split_soberano' &&
      /^[0-9a-f]{64}$/.test(callResult.envelope.evidenceSha256) &&
      callResult.envelope.checkedAt === new Date(now).toISOString() &&
      'error' in badVersion,
    `tools=${listResult?.tools.length ?? -1} sha256=${callResult?.envelope.evidenceSha256.slice(0, 12) ?? 'null'}… ` +
      `badVersion=${'error' in badVersion ? String(badVersion.error.code) : 'SIN_ERROR'}`,
  );

  /* ── T15 · NO_SIDE_EFFECT (nada cobra ni bloquea) ───────────────────────── */
  const effectFree: boolean = CONCIERGE_TOOL_MANIFEST.every(
    (tool) => tool.sideEffects === 'none' || tool.sideEffects === 'read-only',
  );
  const verificarFecha = await callTool('verificar_fecha', { date: '2026-12-31', timeSlot: '21:00' }, now);
  const verificarOk: boolean =
    verificarFecha.ok === true &&
    verificarFecha.result?.envelope.probed === true &&
    verificarFecha.result?.envelope.checkedAt === new Date(now).toISOString();
  check(
    'T15_NO_SIDE_EFFECT',
    effectFree && verificarOk && lock.data.createsStripeSession === false,
    `manifest_sin_efectos=${effectFree} verificar_fecha_ok=${verificarOk} ` +
      `price_lock_crea_stripe=${String(lock.data.createsStripeSession)}`,
  );

  /* ── Smoke de política (mascarado + PII) ────────────────────────────────── */
  check(
    'T16_POLICY_PII',
    maskPhone('34655123456') !== '34655123456' &&
      maskPhone('+34693693048') === '+34 693 693 048' &&
      !redactPii('Escribe a ana.lopez@example.com').includes('@') &&
      stableSha256({ b: 1, a: 2 }) === stableSha256({ a: 2, b: 1 }),
    `mask=${String(maskPhone('34655123456'))} centralita=${String(maskPhone('+34693693048'))} ` +
      `pii=${redactPii('ana.lopez@example.com').slice(0, 24)}`,
  );

  /* ── T17 · PLAN_PARSER (el LLM no puede colar herramientas inexistentes) ── */
  const llmReply: string =
    'Claro. ```json\n{"tool_calls":[' +
    '{"name":"tarifa_logistica","arguments":{"distanceKm":120,"endHour":3}},' +
    '{"name":"cobrar_sin_permiso","arguments":{"eur":9999}},' +
    '{"name":"split_soberano","args":{"totalEur":575}}' +
    ']}\n```';
  const plan = parseToolPlan(llmReply);
  const planNames: readonly string[] = plan.map((call) => call.name);
  const noPlan = parseToolPlan('No puedo responder a eso.');
  check(
    'T17_PLAN_PARSER',
    plan.length === 2 &&
      planNames.includes('tarifa_logistica') &&
      planNames.includes('split_soberano') &&
      !planNames.includes('cobrar_sin_permiso') &&
      noPlan.length === 0,
    `validas=${plan.length} [${planNames.join(', ')}] descartada=cobrar_sin_permiso prosa_vacia=${noPlan.length === 0}`,
  );

  /* ── T18 · EXECUTE_PLAN (hechos del motor, no del LLM) ──────────────────── */
  const execution = await executeToolPlan(plan, now);
  const facts: string = execution.promptBlock;
  check(
    'T18_EXECUTE_PLAN',
    execution.results.length === 2 &&
      facts.includes('TOTAL 575.00 €') &&
      facts.includes('460.00') &&
      facts.includes('HECHOS VERIFICADOS') &&
      facts.includes('NO RECALCULAR') &&
      execution.anyFailure === false,
    `resultados=${execution.results.length} total_en_prompt=${facts.includes('TOTAL 575.00 €')} ` +
      `split_en_prompt=${facts.includes('460.00')} fallos=${execution.anyFailure}`,
  );

  report();
}

/** Emite el acta y fija el Exit Code (0 = todo falsable y vivo). */
function report(): void {
  const failed: CaseResult[] = cases.filter((item) => !item.ok);
  const passed: number = cases.length - failed.length;

  if (JSON_MODE) {
    process.stdout.write(
      `${JSON.stringify({ ok: failed.length === 0, passed, total: cases.length, cases }, null, 2)}\n`,
    );
  } else {
    for (const item of cases) {
      process.stdout.write(`${item.ok ? 'PASS' : 'FAIL'}  ${item.id.padEnd(22)} ${item.detail}\n`);
    }
    process.stdout.write(`\n${passed}/${cases.length} verificaciones superadas\n`);
  }

  process.exitCode = failed.length === 0 ? 0 : 1;
}

void main();

/**
 * Primera ficha DORADA con teléfono verificado, leída del artefacto en disco.
 * Se usa solo aquí (harness) para demostrar que el teléfono real NO aparece en
 * la respuesta de la herramienta. Selección determinista: la primera del array,
 * nunca aleatoria.
 */
function readGoldFichaForTest(): { readonly slug: string; readonly phone: string | null } {
  const fallback = { slug: 'casa-rafael-madrid', phone: null as string | null };
  try {
    const filePath: string = path.join(process.cwd(), 'public', 'data', 'fichas', 'fichas_gold.json');
    const parsed: unknown = JSON.parse(readFileSync(filePath, 'utf8'));
    const fichas: unknown = (parsed as { fichas?: unknown }).fichas;
    if (!Array.isArray(fichas)) return fallback;

    for (const item of fichas as unknown[]) {
      const record = item as { slug?: unknown; phone?: unknown; verified?: unknown };
      if (typeof record.slug !== 'string') continue;
      if (typeof record.phone !== 'string' || record.phone.replace(/\D/g, '').length < 9) continue;
      return { slug: record.slug, phone: record.phone };
    }
    return fallback;
  } catch {
    return fallback;
  }
}
