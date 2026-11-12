/**
 * ════════════════════════════════════════════════════════════════════════════
 * MARIACHI SEARCH INDEX — RESCATE DEL CLÚSTER MARIACHI EN LA BÚSQUEDA GLOBAL
 * ════════════════════════════════════════════════════════════════════════════
 *
 * Motivo de existencia (P0 UX · asimetría motor ↔ superficie):
 *   El clúster mariachi existía en disco (`/mariachis`, 10 sub-landings, 52
 *   corredores provinciales, 4 escalones de precio) pero NO estaba indexado en
 *   `GLOBAL_SEARCH_INDEX`. Buscar "mariachi" o "mariachis" en el buscador de la
 *   home devolvía 0 resultados del catálogo: la promesa comercial no respondía
 *   en una URL pública verificable (EP-3).
 *
 * Contrato de esta capa:
 *   · CERO precios hardcodeados: los 4 escalones salen de `MARIACHI_FORMATS`,
 *     que a su vez deriva `solista` de la Tarifa Base Solista del SSOT
 *     (INV-01/INV-10 intactos).
 *   · CERO URLs inventadas: cada item apunta a una ruta real en disco
 *     (`/mariachis`, `/mariachis/[landing]`, `/artistas/edwin-agudelo`).
 *   · ZONA CERO intacta: este módulo sólo LEE el SSOT, nunca lo escribe.
 *
 * Las entradas se derivan por código (no se teclean a mano) para que añadir una
 * formación o una landing en su catálogo canónico la indexe automáticamente.
 * ════════════════════════════════════════════════════════════════════════════
 */

import type { SearchIndexItem } from '@/data/global-search-index';
import { MARIACHI_FORMATS, type MariachiFormat } from '@/lib/mariachi/mariachi-formats';
import { MARIACHI_LANDINGS } from '@/lib/mariachi/mariachiLandingCatalog';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

/**
 * Equivalentes léxicos del gremio. Un cliente escribe "música mexicana",
 * "rancheras", "mariachi", "charro" o "serenata": todos apuntan al mismo
 * clúster. Sin esta expansión, el índice era ciego al vocabulario real.
 * Se escriben sin acentos porque `normalizeSearchText` los elimina.
 */
const MARIACHI_LEXICON: readonly string[] = Object.freeze([
    'mariachi',
    'mariachis',
    'musica mexicana',
    'mexicana',
    'ranchera',
    'rancheras',
    'charro',
    'charros',
    'serenata',
    'serenatas',
    'mananitas',
    'bolero ranchero',
    'guitarron',
    'vihuela',
    'huapango',
    'contratar mariachi',
]);

/** Sufijo comercial idéntico en todos los formatos (depósito deducible). */
const DEPOSIT_LABEL = `Depósito ${DEPOSITO_STRIPE_EUR} € deducible`;

/** Etiqueta de precio limpia: 350 -> "350 €" (sin decimales mecánicos). */
function eur(value: number): string {
    return `${value.toLocaleString('es-ES', { maximumFractionDigits: 0 })} €`;
}

/**
 * Ítem de cabecera del clúster: la URL que debe ganar ante "mariachi" a secas.
 * Se indexa primero para que el desempate por longitud de título la favorezca.
 */
const MARIACHI_HUB_ITEM: SearchIndexItem = {
    id: 'art-mariachis-hub',
    title: 'Mariachis en España · Mariachi de Gala y Serenatas',
    subtitle:
        'Contrata mariachis con precio cerrado: solista, cuarteto, gala o monumental. '
        + `Despacho por provincia, dirección artística de Edwin Agudelo y ${DEPOSIT_LABEL}.`,
    category: 'artistas',
    categoryLabel: 'Mariachis & Ranchera',
    url: '/mariachis',
    price: `Desde ${eur(MARIACHI_FORMATS[0].basePrice)}`,
    badge: 'Mariachi',
    keywords: [...MARIACHI_LEXICON, 'contratar mariachis', 'precio mariachi', 'mariachi madrid'],
};

