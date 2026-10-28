import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import {
    decideIntakeAck,
    classifyFailure,
    type FailureCode,
} from '@/lib/outreach/intake-diagnostics';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * OUTREACH Ω — puerta de entrada del puente Harvey → EAR OS.
 *
 * Fuente única: `D:\HARVEY_HQ\tools\ear_os_bridge.py`, que lee la SQLite de
 * Harvey en solo lectura. Harvey no expone API ni webhooks salientes, así que
 * este endpoint ES la integración: sin él, ninguna respuesta ni cita llega al
 * CRM.
 *
 * Reglas:
 *  · Idempotencia real: `externalId` es el id de Harvey. El mismo payload N
 *    veces produce exactamente 1 fila por prospect y 1 por mensaje.
 *  · Dirección única: el estado solo avanza (NEW → CONTACTED → REPLIED →
 *    MEETING → WON). OPTED_OUT gana siempre y nunca se revierte.
 *  · Auth por `CRON_SECRET` de extremo a extremo; sin secreto en producción el
 *    endpoint falla cerrado (503) en vez de escribir a ciegas.
 */

const OutreachStatusSchema = z.enum([
    'NEW',
    'CONTACTED',
    'REPLIED',
    'MEETING',
    'WON',
    'LOST',
    'OPTED_OUT',
]);

type OutreachStatus = z.infer<typeof OutreachStatusSchema>;

const ClassificationSchema = z.enum([
    'interested',
    'objection',
    'not_interested',
    'opt_out',
    'other',
]);

const ThreadSchema = z
    .object({
        externalId: z.string().trim().min(1).max(200),
        direction: z.enum(['INBOUND', 'OUTBOUND']),
        subject: z.string().trim().max(200).nullish(),
        body: z.string().trim().min(1).max(20_000),
        classification: ClassificationSchema.nullish(),
        sentAt: z.string().datetime().nullish(),
    })
    .strict();

const ProspectSchema = z
    .object({
        externalId: z.string().trim().min(1).max(120),
        companyName: z.string().trim().min(1).max(240),
        domain: z.string().trim().max(200).nullish(),
        contactName: z.string().trim().max(160).nullish(),
        contactRole: z.string().trim().max(160).nullish(),
        email: z.string().trim().email().max(200),
        city: z.string().trim().max(120).nullish(),
        country: z.string().trim().length(2).default('ES'),
        source: z.string().trim().max(80).default('harvey'),
        campaign: z.string().trim().max(120).nullish(),
        status: OutreachStatusSchema.default('NEW'),
        score: z.number().int().min(0).max(100).default(0),
        lastReplyAt: z.string().datetime().nullish(),
        meetingAt: z.string().datetime().nullish(),
        rawSnapshot: z
            .record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))
            .nullish(),
        threads: z.array(ThreadSchema).max(200).default([]),
    })
    .strict();

const IntakeSchema = z
    .object({ prospects: z.array(ProspectSchema).min(1).max(50) })
    .strict();

type ProspectPayload = z.infer<typeof ProspectSchema>;
type ThreadPayload = z.infer<typeof ThreadSchema>;

// ─── Auth ─────────────────────────────────────────────────────────────────────

function authorize(req: NextRequest): NextResponse | null {
    const secret = process.env.CRON_SECRET;
    if (!secret) {
        if (process.env.NODE_ENV === 'production') {
            console.error('[outreach/intake] CRON_SECRET no configurado: fallo cerrado.');
            return NextResponse.json(
                { error: 'CRON_SECRET no configurado en el servidor.' },
                { status: 503 },
            );
        }
        return null;
    }
    if (req.headers.get('authorization') !== `Bearer ${secret}`) {
        return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
    }
    return null;
}

// ─── Estado monotónico ────────────────────────────────────────────────────────

const PROGRESS_RANK: Record<OutreachStatus, number> = {
    NEW: 0,
    CONTACTED: 1,
    REPLIED: 2,
    MEETING: 3,
    WON: 4,
    LOST: 0,
    OPTED_OUT: 0,
};

