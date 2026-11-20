#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · CONVERSIÓN CONCÉNTRICA Y COLA DIFERIDA (S-CLASS)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: «el agente apunta lo que el cliente pide aunque lo venda otro
 * proveedor y lo recupera al cobrar el ancla» es prosa decorativa mientras nadie
 * demuestre cuatro cosas: que el guion es determinista, que la captura no es un
 * falso verde cuando la base de datos cae, que la idempotencia es del MOTOR y
 * que las herramientas están de verdad en el manifiesto MCP.
 *
 * Qué prueba (y cómo se rompe: Exit 1):
 *   T1  · SCHEMA_MULTITENANT   · modelo `LeadDeferredDemand` + `@@index` reales.
 *   T2  · SCHEMA_SERVICE_OFFER · céntimos enteros + `metadata` Json (polimórfico).
 *   T3  · NO_TABLAS_POR_GREMIO · prohibidas `Finca`/`DJ`/`Tarta` como modelos.
 *   T4  · TOOLS_WIRED          · las 2 herramientas nuevas están en `callTool`.
 *   T5  · SCRIPT_MAITRE        · el guion arranca con el marcador y cierra con
 *                                la fecha/aforo (FASE 3).
 *   T6  · SCRIPT_FIANZA_SSOT   · 100,00 € del SSOT; una fianza publicada mayor
 *                                NUNCA infla el depósito por encima del techo.
 *   T7  · DETECT_ISOLATION     · solo demanda AJENA; el menú del ancla no aplaza.
 *   T8  · PII_ZERO             · email/DNI/IBAN jamás llegan al prompt guardado.
 *   T9  · FINGERPRINT_IDEMPOT · mismo deseo = mismo hash; otro deseo = otro hash.
 *   T10 · POST_CONVERSION      · lista la libreta y abre una única pregunta.
 *   T11 · FAIL_CLOSED_DB       · sin DB ⇒ `ok:false` + `persisted:false`
 *                                (`mode:"SIMULADO"`), nunca un verde falso.
 *   T12 · WEBHOOK_WIRING       · `checkout.session.completed` invoca el repliegue
 *                                y es idempotente (solo promueve STASHED).
 *   T13 · ZONA_CERO_INTACTA    · `ear-os-ssot.ts` sin modificar (INV-05).
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concentric_conversion.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concentric_conversion.ts --json
 *
 * Exit: 0 = contrato vivo · 1 = promesa rota · 2 = fatal (módulo ilegible).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEPOSITO_STRIPE_EUR } from '../src/lib/constants/ear-os-ssot';
import {
  DEFERRED_DEMAND_CATEGORIES,
  MAX_DEMAND_PROMPT_CHARS,
  demandFingerprint,
  detectDeferredCategory,
  detectDeferredDemand,
} from '../src/lib/concierge/deferred-demand';
import {
  DEFERRED_DEMAND_SCRIPT_MARKER,
  buildConcentricRefusalScript,
  buildPostConversionScript,
  isSatelliteDemand,
} from '../src/lib/concierge/sovereign-script';
import { CONCIERGE_TOOL_MANIFEST, CONCIERGE_TOOL_NAMES, callTool } from '../src/lib/mcp/concierge-tools';

const JSON_MODE: boolean = process.argv.includes('--json');
const ROOT: string = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

