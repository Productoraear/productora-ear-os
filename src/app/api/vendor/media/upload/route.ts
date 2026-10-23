import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

import { prisma } from '@/lib/prisma';
import { resolveCurrentVendor } from '@/lib/vendor/vendorSession';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/** Límite duro por archivo (25 MB). */
const MAX_FILE_BYTES = 25 * 1024 * 1024;

const ALLOWED_MIME_TYPES: ReadonlySet<string> = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'audio/mpeg',
    'audio/wav',
    'audio/x-wav',
    'audio/mp4',
    'audio/ogg',
    'audio/aac',
    'application/pdf',
]);

const EXT_BY_MIME: Readonly<Record<string, string>> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/x-wav': 'wav',
    'audio/mp4': 'm4a',
    'audio/ogg': 'ogg',
    'audio/aac': 'aac',
    'application/pdf': 'pdf',
};

function inferAssetType(mime: string): string {
    if (mime.startsWith('image/')) return 'IMAGE';
    if (mime.startsWith('audio/')) return 'AUDIO';
    return 'DOCUMENT';
}

function sha256Hex(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
}

function bytesToMb(bytes: number): number {
    return Math.round((bytes / (1024 * 1024)) * 100) / 100;
}

function round2(n: number): number {
    return Math.round(n * 100) / 100;
}

function internalError(scope: string, err: unknown): NextResponse {
    const message = err instanceof Error ? err.message : 'Error interno';
    console.error(`${scope} ERROR:`, message);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
}

// ─── POST ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const vendor = await resolveCurrentVendor(req);
        if (!vendor) {
            return NextResponse.json(
                { error: 'Proveedor no encontrado o sesión no autorizada.' },
                { status: 404 },
            );
        }

        const formData = await req.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string' || !(file instanceof File)) {
            return NextResponse.json(
                { error: 'Debe enviar un archivo en el campo "file" (multipart/form-data).' },
                { status: 400 },
            );
        }

        if (file.size === 0) {
            return NextResponse.json({ error: 'El archivo está vacío.' }, { status: 400 });
        }

        if (file.size > MAX_FILE_BYTES) {
            return NextResponse.json(
                { error: 'El archivo supera el límite máximo de 25 MB.' },
                { status: 413 },
            );
        }

        const mime = file.type.toLowerCase();
        if (!ALLOWED_MIME_TYPES.has(mime)) {
            return NextResponse.json(
                { error: 'Tipo de archivo no permitido (solo imágenes, audio demo o PDF).' },
                { status: 415 },
            );
        }

        const rawBuffer = Buffer.from(await file.arrayBuffer());
        const fileHashSha256 = sha256Hex(rawBuffer);
        const fileMb = bytesToMb(rawBuffer.byteLength);

        // Validación de espacio restante (cuota).
        if (vendor.quotaUsedMb + fileMb > vendor.quotaMaxMb) {
            return NextResponse.json(
                {
                    error: 'Cuota de almacenamiento insuficiente.',
                    quota: {
                        quotaUsedMb: vendor.quotaUsedMb,
                        quotaMaxMb: vendor.quotaMaxMb,
                        neededMb: fileMb,
                    },
                },
                { status: 413 },
            );
        }

        const ext = EXT_BY_MIME[mime] ?? 'bin';
        const fileUuid = crypto.randomUUID();
        const fileName = `${fileUuid}.${ext}`;
        const tenantDir = path.join(process.cwd(), 'public', 'uploads', 'vendors', vendor.id);
        await fs.mkdir(tenantDir, { recursive: true });
        const diskPath = path.join(tenantDir, fileName);
        await fs.writeFile(diskPath, rawBuffer);

        const publicUrl = `/uploads/vendors/${vendor.id}/${fileName}`;

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

        return NextResponse.json(
            {
                success: true,
                asset: {
                    id: asset.id,
                    url: asset.url,
                    type: asset.type,
                    sizeBytes: asset.sizeBytes,
                    fileName: asset.fileName,
                    fileHashSha256: asset.fileHashSha256,
                    createdAt: asset.createdAt,
                },
                quota: {
                    quotaUsedMb: round2(vendor.quotaUsedMb + fileMb),
                    quotaMaxMb: vendor.quotaMaxMb,
                },
            },
            { status: 201 },
        );
    } catch (err) {
        return internalError('[vendor/media/upload:POST]', err);
    }
}

// ─── DELETE ────────────────────────────────────────────────────────────────────

export async function DELETE(req: NextRequest): Promise<NextResponse> {
    try {
        const vendor = await resolveCurrentVendor(req);
        if (!vendor) {
            return NextResponse.json(
                { error: 'Proveedor no encontrado o sesión no autorizada.' },
                { status: 404 },
            );
        }

        const assetId = new URL(req.url).searchParams.get('id')?.trim();
        if (!assetId) {
            return NextResponse.json(
                { error: 'Debe indicar el parámetro "id" del activo a eliminar.' },
                { status: 400 },
            );
        }

        // 🛡️ Tenant boundary estricto: solo activos del vendor actual.
        const asset = await prisma.mediaAsset.findFirst({
            where: { id: assetId, vendorId: vendor.id },
        });

        if (!asset) {
            return NextResponse.json(
                { error: 'Activo no encontrado o no autorizado.' },
                { status: 404 },
            );
        }

        const releasedMb = bytesToMb(asset.sizeBytes);

        await prisma.$transaction(async (tx) => {
            await tx.mediaAsset.delete({ where: { id: asset.id } });

            const current = await tx.vendorProfile.findUnique({
                where: { id: vendor.id },
                select: { quotaUsedMb: true },
            });
            const nextQuota = Math.max(0, round2((current?.quotaUsedMb ?? 0) - releasedMb));

            await tx.vendorProfile.update({
                where: { id: vendor.id },
                data: { quotaUsedMb: nextQuota },
            });
        });

        // Eliminación física en disco (no bloqueante si ya no existe).
        const relativePath = asset.url.replace(/^\//, '');
        const diskPath = path.join(process.cwd(), 'public', relativePath);
        try {
            await fs.unlink(diskPath);
        } catch {
            console.warn(`[vendor/media/upload:DELETE] Archivo no encontrado en disco: ${diskPath}`);
        }

        return NextResponse.json({ success: true, releasedMb: round2(releasedMb) });
    } catch (err) {
        return internalError('[vendor/media/upload:DELETE]', err);
    }
}


