'use client';

// ============================================================================
// Ω-ADMIN · PESTAÑA FLOTA — ALTA DE UNIDADES Y ESTADO OPERATIVO (W41_T14)
// ----------------------------------------------------------------------------
// Contratos tomados de la ruta real (src/app/api/admin/fleet/route.ts), no
// inventados:
//   GET   -> { ok: true, data: FleetRow[], total }
//            orderBy updatedAt desc · positions: orderBy timestamp desc, take 1
//            (=> positions[0] es SIEMPRE la lectura GPS más reciente)
//   POST  body .strict(): { unitCode* (2..40), code? (2..40), status?='IDLE',
//           currentLocation? (<=160) } + refine: EN_ROUTE y ON_SITE exigen
//           currentLocation declarada
//           -> 201 { ok, data } · 409 «Identificador de unidad ya registrado»
//            · 400 VALIDATION · 401 sin Bearer
//   PATCH body .strict(): { id*, status?, currentLocation? }
//           -> 200 { ok, data } · 404 «Unidad de flota no encontrada» · 400
//
// HUECO CERRADO EN CLIENTE (reto_espejo, verificado en el route):
//   El `.refine()` de `currentLocation` vive SÓLO en `CreateBodySchema`. El
//   `FleetPatchSchema` acepta `status='EN_ROUTE'` sin ubicación, así que un
//   PATCH descuidado dejaría una unidad «en ruta» sin sitio declarado: un dato
//   falso pintado como real en el panel. Este tab se niega a enviar ese PATCH y
//   exige la ubicación real al operador (campo Ubicación) antes de escribir.
//   Nunca se rellena un lugar inventado.
//
// DOCTRINA DEL DATO VERIFICADO (cero fachadas):
//   · Sin lectura GPS se pinta «—», jamás «0.0000, 0.0000».
//   · `unitCode` se muestra tal cual lo devuelve el servidor (que ya lo canoniza
//     a MAYÚSCULAS); el panel no lo reescribe ni lo «arregla» en cliente.
//   · Toda escritura pasa por `useAdminResource` -> `adminFetch` (Bearer + sobre
//     Ω). Después de escribir se RECARGA del servidor: cero estado optimista,
//     cero «ya está guardado» sin evidencia.
// ============================================================================

import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactElement } from 'react';
import Link from 'next/link';
import {
    AlertTriangle,
    CheckCircle2,
    Loader2,
    MapPin,
    Plus,
    RefreshCw,
    Truck,
} from 'lucide-react';
import type { AdminApiError } from '@/lib/admin/adminTypes';
import { useAdminResource } from '../useAdminResource';

/* ── Contratos de fila (espejo exacto de GET /api/admin/fleet) ────────────── */

/** Proyección de `FleetPosition` que devuelve la ruta (take: 1, la más nueva). */
export type FleetPositionRow = {
    latitude?: number | null;
    longitude?: number | null;
    speed?: number | null;
    heading?: number | null;
    timestamp?: string | null;
};

/** Unidad de flota tal cual llega por el sobre Ω (`Date` serializado a ISO). */
export type FleetRow = {
    id: string;
    unitCode?: string | null;
    code?: string | null;
    status?: string | null;
    currentLocation?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    positions?: readonly FleetPositionRow[] | null;
};

/* ── Enums reales (espejo del zod de la ruta y de Prisma) ─────────────────── */

export const FLEET_STATUSES = ['IDLE', 'EN_ROUTE', 'ON_SITE', 'MAINTENANCE'] as const;

export type FleetStatus = (typeof FLEET_STATUSES)[number];

/** Etiquetas humanas: el valor enviado sigue siendo el enum, nunca el texto. */
const STATUS_LABELS: Readonly<Record<FleetStatus, string>> = {
    IDLE: 'Disponible',
    EN_ROUTE: 'En ruta',
    ON_SITE: 'En sitio',
    MAINTENANCE: 'Mantenimiento',
};

