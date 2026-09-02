// src/app/actions/agenticWorkflowActions.ts
'use server';

import crypto from 'crypto';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TIPOS & INTERFACES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface ProposedLandingPayload {
  id: string;
  vertical: string;
  intentSlug: string;
  monthlySearches: number;
  proposedTitle: string;
  metaDescription: string;
  primaryPainPoint: string;
  technicalSolution: string;
  priceAnchor: string;
  approvalToken: string;
  status: 'PENDING_CEO_APPROVAL' | 'APPROVED' | 'REJECTED';
  createdAt: string;
}

export interface AgenticLoopResponse {
  success: boolean;
  message: string;
  payload?: ProposedLandingPayload;
  telegramSimulatedMessage?: string;
  error?: string;
}

export type UrgencyLevel = 'P0_CRITICAL' | 'P1_HIGH' | 'P2_STANDARD' | 'P3_LOW';

export interface OpportunityNode {
  id: string;
  title: string;
  deepLinkUrl: string;
  estimatedBudget: number;
  daysUntilEvent: number;
  hoursUntilBidClose: number | null;
  rawTextSnippet: string;
  urgencyLevel: UrgencyLevel;
  urgencyScore: number;
  affinityPercent: number;
  httpStatus: number | null;
  isVerified: boolean;
  discardReason: string | null;
  createdAt: string;
}

