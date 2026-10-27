/**
 * 🏛️ B2G LIVE TENDER RADAR (S-CLASS ENTERPRISE)
 * ----------------------------------------------------------------------------
 * Motor de radar autónomo para la detección en tiempo real de licitaciones menores
 * de cultura, festejos populares y tercera edad (Art. 118 LCSP < 14.250 €) en la
 * Plataforma de Contratación del Sector Público (PLACSP) y boletines oficiales.
 *
 * Utiliza DeepSeek Search & Fetch API para rastreo web en vivo sin coste de scrapers
 * externos ni almacenamiento de gigabytes de volcados estáticos.
 * ----------------------------------------------------------------------------
 */

import { searchWebDeepSeek, fetchWebDeepSeek, isDeepSeekToolsConfigured } from '@/lib/compiler/deepseek-inference';
import type { DeepSeekSearchResult } from '@/lib/compiler/deepseek-inference';
import { SAFE_LCSP_CEILING_EUR, LIMITE_B2G_LCSP_EUR } from '@/lib/constants/ear-os-ssot';
import { createHash } from 'crypto';

export interface MunicipalTenderOpportunity {
  readonly id: string;
  readonly title: string;
  readonly entityName: string;
  readonly provinceOrCity: string;
  readonly estimatedAmountEur: number | null;
  readonly isMinorContractEligible: boolean; // < 15.000 € Art. 118 LCSP
  readonly sourceUrl: string;
  readonly sourceDomain: string;
  readonly snippet: string;
  readonly deadlineDate?: string;
  readonly dossierPreset: 'PILOTO_TRIMESTRAL' | 'ANTI_SOLEDAD_SENIOR' | 'GALA_MAYOR' | 'PLAN_ANUAL_TECHO';
  readonly provenanceHash: string;
}

export interface TenderRadarScanResult {
  readonly success: boolean;
  readonly count: number;
  readonly opportunities: readonly MunicipalTenderOpportunity[];
  readonly scannedQuery: string;
  readonly latencyMs: number;
  readonly cached: boolean;
  readonly failureReason?: string;
}

export interface TenderRadarScanOptions {
  readonly provinceOrCity?: string;
  readonly category?: 'musica_fiestas' | 'mayores_vimume' | 'sonido_iluminacion';
  readonly maxResults?: number;
}

// In-memory cache con TTL de 6 horas para no pagar peticiones duplicadas
const radarCache = new Map<string, { timestamp: number; result: TenderRadarScanResult }>();
const RADAR_CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function cleanString(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

function extractAmountFromText(text: string): number | null {
  // Regex para capturar cifras en euros: ej. "14.250 €", "9.500,00 euros", "12000 €"
  const amountRegex = /(\d{1,3}(?:\.\d{3})*(?:,\d{1,2})?|\d+)\s*(?:€|euros)/i;
  const match = text.match(amountRegex);
  if (!match) return null;
  const numStr = match[1].replace(/\./g, '').replace(',', '.');
  const num = parseFloat(numStr);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function parseEntityFromSnippet(title: string, snippet: string, cityFallback: string): string {
  const aytoRegex = /(?:Ayuntamiento de|Diputación de|Mancomunidad de|Comunidad de)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ\s]+?)(?:[,.-]|\bpara\b|\bconvoca\b|\bformaliza\b|$)/i;
  const match = title.match(aytoRegex) || snippet.match(aytoRegex);
  if (match && match[0]) {
    return cleanString(match[0]);
  }
  return cityFallback.length > 0 ? `Ayuntamiento de ${cityFallback}` : 'Entidad Municipal';
}

function determineDossierPreset(amount: number | null, text: string): 'PILOTO_TRIMESTRAL' | 'ANTI_SOLEDAD_SENIOR' | 'GALA_MAYOR' | 'PLAN_ANUAL_TECHO' {
  const lower = text.toLowerCase();
  if (lower.includes('mayor') || lower.includes('residencia') || lower.includes('soledad') || lower.includes('social')) {
    if (amount && amount >= 8000) return 'ANTI_SOLEDAD_SENIOR';
    return 'PILOTO_TRIMESTRAL';
  }
  if (lower.includes('gala') || lower.includes('homenaje') || lower.includes('concierto')) {
    return 'GALA_MAYOR';
  }
  if (amount && amount >= 12000) {
    return 'PLAN_ANUAL_TECHO';
  }
  return 'PILOTO_TRIMESTRAL';
}