/**
 * Mismos estados que `LOCATION_REQUIRED_STATUSES` de la ruta: sin ubicación
 * declarada no se puede estar «en ruta» ni «en sitio».
 */
const LOCATION_REQUIRED_STATUSES: readonly FleetStatus[] = ['EN_ROUTE', 'ON_SITE'];

const LIST_PATH = '/api/admin/fleet';
const LOGIN_HREF = '/login?from=/admin/control';

/** Longitudes espejo del route: POST y PATCH comparten estos contratos. */
const UNIT_CODE_MIN = 2;
const UNIT_CODE_MAX = 40;
const LOCATION_MAX = 160;

type Notice = {
    kind: 'ok' | 'error';
    text: string;
    details: readonly string[];
};

/** Acción de escritura en vuelo: se resuelve cuando `busy` vuelve a false. */
type PendingAction = {
    actionLabel: string;
    successText: string;
    clearsForm: boolean;
};

type FormValues = {
    unitCode: string;
    code: string;
    status: string;
    currentLocation: string;
};

const EMPTY_FORM: FormValues = {
    unitCode: '',
    code: '',
    status: 'IDLE',
    currentLocation: '',
};

/* ── Helpers puros ───────────────────────────────────────────────────────── */

function isFleetStatus(value: string): value is FleetStatus {
    return (FLEET_STATUSES as readonly string[]).includes(value);
}

function statusLabel(value?: string | null): string {
    if (typeof value !== 'string' || value.length === 0) return '—';
    return isFleetStatus(value) ? STATUS_LABELS[value] : value;
}

/** Estado del servidor como enum tipado, o null si el backend sirve otra cosa. */
function statusOf(row: FleetRow): FleetStatus | null {
    const value = row.status;
    if (typeof value !== 'string') return null;
    return isFleetStatus(value) ? value : null;
}

function requiresLocation(status: FleetStatus): boolean {
    return LOCATION_REQUIRED_STATUSES.includes(status);
}

/** Etiqueta de fila: `unitCode` manda, luego `code`; el id recortado es el último recurso. */
function labelOf(row: FleetRow): string {
    const unitCode = row.unitCode?.trim();
    if (unitCode !== undefined && unitCode.length > 0) return unitCode;

    const code = row.code?.trim();
    if (code !== undefined && code.length > 0) return code;

    return row.id.slice(0, 8);
}

/** Fecha corta es-ES; un valor inválido se declara con un guion, no con «Invalid Date». */
function formatDate(value?: string | null): string {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleDateString('es-ES');
}