interface CaseResult {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(id: string, ok: boolean, detail: string): void {
  cases.push({ id, ok, detail });
}

function readRepo(relative: string): string {
  return readFileSync(path.join(ROOT, relative), 'utf8');
}

/** Quita comentarios `//` y `///` para no firmar contra documentación. */
function stripLineComments(source: string): string {
  return source
    .split(/\r?\n/)
    .filter((line: string) => !line.trimStart().startsWith('//'))
    .join('\n');
}

async function main(): Promise<void> {
  /* ── T1 · SCHEMA_MULTITENANT ─────────────────────────────────────────────── */
  const schema: string = readRepo('prisma/schema.prisma');
  const demandBlock: string = sliceModel(schema, 'LeadDeferredDemand');
  check(
    'T1_SCHEMA_MULTITENANT',
    demandBlock.includes('sessionId') &&
      demandBlock.includes('providerId') &&
      demandBlock.includes('category') &&
      demandBlock.includes('rawPrompt') &&
      demandBlock.includes('@default("STASHED")') &&
      demandBlock.includes('@@index([sessionId]') &&
      demandBlock.includes('@@index([providerId]'),
    `modelo=${demandBlock.length > 0} default_stashed=${demandBlock.includes('@default("STASHED")')}`,
  );

  /* ── T2 · SCHEMA_SERVICE_OFFER (céntimos + Json) ─────────────────────────── */
  const offerBlock: string = sliceModel(schema, 'ServiceOffer');
  check(
    'T2_SCHEMA_SERVICE_OFFER',
    offerBlock.includes('priceInCents    Int') &&
      offerBlock.includes('depositInCents  Int?') &&
      offerBlock.includes('metadata        Json') &&
      !/priceInCents\s+Float/.test(offerBlock) &&
      offerBlock.includes('onDelete: Cascade'),
    `centimos=${offerBlock.includes('priceInCents    Int')} json=${offerBlock.includes('metadata        Json')} ` +
      `cero_float=${!/priceInCents\s+Float/.test(offerBlock)}`,
  );

  /* ── T3 · NO_TABLAS_POR_GREMIO ───────────────────────────────────────────── */
  const forbidden: readonly string[] = ['model Finca ', 'model DJ ', 'model Tarta ', 'model Finca{', 'model DJ{'];
  const schemaCode: string = stripLineComments(schema);
  check(
    'T3_NO_TABLAS_POR_GREMIO',
    forbidden.every((needle: string) => !schemaCode.includes(needle)),
    `prohibidas=${forbidden.length} encontradas=${forbidden.filter((n) => schemaCode.includes(n)).join(',') || 'ninguna'}`,
  );

  /* ── T4 · TOOLS_WIRED (manifiesto + despachador real) ────────────────────── */
  const toolsCode: string = readRepo('src/lib/mcp/concierge-tools.ts');
  const names: readonly string[] = CONCIERGE_TOOL_NAMES;
  const manifest: readonly string[] = CONCIERGE_TOOL_MANIFEST.map((tool) => tool.name);
  check(
    'T4_TOOLS_WIRED',
    names.includes('stash_deferred_demand') &&
      names.includes('get_stashed_demands') &&
      manifest.includes('stash_deferred_demand') &&
      manifest.includes('get_stashed_demands') &&
      toolsCode.includes("case 'stash_deferred_demand'") &&
      toolsCode.includes("case 'get_stashed_demands'") &&
      toolsCode.includes('stash_deferred_demand: stashDeferredDemandInputSchema'),
    `declaradas=${names.length} manifest=${manifest.length}`,
  );

  /* ── T5 · SCRIPT_MAITRE (guion determinista, FASE 3) ─────────────────────── */
  const script: string = buildConcentricRefusalScript({
    requestedLabel: 'fotografía y vídeo',
    providerName: 'Otzarreta',
    anchorOfferName: 'Menú Ezkertza',
    depositCents: 10000,
  });
  check(
    'T5_SCRIPT_MAITRE',
    script.startsWith(DEFERRED_DEMAND_SCRIPT_MARKER) &&
      script.includes('fotografía y vídeo') &&
      script.includes('Otzarreta') &&
      script.includes('Menú Ezkertza') &&
      script.includes('fecha y la propuesta principal') &&
      script.trimEnd().endsWith('¿Revisamos el aforo y la fecha deseada?'),
    `chars=${script.length} marcador=${script.startsWith(DEFERRED_DEMAND_SCRIPT_MARKER)}`,
  );

  /* ── T6 · SCRIPT_FIANZA_SSOT (el techo nunca se infla) ───────────────────── */
  const expectedDeposit: string = DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',');
  const ssotScript: string = buildConcentricRefusalScript({
    requestedLabel: 'transporte de invitados',
    providerName: 'Otzarreta',
    anchorOfferName: null,
    depositCents: null,
  });
  const inflated: string = buildConcentricRefusalScript({
    requestedLabel: 'transporte de invitados',
    providerName: 'Otzarreta',
    anchorOfferName: null,
    depositCents: 5_000_00,
  });
  const lowerOk: string = buildConcentricRefusalScript({
    requestedLabel: 'transporte de invitados',
    providerName: 'Otzarreta',
    anchorOfferName: null,
    depositCents: 5_000,
  });
  check(
    'T6_SCRIPT_FIANZA_SSOT',
    ssotScript.includes(`${expectedDeposit} €`) &&
      inflated.includes(`${expectedDeposit} €`) &&
      !inflated.includes('5.000,00 €') &&
      lowerOk.includes('50,00 €'),
    `ssot=${expectedDeposit} techo_aplicado=${inflated.includes(`${expectedDeposit} €`)} inferior_respetado=${lowerOk.includes('50,00 €')}`,
  );