/**
 * Escanea en vivo convocatorias y contratos menores municipales mediante DeepSeek Search API.
 */
export async function scanLiveMunicipalTenders(options: TenderRadarScanOptions = {}): Promise<TenderRadarScanResult> {
  const startedAt = Date.now();
  const city = cleanString(options.provinceOrCity ?? '');
  const category = options.category ?? 'musica_fiestas';
  const maxResults = Math.min(Math.max(1, options.maxResults ?? 8), 15);

  const currentYear = new Date().getFullYear();
  let queryTerms = `contrato menor fiestas patronales licitacion ${currentYear}`;
  if (category === 'mayores_vimume') {
    queryTerms = `contrato menor musica mayores tercera edad taller envejecimiento ${currentYear}`;
  } else if (category === 'sonido_iluminacion') {
    queryTerms = `contrato menor sonorizacion iluminacion festejos ${currentYear}`;
  }

  const fullQuery = city.length > 0
    ? `${city} ${queryTerms} plataforma contratacion sector publico`
    : `${queryTerms} plataforma contratacion del sector publico`;

  const cacheKey = `${fullQuery}:${maxResults}`;
  const cached = radarCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < RADAR_CACHE_TTL_MS) {
    return { ...cached.result, cached: true, latencyMs: Date.now() - startedAt };
  }

  if (!isDeepSeekToolsConfigured()) {
    return {
      success: false,
      count: 0,
      opportunities: [],
      scannedQuery: fullQuery,
      latencyMs: Date.now() - startedAt,
      cached: false,
      failureReason: 'DEEPSEEK_API_KEY no está configurada en variables de entorno.'
    };
  }

  const searchRes = await searchWebDeepSeek(fullQuery, {
    count: maxResults,
    needContent: false,
    timeoutMs: 7000
  });

  if (!searchRes.available || searchRes.results.length === 0) {
    return {
      success: false,
      count: 0,
      opportunities: [],
      scannedQuery: fullQuery,
      latencyMs: Date.now() - startedAt,
      cached: false,
      failureReason: searchRes.reason ?? 'Sin resultados en la búsqueda web en vivo.'
    };
  }

  const opportunities: MunicipalTenderOpportunity[] = searchRes.results.map((item: DeepSeekSearchResult, idx: number) => {
    let domain = '';
    try {
      domain = new URL(item.url).hostname;
    } catch {
      domain = 'contrataciondelestado.es';
    }

    const combinedText = `${item.title} ${item.summary}`;
    const amount = extractAmountFromText(combinedText);
    const entity = parseEntityFromSnippet(item.title, item.summary, city);
    const isMinor = amount === null || amount <= LIMITE_B2G_LCSP_EUR;
    const preset = determineDossierPreset(amount, combinedText);

    const hashInput = `${item.url}|${entity}|${amount ?? 0}|${preset}`;
    const provenanceHash = createHash('sha256').update(hashInput).digest('hex').slice(0, 16);

    return {
      id: `b2g-radar-${Date.now()}-${idx}`,
      title: item.title,
      entityName: entity,
      provinceOrCity: city || 'Nacional',
      estimatedAmountEur: amount,
      isMinorContractEligible: isMinor,
      sourceUrl: item.url,
      sourceDomain: domain,
      snippet: item.summary,
      dossierPreset: preset,
      provenanceHash: `B2G-Ω-${provenanceHash}`
    };
  });

  const finalResult: TenderRadarScanResult = {
    success: true,
    count: opportunities.length,
    opportunities,
    scannedQuery: fullQuery,
    latencyMs: Date.now() - startedAt,
    cached: false
  };

  radarCache.set(cacheKey, { timestamp: Date.now(), result: finalResult });
  return finalResult;
}

/**
 * Lee el pliego o anuncio web en profundidad con DeepSeek Fetch API y resume los requisitos técnicos.
 */
export async function fetchTenderDetailsLive(url: string): Promise<{ title: string; markdownSummary: string; provenanceHash: string } | null> {
  const res = await fetchWebDeepSeek(url, 12000);
  if (!res.available || res.content.length === 0) {
    return null;
  }
  const provenanceHash = createHash('sha256').update(`${url}|${res.content.slice(0, 500)}`).digest('hex');
  return {
    title: res.title,
    markdownSummary: res.content.slice(0, 4000),
    provenanceHash: `B2G-DOC-${provenanceHash.slice(0, 16)}`
  };
}