/** Fecha + hora es-ES: la frescura del GPS sólo se entiende con la hora. */
function formatDateTime(value?: string | null): string {
    if (!value) return '—';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

/**
 * Lectura GPS de una unidad.
 * Devuelve `null` cuando NO existe posición o sus coordenadas no son números
 * finitos: en ese caso la tabla pinta «—». Prohibido rellenar con 0.0000.
 */
function readPosition(
    row: FleetRow,
): { coordinates: string; timestamp: string; speed: string } | null {
    const position = row.positions?.[0];
    if (position === undefined || position === null) return null;

    const latitude = position.latitude;
    const longitude = position.longitude;
    if (
        typeof latitude !== 'number' ||
        typeof longitude !== 'number' ||
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
    ) {
        return null;
    }

    const speed =
        typeof position.speed === 'number' && Number.isFinite(position.speed)
            ? `${position.speed.toFixed(1)} km/h`
            : '—';

    return {
        coordinates: `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
        timestamp: formatDateTime(position.timestamp),
        speed,
    };
}

/** Filtro de cliente alimentado por el buscador global del shell. */
function matchesQuery(row: FleetRow, query: string): boolean {
    const needle = query.trim().toLowerCase();
    if (needle.length === 0) return true;
    return [row.unitCode, row.code, row.status, row.currentLocation]
        .filter((value): value is string => typeof value === 'string')
        .some((value) => value.toLowerCase().includes(needle));
}

/** Traduce el fallo normalizado del cliente Ω a texto accionable (nada inventado). */
function describeError(error: AdminApiError): { text: string; details: readonly string[] } {
    if (error.code === 'UNAUTHORIZED') {
        return {
            text: 'Sesión caducada: el panel no puede escribir sin token.',
            details: [error.message],
        };
    }
    if (error.code === 'CONFLICT') {
        return {
            text: 'El identificador de unidad ya está registrado (unitCode o code).',
            details: [error.message],
        };
    }
    if (error.code === 'VALIDATION') {
        const issues = error.issues ?? [];
        return {
            text: 'El servidor rechazó los datos enviados.',
            details: issues.length > 0 ? issues : [error.message],
        };
    }
    if (error.code === 'NOT_FOUND') {
        return {
            text: 'La unidad ya no existe: refresca antes de reintentar.',
            details: [error.message],
        };
    }
    if (error.code === 'CONFIG') {
        return { text: 'Firebase no está configurado en este entorno.', details: [error.message] };
    }
    if (error.status === 0) {
        return { text: 'Sin respuesta del servidor (red caída).', details: [error.message] };
    }
    return { text: `${error.message} (HTTP ${error.status})`, details: [] };
}

/** Cadena vacía => undefined: el `.strict()` del servidor no recibe claves inútiles. */
function toOptional(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
}

/**
 * Validación previa al POST: reproduce en cliente el `.strict()` + `.refine()`
 * de `CreateBodySchema` para no gastar un viaje ni ensuciar la tabla con un 400.
 * Última línea: `requiresLocation` es el MISMO invariante que exige la ruta.
 */
function validateForm(values: FormValues): string | null {
    const unitCode = values.unitCode.trim();
    if (unitCode.length === 0) return 'El identificador de unidad (unitCode) es obligatorio.';
    if (unitCode.length < UNIT_CODE_MIN) {
        return `El identificador de unidad requiere al menos ${UNIT_CODE_MIN} caracteres.`;
    }
    if (unitCode.length > UNIT_CODE_MAX) {
        return `El identificador de unidad no puede superar ${UNIT_CODE_MAX} caracteres.`;
    }

    const code = values.code.trim();
    if (code.length > 0 && code.length < UNIT_CODE_MIN) {
        return `El código interno requiere al menos ${UNIT_CODE_MIN} caracteres.`;
    }
    if (code.length > UNIT_CODE_MAX) {
        return `El código interno no puede superar ${UNIT_CODE_MAX} caracteres.`;
    }

    const status = values.status;
    if (!isFleetStatus(status)) return 'Selecciona un estado operativo del catálogo.';

    const location = values.currentLocation.trim();
    if (location.length > LOCATION_MAX) {
        return `La ubicación no puede superar ${LOCATION_MAX} caracteres.`;
    }
    if (requiresLocation(status) && location.length === 0) {
        return `El estado «${STATUS_LABELS[status]}» exige declarar la ubicación: el servidor rechaza una unidad en ruta o en sitio sin sitio declarado.`;
    }

    return null;
}

/* ── Controles de fila ───────────────────────────────────────────────────── */

function StatusPill({ value }: { value?: string | null }): ReactElement {
    const tone =
        value === 'IDLE'
            ? 'border-[#00E5FF]/30 bg-[#00E5FF]/10 text-[#00E5FF]'
            : value === 'EN_ROUTE'
              ? 'border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613]'
              : value === 'ON_SITE'
                ? 'border-white/25 bg-white/10 text-white'
                : value === 'MAINTENANCE'
                  ? 'border-[#FF2B44]/30 bg-[#FF2B44]/10 text-[#FF2B44]'
                  : 'border-white/15 bg-white/5 text-white/60';

    return (
        <span
            title={statusLabel(value)}
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${tone}`}
        >
            {typeof value === 'string' && value.length > 0 ? value : '—'}
        </span>
    );
}

