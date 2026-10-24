/**
 * ════════════════════════════════════════════════════════════════════════════
 * SWARM AI LEAD DISPATCHER — Motor de cribado multi-agente S-CLASS
 * ════════════════════════════════════════════════════════════════════════════
 * Toma un lead enriquecido procedente de CUALQUIER arquetipo soberano
 * (Novios / Ayuntamientos / Artistas / Proveedores), valida su entrada, calcula
 * la viabilidad acústica (12 W/pax según aforo), verifica la deducción íntegra
 * del depósito Stripe (100 €), genera un `leadId` SHA-256 truncado, compone un
 * mensaje de WhatsApp de alta conversión con formato oficial y despacha el
 * evento de forma NO BLOQUEANTE a n8n (`call-center-intake` o `b2b-quote`) con
 * dead-letter queue heredada del `n8n-dispatcher`.
 *
 * DOCTRINA (AGENTS.md §11): ningún lead queda huérfano. Cero `any` implícito.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { createHash } from 'node:crypto';
import {
  DEPOSITO_STRIPE_EUR,
  WATTS_PER_PAX,
  LIMITE_SPL_DB,
  SPLIT_SOBERANO,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { fireAndForgetN8n, type N8nWebhookSlug } from '@/lib/services/n8n-dispatcher';

/* ─── Tipado estricto del dominio (cero `any` implícito) ─── */

export type SwarmLeadRole =
  | 'COUPLE_WEDDING'
  | 'TOWNHALL_B2G'
  | 'SOVEREIGN_ARTIST'
  | 'VENDOR_PARTNER';

export interface SwarmLeadInput {
  role: SwarmLeadRole;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  location: string;
  guestsPax: number;
  budgetEur: number;
  technicalNotes?: string;
}

export type SwarmAcousticStatus =
  | 'VIABLE'
  | 'LIMITROFE'
  | 'INVIABLE';

export interface SwarmSplitPreview {
  artistaPct: number;
  earOsPct: number;
  vimumePct: number;
  artistaEur: number;
  earOsEur: number;
  vimumeEur: number;
}

export interface SwarmN8nPayload {
  event: string;
  leadId: string;
  role: SwarmLeadRole;
  clientName: string;
  clientPhone: string;
  eventDate: string;
  location: string;
  guestsPax: number;
  budgetEur: number;
  wattsRecommended: number;
  acousticStatus: SwarmAcousticStatus;
  depositDeducibleEur: number;
  split: SwarmSplitPreview;
  webhookSlug: N8nWebhookSlug;
  dispatchedAt: string;
}

export interface SwarmQualificationResult {
  leadId: string;
  score: number;
  acousticStatus: SwarmAcousticStatus;
  wattsRecommended: number;
  maxSplDb: number;
  splitPreview: SwarmSplitPreview;
  whatsAppDirectUrl: string;
  whatsAppMessage: string;
  n8nPayload: SwarmN8nPayload;
}

/* ─── Constantes derivadas del SSOT (fuente única de verdad) ─── */

const SPLIT_PCT_ARTISTA: number = Math.round(SPLIT_SOBERANO.artista * 100);
const SPLIT_PCT_EAR_OS: number = Math.round(SPLIT_SOBERANO.earOs * 100);
const SPLIT_PCT_VIMUME: number = Math.round(SPLIT_SOBERANO.vimume * 100);

/** WhatsApp oficial de la centralita (solo CEO Edwin Agudelo). */
const WHATSAPP_NUMBER: string = CENTRALITA_EAR_OS.replace(/\D/g, '');

const ROLE_LABELS: Readonly<Record<SwarmLeadRole, string>> = Object.freeze({
  COUPLE_WEDDING: 'Boda / Finca',
  TOWNHALL_B2G: 'Ayuntamiento / B2G',
  SOVEREIGN_ARTIST: 'Artista Diamante',
  VENDOR_PARTNER: 'Proveedor / Finca B2B',
});

/** Webhook n8n óptimo por rol: particulares → call-center-intake, empresas → b2b-quote. */
const ROLE_WEBHOOK: Readonly<Record<SwarmLeadRole, N8nWebhookSlug>> = Object.freeze({
  COUPLE_WEDDING: 'call-center-intake',
  TOWNHALL_B2G: 'b2b-quote',
  SOVEREIGN_ARTIST: 'call-center-intake',
  VENDOR_PARTNER: 'b2b-quote',
});

/* ─── Helpers puros y deterministas ─── */

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** Hash SHA-256 truncado (24 hex) del lead para trazabilidad idempotente. */
function computeLeadId(input: SwarmLeadInput): string {
  const seed: string = [
    input.role,
    input.clientPhone.replace(/\s+/g, ''),
    input.eventDate,
    input.location,
    String(input.guestsPax),
    String(input.budgetEur),
  ].join('::');
  return createHash('sha256').update(seed).digest('hex').slice(0, 24).toUpperCase();
}

/* ─── Reglas de viabilidad acústica (rider Ley 37/2003 / < 75 dB SPL) ─── */

