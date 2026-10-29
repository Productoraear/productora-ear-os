// ============================================================================
// Ω-ADMIN · CLIENTE DE RED ÚNICO DEL PANEL (W41_T01)
// ----------------------------------------------------------------------------
// Motivo forense: ningún componente del panel enviaba `Authorization`, por eso
// /api/admin/* respondía 401 y las pestañas mostraban 0 (fachada silenciosa).
// Todo fetch de administración pasa por aquí; prohibido `fetch` directo en
// módulos admin.
//
// Sin 'use client' a propósito: es un módulo puro (cliente-agnóstico) que se
// importa desde hooks y componentes cliente. La sesión Firebase solo existe en
// navegador, y `getAdminIdToken` lo declara de forma explícita.
// ============================================================================

import type { Auth, User } from 'firebase/auth';
import { auth as firebaseAuth } from '@/lib/firebase';
import type {
    AdminApiError,
    AdminErrorCode,
    AdminFetchInit,
    AdminListResponse,
} from './adminTypes';

/** Mapa status HTTP -> código canónico. Los no listados caen en SERVER. */
const STATUS_CODE_MAP: Readonly<Record<number, AdminErrorCode>> = {
    400: 'VALIDATION',
    401: 'UNAUTHORIZED',
    403: 'FORBIDDEN',
    404: 'NOT_FOUND',
    409: 'CONFLICT',
    422: 'VALIDATION',
};

/** Sobre interno ya validado: `data` desenvuelto + metadatos de paginación. */
type AdminEnvelope<T> = { data: T; total?: number; status: number };

// ---------------------------------------------------------------------------
// Error tipado
// ---------------------------------------------------------------------------

/**
 * Error de red del panel. Sustituye al `Error` genérico para que la UI pueda
 * distinguir 401 (sesión) de 403 (rol) de 500 (servidor) sin parsear strings.
 */
export class AdminHttpError extends Error {
    readonly status: number;
    readonly code: AdminErrorCode;
    readonly issues: readonly string[];

    constructor(error: AdminApiError) {
        super(error.message);
        this.name = 'AdminHttpError';
        this.status = error.status;
        this.code = error.code;
        this.issues = error.issues ?? [];
        // Preserva `instanceof` si el bundle transpila a un target antiguo.
        Object.setPrototypeOf(this, AdminHttpError.prototype);
    }

    /** Forma serializable del error para telemetría, sin arrastrar el stack. */
    toAdminApiError(): AdminApiError {
        return this.issues.length > 0
            ? { status: this.status, code: this.code, message: this.message, issues: this.issues }
            : { status: this.status, code: this.code, message: this.message };
    }
}

/** Type guard: obligatorio para no castear `unknown` en los catch de la UI. */
export function isAdminHttpError(error: unknown): error is AdminHttpError {
    return error instanceof AdminHttpError;
}


// ---------------------------------------------------------------------------
// Utilidades internas (sin any, sin dependencias)
// ---------------------------------------------------------------------------

function codeFromStatus(status: number): AdminErrorCode {
    const mapped = STATUS_CODE_MAP[status];
    return mapped ?? 'SERVER';
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isAbortError(error: unknown): boolean {
    return isRecord(error) && error.name === 'AbortError';
}

/**
 * El Bearer es un ID token de Firebase: enviarlo a cualquier host ajeno sería
 * una fuga de credencial. Solo se aceptan rutas relativas same-origin.
 */
function assertSameOriginPath(path: string): void {
    if (!path.startsWith('/') || path.startsWith('//')) {
        throw new AdminHttpError({
            status: 0,
            code: 'CONFIG',
            message: `adminFetch exige una ruta relativa del mismo origen (recibido: "${path}").`,
        });
    }
}

function parseJsonBody(raw: string): unknown {
    if (raw.trim().length === 0) return undefined;
    try {
        return JSON.parse(raw) as unknown;
    } catch {
        return undefined;
    }
}

/** Extrae el mensaje real de error de las rutas (`{ error: string }`). */
function readErrorMessage(payload: unknown, status: number, statusText: string): string {
    if (isRecord(payload)) {
        const candidate = payload.error ?? payload.message;
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate.trim();
        }
        if (isRecord(candidate)) {
            const nested = candidate.message;
            if (typeof nested === 'string' && nested.trim().length > 0) {
                return nested.trim();
            }
        }
    }
    const fallback = statusText.trim();
    return fallback.length > 0 ? fallback : `HTTP ${status}`;
}
/** Normaliza el detalle por campo que devuelven las rutas con Zod. */
function readIssues(payload: unknown): readonly string[] {
    if (!isRecord(payload) || !Array.isArray(payload.issues)) return [];
    const collected: string[] = [];
    for (const issue of payload.issues) {
        if (typeof issue === 'string') {
            collected.push(issue);
        } else if (isRecord(issue) && typeof issue.message === 'string') {
            collected.push(issue.message);
        }
    }
    return collected;
}





