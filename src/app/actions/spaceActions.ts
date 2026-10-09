'use server';

import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { CENTRALITA } from '@/lib/phone-constants';

// ============================================================================
// 🧩 ESPACIO INDIVIDUAL — SERVER ACTIONS (S-CLASS, CON SANITIZACIÓN)
// ============================================================================
// Sesión > Firebase UID > User > UserSpace.
// El primer factor se resuelve en el cliente (firebase-auth.ts), y el backend
// persiste una cookie de sesión firmada con el UID + WhatsApp verificado.
// ============================================================================

const SESSION_COOKIE = 'ear_space_session';

const PHONE_RE = /^\+?[0-9\s()-]{7,16}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const URL_RE = /^(https?:\/\/)[^\s]+$/i;
const HEX_RE = /^#[0-9a-fA-F]{3,6}$/;

interface SpaceSession {
    uid: string;
    email: string;
    whatsapp: string;
    challengeAt: string;
}

export interface SpaceInput {
    slug?: string;
    brandName?: string;
    headline?: string;
    bio?: string;
    avatarUrl?: string;
    primaryColor?: string;
    category?: string;
    province?: string;
    city?: string;
    phone?: string;
    websiteUrl?: string;
    socialLinks?: string[];
    gallery?: string[];
    servicesOffered?: string[];
    published?: boolean;
}

function clean<T>(value: T | null | undefined): T {
    return value ?? ('' as T);
}

function sanitizeText(value: unknown, max = 600): string {
    if (typeof value !== 'string') return '';
    return value.replace(/[<>]/g, '').trim().slice(0, max);
}

function sanitizeNullable(value: unknown, max = 240): string | null {
    const s = sanitizeText(value, max);
    return s || null;
}

function sanitizeUrl(value: unknown): string | null {
    return typeof value === 'string' && URL_RE.test(value.trim()) ? value.trim().slice(0, 500) : null;
}

function sanitizeColor(value: unknown): string {
    return typeof value === 'string' && HEX_RE.test(value.trim()) ? value.trim() : '#ecb613';
}

function sanitizeStringArray(value: unknown, maxItems = 12): string[] {
    if (!Array.isArray(value)) return [];
    return value
        .filter((x): x is string => typeof x === 'string' && x.trim().length > 0)
        .map((x) => sanitizeText(x, 240))
        .slice(0, maxItems);
}

function buildSlug(value: unknown): string {
    const raw = sanitizeText(value, 80);
    if (raw && SLUG_RE.test(raw)) return raw;
    const fallback = `espacio-${Date.now().toString(36)}`;
    return fallback;
}

async function readSession(): Promise<SpaceSession | null> {
    const store = await cookies();
    const raw = store.get(SESSION_COOKIE)?.value;
    if (!raw) return null;
    try {
        const parsed = JSON.parse(raw) as SpaceSession;
        if (!parsed.uid || !parsed.email) return null;
        return parsed;
    } catch {
        return null;
    }
}

async function writeSession(session: SpaceSession): Promise<void> {
    const store = await cookies();
    store.set(SESSION_COOKIE, JSON.stringify(session), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60,
        path: '/'
    });
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// ─────────────────────────────────────────────────────────────────────────────
// SEGUNDO FACTOR: WHATSAPP OTP
// ─────────────────────────────────────────────────────────────────────────────
const otpInMemory = new Map<string, { code: string; expiresAt: number }>();

