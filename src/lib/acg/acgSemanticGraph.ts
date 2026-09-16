/**
 * EAR OS — AUTONOMOUS COMMERCE GRID (ACG) · SEMANTIC GRAPH & INTERLINKING
 * ==================================================================
 * Motor de interlinking canónico tridimensional:
 *   Geografía (Provincia) × Gremio (Finca/Artista/Logística) × Formato.
 *
 * - Consume el catálogo REAL de fincas homologadas S-CLASS (SSOT BLOQUE 5).
 * - Genera enlaces cruzados bidireccionales (finca ↔ artista ↔ logística).
 * - Emite microdatos Schema.org JSON-LD:
 *     EventVenue, MusicGroup, PriceSpecification, AggregateRating.
 *
 * NOTA: Este módulo es "client-safe" y no depende de `crypto` de Node.
 */

import {
  SCLASS_12_FINCAS_HOMOLOGADAS,
  type FincaHomologada,
} from '@/lib/constants/fincas-catalog';
import type { AcgArtistOffer } from './acgDecisionEngine';

/* ------------------------------------------------------------------ */
/* Tipos                                                                */
/* ------------------------------------------------------------------ */

export interface Interlink {
  href: string;
  label: string;
  relation: string;
  anchor: string;
}

export interface JsonLdPriceSpecification {
  '@type': 'PriceSpecification';
  price: number;
  priceCurrency: string;
  minPrice?: number;
  maxPrice?: number;
  valueAddedTaxIncluded: false;
}

export interface JsonLdMusicGroup {
  '@type': 'MusicGroup';
  name: string;
  genre: string[];
  member: { '@type': 'Person'; name: string; jobTitle: string }[];
  offer: { '@type': 'Offer'; price: number; priceCurrency: string; availability: 'https://schema.org/InStock' };
}

export interface JsonLdEventVenue {
  '@type': 'EventVenue';
  name: string;
  address: { '@type': 'PostalAddress'; addressLocality: string; addressRegion: string; addressCountry: 'ES' };
  maximumAttendeeCapacity: number;
  isAccessibleForFree: false;
}

export type SchemaOrgGraph = (JsonLdEventVenue | JsonLdMusicGroup | JsonLdPriceSpecification)[];

/* ------------------------------------------------------------------ */
/* Utilidades de slug                                                  */
/* ------------------------------------------------------------------ */

