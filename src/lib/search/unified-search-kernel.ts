/**
 * ════════════════════════════════════════════════════════════════════════════
 * UNIFIED SEARCH KERNEL — NÚCLEO CANÓNICO DE BÚSQUEDA EAR OS S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Motivo de existencia (purga de buscadores duplicados):
 *   Antes existían 6 superficies de búsqueda con lógica propia y divergente:
 *     · OmniSearchModal             (índice global + RAG + intención)
 *     · UniversalCommandPalette     (RAG en vivo + comandos de sistema)
 *     · AirbnbFloatingPillSearchBar (categoría/provincia/fecha -> /proveedores)
 *     · DiscoverySearch             (provincias hardcodeadas + console.log)
 *     · OracleSearch                (alert() + any implícito)
 *     · IntentSearchBox             (placeholder estático sin handlers)
 *
 *   Este módulo es la ÚNICA fuente de verdad: normalización, ranking,
 *   detección de intención/gremio/categoría/provincia, contrato de URL
 *   vertical de proveedores, comandos de sistema y consulta RAG.
 *
 * Contrato: funciones puras y deterministas (sin React, sin estado, sin DOM).
 * La única función con I/O es `queryOracleRag`, que centraliza el fetch a
 * `/api/rag/query` con timeout y tipado estricto (cero `any`).
 */

import {
  GLOBAL_SEARCH_INDEX,
  SEARCH_CATEGORY_PILLS,
  type SearchIndexItem,
} from '@/data/global-search-index';
import {
  ALL_BODAS_NET_CATEGORY_IDS,
  ALL_SPANISH_PROVINCES,
  BODAS_NET_CATEGORIES,
  isAllSpainProvince,
  normalizeBodasNetCategory,
  resolveProvince,
  type BodasNetCategoryId,
} from '@/lib/constants/spain-regions-and-categories';
import {
  CANONICAL_GREMIO_SLUGS,
  getGremioLabel,
  type GremioId,
} from '@/lib/seo/searchIntentEngine';
import {
  matchSitemapIntent,
  type IntentMatchResult,
} from '@/lib/seo/sitemapIntentCrossEngine';
import {
  AJUSTE_PREVENTIVO_B2G_EUR,
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_EUR_PER_KM,
  LOGISTICA_KM_EXENTOS,
  SPLIT_SOBERANO,
  SUPLEMENTO_HOTEL_EUR,
  TARIFA_BASE_SOLISTA_EUR,
} from '@/lib/constants/ear-os-ssot';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. CONSTANTES DE OPERACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Mínimo de caracteres para interrogar al Oráculo RAG (evita ruido de red). */
export const ORACULO_MIN_CHARS = 3;

/** Debounce del RAG en vivo (ms). */
export const ORACULO_DEBOUNCE_MS = 250;

/** Timeout duro de la consulta RAG (ms). */
export const ORACULO_TIMEOUT_MS = 6000;

/** Máximo de resultados del catálogo por consulta. */
export const CATALOG_RESULT_LIMIT = 10;

/** Máximo de resultados RAG en vivo. */
export const ORACULO_RESULT_LIMIT = 4;

/** Máximo de comandos de sistema sugeridos. */
export const COMMAND_RESULT_LIMIT = 6;

export const SEARCH_STOPWORDS: ReadonlySet<string> = new Set([
  'de',
  'del',
  'la',
  'el',
  'los',
  'las',
  'en',
  'para',
  'por',
  'con',
  'un',
  'una',
  'unos',
  'unas',
  'y',
  'o',
  'que',
  'mi',
  'me',
  'al',
  'se',
]);


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. TIPOS CANÓNICOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export type SearchPillarId =
  | 'all'
  | 'servicios'
  | 'flota'
  | 'arsenal'
  | 'artistas'
  | 'b2g'
  | 'vimume';

export interface SearchPillar {
  id: SearchPillarId;
  label: string;
}

export interface ScoredSearchHit {
  item: SearchIndexItem;
  score: number;
}

