import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { Prisma, type AffiliateTier, type KycStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/security/adminGuard';
import {
    AFFILIATE_TIER_CONFIG,
    KYC_THRESHOLD_EUR,
    resolveTier,
} from '@/lib/affiliate/affiliateCommissionEngine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ════════════════════════════════════════════════════════════════════════════
 * /api/admin/affiliates — RED DE AFILIADOS REAL (W41_T08)
 * ════════════════════════════════════════════════════════════════════════════
 * RBAC: TODO handler exige `requireAdmin` (Bearer Firebase + rol ADMIN).
 * Dinero: la comisión NUNCA llega del cliente. Nace del motor SSOT
 *         (`AFFILIATE_TIER_CONFIG`, 10 % base) y se recalcula al cambiar de tier.
 * Datos blindados: el IBAN se valida (ISO 13616 mod-97) y solo se devuelve
 *         enmascarado; el CIF/NIF se valida con el algoritmo fiscal español.
 * Borrado: DELETE es BAJA LÓGICA (`isActive:false`). El histórico de
 *         `commissionLedger`/`Payout` es intocable (Split Soberano 80/10/10).
 * ════════════════════════════════════════════════════════════════════════════ */

const SECURITY_HEADERS: Record<string, string> = {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'X-Robots-Tag': 'noindex, nofollow',
};

const MAX_QUERY_LENGTH = 120;
const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;
const MAX_PAGE = 10_000;
const CODE_ATTEMPTS = 6;

const TIERS = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'] as const;
const KYC_STATES = ['NOT_REQUIRED', 'PENDING', 'VERIFIED', 'REJECTED'] as const;
const FILTER_STATES = ['ACTIVE', 'INACTIVE', 'ALL'] as const;
const PAYOUT_METHODS = ['IBAN', 'TRANSFER', 'STRIPE'] as const;

/**
 * Roles que un alta de afiliado puede promocionar. Nunca degrada un rol de
 * mayor privilegio (ADMIN, COMMANDER, ARQUITECTO, FLEET_OPERATOR…).
 */
const PROMOTABLE_ROLES: ReadonlySet<string> = new Set(['USER', 'CLIENT', 'EXPLORADOR']);

/* ── Validadores fiscales y bancarios (blindaje de datos sensibles) ───────── */

const NIF_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE';
const CIF_LETTERS = 'JABCDEFGHI';

function normalizeCifNif(raw: string): string {
    return raw.replace(/[\s.\-/]/g, '').toUpperCase();
}

/** DNI (8 + letra), NIE (X/Y/Z + 7 + letra) y CIF con dígito o letra de control. */
function isValidCifNif(raw: string): boolean {
    const doc = normalizeCifNif(raw);

    if (/^\d{8}[A-Z]$/.test(doc)) {
        return doc[8] === NIF_LETTERS[Number(doc.slice(0, 8)) % 23];
    }

    if (/^[XYZ]\d{7}[A-Z]$/.test(doc)) {
        const prefixed = `${'XYZ'.indexOf(doc[0])}${doc.slice(1, 8)}`;
        return doc[8] === NIF_LETTERS[Number(prefixed) % 23];
    }

    if (/^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(doc)) {
        const digits = doc.slice(1, 8).split('').map((char) => Number(char));
        let sum = 0;
        digits.forEach((digit, index) => {
            if (index % 2 === 0) {
                const doubled = digit * 2;
                sum += Math.floor(doubled / 10) + (doubled % 10);
            } else {
                sum += digit;
            }
        });
        const control = (10 - (sum % 10)) % 10;
        const controlChar = doc[8];
        return controlChar === String(control) || controlChar === CIF_LETTERS[control];
    }

    return false;
}

function normalizeIban(raw: string): string {
    return raw.replace(/[\s-]/g, '').toUpperCase();
}

/** ISO 13616: estructura + checksum mod-97 real (no basta con la longitud). */
function isValidIban(raw: string): boolean {
    const iban = normalizeIban(raw);
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(iban)) return false;

    const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
    let remainder = 0;
    for (const char of rearranged) {
        const code = char.charCodeAt(0);
        const chunk = code >= 65 && code <= 90 ? String(code - 55) : char;
        for (const digit of chunk) {
            remainder = (remainder * 10 + Number(digit)) % 97;
        }
    }
    return remainder === 1;
}