/**
 * Estado operativo editable por fila. El `<select>` se controla con el valor del
 * SERVIDOR: si la escritura falla, el control vuelve solo a la verdad persistida
 * (nunca se queda pintando un estado que no llegó a guardarse).
 */
function StatusControl({
    row,
    disabled,
    onCommit,
}: {
    row: FleetRow;
    disabled: boolean;
    onCommit: (raw: string) => void;
}): ReactElement {
    const inputId = `flota-status-${row.id}`;
    const label = labelOf(row);
    const persisted = statusOf(row);
    const value = persisted ?? '';

    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={inputId} className="sr-only">
                Estado operativo de la unidad {label}
            </label>
            <select
                id={inputId}
                value={value}
                disabled={disabled}
                onChange={(event) => onCommit(event.target.value)}
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
            >
                {value.length === 0 ? <option value="">— estado no homologado</option> : null}
                {FLEET_STATUSES.map((status) => (
                    <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                    </option>
                ))}
            </select>
            <StatusPill value={row.status} />
        </div>
    );
}

/* ── Pestaña ─────────────────────────────────────────────────────────────── */

/**
 * Pestaña Flota del panel de control.
 *
 * `query` es opcional a propósito: el shell pasa el buscador global, pero el tab
 * se monta igual sin props (misma firma que el scaffold) y filtra en cliente sin
 * golpear la API.
 */