/**
 * Los 4 escalones comerciales derivados de `MARIACHI_FORMATS`.
 * Zona Cero intacta: el precio se lee, jamás se duplica.
 */
function buildFormatItems(): SearchIndexItem[] {
    return MARIACHI_FORMATS.map((format: MariachiFormat): SearchIndexItem => ({
        id: `mariachi-formato-${format.id}`,
        title: `${format.name} · Mariachi ${format.members} ${
            format.members === 1 ? 'integrante' : 'integrantes'
        }`,
        subtitle: `${format.description} Ideal para ${format.recommendedFor.toLowerCase()}.`,
        category: 'artistas',
        categoryLabel: 'Mariachis & Ranchera',
        url: '/mariachis',
        price: eur(format.basePrice),
        badge: format.id === 'solista' ? 'Solista' : 'Mariachi',
        keywords: [
            ...MARIACHI_LEXICON,
            format.name,
            `mariachi ${format.members} integrantes`,
            `${format.repertoireCount} temas`,
        ],
    }));
}

/**
 * Las 10 sub-landings transaccionales (`/mariachis/serenata`, `/mariachis/boda`,
 * `/mariachis/quinceanera`…). El título es el H1 canónico; el slug entra como
 * keyword para que "cumpleaños" o "pedida de mano" resuelvan directo.
 */
function buildLandingItems(): SearchIndexItem[] {
    return MARIACHI_LANDINGS.map((landing): SearchIndexItem => ({
        id: `mariachi-landing-${landing.slug}`,
        title: `${landing.h1} · Mariachi con precio cerrado`,
        subtitle: landing.metaDescription,
        category: 'artistas',
        categoryLabel: 'Mariachis & Ranchera',
        url: `/mariachis/${landing.slug}`,
        price: 'Precio cerrado',
        keywords: [
            ...MARIACHI_LEXICON,
            landing.slug,
            landing.slug.replace(/-/g, ' '),
            landing.navLabel,
        ],
    }));
}

/**
 * Ficha del roster oficial: Edwin Agudelo es la voz de referencia del clúster y
 * la ruta que sostiene la Tarifa Base Solista del SSOT.
 */
const EDWIN_MARIACHI_ITEM: SearchIndexItem = {
    id: 'art-edwin-agudelo-mariachi',
    title: 'Edwin Agudelo · Tenor de Mariachi y Solista de Gala',
    subtitle:
        'Dirección artística del clúster mariachi: repertorio de rancheras, boleros y lírica '
        + `con sonorización calibrada. ${DEPOSIT_LABEL}.`,
    category: 'artistas',
    categoryLabel: 'Mariachis & Ranchera',
    url: '/artistas/edwin-agudelo',
    price: eur(MARIACHI_FORMATS[0].basePrice),
    badge: 'Roster Oficial',
    keywords: [
        ...MARIACHI_LEXICON,
        'edwin agudelo',
        'tenor',
        'solista de gala',
        'voz de mariachi',
    ],
};

/**
 * Índice completo del clúster mariachi, listo para concatenar a
 * `GLOBAL_SEARCH_INDEX`. Orden: hub -> formatos -> landings -> roster.
 */
export const MARIACHI_SEARCH_INDEX: readonly SearchIndexItem[] = Object.freeze([
    MARIACHI_HUB_ITEM,
    ...buildFormatItems(),
    ...buildLandingItems(),
    EDWIN_MARIACHI_ITEM,
]);

/**
 * IDs de los formatos indexados. Permite a un guardián verificar cobertura
 * 100% de `MARIACHI_FORMATS` sin duplicar la lógica de derivación.
 */
export function getIndexedMariachiFormatIds(): readonly string[] {
    return MARIACHI_FORMATS.map((format) => format.id);
}