  /* ── T7 · DETECT_ISOLATION (solo lo ajeno) ───────────────────────────────── */
  const casesDetect: ReadonlyArray<{ readonly text: string; readonly expected: string | null }> = [
    { text: '¿Tenéis fotógrafo para la boda?', expected: 'PHOTO' },
    { text: '¿Y un DJ para después de la cena?', expected: 'MUSIC' },
    { text: 'Necesitamos autobús para los invitados', expected: 'TRANSPORT' },
    { text: '¿Se puede llevar tarta de boda propia?', expected: 'GASTRO_EXTRA' },
    { text: 'Queremos flores para los centros de mesa', expected: 'DECORATION' },
    { text: '¿Cuál es el menú del banquete?', expected: null },
    { text: 'Quiero reservar para 80 personas', expected: null },
    { text: '¿Qué aforo tiene el salón?', expected: null },
  ];
  const detected: string = casesDetect
    .map((item) => `${item.text} ⇒ ${String(detectDeferredCategory(item.text))}`)
    .join(' | ');
  const allOk: boolean = casesDetect.every((item) => detectDeferredCategory(item.text) === item.expected);
  check(
    'T7_DETECT_ISOLATION',
    allOk && DEFERRED_DEMAND_CATEGORIES.length === 5,
    `casos=${casesDetect.length} correctos=${allOk} · ${detected}`,
  );

  /* ── T8 · PII_ZERO (INV-14) ──────────────────────────────────────────────── */
  const piiMessage: string =
    'Mi email es maria.lopez@example.com, DNI 12345678Z, IBAN ES9121000418450200051332 y quiero fotógrafo para 40 invitados';
  const piiDetection = detectDeferredDemand(piiMessage);
  const leaked: readonly string[] = ['maria.lopez@example.com', '12345678Z', 'ES9121000418450200051332'];
  check(
    'T8_PII_ZERO',
    piiDetection.detected &&
      piiDetection.category === 'PHOTO' &&
      leaked.every((needle: string) => !piiDetection.sanitizedPrompt.includes(needle)) &&
      piiDetection.sanitizedPrompt.includes('[REDACTADO]') &&
      piiDetection.sanitizedPrompt.length <= MAX_DEMAND_PROMPT_CHARS,
    `categoria=${String(piiDetection.category)} redactado=${piiDetection.sanitizedPrompt.includes('[REDACTADO]')} ` +
      `fugas=${leaked.filter((n) => piiDetection.sanitizedPrompt.includes(n)).length}`,
  );

  /* ── T9 · FINGERPRINT_IDEMPOT (misma petición = misma fila) ──────────────── */
  const fpA: string = demandFingerprint('¿Tenéis fotógrafo para la boda?');
  const fpB: string = demandFingerprint('  ¿TENEIS fotografo para la boda?  ');
  const fpC: string = demandFingerprint('¿Tenéis fotógrafo para la cena de empresa?');
  check(
    'T9_FINGERPRINT_IDEMPOT',
    fpA === fpB && fpA !== fpC && /^[a-f0-9]{64}$/.test(fpA),
    `iguales_normalizado=${fpA === fpB} distintos_contenido=${fpA !== fpC} sha256=${/^[a-f0-9]{64}$/.test(fpA)}`,
  );

  /* ── T10 · POST_CONVERSION (FASE 4) ──────────────────────────────────────── */
  const postScript: string | null = buildPostConversionScript({
    providerName: 'Otzarreta',
    anchorOfferName: 'Menú Ezkertza',
    demands: [
      { category: 'PHOTO', rawPrompt: 'fotógrafo' },
      { category: 'MUSIC', rawPrompt: 'DJ' },
      { category: 'PHOTO', rawPrompt: 'vídeo' },
    ],
  });
  const emptyPost: string | null = buildPostConversionScript({
    providerName: 'Otzarreta',
    anchorOfferName: null,
    demands: [],
  });
  check(
    'T10_POST_CONVERSION',
    postScript !== null &&
      postScript.includes('Enhorabuena') &&
      postScript.includes('Otzarreta') &&
      postScript.includes('fotografía y vídeo') &&
      postScript.includes('música en directo o DJ') &&
      (postScript.match(/fotografía y vídeo/g) ?? []).length === 1 &&
      postScript.trimEnd().endsWith('¿Cuál de estas prioridades queréis que dejemos resuelta ahora?') &&
      emptyPost === null,
    `chars=${postScript?.length ?? 0} dedup=${(postScript?.match(/fotografía y vídeo/g) ?? []).length === 1} ` +
      `vacia_devuelve_null=${emptyPost === null}`,
  );