/** Un estado terminal no retrocede; una baja gana a cualquier avance. */
function nextStatus(current: OutreachStatus, incoming: OutreachStatus): OutreachStatus {
    if (current === 'OPTED_OUT' || current === 'WON') return current;
    if (incoming === 'OPTED_OUT') return 'OPTED_OUT';
    if (incoming === 'LOST') return current === 'NEW' ? 'LOST' : current;
    if (current === 'LOST' && incoming === 'NEW') return current;
    return PROGRESS_RANK[incoming] > PROGRESS_RANK[current] ? incoming : current;
}

function toDate(value: string | null | undefined): Date | null {
    return value ? new Date(value) : null;
}

// ─── Escritura idempotente ────────────────────────────────────────────────────

interface UpsertOutcome {
    prospectId: string;
    created: boolean;
    previousStatus: OutreachStatus;
}

async function upsertProspect(item: ProspectPayload): Promise<UpsertOutcome> {
    const byExternal = await prisma.outreachProspect.findUnique({
        where: { externalId: item.externalId },
    });
    // Un mismo email puede llegar con otro id de Harvey (re-descubrimiento):
    // la fila existente se adopta en vez de romper la restricción única.
    const existing =
        byExternal ??
        (await prisma.outreachProspect.findUnique({ where: { email: item.email } }));

    const base = {
        externalId: item.externalId,
        companyName: item.companyName,
        domain: item.domain ?? null,
        contactName: item.contactName ?? null,
        contactRole: item.contactRole ?? null,
        email: item.email,
        city: item.city ?? null,
        country: item.country.toUpperCase(),
        source: item.source,
        campaign: item.campaign ?? null,
        score: item.score,
        lastReplyAt: toDate(item.lastReplyAt),
        meetingAt: toDate(item.meetingAt),
        rawSnapshot: item.rawSnapshot ?? undefined,
    };

    if (existing) {
        const updated = await prisma.outreachProspect.update({
            where: { id: existing.id },
            data: { ...base, status: nextStatus(existing.status, item.status) },
        });
        return {
            prospectId: updated.id,
            created: false,
            previousStatus: existing.status,
        };
    }

    const created = await prisma.outreachProspect.create({
        data: { ...base, status: item.status },
    });
    return { prospectId: created.id, created: true, previousStatus: 'NEW' };
}

async function upsertThreads(
    prospectId: string,
    threads: ThreadPayload[],
): Promise<{ created: number; updated: number }> {
    let created = 0;
    let updated = 0;
    for (const thread of threads) {
        const data = {
            prospectId,
            direction: thread.direction,
            subject: thread.subject ?? null,
            body: thread.body,
            classification: thread.classification ?? null,
            sentAt: toDate(thread.sentAt),
        };
        const existing = await prisma.outreachThread.findUnique({
            where: { externalId: thread.externalId },
            select: { id: true },
        });
        if (existing) {
            await prisma.outreachThread.update({
                where: { externalId: thread.externalId },
                data,
            });
            updated += 1;
        } else {
            await prisma.outreachThread.create({
                data: { ...data, externalId: thread.externalId },
            });
            created += 1;
        }
    }
    return { created, updated };
}

