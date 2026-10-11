import { NextResponse } from 'next/server';
import { createHash, randomBytes } from 'node:crypto';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import type { Prisma, VendorShadowProfile } from '@prisma/client';

/**
 * W21-003 — INGESTOR IDEMPOTENTE BODAS.NET → PostgreSQL 16
 * ---------------------------------------------------------------------------
 * Convierte la fachada JSON muestreada (all_featured.json / particiones edge) en
 * una escritura real contra VendorShadowProfile (tabla de perfiles fantasma con
 * flujo de reclamación soberana). Doctrina del Dato Verificado: TODA fila entra
 * con status GHOST_UNCLAIMED (equivalente a verified:false). Jamás se auto-verifica.
 *
 * POST /api/leads/bodasnet          -> upsert idempotente por shaHash (ACID).
 * GET  /api/leads/bodasnet          -> lectura pública desde DB (ruta de venta).
 *
 * Idempotencia: N retries del MISMO lote producen EXACTAMENTE 1 fila por shaHash
 * (upsert por clave única). claimToken se genera solo en create (jamás en update).
 */

// ---------------------------------------------------------------------------
// Tipos estrictos (cero `any` implícito)
// ---------------------------------------------------------------------------

type PublicProviderDto = {
    id: string;
    name: string;
    category: string;
    province: string;
    municipality: string | null;
    telephone: string | null;
    verified: boolean;
    priceRange: string | null;
    rating: number | null;
    reviewsCount: number;
    description: string | null;
    imageUrls: string[];
};

type IngestErrorDetail = {
    name: string;
    shaHash: string;
    error: string;
};

type IngestResponseBody = {
    ok: boolean;
    processed: number;
    accepted: number;
    rejected: number;
    uniqueHashes: number;
    errors: IngestErrorDetail[];
    ts: string;
};

type ListResponseBody = {
    ok: boolean;
    total: number;
    count: number;
    items: PublicProviderDto[];
    ts: string;
};

// ---------------------------------------------------------------------------
// Constantes
// ---------------------------------------------------------------------------

const CENTRALITA_DIGITS = '693693048';

const SECURITY_HEADERS: Readonly<Record<string, string>> = Object.freeze({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    Pragma: 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'same-origin',
});

// ---------------------------------------------------------------------------
// Esquemas Zod (validación estricta de entrada)
// ---------------------------------------------------------------------------

const BodasNetItemSchema = z
    .object({
        name: z.string().trim().min(3).max(200),
        category: z.string().trim().min(2).max(100),
        province: z.string().trim().max(64).optional().nullable(),
        municipality: z.string().trim().max(64).optional().nullable(),
        telephone: z.string().trim().max(32).optional().nullable(),
        priceRange: z.string().trim().max(64).optional().nullable(),
        rating: z.number().min(0).max(5).optional().nullable(),
        reviewsCount: z.number().int().min(0).optional().nullable(),
        description: z.string().max(5000).optional().nullable(),
        imageUrls: z.array(z.string().max(500)).max(12).optional(),
    })
    .strict();

const IngestPayloadSchema = z.union([
    z.array(BodasNetItemSchema).min(1).max(1000),
    z.object({ items: z.array(BodasNetItemSchema).min(1).max(1000) }).strict(),
    z.object({ batch: z.array(BodasNetItemSchema).min(1).max(1000) }).strict(),
]);

const ListQuerySchema = z
    .object({
        province: z.string().trim().max(64).optional(),
        category: z.string().trim().max(100).optional(),
        limit: z.string().regex(/^\d+$/).optional(),
        offset: z.string().regex(/^\d+$/).optional(),
    })
    .strict();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sha256Hex(input: string): string {
    return createHash('sha256').update(input, 'utf8').digest('hex');
}

/**
 * Clave idempotente determinista: name + category + municipio/provincia.
 * Garantiza que reintentos del mismo lote colisionen en la misma fila.
 */
function buildIdempotencyHash(
    name: string,
    category: string,
    municipality: string | null | undefined,
    province: string | null | undefined
): string {
    const locality = (municipality || province || '').trim().toLowerCase();
    const key = [
        name.trim().toLowerCase(),
        category.trim().toLowerCase(),
        locality,
    ].join('|');
    return sha256Hex(key);
}

function normalizeDigits(input: string): string {
    return input.replace(/[^0-9]/g, '');
}