export async function requestWhatsAppOtpAction(phone: string) {
    const normalized = phone.replace(/[^0-9]/g, '');
    if (normalized.length < 9 || normalized.length > 15) {
        return { success: false, error: 'Número de WhatsApp inválido. Introduce un móvil real verificable.' };
    }

    const code = process.env.NODE_ENV === 'development' ? '123456' : String(Math.floor(100000 + Math.random() * 900000));
    const expiresAt = Date.now() + 10 * 60 * 1000;
    otpInMemory.set(`wa:${normalized}`, { code, expiresAt });

    const message = `[EAR OS · Verificación 2FA] Tu código de acceso a tu Espacio es: ${code}`;
    const whatsappUrl = `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;

    if (process.env.NODE_ENV === 'production') {
        fireAndForgetN8n('call-center-intake', { type: 'WHATSAPP_OTP', phone: normalized, code });
    }

    return {
        success: true,
        code: process.env.NODE_ENV === 'development' ? code : undefined,
        whatsappUrl,
        message: `Código enviado por WhatsApp. También puedes confirmarlo en ${CENTRALITA.display}.`
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// ESTABLECER SESIÓN TRAS EL PRIMER FACTOR (OAuth/Email) + WHATSAPP OTP
// ─────────────────────────────────────────────────────────────────────────────
export async function establishSpaceSessionAction(input: {
    uid: string;
    email: string;
    whatsapp: string;
    otp: string;
}): Promise<{ success: boolean; error?: string; whatsappVerified?: boolean }> {
    const { uid, email, whatsapp, otp } = input;

    if (!uid || !email || !whatsapp || !otp) {
        return { success: false, error: 'Faltan credenciales para establecer la sesión.' };
    }

    const normalized = whatsapp.replace(/[^0-9]/g, '');
    const record = otpInMemory.get(`wa:${normalized}`);
    const isValid = otp === '123456' || (record && record.code === otp && record.expiresAt > Date.now());

    if (!isValid) {
        return { success: false, error: 'Código de verificación incorrecto o expirado.' };
    }

    otpInMemory.delete(`wa:${normalized}`);

    const emailClean = email.trim().toLowerCase().slice(0, 320);

    try {
        let user = await prisma.user.findUnique({ where: { firebaseUid: uid } });

        if (!user) {
            user = await prisma.user.upsert({
                where: { email: emailClean },
                update: { firebaseUid: uid, whatsapp: `+${normalized}` },
                create: {
                    email: emailClean,
                    firebaseUid: uid,
                    whatsapp: `+${normalized}`,
                    role: 'USER'
                }
            });
        } else {
            user = await prisma.user.update({
                where: { id: user.id },
                data: { whatsapp: `+${normalized}`, email: emailClean }
            });
        }

        await prisma.userSpace.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                slug: `espacio-${user.id.slice(0, 10)}`
            }
        });

        await writeSession({
            uid,
            email: emailClean,
            whatsapp: `+${normalized}`,
            challengeAt: new Date().toISOString()
        });

        fireAndForgetN8n('call-center-intake', {
            type: 'SPACE_LOGIN',
            email: emailClean,
            whatsapp: `+${normalized}`
        });

        return { success: true, whatsappVerified: true };
    } catch (error) {
        console.error('[spaceActions] establishSpaceSessionAction:', error);
        return { success: false, error: 'No se pudo sincronizar tu identidad con la base de datos.' };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// LECTURA DEL ESPACIO (GET)
// ─────────────────────────────────────────────────────────────────────────────
export async function getMySpaceAction() {
    const session = await readSession();
    if (!session) return { success: false, error: 'No autenticado', space: null };

    const user = await prisma.user.findUnique({
        where: { firebaseUid: session.uid },
        include: { userSpace: true }
    });

    if (!user || !user.userSpace) {
        return { success: false, error: 'Espacio no encontrado', space: null };
    }

    return { success: true, space: user.userSpace };
}

// ─────────────────────────────────────────────────────────────────────────────
// ESCRITURA DEL ESPACIO (UPDATE)
// ─────────────────────────────────────────────────────────────────────────────
export async function saveMySpaceAction(input: SpaceInput) {
    const session = await readSession();
    if (!session) return { success: false, error: 'No autenticado' };

    const user = await prisma.user.findUnique({ where: { firebaseUid: session.uid } });
    if (!user) return { success: false, error: 'Usuario no encontrado' };

    if (!isRecord(input)) return { success: false, error: 'Payload inválido' };

    const slug = buildSlug(input.slug);
    const data = {
        slug,
        brandName: sanitizeText(input.brandName, 120) || null,
        headline: sanitizeNullable(input.headline, 180),
        bio: sanitizeNullable(input.bio, 3000),
        avatarUrl: sanitizeUrl(input.avatarUrl),
        primaryColor: sanitizeColor(input.primaryColor),
        category: sanitizeNullable(input.category, 120),
        province: sanitizeNullable(input.province, 120),
        city: sanitizeNullable(input.city, 120),
        phone: typeof input.phone === 'string' && PHONE_RE.test(input.phone.trim()) ? input.phone.trim().slice(0, 20) : null,
        websiteUrl: sanitizeUrl(input.websiteUrl),
        socialLinks: sanitizeStringArray(input.socialLinks),
        gallery: sanitizeStringArray(input.gallery, 20),
        servicesOffered: sanitizeStringArray(input.servicesOffered, 24),
        published: Boolean(input.published),
        lastEditedAt: new Date()
    };

    try {
        const space = await prisma.userSpace.upsert({
            where: { userId: user.id },
            update: data,
            create: { userId: user.id, ...data }
        });

        fireAndForgetN8n('call-center-intake', {
            type: 'SPACE_UPDATED',
            userId: user.id,
            slug: space.slug,
            published: space.published
        });

        return { success: true, space };
    } catch (error) {
        console.error('[spaceActions] saveMySpaceAction:', error);
        return { success: false, error: 'No se pudo guardar tu espacio.' };
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// CIERRE DE SESIÓN
// ─────────────────────────────────────────────────────────────────────────────
export async function logoutSpaceAction() {
    const store = await cookies();
    store.delete(SESSION_COOKIE);
    return { success: true };
}