/** El IBAN jamás sale completo de la API: solo los 4 últimos dígitos. */
function maskPayoutDetails(raw: string | null): string | null {
    if (!raw) return null;
    const compact = raw.replace(/\s+/g, '').toUpperCase();
    if (compact.length <= 4) return '••••';
    return `•••• ${compact.slice(-4)}`;
}

/* ── Código de referido único (alfabeto sin caracteres ambiguos) ──────────── */

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function codeSuffix(length = 4): string {
    const bytes = randomBytes(length);
    let out = '';
    for (const byte of bytes) {
        out += CODE_ALPHABET[byte % CODE_ALPHABET.length];
    }
    return out;
}

function makeCode(seed: string): string {
    const base = seed
        .toUpperCase()
        .normalize('NFD')
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 12);
    return `${base || 'EAR'}-${codeSuffix()}`;
}

/* ── Esquemas estrictos: rechazan claves desconocidas (cero mass-assignment) ─ */

const EMAIL_MAX = 180;

const CreateSchema = z
    .object({
        email: z.string().trim().email().max(EMAIL_MAX),
        name: z.string().trim().min(1).max(120).optional(),
        companyName: z.string().trim().min(2).max(160).optional(),
        cifNif: z.string().trim().min(8).max(20).optional(),
        phone: z.string().trim().min(6).max(24).optional(),
        category: z.string().trim().min(2).max(40).default('PRESCRIPTOR'),
        tier: z.enum(TIERS).default('BRONZE'),
    })
    .strict();

/**
 * `commissionRate` NO aparece aquí a propósito: la comisión es del motor SSOT.
 * Si el panel intenta inyectarla, `.strict()` devuelve 400.
 */
const PatchSchema = z
    .object({
        id: z.string().trim().min(1).max(64),
        tier: z.enum(TIERS).optional(),
        isActive: z.boolean().optional(),
        isHomologated: z.boolean().optional(),
        kycStatus: z.enum(KYC_STATES).optional(),
        category: z.string().trim().min(2).max(40).optional(),
        companyName: z.string().trim().min(2).max(160).optional(),
        cifNif: z.string().trim().min(8).max(20).optional(),
        phone: z.string().trim().min(6).max(24).optional(),
        payoutMethod: z.enum(PAYOUT_METHODS).optional(),
        payoutDetails: z.string().trim().min(15).max(42).optional(),
    })
    .strict();

const DeleteSchema = z
    .object({
        id: z.string().trim().min(1).max(64),
    })
    .strict();

const QuerySchema = z
    .object({
        status: z.enum(FILTER_STATES).default('ALL'),
        tier: z.enum(TIERS).optional(),
        kycStatus: z.enum(KYC_STATES).optional(),
        q: z.string().trim().min(2).max(MAX_QUERY_LENGTH).optional(),
    })
    .strict();

/* ── Tipos de respuesta (cero `any`) ──────────────────────────────────────── */

type ApiError = { ok: false; error: string; details?: unknown };

type TierCatalogEntry = {
    tier: AffiliateTier;
    name: string;
    commissionRate: number;
    minSales: number;
};

type PublicAffiliate = {
    id: string;
    affiliateCode: string;
    userId: string;
    companyName: string | null;
    cifNif: string | null;
    phone: string | null;
    category: string;
    payoutMethod: string;
    payoutDetails: string | null;
    hasPayoutDetails: boolean;
    tier: AffiliateTier;
    commissionRate: number;
    tierBySales: AffiliateTier;
    isHomologated: boolean;
    isActive: boolean;
    kycStatus: KycStatus;
    totalSalesGenerated: number;
    user: { email: string; name: string | null; role: string };
    counts: { ledgers: number; referrals: number; payouts: number };
    createdAt: string;
    updatedAt: string;
};