// ─── POST: ingesta del puente ─────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    const denied = authorize(req);
    if (denied) return denied;

    let raw: unknown;
    try {
        raw = await req.json();
    } catch {
        return NextResponse.json(
            { error: 'JSON inválido en el cuerpo de la solicitud.' },
            { status: 422 },
        );
    }

    const parsed = IntakeSchema.safeParse(raw);
    if (!parsed.success) {
        return NextResponse.json(
            {
                error: 'Validación fallida.',
                issues: parsed.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            },
            { status: 400 },
        );
    }

    const summary = {
        received: parsed.data.prospects.length,
        created: 0,
        updated: 0,
        threadsCreated: 0,
        threadsUpdated: 0,
        optedOut: 0,
        skipped: [] as Array<{ externalId: string; code: FailureCode; reason: string }>,
    };

    for (const item of parsed.data.prospects) {
        try {
            const { prospectId, created, previousStatus } = await upsertProspect(item);

            if (created) summary.created += 1;
            else summary.updated += 1;

            const threads = await upsertThreads(prospectId, item.threads);
            summary.threadsCreated += threads.created;
            summary.threadsUpdated += threads.updated;

            if (item.status === 'OPTED_OUT' && previousStatus !== 'OPTED_OUT') {
                summary.optedOut += 1;
            }

            const meetingIsNew = item.status === 'MEETING' && previousStatus !== 'MEETING';
            const replyIsNew =
                item.status === 'REPLIED' &&
                previousStatus !== 'REPLIED' &&
                previousStatus !== 'MEETING' &&
                previousStatus !== 'WON';

            // Solo se avisa a n8n de lo que exige acción humana: cita o
            // primera respuesta. Un re-sync del mismo dato no genera ruido.
            if (meetingIsNew || replyIsNew) {
                fireAndForgetN8n('call-center-intake', {
                    kind: meetingIsNew ? 'outreach_meeting' : 'outreach_reply',
                    channel: 'harvey_email',
                    leadId: prospectId,
                    harveyId: item.externalId,
                    clientName: item.companyName,
                    clientEmail: item.email,
                    clientPhone: '',
                    campaign: item.campaign ?? null,
                    source: item.source,
                    status: item.status,
                    meetingAt: item.meetingAt ?? null,
                });
            }
        } catch (err) {
            const diagnosis = classifyFailure(err);
            summary.skipped.push({
                externalId: item.externalId,
                code: diagnosis.code,
                reason: diagnosis.reason,
            });
        }
    }

    // ── Contrato de acuse ────────────────────────────────────────────────────
    // Un `skipped` silencioso con HTTP 200 es un acuse de recibo falso: Harvey
    // marcaría el lead como sincronizado y no lo reintentaría NUNCA. El 2xx se
    // reserva a lo que quedó persistido de verdad. El reintento es seguro porque
    // la escritura es idempotente por `externalId`/`email`.
    const ack = decideIntakeAck({
        received: summary.received,
        created: summary.created,
        updated: summary.updated,
        skipped: summary.skipped.map((row) => row.code),
    });

    const infraDiagnosis = summary.skipped.find((row) => row.code === ack.code);

    if (ack.status === 503) {
        console.error(
            `[outreach/intake] acuse rechazado (${ack.code ?? 'ALL_SKIPPED'}): 0/${summary.received} persistidos.`,
        );
    } else if (ack.status === 207) {
        console.warn(
            `[outreach/intake] acuse parcial: ${ack.persisted}/${summary.received} persistidos, ${summary.skipped.length} para reintentar.`,
        );
    }

    return NextResponse.json(
        {
            ok: ack.ok,
            persisted: ack.persisted,
            retryable: ack.retryable,
            ...(ack.code ? { code: ack.code } : {}),
            ...(ack.status === 503
                ? {
                      error:
                          infraDiagnosis?.reason ??
                          'Ningún prospecto se pudo persistir: reintentar y revisar el payload.',
                  }
                : {}),
            ...summary,
        },
        { status: ack.status },
    );
}

// ─── GET: salud del canal (misma auth) ────────────────────────────────────────

export async function GET(req: NextRequest): Promise<NextResponse> {
    const denied = authorize(req);
    if (denied) return denied;

    try {
        const grouped = await prisma.outreachProspect.groupBy({
            by: ['status'],
            _count: { _all: true },
        });
        const total = grouped.reduce((sum, row) => sum + row._count._all, 0);
        const latest = await prisma.outreachProspect.findFirst({
            orderBy: { updatedAt: 'desc' },
            select: { updatedAt: true },
        });

        return NextResponse.json({
            ok: true,
            total,
            byStatus: grouped.map((row) => ({
                status: row.status,
                count: row._count._all,
            })),
            lastSyncAt: latest?.updatedAt ?? null,
        });
    } catch (err) {
        const diagnosis = classifyFailure(err);
        console.error(`[outreach/intake:GET] ${diagnosis.code}: ${diagnosis.reason}`);
        return NextResponse.json(
            { ok: false, code: diagnosis.code, error: diagnosis.reason },
            { status: diagnosis.code === 'SCHEMA_MISSING' ? 503 : 500 },
        );
    }
}


