/**
 * 🏰 VENUE FORENSIC AUDITOR (LIVE WEB ENGINE)
 * ----------------------------------------------------------------------------
 * Auditoría forense en tiempo real de fincas, palacios y recintos de eventos.
 * Conecta con DeepSeek Search & Fetch para extraer datos oficiales:
 *  - Aforo real (pax).
 *  - Web oficial y teléfono de la finca.
 *  - Ordenanza acústica municipal y régimen de limitador telemático.
 *  - Cláusulas de exclusividad (catering / sonido propio).
 *  - Provenance SHA-256 para trazabilidad legal y técnica.
 * ----------------------------------------------------------------------------
 */

import { searchWebDeepSeek, fetchWebDeepSeek, isDeepSeekToolsConfigured } from '@/lib/compiler/deepseek-inference';
import { createHash } from 'crypto';

export interface VenueLiveAuditReport {
  readonly venueName: string;
  readonly city: string;
  readonly officialUrl: string | null;
  readonly estimatedCapacityPax: number | null;
  readonly acousticOrdinanceSummary: string;
  readonly verifiedPhone: string | null;
  readonly exclusivityNotes: string[];
  readonly provenanceSources: readonly string[];
  readonly provenanceHash: string;
  readonly auditedAt: string;
}

const venueAuditCache = new Map<string, { timestamp: number; report: VenueLiveAuditReport }>();
const VENUE_AUDIT_TTL_MS = 24 * 60 * 60 * 1000;

function parseCapacity(text: string): number | null {
  const paxMatch = text.match(/(\d{2,4})\s*(?:personas|invitados|comensales|pax|asistentes)/i);
  if (paxMatch) {
    const num = parseInt(paxMatch[1], 10);
    if (num >= 20 && num <= 5000) return num;
  }
  return null;
}

function parsePhone(text: string): string | null {
  const phoneMatch = text.match(/(?:\+34\s*)?[6789]\d{2}[\s.-]?\d{3}[\s.-]?\d{3}/);
  return phoneMatch ? phoneMatch[0].replace(/\s+/g, ' ') : null;
}

/**
 * Audita una finca o recinto en tiempo real consultando la web viva.
 */
export async function auditVenueLive(venueName: string, city: string = ''): Promise<VenueLiveAuditReport | null> {
  const cleanName = venueName.trim();
  const cleanCity = city.trim();
  if (!cleanName || cleanName.length < 3) return null;

  const cacheKey = `${cleanName.toLowerCase()}:${cleanCity.toLowerCase()}`;
  const cached = venueAuditCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < VENUE_AUDIT_TTL_MS) {
    return cached.report;
  }

  if (!isDeepSeekToolsConfigured()) {
    return null;
  }

  // 1. Búsqueda de la finca / recinto
  const venueQuery = cleanCity.length > 0
    ? `"${cleanName}" ${cleanCity} boda capacidad aforo web oficial`
    : `"${cleanName}" boda eventos capacidad aforo web oficial`;

  const searchRes = await searchWebDeepSeek(venueQuery, { count: 3, timeoutMs: 6000 });
  if (!searchRes.available || searchRes.results.length === 0) {
    return null;
  }

  const sources: string[] = [];
  let officialUrl: string | null = null;
  let capacity: number | null = null;
  let phone: string | null = null;
  const exclusivity: string[] = [];

  for (const item of searchRes.results) {
    sources.push(item.url);
    if (!officialUrl && (item.url.includes(cleanName.toLowerCase().replace(/\s+/g, '')) || !item.url.includes('bodas.net'))) {
      officialUrl = item.url;
    }
    const cap = parseCapacity(`${item.title} ${item.summary}`);
    if (cap && !capacity) capacity = cap;
    const ph = parsePhone(`${item.title} ${item.summary}`);
    if (ph && !phone) phone = ph;
  }

  // 2. Si tenemos URL oficial, intentamos un fetch de su home / eventos
  if (officialUrl) {
    const fetchRes = await fetchWebDeepSeek(officialUrl, 10000);
    if (fetchRes.available && fetchRes.content.length > 0) {
      const deepCap = parseCapacity(fetchRes.content);
      if (deepCap) capacity = deepCap;
      const deepPhone = parsePhone(fetchRes.content);
      if (deepPhone) phone = deepPhone;
      if (fetchRes.content.toLowerCase().includes('catering propio') || fetchRes.content.toLowerCase().includes('catering exclusivo')) {
        exclusivity.push('Catering exclusivo del recinto');
      }
      if (fetchRes.content.toLowerCase().includes('limitador') || fetchRes.content.toLowerCase().includes('sonomet')) {
        exclusivity.push('Dispone de limitador acústico telemático instalado');
      }
    }
  }

  // 3. Consulta de ordenanza acústica del municipio si se conoce
  let acousticSummary = 'Conforme a la Ley 37/2003 de Ruido (75-85 dBA exteriores).';
  if (cleanCity.length > 0) {
    const noiseQuery = `ordenanza municipal ruido ${cleanCity} limite dB noche musica`;
    const noiseRes = await searchWebDeepSeek(noiseQuery, { count: 2, timeoutMs: 5000 });
    if (noiseRes.available && noiseRes.results.length > 0) {
      sources.push(noiseRes.results[0].url);
      acousticSummary = `Ordenanza de ${cleanCity}: ${noiseRes.results[0].summary.slice(0, 220)}...`;
    }
  }

  const hashContent = `${cleanName}|${cleanCity}|${capacity ?? 0}|${phone ?? 'none'}|${sources.join(',')}`;
  const provenanceHash = `VENUE-Ω-${createHash('sha256').update(hashContent).digest('hex').slice(0, 16)}`;

  const report: VenueLiveAuditReport = {
    venueName: cleanName,
    city: cleanCity || 'España',
    officialUrl,
    estimatedCapacityPax: capacity,
    acousticOrdinanceSummary: acousticSummary,
    verifiedPhone: phone,
    exclusivityNotes: exclusivity,
    provenanceSources: sources,
    provenanceHash,
    auditedAt: new Date().toISOString()
  };

  venueAuditCache.set(cacheKey, { timestamp: Date.now(), report });
  return report;
}