type AffiliateItemResponse = { ok: true; data: PublicAffiliate };

type AffiliateListResponse = {
    ok: true;
    data: PublicAffiliate[];
    total: number;
    page: number;
    pageSize: number;
    pages: number;
    tierCatalog: TierCatalogEntry[];
    kycThresholdEur: number;
};

type AffiliateDeleteResponse = {
    ok: true;
    data: {
        id: string;
        affiliateCode: string;
        isActive: false;
        alreadyInactive: boolean;
        preserved: { ledgers: number; referrals: number; payouts: number };
    };
};

type ApiBody =
    | AffiliateItemResponse
    | AffiliateListResponse
    | AffiliateDeleteResponse
    | ApiError;

function jsonResponse(payload: ApiBody, status = 200): NextResponse {
    return NextResponse.json(payload, { status, headers: SECURITY_HEADERS });
}

const AFFILIATE_INCLUDE = {
    user: { select: { email: true, name: true, role: true } },
    _count: { select: { ledgers: true, referrals: true, payouts: true } },
} satisfies Prisma.AffiliateProfileInclude;

type AffiliateRecord = Prisma.AffiliateProfileGetPayload<{
    include: typeof AFFILIATE_INCLUDE;
}>;

function toPublicAffiliate(record: AffiliateRecord): PublicAffiliate {
    return {
        id: record.id,
        affiliateCode: record.affiliateCode,
        userId: record.userId,
        companyName: record.companyName,
        cifNif: record.cifNif,
        phone: record.phone,
        category: record.category,
        payoutMethod: record.payoutMethod,
        payoutDetails: maskPayoutDetails(record.payoutDetails),
        hasPayoutDetails:
            typeof record.payoutDetails === 'string' && record.payoutDetails.length > 0,
        tier: record.tier,
        commissionRate: record.commissionRate,
        tierBySales: resolveTier(record.totalSalesGenerated).tier,
        isHomologated: record.isHomologated,
        isActive: record.isActive,
        kycStatus: record.kycStatus,
        totalSalesGenerated: record.totalSalesGenerated,
        user: record.user,
        counts: {
            ledgers: record._count.ledgers,
            referrals: record._count.referrals,
            payouts: record._count.payouts,
        },
        createdAt: record.createdAt.toISOString(),
        updatedAt: record.updatedAt.toISOString(),
    };
}

function sanitizeQuery(raw: string | null): string | undefined {
    if (typeof raw !== 'string') return undefined;
    const trimmed = raw.trim().slice(0, MAX_QUERY_LENGTH);
    return trimmed.length > 0 ? trimmed : undefined;
}

function readPositiveInt(raw: string | null, fallback: number, max: number): number {
    const parsed = Number.parseInt(raw ?? '', 10);
    if (!Number.isFinite(parsed) || parsed < 1) return fallback;
    return Math.min(parsed, max);
}


/* ══════════════════════════════════════════════════════════════════════════
 * GET — listado real con paginación y filtrado por estado
 * ══════════════════════════════════════════════════════════════════════════ */