  /* ── T11 · FAIL_CLOSED_DB (AF-1/AF-5: nunca verde falso) ─────────────────── */
  // Se fuerza un fallo de conexión apuntando Prisma a un puerto muerto.
  const previousUrl: string | undefined = process.env.POSTGRES_PRISMA_URL;
  process.env.POSTGRES_PRISMA_URL = 'postgresql://audit:audit@127.0.0.1:1/audit_offline?connect_timeout=2';
  let failClosed: boolean;
  let failDetail: string;
  try {
    const call = await callTool('stash_deferred_demand', {
      sessionId: 'sess-audit-offline',
      providerId: 'provider-audit-offline',
      category: 'PHOTO',
      prompt: 'Necesito fotógrafo para 60 invitados',
    });
    const envelope = call.result?.envelope;
    const data = envelope?.data as
      | { persisted?: unknown; created?: unknown; demandId?: unknown; failureCode?: unknown }
      | undefined;
    failClosed =
      call.ok === true &&
      envelope?.ok === false &&
      envelope.mode === 'SIMULADO' &&
      data?.persisted === false &&
      data?.created === false &&
      data?.demandId === null &&
      // AF-1: el fallo debe ser ACCIONABLE, no un `UNKNOWN` que no dice nada.
      data?.failureCode === 'DB_UNREACHABLE';
    failDetail = `ok=${String(envelope?.ok)} mode=${String(envelope?.mode)} persisted=${String(data?.persisted)} ` +
      `failureCode=${String(data?.failureCode)}`;
  } catch {
    failClosed = false;
    failDetail = 'excepción no capturada (el fallo NO es fail-closed)';
  } finally {
    if (previousUrl === undefined) delete process.env.POSTGRES_PRISMA_URL;
    else process.env.POSTGRES_PRISMA_URL = previousUrl;
  }
  check('T11_FAIL_CLOSED_DB', failClosed, failDetail);

  /* ── T12 · WEBHOOK_WIRING (FASE 4 cableada e idempotente) ────────────────── */
  const webhook: string = readRepo('src/app/api/stripe/webhook/route.ts');
  const demandModule: string = readRepo('src/lib/concierge/deferred-demand.ts');
  check(
    'T12_WEBHOOK_WIRING',
    webhook.includes("case 'checkout.session.completed'") &&
      webhook.includes('replenishAfterAnchor(') &&
      webhook.includes('metadata.providerId') &&
      webhook.includes('buildPostConversionScript(') &&
      demandModule.includes("status: { in: ['STASHED', 'PRESENTED'] }") &&
      demandModule.includes("status: 'PRESENTED'"),
    `repliegue=${webhook.includes('replenishAfterAnchor(')} guard=${webhook.includes('metadata.providerId')} ` +
      `solo_promueve_stashed=${demandModule.includes("status: 'PRESENTED'")}`,
  );

  /* ── T13 · ZONA_CERO_INTACTA (INV-05) ────────────────────────────────────── */
  let ssotClean: boolean;
  let ssotDetail: string;
  try {
    const diff: string = execFileSync('git', ['status', '--porcelain', '--', 'src/lib/constants/ear-os-ssot.ts'], {
      cwd: ROOT,
      encoding: 'utf8',
    }).trim();
    ssotClean = diff.length === 0;
    ssotDetail = ssotClean ? 'sin cambios' : `MODIFICADO: ${diff}`;
  } catch {
    ssotClean = false;
    ssotDetail = 'git no disponible: SIN_EVIDENCIA';
  }
  check('T13_ZONA_CERO_INTACTA', ssotClean, ssotDetail);

  report();
}

/**
 * Recorta el bloque `model X { ... }` del esquema. Cadena vacía si no existe:
 * el test falla con `modelo=0` en lugar de lanzar.
 */
function sliceModel(schema: string, modelName: string): string {
  const start: number = schema.indexOf(`model ${modelName} {`);
  if (start === -1) return '';
  const end: number = schema.indexOf('\n}', start);
  return end === -1 ? schema.slice(start) : schema.slice(start, end + 2);
}

/** Emite el acta y fija el Exit Code (0 = todo falsable y vivo). */
function report(): void {
  const failed: CaseResult[] = cases.filter((item) => !item.ok);
  const passed: number = cases.length - failed.length;

  if (JSON_MODE) {
    process.stdout.write(`${JSON.stringify({ ok: failed.length === 0, passed, total: cases.length, cases }, null, 2)}\n`);
  } else {
    for (const item of cases) {
      process.stdout.write(`${item.ok ? 'PASS' : 'FAIL'}  ${item.id.padEnd(24)} ${item.detail}\n`);
    }
    process.stdout.write(`\n${passed}/${cases.length} verificaciones superadas\n`);
  }

  process.exitCode = failed.length === 0 ? 0 : 1;
}

void main();

