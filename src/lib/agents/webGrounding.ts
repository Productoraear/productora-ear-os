/**
 * 🌐 WEB GROUNDING — GROUNDING WEB EN VIVO PARA EL CONCIERGE (S-CLASS)
 * ---------------------------------------------------------------------------
 * Conecta el Search & Fetch API de DeepSeek con la conversación de venta para
 * erradicar la última fuente de alucinación: datos externos que NO están en
 * nuestro catálogo curado (ordenanzas acústicas municipales, aforo de recintos
 * externos, convocatorias B2G).
 *
 * CANDADOS DE SEGURIDAD (todos obligatorios):
 *  1. ANTIFUGAS DE PII: la query NO se construye con el mensaje del cliente.
 *     Se compone solo con la entidad + el tema (plantillas cerradas), de modo
 *     que ningún teléfono, email o nombre viaja a un tercero.
 *  2. SSRF: `isPublicHttpUrl` bloquea loopback, rangos privados, link-local
 *     (169.254.x = metadatos cloud), esquemas no HTTP y URLs con credenciales.
 *  3. COSTE: caché TTL de 24 h + limitador de ventana (60 búsquedas/hora por
 *     proceso). Una consulta repetida no se paga dos veces.
 *  4. FAIL-OPEN: si falla la red, no hay saldo o no hay resultados, el chat
 *     continúa sin bloque web. Nunca tumba una conversación de venta.
 *  5. PROVENANCE: cada línea del bloque lleva su URL de origen para que el
 *     modelo pueda citarla y el CEO pueda auditarla.
 *
 * Server-only: `deepseek-inference` usa `process.env.DEEPSEEK_API_KEY`.
 * ---------------------------------------------------------------------------
 */

import { searchWebDeepSeek, fetchWebDeepSeek, isDeepSeekToolsConfigured } from '@/lib/compiler/deepseek-inference';
import type { DeepSeekSearchResult } from '@/lib/compiler/deepseek-inference';
import { SlidingWindowRateLimiter } from '@/lib/agents/chatGuard';
import { KNOWN_FINCAS } from '@/lib/agents/geo';
import type { ConsultationSlots } from '@/lib/agents/consultationTypes';

/* ================================================================== */
/* Guardia SSRF                                                        */
/* ================================================================== */

const BLOCKED_HOSTNAMES: readonly string[] = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '[::1]',
  'metadata.google.internal',
  'metadata',
  'instance-data',
];

const PRIVATE_IPV4_RE: readonly RegExp[] = [
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 10.0.0.0/8
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // loopback
  /^169\.254\.\d{1,3}\.\d{1,3}$/, // link-local (metadatos cloud)
  /^192\.168\.\d{1,3}\.\d{1,3}$/, // 192.168.0.0/16
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/, // 172.16.0.0/12
  /^0\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, // 0.0.0.0/8
];

const BLOCKED_HOST_SUFFIXES: readonly string[] = ['.local', '.internal', '.localhost', '.lan', '.home.arpa'];

/**
 * ¿Es una URL pública, HTTP(S), sin credenciales y apta para Fetch?
 * Devuelve `false` ante cualquier duda (fail-closed).
 */
export function isPublicHttpUrl(raw: unknown): raw is string {
  if (typeof raw !== 'string') return false;
  const value = raw.trim();
  if (value.length === 0 || value.length > 8192) return false;

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return false;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;
  if (parsed.username.length > 0 || parsed.password.length > 0) return false;

  const host = parsed.hostname.toLowerCase();
  if (host.length === 0) return false;
  if (BLOCKED_HOSTNAMES.includes(host)) return false;
  if (BLOCKED_HOST_SUFFIXES.some((suffix: string) => host.endsWith(suffix))) return false;
  if (PRIVATE_IPV4_RE.some((re: RegExp) => re.test(host))) return false;

  // IPv6 privado / link-local / unique-local.
  const bareHost = host.startsWith('[') && host.endsWith(']') ? host.slice(1, -1) : host;
  if (bareHost === '::1' || /^f[cd][0-9a-f]{2}:/i.test(bareHost) || /^fe80:/i.test(bareHost)) return false;

  return true;
}