export async function GET(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    try {
        const { searchParams } = new URL(request.url);
        const page = readPositiveInt(searchParams.get('page'), 1, MAX_PAGE);
        const pageSize = readPositiveInt(
            searchParams.get('pageSize'),
            DEFAULT_PAGE_SIZE,
            MAX_PAGE_SIZE,
        );

        const parsed = QuerySchema.safeParse({
            status: sanitizeQuery(searchParams.get('status')) ?? 'ALL',
            tier: sanitizeQuery(searchParams.get('tier')),
            kycStatus: sanitizeQuery(searchParams.get('kycStatus')),
            q: sanitizeQuery(searchParams.get('q')),
        });

        if (!parsed.success) {
            return jsonResponse(
                {
                    ok: false,
                    error: 'Parámetros de consulta no válidos',
                    details: parsed.error.issues.map((issue) => ({
                        path: issue.path.join('.'),
                        message: issue.message,
                    })),
                },
                400,
            );
        }

        const { status, tier, kycStatus, q } = parsed.data;

        const where: Prisma.AffiliateProfileWhereInput = {};
        if (status === 'ACTIVE') where.isActive = true;
        if (status === 'INACTIVE') where.isActive = false;
        if (tier) where.tier = tier;
        if (kycStatus) where.kycStatus = kycStatus;
        if (q) {
            where.OR = [
                { affiliateCode: { contains: q, mode: 'insensitive' } },
                { companyName: { contains: q, mode: 'insensitive' } },
                { phone: { contains: q } },
                { cifNif: { contains: normalizeCifNif(q) } },
                {
                    user: {
                        is: {
                            OR: [
                                { email: { contains: q, mode: 'insensitive' } },
                                { name: { contains: q, mode: 'insensitive' } },
                            ],
                        },
                    },
                },
            ];
        }

        const [rows, total] = await Promise.all([
            prisma.affiliateProfile.findMany({
                where,
                include: AFFILIATE_INCLUDE,
                orderBy: [{ isActive: 'desc' }, { updatedAt: 'desc' }],
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
            prisma.affiliateProfile.count({ where }),
        ]);

        const payload: AffiliateListResponse = {
            ok: true,
            data: rows.map(toPublicAffiliate),
            total,
            page,
            pageSize,
            pages: Math.max(1, Math.ceil(total / pageSize)),
            // El panel pinta las comisiones desde el motor, nunca desde su propio código.
            tierCatalog: AFFILIATE_TIER_CONFIG.map((entry) => ({
                tier: entry.tier,
                name: entry.name,
                commissionRate: entry.commissionRate,
                minSales: entry.minSales,
            })),
            kycThresholdEur: KYC_THRESHOLD_EUR,
        };

        return jsonResponse(payload);
    } catch (error) {
        console.error('[admin/affiliates] GET error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno al leer la red de afiliados' },
            500,
        );
    }
}


/* ══════════════════════════════════════════════════════════════════════════
 * PATCH — tier / comisión del motor / estado / KYC / datos de cobro
 * ══════════════════════════════════════════════════════════════════════════ */

export async function PATCH(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    let rawBody: unknown;
    try {
        rawBody = await request.json();
    } catch {
        return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido' }, 400);
    }

    const parsed = PatchSchema.safeParse(rawBody);
    if (!parsed.success) {
        return jsonResponse(
            {
                ok: false,
                error: 'Payload inválido',
                details: parsed.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            },
            400,
        );
    }

    const body = parsed.data;

    if (body.cifNif !== undefined && !isValidCifNif(body.cifNif)) {
        return jsonResponse(
            {
                ok: false,
                error: 'CIF/NIF inválido: no supera el dígito de control fiscal',
            },
            400,
        );
    }

    const payoutMethod = body.payoutMethod ?? 'IBAN';
    if (
        body.payoutDetails !== undefined &&
        payoutMethod === 'IBAN' &&
        !isValidIban(body.payoutDetails)
    ) {
        return jsonResponse(
            { ok: false, error: 'IBAN inválido: no supera el checksum ISO 13616' },
            400,
        );
    }

    const data: Prisma.AffiliateProfileUpdateInput = {};

    if (body.tier !== undefined) {
        const tierConfig = AFFILIATE_TIER_CONFIG.find((entry) => entry.tier === body.tier);
        if (!tierConfig) {
            return jsonResponse(
                { ok: false, error: 'Tier no reconocido por el motor de comisiones' },
                400,
            );
        }
        data.tier = tierConfig.tier;
        // Comisión re-derivada del SSOT del motor: el cliente jamás la dicta.
        data.commissionRate = tierConfig.commissionRate;
    }
    if (body.isActive !== undefined) data.isActive = body.isActive;
    if (body.isHomologated !== undefined) data.isHomologated = body.isHomologated;
    if (body.kycStatus !== undefined) data.kycStatus = body.kycStatus;
    if (body.category !== undefined) data.category = body.category.toUpperCase();
    if (body.companyName !== undefined) data.companyName = body.companyName;
    if (body.cifNif !== undefined) data.cifNif = normalizeCifNif(body.cifNif);
    if (body.phone !== undefined) data.phone = body.phone;
    if (body.payoutMethod !== undefined) data.payoutMethod = body.payoutMethod;
    if (body.payoutDetails !== undefined) {
        data.payoutDetails =
            payoutMethod === 'IBAN' ? normalizeIban(body.payoutDetails) : body.payoutDetails;
    }

    if (Object.keys(data).length === 0) {
        return jsonResponse({ ok: false, error: 'Sin campos válidos que actualizar' }, 400);
    }

    try {
        const updated = await prisma.affiliateProfile.update({
            where: { id: body.id },
            data,
            include: AFFILIATE_INCLUDE,
        });

        const payload: AffiliateItemResponse = { ok: true, data: toPublicAffiliate(updated) };
        return jsonResponse(payload);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return jsonResponse({ ok: false, error: 'Afiliado no encontrado' }, 404);
        }
        console.error('[admin/affiliates] PATCH error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno al actualizar el afiliado' },
            500,
        );
    }
}