export interface OpportunityValidationResult {
  success: boolean;
  approved: OpportunityNode[];
  discarded: OpportunityNode[];
  stats: {
    total: number;
    approved: number;
    discarded: number;
    approvalRate: string;
  };
  telegramPayload?: string;
  error?: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONSTANTS: Urgency Scoring Weights
// S_urgencia = α·max(0, 14 - Δt_evento) + β·Match(Keywords) + γ·max(0, 48 - Δt_licitacion)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ALPHA_EVENT_DAYS = 3.0;
const BETA_KEYWORD_MATCH = 5.0;
const GAMMA_BID_HOURS = 2.0;

const CRISIS_KEYWORDS_REGEX = /cancelaci[oó]n|urgente|emergencia|sustituci[oó]n|fallo\s?dj|último\s?momento|ya\s?mismo|desesperado/i;

// Rider S-Class keywords for affinity matching
const RIDER_KEYWORDS = [
  'sonorizacion', 'sonido', 'musica', 'mariachi', 'dj', 'iluminacion',
  'bose', 'shure', 'behringer', 'line array', 'pa', 'escenario',
  'evento', 'boda', 'corporativo', 'gala', 'concierto', 'fiesta',
  'fiestas patronales', 'musicoterapia', 'audiovisual', 'produccion',
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN 1: Hybrid Urgency Scorer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calculateUrgencyScore(
  daysUntilEvent: number,
  hoursUntilBidClose: number | null,
  rawText: string
): { score: number; level: UrgencyLevel } {
  // Component 1: Event proximity
  const eventProximityScore = ALPHA_EVENT_DAYS * Math.max(0, 14 - daysUntilEvent);

  // Component 2: Crisis keyword match
  const keywordScore = CRISIS_KEYWORDS_REGEX.test(rawText) ? BETA_KEYWORD_MATCH * 10 : 0;

  // Component 3: Bid deadline proximity (B2G/LCSP)
  const bidProximityScore = hoursUntilBidClose !== null
    ? GAMMA_BID_HOURS * Math.max(0, 48 - hoursUntilBidClose)
    : 0;

  const totalScore = eventProximityScore + keywordScore + bidProximityScore;

  let level: UrgencyLevel;
  if (totalScore >= 50 || daysUntilEvent <= 3 || (hoursUntilBidClose !== null && hoursUntilBidClose <= 12)) {
    level = 'P0_CRITICAL';
  } else if (totalScore >= 30 || daysUntilEvent <= 7) {
    level = 'P1_HIGH';
  } else if (totalScore >= 10 || daysUntilEvent <= 14) {
    level = 'P2_STANDARD';
  } else {
    level = 'P3_LOW';
  }

  return { score: Math.round(totalScore * 100) / 100, level };
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN 2: Zero-Dead-Link Validator (HTTP HEAD)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function validateDeepLink(url: string): Promise<{ status: number; alive: boolean }> {
  try {
    // Sanitize: Block path traversal and non-HTTP schemes
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { status: 0, alive: false };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s hard timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'EAR-OS-OpportunityValidator/1.0 (+https://www.productoraear.com)',
      },
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    return { status: response.status, alive: response.status === 200 };
  } catch {
    // Network error, DNS failure, timeout — silently discard
    return { status: 0, alive: false };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN 3: Rider Affinity Calculator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function calculateRiderAffinity(textContent: string): number {
  const normalizedText = textContent.toLowerCase();
  let matchCount = 0;

  for (const keyword of RIDER_KEYWORDS) {
    if (normalizedText.includes(keyword)) {
      matchCount++;
    }
  }

  return Math.min(100, Math.round((matchCount / RIDER_KEYWORDS.length) * 100));
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN 4: Validate Opportunities Batch (Core Agentic Loop)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export async function validateOpportunitiesBatchAction(
  rawOpportunities: Array<{
    title: string;
    deepLinkUrl: string;
    estimatedBudget: number;
    daysUntilEvent: number;
    hoursUntilBidClose: number | null;
    rawTextSnippet: string;
  }>
): Promise<OpportunityValidationResult> {
  try {
    const approved: OpportunityNode[] = [];
    const discarded: OpportunityNode[] = [];

    for (const raw of rawOpportunities) {
      const id = `opp-${crypto.randomBytes(6).toString('hex')}`;

      // 1. Reject root domains (Deep Link enforcement)
      try {
        const parsed = new URL(raw.deepLinkUrl);
        if (parsed.pathname === '/' || parsed.pathname === '') {
          discarded.push({
            id,
            ...raw,
            urgencyLevel: 'P3_LOW',
            urgencyScore: 0,
            affinityPercent: 0,
            httpStatus: null,
            isVerified: false,
            discardReason: 'ROOT_DOMAIN_REJECTED: No se aceptan dominios raíz. Aisla el endpoint terminal.',
            createdAt: new Date().toISOString(),
          });
          continue;
        }
      } catch {
        discarded.push({
          id,
          ...raw,
          urgencyLevel: 'P3_LOW',
          urgencyScore: 0,
          affinityPercent: 0,
          httpStatus: null,
          isVerified: false,
          discardReason: 'MALFORMED_URL: La URL no es válida.',
          createdAt: new Date().toISOString(),
        });
        continue;
      }

      // 2. Validate link is alive (Zero-Dead-Link)
      const linkCheck = await validateDeepLink(raw.deepLinkUrl);

      if (!linkCheck.alive) {
        discarded.push({
          id,
          ...raw,
          urgencyLevel: 'P3_LOW',
          urgencyScore: 0,
          affinityPercent: 0,
          httpStatus: linkCheck.status,
          isVerified: false,
          discardReason: `DEAD_LINK: HTTP ${linkCheck.status || 'TIMEOUT'}. Enlace no accesible, destruido silenciosamente.`,
          createdAt: new Date().toISOString(),
        });
        continue;
      }

      // 3. Calculate urgency score
      const { score, level } = calculateUrgencyScore(
        raw.daysUntilEvent,
        raw.hoursUntilBidClose,
        raw.rawTextSnippet
      );

      // 4. Calculate rider affinity
      const affinity = calculateRiderAffinity(raw.rawTextSnippet + ' ' + raw.title);

      approved.push({
        id,
        ...raw,
        urgencyLevel: level,
        urgencyScore: score,
        affinityPercent: affinity,
        httpStatus: linkCheck.status,
        isVerified: true,
        discardReason: null,
        createdAt: new Date().toISOString(),
      });
    }

    // Sort approved by urgency score (highest first)
    approved.sort((a, b) => b.urgencyScore - a.urgencyScore);

    // Build Telegram payload for approved opportunities
    const telegramPayload = approved.length > 0
      ? buildTelegramOpportunitiesPayload(approved)
      : undefined;

    const total = rawOpportunities.length;
    return {
      success: true,
      approved,
      discarded,
      stats: {
        total,
        approved: approved.length,
        discarded: discarded.length,
        approvalRate: total > 0 ? `${Math.round((approved.length / total) * 100)}%` : '0%',
      },
      telegramPayload,
    };
  } catch (error: any) {
    console.error('❌ Error en validateOpportunitiesBatchAction:', error);
    return {
      success: false,
      approved: [],
      discarded: [],
      stats: { total: 0, approved: 0, discarded: 0, approvalRate: '0%' },
      error: error.message,
    };
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN 5: Telegram Payload Builder
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function buildTelegramOpportunitiesPayload(opportunities: OpportunityNode[]): string {
  const urgencyEmoji: Record<UrgencyLevel, string> = {
    P0_CRITICAL: '🔴',
    P1_HIGH: '🟠',
    P2_STANDARD: '🟡',
    P3_LOW: '🟢',
  };

  const header = `⚡ *RADAR DE OPORTUNIDADES S-CLASS — EAR OS* ⚡\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n📊 *${opportunities.length} oportunidades verificadas (100% HTTP 200 OK)*\n`;

  const items = opportunities.map((opp, i) => {
    return `
${urgencyEmoji[opp.urgencyLevel]} *${i + 1}. ${opp.title}*
├ 🎯 Urgencia: \`${opp.urgencyLevel}\` (Score: ${opp.urgencyScore})
├ 💶 Presupuesto: \`${opp.estimatedBudget.toLocaleString('es-ES')} €\`
├ 📅 Días: \`${opp.daysUntilEvent}\`${opp.hoursUntilBidClose !== null ? ` | Cierre: \`${opp.hoursUntilBidClose}h\`` : ''}
├ 🎵 Afinidad Rider: \`${opp.affinityPercent}%\`
└ 🔗 [Deep Link Verificado](${opp.deepLinkUrl})`.trim();
  });

  const footer = `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n🔐 Pulsa [CONTACTAR] junto a cada oportunidad para activar la Centralita (+34 693 693 048).`;

  return header + items.join('\n\n') + footer;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FUNCIÓN ORIGINAL: SEO Discovery (Preserved)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * 🤖 Bucle Agéntico S-Class (Agentic Assistant Loop)
 * Analiza demandas no cubiertas, redacta el blueprint semántico y construye el
 * payload interactivo para Telegram requiriendo validación local del CEO.
 */
export async function triggerAgenticSeoDiscoveryAction(
  vertical: string = 'bodas',
  keywordQuery: string = 'musica directo fincas toledo'
): Promise<AgenticLoopResponse> {
  try {
    const approvalToken = `claim_${crypto.randomBytes(8).toString('hex')}_ceo`;
    const intentSlug = keywordQuery.toLowerCase().replace(/\s+/g, '-');

    const payload: ProposedLandingPayload = {
      id: `prop-${Date.now()}`,
      vertical,
      intentSlug,
      monthlySearches: 4200,
      proposedTitle: `Música en Directo para Fincas en Toledo | Sonorización 12 W/pax & Edwin Agudelo`,
      metaDescription: `Garantiza una acústica impecable en tu boda en Toledo. Microfonía Shure Axient, L-Acoustics y ensamble mariachi/solista desde 350€. Bloquea fecha con señal 30%.`,
      primaryPainPoint: 'Acústica deficiente en espacios abiertos y retrasos por desplazamientos fuera de Madrid.',
      technicalSolution: 'Desplazamiento directo desde base (radio 50km + 0.35€/km), montaje 2h previas y rider Bose F1 / XR18.',
      priceAnchor: 'Desde 350 € (Solista) – 900 € (Cuarteto Gala)',
      approvalToken,
      status: 'PENDING_CEO_APPROVAL',
      createdAt: new Date().toISOString(),
    };

    const telegramSimulatedMessage = `
⚡ *PROPUESTA DE DESPLIEGUE SEO PROGRAMÁTICO — EAR OS* ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 *Vertical:* \`${payload.vertical}\`
🔍 *Intención / Keyword:* \`${payload.intentSlug}\`
📊 *Volumen Estimado:* \`${payload.monthlySearches} búsquedas/mes\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 *Título Propuesto:*
_${payload.proposedTitle}_

💡 *Dolor Neutralizado:*
${payload.primaryPainPoint}

🛠️ *Rider & Solución:*
${payload.technicalSolution}

💶 *Tarifa Ancla:* \`${payload.priceAnchor}\`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 *Token de Gobernanza:* \`${payload.approvalToken}\`
Acción requerida: Pulsa [APROBAR] para inyectar en sitemap y compilar en producción.
    `.trim();

    return {
      success: true,
      message: 'Propuesta semántica generada. En espera de validación en Telegram.',
      payload,
      telegramSimulatedMessage,
    };
  } catch (error: any) {
    console.error('❌ Error en triggerAgenticSeoDiscoveryAction:', error);
    return { success: false, message: 'Fallo al ejecutar bucle agéntico', error: error.message };
  }
}
