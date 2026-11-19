/**
 * ══════════════════════════════════════════════════════════════════════════════
 * SOVEREIGN MULTI-VAULT RAG AGGREGATOR — EAR OS v12.1 S-CLASS
 * ══════════════════════════════════════════════════════════════════════════════
 * Conecta e indexa dinámicamente el Concierge IA a la totalidad de bóvedas
 * y bases de datos vivas de Productora EAR:
 *   1. Data Lake de Proveedores Verificados (edge-partition-loader: 5.310 fichas)
 *   2. Bóveda Canónica de Fincas & Caseríos (Ezkertza Berria & Otzarreta Derio)
 *   3. Catálogo Nacional de Mariachis de Gala & Artistas (mariachis_catalog_clean)
 *   4. Bóveda Institucional B2G & Licitaciones Art. 118 LCSP (b2g_opportunities_database)
 *   5. Catálogo Monumental de Iluminación & Sonido (luces_navidad_2026_ear)
 *   6. Base de Conocimiento Científico & Musicoterapia VIMUME (vimume-rag-ssot)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import fs from 'node:fs';
import path from 'node:path';
import { loadFullProviderCatalog, type EdgeProviderRecord } from '@/lib/providers/edge-partition-loader';
import { OTZARRETA_KNOWLEDGE_BASE } from '@/lib/rag/provider-context';
import { resolvePublicProviderDisplayName } from '@/lib/providers/contact-gate';

export interface MultiVaultKnowledgeContext {
  providersSnippet: string;
  b2gSnippet: string;
  mariachisSnippet: string;
  arsenalSnippet: string;
  vimumeSnippet: string;
}

// Caches en memoria para no penalizar latencia en peticiones recurrentes
let cachedProviders: readonly EdgeProviderRecord[] | null = null;
let cachedB2G: any[] | null = null;
let cachedMariachis: any[] | null = null;
let cachedLuces: any[] | null = null;
let cachedVimumeSummary: string | null = null;

function safeReadJson<T>(relativePath: string): T | null {
  try {
    const fullPath = path.join(process.cwd(), relativePath);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8')) as T;
    }
  } catch (err) {
    console.warn(`[multiVaultAggregator] Error leyendo ${relativePath}:`, err);
  }
  return null;
}

/**
 * Busca proveedores relevantes en el Data Lake (5.310 fichas) según la consulta.
 */
export function queryDataLakeProviders(query: string, maxResults: number = 3): string {
  if (!cachedProviders) {
    try {
      cachedProviders = loadFullProviderCatalog();
    } catch {
      cachedProviders = [];
    }
  }

  const q = query.toLowerCase();
  const words = q.split(/\s+/).filter((w) => w.length > 2);

  if (words.length === 0) return '';

  const matches = cachedProviders
    .filter((p) => {
      const text = `${p.name} ${p.category} ${p.province || ''} ${p.municipality || ''} ${p.description || ''}`.toLowerCase();
      return words.some((w) => text.includes(w));
    })
    .slice(0, maxResults);

  if (matches.length === 0) return '';

  return matches
    .map((m) => {
      const publicName = resolvePublicProviderDisplayName({
        id: m.id,
        slug: m.slug,
        name: m.name,
        category: m.category,
        province: m.province,
        municipality: m.municipality,
      });
      return `- ${publicName} (${m.category}, ${m.province || m.municipality || 'España'}): ${m.description?.slice(0, 140) || 'Ficha homologada en EAR OS'} (Suelo: ${m.basePrice ? m.basePrice + ' €' : 'Consultar'})`;
    })
    .join('\n');
}

/**
 * Busca oportunidades B2G / contratos menores si la consulta es sobre ayuntamientos o licitaciones.
 */
export function queryB2GOpportunities(query: string): string {
  const q = query.toLowerCase();
  if (!q.includes('ayuntamiento') && !q.includes('b2g') && !q.includes('licit') && !q.includes('contrato menor') && !q.includes('pliego')) {
    return '';
  }

  if (!cachedB2G) {
    cachedB2G = safeReadJson<any[]>('src/data/b2g_opportunities_database.json') || [];
  }

  if (cachedB2G.length === 0) return '';

  return cachedB2G
    .slice(0, 3)
    .map((b) => `- Exp: ${b.title} | Entidad: ${b.entity} | Presupuesto: ${b.budget} € | CPV: ${b.cpv} (Art. 118 LCSP)`)
    .join('\n');
}