/* ══════════════════════════════════════════════════════════════════════════
 * POST — alta real: User + AffiliateProfile con código de referido único
 * ══════════════════════════════════════════════════════════════════════════ */

export async function POST(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    let rawBody: unknown;
    try {
        rawBody = await request.json();
    } catch {
        return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido' }, 400);
    }

    const parsed = CreateSchema.safeParse(rawBody);
    if (!parsed.success) {
        return jsonResponse(
            {
                ok: false,
                error: 'Payload inválido',
                details: parsed.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            },
            400,
        );
    }

    const body = parsed.data;
    const email = body.email.toLowerCase();

    if (body.cifNif !== undefined && !isValidCifNif(body.cifNif)) {
        return jsonResponse(
            {
                ok: false,
                error: 'CIF/NIF inválido: no supera el dígito de control fiscal',
            },
            400,
        );
    }
    if (body.phone !== undefined && !/^\+?[0-9 ()-]{6,24}$/.test(body.phone)) {
        return jsonResponse({ ok: false, error: 'Teléfono con formato no válido' }, 400);
    }

    // SSOT: la comisión por defecto nace del motor, nunca de la UI.
    const tierConfig =
        AFFILIATE_TIER_CONFIG.find((entry) => entry.tier === body.tier) ?? resolveTier(0);

    try {
        const created = await prisma.$transaction(async (tx) => {
            const user = await tx.user.upsert({
                where: { email },
                update: {},
                create: {
                    email,
                    name: body.name ?? email.split('@')[0],
                    role: 'AFFILIATE',
                },
                select: { id: true, role: true },
            });

            if (PROMOTABLE_ROLES.has(user.role)) {
                await tx.user.update({
                    where: { id: user.id },
                    data: { role: 'AFFILIATE' },
                });
            }

            const existing = await tx.affiliateProfile.findUnique({
                where: { userId: user.id },
                select: { id: true },
            });
            if (existing) throw new Error('AFFILIATE_EXISTS');

            const seed = body.companyName ?? body.name ?? email;
            let affiliateCode = makeCode(seed);
            for (let attempt = 1; attempt < CODE_ATTEMPTS; attempt += 1) {
                const clash = await tx.affiliateProfile.findUnique({
                    where: { affiliateCode },
                    select: { id: true },
                });
                if (!clash) break;
                if (attempt === CODE_ATTEMPTS - 1) {
                    throw new Error('AFFILIATE_CODE_EXHAUSTED');
                }
                affiliateCode = makeCode(seed);
            }

            return tx.affiliateProfile.create({
                data: {
                    userId: user.id,
                    affiliateCode,
                    companyName: body.companyName ?? null,
                    cifNif: body.cifNif ? normalizeCifNif(body.cifNif) : null,
                    phone: body.phone ?? null,
                    category: body.category.toUpperCase(),
                    tier: tierConfig.tier,
                    commissionRate: tierConfig.commissionRate,
                },
                include: AFFILIATE_INCLUDE,
            });
        });

        const payload: AffiliateItemResponse = { ok: true, data: toPublicAffiliate(created) };
        return jsonResponse(payload, 201);
    } catch (error) {
        if (error instanceof Error && error.message === 'AFFILIATE_EXISTS') {
            return jsonResponse(
                {
                    ok: false,
                    error: 'El usuario ya tiene perfil de afiliado: usa PATCH para modificarlo',
                },
                409,
            );
        }
        if (error instanceof Error && error.message === 'AFFILIATE_CODE_EXHAUSTED') {
            return jsonResponse(
                {
                    ok: false,
                    error: 'No se pudo reservar un código de referido libre: reintenta el alta',
                },
                503,
            );
        }
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2002'
        ) {
            return jsonResponse(
                { ok: false, error: 'Código de referido o email duplicado' },
                409,
            );
        }
        console.error('[admin/affiliates] POST error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno al crear el afiliado' },
            500,
        );
    }
}


