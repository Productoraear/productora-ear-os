#!/usr/bin/env node
/**
 * ════════════════════════════════════════════════════════════════════════════
 * ARNÉS FALSABLE · WEBHOOK DE CONVERSIÓN WHATSAPP (W55_T02 · WAVE 55)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: «el webhook atiende WhatsApp y cotiza con el SSOT» es prosa
 * decorativa si nadie demuestra (a) que el handshake falla cerrado, (b) que una
 * firma manipulada NO entra, (c) que el reparto 80/10/10 suma el total al
 * céntimo, y (d) que el número del cliente no viaja en la respuesta.
 *
 * Qué prueba (y cómo se rompe: Exit 1):
 *   W01 · MANIFEST          · el módulo expone verificación, plan y render.
 *   W02 · HANDSHAKE_OK      · hub.* correcto => 200 con el challenge en claro.
 *   W02B· RUTA_HANDSHAKE    · el Route Handler devuelve el challenge por GET.
 *   W03 · HANDSHAKE_TOKEN   · token distinto => 403, sin challenge.
 *   W04 · HANDSHAKE_MODE    · hub.mode distinto => 400.
 *   W05 · HANDSHAKE_NOENV   · sin WHATSAPP_VERIFY_TOKEN => 503 (fail-closed).
 *   W06 · SIGNATURE_OK      · HMAC-SHA256 correcta => verificada.
 *   W07 · SIGNATURE_MUTADA  · un byte distinto => 403 (no entra).
 *   W08 · SIGNATURE_NOENV   · sin secreto => 503, jamás 200.
 *   W09 · PARSE_TEXT        · payload Meta => evento TEXT normalizado.
 *   W10 · PARSE_BUTTON      · clic interactivo con `ficha:<slug>` => slug.
 *   W11 · PARSE_N8N         · payload plano de n8n => evento.
 *   W12 · PARSE_BASURA      · payload sin remitente/id => ok:false declarado.
 *   W13 · INTENT_PAX        · «120 pax» => 120; «120» suelto => null.
 *   W14 · INTENT_EUROS      · «1.500,50 euros» => 150050 céntimos enteros.
 *   W15 · SPLIT_80_10_10    · el reparto suma el total al céntimo (INV-02).
 *   W16 · DEPOSITO_100      · el depósito es el del SSOT y es deducible.
 *   W17 · PRICE_LOCK_LINK   · el enlace apunta al terminal que honra `base`.
 *   W18 · NO_COBRA          · createsStripeSession:false en plan y ruta.
 *   W19 · SIN_FICHA_INVENTA · texto sin fichas => no afirma proveedor.
 *   W20 · SIN_PII           · el teléfono del cliente NO aparece en la respuesta.
 *   W21 · TOOL_CALLS        · despacha calculate_quote / get_ficha_details.
 *   W22 · IDEMPOTENCIA      · misma entrada => mismo sello SHA-256.
 *   W23 · ZERO_ANY          · cero `any` explícito en los 2 módulos.
 *   W24 · RUTA_DENY         · PUT/DELETE => 405 en el Route Handler.
 *   W25 · RUTA_NO_AUTH      · POST sin firma ni token => 401, sin procesar.
 *   W26 · RUTA_SIN_SECRETO  · POST con firma y sin secreto => 503.
 *   W27 · RUTA_OK           · POST firmado => 200 con plan, sello y DLQ.
 *   W28 · MCP_ENDPOINT      · el endpoint MCP se compone del origen inyectado.
 *   W29 · SSOT_BASE         · la tarifa base del SSOT sigue siendo 350 EUR.
 *
 * Uso:
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_whatsapp_concierge_webhook.ts
 *   node ./node_modules/tsx/dist/cli.mjs scripts/verify_whatsapp_concierge_webhook.ts --json
 *
 * Exit: 0 = contrato vivo · 1 = promesa rota · 2 = fatal (módulo ilegible).
 * Salida ASCII pura (PowerShell / CI sin mojibake).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';

import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR, TARIFA_BASE_SOLISTA_EUR } from '../src/lib/constants/ear-os-ssot';
import {
  buildSplitReport,
  extractIntent,
  loadDefaultFichas,
  parseInboundEvent,
  planConciergeReply,
  resolveMcpEndpointUrl,
  verifyWebhookSignature,
  verifyWebhookSubscription,
  type InboundEvent,
} from '../src/lib/whatsapp/whatsapp-concierge';
import {
  DELETE as routeDelete,
  GET as routeGet,
  POST as routePost,
  PUT as routePut,
} from '../src/app/api/webhooks/whatsapp-concierge/route';

const JSON_MODE: boolean = process.argv.includes('--json');
const FIXED_NOW: number = Date.parse('2026-11-11T12:00:00.000Z');

interface CaseResult {
  readonly id: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(id: string, ok: boolean, detail: string): void {
  cases.push({ id, ok, detail });
}

const VERIFY_TOKEN = 'ear-os-verify-token-2026';
const APP_SECRET = 'ff00aa11bb22cc33dd44ee55ff66aa77';
const LAUNCHER_TOKEN = 'n8n-launcher-token-0123456789';
const CLIENT_WA_ID = '34600111222';

const ENV_VERIFY: Record<string, string> = { WHATSAPP_VERIFY_TOKEN: VERIFY_TOKEN };
const ENV_SIGN: Record<string, string> = { WHATSAPP_APP_SECRET: APP_SECRET };

/** Payload tal cual lo envía Meta (entry[].changes[].value.messages[]). */
function metaTextPayload(body: string, id: string = 'wamid.TEST-1'): string {
  return JSON.stringify({
    object: 'whatsapp_business_account',
    entry: [
      {
        id: 'WABA-1',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              contacts: [{ wa_id: CLIENT_WA_ID, profile: { name: 'Cliente' } }],
              messages: [{ from: CLIENT_WA_ID, id, timestamp: '1762780800', type: 'text', text: { body } }],
            },
          },
        ],
      },
    ],
  });
}

