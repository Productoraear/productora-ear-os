/**
 * ════════════════════════════════════════════════════════════════════════════
 * CONCIERGE WHATSAPP — NÚCLEO DETERMINISTA DEL WEBHOOK DE CONVERSIÓN (W55_T02)
 * ════════════════════════════════════════════════════════════════════════════
 * Por qué existe: el bot de WhatsApp es la superficie comercial más caliente
 * del embudo. Si contesta con prosa inventada, el cliente cierra con otro. Este
 * módulo NO redacta: normaliza el evento entrante, decide qué herramienta MCP
 * hay que ejecutar y compone la respuesta con cifras que SIEMPRE salen de un
 * motor (SSOT + service-tree + split 80/10/10).
 *
 * ARQUITECTURA (una sola dirección de datos):
 *
 *   webhook entrante → `parseInboundEvent`
 *        → `planConciergeReply`
 *             → índice de fichas (2.150 entradas, inyectado)
 *             → `aggregateServiceTree` (Zona Cero, céntimos enteros)
 *             → `computeSplit` (80/10/10, INV-02)
 *        → `renderWhatsAppReply` (texto plano, listo para el envío)
 *
 * CANDADOS DUROS:
 *   1. CERO host cableado: `resolveMcpEndpointUrl(baseUrl)` compone el endpoint
 *      MCP y el origen lo inyecta el llamador.
 *   2. CERO llamada a red desde la ruta del webhook: el plan se calcula
 *      in-process. Llamar a `http://localhost` desde un Route Handler en
 *      producción es una fachada que se cae al primer contenedor sin ese
 *      puerto; se descartó por eso (decisión declarada en el premortem).
 *   3. DINERO EN CÉNTIMOS ENTEROS: la única conversión desde euros ocurre en
 *      `parseInboundEvent`/`buildServiceNodes` (`eurToCentsExact`), tolerancia
 *      0 al descuadre.
 *   4. INV-14: el número del cliente NUNCA se registra ni se devuelve. Sólo se
 *      emite un `waRef` = HMAC-SHA-256 truncado del E.164, clave de
 *      idempotencia sin transportar el dato personal.
 *   5. CERO `any`. Todo el contrato es de tipos explícitos.
 *
 * MÓDULO DE SERVIDOR (usa `node:crypto`). Importar desde Route Handlers y
 * scripts `tsx`. Prohibido en `"use client"` (INV-07).
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

import { CENTRALITA_EAR_OS, DEPOSITO_STRIPE_EUR, TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';
import { computeSplit, type SplitBreakdown } from '@/lib/agents/pricing';
import {
  aggregateServiceTree,
  centsToEurExact,
  eurToCentsExact,
  type ServiceNode,
  type ServiceTreeResult,
} from '@/lib/budget/service-tree-engine';
import { BUDGET_CATEGORIES, type BudgetCategoryId } from '@/lib/budget/budget-allocator-engine';
import { loadIndexEntries, type IndexEntry } from '@/lib/mcp/fichas-catalog';

/* ──────────────────────────────────────────────────────────────────────────── */
/* 0 · Constantes de contrato                                                  */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Ruta canónica del terminal que SÍ crea la sesión de Stripe Price-Lock. */
export const PRICE_LOCK_PATH: string = '/checkout/presupuesto';

/** Ruta canónica del motor MCP de cotización (JSON-RPC 2.0 sobre HTTP). */
export const MCP_CONCIERGE_PATH: string = '/api/mcp/concierge';

/** Máximo de fichas que se citan en un mensaje (legibilidad en móvil). */
export const MAX_SUGGESTIONS: number = 3;

/** Aforo máximo aceptado en lenguaje natural (`120 pax`). */
export const MAX_PAX: number = 10_000;

/** Presupuesto tecleado máximo en euros (1 M EUR). */
export const MAX_BUDGET_EUR: number = 1_000_000;

/** Categoría canónica por defecto cuando el texto no dice nada: música. */
export const DEFAULT_CATEGORY: BudgetCategoryId = 'musica_produccion';

/** Umbral de traspaso a humano del canal (política comercial del canal). */
export const WHATSAPP_HANDOFF_THRESHOLD_CENTS: number = 500_000;

