import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';
import { buildProviderPing, buildProviderWhatsappUrl } from '@/lib/booking/provider-service-brief';

/**
 * POST /api/booking/notify-provider
 * Despacha al proveedor (WhatsApp wa.me) y al clúster n8n (call-center-intake,
 * con reintentos + Dead Letter Queue) la solicitud creada por RequestToBookModal.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CENTRALITA_EAR_OS = '+34693693048';
const PROVIDERS_DIR = path.join(process.cwd(), 'public', 'data', 'providers');
const MAX_FIELD_LENGTH = 200;

interface NotifyProviderBody {
    requestId: string;
    providerId: string;
    providerName: string;
    clientName: string;
    clientPhone: string;
    eventDate: string;
    budget: number;
    location: string;
    /* ── Datos operativos opcionales (los que trae la ficha del cliente) ── */
    reference?: string;
    startTime?: string;
    durationHours?: number;
    eventType?: string;
    eventPurpose?: string;
    venueName?: string;
    venueAddress?: string;
    city?: string;
    province?: string;
    guests?: number;
    childrenCount?: number;
    serviceFormat?: string;
    riderNotes?: string;
    parkingNotes?: string;
    setupMinutes?: number;
}

interface ProviderPhoneLookup {
    phone: string;
    verified: boolean;
}

type JsonRecord = Record<string, unknown>;

const REQUIRED_STRING_FIELDS = [
    'requestId',
    'providerId',
    'providerName',
    'clientName',
    'clientPhone',
    'eventDate',
    'location'
] as const;