/* ══════════════════════════════════════════════════════════════════════════
 * DELETE — baja lógica (isActive:false). El histórico contable es intocable:
 * los ledgers de comisión y los payouts del Split 80/10/10 no se borran jamás.
 * ══════════════════════════════════════════════════════════════════════════ */

export async function DELETE(request: NextRequest): Promise<NextResponse> {
    const auth = await requireAdmin(request);
    if (!auth.ok) return auth.response;

    let rawBody: unknown;
    try {
        rawBody = await request.json();
    } catch {
        return jsonResponse({ ok: false, error: 'Cuerpo JSON inválido' }, 400);
    }

    const parsed = DeleteSchema.safeParse(rawBody);
    if (!parsed.success) {
        return jsonResponse(
            {
                ok: false,
                error: 'Payload inválido',
                details: parsed.error.issues.map((issue) => ({
                    path: issue.path.join('.'),
                    message: issue.message,
                })),
            },
            400,
        );
    }

    try {
        const current = await prisma.affiliateProfile.findUnique({
            where: { id: parsed.data.id },
            select: {
                id: true,
                affiliateCode: true,
                isActive: true,
                _count: { select: { ledgers: true, referrals: true, payouts: true } },
            },
        });

        if (!current) {
            return jsonResponse({ ok: false, error: 'Afiliado no encontrado' }, 404);
        }

        const preserved = {
            ledgers: current._count.ledgers,
            referrals: current._count.referrals,
            payouts: current._count.payouts,
        };

        // Idempotente: repetir la baja no altera nada ni toca el histórico.
        if (!current.isActive) {
            const payload: AffiliateDeleteResponse = {
                ok: true,
                data: {
                    id: current.id,
                    affiliateCode: current.affiliateCode,
                    isActive: false,
                    alreadyInactive: true,
                    preserved,
                },
            };
            return jsonResponse(payload);
        }

        const updated = await prisma.affiliateProfile.update({
            where: { id: current.id },
            data: { isActive: false },
            select: { id: true, affiliateCode: true, isActive: true },
        });

        const payload: AffiliateDeleteResponse = {
            ok: true,
            data: {
                id: updated.id,
                affiliateCode: updated.affiliateCode,
                isActive: false,
                alreadyInactive: false,
                preserved,
            },
        };
        return jsonResponse(payload);
    } catch (error) {
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === 'P2025'
        ) {
            return jsonResponse({ ok: false, error: 'Afiliado no encontrado' }, 404);
        }
        console.error('[admin/affiliates] DELETE error', error);
        return jsonResponse(
            { ok: false, error: 'Error interno al dar de baja el afiliado' },
            500,
        );
    }
}