// ---------------------------------------------------------------------------
// Identidad: ID token de Firebase
// ---------------------------------------------------------------------------

/**
 * Devuelve el ID token del usuario autenticado.
 * El SDK refresca de forma transparente un token caducado.
 * @throws AdminHttpError CONFIG si Firebase no está configurado o se invoca en servidor.
 * @throws AdminHttpError UNAUTHORIZED si no hay sesión iniciada.
 */
export async function getAdminIdToken(): Promise<string> {
    if (typeof window === 'undefined') {
        throw new AdminHttpError({
            status: 0,
            code: 'CONFIG',
            message:
                'getAdminIdToken solo es válido en cliente: el panel no tiene sesión Firebase en el servidor.',
        });
    }

    const auth: Auth | null = firebaseAuth;
    if (!auth) {
        throw new AdminHttpError({
            status: 0,
            code: 'CONFIG',
            message: 'Firebase no configurado',
        });
    }

    const user: User | null = auth.currentUser;
    if (!user) {
        throw new AdminHttpError({
            status: 401,
            code: 'UNAUTHORIZED',
            message: 'Sesion no iniciada',
        });
    }

    return user.getIdToken();
}

// ---------------------------------------------------------------------------
// Núcleo de petición
// ---------------------------------------------------------------------------

function buildHeaders(token: string, body: string | undefined): Record<string, string> {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
    };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    return headers;
}

function serializeBody(body: unknown): string | undefined {
    if (body === undefined || body === null) return undefined;
    if (typeof body === 'string') return body;
    return JSON.stringify(body);
}

/**
 * Petición cruda que conserva `total` (necesario para paginar). Valida el sobre
 * `{ ok: true, data }` y traduce cualquier fallo a `AdminHttpError`.
 */
async function adminRequest<T>(
    path: string,
    init: AdminFetchInit = {},
): Promise<AdminEnvelope<T>> {
    assertSameOriginPath(path);

    const token = await getAdminIdToken();
    const method = init.method ?? 'GET';
    const body = serializeBody(init.body);

    let response: Response;
    try {
        response = await fetch(path, {
            method,
            headers: buildHeaders(token, body),
            body,
            cache: 'no-store',
            credentials: 'same-origin',
            signal: init.signal,
        });
    } catch (error) {
        // La cancelación no es un fallo del servidor: se propaga intacta.
        if (isAbortError(error)) throw error;
        throw new AdminHttpError({
            status: 0,
            code: 'SERVER',
            message: `Fallo de red en ${method} ${path}`,
        });
    }

    const raw = await response.text().catch((): string => '');
    const payload = parseJsonBody(raw);

    if (!response.ok) {
        throw new AdminHttpError({
            status: response.status,
            code: codeFromStatus(response.status),
            message: readErrorMessage(payload, response.status, response.statusText),
            issues: readIssues(payload),
        });
    }

    // 204/205 sin cuerpo: éxito legítimo (p. ej. DELETE). No se inventa data.
    if (raw.trim().length === 0 && (response.status === 204 || response.status === 205)) {
        return { data: undefined as unknown as T, status: response.status };
    }

    if (!isRecord(payload) || payload.ok !== true || !('data' in payload)) {
        throw new AdminHttpError({
            status: response.status,
            code: 'SERVER',
            message: `Respuesta no conforme al sobre { ok: true, data } en ${path}`,
        });
    }

    const total = typeof payload.total === 'number' ? payload.total : undefined;
    return { data: payload.data as T, total, status: response.status };
}

// ---------------------------------------------------------------------------
// API pública
// ---------------------------------------------------------------------------

/**
 * Petición admin tipada. Devuelve el `data` desenvuelto del sobre.
 * @throws AdminHttpError en todos los fallos, incluida red caída (status 0).
 */
export async function adminFetch<T>(path: string, init: AdminFetchInit = {}): Promise<T> {
    const envelope = await adminRequest<T>(path, init);
    return envelope.data;
}

/**
 * Listado paginado. Si el backend no devuelve un array real, falla en vez de
 * pintar 0 filas: un vacío falso es exactamente la fachada que se erradica.
 */
export async function adminFetchList<T>(path: string): Promise<AdminListResponse<T>> {
    const envelope = await adminRequest<T[]>(path);

    if (!Array.isArray(envelope.data)) {
        throw new AdminHttpError({
            status: envelope.status,
            code: 'SERVER',
            message: `El listado ${path} no devolvió un array en «data»`,
        });
    }

    return {
        rows: envelope.data,
        total: envelope.total ?? envelope.data.length,
    };
}
