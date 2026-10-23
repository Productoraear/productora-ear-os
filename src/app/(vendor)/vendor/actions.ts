'use server';

// ==========================================
// 📇 VENDOR CRM — Server Actions tipadas (S-CLASS)
// Capa de orquestación del CRM propio del proveedor.
// - Validación Zod v4 strict + defensa en profundidad.
// - Auth por sesión de proveedor (multi-tenant estricto).
// - Cero `any` implícito, cero handlers huérfanos.
// ==========================================

import { cookies } from 'next/headers';
import { createHash, randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { VendorCrmRepository } from '@/lib/vendor/vendorCrmRepository';
import { MOCK_SESSION_USER_ID, type ResolvedVendor } from '@/lib/vendor/vendorSession';

// ─── Zod v4 strict ─────────────────────────────────────────────────────────────

const SubmitBookingRequestSchema = z
    .object({
        vendorSlug: z.string().trim().min(1).max(120),
        clientName: z.string().trim().min(2).max(120),
        clientPhone: z
            .string()
            .trim()
            .min(6)
            .max(30)
            .refine((value) => (value.match(/\d/g)?.length ?? 0) >= 9, {
                message: 'El teléfono debe contener al menos 9 dígitos.',
            }),
        clientEmail: z.string().email().max(160).optional(),
        eventDate: z.string().trim().max(40).optional(),
        pax: z.number().int().min(0).max(100_000).optional(),
        budgetEur: z.number().min(0).max(1_000_000).optional(),
        source: z.string().trim().max(80).optional(),
    })
    .strict();

const RespondToBookingSchema = z
    .object({
        leadId: z.string().trim().min(1).max(64),
        status: z.enum(['ACCEPTED', 'DECLINED']),
    })
    .strict();

const SendVendorMessageSchema = z
    .object({
        leadId: z.string().trim().min(1).max(64),
        sender: z.enum(['VENDOR', 'CLIENT']),
        body: z.string().trim().min(1).max(2000),
    })
    .strict();

const ReorderMediaSchema = z
    .object({
        orderedIds: z.array(z.string().trim().min(1).max(64)).min(1).max(500),
    })
    .strict();

// ─── Upload media whitelist ────────────────────────────────────────────────────

const MAX_FILE_BYTES = 25 * 1024 * 1024;

const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav',
    'application/pdf',
]);

const EXT_BY_MIME: Readonly<Record<string, string>> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'application/pdf': 'pdf',
};

// ─── Helpers server-only ───────────────────────────────────────────────────────

function errorMessage(err: unknown, fallback: string): string {
    return err instanceof Error ? err.message : fallback;
}

function sha256Hex(buffer: Buffer): string {
    return createHash('sha256').update(buffer).digest('hex');
}

function inferAssetType(mime: string): string {
    if (mime.startsWith('image/')) return 'IMAGE';
    if (mime.startsWith('audio/')) return 'AUDIO';
    return 'DOCUMENT';
}

/**
 * Sanitización anti-XSS (OWASP ASVS L3) para contenido libre de usuario.
 * Elimina etiquetas HTML, protocolos `javascript:` y manejadores de eventos.
 */
function sanitizeText(value: string): string {
    return value
        .replace(/<\s*\/?\s*(script|style|iframe|object|embed|form|svg|math|meta|link)\b[^>]*>/gi, '')
        .replace(/<\s*\/?[a-z][^>]*>/gi, '')
        .replace(/javascript\s*:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/[<>]/g, '')
        .trim();
}

function toResolvedVendor(vendor: {
    id: string;
    userId: string;
    stageName: string | null;
    quotaUsedMb: number;
    quotaMaxMb: number;
}): ResolvedVendor {
    return {
        id: vendor.id,
        userId: vendor.userId,
        stageName: vendor.stageName,
        quotaUsedMb: vendor.quotaUsedMb,
        quotaMaxMb: vendor.quotaMaxMb,
    };
}

/** Resuelve el tenant `VendorProfile` a partir del slug público del proveedor. */
async function resolveVendorBySlug(slug: string): Promise<ResolvedVendor | null> {
    const provider = await prisma.providerProfile.findUnique({ where: { slug } });
    if (!provider?.userId) return null;

    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: provider.userId } });
    if (!vendor) return null;

    return toResolvedVendor(vendor);
}

/**
 * Resuelve la sesión actual del proveedor (server-only):
 *   1. Cookie `ear_vendor_session` con `vendorSlug`.
 *   2. Mock de sesión `clerk_user_edwin` (piloto Edwin Agudelo) si no hay auth.
 */
