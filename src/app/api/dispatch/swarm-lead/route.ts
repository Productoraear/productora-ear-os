/**
 * ════════════════════════════════════════════════════════════════════════════
 * API /api/dispatch/swarm-lead — Endpoint del Swarm AI Lead Dispatcher
 * ════════════════════════════════════════════════════════════════════════════
 * Recibe un lead enriquecido (POST), lo valida con Zod, sanitiza las cadenas
 * contra XSS (OWASP), delega la cualificación al motor `swarmLeadDispatcher` y
 * responde 202 Accepted con el resultado estructurado. El despacho a n8n se
 * produce en background (no bloqueante) con dead-letter queue.
 *
 * ASVS L3: toda cadena entrante se escapa antes de persistirse en meta-datos
 * de salida. No se devuelve HTML; el HTML se reconstruye escapando `< > & " '`.
 * ════════════════════════════════════════════════════════════════════════════
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  qualifyAndFormatSwarmLead,
  type SwarmLeadInput,
  type SwarmLeadRole,
} from '@/lib/dispatch/swarmLeadDispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ─── Validación de entrada (Zod) ─── */

const SWARM_ROLE_INPUT: readonly [SwarmLeadRole, ...SwarmLeadRole[]] = [
  'COUPLE_WEDDING',
  'TOWNHALL_B2G',
  'SOVEREIGN_ARTIST',
  'VENDOR_PARTNER',
];

const SwarmLeadSchema = z.object({
  role: z.enum(SWARM_ROLE_INPUT),
  clientName: z.string().trim().min(2).max(120),
  clientPhone: z
    .string()
    .trim()
    .min(7)
    .max(24)
    .regex(/^\+?[0-9\s()-]{7,24}$/, 'Teléfono inválido'),
  eventDate: z.string().trim().min(1).max(64),
  location: z.string().trim().min(2).max(160),
  guestsPax: z.number().int().min(1).max(1000),
  budgetEur: z.number().nonnegative().max(1000000),
  technicalNotes: z.string().trim().max(600).optional(),
});

/* ─── Sanitización anti-XSS (escapado de entidades HTML) ─── */

function sanitizeString(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeLead(raw: z.infer<typeof SwarmLeadSchema>): SwarmLeadInput {
  const technicalNotes: string | undefined =
    raw.technicalNotes ? sanitizeString(raw.technicalNotes) : undefined;

  return {
    role: raw.role,
    clientName: sanitizeString(raw.clientName),
    clientPhone: sanitizeString(raw.clientPhone),
    eventDate: sanitizeString(raw.eventDate),
    location: sanitizeString(raw.location),
    guestsPax: raw.guestsPax,
    budgetEur: raw.budgetEur,
    ...(technicalNotes !== undefined ? { technicalNotes } : {}),
  };
}

/* ─── Handler POST ─── */

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: 'Cuerpo JSON inválido' },
        { status: 400 },
      );
    }

    const parsed = SwarmLeadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validación fallida',
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        },
        { status: 422 },
      );
    }

    const lead: SwarmLeadInput = sanitizeLead(parsed.data);
    const result = qualifyAndFormatSwarmLead(lead);

    return NextResponse.json(
      {
        success: true,
        accepted: true,
        leadId: result.leadId,
        score: result.score,
        acousticStatus: result.acousticStatus,
        wattsRecommended: result.wattsRecommended,
        splitPreview: result.splitPreview,
        whatsAppDirectUrl: result.whatsAppDirectUrl,
        dispatch: {
          webhookSlug: result.n8nPayload.webhookSlug,
          dispatchedAt: result.n8nPayload.dispatchedAt,
        },
      },
      { status: 202 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Error interno del Swarm Dispatcher';
    console.error('[API/dispatch/swarm-lead] ERROR:', message);
    return NextResponse.json(
      { success: false, error: 'Error interno al procesar el lead' },
      { status: 500 },
    );
  }
}