/* ================================================================== */
/* Clasificación de la necesidad y construcción de la query (sin PII)  */
/* ================================================================== */

export type GroundingNeedKind = 'normativa_municipal' | 'recinto_externo' | 'licitacion_b2g';

export interface GroundingNeed {
  readonly kind: GroundingNeedKind;
  /** Query ya saneada y acotada a 128 caracteres (contrato del Search API). */
  readonly query: string;
  /** Etiqueta legible para telemetría y para el prompt. */
  readonly label: string;
}

export interface GroundingContextInput {
  readonly slots: ConsultationSlots;
  readonly message: string;
  /** Nombre de la entidad activa en pantalla (si la hay). */
  readonly activeEntityName?: string;
}

const MAX_QUERY_FRAGMENT_CHARS = 60;
const MAX_QUERY_CHARS = 128;
const CONTROL_CHARS_RE: RegExp = /[\u0000-\u001F\u007F]/g;
const EMAIL_RE: RegExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi;
const PHONE_RE: RegExp = /\+?\d[\d\s().-]{7,}\d/g;
const UNSAFE_QUERY_CHARS_RE: RegExp = /["`<>\\]/g;
const SPACES_RE: RegExp = /\s+/g;

const NORMATIVA_RE: RegExp =
  /ruido|decibel|dba|limitador|ordenanza|ac[uú]stic|son[oó]metr|horario de cierre|licencia de apertura/i;
const LICITACION_RE: RegExp = /licitaci|contrato menor|lcsp|b2g|concurso p[uú]blico/i;
const RECINTO_RE: RegExp = /finca|recinto|hacienda|cortijo|quinta|mas[ií]a|villa|hotel|iglesia|ermita/i;

/** Recorta y limpia un fragmento: fuera emails, teléfonos, comillas y control. */
export function sanitizeQueryFragment(raw: string): string {
  if (typeof raw !== 'string') return '';
  const cleaned: string = raw
    .replace(CONTROL_CHARS_RE, ' ')
    .replace(EMAIL_RE, ' ')
    .replace(PHONE_RE, ' ')
    .replace(UNSAFE_QUERY_CHARS_RE, ' ')
    .replace(SPACES_RE, ' ')
    .trim();
  return cleaned.slice(0, MAX_QUERY_FRAGMENT_CHARS);
}

function clampQuery(query: string): string {
  return query.replace(SPACES_RE, ' ').trim().slice(0, MAX_QUERY_CHARS);
}

function isHomologatedVenue(name: string): boolean {
  const lower: string = name.toLowerCase();
  return KNOWN_FINCAS.some((finca: string) => lower.includes(finca.toLowerCase()));
}

/**
 * Decide si la consulta necesita web viva y, en tal caso, construye la query.
 * Solo tres supuestos de alto valor; ante la duda devuelve `null` (no se gasta).
 */
export function buildGroundingNeed(input: GroundingContextInput): GroundingNeed | null {
  const message: string = input.message;
  const slots: ConsultationSlots = input.slots;
  const city: string = sanitizeQueryFragment(slots.city ?? '');

  // 1) Licitaciones menores B2G: el dato caduca cada año, no debe memorizarse.
  if (LICITACION_RE.test(message)) {
    const year: number = new Date().getFullYear();
    const query: string = clampQuery(
      city.length > 0
        ? `contrato menor ${city} fiestas patronales licitacion ${year} plataforma contratacion`
        : `contrato menor fiestas patronales licitacion ${year} plataforma contratacion del sector publico`,
    );
    return { kind: 'licitacion_b2g', query, label: 'Licitaciones menores (Art. 118 LCSP)' };
  }

  // 2) Normativa acústica municipal: varía por ayuntamiento y es riesgo legal real.
  if (NORMATIVA_RE.test(message) && city.length > 0) {
    const query: string = clampQuery(`ordenanza municipal ruido ${city} limite dB nocturno musica`);
    return { kind: 'normativa_municipal', query, label: `Ordenanza de ruido de ${city}` };
  }

  // 3) Recinto externo (no homologado): aforo y condiciones reales.
  const entityName: string = sanitizeQueryFragment(input.activeEntityName ?? '');
  const mentionsRecinto: boolean = RECINTO_RE.test(message) || entityName.length > 0;
  if (mentionsRecinto && entityName.length > 0 && !isHomologatedVenue(entityName)) {
    const query: string = clampQuery(
      city.length > 0
        ? `"${entityName}" ${city} aforo capacidad boda recinto`
        : `"${entityName}" aforo capacidad boda recinto`,
    );
    return { kind: 'recinto_externo', query, label: `Recinto externo: ${entityName}` };
  }

  return null;
}

/* ================================================================== */
/* Caché TTL + presupuesto de gasto + orquestador                      */
/* ================================================================== */

export interface WebGroundingResult {
  /** Bloque listo para inyectar en el system prompt ('' si no hay nada). */
  readonly block: string;
  /** URLs de origen para trazabilidad y para mostrar al cliente. */
  readonly sources: readonly string[];
  readonly usedSearch: boolean;
  readonly needKind: GroundingNeedKind | null;
  readonly reason: string | null;
}

interface GroundingCacheEntry {
  readonly at: number;
  readonly block: string;
  readonly sources: readonly string[];
}

/** Una misma query no se vuelve a pagar en 24 h. */
export const WEB_GROUNDING_TTL_MS: number = 24 * 60 * 60 * 1000;

const MAX_CACHE_ENTRIES = 200;
const MAX_RESULTS_IN_BLOCK = 4;
const MAX_SUMMARY_CHARS = 220;
const MAX_BLOCK_CHARS = 1400;
const GROUNDING_SEARCH_TIMEOUT_MS = 4500;

/** Tope económico: 60 búsquedas por hora y proceso (≈ 0,05 $/h en el peor caso). */
const searchBudget = new SlidingWindowRateLimiter(60, 60 * 60 * 1000);
const groundingCache = new Map<string, GroundingCacheEntry>();

/** Vacía la caché (usado por la suite de verificación). */
export function clearWebGroundingCache(): void {
  groundingCache.clear();
}

function pruneCache(now: number): void {
  for (const [key, entry] of groundingCache) {
    if (now - entry.at > WEB_GROUNDING_TTL_MS) groundingCache.delete(key);
  }
  while (groundingCache.size > MAX_CACHE_ENTRIES) {
    const oldest: string | undefined = groundingCache.keys().next().value;
    if (typeof oldest !== 'string') break;
    groundingCache.delete(oldest);
  }
}

function truncate(text: string, max: number): string {
  const clean: string = text.replace(SPACES_RE, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

/**
 * Compone el bloque de grounding con PROVENANCE obligatoria por línea.
 * Solo se aceptan URLs públicas (la provenance se cita al cliente).
 */
export function buildGroundingBlock(
  need: GroundingNeed,
  results: readonly DeepSeekSearchResult[],
  fetched?: { readonly url: string; readonly title: string; readonly content: string },
): { block: string; sources: readonly string[] } {
  const usable: DeepSeekSearchResult[] = results
    .filter((item: DeepSeekSearchResult) => isPublicHttpUrl(item.url))
    .slice(0, MAX_RESULTS_IN_BLOCK);

  if (usable.length === 0 && !fetched) {
    return { block: '', sources: [] };
  }

  const lines: string[] = [
    `## CONTEXTO WEB VERIFICADO — ${need.label} (búsqueda en vivo, ${new Date().toISOString().slice(0, 10)})`,
    'Solo puedes presentar como dato verificado lo que aparezca en este bloque, citando la fuente. No inventes URLs ni cifras que no figuren aquí.',
  ];

  for (const item of usable) {
    const title: string = item.title.length > 0 ? item.title : item.url;
    const summary: string = truncate(item.summary.length > 0 ? item.summary : item.content, MAX_SUMMARY_CHARS);
    lines.push(`- ${title}: ${summary} [fuente: ${item.url}]`);
  }

  if (fetched && fetched.content.trim().length > 0) {
    const excerpt: string = truncate(fetched.content.replace(/[#*_>`]/g, ' '), MAX_SUMMARY_CHARS * 2);
    lines.push(`- Extracto de ${fetched.title.length > 0 ? fetched.title : fetched.url}: ${excerpt} [fuente: ${fetched.url}]`);
  }

  const sources: string[] = usable.map((item: DeepSeekSearchResult) => item.url);
  if (fetched) sources.push(fetched.url);

  // Se recorta por caracteres SIN colapsar saltos de línea (el bloque es Markdown).
  const block: string = lines.join('\n');
  return {
    block: block.length > MAX_BLOCK_CHARS ? `${block.slice(0, MAX_BLOCK_CHARS)}…` : block,
    sources,
  };
}

/* ── Orquestador ───────────────────────────────────────────────────────── */

export interface WebGroundingRequest {
  readonly need: GroundingNeed;
  /** Enriquecer con Fetch el primer resultado (aforos de recintos externos). */
  readonly enrichWithFetch?: boolean;
}

/**
 * Ejecuta el grounding web con caché, presupuesto y fail-open.
 * NUNCA lanza: cualquier fallo devuelve `{ block: '', usedSearch: false }`.
 */
export async function groundWithWebSearch(request: WebGroundingRequest): Promise<WebGroundingResult> {
  const need: GroundingNeed = request.need;
  const empty = (reason: string): WebGroundingResult => ({
    block: '',
    sources: [],
    usedSearch: false,
    needKind: need.kind,
    reason,
  });

  if (!isDeepSeekToolsConfigured()) return empty('unconfigured');

  const now: number = Date.now();
  const cached: GroundingCacheEntry | undefined = groundingCache.get(need.query);
  if (cached && now - cached.at <= WEB_GROUNDING_TTL_MS) {
    return {
      block: cached.block,
      sources: cached.sources,
      usedSearch: false,
      needKind: need.kind,
      reason: 'cache_hit',
    };
  }

  if (!searchBudget.allow(`web:${need.kind}`)) return empty('budget_exhausted');

  const search = await searchWebDeepSeek(need.query, {
    count: 5,
    needContent: false,
    timeoutMs: GROUNDING_SEARCH_TIMEOUT_MS,
  });

  if (!search.available) return empty(search.reason ?? 'no_content');

  // Fetch opcional SOLO del primer resultado público y solo si aporta (aforos).
  const enrich: boolean =
    request.enrichWithFetch === true ||
    (need.kind === 'recinto_externo' && request.enrichWithFetch !== false);

  let fetched: { url: string; title: string; content: string } | undefined;
  if (enrich) {
    const candidate: DeepSeekSearchResult | undefined = search.results.find((item: DeepSeekSearchResult) =>
      isPublicHttpUrl(item.url),
    );
    if (candidate) {
      const page = await fetchWebDeepSeek(candidate.url);
      if (page.available) fetched = { url: candidate.url, title: page.title, content: page.content };
    }
  }

  const composed = buildGroundingBlock(need, search.results, fetched);
  if (composed.block.length === 0) return empty('no_public_sources');

  pruneCache(now);
  groundingCache.set(need.query, { at: now, block: composed.block, sources: composed.sources });

  return {
    block: composed.block,
    sources: composed.sources,
    usedSearch: true,
    needKind: need.kind,
    reason: null,
  };
}
