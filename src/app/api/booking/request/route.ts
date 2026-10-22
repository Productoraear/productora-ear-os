import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { fireAndForgetN8n } from '@/lib/services/n8n-dispatcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ─── Tipos ──────────────────────────────────────────────────────────────────────

interface BookingRequest {
    providerId: string;
    providerName: string;
    category: string;
    eventDate: string;
    eventLocation: string;
    guests: number;
    budgetEur: number;
    clientName: string;
    clientPhone: string;
    notes?: string;
}

interface BookingRequestResponse {
    requestId: string;
    status: 'PENDING_PROVIDER';
    acceptWindowHours: number;
    message: string;
}

const ACCEPT_WINDOW_HOURS = 2;
const PHONE_REGEX = /^\+?\d{9,15}$/;

interface ValidationResult {
    valid: boolean;
    errors: string[];
    data: BookingRequest | null;
}

// ─── Validación server-side (anti-XSS OWASP + reglas de negocio) ────────────────

function hasAngleBrackets(value: string): boolean {
    return value.includes('<') || value.includes('>');
}

function isValidIsoFuture(dateStr: string): boolean {
    const ms = Date.parse(dateStr);
    return !Number.isNaN(ms) && ms > Date.now();
}

function validateBookingRequest(raw: unknown): ValidationResult {
    if (typeof raw !== 'object' || raw === null) {
        return { valid: false, errors: ['body'], data: null };
    }

    const body = raw as Record<string, unknown>;
    const errors: string[] = [];

    const readString = (key: string, field: string, required: boolean): string | null => {
        const value = body[key];
        if (value === undefined || value === null) {
            if (required) errors.push(field);
            return null;
        }
        if (typeof value !== 'string') {
            errors.push(field);
            return null;
        }
        const trimmed = value.trim();
        if (required && trimmed.length === 0) {
            errors.push(field);
            return null;
        }
        if (hasAngleBrackets(trimmed)) {
            errors.push(field);
            return null;
        }
        return trimmed;
    };

    const providerId = readString('providerId', 'providerId', true);
    const providerName = readString('providerName', 'providerName', true);
    const category = readString('category', 'category', true);
    const eventDate = readString('eventDate', 'eventDate', true);
    const eventLocation = readString('eventLocation', 'eventLocation', true);
    const clientName = readString('clientName', 'clientName', true);
    const clientPhone = readString('clientPhone', 'clientPhone', true);
    const notes = readString('notes', 'notes', false);

    if (eventDate !== null && !isValidIsoFuture(eventDate)) {
        errors.push('eventDate');
    }

    const guests = body.guests;
    if (typeof guests !== 'number' || !Number.isInteger(guests) || guests < 1 || guests > 5000) {
        errors.push('guests');
    }

    const budgetEur = body.budgetEur;
    if (typeof budgetEur !== 'number' || !Number.isFinite(budgetEur) || budgetEur <= 0) {
        errors.push('budgetEur');
    }

    let normalizedPhone: string | null = null;
    if (clientPhone !== null) {
        const compact = clientPhone.replace(/\s+/g, '');
        if (!PHONE_REGEX.test(compact)) {
            errors.push('clientPhone');
        } else {
            normalizedPhone = compact;
        }
    }

    if (errors.length > 0) {
        return { valid: false, errors: Array.from(new Set(errors)), data: null };
    }

    const data: BookingRequest = {
        providerId: providerId as string,
        providerName: providerName as string,
        category: category as string,
        eventDate: eventDate as string,
        eventLocation: eventLocation as string,
        guests: guests as number,
        budgetEur: budgetEur as number,
        clientName: clientName as string,
        clientPhone: normalizedPhone as string,
        notes: notes && notes.length > 0 ? notes : undefined,
    };

    return { valid: true, errors: [], data };
}

function buildRequestId(providerId: string, eventDate: string, clientPhone: string): string {
    return (
        'REQ-' +
        createHash('sha256').update(providerId + eventDate + clientPhone).digest('hex').slice(0, 12).toUpperCase()
    );
}

// ─── Endpoint: Request-to-Book (sin cobro — el cobro ocurre tras aceptación) ────

export async function POST(req: NextRequest) {
    let raw: unknown;
    try {
        raw = await req.json();
    } catch {
        return NextResponse.json({ error: 'JSON inválido en el cuerpo de la solicitud.' }, { status: 422 });
    }

    const result = validateBookingRequest(raw);

    if (!result.valid || result.data === null) {
        return NextResponse.json(
            { error: 'Campos inválidos.', invalidFields: result.errors },
            { status: 422 }
        );
    }

    const data = result.data;
    const requestId = buildRequestId(data.providerId, data.eventDate, data.clientPhone);

    // Despacho no bloqueante a n8n (call-center-intake). Aquí NO se cobra: el
    // depósito solo se habilita tras la aceptación del proveedor.
    fireAndForgetN8n('call-center-intake', {
        kind: 'request_to_book',
        requestId,
        providerId: data.providerId,
        providerName: data.providerName,
        category: data.category,
        eventDate: data.eventDate,
        eventLocation: data.eventLocation,
        guests: data.guests,
        budgetEur: data.budgetEur,
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        notes: data.notes ?? null,
        acceptWindowHours: ACCEPT_WINDOW_HOURS,
    });

    const response: BookingRequestResponse = {
        requestId,
        status: 'PENDING_PROVIDER',
        acceptWindowHours: ACCEPT_WINDOW_HOURS,
        message: 'Solicitud enviada. El proveedor tiene 2 h para confirmar; solo entonces se habilita el deposito.',
    };

    return NextResponse.json(response, { status: 202 });
}