export interface CatalogSearchOptions {
  pillar?: SearchPillarId;
  limit?: number;
}

export interface OracleRagHit {
  id: string;
  title: string;
  path: string;
  score: number;
  similarity: number;
  snippet: string;
  tags: string[];
}

export interface OracleRagResponse {
  hits: OracleRagHit[];
  /** Respuesta sintetizada de los snippets recuperados (nunca inventada). */
  answer: string | null;
  /** true cuando el motor RAG no responde (fallback a catálogo + concierge). */
  degraded: boolean;
  latencyMs: number | null;
}

export interface OracleRagOptions {
  limit?: number;
  signal?: AbortSignal;
  timeoutMs?: number;
}

export type SearchCommandGroup = 'CONVERSION' | 'NAVEGACION' | 'ADMINISTRACION';

export interface SearchCommand {
  id: string;
  group: SearchCommandGroup;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
  keywords: readonly string[];
}

export interface ScoredCommand {
  command: SearchCommand;
  score: number;
}

export interface ProviderSearchQuery {
  category?: string | null;
  province?: string | null;
  date?: string | null;
  q?: string | null;
  theme?: string | null;
  page?: number | null;
}

export interface UnifiedSearchContext {
  query: string;
  normalizedQuery: string;
  tokens: string[];
  intent: IntentMatchResult | null;
  gremio: GremioId | null;
  gremioLabel: string | null;
  category: BodasNetCategoryId | null;
  categoryLabel: string | null;
  provinceName: string | null;
  providerHref: string;
}

