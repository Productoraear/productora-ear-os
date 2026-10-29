/**
 * ════════════════════════════════════════════════════════════════════════════
 * 🧪 SMOKE HTTP — EL CONCIERGE YA NO HABLA A CIEGAS DEL PROVEEDOR (W43)
 * ════════════════════════════════════════════════════════════════════════════
 * Invoca el handler REAL `POST /api/agents/chat` (sin LLM: sin claves externas
 * cae al fallback determinista) enviando `pathname: /proveedores/<key>` y exige:
 *   1. HTTP 200 y respuesta con el NOMBRE REAL de la ficha.
 *   2. Cero fuga del teléfono verificado (anti-picaresca).
 *   3. Cita del SSOT: depósito 100 € y Conserjería EAR OS.
 *   4. Anti-alucinación: un proveedor inexistente no aparece inventado.
 *   5. ANTI-SESGO DEL ROSTER (P0): en la ficha de un catering NO se vende la
 *      tarifa del solista ni se enlaza la terminal `/reservar/solista`.
 *   6. Anclaje comercial: habla del gremio real, cita su tarifa publicada y el
 *      CTA lleva al presupuesto del proveedor (embudo real, no la serenata).
 *
 * Uso:    node ./node_modules/tsx/dist/cli.mjs scripts/verify_chat_provider_smoke.ts
 * Coste:  $0,00 (cero red saliente; sin claves de LLM configuradas).
 * ════════════════════════════════════════════════════════════════════════════
 */

import fs from 'node:fs';
import path from 'node:path';
import { POST } from '../src/app/api/agents/chat/route';
import type { ProviderFichaGoldFile } from '../src/lib/providers/providerFichaTypes';

interface CaseResult {
  readonly name: string;
  readonly ok: boolean;
  readonly detail: string;
}

const cases: CaseResult[] = [];

function check(name: string, ok: boolean, detail: string): void {
  cases.push({ name, ok, detail });
}

function loadFirstGoldKey(): string | null {
  const filePath: string = path.join(process.cwd(), 'public', 'data', 'fichas', 'fichas_gold.json');
  if (!fs.existsSync(filePath)) return null;
  try {
    const parsed: ProviderFichaGoldFile = JSON.parse(fs.readFileSync(filePath, 'utf8')) as ProviderFichaGoldFile;
    const first = parsed.fichas[0];
    return first === undefined ? null : first.key;
  } catch (error) {
    console.error('[smoke:chat] fichas_gold.json ilegible', error);
    return null;
  }
}

interface ChatResponse {
  readonly reply?: string;
  readonly agentUsed?: string;
  readonly error?: string;
}

async function ask(body: Record<string, unknown>): Promise<{ status: number; payload: ChatResponse }> {
  const request = new Request('http://localhost:3007/api/agents/chat', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
    body: JSON.stringify(body),
  });
  const response = await fetchlessInvoke(request);
  return response;
}

async function fetchlessInvoke(request: Request): Promise<{ status: number; payload: ChatResponse }> {
  const nextResponse = await POST(request);
  const payload: ChatResponse = (await nextResponse.json()) as ChatResponse;
  return { status: nextResponse.status, payload };
}

async function main(): Promise<void> {
  const goldKey: string | null = loadFirstGoldKey();
  check('fichas_gold.json disponible', goldKey !== null, String(goldKey));

  if (goldKey !== null) {
    const goldFilePath: string = path.join(process.cwd(), 'public', 'data', 'fichas', 'fichas_gold.json');
    const parsed: ProviderFichaGoldFile = JSON.parse(fs.readFileSync(goldFilePath, 'utf8')) as ProviderFichaGoldFile;
    const ficha = parsed.fichas[0];
    const { status, payload } = await ask({
      message: '¿Qué puedes decirme de este proveedor? ¿Tiene hueco en agosto?',
      agent: 'omni-supervisor-daemon',
      pathname: `/proveedores/${goldKey}`,
    });
    const reply: string = payload.reply ?? payload.error ?? '';
    console.log('— RESPUESTA CON FICHA —\n' + reply + '\n');

    check('HTTP 200 con ficha real', status === 200, `status=${String(status)}`);
    check(
      'La respuesta nombra la ficha real',
      ficha !== undefined && ficha.name.length > 1 && reply.includes(ficha.name),
      ficha === undefined ? 'sin ficha' : ficha.name,
    );
    check(
      'Cero fuga del teléfono verificado',
      ficha === undefined || ficha.phone === null || !reply.includes(ficha.phone),
      ficha?.phone === null ? 'sin teléfono publicable' : 'teléfono no publicado',
    );
    check(
      'Cita el SSOT (depósito 100 € / Conserjería)',
      reply.includes('100') && (reply.includes('Conserjería') || reply.includes('Conserjeria')),
      'depósito + canal único',
    );
    // ── ANTI-SESGO DEL ROSTER (P0) ──────────────────────────────────────────
    // La ficha es de un catering: vender aquí la serenata del solista es sesgo.
    check(
      'Anti-sesgo: NO vende la tarifa del solista en ficha de terceros',
      !/tarifa\s+base\s+del\s+solista/i.test(reply) &&
        !/reservar\/solista/i.test(reply) &&
        !/\b350\s*(?:€|euros)\b/i.test(reply),
      'cero roster / cero tarifa de Edwin',
    );
    check(
      'Habla del gremio real de la ficha (hostelería / menús)',
      /catering|hosteler|men[uú]/i.test(reply),
      ficha === undefined || ficha.category.length === 0 ? 'gremio derivado del perfil' : ficha.category,
    );
    check(
      'Cita la tarifa publicada en la ficha',
      ficha === undefined || ficha.priceEur === null || reply.includes(String(ficha.priceEur)),
      ficha === undefined || ficha.priceEur === null ? 'ficha sin tarifa publicada' : `priceEur=${String(ficha.priceEur)}`,
    );
    check(
      'CTA al presupuesto del proveedor (no a la terminal del solista)',
      reply.includes('/checkout/presupuesto?venue='),
      'embudo de presupuesto real',
    );
    check(
      'WhatsApp pre-rellenado con el proveedor real',
      reply.includes('wa.me/') && ficha !== undefined && reply.includes(encodeURIComponent(ficha.name)),
      ficha === undefined ? 'sin ficha' : `texto con «${ficha.name}»`,
    );
    check('Identifica el agente emisor', typeof payload.agentUsed === 'string' && payload.agentUsed.length > 0, String(payload.agentUsed));
  }

  const ghost = await ask({
    message: '¿Qué puedes decirme de este proveedor?',
    agent: 'omni-supervisor-daemon',
    pathname: '/proveedores/proveedor-fantasma-zzz',
  });
  const ghostReply: string = ghost.payload.reply ?? ghost.payload.error ?? '';
  check('Proveedor inexistente: responde sin romper', ghost.status === 200, `status=${String(ghost.status)}`);
  check(
    'Proveedor inexistente: no inventa el nombre fantasma',
    !ghostReply.toLowerCase().includes('fantasma'),
    ghostReply.slice(0, 120),
  );

  const failed: readonly CaseResult[] = cases.filter((item: CaseResult) => !item.ok);
  for (const item of cases) {
    console.log(`${item.ok ? '✅' : '❌'} ${item.name} — ${item.detail}`);
  }
  console.log(
    JSON.stringify(
      { smoke: 'chat_provider_grounding', total: cases.length, passed: cases.length - failed.length, failed: failed.length },
      null,
      2,
    ),
  );
  process.exit(failed.length === 0 ? 0 : 1);
}

void main();