export function FlotaTab({ query = '' }: { query?: string }): ReactElement {
    const { status, rows, total, error, busy, create, patch, reload } =
        useAdminResource<FleetRow>(LIST_PATH);

    const [form, setForm] = useState<FormValues>(EMPTY_FORM);
    const [formError, setFormError] = useState<string | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);
    /** Borrador de ubicación por fila: sólo se envía si el operador pulsa Guardar. */
    const [drafts, setDrafts] = useState<Readonly<Record<string, string>>>({});

    const pendingRef = useRef<PendingAction | null>(null);
    const wasBusyRef = useRef(false);

    // Resultado de la última escritura: cuando `busy` vuelve a false, el hook ya
    // consolidó `error` en el mismo render; aquí se decide éxito o fracaso real.
    useEffect(() => {
        if (busy) {
            wasBusyRef.current = true;
            return;
        }
        if (!wasBusyRef.current) return;
        wasBusyRef.current = false;

        const pending = pendingRef.current;
        pendingRef.current = null;
        if (pending === null) return;

        if (error === null) {
            setNotice({ kind: 'ok', text: pending.successText, details: [] });
            if (pending.clearsForm) {
                setForm(EMPTY_FORM);
                setFormError(null);
            }
            return;
        }

        const described = describeError(error);
        // `mutate` sólo deja `error` no nulo tras una escritura fallida o tras una
        // recarga fallida. Si el listado quedó en 'error', la escritura PUDO
        // guardarse: se avisa para no duplicar la unidad al reintentar.
        const reloadFailed = status === 'error';
        setNotice({
            kind: 'error',
            text: `${pending.actionLabel}: ${described.text}`,
            details: reloadFailed
                ? [
                      ...described.details,
                      'La escritura pudo guardarse y fallar la recarga: pulsa Refrescar y comprueba la fila antes de reintentar para no duplicar la unidad.',
                  ]
                : described.details,
        });
    }, [busy, error, status]);

    const setField = (key: keyof FormValues, value: string): void => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const setDraft = (id: string, value: string): void => {
        setDrafts((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();

        const validation = validateForm(form);
        if (validation !== null) {
            setFormError(validation);
            return;
        }

        const statusValue = form.status;
        if (!isFleetStatus(statusValue)) {
            setFormError('Selecciona un estado operativo del catálogo.');
            return;
        }

        setFormError(null);
        setNotice(null);

        const unitCode = form.unitCode.trim();
        pendingRef.current = {
            actionLabel: 'Alta de unidad',
            successText: `Unidad «${unitCode}» creada en estado ${STATUS_LABELS[statusValue]}.`,
            clearsForm: true,
        };

        // Payload EXACTO del CreateBodySchema (.strict()): ni una clave de más.
        // `code` y `currentLocation` viajan ausentes si están vacíos.
        await create({
            unitCode,
            code: toOptional(form.code),
            status: statusValue,
            currentLocation: toOptional(form.currentLocation),
        });
    };

    const commitStatus = async (row: FleetRow, raw: string): Promise<void> => {
        const label = labelOf(row);

        if (!isFleetStatus(raw)) {
            setNotice({
                kind: 'error',
                text: `Estado de «${label}»: «${raw}» no pertenece al enum de flota.`,
                details: [
                    'El servidor sólo acepta IDLE, EN_ROUTE, ON_SITE o MAINTENANCE; no se ha enviado ninguna escritura.',
                ],
            });
            return;
        }

        if (raw === statusOf(row)) {
            // Sin cambio real: no se gasta un PATCH que ensuciaría `updatedAt`.
            setNotice({
                kind: 'ok',
                text: `«${label}» ya está en ${STATUS_LABELS[raw]}: no se ha enviado ninguna escritura.`,
                details: [],
            });
            return;
        }

        // Invariante que la ruta SÓLO aplica al crear: sin ubicación declarada no
        // se escribe EN_ROUTE / ON_SITE. Se pide el dato real, no se inventa.
        const declaredLocation = (row.currentLocation ?? '').trim();
        if (requiresLocation(raw) && declaredLocation.length === 0) {
            setNotice({
                kind: 'error',
                text: `«${label}» no puede pasar a ${STATUS_LABELS[raw]} sin ubicación declarada.`,
                details: [
                    'Escribe la ubicación real en la columna Ubicación y pulsa Guardar; después repite el cambio de estado.',
                    'El servidor aceptaría el PATCH sin ubicación, pero dejaría una unidad en ruta o en sitio sin sitio declarado: un dato falso pintado como real.',
                ],
            });
            return;
        }

        setNotice(null);
        pendingRef.current = {
            actionLabel: `Estado de «${label}»`,
            successText: `«${label}» pasa a ${STATUS_LABELS[raw]}.`,
            clearsForm: false,
        };
        await patch({ id: row.id, status: raw });
    };

    const commitLocation = async (row: FleetRow): Promise<void> => {
        const label = labelOf(row);
        const draft = (drafts[row.id] ?? row.currentLocation ?? '').trim();

        if (draft.length === 0) {
            setNotice({
                kind: 'error',
                text: `Ubicación de «${label}»: no puede quedar vacía.`,
                details: [
                    'El servidor rechaza un `currentLocation` vacío en PATCH. No se ha enviado ninguna escritura.',
                ],
            });
            return;
        }

        if (draft.length > LOCATION_MAX) {
            setNotice({
                kind: 'error',
                text: `Ubicación de «${label}»: supera ${LOCATION_MAX} caracteres.`,
                details: ['No se ha enviado ninguna escritura.'],
            });
            return;
        }

        if (draft === (row.currentLocation ?? '').trim()) {
            setNotice({
                kind: 'ok',
                text: `«${label}» ya declara esa ubicación: no se ha enviado ninguna escritura.`,
                details: [],
            });
            return;
        }

        setNotice(null);
        pendingRef.current = {
            actionLabel: `Ubicación de «${label}»`,
            successText: `«${label}» declara la ubicación «${draft}».`,
            clearsForm: false,
        };
        await patch({ id: row.id, currentLocation: draft });
    };

    const visible = rows.filter((row) => matchesQuery(row, query));
    const loading = status === 'idle' || status === 'loading';
    const loadError = status === 'error' ? error : null;
    const sessionExpired = error?.code === 'UNAUTHORIZED';
    const inRouteCount = visible.filter((row) => statusOf(row) === 'EN_ROUTE').length;
    const onSiteCount = visible.filter((row) => statusOf(row) === 'ON_SITE').length;
    const withoutGpsCount = visible.filter((row) => readPosition(row) === null).length;

    return (
        <section
            className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-6 backdrop-blur-md"
            aria-busy={busy}
        >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">Flota operativa</h2>
                    <span className="rounded-full border border-[#ecb613]/30 bg-[#ecb613]/15 px-2.5 py-0.5 text-xs text-[#ecb613]">
                        {loadError !== null ? '—' : total}
                    </span>
                    {status === 'success' && visible.length !== rows.length ? (
                        <span className="text-xs text-white/40">{visible.length} filtrados</span>
                    ) : null}
                    {status === 'success' && visible.length > 0 ? (
                        <span className="text-xs text-white/40">
                            {inRouteCount} en ruta · {onSiteCount} en sitio
                            {withoutGpsCount > 0 ? ` · ${withoutGpsCount} sin GPS` : ''}
                        </span>
                    ) : null}
                    {busy ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/50">
                            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                            guardando…
                        </span>
                    ) : null}
                </div>
                <button
                    type="button"
                    onClick={() => void reload()}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all duration-300 ease-out hover:border-[#ecb613]/40 hover:text-[#ecb613] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                    Refrescar
                </button>
            </div>

            <p className="mb-5 flex items-start gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] leading-relaxed text-white/50">
                <Truck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#00E5FF]" aria-hidden="true" />
                El servidor canoniza el identificador a MAYÚSCULAS y rechaza duplicados con un 409. Los
                estados EN RUTA y EN SITIO exigen ubicación declarada: sin ella no se escribe el cambio.
                Si una unidad no tiene lectura GPS se muestra «—»: el panel nunca inventa coordenadas.
            </p>

            {sessionExpired ? (
                <div
                    role="alert"
                    className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 px-4 py-3 text-sm text-[#FF2B44]"
                >
                    <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="flex-1">
                        Sesión caducada: sin token no se puede leer ni escribir la flota.
                    </span>
                    <Link
                        href={LOGIN_HREF}
                        className="rounded-full border border-[#FF2B44]/50 px-3 py-1 text-xs font-semibold text-[#FF2B44] transition-all duration-300 ease-out hover:bg-[#FF2B44]/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF2B44]"
                    >
                        Volver a entrar
                    </Link>
                </div>
            ) : null}

            {loadError !== null ? (
                <div
                    role="alert"
                    className="mb-5 rounded-2xl border border-[#FF2B44]/40 bg-[#FF2B44]/10 px-4 py-3 text-sm text-[#FF2B44]"
                >
                    <p className="flex items-center gap-2 font-semibold">
                        <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        No se pudo leer la flota: {describeError(loadError).text}
                    </p>
                    <ul className="mt-1 space-y-0.5 text-xs text-[#FF2B44]/80">
                        {describeError(loadError).details.map((detail) => (
                            <li key={detail}>{detail}</li>
                        ))}
                    </ul>
                    <p className="mt-1 text-xs text-white/40">
                        La tabla se deja vacía a propósito: no se pinta un 0 que parezca «sin flota».
                    </p>
                </div>
            ) : null}

            <div aria-live="polite" className="mb-5">
                {notice !== null ? (
                    <div
                        role={notice.kind === 'error' ? 'alert' : 'status'}
                        className={`rounded-2xl border px-4 py-3 text-sm ${
                            notice.kind === 'error'
                                ? 'border-[#FF2B44]/40 bg-[#FF2B44]/10 text-[#FF2B44]'
                                : 'border-[#00E5FF]/40 bg-[#00E5FF]/10 text-[#00E5FF]'
                        }`}
                    >
                        <p className="flex items-center gap-2 font-semibold">
                            {notice.kind === 'error' ? (
                                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            ) : (
                                <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                            )}
                            {notice.text}
                        </p>
                        {notice.details.length > 0 ? (
                            <ul
                                className={`mt-1 space-y-0.5 text-xs ${
                                    notice.kind === 'error' ? 'text-[#FF2B44]/80' : 'text-[#00E5FF]/80'
                                }`}
                            >
                                {notice.details.map((detail) => (
                                    <li key={detail}>{detail}</li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                ) : null}
            </div>

            {/* Alta de unidad con el payload exacto del CreateBodySchema */}
            <form
                onSubmit={(event) => void handleSubmit(event)}
                aria-busy={busy}
                className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
                <fieldset disabled={busy} className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                        Alta de unidad
                    </legend>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="flota-unit-code" className="text-[11px] text-white/60">
                            Identificador (unitCode) *
                        </label>
                        <input
                            id="flota-unit-code"
                            name="unitCode"
                            type="text"
                            required
                            minLength={UNIT_CODE_MIN}
                            maxLength={UNIT_CODE_MAX}
                            value={form.unitCode}
                            onChange={(event) => setField('unitCode', event.target.value)}
                            placeholder="FLT-01"
                            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white placeholder:text-white/30 transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="flota-code" className="text-[11px] text-white/60">
                            Código interno (opcional)
                        </label>
                        <input
                            id="flota-code"
                            name="code"
                            type="text"
                            minLength={UNIT_CODE_MIN}
                            maxLength={UNIT_CODE_MAX}
                            value={form.code}
                            onChange={(event) => setField('code', event.target.value)}
                            placeholder="ACTA-2026"
                            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white placeholder:text-white/30 transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none"
                        />
                    </div>

                    {/* estado, ubicación y envío */}

                    <div className="flex flex-col gap-1">
                        <label htmlFor="flota-status-new" className="text-[11px] text-white/60">
                            Estado inicial
                        </label>
                        <select
                            id="flota-status-new"
                            name="status"
                            value={form.status}
                            onChange={(event) => setField('status', event.target.value)}
                            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none"
                        >
                            {FLEET_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                    {STATUS_LABELS[status]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label htmlFor="flota-location-new" className="text-[11px] text-white/60">
                            Ubicación {form.status === 'EN_ROUTE' || form.status === 'ON_SITE' ? '*' : '(opcional)'}
                        </label>
                        <input
                            id="flota-location-new"
                            name="currentLocation"
                            type="text"
                            maxLength={LOCATION_MAX}
                            value={form.currentLocation}
                            onChange={(event) => setField('currentLocation', event.target.value)}
                            placeholder="Méntrida, Toledo"
                            aria-describedby="flota-location-hint"
                            className="rounded-lg border border-white/10 bg-black/40 px-2 py-1.5 text-xs text-white placeholder:text-white/30 transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none"
                        />
                        <span id="flota-location-hint" className="text-[10px] text-white/30">
                            Obligatoria si el estado es En ruta o En sitio.
                        </span>
                    </div>

                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#ecb613]/50 bg-[#ecb613]/15 px-4 py-2 text-sm font-semibold text-[#ecb613] transition-all duration-300 ease-out hover:bg-[#ecb613]/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ecb613] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Dar de alta
                        </button>
                    </div>
                </fieldset>

                {formError !== null ? (
                    <p role="alert" className="mt-3 flex items-center gap-2 text-xs text-[#FF2B44]">
                        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        {formError}
                    </p>
                ) : null}
            </form>

            {/* tabla de unidades */}

            {loading ? (
                <p className="flex items-center gap-2 text-sm text-white/50" role="status">
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Consultando la flota real…
                </p>
            ) : visible.length === 0 ? (
                <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-white/50">
                    {loadError !== null
                        ? 'Sin datos: la lectura falló (ver aviso superior).'
                        : rows.length === 0
                          ? 'Sin unidades registradas: da de alta la primera con el formulario de arriba.'
                          : 'Ninguna unidad coincide con la búsqueda.'}
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <caption className="sr-only">
                            Unidades de flota con estado operativo, ubicación declarada y última lectura GPS
                        </caption>
                        <thead>
                            <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-white/40">
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Unidad
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Estado
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Ubicación
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    GPS
                                </th>
                                <th scope="col" className="px-3 py-2 font-medium">
                                    Actualizado
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((row) => {
                                const label = labelOf(row);
                                const position = readPosition(row);
                                const draftValue = drafts[row.id] ?? row.currentLocation ?? '';

                                return (
                                    <tr
                                        key={row.id}
                                        className="border-b border-white/5 align-top transition-all duration-300 ease-out hover:bg-white/[0.02]"
                                    >
                                        <td className="px-3 py-2">
                                            <span className="block font-mono text-xs text-white">{label}</span>
                                            <span className="block text-[11px] text-white/40">
                                                {row.code !== null && row.code !== undefined && row.code.length > 0
                                                    ? `code ${row.code}`
                                                    : 'sin código interno'}
                                            </span>
                                        </td>
                                        <td className="px-3 py-2">
                                            <StatusControl
                                                row={row}
                                                disabled={busy}
                                                onCommit={(raw) => void commitStatus(row, raw)}
                                            />
                                        </td>
                                        {/* ubicación declarada y GPS */}

                                        <td className="px-3 py-2">
                                            <div className="flex flex-col gap-1">
                                                <label
                                                    htmlFor={`flota-location-${row.id}`}
                                                    className="sr-only"
                                                >
                                                    Ubicación declarada de la unidad {label}
                                                </label>
                                                <div className="flex items-center gap-1">
                                                    <input
                                                        id={`flota-location-${row.id}`}
                                                        type="text"
                                                        maxLength={LOCATION_MAX}
                                                        value={draftValue}
                                                        disabled={busy}
                                                        onChange={(event) => setDraft(row.id, event.target.value)}
                                                        placeholder="sin declarar"
                                                        className="w-40 rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-white placeholder:text-white/30 transition-all duration-300 ease-out focus:border-[#ecb613]/60 focus:outline-none disabled:cursor-not-allowed disabled:opacity-40"
                                                    />
                                                    <button
                                                        type="button"
                                                        disabled={busy}
                                                        aria-label={`Guardar la ubicación de la unidad ${label}`}
                                                        onClick={() => void commitLocation(row)}
                                                        className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[11px] text-white/70 transition-all duration-300 ease-out hover:border-[#00E5FF]/40 hover:text-[#00E5FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00E5FF] disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        Guardar
                                                    </button>
                                                </div>
                                                <span className="text-[10px] text-white/30">
                                                    {typeof row.currentLocation === 'string' &&
                                                    row.currentLocation.trim().length > 0
                                                        ? 'Persistida en el servidor'
                                                        : 'Sin ubicación en el servidor'}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-3 py-2">
                                            {position === null ? (
                                                <span
                                                    className="text-xs text-white/40"
                                                    title="Sin lectura GPS registrada para esta unidad"
                                                >
                                                    —
                                                </span>
                                            ) : (
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="flex items-center gap-1 font-mono text-xs text-white/70">
                                                        <MapPin
                                                            className="h-3 w-3 shrink-0 text-[#00E5FF]"
                                                            aria-hidden="true"
                                                        />
                                                        {position.coordinates}
                                                    </span>
                                                    <span className="text-[10px] text-white/40">
                                                        {position.timestamp}
                                                    </span>
                                                    <span className="text-[10px] text-white/40">
                                                        {position.speed}
                                                    </span>
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-3 py-2 text-xs text-white/50">
                                            {formatDate(row.updatedAt)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}










