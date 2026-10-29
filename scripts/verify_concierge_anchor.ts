/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🎯 AUDITOR REAL — ANCLAJE ANTI-SESGO EN LA CONCIERGE VIVA (W46 · P0)
 * ════════════════════════════════════════════════════════════════════════════
 * `AIConciergeDock` se renderiza en `src/app/layout.tsx` vía
 * `DynamicMobileExperienceOrchestrator`, así que `POST /api/chat/concierge`
 * es la ruta VIVA del dinero. Este auditor la invoca con el handler real:
 *
 *   A) Ficha de proveedor de terceros (`/proveedores/v-10615`):
 *      · `rosterRecommendation` AUSENTE (estructural, no depende del LLM).
 *      · `suggestedChips` sin «Mariachi y Solista».
 *      · La respuesta nombra al proveedor real, nunca a Edwin Agudelo.
 *      · Cero `350 €` y cero `/reservar/solista` (el sesgo del roster).
 *   B) Portada (`/`):
 *      · `rosterRecommendation` PRESENTE (la venta propia sigue viva).
 *
 * Para que la evidencia sea reproducible se neutralizan las claves LLM del
 * proceso (DeepSeek/Gemini): se audita el fallback determinista anclado, que
 * es el que responde cuando el LLM cae. Las aserciones estructurales valen
 * también con LLM encendido.
 *
 * Uso:   node ./node_modules/tsx/dist/cli.mjs scripts/verify_concierge_anchor.ts
 * ════════════════════════════════════════════════════════════════════════════
 */

import { POST as conciergePost } from '../src/app/api/chat/concierge/route';

interface ConciergePayload {
  readonly success?: boolean;
  readonly reply?: string;
  readonly rosterRecommendation?: unknown;
  readonly suggestedChips?: readonly string[];
  readonly detectedLocation?: { readonly category?: string; readonly province?: string };
  readonly error?: string;
}

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

async function ask(message: string, pathname: string): Promise<{ status: number; payload: ConciergePayload }> {
  const request = new Request('http://localhost:3007/api/chat/concierge', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '10.0.0.7' },
    body: JSON.stringify({ message, pathname }),
  });
  const response = await conciergePost(request);
  const payload = (await response.json()) as ConciergePayload;
  return { status: response.status, payload };
}

function neutraliseLlmKeys(): void {
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.GEMINI_API_KEY;
  delete process.env.GOOGLE_API_KEY;
}

async function main(): Promise<void> {
  neutraliseLlmKeys();

  // ── A) FICHA DE TERCEROS: CERO SESGO DEL ROSTER ─────────────────────────
  const ficha = await ask('¿Qué menú y qué precio tiene para 60 invitados?', '/proveedores/v-10615');
  const fichaReply: string = ficha.payload.reply ?? '';
  const fichaChips: string = (ficha.payload.suggestedChips ?? []).join(' | ');

  check('Ficha: HTTP 200', ficha.status === 200 && ficha.payload.success === true, `status=${String(ficha.status)}`);
  check(
    'Ficha: rosterRecommendation AUSENTE (estructural)',
    ficha.payload.rosterRecommendation === undefined,
    `roster=${String(ficha.payload.rosterRecommendation)}`,
  );
  check('Ficha: sin «Mariachi y Solista» en los chips', !/solista/i.test(fichaChips), fichaChips);
  check(
    'Ficha: la respuesta nombra al proveedor real',
    /El Portón de Javier/i.test(fichaReply),
    fichaReply.slice(0, 90),
  );
  check('Ficha: cero tarifa del solista (350 €)', !/350/.test(fichaReply), 'cero cifra del roster');
  check('Ficha: cero embudo del solista', !/reservar\/solista/i.test(fichaReply), 'cero CTA de Edwin');
  check('Ficha: cero lobby «Edwin»', !/Edwin/i.test(fichaReply), 'cero nombre propio del roster');
  check(
    'Ficha: categoría derivada, no genérica vacía',
    typeof ficha.payload.detectedLocation?.category === 'string' &&
      (ficha.payload.detectedLocation?.category ?? '').length > 0,
    `category=${String(ficha.payload.detectedLocation?.category)}`,
  );

  // ── B) PORTADA: LA VENTA PROPIA SIGUE VIVA ──────────────────────────────
  const home = await ask('Busco finca rústica en Toledo para una boda', '/');
  const homeReply: string = home.payload.reply ?? '';

  check('Portada: HTTP 200', home.status === 200 && home.payload.success === true, `status=${String(home.status)}`);
  check(
    'Portada: rosterRecommendation PRESENTE',
    home.payload.rosterRecommendation !== undefined,
    `roster=${String(home.payload.rosterRecommendation !== undefined)}`,
  );
  check('Portada: respuesta no vacía', homeReply.length > 20, `${String(homeReply.length)} chars`);

  const failed: readonly CaseResult[] = cases.filter((item: CaseResult) => !item.ok);
  for (const item of cases) {
    console.log(`${item.ok ? '[OK]' : '[FAIL]'} ${item.name} — ${item.detail}`);
  }
  console.log('--- FICHA REPLY ---');
  console.log(fichaReply);
  console.log(
    JSON.stringify(
      { audit: 'concierge_provider_anchor', total: cases.length, passed: cases.length - failed.length, failed: failed.length },
      null,
      2,
    ),
  );
  process.exitCode = failed.length === 0 ? 0 : 1;
}

void main();
