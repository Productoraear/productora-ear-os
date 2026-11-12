/**
 * ════════════════════════════════════════════════════════════════════════════
 * TAXONOMY INDEX — ÍNDICE FACETADO DE GÉNEROS Y FORMATOS MUSICALES (EAR OS)
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Motivo de existencia:
 *   El buscador global sólo entendía categorías de marketplace (10 macro-gremios
 *   de Bodas.net) y gremios canónicos. Una consulta de cola larga real —«cumbia
 *   para boda», «cuarteto de cuerda para ceremonia», «mariachi norteño»— no
 *   resolvía a ninguna faceta y el usuario recibía "sin coincidencias".
 *
 * Contrato:
 *   · Funciones PURAS y deterministas (sin React, sin DOM, sin red, sin I/O).
 *   · CERO precios: la única cifra del módulo es el término de búsqueda
 *     `presupuesto`. El dinero vive exclusivamente en `ear-os-ssot.ts`.
 *   · CERO `any`. Tipado estricto e inmutabilidad (`Object.freeze`).
 *   · Toda URL emitida apunta a una ruta que EXISTE en disco (INV-09):
 *       - `/proveedores?categoria=<faceta>`  → directorio real con `categoria`.
 *       - `/presupuesto`                     → cotizador canónico.
 *       - `/mariachis`                       → hub de mariachis.
 *   · Seis familias canónicas: latina/tropical, clásica, pop/rock & versiones,
 *     flamenco & rumbas, jazz & soul y tradicional (mariachis).
 *
 * Este módulo es la ÚNICA fuente de verdad de géneros. Ningún componente debe
 * hardcodear listas de géneros ni sus palabras clave.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { normalizeSearchText, tokenizeQuery } from '@/lib/search/unified-search-kernel';

/** Ruta canónica del cotizador (existe en disco: `src/app/(public)/presupuesto`). */
export const TAXONOMY_QUOTE_HREF = '/presupuesto';

/** Ruta canónica del hub de mariachis (existe en disco: `src/app/(public)/mariachis`). */
export const TAXONOMY_MARIACHI_HREF = '/mariachis';

/** Franja / contexto de venta al que apunta una faceta. */
export type TaxonomySlot = 'ceremonia' | 'coctel' | 'banquete' | 'fiesta';

/** Identificadores de las seis familias canónicas de la taxonomía. */
export type TaxonomyFamilyId =
  | 'latina-tropical'
  | 'clasica'
  | 'pop-rock-versiones'
  | 'flamenco-rumbas'
  | 'jazz-soul'
  | 'tradicional';

/**
 * Faceta de género o formato.
 *
 * `facets` son los términos que el directorio entiende en `categoria=`.
 */
export interface TaxonomyFacet {
  /** Identificador estable (slug ASCII, sin acentos). */
  readonly id: string;
  readonly familyId: TaxonomyFamilyId;
  readonly label: string;
  /** Formatos concretos agrupados por esta faceta (orquestas, cuartetos…). */
  readonly formats: readonly string[];
  /** Términos que resuelven a esta faceta (cola larga, ya normalizados). */
  readonly terms: readonly string[];
  /** Facetas de catálogo del directorio; la primera es la canónica. */
  readonly facets: readonly string[];
  /** Contexto comercial dominante (orienta el copy, no el precio). */
  readonly slot: TaxonomySlot;
  /** Ruta de despacho exacta (existe en disco). */
  readonly href: string;
}