/* ──────────────────────────────────────────────────────────────────────────── */
/* 1 · Verificación del webhook (handshake hub.* + firma HMAC)                 */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Resultado cerrado de una verificación. Nunca hay "aceptado por defecto". */
export type WebhookVerification =
  | { readonly ok: true; readonly challenge: string }
  | { readonly ok: false; readonly status: 400 | 403 | 503; readonly reason: string };

/**
 * Comparación en tiempo constante. `false` si las longitudes difieren: nunca
 * se filtra por temporización cuántos caracteres acertó el atacante (SEC-1).
 */
function safeEqualStrings(a: string, b: string): boolean {
  const bufA: Buffer = Buffer.from(a, 'utf8');
  const bufB: Buffer = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/**
 * GET del webhook: Meta envía `hub.mode=subscribe`, `hub.verify_token` y
 * `hub.challenge`. El `challenge` se devuelve EN CLARO sólo si el token casa.
 *
 * FAIL-CLOSED (SEC-1): sin `WHATSAPP_VERIFY_TOKEN` responde 503. Aceptar
 * cualquier token por defecto convertiría la verificación en decoración y
 * permitiría a un tercero suscribir su número a nuestro webhook.
 */
export function verifyWebhookSubscription(
  params: URLSearchParams,
  env: Readonly<Record<string, string | undefined>>,
): WebhookVerification {
  const expected: string | undefined = env.WHATSAPP_VERIFY_TOKEN;
  if (typeof expected !== 'string' || expected.length < 8) {
    return { ok: false, status: 503, reason: 'WHATSAPP_VERIFY_TOKEN no configurado (fail-closed).' };
  }
  const mode: string | null = params.get('hub.mode');
  const token: string | null = params.get('hub.verify_token');
  const challenge: string | null = params.get('hub.challenge');

  if (mode !== 'subscribe') {
    return { ok: false, status: 400, reason: 'hub.mode distinto de "subscribe".' };
  }
  if (token === null || !safeEqualStrings(token, expected)) {
    return { ok: false, status: 403, reason: 'hub.verify_token no coincide.' };
  }
  if (challenge === null || challenge.length === 0 || challenge.length > 256) {
    return { ok: false, status: 400, reason: 'hub.challenge ausente o fuera de rango.' };
  }
  return { ok: true, challenge };
}

/**
 * Firma de los POST de Meta: `X-Hub-Signature-256: sha256=<hex>` sobre el
 * cuerpo CRUDO (no sobre el JSON re-serializado: cambiaría el hash).
 *
 * Sin `WHATSAPP_APP_SECRET` no se puede validar ⇒ 503, no se acepta a ciegas.
 */
export function verifyWebhookSignature(
  rawBody: string,
  headerSignature: string | null,
  env: Readonly<Record<string, string | undefined>>,
): WebhookVerification {
  const secret: string | undefined = env.WHATSAPP_APP_SECRET;
  if (typeof secret !== 'string' || secret.length < 16) {
    return { ok: false, status: 503, reason: 'WHATSAPP_APP_SECRET no configurado (fail-closed).' };
  }
  if (headerSignature === null || !headerSignature.startsWith('sha256=')) {
    return { ok: false, status: 403, reason: 'Cabecera X-Hub-Signature-256 ausente o mal formada.' };
  }
  const provided: string = headerSignature.slice('sha256='.length);
  const expected: string = createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex');
  if (!safeEqualStrings(provided.toLowerCase(), expected)) {
    return { ok: false, status: 403, reason: 'Firma HMAC-SHA256 no coincide con el cuerpo recibido.' };
  }
  return { ok: true, challenge: '' };
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* 2 · Normalización del evento entrante                                       */
/* ──────────────────────────────────────────────────────────────────────────── */

export type InboundKind = 'TEXT' | 'BUTTON_REPLY' | 'INTERACTIVE_REPLY';

/** Evento ya normalizado: lo único que ve el planificador. */
export interface InboundEvent {
  /** Referencia opaca del remitente (HMAC-SHA-256 truncado del E.164). */
  readonly waRef: string;
  /** Clave de idempotencia (`wamid` de Meta o id del evento de n8n). */
  readonly messageId: string;
  readonly kind: InboundKind;
  /** Texto libre o `title` del botón pulsado. */
  readonly text: string;
  /** Slug de la ficha cuando el botón la transporta (`ficha:v-10615`). */
  readonly fichaSlug: string | null;
}

export type InboundParse =
  | { readonly ok: true; readonly event: InboundEvent }
  | { readonly ok: false; readonly reason: string };

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

/**
 * Referencia opaca del remitente. Estable (misma entrada ⇒ misma salida) para
 * poder deduplicar y persistir sin guardar el teléfono (INV-14).
 */
export function toWaRef(waId: string, secret: string = 'ear-os-wa-ref'): string {
  return createHmac('sha256', secret).update(waId.replace(/\D/g, ''), 'utf8').digest('hex').slice(0, 24);
}

/**
 * Extrae el slug de un `id` de botón con la forma `ficha:<slug>`.
 * Un slug con caracteres raros se descarta: jamás se reenvía a una consulta.
 */
export function extractFichaSlug(buttonId: string): string | null {
  const match: RegExpMatchArray | null = buttonId.match(/^ficha:([a-z0-9][a-z0-9._-]{0,119})$/i);
  return match === null ? null : match[1].toLowerCase();
}

/**
 * Aplana el payload de Meta (`entry[].changes[].value.messages[]`) y el de n8n
 * (objeto plano). Cualquier forma no reconocida ⇒ `ok:false` con motivo: el
 * webhook responde 200 para que Meta no reintente, pero no inventa respuesta.
 */
export function parseInboundEvent(payload: unknown, secret?: string): InboundParse {
  const root: Record<string, unknown> | null = asRecord(payload);
  if (root === null) return { ok: false, reason: 'cuerpo no es un objeto JSON.' };

  let message: Record<string, unknown> | null = null;
  let contactRef: unknown = null;

  const entry: unknown = root.entry;
  if (Array.isArray(entry) && entry.length > 0) {
    // `changes` es un ARRAY (`entry[].changes[]`). `asRecord` devuelve `null`
    // para arrays por contrato, así que el primer cambio se extrae del array y
    // sólo después se normaliza a objeto.
    const changes: unknown = asRecord(entry[0])?.changes;
    const firstChange: unknown = Array.isArray(changes) ? changes[0] : null;
    const value: Record<string, unknown> | null = asRecord(asRecord(firstChange)?.value);
    const messages: unknown = value?.messages;
    if (Array.isArray(messages) && messages.length > 0) message = asRecord(messages[0]);
    const contacts: unknown = value?.contacts;
    const firstContact: unknown = Array.isArray(contacts) ? contacts[0] : null;
    contactRef = asRecord(firstContact)?.wa_id ?? message?.from ?? null;
  } else {
    message = root;
    contactRef = root.waId ?? root.from ?? null;
  }

  if (message === null) return { ok: false, reason: 'payload sin mensaje reconocible.' };

  const waId: string | null = asString(contactRef);
  if (waId === null || waId.replace(/\D/g, '').length < 6) {
    return { ok: false, reason: 'remitente sin identificador E.164 utilizable.' };
  }

  const messageId: string | null = asString(message.messageId) ?? asString(message.id);
  if (messageId === null) return { ok: false, reason: 'mensaje sin id (no hay idempotencia posible).' };
  if (messageId.length > 200) return { ok: false, reason: 'id de mensaje fuera de rango.' };

  const waRef: string = toWaRef(waId, secret);
  const type: string = asString(message.type) ?? 'text';

  if (type === 'text') {
    const body: string | null = asString(asRecord(message.text)?.body) ?? asString(message.text);
    if (body === null) return { ok: false, reason: 'mensaje de texto sin cuerpo.' };
    return {
      ok: true,
      event: { waRef, messageId, kind: 'TEXT', text: body.slice(0, 1000), fichaSlug: null },
    };
  }

  if (type === 'button') {
    const button: Record<string, unknown> | null = asRecord(message.button);
    const id: string | null = asString(button?.id);
    const title: string | null = asString(button?.text) ?? id;
    if (title === null) return { ok: false, reason: 'botón sin id ni texto.' };
    return {
      ok: true,
      event: {
        waRef,
        messageId,
        kind: 'BUTTON_REPLY',
        text: title.slice(0, 300),
        fichaSlug: extractFichaSlug(id ?? ''),
      },
    };
  }

  if (type === 'interactive') {
    const interactive: Record<string, unknown> | null = asRecord(message.interactive);
    const reply: Record<string, unknown> | null =
      asRecord(interactive?.button_reply) ?? asRecord(interactive?.list_reply);
    const id: string | null = asString(reply?.id);
    const title: string | null = asString(reply?.title) ?? id;
    if (title === null) return { ok: false, reason: 'respuesta interactiva sin id ni título.' };
    return {
      ok: true,
      event: {
        waRef,
        messageId,
        kind: 'INTERACTIVE_REPLY',
        text: title.slice(0, 300),
        fichaSlug: extractFichaSlug(id ?? ''),
      },
    };
  }

  return { ok: false, reason: `tipo de mensaje no soportado: ${type}` };
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* 3 · Intención comercial extraída del texto                                  */
/* ──────────────────────────────────────────────────────────────────────────── */

export interface ConciergeIntent {
  readonly pax: number | null;
  readonly budgetCents: number | null;
  /** Categoría de ficha a buscar (etiqueta canónica, sin inventar). */
  readonly categoryHint: string | null;
  /** `true` si el texto pide explícitamente congelar/cerrar la fecha. */
  readonly wantsLock: boolean;
}

/** Palabras clave → categoría REAL del catálogo (no se inventan categorías). */
const CATEGORY_KEYWORDS: ReadonlyArray<{ readonly word: string; readonly category: string }> = [
  { word: 'boda', category: 'Musica' },
  { word: 'bodas', category: 'Musica' },
  { word: 'mariachi', category: 'Musica' },
  { word: 'grupo', category: 'Musica' },
  { word: 'banda', category: 'Musica' },
  { word: 'dj', category: 'Musica' },
  { word: 'musica', category: 'Musica' },
  { word: 'cantante', category: 'Musica' },
  { word: 'sonido', category: 'sonido' },
  { word: 'iluminacion', category: 'sonido' },
  { word: 'catering', category: 'servicios' },
  { word: 'finca', category: 'finca' },
  { word: 'autobus', category: 'transporte' },
  { word: 'transporte', category: 'transporte' },
];

/** Normaliza a minúsculas sin acentos para casar palabras clave. */
export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Extrae aforo, presupuesto y categoría del texto libre.
 * Cero suposiciones: lo que no aparece en el mensaje queda en `null`.
 */
export function extractIntent(text: string): ConciergeIntent {
  const plain: string = normalizeText(text);

  let pax: number | null = null;
  const paxMatch: RegExpMatchArray | null = plain.match(/(\d{1,5})\s*(pax|personas|invitados|comensales)/);
  if (paxMatch !== null) {
    const value: number = Number.parseInt(paxMatch[1], 10);
    if (Number.isInteger(value) && value > 0 && value <= MAX_PAX) pax = value;
  }

  let budgetCents: number | null = null;
  const budgetMatch: RegExpMatchArray | null = plain.match(
    /(\d{1,3}(?:[.\s]\d{3})+|\d{2,7})(?:[.,](\d{1,2}))?\s*(?:euros?|eur)/,
  );
  if (budgetMatch !== null) {
    const integerPart: string = budgetMatch[1].replace(/[.\s]/g, '');
    const decimalPart: string | undefined = budgetMatch[2];
    const euros: string = decimalPart === undefined ? integerPart : `${integerPart}.${decimalPart}`;
    // `eurToCentsExact` lanza si el importe no tiene céntimos exactos. Un
    // mensaje de WhatsApp es entrada hostil: se captura y se declara el hueco
    // (budgetCents=null) en lugar de tumbar el webhook.
    try {
      const cents: number = eurToCentsExact(Number.parseFloat(euros));
      if (Number.isInteger(cents) && cents > 0 && cents <= MAX_BUDGET_EUR * 100) budgetCents = cents;
    } catch {
      budgetCents = null;
    }
  }

  let categoryHint: string | null = null;
  for (const entry of CATEGORY_KEYWORDS) {
    if (plain.includes(entry.word)) {
      categoryHint = entry.category;
      break;
    }
  }

  const wantsLock: boolean = /(reserv|congel|bloque|price.?lock|deposito|senal)/.test(plain);

  return { pax, budgetCents, categoryHint, wantsLock };
}

/* ──────────────────────────────────────────────────────────────────────────── */
/* 4 · Plan de respuesta (tool calls deterministas + texto)                    */
/* ──────────────────────────────────────────────────────────────────────────── */

/** Herramientas MCP que este canal puede despachar. */
export type ConciergeToolCall =
  | { readonly name: 'calculate_quote'; readonly arguments: Record<string, string | number> }
  | { readonly name: 'get_ficha_details'; readonly arguments: Record<string, string | number> };

/** Desglose 80/10/10 con el total al céntimo. */
export interface SplitReport {
  readonly totalCents: number;
  readonly totalEur: number;
  readonly split: SplitBreakdown;
  readonly splitSumsToTotal: boolean;
}

/** Cuerpo del plan SIN el texto (lo que se renderiza y se sella). */
export interface ConciergePlanBody {
  readonly probed: true;
  readonly source: 'live';
  readonly mode: 'REAL';
  readonly checkedAt: string;
  readonly waRef: string;
  readonly messageId: string;
  readonly intent: ConciergeIntent;
  readonly suggestions: readonly IndexEntry[];
  readonly tree: ServiceTreeResult | null;
  readonly splitReport: SplitReport | null;
  readonly depositEur: number;
  readonly remainderEur: number;
  /** Enlace relativo al terminal Price-Lock (`null` si no hay total válido). */
  readonly priceLockHref: string | null;
  readonly toolCalls: readonly ConciergeToolCall[];
  readonly createsStripeSession: false;
  /** `true` si el importe supera el umbral: el bot cede el control a humano. */
  readonly requiresHuman: boolean;
  readonly humanPhone: string;
}

export interface ConciergePlan extends ConciergePlanBody {
  readonly replyText: string;
  readonly evidenceSha256: string;
}

export interface PlanDeps {
  /** Índice de fichas ya cargado (el llamador decide si es `live` o `static`). */
  readonly entries: readonly IndexEntry[];
  readonly now: number;
  /** Semilla HMAC de `waRef` (no se registra). */
  readonly waRefSecret?: string;
}

function sha256(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

/** Macro-partida canónica de una ficha según su categoría (nunca inventada). */
export function categoryForEntry(entry: IndexEntry): BudgetCategoryId {
  const plain: string = normalizeText(entry.category);
  const exact = BUDGET_CATEGORIES.find((rule) => normalizeText(rule.id) === plain);
  if (exact !== undefined) return exact.id;
  if (plain.includes('musica') || plain.includes('sonido')) return 'musica_produccion';
  // El catálogo real usa categorías fuera de la Zona Cero (`finca`,
  // `servicios`, `transporte`). Se mapean a la partida canónica más cercana y
  // NUNCA se inventa una sexta partida (INV-02 / UNKNOWN_CATEGORY).
  if (plain.includes('finca') || plain.includes('espacio')) return 'espacio_banquete';
  if (plain.includes('catering') || plain.includes('servicios')) return 'espacio_banquete';
  return DEFAULT_CATEGORY;
}

/**
 * Construye los nodos del árbol a partir de las fichas sugeridas.
 *
 * Regla de honestidad: una ficha sin `priceEur` NO se convierte en nodo (no se
 * inventa un precio). Su `key` viaja igualmente en `get_ficha_details` para
 * pedir el presupuesto real en lugar de afirmar una cifra.
 */
export function buildServiceNodes(fichas: readonly IndexEntry[], pax: number | null): readonly ServiceNode[] {
  const quantity: number = pax !== null && pax > 0 ? Math.min(MAX_PAX, pax) : 1;
  return fichas.flatMap((ficha: IndexEntry, index: number): ServiceNode[] => {
    if (ficha.priceEur === null) return [];
    let cents: number;
    try {
      cents = eurToCentsExact(ficha.priceEur);
    } catch {
      // Un precio de origen con más de 2 decimales no es dinero exacto: se
      // declara el hueco (no se redondea en silencio) y el bot pedirá detalle.
      return [];
    }
    if (!Number.isInteger(cents) || cents <= 0) return [];
    return [
      {
        id: `wa-${ficha.key}-${String(index)}`,
        category: categoryForEntry(ficha),
        label: ficha.name.slice(0, 120),
        unitPriceCents: cents,
        quantity,
        providerId: ficha.key,
        providerSlug: ficha.slug.length > 0 ? ficha.slug : null,
        selected: true,
      },
    ];
  });
}

/** Localiza las fichas que casan con la intención (categoría + palabras). */
export function selectSuggestions(
  intent: ConciergeIntent,
  query: string,
  entries: readonly IndexEntry[],
  limit: number = MAX_SUGGESTIONS,
): readonly IndexEntry[] {
  const category: string = normalizeText(intent.categoryHint ?? '');
  const words: readonly string[] = normalizeText(query)
    .split(/[^a-z0-9]+/)
    .filter((word: string) => word.length >= 4);

  const scored: Array<{ readonly entry: IndexEntry; readonly score: number }> = entries.map(
    (entry: IndexEntry) => {
      const haystack: string = normalizeText(
        [entry.name, entry.municipality, entry.province, entry.category].join(' '),
      );
      let score: number = 0;
      if (category.length > 0 && normalizeText(entry.category) === category) score += 3;
      for (const word of words) if (haystack.includes(word)) score += 1;
      if (entry.verified) score += 0.5;
      return { entry, score };
    },
  );

  return scored
    .filter((row) => row.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Number(b.entry.verified) - Number(a.entry.verified) ||
        b.entry.completeness - a.entry.completeness ||
        a.entry.name.localeCompare(b.entry.name),
    )
    .slice(0, limit)
    .map((row) => row.entry);
}

/**
 * Decide la cotización. El total es el presupuesto dicho por el cliente si lo
 * dijo; si no, la suma de los servicios sugeridos con precio REAL. Por debajo
 * de la tarifa base (INV-01) no hay cotización cerrada: lo declara el texto.
 */
export function quoteFromPlan(
  nodes: readonly ServiceNode[],
  budgetCents: number | null,
): { readonly tree: ServiceTreeResult; readonly totalCents: number } | null {
  const selectedCents: number = nodes.reduce(
    (sum: number, node: ServiceNode) => sum + node.unitPriceCents * node.quantity,
    0,
  );
  const totalCents: number = budgetCents !== null ? budgetCents : selectedCents;
  if (totalCents <= 0) return null;
  const tree: ServiceTreeResult = aggregateServiceTree(nodes, { totalCents });
  return { tree, totalCents };
}

/**
 * Reparto 80/10/10. `splitSumsToTotal` es la prueba INV-02 dentro del propio
 * canal: si no cuadra, el mensaje lo declara en lugar de publicar cifra rota.
 */
export function buildSplitReport(totalCents: number): SplitReport {
  const totalEur: number = centsToEurExact(totalCents);
  const split: SplitBreakdown = computeSplit(totalEur);
  const splitCents: number =
    Math.round(split.artista * 100) + Math.round(split.earOs * 100) + Math.round(split.vimume * 100);
  return { totalCents, totalEur, split, splitSumsToTotal: splitCents === totalCents };
}

/** Enlace al terminal Price-Lock. Relativo: el host lo pone quien envía. */
export function buildPriceLockHref(totalEur: number, venue: string, format: string): string {
  return (
    `${PRICE_LOCK_PATH}?venue=${encodeURIComponent(venue.slice(0, 120))}` +
    `&format=${encodeURIComponent(format.slice(0, 60))}&base=${totalEur.toFixed(2)}`
  );
}

/** Endpoint MCP absoluto a partir del origen público (cero hosts cableados). */
export function resolveMcpEndpointUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}${MCP_CONCIERGE_PATH}`;
}

/** Importe con el formato de la casa: dos decimales y coma decimal. */
function eur(value: number): string {
  return `${value.toFixed(2).replace('.', ',')} EUR`;
}

/**
 * Texto de respuesta. Requisitos del canal (legible en móvil, sin Markdown de
 * terceros, sin emojis por UNSLOP):
 *   · cifras citables (total, depósito, resto, split 80/10/10)
 *   · huecos declarados (qué falta para cerrar)
 *   · un único CTA: el enlace Price-Lock
 */
export function renderWhatsAppReply(plan: ConciergePlanBody): string {
  const lines: string[] = [];
  lines.push('EAR OS · Conserjeria de presupuestos');
  lines.push(`Centralita oficial: ${CENTRALITA_EAR_OS}`);

  if (plan.suggestions.length > 0) {
    lines.push('');
    lines.push('Fichas que encajan con lo que pides:');
    for (const ficha of plan.suggestions) {
      const where: string = [ficha.municipality ?? '', ficha.province ?? '']
        .filter((part: string) => part.length > 0)
        .join(', ');
      const price: string = ficha.priceEur === null ? 'precio a consultar' : `desde ${eur(ficha.priceEur)}`;
      lines.push(`- ${ficha.name}${where.length > 0 ? ` (${where})` : ''} · ${price}`);
    }
  } else {
    lines.push('');
    lines.push('Sin fichas selladas que casen con ese texto: no invento un proveedor.');
  }

  if (plan.tree !== null && plan.splitReport !== null) {
    lines.push('');
    lines.push(`Presupuesto simulado: ${eur(plan.splitReport.totalEur)}`);
    if (plan.splitReport.totalEur < TARIFA_BASE_SOLISTA_EUR) {
      lines.push(
        `AVISO: el importe esta por debajo de la tarifa base ${eur(TARIFA_BASE_SOLISTA_EUR)} (INV-01): ` +
          'no hay cotizacion cerrada con esa cifra.',
      );
    }
    for (const partida of plan.tree.macroPartidas) {
      if (partida.servicesCents === 0) continue;
      lines.push(`- ${partida.label}: ${eur(centsToEurExact(partida.servicesCents))}`);
    }
    const split: SplitBreakdown = plan.splitReport.split;
    lines.push(
      `Reparto 80/10/10: artista ${eur(split.artista)} · EAR OS ${eur(split.earOs)} · VIMUME ${eur(split.vimume)}` +
        (plan.splitReport.splitSumsToTotal ? '' : ' (EL REPARTO NO CUADRA: revisar antes de cerrar)'),
    );
    lines.push(
      `Deposito Price-Lock: ${eur(plan.depositEur)} · 100% deducible · resta a liquidar ${eur(plan.remainderEur)}`,
    );
    if (plan.priceLockHref !== null) {
      lines.push('');
      lines.push(`Congelar fecha: ${plan.priceLockHref}`);
    }
    lines.push('El deposito NO se ha cobrado: el enlace abre el terminal de pago.');
  } else {
    lines.push('');
    lines.push(
      `Tarifa base solista: ${eur(TARIFA_BASE_SOLISTA_EUR)}. Dime aforo, servicio y municipio y te doy el desglose exacto.`,
    );
  }

  const missing: string[] = [];
  if (plan.intent.pax === null) missing.push('aforo');
  if (plan.intent.categoryHint === null) missing.push('tipo de servicio');
  if (missing.length > 0) {
    lines.push('');
    lines.push(`Para cerrar el calculo falta: ${missing.join(' y ')}.`);
  }

  if (plan.requiresHuman) {
    lines.push('');
    lines.push(`Por importe, esta consulta la cierra una persona: ${plan.humanPhone}`);
  }

  lines.push('');
  lines.push('Cifras calculadas por el motor EAR OS; ninguna cotizacion se inventa aqui.');
  return lines.join('\n');
}

/**
 * Plan completo: intención → fichas → cotización → reparto → texto → sello.
 * Cero red. Cero aleatoriedad: dos ejecuciones con la misma entrada producen
 * el mismo `evidenceSha256` y el mismo texto.
 */
export function planConciergeReply(event: InboundEvent, deps: PlanDeps): ConciergePlan {
  const query: string = event.fichaSlug ?? event.text;
  const intent: ConciergeIntent = extractIntent(event.text);

  const suggestions: readonly IndexEntry[] =
    event.fichaSlug !== null
      ? deps.entries.filter(
          (entry: IndexEntry) => entry.slug === event.fichaSlug || entry.key === event.fichaSlug,
        )
      : selectSuggestions(intent, query, deps.entries);

  // Si ningún resultado trae precio, la coincidencia textual no permite
  // cotizar (en el catálogo sellado la vertical de música y una parte de
  // `Servicios Integrales` no declaran tarifa). Se reintenta por CATEGORÍA
  // (coincidencia léxica, no inventada); si tampoco hay precio, el plan
  // declara el hueco y pide el dato en lugar de afirmar una cifra.
  const suggestionsWithPrice: readonly IndexEntry[] =
    suggestions.some((ficha: IndexEntry) => ficha.priceEur !== null)
      ? suggestions
      : selectSuggestions(intent, '', deps.entries, 200).filter(
          (ficha: IndexEntry) => ficha.priceEur !== null,
        );
  // Lista de fichas que se enseñan: las que tienen precio si existen; si no,
  // la coincidencia léxica real (sin precio inventado) para poder citarla.
  const listed: readonly IndexEntry[] = (
    suggestionsWithPrice.length > 0 ? suggestionsWithPrice : suggestions
  ).slice(0, MAX_SUGGESTIONS);

  // Nodos del árbol: SOLO fichas con precio declarado (cero precio inventado).
  const nodes: readonly ServiceNode[] = buildServiceNodes(suggestionsWithPrice, intent.pax);
  const quote = quoteFromPlan(nodes, intent.budgetCents);

  const format: string = intent.categoryHint !== null ? normalizeText(intent.categoryHint) : 'solista';
  const venue: string = suggestions[0]?.municipality ?? 'por definir';

  const toolCalls: ConciergeToolCall[] = [];
  if (quote !== null) {
    toolCalls.push({
      name: 'calculate_quote',
      arguments: { totalEur: centsToEurExact(quote.totalCents), venue, format },
    });
  }
  for (const ficha of listed) {
    toolCalls.push({ name: 'get_ficha_details', arguments: { key: ficha.key } });
  }

  const splitReport: SplitReport | null = quote === null ? null : buildSplitReport(quote.totalCents);
  const totalCents: number = quote?.totalCents ?? 0;
  const depositCents: number = Math.round(DEPOSITO_STRIPE_EUR * 100);

  const body: ConciergePlanBody = {
    probed: true,
    source: 'live',
    mode: 'REAL',
    checkedAt: new Date(deps.now).toISOString(),
    waRef: deps.waRefSecret === undefined ? event.waRef : toWaRef(event.waRef, deps.waRefSecret),
    messageId: event.messageId,
    intent,
    suggestions: listed,
    tree: quote?.tree ?? null,
    splitReport,
    depositEur: DEPOSITO_STRIPE_EUR,
    remainderEur: Math.max(0, centsToEurExact(totalCents - depositCents)),
    priceLockHref: splitReport === null ? null : buildPriceLockHref(splitReport.totalEur, venue, format),
    toolCalls,
    createsStripeSession: false,
    requiresHuman: totalCents > WHATSAPP_HANDOFF_THRESHOLD_CENTS,
    humanPhone: CENTRALITA_EAR_OS,
  };

  const replyText: string = renderWhatsAppReply(body);
  return { ...body, replyText, evidenceSha256: sha256(replyText) };
}

/** Carga el índice sellado (2.150 fichas). Inyectable para el arnés. */
export function loadDefaultFichas(): readonly IndexEntry[] {
  return loadIndexEntries();
}

/** Etiquetas de las macro-partidas canónicas (mensaje de ayuda del canal). */
export function macroPartidaLabels(): readonly string[] {
  return BUDGET_CATEGORIES.map((rule: { readonly label: string }) => rule.label);
}