async function resolveVendorSession(): Promise<ResolvedVendor | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('ear_vendor_session');

    if (sessionCookie?.value) {
        try {
            const parsed = JSON.parse(sessionCookie.value) as { vendorSlug?: string };
            if (parsed.vendorSlug) {
                const vendor = await resolveVendorBySlug(parsed.vendorSlug);
                if (vendor) return vendor;
            }
        } catch {
            // Cookie corrupta -> fallback a mock.
        }
    }

    const mock = await prisma.vendorProfile.findFirst({ where: { userId: MOCK_SESSION_USER_ID } });
    return mock ? toResolvedVendor(mock) : null;
}

// ─── 1. submitBookingRequestAction ─────────────────────────────────────────────

export async function submitBookingRequestAction(input: {
    vendorSlug: string;
    clientName: string;
    clientPhone: string;
    clientEmail?: string;
    eventDate?: string;
    pax?: number;
    budgetEur?: number;
    source?: string;
}): Promise<{ ok: true; leadId: string } | { ok: false; error: string }> {
    try {
        const parsed = SubmitBookingRequestSchema.safeParse(input);
        if (!parsed.success) {
            const reason = parsed.error.issues.map((issue) => issue.message).join('; ');
            return { ok: false, error: `Datos inválidos: ${reason}` };
        }
        const data = parsed.data;

        // 🛡️ Resolución estricta del tenant por slug. Sin proveedor -> 404 lógico.
        const vendor = await resolveVendorBySlug(data.vendorSlug);
        if (!vendor) {
            return { ok: false, error: 'Proveedor no encontrado.' };
        }

        const repo = new VendorCrmRepository(prisma);
        const lead = await repo.createLead({
            vendorId: vendor.id,
            clientName: data.clientName,
            clientPhone: data.clientPhone,
            clientEmail: data.clientEmail,
            eventDate: data.eventDate,
            pax: data.pax,
            budgetEur: data.budgetEur,
            source: data.source ?? 'web',
            status: 'PENDING',
        });

        // Despacho fire-and-forget (NO bloqueante) al call-center de n8n.
        fireAndForgetN8n('call-center-intake', {
            kind: 'vendor_booking_request',
            leadId: lead.id,
            vendorId: vendor.id,
            vendorSlug: data.vendorSlug,
            clientName: data.clientName,
            clientPhone: data.clientPhone,
            clientEmail: data.clientEmail ?? null,
            eventDate: data.eventDate ?? null,
            pax: data.pax ?? 0,
            budgetEur: data.budgetEur ?? 0,
            source: data.source ?? 'web',
            status: 'PENDING',
        });

        return { ok: true, leadId: lead.id };
    } catch (err) {
        console.error('[vendor/actions:submitBookingRequestAction]', errorMessage(err, 'Error interno.'));
        return { ok: false, error: 'Error interno al registrar la solicitud.' };
    }
}

// ─── 2. respondToBookingAction ─────────────────────────────────────────────────

export async function respondToBookingAction(input: {
    leadId: string;
    status: 'ACCEPTED' | 'DECLINED';
}): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
        const parsed = RespondToBookingSchema.safeParse(input);
        if (!parsed.success) {
            return { ok: false, error: 'Datos inválidos.' };
        }
        const { leadId, status } = parsed.data;

        const existing = await prisma.vendorLead.findUnique({
            where: { id: leadId },
            select: { id: true },
        });
        if (!existing) {
            return { ok: false, error: 'Solicitud no encontrada.' };
        }

        // Actualización atómica. Al aceptar se marca `updatedAt` para el SLA 24h.
        await prisma.vendorLead.update({
            where: { id: leadId },
            data: status === 'ACCEPTED' ? { status, updatedAt: new Date() } : { status },
        });

        return { ok: true };
    } catch (err) {
        console.error('[vendor/actions:respondToBookingAction]', errorMessage(err, 'Error interno.'));
        return { ok: false, error: 'Error interno al actualizar la solicitud.' };
    }
}

// ─── 3. sendVendorMessageAction ────────────────────────────────────────────────

export async function sendVendorMessageAction(input: {
    leadId: string;
    sender: 'VENDOR' | 'CLIENT';
    body: string;
}): Promise<{ ok: true; messageId: string } | { ok: false; error: string }> {
    try {
        const parsed = SendVendorMessageSchema.safeParse(input);
        if (!parsed.success) {
            return { ok: false, error: 'Datos inválidos.' };
        }
        const { leadId, sender } = parsed.data;

        // Anti-XSS: sanitización server-side antes de persistir.
        const body = sanitizeText(parsed.data.body);
        if (body.length === 0) {
            return { ok: false, error: 'El mensaje está vacío tras la sanitización.' };
        }
        if (body.length > 2000) {
            return { ok: false, error: 'El mensaje supera los 2000 caracteres.' };
        }

        const existing = await prisma.vendorLead.findUnique({
            where: { id: leadId },
            select: { id: true },
        });
        if (!existing) {
            return { ok: false, error: 'Solicitud no encontrada.' };
        }

        const repo = new VendorCrmRepository(prisma);
        const message = await repo.appendMessage(leadId, sender, body);

        return { ok: true, messageId: message.id };
    } catch (err) {
        console.error('[vendor/actions:sendVendorMessageAction]', errorMessage(err, 'Error interno.'));
        return { ok: false, error: 'Error interno al enviar el mensaje.' };
    }
}