function isRecord(value: unknown): value is JsonRecord {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Sanitización anti-XSS server-side: elimina marcadores HTML y caracteres de control. */
function sanitizeText(value: string): string {
    return value
        .split('<').join('')
        .split('>').join('')
        .replace(/[\u0000-\u001F\u007F]/g, ' ')
        .trim()
        .slice(0, MAX_FIELD_LENGTH);
}

function digitsOnly(value: string): string {
    return value.replace(/\D/g, '');
}

function isRealPhone(raw: string): boolean {
    const digits = digitsOnly(raw);
    if (digits.length < 9 || digits.length > 15) return false;
    return !digits.endsWith('693693048');
}

function extractPhone(record: JsonRecord): string | null {
    const candidates = [record.phone, record.telefono, record.whatsapp, record.tel];
    for (const candidate of candidates) {
        if (typeof candidate === 'string' && isRealPhone(candidate)) return candidate;
    }
    return null;
}

function collectRecords(parsed: unknown): JsonRecord[] {
    if (Array.isArray(parsed)) return parsed.filter(isRecord);
    if (isRecord(parsed)) {
        for (const key of ['providers', 'data', 'items', 'records']) {
            const nested = parsed[key];
            if (Array.isArray(nested)) return nested.filter(isRecord);
        }
    }
    return [];
}

async function lookupProviderPhone(providerId: string): Promise<ProviderPhoneLookup> {
    try {
        const files = (await fs.readdir(PROVIDERS_DIR)).filter((f) => f.endsWith('.json'));
        for (const file of files) {
            try {
                const raw = await fs.readFile(path.join(PROVIDERS_DIR, file), 'utf-8');
                const records = collectRecords(JSON.parse(raw) as unknown);
                for (const record of records) {
                    const id = record.id ?? record.providerId ?? record.slug;
                    if (typeof id === 'string' && id === providerId) {
                        const phone = extractPhone(record);
                        if (phone) return { phone, verified: true };
                    }
                }
            } catch {
                continue;
            }
        }
    } catch {
        // Directorio no disponible: fallback a centralita.
    }
    return { phone: CENTRALITA_EAR_OS, verified: false };
}

function validateBody(input: unknown): { ok: true; body: NotifyProviderBody } | { ok: false; status: 400 | 422; error: string } {
    if (!isRecord(input)) {
        return { ok: false, status: 400, error: 'El cuerpo debe ser un objeto JSON válido.' };
    }
    const cleaned: Record<string, string> = {};
    for (const field of REQUIRED_STRING_FIELDS) {
        const value = input[field];
        if (value === undefined || value === null) {
            return { ok: false, status: 400, error: `Campo requerido ausente: ${field}.` };
        }
        if (typeof value !== 'string') {
            return { ok: false, status: 422, error: `El campo ${field} debe ser texto.` };
        }
        const sanitized = sanitizeText(value);
        if (sanitized.length === 0) {
            return { ok: false, status: 422, error: `El campo ${field} no puede estar vacío.` };
        }
        cleaned[field] = sanitized;
    }
    const budgetRaw = input.budget;
    if (budgetRaw === undefined || budgetRaw === null) {
        return { ok: false, status: 400, error: 'Campo requerido ausente: budget.' };
    }
    const budget = typeof budgetRaw === 'number' ? budgetRaw : Number(budgetRaw);
    if (!Number.isFinite(budget) || budget <= 0) {
        return { ok: false, status: 422, error: 'El campo budget debe ser un número positivo.' };
    }
    if (!/^\d{4}-\d{2}-\d{2}/.test(cleaned.eventDate) || Number.isNaN(Date.parse(cleaned.eventDate))) {
        return { ok: false, status: 422, error: 'El campo eventDate debe tener formato ISO (YYYY-MM-DD).' };
    }
    if (digitsOnly(cleaned.clientPhone).length < 9) {
        return { ok: false, status: 422, error: 'El campo clientPhone no es un teléfono válido.' };
    }
    const optText = (field: string): string | undefined => {
        const value = input[field];
        if (typeof value !== 'string') return undefined;
        const sanitized = sanitizeText(value);
        return sanitized.length > 0 ? sanitized : undefined;
    };
    const optNumber = (field: string): number | undefined => {
        const value = input[field];
        if (typeof value === 'number' && Number.isFinite(value)) return value;
        if (typeof value === 'string' && /^\d{1,6}(?:[.,]\d{1,2})?$/.test(value)) {
            return Number(value.replace(',', '.'));
        }
        return undefined;
    };

    return {
        ok: true,
        body: {
            requestId: cleaned.requestId,
            providerId: cleaned.providerId,
            providerName: cleaned.providerName,
            clientName: cleaned.clientName,
            clientPhone: cleaned.clientPhone,
            eventDate: cleaned.eventDate,
            budget,
            location: cleaned.location,
            reference: optText('reference'),
            startTime: optText('startTime'),
            durationHours: optNumber('durationHours'),
            eventType: optText('eventType'),
            eventPurpose: optText('eventPurpose'),
            venueName: optText('venueName'),
            venueAddress: optText('venueAddress'),
            city: optText('city'),
            province: optText('province'),
            guests: optNumber('guests'),
            childrenCount: optNumber('childrenCount'),
            serviceFormat: optText('serviceFormat'),
            riderNotes: optText('riderNotes'),
            parkingNotes: optText('parkingNotes'),
            setupMinutes: optNumber('setupMinutes'),
        }
    };
}

/**
 * El aviso al proveedor deja de ser un anuncio y pasa a ser la ficha operativa
 * mínima (cuándo · dónde · qué · quién · invitados · dinero · su único paso)
 * con los huecos declarados como huecos. Cero bonos, cero garantías, cero
 * promesas que no estén cobradas (§EP-3 · JUR-1 · AF-2).
 */
function buildPing(phone: string, body: NotifyProviderBody): {
    whatsappUrl: string;
    text: string;
    missing: readonly string[];
    respondBefore: string;
} {
    const ping = buildProviderPing({
        ficha: {
            requestId: body.requestId,
            reference: body.reference,
            provider: { id: body.providerId, name: body.providerName, phone },
            clientName: body.clientName,
            clientPhone: body.clientPhone,
            eventType: body.eventType,
            eventPurpose: body.eventPurpose,
            eventDate: body.eventDate,
            startTime: body.startTime,
            durationHours: body.durationHours,
            venueName: body.venueName,
            venueAddress: body.venueAddress,
            city: body.city ?? body.location,
            province: body.province,
            guests: body.guests,
            childrenCount: body.childrenCount,
            serviceFormat: body.serviceFormat,
            riderNotes: body.riderNotes,
            parkingNotes: body.parkingNotes,
        },
        requestedAt: new Date().toISOString(),
        totalEur: body.budget,
        setupMinutes: body.setupMinutes,
        respondWithinMinutes: 120,
    });

    return {
        whatsappUrl: buildProviderWhatsappUrl(phone, ping.text),
        text: ping.text,
        missing: ping.missing,
        respondBefore: ping.respondBefore,
    };
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        let parsed: unknown;
        try {
            parsed = await request.json();
        } catch {
            return NextResponse.json({ success: false, error: 'JSON malformado.' }, { status: 400 });
        }
        const validation = validateBody(parsed);
        if (!validation.ok) {
            return NextResponse.json({ success: false, error: validation.error }, { status: validation.status });
        }
        const body = validation.body;
        const lookup = await lookupProviderPhone(body.providerId);
        const ping = buildPing(lookup.phone, body);
        const dispatchedAt = new Date().toISOString();

        fireAndForgetN8n('call-center-intake', {
            source: 'notify-provider',
            kind: 'provider_ping',
            requestId: body.requestId,
            providerId: body.providerId,
            providerName: body.providerName,
            providerPhoneVerified: lookup.verified,
            clientName: body.clientName,
            clientPhone: body.clientPhone,
            eventDate: body.eventDate,
            budget: body.budget,
            location: body.location,
            pingChars: ping.text.length,
            missingCount: ping.missing.length,
            respondBefore: ping.respondBefore,
            whatsappUrl: ping.whatsappUrl,
            dispatchedAt
        });

        return NextResponse.json(
            {
                success: true,
                requestId: body.requestId,
                whatsappUrl: ping.whatsappUrl,
                briefText: ping.text,
                missing: ping.missing,
                respondBefore: ping.respondBefore,
                dispatchedAt
            },
            { status: 200 }
        );
    } catch (reason) {
        console.error('[notify-provider] Error interno:', reason instanceof Error ? reason.message : String(reason));
        return NextResponse.json({ success: false, error: 'Error interno al notificar al proveedor.' }, { status: 500 });
    }
}