/** Familia de la taxonomía: agrupa facetas bajo una etiqueta comercial. */
export interface TaxonomyFamily {
  readonly id: TaxonomyFamilyId;
  readonly label: string;
  readonly description: string;
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. FAMILIAS CANÓNICAS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TAXONOMY_FAMILIES: readonly TaxonomyFamily[] = Object.freeze([
  {
    id: 'latina-tropical',
    label: 'Música Latina & Tropical',
    description: 'Cumbia, salsa, bachata, merengue y orquestas de baile.',
  },
  {
    id: 'clasica',
    label: 'Música Clásica',
    description: 'Cuartetos de cuerda, violín, soprano y ceremonias.',
  },
  {
    id: 'pop-rock-versiones',
    label: 'Pop/Rock & Versiones',
    description: 'Bandas de covers, tributos y acústicos.',
  },
  {
    id: 'flamenco-rumbas',
    label: 'Flamenco & Rumbas',
    description: 'Cuadro flamenco y rumbas comerciales.',
  },
  {
    id: 'jazz-soul',
    label: 'Jazz & Soul',
    description: 'Saxofonista de cóctel, swing y bossa nova.',
  },
  {
    id: 'tradicional',
    label: 'Tradicional',
    description: 'Mariachis y formatos de raíz.',
  },
]);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. FACETAS (GÉNEROS Y FORMATOS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const TAXONOMY_FACETS: readonly TaxonomyFacet[] = Object.freeze([
  // ── Latina & Tropical ────────────────────────────────────────────────────
  {
    id: 'cumbia',
    familyId: 'latina-tropical',
    label: 'Cumbia',
    formats: ['Cumbia sonidera', 'Cumbia norteña', 'Cumbia con acordeón'],
    terms: ['cumbia', 'cumbias', 'cumbiambera', 'cumbiambero', 'sonidera', 'sonidero'],
    facets: ['musica', 'animacion', 'servicios'],
    slot: 'fiesta',
    href: '/proveedores?categoria=musica&q=cumbia',
  },
  {
    id: 'salsa',
    familyId: 'latina-tropical',
    label: 'Salsa',
    formats: ['Salsa brava', 'Salsa romántica', 'Timba'],
    terms: ['salsa', 'salsas', 'timba', 'salsero', 'salsera', 'son-cubano'],
    facets: ['musica', 'animacion'],
    slot: 'fiesta',
    href: '/proveedores?categoria=musica&q=salsa',
  },
  {
    id: 'bachata',
    familyId: 'latina-tropical',
    label: 'Bachata',
    formats: ['Bachata dominicana', 'Bachata sensual', 'Bachata de autor'],
    terms: ['bachata', 'bachatas', 'bachatero', 'bachatera'],
    facets: ['musica'],
    slot: 'fiesta',
    href: '/proveedores?categoria=musica&q=bachata',
  },
  {
    id: 'merengue',
    familyId: 'latina-tropical',
    label: 'Merengue',
    formats: ['Merengue típico', 'Merengue de orquesta'],
    terms: ['merengue', 'merengues', 'perico-ripiao'],
    facets: ['musica', 'animacion'],
    slot: 'fiesta',
    href: '/proveedores?categoria=musica&q=merengue',
  },
  {
    id: 'orquestas-latinas',
    familyId: 'latina-tropical',
    label: 'Orquestas de baile',
    formats: ['Orquesta de salsa', 'Big band tropical', 'Orquesta de verbena'],
    terms: ['orquesta', 'orquestas', 'big-band', 'verbena', 'orquesta-latina'],
    facets: ['musica', 'animacion', 'servicios'],
    slot: 'banquete',
    href: '/proveedores?categoria=musica&q=orquesta',
  },

  // ── Clásica ─────────────────────────────────────────────────────────────
  {
    id: 'cuarteto-cuerdas',
    familyId: 'clasica',
    label: 'Cuarteto de cuerda',
    formats: ['Cuarteto de cuerda', 'Trío de cuerda', 'Dúo violín y violonchelo'],
    terms: ['cuarteto', 'cuartetos', 'cuerdas', 'violin', 'violines', 'violonchelo', 'chelo'],
    facets: ['musica'],
    slot: 'ceremonia',
    href: '/proveedores?categoria=musica&q=cuarteto%20de%20cuerda',
  },
  {
    id: 'soprano',
    familyId: 'clasica',
    label: 'Soprano & voz lírica',
    formats: ['Soprano', 'Tenor lírico', 'Dúo lírico'],
    terms: ['soprano', 'sopranos', 'tenor', 'tenores', 'lirica', 'lirico', 'opera', 'bel-canto'],
    facets: ['musica'],
    slot: 'ceremonia',
    href: '/proveedores?categoria=musica&q=soprano',
  },
  {
    id: 'ceremonia-clasica',
    familyId: 'clasica',
    label: 'Ceremonia clásica',
    formats: ['Música de ceremonia', 'Marcha nupcial', 'Ave María'],
    terms: ['ceremonia', 'ceremonias', 'marcha-nupcial', 'ave-maria', 'clasica', 'clasico', 'piano'],
    facets: ['musica'],
    slot: 'ceremonia',
    href: '/proveedores?categoria=musica&q=ceremonia',
  },

  // ── Pop/Rock & Versiones ────────────────────────────────────────────────
  {
    id: 'covers',
    familyId: 'pop-rock-versiones',
    label: 'Bandas de covers',
    formats: ['Cover band', 'Banda de versiones', 'Pop-rock en directo'],
    terms: ['covers', 'cover', 'versiones', 'pop', 'rock', 'banda', 'bandas', 'grupo', 'grupos'],
    facets: ['musica', 'animacion'],
    slot: 'fiesta',
    href: '/proveedores?categoria=musica&q=covers',
  },
  {
    id: 'tributos',
    familyId: 'pop-rock-versiones',
    label: 'Tributos',
    formats: ['Tributo rock', 'Tributo pop español', 'Tributo internacional'],
    terms: ['tributo', 'tributos', 'homenaje', 'imita'],
    facets: ['musica', 'animacion'],
    slot: 'fiesta',
    href: '/proveedores?categoria=musica&q=tributo',
  },
  {
    id: 'acusticos',
    familyId: 'pop-rock-versiones',
    label: 'Acústicos',
    formats: ['Dúo acústico', 'Solista acústico', 'Trío acústico'],
    terms: ['acustico', 'acustica', 'acusticos', 'guitarra', 'guitarrista', 'unplugged', 'solista'],
    facets: ['musica'],
    slot: 'coctel',
    href: '/proveedores?categoria=musica&q=acustico',
  },

  // ── Flamenco & Rumbas ───────────────────────────────────────────────────
  {
    id: 'cuadro-flamenco',
    familyId: 'flamenco-rumbas',
    label: 'Cuadro flamenco',
    formats: ['Cuadro flamenco', 'Bailaor y cantaor', 'Guitarra flamenca'],
    terms: ['flamenco', 'flamenca', 'cantaor', 'cantaora', 'bailaor', 'bailaora', 'sevillanas'],
    facets: ['musica', 'animacion'],
    slot: 'banquete',
    href: '/proveedores?categoria=musica&q=flamenco',
  },
  {
    id: 'rumbas',
    familyId: 'flamenco-rumbas',
    label: 'Rumbas comerciales',
    formats: ['Rumba catalana', 'Rumba flamenca', 'Coros rocieros'],
    terms: ['rumba', 'rumbas', 'rociero', 'rociera', 'catalana'],
    facets: ['musica', 'animacion'],
    slot: 'fiesta',
    href: '/proveedores?categoria=musica&q=rumba',
  },

  // ── Jazz & Soul ─────────────────────────────────────────────────────────
  {
    id: 'saxofonista',
    familyId: 'jazz-soul',
    label: 'Saxofonista de cóctel',
    formats: ['Saxo con bases', 'Saxo y piano', 'Saxo en acústico'],
    terms: ['saxo', 'saxos', 'saxofon', 'saxofonista', 'saxofonistas'],
    facets: ['musica'],
    slot: 'coctel',
    href: '/proveedores?categoria=musica&q=saxofonista',
  },
  {
    id: 'swing',
    familyId: 'jazz-soul',
    label: 'Swing & jazz',
    formats: ['Trío de jazz', 'Swing band', 'Jazz vocal'],
    terms: ['jazz', 'swing', 'dixie', 'lindy', 'blues'],
    facets: ['musica'],
    slot: 'coctel',
    href: '/proveedores?categoria=musica&q=jazz',
  },
  {
    id: 'bossa-nova',
    familyId: 'jazz-soul',
    label: 'Bossa nova & soul',
    formats: ['Bossa nova', 'Soul acústico', 'Motown'],
    terms: ['bossa', 'bossa-nova', 'soul', 'motown', 'lounge', 'chill'],
    facets: ['musica'],
    slot: 'coctel',
    href: '/proveedores?categoria=musica&q=bossa%20nova',
  },

  // ── Tradicional (Mariachis) ─────────────────────────────────────────────
  {
    id: 'mariachis',
    familyId: 'tradicional',
    label: 'Mariachis',
    formats: ['Mariachi completo', 'Mariachi de gala', 'Trío norteño'],
    terms: ['mariachi', 'mariachis', 'ranchera', 'rancheras', 'norteno', 'nortena'],
    facets: ['musica'],
    slot: 'ceremonia',
    href: TAXONOMY_MARIACHI_HREF,
  },
]);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. RESOLUCIÓN DE CONSULTAS DE COLA LARGA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** Resultado del emparejamiento taxonómico de una consulta libre. */
export interface TaxonomyMatch {
  /** Faceta ganadora, o `null` si la consulta no toca ningún género. */
  readonly facet: TaxonomyFacet | null;
  /** Familia de la faceta ganadora, o `null`. */
  readonly family: TaxonomyFamily | null;
  /** Ruta real a la que despachar (`/proveedores?categoria=…`, `/mariachis`). */
  readonly href: string;
  /** Etiqueta legible para UI y copy («Mariachis», «Cuarteto de cuerda»). */
  readonly label: string;
  /** Puntuación del emparejamiento (0 = sin coincidencia). */
  readonly score: number;
  /** Tokens normalizados de la consulta (trazabilidad). */
  readonly tokens: readonly string[];
}

/**
 * Pesos del emparejamiento taxonómico.
 *
 * El peso de una coincidencia EXACTA es CONSTANTE a propósito: si dependiera de
 * la longitud de la palabra, «bachata» (7 letras) ganaría siempre a «salsa» (5)
 * aunque el cliente nombrase salsa primero. Con peso constante, dos géneros
 * nombrados empatan y decide el orden natural de la frase.
 */
const EXACT_TERM_WEIGHT = 4;
const PARTIAL_TERM_WEIGHT = 1;

/**
 * Puntúa una faceta contra los tokens de la consulta.
 *
 * Reglas deterministas (sin heurísticas opacas):
 *   · Token EXACTO igual a un término            → +4 (una sola vez por token).
 *   · Token que CONTIENE un término (≥ 5 car.)   → +1 (plural/prefijo).
 *   · Token EXACTO igual a la etiqueta           → +3 sólo si no hubo término.
 *
 * Además devuelve la POSICIÓN del primer token que coincide: en un empate de
 * puntuación gana el género que el cliente nombró primero («salsa y bachata» →
 * salsa), que es la única regla de desempate que el usuario percibe como justa.
 */

function scoreFacet(facet: TaxonomyFacet, tokens: readonly string[]): { score: number; firstTokenIndex: number } {
  const labelNorm = normalizeSearchText(facet.label);
  let score = 0;
  let firstTokenIndex = Number.POSITIVE_INFINITY;

  tokens.forEach((token, tokenIndex) => {
    if (token.length < 3) return;
    let tokenMatched = false;
    let exactHits = 0;

    for (const term of facet.terms) {
      if (token === term) {
        // Un token sólo puede ser exacto UNA vez por faceta (su forma canónica).
        // Peso CONSTANTE: la longitud de la palabra no puede hacer que «bachata»
        // (7 letras) gane a «salsa» (5) cuando el cliente nombró salsa primero.
        if (exactHits === 0) {
          score += EXACT_TERM_WEIGHT;
          exactHits += 1;
        }
        tokenMatched = true;
        continue;
      }
      // Coincidencia parcial: sólo cuando el TÉRMINO está contenido en el token
      // escrito («mariachis» → mariachi) y nunca de forma redundante cuando ya
      // hubo coincidencia exacta («cumbias» → cumbia).
      if (exactHits === 0 && term.length >= 5 && token.includes(term)) {
        score += PARTIAL_TERM_WEIGHT;
        tokenMatched = true;
      }
    }

    if (token === labelNorm) {
      // La etiqueta suele estar también en `terms` («bachata»): se premia UNA vez,
      // nunca dos (término + etiqueta), para que dos géneros nombrados no se
      // desempate por la longitud de su palabra sino por el orden del cliente.
      if (!tokenMatched) score += 3;
      tokenMatched = true;
    }

    if (tokenMatched && tokenIndex < firstTokenIndex) firstTokenIndex = tokenIndex;
  });

  return { score, firstTokenIndex };
}


/**
 * Resuelve una consulta libre (cola larga) contra la taxonomía de géneros.
 *
 * Nunca lanza: ante consulta vacía, basura o sin coincidencia devuelve un match
 * con `facet:null` y `href = /presupuesto`, de modo que el llamante siempre
 * tiene un destino de conversión válido (cero clics muertos, INV-09).
 *
 * Desempate: mayor puntuación; a igual puntuación, el género nombrado antes.
 *
 * @param query Texto libre del usuario («cumbia para boda en Toledo»).
 */
export function resolveTaxonomyMatch(query: string | null | undefined): TaxonomyMatch {
  const tokens = tokenizeQuery(query);
  if (tokens.length === 0) {
    return { facet: null, family: null, href: TAXONOMY_QUOTE_HREF, label: '', score: 0, tokens };
  }

  let bestFacet: TaxonomyFacet | null = null;
  let bestScore = 0;
  let bestTokenIndex = Number.POSITIVE_INFINITY;

  for (const facet of TAXONOMY_FACETS) {
    const { score, firstTokenIndex } = scoreFacet(facet, tokens);
    if (score === 0) continue;
    const winsOnScore = score > bestScore;
    const winsOnOrder = score === bestScore && firstTokenIndex < bestTokenIndex;
    if (winsOnScore || winsOnOrder) {
      bestScore = score;
      bestTokenIndex = firstTokenIndex;
      bestFacet = facet;
    }
  }

  if (bestFacet === null) {
    return { facet: null, family: null, href: TAXONOMY_QUOTE_HREF, label: '', score: 0, tokens };
  }

  const family = TAXONOMY_FAMILIES.find((entry) => entry.id === bestFacet.familyId) ?? null;

  return {
    facet: bestFacet,
    family,
    href: bestFacet.href,
    label: bestFacet.label,
    score: bestScore,
    tokens,
  };
}


/** Facetas de una familia (para pintar el índice facetado en UI). */
export function getFacetsByFamily(familyId: TaxonomyFamilyId): readonly TaxonomyFacet[] {
  return TAXONOMY_FACETS.filter((facet) => facet.familyId === familyId);
}

/**
 * Sugerencias de cola larga para el autocompletado: facetas cuyo nombre o
 * términos empiezan por la consulta normalizada (máx. `limit`).
 */
export function suggestTaxonomyFacets(query: string, limit = 4): readonly TaxonomyFacet[] {
  const normalized = normalizeSearchText(query);
  if (normalized.length < 2) return [];

  const scored = TAXONOMY_FACETS.map((facet) => {
    const labelHit = normalizeSearchText(facet.label).startsWith(normalized);
    const termHit = facet.terms.some((term) => term.startsWith(normalized));
    return { facet, score: labelHit ? 2 : termHit ? 1 : 0 };
  })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.facet.label.localeCompare(b.facet.label));

  return scored.slice(0, Math.max(0, limit)).map((entry) => entry.facet);
}