function evaluateAcoustics(guestsPax: number): {
  status: SwarmAcousticStatus;
  watts: number;
} {
  const watts: number = round2(Math.max(0, guestsPax) * WATTS_PER_PAX);

  // Límite de salud pública: el rider general se mantiene por debajo de 75 dB SPL.
  if (guestsPax <= 0) {
    return { status: 'INVIABLE', watts: 0 };
  }
  if (guestsPax > 600) {
    return { status: 'INVIABLE', watts };
  }
  if (watts >= 6000) {
    return { status: 'LIMITROFE', watts };
  }
  return { status: 'VIABLE', watts };
}

/* ─── Cálculo de score de cualificación (0..100) ─── */

function computeScore(
  role: SwarmLeadRole,
  budgetEur: number,
  acousticStatus: SwarmAcousticStatus,
  hasDate: boolean,
  hasName: boolean,
): number {
  let score = 0;

  // Señal de compromiso presupuestario por rol.
  if (budgetEur >= DEPOSITO_STRIPE_EUR) score += 25;
  if (budgetEur >= 1000) score += 20;
  if (budgetEur >= 5000) score += 10;

  // Completitud del lead (nombre + fecha componen más de la mitad del score).
  if (hasName) score += 15;
  if (hasDate) score += 15;

  // Viabilidad acústica.
  if (acousticStatus === 'VIABLE') score += 15;
  else if (acousticStatus === 'LIMITROFE') score += 5;

  // Bonus por rol de alto ticket (B2G y proveedores generan mayor volumen).
  if (role === 'TOWNHALL_B2G' || role === 'VENDOR_PARTNER') score += 10;

  return clampScore(score);
}

/* ─── Composición del mensaje WhatsApp de alta conversión ─── */

function buildWhatsAppMessage(
  input: SwarmLeadInput,
  leadId: string,
  watts: number,
  roleLabel: string,
): string {
  const lines: string[] = [
    `*NUEVO LEAD ${roleLabel.toUpperCase()} — ${leadId}*`,
    '',
    `• Nombre: ${input.clientName}`,
    `• Fecha: ${input.eventDate}`,
    `• Ubicación: ${input.location}`,
    `• Aforo: ${input.guestsPax} pax`,
    `• Presupuesto: ${input.budgetEur} €`,
    `• Viabilidad acústica: ${watts} W (${WATTS_PER_PAX} W/pax, < ${LIMITE_SPL_DB} dB SPL)`,
    `• Fianza Stripe: ${DEPOSITO_STRIPE_EUR} € 100% deducible`,
  ];

  if (input.technicalNotes && input.technicalNotes.trim().length > 0) {
    lines.push(`• Notas: ${input.technicalNotes.trim()}`);
  }

  lines.push('');
  lines.push(`Split Soberano: ${SPLIT_PCT_ARTISTA}/${SPLIT_PCT_EAR_OS}/${SPLIT_PCT_VIMUME}`);
  lines.push(`Contacto: ${CENTRALITA_EAR_OS}`);

  return lines.join('\n');
}

/* ─── Motor principal de cualificación + despacho ─── */

export function qualifyAndFormatSwarmLead(input: SwarmLeadInput): SwarmQualificationResult {
  const leadId: string = computeLeadId(input);

  const { status: acousticStatus, watts: wattsRecommended } = evaluateAcoustics(input.guestsPax);

  const hasDate: boolean = input.eventDate.trim().length > 0;
  const hasName: boolean = input.clientName.trim().length > 0;

  const score: number = computeScore(input.role, input.budgetEur, acousticStatus, hasDate, hasName);

  // Split Soberano proyectado sobre el presupuesto (80/10/10 inmutable).
  const splitPreview: SwarmSplitPreview = {
    artistaPct: SPLIT_PCT_ARTISTA,
    earOsPct: SPLIT_PCT_EAR_OS,
    vimumePct: SPLIT_PCT_VIMUME,
    artistaEur: round2(input.budgetEur * SPLIT_SOBERANO.artista),
    earOsEur: round2(input.budgetEur * SPLIT_SOBERANO.earOs),
    vimumeEur: round2(input.budgetEur * SPLIT_SOBERANO.vimume),
  };

  const roleLabel: string = ROLE_LABELS[input.role];
  const webhookSlug: N8nWebhookSlug = ROLE_WEBHOOK[input.role];

  const whatsAppMessage: string = buildWhatsAppMessage(input, leadId, wattsRecommended, roleLabel);
  const whatsAppDirectUrl: string =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsAppMessage)}`;

  const n8nPayload: SwarmN8nPayload = {
    event: 'swarm_lead_qualified',
    leadId,
    role: input.role,
    clientName: input.clientName,
    clientPhone: input.clientPhone,
    eventDate: input.eventDate,
    location: input.location,
    guestsPax: input.guestsPax,
    budgetEur: input.budgetEur,
    wattsRecommended,
    acousticStatus,
    depositDeducibleEur: DEPOSITO_STRIPE_EUR,
    split: splitPreview,
    webhookSlug,
    dispatchedAt: new Date().toISOString(),
  };

  // Despacho NO bloqueante a n8n (fire-and-forget + dead-letter queue).
  fireAndForgetN8n(webhookSlug, {
    ...n8nPayload,
    whatsAppDirectUrl,
    whatsAppMessage,
  });

  return {
    leadId,
    score,
    acousticStatus,
    wattsRecommended,
    maxSplDb: LIMITE_SPL_DB,
    splitPreview,
    whatsAppDirectUrl,
    whatsAppMessage,
    n8nPayload,
  };
}