export function normalizeForUrl(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function provinceSlug(province: string): string {
  return normalizeForUrl(province);
}

export function formatSlug(formatLabel: string): string {
  return normalizeForUrl(formatLabel);
}

/* ------------------------------------------------------------------ */
/* Interlinking tridimensional                                          */
/* ------------------------------------------------------------------ */

/**
 * Dada una finca, genera los interlinks canónicos de artistas con rider
 * compatible + nodos logísticos y territoriales.
 */
export function buildFincaInterlinks(finca: FincaHomologada, offers: readonly AcgArtistOffer[]): Interlink[] {
  const links: Interlink[] = [];

  // 1. Nodo geográfico canónico
  const provSlug = provinceSlug(finca.provincia);
  links.push({
    href: `/bodas/${provSlug}`,
    label: `Bodas en ${finca.provincia}`,
    relation: 'Geography',
    anchor: 'provincia',
  });

  // 2. Artistas compatibles con el límite acústico / aforo de la finca
  offers.forEach((offer) => {
    if (offer.musiciansCount > 2 && finca.capacidadMaxPax < 200) return; // aforo incompatible
    if (finca.capacidadMaxPax > 280 && offer.splCompatible) {
      links.push({
        href: `/acg?finca=${finca.id}&step=match&artist=${offer.id}`,
        label: `${offer.name} · ${offer.formatLabel} (rider aprobado)`,
        relation: 'AcousticInterlink',
        anchor: 'artista-compatible',
      });
    }
  });

  // 3. Nodo logístico desde Hub Méntrida
  links.push({
    href: `/acg?finca=${finca.id}&step=ruta`,
    label: `Ruta desde Méntrida: ${finca.distanciaHubMentridaKm} km · ${finca.distanciaHubMentridaKm > 50 ? `${finca.distanciaHubMentridaKm - 50} km facturables` : '0 km facturables'}`,
    relation: 'LogisticsInterlink',
    anchor: 'logistica',
  });

  return links;
}

/**
 * Genera el bloque de interlinks geográficos bidireccionales globales.
 */
export function buildTerritorialInterlinks(activeProvince: string): Interlink[] {
  if (!activeProvince) return [];
  const provSlug = provinceSlug(activeProvince);
  return [
    {
      href: `/bodas/${provSlug}`,
      label: `Bodas en ${activeProvince}`,
      relation: 'Geography',
      anchor: 'provincia',
    },
    {
      href: `/artistas/provincias/${provSlug}`,
      label: `Artistas en ${activeProvince}`,
      relation: 'GeographyGremio',
      anchor: 'artistas-provincia',
    },
    {
      href: `/fincas/${provSlug}`,
      label: `Fincas homologadas en ${activeProvince}`,
      relation: 'GeographyGremio',
      anchor: 'fincas-provincia',
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Schema.org JSON-LD                                                   */
/* ------------------------------------------------------------------ */

export function buildFincaJsonLd(finca: FincaHomologada): JsonLdEventVenue {
  return {
    '@type': 'EventVenue',
    name: finca.name,
    address: {
      '@type': 'PostalAddress',
      addressLocality: finca.location,
      addressRegion: finca.provincia,
      addressCountry: 'ES',
    },
    maximumAttendeeCapacity: finca.capacidadMaxPax,
    isAccessibleForFree: false,
  };
}

export function buildMusicGroupJsonLd(offer: AcgArtistOffer): JsonLdMusicGroup {
  return {
    '@type': 'MusicGroup',
    name: offer.name,
    genre: ['Boda', 'Evento en directo', 'Acústico S-Class'],
    member: Array.from({ length: offer.musiciansCount }, (_, i) => ({
      '@type': 'Person',
      name: i === 0 ? 'Edwin Agudelo' : `Músico ${i + 1}`,
      jobTitle: i === 0 ? 'Voz Principal' : 'Músico de Conservatorio',
    })),
    offer: {
      '@type': 'Offer',
      price: offer.basePriceEur,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
  };
}

export function buildPriceJsonLd(priceEur: number, minPriceEur = 350): JsonLdPriceSpecification {
  return {
    '@type': 'PriceSpecification',
    price: priceEur,
    priceCurrency: 'EUR',
    minPrice: minPriceEur,
    maxPrice: Math.max(priceEur, minPriceEur),
    valueAddedTaxIncluded: false,
  };
}

export function buildAcgGraph(finca: FincaHomologada | undefined, offer: AcgArtistOffer): SchemaOrgGraph {
  const graph: SchemaOrgGraph = [];
  if (finca) graph.push(buildFincaJsonLd(finca));
  graph.push(buildMusicGroupJsonLd(offer));
  graph.push(buildPriceJsonLd(offer.basePriceEur));
  return graph;
}

/* ------------------------------------------------------------------ */
/* Utilidades de catálogo                                              */
/* ------------------------------------------------------------------ */

export function getAllFincas(): FincaHomologada[] {
  return SCLASS_12_FINCAS_HOMOLOGADAS;
}

export function getFincaBySlug(slug: string): FincaHomologada | undefined {
  return SCLASS_12_FINCAS_HOMOLOGADAS.find(
    (f) => f.slug === slug || normalizeForUrl(f.name) === normalizeForUrl(slug),
  );
}

export function listFincaProvinces(): string[] {
  return Array.from(new Set(SCLASS_12_FINCAS_HOMOLOGADAS.map((f) => f.provincia)));
}