export interface SearchContextOptions {
  province?: string | null;
  date?: string | null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. NORMALIZACIÓN Y TOKENIZACIÓN
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Normaliza texto para comparación determinista: sin acentos, minúsculas,
 * sin puntuación y con espacios colapsados. Idéntico en cliente y servidor.
 */
export function normalizeSearchText(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Tokens útiles de una consulta libre (sin stopwords, mínimo 2 caracteres). */
export function tokenizeQuery(value: string | null | undefined): string[] {
  const normalized = normalizeSearchText(value);
  if (!normalized) return [];
  return normalized
    .split(' ')
    .filter((token) => token.length >= 2 && !SEARCH_STOPWORDS.has(token));
}

/** ¿La consulta pide explícitamente toda España? */
export function isSpainWideQuery(value: string | null | undefined): boolean {
  const normalized = normalizeSearchText(value);
  if (!normalized) return false;
  return (
    normalized.includes('toda espana') ||
    normalized.includes('todo el pais') ||
    normalized.includes('nacional')
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. PILARES DEL CATÁLOGO (fuente única: SEARCH_CATEGORY_PILLS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const SEARCH_PILLARS: readonly SearchPillar[] = SEARCH_CATEGORY_PILLS.map(
  (pill) => ({ id: pill.id as SearchPillarId, label: pill.label })
);

export function isSearchPillarId(value: string): value is SearchPillarId {
  return SEARCH_PILLARS.some((pillar) => pillar.id === value);
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. RANKING DEL CATÁLOGO GLOBAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Puntúa un ítem del índice contra los tokens de la consulta.
 * Semántica AND: si un token no aparece en ningún campo, el ítem se descarta.
 * Pesos: título (40/28/22) > keywords (16/10) > categoría (6) > subtítulo (4).
 */

/** Coincidencia tolerante a singular/plural ("mariachi" ↔ "mariachis"). */
function matchesToken(haystack: string, token: string): boolean {
  if (haystack.includes(token)) return true;
  if (token.length >= 4 && token.endsWith('s') && haystack.includes(token.slice(0, -1))) {
    return true;
  }
  if (token.length >= 3 && haystack.includes(`${token}s`)) return true;
  return false;
}

export function scoreSearchItem(
  item: SearchIndexItem,
  tokens: readonly string[]
): number {
  if (tokens.length === 0) return 0;

  const title = normalizeSearchText(item.title);
  const subtitle = normalizeSearchText(item.subtitle);
  const categoryLabel = normalizeSearchText(item.categoryLabel);
  const keywordSet = new Set(
    item.keywords.map((keyword) => normalizeSearchText(keyword)).filter(Boolean)
  );
  const keywordBlob = normalizeSearchText(item.keywords.join(' '));

  let score = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    if (title === token) tokenScore += 40;
    else if (title.startsWith(token)) tokenScore += 28;
    else if (matchesToken(title, token)) tokenScore += 22;

    if (keywordSet.has(token)) tokenScore += 16;
    else if (matchesToken(keywordBlob, token)) tokenScore += 10;

    if (matchesToken(categoryLabel, token)) tokenScore += 6;
    if (matchesToken(subtitle, token)) tokenScore += 4;

    if (tokenScore === 0) return 0;
    score += tokenScore;
  }

  if (item.badge) score += 1;
  return score;
}

/**
 * Busca en el catálogo global con ranking descendente y filtro por pilar.
 * Con consulta vacía devuelve la cabeza curada del pilar (nunca un listado ciego).
 */
export function searchCatalog(
  query: string | null | undefined,
  options: CatalogSearchOptions = {}
): ScoredSearchHit[] {
  const pillar = options.pillar ?? 'all';
  const limit = options.limit ?? CATALOG_RESULT_LIMIT;
  const tokens = tokenizeQuery(query);

  const pool =
    pillar === 'all'
      ? GLOBAL_SEARCH_INDEX
      : GLOBAL_SEARCH_INDEX.filter((item) => item.category === pillar);

  if (tokens.length === 0) {
    return pool.slice(0, limit).map((item) => ({ item, score: 0 }));
  }

  return pool
    .map((item) => ({ item, score: scoreSearchItem(item, tokens) }))
    .filter((hit) => hit.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.item.title.length - b.item.title.length ||
        a.item.id.localeCompare(b.item.id)
    )
    .slice(0, limit);
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. DETECCIÓN DE INTENCIÓN / GREMIO / CATEGORÍA / PROVINCIA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Cruza la consulta con el diccionario canónico de intenciones (sitemap AEO).
 * Devuelve null si no hay match real (nunca un banner genérico engañoso).
 */
export function detectSearchIntent(
  query: string | null | undefined,
  provincia?: string | null
): IntentMatchResult | null {
  const normalized = normalizeSearchText(query);
  if (normalized.length < 3) return null;
  const match = matchSitemapIntent(normalized, provincia ?? undefined);
  return match.isMatch ? match : null;
}

const GREMIO_EXTRA_NEEDLES: Record<GremioId, readonly string[]> = {
  mariachis: ['mariachi'],
  'sonido-iluminacion': ['sonido', 'iluminacion', 'luces', 'audio'],
  fincas: ['finca', 'hacienda', 'cortijo', 'espacio'],
  dj: ['pinchadiscos', 'cabina'],
  solistas: ['solista', 'cantante', 'tenor', 'voz'],
  'cuarteto-cuerdas': ['cuarteto', 'cuerdas', 'violin'],
  'catering-brasas': ['catering', 'brasas', 'parrillada', 'banquete'],
  'pantallas-led': ['pantalla', 'pantallas', 'led'],
  animacion: ['animacion', 'animador', 'infantil'],
  'coches-clasicos': ['coche', 'coches', 'clasico', 'limusina'],
};

interface GremioProbe {
  id: GremioId;
  needles: readonly string[];
}

const GREMIO_PROBES: readonly GremioProbe[] = CANONICAL_GREMIO_SLUGS.map((id) => {
  const needles = new Set<string>(id.split('-'));
  for (const extra of GREMIO_EXTRA_NEEDLES[id]) needles.add(normalizeSearchText(extra));
  needles.add(normalizeSearchText(getGremioLabel(id)));
  return { id, needles: Array.from(needles).filter(Boolean) };
});

/**
 * Detecta el gremio canónico (los 10 de la taxonomía SSOT) o null.
 * Coincidencia por token exacto o contención (mínimo 4 caracteres, cero ruido).
 */
export function detectGremio(query: string | null | undefined): GremioId | null {
  const normalized = normalizeSearchText(query);
  if (!normalized) return null;

  const tokens = normalized.split(' ');
  let best: { id: GremioId; score: number } | null = null;

  for (const probe of GREMIO_PROBES) {
    let score = 0;
    for (const needle of probe.needles) {
      if (tokens.includes(needle)) score += needle.length >= 6 ? 3 : 2;
      else if (
        needle.length >= 4 &&
        tokens.some((token) => token.length >= 4 && token.includes(needle))
      ) {
        score += 1;
      }
    }
    if (score > 0 && (best === null || score > best.score)) {
      best = { id: probe.id, score };
    }
  }

  return best ? best.id : null;
}

const CATEGORY_ID_SET: ReadonlySet<string> = new Set(ALL_BODAS_NET_CATEGORY_IDS);

function asCategoryId(value: string): BodasNetCategoryId | null {
  return CATEGORY_ID_SET.has(value) ? (value as BodasNetCategoryId) : null;
}

export function getCategoryLabel(id: BodasNetCategoryId): string {
  return (
    BODAS_NET_CATEGORIES.find((category) => category.id === id)?.shortLabel ?? id
  );
}


/**
 * Detecta la categoría canónica del marketplace (10 de Bodas.net) por afinidad
 * léxica. Devuelve null si ninguna categoría supera el umbral (cero falsos positivos).
 */
export function detectCategory(
  query: string | null | undefined
): BodasNetCategoryId | null {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) return null;

  let best: { id: BodasNetCategoryId; score: number } | null = null;

  for (const category of BODAS_NET_CATEGORIES) {
    const id = asCategoryId(category.id);
    if (!id) continue;

    const blob = normalizeSearchText(
      `${category.id} ${category.label} ${category.shortLabel} ${category.description}`
    );

    let score = 0;
    for (const token of tokens) {
      if (token.length < 4) continue;
      if (blob.includes(token)) score += 1;
    }

    if (score > 0 && (best === null || score > best.score)) {
      best = { id, score };
    }
  }

  return best ? best.id : null;
}

/**
 * Detecta la provincia canónica dentro de la consulta libre.
 * Prioriza nombres compuestos ("A Coruña", "Palma de Mallorca") y luego tokens.
 */
export function detectProvince(query: string | null | undefined): string | null {
  const normalized = normalizeSearchText(query);
  if (!normalized || isSpainWideQuery(query)) return null;

  for (const province of ALL_SPANISH_PROVINCES) {
    const provinceNorm = normalizeSearchText(province);
    if (provinceNorm.length >= 5 && normalized.includes(provinceNorm)) {
      const resolved = resolveProvince(province);
      return resolved ? resolved.name : province;
    }
  }

  for (const token of normalized.split(' ')) {
    if (token.length < 4) continue;
    const resolved = resolveProvince(token);
    if (resolved) return resolved.name;
  }

  return null;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. CONTRATO ÚNICO DE URL VERTICAL DE PROVEEDORES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Construye la URL canónica de `/proveedores`. TODA superficie de búsqueda
 * vertical (píldora Airbnb, Discovery, hero) debe pasar por aquí para que el
 * contrato `categoria/provincia/date/q/theme` sea idéntico en todo el OS.
 */
export function buildProviderHref(input: ProviderSearchQuery = {}): string {
  const params = new URLSearchParams();

  if (input.category) {
    const category = normalizeBodasNetCategory(input.category);
    if (category && category !== 'ALL') params.set('categoria', category);
  }

  if (input.province && !isAllSpainProvince(input.province)) {
    const resolved = resolveProvince(input.province);
    params.set('provincia', resolved ? resolved.name : input.province.trim());
  }

  if (input.date) params.set('date', input.date);

  const q = input.q ? input.q.trim() : '';
  if (q) params.set('q', q);

  if (input.page && input.page > 1) params.set('page', String(input.page));
  if (input.theme) params.set('theme', input.theme);

  const qs = params.toString();
  return qs ? `/proveedores?${qs}` : '/proveedores';
}

/**
 * Resuelve el contexto completo de una consulta libre: intención, gremio,
 * categoría, provincia y URL vertical lista para despachar.
 */
export function resolveSearchContext(
  query: string,
  options: SearchContextOptions = {}
): UnifiedSearchContext {
  const provinceName = options.province
    ? detectProvince(options.province)
    : detectProvince(query);
  const intent = detectSearchIntent(query, provinceName);
  const gremio = detectGremio(query);
  const category = detectCategory(query);

  return {
    query,
    normalizedQuery: normalizeSearchText(query),
    tokens: tokenizeQuery(query),
    intent,
    gremio,
    gremioLabel: gremio ? getGremioLabel(gremio) : null,
    category,
    categoryLabel: category ? getCategoryLabel(category) : null,
    provinceName,
    providerHref: buildProviderHref({
      category,
      province: provinceName,
      date: options.date ?? null,
      q: query.trim() || null,
    }),
  };
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. ORÁCULO RAG — ÚNICO PUNTO DE CONTACTO CON /api/rag/query
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((entry): entry is string => typeof entry === 'string')
    : [];
}

function parseOracleHit(raw: unknown, index: number): OracleRagHit | null {
  if (!isRecord(raw)) return null;
  const snippet = readString(raw.snippet) || readString(raw.text) || readString(raw.content);
  const title = readString(raw.title) || readString(raw.archivo) || 'Documento EAR OS';
  return {
    id: readString(raw.id) || readString(raw.path) || `rag-${index}`,
    title,
    path: readString(raw.path),
    score: readNumber(raw.adjustedScore, readNumber(raw.score)),
    similarity: readNumber(raw.similarity),
    snippet,
    tags: readStringArray(raw.tags),
  };
}

/**
 * Interroga al motor RAG canónico con timeout duro y saneado por tipo.
 * Nunca lanza: degrada a `{ hits: [], degraded: true }` para que la UI
 * caiga al catálogo local y al concierge sin romper la experiencia.
 */
export async function queryOracleRag(
  query: string,
  options: OracleRagOptions = {}
): Promise<OracleRagResponse> {
  const trimmed = query.trim();
  if (trimmed.length < ORACULO_MIN_CHARS) {
    return { hits: [], answer: null, degraded: false, latencyMs: null };
  }

  const limit = options.limit ?? ORACULO_RESULT_LIMIT;
  const timeoutMs = options.timeoutMs ?? ORACULO_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const externalSignal = options.signal;
  const abortFromExternal = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener('abort', abortFromExternal);
  }

  try {
    const response = await fetch('/api/rag/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: trimmed, limit }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return { hits: [], answer: null, degraded: true, latencyMs: null };
    }

    const payload: unknown = await response.json();
    const resultsRaw = isRecord(payload) && Array.isArray(payload.results) ? payload.results : [];
    const hits = resultsRaw
      .map((entry, index) => parseOracleHit(entry, index))
      .filter((hit): hit is OracleRagHit => hit !== null && hit.snippet.length > 0);

    const answer =
      hits
        .slice(0, 3)
        .map((hit) => hit.snippet)
        .join('\n\n')
        .trim() || null;

    return {
      hits,
      answer,
      degraded: false,
      latencyMs: isRecord(payload) ? readNumber(payload.latencyMs, 0) : null,
    };
  } catch {
    return { hits: [], answer: null, degraded: true, latencyMs: null };
  } finally {
    clearTimeout(timer);
    if (externalSignal) externalSignal.removeEventListener('abort', abortFromExternal);
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9. COMANDOS DE SISTEMA (antigua potencia del UniversalCommandPalette)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Protocolo: TODO href debe existir como ruta real en `src/app` y TODO importe
// debe nacer del SSOT de Zona Cero (`ear-os-ssot.ts`). Cero copy hardcodeado.

/**
 * Formatea importes del SSOT de forma 100% determinista (sin `toLocaleString`,
 * que depende del ICU del runtime y rompería la hidratación).
 */
function eur(value: number, decimals: number = 0): string {
  const [integer, fraction] = value.toFixed(decimals).split('.');
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return fraction ? `${grouped},${fraction} €` : `${grouped} €`;
}

const SPLIT_LABEL = `${Math.round(SPLIT_SOBERANO.artista * 100)}/${Math.round(
  SPLIT_SOBERANO.earOs * 100
)}/${Math.round(SPLIT_SOBERANO.vimume * 100)}`;


export const SEARCH_COMMANDS: readonly SearchCommand[] = [
  {
    id: 'cmd-reservar-solista',
    group: 'CONVERSION',
    title: `Bloquear fecha · Depósito ${eur(DEPOSITO_STRIPE_EUR)}`,
    subtitle: `Solista Edwin Agudelo ${eur(TARIFA_BASE_SOLISTA_EUR)} · Price-Lock ${eur(
      DEPOSITO_STRIPE_EUR
    )} deducible`,
    href: '/reservar/solista',
    badge: 'Price-Lock',
    keywords: ['reservar', 'reserva', 'deposito', 'bloquear', 'fecha', 'solista', 'edwin', 'agudelo', 'price', 'lock'],
  },
  {
    id: 'cmd-calculadora',
    group: 'CONVERSION',
    title: 'Calculadora de presupuesto',
    subtitle: `Logística ${eur(LOGISTICA_EUR_PER_KM, 2)}/km desde km ${LOGISTICA_KM_EXENTOS} · Hotel ${eur(
      SUPLEMENTO_HOTEL_EUR
    )} · Split ${SPLIT_LABEL}`,
    href: '/calculadora',
    badge: 'Cotizador',
    keywords: ['calculadora', 'presupuesto', 'precio', 'cotizar', 'cotizador', 'kilometros', 'km', 'logistica', 'tarifa'],
  },
  {
    id: 'cmd-bodas',
    group: 'CONVERSION',
    title: 'Bodas S-Class · Túnel nupcial',
    subtitle: 'Sonorización Bose/Shure, rider acústico y plan B redundante',
    href: '/bodas',
    badge: '5.0★',
    keywords: ['boda', 'bodas', 'novios', 'nupcial', 'ceremonia', 'banquete', 'coctel'],
  },
  {
    id: 'cmd-proveedores',
    group: 'NAVEGACION',
    title: 'Directorio nacional de proveedores',
    subtitle: '10 gremios × 52 provincias con teléfono real verificado',
    href: '/proveedores',
    badge: '13.094',
    keywords: ['proveedores', 'directorio', 'catalogo', 'gremios', 'profesionales', 'buscar'],
  },
  {
    id: 'cmd-fincas',
    group: 'NAVEGACION',
    title: 'Fincas y espacios para bodas',
    subtitle: 'Fincas, cortijos, palacios y hoteles homologados',
    href: '/fincas',
    keywords: ['finca', 'fincas', 'cortijo', 'palacio', 'hacienda', 'espacio', 'jardin'],
  },
  {
    id: 'cmd-mariachis',
    group: 'NAVEGACION',
    title: 'Mariachis de gala',
    subtitle: 'Quinteto de conservatorio con trompetas, violines y guitarrón',
    href: '/mariachis',
    keywords: ['mariachi', 'mariachis', 'serenata', 'ranchera', 'charro'],
  },
  {
    id: 'cmd-artistas',
    group: 'NAVEGACION',
    title: 'Artistas y shows en directo',
    subtitle: 'Solistas, cuartetos de cuerdas, DJ y orquestas',
    href: '/artistas',
    keywords: ['artistas', 'artista', 'solista', 'cuarteto', 'dj', 'orquesta', 'show', 'musica'],
  },
  {
    id: 'cmd-eventos',
    group: 'NAVEGACION',
    title: 'Eventos corporativos & audiovisual',
    subtitle: 'Line Array, pantallas LED P2.9 y estructuras homologadas',
    href: '/eventos',
    keywords: ['eventos', 'corporativo', 'empresa', 'congreso', 'convencion', 'audiovisual', 'pantalla'],
  },
  {
    id: 'cmd-b2g',
    group: 'NAVEGACION',
    title: 'Licitaciones B2G · Ayuntamientos',
    subtitle: `Contratos menores < ${eur(AJUSTE_PREVENTIVO_B2G_EUR)} (Art. 118 LCSP)`,
    href: '/b2g',
    badge: 'B2G',
    keywords: ['b2g', 'licitacion', 'licitaciones', 'ayuntamiento', 'contrato', 'lcsp', 'pliego'],
  },
  {
    id: 'cmd-vimume',
    group: 'NAVEGACION',
    title: 'VIMUME · Neuro-musicoterapia 40 Hz',
    subtitle: 'Protocolo Gamma, deducción Ley 49/2002 y SROI 4,85x',
    href: '/vimume',
    badge: 'RSC',
    keywords: ['vimume', 'residencia', 'mayores', 'alzheimer', 'musicoterapia', '40hz', 'rsc'],
  },
  {
    id: 'cmd-alianzas',
    group: 'NAVEGACION',
    title: 'Alianzas B2B · Split 80/10/10',
    subtitle: `Colaboración con fincas, planners y catering · Split ${SPLIT_LABEL}`,
    href: '/alianzas',
    keywords: ['alianza', 'alianzas', 'partners', 'b2b', 'colaboracion', 'split'],
  },
  {
    id: 'cmd-oraculo',
    group: 'NAVEGACION',
    title: 'Oráculo Diamante Rojo',
    subtitle: 'Consola de conocimiento: clusters, casos y señales',
    href: '/academia/oraculo',
    keywords: ['oraculo', 'academia', 'conocimiento', 'consultar', 'clusters'],
  },
  {
    id: 'cmd-call-center',
    group: 'ADMINISTRACION',
    title: 'Call Center · intake omnicanal',
    subtitle: 'Despacho de llamadas y WhatsApps sin leads huérfanos',
    href: '/admin/call-center',
    keywords: ['call', 'center', 'llamadas', 'whatsapp', 'intake', 'leads'],
  },
  {
    id: 'cmd-command-center',
    group: 'ADMINISTRACION',
    title: 'Command Center · torre de control',
    subtitle: 'KPIs ejecutivos, telemetría y control operativo',
    href: '/admin/command-center',
    keywords: ['command', 'center', 'control', 'kpi', 'telemetria', 'admin'],
  },
  {
    id: 'cmd-reclamar-perfil',
    group: 'ADMINISTRACION',
    title: 'Reclamar perfil de proveedor',
    subtitle: 'Verificación de identidad y teléfono real',
    href: '/reclamar-perfil',
    keywords: ['reclamar', 'perfil', 'proveedor', 'verificar', 'verificacion'],
  },
];

/**
 * Filtra comandos de sistema por consulta con semántica AND sobre
 * título + subtítulo + keywords. Consulta vacía devuelve los de conversión.
 */
export function searchCommands(
  query: string | null | undefined,
  limit: number = COMMAND_RESULT_LIMIT
): ScoredCommand[] {
  const tokens = tokenizeQuery(query);

  if (tokens.length === 0) {
    return SEARCH_COMMANDS.slice(0, limit).map((command) => ({ command, score: 0 }));
  }

  return SEARCH_COMMANDS.map((command) => {
    const blob = normalizeSearchText(
      `${command.title} ${command.subtitle} ${command.keywords.join(' ')}`
    );
    let score = 0;
    for (const token of tokens) {
      if (!blob.includes(token)) return { command, score: 0 };
      score += normalizeSearchText(command.title).includes(token) ? 3 : 1;
    }
    return { command, score };
  })
    .filter((scored) => scored.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.command.title.localeCompare(b.command.title)
    )
    .slice(0, limit);
}