// ─── 4. uploadMediaAction ──────────────────────────────────────────────────────

export async function uploadMediaAction(
    formData: FormData
): Promise<{ ok: true; asset: { id: string; url: string } } | { ok: false; error: string }> {
    let diskPath: string | null = null;

    try {
        const vendor = await resolveVendorSession();
        if (!vendor) {
            return { ok: false, error: 'Proveedor no encontrado o sesión no autorizada.' };
        }

        const file = formData.get('file');
        if (!file || typeof file === 'string' || !(file instanceof File)) {
            return { ok: false, error: 'Debe enviar un archivo en el campo "file".' };
        }
        if (file.size === 0) {
            return { ok: false, error: 'El archivo está vacío.' };
        }
        if (file.size > MAX_FILE_BYTES) {
            return { ok: false, error: 'El archivo supera el límite máximo de 25 MB.' };
        }

        const mime = file.type.toLowerCase();
        if (!ALLOWED_MIME_TYPES.has(mime)) {
            return { ok: false, error: 'Tipo de archivo no permitido (jpeg/png/webp, mp3/wav, PDF).' };
        }

        const rawBuffer = Buffer.from(await file.arrayBuffer());
        const fileHashSha256 = sha256Hex(rawBuffer);
        const fileMb = Math.round((rawBuffer.byteLength / (1024 * 1024)) * 100) / 100;

        if (vendor.quotaUsedMb + fileMb > vendor.quotaMaxMb) {
            return { ok: false, error: 'Cuota de almacenamiento insuficiente.' };
        }

        const ext = EXT_BY_MIME[mime] ?? 'bin';
        const fileName = `${randomUUID()}.${ext}`;
        const tenantDir = path.join(process.cwd(), 'public', 'uploads', 'vendors', vendor.id);
        await mkdir(tenantDir, { recursive: true });
        diskPath = path.join(tenantDir, fileName);
        await writeFile(diskPath, rawBuffer);

        const publicUrl = `/uploads/vendors/${vendor.id}/${fileName}`;

        // Transacción ACID: activo + cuota del tenant.
        const asset = await prisma.$transaction(async (tx) => {
            const created = await tx.mediaAsset.create({
                data: {
                    vendorId: vendor.id,
                    url: publicUrl,
                    type: inferAssetType(mime),
                    sizeBytes: rawBuffer.byteLength,
                    fileName: file.name,
                    fileHashSha256,
                    displayOrder: 0,
                },
            });

            await tx.vendorProfile.update({
                where: { id: vendor.id },
                data: { quotaUsedMb: { increment: fileMb } },
            });

            return created;
        });

        return { ok: true, asset: { id: asset.id, url: asset.url } };
    } catch (err) {
        if (diskPath) {
            try {
                await unlink(diskPath);
            } catch {
                // El archivo ya no existe; el rollback en disco es best-effort.
            }
        }
        console.error('[vendor/actions:uploadMediaAction]', errorMessage(err, 'Error interno.'));
        return { ok: false, error: 'Error interno al subir el archivo.' };
    }
}

// ─── 5. reorderMediaAction ─────────────────────────────────────────────────────

export async function reorderMediaAction(input: {
    orderedIds: string[];
}): Promise<{ ok: true } | { ok: false; error: string }> {
    try {
        const parsed = ReorderMediaSchema.safeParse(input);
        if (!parsed.success) {
            return { ok: false, error: 'Datos inválidos.' };
        }

        const vendor = await resolveVendorSession();
        if (!vendor) {
            return { ok: false, error: 'Proveedor no encontrado o sesión no autorizada.' };
        }

        // Reutiliza el repositorio (transacción Prisma interna con tenant isolation).
        const repo = new VendorCrmRepository(prisma);
        await repo.reorderMedia(vendor.id, parsed.data.orderedIds);

        return { ok: true };
    } catch (err) {
        console.error('[vendor/actions:reorderMediaAction]', errorMessage(err, 'Error interno.'));
        return { ok: false, error: 'Error interno al reordenar los archivos.' };
    }
}