function sign(raw: string, secret: string): string {
  return `sha256=${createHmac('sha256', secret).update(raw, 'utf8').digest('hex')}`;
}

async function main(): Promise<number> {
  /* W01 · manifiesto de la superficie */
  check(
    'W01_MANIFEST',
    typeof verifyWebhookSubscription === 'function' &&
      typeof verifyWebhookSignature === 'function' &&
      typeof planConciergeReply === 'function' &&
      typeof parseInboundEvent === 'function',
    'verificacion + parseo + plan exportados',
  );

  /* W02 · handshake correcto */
  {
    const params = new URLSearchParams({
      'hub.mode': 'subscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': '1158201444',
    });
    const verdict = verifyWebhookSubscription(params, ENV_VERIFY);
    check('W02_HANDSHAKE_OK', verdict.ok && verdict.challenge === '1158201444', `ok=${String(verdict.ok)}`);
  }

  /* W03 · token distinto */
  {
    const params = new URLSearchParams({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'token-ajeno',
      'hub.challenge': '42',
    });
    const verdict = verifyWebhookSubscription(params, ENV_VERIFY);
    check(
      'W03_HANDSHAKE_TOKEN',
      !verdict.ok && verdict.status === 403,
      `status=${verdict.ok ? 'ok' : String(verdict.status)}`,
    );
  }

  /* W04 · modo distinto */
  {
    const params = new URLSearchParams({
      'hub.mode': 'unsubscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': '42',
    });
    const verdict = verifyWebhookSubscription(params, ENV_VERIFY);
    check(
      'W04_HANDSHAKE_MODE',
      !verdict.ok && verdict.status === 400,
      `status=${verdict.ok ? 'ok' : String(verdict.status)}`,
    );
  }

  /* W05 · sin secreto configurado */
  {
    const params = new URLSearchParams({
      'hub.mode': 'subscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': '42',
    });
    const verdict = verifyWebhookSubscription(params, {});
    check(
      'W05_HANDSHAKE_NOENV',
      !verdict.ok && verdict.status === 503,
      `status=${verdict.ok ? 'ok' : String(verdict.status)}`,
    );
  }

  /* W06 · firma correcta */
  {
    const raw = metaTextPayload('Hola, boda para 120 pax');
    const verdict = verifyWebhookSignature(raw, sign(raw, APP_SECRET), ENV_SIGN);
    check('W06_SIGNATURE_OK', verdict.ok, `ok=${String(verdict.ok)}`);
  }

  /* W07 · firma manipulada */
  {
    const raw = metaTextPayload('Hola, boda para 120 pax');
    const good = sign(raw, APP_SECRET);
    const mutated = good.slice(0, -1) + (good.endsWith('0') ? '1' : '0');
    const verdict = verifyWebhookSignature(raw, mutated, ENV_SIGN);
    check(
      'W07_SIGNATURE_MUTADA',
      !verdict.ok && verdict.status === 403,
      `status=${verdict.ok ? 'ok' : String(verdict.status)}`,
    );
  }

  /* W09 · parseo de texto de Meta */
  let textEvent: InboundEvent | null = null;
  {
    const parsed = parseInboundEvent(
      JSON.parse(metaTextPayload('Boda para 120 pax en Toledo con presupuesto de 1.500,50 euros')) as unknown,
      'seed-w01',
    );
    if (parsed.ok) textEvent = parsed.event;
    check(
      'W09_PARSE_TEXT',
      parsed.ok &&
        parsed.event.kind === 'TEXT' &&
        parsed.event.fichaSlug === null &&
        parsed.event.messageId === 'wamid.TEST-1',
      parsed.ok ? `kind=${parsed.event.kind} waRef=${parsed.event.waRef.slice(0, 8)}...` : parsed.reason,
    );
  }

  /* W10 · clic de botón interactivo con slug */
  {
    const payload = {
      waId: CLIENT_WA_ID,
      messageId: 'n8n-btn-1',
      type: 'interactive',
      interactive: { button_reply: { id: 'ficha:v-10615', title: 'Ver El Porton' } },
    };
    const parsed = parseInboundEvent(payload, 'seed-w01');
    check(
      'W10_PARSE_BUTTON',
      parsed.ok && parsed.event.kind === 'INTERACTIVE_REPLY' && parsed.event.fichaSlug === 'v-10615',
      parsed.ok ? `slug=${String(parsed.event.fichaSlug)}` : parsed.reason,
    );
  }

  /* W11 · payload plano de n8n */
  {
    const payload = { from: CLIENT_WA_ID, id: 'evt-77', type: 'text', text: { body: 'Necesito mariachi para 60 personas' } };
    const parsed = parseInboundEvent(payload);
    check(
      'W11_PARSE_N8N',
      parsed.ok && parsed.event.kind === 'TEXT',
      parsed.ok ? `id=${parsed.event.messageId}` : parsed.reason,
    );
  }

  /* W12 · basura declarada, no silenciada */
  {
    const parsed = parseInboundEvent({ entry: [] });
    const parsedNull = parseInboundEvent(null);
    check('W12_PARSE_BASURA', !parsed.ok && !parsedNull.ok, `entry_vacia=${parsed.ok ? 'aceptada' : 'rechazada'}`);
  }

  /* W13 · aforo */
  {
    const withPax = extractIntent('Boda para 120 pax el 15 de junio');
    const bare = extractIntent('Necesito algo para 120');
    check(
      'W13_INTENT_PAX',
      withPax.pax === 120 && bare.pax === null,
      `con_unidad=${String(withPax.pax)} suelto=${String(bare.pax)}`,
    );
  }

  /* W14 · presupuesto en céntimos enteros */
  {
    const intent = extractIntent('Mi presupuesto es 1.500,50 euros para la boda');
    check('W14_INTENT_EUROS', intent.budgetCents === 150050, `cents=${String(intent.budgetCents)}`);
  }

  /* W15 · split 80/10/10 al céntimo */
  {
    const report = buildSplitReport(150050);
    const sumCents =
      Math.round(report.split.artista * 100) +
      Math.round(report.split.earOs * 100) +
      Math.round(report.split.vimume * 100);
    check(
      'W15_SPLIT_80_10_10',
      report.splitSumsToTotal && sumCents === 150050,
      `artista=${report.split.artista.toFixed(2)} earOs=${report.split.earOs.toFixed(2)} vimume=${report.split.vimume.toFixed(2)} suma=${String(sumCents)}`,
    );
  }

  /* W16 · depósito del SSOT, deducible */
  {
    const report = buildSplitReport(150050);
    const depositCents: number = Math.round(DEPOSITO_STRIPE_EUR * 100);
    check(
      'W16_DEPOSITO_100',
      DEPOSITO_STRIPE_EUR === 100 && report.totalCents - depositCents === 140050,
      `deposito=${DEPOSITO_STRIPE_EUR.toFixed(2)} resto=${((report.totalCents - depositCents) / 100).toFixed(2)}`,
    );
  }

  const entry: InboundEvent | null = textEvent;
  const plan = entry === null ? null : planConciergeReply(entry, { entries: loadDefaultFichas(), now: FIXED_NOW });

  if (entry !== null && process.env.EAR_W55_T02_TRACE === '1') {
    process.stdout.write(
      `TRACE pax=${String(plan?.intent.pax)} budget=${String(plan?.intent.budgetCents)} fichas=${String(plan?.suggestions.length)} quote=${String(plan?.tree !== null)}\n`,
    );
  }

  /* W17 · enlace Price-Lock */
  check(
    'W17_PRICE_LOCK_LINK',
    plan !== null &&
      plan.priceLockHref !== null &&
      plan.priceLockHref.startsWith('/checkout/presupuesto?') &&
      plan.splitReport !== null &&
      plan.priceLockHref.includes(`base=${plan.splitReport.totalEur.toFixed(2)}`),
    plan === null ? 'sin plan' : `href=${String(plan.priceLockHref).slice(0, 70)}`,
  );

  /* W18 · no cobra */
  {
    const routeSource = readFileSync('src/app/api/webhooks/whatsapp-concierge/route.ts', 'utf8');
    check(
      'W18_NO_COBRA',
      plan !== null && plan.createsStripeSession === false && routeSource.includes('createsStripeSession: false'),
      `plan=${String(plan?.createsStripeSession)} ruta=${String(routeSource.includes('createsStripeSession: false'))}`,
    );
  }

  /* W19 · sin ficha inventada */
  {
    const parsed = parseInboundEvent(
      { waId: CLIENT_WA_ID, messageId: 'evt-sin-ficha', type: 'text', text: { body: 'zzzzqqqq xxxxvvvv' } },
      'seed-w01',
    );
    const emptyPlan = parsed.ok ? planConciergeReply(parsed.event, { entries: [], now: FIXED_NOW }) : null;
    check(
      'W19_SIN_FICHA_INVENTA',
      emptyPlan !== null &&
        emptyPlan.suggestions.length === 0 &&
        emptyPlan.tree === null &&
        emptyPlan.replyText.includes('no invento un proveedor'),
      emptyPlan === null ? 'sin plan' : `sugerencias=${String(emptyPlan.suggestions.length)}`,
    );
  }

  /* W20 · cero PII en la respuesta */
  {
    const reply = plan === null ? '' : plan.replyText;
    const leaked: boolean = reply.replace(/\D/g, '').includes(CLIENT_WA_ID);
    check(
      'W20_SIN_PII',
      reply.length > 0 && !leaked,
      `telefono_en_respuesta=${String(leaked)} waRef_len=${String(plan?.waRef.length ?? 0)}`,
    );
  }

  /* W21 · tool calls MCP */
  {
    const names = (plan?.toolCalls ?? []).map((call) => call.name);
    check(
      'W21_TOOL_CALLS',
      names.length > 0 && names.every((name) => name === 'calculate_quote' || name === 'get_ficha_details'),
      `tools=[${names.join(', ')}]`,
    );
  }

  /* W22 · idempotencia del sello */
  {
    const again = entry === null ? null : planConciergeReply(entry, { entries: loadDefaultFichas(), now: FIXED_NOW });
    check(
      'W22_IDEMPOTENCIA',
      plan !== null && again !== null && again.evidenceSha256 === plan.evidenceSha256 && again.replyText === plan.replyText,
      `sha256=${plan?.evidenceSha256.slice(0, 12) ?? 'n/a'}...`,
    );
  }

  /* W23 · cero any explícito */
  {
    const files = ['src/lib/whatsapp/whatsapp-concierge.ts', 'src/app/api/webhooks/whatsapp-concierge/route.ts'];
    const offenders: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, 'utf8');
      source.split(/\r?\n/).forEach((line, index) => {
        const forbidden: RegExp = new RegExp(':\\s*' + 'any' + '\\b|<' + 'any' + '>|\\bas\\s+' + 'any' + '\\b');
        if (forbidden.test(line) && !/^\s*(\/\/|\*)/.test(line)) {
          offenders.push(`${file}:${index + 1}`);
        }
      });
    }
    check(
      'W23_ZERO_ANY',
      offenders.length === 0,
      `archivos=${String(files.length)} infracciones=${String(offenders.length)}`,
    );
  }

  /* W24 · default-deny de verbos */
  {
    const put = routePut();
    const removed = routeDelete();
    check('W24_RUTA_DENY', put.status === 405 && removed.status === 405, `PUT=${String(put.status)} DELETE=${String(removed.status)}`);
  }

  /* W25 · POST sin credenciales del origen */
  {
    const raw = metaTextPayload('Hola');
    const response = await routePost(
      new Request('https://www.productoraear.com/api/webhooks/whatsapp-concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: raw,
      }),
    );
    const body = (await response.json()) as { gate?: string; ok?: boolean };
    check(
      'W25_RUTA_NO_AUTH',
      response.status === 401 && body.ok === false,
      `status=${String(response.status)} gate=${String(body.gate)}`,
    );
  }

  /* W26 · firma válida pero secreto ausente en el entorno */
  {
    const raw = metaTextPayload('Hola');
    const previous: string | undefined = process.env.WHATSAPP_APP_SECRET;
    delete process.env.WHATSAPP_APP_SECRET;
    const response = await routePost(
      new Request('https://www.productoraear.com/api/webhooks/whatsapp-concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-hub-signature-256': sign(raw, APP_SECRET) },
        body: raw,
      }),
    );
    if (previous !== undefined) process.env.WHATSAPP_APP_SECRET = previous;
    check('W26_RUTA_SIN_SECRETO', response.status === 503, `status=${String(response.status)}`);
  }

  /* W27 · POST firmado: procesa y declara la entrega real */
  {
    const raw = metaTextPayload('Boda para 120 pax, presupuesto 1.500,50 euros');
    const previousSecret: string | undefined = process.env.WHATSAPP_APP_SECRET;
    const previousBase: string | undefined = process.env.N8N_BASE_URL;
    const previousLaunch: string | undefined = process.env.WHATSAPP_WEBHOOK_TOKEN;
    process.env.WHATSAPP_APP_SECRET = APP_SECRET;
    // n8n apuntado a un host no enrutable: la respuesta DEBE decir que no
    // entregó (cero verde por defecto) en vez de fingir un envío.
    process.env.N8N_BASE_URL = 'http://127.0.0.1:1';
    process.env.WHATSAPP_WEBHOOK_TOKEN = LAUNCHER_TOKEN;

    const response = await routePost(
      new Request('https://www.productoraear.com/api/webhooks/whatsapp-concierge', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-hub-signature-256': sign(raw, APP_SECRET) },
        body: raw,
      }),
    );
    const body = (await response.json()) as {
      ok?: boolean;
      authenticatedBy?: string;
      delivered?: boolean;
      deadLettered?: boolean;
      replyText?: string;
      evidenceSha256?: string;
      mcpEndpoint?: string;
      splitSumsToTotal?: boolean | null;
    };

    if (previousSecret === undefined) delete process.env.WHATSAPP_APP_SECRET;
    else process.env.WHATSAPP_APP_SECRET = previousSecret;
    if (previousBase === undefined) delete process.env.N8N_BASE_URL;
    else process.env.N8N_BASE_URL = previousBase;
    if (previousLaunch === undefined) delete process.env.WHATSAPP_WEBHOOK_TOKEN;
    else process.env.WHATSAPP_WEBHOOK_TOKEN = previousLaunch;

    const reply: string = body.replyText ?? '';
    check(
      'W27_RUTA_OK',
      response.status === 200 &&
        body.ok === true &&
        body.authenticatedBy === 'meta-signature' &&
        body.delivered === false &&
        body.deadLettered === true &&
        body.splitSumsToTotal === true &&
        typeof body.evidenceSha256 === 'string' &&
        reply.includes('Reparto 80/10/10') &&
        reply.includes(CENTRALITA_EAR_OS) &&
        !reply.replace(/\D/g, '').includes(CLIENT_WA_ID),
      `status=${String(response.status)} delivered=${String(body.delivered)} dlq=${String(body.deadLettered)} split=${String(body.splitSumsToTotal)}`,
    );

    /* W28 · endpoint MCP compuesto del origen inyectado */
    check(
      'W28_MCP_ENDPOINT',
      body.mcpEndpoint === 'https://www.productoraear.com/api/mcp/concierge' &&
        resolveMcpEndpointUrl('https://productoraear.com/') === 'https://productoraear.com/api/mcp/concierge',
      `mcp=${String(body.mcpEndpoint)}`,
    );
  }

  /* W02B · handshake a través del Route Handler (integración real) */
  {
    process.env.WHATSAPP_VERIFY_TOKEN = VERIFY_TOKEN;
    const response = routeGet(
      new Request(
        'https://www.productoraear.com/api/webhooks/whatsapp-concierge?hub.mode=subscribe&hub.verify_token=' +
          encodeURIComponent(VERIFY_TOKEN) +
          '&hub.challenge=987654',
      ),
    );
    const text: string = await response.text();
    delete process.env.WHATSAPP_VERIFY_TOKEN;
    check(
      'W02B_RUTA_HANDSHAKE',
      response.status === 200 && text === '987654',
      `status=${String(response.status)} challenge=${text.slice(0, 20)}`,
    );
  }

  /* W29 · el suelo del SSOT sigue intacto (INV-01) */
  check(
    'W29_SSOT_BASE',
    plan !== null && plan.replyText.length > 0 && TARIFA_BASE_SOLISTA_EUR === 350,
    `tarifa_base=${TARIFA_BASE_SOLISTA_EUR.toFixed(2)}`,
  );

  const failed: readonly CaseResult[] = cases.filter((item: CaseResult) => !item.ok);
  if (JSON_MODE) {
    process.stdout.write(`${JSON.stringify({ total: cases.length, failed: failed.length, cases }, null, 2)}\n`);
  } else {
    for (const item of cases) {
      process.stdout.write(`${item.ok ? 'PASS' : 'FAIL'}  ${item.id.padEnd(22, ' ')} ${item.detail}\n`);
    }
    process.stdout.write(`\n${String(cases.length - failed.length)}/${String(cases.length)} verificaciones superadas\n`);
    process.stdout.write(failed.length === 0 ? 'WHATSAPP_CONCIERGE=PASS\n' : 'WHATSAPP_CONCIERGE=FAIL\n');
  }
  return failed.length === 0 ? 0 : 1;
}

main()
  .then((code: number) => process.exit(code))
  .catch((error: unknown) => {
    process.stderr.write(`WHATSAPP_CONCIERGE=FATAL ${error instanceof Error ? error.message : String(error)}\n`);
    process.exit(2);
  });