/**
 * Un teléfono es "real verificable" solo si son 9 dígitos nacionales españoles,
 * no es la centralita SSOT y cumple el rango de numeración (móvil 6/7 o fijo
 * geográfico 91x-98x). Centralita / vacío / inválido => no verificado.
 */
function isRealSpanishPhone(input: string | null | undefined): boolean {
    if (!input) return false;
    const d = normalizeDigits(input);
    if (d.length !== 9) return false;
    if (d === CENTRALITA_DIGITS) return false;
    if (d[0] === '6' || d[0] === '7') return true;
    if (d[0] === '9' && d[1] >= '1' && d[1] <= '8') return true;
    return false;
}

function toErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Error desconocido';
}

function clampInt(raw: string | null, min: number, max: number, fallback: number): number {
    if (raw === null) return fallback;
    const parsed = Number.parseInt(raw, 10);
    if (Number.isNaN(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
}

function jsonResponse<T>(body: T, status = 200): NextResponse<T> {
    return NextResponse.json(body, { status, headers: SECURITY_HEADERS });
}

/**
 * Convierte una fila VendorShadowProfile en DTO público. El telefono SOLO se
 * expone si es real verificable (Doctrina del Dato Verificado: las rutas que
 * venden solo exponen telefonos reales, nunca centralita).
 */
function toPublicDto(row: VendorShadowProfile): PublicProviderDto {
    const realPhone = isRealSpanishPhone(row.telephone);
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        province: row.province,
        municipality: row.municipality,
        telephone: realPhone ? row.telephone : null,
        verified: realPhone,
        priceRange: row.priceRange,
        rating: row.rating ?? null,
        reviewsCount: row.reviewsCount ?? 0,
        description: row.description,
        imageUrls: row.imageUrls,
    };
}

function isAuthorizedIngest(request: Request): boolean {
    const token = process.env.BODASNET_INGEST_TOKEN;
    if (!token) return false; // fail-closed: sin secreto configurado no se ingesta.

    const authHeader = request.headers.get('authorization') ?? '';
    const bearer = authHeader.startsWith('Bearer ')
        ? authHeader.slice('Bearer '.length)
        : '';
    const ingestHeader = request.headers.get('x-ingest-token') ?? '';

    return bearer === token || ingestHeader === token;
}

function ingestItemsFromPayload(
    payload: z.infer<typeof IngestPayloadSchema>
): z.infer<typeof BodasNetItemSchema>[] {
    if (Array.isArray(payload)) return payload;
    if ('items' in payload) return payload.items;
    return payload.batch;
}

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

export async function GET(request: Request): Promise<NextResponse> {
    try {
        const url = new URL(request.url);
        const rawQuery = {
            province: url.searchParams.get('province'),
            category: url.searchParams.get('category'),
            limit: url.searchParams.get('limit'),
            offset: url.searchParams.get('offset'),
        };

        const parsed = ListQuerySchema.safeParse(
            Object.fromEntries(
                Object.entries(rawQuery).filter(([, v]) => v !== null)
            )
        );

        if (!parsed.success) {
            return jsonResponse<ListResponseBody>(
                {
                    ok: false,
                    total: 0,
                    count: 0,
                    items: [],
                    ts: new Date().toISOString(),
                },
                400
            );
        }

        const { province, category } = parsed.data;
        const limit = clampInt(rawQuery.limit, 1, 100, 30);
        const offset = clampInt(rawQuery.offset, 0, 100_000, 0);

        const where: Prisma.VendorShadowProfileWhereInput = {};
        if (province) where.province = { equals: province, mode: 'insensitive' };
        if (category) where.category = { equals: category, mode: 'insensitive' };

        const [rows, total] = await Promise.all([
            prisma.vendorShadowProfile.findMany({
                where,
                orderBy: { rating: 'desc' },
                take: limit,
                skip: offset,
            }),
            prisma.vendorShadowProfile.count({ where }),
        ]);

        const items = rows.map(toPublicDto);

        const body: ListResponseBody = {
            ok: true,
            total,
            count: items.length,
            items,
            ts: new Date().toISOString(),
        };

        return jsonResponse<ListResponseBody>(body);
    } catch (error) {
        return jsonResponse<ListResponseBody>(
            {
                ok: false,
                total: 0,
                count: 0,
                items: [],
                ts: new Date().toISOString(),
            },
            500
        );
    }
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        if (!isAuthorizedIngest(request)) {
            const body: IngestResponseBody = {
                ok: false,
                processed: 0,
                accepted: 0,
                rejected: 0,
                uniqueHashes: 0,
                errors: [
                    {
                        name: 'UNAUTHORIZED',
                        shaHash: '',
                        error: process.env.BODASNET_INGEST_TOKEN
                            ? 'Token de ingesta inválido.'
                            : 'BODASNET_INGEST_TOKEN no configurado en servidor (fail-closed).',
                    },
                ],
                ts: new Date().toISOString(),
            };
            return jsonResponse<IngestResponseBody>(
                body,
                process.env.BODASNET_INGEST_TOKEN ? 401 : 503
            );
        }

        let rawBody: unknown = {};
        try {
            const text = await request.text();
            if (text.trim().length > 0) {
                rawBody = JSON.parse(text);
            }
        } catch {
            const body: IngestResponseBody = {
                ok: false,
                processed: 0,
                accepted: 0,
                rejected: 0,
                uniqueHashes: 0,
                errors: [
                    {
                        name: 'INVALID_JSON',
                        shaHash: '',
                        error: 'El payload debe ser JSON válido (array o { items: [...] }).',
                    },
                ],
                ts: new Date().toISOString(),
            };
            return jsonResponse<IngestResponseBody>(body, 400);
        }

        const parsed = IngestPayloadSchema.safeParse(rawBody);
        if (!parsed.success) {
            const body: IngestResponseBody = {
                ok: false,
                processed: 0,
                accepted: 0,
                rejected: 0,
                uniqueHashes: 0,
                errors: [
                    {
                        name: 'SCHEMA_REJECTED',
                        shaHash: '',
                        error: parsed.error.issues
                            .map((i) => `${i.path.join('.')}: ${i.message}`)
                            .join('; ')
                            .slice(0, 500),
                    },
                ],
                ts: new Date().toISOString(),
            };
            return jsonResponse<IngestResponseBody>(body, 400);
        }

        const items = ingestItemsFromPayload(parsed.data);
        const errors: IngestErrorDetail[] = [];
        const seenHashes = new Set<string>();
        let accepted = 0;
        let rejected = 0;

        for (const item of items) {
            const shaHash = buildIdempotencyHash(
                item.name,
                item.category,
                item.municipality,
                item.province
            );
            seenHashes.add(shaHash);

            const province = (item.province || 'Madrid').trim();
            const municipality = item.municipality?.trim() || null;
            const telephone = item.telephone?.trim() || null;
            const priceRange = item.priceRange?.trim() || null;
            const rating = item.rating ?? null;
            const reviewsCount = item.reviewsCount ?? 0;
            const description = item.description || null;
            const imageUrls = item.imageUrls ?? [];
            const name = item.name.trim();
            const category = item.category.trim();

            try {
                await prisma.vendorShadowProfile.upsert({
                    where: { shaHash },
                    update: {
                        name,
                        category,
                        province,
                        municipality,
                        telephone,
                        priceRange,
                        rating,
                        reviewsCount,
                        description,
                        imageUrls: { set: imageUrls },
                    },
                    create: {
                        shaHash,
                        name,
                        category,
                        province,
                        municipality,
                        telephone,
                        priceRange,
                        rating,
                        reviewsCount,
                        description,
                        imageUrls,
                        claimToken: randomBytes(16).toString('hex'),
                        status: 'GHOST_UNCLAIMED',
                    },
                });
                accepted += 1;
            } catch (error) {
                rejected += 1;
                if (errors.length < 50) {
                    errors.push({
                        name,
                        shaHash,
                        error: toErrorMessage(error),
                    });
                }
            }
        }

        const body: IngestResponseBody = {
            ok: rejected === 0,
            processed: items.length,
            accepted,
            rejected,
            uniqueHashes: seenHashes.size,
            errors,
            ts: new Date().toISOString(),
        };

        return jsonResponse<IngestResponseBody>(body, rejected === 0 ? 200 : 207);
    } catch (error) {
        const body: IngestResponseBody = {
            ok: false,
            processed: 0,
            accepted: 0,
            rejected: 0,
            uniqueHashes: 0,
            errors: [
                {
                    name: 'INTERNAL_ERROR',
                    shaHash: '',
                    error: toErrorMessage(error),
                },
            ],
            ts: new Date().toISOString(),
        };
        return jsonResponse<IngestResponseBody>(body, 500);
    }
}