/**
 * Extrae opciones de Mariachis y agrupaciones si consultan música ranchera, serenatas o mariachis.
 */
export function queryMariachisCatalog(query: string): string {
  const q = query.toLowerCase();
  if (!q.includes('mariachi') && !q.includes('serenata') && !q.includes('ranchera')) {
    return '';
  }

  if (!cachedMariachis) {
    cachedMariachis = safeReadJson<any[]>('src/data/mariachis_catalog_clean.json') || [];
  }

  return cachedMariachis
    .map((m) => `- ${m.name}: ${m.priceTag} (Cobertura: ${m.provinces.slice(0, 3).join(', ')}). ${m.features?.[0] || ''}`)
    .join('\n');
}

/**
 * Extrae catálogo del Arsenal (luces, sonido, pantallas) si consultan equipamiento técnico.
 */
export function queryArsenalCatalog(query: string): string {
  const q = query.toLowerCase();
  if (
    !q.includes('luz') &&
    !q.includes('luces') &&
    !q.includes('navidad') &&
    !q.includes('ilumin') &&
    !q.includes('sonido') &&
    !q.includes('pantalla') &&
    !q.includes('arsenal')
  ) {
    return '';
  }

  if (!cachedLuces) {
    const raw = safeReadJson<any>('src/data/luces_navidad_2026_ear.json');
    if (raw && Array.isArray(raw)) {
      cachedLuces = raw;
    } else if (raw && typeof raw === 'object') {
      cachedLuces = Object.values(raw);
    } else {
      cachedLuces = [];
    }
  }

  if (cachedLuces.length === 0) return '';

  const matched = cachedLuces
    .filter((item) => {
      const text = `${item.name} ${item.category} ${item.description}`.toLowerCase();
      return q.includes('navidad') ? text.includes('navidad') || text.includes('3d') : true;
    })
    .slice(0, 2);

  return matched
    .map((item) => `- ${item.name} (${item.category}): ${item.priceDisplay || item.price + ' €'} · ${item.description?.slice(0, 120)}...`)
    .join('\n');
}

/**
 * Extrae conocimiento VIMUME (musicoterapia e impacto clínico) si consultan temas de salud o terapia musical.
 */
export function queryVimumeKnowledge(query: string): string {
  const q = query.toLowerCase();
  if (!q.includes('vimume') && !q.includes('terapia') && !q.includes('salud') && !q.includes('clinico') && !q.includes('clínico') && !q.includes('alzheimer')) {
    return '';
  }

  return 'VIMUME (Vibración, Música y Memoria): Proyecto de investigación neuroacústica y musicoterapia de precisión aplicada a mayores y estimulación cognitiva (40 Hz). Financiado por el 10% del split de cada actuación musical en EAR OS.';
}

/**
 * Ensambla el contexto dinámico multi-bóveda para nutrir el System Prompt del Concierge Neural.
 */
export function assembleMultiVaultRAGContext(userQuery: string, pathname: string): string {
  const dataLakeHits = queryDataLakeProviders(userQuery, 3);
  const b2gHits = queryB2GOpportunities(userQuery);
  const mariachiHits = queryMariachisCatalog(userQuery);
  const arsenalHits = queryArsenalCatalog(userQuery);
  const vimumeHits = queryVimumeKnowledge(userQuery);

  const sections: string[] = [];

  if (dataLakeHits) {
    sections.push(`PROVEEDORES Y FINCAS RELACIONADOS DEL DATA LAKE:\n${dataLakeHits}`);
  }
  if (b2gHits) {
    sections.push(`EXPEDIENTES B2G ACTIVOS (Art. 118 LCSP):\n${b2gHits}`);
  }
  if (mariachiHits) {
    sections.push(`AGRUPACIONES DE MARIACHI HOMOLOGADAS:\n${mariachiHits}`);
  }
  if (arsenalHits) {
    sections.push(`EQUIPAMIENTO TÉCNICO Y ALUMBRADO DEL ARSENAL EAR:\n${arsenalHits}`);
  }
  if (vimumeHits) {
    sections.push(`IMPACTO SOCIAL VIMUME:\n${vimumeHits}`);
  }

  if (sections.length === 0) {
    return '';
  }

  return '\n\nINFORMACIÓN EXTRAÍDA EN TIEMPO REAL DE LAS BÓVEDAS DE DATOS DE EAR OS:\n' + sections.join('\n\n');
}
